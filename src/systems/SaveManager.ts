export type TechStatKey = 'damage' | 'fireRate' | 'hp' | 'cost';

export interface TowerTechLevels {
  damage: number;
  fireRate: number;
  hp: number;
  cost: number;
}

export interface TechMultipliers {
  damageMult: number;
  fireRateMult: number;
  hpMult: number;
  costMult: number;
}

export interface SavedTowerSnapshot {
  defId: string;
  col: number;
  row: number;
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
}

export interface ActiveMissionSnapshot {
  timestamp: number;
  worldId: number;
  stageId: number;
  budget: number;
  sessionWB: number;
  fobHp: number;
  fobMaxHp: number;
  completedWave: number;
  totalWaves: number;
  totalKills: number;
  totalDamage: number;
  airSupportTimers: {
    a10: number;
    hellfire: number;
    b52: number;
  };
  towers: SavedTowerSnapshot[];
}

export interface SaveState {
  version: number;
  warBonds: number;
  unlockedTowers: string[];
  unlockedSupports: string[];
  towerTech: Record<string, TowerTechLevels>;
  completedStages: Record<string, number>;
  unlockedStages: string[];
  selectedWorld: number;
  selectedStage: number;
  lastSavedAt: number;
  activeMission: ActiveMissionSnapshot | null;
}

export interface SaveSlotSummary {
  slotId: 1 | 2 | 3;
  savedAt: number;
  label: string;
  state: SaveState;
}

const SAVE_KEY = 'defcon_frontline_save_v3';
const BACKUP_KEY = 'defcon_frontline_save_v3_bak';
const LEGACY_V2_KEY = 'defcon_frontline_save_v2';
const LEGACY_V2_BAK_KEY = 'defcon_frontline_save_v2_bak';
const LEGACY_V1_KEY = 'defcon_frontline_save_v1';
const SLOT_KEY_PREFIX = 'defcon_frontline_slot_';

const IDB_NAME = 'DefconFrontlineDB';
const IDB_VERSION = 1;
const IDB_STORE = 'saves';

const CURRENT_VERSION = 3;
export const MAX_TECH_LEVEL = 5;

const STARTER_TOWERS = [
  'ballista',
  'm2_bunker',
  'abrams_pit',
  'howitzer',
  'sniper_tower',
  'cryo_tower',
  'tesla_tower',
  'toxic_tower',
  'flamethrower',
  'helios_laser',
  'railgun',
  'patriot',
  'phalanx',
  'harpoon_tower',
  'tos1_mlrs',
  'minefield',
  'ew_crew',
  'eng_workshop',
  'iron_dome',
  'energy_extractor',
  'bushmaster',
  'hesco'
];
const STARTER_SUPPORTS = ['a10', 'hellfire'];

function createDefaultState(): SaveState {
  return {
    version: CURRENT_VERSION,
    warBonds: 250,
    unlockedTowers: [...STARTER_TOWERS],
    unlockedSupports: [...STARTER_SUPPORTS],
    towerTech: {},
    completedStages: {},
    unlockedStages: ['1-1', '4-1'],
    selectedWorld: 1,
    selectedStage: 1,
    lastSavedAt: Date.now(),
    activeMission: null
  };
}

function clampTechLevel(v: unknown): number {
  const n = typeof v === 'number' && Number.isFinite(v) ? Math.floor(v) : 0;
  return Math.max(0, Math.min(MAX_TECH_LEVEL, n));
}

