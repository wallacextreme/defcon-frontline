import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

import {
  QualityTier,
  ResolvedQualityConfig,
  resolveQualityConfig,
  applyOverridesToProfile,
  saveQualityTier,
  getThreeToneMapping,
  AdaptiveQualitySampler
} from './GraphicsQuality.ts';
import {
  BiomeEnvironmentHandle,
  createBiomeEnvironment,
  disposeBiomeEnvironmentCaches
} from './BiomeEnvironment3D.ts';

import { bus } from '../core/EventBus.js';
import { getPBRTextures } from './ProceduralPBRTextures.ts';
import { ObjectPool } from '../core/ObjectPool.js';
import {
  TOWER_DEFINITIONS,
  AIR_SUPPORT_DEFINITIONS,
  getTowerLevelSpec,
  getTowerUpgradeOptions
} from '../data/towers.js';
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
  TILE_SIZE,
  CELL
} from '../systems/Pathfinder.js';
import { resolveDamage } from '../systems/DamageSystem.js';
import { audio } from '../systems/AudioEngine.js';
import {
  multiplayer,
  getMaxTowersPerPlayer,
  getCoopEnemyScale,
  getCoopFobMaxHp,
  getRequiredWaveVotes,
  distributeKillReward,
  CombatNetEvent,
  SQUAD_COLORS,
  PingType
} from '../systems/MultiplayerManager.ts';
import {
  createTowerModel3D,
  createEnemyModel3D,
  createA10Warthog3D,
  createB52Bomber3D,
  createMissileMesh3D,
  prewarmAllMilitaryModels,
  updateTowerWearBiomeDirtColor,
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
import {
  createDesertTerrainWarmMesh,
  createBiomeTerrainWarmMesh
} from './TerrainSplatting3D.ts';
import { createBiomePropsWarmMeshes } from './BiomeProps3D.ts';
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
  ownerId: string;
  ownerName: string;
  ownerColor: string;
  ownerRingMesh?: THREE.Mesh;
  col: number;
  row: number;
  x: number;
  y: number;
  wx: number;
  wz: number;
  level: number;
  specialization: 'A' | 'B' | null;
  effectiveCost: number;
  totalInvested: number;
  hp: number;
  maxHp: number;
  shield: number;
  maxShield: number;
  priority: string;
  turretAngle: number;
  cooldownTimer: number;
  empTimer: number;
  empDisabledTimer: number;
  burnTimer: number;
  burnDps: number;
  corrosionTimer: number;
  corrosionDps: number;
  chillTimer: number;
  chillSlow: number;
  smokeTimer: number;
  trophyTimer: number;
  interceptTimer: number;
  incomeAccum: number;
  rebuildCooldownTimer: number;
  allyRangeBuff: number;
  allyFireRateBuff: number;
  allyCritBonus: number;
  allyKillBonus: number;
  allyHpBonus: number;
  repairCostDiscount: number;
  fogDebuff: boolean;
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
  shield: number;
  maxShield: number;
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
  revealedTimer: number;
  isBoss: boolean;
  isSubBoss: boolean;
  isStageBoss: boolean;
  isMegaBoss: boolean;
  slowImmune: boolean;
  frontalShieldReduction: number;
  isBurrowed: boolean;
  unburrowed: boolean;
  dismountCount: number;
  radius: number;
  resistances: Record<string, number> | null;
  path: Array<{ col: number; row: number; x: number; y: number }> | null;
  pathIndex: number;
  distToFob: number;
  ewSlow: number;
  ewDamageAmp: number;
  thermalVuln: number;
  ewDisabled: boolean;
  cryoSlow: number;
  cryoSlowTimer: number;
  rootTimer: number;
  stunTimer: number;
  poisonTimer: number;
  poisonDps: number;
  poisonSourceTower: TowerEntity | null;
  burnTimer: number;
  burnDps: number;
  burnSourceTower: TowerEntity | null;
  corrosionReduction: number;
  corrosionTimer: number;
  markedAmp: number;
  markedTimer: number;
  dotTickAccum: number;
  healAuraTimer: number;
  shieldAuraTimer: number;
  shockwaveTimer: number;
  hitFlashTimer: number;
  walkPhase: number;
  towerAttackTimer: number;
  attackPrepTimer: number;
  isPreparingAttack: boolean;
  pendingAttackTargets: TowerEntity[];
  empPulseTimer: number;
  periodicSpawnTimer: number;
  triggeredThresholds: Set<number>;
  damageByPlayer: Record<string, number>;
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
  critMultiplier: number;
  splashRadius: number;
  burnDps: number;
  burnDuration: number;
  poisonDps: number;
  poisonDuration: number;
  corrosionAmount: number;
  slowFactor: number;
  slowDuration: number;
  freezeDuration: number;
  rootDuration: number;
  markedAmp: number;
  thermalVuln: number;
  createsToxicZone: boolean;
  allowApsBypass: boolean;
  isMissile: boolean;
  isTopAttack: boolean;
  isArtillery: boolean;
  flightTime: number;
  totalFlightTime: number;
  sourceTower: TowerEntity | null;
  ownerId?: string;
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
  corrosionDps: number;
  corrosionDuration: number;
  chillDuration: number;
  chillSlow: number;
  empDisableDuration: number;
  flightTime: number;
  totalFlightTime: number;
  smokeTimer: number;
  alive: boolean;
}

interface ActiveMineEntity {
  x: number;
  y: number;
  wx: number;
  wz: number;
  damage: number;
  damageType: string;
  splashRadius: number;
  stunDuration: number;
  slowFactor: number;
  slowDuration: number;
  burnDps: number;
  burnDuration: number;
  heavyMultiplier: number;
  markedAmp: number;
  sourceTower: TowerEntity;
  mesh: THREE.Mesh;
}

interface DestroyedRuinEntity {
  col: number;
  row: number;
  wx: number;
  wz: number;
  defId: string;
  level: number;
  specialization: 'A' | 'B' | null;
  rebuildCost: number;
  mesh: THREE.Mesh;
  life: number;
}

interface TransientBeamEntity {
  line: THREE.Line;
  life: number;
}

interface FireZoneEntity {
  x: number;
  y: number;
  wx: number;
  wz: number;
  radius: number;
  dps: number;
  damageType: string;
  corrosionAmount: number;
  ownerId?: string;
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
  if (type === 'drone_swarm' || type === 'drone_recon') return 3.55;
  if (type === 'heli' || type === 'subboss_ka50' || type === 'drone_bombardeiro') return 4.25;
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
  private composer: EffectComposer | null = null;
  private composerRT: THREE.WebGLRenderTarget | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  private smaaPass: SMAAPass | null = null;
  private gtaoPass: GTAOPass | null = null;
  private outputPass: OutputPass | null = null;
  private controls!: OrbitControls;
  private diorama!: DioramaHandles;
  private effects!: Effects3D;
  private hemiLight!: THREE.HemisphereLight;
  private sunLight!: THREE.DirectionalLight;
  private rimLight!: THREE.DirectionalLight;
  private flashLights: THREE.PointLight[] = [];
  private flashLightCursor = 0;
  private flashLightTimers = [0, 0];

