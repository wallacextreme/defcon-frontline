import * as THREE from 'three';

export type QualityTier = 'low' | 'medium' | 'high' | 'ultra';
export type AAMode = 'native' | 'off' | 'msaa' | 'smaa';
export type ToneMapMode = 'agx' | 'aces' | 'neutral';
export type IBLMode = 'biome' | 'room';
export type BloomMode = 'hdr' | 'legacy' | 'off';

export const QUALITY_STORAGE_KEY = 'defcon.graphicsQuality';
export const QUALITY_TIERS: readonly QualityTier[] = ['low', 'medium', 'high', 'ultra'] as const;

export interface QualityProfile {
  tier: QualityTier;
  dprCap: number;
  dynamicDprMin: number;
  useComposer: boolean;
  msaaSamples: number;
  aaMode: AAMode;
  shadowMapSize: number;
  bloomEnabled: boolean;
  bloomMode: BloomMode;
  bloomThreshold: number;
  bloomStrength: number;
  bloomRadius: number;
  gtaoEnabled: boolean;
  envEnabled: boolean;
  iblMode: IBLMode;
  toneMapMode: ToneMapMode;
  propDensity: number;
  enableWind: boolean;
  enableWearShader: boolean;
  targetFrameMs: number;
}

export interface VisualABOverrides {
  quality?: QualityTier;
  aa?: 'off' | 'msaa' | 'smaa';
  tonemap?: ToneMapMode;
  ibl?: IBLMode;
  bloom?: BloomMode;
  gtao?: boolean;
}

export interface ResolvedQualityConfig {
  tier: QualityTier;
  profile: QualityProfile;
  overrides: VisualABOverrides;
  source: 'query' | 'storage' | 'auto';
}

export interface QualityDetectionHints {
  innerWidth?: number;
  innerHeight?: number;
  devicePixelRatio?: number;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  maxTouchPoints?: number;
  userAgent?: string;
  rendererString?: string;
  gpuRenderer?: string;
}

export const QUALITY_PROFILES: Readonly<Record<QualityTier, Readonly<QualityProfile>>> = Object.freeze({
  low: Object.freeze({
    tier: 'low',
    dprCap: 1.0,
    dynamicDprMin: 1.0,
    useComposer: false,
    msaaSamples: 0,
    aaMode: 'native',
    shadowMapSize: 1024,
    bloomEnabled: false,
    bloomMode: 'off',
    bloomThreshold: 1.14,
    bloomStrength: 0,
    bloomRadius: 0,
    gtaoEnabled: false,
    envEnabled: false,
    iblMode: 'biome',
    toneMapMode: 'agx',
    propDensity: 0.45,
    enableWind: false,
    enableWearShader: false,
    targetFrameMs: 26
  }),
  medium: Object.freeze({
    tier: 'medium',
    dprCap: 1.25,
    dynamicDprMin: 1.0,
    useComposer: true,
    msaaSamples: 2,
    aaMode: 'msaa',
    shadowMapSize: 1536,
    bloomEnabled: true,
    bloomMode: 'hdr',
    bloomThreshold: 1.14,
    bloomStrength: 0.26,
    bloomRadius: 0.36,
    gtaoEnabled: false,
    envEnabled: true,
    iblMode: 'biome',
    toneMapMode: 'agx',
    propDensity: 0.75,
    enableWind: false,
    enableWearShader: true,
    targetFrameMs: 36
  }),
  high: Object.freeze({
    tier: 'high',
    dprCap: 1.5,
    dynamicDprMin: 1.0,
    useComposer: true,
    msaaSamples: 4,
    aaMode: 'msaa',
    shadowMapSize: 2048,
    bloomEnabled: true,
    bloomMode: 'hdr',
    bloomThreshold: 1.14,
    bloomStrength: 0.28,
    bloomRadius: 0.38,
    gtaoEnabled: false,
    envEnabled: true,
    iblMode: 'biome',
    toneMapMode: 'agx',
    propDensity: 1.0,
    enableWind: true,
    enableWearShader: true,
    targetFrameMs: 34
  }),
  ultra: Object.freeze({
    tier: 'ultra',
    dprCap: 2.0,
    dynamicDprMin: 1.25,
    useComposer: true,
    msaaSamples: 4,
    aaMode: 'msaa',
    shadowMapSize: 2048,
    bloomEnabled: true,
    bloomMode: 'hdr',
    bloomThreshold: 1.14,
    bloomStrength: 0.3,
    bloomRadius: 0.4,
    gtaoEnabled: true,
    envEnabled: true,
    iblMode: 'biome',
    toneMapMode: 'agx',
    propDensity: 1.0,
    enableWind: true,
    enableWearShader: true,
    targetFrameMs: 34
  })
});

