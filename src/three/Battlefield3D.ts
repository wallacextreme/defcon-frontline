import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

import { bus } from '../core/EventBus.js';
import { getPBRTextures } from './ProceduralPBRTextures.ts';
import { ObjectPool } from '../core/ObjectPool.js';
import { TOWER_DEFINITIONS, AIR_SUPPORT_DEFINITIONS } from '../data/towers.js';
import { ENEMY_DEFINITIONS } from '../data/enemies.js';
import { getWorldConfig, getStageConfig } from '../data/worlds.js';
import {
  saveManager,
  ActiveMissionSnapshot,
  SavedTowerSnapshot
} from '../systems/SaveManager.ts';
import {
  Pathfinder,
  GRID_COLS,
  GRID_ROWS,
  TILE_SIZE
} from '../systems/Pathfinder.js';
import { resolveDamage } from '../systems/DamageSystem.js';
import { audio } from '../systems/AudioEngine.js';
import {
  createTowerModel3D,
  createEnemyModel3D,
  createA10Warthog3D,
  createB52Bomber3D,
  createMissileMesh3D,
  prewarmAllMilitaryModels,
  TowerRig3D,
  EnemyRig3D
} from './MilitaryModels3D.ts';
import {
  CELL_WORLD,
  WORLD_SCALE,
  BOARD_W,
  BOARD_D,
  simToWorldX,
  simToWorldZ,
  cellToWorldCenter,
  worldToSimX,
  worldToSimY,
  worldToCell,
  createBattlefieldDiorama3D,
  DioramaHandles,
  WorldBiome
} from './TerrainDiorama3D.ts';
import { Effects3D } from './Effects3D.ts';

export const MAP_WIDTH = GRID_COLS * TILE_SIZE;
export const MAP_HEIGHT = GRID_ROWS * TILE_SIZE;

function rotateAngleTowards(current: number, target: number, maxStep: number): number {
  let diff = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (Math.abs(diff) <= maxStep) return target;
  return current + Math.sign(diff) * maxStep;
}