function sanitizeTowerSnapshot(raw: unknown): SavedTowerSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.defId !== 'string') return null;
  if (typeof r.col !== 'number' || typeof r.row !== 'number') return null;
  if (!Number.isInteger(r.col) || !Number.isInteger(r.row)) return null;

  const level = typeof r.level === 'number' && Number.isFinite(r.level) ? Math.max(1, Math.min(6, Math.floor(r.level))) : 1;
  const specialization = r.specialization === 'A' || r.specialization === 'B' ? r.specialization : null;
  const maxHp = typeof r.maxHp === 'number' && Number.isFinite(r.maxHp) && r.maxHp > 0 ? Math.round(r.maxHp) : 500;
  const hp = typeof r.hp === 'number' && Number.isFinite(r.hp) && r.hp > 0 ? Math.min(maxHp, Math.round(r.hp)) : maxHp;

  return {
    defId: r.defId,
    col: r.col,
    row: r.row,
    level,
    specialization,
    hp,
    maxHp,
    effectiveCost: typeof r.effectiveCost === 'number' && Number.isFinite(r.effectiveCost) ? Math.max(0, Math.round(r.effectiveCost)) : 100,
    totalInvested: typeof r.totalInvested === 'number' && Number.isFinite(r.totalInvested) ? Math.max(0, Math.round(r.totalInvested)) : 100,
    priority: typeof r.priority === 'string' ? r.priority : 'first',
    turretAngle: typeof r.turretAngle === 'number' && Number.isFinite(r.turretAngle) ? r.turretAngle : Math.PI / 2,
    totalDamage: typeof r.totalDamage === 'number' && Number.isFinite(r.totalDamage) ? Math.max(0, r.totalDamage) : 0,
    kills: typeof r.kills === 'number' && Number.isFinite(r.kills) ? Math.max(0, Math.floor(r.kills)) : 0
  };
}

function sanitizeActiveMission(raw: unknown): ActiveMissionSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;
  const worldId = typeof m.worldId === 'number' ? Math.floor(m.worldId) : 0;
  const stageId = typeof m.stageId === 'number' ? Math.floor(m.stageId) : 0;
  if (worldId < 1 || worldId > 4 || stageId < 1 || stageId > 5) return null;

  const towersRaw = Array.isArray(m.towers) ? m.towers : [];
  const towers: SavedTowerSnapshot[] = [];
  for (const t of towersRaw) {
    const clean = sanitizeTowerSnapshot(t);
    if (clean) towers.push(clean);
  }

  const timersRaw = (m.airSupportTimers && typeof m.airSupportTimers === 'object' ? m.airSupportTimers : {}) as Record<string, unknown>;

  return {
    timestamp: typeof m.timestamp === 'number' && Number.isFinite(m.timestamp) ? m.timestamp : Date.now(),
    worldId,
    stageId,
    budget: typeof m.budget === 'number' && Number.isFinite(m.budget) ? Math.max(0, Math.floor(m.budget)) : 0,
    sessionWB: typeof m.sessionWB === 'number' && Number.isFinite(m.sessionWB) ? Math.max(0, Math.floor(m.sessionWB)) : 0,
    fobMaxHp: typeof m.fobMaxHp === 'number' && Number.isFinite(m.fobMaxHp) && m.fobMaxHp > 0 ? Math.floor(m.fobMaxHp) : 20,
    fobHp: typeof m.fobHp === 'number' && Number.isFinite(m.fobHp) ? Math.max(1, Math.floor(m.fobHp)) : 20,
    completedWave: typeof m.completedWave === 'number' && Number.isFinite(m.completedWave) ? Math.max(0, Math.floor(m.completedWave)) : 0,
    totalWaves: typeof m.totalWaves === 'number' && Number.isFinite(m.totalWaves) ? Math.max(1, Math.floor(m.totalWaves)) : 10,
    totalKills: typeof m.totalKills === 'number' && Number.isFinite(m.totalKills) ? Math.max(0, Math.floor(m.totalKills)) : 0,
    totalDamage: typeof m.totalDamage === 'number' && Number.isFinite(m.totalDamage) ? Math.max(0, m.totalDamage) : 0,
    airSupportTimers: {
      a10: typeof timersRaw.a10 === 'number' && Number.isFinite(timersRaw.a10) ? Math.max(0, timersRaw.a10) : 0,
      hellfire: typeof timersRaw.hellfire === 'number' && Number.isFinite(timersRaw.hellfire) ? Math.max(0, timersRaw.hellfire) : 0,
      b52: typeof timersRaw.b52 === 'number' && Number.isFinite(timersRaw.b52) ? Math.max(0, timersRaw.b52) : 0
    },
    towers
  };
}