  private biomeEnv: BiomeEnvironmentHandle | null = null;
  private lastBiomeEnvSignature = '';
  private currentBiome: WorldBiome = 'desert';
  private qualityConfig!: ResolvedQualityConfig;
  private qualitySampler!: AdaptiveQualitySampler;
  private useComposer = true;
  private adaptiveEnabled = true;
  private skipAdaptiveFrames = 0;
  private lastEffectiveDpr = 1;
  private lastStageVisuals: {
    skyColor?: number;
    fogColor?: number;
    sunColor?: number;
    rimColor?: number;
    hasFogCells: boolean;
  } = { hasFogCells: false };
  private renderTelemetry = {
    sceneCalls: 0,
    totalCalls: 0,
    sceneTriangles: 0,
    totalTriangles: 0,
    lines: 0,
    points: 0
  };
  private readonly gtaoClipBox = new THREE.Box3(
    new THREE.Vector3(-64, -4, -40),
    new THREE.Vector3(64, 28, 40)
  );
  private panCamDir = new THREE.Vector3();
  private panCamRight = new THREE.Vector3();
  private panMove = new THREE.Vector3();
  private panNextTarget = new THREE.Vector3();
  private panActualMove = new THREE.Vector3();
  private readonly worldUp = new THREE.Vector3(0, 1, 0);
  private runtimeWarmMats: THREE.Material[] = [];
  private runtimeWarmGeos: THREE.BufferGeometry[] = [];

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
  private selectedEnemy: EnemyEntity | null = null;
  private hoveredEnemy: EnemyEntity | null = null;
  private hoverTile = { col: -1, row: -1 };
  private lastCanPlace: any = null;
  private lastTowerAttackWarnTime = -10;
  private extractorCapWarned = false;

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
  private activeMines: ActiveMineEntity[] = [];
  private destroyedRuins: DestroyedRuinEntity[] = [];
  private transientBeams: TransientBeamEntity[] = [];
  private mineGeo = new THREE.CylinderGeometry(0.42, 0.48, 0.18, 10);
  private mineMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.9, roughness: 0.4 });
  private empMineMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x7e22ce, emissiveIntensity: 1.1, roughness: 0.35 });
  private ruinGeo = new THREE.BoxGeometry(2.6, 0.35, 2.6);
  private ruinMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true, transparent: true, opacity: 0.65 });

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
  private ownerRingGeo = new THREE.RingGeometry(1.90, 1.99, 36);
  private pingBeaconGeo = new THREE.CylinderGeometry(0.14, 0.24, 9.5, 10, 1, true);
  private pingRingGeo = new THREE.RingGeometry(0.65, 0.9, 28);

  private rafId = 0;
  private lastFrameTime = performance.now();
  private hudSyncAccum = 0;
  private autosaveAccum = 0;
  private snapshotAccum = 0;
  private waveVoteTimer = 0;
  private armedPingType: PingType | null = null;
  private allyCursors = new Map<
    string,
    {
      col: number;
      row: number;
      wx: number;
      wz: number;
      callsign: string;
      color: string;
      group: THREE.Group;
      tileMesh: THREE.Mesh;
      ringMesh: THREE.LineLoop;
      labelEl: HTMLDivElement;
      updatedAt: number;
    }
  >();
  private activePings: Array<{
    wx: number;
    wz: number;
    life: number;
    maxLife: number;
    group: THREE.Group;
    ring: THREE.Mesh;
    labelEl: HTMLDivElement;
  }> = [];
  private clientEnemyTargets = new Map<
    number,
    { wx: number; wy: number; wz: number; angle: number }
  >();
  private coopUnsubs: Array<() => void> = [];
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
    this.initCoopCallbacks();
    this.bindPersistenceLifecycle();

    // Load saved stage & prewarm all models + runtime tower overlay shaders BEFORE player interaction
    this.loadStage(this.currentWorldId, this.currentStageId, true, initialMission);
    this.ghostModels = this.prewarmAllShaders();

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

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 680);
    this.camera.position.set(0, 62, 74);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });

    let rendererString = '';
    try {
      const gl = this.renderer.getContext();
      const debugExt = gl.getExtension('WEBGL_debug_renderer_info');
      rendererString = debugExt
        ? String(gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || '')
        : String(gl.getParameter(gl.RENDERER) || '');
    } catch {
      rendererString = '';
    }

    this.qualityConfig = resolveQualityConfig(window.location.search, {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      rendererString,
      gpuRenderer: rendererString
    });
    const hasExplicitOverrides =
      this.qualityConfig.source === 'query' || Object.keys(this.qualityConfig.overrides).length > 0;
    this.adaptiveEnabled = !hasExplicitOverrides;
    this.qualitySampler = new AdaptiveQualitySampler({
      initialTier: this.qualityConfig.tier
    });

    const profile = this.qualityConfig.profile;
    this.lastEffectiveDpr = this.qualitySampler.getEffectiveDpr(window.devicePixelRatio || 1);

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.lastEffectiveDpr);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = getThreeToneMapping(profile.toneMapMode);
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.info.autoReset = false;
    this.container.appendChild(this.renderer.domElement);

    getPBRTextures(this.renderer.capabilities.getMaxAnisotropy());

    // Strictly constant global light topology (5 lights total, NEVER added/removed at runtime!)
    this.hemiLight = new THREE.HemisphereLight(0x9ec0df, 0x6b563c, 0.78);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xffe9c2, 2.35);
    this.sunLight.position.set(46, 66, 38);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(profile.shadowMapSize, profile.shadowMapSize);
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 200;
    this.sunLight.shadow.camera.left = -62;
    this.sunLight.shadow.camera.right = 62;
    this.sunLight.shadow.camera.top = 42;
    this.sunLight.shadow.camera.bottom = -42;
    this.sunLight.shadow.bias = -0.0004;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);

    this.rimLight = new THREE.DirectionalLight(0x38bdf8, 0.72);
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

    this.rebuildPostProcessing(width, height);

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

  private prewarmAllShaders(): Map<string, { root: THREE.Group; setValid: (valid: boolean) => void }> {
    // Prewarm runtime tower overlay/weapon materials alongside all military models so placing
    // 12+ diverse towers after boot triggers Δprograms = 0 (materials kept alive until destroy()
    // so Chrome KHR_parallel_shader_compile never emits glGetProgramiv warnings).
    const warmRuntimeGroup = new THREE.Group();
    warmRuntimeGroup.position.set(0, -100, 0);

    const ownerRingWarmMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    });
    const selectedRingWarmMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide
    });
    const laserLineWarmMat = new THREE.LineBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.72
    });
    const laserLineWarmGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 1)
    ]);
    this.runtimeWarmMats.push(ownerRingWarmMat, selectedRingWarmMat, laserLineWarmMat);
    this.runtimeWarmGeos.push(laserLineWarmGeo);

    warmRuntimeGroup.add(new THREE.Mesh(this.ownerRingGeo, ownerRingWarmMat));
    warmRuntimeGroup.add(new THREE.Mesh(this.ewPulseGeo, ownerRingWarmMat));
    warmRuntimeGroup.add(new THREE.Mesh(this.ownerRingGeo, selectedRingWarmMat));
    warmRuntimeGroup.add(new THREE.Line(laserLineWarmGeo, laserLineWarmMat));
    warmRuntimeGroup.add(new THREE.Mesh(this.laserBeamGeo, this.laserBeamMat));
    warmRuntimeGroup.add(new THREE.Mesh(this.fireZoneGeo, this.fireZoneMat));
    warmRuntimeGroup.add(new THREE.Mesh(this.mineGeo, this.mineMat));
    warmRuntimeGroup.add(new THREE.Mesh(this.mineGeo, this.empMineMat));
    warmRuntimeGroup.add(new THREE.Mesh(this.shellGeo, this.shellMat));
    warmRuntimeGroup.add(new THREE.Mesh(this.bulletGeo, this.bulletMat));
    warmRuntimeGroup.add(new THREE.Mesh(this.ruinGeo, this.ruinMat));
    warmRuntimeGroup.add(createDesertTerrainWarmMesh());
    warmRuntimeGroup.add(createBiomeTerrainWarmMesh());
    warmRuntimeGroup.add(...createBiomePropsWarmMeshes());
    this.scene.add(warmRuntimeGroup);

    // Compile against the active composer offscreen RT when composer is enabled so RenderPass
    // reuses 100% of compiled Linear+NoToneMapping shader programs at runtime (Δprograms = 0).
    const prevTarget = this.renderer.getRenderTarget();
    try {
      if (this.useComposer && this.composer) {
        this.renderer.setRenderTarget(this.composer.writeBuffer);
      }
      return prewarmAllMilitaryModels(this.scene, this.camera, this.renderer, this.ghostGroup);
    } finally {
      this.renderer.setRenderTarget(prevTarget);
      this.scene.remove(warmRuntimeGroup);
    }
  }

  private disposePostProcessing() {
    if (this.gtaoPass) {
      this.gtaoPass.gtaoMaterial?.dispose();
      this.gtaoPass.blendMaterial?.dispose();
      (this.gtaoPass as any).normalRenderTarget?.depthTexture?.dispose?.();
      this.gtaoPass.dispose();
      this.gtaoPass = null;
    }
    if (this.bloomPass) {
      this.bloomPass.dispose();
      this.bloomPass = null;
    }
    if (this.smaaPass) {
      this.smaaPass.dispose();
      this.smaaPass = null;
    }
    if (this.outputPass) {
      this.outputPass.dispose();
      this.outputPass = null;
    }
    if (this.composer) {
      this.composer.dispose();
      this.composer = null;
    }
    this.composerRT = null;
  }

  private rebuildPostProcessing(width: number, height: number) {
    this.disposePostProcessing();

    const w = Math.max(1, width);
    const h = Math.max(1, height);
    const profile = this.qualityConfig.profile;
    const dpr = this.renderer.getPixelRatio();

    this.renderer.toneMapping = getThreeToneMapping(profile.toneMapMode);

    if (this.sunLight.shadow.mapSize.width !== profile.shadowMapSize) {
      this.sunLight.shadow.mapSize.set(profile.shadowMapSize, profile.shadowMapSize);
      if (this.sunLight.shadow.map) {
        this.sunLight.shadow.map.dispose();
        this.sunLight.shadow.map = null;
      }
      this.sunLight.shadow.needsUpdate = true;
    }

    this.useComposer = profile.useComposer;
    if (!this.useComposer) {
      return;
    }

    const maxSamples = this.renderer.capabilities.maxSamples || 0;
    const wantMsaa = profile.aaMode === 'msaa' && profile.msaaSamples > 0 && maxSamples >= 2;
    const samples = wantMsaa ? Math.min(profile.msaaSamples, maxSamples) : 0;

    this.composerRT = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      samples,
      storeMultisampledColorBuffer: false
    });
    this.composer = new EffectComposer(this.renderer, this.composerRT);
    this.composer.setPixelRatio(dpr);
    this.composer.setSize(w, h);

    const renderPass = new RenderPass(this.scene, this.camera);
    const origRenderPass = renderPass.render.bind(renderPass);
    const renderer = this.renderer;
    const telemetry = this.renderTelemetry;
    renderPass.render = function wrappedRenderPass(
      r: THREE.WebGLRenderer,
      writeBuffer: THREE.WebGLRenderTarget,
      readBuffer: THREE.WebGLRenderTarget,
      deltaTime: number,
      maskActive: boolean
    ) {
      origRenderPass(r, writeBuffer, readBuffer, deltaTime, maskActive);
      telemetry.sceneCalls = renderer.info.render.calls;
      telemetry.sceneTriangles = renderer.info.render.triangles;
      telemetry.lines = renderer.info.render.lines;
      telemetry.points = renderer.info.render.points;
    };
    this.composer.addPass(renderPass);

    if (profile.gtaoEnabled) {
      const halfW = Math.max(1, Math.floor(w * dpr * 0.5));
      const halfH = Math.max(1, Math.floor(h * dpr * 0.5));
      const gtaoPass = new GTAOPass(this.scene, this.camera, halfW, halfH);
      gtaoPass.output = GTAOPass.OUTPUT.Default;
      gtaoPass.blendIntensity = 0.65;
      gtaoPass.setSceneClipBox(this.gtaoClipBox);
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
      const origGtaoSetSize = gtaoPass.setSize.bind(gtaoPass);
      gtaoPass.setSize = (sw: number, sh: number) => {
        origGtaoSetSize(Math.max(1, Math.floor(sw * 0.5)), Math.max(1, Math.floor(sh * 0.5)));
      };
      this.gtaoPass = gtaoPass;
      this.composer.addPass(gtaoPass);
    }

    if (profile.bloomEnabled && profile.bloomMode !== 'off') {
      this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(w, h),
        profile.bloomStrength,
        profile.bloomRadius,
        profile.bloomThreshold
      );
      this.composer.addPass(this.bloomPass);
    }

    const needSmaa = profile.aaMode === 'smaa' || (profile.aaMode === 'msaa' && maxSamples < 2);
    if (needSmaa) {
      // Three.js r187: SMAAPass takes 0 arguments and operates in linear-sRGB before OutputPass
      this.smaaPass = new SMAAPass();
      this.composer.addPass(this.smaaPass);
    }

    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);
    this.composer.setSize(w, h);
  }

  private applyBiomeEnvironment(
    biome: WorldBiome,
    skyColor?: number,
    fogColor?: number,
    sunColor?: number,
    rimColor?: number,
    hasFogCells = false
  ) {
    this.currentBiome = biome;
    updateTowerWearBiomeDirtColor(biome);
    this.lastStageVisuals.skyColor = skyColor;
    this.lastStageVisuals.fogColor = fogColor;
    this.lastStageVisuals.sunColor = sunColor;
    this.lastStageVisuals.rimColor = rimColor;
    this.lastStageVisuals.hasFogCells = hasFogCells;

    const profile = this.qualityConfig.profile;
    const envSignature = [
      biome,
      profile.iblMode,
      profile.envEnabled ? 1 : 0,
      skyColor ?? '',
      fogColor ?? '',
      sunColor ?? '',
      rimColor ?? ''
    ].join('|');

    let handle = this.biomeEnv;
    if (!handle || this.lastBiomeEnvSignature !== envSignature) {
      // Dispose previous PMREM cube RT + skyDome BEFORE building next (0 leaks across 20 stages)
      if (this.biomeEnv) {
        this.biomeEnv.dispose();
        this.biomeEnv = null;
      }
      handle = createBiomeEnvironment(this.renderer, biome, {
        iblMode: profile.iblMode,
        envEnabled: profile.envEnabled,
        skyColorOverride: skyColor,
        fogColorOverride: fogColor,
        sunColorOverride: sunColor,
        rimColorOverride: rimColor
      });
      this.biomeEnv = handle;
      this.lastBiomeEnvSignature = envSignature;
      this.scene.add(handle.skyDome);
      this.scene.environment = handle.envMap;
    } else if (!handle.skyDome.parent) {
      this.scene.add(handle.skyDome);
    }

    const spec = handle.lighting;
    this.scene.environmentIntensity = profile.envEnabled ? spec.envIntensity : 0;

    if (this.scene.background instanceof THREE.Color) {
      this.scene.background.setHex(spec.skyColor);
    } else {
      this.scene.background = new THREE.Color(spec.skyColor);
    }

    const baseFogDensity = hasFogCells ? 0.0046 : spec.fogDensity;
    const effectiveFogDensity = this.computeEffectiveFogDensity(baseFogDensity);
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.setHex(spec.fogColor);
      this.scene.fog.density = effectiveFogDensity;
    } else {
      this.scene.fog = new THREE.FogExp2(spec.fogColor, effectiveFogDensity);
    }

    // Update persistent lights IN-PLACE (light count remains strictly constant)
    this.hemiLight.color.setHex(spec.hemiSkyColor);
    this.hemiLight.groundColor.setHex(spec.hemiGroundColor);
    this.hemiLight.intensity = profile.envEnabled ? spec.hemiIntensity : spec.hemiIntensity * 1.18;

    this.sunLight.color.setHex(spec.sunColor);
    this.sunLight.intensity = spec.sunIntensity;
    this.sunLight.position.set(spec.sunPosition[0], spec.sunPosition[1], spec.sunPosition[2]);

    this.rimLight.color.setHex(spec.rimColor);
    this.rimLight.intensity = spec.rimIntensity;
    this.rimLight.position.set(spec.rimPosition[0], spec.rimPosition[1], spec.rimPosition[2]);

    this.renderer.toneMapping = getThreeToneMapping(profile.toneMapMode);
    this.renderer.toneMappingExposure = spec.exposure;
  }

  private computePortraitDistance(aspect: number, fovDeg: number): number {
    const vFovRad = THREE.MathUtils.degToRad(fovDeg);
    const tanHalfH = Math.tan(vFovRad * 0.5) * Math.max(0.45, aspect);
    const elevRad = THREE.MathUtils.degToRad(54);
    // Keep full 112x64 board + plinth/Spawns/FOB margins (±58u at front z=+33u) unclipped
    return 58.0 / tanHalfH + 33.0 * Math.cos(elevRad);
  }

  private computeEffectiveFogDensity(baseDensity: number): number {
    const w = this.container.clientWidth || window.innerWidth || 1000;
    const h = this.container.clientHeight || window.innerHeight || 640;
    const aspect = w / Math.max(1, h);
    if (aspect < 1.0) {
      const dist = this.computePortraitDistance(aspect, this.camera ? this.camera.fov : 62);
      return baseDensity * Math.min(1.0, 100.0 / Math.max(100.0, dist));
    }
    return baseDensity;
  }

  private applyEffectiveDpr(dpr: number) {
    if (Math.abs(dpr - this.lastEffectiveDpr) < 0.005) return;
    this.lastEffectiveDpr = dpr;
    const w = this.container.clientWidth || window.innerWidth || 1000;
    const h = this.container.clientHeight || window.innerHeight || 640;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h);
    if (this.composer) {
      this.composer.setPixelRatio(dpr);
      this.composer.setSize(w, h);
    }
  }

  setQualityTier(tier: QualityTier, persist = true) {
    const nextProfile = applyOverridesToProfile(tier, this.qualityConfig.overrides);
    this.qualityConfig = {
      ...this.qualityConfig,
      tier,
      profile: nextProfile
    };
    if (persist) {
      saveQualityTier(tier);
    }
    this.qualitySampler.reset(tier);
    this.skipAdaptiveFrames = 4;

    const w = this.container.clientWidth || window.innerWidth || 1000;
    const h = this.container.clientHeight || window.innerHeight || 640;
    const nextDpr = this.qualitySampler.getEffectiveDpr(window.devicePixelRatio || 1);
    this.lastEffectiveDpr = nextDpr;
    this.renderer.setPixelRatio(nextDpr);
    this.renderer.setSize(w, h);

    this.rebuildPostProcessing(w, h);
    this.applyBiomeEnvironment(
      this.currentBiome,
      this.lastStageVisuals.skyColor,
      this.lastStageVisuals.fogColor,
      this.lastStageVisuals.sunColor,
      this.lastStageVisuals.rimColor,
      this.lastStageVisuals.hasFogCells
    );
  }

  getVisualPipelineInfo() {
    const profile = this.qualityConfig.profile;
    const composerSamples = this.composer?.renderTarget1?.samples ?? 0;
    let aaMode = 'OFF (samples=0)';
    if (!this.useComposer) {
      aaMode = 'Native MSAA';
    } else if (composerSamples > 0) {
      aaMode = `MSAA ${composerSamples}x`;
    } else if (this.smaaPass) {
      aaMode = 'SMAA';
    }

    const iblMode = !profile.envEnabled
      ? 'OFF'
      : profile.iblMode === 'room'
        ? 'RoomEnv'
        : 'BiomePMREM';

    const bloomMode =
      !this.useComposer || !this.bloomPass || !profile.bloomEnabled || profile.bloomMode === 'off'
        ? 'OFF'
        : profile.bloomMode === 'legacy'
          ? `Legacy(${profile.bloomThreshold})`
          : `HDR(${profile.bloomThreshold})`;

    return {
      qualityTier: this.qualityConfig.tier,
      qualitySource: this.qualityConfig.source,
      useComposer: this.useComposer,
      aaMode,
      composerSamples,
      toneMappingMode: profile.toneMapMode,
      toneMappingCode: this.renderer.toneMapping,
      toneMappingExposure: this.renderer.toneMappingExposure,
      iblMode,
      envIntensity: this.scene.environmentIntensity,
      bloomMode,
      bloomThreshold: this.bloomPass ? this.bloomPass.threshold : null,
      bloomStrength: this.bloomPass ? this.bloomPass.strength : null,
      gtaoEnabled: Boolean(this.useComposer && this.gtaoPass),
      shadowMapSize: this.sunLight.shadow.mapSize.width,
      effectiveDpr: this.renderer.getPixelRatio(),
      lightCount: 5
    };
  }

  getRenderTelemetry() {
    return {
      sceneCalls: this.renderTelemetry.sceneCalls,
      totalCalls: this.renderTelemetry.totalCalls,
      sceneTriangles: this.renderTelemetry.sceneTriangles,
      totalTriangles: this.renderTelemetry.totalTriangles,
      lines: this.renderTelemetry.lines,
      points: this.renderTelemetry.points
    };
  }

  private renderFrame() {
    this.renderer.info.reset();
    if (this.useComposer && this.composer) {
      this.composer.render();
      this.renderTelemetry.totalCalls = this.renderer.info.render.calls;
      this.renderTelemetry.totalTriangles = this.renderer.info.render.triangles;
    } else {
      this.renderer.render(this.scene, this.camera);
      this.renderTelemetry.sceneCalls = this.renderer.info.render.calls;
      this.renderTelemetry.totalCalls = this.renderTelemetry.sceneCalls;
      this.renderTelemetry.sceneTriangles = this.renderer.info.render.triangles;
      this.renderTelemetry.totalTriangles = this.renderTelemetry.sceneTriangles;
      this.renderTelemetry.lines = this.renderer.info.render.lines;
      this.renderTelemetry.points = this.renderer.info.render.points;
    }
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
      this.camera.fov = 62;
      if (this.controls) {
        const reqDist = this.computePortraitDistance(aspect, this.camera.fov);
        this.controls.maxDistance = Math.max(210, Math.ceil(reqDist * 1.2));
      }
    } else if (aspect < 1.35) {
      this.camera.fov = 48;
      if (this.controls) this.controls.maxDistance = 210;
    } else {
      this.camera.fov = 42;
      if (this.controls) this.controls.maxDistance = 210;
    }
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  resetCameraView() {
    const w = this.container.clientWidth || window.innerWidth || 1000;
    const h = this.container.clientHeight || window.innerHeight || 640;
    const aspect = w / Math.max(1, h);
    this.controls.target.set(0, 0, 0);
    this.applyResponsiveCameraFov(w, h);
    if (aspect < 1.0) {
      const dist = this.computePortraitDistance(aspect, this.camera.fov);
      const elevRad = THREE.MathUtils.degToRad(54);
      this.camera.position.set(0, dist * Math.sin(elevRad), dist * Math.cos(elevRad));
    } else {
      this.camera.position.set(0, 62, 74);
    }
    this.controls.update();
  }

  private onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w <= 0 || h <= 0) return;
    this.applyResponsiveCameraFov(w, h);
    const dpr = this.qualitySampler.getEffectiveDpr(window.devicePixelRatio || 1);
    this.lastEffectiveDpr = dpr;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h);
    if (this.composer) {
      this.composer.setPixelRatio(dpr);
      this.composer.setSize(w, h);
    }
    if (this.biomeEnv && this.scene.fog instanceof THREE.FogExp2) {
      const baseDensity = this.lastStageVisuals.hasFogCells ? 0.0046 : this.biomeEnv.lighting.fogDensity;
      this.scene.fog.density = this.computeEffectiveFogDensity(baseDensity);
    }
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
          shield: 0,
          maxShield: 0,
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
          revealedTimer: 0,
          isBoss: false,
          isSubBoss: false,
          isStageBoss: false,
          isMegaBoss: false,
          slowImmune: false,
          frontalShieldReduction: 0,
          isBurrowed: false,
          unburrowed: false,
          dismountCount: 0,
          radius: 14,
          resistances: null,
          path: null,
          pathIndex: 0,
          distToFob: 9999,
          ewSlow: 0,
          ewDamageAmp: 0,
          thermalVuln: 0,
          ewDisabled: false,
          cryoSlow: 0,
          cryoSlowTimer: 0,
          rootTimer: 0,
          stunTimer: 0,
          poisonTimer: 0,
          poisonDps: 0,
          poisonSourceTower: null,
          burnTimer: 0,
          burnDps: 0,
          burnSourceTower: null,
          corrosionReduction: 0,
          corrosionTimer: 0,
          markedAmp: 0,
          markedTimer: 0,
          dotTickAccum: 0,
          healAuraTimer: 1.5,
          shieldAuraTimer: 1.5,
          shockwaveTimer: 6.0,
          hitFlashTimer: 0,
          walkPhase: Math.random() * 6.28,
          towerAttackTimer: 2.0,
          attackPrepTimer: 0,
          isPreparingAttack: false,
          pendingAttackTargets: [],
          empPulseTimer: 5.0,
          periodicSpawnTimer: 8.0,
          triggeredThresholds: new Set<number>(),
          damageByPlayer: {},
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
            if (this.selectedEnemy === e) {
              this.selectedEnemy = null;
            }
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
          critMultiplier: 1.6,
          splashRadius: 0,
          burnDps: 0,
          burnDuration: 0,
          poisonDps: 0,
          poisonDuration: 0,
          corrosionAmount: 0,
          slowFactor: 0,
          slowDuration: 0,
          freezeDuration: 0,
          rootDuration: 0,
          markedAmp: 0,
          thermalVuln: 0,
          createsToxicZone: false,
          allowApsBypass: false,
          isMissile: false,
          isTopAttack: false,
          isArtillery: false,
          flightTime: 0,
          totalFlightTime: 1,
          sourceTower: null,
          ownerId: undefined,
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
        multiplayer.sendCursorMove(
          col,
          row,
          this.activeTool?.kind === 'build' ? this.activeTool.towerId : null
        );
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
        if (this.armedPingType) {
          this.armedPingType = null;
          bus.emit('hud:pingArmed', null);
        } else if (this.activeTool) {
          this.cancelActiveTool();
        } else if (this.selectedTower) {
          this.selectTower(null);
        }
        return;
      }

      if (button !== 0 || this.gameOver) return;

      if (this.armedPingType) {
        multiplayer.sendTacticalPing(this.armedPingType, col, row, this.hoverWorld.x, this.hoverWorld.z);
        this.armedPingType = null;
        bus.emit('hud:pingArmed', null);
        return;
      }

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
        bus.emit('hud:openMobileInspector');
        audio.playUi('click');
      } else if (this.hoveredEnemy) {
        this.selectTower(null);
        this.selectEnemy(this.hoveredEnemy);
        bus.emit('hud:openMobileInspector');
        audio.playUi('click');
      } else {
        const ruinIdx = this.destroyedRuins.findIndex((r) => r.col === col && r.row === row);
        if (ruinIdx !== -1) {
          this.tryRebuildRuin(ruinIdx);
        } else {
          this.selectTower(null);
          this.selectEnemy(null);
        }
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
        this.armedPingType = null;
        bus.emit('hud:pingArmed', null);
        this.cancelActiveTool();
        this.selectTower(null);
      } else if (ev.key === ' ') {
        ev.preventDefault();
        this.togglePause();
      } else if (lower === 'g') {
        const activeTargetPing: PingType | null = this.armedPingType ? null : 'BOSS';
        this.armedPingType = activeTargetPing;
        if (activeTargetPing) this.cancelActiveTool();
        bus.emit('hud:pingArmed', activeTargetPing);
        audio.playUi('click');
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
      bus.on('cmd:specializeTower', ({ branch }: { branch: 'A' | 'B' }) => this.specializeSelectedTower(branch)),
      bus.on('cmd:repairTower', () => this.repairSelectedTower()),
      bus.on('cmd:repairAllTowers', () => this.repairAllTowers()),
      bus.on('cmd:inspectEnemy', (enemyType: string) => this.inspectEnemyDefinition(enemyType)),
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
      }),
      bus.on('cmd:armPing', (pingType: PingType | null) => {
        this.armedPingType = this.armedPingType === pingType ? null : pingType;
        if (this.armedPingType) {
          this.cancelActiveTool();
        }
        audio.playUi('click');
        bus.emit('hud:pingArmed', this.armedPingType);
      }),
      bus.on('cmd:donateCash', ({ toPlayerId, amount }: { toPlayerId: string; amount: number }) => {
        if (multiplayer.isClient()) {
          multiplayer.sendCombatCommand('CMD_DONATE_CASH', { toPlayerId, amount });
        } else if (multiplayer.isHost()) {
          this.handleDonateCash(multiplayer.localPeerId, toPlayerId, amount);
        }
      }),
      bus.on('cmd:coopStartMatch', ({ worldId, stageId }: { worldId: number; stageId: number }) => {
        if (!multiplayer.isHost()) return;
        const stCfg = getStageConfig(worldId, stageId);
        multiplayer.startCoopMatch(worldId, stageId, stCfg?.startingBudget || 750);
      })
    ];
  }

  private initCoopCallbacks() {
    this.coopUnsubs = [
      multiplayer.onStartMatch(({ worldId, stageId }) => {
        saveManager.clearActiveMission();
        saveManager.selectStage(worldId, stageId);
        this.loadStage(worldId, stageId, false, null);
        audio.playUi('wave');
      }),
      multiplayer.onRemoteRadio((msg) => {
        this.pushRadio(msg.text, msg.level);
      }),
      multiplayer.onAllyCursor((cur) => this.handleAllyCursor(cur)),
      multiplayer.onTacticalPing((ping) => this.spawnTacticalPingVisual(ping)),
      multiplayer.onHostCommand((type, payload, senderId) => this.handleHostCoopCommand(type, payload, senderId)),
      multiplayer.onSnapshot((snap) => this.applyClientSnapshot(snap)),
      multiplayer.onCombatEvents((events) => this.handleClientCombatEvents(events)),
      multiplayer.onResyncRequest(() => {
        if (multiplayer.isHost()) {
          this.broadcastCoopSnapshot();
        }
      }),
      multiplayer.onOwnershipRebind(({ oldPeerId, newPeerId, callsign }) => {
        for (const t of this.towers) {
          if (t.ownerId === oldPeerId) {
            t.ownerId = newPeerId;
            if (callsign) t.ownerName = callsign;
          }
        }
        this.enemyPool.forEachActive((obj) => {
          const e = obj as EnemyEntity;
          if (e.damageByPlayer && e.damageByPlayer[oldPeerId] !== undefined) {
            e.damageByPlayer[newPeerId] = (e.damageByPlayer[newPeerId] || 0) + e.damageByPlayer[oldPeerId];
            delete e.damageByPlayer[oldPeerId];
          }
        });
        if (multiplayer.isHost()) {
          this.broadcastCoopSnapshot();
        }
      }),
      multiplayer.onCommandReject(({ commandType, reason }) => {
        this.pushRadio(`⚠️ Comando ${commandType} rejeitado: ${reason}`, 'warn');
        audio.playUi('error');
      })
    ];
  }

  private getActorBudget(actorId = multiplayer.localPeerId): number {
    if (!multiplayer.isActive()) return this.budget;
    const p = multiplayer.getPlayer(actorId);
    if (!p) return actorId === multiplayer.localPeerId ? this.budget : 0;
    return p.budget;
  }

  private addActorBudget(actorId: string, delta: number) {
    if (!multiplayer.isActive()) {
      this.budget = Math.max(0, Math.round(this.budget + delta));
      return;
    }
    const p = multiplayer.getPlayer(actorId);
    if (p) {
      p.budget = Math.max(0, Math.round(p.budget + delta));
      if (p.peerId === multiplayer.localPeerId) {
        this.budget = p.budget;
      }
    }
  }

  private syncHostPlayerTowerCounts() {
    if (!multiplayer.isActive()) return;
    const cap = getMaxTowersPerPlayer(multiplayer.getConnectedPlayerCount());
    for (const p of multiplayer.getPlayers()) {
      p.towerCount = this.towers.filter((t) => t.ownerId === p.peerId).length;
      p.maxTowers = cap;
    }
  }

  private handleHostCoopCommand(type: string, payload: any, senderId: string) {
    if (!multiplayer.isHost() || this.gameOver) return;
    if (type === 'CMD_BUILD_TOWER') {
      this.tryPlaceTower(payload.col, payload.row, payload.towerType, senderId);
    } else if (type === 'CMD_UPGRADE_TOWER') {
      const t = this.towers.find((x) => x.id === payload.towerId);
      if (t) this.upgradeTowerByActor(t, senderId);
    } else if (type === 'CMD_SPECIALIZE_TOWER') {
      const t = this.towers.find((x) => x.id === payload.towerId);
      if (t) this.specializeTowerByActor(t, payload.branch, senderId);
    } else if (type === 'CMD_SET_TARGETING') {
      const t = this.towers.find((x) => x.id === payload.towerId);
      if (t) this.setTowerPriorityByActor(t, payload.mode, senderId);
    } else if (type === 'CMD_SELL_TOWER') {
      const t = this.towers.find((x) => x.id === payload.towerId);
      if (t) this.sellTowerByActor(t, senderId);
    } else if (type === 'CMD_REPAIR_TOWER') {
      const t = this.towers.find((x) => x.id === payload.towerId);
      if (t) this.repairTowerByActor(t, senderId);
    } else if (type === 'CMD_REPAIR_ALL') {
      this.repairAllTowersByActor(senderId);
    } else if (type === 'CMD_REBUILD_RUBBLE') {
      const idx = this.destroyedRuins.findIndex((r) => r.col === payload.col && r.row === payload.row);
      if (idx !== -1) this.tryRebuildRuin(idx, false, senderId);
    } else if (type === 'CMD_AIR_SUPPORT') {
      const simX = worldToSimX(payload.worldX ?? 0);
      const simY = worldToSimY(payload.worldZ ?? 0);
      if (payload.supportType === 'a10') {
        this.executeA10Strafe(simX, simY, payload.angle || 0, senderId);
      } else if (payload.supportType === 'hellfire') {
        this.executeHellfireStrike(simX, simY, senderId);
      } else if (payload.supportType === 'b52') {
        this.executeB52CarpetBomb(simX, simY, senderId);
      }
    } else if (type === 'CMD_VOTE_NEXT_WAVE') {
      this.handleVoteNextWave(senderId);
    } else if (type === 'CMD_DONATE_CASH') {
      this.handleDonateCash(senderId, payload.toPlayerId, Number(payload.amount));
    }
  }

  private handleDonateCash(fromPeerId: string, toPeerId: string, amount: number) {
    if (!multiplayer.isHost()) return;
    const check = multiplayer.validateDonation(fromPeerId, toPeerId, amount);
    if (!check.ok) {
      if (fromPeerId === multiplayer.localPeerId) {
        this.pushRadio(check.error || 'Doação recusada.', 'warn');
        audio.playUi('error');
      }
      return;
    }
    const sender = multiplayer.getPlayer(fromPeerId)!;
    const receiver = multiplayer.getPlayer(toPeerId)!;
    this.addActorBudget(fromPeerId, -amount);
    this.addActorBudget(toPeerId, amount);
    const msg = `💸 ${sender.callsign} enviou $${amount} para ${receiver.callsign}!`;
    this.pushRadio(msg, 'good');
    multiplayer.broadcastRadio(msg, 'good', this.currentWave);
    multiplayer.broadcastLobbyState();
    this.emitFullHudSync();
  }

  private handleVoteNextWave(actorId: string) {
    if (this.gameOver || !multiplayer.isHost()) return;
    if (this.waveActive && (this.spawnQueue.length > 0 || this.currentWave >= this.totalWaves)) return;
    if (this.currentWave >= this.totalWaves) return;

    const p = multiplayer.getPlayer(actorId);
    const voteRes = multiplayer.registerWaveVote(actorId);
    if (!voteRes.passed && voteRes.votes > 0 && this.waveVoteTimer <= 0) {
      this.waveVoteTimer = 20;
      multiplayer.setWaveVoteTimer(20);
    }

    const countdownSuffix = !voteRes.passed && this.waveVoteTimer > 0 ? ` • auto em ${Math.ceil(this.waveVoteTimer)}s` : '';
    const msg = `🗳️ ${p?.callsign || 'CMDR'} votou para chamar Onda ${this.currentWave + 1} (${voteRes.votes}/${voteRes.required}${countdownSuffix}).`;
    this.pushRadio(msg, 'info');
    multiplayer.broadcastRadio(msg, 'info', this.currentWave);

    if (voteRes.passed) {
      this.waveVoteTimer = 0;
      multiplayer.setWaveVoteTimer(0);
      this.startNextWave(true, true);
    } else {
      this.broadcastCoopSnapshot();
      this.emitFullHudSync();
    }
  }

  private handleAllyCursor(cur: {
    playerId: string;
    callsign: string;
    color: string;
    col: number;
    row: number;
    selectedTowerType: string | null;
  }) {
    if (!cur || cur.playerId === multiplayer.localPeerId) return;
    if (!this.pathfinder.inBounds(cur.col, cur.row)) return;

    let entry = this.allyCursors.get(cur.playerId);
    const { x: wx, z: wz } = cellToWorldCenter(cur.col, cur.row);
    const colorHex = new THREE.Color(cur.color || SQUAD_COLORS[1]).getHex();

    if (!entry) {
      const group = new THREE.Group();
      const tileMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(CELL_WORLD * 0.9, CELL_WORLD * 0.9),
        new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.28,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      tileMesh.rotation.x = -Math.PI / 2;
      tileMesh.position.y = 0.08;
      group.add(tileMesh);

      const ringMesh = this.createCircleLoop(36, colorHex, 0.72);
      ringMesh.position.y = 0.11;
      group.add(ringMesh);
      this.scene.add(group);

      const labelEl = document.createElement('div');
      labelEl.className = 'ally-cursor-tag';
      labelEl.style.borderColor = cur.color;
      labelEl.style.color = cur.color;
      this.overlayEl.appendChild(labelEl);

      entry = {
        col: cur.col,
        row: cur.row,
        wx,
        wz,
        callsign: cur.callsign,
        color: cur.color,
        group,
        tileMesh,
        ringMesh,
        labelEl,
        updatedAt: this.elapsedReal
      };
      this.allyCursors.set(cur.playerId, entry);
    }

    entry.col = cur.col;
    entry.row = cur.row;
    entry.wx = wx;
    entry.wz = wz;
    entry.callsign = cur.callsign;
    entry.updatedAt = this.elapsedReal;
    entry.group.visible = true;
    entry.group.position.set(wx, 0, wz);

    const def = cur.selectedTowerType ? (TOWER_DEFINITIONS as any)[cur.selectedTowerType] : null;
    const range = def?.levels?.[0]?.range || 0;
    if (range > 0) {
      entry.ringMesh.visible = true;
      entry.ringMesh.scale.setScalar(range * WORLD_SCALE);
    } else {
      entry.ringMesh.visible = false;
    }
    entry.labelEl.textContent = def ? `${cur.callsign} [${def.shortName}]` : cur.callsign;
  }

  private spawnTacticalPingVisual(ping: {
    playerId: string;
    callsign: string;
    color: string;
    pingType: PingType;
    col: number;
    row: number;
    worldX: number;
    worldZ: number;
  }) {
    const pingTextMap: Record<PingType, string> = {
      AA: '⚠️ PRECISO DE ANTIAÉREO AQUI!',
      BOSS: '🎯 FOQUEM NO CHEFE / ALVO PESADO!',
      REPAIR: '🔧 REPAREM ESTA DEFESA!',
      CASH: '💰 PRECISO DE SUPRIMENTO ($)!'
    };
    const msg = pingTextMap[ping.pingType] || pingTextMap.BOSS;
    const colorHex = new THREE.Color(ping.color || '#facc15').getHex();

    const wx = Number.isFinite(ping.worldX) ? ping.worldX : cellToWorldCenter(ping.col, ping.row).x;
    const wz = Number.isFinite(ping.worldZ) ? ping.worldZ : cellToWorldCenter(ping.col, ping.row).z;

    const group = new THREE.Group();
    group.position.set(wx, 0, wz);

    const beacon = new THREE.Mesh(
      this.pingBeaconGeo,
      new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    beacon.position.y = 4.75;
    group.add(beacon);

    const ring = new THREE.Mesh(
      this.pingRingGeo,
      new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.16;
    group.add(ring);
    this.scene.add(group);

    const labelEl = document.createElement('div');
    labelEl.className = 'tactical-ping-label';
    labelEl.style.borderColor = ping.color;
    labelEl.style.color = ping.color;
    labelEl.textContent = `${ping.callsign}: ${msg}`;
    this.overlayEl.appendChild(labelEl);

    this.activePings.push({
      wx,
      wz,
      life: 4.0,
      maxLife: 4.0,
      group,
      ring,
      labelEl
    });

    audio.playUi('ping');
    this.pushRadio(`📡 ${ping.callsign}: ${msg}`, 'warn');
  }

  private updateCoopVisuals(dt: number) {
    for (let i = this.activePings.length - 1; i >= 0; i--) {
      const p = this.activePings[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.scene.remove(p.group);
        p.group.traverse((ch: any) => {
          if (ch.material) ch.material.dispose?.();
        });
        p.labelEl.remove();
        this.activePings.splice(i, 1);
        continue;
      }
      const prog = 1 - p.life / p.maxLife;
      const wave = (prog * 3) % 1;
      p.ring.scale.setScalar(0.8 + wave * 2.8);
      (p.ring.material as THREE.MeshBasicMaterial).opacity = (1 - wave) * 0.85;
      p.labelEl.style.opacity = String(Math.min(1, p.life * 1.5));
    }

    for (const [, cur] of this.allyCursors) {
      const age = this.elapsedReal - cur.updatedAt;
      const visible = multiplayer.isActive() && age < 6.0;
      cur.group.visible = visible;
      if (!visible) cur.labelEl.classList.add('hidden');
    }
  }

  private clearCoopVisuals() {
    for (const [, cur] of this.allyCursors) {
      this.scene.remove(cur.group);
      cur.labelEl.remove();
    }
    this.allyCursors.clear();
    for (const p of this.activePings) {
      this.scene.remove(p.group);
      p.labelEl.remove();
    }
    this.activePings = [];
    this.clientEnemyTargets.clear();
  }

  private broadcastCoopSnapshot() {
    if (!multiplayer.isHost()) return;
    this.syncHostPlayerTowerCounts();
    const enemies: any[] = [];
    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      enemies.push({
        id: e.id,
        type: e.type,
        wx: Number(e.wx.toFixed(2)),
        wy: Number(e.wy.toFixed(2)),
        wz: Number(e.wz.toFixed(2)),
        x: Math.round(e.x),
        y: Math.round(e.y),
        angle: Number(e.angle.toFixed(2)),
        hp: Math.ceil(e.hp),
        maxHp: e.maxHp,
        shield: Math.round(e.shield),
        maxShield: e.maxShield,
        isStealth: e.isStealth,
        stealthRevealed: e.stealthRevealed,
        isBurrowed: e.isBurrowed,
        eraIntact: e.eraIntact,
        ewDisabled: e.ewDisabled,
        isPreparingAttack: e.isPreparingAttack
      });
    });

    const towers = this.towers.map((t) => ({
      id: t.id,
      defId: t.defId,
      ownerId: t.ownerId,
      ownerName: t.ownerName,
      ownerColor: t.ownerColor,
      col: t.col,
      row: t.row,
      level: t.level,
      specialization: t.specialization,
      hp: Math.ceil(t.hp),
      maxHp: t.maxHp,
      shield: Math.round(t.shield),
      maxShield: Math.round(t.maxShield),
      effectiveCost: t.effectiveCost,
      totalInvested: t.totalInvested,
      priority: t.priority,
      turretAngle: Number(t.turretAngle.toFixed(2)),
      totalDamage: Math.round(t.totalDamage),
      kills: t.kills,
      empDisabledTimer: Number(t.empDisabledTimer.toFixed(1)),
      burnTimer: Number(t.burnTimer.toFixed(1)),
      corrosionTimer: Number(t.corrosionTimer.toFixed(1)),
      chillTimer: Number(t.chillTimer.toFixed(1))
    }));

    const ruins = this.destroyedRuins.map((r) => ({
      col: r.col,
      row: r.row,
      defId: r.defId,
      level: r.level,
      specialization: r.specialization,
      rebuildCost: r.rebuildCost
    }));

    const players = multiplayer.getPlayers().map((p) => ({
      peerId: p.peerId,
      budget: p.budget,
      towerCount: p.towerCount,
      maxTowers: p.maxTowers
    }));

    const lobby = multiplayer.getLobbyState();
    multiplayer.broadcastSnapshot({
      worldId: this.currentWorldId,
      stageId: this.currentStageId,
      fobHp: this.fobHp,
      fobMaxHp: this.fobMaxHp,
      currentWave: this.currentWave,
      totalWaves: this.totalWaves,
      waveActive: this.waveActive,
      inIntermission: this.inIntermission,
      wavePrepTimer: Number(this.wavePrepTimer.toFixed(1)),
      totalKills: this.totalKills,
      totalDamage: Math.round(this.totalDamage),
      hasGlobalAesa: this.hasGlobalAesa,
      timeScale: this.timeScale,
      gameOver: this.gameOver,
      victory: this.victory,
      waveVotes: lobby.waveVotes,
      requiredVotes: lobby.requiredVotes,
      waveVoteTimer: Math.ceil(this.waveVoteTimer),
      players,
      airSupport: {
        a10: { ...this.airSupport.a10 },
        hellfire: { ...this.airSupport.hellfire },
        b52: { ...this.airSupport.b52 }
      },
      towers,
      enemies,
      ruins
    });
  }

  private handleClientCombatEvents(events: CombatNetEvent[]) {
    if (!multiplayer.isClient() || !Array.isArray(events) || events.length === 0) return;
    const playedSfx = new Set<string>();

    for (const evt of events) {
      if (evt.kind === 'FIRE') {
        const tower = evt.towerId ? this.towers.find((t) => t.id === evt.towerId) : undefined;
        const start = new THREE.Vector3(evt.wx ?? tower?.wx ?? 0, evt.wy ?? 1.2, evt.wz ?? tower?.wz ?? 0);
        const end = new THREE.Vector3(evt.targetX ?? start.x, 0.7, evt.targetZ ?? start.z);
        if (tower) {
          tower.recoil = 0.22;
          tower.muzzleFlashTimer = 0.06;
          if (tower.rig.muzzleFlashMesh) tower.rig.muzzleFlashMesh.visible = true;
          if (evt.targetX !== undefined && evt.targetZ !== undefined) {
            tower.turretAngle = Math.atan2(evt.targetX - tower.wx, evt.targetZ - tower.wz);
            if (tower.rig.turretPivot) tower.rig.turretPivot.rotation.y = tower.turretAngle;
          }
        }

        const kind = evt.damageType || tower?.defId || 'm2_bunker';
        let beamColor = 0xfef08a;
        let sfxKey = 'mg50';
        let duration = 0.12;
        if (kind === 'railgun' || kind === 'helios_laser') {
          beamColor = 0x38bdf8;
          sfxKey = kind === 'railgun' ? 'railgun' : 'laser';
          duration = 0.2;
        } else if (kind === 'tesla_tower') {
          beamColor = 0x60a5fa;
          sfxKey = 'tesla';
          duration = 0.16;
        } else if (kind === 'sniper_tower') {
          beamColor = 0xfef08a;
          sfxKey = 'sniper';
          duration = 0.15;
        } else if (kind === 'flamethrower') {
          beamColor = 0xf97316;
          sfxKey = 'flame';
          duration = 0.16;
        } else if (kind === 'abrams_pit' || kind === 'howitzer') {
          beamColor = 0xfb923c;
          sfxKey = 'howitzer';
          this.effects.spawnExplosion(start.x, start.y, start.z, 0.45, 0xfacc15, false);
        } else if (kind === 'javelin' || kind === 'patriot' || kind === 'tos1_mlrs') {
          beamColor = 0xfbbf24;
          sfxKey = 'missile';
          this.effects.spawnSmokePuff(start.x, start.y, start.z, 0xe2e8f0, 0.65);
        } else if (kind === 'cryo_tower') {
          beamColor = 0x7dd3fc;
          sfxKey = 'cryo';
        } else if (kind === 'toxic_tower') {
          beamColor = 0x84cc16;
          sfxKey = 'toxic';
        } else if (kind === 'bushmaster') {
          beamColor = 0xfb923c;
          sfxKey = 'autocannon';
        } else if (kind === 'phalanx') {
          beamColor = 0x7dd3fc;
          sfxKey = 'ciws';
        } else if (kind === 'ballista' || kind === 'harpoon_tower') {
          beamColor = 0xf59e0b;
          sfxKey = 'ballista';
        }

        if (evt.targetX !== undefined && evt.targetZ !== undefined) {
          this.addTransientBeam(start, end, beamColor, duration);
          this.effects.spawnSparks(end.x, end.y, end.z, 2, beamColor);
        } else {
          this.effects.spawnSparks(start.x, start.y, start.z, 2, beamColor);
        }

        if (!playedSfx.has(sfxKey)) {
          playedSfx.add(sfxKey);
          audio.playShot(sfxKey);
        }
      } else if (evt.kind === 'EXPLODE') {
        const ex = evt.wx ?? 0;
        const ey = evt.wy ?? 0.5;
        const ez = evt.wz ?? 0;
        const sc = evt.scale ?? 1.0;
        this.effects.spawnExplosion(ex, ey, ez, sc, evt.color ?? 0xf97316, true);
        if (evt.damageType !== 'silent' && !playedSfx.has('explode')) {
          playedSfx.add('explode');
          audio.playExplosion(Math.min(1.6, sc));
        }
      } else if (evt.kind === 'EMP_PULSE') {
        this.effects.spawnShockwave(evt.wx ?? 0, evt.wy ?? 0.3, evt.wz ?? 0, evt.scale ?? 12, evt.color ?? 0xc084fc);
        if (!playedSfx.has('emp')) {
          playedSfx.add('emp');
          audio.playShot('emp');
        }
      }
    }
  }

  private applyClientSnapshot(snap: any) {
    if (!snap || !multiplayer.isClient()) return;
    if (snap.worldId !== this.currentWorldId || snap.stageId !== this.currentStageId) {
      this.loadStage(snap.worldId, snap.stageId, false, null);
    }

    this.fobHp = snap.fobHp;
    this.fobMaxHp = snap.fobMaxHp;
    this.currentWave = snap.currentWave;
    this.totalWaves = snap.totalWaves;
    this.waveActive = snap.waveActive;
    this.inIntermission = snap.inIntermission;
    this.wavePrepTimer = snap.wavePrepTimer;
    this.totalKills = snap.totalKills;
    this.totalDamage = snap.totalDamage;
    this.hasGlobalAesa = snap.hasGlobalAesa;
    this.timeScale = snap.timeScale;
    this.waveVoteTimer = snap.waveVoteTimer || 0;
    multiplayer.setWaveVoteTimer(this.waveVoteTimer);
    if (snap.airSupport) {
      this.airSupport.a10.timer = snap.airSupport.a10.timer;
      this.airSupport.hellfire.timer = snap.airSupport.hellfire.timer;
      this.airSupport.b52.timer = snap.airSupport.b52.timer;
    }

    if (Array.isArray(snap.players)) {
      for (const sp of snap.players) {
        const localP = multiplayer.getPlayer(sp.peerId);
        if (localP) {
          localP.budget = sp.budget;
          localP.towerCount = sp.towerCount;
          localP.maxTowers = sp.maxTowers;
        }
        if (sp.peerId === multiplayer.localPeerId) {
          this.budget = sp.budget;
        }
      }
      multiplayer.emitLobbyUpdate();
    }

    // Reconcile towers
    const snapTowers = snap.towers || [];
    const seenIds = new Set<string>();
    for (const st of snapTowers) {
      seenIds.add(st.id);
      let existing = this.towers.find((t) => t.id === st.id);
      if (!existing) {
        existing = this.spawnTowerOnGrid({
          id: st.id,
          col: st.col,
          row: st.row,
          towerId: st.defId,
          level: st.level,
          specialization: st.specialization ?? null,
          hp: st.hp,
          maxHp: st.maxHp,
          effectiveCost: st.effectiveCost,
          totalInvested: st.totalInvested,
          priority: st.priority,
          turretAngle: st.turretAngle,
          totalDamage: st.totalDamage,
          kills: st.kills,
          ownerId: st.ownerId,
          ownerName: st.ownerName,
          ownerColor: st.ownerColor
        });
        this.rerouteActiveGroundEnemies();
      } else {
        const rigChanged = existing.level !== st.level || existing.specialization !== st.specialization;
        existing.level = st.level;
        existing.specialization = st.specialization ?? null;
        existing.hp = st.hp;
        existing.maxHp = st.maxHp;
        existing.shield = st.shield || 0;
        existing.maxShield = st.maxShield || 0;
        existing.priority = st.priority;
        existing.turretAngle = st.turretAngle;
        existing.totalDamage = st.totalDamage;
        existing.kills = st.kills;
        existing.empDisabledTimer = st.empDisabledTimer || 0;
        existing.burnTimer = st.burnTimer || 0;
        existing.corrosionTimer = st.corrosionTimer || 0;
        existing.chillTimer = st.chillTimer || 0;
        if (existing.rig.turretPivot) {
          existing.rig.turretPivot.rotation.y = existing.turretAngle;
        }
        if (rigChanged) {
          this.rebuildTowerRigVisual(existing);
        }
      }
    }
    for (const t of [...this.towers]) {
      if (!seenIds.has(t.id)) {
        this.removeTowerFromMap(t);
      }
    }

    // Reconcile ruins
    const snapRuins = snap.ruins || [];
    if (snapRuins.length !== this.destroyedRuins.length) {
      for (const r of this.destroyedRuins) this.scene.remove(r.mesh);
      this.destroyedRuins = [];
      for (const sr of snapRuins) {
        const { x: wx, z: wz } = cellToWorldCenter(sr.col, sr.row);
        const mesh = new THREE.Mesh(this.ruinGeo, this.ruinMat);
        mesh.position.set(wx, 0.22, wz);
        this.scene.add(mesh);
        this.destroyedRuins.push({
          col: sr.col,
          row: sr.row,
          wx,
          wz,
          defId: sr.defId,
          level: sr.level,
          specialization: sr.specialization,
          rebuildCost: sr.rebuildCost,
          mesh,
          life: 0
        });
      }
    }

    // Reconcile enemies with smooth interpolation targets
    const snapEnemies = snap.enemies || [];
    const activeIds = new Set<number>();
    const activeById = new Map<number, EnemyEntity>();
    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      activeById.set(e.id, e);
    });

    for (const se of snapEnemies) {
      activeIds.add(se.id);
      let e = activeById.get(se.id);
      if (!e) {
        const spawned = this.spawnEnemy(se.type, 0, { x: se.x, y: se.y });
        if (spawned) {
          spawned.id = se.id;
          spawned.wx = se.wx;
          spawned.wy = se.wy;
          spawned.wz = se.wz;
          spawned.angle = se.angle;
          spawned.rig?.root.position.set(se.wx, 0, se.wz);
          e = spawned;
        }
      }
      if (e) {
        e.x = se.x;
        e.y = se.y;
        e.hp = se.hp;
        e.maxHp = se.maxHp;
        e.shield = se.shield;
        e.maxShield = se.maxShield;
        e.isStealth = se.isStealth;
        e.stealthRevealed = se.stealthRevealed;
        e.isBurrowed = se.isBurrowed;
        e.eraIntact = se.eraIntact;
        e.ewDisabled = se.ewDisabled;
        e.isPreparingAttack = se.isPreparingAttack;
        this.updateEnemyHealthBar(e);
        this.clientEnemyTargets.set(se.id, {
          wx: se.wx,
          wy: se.wy,
          wz: se.wz,
          angle: se.angle
        });
      }
    }
    for (const [id, e] of activeById) {
      if (!activeIds.has(id)) {
        this.clientEnemyTargets.delete(id);
        this.enemyPool.release(e);
      }
    }

    if (snap.gameOver && !this.gameOver) {
      this.gameOver = true;
      this.victory = !!snap.victory;
      if (this.victory) {
        const baseWB = this.stageConfig.clearBonusWB || 60;
        const coopBonusWB = Math.round(baseWB * (multiplayer.getConnectedPlayerCount() > 1 ? 1.25 : 1));
        if (!multiplayer.isHostSignalLost()) {
          this.sessionWB += coopBonusWB;
          saveManager.markStageCompleted(this.currentWorldId, this.currentStageId, coopBonusWB);
        }
        bus.emit('hud:gameover', {
          victory: true,
          wave: this.currentWave,
          totalWaves: this.totalWaves,
          kills: this.totalKills,
          damage: this.totalDamage,
          wbEarned: this.sessionWB,
          newlyUnlocked: null,
          worldId: this.currentWorldId,
          stageId: this.currentStageId,
          coopBonusPercent: multiplayer.getConnectedPlayerCount() > 1 ? 25 : 0
        });
      } else {
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
    }

    this.emitFullHudSync(snap.waveVotes, snap.requiredVotes);
    if (this.selectedTower) {
      bus.emit('hud:selectedTower', this.serializeTower(this.selectedTower));
    }
  }

  saveCurrentMissionSnapshot(forceEvenIfEmpty = false) {
    if (this.gameOver || multiplayer.isHostSignalLost()) return;
    if (!forceEvenIfEmpty && this.towers.length === 0 && this.currentWave === 0) return;

    const completedWave = this.waveActive ? Math.max(0, this.currentWave - 1) : this.currentWave;
    const towers: SavedTowerSnapshot[] = this.towers.map((t) => ({
      defId: t.defId,
      col: t.col,
      row: t.row,
      level: t.level,
      specialization: t.specialization,
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
        specialization: st.specialization ?? null,
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
    for (const m of this.activeMines) {
      this.scene.remove(m.mesh);
    }
    for (const r of this.destroyedRuins) {
      this.scene.remove(r.mesh);
    }
    for (const tb of this.transientBeams) {
      this.scene.remove(tb.line);
      tb.line.geometry.dispose();
    }

    this.bossProjectiles = [];
    this.fireZones = [];
    this.activeFlyovers = [];
    this.activeMines = [];
    this.destroyedRuins = [];
    this.transientBeams = [];
    this.pendingShots = [];
    this.towers = [];
    this.towerGrid = Array.from({ length: GRID_ROWS }, () => new Array(GRID_COLS).fill(null));
    this.selectedEnemy = null;
    this.hoveredEnemy = null;
    this.extractorCapWarned = false;

    this.pathfinder.loadStageLayout(this.stageConfig);

    // Swap 3D Diorama for the stage's biome & road network
    if (this.diorama) {
      this.scene.remove(this.diorama.group);
      this.diorama.dispose();
    }
    this.diorama = createBattlefieldDiorama3D(
      this.pathfinder.baseTerrain,
      (this.stageConfig.biome || this.worldConfig.biome) as WorldBiome,
      this.stageConfig.spawnPoints,
      this.stageConfig.fobPoint,
      {
        restrictedCells: this.stageConfig.restrictedCells,
        iceCells: this.stageConfig.iceCells,
        fogCells: this.stageConfig.fogCells,
        toxicCells: this.stageConfig.toxicCells,
        lavaCells: this.stageConfig.lavaCells
      }
    );
    this.scene.add(this.diorama.group);

    const stageBiome = (this.stageConfig.biome || this.worldConfig.biome) as WorldBiome;
    const skyColor = this.stageConfig.skyColor ?? this.worldConfig.skyColor;
    const fogColor = this.stageConfig.fogColor ?? this.worldConfig.fogColor;
    const sunColor = this.stageConfig.sunColor ?? this.worldConfig.sunColor;
    const rimColor = this.stageConfig.rimColor ?? this.worldConfig.rimColor;
    const hasFogCells = Boolean(this.stageConfig.fogCells?.length);
    this.applyBiomeEnvironment(stageBiome, skyColor, fogColor, sunColor, rimColor, hasFogCells);
    this.skipAdaptiveFrames = 3;

    const startingBudget = this.stageConfig.startingBudget || 750;
    const localPlayer = multiplayer.isActive() ? multiplayer.getLocalPlayer() : null;
    this.budget = localPlayer ? localPlayer.budget : startingBudget;
    this.sessionWB = 0;
    this.fobMaxHp = multiplayer.getFobMaxHp();
    this.fobHp = this.fobMaxHp;
    this.waveVoteTimer = 0;
    multiplayer.setWaveVoteTimer(0);
    this.armedPingType = null;
    bus.emit('hud:pingArmed', null);
    this.clearCoopVisuals();
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

  private getEffectiveTowerMaxHp(
    towerId: string,
    level: number,
    specialization: 'A' | 'B' | null = null,
    hpBuffBonus = 0
  ): number {
    const def = (TOWER_DEFINITIONS as any)[towerId];
    if (!def) return 500;
    const spec = getTowerLevelSpec(def, level, specialization);
    const baseHp = spec?.maxHp || def.maxHp || 500;
    const levelMult = spec?.maxHp ? 1 : 1 + (level - 1) * 0.35;
    const mults = saveManager.getTechMultipliers(towerId);
    return Math.round(baseHp * levelMult * mults.hpMult * (1 + hpBuffBonus));
  }

  private getEffectiveSpec(tower: TowerEntity) {
    const spec = getTowerLevelSpec(tower.def, tower.level, tower.specialization);
    const mults = saveManager.getTechMultipliers(tower.defId);
    const chillMult = tower.chillTimer > 0 ? Math.max(0.4, 1 - (tower.chillSlow || 0.3)) : 1;
    const fogRangeMult = tower.fogDebuff ? 0.78 : 1;
    const effectiveRangeMult = Math.max(0.5, (1 + (tower.allyRangeBuff || 0)) * fogRangeMult);
    const effectiveRateMult = Math.max(0.35, mults.fireRateMult * (1 + (tower.allyFireRateBuff || 0)) * chillMult);
    return {
      ...spec,
      range: Math.round((spec.range || 0) * effectiveRangeMult),
      damage: Math.round((spec.damage || 0) * mults.damageMult),
      fireRate: (spec.fireRate || 0) * effectiveRateMult,
      critChance: Math.min(0.85, (spec.critChance || 0) + (tower.allyCritBonus || 0)),
      burnDps: spec.burnDps ? Math.round(spec.burnDps * mults.damageMult) : 0,
      poisonDps: spec.poisonDps ? Math.round(spec.poisonDps * mults.damageMult) : 0
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

    if (multiplayer.isActive() && !multiplayer.getLoadout().includes(towerId)) {
      const def = (TOWER_DEFINITIONS as any)[towerId];
      this.pushRadio(
        `${def?.shortName || towerId} não está no seu Deck Tático Co-op (6 torres)!`,
        'warn'
      );
      audio.playUi('error');
      return;
    }

    if (this.activeTool?.kind === 'build' && this.activeTool.towerId === towerId) {
      this.cancelActiveTool();
      return;
    }
    this.armedPingType = null;
    bus.emit('hud:pingArmed', null);
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
    if (this.getActorBudget(multiplayer.localPeerId) < sup.cost) {
      this.pushRadio(`Orçamento insuficiente ($${sup.cost} necessário).`, 'warn');
      audio.playUi('error');
      return;
    }
    this.armedPingType = null;
    bus.emit('hud:pingArmed', null);
    this.activeTool = { kind: 'support', supportId };
    this.controls.enableRotate = supportId !== 'a10';
    this.selectTower(null);
    audio.playUi('click');
    bus.emit('hud:tool', this.activeTool);
  }

  cancelActiveTool() {
    this.activeTool = null;
    this.armedPingType = null;
    this.strafeDragStart = null;
    this.lastCanPlace = null;
    this.controls.enableRotate = true;
    this.ghostGroup.visible = false;
    this.clearGroup(this.previewRouteGroup);
    this.clearGroup(this.supportReticleGroup);
    bus.emit('hud:tool', null);
    bus.emit('hud:pingArmed', null);
  }

  selectTower(tower: TowerEntity | null, clearEnemy = true) {
    this.selectedTower = tower;
    if (clearEnemy && this.selectedEnemy) {
      this.selectedEnemy = null;
      bus.emit('hud:selectedEnemy', null);
    }
    if (tower) {
      this.activeTool = null;
      this.controls.enableRotate = true;
      this.ghostGroup.visible = false;
      this.clearGroup(this.previewRouteGroup);
      this.clearGroup(this.supportReticleGroup);
      bus.emit('hud:tool', null);
      bus.emit('hud:selectedEnemy', null);
    }
    this.rebuildSelectedTowerOverlay();
    bus.emit('hud:selectedTower', this.serializeTower(tower));
  }

  selectEnemy(enemy: EnemyEntity | null) {
    this.selectedEnemy = enemy;
    if (enemy) {
      this.selectTower(null, false);
      this.rebuildSelectedTowerOverlay();
      bus.emit('hud:selectedEnemy', this.serializeEnemy(enemy));
    } else {
      bus.emit('hud:selectedEnemy', null);
    }
  }

  inspectEnemyDefinition(enemyType: string) {
    const def = (ENEMY_DEFINITIONS as any)[enemyType];
    if (!def) return;
    this.selectedEnemy = null;
    this.selectTower(null, false);
    audio.playUi('click');
    bus.emit('hud:selectedEnemy', {
      id: 0,
      isPreview: true,
      type: enemyType,
      name: def.name,
      category: def.category || 'ground',
      domain: def.domain || 'ground',
      armorClass: def.armorClass || 'unarmored',
      hp: def.maxHp,
      maxHp: def.maxHp,
      shield: def.maxShield || 0,
      maxShield: def.maxShield || 0,
      speed: def.speed,
      reward: def.reward,
      fobDamage: def.fobDamage,
      isStealth: !!def.isStealth,
      stealthRevealed: false,
      isBurrowed: !!def.canBurrow,
      isBoss: !!def.isBoss,
      weaponName: def.weaponName || null,
      towerAttack: def.towerAttack || null,
      resistances: def.resistances || {},
      aiBehavior: def.aiBehavior || null,
      roleSummary: def.roleSummary || ''
    });
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
    id?: string;
    col: number;
    row: number;
    towerId: string;
    level: number;
    specialization?: 'A' | 'B' | null;
    hp: number;
    maxHp: number;
    effectiveCost: number;
    totalInvested: number;
    priority: string;
    turretAngle: number;
    totalDamage: number;
    kills: number;
    ownerId?: string;
    ownerName?: string;
    ownerColor?: string;
  }): TowerEntity {
    const { col, row, towerId, level } = opts;
    const specialization = opts.specialization ?? null;
    const ownerId = opts.ownerId || (multiplayer.isActive() ? multiplayer.localPeerId : 'local');
    const pInfo = multiplayer.getPlayer(ownerId);
    const ownerName = opts.ownerName || pInfo?.callsign || multiplayer.getCallsign();
    const ownerColor = opts.ownerColor || pInfo?.color || SQUAD_COLORS[0];
    const def = (TOWER_DEFINITIONS as any)[towerId];
    this.pathfinder.placeStructure(col, row, !!def.isBarrier);

    const cx = col * TILE_SIZE + TILE_SIZE * 0.5;
    const cy = row * TILE_SIZE + TILE_SIZE * 0.5;
    const { x: wx, z: wz } = cellToWorldCenter(col, row);

    const rig = createTowerModel3D(towerId, level, specialization);
    rig.root.position.set(wx, 0, wz);
    this.scene.add(rig.root);

    const ownerRingMesh = new THREE.Mesh(
      this.ownerRingGeo,
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(ownerColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: multiplayer.isActive() ? 0.85 : 0.45,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
      })
    );
    ownerRingMesh.rotation.x = -Math.PI / 2;
    ownerRingMesh.position.set(wx, 0.035, wz);
    this.scene.add(ownerRingMesh);

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
      id: opts.id || `${towerId}_${Date.now()}_${Math.random()}`,
      defId: towerId,
      def,
      ownerId,
      ownerName,
      ownerColor,
      ownerRingMesh,
      col,
      row,
      x: cx,
      y: cy,
      wx,
      wz,
      level,
      specialization,
      effectiveCost: opts.effectiveCost,
      totalInvested: opts.totalInvested,
      hp: Math.min(opts.maxHp, opts.hp),
      maxHp: opts.maxHp,
      shield: 0,
      maxShield: 0,
      priority: opts.priority,
      turretAngle: opts.turretAngle,
      cooldownTimer: 0,
      empTimer: 0,
      empDisabledTimer: 0,
      burnTimer: 0,
      burnDps: 0,
      corrosionTimer: 0,
      corrosionDps: 0,
      chillTimer: 0,
      chillSlow: 0,
      smokeTimer: 0,
      trophyTimer: 0,
      interceptTimer: 0,
      incomeAccum: 0,
      rebuildCooldownTimer: 0,
      allyRangeBuff: 0,
      allyFireRateBuff: 0,
      allyCritBonus: 0,
      allyKillBonus: 0,
      allyHpBonus: 0,
      repairCostDiscount: 0,
      fogDebuff: false,
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

    const pulseColors: Record<string, number> = {
      ew_crew: 0xa855f7,
      iron_dome: 0x2dd4bf,
      eng_workshop: 0x38bdf8,
      energy_extractor: 0xfacc15,
      cryo_tower: 0x7dd3fc
    };
    if (pulseColors[towerId] !== undefined) {
      const pulseMesh = new THREE.Mesh(
        this.ewPulseGeo,
        new THREE.MeshBasicMaterial({
          color: pulseColors[towerId],
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

  tryPlaceTower(col: number, row: number, towerId: string, actorId = multiplayer.localPeerId) {
    const def = (TOWER_DEFINITIONS as any)[towerId];
    if (!def) return;
    if (actorId === multiplayer.localPeerId && !saveManager.isTowerUnlocked(towerId)) return;

    const maxTowers = multiplayer.isActive()
      ? getMaxTowersPerPlayer(multiplayer.getConnectedPlayerCount())
      : 30;
    const actorTowerCount = this.towers.filter((t) => t.ownerId === actorId).length;
    if (actorTowerCount >= maxTowers) {
      if (actorId === multiplayer.localPeerId) {
        this.pushRadio(`Limite de torres atingido (${actorTowerCount}/${maxTowers}). Venda ou aprimore torres existentes!`, 'warn');
        audio.playUi('error');
      }
      return;
    }

    const effectiveCost = this.getEffectiveTowerCost(towerId);
    if (this.getActorBudget(actorId) < effectiveCost) {
      if (actorId === multiplayer.localPeerId) {
        this.pushRadio(`Orçamento insuficiente para ${def.shortName} ($${effectiveCost}).`, 'warn');
        audio.playUi('error');
      }
      return;
    }

    const groundEnemies = this.enemyPool.active.filter((e: EnemyEntity) => e.domain === 'ground');
    const check = this.pathfinder.canPlaceAt(col, row, groundEnemies);
    if (!check.ok) {
      if (actorId === multiplayer.localPeerId) {
        this.pushRadio(check.reason, 'alert');
        const { x, z } = cellToWorldCenter(col, row);
        this.spawnFloatingText(x, 2.2, z, 'ROTA BLOQUEADA!', '#ef4444');
        audio.playUi('error');
      }
      return;
    }

    if (multiplayer.isClient() && actorId === multiplayer.localPeerId) {
      multiplayer.sendCombatCommand('CMD_BUILD_TOWER', { towerType: towerId, col, row });
      audio.playUi('click');
      if (!def.isBarrier && !this.shiftHeld) {
        this.cancelActiveTool();
      }
      return;
    }

    // Clear any leftover ruin on this tile
    const ruinIdx = this.destroyedRuins.findIndex((r) => r.col === col && r.row === row);
    if (ruinIdx !== -1) {
      this.scene.remove(this.destroyedRuins[ruinIdx].mesh);
      this.destroyedRuins.splice(ruinIdx, 1);
    }

    this.addActorBudget(actorId, -effectiveCost);
    const maxHp = this.getEffectiveTowerMaxHp(towerId, 1, null);
    const ownerInfo = multiplayer.getPlayer(actorId);
    const tower = this.spawnTowerOnGrid({
      col,
      row,
      towerId,
      level: 1,
      specialization: null,
      hp: maxHp,
      maxHp,
      effectiveCost,
      totalInvested: effectiveCost,
      priority: def.defaultPriority,
      turretAngle: Math.PI / 2,
      totalDamage: 0,
      kills: 0,
      ownerId: actorId,
      ownerName: ownerInfo?.callsign || multiplayer.getCallsign(),
      ownerColor: ownerInfo?.color || SQUAD_COLORS[0]
    });

    this.syncHostPlayerTowerCounts();
    this.refreshGlobalBuffs();
    this.rerouteActiveGroundEnemies();
    this.rebuildActiveRouteLines();
    this.evaluatePlacementPreview();
    if (!multiplayer.isActive()) {
      this.saveCurrentMissionSnapshot();
    }

    audio.playUi('build');
    this.spawnFloatingText(tower.wx, 2.5, tower.wz, `-$${effectiveCost}`, ownerInfo?.color || '#facc15');
    this.emitFullHudSync();

    if (actorId === multiplayer.localPeerId && !def.isBarrier && !this.shiftHeld) {
      this.cancelActiveTool();
      this.selectTower(tower);
    }
  }

  upgradeSelectedTower() {
    const t = this.selectedTower;
    if (!t || t.def.isBarrier) return;
    if (!multiplayer.canModifyTower(t.ownerId, multiplayer.localPeerId)) {
      this.pushRadio(`Apenas ${t.ownerName} pode aprimorar esta torre!`, 'warn');
      audio.playUi('error');
      return;
    }
    if (multiplayer.isClient()) {
      multiplayer.sendCombatCommand('CMD_UPGRADE_TOWER', { towerId: t.id });
      audio.playUi('click');
      return;
    }
    this.upgradeTowerByActor(t, multiplayer.localPeerId);
  }

  private upgradeTowerByActor(t: TowerEntity, actorId: string) {
    if (!t || t.def.isBarrier) return;
    if (!multiplayer.canModifyTower(t.ownerId, actorId)) return;
    const opt = getTowerUpgradeOptions(t.def, t.level, t.specialization);
    if (!opt) return;
    if (opt.kind === 'specialize') {
      if (actorId === multiplayer.localPeerId) {
        this.pushRadio(`Escolha a Especialização A ou B no inspetor de ${t.def.shortName}.`, 'info');
        audio.playUi('click');
        bus.emit('hud:selectedTower', this.serializeTower(t));
      }
      return;
    }

    if (this.getActorBudget(actorId) < opt.cost) {
      if (actorId === multiplayer.localPeerId) {
        this.pushRadio(`Falta orçamento para upgrade ($${opt.cost}).`, 'warn');
        audio.playUi('error');
      }
      return;
    }

    const oldRatio = t.maxHp > 0 ? t.hp / t.maxHp : 1;
    this.addActorBudget(actorId, -opt.cost);
    t.totalInvested += opt.cost;
    t.level = opt.nextLevel;
    t.maxHp = this.getEffectiveTowerMaxHp(t.defId, t.level, t.specialization, t.allyHpBonus);
    t.hp = Math.min(t.maxHp, Math.round(t.maxHp * Math.max(oldRatio, 0.55) + 150));

    this.rebuildTowerRigVisual(t);

    this.refreshGlobalBuffs();
    this.rebuildSelectedTowerOverlay();
    if (!multiplayer.isActive()) this.saveCurrentMissionSnapshot();
    audio.playUi('build');
    this.spawnFloatingText(t.wx, 3.2, t.wz, `UPGRADE NV${t.level}!`, '#38bdf8');
    if (actorId === multiplayer.localPeerId) {
      this.pushRadio(`${t.def.shortName} promovida para ${opt.name}.`, 'info');
    }
    if (this.selectedTower === t) {
      bus.emit('hud:selectedTower', this.serializeTower(t));
    }
    this.emitFullHudSync();
  }

  specializeSelectedTower(branch: 'A' | 'B') {
    const t = this.selectedTower;
    if (!t || t.def.isBarrier || t.specialization) return;
    if (!multiplayer.canModifyTower(t.ownerId, multiplayer.localPeerId)) {
      this.pushRadio(`Apenas ${t.ownerName} pode especializar esta torre!`, 'warn');
      audio.playUi('error');
      return;
    }
    if (multiplayer.isClient()) {
      multiplayer.sendCombatCommand('CMD_SPECIALIZE_TOWER', { towerId: t.id, branch });
      audio.playUi('click');
      return;
    }
    this.specializeTowerByActor(t, branch, multiplayer.localPeerId);
  }

  private specializeTowerByActor(t: TowerEntity, branch: 'A' | 'B', actorId: string) {
    if (!t || t.def.isBarrier || t.specialization) return;
    if (!multiplayer.canModifyTower(t.ownerId, actorId)) return;
    const opt = getTowerUpgradeOptions(t.def, t.level, t.specialization);
    if (!opt || opt.kind !== 'specialize') return;
    const branchData = opt.branches?.[branch];
    if (!branchData) return;

    if (this.getActorBudget(actorId) < branchData.cost) {
      if (actorId === multiplayer.localPeerId) {
        this.pushRadio(`Falta orçamento para especialização ${branch} ($${branchData.cost}).`, 'warn');
        audio.playUi('error');
      }
      return;
    }

    const oldRatio = t.maxHp > 0 ? t.hp / t.maxHp : 1;
    this.addActorBudget(actorId, -branchData.cost);
    t.totalInvested += branchData.cost;
    t.specialization = branch;
    t.level = opt.nextLevel;
    t.maxHp = this.getEffectiveTowerMaxHp(t.defId, t.level, branch, t.allyHpBonus);
    t.hp = Math.min(t.maxHp, Math.round(t.maxHp * Math.max(oldRatio, 0.65) + 220));

    this.rebuildTowerRigVisual(t);

    this.refreshGlobalBuffs();
    this.rebuildSelectedTowerOverlay();
    if (!multiplayer.isActive()) this.saveCurrentMissionSnapshot();
    audio.playUi('build');
    this.spawnFloatingText(
      t.wx,
      3.4,
      t.wz,
      `ESPECIALIZAÇÃO ${branch}!`,
      branch === 'A' ? '#38bdf8' : '#f59e0b'
    );
    this.pushRadio(`${t.def.shortName} (${t.ownerName}) especializada: ${branchData.name}.`, 'good');
    if (this.selectedTower === t) {
      bus.emit('hud:selectedTower', this.serializeTower(t));
    }
    this.emitFullHudSync();
  }

  private rebuildTowerRigVisual(t: TowerEntity) {
    this.scene.remove(t.rig.root);
    if (t.laserLine) {
      this.scene.remove(t.laserLine);
      t.laserLine = undefined;
    }
    for (const lb of t.laserBeams) {
      this.scene.remove(lb);
    }
    t.laserBeams = [];

    t.rig = createTowerModel3D(t.defId, t.level, t.specialization);
    t.rig.root.position.set(t.wx, 0, t.wz);
    if (t.rig.turretPivot) {
      t.rig.turretPivot.rotation.y = t.turretAngle;
    }
    this.scene.add(t.rig.root);
  }

  getRepairCost(t: TowerEntity): number {
    if (!t || t.hp >= t.maxHp) return 0;
    const missingRatio = (t.maxHp - t.hp) / t.maxHp;
    const discount = 1 - Math.min(0.6, t.repairCostDiscount || 0);
    return Math.max(10, Math.ceil(missingRatio * t.effectiveCost * 0.5 * discount));
  }

  repairSelectedTower() {
    const t = this.selectedTower;
    if (!t) return;
    if (multiplayer.isClient()) {
      multiplayer.sendCombatCommand('CMD_REPAIR_TOWER', { towerId: t.id });
      audio.playUi('click');
      return;
    }
    this.repairTowerByActor(t, multiplayer.localPeerId);
  }

  private repairTowerByActor(t: TowerEntity, actorId: string) {
    if (!t) return;
    if (t.hp >= t.maxHp && t.burnTimer <= 0 && t.corrosionTimer <= 0 && t.chillTimer <= 0) {
      if (actorId === multiplayer.localPeerId) {
        this.pushRadio(`${t.def.shortName} já está com integridade máxima.`, 'info');
      }
      return;
    }
    const cost = this.getRepairCost(t);
    if (this.getActorBudget(actorId) < cost) {
      if (actorId === multiplayer.localPeerId) {
        this.pushRadio(`Orçamento insuficiente para reparar ($${cost} necessário).`, 'warn');
        audio.playUi('error');
      }
      return;
    }

    this.addActorBudget(actorId, -cost);
    t.hp = t.maxHp;
    t.burnTimer = 0;
    t.corrosionTimer = 0;
    t.chillTimer = 0;
    if (!multiplayer.isActive()) this.saveCurrentMissionSnapshot();
    audio.playUi('repair');
    this.effects.spawnSparks(t.wx, 1.4, t.wz, 6, 0x38bdf8);
    this.spawnFloatingText(t.wx, 2.8, t.wz, cost > 0 ? `REPARADO -$${cost}` : 'LIMPO!', '#38bdf8');
    if (multiplayer.isActive() && t.ownerId !== actorId) {
      const helper = multiplayer.getPlayer(actorId)?.callsign || 'ALIADO';
      const msg = `🔧 ${helper} reparou ${t.def.shortName} de ${t.ownerName} (-$${cost})!`;
      this.pushRadio(msg, 'good');
      multiplayer.broadcastRadio(msg, 'good', this.currentWave);
    }
    if (this.selectedTower === t) {
      bus.emit('hud:selectedTower', this.serializeTower(t));
    }
    this.emitFullHudSync();
  }

  repairAllTowers() {
    if (multiplayer.isClient()) {
      multiplayer.sendCombatCommand('CMD_REPAIR_ALL', {});
      audio.playUi('click');
      return;
    }
    this.repairAllTowersByActor(multiplayer.localPeerId);
  }

  private repairAllTowersByActor(actorId: string) {
    const damaged = this.towers.filter(
      (t) => t.hp < t.maxHp || t.burnTimer > 0 || t.corrosionTimer > 0 || t.chillTimer > 0
    );
    if (damaged.length === 0) {
      if (actorId === multiplayer.localPeerId) {
        this.pushRadio('Todas as torres e barreiras estão com integridade máxima.', 'info');
      }
      return;
    }
    const totalCost = damaged.reduce((acc, t) => acc + this.getRepairCost(t), 0);
    if (this.getActorBudget(actorId) < totalCost) {
      if (actorId === multiplayer.localPeerId) {
        this.pushRadio(`Orçamento insuficiente para reparo geral ($${totalCost} necessário).`, 'warn');
        audio.playUi('error');
      }
      return;
    }

    this.addActorBudget(actorId, -totalCost);
    for (const t of damaged) {
      t.hp = t.maxHp;
      t.burnTimer = 0;
      t.corrosionTimer = 0;
      t.chillTimer = 0;
      this.effects.spawnSparks(t.wx, 1.3, t.wz, 4, 0x38bdf8);
    }
    if (!multiplayer.isActive()) this.saveCurrentMissionSnapshot();
    audio.playUi('repair');
    const helper = multiplayer.getPlayer(actorId)?.callsign || 'CMDR';
    const msg = `${multiplayer.isActive() ? `${helper}: ` : ''}Reparo geral concluído em ${damaged.length} estrutura(s) (-$${totalCost}).`;
    this.pushRadio(msg, 'good');
    if (multiplayer.isHost()) multiplayer.broadcastRadio(msg, 'good', this.currentWave);
    if (this.selectedTower) {
      bus.emit('hud:selectedTower', this.serializeTower(this.selectedTower));
    }
    this.emitFullHudSync();
  }

  private tryRebuildRuin(idx: number, freeRebuild = false, actorId = multiplayer.localPeerId): boolean {
    const ruin = this.destroyedRuins[idx];
    if (!ruin) return false;
    if (multiplayer.isClient() && !freeRebuild && actorId === multiplayer.localPeerId) {
      multiplayer.sendCombatCommand('CMD_REBUILD_RUBBLE', { col: ruin.col, row: ruin.row });
      audio.playUi('click');
      return true;
    }
    const def = (TOWER_DEFINITIONS as any)[ruin.defId];
    if (!def) return false;
    if (!this.pathfinder.isBuildable(ruin.col, ruin.row) || this.towerGrid[ruin.row][ruin.col]) {
      return false;
    }
    const cost = freeRebuild ? 0 : ruin.rebuildCost;
    if (this.getActorBudget(actorId) < cost) {
      if (!freeRebuild && actorId === multiplayer.localPeerId) {
        this.pushRadio(`Orçamento insuficiente para reconstruir ${def.shortName} ($${cost}).`, 'warn');
        audio.playUi('error');
      }
      return false;
    }

    const groundEnemies = this.enemyPool.active.filter((e: EnemyEntity) => e.domain === 'ground');
    const check = this.pathfinder.canPlaceAt(ruin.col, ruin.row, groundEnemies);
    if (!check.ok) {
      if (!freeRebuild && actorId === multiplayer.localPeerId) {
        this.pushRadio(check.reason, 'alert');
        audio.playUi('error');
      }
      return false;
    }

    this.addActorBudget(actorId, -cost);
    this.scene.remove(ruin.mesh);
    this.destroyedRuins.splice(idx, 1);

    const ownerInfo = multiplayer.getPlayer(actorId);
    const maxHp = this.getEffectiveTowerMaxHp(ruin.defId, ruin.level, ruin.specialization);
    const tower = this.spawnTowerOnGrid({
      col: ruin.col,
      row: ruin.row,
      towerId: ruin.defId,
      level: ruin.level,
      specialization: ruin.specialization,
      hp: Math.round(maxHp * (freeRebuild ? 0.75 : 1)),
      maxHp,
      effectiveCost: this.getEffectiveTowerCost(ruin.defId),
      totalInvested: cost || Math.round(this.getEffectiveTowerCost(ruin.defId) * 0.65),
      priority: def.defaultPriority,
      turretAngle: Math.PI / 2,
      totalDamage: 0,
      kills: 0,
      ownerId: actorId,
      ownerName: ownerInfo?.callsign || multiplayer.getCallsign(),
      ownerColor: ownerInfo?.color || SQUAD_COLORS[0]
    });

    this.syncHostPlayerTowerCounts();
    this.refreshGlobalBuffs();
    this.rerouteActiveGroundEnemies();
    this.rebuildActiveRouteLines();
    if (!multiplayer.isActive()) this.saveCurrentMissionSnapshot();
    audio.playUi('build');
    this.effects.spawnSparks(tower.wx, 1.5, tower.wz, 8, 0xfbbf24);
    this.spawnFloatingText(
      tower.wx,
      2.8,
      tower.wz,
      freeRebuild ? 'AUTO-RECONSTRUÍDA!' : `RECONSTRUÍDA -$${cost}`,
      '#38bdf8'
    );
    if (!freeRebuild && actorId === multiplayer.localPeerId) {
      this.selectTower(tower);
    }
    this.emitFullHudSync();
    return true;
  }

  sellSelectedTower() {
    const t = this.selectedTower;
    if (!t) return;
    if (!multiplayer.canModifyTower(t.ownerId, multiplayer.localPeerId)) {
      this.pushRadio(`Apenas ${t.ownerName} pode vender esta torre!`, 'warn');
      audio.playUi('error');
      return;
    }
    if (multiplayer.isClient()) {
      multiplayer.sendCombatCommand('CMD_SELL_TOWER', { towerId: t.id });
      this.selectTower(null);
      audio.playUi('click');
      return;
    }
    this.sellTowerByActor(t, multiplayer.localPeerId);
  }

  private sellTowerByActor(t: TowerEntity, actorId: string) {
    if (!t || !multiplayer.canModifyTower(t.ownerId, actorId)) return;
    const refund = Math.floor(t.totalInvested * 0.75 * Math.max(0.4, t.hp / t.maxHp));
    this.addActorBudget(t.ownerId, refund);
    this.removeTowerFromMap(t);
    this.syncHostPlayerTowerCounts();
    if (!multiplayer.isActive()) this.saveCurrentMissionSnapshot(true);

    audio.playUi('click');
    this.spawnFloatingText(t.wx, 2.4, t.wz, `+$${refund}`, '#4ade80');
    if (this.selectedTower === t) this.selectTower(null);
    this.emitFullHudSync();
  }

  private cleanupTowerVisuals(t: TowerEntity) {
    this.scene.remove(t.rig.root);
    if (t.laserLine) this.scene.remove(t.laserLine);
    for (const lb of t.laserBeams) this.scene.remove(lb);
    if (t.ewPulseMesh) this.scene.remove(t.ewPulseMesh);
    if (t.ownerRingMesh) {
      this.scene.remove(t.ownerRingMesh);
      (t.ownerRingMesh.material as THREE.Material).dispose();
    }
    t.hpEl.remove();
  }

  private removeTowerFromMap(t: TowerEntity) {
    this.towerGrid[t.row][t.col] = null;
    this.towers = this.towers.filter((item) => item !== t);
    this.cleanupTowerVisuals(t);
    this.pathfinder.removeStructure(t.col, t.row);
    this.syncHostPlayerTowerCounts();
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
    if (!multiplayer.canModifyTower(t.ownerId, multiplayer.localPeerId)) {
      this.pushRadio(`Apenas ${t.ownerName} pode alterar a prioridade desta torre!`, 'warn');
      audio.playUi('error');
      return;
    }
    if (multiplayer.isClient()) {
      multiplayer.sendCombatCommand('CMD_SET_TARGETING', { towerId: t.id, mode: prio });
      audio.playUi('click');
      return;
    }
    this.setTowerPriorityByActor(t, prio, multiplayer.localPeerId);
  }

  private setTowerPriorityByActor(t: TowerEntity, prio: string, actorId: string) {
    if (!t || t.def.isBarrier || !multiplayer.canModifyTower(t.ownerId, actorId)) return;
    t.priority = prio;
    if (!multiplayer.isActive()) this.saveCurrentMissionSnapshot();
    audio.playUi('click');
    if (this.selectedTower === t) {
      bus.emit('hud:selectedTower', this.serializeTower(t));
    }
  }

  private refreshGlobalBuffs() {
    this.hasGlobalAesa = this.towers.some((t) => {
      if (t.empDisabledTimer > 0) return false;
      const spec = getTowerLevelSpec(t.def, t.level, t.specialization);
      return !!spec?.globalStealthReveal;
    });
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

  startNextWave(isManualCall = false, forceFromVote = false) {
    if (this.gameOver || this.victory) return;
    if (multiplayer.isClient()) {
      if (isManualCall) {
        multiplayer.sendCombatCommand('CMD_VOTE_NEXT_WAVE', {});
        audio.playUi('click');
      }
      return;
    }
    if (
      isManualCall &&
      !forceFromVote &&
      multiplayer.isHost() &&
      multiplayer.getConnectedPlayerCount() > 1
    ) {
      this.handleVoteNextWave(multiplayer.localPeerId);
      return;
    }
    if (this.waveActive && (this.spawnQueue.length > 0 || this.currentWave >= this.totalWaves)) return;
    if (this.currentWave >= this.totalWaves) return;

    multiplayer.clearWaveVotes();
    this.waveVoteTimer = 0;
    multiplayer.setWaveVoteTimer(0);

    if (isManualCall && (this.inIntermission || (this.waveActive && this.spawnQueue.length === 0))) {
      const earlyBonus = Math.round(25 + Math.max(0, this.wavePrepTimer) * 2.5);
      if (multiplayer.isActive()) {
        for (const p of multiplayer.getPlayers()) {
          if (p.connected) this.addActorBudget(p.peerId, earlyBonus);
        }
      } else {
        this.budget += earlyBonus;
      }
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
    const waveMsg = `ONDA ${this.currentWave}/${this.totalWaves}: ${waveDef.title} — ${waveDef.brief}`;
    this.pushRadio(waveMsg, hasBoss ? 'alert' : 'info');
    if (multiplayer.isHost()) {
      multiplayer.broadcastRadio(waveMsg, hasBoss ? 'alert' : 'info', this.currentWave);
    }
    if (!multiplayer.isActive()) this.saveCurrentMissionSnapshot(true);
    this.emitFullHudSync();
  }

  private spawnEnemy(type: string, spawnIdx: number, overridePos: any = null): EnemyEntity | null {
    const def = (ENEMY_DEFINITIONS as any)[type];
    if (!def) return null;

    const waveDef = this.stageConfig.waves[Math.max(0, this.currentWave - 1)];
    const hpMult = (waveDef?.hpMult || 1.0) * (multiplayer.isHost() ? multiplayer.getEnemyHpScale() : 1.0);

    const e = this.enemyPool.acquire() as EnemyEntity;
    e.id = this.nextEnemyId++;
    e.type = type;
    e.domain = def.domain;
    const shieldScale = def.isBoss ? hpMult : multiplayer.isHost() ? multiplayer.getEnemyHpScale() : 1;
    e.armorClass = def.armorClass;
    e.maxHp = Math.round(def.maxHp * hpMult);
    e.hp = e.maxHp;
    e.maxShield = Math.round((def.maxShield || 0) * shieldScale);
    e.shield = e.maxShield;
    e.speed = def.speed;
    e.reward = def.reward;
    e.wbReward = def.wbReward || 0;
    e.fobDamage = def.fobDamage;
    e.isMechanized = !!def.isMechanized;
    e.hasEra = !!def.hasEra;
    e.eraIntact = !!def.hasEra;
    e.hasAps = !!def.hasAps;
    e.apsCooldownTimer = 0;
    e.apsMaxCooldown = def.apsCooldown || 4.0;
    e.isStealth = !!def.isStealth;
    e.stealthRevealed = false;
    e.revealedTimer = 0;
    e.isBoss = !!def.isBoss;
    e.isSubBoss = !!def.isSubBoss;
    e.isStageBoss = !!def.isStageBoss;
    e.isMegaBoss = !!def.isMegaBoss;
    e.slowImmune = !!def.slowImmune;
    e.frontalShieldReduction = def.frontalShieldReduction || 0;
    e.isBurrowed = !!def.canBurrow;
    e.unburrowed = false;
    e.dismountCount = def.dismountCount || 0;
    e.radius = def.radius || 10;
    e.resistances = def.resistances || null;
    e.ewSlow = 0;
    e.ewDamageAmp = 0;
    e.thermalVuln = 0;
    e.ewDisabled = false;
    e.cryoSlow = 0;
    e.cryoSlowTimer = 0;
    e.rootTimer = 0;
    e.stunTimer = 0;
    e.poisonTimer = 0;
    e.poisonDps = 0;
    e.poisonSourceTower = null;
    e.burnTimer = 0;
    e.burnDps = 0;
    e.burnSourceTower = null;
    e.corrosionReduction = 0;
    e.corrosionTimer = 0;
    e.markedAmp = 0;
    e.markedTimer = 0;
    e.dotTickAccum = 0;
    e.healAuraTimer = 1.2;
    e.shieldAuraTimer = 1.5;
    e.shockwaveTimer = def.towerAttack?.shockwaveInterval || 999;
    e.hitFlashTimer = 0;
    e.walkPhase = Math.random() * Math.PI * 2;
    e.towerAttackTimer = def.towerAttack ? Math.min(2.0, def.towerAttack.interval * 0.5) : 999;
    e.attackPrepTimer = 0;
    e.isPreparingAttack = false;
    e.pendingAttackTargets = [];
    e.empPulseTimer = def.towerAttack?.empPulseInterval || 999;
    e.periodicSpawnTimer = def.periodicSpawn?.interval || 999;
    e.triggeredThresholds.clear();
    e.damageByPlayer = {};

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
    e.hpFillEl.style.background =
      e.shield > 0
        ? 'linear-gradient(90deg, #22c55e, #22d3ee)'
        : ratio > 0.55
          ? '#22c55e'
          : ratio > 0.25
            ? '#f59e0b'
            : '#ef4444';

    if (e.shield > 0) {
      e.hpDotEl.style.background = '#38bdf8';
      e.hpDotEl.classList.remove('hidden');
    } else if (e.ewDisabled) {
      e.hpDotEl.style.background = '#c084fc';
      e.hpDotEl.classList.remove('hidden');
    } else if (e.poisonTimer > 0) {
      e.hpDotEl.style.background = '#84cc16';
      e.hpDotEl.classList.remove('hidden');
    } else if (e.burnTimer > 0) {
      e.hpDotEl.style.background = '#f97316';
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
  executeA10Strafe(cx: number, cy: number, angle: number, actorId = multiplayer.localPeerId) {
    const sup = this.airSupport.a10;
    if (this.getActorBudget(actorId) < sup.cost || sup.timer > 0) return;

    if (multiplayer.isClient() && actorId === multiplayer.localPeerId) {
      multiplayer.sendCombatCommand('CMD_AIR_SUPPORT', {
        supportType: 'a10',
        worldX: simToWorldX(cx),
        worldZ: simToWorldZ(cy),
        angle
      });
      this.cancelActiveTool();
      return;
    }

    this.addActorBudget(actorId, -sup.cost);
    sup.timer = sup.cooldown;
    if (actorId === multiplayer.localPeerId) this.cancelActiveTool();

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
      actorId,
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

  executeHellfireStrike(tx: number, ty: number, actorId = multiplayer.localPeerId) {
    const sup = this.airSupport.hellfire;
    if (this.getActorBudget(actorId) < sup.cost || sup.timer > 0) return;

    if (multiplayer.isClient() && actorId === multiplayer.localPeerId) {
      multiplayer.sendCombatCommand('CMD_AIR_SUPPORT', {
        supportType: 'hellfire',
        worldX: simToWorldX(tx),
        worldZ: simToWorldZ(ty),
        angle: 0
      });
      this.cancelActiveTool();
      return;
    }

    this.addActorBudget(actorId, -sup.cost);
    sup.timer = sup.cooldown;
    if (actorId === multiplayer.localPeerId) this.cancelActiveTool();

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
    p.ownerId = actorId;
    p.smokeTimer = 0;
    p.life = 2.0;

    mMesh.position.set(p.wx, p.wy, p.wz);
    mMesh.lookAt(p.targetWx, p.targetWy, p.targetWz);

    this.pushRadio('REAPER 2-1: Míssil AGM-114 Hellfire lançado no designador laser!', 'good');
    this.emitFullHudSync();
  }

  executeB52CarpetBomb(cx: number, cy: number, actorId = multiplayer.localPeerId) {
    const sup = this.airSupport.b52;
    if (this.getActorBudget(actorId) < sup.cost || sup.timer > 0) return;

    if (multiplayer.isClient() && actorId === multiplayer.localPeerId) {
      multiplayer.sendCombatCommand('CMD_AIR_SUPPORT', {
        supportType: 'b52',
        worldX: simToWorldX(cx),
        worldZ: simToWorldZ(cy),
        angle: 0
      });
      this.cancelActiveTool();
      return;
    }

    this.addActorBudget(actorId, -sup.cost);
    sup.timer = sup.cooldown;
    if (actorId === multiplayer.localPeerId) this.cancelActiveTool();

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
      actorId,
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
      this.renderFrame();
      return;
    }

    if (multiplayer.isClient()) {
      multiplayer.checkHostWatchdog();
    }
    const hostLost = multiplayer.isClient() && multiplayer.isHostSignalLost();
    const dt = this.gameOver || hostLost ? 0 : realDt * this.timeScale;

    if (multiplayer.isClient()) {
      // Client runs 60 FPS visual interpolation from authoritative Host STATE_SNAPSHOT
      if (dt > 0) {
        const lerpAlpha = Math.min(1, realDt * 14);
        this.enemyPool.forEachActive((obj) => {
          const e = obj as EnemyEntity;
          const tgt = this.clientEnemyTargets.get(e.id);
          if (tgt) {
            e.wx = THREE.MathUtils.lerp(e.wx, tgt.wx, lerpAlpha);
            e.wy = THREE.MathUtils.lerp(e.wy, tgt.wy, lerpAlpha);
            e.wz = THREE.MathUtils.lerp(e.wz, tgt.wz, lerpAlpha);
            e.angle = rotateAngleTowards(e.angle, tgt.angle, 14 * realDt);
          }
          if (e.rig) {
            e.rig.root.position.set(e.wx, 0, e.wz);
            e.rig.hullGroup.rotation.y = e.angle;
            e.rig.hullGroup.position.y = e.isBurrowed ? -0.58 : 0;
            if (e.rig.energyShieldMesh) e.rig.energyShieldMesh.visible = e.shield > 0;
            if (e.rig.prepRing) e.rig.prepRing.visible = e.isPreparingAttack;
            if (e.rig.ewRing) e.rig.ewRing.visible = e.ewDisabled;
            if (e.rig.rotors) {
              for (const prop of e.rig.rotors) prop.rotation.y += dt * 18;
            }
          }
        });
        for (const tower of this.towers) {
          this.decayTowerWeaponVisuals(tower, dt);
          if (tower.empDisabledTimer <= 0 && tower.rig.radarPivots?.length) {
            tower.rig.radarPivots.forEach((dish, idx) => {
              dish.rotation.y += dt * (2.4 + idx * 0.7);
            });
          }
        }
        this.updateTransientBeams(dt);
        this.effects.update(dt);
        this.updateFloatingTexts(dt);
      }
      this.updateCoopVisuals(realDt);
    } else if (dt > 0) {
      for (const key of ['a10', 'hellfire', 'b52'] as const) {
        if (this.airSupport[key].timer > 0) {
          this.airSupport[key].timer = Math.max(0, this.airSupport[key].timer - dt);
        }
      }

      this.updateWaveState(dt);
      this.updateEwFields(dt);
      this.updateFireZones(dt);
      this.updateActiveMinesAndBeams(dt);
      this.updateDestroyedRuins(dt);
      this.updateEnemies(dt);
      this.updatePendingShots(dt);
      this.updateTowers(dt);
      this.updateProjectiles(dt);
      this.updateBossProjectiles(dt);
      this.updateFlyovers(dt);
      this.effects.update(dt);
      this.updateFloatingTexts(dt);
      this.updateCoopVisuals(realDt);
    } else {
      this.updateCoopVisuals(realDt);
    }

    if (this.selectedEnemy && !this.selectedEnemy._pooledActive) {
      this.selectEnemy(null);
    }

    this.updateInteractiveOverlays();
    this.updateProjectedDomBars();
    this.updateCameraShake(realDt);
    this.renderFrame();

    if (this.adaptiveEnabled) {
      if (this.skipAdaptiveFrames > 0) {
        this.skipAdaptiveFrames--;
      } else {
        const decision = this.qualitySampler.recordFrame(rawDelta * 1000, realDt);
        if (decision.changed) {
          if (decision.action === 'tier_down') {
            this.setQualityTier(decision.tier, this.qualityConfig.source === 'auto');
          } else if (decision.action === 'dpr_down' || decision.action === 'dpr_up') {
            this.applyEffectiveDpr(this.qualitySampler.getEffectiveDpr(window.devicePixelRatio || 1));
          }
        }
      }
    }

    if (multiplayer.isHost()) {
      this.snapshotAccum += realDt;
      if (this.snapshotAccum >= 0.06) {
        this.snapshotAccum = 0;
        this.broadcastCoopSnapshot();
      }
    }

    this.hudSyncAccum += realDt;
    if (this.hudSyncAccum >= 0.1) {
      this.hudSyncAccum = 0;
      this.emitFullHudSync();
      if (this.selectedTower) {
        bus.emit('hud:selectedTower', this.serializeTower(this.selectedTower));
      } else if (this.selectedEnemy && this.selectedEnemy._pooledActive) {
        bus.emit('hud:selectedEnemy', this.serializeEnemy(this.selectedEnemy));
      }
    }

    if (!multiplayer.isActive()) {
      this.autosaveAccum += realDt;
      if (this.autosaveAccum >= 10.0) {
        this.autosaveAccum = 0;
        this.saveCurrentMissionSnapshot();
      }
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
    this.camera.getWorldDirection(this.panCamDir);
    this.panCamDir.y = 0;
    this.panCamDir.normalize();
    this.panCamRight.crossVectors(this.panCamDir, this.worldUp).normalize();

    this.panMove
      .set(0, 0, 0)
      .addScaledVector(this.panCamDir, forward * panSpeed)
      .addScaledVector(this.panCamRight, right * panSpeed);

    this.panNextTarget.copy(this.controls.target).add(this.panMove);
    this.panNextTarget.x = THREE.MathUtils.clamp(this.panNextTarget.x, -BOARD_W * 0.55, BOARD_W * 0.55);
    this.panNextTarget.z = THREE.MathUtils.clamp(this.panNextTarget.z, -BOARD_D * 0.55, BOARD_D * 0.55);
    this.panActualMove.copy(this.panNextTarget).sub(this.controls.target);

    this.controls.target.copy(this.panNextTarget);
    this.camera.position.add(this.panActualMove);
  }

  private updateWaveState(dt: number) {
    if (
      multiplayer.isHost() &&
      this.waveVoteTimer > 0 &&
      !this.gameOver &&
      this.currentWave < this.totalWaves &&
      (!this.waveActive || this.spawnQueue.length === 0)
    ) {
      this.waveVoteTimer = Math.max(0, this.waveVoteTimer - dt);
      multiplayer.setWaveVoteTimer(Math.ceil(this.waveVoteTimer));
      if (this.waveVoteTimer <= 0) {
        const msg = `⏱️ Votação expirou (20s) — iniciando Onda ${this.currentWave + 1}!`;
        this.pushRadio(msg, 'info');
        multiplayer.broadcastRadio(msg, 'info', this.currentWave);
        this.startNextWave(true, true);
        return;
      }
    }

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
    this.waveVoteTimer = 0;
    multiplayer.setWaveVoteTimer(0);

    if (this.currentWave >= this.totalWaves) {
      this.victory = true;
      this.gameOver = true;
      const baseWB = this.stageConfig.clearBonusWB || 60;
      const isCoopSquad = multiplayer.isActive() && multiplayer.getConnectedPlayerCount() > 1;
      const clearWB = isCoopSquad ? Math.round(baseWB * 1.25) : baseWB;
      this.sessionWB += clearWB;
      const newlyUnlocked = saveManager.markStageCompleted(this.currentWorldId, this.currentStageId, clearWB);
      this.pushRadio(
        `VITÓRIA TOTAL! Fase ${this.stageConfig.id} concluída (+${clearWB} WB$${isCoopSquad ? ' — +25% Bônus Co-op' : ''}).`,
        'good'
      );
      if (multiplayer.isHost()) {
        this.broadcastCoopSnapshot();
      }
      bus.emit('hud:gameover', {
        victory: true,
        wave: this.currentWave,
        totalWaves: this.totalWaves,
        kills: this.totalKills,
        damage: this.totalDamage,
        wbEarned: this.sessionWB,
        newlyUnlocked,
        worldId: this.currentWorldId,
        stageId: this.currentStageId,
        coopBonusPercent: isCoopSquad ? 25 : 0
      });
      this.emitFullHudSync();
      return;
    }

    // Grant per-player wave interest (5%, capped at $180)
    let displayInterest = 0;
    if (multiplayer.isActive()) {
      for (const p of multiplayer.getPlayers()) {
        if (!p.connected) continue;
        const pInt = Math.min(180, Math.floor(p.budget * 0.05));
        if (pInt > 0) this.addActorBudget(p.peerId, pInt);
        if (p.peerId === multiplayer.localPeerId) displayInterest = pInt;
      }
    } else {
      displayInterest = Math.min(180, Math.floor(this.budget * 0.05));
      if (displayInterest > 0) this.budget += displayInterest;
    }
    if (displayInterest > 0) {
      this.spawnFloatingText(0, 4.0, -18, `JUROS +5%: +$${displayInterest}`, '#38bdf8');
    }

    // Energy Extractor wave completion payout credited to extractor owners
    let totalExtractorBonus = 0;
    let extractorIdx = 0;
    for (const tower of this.towers) {
      if (tower.defId !== 'energy_extractor' || tower.empDisabledTimer > 0) continue;
      const spec = getTowerLevelSpec(tower.def, tower.level, tower.specialization);
      const effMult = extractorIdx < 4 ? 1 : 0.45;
      extractorIdx++;
      const gain = Math.round((spec?.waveClearIncome || 0) * effMult);
      if (gain > 0) {
        totalExtractorBonus += gain;
        this.addActorBudget(tower.ownerId, gain);
      }
    }
    if (totalExtractorBonus > 0) {
      this.spawnFloatingText(-6, 4.4, -14, `EXTRATORES +$${totalExtractorBonus}`, '#facc15');
    }

    const radioMsg =
      displayInterest > 0 || totalExtractorBonus > 0
        ? `Onda ${this.currentWave} neutralizada! Juros: +$${displayInterest}${totalExtractorBonus > 0 ? ` | Extratores: +$${totalExtractorBonus}` : ''}.`
        : `Onda ${this.currentWave} neutralizada! Prepare ou repare suas defesas.`;
    this.pushRadio(radioMsg, 'good');
    if (multiplayer.isHost()) {
      multiplayer.broadcastRadio(radioMsg, 'good', this.currentWave);
      multiplayer.clearWaveVotes();
    }

    this.inIntermission = true;
    this.wavePrepTimer = 14.0;
    if (!multiplayer.isActive()) this.saveCurrentMissionSnapshot(true);
    this.emitFullHudSync();
  }

  private updateEwFields(dt: number) {
    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      e.ewSlow = 0;
      e.ewDamageAmp = 0;
      e.ewDisabled = false;
      e.stealthRevealed = this.hasGlobalAesa || (e.revealedTimer || 0) > 0;
    });

    for (const tower of this.towers) {
      tower.maxShield = 0;
      tower.allyRangeBuff = 0;
      tower.allyFireRateBuff = 0;
      tower.allyCritBonus = 0;
      tower.allyKillBonus = 0;
      tower.allyHpBonus = 0;
      tower.repairCostDiscount = 0;
      tower.fogDebuff = this.pathfinder.hasTerrainFeature(tower.col, tower.row, 'fog');
    }

    // Volcanic lava adjacency hazard during active waves
    if (this.waveActive && this.stageConfig?.lavaCells?.length) {
      for (const tower of this.towers) {
        let nearLava = false;
        for (let dr = -1; dr <= 1 && !nearLava; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (this.pathfinder.hasTerrainFeature(tower.col + dc, tower.row + dr, 'lava')) {
              nearLava = true;
              break;
            }
          }
        }
        if (nearLava) {
          this.damageTower(tower, 3.2 * dt);
        }
      }
    }

    let extractorCount = 0;

    for (const tower of this.towers) {
      if (tower.empDisabledTimer > 0) continue;
      const spec = getTowerLevelSpec(tower.def, tower.level, tower.specialization);
      if (!spec) continue;

      if (tower.rig.radarPivots?.length) {
        tower.rig.radarPivots.forEach((dish, idx) => {
          dish.rotation.y += dt * (2.4 + idx * 0.7);
        });
      }

      // Support turret rotation & pulse visual animation
      if (tower.defId === 'ew_crew' || tower.defId === 'iron_dome' || tower.defId === 'eng_workshop' || tower.defId === 'energy_extractor' || (tower.defId === 'cryo_tower' && spec.isCryoAura)) {
        if (tower.rig.turretPivot) {
          tower.rig.turretPivot.rotation.y += dt * (tower.defId === 'energy_extractor' ? 1.4 : 0.8);
        }
        if (tower.rig.ewRings) {
          tower.rig.ewRings.forEach((ring, idx) => {
            const phase = (this.elapsedReal * 1.1 + idx * 0.5) % 1;
            const pulse = 0.96 + Math.sin(phase * Math.PI * 2) * 0.05;
            ring.scale.setScalar(pulse);
          });
        }
        if (tower.ewPulseMesh) {
          const pulseRange = tower.defId === 'cryo_tower' && !spec.isCryoAura ? 0 : (spec.range || 160);
          if (pulseRange > 0) {
            tower.ewPulseMesh.visible = true;
            const rangeW = pulseRange * WORLD_SCALE;
            const p = (this.elapsedReal * 0.75) % 1;
            tower.ewPulseMesh.scale.setScalar(Math.max(0.05, p * rangeW));
            (tower.ewPulseMesh.material as THREE.MeshBasicMaterial).opacity = 0.4 * (1 - p);
          } else {
            tower.ewPulseMesh.visible = false;
          }
        }
      }

      if (tower.defId === 'ew_crew') {
        let triggeredEmp = false;
        if (spec.empInterval > 0) {
          tower.empTimer += dt;
          if (tower.empTimer >= spec.empInterval) {
            tower.empTimer = 0;
            triggeredEmp = true;
            audio.playShot('emp');
            this.effects.spawnShockwave(tower.wx, 0.25, tower.wz, spec.range * WORLD_SCALE, 0xc084fc);
            if (multiplayer.isHost()) {
              multiplayer.queueCombatEvent({
                kind: 'EMP_PULSE',
                wx: Number(tower.wx.toFixed(2)),
                wy: 0.25,
                wz: Number(tower.wz.toFixed(2)),
                scale: Number((spec.range * WORLD_SCALE).toFixed(2)),
                color: 0xc084fc
              });
            }
          }
        }

        // Buff nearby allied towers & clear low-visibility fog debuff
        for (const ally of this.towers) {
          if (ally === tower) continue;
          const d = Math.hypot(ally.x - tower.x, ally.y - tower.y);
          if (d <= spec.range) {
            ally.allyRangeBuff = Math.max(ally.allyRangeBuff, spec.allyRangeBuff || 0);
            ally.allyFireRateBuff = Math.max(ally.allyFireRateBuff, spec.allyFireRateBuff || 0);
            ally.allyCritBonus = Math.max(ally.allyCritBonus, spec.allyCritBonus || 0);
            ally.fogDebuff = false;
          }
        }

        this.enemyPool.forEachActive((obj) => {
          const e = obj as EnemyEntity;
          const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
          if (dist <= spec.range) {
            if (!e.slowImmune && spec.slowFactor) {
              e.ewSlow = Math.max(e.ewSlow, spec.slowFactor);
            }
            e.ewDamageAmp = Math.max(e.ewDamageAmp, spec.damageAmp || 0);
            if (spec.disablesActiveDefense) {
              e.ewDisabled = true;
            }
            e.stealthRevealed = true;
            e.revealedTimer = Math.max(e.revealedTimer || 0, 1.5);
            if (e.isBurrowed && spec.globalStealthReveal) {
              e.isBurrowed = false;
              e.unburrowed = true;
            }

            if (triggeredEmp && (e.isMechanized || e.maxShield > 0)) {
              e.stunTimer = Math.max(e.stunTimer, spec.empStunDuration || 1.2);
              this.applyDamageToEnemy(e, spec.damage || 90, 'emp', tower, { allowApsIntercept: false });
              this.spawnFloatingText(e.wx, 2.5, e.wz, 'EMP STUN!', '#e879f9');
            }
          }
        });
      } else if (tower.defId === 'iron_dome') {
        const shieldCap = spec.shieldCapacity || 420;
        const regenRate = spec.shieldRegenPerSec || 45;
        const allyHeal = spec.healPerSec || 0;
        for (const ally of this.towers) {
          const d = Math.hypot(ally.x - tower.x, ally.y - tower.y);
          if (d <= spec.range) {
            const wasUnshielded = ally.maxShield <= 0;
            ally.maxShield = Math.max(ally.maxShield, shieldCap);
            if (wasUnshielded && ally.shield <= 0) {
              ally.shield = Math.round(shieldCap * 0.45);
            } else {
              ally.shield = Math.min(ally.maxShield, ally.shield + regenRate * dt);
            }
            if (allyHeal > 0 && ally.hp < ally.maxHp) {
              ally.hp = Math.min(ally.maxHp, ally.hp + allyHeal * dt);
            }
          }
        }
      } else if (tower.defId === 'eng_workshop') {
        const healRate = spec.healPerSec || 24;
        for (const ally of this.towers) {
          const d = Math.hypot(ally.x - tower.x, ally.y - tower.y);
          if (d <= spec.range) {
            if (ally.hp < ally.maxHp) {
              ally.hp = Math.min(ally.maxHp, ally.hp + healRate * dt);
            }
            if (spec.cleansesDebuffs) {
              ally.burnTimer = 0;
              ally.corrosionTimer = 0;
              ally.chillTimer = 0;
            }
            ally.repairCostDiscount = Math.max(ally.repairCostDiscount, spec.repairCostDiscount || 0.25);
            ally.allyHpBonus = Math.max(ally.allyHpBonus, spec.allyHpBonus || 0);
            ally.allyFireRateBuff = Math.max(ally.allyFireRateBuff, spec.allyFireRateBuff || 0);
          }
        }

        // Spec B: Automatic reconstruction of nearby destroyed ruins
        if (spec.autoRebuildRuins && this.destroyedRuins.length > 0) {
          tower.rebuildCooldownTimer = Math.max(0, tower.rebuildCooldownTimer - dt);
          if (tower.rebuildCooldownTimer <= 0) {
            const targetIdx = this.destroyedRuins.findIndex((r) => {
              const rx = r.col * TILE_SIZE + TILE_SIZE * 0.5;
              const ry = r.row * TILE_SIZE + TILE_SIZE * 0.5;
              return Math.hypot(rx - tower.x, ry - tower.y) <= spec.range;
            });
            if (targetIdx !== -1 && this.tryRebuildRuin(targetIdx, true)) {
              tower.rebuildCooldownTimer = spec.rebuildCooldown || 14;
            }
          }
        }
      } else if (tower.defId === 'energy_extractor') {
        const effMult = extractorCount < 4 ? 1.0 : 0.45;
        if (extractorCount >= 4 && !this.extractorCapWarned) {
          this.extractorCapWarned = true;
          this.pushRadio('Mais de 4 Extratores ativos: eficiência adicional reduzida para 45%.', 'warn');
        }
        extractorCount++;

        if (this.waveActive && spec.incomePerSec > 0) {
          tower.incomeAccum += spec.incomePerSec * effMult * dt;
          if (tower.incomeAccum >= 10) {
            const gain = Math.floor(tower.incomeAccum);
            tower.incomeAccum -= gain;
            this.addActorBudget(tower.ownerId, gain);
            this.spawnFloatingText(tower.wx, 2.4, tower.wz, `+$${gain}`, '#facc15');
          }
        }

        for (const ally of this.towers) {
          if (ally === tower) continue;
          const d = Math.hypot(ally.x - tower.x, ally.y - tower.y);
          if (d <= spec.range) {
            ally.allyKillBonus = Math.max(ally.allyKillBonus, spec.killBountyBonus || 0);
            ally.allyFireRateBuff = Math.max(ally.allyFireRateBuff, spec.allyFireRateBuff || 0);
          }
        }
      } else if (tower.defId === 'cryo_tower' && spec.isCryoAura) {
        this.enemyPool.forEachActive((obj) => {
          const e = obj as EnemyEntity;
          if (e.domain !== 'ground' || e.slowImmune) return;
          const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
          if (dist <= spec.range) {
            e.cryoSlow = Math.max(e.cryoSlow, spec.slowFactor || 0.42);
            e.cryoSlowTimer = Math.max(e.cryoSlowTimer, 0.35);
            if (spec.thermalVuln) {
              e.thermalVuln = Math.max(e.thermalVuln, spec.thermalVuln);
            }
          }
        });
      }
    }

    for (const tower of this.towers) {
      tower.shield = Math.min(tower.shield, tower.maxShield);
    }
  }

  private updateTransientBeams(dt: number) {
    for (let i = this.transientBeams.length - 1; i >= 0; i--) {
      const tb = this.transientBeams[i];
      tb.life -= dt;
      if (tb.life <= 0) {
        this.scene.remove(tb.line);
        tb.line.geometry.dispose();
        (tb.line.material as THREE.Material).dispose();
        this.transientBeams.splice(i, 1);
      } else {
        const mat = tb.line.material as THREE.LineBasicMaterial;
        mat.opacity = Math.min(1, tb.life * 4);
      }
    }
  }

  private decayTowerWeaponVisuals(tower: TowerEntity, dt: number) {
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

    if (tower.rig.barrelPivot) {
      if ((tower.rig.barrelPivot as any)._baseZ === undefined) {
        (tower.rig.barrelPivot as any)._baseZ = tower.rig.barrelPivot.position.z;
      }
      tower.rig.barrelPivot.position.z = (tower.rig.barrelPivot as any)._baseZ - tower.recoil;
    }
  }

  private updateActiveMinesAndBeams(dt: number) {
    this.updateTransientBeams(dt);

    for (let i = this.activeMines.length - 1; i >= 0; i--) {
      const mine = this.activeMines[i];
      let triggered = false;
      this.enemyPool.forEachActive((obj) => {
        if (triggered) return;
        const e = obj as EnemyEntity;
        if (e.domain !== 'ground') return;
        if (Math.hypot(e.x - mine.x, e.y - mine.y) <= 26 + (e.radius || 10) * 0.4) {
          triggered = true;
        }
      });
      if (!triggered) continue;

      this.scene.remove(mine.mesh);
      this.activeMines.splice(i, 1);

      const isEmp = mine.damageType === 'emp';
      audio.playShot(isEmp ? 'emp' : 'explosion');
      this.effects.spawnExplosion(mine.wx, 0.35, mine.wz, mine.splashRadius * WORLD_SCALE * 0.65);
      if (isEmp) {
        this.effects.spawnShockwave(mine.wx, 0.25, mine.wz, mine.splashRadius * WORLD_SCALE, 0xc084fc);
      }
      if (multiplayer.isHost()) {
        multiplayer.queueCombatEvent({
          kind: isEmp ? 'EMP_PULSE' : 'EXPLODE',
          wx: Number(mine.wx.toFixed(2)),
          wy: 0.35,
          wz: Number(mine.wz.toFixed(2)),
          scale: Number((mine.splashRadius * WORLD_SCALE * (isEmp ? 1 : 0.65)).toFixed(2)),
          color: isEmp ? 0xc084fc : 0xf97316
        });
      }

      const rSq = mine.splashRadius * mine.splashRadius;
      this.enemyPool.forEachActive((obj) => {
        const e = obj as EnemyEntity;
        if (e.domain !== 'ground') return;
        const dSq = (e.x - mine.x) ** 2 + (e.y - mine.y) ** 2;
        if (dSq <= rSq) {
          if (e.isBurrowed) {
            e.isBurrowed = false;
            e.unburrowed = true;
          }
          const mult = 1 - Math.sqrt(dSq) / (mine.splashRadius * 1.45);
          this.applyDamageToEnemy(e, mine.damage * Math.max(0.45, mult), mine.damageType, mine.sourceTower, {
            isSplash: true,
            isMine: true,
            allowApsIntercept: false,
            heavyMultiplier: mine.heavyMultiplier
          });
          if (mine.stunDuration > 0 && (isEmp || e.isMechanized)) {
            e.stunTimer = Math.max(e.stunTimer, mine.stunDuration);
          }
          if (mine.slowFactor > 0 && !e.slowImmune) {
            e.cryoSlow = Math.max(e.cryoSlow, mine.slowFactor);
            e.cryoSlowTimer = Math.max(e.cryoSlowTimer, mine.slowDuration || 2.5);
          }
          if (mine.burnDps > 0) {
            e.burnDps = Math.max(e.burnDps, mine.burnDps);
            e.burnTimer = Math.max(e.burnTimer, mine.burnDuration || 3.5);
            e.burnSourceTower = mine.sourceTower;
          }
          if (mine.markedAmp > 0) {
            e.markedAmp = Math.max(e.markedAmp, mine.markedAmp);
            e.markedTimer = Math.max(e.markedTimer, 4.0);
          }
        }
      });
    }
  }

  private updateDestroyedRuins(dt: number) {
    for (let i = this.destroyedRuins.length - 1; i >= 0; i--) {
      const r = this.destroyedRuins[i];
      r.life += dt;
      const mat = r.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.42 + Math.sin(r.life * 4.2) * 0.22;
    }
  }

  private spawnFireZone(
    x: number,
    y: number,
    radius: number,
    dps: number,
    duration: number,
    damageType = 'fire',
    corrosionAmount = 0,
    ownerId?: string
  ) {
    if (this.fireZones.length >= 28) {
      const oldest = this.fireZones.shift()!;
      this.scene.remove(oldest.mesh);
    }
    const wx = simToWorldX(x);
    const wz = simToWorldZ(y);
    const mat =
      damageType === 'poison'
        ? ((this as any).toxicZoneMat ??= new THREE.MeshBasicMaterial({
            color: 0x84cc16,
            transparent: true,
            opacity: 0.34,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          }))
        : this.fireZoneMat;
    const mesh = new THREE.Mesh(this.fireZoneGeo, mat);
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
      damageType,
      corrosionAmount,
      ownerId,
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
        const puffColor = fz.damageType === 'poison' ? 0x84cc16 : 0xf97316;
        this.effects.spawnSmokePuff(fz.wx + Math.cos(ang) * r, 0.25, fz.wz + Math.sin(ang) * r, puffColor, 0.45);
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
            if (fz.damageType === 'poison') {
              if (fz.corrosionAmount > 0) {
                e.corrosionReduction = Math.min(0.85, Math.max(e.corrosionReduction, fz.corrosionAmount));
                e.corrosionTimer = Math.max(e.corrosionTimer, 3.0);
              }
              this.applyDamageToEnemy(e, fz.dps * tickDt, 'poison', null, { allowApsIntercept: false, actorId: fz.ownerId });
            } else {
              e.eraIntact = false;
              this.applyDamageToEnemy(e, fz.dps * tickDt, 'thermobaric', null, { allowApsIntercept: false, actorId: fz.ownerId });
            }
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
      if (e.revealedTimer > 0) {
        e.revealedTimer = Math.max(0, e.revealedTimer - dt);
      }
      if (e.cryoSlowTimer > 0) {
        e.cryoSlowTimer = Math.max(0, e.cryoSlowTimer - dt);
        if (e.cryoSlowTimer <= 0) e.cryoSlow = 0;
      }
      if (e.rootTimer > 0) {
        e.rootTimer = Math.max(0, e.rootTimer - dt);
      }
      if (e.corrosionTimer > 0) {
        e.corrosionTimer = Math.max(0, e.corrosionTimer - dt);
        if (e.corrosionTimer <= 0) e.corrosionReduction = 0;
      }
      if (e.markedTimer > 0) {
        e.markedTimer = Math.max(0, e.markedTimer - dt);
        if (e.markedTimer <= 0) e.markedAmp = 0;
      }

      // Tick continuous Poison & Fire DoTs cleanly every 0.25s
      if (e.poisonTimer > 0 || e.burnTimer > 0) {
        const hadPoison = e.poisonTimer > 0;
        const hadBurn = e.burnTimer > 0;
        if (e.poisonTimer > 0) e.poisonTimer = Math.max(0, e.poisonTimer - dt);
        if (e.burnTimer > 0) e.burnTimer = Math.max(0, e.burnTimer - dt);
        e.dotTickAccum += dt;
        if (e.dotTickAccum >= 0.25) {
          const tickDt = e.dotTickAccum;
          e.dotTickAccum = 0;
          if (e.poisonDps > 0 && hadPoison) {
            this.applyDamageToEnemy(e, e.poisonDps * tickDt, 'poison', e.poisonSourceTower, {
              allowApsIntercept: false,
              ignoreShield: true
            });
            if (!e._pooledActive) return;
          }
          if (e.burnDps > 0 && hadBurn) {
            this.applyDamageToEnemy(e, e.burnDps * tickDt, 'fire', e.burnSourceTower, {
              allowApsIntercept: false
            });
            if (!e._pooledActive) return;
          }
        }
        if (e.poisonTimer <= 0) e.poisonDps = 0;
        if (e.burnTimer <= 0) e.burnDps = 0;
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

      // Terrain interactions (Ice, Toxic Pools, Volcanic Lava)
      let terrainSpeedMult = 1.0;
      if (e.domain === 'ground') {
        if (this.pathfinder.hasTerrainFeatureAtPx(e.x, e.y, 'ice')) {
          terrainSpeedMult = def?.resistances?.ice <= 0.6 ? 1.32 : 1.2;
        }
        if (this.pathfinder.hasTerrainFeatureAtPx(e.x, e.y, 'toxic')) {
          if (def?.resistances?.poison <= 0.45) {
            e.hp = Math.min(e.maxHp, e.hp + 16 * dt);
          }
        }
        if (this.pathfinder.hasTerrainFeatureAtPx(e.x, e.y, 'lava')) {
          if (e.type === 'piromante' || e.type === 'tita_cerco') {
            terrainSpeedMult = 1.18;
          }
        }
      }

      // Escavador Subterrâneo burrow/emerge AI
      if (def?.canBurrow && e.isBurrowed) {
        const nearTower = this.towers.some((t) => Math.hypot(t.x - e.x, t.y - e.y) <= 95);
        if (nearTower || e.hp < e.maxHp * 0.58 || e.distToFob <= 125 || e.ewDisabled) {
          e.isBurrowed = false;
          e.unburrowed = true;
          this.effects.spawnSmokePuff(e.wx, 0.35, e.wz, 0xa8a29e, 0.9);
          this.spawnFloatingText(e.wx, 2.2, e.wz, 'EMERGIU!', '#f59e0b');
        }
      }

      if (e.rig) {
        if (e.rig.ewRing) e.rig.ewRing.visible = e.ewDisabled;
        if (e.rig.apsShield) {
          e.rig.apsShield.visible = e.hasAps && e.apsCooldownTimer <= 0 && !e.ewDisabled;
          e.rig.apsShield.rotation.y += dt * 1.2;
        }
        if (e.rig.energyShieldMesh) {
          e.rig.energyShieldMesh.visible = e.shield > 0;
          if (e.shield > 0) {
            e.rig.energyShieldMesh.rotation.y += dt * 1.6;
          }
        }
        if (e.rig.prepRing) {
          e.rig.prepRing.visible = e.isPreparingAttack;
          if (e.isPreparingAttack) {
            const pulse = 0.85 + Math.sin(this.elapsedReal * 18) * 0.2;
            e.rig.prepRing.scale.setScalar(pulse);
            e.rig.prepRing.rotation.z += dt * 6;
          }
        }
        if (e.rig.eraMeshes && e.hasEra) {
          e.rig.eraMeshes.forEach((m) => (m.visible = e.eraIntact));
        }

        e.rig.hullGroup.position.y = e.isBurrowed ? -0.58 : 0;
        if (e.isBurrowed && Math.random() < dt * 8) {
          this.effects.spawnSmokePuff(e.wx, 0.15, e.wz, 0x78716c, 0.45);
        }

        if (e.isStealth && e.rig.stealthMaterials) {
          const op = e.stealthRevealed ? 0.96 : 0.28;
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
          } else if (e.type === 'drone_swarm' || e.type === 'drone_recon' || e.type === 'drone_bombardeiro') {
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

      // === SUPPORT ENEMY AI: HEALER & SHIELD EMITTER ===
      if (def?.aiBehavior === 'healer' && !e.ewDisabled) {
        e.healAuraTimer -= dt;
        if (e.healAuraTimer <= 0) {
          e.healAuraTimer = 2.2;
          let healed = 0;
          this.enemyPool.forEachActive((otherObj) => {
            if (healed >= 4) return;
            const ally = otherObj as EnemyEntity;
            if (ally === e || ally.hp >= ally.maxHp) return;
            if (Math.hypot(ally.x - e.x, ally.y - e.y) <= 145) {
              ally.hp = Math.min(ally.maxHp, ally.hp + Math.round(ally.maxHp * 0.1 + 35));
              this.effects.spawnSparks(ally.wx, ally.wy + 1.0, ally.wz, 3, 0x22c55e);
              healed++;
            }
          });
          if (healed > 0) {
            this.effects.spawnShockwave(e.wx, 0.25, e.wz, 3.8, 0x22c55e);
          }
        }
      } else if (def?.aiBehavior === 'shield_aura' && !e.ewDisabled) {
        e.shieldAuraTimer -= dt;
        if (e.shieldAuraTimer <= 0) {
          e.shieldAuraTimer = 2.6;
          let shielded = 0;
          this.enemyPool.forEachActive((otherObj) => {
            if (shielded >= 4) return;
            const ally = otherObj as EnemyEntity;
            if (ally === e) return;
            if (Math.hypot(ally.x - e.x, ally.y - e.y) <= 155) {
              const targetCap = Math.max(ally.maxShield, 90);
              if (ally.shield < targetCap) {
                ally.maxShield = targetCap;
                ally.shield = Math.min(targetCap, ally.shield + 55);
                this.effects.spawnSparks(ally.wx, ally.wy + 1.0, ally.wz, 3, 0x38bdf8);
                shielded++;
              }
            }
          });
        }
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

      // === ARMED ENEMY WEAPON AI WITH TELEGRAPHED PREP ===
      if (def?.towerAttack && this.towers.length > 0 && !e.isBurrowed) {
        const atk = def.towerAttack;
        if (e.isPreparingAttack) {
          e.attackPrepTimer -= dt;
          if (e.attackPrepTimer <= 0) {
            e.isPreparingAttack = false;
            e.towerAttackTimer = atk.interval;
            const liveTargets = e.pendingAttackTargets.filter((t) => this.towers.includes(t) && t.hp > 0);
            const finalTargets =
              liveTargets.length > 0
                ? liveTargets
                : this.findTowerTargetsForBoss(
                    e,
                    atk.range,
                    atk.targets || 1,
                    atk.targetPriority || (atk.preferAa ? 'aa_first' : 'nearest')
                  );
            if (finalTargets.length > 0) {
              const primaryT = finalTargets[0];
              if (e.rig?.turretPivot) {
                e.rig.turretPivot.rotation.y = Math.atan2(primaryT.x - e.x, primaryT.y - e.y) - e.angle;
              }
              if (atk.revealOnAttackDuration) {
                e.revealedTimer = Math.max(e.revealedTimer, atk.revealOnAttackDuration);
                e.stealthRevealed = true;
              }
              for (const tTower of finalTargets) {
                if (atk.attackType === 'melee') {
                  audio.playUi('error');
                  this.effects.spawnSparks(tTower.wx, 1.1, tTower.wz, 5, 0xf97316);
                  if (atk.splashRadius > 0) {
                    const rSq = atk.splashRadius * atk.splashRadius;
                    for (const nearT of [...this.towers]) {
                      if ((nearT.x - tTower.x) ** 2 + (nearT.y - tTower.y) ** 2 <= rSq) {
                        this.damageTower(
                          nearT,
                          atk.damage,
                          atk.burnDps || 0,
                          atk.burnDuration || 0,
                          atk.corrosionDps || 0,
                          atk.corrosionDuration || 0,
                          atk.chillSlow || 0,
                          atk.chillDuration || 0,
                          atk.empDisableDuration || 0
                        );
                      }
                    }
                  } else {
                    this.damageTower(
                      tTower,
                      atk.damage,
                      atk.burnDps || 0,
                      atk.burnDuration || 0,
                      atk.corrosionDps || 0,
                      atk.corrosionDuration || 0,
                      atk.chillSlow || 0,
                      atk.chillDuration || 0,
                      atk.empDisableDuration || 0
                    );
                  }
                } else {
                  this.spawnBossProjectile(e, tTower, atk);
                }
              }
              if ((e.isBoss || atk.damage >= 55) && this.elapsedReal - this.lastTowerAttackWarnTime > 6.5) {
                this.lastTowerAttackWarnTime = this.elapsedReal;
                bus.emit('hud:alert', {
                  level: 'warn',
                  text: `⚠️ ALERTA DE DEFESA: ${def.shortName} está atacando ${primaryT.def.shortName}!`
                });
              }
            }
          }
        } else {
          e.towerAttackTimer -= dt;
          if (e.towerAttackTimer <= 0) {
            const targets = this.findTowerTargetsForBoss(
              e,
              atk.range,
              atk.targets || 1,
              atk.targetPriority || (atk.preferAa ? 'aa_first' : 'nearest')
            );
            if (targets.length > 0) {
              e.isPreparingAttack = true;
              e.attackPrepTimer = atk.prepTime ?? 0.35;
              e.pendingAttackTargets = targets;
              if (e.rig?.turretPivot) {
                const pT = targets[0];
                e.rig.turretPivot.rotation.y = Math.atan2(pT.x - e.x, pT.y - e.y) - e.angle;
              }
            } else {
              e.towerAttackTimer = 0.55;
            }
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

        // Siege Titan seismic shockwave
        if (atk.shockwaveInterval) {
          e.shockwaveTimer -= dt;
          if (e.shockwaveTimer <= 0) {
            e.shockwaveTimer = atk.shockwaveInterval;
            const swRange = atk.shockwaveRange || 210;
            const swDmg = atk.shockwaveDamage || 110;
            audio.playExplosion(1.1);
            this.addTrauma(0.32);
            this.effects.spawnShockwave(e.wx, 0.3, e.wz, swRange * WORLD_SCALE, 0xf97316);
            this.spawnFloatingText(e.wx, 3.6, e.wz, 'ONDA SÍSMICA!', '#f97316');
            for (const nearT of [...this.towers]) {
              if (Math.hypot(nearT.x - e.x, nearT.y - e.y) <= swRange) {
                this.damageTower(nearT, swDmg);
              }
            }
          }
        }
      }

      const combinedSlow = Math.min(0.75, Math.max(e.ewSlow, e.cryoSlow));
      const rootMult = e.rootTimer > 0 ? 0 : 1;
      const moveSpeed = e.speed * (1 - (e.slowImmune ? 0 : combinedSlow)) * terrainSpeedMult * rootMult;

      if (e.domain === 'ground' && e.rig?.wheels && moveSpeed > 0) {
        for (const w of e.rig.wheels) {
          w.rotation.x += dt * moveSpeed * 0.14;
        }
      }

      if (moveSpeed > 0) {
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
      }

      e.wx = simToWorldX(e.x);
      e.wz = simToWorldZ(e.y);

      if (e.rig) {
        e.rig.root.position.set(e.wx, 0, e.wz);
        e.rig.hullGroup.rotation.y = e.angle;
        if (e.rig.turretPivot && !def?.towerAttack) {
          e.rig.turretPivot.rotation.y = Math.sin(this.elapsedReal * 1.4 + e.id) * 0.25;
        }
        if (e.rig.legs && e.rig.legs.length > 0 && moveSpeed > 0) {
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

  private findTowerTargetsForBoss(
    e: EnemyEntity,
    range: number,
    maxTargets: number,
    priorityOrAa: string | boolean
  ): TowerEntity[] {
    const rSq = range * range;
    const priority = typeof priorityOrAa === 'boolean' ? (priorityOrAa ? 'aa_first' : 'nearest') : priorityOrAa;
    const inRange: Array<{ tower: TowerEntity; score: number }> = [];

    for (const t of this.towers) {
      const dSq = (t.x - e.x) ** 2 + (t.y - e.y) ** 2;
      if (dSq > rSq) continue;
      let score = dSq;
      if (t.def.isTauntTank) score -= 1e8;
      else if (priority === 'aa_first' && (t.def.domain === 'air' || t.def.domain === 'both')) score -= 1e6;
      else if (priority === 'support_first' && t.def.category === 'support') score -= 1e6;
      else if (priority === 'tech_first' && (t.def.category === 'support' || t.defId === 'tesla_tower' || t.defId === 'railgun' || t.defId === 'helios_laser')) score -= 1e6;
      else if (priority === 'high_value') score -= t.totalInvested * 800;
      else if (priority === 'high_dps') score -= (getTowerLevelSpec(t.def, t.level, t.specialization)?.damage || 0) * 1000;
      else if (t.def.isBarrier) score += 1e7;
      inRange.push({ tower: t, score });
    }

    inRange.sort((a, b) => a.score - b.score);
    return inRange.slice(0, maxTargets).map((item) => item.tower);
  }

  private triggerBossEmpPulse(e: EnemyEntity, range: number, disableDuration: number) {
    audio.playShot('emp');
    this.effects.spawnShockwave(e.wx, 0.4, e.wz, range * WORLD_SCALE, 0xa855f7);
    this.spawnFloatingText(e.wx, 3.4, e.wz, 'PULSO EMP HOSTIL!', '#c084fc');
    if (multiplayer.isHost()) {
      multiplayer.queueCombatEvent({
        kind: 'EMP_PULSE',
        wx: Number(e.wx.toFixed(2)),
        wy: 0.4,
        wz: Number(e.wz.toFixed(2)),
        scale: Number((range * WORLD_SCALE).toFixed(2)),
        color: 0xa855f7
      });
    }

    for (const t of this.towers) {
      if (t.def.isBarrier) continue;
      const dist = Math.hypot(t.x - e.x, t.y - e.y);
      if (dist > range) continue;

      const isProtected = this.towers.some((p) => {
        if (p === t || p.empDisabledTimer > 0) return false;
        if (!p.def.isIronDome && p.defId !== 'ew_crew') return false;
        const pSpec = getTowerLevelSpec(p.def, p.level, p.specialization);
        return Math.hypot(p.x - t.x, p.y - t.y) <= (pSpec?.range || 180);
      });
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

    const kind = atk.projectileKind || 'boss_shell';
    let mesh: THREE.Object3D;
    if (kind === 'boss_autocannon' || kind === 'enemy_bullet' || kind === 'enemy_sniper') {
      mesh = new THREE.Mesh(this.bulletGeo, this.bossBulletMat);
      mesh.scale.set(kind === 'boss_autocannon' ? 1.6 : 1.15, 1.15, kind === 'enemy_sniper' ? 2.1 : 1.3);
    } else if (kind === 'enemy_plasma' || kind === 'enemy_acid' || kind === 'enemy_cryo') {
      const tint = kind === 'enemy_acid' ? 0x84cc16 : kind === 'enemy_cryo' ? 0x38bdf8 : 0x22d3ee;
      mesh = new THREE.Mesh(this.shellGeo, new THREE.MeshBasicMaterial({ color: tint }));
      mesh.scale.setScalar(0.85);
    } else if (kind === 'boss_shell' || kind === 'enemy_emp') {
      mesh = new THREE.Mesh(this.shellGeo, kind === 'enemy_emp' ? this.empMineMat : this.bossShellMat);
      mesh.scale.setScalar(kind === 'enemy_emp' ? 1.0 : 1.35);
    } else {
      mesh = createMissileMesh3D('boss_missile');
    }

    mesh.position.set(startWx, startWy, startWz);
    this.scene.add(mesh);
    if (e.isBoss || atk.damage >= 45) {
      audio.playShot(kind === 'boss_autocannon' || kind === 'enemy_bullet' ? 'autocannon' : 'missile');
    }
    this.effects.spawnSparks(startWx, startWy, startWz, 3, 0xef4444);

    const dist = Math.hypot(targetTower.x - e.x, targetTower.y - e.y);
    const isFlatShot =
      kind === 'boss_autocannon' ||
      kind === 'enemy_bullet' ||
      kind === 'enemy_sniper' ||
      kind === 'enemy_plasma' ||
      kind === 'enemy_acid' ||
      kind === 'enemy_cryo';
    const speed = kind === 'enemy_sniper' ? 840 : isFlatShot ? 580 : 340;

    this.bossProjectiles.push({
      kind,
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
      corrosionDps: atk.corrosionDps || 0,
      corrosionDuration: atk.corrosionDuration || 0,
      chillDuration: atk.chillDuration || 0,
      chillSlow: atk.chillSlow || 0,
      empDisableDuration: atk.empDisableDuration || 0,
      flightTime: 0,
      totalFlightTime: Math.max(0.24, dist / speed),
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

      const isFlatShot =
        bp.kind === 'boss_autocannon' ||
        bp.kind === 'enemy_bullet' ||
        bp.kind === 'enemy_sniper' ||
        bp.kind === 'enemy_plasma' ||
        bp.kind === 'enemy_acid' ||
        bp.kind === 'enemy_cryo';
      const peak = isFlatShot ? 0.45 : 5.2;
      bp.wx = THREE.MathUtils.lerp(bp.startWx, bp.targetWx, prog);
      bp.wz = THREE.MathUtils.lerp(bp.startWz, bp.targetWz, prog);
      bp.wy = THREE.MathUtils.lerp(bp.startWy, bp.targetWy, prog) + Math.sin(prog * Math.PI) * peak;

      bp.mesh.position.set(bp.wx, bp.wy, bp.wz);
      bp.mesh.lookAt(bp.wx + (bp.wx - prevWx) + 0.0001, bp.wy + (bp.wy - prevWy), bp.wz + (bp.wz - prevWz));

      if (!isFlatShot) {
        bp.smokeTimer += dt;
        if (bp.smokeTimer >= 0.03) {
          bp.smokeTimer = 0;
          this.effects.spawnSmokePuff(bp.wx, bp.wy, bp.wz, 0xfca5a5, 0.4);
        }
      }

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

    for (const t of this.towers) {
      if (!t.def.isIronDome || t.empDisabledTimer > 0) continue;
      if (t.interceptTimer > 0) continue;
      const spec = this.getEffectiveSpec(t);
      const distToTarget = Math.hypot(bp.targetX - t.x, bp.targetY - t.y);
      const distToProj = Math.hypot(curX - t.x, curY - t.y);
      if (distToTarget <= spec.range || distToProj <= spec.range) {
        t.interceptTimer = spec.interceptCooldown || 1.2;
        t.muzzleFlashTimer = 0.08;
        audio.playApsIntercept();
        this.effects.spawnExplosion(bp.wx, bp.wy, bp.wz, 0.65, 0x2dd4bf, false);
        this.spawnFloatingText(bp.wx, bp.wy + 1.5, bp.wz, 'IRON DOME INTERCEPT!', '#2dd4bf');
        return true;
      }
    }

    const tt = bp.targetTower;
    if (tt && tt.hp > 0 && tt.defId === 'abrams_pit' && tt.empDisabledTimer <= 0) {
      const spec = getTowerLevelSpec(tt.def, tt.level, tt.specialization);
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
    const isHeavy = bp.splashRadius > 40 || bp.empDisableDuration > 0;
    const fxColor = bp.empDisableDuration > 0 ? 0xc084fc : bp.corrosionDps > 0 ? 0x84cc16 : 0xef4444;
    this.effects.spawnExplosion(bp.targetWx, 0.9, bp.targetWz, isHeavy ? 1.05 : 0.55, fxColor, isHeavy);
    if (isHeavy) {
      audio.playExplosion(bp.splashRadius > 40 ? 0.85 : 0.45);
    }

    if (bp.splashRadius > 0) {
      const rSq = bp.splashRadius * bp.splashRadius;
      const snapshot = [...this.towers];
      for (const t of snapshot) {
        const dSq = (t.x - bp.targetX) ** 2 + (t.y - bp.targetY) ** 2;
        if (dSq <= rSq) {
          const dist = Math.sqrt(dSq);
          const falloff = t === bp.targetTower ? 1.0 : Math.max(0.45, 1 - (dist / bp.splashRadius) * 0.55);
          this.damageTower(
            t,
            bp.damage * falloff,
            bp.burnDps,
            bp.burnDuration,
            bp.corrosionDps,
            bp.corrosionDuration,
            bp.chillSlow,
            bp.chillDuration,
            bp.empDisableDuration
          );
        }
      }
    } else if (this.towers.includes(bp.targetTower)) {
      this.damageTower(
        bp.targetTower,
        bp.damage,
        bp.burnDps,
        bp.burnDuration,
        bp.corrosionDps,
        bp.corrosionDuration,
        bp.chillSlow,
        bp.chillDuration,
        bp.empDisableDuration
      );
    }
  }

  private damageTower(
    tower: TowerEntity,
    rawDamage: number,
    burnDps = 0,
    burnDuration = 0,
    corrosionDps = 0,
    corrosionDuration = 0,
    chillSlow = 0,
    chillDuration = 0,
    empDisableDuration = 0
  ) {
    if (!this.towers.includes(tower) || tower.hp <= 0) return;

    let shieldReduction = 0;
    for (const p of this.towers) {
      if (p.empDisabledTimer > 0) continue;
      if (!p.def.isIronDome && p.defId !== 'eng_workshop') continue;
      const spec = getTowerLevelSpec(p.def, p.level, p.specialization);
      if (spec.towerShieldReduction > 0 && Math.hypot(p.x - tower.x, p.y - tower.y) <= spec.range) {
        shieldReduction = Math.max(shieldReduction, spec.towerShieldReduction);
      }
    }

    let dmg = Math.max(1, Math.round(rawDamage * (1 - shieldReduction)));

    // Energy Shield absorption first
    if (tower.shield > 0) {
      const absorbed = Math.min(tower.shield, dmg);
      tower.shield -= absorbed;
      dmg -= absorbed;
      if (absorbed >= 1) {
        this.effects.spawnSparks(tower.wx, 1.5, tower.wz, 3, 0x2dd4bf);
        if (dmg <= 0 && Math.random() < 0.6) {
          this.spawnFloatingText(tower.wx, 2.5, tower.wz, `-${Math.round(absorbed)} ESCUDO`, '#2dd4bf');
        }
      }
    }

    if (dmg > 0) {
      tower.hp -= dmg;
      if (Math.random() < 0.72) {
        this.spawnFloatingText(tower.wx, 2.6, tower.wz, `-${Math.round(dmg)} HP`, '#fb923c');
      }
    }

    if (burnDps > 0 && burnDuration > 0) {
      tower.burnDps = Math.max(tower.burnDps, burnDps);
      tower.burnTimer = Math.max(tower.burnTimer, burnDuration);
    }
    if (corrosionDps > 0 && corrosionDuration > 0) {
      tower.corrosionDps = Math.max(tower.corrosionDps, corrosionDps);
      tower.corrosionTimer = Math.max(tower.corrosionTimer, corrosionDuration);
    }
    if (chillSlow > 0 && chillDuration > 0) {
      tower.chillSlow = Math.max(tower.chillSlow, chillSlow);
      tower.chillTimer = Math.max(tower.chillTimer, chillDuration);
    }
    if (empDisableDuration > 0 && !tower.def.isBarrier) {
      const hasEmpProtect = this.towers.some((p) => {
        if (p === tower || p.empDisabledTimer > 0) return false;
        if (!p.def.isIronDome && p.defId !== 'ew_crew') return false;
        const pSpec = getTowerLevelSpec(p.def, p.level, p.specialization);
        return Math.hypot(p.x - tower.x, p.y - tower.y) <= (pSpec?.range || 160);
      });
      if (!hasEmpProtect) {
        tower.empDisabledTimer = Math.max(tower.empDisabledTimer, empDisableDuration);
        this.spawnFloatingText(tower.wx, 2.9, tower.wz, 'EMP!', '#c084fc');
      }
    }

    if (tower.hp <= 0) {
      tower.hp = 0;
      const emergencyScrap = Math.max(15, Math.round(tower.effectiveCost * 0.3));
      this.addActorBudget(tower.ownerId, emergencyScrap);
      this.effects.spawnExplosion(tower.wx, 1.0, tower.wz, 1.5, 0xef4444, true);
      this.effects.spawnCrater(tower.wx, tower.wz, 1.15);
      audio.playExplosion(1.25);
      if (multiplayer.isHost()) {
        multiplayer.queueCombatEvent({
          kind: 'EXPLODE',
          wx: Number(tower.wx.toFixed(2)),
          wy: 1.0,
          wz: Number(tower.wz.toFixed(2)),
          scale: 1.5,
          color: 0xef4444
        });
      }
      this.addTrauma(0.38);
      this.triggerFlashLight(tower.wx, 2.2, tower.wz, 0xff6b2b, 6.0, 0.14);
      this.pushRadio(
        `🚨 ${tower.def.name} caiu! Sucata recuperada (+$${emergencyScrap}). Clique nos escombros para reconstruir.`,
        'alert'
      );
      this.spawnFloatingText(tower.wx, 3.0, tower.wz, `DESTRUÍDA (+$${emergencyScrap})`, '#ef4444');

      // Leave clickable rebuildable ruin (keep cap at 20)
      if (!this.destroyedRuins.some((r) => r.col === tower.col && r.row === tower.row)) {
        if (this.destroyedRuins.length >= 20) {
          const old = this.destroyedRuins.shift()!;
          this.scene.remove(old.mesh);
        }
        const ruinMesh = new THREE.Mesh(this.ruinGeo, this.ruinMat);
        ruinMesh.position.set(tower.wx, 0.22, tower.wz);
        this.scene.add(ruinMesh);
        this.destroyedRuins.push({
          col: tower.col,
          row: tower.row,
          wx: tower.wx,
          wz: tower.wz,
          defId: tower.defId,
          level: tower.level,
          specialization: tower.specialization,
          rebuildCost: Math.max(25, Math.round(tower.totalInvested * 0.55)),
          mesh: ruinMesh,
          life: 0
        });
      }

      this.removeTowerFromMap(tower);
      if (!multiplayer.isActive()) this.saveCurrentMissionSnapshot(true);
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
      if (multiplayer.isHost()) {
        this.broadcastCoopSnapshot();
      }
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

  private addTransientBeam(from: THREE.Vector3, to: THREE.Vector3, color: number, life = 0.22) {
    if (this.transientBeams.length >= 48) {
      const oldest = this.transientBeams.shift()!;
      this.scene.remove(oldest.line);
      oldest.line.geometry.dispose();
      (oldest.line.material as THREE.Material).dispose();
    }
    const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.95 });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.transientBeams.push({ line, life });
  }

  private deployMineFromTower(tower: TowerEntity, spec: any) {
    const ownedCount = this.activeMines.filter((m) => m.sourceTower === tower).length;
    const maxMines = spec.maxMines || 4;
    if (ownedCount >= maxMines) return false;

    const candidates: Array<{ col: number; row: number; score: number }> = [];
    const maxTileR = Math.ceil((spec.range || 160) / TILE_SIZE);
    for (let dr = -maxTileR; dr <= maxTileR; dr++) {
      for (let dc = -maxTileR; dc <= maxTileR; dc++) {
        const col = tower.col + dc;
        const row = tower.row + dr;
        if (!this.pathfinder.inBounds(col, row)) continue;
        const cell = this.pathfinder.baseTerrain[row][col];
        if (cell !== CELL.ROAD && cell !== CELL.OPEN && cell !== CELL.SPAWN) continue;
        if (this.towerGrid[row][col]) continue;
        const cx = (col + 0.5) * TILE_SIZE;
        const cy = (row + 0.5) * TILE_SIZE;
        const dist = Math.hypot(cx - tower.x, cy - tower.y);
        if (dist > (spec.range || 160)) continue;
        if (this.activeMines.some((m) => Math.hypot(m.x - cx, m.y - cy) < 22)) continue;
        // Prefer road tiles closer to active paths
        let score = cell === CELL.ROAD ? -1000 : 0;
        score += Math.random() * 40 + dist * 0.15;
        candidates.push({ col, row, score });
      }
    }

    if (candidates.length === 0) return false;
    candidates.sort((a, b) => a.score - b.score);
    const chosen = candidates[0];
    const x = (chosen.col + 0.5) * TILE_SIZE + (Math.random() - 0.5) * 14;
    const y = (chosen.row + 0.5) * TILE_SIZE + (Math.random() - 0.5) * 14;
    const wx = simToWorldX(x);
    const wz = simToWorldZ(y);
    const isEmp = spec.damageType === 'emp';
    const mesh = new THREE.Mesh(this.mineGeo, isEmp ? this.empMineMat : this.mineMat);
    mesh.position.set(wx, 0.12, wz);
    this.scene.add(mesh);

    this.activeMines.push({
      x,
      y,
      wx,
      wz,
      damage: spec.damage || 220,
      damageType: spec.damageType || 'explosive',
      splashRadius: spec.splashRadius || 76,
      stunDuration: spec.stunDuration || 0,
      slowFactor: spec.slowFactor || 0,
      slowDuration: spec.slowDuration || 0,
      burnDps: spec.burnDps || 0,
      burnDuration: spec.burnDuration || 0,
      heavyMultiplier: spec.heavyMultiplier || 1,
      markedAmp: spec.markedAmp || 0,
      sourceTower: tower,
      mesh
    });

    this.effects.spawnSparks(wx, 0.4, wz, 2, isEmp ? 0xc084fc : 0xf59e0b);
    return true;
  }

  private updateTowers(dt: number) {
    for (const tower of this.towers) {
      // Continuous thermal / corrosive debuffs & low-HP smoke
      if (tower.burnTimer > 0) {
        tower.burnTimer = Math.max(0, tower.burnTimer - dt);
        tower.hp -= tower.burnDps * dt;
        if (tower.hp <= 0) {
          this.damageTower(tower, 1);
          continue;
        }
      }
      if (tower.corrosionTimer > 0) {
        tower.corrosionTimer = Math.max(0, tower.corrosionTimer - dt);
        tower.hp -= (tower.corrosionDps || 10) * dt;
        if (tower.hp <= 0) {
          this.damageTower(tower, 1);
          continue;
        }
      }
      if (tower.chillTimer > 0) {
        tower.chillTimer = Math.max(0, tower.chillTimer - dt);
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

      if (tower.def.isBarrier || tower.def.isSupportAura) continue;

      tower.cooldownTimer = Math.max(0, tower.cooldownTimer - dt);

      if (tower.defId === 'minefield' || tower.def.isMineLayer) {
        if (tower.cooldownTimer <= 0 && spec.fireRate > 0) {
          if (this.deployMineFromTower(tower, spec)) {
            tower.cooldownTimer = 1 / spec.fireRate;
          } else {
            tower.cooldownTimer = 0.5;
          }
        }
        continue;
      }

      this.decayTowerWeaponVisuals(tower, dt);

      if (tower.rig.missileCaps && spec.fireRate > 0) {
        const showMissile = tower.cooldownTimer < 1 / spec.fireRate - 0.35;
        tower.rig.missileCaps.forEach((m) => (m.visible = showMissile));
      }

      if (tower.defId === 'cryo_tower' && spec.isCryoAura) {
        continue;
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

      if (tower.def.isContinuousLaser) {
        this.updateHeliosLaserTower(tower, spec, candidates, dt, angleDiff < 0.55);
        continue;
      }

      if (tower.cooldownTimer <= 0 && angleDiff < 0.45 && spec.fireRate > 0) {
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
      if (multiplayer.isHost() && candidates[0]) {
        const primary = candidates[0];
        multiplayer.queueCombatEvent({
          kind: 'FIRE',
          towerId: tower.id,
          targetId: primary.id,
          wx: Number(mPos.x.toFixed(2)),
          wy: Number(mPos.y.toFixed(2)),
          wz: Number(mPos.z.toFixed(2)),
          targetX: Number(primary.wx.toFixed(2)),
          targetZ: Number(primary.wz.toFixed(2)),
          damageType: 'helios_laser',
          ownerId: tower.ownerId
        });
      }
    }
  }

  private findTargetsInRange(tower: TowerEntity, spec: any): EnemyEntity[] {
    const matches: EnemyEntity[] = [];
    const rangeSq = spec.range * spec.range;
    const minRangeSq = (spec.minRange || 0) * (spec.minRange || 0);
    const canHitBurrowed = (spec.splashRadius || 0) >= 40;

    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      if (e.isStealth && !e.stealthRevealed) return;
      if (e.isBurrowed && !e.stealthRevealed && !canHitBurrowed) return;
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

  private fireChainTesla(tower: TowerEntity, spec: any, primary: EnemyEntity) {
    const mPos = this.getTowerMuzzleWorld(tower);
    const maxJumps = spec.chainCount || 4;
    const jumpRange = spec.chainRange || 130;
    const decay = spec.chainDecay ?? 0.14;
    const hitSet = new Set<EnemyEntity>();
    let current: EnemyEntity | null = primary;
    let prevPos = mPos;
    let dmg = spec.damage;

    for (let hop = 0; hop < maxJumps && current; hop++) {
      hitSet.add(current);
      const tPos = new THREE.Vector3(current.wx, current.wy + 0.75, current.wz);
      const mid = prevPos.clone().lerp(tPos, 0.5);
      mid.x += (Math.random() - 0.5) * 1.2;
      mid.y += 0.4 + Math.random() * 0.5;
      mid.z += (Math.random() - 0.5) * 1.2;
      this.addTransientBeam(prevPos, mid, 0x60a5fa, 0.18);
      this.addTransientBeam(mid, tPos, 0x93c5fd, 0.18);
      this.effects.spawnSparks(tPos.x, tPos.y, tPos.z, 3, 0x60a5fa);

      this.applyDamageToEnemy(current, dmg, spec.damageType || 'electric', tower, {
        allowApsIntercept: false,
        ignoreFrontalShield: true
      });
      if (spec.stunDuration > 0 && (current.isMechanized || current.maxShield > 0)) {
        current.stunTimer = Math.max(current.stunTimer, spec.stunDuration);
      }

      // Find next nearest un-hit target within chainRange
      let bestNext: EnemyEntity | null = null;
      let bestDist = jumpRange;
      const curX = current.x;
      const curY = current.y;
      this.enemyPool.forEachActive((obj) => {
        const cand = obj as EnemyEntity;
        if (hitSet.has(cand) || (cand.isStealth && !cand.stealthRevealed)) return;
        const d = Math.hypot(cand.x - curX, cand.y - curY);
        if (d <= bestDist) {
          bestDist = d;
          bestNext = cand;
        }
      });

      prevPos = tPos;
      current = bestNext;
      dmg = Math.max(10, dmg * (1 - decay));
    }
  }

  private firePiercingBeam(tower: TowerEntity, spec: any, primary: EnemyEntity) {
    const mPos = this.getTowerMuzzleWorld(tower);
    const dx = primary.x - tower.x;
    const dy = primary.y - tower.y;
    const baseDist = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / baseDist;
    const uy = dy / baseDist;
    const maxLen = Math.max(spec.range * 1.15, 520);
    const corridor = tower.defId === 'railgun' ? 28 : 18;
    const pierceMax = spec.pierceCount || 1;

    const alongList: Array<{ enemy: EnemyEntity; t: number }> = [];
    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      if (e.isStealth && !e.stealthRevealed) return;
      if (tower.def.domain === 'ground' && e.domain !== 'ground') return;
      if (tower.def.domain === 'air' && e.domain !== 'air') return;
      const rx = e.x - tower.x;
      const ry = e.y - tower.y;
      const proj = rx * ux + ry * uy;
      if (proj < -12 || proj > maxLen) return;
      const perp = Math.abs(rx * uy - ry * ux);
      if (perp <= corridor + e.radius * 0.55) {
        alongList.push({ enemy: e, t: proj });
      }
    });
    alongList.sort((a, b) => a.t - b.t);
    const hits = alongList.slice(0, pierceMax);
    if (hits.length === 0) hits.push({ enemy: primary, t: baseDist });

    const lastEnemy = hits[hits.length - 1].enemy;
    const endDist = pierceMax > 1 ? Math.max(baseDist, hits[hits.length - 1].t + 35) : baseDist;
    const endPos = new THREE.Vector3(
      simToWorldX(tower.x + ux * endDist),
      Math.max(0.7, lastEnemy.wy + 0.6),
      simToWorldZ(tower.y + uy * endDist)
    );
    const beamColor = tower.defId === 'railgun' ? 0x38bdf8 : 0xfef08a;
    this.addTransientBeam(mPos, endPos, beamColor, tower.defId === 'railgun' ? 0.24 : 0.14);

    for (let i = 0; i < hits.length; i++) {
      const target = hits[i].enemy;
      const mult = i === 0 ? 1.0 : Math.max(0.55, 1 - i * 0.14);
      this.applyDamageToEnemy(target, spec.damage * mult, spec.damageType || 'piercing', tower, {
        armorPierce: spec.armorPierce || 0,
        armorIgnore: spec.armorIgnore || 0,
        heavyMultiplier: spec.heavyMultiplier || 1,
        tandemHeat: !!spec.tandemHeat,
        critChance: spec.critChance || 0,
        critMultiplier: spec.critMultiplier || 1.65,
        allowApsIntercept: false
      });
      if (spec.corrosionAmount > 0) {
        target.corrosionReduction = Math.min(0.85, Math.max(target.corrosionReduction, spec.corrosionAmount));
        target.corrosionTimer = Math.max(target.corrosionTimer, 5.0);
      }
      if (spec.stunDuration > 0 && target._pooledActive) {
        target.stunTimer = Math.max(target.stunTimer, spec.stunDuration);
      }
      this.effects.spawnSparks(target.wx, target.wy + 0.7, target.wz, 4, beamColor);
    }
  }

  private fireConeFlamethrower(tower: TowerEntity, spec: any, primary: EnemyEntity) {
    const mPos = this.getTowerMuzzleWorld(tower);
    const halfCone = (spec.coneAngle || 1.0) * 0.5;
    const range = spec.range || 210;

    // Flame jet visual burst along cone centerline & edges
    for (let s = -1; s <= 1; s++) {
      const ang = tower.turretAngle + s * halfCone * 0.7;
      const tip = new THREE.Vector3(
        mPos.x + Math.sin(ang) * range * WORLD_SCALE * 0.85,
        0.55,
        mPos.z + Math.cos(ang) * range * WORLD_SCALE * 0.85
      );
      this.addTransientBeam(mPos, tip, s === 0 ? 0xfb923c : 0xf97316, 0.16);
    }
    this.effects.spawnSparks(mPos.x, mPos.y, mPos.z, 5, 0xf97316);

    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      if (e.domain !== 'ground' || (e.isStealth && !e.stealthRevealed)) return;
      const dx = e.x - tower.x;
      const dy = e.y - tower.y;
      const d = Math.hypot(dx, dy);
      if (d > range + 15) return;
      const enemyAng = Math.atan2(dx, dy);
      if (angleDiffAbs(enemyAng, tower.turretAngle) <= halfCone + 0.14) {
        this.applyDamageToEnemy(e, spec.damage, 'fire', tower, {
          allowApsIntercept: false,
          isSplash: true
        });
        if (spec.burnDps > 0 && e._pooledActive) {
          e.burnDps = Math.max(e.burnDps, spec.burnDps);
          e.burnTimer = Math.max(e.burnTimer, spec.burnDuration || 4.0);
          e.burnSourceTower = tower;
        }
        if (spec.thermalVuln > 0) {
          e.thermalVuln = Math.max(e.thermalVuln, spec.thermalVuln);
        }
        if (spec.slowFactor > 0 && !e.slowImmune) {
          e.cryoSlow = Math.max(e.cryoSlow, spec.slowFactor);
          e.cryoSlowTimer = Math.max(e.cryoSlowTimer, spec.slowDuration || 2.0);
        }
      }
    });

    if (spec.createsFireZone) {
      this.spawnFireZone(primary.x, primary.y, spec.splashRadius || 80, (spec.burnDps || 90) * 0.65, 3.0, 'fire', 0, tower.ownerId);
    }
  }

  private triggerTowerAttack(tower: TowerEntity, spec: any, candidates: EnemyEntity[]) {
    const primary = candidates[0];
    const mPos = this.getTowerMuzzleWorld(tower);

    if (multiplayer.isHost() && primary) {
      multiplayer.queueCombatEvent({
        kind: 'FIRE',
        towerId: tower.id,
        targetId: primary.id,
        wx: Number(mPos.x.toFixed(2)),
        wy: Number(mPos.y.toFixed(2)),
        wz: Number(mPos.z.toFixed(2)),
        targetX: Number(primary.wx.toFixed(2)),
        targetZ: Number(primary.wz.toFixed(2)),
        damageType: tower.defId,
        ownerId: tower.ownerId
      });
    }

    if (tower.defId === 'm2_bunker') {
      tower.recoil = 0.16;
      tower.muzzleFlashTimer = 0.045;
      audio.playShot(tower.level >= 2 ? 'ciws' : 'mg50');
      this.effects.spawnSparks(mPos.x, mPos.y, mPos.z, 2, 0xfef08a);
      this.fireTowerProjectile(tower, primary, spec, 0);
    } else if (tower.defId === 'ballista') {
      tower.recoil = 0.22;
      tower.muzzleFlashTimer = 0.05;
      audio.playShot('ballista');
      this.effects.spawnSparks(mPos.x, mPos.y, mPos.z, 2, 0xfbbf24);
      const count = spec.multiTargets || 1;
      for (let i = 0; i < count; i++) {
        const tgt = candidates[i % candidates.length];
        this.fireTowerProjectile(tower, tgt, spec, count > 1 ? (i - (count - 1) / 2) * 0.12 : 0);
      }
    } else if (tower.defId === 'sniper_tower' || tower.defId === 'railgun') {
      tower.recoil = tower.defId === 'railgun' ? 0.45 : 0.32;
      tower.muzzleFlashTimer = 0.09;
      audio.playShot(tower.defId === 'railgun' ? 'railgun' : 'sniper');
      if (tower.defId === 'railgun') {
        this.addTrauma(0.18);
        this.triggerFlashLight(mPos.x, mPos.y, mPos.z, 0x38bdf8, 5.5, 0.08);
      }
      this.firePiercingBeam(tower, spec, primary);
    } else if (tower.defId === 'tesla_tower') {
      tower.muzzleFlashTimer = 0.09;
      audio.playShot('tesla');
      this.effects.spawnSparks(mPos.x, mPos.y, mPos.z, 4, 0x60a5fa);
      this.fireChainTesla(tower, spec, primary);
    } else if (tower.defId === 'flamethrower') {
      tower.recoil = 0.08;
      tower.muzzleFlashTimer = 0.08;
      audio.playShot('flame');
      this.fireConeFlamethrower(tower, spec, primary);
    } else if (tower.defId === 'cryo_tower') {
      tower.muzzleFlashTimer = 0.08;
      audio.playShot('cryo');
      this.effects.spawnSparks(mPos.x, mPos.y, mPos.z, 3, 0x7dd3fc);
      this.fireTowerProjectile(tower, primary, spec, 0);
    } else if (tower.defId === 'toxic_tower') {
      tower.recoil = 0.2;
      tower.muzzleFlashTimer = 0.07;
      audio.playShot('toxic');
      this.effects.spawnSparks(mPos.x, mPos.y, mPos.z, 3, 0x84cc16);
      this.fireTowerProjectile(tower, primary, spec, 0);
    } else if (tower.defId === 'harpoon_tower') {
      tower.recoil = 0.26;
      tower.muzzleFlashTimer = 0.06;
      audio.playShot('ballista');
      const count = spec.multiTargets || 1;
      for (let i = 0; i < Math.min(count, candidates.length); i++) {
        const tgt = candidates[i];
        this.addTransientBeam(mPos, new THREE.Vector3(tgt.wx, tgt.wy + 0.6, tgt.wz), 0xf59e0b, 0.25);
        this.fireTowerProjectile(tower, tgt, spec, 0);
      }
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
      this.addTrauma(tower.level >= 4 ? 0.3 : 0.2);
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
    } else if (tower.defId === 'patriot') {
      tower.recoil = 0.16;
      tower.muzzleFlashTimer = 0.09;
      audio.playShot('missile');
      this.effects.spawnSmokePuff(mPos.x, mPos.y, mPos.z, 0xe2e8f0, 0.75);
      const maxTargets = spec.multiTargets || 1;
      for (let i = 0; i < Math.min(maxTargets, candidates.length); i++) {
        this.fireTowerProjectile(tower, candidates[i], spec, (i - 1) * 0.14);
      }
    } else {
      tower.recoil = 0.14;
      tower.muzzleFlashTimer = 0.05;
      audio.playShot('mg50');
      this.fireTowerProjectile(tower, primary, spec, 0);
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
    p.ownerId = tower.ownerId;
    p.damage = spec.damage;
    p.damageType = spec.damageType;
    p.armorPierce = spec.armorPierce || 0;
    p.armorIgnore = spec.armorIgnore || 0;
    p.heavyMultiplier = spec.heavyMultiplier || 1;
    p.tandemHeat = !!spec.tandemHeat;
    p.critChance = spec.critChance || 0;
    p.critMultiplier = spec.critMultiplier || 1.6;
    p.splashRadius = spec.splashRadius || 0;
    p.burnDps = spec.burnDps || 0;
    p.burnDuration = spec.burnDuration || 0;
    p.poisonDps = spec.poisonDps || 0;
    p.poisonDuration = spec.poisonDuration || 0;
    p.corrosionAmount = spec.corrosionAmount || 0;
    p.slowFactor = spec.slowFactor || 0;
    p.slowDuration = spec.slowDuration || 0;
    p.freezeDuration = spec.freezeDuration || 0;
    p.rootDuration = spec.rootDuration || 0;
    p.markedAmp = spec.markedAmp || 0;
    p.thermalVuln = spec.thermalVuln || 0;
    p.createsToxicZone = !!spec.createsToxicZone;
    p.allowApsBypass = !!spec.allowApsBypass;
    (p as any).stunDuration = spec.stunDuration || 0;
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
    } else if (tower.defId === 'patriot') {
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
      p.kind = tower.defId === 'tos1_mlrs' || spec.damageType === 'he_rocket' || spec.damageType === 'thermobaric' ? 'rocket' : 'shell';
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
      const isBoltOrSabot = tower.defId === 'bushmaster' || tower.defId === 'abrams_pit' || tower.defId === 'ballista' || tower.defId === 'harpoon_tower';
      p.kind = isBoltOrSabot ? 'sabot' : 'bullet';
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
      if (tower.defId === 'cryo_tower') {
        mesh.material = ((this as any).cryoMat ??= new THREE.MeshBasicMaterial({ color: 0x7dd3fc }));
      } else if (tower.defId === 'toxic_tower') {
        mesh.material = ((this as any).toxicProjMat ??= new THREE.MeshBasicMaterial({ color: 0x84cc16 }));
      } else {
        mesh.material = p.kind === 'sabot' ? this.sabotMat : this.bulletMat;
      }
      const sc = tower.defId === 'abrams_pit' ? 2.2 : tower.defId === 'cryo_tower' || tower.defId === 'toxic_tower' ? 1.85 : p.kind === 'sabot' ? 1.5 : 1.0;
      mesh.scale.set(sc, sc, p.kind === 'sabot' ? 1.7 : 1.0);
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

  private applyProjectileStatusEffects(p: ProjectileEntity, enemy: EnemyEntity) {
    if (!enemy || !enemy._pooledActive) return;
    if (p.burnDps > 0 && p.burnDuration > 0) {
      enemy.burnDps = Math.max(enemy.burnDps, p.burnDps);
      enemy.burnTimer = Math.max(enemy.burnTimer, p.burnDuration);
      enemy.burnSourceTower = p.sourceTower;
    }
    if (p.poisonDps > 0 && p.poisonDuration > 0) {
      enemy.poisonDps = Math.max(enemy.poisonDps, p.poisonDps);
      enemy.poisonTimer = Math.max(enemy.poisonTimer, p.poisonDuration);
      enemy.poisonSourceTower = p.sourceTower;
    }
    if (p.corrosionAmount > 0) {
      enemy.corrosionReduction = Math.min(0.85, Math.max(enemy.corrosionReduction, p.corrosionAmount));
      enemy.corrosionTimer = Math.max(enemy.corrosionTimer, 5.0);
    }
    if (p.slowFactor > 0 && !enemy.slowImmune) {
      enemy.cryoSlow = Math.max(enemy.cryoSlow, p.slowFactor);
      enemy.cryoSlowTimer = Math.max(enemy.cryoSlowTimer, p.slowDuration || 2.2);
    }
    if (p.freezeDuration > 0 && !enemy.slowImmune) {
      enemy.stunTimer = Math.max(enemy.stunTimer, p.freezeDuration);
    }
    if ((p as any).stunDuration > 0) {
      enemy.stunTimer = Math.max(enemy.stunTimer, (p as any).stunDuration);
    }
    if (p.rootDuration > 0) {
      enemy.rootTimer = Math.max(enemy.rootTimer, p.rootDuration);
    }
    if (p.markedAmp > 0) {
      enemy.markedAmp = Math.max(enemy.markedAmp, p.markedAmp);
      enemy.markedTimer = Math.max(enemy.markedTimer, 4.5);
    }
    if (p.thermalVuln > 0) {
      enemy.thermalVuln = Math.max(enemy.thermalVuln, p.thermalVuln);
    }
  }

  private impactSingleEnemy(p: ProjectileEntity, enemy: EnemyEntity) {
    const res = this.applyDamageToEnemy(enemy, p.damage, p.damageType, p.sourceTower, {
      armorPierce: p.armorPierce,
      armorIgnore: p.armorIgnore,
      heavyMultiplier: p.heavyMultiplier,
      tandemHeat: p.tandemHeat,
      critChance: p.critChance,
      critMultiplier: p.critMultiplier,
      isMissile: p.isMissile,
      allowApsIntercept: !p.allowApsBypass,
      actorId: p.ownerId
    });

    if (res.apsIntercepted) {
      this.effects.spawnShockwave(enemy.wx, 1.0, enemy.wz, 2.5, 0x22d3ee);
      this.spawnFloatingText(enemy.wx, 3.0, enemy.wz, 'APS INTERCEPT!', '#22d3ee');
      audio.playApsIntercept();
      return;
    }

    this.applyProjectileStatusEffects(p, enemy);

    if (p.splashRadius > 0) {
      p.targetX = enemy.x;
      p.targetY = enemy.y;
      p.targetWx = enemy.wx;
      p.targetWz = enemy.wz;
      p.targetWy = enemy.wy;
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
      const sparkColor =
        res.isCrit ? 0x38bdf8 : p.damageType === 'ice' || p.damageType === 'cryo' ? 0x7dd3fc : 0xfef08a;
      this.effects.spawnSparks(p.wx, p.wy, p.wz, 3, sparkColor);
    }
  }

  private detonateSplash(p: ProjectileEntity, alreadyHitEnemy: EnemyEntity | null = null) {
    const isBig = p.splashRadius >= 90 || p.kind === 'hellfire';
    const isToxic = p.damageType === 'poison' || p.damageType === 'toxic' || p.createsToxicZone;
    const isCryo = p.damageType === 'ice' || p.damageType === 'cryo';
    const fxColor = isToxic ? 0x84cc16 : isCryo ? 0x7dd3fc : p.kind === 'hellfire' ? 0xef4444 : 0xf97316;
    const scale = Math.max(0.65, p.splashRadius / 72);
    this.effects.spawnExplosion(
      p.targetWx,
      Math.max(0.4, p.targetWy),
      p.targetWz,
      scale,
      fxColor,
      true
    );
    if (p.targetWy < 1.5 && !isToxic && !isCryo) {
      this.effects.spawnCrater(p.targetWx, p.targetWz, scale);
    }
    if (p.burnDps > 0 && p.burnDuration > 0 && !isToxic) {
      this.spawnFireZone(p.targetX, p.targetY, p.splashRadius, p.burnDps, p.burnDuration, 'fire', 0, p.ownerId || p.sourceTower?.ownerId);
    }
    if (p.createsToxicZone) {
      this.spawnFireZone(
        p.targetX,
        p.targetY,
        Math.max(60, p.splashRadius),
        Math.max(20, (p.poisonDps || 30) * 0.65),
        4.2,
        'poison',
        p.corrosionAmount || 0.25,
        p.ownerId || p.sourceTower?.ownerId
      );
    }
    if (!isToxic && !isCryo) {
      audio.playExplosion(scale);
    }
    if (multiplayer.isHost()) {
      multiplayer.queueCombatEvent({
        kind: 'EXPLODE',
        wx: Number(p.targetWx.toFixed(2)),
        wy: Number(Math.max(0.4, p.targetWy).toFixed(2)),
        wz: Number(p.targetWz.toFixed(2)),
        scale: Number(scale.toFixed(2)),
        color: fxColor,
        damageType: isToxic || isCryo ? 'silent' : 'explode'
      });
    }

    if (p.kind === 'hellfire') {
      this.addTrauma(0.55);
      this.hitStopTimer = 0.032;
    } else if (isBig) {
      this.addTrauma(p.kind === 'rocket' ? 0.32 : 0.24);
    }

    const canHitAir =
      p.kind === 'hellfire' ||
      p.damageType === 'aa_missile' ||
      p.damageType === 'aa' ||
      p.sourceTower?.def.domain === 'air' ||
      p.sourceTower?.def.domain === 'both';

    const rSq = p.splashRadius * p.splashRadius;
    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      if (e === alreadyHitEnemy) return;
      if (e.domain === 'air' && !canHitAir) {
        return;
      }
      const dSq = (e.x - p.targetX) ** 2 + (e.y - p.targetY) ** 2;
      if (dSq <= rSq) {
        if (e.isBurrowed && p.splashRadius >= 45) {
          e.isBurrowed = false;
          e.unburrowed = true;
        }
        const dist = Math.sqrt(dSq);
        const falloff = p.kind === 'hellfire' ? 1.0 : Math.max(0.45, 1 - (dist / p.splashRadius) * 0.55);
        this.applyDamageToEnemy(e, p.damage * falloff, p.damageType, p.sourceTower, {
          armorPierce: p.armorPierce,
          armorIgnore: p.armorIgnore,
          heavyMultiplier: p.heavyMultiplier,
          tandemHeat: p.tandemHeat,
          critChance: p.critChance,
          critMultiplier: p.critMultiplier,
          isMissile: p.isMissile,
          isSplash: true,
          allowApsIntercept: p.kind !== 'hellfire' && !p.allowApsBypass,
          actorId: p.ownerId
        });
        this.applyProjectileStatusEffects(p, e);
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
    if (!enemy || !enemy._pooledActive) return { damage: 0, shieldDamage: 0 };

    const res = resolveDamage(enemy, rawDamage, damageType, opts);
    if (res.apsIntercepted || (res.damage <= 0 && res.shieldDamage <= 0)) return res;

    const actorId = sourceTower?.ownerId || opts?.actorId;
    if (actorId && (res.damage > 0 || res.shieldDamage > 0)) {
      enemy.damageByPlayer[actorId] = (enemy.damageByPlayer[actorId] || 0) + res.damage + res.shieldDamage;
    }

    if (res.shieldDamage > 0) {
      this.effects.spawnSparks(enemy.wx, enemy.wy + 0.9, enemy.wz, 2, 0x22d3ee);
      if (res.damage <= 0) {
        if (sourceTower) sourceTower.totalDamage += res.shieldDamage;
        this.totalDamage += res.shieldDamage;
        this.updateEnemyHealthBar(enemy);
        return res;
      }
    }

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
    this.totalDamage += res.damage + res.shieldDamage;

    if (sourceTower) {
      sourceTower.totalDamage += res.damage + res.shieldDamage;
    }

    if (res.eraBlocked) {
      this.spawnFloatingText(enemy.wx, enemy.wy + 2.4, enemy.wz, 'ERA BLOCK (-40%)', '#fb923c');
    } else if (res.frontalBlocked && Math.random() < 0.35) {
      this.spawnFloatingText(enemy.wx, enemy.wy + 2.1, enemy.wz, 'ESCUDO FRONTAL', '#94a3b8');
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
    const bonusMult = sourceTower?.allyKillBonus || 0;
    const totalGold = enemy.reward + Math.round(enemy.reward * bonusMult);
    const killerId = sourceTower?.ownerId || multiplayer.localPeerId;
    const connectedIds = multiplayer.isActive()
      ? multiplayer.getPlayers().filter((p) => p.connected).map((p) => p.peerId)
      : [];
    const isCoopSquad = multiplayer.isActive() && connectedIds.length > 1;
    const isBossOrElite = !!(enemy.isBoss || enemy.isSubBoss || enemy.reward >= 35);

    if (isCoopSquad) {
      const payouts = distributeKillReward(
        totalGold,
        enemy.damageByPlayer,
        killerId,
        connectedIds,
        isBossOrElite
      );
      for (const [pid, amt] of Object.entries(payouts)) {
        if (amt > 0) this.addActorBudget(pid, amt);
      }
      if (payouts.assist) {
        for (const [pid, amt] of Object.entries(payouts.assist)) {
          if (amt > 0) this.addActorBudget(pid, amt);
        }
      }
    } else {
      this.addActorBudget(killerId, totalGold);
    }

    if (enemy.wbReward > 0) {
      this.sessionWB += enemy.wbReward;
      saveManager.addWarBonds(enemy.wbReward);
    }
    if (sourceTower) sourceTower.kills += 1;

    const rewardLabel = enemy.wbReward > 0 ? `+$${totalGold} | +${enemy.wbReward} WB$` : `+$${totalGold}`;
    this.spawnFloatingText(enemy.wx, enemy.wy + 1.8, enemy.wz, rewardLabel, enemy.wbReward > 0 ? '#facc15' : '#4ade80');

    if (enemy.isBoss) {
      this.effects.spawnExplosion(enemy.wx, 1.2, enemy.wz, 2.35, 0xef4444, true);
      this.effects.spawnCrater(enemy.wx, enemy.wz, 1.6);
      audio.playExplosion(1.8);
      this.addTrauma(0.75);
      this.hitStopTimer = 0.045;
      this.triggerFlashLight(enemy.wx, 3.0, enemy.wz, 0xff7b22, 8.0, 0.18);
      this.pushRadio(`ALVO PRIORITÁRIO DESTRUÍDO! ${enemy.type.toUpperCase()} abatido (+$${enemy.reward} / +${enemy.wbReward} WB$)!`, 'good');
      if (multiplayer.isHost()) {
        multiplayer.queueCombatEvent({
          kind: 'EXPLODE',
          wx: Number(enemy.wx.toFixed(2)),
          wy: 1.2,
          wz: Number(enemy.wz.toFixed(2)),
          scale: 2.35,
          color: 0xef4444
        });
      }
    } else if (enemy.armorClass === 'heavy' || enemy.domain === 'air') {
      this.effects.spawnExplosion(enemy.wx, Math.max(0.6, enemy.wy), enemy.wz, 1.15, 0xf97316, true);
      if (enemy.domain === 'ground') this.effects.spawnCrater(enemy.wx, enemy.wz, 0.9);
      audio.playExplosion(1.0);
      this.addTrauma(0.16);
      if (multiplayer.isHost()) {
        multiplayer.queueCombatEvent({
          kind: 'EXPLODE',
          wx: Number(enemy.wx.toFixed(2)),
          wy: Number(Math.max(0.6, enemy.wy).toFixed(2)),
          wz: Number(enemy.wz.toFixed(2)),
          scale: 1.15,
          color: 0xf97316
        });
      }
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
            if (multiplayer.isHost()) {
              multiplayer.queueCombatEvent({
                kind: 'EXPLODE',
                wx: Number(iwx.toFixed(2)),
                wy: 0.35,
                wz: Number(iwz.toFixed(2)),
                scale: 0.65,
                color: 0xf97316,
                damageType: 'silent'
              });
            }

            this.enemyPool.forEachActive((obj) => {
              const e = obj as EnemyEntity;
              if (Math.hypot(e.x - ix, e.y - iy) <= 58) {
                this.applyDamageToEnemy(e, 105, 'apds', null, {
                  armorIgnore: 0.72,
                  allowApsIntercept: false,
                  actorId: f.actorId
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
            this.spawnFireZone(ix, iy, 82, 95, 4.5, 'fire', 0, f.actorId);
            audio.playExplosion(1.1);
            if (multiplayer.isHost()) {
              multiplayer.queueCombatEvent({
                kind: 'EXPLODE',
                wx: Number(iwx.toFixed(2)),
                wy: 0.4,
                wz: Number(iwz.toFixed(2)),
                scale: 1.35,
                color: 0xf97316
              });
            }

            this.enemyPool.forEachActive((obj) => {
              const e = obj as EnemyEntity;
              if (Math.hypot(e.x - ix, e.y - iy) <= 110) {
                this.applyDamageToEnemy(e, 520, 'thermobaric', null, {
                  allowApsIntercept: false,
                  actorId: f.actorId
                });
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

    for (const [, cur] of this.allyCursors) {
      if (!cur.group.visible) {
        cur.labelEl.classList.add('hidden');
        continue;
      }
      proj.set(cur.wx, 1.35, cur.wz).project(this.camera);
      if (proj.z > 1) {
        cur.labelEl.classList.add('hidden');
        continue;
      }
      const sx = (proj.x * 0.5 + 0.5) * w;
      const sy = (-proj.y * 0.5 + 0.5) * h;
      cur.labelEl.classList.remove('hidden');
      cur.labelEl.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -100%)`;
    }

    for (const p of this.activePings) {
      proj.set(p.wx, 5.2, p.wz).project(this.camera);
      if (proj.z > 1) {
        p.labelEl.classList.add('hidden');
        continue;
      }
      const sx = (proj.x * 0.5 + 0.5) * w;
      const sy = (-proj.y * 0.5 + 0.5) * h;
      p.labelEl.classList.remove('hidden');
      p.labelEl.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -100%)`;
    }
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
    const spec = this.getEffectiveSpec(t);

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
      const ring = this.createCircleLoop(72, t.specialization === 'A' ? 0x38bdf8 : t.specialization === 'B' ? 0xf59e0b : 0x38bdf8, 0.85);
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
        const spec = getTowerLevelSpec(def, 1);
        const fogMult = this.pathfinder.hasTerrainFeature(col, row, 'fog') ? 0.78 : 1;
        const effectiveCost = this.getEffectiveTowerCost(this.activeTool.towerId);
        const { x: wx, z: wz } = cellToWorldCenter(col, row);
        const valid = Boolean(this.lastCanPlace?.ok && this.budget >= effectiveCost);

        this.ghostGroup.visible = true;
        this.ghostGroup.position.set(wx, 0, wz);
        (this.ghostTileHighlight.material as THREE.MeshBasicMaterial).color.setHex(valid ? 0x38bdf8 : 0xf97316);

        for (const [id, gm] of this.ghostModels) {
          const isMatch = id === this.activeTool.towerId;
          gm.root.visible = isMatch;
          if (isMatch) gm.setValid(valid);
        }

        if (spec.range > 0) {
          const rW = spec.range * fogMult * WORLD_SCALE;
          this.ghostRangeRing.visible = true;
          this.ghostRangeRing.scale.setScalar(rW);
          (this.ghostRangeRing.material as THREE.LineBasicMaterial).color.setHex(valid ? 0x38bdf8 : 0xf97316);
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
    const upgradeOptions = getTowerUpgradeOptions(t.def, t.level, t.specialization);
    const maxLevel = (t.def.levels?.length || 1) + (t.def.specializations ? 2 : 0);
    return {
      id: t.id,
      defId: t.defId,
      ownerId: t.ownerId,
      ownerName: t.ownerName,
      ownerColor: t.ownerColor,
      canModify: multiplayer.canModifyTower(t.ownerId, multiplayer.localPeerId),
      canRepair: multiplayer.canRepairTower(multiplayer.localPeerId),
      name: spec.name,
      shortName: t.def.shortName,
      role: t.def.role,
      category: t.def.category || 'combat',
      level: t.level,
      maxLevel,
      specialization: t.specialization,
      specPros: spec.pros || null,
      specCons: spec.cons || null,
      hp: Math.ceil(t.hp),
      maxHp: t.maxHp,
      shield: Math.round(t.shield),
      maxShield: Math.round(t.maxShield),
      repairCost: this.getRepairCost(t),
      empDisabled: t.empDisabledTimer > 0,
      fogDebuff: t.fogDebuff,
      burning: t.burnTimer > 0,
      corroded: t.corrosionTimer > 0,
      chilled: t.chillTimer > 0,
      isBarrier: !!t.def.isBarrier,
      isSupportAura: !!t.def.isSupportAura,
      domain: t.def.domain,
      damageType: spec.damageType || 'physical',
      range: spec.range,
      minRange: spec.minRange || 0,
      fireRate: spec.fireRate,
      damage: spec.damage,
      notes: spec.notes,
      priority: t.priority,
      totalDamage: Math.round(t.totalDamage),
      kills: t.kills,
      sellRefund: Math.floor(t.totalInvested * 0.75 * Math.max(0.4, t.hp / t.maxHp)),
      upgradeOptions,
      nextUpgrade:
        upgradeOptions?.kind === 'common'
          ? {
              name: upgradeOptions.name,
              cost: upgradeOptions.cost,
              notes: upgradeOptions.notes
            }
          : null
    };
  }

  private serializeEnemy(e: EnemyEntity | null) {
    if (!e || !e._pooledActive) return null;
    const def = (ENEMY_DEFINITIONS as any)[e.type];
    return {
      id: e.id,
      isPreview: false,
      type: e.type,
      name: def?.name || e.type,
      category: def?.category || e.domain,
      domain: e.domain,
      armorClass: e.armorClass,
      hp: Math.max(0, Math.ceil(e.hp)),
      maxHp: e.maxHp,
      shield: Math.max(0, Math.round(e.shield)),
      maxShield: e.maxShield,
      speed: Math.round(e.speed),
      reward: e.reward,
      fobDamage: e.fobDamage,
      isStealth: e.isStealth,
      stealthRevealed: e.stealthRevealed,
      isBurrowed: e.isBurrowed,
      isBoss: e.isBoss,
      weaponName: def?.weaponName || null,
      towerAttack: def?.towerAttack || null,
      resistances: e.resistances || def?.resistances || {},
      aiBehavior: def?.aiBehavior || null,
      roleSummary: def?.roleSummary || ''
    };
  }

  private emitFullHudSync(waveVotesOverride?: string[], requiredVotesOverride?: number) {
    const nextWaveIdx = this.currentWave;
    const nextWaveDef = this.stageConfig.waves[nextWaveIdx] || null;
    const canCallEarly =
      !this.gameOver &&
      this.currentWave < this.totalWaves &&
      (!this.waveActive || this.spawnQueue.length === 0);

    const damaged = this.towers.filter(
      (t) => t.hp < t.maxHp || t.burnTimer > 0 || t.corrosionTimer > 0 || t.chillTimer > 0
    );
    const repairAllCost = damaged.reduce((acc, t) => acc + this.getRepairCost(t), 0);

    let activeBoss: any = null;
    this.enemyPool.forEachActive((obj) => {
      const e = obj as EnemyEntity;
      if (e.isBoss && (!activeBoss || e.isStageBoss || e.isMegaBoss)) {
        const def = (ENEMY_DEFINITIONS as any)[e.type];
        activeBoss = {
          name: def?.name || e.type,
          shortName: def?.shortName || e.type,
          hp: Math.max(0, Math.ceil(e.hp)),
          maxHp: e.maxHp,
          shield: Math.max(0, Math.round(e.shield)),
          maxShield: e.maxShield,
          weaponName: def?.weaponName || null
        };
      }
    });

    const localId = multiplayer.isActive() ? multiplayer.localPeerId : 'local';
    const localTowerCount = this.towers.filter((t) => t.ownerId === localId || !t.ownerId).length;
    const maxTowers = multiplayer.isActive()
      ? getMaxTowersPerPlayer(multiplayer.getConnectedPlayerCount())
      : 30;
    const lobby = multiplayer.getLobbyState();
    const localBudget = this.getActorBudget(multiplayer.localPeerId);

    bus.emit('hud:state', {
      budget: localBudget,
      warBonds: saveManager.getWarBonds(),
      worldId: this.currentWorldId,
      stageId: this.currentStageId,
      stageTitle: this.stageConfig.title,
      stageDifficulty: this.stageConfig.difficulty || null,
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
      damagedTowerCount: damaged.length,
      repairAllCost,
      ruinCount: this.destroyedRuins.length,
      towerCount: localTowerCount,
      maxTowers,
      coopActive: multiplayer.isActive(),
      coopIsHost: multiplayer.isHost(),
      coopIsClient: multiplayer.isClient(),
      coopRoomCode: multiplayer.getRoomCode(),
      coopPlayers: lobby.players,
      waveVotes: waveVotesOverride ?? lobby.waveVotes,
      requiredVotes: requiredVotesOverride ?? lobby.requiredVotes,
      waveVoteTimer: Math.ceil(this.waveVoteTimer || lobby.waveVoteTimer || 0),
      activeBoss,
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
    if (!multiplayer.isActive() && !this.gameOver && (this.towers.length > 0 || this.currentWave > 0)) {
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
    for (const unsub of this.coopUnsubs) unsub();
    this.clearCoopVisuals();
    if (this.diorama) this.diorama.dispose();
    if (this.biomeEnv) {
      this.biomeEnv.dispose();
      this.biomeEnv = null;
    }
    disposeBiomeEnvironmentCaches(this.renderer);
    for (const m of this.runtimeWarmMats) m.dispose();
    for (const g of this.runtimeWarmGeos) g.dispose();
    this.runtimeWarmMats = [];
    this.runtimeWarmGeos = [];
    this.disposePostProcessing();
    this.controls.dispose();
    this.renderer.dispose();
    this.overlayEl.remove();
  }
}
