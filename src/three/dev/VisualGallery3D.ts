import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

import { TOWER_DEFINITIONS, TOWER_BUILD_ORDER } from '../../data/towers.js';
import { WORLDS, getWorldConfig, getStageConfig } from '../../data/worlds.js';
import { Pathfinder } from '../../systems/Pathfinder.js';
import { getPBRTextures } from '../ProceduralPBRTextures.ts';
import { createTowerModel3D, createGhostTower3D } from '../MilitaryModels3D.ts';
import { resolveQualityConfig, getThreeToneMapping } from '../GraphicsQuality.ts';
import { createBiomeEnvironment } from '../BiomeEnvironment3D.ts';
import {
  CELL_WORLD,
  cellToWorldCenter,
  createBattlefieldDiorama3D,
  DioramaHandles,
  WorldBiome
} from '../TerrainDiorama3D.ts';

export type GalleryMode = 'tower' | 'sheet' | 'silhouette' | 'map';
export type GalleryTowerState = 'nv1' | 'nv2-3' | 'nv4+' | '5A' | '6B' | 'ghost';
export type GalleryCameraPreset =
  | 'C1'
  | 'C2'
  | 'C3'
  | 'C4'
  | 'C5'
  | 'C6'
  | 'spawn'
  | 'fob'
  | 'road'
  | 'special'
  | 'ice'
  | 'lava'
  | 'toxic'
  | 'fog'
  | 'restricted';

export interface GalleryPipelineConfig {
  pipelineMode: 'legacy' | 'modern';
  qualityTier: 'low' | 'medium' | 'high' | 'ultra';
  aa: 'off' | 'msaa' | 'smaa' | 'native';
  msaaSamples: number;
  tonemap: 'aces' | 'agx' | 'neutral';
  exposure: number;
  ibl: 'room' | 'biome' | 'off';
  envIntensity: number;
  bloom: 'legacy' | 'hdr' | 'off';
  bloomThreshold: number;
  bloomStrength: number;
  bloomRadius: number;
  gtao: boolean;
  useComposer: boolean;
  shadowMapSize: number;
}

export interface GalleryEnvironmentHookResult {
  envRT?: THREE.WebGLRenderTarget | null;
  envMap?: THREE.Texture | null;
  skyDome?: THREE.Object3D | null;
  envIntensity?: number;
  exposure?: number;
  sunColor?: number;
  sunIntensity?: number;
  sunPosition?: [number, number, number];
  hemiSkyColor?: number;
  hemiGroundColor?: number;
  hemiIntensity?: number;
  rimColor?: number;
  rimIntensity?: number;
  rimPosition?: [number, number, number];
  fogColor?: number;
  fogDensity?: number;
  backgroundColor?: number;
  dispose?: () => void;
}

/**
 * Stage 1C Pipeline Sync Hook:
 * `pipeline-engineer` can register an adapter (or replace `defaultPipelineAdapter`)
 * to wire `GraphicsQuality`, `BiomeEnvironment3D`, and `GTAOPass` directly into
 * VisualGallery3D so Gallery & Gameplay share 100% identical rendering pipelines.
 */
export interface GalleryPipelineAdapter {
  resolveConfig?: (search: string, base: GalleryPipelineConfig) => Partial<GalleryPipelineConfig>;
  createBiomeEnvironment?: (
    renderer: THREE.WebGLRenderer,
    biome: WorldBiome,
    config: GalleryPipelineConfig,
    stageCfg?: any
  ) => GalleryEnvironmentHookResult | null;
  createGtaoPass?: (
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ) => { pass: any; dispose?: () => void } | null;
}

export interface GalleryMetrics {
  selection: {
    mode: GalleryMode;
    tower: string;
    state: GalleryTowerState;
    biome: WorldBiome;
    stage: string;
    camera: GalleryCameraPreset;
    angleIndex: number;
    grayscale: boolean;
    wireframe: boolean;
    uiVisible: boolean;
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
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    distance: number;
    fov: number;
  };
  viewport: {
    width: number;
    height: number;
    dpr: number;
    bufferWidth: number;
    bufferHeight: number;
  };
  pipeline: GalleryPipelineConfig & {
    composerSamples: number;
    toneMappingCode: number;
    shadowMapType: number;
  };
}

export interface GalleryApi {
  setMode: (mode: GalleryMode) => void;
  setTower: (defId: string) => void;
  setState: (state: GalleryTowerState) => void;
  setBiome: (biome: WorldBiome) => void;
  setStage: (stageId: string) => void;
  setCamera: (preset: GalleryCameraPreset) => void;
  setTurntableAngle: (angleIndex: number) => void;
  setGrayscale: (enabled: boolean) => void;
  setWireframe: (enabled: boolean) => void;
  setUiVisible: (visible: boolean) => void;
  setDpr: (dpr: number) => void;
  setPipelineConfig: (partial: Partial<GalleryPipelineConfig>) => void;
  renderNow: () => void;
  getMetrics: () => GalleryMetrics;
  listTowers: () => Array<{ id: string; name: string; category: string; hasSpecializations: boolean }>;
  listStages: () => Array<{ id: string; worldId: number; stageId: number; title: string; biome: WorldBiome }>;
  dispose: () => void;
}

const BIOMES: WorldBiome[] = ['desert', 'arctic', 'industrial', 'forest', 'canyon', 'swamp', 'volcanic'];
const TOWER_STATES: GalleryTowerState[] = ['nv1', 'nv2-3', 'nv4+', '5A', '6B', 'ghost'];
const GALLERY_MODES: GalleryMode[] = ['tower', 'sheet', 'silhouette', 'map'];

interface LegacyBiomeVisual {
  skyColor: number;
  fogColor: number;
  sunColor: number;
  rimColor: number;
  groundHex: number;
  gridLineHex: number;
  plinthHex: number;
}

// Preserves exact colors from `src/data/worlds.js` and `src/three/TerrainDiorama3D.ts`
const LEGACY_BIOME_VISUALS: Record<WorldBiome, LegacyBiomeVisual> = {
  desert: {
    skyColor: 0x161411,
    fogColor: 0x1b1712,
    sunColor: 0xffe9c2,
    rimColor: 0x38bdf8,
    groundHex: 0x9d8356,
    gridLineHex: 0x7a6849,
    plinthHex: 0x5c4a32
  },
  arctic: {
    skyColor: 0x0b1622,
    fogColor: 0x0f1e2e,
    sunColor: 0xdbeafe,
    rimColor: 0x67e8f9,
    groundHex: 0xdce7f3,
    gridLineHex: 0x7b92a8,
    plinthHex: 0x2e4359
  },
  industrial: {
    skyColor: 0x0c1016,
    fogColor: 0x10151e,
    sunColor: 0xfde68a,
    rimColor: 0xf97316,
    groundHex: 0x4c535d,
    gridLineHex: 0x2c323b,
    plinthHex: 0x22272e
  },
  forest: {
    skyColor: 0x101f17,
    fogColor: 0x15271e,
    sunColor: 0xfef3c7,
    rimColor: 0x4ade80,
    groundHex: 0x4c703f,
    gridLineHex: 0x314c2a,
    plinthHex: 0x2d3b26
  },
  canyon: {
    skyColor: 0x1a120e,
    fogColor: 0x221712,
    sunColor: 0xfdba74,
    rimColor: 0xf97316,
    groundHex: 0xa15a39,
    gridLineHex: 0x6e3722,
    plinthHex: 0x4b291d
  },
  swamp: {
    skyColor: 0x0d1512,
    fogColor: 0x14201b,
    sunColor: 0xd9f99d,
    rimColor: 0xa3e635,
    groundHex: 0x324a3b,
    gridLineHex: 0x1e2e24,
    plinthHex: 0x1a261f
  },
  volcanic: {
    skyColor: 0x190b08,
    fogColor: 0x240f0b,
    sunColor: 0xfca5a5,
    rimColor: 0xef4444,
    groundHex: 0x362220,
    gridLineHex: 0x1c1212,
    plinthHex: 0x281310
  }
};

// Stage 1C shared Fase 1 pipeline adapter — matches Battlefield3D 1:1
let registeredPipelineAdapter: GalleryPipelineAdapter | null = null;

export function registerGalleryPipelineAdapter(adapter: GalleryPipelineAdapter | null): void {
  registeredPipelineAdapter = adapter;
}