function migrateToLatest(raw: Record<string, unknown>): Record<string, unknown> {
  const ver = typeof raw.version === 'number' ? Math.floor(raw.version) : 1;
  const copy = { ...raw };
  if (ver < 2) {
    copy.selectedWorld = 1;
    copy.selectedStage = 1;
  }
  if (ver < 3) {
    copy.lastSavedAt = Date.now();
    copy.activeMission = null;
  }
  copy.version = CURRENT_VERSION;
  return copy;
}

export function validateAndSanitizeSave(parsed: unknown): SaveState | null {
  if (!parsed || typeof parsed !== 'object') return null;
  let obj = parsed as Record<string, unknown>;
  const ver = typeof obj.version === 'number' ? Math.floor(obj.version) : 1;

  if (ver > CURRENT_VERSION) {
    return null;
  }
  if (ver < CURRENT_VERSION) {
    obj = migrateToLatest(obj);
  }

  const def = createDefaultState();
  const unlockedTowers = new Set<string>(STARTER_TOWERS);
  if (Array.isArray(obj.unlockedTowers)) {
    for (const t of obj.unlockedTowers) {
      if (typeof t === 'string') unlockedTowers.add(t);
    }
  }

  const unlockedSupports = new Set<string>(STARTER_SUPPORTS);
  if (Array.isArray(obj.unlockedSupports)) {
    for (const s of obj.unlockedSupports) {
      if (typeof s === 'string') unlockedSupports.add(s);
    }
  }

  const unlockedStages = new Set<string>(['1-1', '4-1']);
  if (Array.isArray(obj.unlockedStages)) {
    for (const st of obj.unlockedStages) {
      if (typeof st === 'string' && /^\d+-\d+$/.test(st)) unlockedStages.add(st);
    }
  }

  const completedStages: Record<string, number> = {};
  if (obj.completedStages && typeof obj.completedStages === 'object') {
    for (const [k, v] of Object.entries(obj.completedStages as Record<string, unknown>)) {
      if (/^\d+-\d+$/.test(k) && typeof v === 'number' && Number.isFinite(v) && v > 0) {
        completedStages[k] = Math.floor(v);
      }
    }
  }

  const towerTech: Record<string, TowerTechLevels> = {};
  if (obj.towerTech && typeof obj.towerTech === 'object') {
    for (const [tid, levels] of Object.entries(obj.towerTech as Record<string, unknown>)) {
      if (levels && typeof levels === 'object') {
        const lv = levels as Record<string, unknown>;
        towerTech[tid] = {
          damage: clampTechLevel(lv.damage),
          fireRate: clampTechLevel(lv.fireRate),
          hp: clampTechLevel(lv.hp),
          cost: clampTechLevel(lv.cost)
        };
      }
    }
  }

  const selectedWorld =
    typeof obj.selectedWorld === 'number' && obj.selectedWorld >= 1 && obj.selectedWorld <= 4
      ? Math.floor(obj.selectedWorld)
      : def.selectedWorld;
  const selectedStage =
    typeof obj.selectedStage === 'number' && obj.selectedStage >= 1 && obj.selectedStage <= 5
      ? Math.floor(obj.selectedStage)
      : def.selectedStage;

  return {
    version: CURRENT_VERSION,
    warBonds:
      typeof obj.warBonds === 'number' && Number.isFinite(obj.warBonds)
        ? Math.max(0, Math.floor(obj.warBonds))
        : def.warBonds,
    unlockedTowers: Array.from(unlockedTowers),
    unlockedSupports: Array.from(unlockedSupports),
    towerTech,
    completedStages,
    unlockedStages: Array.from(unlockedStages),
    selectedWorld,
    selectedStage,
    lastSavedAt:
      typeof obj.lastSavedAt === 'number' && Number.isFinite(obj.lastSavedAt)
        ? obj.lastSavedAt
        : Date.now(),
    activeMission: sanitizeActiveMission(obj.activeMission)
  };
}

function deepCloneState(s: SaveState): SaveState {
  return JSON.parse(JSON.stringify(s)) as SaveState;
}

