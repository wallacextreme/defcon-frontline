import * as THREE from 'three';

export interface PerfSnapshot {
  framesSampled: number;
  fps: number;
  frameTimeMs: {
    p50: number;
    p95: number;
    mean: number;
    min: number;
    max: number;
  };
  render: {
    sceneCalls: number;
    totalCalls: number;
    sceneTriangles: number;
    totalTriangles: number;
    lines: number;
    points: number;
  };
  memory: {
    geometries: number;
    textures: number;
    programs: number;
  };
  pipeline: {
    qualityTier: string;
    aaMode: string;
    composerSamples: number;
    toneMapping: string;
    toneMappingCode: number;
    toneMappingExposure: number;
    iblMode: string;
    envIntensity: number;
    bloomMode: string;
    bloomThreshold: number | null;
    bloomStrength: number | null;
    gtaoEnabled: boolean;
    shadowMapType: number;
    shadowMapSize: string;
  };
  viewport: {
    windowWidth: number;
    windowHeight: number;
    canvasWidth: number;
    canvasHeight: number;
    bufferWidth: number;
    bufferHeight: number;
    windowDpr: number;
    rendererDpr: number;
  };
  stage: {
    worldId: number | null;
    stageId: number | null;
    biome: string | null;
    towersCount: number;
  };
}

export interface PerfOverlayHandle {
  getSnapshot: () => PerfSnapshot;
  reset: () => void;
  setVisible: (visible: boolean) => void;
  dispose: () => void;
}

export interface MountPerfOverlayOptions {
  renderer?: THREE.WebGLRenderer;
  composer?: any;
  scene?: THREE.Scene;
  game?: any;
  visible?: boolean;
}

const FRAME_WINDOW = 120;
const DOM_UPDATE_INTERVAL_MS = 250;