function createDefaultModernPipelineAdapter(): GalleryPipelineAdapter {
  return {
    resolveConfig(search: string) {
      const resolved = resolveQualityConfig(search, {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1
      });
      const p = resolved.profile;
      return {
        pipelineMode: 'modern',
        qualityTier: resolved.tier,
        aa: p.aaMode,
        msaaSamples: p.msaaSamples,
        tonemap: p.toneMapMode,
        exposure: 1.0,
        ibl: p.envEnabled ? p.iblMode : 'off',
        envIntensity: p.envEnabled ? 0.88 : 0,
        bloom: p.bloomEnabled ? p.bloomMode : 'off',
        bloomThreshold: p.bloomThreshold,
        bloomStrength: p.bloomStrength,
        bloomRadius: p.bloomRadius,
        gtao: p.gtaoEnabled,
        useComposer: p.useComposer,
        shadowMapSize: p.shadowMapSize
      };
    },
    createBiomeEnvironment(renderer, biome, config, stageCfg) {
      const envEnabled = config.ibl !== 'off';
      const handle = createBiomeEnvironment(renderer, biome, {
        iblMode: config.ibl === 'room' ? 'room' : 'biome',
        envEnabled,
        skyColorOverride: stageCfg?.skyColor,
        fogColorOverride: stageCfg?.fogColor,
        sunColorOverride: stageCfg?.sunColor,
        rimColorOverride: stageCfg?.rimColor
      });
      const spec = handle.lighting;
      return {
        envRT: null, // owned & disposed by handle.dispose()
        envMap: handle.envMap,
        skyDome: handle.skyDome,
        envIntensity: envEnabled ? spec.envIntensity : 0,
        exposure: spec.exposure,
        sunColor: spec.sunColor,
        sunIntensity: spec.sunIntensity,
        sunPosition: [spec.sunPosition[0], spec.sunPosition[1], spec.sunPosition[2]],
        hemiSkyColor: spec.hemiSkyColor,
        hemiGroundColor: spec.hemiGroundColor,
        hemiIntensity: envEnabled ? spec.hemiIntensity : spec.hemiIntensity * 1.18,
        rimColor: spec.rimColor,
        rimIntensity: spec.rimIntensity,
        rimPosition: [spec.rimPosition[0], spec.rimPosition[1], spec.rimPosition[2]],
        fogColor: spec.fogColor,
        fogDensity: stageCfg?.fogCells?.length ? 0.0046 : spec.fogDensity,
        backgroundColor: spec.skyColor,
        dispose: () => handle.dispose()
      };
    },
    createGtaoPass(scene, camera, width, height) {
      const halfW = Math.max(1, Math.floor(width * 0.5));
      const halfH = Math.max(1, Math.floor(height * 0.5));
      const gtaoPass = new GTAOPass(scene, camera, halfW, halfH);
      gtaoPass.output = GTAOPass.OUTPUT.Default;
      gtaoPass.blendIntensity = 0.65;
      gtaoPass.setSceneClipBox(
        new THREE.Box3(new THREE.Vector3(-64, -4, -40), new THREE.Vector3(64, 28, 40))
      );
      gtaoPass.updateGtaoMaterial({
        radius: 1.6,
        distanceExponent: 1.4,
        thickness: 1.8,
        distanceFallOff: 1.0,
        scale: 1.0,
        samples: 12
      });
      gtaoPass.updatePdMaterial({
        lumaPhi: 10,
        depthPhi: 2,
        normalPhi: 3,
        radius: 6,
        radiusExponent: 2,
        rings: 2,
        samples: 12
      });
      const origSetSize = gtaoPass.setSize.bind(gtaoPass);
      gtaoPass.setSize = (sw: number, sh: number) => {
        origSetSize(Math.max(1, Math.floor(sw * 0.5)), Math.max(1, Math.floor(sh * 0.5)));
      };
      return {
        pass: gtaoPass,
        dispose: () => {
          gtaoPass.gtaoMaterial?.dispose();
          gtaoPass.blendMaterial?.dispose();
          (gtaoPass as any).normalRenderTarget?.depthTexture?.dispose?.();
          gtaoPass.dispose();
        }
      };
    }
  };
}

function createLegacyBaselineConfig(): GalleryPipelineConfig {
  return {
    pipelineMode: 'legacy',
    qualityTier: 'high',
    aa: 'off',
    msaaSamples: 0,
    tonemap: 'aces',
    exposure: 1.08,
    ibl: 'room',
    envIntensity: 1.15,
    bloom: 'legacy',
    bloomThreshold: 0.82,
    bloomStrength: 0.45,
    bloomRadius: 0.35,
    gtao: false,
    useComposer: true,
    shadowMapSize: 2048
  };
}

function resolvePipelineConfigFromParams(
  params: URLSearchParams,
  adapter: GalleryPipelineAdapter | null
): GalleryPipelineConfig {
  const cfg = createLegacyBaselineConfig();

  const qualityParam = params.get('quality');
  const aaParam = params.get('aa');
  const tonemapParam = params.get('tonemap');
  const iblParam = params.get('ibl');
  const bloomParam = params.get('bloom');
  const gtaoParam = params.get('gtao');
  const pipelineParam = params.get('pipeline');

  const hasExplicitModernFlags = Boolean(
    pipelineParam === 'modern' || qualityParam || aaParam || tonemapParam || iblParam || bloomParam || gtaoParam
  );

  if (adapter?.resolveConfig && (pipelineParam !== 'legacy')) {
    const resolved = adapter.resolveConfig(window.location.search, cfg);
    Object.assign(cfg, resolved);
  } else if (hasExplicitModernFlags && pipelineParam !== 'legacy') {
    cfg.pipelineMode = 'modern';
  }

  if (qualityParam === 'low' || qualityParam === 'medium' || qualityParam === 'high' || qualityParam === 'ultra') {
    cfg.qualityTier = qualityParam;
    if (qualityParam === 'low') {
      cfg.useComposer = false;
      cfg.aa = 'native';
      cfg.msaaSamples = 0;
      cfg.bloom = 'off';
      cfg.gtao = false;
      cfg.shadowMapSize = 1024;
    } else if (qualityParam === 'medium') {
      cfg.useComposer = true;
      cfg.aa = 'msaa';
      cfg.msaaSamples = 2;
      cfg.shadowMapSize = 1536;
      cfg.gtao = false;
    } else if (qualityParam === 'high') {
      cfg.useComposer = true;
      cfg.aa = 'msaa';
      cfg.msaaSamples = 4;
      cfg.shadowMapSize = 2048;
      cfg.gtao = false;
    } else if (qualityParam === 'ultra') {
      cfg.useComposer = true;
      cfg.aa = 'msaa';
      cfg.msaaSamples = 4;
      cfg.shadowMapSize = 2048;
      cfg.gtao = true;
    }
  }

  if (aaParam === 'off') {
    cfg.aa = 'off';
    cfg.msaaSamples = 0;
    cfg.useComposer = true;
  } else if (aaParam === 'msaa') {
    cfg.aa = 'msaa';
    cfg.msaaSamples = cfg.msaaSamples > 0 ? cfg.msaaSamples : 4;
    cfg.useComposer = true;
  } else if (aaParam === 'smaa') {
    cfg.aa = 'smaa';
    cfg.msaaSamples = 0;
    cfg.useComposer = true;
  } else if (aaParam === 'native') {
    cfg.aa = 'native';
    cfg.msaaSamples = 0;
    cfg.useComposer = false;
  }

  if (tonemapParam === 'aces' || tonemapParam === 'agx' || tonemapParam === 'neutral') {
    cfg.tonemap = tonemapParam;
  }

  if (iblParam === 'room' || iblParam === 'biome' || iblParam === 'off') {
    cfg.ibl = iblParam;
  }

  if (bloomParam === 'legacy') {
    cfg.bloom = 'legacy';
    cfg.bloomThreshold = 0.82;
    cfg.bloomStrength = 0.45;
    cfg.bloomRadius = 0.35;
  } else if (bloomParam === 'hdr') {
    cfg.bloom = 'hdr';
    cfg.bloomThreshold = 1.14;
    cfg.bloomStrength = 0.28;
    cfg.bloomRadius = 0.38;
  } else if (bloomParam === 'off') {
    cfg.bloom = 'off';
  }

  if (gtaoParam === '1') cfg.gtao = true;
  if (gtaoParam === '0') cfg.gtao = false;

  return cfg;
}

function resolveToneMappingConstant(tm: 'aces' | 'agx' | 'neutral'): THREE.ToneMapping {
  return getThreeToneMapping(tm);
}