export function isValidQualityTier(value: unknown): value is QualityTier {
  return value === 'low' || value === 'medium' || value === 'high' || value === 'ultra';
}

export function getNextLowerQualityTier(tier: QualityTier): QualityTier | null {
  const idx = QUALITY_TIERS.indexOf(tier);
  return idx > 0 ? QUALITY_TIERS[idx - 1] : null;
}

export function getThreeToneMapping(mode: ToneMapMode): THREE.ToneMapping {
  if (mode === 'aces') return THREE.ACESFilmicToneMapping;
  if (mode === 'neutral') return THREE.NeutralToneMapping;
  return THREE.AgXToneMapping;
}

export function loadSavedQualityTier(): QualityTier | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(QUALITY_STORAGE_KEY);
    if (!raw) return null;
    const normalized = raw.trim().toLowerCase();
    return isValidQualityTier(normalized) ? normalized : null;
  } catch {
    return null;
  }
}

export function saveQualityTier(tier: QualityTier): boolean {
  if (!isValidQualityTier(tier) || typeof localStorage === 'undefined') return false;
  try {
    localStorage.setItem(QUALITY_STORAGE_KEY, tier);
    return true;
  } catch {
    return false;
  }
}

export function detectInitialQualityTier(hints?: QualityDetectionHints): QualityTier {
  const winW =
    hints?.innerWidth ??
    (typeof window !== 'undefined' && typeof window.innerWidth === 'number' ? window.innerWidth : 1440);
  const winH =
    hints?.innerHeight ??
    (typeof window !== 'undefined' && typeof window.innerHeight === 'number' ? window.innerHeight : 900);
  const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { deviceMemory?: number }) : null;
  const ua = (hints?.userAgent ?? nav?.userAgent ?? '').toLowerCase();
  const cores = hints?.hardwareConcurrency ?? nav?.hardwareConcurrency ?? 8;
  const memGb = hints?.deviceMemory ?? nav?.deviceMemory ?? 8;
  const touchPoints = hints?.maxTouchPoints ?? nav?.maxTouchPoints ?? 0;
  const gpu = (hints?.rendererString ?? hints?.gpuRenderer ?? '').toLowerCase();

  const isSoftwareGpu =
    gpu.includes('swiftshader') || gpu.includes('llvmpipe') || gpu.includes('software') || gpu.includes('basic render');
  if (isSoftwareGpu) return 'low';

  const minSide = Math.min(winW, winH);
  const isMobileUa = /android|iphone|ipad|ipod|mobile|mobi/i.test(ua);
  const isMobileLike = isMobileUa || (minSide <= 768 && touchPoints > 0) || winW <= 540;

  if (isMobileLike) {
    if (cores <= 4 || memGb <= 3) return 'low';
    return 'medium';
  }

  if (cores <= 2 || memGb <= 2) return 'low';

  // Intel UHD / HD Graphics integrated GPUs run MSAA 2x ('medium') at ~57-60 FPS,
  // whereas HalfFloat MSAA 4x ('high') drops to ~30 FPS on UHD 630.
  const isIntelIntegratedGpu =
    gpu.includes('intel') && (gpu.includes('uhd') || gpu.includes('hd graphics') || /\bhd\s*\d{3,4}\b/.test(gpu));
  if (isIntelIntegratedGpu) return 'medium';

  if (cores <= 4 || memGb <= 4) return 'medium';

  // Dedicated desktop GPUs default to 'high' (never auto-'ultra' because GTAOPass is heavy).
  return 'high';
}