class IndexedDBMirror {
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  private open(): Promise<IDBDatabase | null> {
    if (typeof indexedDB === 'undefined') return Promise.resolve(null);
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(IDB_NAME, IDB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
    return this.dbPromise;
  }

  async put(key: string, value: unknown): Promise<void> {
    const db = await this.open();
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
    } catch {
      // Ignore IDB write error
    }
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const db = await this.open();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const req = tx.objectStore(IDB_STORE).get(key);
        req.onsuccess = () => resolve((req.result as T) ?? null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async remove(key: string): Promise<void> {
    const db = await this.open();
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(key);
    } catch {
      // Ignore
    }
  }
}

export class SaveManager {
  private state: SaveState;
  private idb = new IndexedDBMirror();
  private hadLocalStorageSave = false;

  constructor() {
    this.state = this.load();
  }

  private load(): SaveState {
    if (typeof localStorage === 'undefined') {
      return createDefaultState();
    }

    for (const key of [SAVE_KEY, BACKUP_KEY, LEGACY_V2_KEY, LEGACY_V2_BAK_KEY, LEGACY_V1_KEY]) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const validated = validateAndSanitizeSave(parsed);
        if (validated) {
          this.hadLocalStorageSave = true;
          return validated;
        }
      } catch {
        // Fallback to backup or legacy keys
      }
    }