function stateToTowerParams(state: GalleryTowerState): { level: number; spec: 'A' | 'B' | null; isGhost: boolean } {
  switch (state) {
    case 'nv1':
      return { level: 1, spec: null, isGhost: false };
    case 'nv2-3':
      return { level: 3, spec: null, isGhost: false };
    case 'nv4+':
      return { level: 4, spec: null, isGhost: false };
    case '5A':
      return { level: 5, spec: 'A', isGhost: false };
    case '6B':
      return { level: 6, spec: 'B', isGhost: false };
    case 'ghost':
      return { level: 1, spec: null, isGhost: true };
    default:
      return { level: 1, spec: null, isGhost: false };
  }
}

function parseStageId(stageKey: string): { worldId: number; stageId: number } {
  const parts = String(stageKey).split('-').map((n) => parseInt(n, 10));
  const w = Number.isFinite(parts[0]) ? Math.max(1, Math.min(4, parts[0])) : 1;
  const s = Number.isFinite(parts[1]) ? Math.max(1, Math.min(5, parts[1])) : 1;
  return { worldId: w, stageId: s };
}

function buildAllStagesList(): Array<{ id: string; worldId: number; stageId: number; title: string; biome: WorldBiome }> {
  const list: Array<{ id: string; worldId: number; stageId: number; title: string; biome: WorldBiome }> = [];
  for (const w of WORLDS) {
    for (const s of w.stages) {
      list.push({
        id: s.id,
        worldId: w.worldId,
        stageId: s.stageId,
        title: s.title,
        biome: (s.biome || w.biome) as WorldBiome
      });
    }
  }
  return list;
}