export function parseVisualABOverrides(search?: string): VisualABOverrides {
  const rawSearch =
    typeof search === 'string'
      ? search
      : typeof window !== 'undefined' && window.location
        ? window.location.search
        : '';

  if (!rawSearch) return {};

  const params = new URLSearchParams(rawSearch.startsWith('?') ? rawSearch.slice(1) : rawSearch);
  const overrides: VisualABOverrides = {};

  const quality = params.get('quality')?.trim().toLowerCase();
  if (isValidQualityTier(quality)) {
    overrides.quality = quality;
  }

  const aa = params.get('aa')?.trim().toLowerCase();
  if (aa === 'off' || aa === 'msaa' || aa === 'smaa') {
    overrides.aa = aa;
  }

  const tonemap = params.get('tonemap')?.trim().toLowerCase();
  if (tonemap === 'aces' || tonemap === 'agx' || tonemap === 'neutral') {
    overrides.tonemap = tonemap;
  }

  const ibl = params.get('ibl')?.trim().toLowerCase();
  if (ibl === 'room' || ibl === 'biome') {
    overrides.ibl = ibl;
  }

  const bloom = params.get('bloom')?.trim().toLowerCase();
  if (bloom === 'legacy' || bloom === 'hdr' || bloom === 'off') {
    overrides.bloom = bloom;
  }

  const gtao = params.get('gtao')?.trim().toLowerCase();
  if (gtao === '1' || gtao === 'true') {
    overrides.gtao = true;
  } else if (gtao === '0' || gtao === 'false') {
    overrides.gtao = false;
  }

  return overrides;
}

export function applyOverridesToProfile(
  baseTier: QualityTier,
  overrides: VisualABOverrides
): QualityProfile {
  const base = QUALITY_PROFILES[baseTier];
  const profile: QualityProfile = { ...base };

  if (overrides.aa !== undefined) {
    profile.aaMode = overrides.aa;
    if (overrides.aa === 'off') {
      profile.msaaSamples = 0;
    } else if (overrides.aa === 'smaa') {
      profile.useComposer = true;
      profile.msaaSamples = 0;
    } else if (overrides.aa === 'msaa') {
      profile.useComposer = true;
      profile.msaaSamples = Math.max(2, base.msaaSamples || 4);
    }
  }

  if (overrides.tonemap !== undefined) {
    profile.toneMapMode = overrides.tonemap;
  }

  if (overrides.ibl !== undefined) {
    profile.iblMode = overrides.ibl;
    profile.envEnabled = true;
  }

  if (overrides.bloom !== undefined) {
    profile.bloomMode = overrides.bloom;
    if (overrides.bloom === 'off') {
      profile.bloomEnabled = false;
      profile.bloomStrength = 0;
      profile.bloomRadius = 0;
    } else if (overrides.bloom === 'legacy') {
      profile.useComposer = true;
      profile.bloomEnabled = true;
      profile.bloomThreshold = 0.82;
      profile.bloomStrength = 0.45;
      profile.bloomRadius = 0.35;
    } else {
      profile.useComposer = true;
      profile.bloomEnabled = true;
      profile.bloomThreshold = 1.14;
      profile.bloomStrength = base.bloomStrength > 0 ? base.bloomStrength : 0.28;
      profile.bloomRadius = base.bloomRadius > 0 ? base.bloomRadius : 0.38;
    }
  }

  if (overrides.gtao !== undefined) {
    profile.gtaoEnabled = overrides.gtao;
    if (overrides.gtao) {
      profile.useComposer = true;
    }
  }

  return profile;
}