function toneMappingLabel(tm: number): string {
  if (tm === THREE.NoToneMapping) return 'None';
  if (tm === THREE.LinearToneMapping) return 'Linear';
  if (tm === THREE.ReinhardToneMapping) return 'Reinhard';
  if (tm === THREE.CineonToneMapping) return 'Cineon';
  if (tm === THREE.ACESFilmicToneMapping) return 'ACESFilmic';
  if (tm === THREE.AgXToneMapping) return 'AgX';
  if (tm === THREE.NeutralToneMapping) return 'Neutral';
  return `Custom(${tm})`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function mountPerfOverlay(options: MountPerfOverlayOptions = {}): PerfOverlayHandle {
  const existing = (window as any).__DEFCON_PERF__ as PerfOverlayHandle | undefined;
  if (existing && typeof existing.dispose === 'function') {
    existing.dispose();
  }

  // Rolling 120-frame pre-allocated ring buffer (zero per-frame heap allocations)
  const frameDeltas = new Float64Array(FRAME_WINDOW);
  const sortScratch = new Float64Array(FRAME_WINDOW);
  let frameCount = 0;
  let frameCursor = 0;
  let lastRafTs = 0;
  let lastDomUpdateTs = 0;
  let rafId = 0;
  let disposed = false;

  // Live render stats captured via non-intrusive wrapper (composer-safe)
  let sceneCalls = 0;
  let totalCalls = 0;
  let sceneTriangles = 0;
  let totalTriangles = 0;
  let renderLines = 0;
  let renderPoints = 0;

  let hookedRenderer: THREE.WebGLRenderer | null = null;
  let origRendererRender: ((scene: THREE.Object3D, camera: THREE.Camera) => void) | null = null;
  let origAutoReset = true;

  let hookedComposer: any = null;
  let origComposerRender: ((deltaTime?: number) => void) | null = null;
  let inComposerFrame = false;
  let capturedSceneInComposer = false;

  const getGame = (): any => options.game || (window as any).__DEFCON_GAME__ || null;

  const getRenderer = (): THREE.WebGLRenderer | null => {
    if (options.renderer) return options.renderer;
    const g = getGame();
    return g?.renderer || null;
  };

  const getComposer = (): any => {
    if (options.composer) return options.composer;
    const g = getGame();
    return g?.composer || null;
  };

  const getScene = (): THREE.Scene | null => {
    if (options.scene) return options.scene;
    const g = getGame();
    return g?.scene || null;
  };

  const unhookComposer = () => {
    if (hookedComposer && origComposerRender) {
      hookedComposer.render = origComposerRender;
    }
    hookedComposer = null;
    origComposerRender = null;
  };

  const unhookRenderer = () => {
    if (hookedRenderer && origRendererRender) {
      hookedRenderer.render = origRendererRender;
      hookedRenderer.info.autoReset = origAutoReset;
    }
    hookedRenderer = null;
    origRendererRender = null;
  };

  const ensureHooks = () => {
    const renderer = getRenderer();
    if (renderer && renderer !== hookedRenderer) {
      unhookRenderer();
      hookedRenderer = renderer;
      origAutoReset = renderer.info.autoReset;
      renderer.info.autoReset = false;
      const origRender = renderer.render.bind(renderer);
      origRendererRender = renderer.render;

      renderer.render = function wrappedRender(sceneObj: THREE.Object3D, camera: THREE.Camera) {
        const targetScene = getScene();
        const isMainScene = targetScene ? sceneObj === targetScene : true;

        if (!inComposerFrame) {
          renderer.info.reset();
          origRender(sceneObj, camera);
          if (isMainScene) {
            sceneCalls = renderer.info.render.calls;
            sceneTriangles = renderer.info.render.triangles;
            totalCalls = sceneCalls;
            totalTriangles = sceneTriangles;
            renderLines = renderer.info.render.lines;
            renderPoints = renderer.info.render.points;
          }
          return;
        }

        origRender(sceneObj, camera);
        if (!capturedSceneInComposer && isMainScene) {
          capturedSceneInComposer = true;
          sceneCalls = renderer.info.render.calls;
          sceneTriangles = renderer.info.render.triangles;
          renderLines = renderer.info.render.lines;
          renderPoints = renderer.info.render.points;
        }
      };
    }

    const composer = getComposer();
    if (composer && composer !== hookedComposer && typeof composer.render === 'function') {
      unhookComposer();
      hookedComposer = composer;
      const origCompRender = composer.render.bind(composer);
      origComposerRender = composer.render;

      composer.render = function wrappedComposerRender(deltaTime?: number) {
        const r = getRenderer();
        if (r) {
          r.info.reset();
        }
        inComposerFrame = true;
        capturedSceneInComposer = false;
        try {
          origCompRender(deltaTime);
        } finally {
          inComposerFrame = false;
          if (r) {
            totalCalls = r.info.render.calls;
            totalTriangles = r.info.render.triangles;
            if (!capturedSceneInComposer) {
              sceneCalls = totalCalls;
              sceneTriangles = totalTriangles;
              renderLines = r.info.render.lines;
              renderPoints = r.info.render.points;
            }
          }
        }
      };
    }
  };

  // Inline-styled lightweight DOM overlay (zero CSS files touched)
  const rootEl = document.createElement('div');
  rootEl.id = 'defcon-perf-overlay';
  rootEl.style.cssText = [
    'position:fixed',
    'top:58px',
    'left:10px',
    'z-index:99998',
    'min-width:255px',
    'max-width:340px',
    'padding:8px 10px',
    'border-radius:6px',
    'background:rgba(8,13,20,0.86)',
    'border:1px solid rgba(56,189,248,0.42)',
    'box-shadow:0 6px 20px rgba(0,0,0,0.45)',
    'color:#e2e8f0',
    'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
    'font-size:11px',
    'line-height:1.42',
    'pointer-events:none',
    'user-select:none',
    'backdrop-filter:blur(4px)'
  ].join(';');

  const headerEl = document.createElement('div');
  headerEl.style.cssText = [
    'display:flex',
    'align-items:center',
    'justify-content:space-between',
    'gap:8px',
    'padding-bottom:4px',
    'margin-bottom:4px',
    'border-bottom:1px solid rgba(148,163,184,0.22)',
    'color:#38bdf8',
    'font-weight:700',
    'letter-spacing:0.04em'
  ].join(';');

  const titleSpan = document.createElement('span');
  titleSpan.textContent = 'DEFCON PERF [DEV]';
  headerEl.appendChild(titleSpan);

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.textContent = 'RESET';
  resetBtn.style.cssText = [
    'pointer-events:auto',
    'cursor:pointer',
    'background:rgba(56,189,248,0.16)',
    'border:1px solid rgba(56,189,248,0.45)',
    'color:#bae6fd',
    'border-radius:3px',
    'padding:1px 5px',
    'font-family:inherit',
    'font-size:10px',
    'font-weight:600'
  ].join(';');
  headerEl.appendChild(resetBtn);

  const bodyEl = document.createElement('pre');
  bodyEl.style.cssText = 'margin:0;white-space:pre;font-family:inherit;font-size:11px;color:#e2e8f0;';
  bodyEl.textContent = 'Initializing renderer hook...';

  rootEl.appendChild(headerEl);
  rootEl.appendChild(bodyEl);
  if (options.visible === false) {
    rootEl.style.display = 'none';
  }
  document.body.appendChild(rootEl);

  const computeFrameStats = () => {
    const n = frameCount;
    if (n === 0) {
      return { fps: 0, p50: 0, p95: 0, mean: 0, min: 0, max: 0 };
    }
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const v = frameDeltas[i];
      sortScratch[i] = v;
      sum += v;
    }
    const view = sortScratch.subarray(0, n);
    view.sort();
    const mean = sum / n;
    const p50 = view[Math.min(n - 1, Math.floor(n * 0.5))];
    const p95 = view[Math.min(n - 1, Math.floor(n * 0.95))];
    const min = view[0];
    const max = view[n - 1];
    const fps = mean > 0 ? 1000 / mean : 0;
    return {
      fps: round2(fps),
      p50: round2(p50),
      p95: round2(p95),
      mean: round2(mean),
      min: round2(min),
      max: round2(max)
    };
  };

  const inspectPipeline = () => {
    const g = getGame();
    const renderer = getRenderer();
    const composer = getComposer();
    const scene = getScene();

    // Allow future Stage 1C pipeline-engineer telemetry override when present
    const ext = typeof g?.getVisualPipelineInfo === 'function' ? g.getVisualPipelineInfo() : null;
    const urlParams = new URLSearchParams(window.location.search);

    const qualityTier: string =
      ext?.qualityTier ||
      g?.qualityTier ||
      g?.qualityConfig?.tier ||
      urlParams.get('quality') ||
      'legacy';

    const passes: any[] = Array.isArray(composer?.passes) ? composer.passes : [];
    const composerSamples: number = composer?.renderTarget1?.samples ?? 0;
    const hasSmaa = passes.some(
      (p) => p?.enabled !== false && (p?.constructor?.name?.includes('SMAA') || Boolean(p?.materialEdges))
    );
    const hasGtao = passes.some(
      (p) => p?.enabled !== false && (p?.constructor?.name?.includes('GTAO') || Boolean(p?.gtaoMaterial))
    );
    const bloomPass = passes.find(
      (p) => typeof p?.threshold === 'number' && typeof p?.strength === 'number'
    );

    const usesComposer = ext?.useComposer ?? (g?.useComposer ?? Boolean(composer));
    let aaMode: string = ext?.aaMode || '';
    if (!aaMode) {
      if (!usesComposer) {
        aaMode = 'Native MSAA';
      } else if (composerSamples > 0) {
        aaMode = `MSAA ${composerSamples}x`;
      } else if (hasSmaa) {
        aaMode = 'SMAA';
      } else {
        aaMode = 'OFF (samples=0)';
      }
    }

    const tmCode = renderer ? renderer.toneMapping : -1;
    const tmLabel = renderer ? toneMappingLabel(tmCode) : 'N/A';
    const tmExposure = renderer ? round2(renderer.toneMappingExposure) : 0;

    const envIntensity = scene ? round2(scene.environmentIntensity ?? 1) : 0;
    let iblMode: string = ext?.iblMode || '';
    if (!iblMode) {
      if (!scene?.environment) {
        iblMode = 'OFF';
      } else if (g?.biomeEnv) {
        iblMode = g.biomeEnv.iblMode === 'room' ? 'RoomEnv' : 'BiomePMREM';
      } else {
        iblMode = 'RoomEnv';
      }
    }

    let bloomMode: string = ext?.bloomMode || '';
    let bloomThreshold: number | null = null;
    let bloomStrength: number | null = null;
    if (bloomPass && bloomPass.enabled !== false && usesComposer) {
      bloomThreshold = round2(bloomPass.threshold);
      bloomStrength = round2(bloomPass.strength);
      if (!bloomMode) {
        bloomMode = bloomThreshold >= 1.0 ? `HDR(${bloomThreshold})` : `Legacy(${bloomThreshold})`;
      }
    } else if (!bloomMode) {
      bloomMode = 'OFF';
    }

    const sunShadow = g?.sunLight?.shadow?.mapSize;
    const shadowMapSize = sunShadow ? `${sunShadow.width}x${sunShadow.height}` : 'N/A';

    return {
      qualityTier,
      aaMode,
      composerSamples,
      toneMapping: tmLabel,
      toneMappingCode: tmCode,
      toneMappingExposure: tmExposure,
      iblMode,
      envIntensity,
      bloomMode,
      bloomThreshold,
      bloomStrength,
      gtaoEnabled: Boolean(ext?.gtaoEnabled ?? (usesComposer && hasGtao)),
      shadowMapType: renderer ? renderer.shadowMap.type : -1,
      shadowMapSize
    };
  };

  const getSnapshot = (): PerfSnapshot => {
    ensureHooks();
    const g = getGame();
    const renderer = getRenderer();
    const ft = computeFrameStats();
    const pipeline = inspectPipeline();

    // If gameplay already exposed composer-safe render stats, use them if our hook hasn't fired yet
    const gameTelemetry = typeof g?.getRenderTelemetry === 'function' ? g.getRenderTelemetry() : null;
    const sCalls = sceneCalls || gameTelemetry?.sceneCalls || renderer?.info?.render?.calls || 0;
    const tCalls = totalCalls || gameTelemetry?.totalCalls || sCalls;
    const sTris = sceneTriangles || gameTelemetry?.sceneTriangles || renderer?.info?.render?.triangles || 0;
    const tTris = totalTriangles || gameTelemetry?.totalTriangles || sTris;

    const canvas = renderer?.domElement;
    return {
      framesSampled: frameCount,
      fps: ft.fps,
      frameTimeMs: {
        p50: ft.p50,
        p95: ft.p95,
        mean: ft.mean,
        min: ft.min,
        max: ft.max
      },
      render: {
        sceneCalls: sCalls,
        totalCalls: tCalls,
        sceneTriangles: sTris,
        totalTriangles: tTris,
        lines: renderLines || renderer?.info?.render?.lines || 0,
        points: renderPoints || renderer?.info?.render?.points || 0
      },
      memory: {
        geometries: renderer?.info?.memory?.geometries ?? 0,
        textures: renderer?.info?.memory?.textures ?? 0,
        programs: renderer?.info?.programs?.length ?? 0
      },
      pipeline,
      viewport: {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        canvasWidth: canvas ? canvas.clientWidth : 0,
        canvasHeight: canvas ? canvas.clientHeight : 0,
        bufferWidth: canvas ? canvas.width : 0,
        bufferHeight: canvas ? canvas.height : 0,
        windowDpr: round2(window.devicePixelRatio || 1),
        rendererDpr: renderer ? round2(renderer.getPixelRatio()) : 1
      },
      stage: {
        worldId: g?.currentWorldId ?? null,
        stageId: g?.currentStageId ?? null,
        biome: g?.stageConfig?.biome || g?.worldConfig?.biome || null,
        towersCount: Array.isArray(g?.towers) ? g.towers.length : 0
      }
    };
  };

  const reset = () => {
    frameCount = 0;
    frameCursor = 0;
    lastRafTs = 0;
    sceneCalls = 0;
    totalCalls = 0;
    sceneTriangles = 0;
    totalTriangles = 0;
    renderLines = 0;
    renderPoints = 0;
  };

  resetBtn.addEventListener('click', () => {
    reset();
  });

  const renderDom = () => {
    const s = getSnapshot();
    const stageStr = s.stage.worldId && s.stage.stageId
      ? `${s.stage.worldId}-${s.stage.stageId} (${s.stage.biome || '?'}) T:${s.stage.towersCount}`
      : 'N/A';
    const gtaoTag = s.pipeline.gtaoEnabled ? ' +GTAO' : '';
    bodyEl.textContent = [
      `FPS: ${s.fps.toFixed(1).padStart(5)} | p50: ${s.frameTimeMs.p50.toFixed(1)}ms | p95: ${s.frameTimeMs.p95.toFixed(1)}ms`,
      `Calls: ${s.render.sceneCalls} scene / ${s.render.totalCalls} total`,
      `Tris:  ${s.render.sceneTriangles.toLocaleString()} scene / ${s.render.totalTriangles.toLocaleString()} total`,
      `Mem:   Geo ${s.memory.geometries} | Tex ${s.memory.textures} | Prog ${s.memory.programs}`,
      `Tier:  ${s.pipeline.qualityTier.toUpperCase()} | AA: ${s.pipeline.aaMode}${gtaoTag}`,
      `TM:    ${s.pipeline.toneMapping} (exp ${s.pipeline.toneMappingExposure.toFixed(2)})`,
      `IBL:   ${s.pipeline.iblMode} (${s.pipeline.envIntensity.toFixed(2)}) | Bloom: ${s.pipeline.bloomMode}`,
      `View:  ${s.viewport.canvasWidth}x${s.viewport.canvasHeight} (buf ${s.viewport.bufferWidth}x${s.viewport.bufferHeight})`,
      `DPR:   ${s.viewport.rendererDpr.toFixed(2)} (win ${s.viewport.windowDpr.toFixed(2)}) | Stage: ${stageStr}`
    ].join('\n');
  };

  const tick = (now: number) => {
    if (disposed) return;
    rafId = requestAnimationFrame(tick);
    ensureHooks();

    if (lastRafTs > 0) {
      const dt = now - lastRafTs;
      if (dt > 0 && dt < 2000) {
        frameDeltas[frameCursor] = dt;
        frameCursor = (frameCursor + 1) % FRAME_WINDOW;
        if (frameCount < FRAME_WINDOW) frameCount++;
      }
    }
    lastRafTs = now;

    if (now - lastDomUpdateTs >= DOM_UPDATE_INTERVAL_MS) {
      lastDomUpdateTs = now;
      if (rootEl.style.display !== 'none') {
        renderDom();
      }
    }
  };

  ensureHooks();
  rafId = requestAnimationFrame(tick);

  const handle: PerfOverlayHandle = {
    getSnapshot,
    reset,
    setVisible: (visible: boolean) => {
      rootEl.style.display = visible ? 'block' : 'none';
      if (visible) renderDom();
    },
    dispose: () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(rafId);
      unhookComposer();
      unhookRenderer();
      rootEl.remove();
      if ((window as any).__DEFCON_PERF__ === handle) {
        delete (window as any).__DEFCON_PERF__;
      }
    }
  };

  (window as any).__DEFCON_PERF__ = handle;
  return handle;
}