function createLabelSprite(text: string): { mesh: THREE.Mesh; texture: THREE.CanvasTexture; geometry: THREE.PlaneGeometry; material: THREE.MeshBasicMaterial } {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 56;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgba(10, 16, 24, 0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 24px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const geometry = new THREE.PlaneGeometry(4.2, 0.92);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.03;
  return { mesh, texture, geometry, material };
}

function createGridPadTexture(groundHex: number, lineHex: number, cols: number, rows: number): THREE.CanvasTexture {
  const cellPx = 64;
  const canvas = document.createElement('canvas');
  canvas.width = cols * cellPx;
  canvas.height = rows * cellPx;
  const ctx = canvas.getContext('2d')!;

  const gCol = new THREE.Color(groundHex);
  const lCol = new THREE.Color(lineHex);
  ctx.fillStyle = `#${gCol.getHexString()}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Deterministic subtle grain (zero Math.random())
  let seed = (groundHex ^ 0x5f3759df) >>> 0;
  const nextRand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < cols * rows * 18; i++) {
    const x = nextRand() * canvas.width;
    const y = nextRand() * canvas.height;
    const r = 1 + nextRand() * 2.5;
    ctx.fillStyle = nextRand() > 0.5 ? 'rgba(255,255,255,0.045)' : 'rgba(0,0,0,0.055)';
    ctx.fillRect(x, y, r, r);
  }

  ctx.strokeStyle = `rgba(${Math.round(lCol.r * 255)}, ${Math.round(lCol.g * 255)}, ${Math.round(lCol.b * 255)}, 0.45)`;
  ctx.lineWidth = 2;
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cellPx, 0);
    ctx.lineTo(c * cellPx, canvas.height);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * cellPx);
    ctx.lineTo(canvas.width, r * cellPx);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function mountVisualGallery(adapterOverride?: GalleryPipelineAdapter): GalleryApi {
  const existing = (window as any).__DEFCON_GALLERY__ as GalleryApi | undefined;
  if (existing && typeof existing.dispose === 'function') {
    existing.dispose();
  }

  const activeAdapter = adapterOverride ?? registeredPipelineAdapter ?? createDefaultModernPipelineAdapter();
  const params = new URLSearchParams(window.location.search);

  // Hide gameplay app cleanly
  const appEl = document.getElementById('app');
  const prevAppDisplay = appEl ? appEl.style.display : '';
  if (appEl) appEl.style.display = 'none';

  // State initialized deterministically from query params
  const initMode = params.get('mode') as GalleryMode | null;
  let currentMode: GalleryMode = initMode && GALLERY_MODES.includes(initMode) ? initMode : 'tower';

  const initTower = params.get('tower');
  let currentTower: string = initTower && TOWER_BUILD_ORDER.includes(initTower) ? initTower : 'howitzer';

  const initState = params.get('state') as GalleryTowerState | null;
  let currentState: GalleryTowerState = initState && TOWER_STATES.includes(initState) ? initState : 'nv1';

  const initBiome = params.get('biome') as WorldBiome | null;
  let currentBiome: WorldBiome = initBiome && BIOMES.includes(initBiome) ? initBiome : 'desert';

  const allStages = buildAllStagesList();
  const initStage = params.get('stage');
  let currentStage: string = initStage && allStages.some((s) => s.id === initStage) ? initStage : '1-1';

  const initCam = (params.get('cam') || params.get('camera') || 'C1') as GalleryCameraPreset;
  let currentCamera: GalleryCameraPreset = initCam;

  const initAngle = parseInt(params.get('angle') || '0', 10);
  let currentAngleIndex = Number.isFinite(initAngle) ? ((initAngle % 8) + 8) % 8 : 0;

  let grayscaleEnabled = params.get('grayscale') === '1';
  let wireframeEnabled = params.get('wireframe') === '1';
  let uiVisible = params.get('ui') !== '0';

  const dprParam = parseFloat(params.get('dpr') || '1');
  let currentDpr = Number.isFinite(dprParam) && dprParam > 0 ? Math.min(3, Math.max(0.5, dprParam)) : 1;

  let pipelineConfig: GalleryPipelineConfig = resolvePipelineConfigFromParams(params, activeAdapter);

  // Full-viewport isolated host container (inline styles only — zero CSS files touched!)
  const hostEl = document.createElement('div');
  hostEl.id = 'defcon-visual-gallery';
  hostEl.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:99990',
    'background:#090d14',
    'overflow:hidden',
    'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
    'color:#e2e8f0'
  ].join(';');

  const canvasWrap = document.createElement('div');
  canvasWrap.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  hostEl.appendChild(canvasWrap);
  document.body.appendChild(hostEl);

  // Three.js r187 Renderer — exact baseline defaults + deterministic preserveDrawingBuffer
  const width = canvasWrap.clientWidth || window.innerWidth || 1440;
  const height = canvasWrap.clientHeight || window.innerHeight || 900;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(currentDpr);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = resolveToneMappingConstant(pipelineConfig.tonemap);
  renderer.toneMappingExposure = pipelineConfig.exposure;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.info.autoReset = false;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  canvasWrap.appendChild(renderer.domElement);

  getPBRTextures(renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / Math.max(1, height), 0.25, 650);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false; // deterministic immediate positioning
  controls.minDistance = 2.5;
  controls.maxDistance = 320;

  // Fixed light count (identical topology to Battlefield3D: Hemi + Sun + Rim)
  const hemiLight = new THREE.HemisphereLight(0x8bb2d6, 0x5c4a36, 0.9);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xffe9c2, 2.55);
  sunLight.position.set(45, 68, 38);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(pipelineConfig.shadowMapSize, pipelineConfig.shadowMapSize);
  sunLight.shadow.camera.near = 5;
  sunLight.shadow.camera.far = 220;
  sunLight.shadow.camera.left = -62;
  sunLight.shadow.camera.right = 62;
  sunLight.shadow.camera.top = 42;
  sunLight.shadow.camera.bottom = -42;
  sunLight.shadow.bias = -0.0004;
  sunLight.shadow.normalBias = 0.02;
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.85);
  rimLight.position.set(-48, 32, -40);
  scene.add(rimLight);

  // Groups for clean lifecycle management
  const stageRoot = new THREE.Group();
  scene.add(stageRoot);
  const turntableGroup = new THREE.Group();

  // Tracked disposables owned strictly by Gallery (NEVER dispose MilitaryModels3D shared caches!)
  let galleryOwnedGeos: THREE.BufferGeometry[] = [];
  let galleryOwnedMats: THREE.Material[] = [];
  let galleryOwnedTexs: THREE.Texture[] = [];
  let activeDiorama: DioramaHandles | null = null;
  let activeStageConfig: any = null;
  let activeEnvRT: THREE.WebGLRenderTarget | null = null;
  let activeSkyDome: THREE.Object3D | null = null;
  let activeEnvDispose: (() => void) | null = null;

  const silhouetteBlackMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const wireframeOriginals = new Map<THREE.Material, boolean>();

  // Post-processing state
  let composer: EffectComposer | null = null;
  let composerRT: THREE.WebGLRenderTarget | null = null;
  let bloomPass: UnrealBloomPass | null = null;
  let smaaPass: SMAAPass | null = null;
  let gtaoHandle: { pass: any; dispose?: () => void } | null = null;
  let outputPass: OutputPass | null = null;

  // Measured render metrics (composer-safe)
  let lastSceneCalls = 0;
  let lastTotalCalls = 0;
  let lastSceneTriangles = 0;
  let lastTotalTriangles = 0;
  let lastLines = 0;
  let lastPoints = 0;

  const pathfinder = new Pathfinder();

  const restoreWireframeOverrides = () => {
    wireframeOriginals.forEach((origVal, mat) => {
      (mat as any).wireframe = origVal;
    });
    wireframeOriginals.clear();
  };

  const applyWireframeState = () => {
    restoreWireframeOverrides();
    if (!wireframeEnabled) return;
    stageRoot.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        if ('wireframe' in m) {
          if (!wireframeOriginals.has(m)) {
            wireframeOriginals.set(m, Boolean((m as any).wireframe));
          }
          (m as any).wireframe = true;
        }
      }
    });
  };

  const clearStageContent = () => {
    restoreWireframeOverrides();

    if (activeDiorama) {
      stageRoot.remove(activeDiorama.group);
      activeDiorama.dispose();
      activeDiorama = null;
    }

    // Detach everything cleanly (preserving MilitaryModels3D shared geometry/material caches)
    while (turntableGroup.children.length > 0) {
      turntableGroup.remove(turntableGroup.children[0]);
    }
    while (stageRoot.children.length > 0) {
      stageRoot.remove(stageRoot.children[0]);
    }

    for (const g of galleryOwnedGeos) g.dispose();
    for (const m of galleryOwnedMats) m.dispose();
    for (const t of galleryOwnedTexs) t.dispose();
    galleryOwnedGeos = [];
    galleryOwnedMats = [];
    galleryOwnedTexs = [];
  };

  const disposeEnvironment = () => {
    if (activeSkyDome) {
      scene.remove(activeSkyDome);
      activeSkyDome = null;
    }
    if (activeEnvDispose) {
      activeEnvDispose();
      activeEnvDispose = null;
    }
    if (activeEnvRT) {
      activeEnvRT.dispose();
      activeEnvRT = null;
    }
    scene.environment = null;
  };

  const disposeComposer = () => {
    if (gtaoHandle?.dispose) {
      gtaoHandle.dispose();
    }
    gtaoHandle = null;
    if (bloomPass) {
      bloomPass.dispose();
      bloomPass = null;
    }
    if (smaaPass) {
      smaaPass.dispose();
      smaaPass = null;
    }
    if (outputPass) {
      outputPass.dispose();
      outputPass = null;
    }
    if (composer) {
      composer.dispose();
      composer = null;
    }
    if (composerRT) {
      composerRT.dispose();
      composerRT = null;
    }
  };

  const rebuildComposer = () => {
    disposeComposer();

    const w = canvasWrap.clientWidth || window.innerWidth || 1440;
    const h = canvasWrap.clientHeight || window.innerHeight || 900;

    if (!pipelineConfig.useComposer) {
      return;
    }

    const maxSamples = renderer.capabilities.maxSamples || 0;
    const wantMsaa = pipelineConfig.aa === 'msaa' && pipelineConfig.msaaSamples > 0 && maxSamples >= 2;

    if (wantMsaa) {
      const samples = Math.min(pipelineConfig.msaaSamples, maxSamples);
      composerRT = new THREE.WebGLRenderTarget(w, h, {
        type: THREE.HalfFloatType,
        samples,
        storeMultisampledColorBuffer: false
      });
      composer = new EffectComposer(renderer, composerRT);
    } else {
      // Exact legacy baseline: default EffectComposer RT (samples = 0)
      composer = new EffectComposer(renderer);
    }

    composer.setPixelRatio(currentDpr);
    composer.setSize(w, h);
    composer.addPass(new RenderPass(scene, camera));

    if (pipelineConfig.gtao && activeAdapter?.createGtaoPass) {
      gtaoHandle = activeAdapter.createGtaoPass(scene, camera, w, h);
      if (gtaoHandle?.pass) {
        composer.addPass(gtaoHandle.pass);
      }
    }

    if (pipelineConfig.bloom !== 'off') {
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(w, h),
        pipelineConfig.bloomStrength,
        pipelineConfig.bloomRadius,
        pipelineConfig.bloomThreshold
      );
      composer.addPass(bloomPass);
    }

    const needSmaa =
      pipelineConfig.aa === 'smaa' ||
      (pipelineConfig.aa === 'msaa' && maxSamples < 2);
    if (needSmaa) {
      // Three.js r187 breaking change: SMAAPass() takes 0 args and runs BEFORE OutputPass
      smaaPass = new SMAAPass();
      composer.addPass(smaaPass);
    }

    outputPass = new OutputPass();
    composer.addPass(outputPass);
  };

  const applyEnvironmentAndLighting = (biome: WorldBiome, stageCfg?: any) => {
    disposeEnvironment();

    const biomeVis = LEGACY_BIOME_VISUALS[biome] || LEGACY_BIOME_VISUALS.desert;

    // Silhouette mode overrides all lighting/env cleanly at render time
    if (currentMode === 'silhouette') {
      scene.background = new THREE.Color(0xe2e8f0);
      scene.fog = null;
      return;
    }

    // Stage 1C pipeline adapter hook (BiomeEnvironment3D)
    if (pipelineConfig.pipelineMode === 'modern' && activeAdapter?.createBiomeEnvironment) {
      const hooked = activeAdapter.createBiomeEnvironment(renderer, biome, pipelineConfig, stageCfg);
      if (hooked) {
        activeEnvRT = hooked.envRT ?? null;
        activeEnvDispose = hooked.dispose ?? null;
        scene.environment = hooked.envMap ?? null;
        scene.environmentIntensity = hooked.envIntensity ?? pipelineConfig.envIntensity;

        if (hooked.skyDome) {
          activeSkyDome = hooked.skyDome;
          scene.add(activeSkyDome);
        }

        const bgCol = hooked.backgroundColor ?? stageCfg?.skyColor ?? biomeVis.skyColor;
        scene.background = new THREE.Color(bgCol);

        const fogCol = hooked.fogColor ?? stageCfg?.fogColor ?? biomeVis.fogColor;
        const fogDens =
          hooked.fogDensity ??
          (stageCfg?.fogCells?.length ? 0.0046 : 0.0038);
        scene.fog = new THREE.FogExp2(fogCol, fogDens);

        hemiLight.color.setHex(hooked.hemiSkyColor ?? 0x8bb2d6);
        hemiLight.groundColor.setHex(hooked.hemiGroundColor ?? 0x5c4a36);
        hemiLight.intensity = hooked.hemiIntensity ?? 0.9;

        sunLight.color.setHex(hooked.sunColor ?? stageCfg?.sunColor ?? biomeVis.sunColor);
        sunLight.intensity = hooked.sunIntensity ?? 2.55;
        if (hooked.sunPosition) {
          sunLight.position.set(hooked.sunPosition[0], hooked.sunPosition[1], hooked.sunPosition[2]);
        }

        rimLight.color.setHex(hooked.rimColor ?? stageCfg?.rimColor ?? biomeVis.rimColor);
        rimLight.intensity = hooked.rimIntensity ?? 0.85;
        if (hooked.rimPosition) {
          rimLight.position.set(hooked.rimPosition[0], hooked.rimPosition[1], hooked.rimPosition[2]);
        }

        renderer.toneMapping = resolveToneMappingConstant(pipelineConfig.tonemap);
        if (typeof hooked.exposure === 'number') {
          renderer.toneMappingExposure = hooked.exposure;
          pipelineConfig.exposure = hooked.exposure;
        }
        return;
      }
    }

    // Stage 1A EXACT OLD-VISUAL BASELINE (matches Battlefield3D.ts:628-672 & 2308-2315 1:1)
    const skyColor = stageCfg?.skyColor ?? biomeVis.skyColor;
    const fogColor = stageCfg?.fogColor ?? biomeVis.fogColor;
    const sunColor = stageCfg?.sunColor ?? biomeVis.sunColor;
    const rimColor = stageCfg?.rimColor ?? biomeVis.rimColor;
    const fogDensity = stageCfg?.fogCells?.length ? 0.0046 : 0.0038;

    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.FogExp2(fogColor, fogDensity);

    hemiLight.color.setHex(0x8bb2d6);
    hemiLight.groundColor.setHex(0x5c4a36);
    hemiLight.intensity = 0.9;

    sunLight.color.setHex(sunColor);
    sunLight.intensity = 2.55;
    sunLight.position.set(45, 68, 38);

    rimLight.color.setHex(rimColor);
    rimLight.intensity = 0.85;

    renderer.toneMapping = resolveToneMappingConstant(pipelineConfig.tonemap);
    renderer.toneMappingExposure = pipelineConfig.exposure;

    if (pipelineConfig.ibl !== 'off') {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      activeEnvRT = pmrem.fromScene(roomEnv, 0.04);
      scene.environment = activeEnvRT.texture;
      scene.environmentIntensity = pipelineConfig.envIntensity;
      roomEnv.dispose();
      pmrem.dispose();
    }
  };

  const configureShadowFrustum = (halfW: number, halfH: number) => {
    sunLight.shadow.camera.left = -halfW;
    sunLight.shadow.camera.right = halfW;
    sunLight.shadow.camera.top = halfH;
    sunLight.shadow.camera.bottom = -halfH;
    sunLight.shadow.camera.updateProjectionMatrix();
    if (sunLight.shadow.mapSize.width !== pipelineConfig.shadowMapSize) {
      sunLight.shadow.mapSize.set(pipelineConfig.shadowMapSize, pipelineConfig.shadowMapSize);
      if (sunLight.shadow.map) {
        sunLight.shadow.map.dispose();
        sunLight.shadow.map = null;
      }
    }
  };

  const addGroundPlinth = (biome: WorldBiome, cols: number, rows: number, cellSize = CELL_WORLD) => {
    const vis = LEGACY_BIOME_VISUALS[biome] || LEGACY_BIOME_VISUALS.desert;
    const padW = cols * cellSize;
    const padD = rows * cellSize;
    const gridTex = createGridPadTexture(vis.groundHex, vis.gridLineHex, cols, rows);
    galleryOwnedTexs.push(gridTex);

    const padGeo = new THREE.PlaneGeometry(padW, padD);
    const padMat = new THREE.MeshStandardMaterial({
      map: gridTex,
      roughness: biome === 'arctic' ? 0.72 : 0.9,
      metalness: 0.04
    });
    galleryOwnedGeos.push(padGeo);
    galleryOwnedMats.push(padMat);

    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.rotation.x = -Math.PI / 2;
    padMesh.receiveShadow = true;
    stageRoot.add(padMesh);

    const baseSlabGeo = new THREE.BoxGeometry(padW + 1.2, 1.0, padD + 1.2);
    const baseSlabMat = new THREE.MeshStandardMaterial({
      color: vis.plinthHex,
      roughness: 0.85,
      metalness: 0.15
    });
    galleryOwnedGeos.push(baseSlabGeo);
    galleryOwnedMats.push(baseSlabMat);

    const baseSlab = new THREE.Mesh(baseSlabGeo, baseSlabMat);
    baseSlab.position.y = -0.52;
    baseSlab.receiveShadow = true;
    stageRoot.add(baseSlab);
  };

  const buildTowerNode = (defId: string, state: GalleryTowerState, forceSilhouette = false): THREE.Object3D => {
    const { level, spec, isGhost } = stateToTowerParams(state);

    if (forceSilhouette) {
      const rig = createTowerModel3D(defId, isGhost ? 1 : level, isGhost ? null : spec);
      rig.root.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        if (mesh.userData?.noShadow) {
          mesh.visible = false;
          return;
        }
        mesh.material = silhouetteBlackMat;
      });
      return rig.root;
    }

    if (isGhost) {
      const ghost = createGhostTower3D(defId);
      ghost.setValid(true);
      ghost.root.visible = true;
      ghost.root.position.set(0, 0, 0);
      ghost.root.rotation.set(0, 0, 0);
      ghost.root.scale.setScalar(1);
      return ghost.root;
    }

    const rig = createTowerModel3D(defId, level, spec);
    return rig.root;
  };

  const applyTurntableRotation = () => {
    const yaw = currentAngleIndex * (Math.PI / 4);
    if (currentMode === 'tower') {
      turntableGroup.rotation.y = yaw;
    } else if (currentMode === 'sheet' || currentMode === 'silhouette') {
      for (const slot of turntableGroup.children) {
        if (slot.userData.isTowerTurntableSlot) {
          slot.rotation.y = yaw;
        }
      }
    }
  };

  const applyCameraPreset = (preset: GalleryCameraPreset) => {
    currentCamera = preset;
    const w = canvasWrap.clientWidth || window.innerWidth || 1440;
    const h = canvasWrap.clientHeight || window.innerHeight || 900;
    const aspect = w / Math.max(1, h);

    camera.fov = 42;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    if (currentMode === 'tower') {
      const target = new THREE.Vector3(0, 1.25, 0);
      switch (preset) {
        case 'C2':
          camera.position.set(-5.4, 6.2, -6.4);
          break;
        case 'C3':
          target.set(0, 0.5, 0);
          camera.position.set(0, 10.5, 0.8);
          break;
        case 'C4': {
          // Grazing 13° above horizon
          const dist = 8.4;
          const elev = THREE.MathUtils.degToRad(13);
          const azim = THREE.MathUtils.degToRad(28);
          const horiz = dist * Math.cos(elev);
          target.set(0, 1.15, 0);
          camera.position.set(
            Math.sin(azim) * horiz,
            target.y + dist * Math.sin(elev),
            Math.cos(azim) * horiz
          );
          break;
        }
        case 'C5':
          // Close-up scaled to tower inspection (24u gameplay micro-detail equivalent)
          target.set(0, 1.35, 0);
          camera.position.set(3.1, 3.25, 3.85);
          break;
        case 'C6':
          // Far zoom (210u tactical silhouette scale equivalent)
          target.set(0, 0.8, 0);
          camera.position.set(22.0, 34.0, 41.0);
          break;
        case 'C1':
        default:
          // Gameplay 3/4 default angle (~40° elevation)
          camera.position.set(5.4, 6.2, 6.4);
          break;
      }
      controls.target.copy(target);
      controls.update();
      return;
    }

    if (currentMode === 'sheet') {
      const aspectPad = Math.max(1, 1.52 / Math.max(0.5, aspect));
      const target = new THREE.Vector3(0, 0.6, 0.6);
      switch (preset) {
        case 'C2':
          camera.position.set(0, 23.5 * aspectPad, -25.5 * aspectPad);
          break;
        case 'C3':
          target.set(0, 0, 0);
          camera.position.set(0, 44 * aspectPad, 0.8);
          break;
        case 'C4': {
          const dist = 36 * aspectPad;
          const elev = THREE.MathUtils.degToRad(13);
          camera.position.set(0, 1.2 + dist * Math.sin(elev), dist * Math.cos(elev));
          break;
        }
        case 'C5':
          camera.position.set(0, 14 * aspectPad, 16 * aspectPad);
          break;
        case 'C6':
          camera.position.set(0, 48 * aspectPad, 56 * aspectPad);
          break;
        case 'C1':
        default:
          camera.position.set(0, 23.0 * aspectPad, 25.0 * aspectPad);
          break;
      }
      controls.target.copy(target);
      controls.update();
      return;
    }

    if (currentMode === 'silhouette') {
      // Sized deterministically so each ~3.2u tower reads at ~64 px height
      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      const targetTowerPx = 64;
      const nominalTowerWorldH = 3.25;
      const distFor64Px = (h * nominalTowerWorldH) / (2 * targetTowerPx * Math.tan(fovRad * 0.5));
      const minFitDist = Math.max(48, 46 / Math.max(0.5, aspect));
      const dist = Math.max(minFitDist, distFor64Px);
      const elev = preset === 'C3'
        ? THREE.MathUtils.degToRad(84)
        : preset === 'C4'
          ? THREE.MathUtils.degToRad(13)
          : THREE.MathUtils.degToRad(26);
      const target = new THREE.Vector3(0, 0.8, 0);
      camera.position.set(0, target.y + dist * Math.sin(elev), dist * Math.cos(elev));
      controls.target.copy(target);
      controls.update();
      return;
    }

    // Map Inspection mode (`mode=map`)
    const stageCfg = activeStageConfig;
    const focusCell = (col: number, row: number, offsetX = 12, offsetY = 14, offsetZ = 16) => {
      const pos = cellToWorldCenter(col, row);
      controls.target.set(pos.x, 0.5, pos.z);
      camera.position.set(pos.x + offsetX, offsetY, pos.z + offsetZ);
      controls.update();
    };

    if (preset === 'spawn' && stageCfg?.spawnPoints?.length) {
      const sp = stageCfg.spawnPoints[0];
      focusCell(sp.col, sp.row, 13, 14, 15);
      return;
    }
    if (preset === 'fob' && stageCfg?.fobPoint) {
      const fob = stageCfg.fobPoint;
      focusCell(fob.col, fob.row, -13, 14, 15);
      return;
    }
    if (preset === 'road' && stageCfg?.roadCells?.length) {
      const mid = stageCfg.roadCells[Math.floor(stageCfg.roadCells.length / 2)];
      focusCell(mid[0], mid[1], 10, 15.2, 15.8);
      return;
    }
    if (
      preset === 'special' ||
      preset === 'ice' ||
      preset === 'lava' ||
      preset === 'toxic' ||
      preset === 'fog' ||
      preset === 'restricted'
    ) {
      const pickSpecialCell = (): [number, number] | null => {
        if (preset === 'ice' && stageCfg?.iceCells?.length) return stageCfg.iceCells[0];
        if (preset === 'lava' && stageCfg?.lavaCells?.length) return stageCfg.lavaCells[0];
        if (preset === 'toxic' && stageCfg?.toxicCells?.length) return stageCfg.toxicCells[0];
        if (preset === 'fog' && stageCfg?.fogCells?.length) return stageCfg.fogCells[0];
        if (preset === 'restricted' && stageCfg?.restrictedCells?.length) return stageCfg.restrictedCells[0];
        if (stageCfg?.lavaCells?.length) return stageCfg.lavaCells[0];
        if (stageCfg?.iceCells?.length) return stageCfg.iceCells[0];
        if (stageCfg?.toxicCells?.length) return stageCfg.toxicCells[0];
        if (stageCfg?.fogCells?.length) return stageCfg.fogCells[0];
        if (stageCfg?.restrictedCells?.length) return stageCfg.restrictedCells[0];
        if (stageCfg?.rockCells?.length) return stageCfg.rockCells[0];
        return [14, 7];
      };
      const cell = pickSpecialCell() || [14, 7];
      focusCell(cell[0], cell[1], 10, 14.5, 16);
      return;
    }

    switch (preset) {
      case 'C2':
        controls.target.set(0, 0, 0);
        camera.position.set(0, 62, -74);
        break;
      case 'C3':
        controls.target.set(0, 0, 0);
        camera.position.set(0, 118, 2);
        break;
      case 'C4': {
        const dist = 96;
        const elev = THREE.MathUtils.degToRad(13);
        controls.target.set(0, 0, 0);
        camera.position.set(0, dist * Math.sin(elev), dist * Math.cos(elev));
        break;
      }
      case 'C5':
        // Exact 24u gameplay close-up at map center
        controls.target.set(0, 0.5, 0);
        camera.position.set(0, 15.4, 18.4);
        break;
      case 'C6':
        // Exact 210u far zoom matching OrbitControls.maxDistance
        controls.target.set(0, 0, 0);
        camera.position.set(0, 135, 160);
        break;
      case 'C1':
      default:
        controls.target.set(0, 0, 0);
        camera.position.set(0, 62, 74);
        break;
    }
    controls.update();
  };

  const rebuildStage = () => {
    clearStageContent();

    if (currentMode === 'tower') {
      activeStageConfig = null;
      applyEnvironmentAndLighting(currentBiome);
      configureShadowFrustum(12, 12);
      addGroundPlinth(currentBiome, 4, 4, CELL_WORLD);

      const towerObj = buildTowerNode(currentTower, currentState, false);
      turntableGroup.rotation.set(0, 0, 0);
      turntableGroup.add(towerObj);
      stageRoot.add(turntableGroup);
      applyTurntableRotation();
    } else if (currentMode === 'sheet') {
      activeStageConfig = null;
      applyEnvironmentAndLighting(currentBiome);
      configureShadowFrustum(26, 20);

      const cols = 6;
      const rows = 4;
      const stepX = 5.4;
      const stepZ = 5.8;
      addGroundPlinth(currentBiome, 9, 7, CELL_WORLD);

      turntableGroup.rotation.set(0, 0, 0);
      TOWER_BUILD_ORDER.forEach((defId, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = (col - (cols - 1) * 0.5) * stepX;
        const z = (row - (rows - 1) * 0.5) * stepZ;

        const slot = new THREE.Group();
        slot.position.set(x, 0, z);
        slot.userData.isTowerTurntableSlot = true;
        slot.add(buildTowerNode(defId, currentState, false));
        turntableGroup.add(slot);

        const num = String(idx + 1).padStart(2, '0');
        const label = createLabelSprite(`${num} ${defId}`);
        galleryOwnedGeos.push(label.geometry);
        galleryOwnedMats.push(label.material);
        galleryOwnedTexs.push(label.texture);
        label.mesh.position.set(x, 0.03, z + 2.25);
        stageRoot.add(label.mesh);
      });

      stageRoot.add(turntableGroup);
      applyTurntableRotation();
    } else if (currentMode === 'silhouette') {
      activeStageConfig = null;
      applyEnvironmentAndLighting(currentBiome);

      const cols = 6;
      const rows = 4;
      const stepX = 7.4;
      const stepZ = 7.2;

      turntableGroup.rotation.set(0, 0, 0);
      TOWER_BUILD_ORDER.forEach((defId, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = (col - (cols - 1) * 0.5) * stepX;
        const z = (row - (rows - 1) * 0.5) * stepZ;

        const slot = new THREE.Group();
        slot.position.set(x, 0, z);
        slot.userData.isTowerTurntableSlot = true;
        slot.add(buildTowerNode(defId, currentState, true));
        turntableGroup.add(slot);
      });

      stageRoot.add(turntableGroup);
      applyTurntableRotation();
    } else if (currentMode === 'map') {
      const { worldId, stageId } = parseStageId(currentStage);
      const worldCfg = getWorldConfig(worldId);
      const stageCfg = getStageConfig(worldId, stageId);
      activeStageConfig = stageCfg;
      const stageBiome = (stageCfg.biome || worldCfg.biome) as WorldBiome;
      currentBiome = stageBiome;

      pathfinder.loadStageLayout(stageCfg);
      applyEnvironmentAndLighting(stageBiome, stageCfg);
      configureShadowFrustum(62, 42);

      activeDiorama = createBattlefieldDiorama3D(
        pathfinder.baseTerrain,
        stageBiome,
        stageCfg.spawnPoints,
        stageCfg.fobPoint,
        {
          restrictedCells: stageCfg.restrictedCells,
          iceCells: stageCfg.iceCells,
          fogCells: stageCfg.fogCells,
          toxicCells: stageCfg.toxicCells,
          lavaCells: stageCfg.lavaCells
        }
      );
      // Freeze diorama deterministically at t = 0
      activeDiorama.update(0, 0);
      stageRoot.add(activeDiorama.group);
    }

    applyWireframeState();
    applyCameraPreset(currentCamera);
    syncUiControls();
  };

  const applyGrayscaleFilter = () => {
    renderer.domElement.style.filter = grayscaleEnabled ? 'grayscale(100%)' : 'none';
  };

  const renderNow = () => {
    applyGrayscaleFilter();
    renderer.info.reset();

    if (currentMode === 'silhouette') {
      // Direct pure flat render: #000000 silhouettes on exact #e2e8f0 background, zero bloom/tonemap tint
      const prevTM = renderer.toneMapping;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.render(scene, camera);
      renderer.toneMapping = prevTM;
      lastSceneCalls = renderer.info.render.calls;
      lastTotalCalls = lastSceneCalls;
      lastSceneTriangles = renderer.info.render.triangles;
      lastTotalTriangles = lastSceneTriangles;
      lastLines = renderer.info.render.lines;
      lastPoints = renderer.info.render.points;
      updateUiMetricsLine();
      return;
    }

    if (composer && pipelineConfig.useComposer) {
      // Measure Scene (RenderPass + ShadowPass) vs Full Composer cleanly
      const passes = composer.passes;
      const firstPass = passes[0];
      if (firstPass && typeof firstPass.render === 'function') {
        const origFirstRender = firstPass.render;
        firstPass.render = function wrappedFirstPass(...args: any[]) {
          origFirstRender.apply(this, args);
          lastSceneCalls = renderer.info.render.calls;
          lastSceneTriangles = renderer.info.render.triangles;
          lastLines = renderer.info.render.lines;
          lastPoints = renderer.info.render.points;
        };
        try {
          composer.render();
        } finally {
          firstPass.render = origFirstRender;
        }
      } else {
        composer.render();
        lastSceneCalls = renderer.info.render.calls;
        lastSceneTriangles = renderer.info.render.triangles;
        lastLines = renderer.info.render.lines;
        lastPoints = renderer.info.render.points;
      }
      lastTotalCalls = renderer.info.render.calls;
      lastTotalTriangles = renderer.info.render.triangles;
    } else {
      renderer.render(scene, camera);
      lastSceneCalls = renderer.info.render.calls;
      lastTotalCalls = lastSceneCalls;
      lastSceneTriangles = renderer.info.render.triangles;
      lastTotalTriangles = lastSceneTriangles;
      lastLines = renderer.info.render.lines;
      lastPoints = renderer.info.render.points;
    }

    updateUiMetricsLine();
  };

  // === Minimal Inline-Styled Control Panel (hideable via &ui=0 or setUiVisible(false)) ===
  const panelEl = document.createElement('div');
  panelEl.id = 'defcon-gallery-panel';
  panelEl.style.cssText = [
    'position:fixed',
    'top:10px',
    'left:10px',
    'z-index:99995',
    'width:278px',
    'max-height:calc(100vh - 20px)',
    'overflow-y:auto',
    'padding:10px',
    'border-radius:8px',
    'background:rgba(10,15,24,0.88)',
    'border:1px solid rgba(56,189,248,0.45)',
    'box-shadow:0 8px 28px rgba(0,0,0,0.55)',
    'font-size:11px',
    'line-height:1.4',
    'backdrop-filter:blur(6px)'
  ].join(';');

  const inputStyle = [
    'width:100%',
    'box-sizing:border-box',
    'background:#0f172a',
    'color:#e2e8f0',
    'border:1px solid rgba(148,163,184,0.35)',
    'border-radius:4px',
    'padding:3px 6px',
    'font-family:inherit',
    'font-size:11px'
  ].join(';');

  const btnStyle = [
    'background:#1e293b',
    'color:#e2e8f0',
    'border:1px solid rgba(148,163,184,0.35)',
    'border-radius:4px',
    'padding:3px 6px',
    'cursor:pointer',
    'font-family:inherit',
    'font-size:10px'
  ].join(';');

  const makeRow = (labelText: string, control: HTMLElement) => {
    const row = document.createElement('div');
    row.style.cssText = 'margin-bottom:6px;';
    const lbl = document.createElement('div');
    lbl.textContent = labelText;
    lbl.style.cssText = 'color:#94a3b8;font-size:10px;margin-bottom:2px;letter-spacing:0.04em;';
    row.appendChild(lbl);
    row.appendChild(control);
    return row;
  };

  const titleEl = document.createElement('div');
  titleEl.textContent = 'DEFCON VISUAL GALLERY [DEV]';
  titleEl.style.cssText =
    'color:#38bdf8;font-weight:700;font-size:12px;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid rgba(148,163,184,0.22);';
  panelEl.appendChild(titleEl);

  const modeSel = document.createElement('select');
  modeSel.style.cssText = inputStyle;
  for (const m of GALLERY_MODES) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m.toUpperCase();
    modeSel.appendChild(opt);
  }
  panelEl.appendChild(makeRow('MODE', modeSel));

  const towerSel = document.createElement('select');
  towerSel.style.cssText = inputStyle;
  TOWER_BUILD_ORDER.forEach((id, idx) => {
    const def = (TOWER_DEFINITIONS as any)[id];
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = `${String(idx + 1).padStart(2, '0')} ${id} (${def?.shortName || id})`;
    towerSel.appendChild(opt);
  });
  panelEl.appendChild(makeRow('TOWER (23)', towerSel));

  const stateSel = document.createElement('select');
  stateSel.style.cssText = inputStyle;
  for (const st of TOWER_STATES) {
    const opt = document.createElement('option');
    opt.value = st;
    opt.textContent = st;
    stateSel.appendChild(opt);
  }
  panelEl.appendChild(makeRow('STATE', stateSel));

  const biomeSel = document.createElement('select');
  biomeSel.style.cssText = inputStyle;
  for (const b of BIOMES) {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    biomeSel.appendChild(opt);
  }
  panelEl.appendChild(makeRow('BIOME (7)', biomeSel));

  const stageSel = document.createElement('select');
  stageSel.style.cssText = inputStyle;
  for (const st of allStages) {
    const opt = document.createElement('option');
    opt.value = st.id;
    opt.textContent = `${st.id} — ${st.title} [${st.biome}]`;
    stageSel.appendChild(opt);
  }
  panelEl.appendChild(makeRow('STAGE (20)', stageSel));

  const camWrap = document.createElement('div');
  camWrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;';
  const camPresets: GalleryCameraPreset[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'spawn', 'fob', 'road', 'special'];
  for (const cp of camPresets) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = cp.toUpperCase();
    b.style.cssText = btnStyle;
    b.addEventListener('click', () => {
      api.setCamera(cp);
    });
    camWrap.appendChild(b);
  }
  panelEl.appendChild(makeRow('CAMERAS', camWrap));

  const angleWrap = document.createElement('div');
  angleWrap.style.cssText = 'display:flex;align-items:center;gap:6px;';
  const prevAngBtn = document.createElement('button');
  prevAngBtn.type = 'button';
  prevAngBtn.textContent = '◀ -45°';
  prevAngBtn.style.cssText = btnStyle;
  const angleLabel = document.createElement('span');
  angleLabel.style.cssText = 'flex:1;text-align:center;color:#e2e8f0;';
  const nextAngBtn = document.createElement('button');
  nextAngBtn.type = 'button';
  nextAngBtn.textContent = '+45° ▶';
  nextAngBtn.style.cssText = btnStyle;
  angleWrap.append(prevAngBtn, angleLabel, nextAngBtn);
  panelEl.appendChild(makeRow('TURNTABLE (8 STEPS)', angleWrap));

  const togglesWrap = document.createElement('div');
  togglesWrap.style.cssText = 'display:flex;gap:8px;margin-top:6px;margin-bottom:6px;flex-wrap:wrap;';
  const makeCheckbox = (label: string, onChange: (checked: boolean) => void) => {
    const lbl = document.createElement('label');
    lbl.style.cssText = 'display:flex;align-items:center;gap:4px;cursor:pointer;font-size:10px;';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.addEventListener('change', () => onChange(cb.checked));
    lbl.append(cb, document.createTextNode(label));
    return { lbl, cb };
  };
  const grayCheck = makeCheckbox('Grayscale', (v) => api.setGrayscale(v));
  const wireCheck = makeCheckbox('Wireframe', (v) => api.setWireframe(v));
  const hideUiBtn = document.createElement('button');
  hideUiBtn.type = 'button';
  hideUiBtn.textContent = 'Hide UI';
  hideUiBtn.style.cssText = btnStyle;
  hideUiBtn.addEventListener('click', () => api.setUiVisible(false));
  togglesWrap.append(grayCheck.lbl, wireCheck.lbl, hideUiBtn);
  panelEl.appendChild(togglesWrap);

  const metricsEl = document.createElement('pre');
  metricsEl.style.cssText = [
    'margin:6px 0 0 0',
    'padding-top:6px',
    'border-top:1px solid rgba(148,163,184,0.22)',
    'font-size:10px',
    'color:#94a3b8',
    'white-space:pre-wrap'
  ].join(';');
  panelEl.appendChild(metricsEl);

  panelEl.style.display = uiVisible ? 'block' : 'none';
  hostEl.appendChild(panelEl);

  function syncUiControls() {
    modeSel.value = currentMode;
    towerSel.value = currentTower;
    stateSel.value = currentState;
    biomeSel.value = currentBiome;
    stageSel.value = currentStage;
    angleLabel.textContent = `#${currentAngleIndex} (${currentAngleIndex * 45}°)`;
    grayCheck.cb.checked = grayscaleEnabled;
    wireCheck.cb.checked = wireframeEnabled;
    panelEl.style.display = uiVisible ? 'block' : 'none';
  }

  function updateUiMetricsLine() {
    if (!uiVisible) return;
    const dist = camera.position.distanceTo(controls.target);
    metricsEl.textContent = [
      `Pipe: ${pipelineConfig.pipelineMode} | AA: ${pipelineConfig.aa} (s=${composer?.renderTarget1?.samples ?? 0})`,
      `TM: ${pipelineConfig.tonemap} (${renderer.toneMappingExposure.toFixed(2)}) | Bloom: ${pipelineConfig.bloom}`,
      `Calls: ${lastSceneCalls} scene / ${lastTotalCalls} tot | Tris: ${lastSceneTriangles.toLocaleString()}`,
      `Mem: Geo ${renderer.info.memory.geometries} | Tex ${renderer.info.memory.textures} | Prog ${renderer.info.programs?.length ?? 0}`,
      `Cam: ${currentCamera} (dist ${dist.toFixed(1)}u, DPR ${currentDpr})`
    ].join('\n');
  }

  modeSel.addEventListener('change', () => api.setMode(modeSel.value as GalleryMode));
  towerSel.addEventListener('change', () => api.setTower(towerSel.value));
  stateSel.addEventListener('change', () => api.setState(stateSel.value as GalleryTowerState));
  biomeSel.addEventListener('change', () => api.setBiome(biomeSel.value as WorldBiome));
  stageSel.addEventListener('change', () => api.setStage(stageSel.value));
  prevAngBtn.addEventListener('click', () => api.setTurntableAngle(currentAngleIndex - 1));
  nextAngBtn.addEventListener('click', () => api.setTurntableAngle(currentAngleIndex + 1));

  // Interactive OrbitControls render-on-change (keeps t = 0 frozen deterministically)
  controls.addEventListener('change', () => {
    renderNow();
  });

  const onResize = () => {
    const w = canvasWrap.clientWidth || window.innerWidth || 1440;
    const h = canvasWrap.clientHeight || window.innerHeight || 900;
    if (w <= 0 || h <= 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(currentDpr);
    renderer.setSize(w, h);
    if (composer) {
      composer.setPixelRatio(currentDpr);
      composer.setSize(w, h);
    }
    if (currentMode === 'silhouette' || currentMode === 'sheet') {
      applyCameraPreset(currentCamera);
    }
    renderNow();
  };
  window.addEventListener('resize', onResize);

  const api: GalleryApi = {
    setMode: (mode: GalleryMode) => {
      if (!GALLERY_MODES.includes(mode)) return;
      currentMode = mode;
      rebuildStage();
      renderNow();
    },
    setTower: (defId: string) => {
      if (!TOWER_BUILD_ORDER.includes(defId)) return;
      currentTower = defId;
      if (currentMode === 'tower') {
        rebuildStage();
      } else {
        syncUiControls();
      }
      renderNow();
    },
    setState: (state: GalleryTowerState) => {
      if (!TOWER_STATES.includes(state)) return;
      currentState = state;
      if (currentMode !== 'map') {
        rebuildStage();
      } else {
        syncUiControls();
      }
      renderNow();
    },
    setBiome: (biome: WorldBiome) => {
      if (!BIOMES.includes(biome)) return;
      currentBiome = biome;
      if (currentMode !== 'map') {
        rebuildStage();
      } else {
        applyEnvironmentAndLighting(biome, activeStageConfig);
        syncUiControls();
      }
      renderNow();
    },
    setStage: (stageId: string) => {
      if (!allStages.some((s) => s.id === stageId)) return;
      currentStage = stageId;
      if (currentMode === 'map') {
        rebuildStage();
      } else {
        syncUiControls();
      }
      renderNow();
    },
    setCamera: (preset: GalleryCameraPreset) => {
      applyCameraPreset(preset);
      renderNow();
    },
    setTurntableAngle: (angleIndex: number) => {
      currentAngleIndex = ((Math.round(angleIndex) % 8) + 8) % 8;
      applyTurntableRotation();
      syncUiControls();
      renderNow();
    },
    setGrayscale: (enabled: boolean) => {
      grayscaleEnabled = Boolean(enabled);
      syncUiControls();
      renderNow();
    },
    setWireframe: (enabled: boolean) => {
      wireframeEnabled = Boolean(enabled);
      applyWireframeState();
      syncUiControls();
      renderNow();
    },
    setUiVisible: (visible: boolean) => {
      uiVisible = Boolean(visible);
      panelEl.style.display = uiVisible ? 'block' : 'none';
      if (uiVisible) updateUiMetricsLine();
    },
    setDpr: (dpr: number) => {
      if (!Number.isFinite(dpr) || dpr <= 0) return;
      currentDpr = Math.min(3, Math.max(0.5, dpr));
      onResize();
    },
    setPipelineConfig: (partial: Partial<GalleryPipelineConfig>) => {
      pipelineConfig = { ...pipelineConfig, ...partial };
      renderer.toneMapping = resolveToneMappingConstant(pipelineConfig.tonemap);
      renderer.toneMappingExposure = pipelineConfig.exposure;
      if (sunLight.shadow.mapSize.width !== pipelineConfig.shadowMapSize) {
        sunLight.shadow.mapSize.set(pipelineConfig.shadowMapSize, pipelineConfig.shadowMapSize);
        if (sunLight.shadow.map) {
          sunLight.shadow.map.dispose();
          sunLight.shadow.map = null;
        }
        sunLight.shadow.needsUpdate = true;
      }
      rebuildComposer();
      applyEnvironmentAndLighting(currentBiome, activeStageConfig);
      renderNow();
    },
    renderNow,
    getMetrics: (): GalleryMetrics => ({
      selection: {
        mode: currentMode,
        tower: currentTower,
        state: currentState,
        biome: currentBiome,
        stage: currentStage,
        camera: currentCamera,
        angleIndex: currentAngleIndex,
        grayscale: grayscaleEnabled,
        wireframe: wireframeEnabled,
        uiVisible
      },
      render: {
        sceneCalls: lastSceneCalls,
        totalCalls: lastTotalCalls,
        sceneTriangles: lastSceneTriangles,
        totalTriangles: lastTotalTriangles,
        lines: lastLines,
        points: lastPoints
      },
      memory: {
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        programs: renderer.info.programs?.length ?? 0
      },
      camera: {
        position: [
          Math.round(camera.position.x * 100) / 100,
          Math.round(camera.position.y * 100) / 100,
          Math.round(camera.position.z * 100) / 100
        ],
        target: [
          Math.round(controls.target.x * 100) / 100,
          Math.round(controls.target.y * 100) / 100,
          Math.round(controls.target.z * 100) / 100
        ],
        distance: Math.round(camera.position.distanceTo(controls.target) * 100) / 100,
        fov: camera.fov
      },
      viewport: {
        width: renderer.domElement.clientWidth,
        height: renderer.domElement.clientHeight,
        dpr: renderer.getPixelRatio(),
        bufferWidth: renderer.domElement.width,
        bufferHeight: renderer.domElement.height
      },
      pipeline: {
        ...pipelineConfig,
        composerSamples: composer?.renderTarget1?.samples ?? 0,
        toneMappingCode: renderer.toneMapping,
        shadowMapType: renderer.shadowMap.type
      }
    }),
    listTowers: () =>
      TOWER_BUILD_ORDER.map((id) => {
        const def = (TOWER_DEFINITIONS as any)[id];
        return {
          id,
          name: def?.name || id,
          category: def?.category || 'unknown',
          hasSpecializations: Boolean(def?.specializations)
        };
      }),
    listStages: () => allStages.map((s) => ({ ...s })),
    dispose: () => {
      window.removeEventListener('resize', onResize);
      controls.dispose();
      clearStageContent();
      disposeEnvironment();
      disposeComposer();
      silhouetteBlackMat.dispose();
      renderer.dispose();
      hostEl.remove();
      if (appEl) appEl.style.display = prevAppDisplay;
      if ((window as any).__DEFCON_GALLERY__ === api) {
        delete (window as any).__DEFCON_GALLERY__;
      }
    }
  };

  rebuildComposer();
  rebuildStage();
  renderNow();

  (window as any).__DEFCON_GALLERY__ = api;
  return api;
}