export function resolveQualityConfig(search?: string, hints?: QualityDetectionHints): ResolvedQualityConfig {
  const overrides = parseVisualABOverrides(search);

  let tier: QualityTier;
  let source: 'query' | 'storage' | 'auto';

  if (overrides.quality) {
    tier = overrides.quality;
    source = 'query';
  } else {
    const saved = loadSavedQualityTier();
    if (saved) {
      tier = saved;
      source = 'storage';
    } else {
      tier = detectInitialQualityTier(hints);
      source = 'auto';
    }
  }

  const profile = applyOverridesToProfile(tier, overrides);
  return { tier, profile, overrides, source };
}

export type AdaptiveQualityAction = 'none' | 'dpr_down' | 'dpr_up' | 'tier_down';

export interface AdaptiveSampleDecision {
  changed: boolean;
  action: AdaptiveQualityAction;
  tier: QualityTier;
  dprScale: number;
  p95Ms: number;
}

export interface AdaptiveQualitySamplerOptions {
  initialTier: QualityTier;
  warmupSec?: number;
  windowSec?: number;
  p95BudgetMs?: number;
  allowDynamicDpr?: boolean;
  dprStep?: number;
  maxSamples?: number;
}

function sortFloat32Prefix(arr: Float32Array, count: number): void {
  // In-place shell sort over [0, count): zero allocations, deterministic, fast for <= 512 samples.
  let gap = 1;
  while (gap < count / 3) gap = gap * 3 + 1;
  while (gap >= 1) {
    for (let i = gap; i < count; i++) {
      const val = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > val) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = val;
    }
    gap = Math.floor(gap / 3);
  }
}

export class AdaptiveQualitySampler {
  private tier: QualityTier;
  private readonly warmupSec: number;
  private readonly windowSec: number;
  private readonly fixedBudgetMs: number | null;
  private readonly allowDynamicDpr: boolean;
  private readonly dprStep: number;
  private readonly samples: Float32Array;
  private readonly scratch: Float32Array;

  private warmupElapsed = 0;
  private windowElapsed = 0;
  private sampleCount = 0;
  private dprScale = 1.0;
  private lastP95Ms = 0;

  private readonly decision: AdaptiveSampleDecision;

  constructor(opts: AdaptiveQualitySamplerOptions) {
    this.tier = opts.initialTier;
    this.warmupSec = Math.max(0, opts.warmupSec ?? 2.0);
    this.windowSec = Math.max(0.25, opts.windowSec ?? 3.0);
    this.fixedBudgetMs = typeof opts.p95BudgetMs === 'number' && opts.p95BudgetMs > 0 ? opts.p95BudgetMs : null;
    this.allowDynamicDpr = opts.allowDynamicDpr ?? true;
    this.dprStep = Math.max(0.05, Math.min(0.4, opts.dprStep ?? 0.15));

    const capacity = Math.max(32, opts.maxSamples ?? 360);
    this.samples = new Float32Array(capacity);
    this.scratch = new Float32Array(capacity);

    this.decision = {
      changed: false,
      action: 'none',
      tier: this.tier,
      dprScale: this.dprScale,
      p95Ms: 0
    };
  }

  getTier(): QualityTier {
    return this.tier;
  }

  getDprScale(): number {
    return this.dprScale;
  }

  getLastP95Ms(): number {
    return this.lastP95Ms;
  }

  getBudgetMs(): number {
    return this.fixedBudgetMs ?? QUALITY_PROFILES[this.tier].targetFrameMs;
  }

  getEffectiveDpr(devicePixelRatio: number): number {
    const profile = QUALITY_PROFILES[this.tier];
    const nativeCap = Math.min(Math.max(1, devicePixelRatio), profile.dprCap);
    const scaled = nativeCap * this.dprScale;
    const minDpr = Math.min(nativeCap, profile.dynamicDprMin);
    return Math.max(minDpr, Math.min(nativeCap, Math.round(scaled * 100) / 100));
  }