    return createDefaultState();
  }

  /**
   * Synchronizes from IndexedDB in case the OS/WebView wiped localStorage while preserving IndexedDB.
   * Returns true if a more complete/newer IndexedDB save was restored.
   */
  async syncFromIndexedDB(): Promise<boolean> {
    for (const key of ['primary', 'backup']) {
      const raw = await this.idb.get(key);
      if (!raw) continue;
      const validated = validateAndSanitizeSave(raw);
      if (!validated) continue;

      if (!this.hadLocalStorageSave || validated.lastSavedAt > this.state.lastSavedAt) {
        this.state = validated;
        this.writeLocalOnly();
        return true;
      }
    }
    return false;
  }

  private writeLocalOnly() {
    if (typeof localStorage === 'undefined') return;
    try {
      const prev = localStorage.getItem(SAVE_KEY);
      if (prev) {
        localStorage.setItem(BACKUP_KEY, prev);
      }
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }

  private save() {
    this.state.lastSavedAt = Date.now();
    this.writeLocalOnly();
    void this.idb.put('backup', deepCloneState(this.state));
    void this.idb.put('primary', deepCloneState(this.state));
  }

  getState(): SaveState {
    return this.state;
  }

  getLastSavedAt(): number {
    return this.state.lastSavedAt;
  }

  getWarBonds(): number {
    return this.state.warBonds;
  }

  addWarBonds(amount: number): number {
    if (!Number.isFinite(amount) || amount <= 0) return this.state.warBonds;
    this.state.warBonds += Math.floor(amount);
    this.save();
    return this.state.warBonds;
  }

  isTowerUnlocked(towerId: string): boolean {
    return this.state.unlockedTowers.includes(towerId);
  }

  unlockTower(towerId: string, costWB: number): boolean {
    if (this.isTowerUnlocked(towerId)) return true;
    if (this.state.warBonds < costWB) return false;
    this.state.warBonds -= costWB;
    this.state.unlockedTowers.push(towerId);
    this.save();
    return true;
  }

  isSupportUnlocked(supportId: string): boolean {
    return this.state.unlockedSupports.includes(supportId);
  }

  unlockSupport(supportId: string, costWB: number): boolean {
    if (this.isSupportUnlocked(supportId)) return true;
    if (this.state.warBonds < costWB) return false;
    this.state.warBonds -= costWB;
    this.state.unlockedSupports.push(supportId);
    this.save();
    return true;
  }

  getTowerTech(towerId: string): TowerTechLevels {
    const existing = this.state.towerTech[towerId];
    if (existing) return existing;
    return { damage: 0, fireRate: 0, hp: 0, cost: 0 };
  }

  getUpgradeTechCost(currentLevel: number): number {
    return 40 + currentLevel * 35;
  }

  upgradeTowerTech(towerId: string, stat: TechStatKey, explicitCostWB?: number): boolean {
    if (!this.isTowerUnlocked(towerId)) return false;
    const current = { ...this.getTowerTech(towerId) };
    const lv = current[stat];
    if (lv >= MAX_TECH_LEVEL) return false;
    const costWB = explicitCostWB ?? this.getUpgradeTechCost(lv);
    if (this.state.warBonds < costWB) return false;

    this.state.warBonds -= costWB;
    current[stat] = lv + 1;
    this.state.towerTech[towerId] = current;
    this.save();
    return true;
  }

  getTechMultipliers(towerId: string): TechMultipliers {
    const t = this.getTowerTech(towerId);
    return {
      damageMult: 1 + 0.1 * t.damage,
      fireRateMult: 1 + 0.08 * t.fireRate,
      hpMult: 1 + 0.2 * t.hp,
      costMult: 1 - 0.05 * t.cost
    };
  }

  getStageKey(worldId: number, stageId: number): string {
    return `${worldId}-${stageId}`;
  }

  isStageUnlocked(worldId: number, stageId: number): boolean {
    return this.state.unlockedStages.includes(this.getStageKey(worldId, stageId));
  }

  getStageWins(worldId: number, stageId: number): number {
    return this.state.completedStages[this.getStageKey(worldId, stageId)] || 0;
  }

  selectStage(worldId: number, stageId: number): boolean {
    if (!this.isStageUnlocked(worldId, stageId)) return false;
    this.state.selectedWorld = worldId;
    this.state.selectedStage = stageId;
    this.save();
    return true;
  }

  markStageCompleted(worldId: number, stageId: number, rewardWB: number): string | null {
    const key = this.getStageKey(worldId, stageId);
    this.state.completedStages[key] = (this.state.completedStages[key] || 0) + 1;
    this.state.warBonds += Math.max(0, Math.floor(rewardWB));

    let newlyUnlocked: string | null = null;
    if (stageId < 5) {
      newlyUnlocked = this.getStageKey(worldId, stageId + 1);
    } else if (worldId < 4) {
      newlyUnlocked = this.getStageKey(worldId + 1, 1);
    }

    if (newlyUnlocked && !this.state.unlockedStages.includes(newlyUnlocked)) {
      this.state.unlockedStages.push(newlyUnlocked);
    }

    this.state.activeMission = null;
    this.save();
    return newlyUnlocked;
  }

  unlockAllCampaign() {
    for (let w = 1; w <= 4; w++) {
      for (let s = 1; s <= 5; s++) {
        const key = this.getStageKey(w, s);
        if (!this.state.unlockedStages.includes(key)) {
          this.state.unlockedStages.push(key);
        }
      }
    }
    this.save();
  }

  // === ACTIVE BATTLEFIELD AUTOSAVE SNAPSHOT ===
  saveActiveMission(snapshot: ActiveMissionSnapshot | null): void {
    this.state.activeMission = snapshot ? sanitizeActiveMission(snapshot) : null;
    this.save();
  }

  getActiveMission(): ActiveMissionSnapshot | null {
    return this.state.activeMission;
  }

  clearActiveMission(): void {
    if (this.state.activeMission !== null) {
      this.state.activeMission = null;
      this.save();
    }
  }

  // === MANUAL SAVE SLOTS (1..3) ===
  saveToSlot(slotId: 1 | 2 | 3): SaveSlotSummary {
    const m = this.state.activeMission;
    const label = m
      ? `Fase ${m.worldId}-${m.stageId} • Onda ${m.completedWave}/${m.totalWaves} • ${m.towers.length} Torres • ${this.state.warBonds} WB$`
      : `Campanha • Fase ${this.state.selectedWorld}-${this.state.selectedStage} • ${this.state.warBonds} WB$`;

    const summary: SaveSlotSummary = {
      slotId,
      savedAt: Date.now(),
      label,
      state: deepCloneState(this.state)
    };

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`${SLOT_KEY_PREFIX}${slotId}`, JSON.stringify(summary));
      } catch {
        // Ignore quota errors
      }
    }
    void this.idb.put(`slot_${slotId}`, summary);
    return summary;
  }

  loadFromSlot(slotId: 1 | 2 | 3): boolean {
    if (typeof localStorage === 'undefined') return false;
    try {
      const raw = localStorage.getItem(`${SLOT_KEY_PREFIX}${slotId}`);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as Partial<SaveSlotSummary>;
      const validated = validateAndSanitizeSave(parsed?.state);
      if (!validated) return false;
      this.state = validated;
      this.save();
      return true;
    } catch {
      return false;
    }
  }

  deleteSlot(slotId: 1 | 2 | 3): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(`${SLOT_KEY_PREFIX}${slotId}`);
      } catch {
        // Ignore
      }
    }
    void this.idb.remove(`slot_${slotId}`);
  }

  listSlots(): Array<SaveSlotSummary | null> {
    const res: Array<SaveSlotSummary | null> = [];
    for (const slotId of [1, 2, 3] as const) {
      let item: SaveSlotSummary | null = null;
      if (typeof localStorage !== 'undefined') {
        try {
          const raw = localStorage.getItem(`${SLOT_KEY_PREFIX}${slotId}`);
          if (raw) {
            const parsed = JSON.parse(raw) as Partial<SaveSlotSummary>;
            const validated = validateAndSanitizeSave(parsed?.state);
            if (validated) {
              item = {
                slotId,
                savedAt: typeof parsed.savedAt === 'number' ? parsed.savedAt : validated.lastSavedAt,
                label: typeof parsed.label === 'string' ? parsed.label : `Slot ${slotId}`,
                state: validated
              };
            }
          }
        } catch {
          item = null;
        }
      }
      res.push(item);
    }
    return res;
  }

  // === FILE EXPORT / IMPORT (.JSON PORTABLE BETWEEN BROWSER & WINDOWS .EXE/.MSI) ===
  exportSaveJson(): string {
    const payload = {
      app: 'DEFCON_FRONTLINE',
      exportedAt: new Date().toISOString(),
      schemaVersion: CURRENT_VERSION,
      state: deepCloneState(this.state),
      slots: this.listSlots()
    };
    return JSON.stringify(payload, null, 2);
  }

  importSaveJson(jsonString: string): { ok: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { ok: false, error: 'Arquivo JSON inválido.' };
      }

      const obj = parsed as Record<string, unknown>;
      // Accept either wrapped export payload or raw SaveState JSON
      const candidateState = obj.app === 'DEFCON_FRONTLINE' ? obj.state : obj;
      const validated = validateAndSanitizeSave(candidateState);
      if (!validated) {
        return { ok: false, error: 'Estrutura de save incompatível ou de versão mais recente.' };
      }

      this.state = validated;
      this.save();

      if (Array.isArray(obj.slots)) {
        for (const sl of obj.slots) {
          if (!sl || typeof sl !== 'object') continue;
          const sObj = sl as Partial<SaveSlotSummary>;
          if (sObj.slotId === 1 || sObj.slotId === 2 || sObj.slotId === 3) {
            const slState = validateAndSanitizeSave(sObj.state);
            if (slState) {
              const summary: SaveSlotSummary = {
                slotId: sObj.slotId,
                savedAt: typeof sObj.savedAt === 'number' ? sObj.savedAt : Date.now(),
                label: typeof sObj.label === 'string' ? sObj.label : `Slot ${sObj.slotId}`,
                state: slState
              };
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem(`${SLOT_KEY_PREFIX}${sObj.slotId}`, JSON.stringify(summary));
              }
              void this.idb.put(`slot_${sObj.slotId}`, summary);
            }
          }
        }
      }

      return { ok: true };
    } catch {
      return { ok: false, error: 'Falha ao ler arquivo JSON de save.' };
    }
  }

  resetSave() {
    this.state = createDefaultState();
    this.save();
  }
}

export const saveManager = new SaveManager();