function angleDiffAbs(a: number, b: number): number {
  let diff = ((a - b + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return Math.abs(diff);
}

interface TowerEntity {
  id: string;
  defId: string;
  def: any;
  col: number;
  row: number;
  x: number;
  y: number;
  wx: number;
  wz: number;
  level: number;
  effectiveCost: number;
  totalInvested: number;
  hp: number;
  maxHp: number;
  priority: string;
  turretAngle: number;
  cooldownTimer: number;
  empTimer: number;
  empDisabledTimer: number;
  burnTimer: number;
  burnDps: number;
  smokeTimer: number;
  trophyTimer: number;
  interceptTimer: number;
  laserTargetId: number;
  laserFocusTime: number;
  laserTickAccum: number;
  laserBeams: THREE.Mesh[];
  muzzleFlashTimer: number;
  totalDamage: number;
  kills: number;
  recoil: number;
  rig: TowerRig3D;
  laserLine?: THREE.Line;
  ewPulseMesh?: THREE.Mesh;
  hpEl: HTMLDivElement;
  hpFillEl: HTMLDivElement;
  hpLabelEl: HTMLSpanElement;
}

interface EnemyEntity {
  id: number;
  type: string;
  domain: 'ground' | 'air';
  armorClass: string;
  x: number;
  y: number;
  wx: number;
  wy: number;
  wz: number;
  angle: number;
  hp: number;
  maxHp: number;
  speed: number;
  reward: number;
  wbReward: number;
  fobDamage: number;
  isMechanized: boolean;
  hasEra: boolean;
  eraIntact: boolean;
  hasAps: boolean;
  apsCooldownTimer: number;
  apsMaxCooldown: number;
  isStealth: boolean;
  stealthRevealed: boolean;
  isBoss: boolean;
  isSubBoss: boolean;
  isStageBoss: boolean;
  isMegaBoss: boolean;
  slowImmune: boolean;
  dismountCount: number;
  radius: number;
  path: Array<{ col: number; row: number; x: number; y: number }> | null;
  pathIndex: number;
  distToFob: number;
  ewSlow: number;
  ewDamageAmp: number;
  thermalVuln: number;
  ewDisabled: boolean;
  stunTimer: number;
  hitFlashTimer: number;
  walkPhase: number;
  towerAttackTimer: number;
  empPulseTimer: number;
  periodicSpawnTimer: number;
  triggeredThresholds: Set<number>;
  rig: EnemyRig3D | null;
  hpEl: HTMLDivElement;
  hpFillEl: HTMLDivElement;
  hpDotEl: HTMLSpanElement;
  hpLabelEl: HTMLSpanElement;
  _pooledActive?: boolean;
  onRelease: () => void;
}

interface ProjectileEntity {
  kind: 'bullet' | 'sabot' | 'missile' | 'sam' | 'shell' | 'rocket' | 'hellfire';
  mesh: THREE.Object3D;
  wx: number;
  wy: number;
  wz: number;
  prevWx: number;
  prevWy: number;
  prevWz: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vz: number;
  speed: number;
  targetEnemy: EnemyEntity | null;
  targetId: number;
  targetX: number;
  targetY: number;
  startWx: number;
  startWy: number;
  startWz: number;
  targetWx: number;
  targetWy: number;
  targetWz: number;
  damage: number;
  damageType: string;
  armorPierce: number;
  armorIgnore: number;
  heavyMultiplier: number;
  tandemHeat: boolean;
  critChance: number;
  splashRadius: number;
  burnDps: number;
  burnDuration: number;
  isMissile: boolean;
  isTopAttack: boolean;
  isArtillery: boolean;
  flightTime: number;
  totalFlightTime: number;
  sourceTower: TowerEntity | null;
  smokeTimer: number;
  life: number;
  _pooledActive?: boolean;
  onRelease: () => void;
}

interface BossProjectileEntity {
  kind: string;
  mesh: THREE.Object3D;
  wx: number;
  wy: number;
  wz: number;
  startWx: number;
  startWy: number;
  startWz: number;
  targetWx: number;
  targetWy: number;
  targetWz: number;
  targetTower: TowerEntity;
  targetX: number;
  targetY: number;
  damage: number;
  splashRadius: number;
  burnDps: number;
  burnDuration: number;
  flightTime: number;
  totalFlightTime: number;
  smokeTimer: number;
  alive: boolean;
}

interface FireZoneEntity {
  x: number;
  y: number;
  wx: number;
  wz: number;
  radius: number;
  dps: number;
  life: number;
  maxLife: number;
  tickAccum: number;
  smokeAccum: number;
  mesh: THREE.Mesh;
}

interface FloatingTextEntity {
  el: HTMLDivElement;
  wx: number;
  wy: number;
  wz: number;
  life: number;
  maxLife: number;
  _pooledActive?: boolean;
  onRelease: () => void;
}

function getAirAltitude(type: string): number {
  if (type === 'drone_swarm') return 3.5;
  if (type === 'heli' || type === 'subboss_ka50') return 4.25;
  if (type === 'stealth' || type === 'boss_tu160') return 4.8;
  if (type === 'megaboss_kirov_airship') return 5.4;
  return 0.65;
}

export class Battlefield3D {
  private container: HTMLElement;
  private overlayEl: HTMLElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private composer!: EffectComposer;
  private controls!: OrbitControls;
  private diorama!: DioramaHandles;
  private effects!: Effects3D;
  private sunLight!: THREE.DirectionalLight;
  private rimLight!: THREE.DirectionalLight;
  private flashLights: THREE.PointLight[] = [];
  private flashLightCursor = 0;
  private flashLightTimers = [0, 0];

  private raycaster = new THREE.Raycaster();
  private pointerNdc = new THREE.Vector2();
  private hoverWorld = new THREE.Vector3();
  private keysDown = new Set<string>();

  private pathfinder = new Pathfinder();
  private towers: TowerEntity[] = [];
  private towerGrid: (TowerEntity | null)[][] = [];

  private currentWorldId = 1;
  private currentStageId = 1;
  private stageConfig: any = null;
  private worldConfig: any = null;

  private budget = 750;
  private sessionWB = 0;
  private fobHp = 20;
  private fobMaxHp = 20;
  private currentWave = 0;
  private totalWaves = 10;
  private waveActive = false;
  private wavePrepTimer = 0;
  private inIntermission = false;
  private spawnQueue: Array<{ time: number; type: string; spawnIdx: number }> = [];
  private waveElapsed = 0;
  private timeScale = 1;
  private lastNonZeroSpeed = 1;
  private gameOver = false;
  private victory = false;
  private totalKills = 0;
  private totalDamage = 0;

  private airSupport = {
    a10: { cost: AIR_SUPPORT_DEFINITIONS.a10.cost, cooldown: AIR_SUPPORT_DEFINITIONS.a10.cooldown, timer: 0 },
    hellfire: { cost: AIR_SUPPORT_DEFINITIONS.hellfire.cost, cooldown: AIR_SUPPORT_DEFINITIONS.hellfire.cooldown, timer: 0 },
    b52: { cost: AIR_SUPPORT_DEFINITIONS.b52.cost, cooldown: AIR_SUPPORT_DEFINITIONS.b52.cooldown, timer: 0 }
  };
  private activeTool: { kind: 'build'; towerId: string } | { kind: 'support'; supportId: string } | null = null;
  private strafeAngle = 0;
  private strafeDragStart: { x: number; y: number } | null = null;
  private selectedTower: TowerEntity | null = null;
  private hoveredEnemy: EnemyEntity | null = null;
  private hoverTile = { col: -1, row: -1 };
  private lastCanPlace: any = null;
  private lastTowerAttackWarnTime = -10;

  private trauma = 0;
  private hitStopTimer = 0;
  private elapsedReal = 0;
  private hasGlobalAesa = false;

  private enemyPool!: ObjectPool;
  private projectilePool!: ObjectPool;
  private textPool!: ObjectPool;
  private nextEnemyId = 1;

  private activeFlyovers: any[] = [];
  private pendingShots: any[] = [];
  private bossProjectiles: BossProjectileEntity[] = [];
  private fireZones: FireZoneEntity[] = [];

  // 3D Overlays
  private routeLinesGroup = new THREE.Group();
  private previewRouteGroup = new THREE.Group();
  private selectedRingGroup = new THREE.Group();
  private ghostGroup = new THREE.Group();
  private ghostModels = new Map<string, { root: THREE.Group; setValid: (v: boolean) => void }>();
  private ghostTileHighlight!: THREE.Mesh;
  private ghostRangeRing!: THREE.LineLoop;
  private ghostMinRangeRing!: THREE.LineLoop;
  private supportReticleGroup = new THREE.Group();
  private stealthLockGroup = new THREE.Group();

  private bulletGeo = new THREE.BoxGeometry(0.1, 0.1, 1.35);
  private bulletMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  private sabotMat = new THREE.MeshBasicMaterial({ color: 0xfb923c });
  private bossBulletMat = new THREE.MeshBasicMaterial({ color: 0xff3b3b });
  private shellGeo = new THREE.SphereGeometry(0.18, 8, 6);
  private shellMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 1.8 });
  private bossShellMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 2.2 });
  private laserBeamGeo = new THREE.CylinderGeometry(0.11, 0.11, 1, 8, 1, false);
  private laserBeamMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.6, 2.2, 2.8),
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  private fireZoneGeo = new THREE.CircleGeometry(1, 28);
  private fireZoneMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  private ewPulseGeo = new THREE.RingGeometry(0.92, 1.0, 48);

  private rafId = 0;
  private lastFrameTime = performance.now();
  private hudSyncAccum = 0;
  private autosaveAccum = 0;
  private resizeObserver!: ResizeObserver;
  private unsubs: Array<() => void> = [];
  private baseCameraOffset = new THREE.Vector3();
  private pointerDownPos: { x: number; y: number; button: number } | null = null;
  private shiftHeld = false;
  private onBeforeUnload!: () => void;
  private onVisibilityChange!: () => void;

  constructor(container: HTMLElement) {
    this.container = container;

    this.overlayEl = document.createElement('div');
    this.overlayEl.className = 'world-overlay';
    this.container.parentElement?.appendChild(this.overlayEl);

    const saved = saveManager.getState();
    const initialMission = saveManager.getActiveMission();
    this.currentWorldId = initialMission ? initialMission.worldId : saved.selectedWorld;
    this.currentStageId = initialMission ? initialMission.stageId : saved.selectedStage;

    this.initThree();
    this.initSimulation();
    this.initPools();
    this.initOverlays();
    this.initInput();
    this.bindBusCommands();
    this.bindPersistenceLifecycle();

    // Load saved stage & prewarm all models + compile shaders BEFORE player interaction
    this.loadStage(this.currentWorldId, this.currentStageId, true, initialMission);
    this.ghostModels = prewarmAllMilitaryModels(this.scene, this.camera, this.renderer, this.ghostGroup);

    if (initialMission) {
      this.pushRadio(
        `💾 AUTOSAVE RESTAURADO: Fase ${initialMission.worldId}-${initialMission.stageId} (Onda ${initialMission.completedWave}/${initialMission.totalWaves}, ${initialMission.towers.length} torres).`,
        'good'
      );
      bus.emit('hud:alert', {
        level: 'warn',
        text: `💾 OPERAÇÃO RESTAURADA DO AUTOSAVE (Fase ${initialMission.worldId}-${initialMission.stageId}, Onda ${initialMission.completedWave}/${initialMission.totalWaves})`
      });
    } else {
      this.pushRadio('C4ISR 3D ONLINE (28x16). Botão direito/WASD move câmera | Scroll zoom | [R] repara torre.', 'info');
    }

    // Async IndexedDB hydration fallback in case localStorage was cleared by OS/WebView
    void saveManager.syncFromIndexedDB().then((hydrated) => {
      if (hydrated && this.towers.length === 0 && this.currentWave === 0 && !this.gameOver) {
        const s = saveManager.getState();
        const m = saveManager.getActiveMission();
        const wId = m ? m.worldId : s.selectedWorld;
        const sId = m ? m.stageId : s.selectedStage;
        this.loadStage(wId, sId, true, m);
        bus.emit('cmd:techUpdated');
        bus.emit('hud:slotsUpdated');
        this.pushRadio('💾 Progresso sincronizado do backup IndexedDB!', 'good');
      }
    });

    this.lastFrameTime = performance.now();
    this.loop(this.lastFrameTime);
  }

  private initThree() {
    const width = this.container.clientWidth || 1000;
    const height = this.container.clientHeight || 640;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x161411);
    this.scene.fog = new THREE.FogExp2(0x1b1712, 0.0038);

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 520);
    this.camera.position.set(0, 62, 74);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    getPBRTextures(this.renderer.capabilities.getMaxAnisotropy());

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    pmrem.compileEquirectangularShader();
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 1.15;
    pmrem.dispose();

    const hemi = new THREE.HemisphereLight(0x8bb2d6, 0x5c4a36, 0.9);
    this.scene.add(hemi);

    this.sunLight = new THREE.DirectionalLight(0xffe9c2, 2.55);
    this.sunLight.position.set(45, 68, 38);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 200;
    this.sunLight.shadow.camera.left = -66;
    this.sunLight.shadow.camera.right = 66;
    this.sunLight.shadow.camera.top = 48;
    this.sunLight.shadow.camera.bottom = -48;
    this.sunLight.shadow.bias = -0.0004;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);

    this.rimLight = new THREE.DirectionalLight(0x60a5fa, 0.85);
    this.rimLight.position.set(-48, 32, -40);
    this.scene.add(this.rimLight);

    // Fixed global pool of 2 PointLights attached at boot (NEVER added/removed dynamically!)
    for (let i = 0; i < 2; i++) {
      const fl = new THREE.PointLight(0xffb74d, 0, 14, 2);
      fl.castShadow = false;
      fl.position.set(0, -50, 0);
      this.scene.add(fl);
      this.flashLights.push(fl);
    }

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 24;
    this.controls.maxDistance = 210;
    this.controls.minPolarAngle = Math.PI * 0.14;
    this.controls.maxPolarAngle = Math.PI * 0.43;
    this.controls.screenSpacePanning = false;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
    this.resetCameraView();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.45, 0.35, 0.82);
    this.composer.addPass(bloomPass);
    this.composer.addPass(new OutputPass());

    this.effects = new Effects3D(this.scene);

    this.scene.add(this.routeLinesGroup);
    this.scene.add(this.previewRouteGroup);
    this.scene.add(this.selectedRingGroup);
    this.scene.add(this.ghostGroup);
    this.scene.add(this.supportReticleGroup);
    this.scene.add(this.stealthLockGroup);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.container);
  }

  private triggerFlashLight(wx: number, wy: number, wz: number, color: number, intensity = 5.0, duration = 0.07) {
    const idx = this.flashLightCursor;
    this.flashLightCursor = (this.flashLightCursor + 1) % this.flashLights.length;
    const light = this.flashLights[idx];
    light.color.setHex(color);
    light.position.set(wx, wy, wz);
    light.intensity = intensity;
    this.flashLightTimers[idx] = duration;
  }

  private applyResponsiveCameraFov(w: number, h: number) {
    const aspect = w / Math.max(1, h);
    if (aspect < 1.0) {
      this.camera.fov = Math.min(68, Math.max(42, Math.round(52 / Math.max(0.55, aspect))));
    } else if (aspect < 1.35) {
      this.camera.fov = 48;
    } else {
      this.camera.fov = 42;
    }
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  resetCameraView() {
    const w = this.container.clientWidth || window.innerWidth || 1000;
    const h = this.container.clientHeight || window.innerHeight || 640;
    const aspect = w / Math.max(1, h);
    this.controls.target.set(0, 0, 0);
    if (aspect < 1.0) {
      this.camera.position.set(0, 78, 92);
    } else {
      this.camera.position.set(0, 62, 74);
    }
    this.applyResponsiveCameraFov(w, h);
    this.controls.update();
  }

  private onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w <= 0 || h <= 0) return;
    this.applyResponsiveCameraFov(w, h);
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  }

  private initSimulation() {
    this.towerGrid = Array.from({ length: GRID_ROWS }, () => new Array(GRID_COLS).fill(null));
    this.towers = [];
  }

  private initOverlays() {
    this.ghostTileHighlight = new THREE.Mesh(
      new THREE.PlaneGeometry(CELL_WORLD * 0.94, CELL_WORLD * 0.94),
      new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false })
    );
    this.ghostTileHighlight.rotation.x = -Math.PI / 2;
    this.ghostTileHighlight.position.y = 0.05;
    this.ghostGroup.add(this.ghostTileHighlight);

    this.ghostRangeRing = this.createCircleLoop(64, 0x22c55e, 0.85);
    this.ghostRangeRing.position.y = 0.09;
    this.ghostGroup.add(this.ghostRangeRing);

    this.ghostMinRangeRing = this.createCircleLoop(48, 0xef4444, 0.8);
    this.ghostMinRangeRing.position.y = 0.09;
    this.ghostGroup.add(this.ghostMinRangeRing);

    this.ghostGroup.visible = false;
  }

  private createCircleLoop(segments: number, color: number, opacity: number): THREE.LineLoop {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  }

  private initPools() {
    this.enemyPool = new ObjectPool(
      () => {
        const hpEl = document.createElement('div');
        hpEl.className = 'unit-hp-bar hidden';
        const hpLabelEl = document.createElement('span');
        hpLabelEl.className = 'unit-hp-label';
        const hpTrack = document.createElement('div');
        hpTrack.className = 'unit-hp-track';
        const hpFillEl = document.createElement('div');
        hpFillEl.className = 'unit-hp-fill';
        const hpDotEl = document.createElement('span');
        hpDotEl.className = 'unit-status-dot hidden';
        hpTrack.appendChild(hpFillEl);
        hpEl.append(hpLabelEl, hpTrack, hpDotEl);
        this.overlayEl.appendChild(hpEl);

        const e: EnemyEntity = {
          id: 0,
          type: 'infantry',
          domain: 'ground',
          armorClass: 'light',
          x: 0,
          y: 0,
          wx: 0,
          wy: 0,
          wz: 0,
          angle: 0,
          hp: 100,
          maxHp: 100,
          speed: 90,
          reward: 15,
          wbReward: 0,
          fobDamage: 1,
          isMechanized: false,
          hasEra: false,
          eraIntact: false,
          hasAps: false,
          apsCooldownTimer: 0,
          apsMaxCooldown: 4.0,
          isStealth: false,
          stealthRevealed: false,
          isBoss: false,
          isSubBoss: false,
          isStageBoss: false,
          isMegaBoss: false,
          slowImmune: false,
          dismountCount: 0,
          radius: 14,
          path: null,
          pathIndex: 0,
          distToFob: 9999,
          ewSlow: 0,
          ewDamageAmp: 0,
          thermalVuln: 0,
          ewDisabled: false,
          stunTimer: 0,
          hitFlashTimer: 0,
          walkPhase: Math.random() * 6.28,
          towerAttackTimer: 2.0,
          empPulseTimer: 5.0,
          periodicSpawnTimer: 8.0,
          triggeredThresholds: new Set<number>(),
          rig: null,
          hpEl,
          hpFillEl,
          hpDotEl,
          hpLabelEl,
          onRelease: () => {
            if (e.rig) {
              this.scene.remove(e.rig.root);
              e.rig = null;
            }
            hpEl.classList.add('hidden');
          }
        };
        return e;
      },
      64,
      360
    );

    this.projectilePool = new ObjectPool(
      () => {
        const mesh = new THREE.Mesh(this.bulletGeo, this.bulletMat);
        mesh.visible = false;
        this.scene.add(mesh);
        const p: ProjectileEntity = {
          kind: 'bullet',
          mesh,
          wx: 0,
          wy: 0,
          wz: 0,
          prevWx: 0,
          prevWy: 0,
          prevWz: 0,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          vz: 0,
          speed: 800,
          targetEnemy: null,
          targetId: 0,
          targetX: 0,
          targetY: 0,
          startWx: 0,
          startWy: 0,
          startWz: 0,
          targetWx: 0,
          targetWy: 0,
          targetWz: 0,
          damage: 10,
          damageType: 'kinetic',
          armorPierce: 0,
          armorIgnore: 0,
          heavyMultiplier: 1,
          tandemHeat: false,
          critChance: 0,
          splashRadius: 0,
          burnDps: 0,
          burnDuration: 0,
          isMissile: false,
          isTopAttack: false,
          isArtillery: false,
          flightTime: 0,
          totalFlightTime: 1,
          sourceTower: null,
          smokeTimer: 0,
          life: 3,
          onRelease: () => {
            if (p.mesh !== mesh) {
              this.scene.remove(p.mesh);
              p.mesh = mesh;
            }
            mesh.visible = false;
          }
        };
        return p;
      },
      160,
      750
    );

    this.textPool = new ObjectPool(
      () => {
        const el = document.createElement('div');
        el.className = 'combat-float-text hidden';
        this.overlayEl.appendChild(el);
        const ft: FloatingTextEntity = {
          el,
          wx: 0,
          wy: 0,
          wz: 0,
          life: 0,
          maxLife: 0.9,
          onRelease: () => {
            el.classList.add('hidden');
          }
        };
        return ft;
      },
      40,
      180
    );
  }

  private initInput() {
    const dom = this.renderer.domElement;
    dom.addEventListener('contextmenu', (e) => e.preventDefault());

    const updateMouseRay = (ev: PointerEvent | WheelEvent) => {
      if (!this.diorama) return false;
      const rect = dom.getBoundingClientRect();
      this.pointerNdc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointerNdc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointerNdc, this.camera);
      const hits = this.raycaster.intersectObject(this.diorama.groundPlane, false);
      if (hits.length > 0) {
        this.hoverWorld.copy(hits[0].point);
        return true;
      }
      return false;
    };

    dom.addEventListener('pointermove', (ev) => {
      if (!updateMouseRay(ev)) return;

      const { col, row } = worldToCell(this.hoverWorld.x, this.hoverWorld.z);
      // Throttle Raycasting & A* Pathfinding strictly per cell change
      if (col !== this.hoverTile.col || row !== this.hoverTile.row) {
        this.hoverTile.col = col;
        this.hoverTile.row = row;
        this.evaluatePlacementPreview();
        bus.emit('cursor:move', {
          col,
          row,
          x: Math.round(worldToSimX(this.hoverWorld.x)),
          y: Math.round(worldToSimY(this.hoverWorld.z))
        });
      }

      const sx = worldToSimX(this.hoverWorld.x);
      const sy = worldToSimY(this.hoverWorld.z);

      let closest: EnemyEntity | null = null;
      let bestDist = 34;
      this.enemyPool.forEachActive((obj) => {
        const e = obj as EnemyEntity;
        if (e.isStealth && !e.stealthRevealed) return;
        const d = Math.hypot(e.x - sx, e.y - sy);
        if (d < bestDist) {
          bestDist = d;
          closest = e;
        }
      });
      this.hoveredEnemy = closest;

      if (this.strafeDragStart) {
        const dx = sx - this.strafeDragStart.x;
        const dy = sy - this.strafeDragStart.y;
        if (Math.hypot(dx, dy) > 14) {
          this.strafeAngle = Math.atan2(dy, dx);
        }
      }
    });

    dom.addEventListener('pointerdown', (ev) => {
      audio.unlock();
      this.pointerDownPos = { x: ev.clientX, y: ev.clientY, button: ev.button };
      if (!updateMouseRay(ev)) return;

      const { col, row } = worldToCell(this.hoverWorld.x, this.hoverWorld.z);
      if (col !== this.hoverTile.col || row !== this.hoverTile.row) {
        this.hoverTile.col = col;
        this.hoverTile.row = row;
        this.evaluatePlacementPreview();
      }

      if (ev.button === 0 && this.activeTool?.kind === 'support' && this.activeTool.supportId === 'a10') {
        this.strafeDragStart = {
          x: worldToSimX(this.hoverWorld.x),
          y: worldToSimY(this.hoverWorld.z)
        };
      }
    });

    dom.addEventListener('pointerup', (ev) => {
      if (!this.pointerDownPos) return;
      const moveDist = Math.hypot(ev.clientX - this.pointerDownPos.x, ev.clientY - this.pointerDownPos.y);
      const button = this.pointerDownPos.button;
      this.pointerDownPos = null;

      if (!updateMouseRay(ev)) {
        this.strafeDragStart = null;
        return;
      }

      const simX = worldToSimX(this.hoverWorld.x);
      const simY = worldToSimY(this.hoverWorld.z);
      const { col, row } = worldToCell(this.hoverWorld.x, this.hoverWorld.z);

      if (button === 0 && this.strafeDragStart && this.activeTool?.kind === 'support' && this.activeTool.supportId === 'a10') {
        const sx = this.strafeDragStart.x;
        const sy = this.strafeDragStart.y;
        const dx = simX - sx;
        const dy = simY - sy;
        if (Math.hypot(dx, dy) > 14) {
          this.strafeAngle = Math.atan2(dy, dx);
        }
        this.strafeDragStart = null;
        if (!this.gameOver) {
          this.executeA10Strafe(sx, sy, this.strafeAngle);
        }
        return;
      }

      const maxMove = ev.pointerType === 'touch' ? 18 : 8;
      if (moveDist > maxMove) return;

      if (button === 2) {
        if (this.activeTool) {
          this.cancelActiveTool();
        } else if (this.selectedTower) {
          this.selectTower(null);
        }
        return;
      }

      if (button !== 0 || this.gameOver) return;

      if (this.activeTool?.kind === 'support') {
        if (this.activeTool.supportId === 'hellfire') {
          this.executeHellfireStrike(simX, simY);
          return;
        }
        if (this.activeTool.supportId === 'b52') {
          this.executeB52CarpetBomb(simX, simY);
          return;
        }
      }

      if (this.activeTool?.kind === 'build') {
        this.tryPlaceTower(col, row, this.activeTool.towerId);
        return;
      }

      if (this.pathfinder.inBounds(col, row) && this.towerGrid[row][col]) {
        this.selectTower(this.towerGrid[row][col]);
        audio.playUi('click');
      } else {
        this.selectTower(null);
      }
    });

    dom.addEventListener(
      'wheel',
      (ev) => {
        if (this.activeTool?.kind === 'support' && this.activeTool.supportId === 'a10') {
          ev.preventDefault();
          ev.stopPropagation();
          this.strafeAngle += ev.deltaY > 0 ? 0.25 : -0.25;
        }
      },
      { passive: false, capture: true }
    );

    this.onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Shift') this.shiftHeld = true;
      const lower = ev.key.toLowerCase();
      this.keysDown.add(lower);

      if (ev.key === 'Escape') {
        this.cancelActiveTool();
        this.selectTower(null);
      } else if (ev.key === ' ') {
        ev.preventDefault();
        this.togglePause();
      } else if (lower === 'r') {
        if (this.activeTool?.kind === 'support' && this.activeTool.supportId === 'a10') {
          this.strafeAngle += Math.PI / 4;
        } else if (this.selectedTower) {
          this.repairSelectedTower();
        }
      } else if (lower === 'q') {
        this.selectAirSupport('a10');
      } else if (lower === 'e') {
        this.selectAirSupport('hellfire');
      } else if (lower === 'b') {
        this.selectAirSupport('b52');
      } else {
        const match = Object.values(TOWER_DEFINITIONS).find((t: any) => t.hotkey === ev.key);
        if (match) this.selectBuildTool(match.id);
      }
    };

    this.onKeyUp = (ev: KeyboardEvent) => {
      if (ev.key === 'Shift') this.shiftHeld = false;
      this.keysDown.delete(ev.key.toLowerCase());
    };

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown!: (ev: KeyboardEvent) => void;
  private onKeyUp!: (ev: KeyboardEvent) => void;

  private bindPersistenceLifecycle() {
    this.onBeforeUnload = () => {
      if (!this.gameOver && (this.towers.length > 0 || this.currentWave > 0)) {
        this.saveCurrentMissionSnapshot(true);
      }
    };
    this.onVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !this.gameOver && (this.towers.length > 0 || this.currentWave > 0)) {
        this.saveCurrentMissionSnapshot(true);
      }
    };
    window.addEventListener('beforeunload', this.onBeforeUnload);
    window.addEventListener('pagehide', this.onBeforeUnload);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  private bindBusCommands() {
    this.unsubs = [
      bus.on('cmd:selectBuild', (towerId: string) => this.selectBuildTool(towerId)),
      bus.on('cmd:selectSupport', (supportId: string) => this.selectAirSupport(supportId)),
      bus.on('cmd:cancelTool', () => this.cancelActiveTool()),
      bus.on('cmd:startWave', () => this.startNextWave(true)),
      bus.on('cmd:setSpeed', (speed: number) => this.setSpeed(speed)),
      bus.on('cmd:upgradeTower', () => this.upgradeSelectedTower()),
      bus.on('cmd:repairTower', () => this.repairSelectedTower()),
      bus.on('cmd:sellTower', () => this.sellSelectedTower()),
      bus.on('cmd:setPriority', (prio: string) => this.setSelectedTowerPriority(prio)),
      bus.on('cmd:restart', () => {
        saveManager.clearActiveMission();
        this.loadStage(this.currentWorldId, this.currentStageId, false, null);
      }),
      bus.on('cmd:loadStage', ({ worldId, stageId }: { worldId: number; stageId: number }) => {
        saveManager.clearActiveMission();
        saveManager.selectStage(worldId, stageId);
        this.loadStage(worldId, stageId, false, null);
      }),
      bus.on('cmd:forceSave', () => {
        this.saveCurrentMissionSnapshot(true);
        audio.playUi('click');
        this.spawnFloatingText(0, 4.5, -18, '💾 JOGO SALVO!', '#4ade80');
        this.pushRadio('💾 Estado atual da operação salvo com segurança.', 'good');
      }),
      bus.on('cmd:saveSlot', (slotId: 1 | 2 | 3) => {
        if (!this.gameOver) {
          this.saveCurrentMissionSnapshot(true);
        }
        saveManager.saveToSlot(slotId);
        audio.playUi('build');
        bus.emit('hud:slotsUpdated');
        this.pushRadio(`💾 Operação gravada no SLOT ${slotId}.`, 'good');
      }),
      bus.on('cmd:loadSlot', (slotId: 1 | 2 | 3) => {
        if (!saveManager.loadFromSlot(slotId)) {
          audio.playUi('error');
          return;
        }
        const st = saveManager.getState();
        const mission = saveManager.getActiveMission();
        const wId = mission ? mission.worldId : st.selectedWorld;
        const sId = mission ? mission.stageId : st.selectedStage;
        this.loadStage(wId, sId, false, mission);
        audio.playUi('wave');
        bus.emit('cmd:techUpdated');
        bus.emit('hud:slotsUpdated');
        this.pushRadio(`💾 Save do SLOT ${slotId} carregado com sucesso!`, 'good');
      }),
      bus.on('cmd:deleteSlot', (slotId: 1 | 2 | 3) => {
        saveManager.deleteSlot(slotId);
        audio.playUi('click');
        bus.emit('hud:slotsUpdated');
      }),
      bus.on('cmd:importSave', (jsonText: string) => {
        const res = saveManager.importSaveJson(jsonText);
        if (!res.ok) {
          audio.playUi('error');
          this.pushRadio(`Erro ao importar save: ${res.error}`, 'alert');
          return;
        }
        const st = saveManager.getState();
        const mission = saveManager.getActiveMission();
        const wId = mission ? mission.worldId : st.selectedWorld;
        const sId = mission ? mission.stageId : st.selectedStage;
        this.loadStage(wId, sId, false, mission);
        audio.playUi('wave');
        bus.emit('cmd:techUpdated');
        bus.emit('hud:slotsUpdated');
        this.pushRadio('📤 Backup de save importado e restaurado com sucesso!', 'good');
      }),
      bus.on('cmd:techUpdated', () => {
        this.emitFullHudSync();
      }),
      bus.on('cmd:resetCamera', () => {
        this.resetCameraView();
      }),
      bus.on('cmd:rotateStrafe', () => {
        this.strafeAngle += Math.PI / 4;
        audio.playUi('click');
      }),
      bus.on('cmd:toggleMute', () => {
        const muted = audio.toggleMute();
        bus.emit('hud:mute', muted);
      })
    ];
  }

  saveCurrentMissionSnapshot(forceEvenIfEmpty = false) {
    if (this.gameOver) return;
    if (!forceEvenIfEmpty && this.towers.length === 0 && this.currentWave === 0) return;

    const completedWave = this.waveActive ? Math.max(0, this.currentWave - 1) : this.currentWave;
    const towers: SavedTowerSnapshot[] = this.towers.map((t) => ({
      defId: t.defId,
      col: t.col,
      row: t.row,
      level: t.level,
      hp: Math.ceil(t.hp),
      maxHp: t.maxHp,
      effectiveCost: t.effectiveCost,
      totalInvested: t.totalInvested,
      priority: t.priority,
      turretAngle: t.turretAngle,
      totalDamage: Math.round(t.totalDamage),
      kills: t.kills
    }));

    const snapshot: ActiveMissionSnapshot = {
      timestamp: Date.now(),
      worldId: this.currentWorldId,
      stageId: this.currentStageId,
      budget: Math.floor(this.budget),
      sessionWB: Math.floor(this.sessionWB),
      fobHp: Math.floor(this.fobHp),
      fobMaxHp: Math.floor(this.fobMaxHp),
      completedWave,
      totalWaves: this.totalWaves,
      totalKills: this.totalKills,
      totalDamage: Math.round(this.totalDamage),
      airSupportTimers: {
        a10: Math.max(0, Number(this.airSupport.a10.timer.toFixed(1))),
        hellfire: Math.max(0, Number(this.airSupport.hellfire.timer.toFixed(1))),
        b52: Math.max(0, Number(this.airSupport.b52.timer.toFixed(1)))
      },
      towers
    };

    saveManager.saveActiveMission(snapshot);
    bus.emit('hud:autosaved', { timestamp: snapshot.timestamp });
  }

  private restoreMissionFromSnapshot(snap: ActiveMissionSnapshot) {
    this.budget = snap.budget;
    this.sessionWB = snap.sessionWB;
    this.fobMaxHp = snap.fobMaxHp || 20;
    this.fobHp = Math.min(this.fobMaxHp, Math.max(1, snap.fobHp));
    this.currentWave = Math.min(this.totalWaves, Math.max(0, snap.completedWave));
    this.waveActive = false;
    this.inIntermission = false;
    this.wavePrepTimer = 0;
    this.totalKills = snap.totalKills || 0;
    this.totalDamage = snap.totalDamage || 0;
    this.airSupport.a10.timer = snap.airSupportTimers?.a10 || 0;
    this.airSupport.hellfire.timer = snap.airSupportTimers?.hellfire || 0;
    this.airSupport.b52.timer = snap.airSupportTimers?.b52 || 0;

    for (const st of snap.towers) {
      const def = (TOWER_DEFINITIONS as any)[st.defId];
      if (!def) continue;
      if (!this.pathfinder.isBuildable(st.col, st.row)) continue;

      this.spawnTowerOnGrid({
        col: st.col,
        row: st.row,
        towerId: st.defId,
        level: st.level,
        hp: st.hp,
        maxHp: st.maxHp,
        effectiveCost: st.effectiveCost,
        totalInvested: st.totalInvested,
        priority: st.priority,
        turretAngle: st.turretAngle,
        totalDamage: st.totalDamage,
        kills: st.kills
      });
    }

    this.refreshGlobalBuffs();
    this.rebuildActiveRouteLines();
  }

  loadStage(worldId: number, stageId: number, isBoot = false, snapshot: ActiveMissionSnapshot | null = null) {
    this.currentWorldId = worldId;
    this.currentStageId = stageId;
    this.worldConfig = getWorldConfig(worldId);
    this.stageConfig = getStageConfig(worldId, stageId);

    this.enemyPool.releaseAll();
    this.projectilePool.releaseAll();
    this.textPool.releaseAll();
    this.effects.releaseAll();

    for (const t of this.towers) {
      this.cleanupTowerVisuals(t);
    }
    for (const bp of this.bossProjectiles) {
      this.scene.remove(bp.mesh);
    }
    for (const fz of this.fireZones) {
      this.scene.remove(fz.mesh);
    }
    for (const f of this.activeFlyovers) {
      this.scene.remove(f.jet);
    }

    this.bossProjectiles = [];
    this.fireZones = [];
    this.activeFlyovers = [];
    this.pendingShots = [];
    this.towers = [];
    this.towerGrid = Array.from({ length: GRID_ROWS }, () => new Array(GRID_COLS).fill(null));

    this.pathfinder.loadStageLayout(this.stageConfig);

    // Swap 3D Diorama for the stage's biome & road network
    if (this.diorama) {
      this.scene.remove(this.diorama.group);
      this.diorama.dispose();
    }
    this.diorama = createBattlefieldDiorama3D(
      this.pathfinder.baseTerrain,
      this.worldConfig.biome as WorldBiome,
      this.stageConfig.spawnPoints,
      this.stageConfig.fobPoint
    );
    this.scene.add(this.diorama.group);

    this.scene.background = new THREE.Color(this.worldConfig.skyColor);
    this.scene.fog = new THREE.FogExp2(this.worldConfig.fogColor, 0.0038);
    this.sunLight.color.setHex(this.worldConfig.sunColor);
    this.rimLight.color.setHex(this.worldConfig.rimColor);

    this.budget = this.stageConfig.startingBudget || 750;
    this.sessionWB = 0;
    this.fobHp = 20;
    this.fobMaxHp = 20;
    this.currentWave = 0;
    this.totalWaves = this.stageConfig.waves.length;
    this.waveActive = false;
    this.wavePrepTimer = 0;
    this.inIntermission = false;
    this.spawnQueue = [];
    this.waveElapsed = 0;
    this.timeScale = 1;
    this.lastNonZeroSpeed = 1;
    this.gameOver = false;
    this.victory = false;
    this.totalKills = 0;
    this.totalDamage = 0;
    this.hasGlobalAesa = false;
    this.airSupport.a10.timer = 0;
    this.airSupport.hellfire.timer = 0;
    this.airSupport.b52.timer = 0;

    if (snapshot && snapshot.worldId === worldId && snapshot.stageId === stageId) {
      this.restoreMissionFromSnapshot(snapshot);
    }

    this.cancelActiveTool();
    this.selectTower(null);
    this.rebuildActiveRouteLines();
    this.emitFullHudSync();

    if (!isBoot && !snapshot) {
      this.pushRadio(
        `OPERAÇÃO INICIADA: ${this.worldConfig.name} — Fase ${this.stageConfig.id}: ${this.stageConfig.title}.`,
        'good'
      );
    }
  }

  private getEffectiveTowerCost(towerId: string): number {
    const def = (TOWER_DEFINITIONS as any)[towerId];
    if (!def) return 9999;
    const mults = saveManager.getTechMultipliers(towerId);
    return Math.max(10, Math.round(def.cost * mults.costMult));
  }

  private getEffectiveTowerMaxHp(towerId: string, level: number): number {
    const def = (TOWER_DEFINITIONS as any)[towerId];
    if (!def) return 500;
    const spec = def.levels[level - 1];
    const baseHp = spec?.maxHp || def.maxHp || 500;
    const levelMult = spec?.maxHp ? 1 : 1 + (level - 1) * 0.35;
    const mults = saveManager.getTechMultipliers(towerId);
    return Math.round(baseHp * levelMult * mults.hpMult);
  }

  private getEffectiveSpec(tower: TowerEntity) {
    const spec = tower.def.levels[tower.level - 1];
    const mults = saveManager.getTechMultipliers(tower.defId);
    return {
      ...spec,
      damage: Math.round((spec.damage || 0) * mults.damageMult),
      fireRate: (spec.fireRate || 0) * mults.fireRateMult,
      burnDps: spec.burnDps ? Math.round(spec.burnDps * mults.damageMult) : 0
    };
  }

  selectBuildTool(towerId: string) {
    audio.unlock();
    if (!saveManager.isTowerUnlocked(towerId)) {
      const def = (TOWER_DEFINITIONS as any)[towerId];
      this.pushRadio(
        `${def?.name || towerId} bloqueada! Abra "MAPA DE MUNDOS & ARSENAL" para desbloquear com WB$.`,
        'warn'
      );
      audio.playUi('error');
      bus.emit('hud:openArsenal');
      return;
    }

    if (this.activeTool?.kind === 'build' && this.activeTool.towerId === towerId) {
      this.cancelActiveTool();
      return;
    }
    this.activeTool = { kind: 'build', towerId };
    this.controls.enableRotate = true;
    this.selectTower(null);
    this.evaluatePlacementPreview();
    audio.playUi('click');
    bus.emit('hud:tool', this.activeTool);
  }

  selectAirSupport(supportId: string) {
    audio.unlock();
    if (!saveManager.isSupportUnlocked(supportId)) {
      const def = (AIR_SUPPORT_DEFINITIONS as any)[supportId];
      this.pushRadio(
        `${def?.name || supportId} bloqueado! Desbloqueie no Arsenal com WB$.`,
        'warn'
      );
      audio.playUi('error');
      bus.emit('hud:openArsenal');
      return;
    }

    const sup = (this.airSupport as any)[supportId];
    if (!sup) return;
    if (sup.timer > 0) {
      this.pushRadio(`Suporte aéreo em recarga (${Math.ceil(sup.timer)}s).`, 'warn');
      audio.playUi('error');
      return;
    }
    if (this.budget < sup.cost) {
      this.pushRadio(`Orçamento insuficiente ($${sup.cost} necessário).`, 'warn');
      audio.playUi('error');
      return;
    }
    this.activeTool = { kind: 'support', supportId };
    this.controls.enableRotate = supportId !== 'a10';
    this.selectTower(null);
    audio.playUi('click');
    bus.emit('hud:tool', this.activeTool);
  }

  cancelActiveTool() {
    this.activeTool = null;
    this.strafeDragStart = null;
    this.lastCanPlace = null;
    this.controls.enableRotate = true;
    this.ghostGroup.visible = false;
    this.clearGroup(this.previewRouteGroup);
    this.clearGroup(this.supportReticleGroup);
    bus.emit('hud:tool', null);
  }

  selectTower(tower: TowerEntity | null) {
    this.selectedTower = tower;
    if (tower) {
      this.activeTool = null;
      this.controls.enableRotate = true;
      this.ghostGroup.visible = false;
      this.clearGroup(this.previewRouteGroup);
      this.clearGroup(this.supportReticleGroup);
      bus.emit('hud:tool', null);
    }
    this.rebuildSelectedTowerOverlay();
    bus.emit('hud:selectedTower', this.serializeTower(tower));
  }

  private evaluatePlacementPreview() {
    if (this.activeTool?.kind !== 'build') {
      this.lastCanPlace = null;
      this.clearGroup(this.previewRouteGroup);
      return;
    }
    const { col, row } = this.hoverTile;
    if (!this.pathfinder.inBounds(col, row)) {
      this.lastCanPlace = null;
      this.clearGroup(this.previewRouteGroup);
      return;
    }
    const groundEnemies = this.enemyPool.active.filter((e: EnemyEntity) => e.domain === 'ground');
    this.lastCanPlace = this.pathfinder.canPlaceAt(col, row, groundEnemies);
    this.rebuildPreviewRouteLines();
  }

  private spawnTowerOnGrid(opts: {
    col: number;
    row: number;
    towerId: string;
    level: number;
    hp: number;
    maxHp: number;
    effectiveCost: number;
    totalInvested: number;
    priority: string;
    turretAngle: number;
    totalDamage: number;
    kills: number;
  }): TowerEntity {
    const { col, row, towerId, level } = opts;
    const def = (TOWER_DEFINITIONS as any)[towerId];
    this.pathfinder.placeStructure(col, row, !!def.isBarrier);

    const cx = col * TILE_SIZE + TILE_SIZE * 0.5;
    const cy = row * TILE_SIZE + TILE_SIZE * 0.5;
    const { x: wx, z: wz } = cellToWorldCenter(col, row);

    const rig = createTowerModel3D(towerId, level);
    rig.root.position.set(wx, 0, wz);
    this.scene.add(rig.root);

    const hpEl = document.createElement('div');
    hpEl.className = 'tower-hp-bar hidden';
    const hpLabelEl = document.createElement('span');
    hpLabelEl.className = 'tower-hp-label';
    hpLabelEl.textContent = def.shortName;
    const hpTrack = document.createElement('div');
    hpTrack.className = 'tower-hp-track';
    const hpFillEl = document.createElement('div');
    hpFillEl.className = 'tower-hp-fill';
    hpTrack.appendChild(hpFillEl);
    hpEl.append(hpLabelEl, hpTrack);
    this.overlayEl.appendChild(hpEl);

    const tower: TowerEntity = {
      id: `${towerId}_${Date.now()}_${Math.random()}`,
      defId: towerId,
      def,
      col,
      row,
      x: cx,
      y: cy,
      wx,
      wz,
      level,
      effectiveCost: opts.effectiveCost,
      totalInvested: opts.totalInvested,
      hp: Math.min(opts.maxHp, opts.hp),
      maxHp: opts.maxHp,
      priority: opts.priority,
      turretAngle: opts.turretAngle,
      cooldownTimer: 0,
      empTimer: 0,
      empDisabledTimer: 0,
      burnTimer: 0,
      burnDps: 0,
      smokeTimer: 0,
      trophyTimer: 0,
      interceptTimer: 0,
      laserTargetId: 0,
      laserFocusTime: 0,
      laserTickAccum: 0,
      laserBeams: [],
      muzzleFlashTimer: 0,
      totalDamage: opts.totalDamage,
      kills: opts.kills,
      recoil: 0,
      rig,
      hpEl,
      hpFillEl,
      hpLabelEl
    };

    if (rig.turretPivot) {
      rig.turretPivot.rotation.y = tower.turretAngle;
    }

    if (towerId === 'ew_crew' || towerId === 'iron_dome') {
      const pulseMesh = new THREE.Mesh(
        this.ewPulseGeo,
        new THREE.MeshBasicMaterial({
          color: towerId === 'iron_dome' ? 0x2dd4bf : 0xa855f7,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.35,
          depthWrite: false
        })
      );
      pulseMesh.rotation.x = -Math.PI / 2;
      pulseMesh.position.set(wx, 0.1, wz);
      this.scene.add(pulseMesh);
      tower.ewPulseMesh = pulseMesh;
    }

    this.towers.push(tower);
    this.towerGrid[row][col] = tower;
    return tower;
  }

  tryPlaceTower(col: number, row: number, towerId: string) {
    const def = (TOWER_DEFINITIONS as any)[towerId];
    if (!def) return;
    if (!saveManager.isTowerUnlocked(towerId)) return;

    const effectiveCost = this.getEffectiveTowerCost(towerId);
    if (this.budget < effectiveCost) {
      this.pushRadio(`Orçamento insuficiente para ${def.shortName} ($${effectiveCost}).`, 'warn');
      audio.playUi('error');
      return;
    }

    const groundEnemies = this.enemyPool.active.filter((e: EnemyEntity) => e.domain === 'ground');
    const check = this.pathfinder.canPlaceAt(col, row, groundEnemies);
    if (!check.ok) {
      this.pushRadio(check.reason, 'alert');
      const { x, z } = cellToWorldCenter(col, row);
      this.spawnFloatingText(x, 2.2, z, 'ROTA BLOQUEADA!', '#ef4444');
      audio.playUi('error');
      return;
    }

    this.budget -= effectiveCost;
    const maxHp = this.getEffectiveTowerMaxHp(towerId, 1);
    const tower = this.spawnTowerOnGrid({
      col,
      row,
      towerId,
      level: 1,
      hp: maxHp,
      maxHp,
      effectiveCost,
      totalInvested: effectiveCost,
      priority: def.defaultPriority,
      turretAngle: Math.PI / 2,
      totalDamage: 0,
      kills: 0
    });

    this.refreshGlobalBuffs();
    this.rerouteActiveGroundEnemies();
    this.rebuildActiveRouteLines();
    this.evaluatePlacementPreview();
    this.saveCurrentMissionSnapshot();

    audio.playUi('build');
    this.spawnFloatingText(tower.wx, 2.5, tower.wz, `-$${effectiveCost}`, '#facc15');
    this.emitFullHudSync();

    if (!def.isBarrier && !this.shiftHeld) {
      this.cancelActiveTool();
      this.selectTower(tower);
    }
  }

  upgradeSelectedTower() {
    const t = this.selectedTower;
    if (!t || t.def.isBarrier) return;
    const nextSpec = t.def.levels[t.level];
    if (!nextSpec) return;

    if (this.budget < nextSpec.upgradeCost) {
      this.pushRadio(`Falta orçamento para upgrade ($${nextSpec.upgradeCost}).`, 'warn');
      audio.playUi('error');
      return;
    }

    const oldRatio = t.maxHp > 0 ? t.hp / t.maxHp : 1;
    this.budget -= nextSpec.upgradeCost;
    t.totalInvested += nextSpec.upgradeCost;
    t.level += 1;
    t.maxHp = this.getEffectiveTowerMaxHp(t.defId, t.level);
    t.hp = Math.min(t.maxHp, Math.round(t.maxHp * Math.max(oldRatio, 0.55) + 150));

    this.scene.remove(t.rig.root);
    if (t.laserLine) {
      this.scene.remove(t.laserLine);
      t.laserLine = undefined;
    }
    for (const lb of t.laserBeams) {
      this.scene.remove(lb);
    }
    t.laserBeams = [];

    t.rig = createTowerModel3D(t.defId, t.level);
    t.rig.root.position.set(t.wx, 0, t.wz);
    if (t.rig.turretPivot) {
      t.rig.turretPivot.rotation.y = t.turretAngle;
    }
    this.scene.add(t.rig.root);

    this.refreshGlobalBuffs();
    this.rebuildSelectedTowerOverlay();
    this.saveCurrentMissionSnapshot();
    audio.playUi('build');
    this.spawnFloatingText(t.wx, 3.2, t.wz, `UPGRADE NV${t.level}!`, '#38bdf8');
    this.pushRadio(`${t.def.shortName} promovida para ${nextSpec.name}.`, 'info');
    bus.emit('hud:selectedTower', this.serializeTower(t));
    this.emitFullHudSync();
  }

  getRepairCost(t: TowerEntity): number {
    if (!t || t.hp >= t.maxHp) return 0;
    const missingRatio = (t.maxHp - t.hp) / t.maxHp;
    return Math.max(10, Math.ceil(missingRatio * t.effectiveCost * 0.5));
  }

  repairSelectedTower() {
    const t = this.selectedTower;
    if (!t) return;
    if (t.hp >= t.maxHp) {
      this.pushRadio(`${t.def.shortName} já está com integridade máxima.`, 'info');
      return;
    }
    const cost = this.getRepairCost(t);
    if (this.budget < cost) {
      this.pushRadio(`Orçamento insuficiente para reparar ($${cost} necessário).`, 'warn');
      audio.playUi('error');
      return;
    }

    this.budget -= cost;
    t.hp = t.maxHp;
    t.burnTimer = 0;
    this.saveCurrentMissionSnapshot();
    audio.playUi('repair');
    this.effects.spawnSparks(t.wx, 1.4, t.wz, 6, 0x38bdf8);
    this.spawnFloatingText(t.wx, 2.8, t.wz, `REPARADO -$${cost}`, '#38bdf8');
    bus.emit('hud:selectedTower', this.serializeTower(t));
    this.emitFullHudSync();
  }

  sellSelectedTower() {
    const t = this.selectedTower;
    if (!t) return;

    const refund = Math.floor(t.totalInvested * 0.75 * Math.max(0.4, t.hp / t.maxHp));
    this.budget += refund;
    this.removeTowerFromMap(t);
    this.saveCurrentMissionSnapshot(true);

    audio.playUi('click');
    this.spawnFloatingText(t.wx, 2.4, t.wz, `+$${refund}`, '#4ade80');
    this.selectTower(null);
    this.emitFullHudSync();
  }

  private cleanupTowerVisuals(t: TowerEntity) {
    this.scene.remove(t.rig.root);
    if (t.laserLine) this.scene.remove(t.laserLine);
    for (const lb of t.laserBeams) this.scene.remove(lb);
    if (t.ewPulseMesh) this.scene.remove(t.ewPulseMesh);
    t.hpEl.remove();
  }

  private removeTowerFromMap(t: TowerEntity) {
    this.towerGrid[t.row][t.col] = null;
    this.towers = this.towers.filter((item) => item !== t);
    this.cleanupTowerVisuals(t);
    this.pathfinder.removeStructure(t.col, t.row);
    this.refreshGlobalBuffs();
    this.rerouteActiveGroundEnemies();
    this.rebuildActiveRouteLines();
    if (this.selectedTower === t) {
      this.selectTower(null);
    }
  }

  setSelectedTowerPriority(prio: string) {
    const t = this.selectedTower;
    if (!t || t.def.isBarrier) return;
    t.priority = prio;
    this.saveCurrentMissionSnapshot();
    audio.playUi('click');
    bus.emit('hud:selectedTower', this.serializeTower(t));
  }

  private refreshGlobalBuffs() {
    this.hasGlobalAesa = this.towers.some(
      (t) => t.defId === 'patriot' && t.def.levels[t.level - 1].globalStealthReveal
    );
  }

  private rerouteActiveGroundEnemies() {
    this.enemyPool.forEachActive((obj) => {
      const enemy = obj as EnemyEntity;
      if (enemy.domain !== 'ground') return;
      const ec = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(enemy.x / TILE_SIZE)));
      const er = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(enemy.y / TILE_SIZE)));
      const newPath = this.pathfinder.findPath(ec, er);
      if (newPath && newPath.length > 0) {
        enemy.path = newPath;
        enemy.pathIndex = newPath.length > 1 ? 1 : 0;
      }
    });
  }

  setSpeed(speed: number) {
    if (speed === 0) {
      this.timeScale = 0;
    } else {
      this.timeScale = speed;
      this.lastNonZeroSpeed = speed;
    }
    audio.playUi('click');
    bus.emit('hud:speed', this.timeScale);
  }

  togglePause() {
    this.setSpeed(this.timeScale === 0 ? this.lastNonZeroSpeed : 0);
  }

  startNextWave(isManualCall = false) {
    if (this.gameOver || this.victory) return;
    if (this.waveActive && (this.spawnQueue.length > 0 || this.currentWave >= this.totalWaves)) return;
    if (this.currentWave >= this.totalWaves) return;

    if (isManualCall && (this.inIntermission || (this.waveActive && this.spawnQueue.length === 0))) {
      const earlyBonus = Math.round(25 + Math.max(0, this.wavePrepTimer) * 2.5);
      this.budget += earlyBonus;
      this.spawnFloatingText(0, 4.5, -24, `BÔNUS ANTECIPADO +$${earlyBonus}`, '#4ade80');
      this.pushRadio(`Onda chamada antecipadamente! Bônus tático: +$${earlyBonus}.`, 'good');
    }

    this.currentWave += 1;
    this.inIntermission = false;
    this.wavePrepTimer = 0;
    this.waveActive = true;
    this.waveElapsed = 0;

    const waveDef = this.stageConfig.waves[this.currentWave - 1];
    const spawns = this.pathfinder.spawnPoints;
    const events: Array<{ time: number; type: string; spawnIdx: number }> = [];
    for (const grp of waveDef.groups) {
      for (let i = 0; i < grp.count; i++) {
        events.push({
          time: grp.delay + i * grp.interval,
          type: grp.type,
          spawnIdx: i % spawns.length
        });
      }
    }
    events.sort((a, b) => a.time - b.time);
    this.spawnQueue.push(...events);

    audio.playUi('wave');
    const hasBoss = waveDef.groups.some((g: any) => (ENEMY_DEFINITIONS as any)[g.type]?.isBoss);
    this.pushRadio(
      `ONDA ${this.currentWave}/${this.totalWaves}: ${waveDef.title} — ${waveDef.brief}`,
      hasBoss ? 'alert' : 'info'
    );
    this.saveCurrentMissionSnapshot(true);
    this.emitFullHudSync();
  }

  private spawnEnemy(type: string, spawnIdx: number, overridePos: any = null): EnemyEntity | null {
    const def = (ENEMY_DEFINITIONS as any)[type];
    if (!def) return null;

    const waveDef = this.stageConfig.waves[Math.max(0, this.currentWave - 1)];
    const hpMult = waveDef?.hpMult || 1.0;

    const e = this.enemyPool.acquire() as EnemyEntity;
    e.id = this.nextEnemyId++;
    e.type = type;
    e.domain = def.domain;
    e.armorClass = def.armorClass;
    e.maxHp = Math.round(def.maxHp * hpMult);
    e.hp = e.maxHp;
    e.speed = def.speed;
    e.reward = def.reward;
    e.wbReward = def.wbReward || 0;
    e.fobDamage = def.fobDamage;
    e.isMechanized = def.isMechanized;
    e.hasEra = def.hasEra;
    e.eraIntact = def.hasEra;
    e.hasAps = def.hasAps;
    e.apsCooldownTimer = 0;
    e.apsMaxCooldown = def.apsCooldown || 4.0;
    e.isStealth = def.isStealth;
    e.stealthRevealed = false;
    e.isBoss = !!def.isBoss;
    e.isSubBoss = !!def.isSubBoss;
    e.isStageBoss = !!def.isStageBoss;
    e.isMegaBoss = !!def.isMegaBoss;
    e.slowImmune = !!def.slowImmune;
    e.dismountCount = def.dismountCount || 0;
    e.radius = def.radius;
    e.ewSlow = 0;
    e.ewDamageAmp = 0;
    e.thermalVuln = 0;
    e.ewDisabled = false;
    e.stunTimer = 0;
    e.hitFlashTimer = 0;
    e.walkPhase = Math.random() * Math.PI * 2;
    e.towerAttackTimer = def.towerAttack ? Math.min(2.0, def.towerAttack.interval * 0.5) : 999;
    e.empPulseTimer = def.towerAttack?.empPulseInterval || 999;
    e.periodicSpawnTimer = def.periodicSpawn?.interval || 999;
    e.triggeredThresholds.clear();

    const sp = this.pathfinder.spawnPoints[spawnIdx % this.pathfinder.spawnPoints.length];
    if (overridePos) {
      e.x = overridePos.x;
      e.y = overridePos.y;
    } else {
      e.x = sp.col * TILE_SIZE + TILE_SIZE * 0.5;
      e.y = sp.row * TILE_SIZE + TILE_SIZE * 0.5 + (def.domain === 'air' ? (Math.random() - 0.5) * 44 : 0);
    }

    e.rig = createEnemyModel3D(type);
    this.scene.add(e.rig.root);

    if (def.domain === 'ground') {
      const col = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(e.x / TILE_SIZE)));
      const row = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(e.y / TILE_SIZE)));
      let path = this.pathfinder.findPath(col, row);
      if (!path && overridePos && overridePos.fallbackCol !== undefined) {
        path = this.pathfinder.findPath(overridePos.fallbackCol, overridePos.fallbackRow);
        e.x = overridePos.fallbackCol * TILE_SIZE + TILE_SIZE * 0.5;
        e.y = overridePos.fallbackRow * TILE_SIZE + TILE_SIZE * 0.5;
      }
      e.path = path || this.pathfinder.spawnPaths.get(sp.id) || null;
      e.pathIndex = e.path && e.path.length > 1 ? 1 : 0;
      e.distToFob = this.pathfinder.getDistanceToFobPx(e.x, e.y);
      e.angle = Math.PI / 2;
      e.wy = 0;
    } else {
      e.path = null;
      const fx = (this.pathfinder.fobPoint.col + 0.5) * TILE_SIZE;
      const fy = (this.pathfinder.fobPoint.row + 0.5) * TILE_SIZE;
      e.angle = Math.atan2(fx - e.x, fy - e.y);
      e.distToFob = Math.hypot(fx - e.x, fy - e.y);
      e.wy = getAirAltitude(type);
    }

    e.wx = simToWorldX(e.x);
    e.wz = simToWorldZ(e.y);
    e.rig.root.position.set(e.wx, 0, e.wz);
    e.rig.hullGroup.rotation.y = e.angle;
    e.hpLabelEl.textContent = def.shortName;
    e.hpEl.classList.toggle('boss', e.isBoss);
    this.updateEnemyHealthBar(e);

    if (e.isMegaBoss) {
      audio.playUi('alert');
      bus.emit('hud:alert', { level: 'mega', text: `🚨 ALERTA MÁXIMO: CHEFE SUPREMO NO SETOR (${def.name})!` });
    } else if (e.isStageBoss) {
      audio.playUi('alert');
      bus.emit('hud:alert', { level: 'boss', text: `🚨 ALERTA DE COMANDO: CHEFE DE FASE DETECTADO (${def.name})!` });
    } else if (e.isSubBoss) {
      audio.playUi('alert');
      bus.emit('hud:alert', { level: 'subboss', text: `⚠️ ALERTA: SUB-CHEFE DETECTADO (${def.name})!` });
    }

    return e;
  }

  private updateEnemyHealthBar(e: EnemyEntity) {
    const ratio = Math.max(0, Math.min(1, e.hp / e.maxHp));
    e.hpFillEl.style.width = `${ratio * 100}%`;
    e.hpFillEl.style.background = ratio > 0.55 ? '#22c55e' : ratio > 0.25 ? '#f59e0b' : '#ef4444';

    if (e.ewDisabled) {
      e.hpDotEl.style.background = '#c084fc';
      e.hpDotEl.classList.remove('hidden');
    } else if (e.hasAps && e.apsCooldownTimer <= 0) {
      e.hpDotEl.style.background = '#22d3ee';
      e.hpDotEl.classList.remove('hidden');
    } else if (e.hasEra && e.eraIntact) {
      e.hpDotEl.style.background = '#f97316';
      e.hpDotEl.classList.remove('hidden');
    } else {
      e.hpDotEl.classList.add('hidden');
    }
  }

  // === AIR SUPPORT STRIKES ===
  executeA10Strafe(cx: number, cy: number, angle: number) {
    const sup = this.airSupport.a10;
    if (this.budget < sup.cost || sup.timer > 0) return;

    this.budget -= sup.cost;
    sup.timer = sup.cooldown;
    this.cancelActiveTool();

    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    const len = 460;
    const startX = cx - dirX * (len * 0.5);
    const startY = cy - dirY * (len * 0.5);
    const endX = cx + dirX * (len * 0.5);
    const endY = cy + dirY * (len * 0.5);

    const jet = createA10Warthog3D();
    const startOffX = startX - dirX * 620;
    const startOffY = startY - dirY * 620;
    const yaw = Math.atan2(dirX, dirY);
    jet.position.set(simToWorldX(startOffX), 9.5, simToWorldZ(startOffY));
    jet.rotation.y = yaw;
    this.scene.add(jet);

    this.activeFlyovers.push({
      kind: 'a10',
      jet,
      x: startOffX,
      y: startOffY,
      dirX,
      dirY,
      yaw,
      speed: 860,
      strafeStartX: startX,
      strafeStartY: startY,
      strafeEndX: endX,
      strafeEndY: endY,
      progress: 0,
      burstTimer: 0,
      startedSound: false,
      totalDist: len + 1240
    });

    this.pushRadio('WARTHOG 1-1 EM APROXIMAÇÃO — GAU-8 30MM STRAFE RUN!', 'good');
    this.emitFullHudSync();
  }

  executeHellfireStrike(tx: number, ty: number) {
    const sup = this.airSupport.hellfire;
    if (this.budget < sup.cost || sup.timer > 0) return;

    this.budget -= sup.cost;
    sup.timer = sup.cooldown;
    this.cancelActiveTool();

    audio.playHellfireStrike();

    const p = this.projectilePool.acquire() as ProjectileEntity;
    p.kind = 'hellfire';
    const mMesh = createMissileMesh3D('hellfire');
    this.scene.add(mMesh);
    p.mesh = mMesh;

    const targetWx = simToWorldX(tx);
    const targetWz = simToWorldZ(ty);
    p.startWx = targetWx - 18;
    p.startWy = 32;
    p.startWz = targetWz - 24;
    p.wx = p.startWx;
    p.wy = p.startWy;
    p.wz = p.startWz;
    p.prevWx = p.wx;
    p.prevWy = p.wy;
    p.prevWz = p.wz;
    p.targetWx = targetWx;
    p.targetWy = 0.2;
    p.targetWz = targetWz;
    p.targetX = tx;
    p.targetY = ty;
    p.targetEnemy = null;
    p.targetId = 0;
    p.damage = 1050;
    p.damageType = 'heat';
    p.heavyMultiplier = 1.75;
    p.tandemHeat = true;
    p.splashRadius = 115;
    p.burnDps = 0;
    p.burnDuration = 0;
    p.isMissile = false;
    p.isTopAttack = false;
    p.isArtillery = true;
    p.flightTime = 0;
    p.totalFlightTime = 0.44;
    p.sourceTower = null;
    p.smokeTimer = 0;
    p.life = 2.0;

    mMesh.position.set(p.wx, p.wy, p.wz);
    mMesh.lookAt(p.targetWx, p.targetWy, p.targetWz);

    this.pushRadio('REAPER 2-1: Míssil AGM-114 Hellfire lançado no designador laser!', 'good');
    this.emitFullHudSync();
  }

  executeB52CarpetBomb(cx: number, cy: number) {
    const sup = this.airSupport.b52;
    if (this.budget < sup.cost || sup.timer > 0) return;

    this.budget -= sup.cost;
    sup.timer = sup.cooldown;
    this.cancelActiveTool();

    const dirX = 1;
    const dirY = 0;
    const len = 760;
    const startX = cx - len * 0.5;
    const endX = cx + len * 0.5;
    const startOffX = startX - 580;

    const jet = createB52Bomber3D();
    const yaw = Math.PI / 2;
    jet.position.set(simToWorldX(startOffX), 12.5, simToWorldZ(cy));
    jet.rotation.y = yaw;
    this.scene.add(jet);

    this.activeFlyovers.push({
      kind: 'b52',
      jet,
      x: startOffX,
      y: cy,
      dirX,
      dirY,
      yaw,
      speed: 520,
      strafeStartX: startX,
      strafeStartY: cy,
      strafeEndX: endX,
      strafeEndY: cy,
      progress: 0,
      burstTimer: 0,
      startedSound: false,
      totalDist: len + 1160
    });

    this.pushRadio('STRATOFORTRESS B-52 EM ROTA DE BOMBARDEIO EM TAPETE!', 'good');
    this.emitFullHudSync();
  }

  // === MAIN LOOP ===
  private loop = (now: number) => {
    this.rafId = requestAnimationFrame(this.loop);
    const rawDelta = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;
    const realDt = Math.min(0.05, Math.max(0, rawDelta));
    this.elapsedReal += realDt;

    for (let i = 0; i < this.flashLights.length; i++) {
      if (this.flashLightTimers[i] > 0) {
        this.flashLightTimers[i] -= realDt;
        if (this.flashLightTimers[i] <= 0) {
          this.flashLights[i].intensity = 0;
        }
      }
    }

    this.updateCameraPan(realDt);
    this.controls.update();
    if (this.diorama) this.diorama.update(this.elapsedReal, realDt);

    if (this.hitStopTimer > 0) {
      this.hitStopTimer -= realDt;
      this.updateCameraShake(realDt);
      this.composer.render();
      return;
    }

    const dt = this.gameOver ? 0 : realDt * this.timeScale;

    if (dt > 0) {
      for (const key of ['a10', 'hellfire', 'b52'] as const) {
        if (this.airSupport[key].timer > 0) {
          this.airSupport[key].timer = Math.max(0, this.airSupport[key].timer - dt);
        }
      }

      this.updateWaveState(dt);
      this.updateEwFields(dt);
      this.updateFireZones(dt);
      this.updateEnemies(dt);
      this.updatePendingShots(dt);
      this.updateTowers(dt);
      this.updateProjectiles(dt);
      this.updateBossProjectiles(dt);
      this.updateFlyovers(dt);
      this.effects.update(dt);
      this.updateFloatingTexts(dt);
    }

    this.updateInteractiveOverlays();
    this.updateProjectedDomBars();
    this.updateCameraShake(realDt);
    this.composer.render();

    this.hudSyncAccum += realDt;
    if (this.hudSyncAccum >= 0.1) {
      this.hudSyncAccum = 0;
      this.emitFullHudSync();
      if (this.selectedTower) {
        bus.emit('hud:selectedTower', this.serializeTower(this.selectedTower));
      }
    }

    this.autosaveAccum += realDt;
    if (this.autosaveAccum >= 10.0) {
      this.autosaveAccum = 0;
      this.saveCurrentMissionSnapshot();
    }
  };

  private updateCameraPan(realDt: number) {
    let forward = 0;
    let right = 0;
    if (this.keysDown.has('w') || this.keysDown.has('arrowup')) forward += 1;
    if (this.keysDown.has('s') || this.keysDown.has('arrowdown')) forward -= 1;
    if (this.keysDown.has('d') || this.keysDown.has('arrowright')) right += 1;
    if (this.keysDown.has('a') || this.keysDown.has('arrowleft')) right -= 1;
    if (forward === 0 && right === 0) return;

    const panSpeed = 46 * realDt;
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();
    const camRight = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

    const move = new THREE.Vector3()
      .addScaledVector(camDir, forward * panSpeed)
      .addScaledVector(camRight, right * panSpeed);

    const nextTarget = this.controls.target.clone().add(move);
    nextTarget.x = THREE.MathUtils.clamp(nextTarget.x, -BOARD_W * 0.55, BOARD_W * 0.55);
    nextTarget.z = THREE.MathUtils.clamp(nextTarget.z, -BOARD_D * 0.55, BOARD_D * 0.55);
    const actualMove = nextTarget.clone().sub(this.controls.target);

    this.controls.target.copy(nextTarget);
    this.camera.position.add(actualMove);
  }

  private updateWaveState(dt: number) {
    if (this.waveActive) {
      this.waveElapsed += dt;
      while (this.spawnQueue.length > 0 && this.spawnQueue[0].time <= this.waveElapsed) {
        const next = this.spawnQueue.shift()!;
        this.spawnEnemy(next.type, next.spawnIdx);
      }

      if (this.spawnQueue.length === 0 && this.enemyPool.activeCount === 0) {
        this.onWaveCleared();
      }
    } else if (this.inIntermission && this.currentWave < this.totalWaves) {
      this.wavePrepTimer -= dt;
      if (this.wavePrepTimer <= 0) {
        this.startNextWave(false);
      }
    }
  }

  private onWaveCleared() {
    this.waveActive = false;

    if (this.currentWave >= this.totalWaves) {
      this.victory = true;
      this.gameOver = true;
      const clearWB = this.stageConfig.clearBonusWB || 60;
      this.sessionWB += clearWB;
      const newlyUnlocked = saveManager.markStageCompleted(this.currentWorldId, this.currentStageId, clearWB);
      this.pushRadio(
        `VITÓRIA TOTAL! Fase ${this.stageConfig.id} concluída (+${clearWB} WB$).`,
        'good'
      );
      bus.emit('hud:gameover', {
        victory: true,
        wave: this.currentWave,
        totalWaves: this.totalWaves,
        kills: this.totalKills,
        damage: this.totalDamage,
        wbEarned: this.sessionWB,
        newlyUnlocked,
        worldId: this.currentWorldId,
        stageId: this.currentStageId
      });
      this.emitFullHudSync();
      return;
    }

    const interest = Math.min(180, Math.floor(this.budget * 0.05));
    if (interest > 0) {
      this.budget += interest;
      this.spawnFloatingText(0, 4.0, -18, `JUROS +5%: +$${interest}`, '#38bdf8');
      this.pushRadio(`Onda ${this.currentWave} neutralizada! Juros táticos (+5%): +$${interest}.`, 'good');
    } else {
      this.pushRadio(`Onda ${this.currentWave} neutralizada! Prepare ou repare suas defesas.`, 'good');
    }

    this.inIntermission = true;
    this.wavePrepTimer = 14.0;
    this.saveCurrentMissionSnapshot(true);
    this.emitFullHudSync();
  }

  private updateEwFields(dt: number) {
    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      e.ewSlow = 0;
      e.ewDamageAmp = 0;
      e.ewDisabled = false;
      e.stealthRevealed = this.hasGlobalAesa;
    });

    for (const tower of this.towers) {
      if (tower.defId !== 'ew_crew') continue;
      if (tower.empDisabledTimer > 0) continue;
      const spec = this.getEffectiveSpec(tower);

      if (tower.rig.radarPivots) {
        tower.rig.radarPivots.forEach((dish, idx) => {
          dish.rotation.y += dt * (2.4 + idx * 0.7);
        });
      }
      if (tower.rig.turretPivot) {
        tower.rig.turretPivot.rotation.y += dt * 0.8;
      }
      if (tower.rig.ewRings) {
        tower.rig.ewRings.forEach((ring, idx) => {
          const phase = (this.elapsedReal * 1.4 + idx * 0.5) % 1;
          ring.scale.setScalar(0.75 + phase * 1.35);
        });
      }
      if (tower.ewPulseMesh) {
        const rangeW = spec.range * WORLD_SCALE;
        const p = (this.elapsedReal * 0.75) % 1;
        tower.ewPulseMesh.scale.setScalar(Math.max(0.05, p * rangeW));
        (tower.ewPulseMesh.material as THREE.MeshBasicMaterial).opacity = 0.42 * (1 - p);
      }

      let triggeredEmp = false;
      if (spec.empInterval > 0) {
        tower.empTimer += dt;
        if (tower.empTimer >= spec.empInterval) {
          tower.empTimer = 0;
          triggeredEmp = true;
          audio.playShot('emp');
          this.effects.spawnShockwave(tower.wx, 0.25, tower.wz, spec.range * WORLD_SCALE, 0xc084fc);
        }
      }

      this.enemyPool.forEachActive((obj) => {
        const e = obj as EnemyEntity;
        const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
        if (dist <= spec.range) {
          if (!e.slowImmune) {
            e.ewSlow = Math.max(e.ewSlow, spec.slowFactor);
          }
          e.ewDamageAmp = Math.max(e.ewDamageAmp, spec.damageAmp);
          e.ewDisabled = true;
          e.stealthRevealed = true;

          if (triggeredEmp && e.isMechanized) {
            e.stunTimer = Math.max(e.stunTimer, spec.empStunDuration);
            this.applyDamageToEnemy(e, spec.damage, 'emp', tower, { allowApsIntercept: false });
            this.spawnFloatingText(e.wx, 2.5, e.wz, 'EMP STUN!', '#e879f9');
          }
        }
      });
    }
  }

  private spawnFireZone(x: number, y: number, radius: number, dps: number, duration: number) {
    if (this.fireZones.length >= 28) {
      const oldest = this.fireZones.shift()!;
      this.scene.remove(oldest.mesh);
    }
    const wx = simToWorldX(x);
    const wz = simToWorldZ(y);
    const mesh = new THREE.Mesh(this.fireZoneGeo, this.fireZoneMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(wx, 0.07, wz);
    mesh.scale.setScalar(radius * WORLD_SCALE);
    this.scene.add(mesh);

    this.fireZones.push({
      x,
      y,
      wx,
      wz,
      radius,
      dps,
      life: duration,
      maxLife: duration,
      tickAccum: 0,
      smokeAccum: 0,
      mesh
    });
  }

  private updateFireZones(dt: number) {
    for (let i = this.fireZones.length - 1; i >= 0; i--) {
      const fz = this.fireZones[i];
      fz.life -= dt;
      if (fz.life <= 0) {
        this.scene.remove(fz.mesh);
        this.fireZones.splice(i, 1);
        continue;
      }

      const pulse = 0.88 + Math.sin(this.elapsedReal * 9 + i) * 0.12;
      fz.mesh.scale.setScalar(fz.radius * WORLD_SCALE * pulse);

      fz.smokeAccum += dt;
      if (fz.smokeAccum >= 0.18) {
        fz.smokeAccum = 0;
        const ang = Math.random() * Math.PI * 2;
        const r = Math.random() * fz.radius * WORLD_SCALE * 0.65;
        this.effects.spawnSmokePuff(fz.wx + Math.cos(ang) * r, 0.25, fz.wz + Math.sin(ang) * r, 0xf97316, 0.45);
      }

      fz.tickAccum += dt;
      if (fz.tickAccum >= 0.25) {
        const tickDt = fz.tickAccum;
        fz.tickAccum = 0;
        const rSq = fz.radius * fz.radius;
        this.enemyPool.forEachActive((obj) => {
          const e = obj as EnemyEntity;
          if (e.domain !== 'ground') return;
          const dSq = (e.x - fz.x) ** 2 + (e.y - fz.y) ** 2;
          if (dSq <= rSq) {
            e.eraIntact = false;
            this.applyDamageToEnemy(e, fz.dps * tickDt, 'thermobaric', null, { allowApsIntercept: false });
          }
        });
      }
    }
  }

  private updateEnemies(dt: number) {
    const fobX = (this.pathfinder.fobPoint.col + 0.5) * TILE_SIZE;
    const fobY = (this.pathfinder.fobPoint.row + 0.5) * TILE_SIZE;

    this.clearGroup(this.stealthLockGroup);

    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      const def = (ENEMY_DEFINITIONS as any)[e.type];

      if (e.apsCooldownTimer > 0) {
        e.apsCooldownTimer = Math.max(0, e.apsCooldownTimer - dt);
      }

      if (e.hitFlashTimer > 0) {
        e.hitFlashTimer -= dt;
        if (e.hitFlashTimer <= 0 && e.rig) {
          e.rig.hitMeshes.forEach((m) => {
            const mat = m.material as THREE.MeshStandardMaterial;
            if (mat && (mat as any)._origEmissive !== undefined) {
              mat.emissive.setHex((mat as any)._origEmissive);
            }
          });
        }
      }

      if (e.rig) {
        if (e.rig.ewRing) e.rig.ewRing.visible = e.ewDisabled;
        if (e.rig.apsShield) {
          e.rig.apsShield.visible = e.hasAps && e.apsCooldownTimer <= 0 && !e.ewDisabled;
          e.rig.apsShield.rotation.y += dt * 1.2;
        }
        if (e.rig.eraMeshes && e.hasEra) {
          e.rig.eraMeshes.forEach((m) => (m.visible = e.eraIntact));
        }

        if (e.isStealth && e.rig.stealthMaterials) {
          const op = e.stealthRevealed ? 0.96 : 0.3;
          e.rig.stealthMaterials.forEach((m) => (m.opacity = op));
          if (e.stealthRevealed) {
            const lockRing = this.createCircleLoop(4, 0x22d3ee, 0.85);
            lockRing.position.set(e.wx, e.wy, e.wz);
            lockRing.rotation.y = Math.PI / 4 + this.elapsedReal * 2.0;
            lockRing.scale.setScalar(2.4);
            this.stealthLockGroup.add(lockRing);
          }
        }

        if (e.rig.rotors) {
          if (e.type === 'heli' || e.type === 'subboss_ka50') {
            e.rig.rotors[0].rotation.y += dt * 24;
            if (e.rig.rotors[1]) e.rig.rotors[1].rotation.y -= dt * 24;
          } else if (e.type === 'drone_swarm') {
            for (const prop of e.rig.rotors) {
              prop.rotation.z += dt * 34;
            }
          } else if (e.type === 'megaboss_kirov_airship') {
            for (const prop of e.rig.rotors) {
              prop.rotation.y += dt * 18;
            }
          } else if (e.isBoss && !e.ewDisabled && e.rig.rotors[0]) {
            e.rig.rotors[0].rotation.y += dt * 5.0;
          }
        }
      }

      if (e.stunTimer > 0) {
        e.stunTimer -= dt;
        this.updateEnemyHealthBar(e);
        return;
      }

      // === BOSS & SUB-BOSS SPECIAL SPAWNS ===
      if (def?.periodicSpawn && e.rig) {
        e.periodicSpawnTimer -= dt;
        if (e.periodicSpawnTimer <= 0) {
          e.periodicSpawnTimer = def.periodicSpawn.interval;
          this.spawnFloatingText(e.wx, e.wy + 3.0, e.wz, 'DRONES LANÇADOS!', '#facc15');
          const fallbackCol = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(e.x / TILE_SIZE)));
          const fallbackRow = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(e.y / TILE_SIZE)));
          for (let i = 0; i < def.periodicSpawn.count; i++) {
            this.spawnEnemy(def.periodicSpawn.type, 0, {
              x: Math.max(16, Math.min(MAP_WIDTH - 16, e.x + (Math.random() - 0.5) * 42)),
              y: Math.max(16, Math.min(MAP_HEIGHT - 16, e.y + (Math.random() - 0.5) * 42)),
              fallbackCol,
              fallbackRow
            });
          }
        }
      }

      // === BOSS WEAPON AI (ATTACKING PLAYER TOWERS) ===
      if (def?.towerAttack && this.towers.length > 0) {
        const atk = def.towerAttack;
        e.towerAttackTimer -= dt;
        if (e.towerAttackTimer <= 0) {
          const targets = this.findTowerTargetsForBoss(e, atk.range, atk.targets || 1, !!atk.preferAa);
          if (targets.length > 0) {
            e.towerAttackTimer = atk.interval;
            const primaryT = targets[0];
            if (e.rig?.turretPivot) {
              const localAngle = Math.atan2(primaryT.x - e.x, primaryT.y - e.y) - e.angle;
              e.rig.turretPivot.rotation.y = localAngle;
            }
            for (const tTower of targets) {
              this.spawnBossProjectile(e, tTower, atk);
            }
            if (this.elapsedReal - this.lastTowerAttackWarnTime > 6.5) {
              this.lastTowerAttackWarnTime = this.elapsedReal;
              bus.emit('hud:alert', {
                level: 'warn',
                text: `⚠️ ALERTA DE DEFESA: ${def.shortName} está atacando ${primaryT.def.shortName}!`
              });
            }
          } else {
            e.towerAttackTimer = 0.6;
          }
        }

        // Boss EMP Pulse (e.g., T-14 Armata)
        if (atk.empPulseInterval) {
          e.empPulseTimer -= dt;
          if (e.empPulseTimer <= 0) {
            e.empPulseTimer = atk.empPulseInterval;
            this.triggerBossEmpPulse(e, atk.empPulseRange || 250, atk.empDisableDuration || 2.0);
          }
        }
      }

      const moveSpeed = e.speed * (1 - e.ewSlow);

      if (e.domain === 'ground' && e.rig?.wheels) {
        for (const w of e.rig.wheels) {
          w.rotation.x += dt * moveSpeed * 0.14;
        }
      }

      if (e.domain === 'ground') {
        if (!e.path || e.pathIndex >= e.path.length) {
          const ec = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(e.x / TILE_SIZE)));
          const er = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(e.y / TILE_SIZE)));
          e.path = this.pathfinder.findPath(ec, er);
          e.pathIndex = e.path && e.path.length > 1 ? 1 : 0;
        }

        if (e.path && e.pathIndex < e.path.length) {
          const wp = e.path[e.pathIndex];
          const dx = wp.x - e.x;
          const dy = wp.y - e.y;
          const dist = Math.hypot(dx, dy);

          if (dist <= moveSpeed * dt + 2) {
            e.x = wp.x;
            e.y = wp.y;
            e.pathIndex += 1;
          } else {
            const targetAngle = Math.atan2(dx, dy);
            e.angle = rotateAngleTowards(e.angle, targetAngle, 10 * dt);
            e.x += (dx / dist) * moveSpeed * dt;
            e.y += (dy / dist) * moveSpeed * dt;
          }
        }
        e.distToFob = this.pathfinder.getDistanceToFobPx(e.x, e.y);
      } else {
        const dx = fobX - e.x;
        const dy = fobY - e.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 1) {
          const targetAngle = Math.atan2(dx, dy);
          e.angle = rotateAngleTowards(e.angle, targetAngle, 5 * dt);
          e.x += (dx / dist) * moveSpeed * dt;
          e.y += (dy / dist) * moveSpeed * dt;
        }
        e.distToFob = dist;
      }

      e.wx = simToWorldX(e.x);
      e.wz = simToWorldZ(e.y);

      if (e.rig) {
        e.rig.root.position.set(e.wx, 0, e.wz);
        e.rig.hullGroup.rotation.y = e.angle;
        if (e.rig.turretPivot && !def?.towerAttack) {
          e.rig.turretPivot.rotation.y = Math.sin(this.elapsedReal * 1.4 + e.id) * 0.25;
        }
        if (e.rig.legs && e.rig.legs.length > 0) {
          e.walkPhase += dt * moveSpeed * 0.16;
          for (let i = 0; i < e.rig.legs.length; i += 2) {
            const swing = Math.sin(e.walkPhase + i) * 0.55;
            e.rig.legs[i].rotation.x = swing;
            if (e.rig.legs[i + 1]) e.rig.legs[i + 1].rotation.x = -swing;
          }
        }
      }

      this.updateEnemyHealthBar(e);

      if (Math.hypot(fobX - e.x, fobY - e.y) < 22) {
        this.onEnemyBreachFob(e);
      }
    });
  }

  private findTowerTargetsForBoss(e: EnemyEntity, range: number, maxTargets: number, preferAa: boolean): TowerEntity[] {
    const rSq = range * range;
    const inRange: Array<{ tower: TowerEntity; score: number }> = [];

    for (const t of this.towers) {
      const dSq = (t.x - e.x) ** 2 + (t.y - e.y) ** 2;
      if (dSq > rSq) continue;
      // Taunt Abrams Bunker draws boss fire first!
      let priorityScore = dSq;
      if (t.def.isTauntTank) priorityScore -= 1e8;
      else if (preferAa && (t.def.domain === 'air' || t.def.domain === 'both')) priorityScore -= 1e6;
      else if (t.def.isBarrier) priorityScore += 1e7; // Bosses prefer attacking armed towers over empty Hesco walls
      inRange.push({ tower: t, score: priorityScore });
    }

    inRange.sort((a, b) => a.score - b.score);
    return inRange.slice(0, maxTargets).map((item) => item.tower);
  }

  private triggerBossEmpPulse(e: EnemyEntity, range: number, disableDuration: number) {
    audio.playShot('emp');
    this.effects.spawnShockwave(e.wx, 0.4, e.wz, range * WORLD_SCALE, 0xa855f7);
    this.spawnFloatingText(e.wx, 3.4, e.wz, 'PULSO EMP HOSTIL!', '#c084fc');

    for (const t of this.towers) {
      if (t.def.isBarrier) continue;
      const dist = Math.hypot(t.x - e.x, t.y - e.y);
      if (dist > range) continue;

      // Protected if within range of an operational Iron Dome or EW Crew
      const isProtected = this.towers.some(
        (p) =>
          p !== t &&
          p.empDisabledTimer <= 0 &&
          (p.def.isIronDome || p.defId === 'ew_crew') &&
          Math.hypot(p.x - t.x, p.y - t.y) <= p.def.levels[p.level - 1].range
      );
      if (!isProtected) {
        t.empDisabledTimer = Math.max(t.empDisabledTimer, disableDuration);
        this.spawnFloatingText(t.wx, 2.5, t.wz, 'EMP DESATIVADA!', '#c084fc');
      } else {
        this.spawnFloatingText(t.wx, 2.5, t.wz, 'EMP BLOQUEADO!', '#2dd4bf');
      }
    }
  }

  private spawnBossProjectile(e: EnemyEntity, targetTower: TowerEntity, atk: any) {
    const startWx = e.wx;
    const startWy = Math.max(1.4, e.wy + 0.8);
    const startWz = e.wz;
    const targetWx = targetTower.wx;
    const targetWy = 1.0;
    const targetWz = targetTower.wz;

    let mesh: THREE.Object3D;
    if (atk.projectileKind === 'boss_autocannon') {
      mesh = new THREE.Mesh(this.bulletGeo, this.bossBulletMat);
      mesh.scale.set(1.6, 1.6, 1.5);
    } else if (atk.projectileKind === 'boss_shell') {
      mesh = new THREE.Mesh(this.shellGeo, this.bossShellMat);
      mesh.scale.setScalar(1.35);
    } else {
      mesh = createMissileMesh3D('boss_missile');
    }

    mesh.position.set(startWx, startWy, startWz);
    this.scene.add(mesh);
    audio.playShot(atk.projectileKind === 'boss_autocannon' ? 'autocannon' : 'missile');
    this.effects.spawnSparks(startWx, startWy, startWz, 3, 0xef4444);

    const dist = Math.hypot(targetTower.x - e.x, targetTower.y - e.y);
    const speed = atk.projectileKind === 'boss_autocannon' ? 620 : 340;

    this.bossProjectiles.push({
      kind: atk.projectileKind,
      mesh,
      wx: startWx,
      wy: startWy,
      wz: startWz,
      startWx,
      startWy,
      startWz,
      targetWx,
      targetWy,
      targetWz,
      targetTower,
      targetX: targetTower.x,
      targetY: targetTower.y,
      damage: atk.damage,
      splashRadius: atk.splashRadius || 0,
      burnDps: atk.burnDps || 0,
      burnDuration: atk.burnDuration || 0,
      flightTime: 0,
      totalFlightTime: Math.max(0.32, dist / speed),
      smokeTimer: 0,
      alive: true
    });
  }

  private updateBossProjectiles(dt: number) {
    for (let i = this.bossProjectiles.length - 1; i >= 0; i--) {
      const bp = this.bossProjectiles[i];
      if (!bp.alive) {
        this.scene.remove(bp.mesh);
        this.bossProjectiles.splice(i, 1);
        continue;
      }

      bp.flightTime += dt;
      const prog = Math.min(1, bp.flightTime / bp.totalFlightTime);
      const prevWx = bp.wx;
      const prevWy = bp.wy;
      const prevWz = bp.wz;

      const peak = bp.kind === 'boss_autocannon' ? 0.5 : 5.5;
      bp.wx = THREE.MathUtils.lerp(bp.startWx, bp.targetWx, prog);
      bp.wz = THREE.MathUtils.lerp(bp.startWz, bp.targetWz, prog);
      bp.wy = THREE.MathUtils.lerp(bp.startWy, bp.targetWy, prog) + Math.sin(prog * Math.PI) * peak;

      bp.mesh.position.set(bp.wx, bp.wy, bp.wz);
      bp.mesh.lookAt(bp.wx + (bp.wx - prevWx) + 0.0001, bp.wy + (bp.wy - prevWy), bp.wz + (bp.wz - prevWz));

      if (bp.kind !== 'boss_autocannon') {
        bp.smokeTimer += dt;
        if (bp.smokeTimer >= 0.03) {
          bp.smokeTimer = 0;
          this.effects.spawnSmokePuff(bp.wx, bp.wy, bp.wz, 0xfca5a5, 0.4);
        }
      }

      // Check Iron Dome & Abrams Trophy APS interception mid-flight!
      if (prog > 0.25 && prog < 0.92 && this.tryInterceptBossProjectile(bp)) {
        bp.alive = false;
        this.scene.remove(bp.mesh);
        this.bossProjectiles.splice(i, 1);
        continue;
      }

      if (prog >= 1) {
        this.detonateBossProjectile(bp);
        bp.alive = false;
        this.scene.remove(bp.mesh);
        this.bossProjectiles.splice(i, 1);
      }
    }
  }

  private tryInterceptBossProjectile(bp: BossProjectileEntity): boolean {
    const curX = worldToSimX(bp.wx);
    const curY = worldToSimY(bp.wz);

    // 1. Check Iron Dome batteries protecting targetTower or covering projectile path
    for (const t of this.towers) {
      if (!t.def.isIronDome || t.empDisabledTimer > 0) continue;
      if (t.interceptTimer > 0) continue;
      const spec = this.getEffectiveSpec(t);
      const distToTarget = Math.hypot(bp.targetX - t.x, bp.targetY - t.y);
      const distToProj = Math.hypot(curX - t.x, curY - t.y);
      if (distToTarget <= spec.range || distToProj <= spec.range) {
        t.interceptTimer = spec.interceptCooldown;
        t.muzzleFlashTimer = 0.08;
        audio.playApsIntercept();
        this.effects.spawnExplosion(bp.wx, bp.wy, bp.wz, 0.65, 0x2dd4bf, false);
        this.spawnFloatingText(bp.wx, bp.wy + 1.5, bp.wz, 'IRON DOME INTERCEPT!', '#2dd4bf');
        return true;
      }
    }

    // 2. Check Abrams Trophy APS (Lv2+) if targeting Abrams itself
    const tt = bp.targetTower;
    if (tt && tt.hp > 0 && tt.defId === 'abrams_pit' && tt.empDisabledTimer <= 0) {
      const spec = tt.def.levels[tt.level - 1];
      if (spec.trophyCooldown > 0 && tt.trophyTimer <= 0 && Math.hypot(curX - tt.x, curY - tt.y) <= 65) {
        tt.trophyTimer = spec.trophyCooldown;
        audio.playApsIntercept();
        this.effects.spawnShockwave(tt.wx, 1.2, tt.wz, 2.2, 0x84cc16);
        this.spawnFloatingText(tt.wx, 2.8, tt.wz, 'TROPHY APS!', '#a3e635');
        return true;
      }
    }

    return false;
  }

  private detonateBossProjectile(bp: BossProjectileEntity) {
    this.effects.spawnExplosion(bp.targetWx, 0.9, bp.targetWz, bp.splashRadius > 40 ? 1.15 : 0.7, 0xef4444, true);
    audio.playExplosion(bp.splashRadius > 40 ? 0.9 : 0.55);

    if (bp.splashRadius > 0) {
      const rSq = bp.splashRadius * bp.splashRadius;
      const snapshot = [...this.towers];
      for (const t of snapshot) {
        const dSq = (t.x - bp.targetX) ** 2 + (t.y - bp.targetY) ** 2;
        if (dSq <= rSq) {
          const dist = Math.sqrt(dSq);
          const falloff = t === bp.targetTower ? 1.0 : Math.max(0.45, 1 - (dist / bp.splashRadius) * 0.55);
          this.damageTower(t, bp.damage * falloff, bp.burnDps, bp.burnDuration);
        }
      }
    } else if (this.towers.includes(bp.targetTower)) {
      this.damageTower(bp.targetTower, bp.damage, bp.burnDps, bp.burnDuration);
    }
  }

  private damageTower(tower: TowerEntity, rawDamage: number, burnDps = 0, burnDuration = 0) {
    if (!this.towers.includes(tower) || tower.hp <= 0) return;

    // Check nearby Iron Dome Lv1-3 armor shield buff
    let shieldReduction = 0;
    for (const p of this.towers) {
      if (!p.def.isIronDome || p.empDisabledTimer > 0) continue;
      const spec = p.def.levels[p.level - 1];
      if (spec.towerShieldReduction > 0 && Math.hypot(p.x - tower.x, p.y - tower.y) <= spec.range) {
        shieldReduction = Math.max(shieldReduction, spec.towerShieldReduction);
      }
    }

    const dmg = Math.max(1, Math.round(rawDamage * (1 - shieldReduction)));
    tower.hp -= dmg;

    if (burnDps > 0 && burnDuration > 0) {
      tower.burnDps = Math.max(tower.burnDps, burnDps);
      tower.burnTimer = Math.max(tower.burnTimer, burnDuration);
    }

    if (Math.random() < 0.75) {
      this.spawnFloatingText(tower.wx, 2.6, tower.wz, `-${dmg} HP`, '#fb923c');
    }

    if (tower.hp <= 0) {
      tower.hp = 0;
      this.effects.spawnExplosion(tower.wx, 1.0, tower.wz, 1.65, 0xef4444, true);
      this.effects.spawnCrater(tower.wx, tower.wz, 1.2);
      audio.playExplosion(1.35);
      this.addTrauma(0.42);
      this.triggerFlashLight(tower.wx, 2.2, tower.wz, 0xff6b2b, 6.0, 0.14);
      this.pushRadio(`🚨 DEFESA DESTRUÍDA! ${tower.def.name} caiu em combate!`, 'alert');
      this.spawnFloatingText(tower.wx, 3.0, tower.wz, 'TORRE DESTRUÍDA!', '#ef4444');
      this.removeTowerFromMap(tower);
      this.saveCurrentMissionSnapshot(true);
    } else if (this.selectedTower === tower) {
      bus.emit('hud:selectedTower', this.serializeTower(tower));
    }
  }

  private onEnemyBreachFob(e: EnemyEntity) {
    this.fobHp = Math.max(0, this.fobHp - e.fobDamage);
    this.addTrauma(0.38);
    audio.playExplosion(1.1);
    this.spawnFloatingText(e.wx, 2.5, e.wz, `-${e.fobDamage} FOB!`, '#ef4444');
    this.pushRadio(`FOB ATINGIDA por ${e.type.toUpperCase()} (-${e.fobDamage} Integridade)!`, 'alert');
    this.enemyPool.release(e);

    if (this.fobHp <= 0 && !this.gameOver) {
      this.gameOver = true;
      this.victory = false;
      saveManager.clearActiveMission();
      this.pushRadio('FOB DESTRUÍDA! Linha de defesa rompida.', 'alert');
      bus.emit('hud:gameover', {
        victory: false,
        wave: this.currentWave,
        totalWaves: this.totalWaves,
        kills: this.totalKills,
        damage: this.totalDamage,
        wbEarned: this.sessionWB,
        newlyUnlocked: null,
        worldId: this.currentWorldId,
        stageId: this.currentStageId
      });
    }
    this.emitFullHudSync();
  }

  private updatePendingShots(dt: number) {
    for (let i = this.pendingShots.length - 1; i >= 0; i--) {
      const shot = this.pendingShots[i];
      shot.delay -= dt;
      if (shot.delay <= 0) {
        this.pendingShots.splice(i, 1);
        if (shot.tower && this.towers.includes(shot.tower)) {
          let activeTarget: any =
            shot.target && shot.target._pooledActive && shot.target.id === shot.targetId
              ? shot.target
              : null;
          if (!activeTarget) {
            const cands = this.findTargetsInRange(shot.tower, shot.spec);
            activeTarget = cands[0] || null;
          }
          if (activeTarget) {
            this.fireTowerProjectile(shot.tower, activeTarget, shot.spec, shot.offsetAngle || 0);
          } else {
            this.fireTowerProjectile(
              shot.tower,
              { x: shot.fallbackX, y: shot.fallbackY, id: 0, wy: 0.5 },
              shot.spec,
              shot.offsetAngle || 0
            );
          }
        }
      }
    }
  }

  private updateTowers(dt: number) {
    for (const tower of this.towers) {
      // Burn & smoke damage visuals for all towers
      if (tower.burnTimer > 0) {
        tower.burnTimer -= dt;
        const bDmg = tower.burnDps * dt;
        tower.hp -= bDmg;
        if (tower.hp <= 0) {
          this.damageTower(tower, 1);
          continue;
        }
      }

      if (tower.hp < tower.maxHp * 0.4) {
        tower.smokeTimer -= dt;
        if (tower.smokeTimer <= 0) {
          tower.smokeTimer = 0.28;
          this.effects.spawnSmokePuff(tower.wx, 1.35, tower.wz, 0x22262c, 0.55);
        }
      }

      if (tower.empDisabledTimer > 0) {
        tower.empDisabledTimer = Math.max(0, tower.empDisabledTimer - dt);
        for (const lb of tower.laserBeams) lb.visible = false;
        if (tower.laserLine) tower.laserLine.visible = false;
        if (tower.rig.muzzleFlashMesh) tower.rig.muzzleFlashMesh.visible = false;
        continue;
      }

      const spec = this.getEffectiveSpec(tower);
      tower.trophyTimer = Math.max(0, tower.trophyTimer - dt);
      tower.interceptTimer = Math.max(0, tower.interceptTimer - dt);

      // Iron Dome continuous healing & radar rotation
      if (tower.def.isIronDome) {
        if (tower.rig.radarPivots) {
          tower.rig.radarPivots.forEach((p) => (p.rotation.y += dt * 3.0));
        }
        if (tower.rig.ewRings) {
          tower.rig.ewRings.forEach((r) => {
            const phase = (this.elapsedReal * 1.2) % 1;
            r.scale.setScalar(0.85 + phase * 0.45);
          });
        }
        if (tower.ewPulseMesh) {
          const rangeW = spec.range * WORLD_SCALE;
          const p = (this.elapsedReal * 0.65) % 1;
          tower.ewPulseMesh.scale.setScalar(Math.max(0.05, p * rangeW));
          (tower.ewPulseMesh.material as THREE.MeshBasicMaterial).opacity = 0.3 * (1 - p);
        }
        if (spec.healPerSec > 0) {
          for (const ally of this.towers) {
            if (ally.hp < ally.maxHp && Math.hypot(ally.x - tower.x, ally.y - tower.y) <= spec.range) {
              ally.hp = Math.min(ally.maxHp, ally.hp + spec.healPerSec * dt);
            }
          }
        }
      }

      if (tower.def.isBarrier || tower.def.isSupportAura) continue;

      tower.cooldownTimer = Math.max(0, tower.cooldownTimer - dt);
      tower.recoil = Math.max(0, tower.recoil - dt * 1.4);

      if (tower.muzzleFlashTimer > 0) {
        tower.muzzleFlashTimer -= dt;
        if (tower.rig.muzzleFlashMesh) {
          tower.rig.muzzleFlashMesh.visible = tower.muzzleFlashTimer > 0;
          if (tower.muzzleFlashTimer > 0) {
            tower.rig.muzzleFlashMesh.rotation.z += dt * 45;
          }
        }
      } else if (tower.rig.muzzleFlashMesh && tower.rig.muzzleFlashMesh.visible) {
        tower.rig.muzzleFlashMesh.visible = false;
      }

      if (tower.rig.missileCaps && spec.fireRate > 0) {
        const showMissile = tower.cooldownTimer < 1 / spec.fireRate - 0.35;
        tower.rig.missileCaps.forEach((m) => (m.visible = showMissile));
      }

      if (tower.rig.barrelPivot) {
        if ((tower.rig.barrelPivot as any)._baseZ === undefined) {
          (tower.rig.barrelPivot as any)._baseZ = tower.rig.barrelPivot.position.z;
        }
        tower.rig.barrelPivot.position.z = (tower.rig.barrelPivot as any)._baseZ - tower.recoil;
      }

      const candidates = this.findTargetsInRange(tower, spec);
      if (candidates.length === 0) {
        if (tower.laserLine) tower.laserLine.visible = false;
        for (const lb of tower.laserBeams) lb.visible = false;
        tower.laserTargetId = 0;
        tower.laserFocusTime = 0;
        continue;
      }

      if (tower.rig.gatlingPivot) {
        tower.rig.gatlingPivot.rotation.z += dt * 28;
      }

      const primary = candidates[0];
      const desiredAngle = Math.atan2(primary.x - tower.x, primary.y - tower.y);
      tower.turretAngle = rotateAngleTowards(tower.turretAngle, desiredAngle, (tower.def.turnRate || 8) * dt);

      if (tower.rig.turretPivot) {
        tower.rig.turretPivot.rotation.y = tower.turretAngle;
      }

      if (spec.laserSight && tower.rig.muzzlePoint) {
        const mPos = new THREE.Vector3();
        tower.rig.muzzlePoint.getWorldPosition(mPos);
        const tPos = new THREE.Vector3(primary.wx, primary.wy + 0.6, primary.wz);
        if (!tower.laserLine) {
          const geo = new THREE.BufferGeometry().setFromPoints([mPos, tPos]);
          tower.laserLine = new THREE.Line(
            geo,
            new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.72 })
          );
          this.scene.add(tower.laserLine);
        } else {
          const posAttr = tower.laserLine.geometry.getAttribute('position') as THREE.BufferAttribute;
          posAttr.setXYZ(0, mPos.x, mPos.y, mPos.z);
          posAttr.setXYZ(1, tPos.x, tPos.y, tPos.z);
          posAttr.needsUpdate = true;
        }
        tower.laserLine.visible = true;
      } else if (tower.laserLine) {
        tower.laserLine.visible = false;
      }

      const angleDiff = angleDiffAbs(desiredAngle, tower.turretAngle);

      // Continuous HELIOS Directed-Energy Laser Beam logic
      if (tower.def.isContinuousLaser) {
        this.updateHeliosLaserTower(tower, spec, candidates, dt, angleDiff < 0.55);
        continue;
      }

      if (tower.cooldownTimer <= 0 && angleDiff < 0.45) {
        tower.cooldownTimer = 1 / spec.fireRate;
        this.triggerTowerAttack(tower, spec, candidates);
      }
    }
  }

  private updateHeliosLaserTower(
    tower: TowerEntity,
    spec: any,
    candidates: EnemyEntity[],
    dt: number,
    aligned: boolean
  ) {
    if (!aligned) {
      for (const lb of tower.laserBeams) lb.visible = false;
      tower.laserFocusTime = 0;
      return;
    }

    const primary = candidates[0];
    if (tower.laserTargetId === primary.id) {
      tower.laserFocusTime += dt;
    } else {
      tower.laserTargetId = primary.id;
      tower.laserFocusTime = 0;
    }

    const rampMult = 1 + Math.min(spec.maxRampBonus || 2.0, tower.laserFocusTime * (spec.rampRate || 0.45));
    const beamCount = Math.min(spec.beamTargets || 1, candidates.length);
    const mPos = this.getTowerMuzzleWorld(tower);

    while (tower.laserBeams.length < beamCount) {
      const bm = new THREE.Mesh(this.laserBeamGeo, this.laserBeamMat);
      this.scene.add(bm);
      tower.laserBeams.push(bm);
    }

    for (let i = 0; i < tower.laserBeams.length; i++) {
      const bm = tower.laserBeams[i];
      if (i >= beamCount) {
        bm.visible = false;
        continue;
      }
      const target = candidates[i];
      const tPos = new THREE.Vector3(target.wx, target.wy + 0.7, target.wz);
      const dist = mPos.distanceTo(tPos);
      bm.position.copy(mPos).lerp(tPos, 0.5);
      bm.lookAt(tPos);
      bm.rotateX(Math.PI / 2);
      const thickness = i === 0 ? 0.75 + rampMult * 0.45 : 0.85;
      bm.scale.set(thickness, dist, thickness);
      bm.visible = true;

      if (spec.thermalVuln > 0) {
        target.thermalVuln = Math.max(target.thermalVuln, spec.thermalVuln);
      }
    }

    audio.playShot('laser');
    tower.laserTickAccum += dt;
    if (tower.laserTickAccum >= 0.1) {
      const tickDt = tower.laserTickAccum;
      tower.laserTickAccum = 0;
      for (let i = 0; i < beamCount; i++) {
        const target = candidates[i];
        const mult = i === 0 ? rampMult : 1.0;
        const dmg = spec.damage * mult * tickDt;
        this.applyDamageToEnemy(target, dmg, 'laser', tower, { allowApsIntercept: false });
        this.effects.spawnSparks(target.wx, target.wy + 0.7, target.wz, 1, 0x38bdf8);
      }
    }
  }

  private findTargetsInRange(tower: TowerEntity, spec: any): EnemyEntity[] {
    const matches: EnemyEntity[] = [];
    const rangeSq = spec.range * spec.range;
    const minRangeSq = (spec.minRange || 0) * (spec.minRange || 0);

    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      if (e.isStealth && !e.stealthRevealed) return;
      if (tower.def.domain === 'ground' && e.domain !== 'ground') return;
      if (tower.def.domain === 'air' && e.domain !== 'air') return;

      const dx = e.x - tower.x;
      const dy = e.y - tower.y;
      const dSq = dx * dx + dy * dy;
      if (dSq <= rangeSq && dSq >= minRangeSq) {
        matches.push(e);
      }
    });

    const prio = tower.priority;
    matches.sort((a, b) => {
      if (prio === 'air_first') {
        if (a.domain !== b.domain) return a.domain === 'air' ? -1 : 1;
        return a.distToFob - b.distToFob;
      }
      if (prio === 'last') return b.distToFob - a.distToFob;
      if (prio === 'strongest') return b.hp - a.hp || a.distToFob - b.distToFob;
      if (prio === 'weakest') return a.hp - b.hp || a.distToFob - b.distToFob;
      return a.distToFob - b.distToFob;
    });

    return matches;
  }

  private getTowerMuzzleWorld(tower: TowerEntity): THREE.Vector3 {
    if (tower.rig.muzzlePoint) {
      const v = new THREE.Vector3();
      tower.rig.muzzlePoint.getWorldPosition(v);
      return v;
    }
    return new THREE.Vector3(
      tower.wx + Math.sin(tower.turretAngle) * 1.4,
      1.3,
      tower.wz + Math.cos(tower.turretAngle) * 1.4
    );
  }

  private triggerTowerAttack(tower: TowerEntity, spec: any, candidates: EnemyEntity[]) {
    const primary = candidates[0];
    const mPos = this.getTowerMuzzleWorld(tower);

    if (tower.defId === 'm2_bunker') {
      tower.recoil = 0.16;
      tower.muzzleFlashTimer = 0.045;
      audio.playShot(tower.level >= 2 ? 'ciws' : 'mg50');
      this.effects.spawnSparks(mPos.x, mPos.y, mPos.z, 2, 0xfef08a);
      this.fireTowerProjectile(tower, primary, spec, 0);
    } else if (tower.defId === 'bushmaster') {
      tower.recoil = 0.28;
      tower.muzzleFlashTimer = 0.065;
      audio.playShot('autocannon');
      this.effects.spawnSparks(mPos.x, mPos.y, mPos.z, 3, 0xfb923c);
      this.fireTowerProjectile(tower, primary, spec, 0);
    } else if (tower.defId === 'abrams_pit') {
      tower.recoil = 0.44;
      tower.muzzleFlashTimer = 0.11;
      audio.playShot('howitzer');
      this.addTrauma(0.16);
      this.triggerFlashLight(mPos.x, mPos.y, mPos.z, 0xffa94d, 5.5, 0.08);
      this.effects.spawnExplosion(mPos.x, mPos.y, mPos.z, 0.5, 0xfacc15, false);
      this.fireTowerProjectile(tower, primary, spec, 0);
    } else if (tower.defId === 'javelin') {
      tower.recoil = 0.18;
      tower.muzzleFlashTimer = 0.08;
      audio.playShot('missile');
      this.effects.spawnSmokePuff(mPos.x, mPos.y, mPos.z, 0xcbd5e1, 0.7);
      const count = spec.salvoCount || 1;
      for (let i = 0; i < count; i++) {
        const target = candidates[i % candidates.length];
        const offset = count === 2 ? (i === 0 ? -0.18 : 0.18) : 0;
        this.fireTowerProjectile(tower, target, spec, offset);
      }
    } else if (tower.defId === 'phalanx') {
      tower.recoil = 0.1;
      tower.muzzleFlashTimer = 0.04;
      audio.playShot('ciws');
      this.effects.spawnSparks(mPos.x, mPos.y, mPos.z, 1, 0x7dd3fc);
      this.fireTowerProjectile(tower, primary, spec, (Math.random() - 0.5) * 0.06);
    } else if (tower.defId === 'howitzer' || tower.defId === 'tos1_mlrs') {
      tower.recoil = 0.42;
      tower.muzzleFlashTimer = 0.12;
      audio.playShot(tower.defId === 'tos1_mlrs' ? 'missile' : 'howitzer');
      this.addTrauma(tower.level === 3 ? 0.32 : 0.2);
      this.triggerFlashLight(mPos.x, mPos.y, mPos.z, 0xff7b22, 6.0, 0.1);
      this.effects.spawnExplosion(mPos.x, mPos.y, mPos.z, 0.55, 0xf97316, false);
      const count = spec.salvoCount || 1;
      for (let i = 0; i < count; i++) {
        if (i === 0) {
          this.fireTowerProjectile(tower, primary, spec, 0);
        } else {
          const t = candidates[i % candidates.length];
          this.pendingShots.push({
            delay: i * 0.085,
            tower,
            target: t,
            targetId: t.id,
            fallbackX: t.x,
            fallbackY: t.y,
            spec,
            offsetAngle: (Math.random() - 0.5) * 0.16
          });
        }
      }
    } else if (tower.defId === 'patriot' || tower.defId === 'iron_dome') {
      tower.recoil = 0.16;
      tower.muzzleFlashTimer = 0.09;
      audio.playShot('missile');
      this.effects.spawnSmokePuff(mPos.x, mPos.y, mPos.z, 0xe2e8f0, 0.75);
      const maxTargets = spec.multiTargets || 1;
      for (let i = 0; i < Math.min(maxTargets, candidates.length); i++) {
        this.fireTowerProjectile(tower, candidates[i], spec, (i - 1) * 0.14);
      }
    }
  }

  private fireTowerProjectile(tower: TowerEntity, target: any, spec: any, angleOffset = 0) {
    const p = this.projectilePool.acquire() as ProjectileEntity;
    const mPos = this.getTowerMuzzleWorld(tower);
    const launchAngle = tower.turretAngle + angleOffset;

    p.wx = mPos.x;
    p.wy = mPos.y;
    p.wz = mPos.z;
    p.prevWx = mPos.x;
    p.prevWy = mPos.y;
    p.prevWz = mPos.z;
    p.startWx = mPos.x;
    p.startWy = mPos.y;
    p.startWz = mPos.z;
    p.x = worldToSimX(mPos.x);
    p.y = worldToSimY(mPos.z);
    p.sourceTower = tower;
    p.damage = spec.damage;
    p.damageType = spec.damageType;
    p.armorPierce = spec.armorPierce || 0;
    p.armorIgnore = spec.armorIgnore || 0;
    p.heavyMultiplier = spec.heavyMultiplier || 1;
    p.tandemHeat = !!spec.tandemHeat;
    p.critChance = spec.critChance || 0;
    p.splashRadius = spec.splashRadius || 0;
    p.burnDps = spec.burnDps || 0;
    p.burnDuration = spec.burnDuration || 0;
    p.speed = tower.def.projectileSpeed || 800;
    p.smokeTimer = 0;
    p.flightTime = 0;

    if (tower.defId === 'javelin') {
      p.kind = 'missile';
      p.isMissile = true;
      p.isTopAttack = true;
      p.isArtillery = false;
      p.targetEnemy = target && target.id ? target : null;
      p.targetId = target ? target.id : 0;
      p.targetX = target ? target.x : p.x + Math.sin(launchAngle) * 180;
      p.targetY = target ? target.y : p.y + Math.cos(launchAngle) * 180;
      p.targetWx = simToWorldX(p.targetX);
      p.targetWy = 0.7;
      p.targetWz = simToWorldZ(p.targetY);
      const dist = Math.hypot(p.targetX - p.x, p.targetY - p.y);
      p.totalFlightTime = Math.max(0.45, dist / p.speed);
      p.life = p.totalFlightTime + 0.5;
      const mMesh = createMissileMesh3D('javelin');
      this.scene.add(mMesh);
      p.mesh = mMesh;
      mMesh.position.set(p.wx, p.wy, p.wz);
    } else if (tower.defId === 'patriot' || tower.defId === 'iron_dome') {
      p.kind = 'sam';
      p.isMissile = true;
      p.isTopAttack = false;
      p.isArtillery = false;
      p.targetEnemy = target && target.id ? target : null;
      p.targetId = target ? target.id : 0;
      p.targetX = target ? target.x : p.x + Math.sin(launchAngle) * 200;
      p.targetY = target ? target.y : p.y + Math.cos(launchAngle) * 200;
      p.targetWx = simToWorldX(p.targetX);
      p.targetWy = target?.wy || 1.2;
      p.targetWz = simToWorldZ(p.targetY);
      const speedW = p.speed * WORLD_SCALE;
      p.vx = Math.sin(launchAngle) * speedW * 0.75;
      p.vy = speedW * 0.65;
      p.vz = Math.cos(launchAngle) * speedW * 0.75;
      p.life = 3.5;
      const mMesh = createMissileMesh3D('patriot');
      this.scene.add(mMesh);
      p.mesh = mMesh;
      mMesh.position.set(p.wx, p.wy, p.wz);
    } else if (tower.defId === 'howitzer' || tower.defId === 'tos1_mlrs') {
      p.kind = spec.damageType === 'he_rocket' || spec.damageType === 'thermobaric' ? 'rocket' : 'shell';
      p.isMissile = p.kind === 'rocket';
      p.isTopAttack = false;
      p.isArtillery = true;
      p.targetEnemy = null;
      p.targetId = 0;
      const scatter = spec.scatter || 0;
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.random() * scatter;
      const tx = (target ? target.x : p.x + Math.sin(launchAngle) * 260) + Math.cos(ang) * rad;
      const ty = (target ? target.y : p.y + Math.cos(launchAngle) * 260) + Math.sin(ang) * rad;
      p.targetX = Math.max(16, Math.min(MAP_WIDTH - 16, tx));
      p.targetY = Math.max(16, Math.min(MAP_HEIGHT - 16, ty));
      p.targetWx = simToWorldX(p.targetX);
      p.targetWy = 0.2;
      p.targetWz = simToWorldZ(p.targetY);
      const dist = Math.hypot(p.targetX - p.x, p.targetY - p.y);
      p.totalFlightTime = Math.max(0.45, dist / p.speed);
      p.life = p.totalFlightTime + 0.15;

      if (p.kind === 'rocket') {
        const mMesh = createMissileMesh3D('rocket');
        this.scene.add(mMesh);
        p.mesh = mMesh;
      } else {
        const sMesh = new THREE.Mesh(this.shellGeo, this.shellMat);
        this.scene.add(sMesh);
        p.mesh = sMesh;
      }
      p.mesh.position.set(p.wx, p.wy, p.wz);
    } else {
      p.kind = tower.defId === 'bushmaster' || tower.defId === 'abrams_pit' ? 'sabot' : 'bullet';
      p.isMissile = false;
      p.isTopAttack = false;
      p.isArtillery = false;
      p.targetEnemy = target && target.id ? target : null;
      p.targetId = target ? target.id : 0;

      const tWx = target ? simToWorldX(target.x) : mPos.x + Math.sin(launchAngle) * 14;
      const tWy = target ? target.wy || 0.7 : 0.7;
      const tWz = target ? simToWorldZ(target.y) : mPos.z + Math.cos(launchAngle) * 14;

      const dir = new THREE.Vector3(tWx - mPos.x, tWy - mPos.y, tWz - mPos.z).normalize();
      if (angleOffset !== 0) {
        dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleOffset).normalize();
      }
      const speedW = p.speed * WORLD_SCALE;
      p.vx = dir.x * speedW;
      p.vy = dir.y * speedW;
      p.vz = dir.z * speedW;
      p.life = 1.2;

      const mesh = p.mesh as THREE.Mesh;
      mesh.material = p.kind === 'sabot' ? this.sabotMat : this.bulletMat;
      const sc = tower.defId === 'abrams_pit' ? 2.2 : p.kind === 'sabot' ? 1.5 : 1.0;
      mesh.scale.set(sc, sc, p.kind === 'sabot' ? 1.6 : 1.0);
      mesh.position.copy(mPos);
      mesh.lookAt(mPos.x + p.vx, mPos.y + p.vy, mPos.z + p.vz);
      mesh.visible = true;
    }
  }

  private updateProjectiles(dt: number) {
    this.projectilePool.forEachActive((obj) => {
      const p = obj as ProjectileEntity;
      p.prevWx = p.wx;
      p.prevWy = p.wy;
      p.prevWz = p.wz;
      p.life -= dt;
      if (p.life <= 0) {
        this.projectilePool.release(p);
        return;
      }

      if (p.isArtillery) {
        p.flightTime += dt;
        const progress = Math.min(1, p.flightTime / p.totalFlightTime);
        const arc = Math.sin(progress * Math.PI);
        const peak = p.kind === 'hellfire' ? 0 : 9.5;
        p.wx = THREE.MathUtils.lerp(p.startWx, p.targetWx, progress);
        p.wz = THREE.MathUtils.lerp(p.startWz, p.targetWz, progress);
        p.wy = THREE.MathUtils.lerp(p.startWy, p.targetWy, progress) + arc * peak;
        p.mesh.position.set(p.wx, p.wy, p.wz);
        p.mesh.lookAt(
          p.wx + (p.wx - p.prevWx) + 0.0001,
          p.wy + (p.wy - p.prevWy),
          p.wz + (p.wz - p.prevWz)
        );

        if (p.kind === 'rocket' || p.kind === 'hellfire') {
          p.smokeTimer += dt;
          if (p.smokeTimer >= 0.024) {
            p.smokeTimer = 0;
            this.effects.spawnSmokePuff(p.wx, p.wy, p.wz, p.kind === 'hellfire' ? 0xfdba74 : 0xdbeafe, 0.45);
          }
        }

        if (progress >= 1) {
          this.detonateSplash(p);
          this.projectilePool.release(p);
        }
        return;
      }

      if (p.isTopAttack) {
        if (p.targetEnemy && p.targetEnemy._pooledActive && p.targetEnemy.id === p.targetId) {
          p.targetX = p.targetEnemy.x;
          p.targetY = p.targetEnemy.y;
          p.targetWx = p.targetEnemy.wx;
          p.targetWy = p.targetEnemy.wy + 0.7;
          p.targetWz = p.targetEnemy.wz;
        }
        p.flightTime += dt;
        const progress = Math.min(1, p.flightTime / p.totalFlightTime);
        const climbArc = Math.sin(Math.pow(progress, 0.75) * Math.PI);
        p.wx = THREE.MathUtils.lerp(p.startWx, p.targetWx, progress);
        p.wz = THREE.MathUtils.lerp(p.startWz, p.targetWz, progress);
        p.wy = THREE.MathUtils.lerp(p.startWy, p.targetWy, progress) + climbArc * 7.8;

        p.mesh.position.set(p.wx, p.wy, p.wz);
        p.mesh.lookAt(
          p.wx + (p.wx - p.prevWx) + 0.0001,
          p.wy + (p.wy - p.prevWy),
          p.wz + (p.wz - p.prevWz)
        );

        p.smokeTimer += dt;
        if (p.smokeTimer >= 0.024) {
          p.smokeTimer = 0;
          this.effects.spawnSmokePuff(p.wx, p.wy, p.wz, 0xe2e8f0, 0.42);
        }

        if (progress >= 1) {
          if (p.targetEnemy && p.targetEnemy._pooledActive && p.targetEnemy.id === p.targetId) {
            this.impactSingleEnemy(p, p.targetEnemy);
          } else {
            this.detonateSplash(p);
          }
          this.projectilePool.release(p);
        }
        return;
      }

      if (p.isMissile) {
        if (p.targetEnemy && p.targetEnemy._pooledActive && p.targetEnemy.id === p.targetId) {
          p.targetX = p.targetEnemy.x;
          p.targetY = p.targetEnemy.y;
          p.targetWx = p.targetEnemy.wx;
          p.targetWy = p.targetEnemy.wy;
          p.targetWz = p.targetEnemy.wz;
        }
        const toTarget = new THREE.Vector3(p.targetWx - p.wx, p.targetWy - p.wy, p.targetWz - p.wz);
        const dist = toTarget.length();
        const speedW = p.speed * WORLD_SCALE;
        if (dist > 0.01) {
          toTarget.normalize();
          const curDir = new THREE.Vector3(p.vx, p.vy, p.vz).normalize();
          curDir.lerp(toTarget, Math.min(1, 10 * dt)).normalize();
          p.vx = curDir.x * speedW;
          p.vy = curDir.y * speedW;
          p.vz = curDir.z * speedW;
        }
        p.wx += p.vx * dt;
        p.wy += p.vy * dt;
        p.wz += p.vz * dt;
        p.mesh.position.set(p.wx, p.wy, p.wz);
        p.mesh.lookAt(p.wx + p.vx, p.wy + p.vy, p.wz + p.vz);

        p.smokeTimer += dt;
        if (p.smokeTimer >= 0.022) {
          p.smokeTimer = 0;
          this.effects.spawnSmokePuff(p.wx, p.wy, p.wz, 0xe2e8f0, 0.45);
        }

        if (dist <= 1.25) {
          if (p.targetEnemy && p.targetEnemy._pooledActive && p.targetEnemy.id === p.targetId) {
            this.impactSingleEnemy(p, p.targetEnemy);
          } else {
            this.detonateSplash(p);
          }
          this.projectilePool.release(p);
        }
        return;
      }

      p.wx += p.vx * dt;
      p.wy += p.vy * dt;
      p.wz += p.vz * dt;
      p.x = worldToSimX(p.wx);
      p.y = worldToSimY(p.wz);
      p.mesh.position.set(p.wx, p.wy, p.wz);

      let hitEnemy: EnemyEntity | null = null;
      this.enemyPool.forEachActive((obj) => {
        if (hitEnemy) return;
        const e = obj as EnemyEntity;
        if (e.isStealth && !e.stealthRevealed) return;
        if (p.sourceTower) {
          if (p.sourceTower.def.domain === 'ground' && e.domain !== 'ground') return;
          if (p.sourceTower.def.domain === 'air' && e.domain !== 'air') return;
        }
        const dist = Math.hypot(e.x - p.x, e.y - p.y);
        if (dist <= e.radius + 7) {
          hitEnemy = e;
        }
      });

      if (hitEnemy) {
        this.impactSingleEnemy(p, hitEnemy);
        this.projectilePool.release(p);
      }
    });
  }

  private impactSingleEnemy(p: ProjectileEntity, enemy: EnemyEntity) {
    const res = this.applyDamageToEnemy(enemy, p.damage, p.damageType, p.sourceTower, {
      armorPierce: p.armorPierce,
      armorIgnore: p.armorIgnore,
      heavyMultiplier: p.heavyMultiplier,
      tandemHeat: p.tandemHeat,
      critChance: p.critChance,
      isMissile: p.isMissile
    });

    if (res.apsIntercepted) {
      this.effects.spawnShockwave(enemy.wx, 1.0, enemy.wz, 2.5, 0x22d3ee);
      this.spawnFloatingText(enemy.wx, 3.0, enemy.wz, 'APS INTERCEPT!', '#22d3ee');
      audio.playApsIntercept();
      return;
    }

    if (p.splashRadius > 0) {
      this.detonateSplash(p, enemy);
    } else if (res.isRicochet) {
      audio.playRicochet();
      this.effects.spawnSparks(p.wx, p.wy, p.wz, 5, 0xfbbf24);
      if (Math.random() < 0.35) {
        this.spawnFloatingText(enemy.wx, 2.4, enemy.wz, 'RICOCHET', '#fbbf24');
      }
    } else if (p.isMissile) {
      this.effects.spawnExplosion(p.wx, p.wy, p.wz, 1.0, 0xf97316, true);
      audio.playExplosion(0.95);
      this.addTrauma(0.18);
    } else {
      this.effects.spawnSparks(p.wx, p.wy, p.wz, 3, res.isCrit ? 0x38bdf8 : 0xfef08a);
    }
  }

  private detonateSplash(p: ProjectileEntity, alreadyHitEnemy: EnemyEntity | null = null) {
    const isBig = p.splashRadius >= 90 || p.kind === 'hellfire';
    const scale = Math.max(0.75, p.splashRadius / 72);
    this.effects.spawnExplosion(
      p.targetWx,
      Math.max(0.4, p.targetWy),
      p.targetWz,
      scale,
      p.kind === 'hellfire' ? 0xef4444 : 0xf97316,
      true
    );
    if (p.targetWy < 1.5) {
      this.effects.spawnCrater(p.targetWx, p.targetWz, scale);
    }
    if (p.burnDps > 0 && p.burnDuration > 0) {
      this.spawnFireZone(p.targetX, p.targetY, p.splashRadius, p.burnDps, p.burnDuration);
    }
    audio.playExplosion(scale);

    if (p.kind === 'hellfire') {
      this.addTrauma(0.55);
      this.hitStopTimer = 0.032;
    } else if (isBig) {
      this.addTrauma(p.kind === 'rocket' ? 0.32 : 0.24);
    }

    const rSq = p.splashRadius * p.splashRadius;
    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      if (e === alreadyHitEnemy) return;
      if (p.kind !== 'hellfire' && p.damageType !== 'aa_missile' && p.damageType !== 'aa' && e.domain === 'air') {
        return;
      }
      const dSq = (e.x - p.targetX) ** 2 + (e.y - p.targetY) ** 2;
      if (dSq <= rSq) {
        const dist = Math.sqrt(dSq);
        const falloff = p.kind === 'hellfire' ? 1.0 : Math.max(0.45, 1 - (dist / p.splashRadius) * 0.55);
        this.applyDamageToEnemy(e, p.damage * falloff, p.damageType, p.sourceTower, {
          armorPierce: p.armorPierce,
          armorIgnore: p.armorIgnore,
          heavyMultiplier: p.heavyMultiplier,
          tandemHeat: p.tandemHeat,
          critChance: p.critChance,
          isMissile: p.isMissile,
          allowApsIntercept: p.kind !== 'hellfire'
        });
      }
    });
  }

  private applyDamageToEnemy(
    enemy: EnemyEntity,
    rawDamage: number,
    damageType: string,
    sourceTower: TowerEntity | null,
    opts: any = {}
  ) {
    if (!enemy || !enemy._pooledActive) return { damage: 0 };

    const res = resolveDamage(enemy, rawDamage, damageType, opts);
    if (res.apsIntercepted || res.damage <= 0) return res;

    enemy.hp -= res.damage;
    enemy.hitFlashTimer = 0.07;
    if (enemy.rig) {
      enemy.rig.hitMeshes.forEach((m) => {
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && mat.emissive) {
          if ((mat as any)._origEmissive === undefined) {
            (mat as any)._origEmissive = mat.emissive.getHex();
          }
          mat.emissive.setHex(0x666666);
        }
      });
    }
    this.totalDamage += res.damage;

    if (sourceTower) {
      sourceTower.totalDamage += res.damage;
    }

    if (res.eraBlocked) {
      this.spawnFloatingText(enemy.wx, enemy.wy + 2.4, enemy.wz, 'ERA BLOCK (-40%)', '#fb923c');
    } else if (res.isCrit) {
      this.spawnFloatingText(enemy.wx, enemy.wy + 2.2, enemy.wz, `CRIT ${res.damage}`, '#38bdf8');
    }

    // Threshold reinforcement spawns (e.g. Mega Boss MAZ-7917 at 50% and 25% HP)
    const def = (ENEMY_DEFINITIONS as any)[enemy.type];
    if (enemy.hp > 0 && def?.thresholdSpawns) {
      const ratio = enemy.hp / enemy.maxHp;
      for (let i = 0; i < def.thresholdSpawns.length; i++) {
        const th = def.thresholdSpawns[i];
        if (ratio <= th.ratio && !enemy.triggeredThresholds.has(i)) {
          enemy.triggeredThresholds.add(i);
          this.spawnFloatingText(enemy.wx, 3.6, enemy.wz, 'ESCOLTA LIBERADA!', '#facc15');
          const fallbackCol = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(enemy.x / TILE_SIZE)));
          const fallbackRow = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(enemy.y / TILE_SIZE)));
          for (let k = 0; k < th.count; k++) {
            this.spawnEnemy(th.type, 0, {
              x: Math.max(16, Math.min(MAP_WIDTH - 16, enemy.x + (Math.random() - 0.5) * 32)),
              y: Math.max(16, Math.min(MAP_HEIGHT - 16, enemy.y + (Math.random() - 0.5) * 32)),
              fallbackCol,
              fallbackRow
            });
          }
        }
      }
    }

    if (enemy.hp <= 0) {
      this.killEnemy(enemy, sourceTower);
    } else {
      this.updateEnemyHealthBar(enemy);
    }

    return res;
  }

  private killEnemy(enemy: EnemyEntity, sourceTower: TowerEntity | null) {
    if (!enemy._pooledActive) return;

    this.totalKills += 1;
    this.budget += enemy.reward;
    if (enemy.wbReward > 0) {
      this.sessionWB += enemy.wbReward;
      saveManager.addWarBonds(enemy.wbReward);
    }
    if (sourceTower) sourceTower.kills += 1;

    const rewardLabel = enemy.wbReward > 0 ? `+$${enemy.reward} | +${enemy.wbReward} WB$` : `+$${enemy.reward}`;
    this.spawnFloatingText(enemy.wx, enemy.wy + 1.8, enemy.wz, rewardLabel, enemy.wbReward > 0 ? '#facc15' : '#4ade80');

    if (enemy.isBoss) {
      this.effects.spawnExplosion(enemy.wx, 1.2, enemy.wz, 2.35, 0xef4444, true);
      this.effects.spawnCrater(enemy.wx, enemy.wz, 1.6);
      audio.playExplosion(1.8);
      this.addTrauma(0.75);
      this.hitStopTimer = 0.045;
      this.triggerFlashLight(enemy.wx, 3.0, enemy.wz, 0xff7b22, 8.0, 0.18);
      this.pushRadio(`ALVO PRIORITÁRIO DESTRUÍDO! ${enemy.type.toUpperCase()} abatido (+$${enemy.reward} / +${enemy.wbReward} WB$)!`, 'good');
    } else if (enemy.armorClass === 'heavy' || enemy.domain === 'air') {
      this.effects.spawnExplosion(enemy.wx, Math.max(0.6, enemy.wy), enemy.wz, 1.15, 0xf97316, true);
      if (enemy.domain === 'ground') this.effects.spawnCrater(enemy.wx, enemy.wz, 0.9);
      audio.playExplosion(1.0);
      this.addTrauma(0.16);
    } else {
      this.effects.spawnExplosion(enemy.wx, 0.5, enemy.wz, 0.55, 0xf97316, true);
    }

    const ex = enemy.x;
    const ey = enemy.y;
    const ewx = enemy.wx;
    const ewz = enemy.wz;
    const dismountCount = enemy.dismountCount || 0;
    this.enemyPool.release(enemy);

    if (dismountCount > 0) {
      const fallbackCol = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(ex / TILE_SIZE)));
      const fallbackRow = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(ey / TILE_SIZE)));
      this.spawnFloatingText(ewx, 2.8, ewz, 'INFANTARIA DESEMBARCOU!', '#facc15');
      for (let i = 0; i < dismountCount; i++) {
        const ox = ex + (Math.random() - 0.5) * 26;
        const oy = ey + (Math.random() - 0.5) * 26;
        this.spawnEnemy('infantry', 0, {
          x: Math.max(16, Math.min(MAP_WIDTH - 16, ox)),
          y: Math.max(16, Math.min(MAP_HEIGHT - 16, oy)),
          fallbackCol,
          fallbackRow
        });
      }
    }
  }

  private updateFlyovers(dt: number) {
    for (let i = this.activeFlyovers.length - 1; i >= 0; i--) {
      const f = this.activeFlyovers[i];
      const step = f.speed * dt;
      f.x += f.dirX * step;
      f.y += f.dirY * step;
      f.progress += step;

      const jwx = simToWorldX(f.x);
      const jwz = simToWorldZ(f.y);
      f.jet.position.set(jwx, f.kind === 'b52' ? 12.5 : 9.5, jwz);

      if (f.kind === 'a10') {
        if (f.progress >= 380 && f.progress <= f.totalDist - 380) {
          if (!f.startedSound) {
            f.startedSound = true;
            audio.playA10Brrrt();
          }
          this.addTrauma(0.14);
          f.burstTimer += dt;
          while (f.burstTimer >= 0.028) {
            f.burstTimer -= 0.028;
            const t = Math.min(1, (f.progress - 380) / (f.totalDist - 760));
            const ix = THREE.MathUtils.lerp(f.strafeStartX, f.strafeEndX, t) + (Math.random() - 0.5) * 52;
            const iy = THREE.MathUtils.lerp(f.strafeStartY, f.strafeEndY, t) + (Math.random() - 0.5) * 52;
            const iwx = simToWorldX(ix);
            const iwz = simToWorldZ(iy);

            const p = this.projectilePool.acquire() as ProjectileEntity;
            p.kind = 'bullet';
            p.isMissile = false;
            p.isTopAttack = false;
            p.isArtillery = false;
            const dir = new THREE.Vector3(iwx - jwx, -9.2, iwz - jwz).normalize();
            p.wx = jwx + Math.sin(f.yaw) * 2.5;
            p.wy = 9.2;
            p.wz = jwz + Math.cos(f.yaw) * 2.5;
            p.vx = dir.x * 110;
            p.vy = dir.y * 110;
            p.vz = dir.z * 110;
            p.life = 0.1;
            p.damage = 0;
            const mesh = p.mesh as THREE.Mesh;
            mesh.material = this.bulletMat;
            mesh.scale.set(1.8, 1.8, 2.8);
            mesh.position.set(p.wx, p.wy, p.wz);
            mesh.lookAt(iwx, 0.2, iwz);
            mesh.visible = true;

            this.effects.spawnExplosion(iwx, 0.35, iwz, 0.65, 0xf97316, true);

            this.enemyPool.forEachActive((obj) => {
              const e = obj as EnemyEntity;
              if (Math.hypot(e.x - ix, e.y - iy) <= 58) {
                this.applyDamageToEnemy(e, 105, 'apds', null, {
                  armorIgnore: 0.72,
                  allowApsIntercept: false
                });
              }
            });
          }
        }
      } else if (f.kind === 'b52') {
        if (f.progress >= 460 && f.progress <= f.totalDist - 460) {
          this.addTrauma(0.18);
          f.burstTimer += dt;
          while (f.burstTimer >= 0.12) {
            f.burstTimer -= 0.12;
            const t = Math.min(1, (f.progress - 460) / (f.totalDist - 920));
            const ix = THREE.MathUtils.lerp(f.strafeStartX, f.strafeEndX, t) + (Math.random() - 0.5) * 40;
            const iy = f.strafeStartY + (Math.random() - 0.5) * 110;
            const iwx = simToWorldX(ix);
            const iwz = simToWorldZ(iy);

            this.effects.spawnExplosion(iwx, 0.4, iwz, 1.35, 0xf97316, true);
            this.effects.spawnCrater(iwx, iwz, 1.1);
            this.spawnFireZone(ix, iy, 82, 95, 4.5);
            audio.playExplosion(1.1);

            this.enemyPool.forEachActive((obj) => {
              const e = obj as EnemyEntity;
              if (Math.hypot(e.x - ix, e.y - iy) <= 110) {
                this.applyDamageToEnemy(e, 520, 'thermobaric', null, { allowApsIntercept: false });
              }
            });
          }
        }
      }

      if (f.progress >= f.totalDist) {
        this.scene.remove(f.jet);
        this.activeFlyovers.splice(i, 1);
      }
    }
  }

  private spawnFloatingText(wx: number, wy: number, wz: number, str: string, color = '#ffffff') {
    const t = this.textPool.acquire() as FloatingTextEntity;
    t.wx = wx;
    t.wy = wy;
    t.wz = wz;
    t.life = t.maxLife;
    t.el.textContent = str;
    t.el.style.color = color;
    t.el.classList.remove('hidden');
  }

  private updateFloatingTexts(dt: number) {
    this.textPool.forEachActive((obj) => {
      const t = obj as FloatingTextEntity;
      t.life -= dt;
      if (t.life <= 0) {
        this.textPool.release(t);
        return;
      }
      t.wy += dt * 1.9;
      t.el.style.opacity = String(Math.min(1, (t.life / t.maxLife) * 1.4));
    });
  }

  private updateProjectedDomBars() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w <= 0 || h <= 0) return;

    const proj = new THREE.Vector3();

    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      const shouldShow = e.hp < e.maxHp || e.isBoss || e === this.hoveredEnemy;
      if (!shouldShow || (e.isStealth && !e.stealthRevealed)) {
        e.hpEl.classList.add('hidden');
        return;
      }

      proj.set(e.wx, e.wy + (e.isBoss ? 3.5 : 2.1), e.wz).project(this.camera);
      if (proj.z > 1) {
        e.hpEl.classList.add('hidden');
        return;
      }

      const sx = (proj.x * 0.5 + 0.5) * w;
      const sy = (-proj.y * 0.5 + 0.5) * h;
      e.hpEl.classList.remove('hidden');
      e.hpEl.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -100%)`;
    });

    // Tower HP / Integrity bars (blue >40%, orange/red <=40%)
    for (const t of this.towers) {
      const showTowerHp = t.hp < t.maxHp || t.empDisabledTimer > 0 || t === this.selectedTower;
      if (!showTowerHp) {
        t.hpEl.classList.add('hidden');
        continue;
      }
      proj.set(t.wx, 2.75, t.wz).project(this.camera);
      if (proj.z > 1) {
        t.hpEl.classList.add('hidden');
        continue;
      }
      const ratio = Math.max(0, Math.min(1, t.hp / t.maxHp));
      t.hpFillEl.style.width = `${ratio * 100}%`;
      t.hpFillEl.style.background =
        t.empDisabledTimer > 0 ? '#c084fc' : ratio > 0.4 ? '#38bdf8' : ratio > 0.2 ? '#fb923c' : '#ef4444';
      t.hpLabelEl.textContent = t.empDisabledTimer > 0 ? 'EMP OFF' : `${Math.ceil(t.hp)}`;
      const sx = (proj.x * 0.5 + 0.5) * w;
      const sy = (-proj.y * 0.5 + 0.5) * h;
      t.hpEl.classList.remove('hidden');
      t.hpEl.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -100%)`;
    }

    this.textPool.forEachActive((obj) => {
      const t = obj as FloatingTextEntity;
      proj.set(t.wx, t.wy, t.wz).project(this.camera);
      if (proj.z > 1) {
        t.el.classList.add('hidden');
        return;
      }
      const sx = (proj.x * 0.5 + 0.5) * w;
      const sy = (-proj.y * 0.5 + 0.5) * h;
      t.el.classList.remove('hidden');
      t.el.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%)`;
    });
  }

  private clearGroup(group: THREE.Group) {
    while (group.children.length > 0) {
      const ch = group.children[0];
      group.remove(ch);
      if ((ch as any).geometry) (ch as any).geometry.dispose();
    }
  }

  private buildPathLine(path: Array<{ x: number; y: number }>, color: number, opacity: number, yPos: number): THREE.Line | null {
    if (!path || path.length < 2) return null;
    const pts = path.map((pt) => new THREE.Vector3(simToWorldX(pt.x), yPos, simToWorldZ(pt.y)));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  }

  private rebuildActiveRouteLines() {
    this.clearGroup(this.routeLinesGroup);
    for (const sp of this.pathfinder.spawnPoints) {
      const path = this.pathfinder.spawnPaths.get(sp.id);
      if (path) {
        const line = this.buildPathLine(path, 0xef4444, 0.35, 0.08);
        if (line) this.routeLinesGroup.add(line);
      }
    }
  }

  private rebuildPreviewRouteLines() {
    this.clearGroup(this.previewRouteGroup);
    if (this.lastCanPlace?.previewPaths) {
      for (const [, p] of this.lastCanPlace.previewPaths) {
        const line = this.buildPathLine(p, 0x38bdf8, 0.85, 0.14);
        if (line) this.previewRouteGroup.add(line);
      }
    }
  }

  private rebuildSelectedTowerOverlay() {
    this.clearGroup(this.selectedRingGroup);
    if (!this.selectedTower) return;
    const t = this.selectedTower;
    const spec = t.def.levels[t.level - 1];

    const box = new THREE.Mesh(
      new THREE.RingGeometry(1.75, 1.98, 4),
      new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide })
    );
    box.rotation.x = -Math.PI / 2;
    box.rotation.z = Math.PI / 4;
    box.position.set(t.wx, 0.08, t.wz);
    this.selectedRingGroup.add(box);

    if (!t.def.isBarrier && spec.range > 0) {
      const rW = spec.range * WORLD_SCALE;
      const ring = this.createCircleLoop(72, 0x38bdf8, 0.85);
      ring.scale.setScalar(rW);
      ring.position.set(t.wx, 0.11, t.wz);
      this.selectedRingGroup.add(ring);

      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(rW, 64),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false })
      );
      disc.rotation.x = -Math.PI / 2;
      disc.position.set(t.wx, 0.06, t.wz);
      this.selectedRingGroup.add(disc);

      if (spec.minRange > 0) {
        const mrW = spec.minRange * WORLD_SCALE;
        const mRing = this.createCircleLoop(48, 0xef4444, 0.78);
        mRing.scale.setScalar(mrW);
        mRing.position.set(t.wx, 0.11, t.wz);
        this.selectedRingGroup.add(mRing);
      }
    }
  }

  private updateInteractiveOverlays() {
    if (this.activeTool?.kind === 'build') {
      const { col, row } = this.hoverTile;
      if (this.pathfinder.inBounds(col, row)) {
        const def = (TOWER_DEFINITIONS as any)[this.activeTool.towerId];
        const spec = def.levels[0];
        const effectiveCost = this.getEffectiveTowerCost(this.activeTool.towerId);
        const { x: wx, z: wz } = cellToWorldCenter(col, row);
        const valid = Boolean(this.lastCanPlace?.ok && this.budget >= effectiveCost);

        this.ghostGroup.visible = true;
        this.ghostGroup.position.set(wx, 0, wz);
        (this.ghostTileHighlight.material as THREE.MeshBasicMaterial).color.setHex(valid ? 0x22c55e : 0xef4444);

        for (const [id, gm] of this.ghostModels) {
          const isMatch = id === this.activeTool.towerId;
          gm.root.visible = isMatch;
          if (isMatch) gm.setValid(valid);
        }

        if (spec.range > 0) {
          const rW = spec.range * WORLD_SCALE;
          this.ghostRangeRing.visible = true;
          this.ghostRangeRing.scale.setScalar(rW);
          (this.ghostRangeRing.material as THREE.LineBasicMaterial).color.setHex(valid ? 0x22c55e : 0xef4444);
          if (spec.minRange > 0) {
            this.ghostMinRangeRing.visible = true;
            this.ghostMinRangeRing.scale.setScalar(spec.minRange * WORLD_SCALE);
          } else {
            this.ghostMinRangeRing.visible = false;
          }
        } else {
          this.ghostRangeRing.visible = false;
          this.ghostMinRangeRing.visible = false;
        }
      } else {
        this.ghostGroup.visible = false;
      }
    } else {
      this.ghostGroup.visible = false;
    }

    this.clearGroup(this.supportReticleGroup);
    if (this.activeTool?.kind === 'support') {
      const px = this.strafeDragStart ? simToWorldX(this.strafeDragStart.x) : this.hoverWorld.x;
      const pz = this.strafeDragStart ? simToWorldZ(this.strafeDragStart.y) : this.hoverWorld.z;

      if (this.activeTool.supportId === 'a10') {
        const halfLen = 230 * WORLD_SCALE;
        const dx = Math.cos(this.strafeAngle) * halfLen;
        const dz = Math.sin(this.strafeAngle) * halfLen;
        const strip = new THREE.Mesh(
          new THREE.PlaneGeometry(halfLen * 2, 3.2),
          new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false })
        );
        strip.rotation.x = -Math.PI / 2;
        strip.rotation.z = -this.strafeAngle;
        strip.position.set(px, 0.12, pz);
        this.supportReticleGroup.add(strip);

        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(px - dx, 0.18, pz - dz),
          new THREE.Vector3(px + dx, 0.18, pz + dz)
        ]);
        this.supportReticleGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xfacc15 })));
      } else if (this.activeTool.supportId === 'hellfire') {
        const rW = 115 * WORLD_SCALE;
        const ring = this.createCircleLoop(48, 0xef4444, 0.92);
        ring.scale.setScalar(rW);
        ring.position.set(px, 0.14, pz);
        this.supportReticleGroup.add(ring);

        const disc = new THREE.Mesh(
          new THREE.CircleGeometry(rW, 48),
          new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false })
        );
        disc.rotation.x = -Math.PI / 2;
        disc.position.set(px, 0.1, pz);
        this.supportReticleGroup.add(disc);
      } else if (this.activeTool.supportId === 'b52') {
        const strip = new THREE.Mesh(
          new THREE.PlaneGeometry(760 * WORLD_SCALE, 110 * WORLD_SCALE),
          new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.24, side: THREE.DoubleSide, depthWrite: false })
        );
        strip.rotation.x = -Math.PI / 2;
        strip.position.set(px, 0.12, pz);
        this.supportReticleGroup.add(strip);
      }
    }
  }

  private addTrauma(amount: number) {
    this.trauma = Math.min(1, this.trauma + amount);
  }

  private updateCameraShake(realDt: number) {
    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - realDt * 1.85);
      const shake = this.trauma * this.trauma * 0.75;
      this.baseCameraOffset.set(
        (Math.random() * 2 - 1) * shake,
        (Math.random() * 2 - 1) * shake * 0.6,
        (Math.random() * 2 - 1) * shake
      );
      this.camera.position.add(this.baseCameraOffset);
      this.controls.update();
      this.camera.position.sub(this.baseCameraOffset);
    }
  }

  private serializeTower(t: TowerEntity | null) {
    if (!t) return null;
    const spec = this.getEffectiveSpec(t);
    const nextSpec = t.def.levels[t.level] || null;
    return {
      id: t.id,
      defId: t.defId,
      name: spec.name,
      shortName: t.def.shortName,
      role: t.def.role,
      level: t.level,
      maxLevel: t.def.levels.length,
      hp: Math.ceil(t.hp),
      maxHp: t.maxHp,
      repairCost: this.getRepairCost(t),
      empDisabled: t.empDisabledTimer > 0,
      isBarrier: !!t.def.isBarrier,
      isSupportAura: !!t.def.isSupportAura,
      domain: t.def.domain,
      range: spec.range,
      minRange: spec.minRange || 0,
      fireRate: spec.fireRate,
      damage: spec.damage,
      notes: spec.notes,
      priority: t.priority,
      totalDamage: t.totalDamage,
      kills: t.kills,
      sellRefund: Math.floor(t.totalInvested * 0.75 * Math.max(0.4, t.hp / t.maxHp)),
      nextUpgrade: nextSpec
        ? {
            name: nextSpec.name,
            cost: nextSpec.upgradeCost,
            notes: nextSpec.notes
          }
        : null
    };
  }

  private emitFullHudSync() {
    const nextWaveIdx = this.currentWave;
    const nextWaveDef = this.stageConfig.waves[nextWaveIdx] || null;
    const canCallEarly =
      !this.gameOver &&
      this.currentWave < this.totalWaves &&
      (!this.waveActive || this.spawnQueue.length === 0);

    bus.emit('hud:state', {
      budget: this.budget,
      warBonds: saveManager.getWarBonds(),
      worldId: this.currentWorldId,
      stageId: this.currentStageId,
      stageTitle: this.stageConfig.title,
      fobHp: this.fobHp,
      fobMaxHp: this.fobMaxHp,
      currentWave: this.currentWave,
      totalWaves: this.totalWaves,
      waveActive: this.waveActive,
      inIntermission: this.inIntermission,
      wavePrepTimer: Math.ceil(this.wavePrepTimer),
      canCallEarly,
      earlyBonus: this.currentWave === 0 ? 0 : Math.round(25 + Math.max(0, this.wavePrepTimer) * 2.5),
      timeScale: this.timeScale,
      activeEnemies: this.enemyPool.activeCount,
      totalKills: this.totalKills,
      hasGlobalAesa: this.hasGlobalAesa,
      airSupport: {
        a10: { ...this.airSupport.a10 },
        hellfire: { ...this.airSupport.hellfire },
        b52: { ...this.airSupport.b52 }
      },
      nextWave: nextWaveDef
        ? {
            wave: nextWaveDef.wave,
            title: nextWaveDef.title,
            brief: nextWaveDef.brief,
            units: nextWaveDef.groups.map((g: any) => ({
              type: g.type,
              count: g.count,
              shortName: (ENEMY_DEFINITIONS as any)[g.type].shortName,
              armorLabel: (ENEMY_DEFINITIONS as any)[g.type].armorLabel,
              domain: (ENEMY_DEFINITIONS as any)[g.type].domain,
              isBoss: !!(ENEMY_DEFINITIONS as any)[g.type].isBoss
            }))
          }
        : null
    });
  }

  private pushRadio(text: string, level = 'info') {
    bus.emit('hud:radio', { text, level, wave: this.currentWave });
  }

  destroy() {
    if (!this.gameOver && (this.towers.length > 0 || this.currentWave > 0)) {
      this.saveCurrentMissionSnapshot(true);
    }
    cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    window.removeEventListener('pagehide', this.onBeforeUnload);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    for (const unsub of this.unsubs) unsub();
    if (this.diorama) this.diorama.dispose();
    this.controls.dispose();
    this.renderer.dispose();
    this.overlayEl.remove();
  }
}