  reset(newTier?: QualityTier): void {
    if (newTier && isValidQualityTier(newTier)) {
      this.tier = newTier;
    }
    this.warmupElapsed = 0;
    this.windowElapsed = 0;
    this.sampleCount = 0;
    this.dprScale = 1.0;
    this.lastP95Ms = 0;
    this.decision.changed = false;
    this.decision.action = 'none';
    this.decision.tier = this.tier;
    this.decision.dprScale = this.dprScale;
    this.decision.p95Ms = 0;
  }

  /**
   * Records a rendered frame time in milliseconds (zero allocations per call).
   * Returns a reused decision object; callers must read fields before the next call.
   */
  recordFrame(frameMs: number, dtSec?: number): AdaptiveSampleDecision {
    this.decision.changed = false;
    this.decision.action = 'none';
    this.decision.tier = this.tier;
    this.decision.dprScale = this.dprScale;
    this.decision.p95Ms = this.lastP95Ms;

    if (!Number.isFinite(frameMs) || frameMs <= 0 || frameMs > 250) {
      return this.decision;
    }

    const rawDt = typeof dtSec === 'number' && Number.isFinite(dtSec) && dtSec > 0 ? dtSec : frameMs * 0.001;
    const dt = rawDt > 0.1 ? 0.1 : rawDt;

    if (this.warmupElapsed < this.warmupSec) {
      this.warmupElapsed += dt;
      return this.decision;
    }

    if (this.sampleCount < this.samples.length) {
      this.samples[this.sampleCount] = frameMs;
      this.sampleCount++;
    } else {
      // Deterministic ring overwrite if frame rate exceeds buffer capacity within a window.
      this.samples[this.sampleCount % this.samples.length] = frameMs;
    }

    this.windowElapsed += dt;
    if (this.windowElapsed < this.windowSec || this.sampleCount === 0) {
      return this.decision;
    }

    const n = this.sampleCount;
    for (let i = 0; i < n; i++) {
      this.scratch[i] = this.samples[i];
    }
    sortFloat32Prefix(this.scratch, n);

    const p95Idx = Math.min(n - 1, Math.floor((n - 1) * 0.95));
    const p95Ms = this.scratch[p95Idx];
    this.lastP95Ms = p95Ms;
    this.decision.p95Ms = p95Ms;

    // Reset window for next interval.
    this.windowElapsed = 0;
    this.sampleCount = 0;

    const budgetMs = this.getBudgetMs();
    const profile = QUALITY_PROFILES[this.tier];
    const supportsDynamicDpr = this.allowDynamicDpr && (this.tier === 'high' || this.tier === 'ultra');
    const minScale = profile.dprCap > 0 ? profile.dynamicDprMin / profile.dprCap : 1.0;

    if (p95Ms > budgetMs) {
      // Mild overload on High/Ultra: scale DPR down first before stepping down a full quality tier.
      if (supportsDynamicDpr && this.dprScale > minScale + 0.01 && p95Ms <= budgetMs * 1.25) {
        this.dprScale = Math.max(minScale, Math.round((this.dprScale - this.dprStep) * 100) / 100);
        this.decision.changed = true;
        this.decision.action = 'dpr_down';
        this.decision.dprScale = this.dprScale;
        return this.decision;
      }

      const lower = getNextLowerQualityTier(this.tier);
      if (lower) {
        this.tier = lower;
        this.dprScale = 1.0;
        // Brief cooldown after a tier downgrade so shader/RT rebuild settles before next sample window.
        this.warmupElapsed = Math.max(0, this.warmupSec - 1.5);
        this.decision.changed = true;
        this.decision.action = 'tier_down';
        this.decision.tier = this.tier;
        this.decision.dprScale = this.dprScale;
        return this.decision;
      }
    } else if (supportsDynamicDpr && this.dprScale < 0.999 && p95Ms < budgetMs * 0.72) {
      // Sustained headroom: gently recover dynamic DPR back toward 1.0.
      this.dprScale = Math.min(1.0, Math.round((this.dprScale + this.dprStep * 0.67) * 100) / 100);
      this.decision.changed = true;
      this.decision.action = 'dpr_up';
      this.decision.dprScale = this.dprScale;
      return this.decision;
    }

    return this.decision;
  }
}
