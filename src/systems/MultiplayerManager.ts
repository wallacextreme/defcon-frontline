import { bus } from '../core/EventBus.js';
import { TOWER_DEFINITIONS } from '../data/towers.js';

export const SQUAD_COLORS = ['#22c55e', '#38bdf8', '#facc15', '#c084fc'] as const;
export const SQUAD_ROLES = ['HOST', 'ALPHA', 'BRAVO', 'CHARLIE'] as const;
export const MAX_PLAYERS = 4;
export const MAX_DECK_SIZE = 6;
export const DEFAULT_COOP_DECK = ['ballista', 'm2_bunker', 'abrams_pit', 'phalanx', 'cryo_tower', 'ew_crew'];
export const RECONNECT_GRACE_MS = 20000;
export const HOST_WATCHDOG_MS = 8000;
export const PING_COOLDOWN_MS = 1500;
export const MAX_PAYLOAD_BYTES = 65536;
export const MAX_COMMANDS_PER_SEC = 25;

const CALLSIGN_STORAGE_KEY = 'defcon_frontline_callsign';
const DECK_STORAGE_KEY = 'defcon_frontline_coop_deck';
const SESSION_TOKEN_STORAGE_KEY = 'defcon_coop_session_token';
const ICE_CONFIG_STORAGE_KEY = 'defcon_coop_ice_config';
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export interface CustomIceConfig {
  urls: string;
  username?: string;
  credential?: string;
}

export function sanitizeCallsign(raw: string, fallback = 'CMDR-01'): string {
  const withoutTags = String(raw || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '');
  const clean = withoutTags
    .toUpperCase()
    .replace(/[^A-Z0-9\-_ ]/g, '')
    .trim()
    .slice(0, 16);
  return clean || fallback;
}

export function getMaxTowersPerPlayer(playerCount: number): number {
  const count = Math.max(1, Math.min(MAX_PLAYERS, Math.floor(playerCount || 1)));
  if (count === 1) return 30;
  if (count === 2) return 20;
  if (count === 3) return 15;
  return 12;
}

export function getCoopEnemyScale(playerCount: number): number {
  const count = Math.max(1, Math.min(MAX_PLAYERS, Math.floor(playerCount || 1)));
  if (count === 1) return 1.0;
  if (count === 2) return 1.45;
  if (count === 3) return 1.85;
  return 2.25;
}

export function getCoopFobMaxHp(playerCount: number): number {
  const count = Math.max(1, Math.min(MAX_PLAYERS, Math.floor(playerCount || 1)));
  return 20 + (count - 1) * 5;
}

export function getRequiredWaveVotes(playerCount: number): number {
  const count = Math.max(1, Math.min(MAX_PLAYERS, Math.floor(playerCount || 1)));
  if (count <= 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 2;
  return 3;
}

export function normalizeRoomCode(raw: string): string {
  const cleaned = String(raw || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  if (!cleaned) return '';
  const body = cleaned.startsWith('DFC') ? cleaned.slice(3, 7) : cleaned.slice(0, 4);
  if (body.length < 4) return '';
  return `DFC-${body}`;
}

export function roomCodeToPeerId(roomCode: string): string {
  const norm = normalizeRoomCode(roomCode);
  const body = norm.replace('DFC-', '');
  return `defcon-frontline-coop-${body}`;
}

export function validateDeckLoadout(loadout: string[], unlockedIds?: Set<string> | null): string[] {
  const result: string[] = [];
  if (Array.isArray(loadout)) {
    for (const id of loadout) {
      if (typeof id !== 'string' || result.includes(id)) continue;
      if (!(TOWER_DEFINITIONS as any)[id]) continue;
      if (unlockedIds && !unlockedIds.has(id)) continue;
      result.push(id);
      if (result.length >= MAX_DECK_SIZE) break;
    }
  }
  if (result.length === 0) {
    return [...DEFAULT_COOP_DECK];
  }
  return result;
}

/**
 * Deterministic proportional reward distribution based on damage dealt per commander.
 * Guarantees integer payouts sum strictly to totalReward with no cent loss/duplication.
 * Optionally computes +35% squad assist payouts on bosses/sub-bosses.
 */
export function distributeKillReward(
  totalReward: number,
  damageByPlayer: Record<string, number> | null | undefined,
  killerId: string,
  allPlayerIds: string[] = [],
  isBossOrSubBoss = false
): Record<string, number> & { assist?: Record<string, number> } {
  const total = Math.max(0, Math.round(totalReward || 0));
  const payouts: Record<string, number> & { assist?: Record<string, number> } = {};

  if (total === 0) return payouts;

  const contributors: Array<{ playerId: string; dmg: number }> = [];
  let totalDmg = 0;

  if (damageByPlayer && typeof damageByPlayer === 'object') {
    for (const [playerId, rawDmg] of Object.entries(damageByPlayer)) {
      if (typeof rawDmg === 'number' && Number.isFinite(rawDmg) && rawDmg > 0) {
        contributors.push({ playerId, dmg: rawDmg });
        totalDmg += rawDmg;
      }
    }
  }

  if (contributors.length === 0 || totalDmg <= 0) {
    if (killerId) {
      payouts[killerId] = total;
    }
  } else {
    const shares = contributors.map((c) => {
      const exact = (total * c.dmg) / totalDmg;
      const floorVal = Math.floor(exact);
      return {
        playerId: c.playerId,
        dmg: c.dmg,
        floorVal,
        frac: exact - floorVal
      };
    });

    let allocated = 0;
    for (const s of shares) {
      payouts[s.playerId] = s.floorVal;
      allocated += s.floorVal;
    }

    let remainder = total - allocated;
    if (remainder > 0) {
      // Tie-break deterministically: largest damage contributor, then largest fraction, then killer
      shares.sort((a, b) => {
        if (Math.abs(b.dmg - a.dmg) > 1e-6) return b.dmg - a.dmg;
        if (Math.abs(b.frac - a.frac) > 1e-6) return b.frac - a.frac;
        if (a.playerId === killerId) return -1;
        if (b.playerId === killerId) return 1;
        return a.playerId.localeCompare(b.playerId);
      });
      let idx = 0;
      while (remainder > 0) {
        const target = shares[idx % shares.length];
        payouts[target.playerId] += 1;
        remainder -= 1;
        idx += 1;
      }
    }
  }

  if (isBossOrSubBoss && allPlayerIds.length > 1) {
    const assistBonus = Math.max(4, Math.round(total * 0.35));
    const assistMap: Record<string, number> = {};
    for (const pid of allPlayerIds) {
      if (pid && pid !== killerId) {
        assistMap[pid] = assistBonus;
      }
    }
    if (Object.keys(assistMap).length > 0) {
      Object.defineProperty(payouts, 'assist', {
        value: assistMap,
        enumerable: false,
        configurable: true
      });
    }
  }

  return payouts;
}

function containsNonFiniteNumber(val: any, depth = 0): boolean {
  if (depth > 8 || val === null || val === undefined) return false;
  if (typeof val === 'number') return !Number.isFinite(val);
  if (Array.isArray(val)) {
    return val.some((item) => containsNonFiniteNumber(item, depth + 1));
  }
  if (typeof val === 'object') {
    return Object.values(val).some((v) => containsNonFiniteNumber(v, depth + 1));
  }
  return false;
}

export type PingType = 'AA' | 'BOSS' | 'REPAIR' | 'CASH';
export type PlayerConnectionStatus = 'ONLINE' | 'RECONNECTING' | 'DISCONNECTED';

export interface CombatNetEvent {
  kind: 'FIRE' | 'EXPLODE' | 'TOWER_HIT' | 'EMP_PULSE' | 'AIR_STRIKE';
  towerId?: string;
  targetId?: number;
  targetX?: number;
  targetZ?: number;
  wx?: number;
  wy?: number;
  wz?: number;
  scale?: number;
  color?: number;
  damageType?: string;
  ownerId?: string;
}

export interface CoopPlayer {
  peerId: string;
  sessionToken?: string;
  slotIndex: number;
  callsign: string;
  color: string;
  roleLabel: string;
  isHost: boolean;
  ready: boolean;
  loadout: string[];
  budget: number;
  towerCount: number;
  maxTowers: number;
  pingMs: number;
  connected: boolean;
  status: PlayerConnectionStatus;
  reconnecting?: boolean;
  disconnectDeadline?: number;
}

export interface CoopLobbyState {
  active: boolean;
  roomCode: string;
  hostPeerId: string;
  selectedWorld: number;
  selectedStage: number;
  inMatch: boolean;
  players: CoopPlayer[];
  waveVotes: string[];
  requiredVotes: number;
  waveVoteTimer: number;
  hostSignalLost: boolean;
  syncOk: boolean;
  statusText: string;
}

export interface NetEnvelope {
  msgId: string;
  roomCode: string;
  senderId: string;
  type: string;
  payload?: any;
  targetId?: string;
  sequence?: number;
  ts: number;
}

export type TransportMode = 'none' | 'host' | 'client';

export class MultiplayerManager {
  private static inProcChannels = new Map<string, Set<MultiplayerManager>>();

  readonly localPeerId: string;
  readonly sessionToken: string;

  private mode: TransportMode = 'none';
  private roomCode = '';
  private hostPeerId = '';
  private localCallsign = 'CMDR-01';
  private localLoadout: string[] = [...DEFAULT_COOP_DECK];
  private customIceConfig: CustomIceConfig | null = null;

  private players: CoopPlayer[] = [];
  private selectedWorld = 1;
  private selectedStage = 1;
  private inMatch = false;
  private waveVotes = new Set<string>();
  private waveVoteTimer = 0;
  private statusText = 'SINGLEPLAYER OFFLINE';

  private snapshotSeq = 0;
  private lastAppliedSequence = 0;
  public droppedStaleSnapshots = 0;
  private lastHostPacketAt = 0;
  private hostSignalLost = false;
  private combatEventQueue: CombatNetEvent[] = [];

  private pingCooldowns = new Map<string, number>();
  private cmdRateWindows = new Map<string, number[]>();
  private reconnectTimers = new Map<string, any>();

  private bc: BroadcastChannel | null = null;
  private peer: any = null;
  private hostConns = new Map<string, any>();
  private clientHostConn: any = null;
  private pendingJoinResolve: ((res: { ok: boolean; error?: string; lobby?: CoopLobbyState }) => void) | null = null;
  private pendingJoinTimer: any = null;
  private pingTimer: any = null;
  private watchdogTimer: any = null;
  private lastCursorSentAt = 0;

  private seenMsgIds: string[] = [];
  private seenMsgSet = new Set<string>();

  private cmdHandlers = new Set<(type: string, payload: any, senderId: string) => void>();
  private snapshotHandlers = new Set<(snapshot: any) => void>();
  private combatEventHandlers = new Set<(events: CombatNetEvent[]) => void>();
  private resyncHandlers = new Set<(senderId: string) => void>();
  private commandRejectHandlers = new Set<(info: { commandType: string; reason: string }) => void>();
  private ownershipRebindHandlers = new Set<(data: { oldPeerId: string; newPeerId: string; callsign: string }) => void>();
  private cursorHandlers = new Set<(cursor: { playerId: string; callsign: string; color: string; col: number; row: number; selectedTowerType: string | null }) => void>();
  private pingHandlers = new Set<(ping: { playerId: string; callsign: string; color: string; pingType: PingType; col: number; row: number; worldX: number; worldZ: number }) => void>();
  private radioHandlers = new Set<(msg: { text: string; level: string; wave?: number }) => void>();
  private startMatchHandlers = new Set<(data: { worldId: number; stageId: number; coopScale: number; fobMaxHp: number }) => void>();

  constructor(customId?: string, customSessionToken?: string) {
    this.localPeerId = customId || `cmdr-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36).slice(-4)}`;
    this.sessionToken = customSessionToken || this.loadOrCreateSessionToken();
    this.localCallsign = this.loadSavedCallsign();
    this.localLoadout = this.loadSavedDeck();
    this.customIceConfig = this.loadCustomIceConfig();
  }

  private loadOrCreateSessionToken(): string {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const existing = sessionStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
        if (existing && existing.length >= 8) return existing;
        const created = `tok-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
        sessionStorage.setItem(SESSION_TOKEN_STORAGE_KEY, created);
        return created;
      }
    } catch {
      // Ignore storage access failure in headless/sandbox environments
    }
    return `tok-${this.localPeerId}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private loadSavedCallsign(): string {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(CALLSIGN_STORAGE_KEY);
        if (stored && stored.trim().length > 0) {
          return this.sanitizeCallsign(stored);
        }
      }
    } catch {
      // Ignore storage access failure
    }
    return `CMDR-${this.localPeerId.slice(-4).toUpperCase()}`;
  }

  private loadSavedDeck(): string[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(DECK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return validateDeckLoadout(parsed);
        }
      }
    } catch {
      // Ignore parse failure
    }
    return [...DEFAULT_COOP_DECK];
  }

  private loadCustomIceConfig(): CustomIceConfig | null {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(ICE_CONFIG_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed.urls === 'string' && parsed.urls.trim()) {
            return {
              urls: parsed.urls.trim(),
              username: typeof parsed.username === 'string' ? parsed.username.trim() : undefined,
              credential: typeof parsed.credential === 'string' ? parsed.credential.trim() : undefined
            };
          }
        }
      }
    } catch {
      // Ignore parse error
    }
    return null;
  }

  setCustomIceConfig(cfg: CustomIceConfig | null) {
    if (cfg && typeof cfg.urls === 'string' && cfg.urls.trim()) {
      this.customIceConfig = {
        urls: cfg.urls.trim(),
        username: cfg.username?.trim() || undefined,
        credential: cfg.credential?.trim() || undefined
      };
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(ICE_CONFIG_STORAGE_KEY, JSON.stringify(this.customIceConfig));
        }
      } catch {
        // Ignore storage error
      }
    } else {
      this.customIceConfig = null;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(ICE_CONFIG_STORAGE_KEY);
        }
      } catch {
        // Ignore storage error
      }
    }
  }

  getCustomIceConfig(): CustomIceConfig | null {
    return this.customIceConfig ? { ...this.customIceConfig } : null;
  }

  private buildIceServers(): any[] {
    const servers: any[] = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ];
    if (this.customIceConfig?.urls) {
      const entry: any = { urls: this.customIceConfig.urls };
      if (this.customIceConfig.username) entry.username = this.customIceConfig.username;
      if (this.customIceConfig.credential) entry.credential = this.customIceConfig.credential;
      servers.push(entry);
    }
    return servers;
  }

  private sanitizeCallsign(name: string): string {
    return sanitizeCallsign(name, `CMDR-${this.localPeerId.slice(-4).toUpperCase()}`);
  }

  getCallsign(): string {
    return this.localCallsign;
  }

  getLoadout(): string[] {
    return [...this.localLoadout];
  }

  getMode(): TransportMode {
    return this.mode;
  }

  isActive(): boolean {
    return this.mode !== 'none';
  }

  isHost(): boolean {
    return this.mode === 'host';
  }

  isClient(): boolean {
    return this.mode === 'client';
  }

  isInMatch(): boolean {
    return this.mode !== 'none' && this.inMatch;
  }

  isHostSignalLost(): boolean {
    return this.mode === 'client' && this.hostSignalLost;
  }

  getLastAppliedSequence(): number {
    return this.lastAppliedSequence;
  }

  getCurrentSequence(): number {
    return this.snapshotSeq;
  }

  getRoomCode(): string {
    return this.roomCode;
  }

  getLocalPlayer(): CoopPlayer | null {
    return this.players.find((p) => p.peerId === this.localPeerId) || null;
  }

  getPlayer(peerId: string): CoopPlayer | null {
    return this.players.find((p) => p.peerId === peerId) || null;
  }

  getPlayerBySessionToken(token: string): CoopPlayer | null {
    if (!token) return null;
    return this.players.find((p) => p.sessionToken === token) || null;
  }

  getPlayers(): CoopPlayer[] {
    return this.players;
  }

  getConnectedPlayerCount(): number {
    if (this.mode === 'none') return 1;
    // Count both ONLINE and temporarily RECONNECTING slots so enemy scale / caps remain stable over brief blips
    const active = this.players.filter((p) => p.status !== 'DISCONNECTED').length;
    return Math.max(1, active || this.players.length || 1);
  }

  getEnemyHpScale(): number {
    if (this.mode === 'none') return 1.0;
    return getCoopEnemyScale(this.getConnectedPlayerCount());
  }

  getFobMaxHp(): number {
    if (this.mode === 'none') return 20;
    return getCoopFobMaxHp(this.getConnectedPlayerCount());
  }

  getLocalMaxTowers(): number {
    return getMaxTowersPerPlayer(this.getConnectedPlayerCount());
  }

  getLobbyState(): CoopLobbyState {
    const count = this.getConnectedPlayerCount();
    return {
      active: this.mode !== 'none',
      roomCode: this.roomCode,
      hostPeerId: this.hostPeerId,
      selectedWorld: this.selectedWorld,
      selectedStage: this.selectedStage,
      inMatch: this.inMatch,
      players: this.players.map((p) => ({ ...p, loadout: [...p.loadout] })),
      waveVotes: [...this.waveVotes],
      requiredVotes: getRequiredWaveVotes(count),
      waveVoteTimer: Math.max(0, Math.ceil(this.waveVoteTimer)),
      hostSignalLost: this.hostSignalLost,
      syncOk: !this.hostSignalLost,
      statusText: this.statusText
    };
  }

  emitLobbyUpdate() {
    const state = this.getLobbyState();
    bus.emit('coop:lobbyState', state);
  }

  onHostCommand(fn: (type: string, payload: any, senderId: string) => void): () => void {
    this.cmdHandlers.add(fn);
    return () => this.cmdHandlers.delete(fn);
  }

  onSnapshot(fn: (snapshot: any) => void): () => void {
    this.snapshotHandlers.add(fn);
    return () => this.snapshotHandlers.delete(fn);
  }

  onCombatEvents(fn: (events: CombatNetEvent[]) => void): () => void {
    this.combatEventHandlers.add(fn);
    return () => this.combatEventHandlers.delete(fn);
  }

  onResyncRequest(fn: (senderId: string) => void): () => void {
    this.resyncHandlers.add(fn);
    return () => this.resyncHandlers.delete(fn);
  }

  onCommandReject(fn: (info: { commandType: string; reason: string }) => void): () => void {
    this.commandRejectHandlers.add(fn);
    return () => this.commandRejectHandlers.delete(fn);
  }

  onOwnershipRebind(fn: (data: { oldPeerId: string; newPeerId: string; callsign: string }) => void): () => void {
    this.ownershipRebindHandlers.add(fn);
    return () => this.ownershipRebindHandlers.delete(fn);
  }

  onAllyCursor(fn: (cursor: any) => void): () => void {
    this.cursorHandlers.add(fn);
    return () => this.cursorHandlers.delete(fn);
  }

  onTacticalPing(fn: (ping: any) => void): () => void {
    this.pingHandlers.add(fn);
    return () => this.pingHandlers.delete(fn);
  }

  onRemoteRadio(fn: (msg: { text: string; level: string; wave?: number }) => void): () => void {
    this.radioHandlers.add(fn);
    return () => this.radioHandlers.delete(fn);
  }

  onStartMatch(fn: (data: { worldId: number; stageId: number; coopScale: number; fobMaxHp: number }) => void): () => void {
    this.startMatchHandlers.add(fn);
    return () => this.startMatchHandlers.delete(fn);
  }

  // === OWNERSHIP, SECURITY & VALIDATION ===

  canModifyTower(towerOwnerId: string | undefined | null, actorPeerId = this.localPeerId): boolean {
    if (this.mode === 'none') return true;
    if (!towerOwnerId || towerOwnerId === actorPeerId) return true;
    // Host ONLY inherits control once owner has explicitly left or RECONNECTING grace expired (DISCONNECTED)
    if (actorPeerId === this.hostPeerId) {
      const owner = this.getPlayer(towerOwnerId);
      if (!owner || owner.status === 'DISCONNECTED') return true;
    }
    return false;
  }

  canRepairTower(actorPeerId = this.localPeerId): boolean {
    if (this.mode === 'none') return true;
    return this.players.some((p) => p.peerId === actorPeerId && p.status === 'ONLINE' && p.connected);
  }

  validateDonation(fromPeerId: string, toPeerId: string, amount: number): { ok: boolean; error?: string } {
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, error: 'Valor de doação inválido.' };
    }
    const sender = this.getPlayer(fromPeerId);
    const receiver = this.getPlayer(toPeerId);
    if (!sender || !receiver) {
      return { ok: false, error: 'Comandante não encontrado na sala.' };
    }
    if (sender.peerId === receiver.peerId) {
      return { ok: false, error: 'Não é possível doar para si mesmo.' };
    }
    if (!receiver.connected || receiver.status !== 'ONLINE') {
      return { ok: false, error: 'Comandante indisponível para receber suprimentos.' };
    }
    if (sender.budget < amount) {
      return { ok: false, error: `Saldo insuficiente ($${Math.floor(sender.budget)} disponíveis).` };
    }
    return { ok: true };
  }

  validateIncomingCommand(
    type: string,
    payload: any,
    senderId: string,
    nowMs = Date.now()
  ): { ok: boolean; reason?: string } {
    try {
      const serialized = JSON.stringify({ type, payload });
      if (serialized.length > MAX_PAYLOAD_BYTES) {
        return { ok: false, reason: 'Pacote acima do limite máximo de 64 KB.' };
      }
    } catch {
      return { ok: false, reason: 'Payload inválido ou malformado.' };
    }

    if (containsNonFiniteNumber(payload)) {
      return { ok: false, reason: 'Valores numéricos inválidos (NaN/Infinity).' };
    }

    // Per-player rate limiting (25 commands/sec max, excluding throttled cursor telemetry)
    if (type !== 'CMD_CURSOR_MOVE') {
      let win = this.cmdRateWindows.get(senderId);
      if (!win) {
        win = [];
        this.cmdRateWindows.set(senderId, win);
      }
      const cutoff = nowMs - 1000;
      while (win.length > 0 && win[0] < cutoff) win.shift();
      if (win.length >= MAX_COMMANDS_PER_SEC) {
        return { ok: false, reason: 'Limite de taxa de comandos excedido (anti-flood).' };
      }
      win.push(nowMs);
    }

    if (type === 'CMD_TACTICAL_PING') {
      const lastPingAt = this.pingCooldowns.get(senderId) || 0;
      if (nowMs - lastPingAt < PING_COOLDOWN_MS) {
        return { ok: false, reason: 'Cooldown de Ping Tático (1.5s) ativo.' };
      }
      this.pingCooldowns.set(senderId, nowMs);
    }

    if (type === 'CMD_BUILD_TOWER' || type === 'CMD_REBUILD_RUBBLE') {
      if (!payload || !Number.isInteger(payload.col) || !Number.isInteger(payload.row)) {
        return { ok: false, reason: 'Coordenadas do grid inválidas.' };
      }
      if (payload.col < 0 || payload.col >= 28 || payload.row < 0 || payload.row >= 16) {
        return { ok: false, reason: 'Coordenadas fora dos limites 28x16 do mapa.' };
      }
    }

    if (type === 'CMD_DONATE_CASH') {
      const amt = Number(payload?.amount);
      if (!Number.isFinite(amt) || amt <= 0) {
        return { ok: false, reason: 'Valor de doação deve ser positivo.' };
      }
    }

    if (type === 'CMD_SPECIALIZE_TOWER') {
      if (payload?.branch !== 'A' && payload?.branch !== 'B') {
        return { ok: false, reason: 'Ramo de especialização inválido.' };
      }
    }

    return { ok: true };
  }

  private recalculateMaxTowers() {
    const cap = getMaxTowersPerPlayer(this.getConnectedPlayerCount());
    for (const p of this.players) {
      p.maxTowers = cap;
    }
  }

  // === CALLSIGN & DECK ===

  setCallsign(rawName: string) {
    this.localCallsign = this.sanitizeCallsign(rawName);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CALLSIGN_STORAGE_KEY, this.localCallsign);
      }
    } catch {
      // Ignore storage write error
    }

    if (this.mode === 'host') {
      const me = this.getLocalPlayer();
      if (me) me.callsign = this.localCallsign;
      this.broadcastLobbyState();
    } else if (this.mode === 'client') {
      this.sendEnvelope('SET_CALLSIGN', { callsign: this.localCallsign });
    }
    this.emitLobbyUpdate();
  }

  setLoadout(towerIds: string[], unlockedIds?: Set<string> | null) {
    this.localLoadout = validateDeckLoadout(towerIds, unlockedIds);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(this.localLoadout));
      }
    } catch {
      // Ignore storage error
    }

    if (this.mode === 'host') {
      const me = this.getLocalPlayer();
      if (me) me.loadout = [...this.localLoadout];
      this.broadcastLobbyState();
    } else if (this.mode === 'client') {
      this.sendEnvelope('SET_LOADOUT', { loadout: this.localLoadout });
    }
    this.emitLobbyUpdate();
  }

  setReady(ready: boolean) {
    if (this.mode === 'host') {
      const me = this.getLocalPlayer();
      if (me) me.ready = !!ready;
      this.broadcastLobbyState();
    } else if (this.mode === 'client') {
      this.sendEnvelope('SET_READY', { ready: !!ready });
    }
  }

  selectStage(worldId: number, stageId: number) {
    if (this.mode === 'host') {
      this.selectedWorld = worldId;
      this.selectedStage = stageId;
      this.broadcastLobbyState();
    }
  }

  kickPlayer(targetPeerId: string): boolean {
    if (this.mode !== 'host' || this.inMatch) return false;
    if (!targetPeerId || targetPeerId === this.localPeerId) return false;
    const p = this.getPlayer(targetPeerId);
    if (!p) return false;

    this.cancelReconnectTimer(targetPeerId);
    this.players = this.players.filter((item) => item.peerId !== targetPeerId);
    this.waveVotes.delete(targetPeerId);
    this.recalculateMaxTowers();
    this.sendEnvelope('JOIN_REJECTED', { reason: 'Removido pelo Host da sala.' }, targetPeerId);
    this.broadcastLobbyState();
    this.broadcastRadio(`👢 ${p.callsign} foi removido do lobby pelo Host.`, 'warn');
    return true;
  }

  // === ROOM LIFECYCLE (HOST / CLIENT) ===

  private generateRoomCode(): string {
    let body = '';
    for (let i = 0; i < 4; i++) {
      body += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    return `DFC-${body}`;
  }

  createRoom(worldId = 1, stageId = 1, initialBudget = 750, forcedCode?: string): CoopLobbyState {
    this.leaveRoom(false);

    const code = forcedCode ? normalizeRoomCode(forcedCode) || this.generateRoomCode() : this.generateRoomCode();
    this.mode = 'host';
    this.roomCode = code;
    this.hostPeerId = this.localPeerId;
    this.selectedWorld = worldId;
    this.selectedStage = stageId;
    this.inMatch = false;
    this.waveVotes.clear();
    this.waveVoteTimer = 0;
    this.snapshotSeq = 0;
    this.combatEventQueue = [];
    this.hostSignalLost = false;
    this.statusText = `SALA ATIVA (${code}) — AGUARDANDO ESQUADRÃO`;

    this.players = [
      {
        peerId: this.localPeerId,
        sessionToken: this.sessionToken,
        slotIndex: 0,
        callsign: this.localCallsign,
        color: SQUAD_COLORS[0],
        roleLabel: SQUAD_ROLES[0],
        isHost: true,
        ready: true,
        loadout: [...this.localLoadout],
        budget: initialBudget,
        towerCount: 0,
        maxTowers: getMaxTowersPerPlayer(1),
        pingMs: 0,
        connected: true,
        status: 'ONLINE',
        reconnecting: false
      }
    ];

    this.openTransport(code, true);
    this.startHostPingLoop();
    this.emitLobbyUpdate();
    return this.getLobbyState();
  }

  async joinRoom(
    rawCode: string,
    opts: { timeoutMs?: number; allowPeerJs?: boolean } = {}
  ): Promise<{ ok: boolean; error?: string; lobby?: CoopLobbyState }> {
    const code = normalizeRoomCode(rawCode);
    if (!code) {
      return { ok: false, error: 'Código de sala inválido. Use formato DFC-XXXX.' };
    }

    this.leaveRoom(false);
    this.mode = 'client';
    this.roomCode = code;
    this.lastAppliedSequence = 0;
    this.droppedStaleSnapshots = 0;
    this.lastHostPacketAt = Date.now();
    this.hostSignalLost = false;
    this.statusText = `CONECTANDO A ${code}...`;
    this.emitLobbyUpdate();

    this.openTransport(code, false, opts.allowPeerJs !== false);
    this.startClientWatchdogLoop();

    return new Promise((resolve) => {
      const timeoutMs = opts.timeoutMs ?? 6000;
      this.pendingJoinResolve = resolve;

      const sendJoin = () => {
        this.sendEnvelope('JOIN_REQUEST', {
          peerId: this.localPeerId,
          sessionToken: this.sessionToken,
          callsign: this.localCallsign,
          loadout: this.localLoadout
        });
      };

      // Send immediately via BroadcastChannel / InProc
      sendJoin();
      const retryTimer = setTimeout(() => {
        if (this.pendingJoinResolve) sendJoin();
      }, 350);

      this.pendingJoinTimer = setTimeout(() => {
        clearTimeout(retryTimer);
        if (this.pendingJoinResolve) {
          const finish = this.pendingJoinResolve;
          this.pendingJoinResolve = null;
          this.leaveRoom(false);
          finish({
            ok: false,
            error: `Tempo esgotado ao conectar na sala ${code}. Verifique o código ou se o Host está ativo.`
          });
        }
      }, timeoutMs);
    });
  }

  leaveRoom(notify = true) {
    if (this.mode === 'none') return;

    if (notify) {
      try {
        this.sendEnvelope('PLAYER_LEAVE', {
          peerId: this.localPeerId,
          sessionToken: this.sessionToken,
          explicit: true
        });
      } catch {
        // Ignore teardown send errors
      }
    }

    if (this.pendingJoinTimer) {
      clearTimeout(this.pendingJoinTimer);
      this.pendingJoinTimer = null;
    }
    if (this.pendingJoinResolve) {
      const fn = this.pendingJoinResolve;
      this.pendingJoinResolve = null;
      fn({ ok: false, error: 'Conexão cancelada.' });
    }
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    if (this.watchdogTimer) {
      clearInterval(this.watchdogTimer);
      this.watchdogTimer = null;
    }
    for (const timer of this.reconnectTimers.values()) {
      clearTimeout(timer);
    }
    this.reconnectTimers.clear();
    this.pingCooldowns.clear();
    this.cmdRateWindows.clear();
    this.combatEventQueue = [];

    // Cleanup in-process transport
    if (this.roomCode) {
      const set = MultiplayerManager.inProcChannels.get(this.roomCode);
      if (set) {
        set.delete(this);
        if (set.size === 0) MultiplayerManager.inProcChannels.delete(this.roomCode);
      }
    }

    // Cleanup BroadcastChannel
    if (this.bc) {
      try {
        this.bc.close();
      } catch {
        // Ignore
      }
      this.bc = null;
    }

    // Cleanup PeerJS
    for (const conn of this.hostConns.values()) {
      try {
        conn.close();
      } catch {
        // Ignore
      }
    }
    this.hostConns.clear();
    if (this.clientHostConn) {
      try {
        this.clientHostConn.close();
      } catch {
        // Ignore
      }
      this.clientHostConn = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {
        // Ignore
      }
      this.peer = null;
    }

    this.mode = 'none';
    this.roomCode = '';
    this.hostPeerId = '';
    this.players = [];
    this.inMatch = false;
    this.waveVotes.clear();
    this.waveVoteTimer = 0;
    this.hostSignalLost = false;
    this.lastAppliedSequence = 0;
    this.snapshotSeq = 0;
    this.statusText = 'SINGLEPLAYER OFFLINE';
    this.emitLobbyUpdate();
  }

  // === RECONNECTION GRACE & WATCHDOG ===

  private cancelReconnectTimer(key: string) {
    const timer = this.reconnectTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(key);
    }
  }

  /**
   * Simulates/handles an unexpected drop during active match with a configurable grace window (default 20s).
   * Preserves slot, budget, and tower ownership until grace expires.
   */
  simulateUnexpectedDisconnect(peerId: string, graceMs = RECONNECT_GRACE_MS): boolean {
    if (this.mode !== 'host') return false;
    const p = this.getPlayer(peerId);
    if (!p || p.isHost) return false;

    if (!this.inMatch) {
      this.players = this.players.filter((item) => item.peerId !== peerId);
      this.recalculateMaxTowers();
      this.broadcastLobbyState();
      return true;
    }

    this.cancelReconnectTimer(p.peerId);
    p.connected = false;
    p.reconnecting = true;
    p.status = 'RECONNECTING';
    p.disconnectDeadline = Date.now() + graceMs;
    this.broadcastLobbyState();
    this.broadcastRadio(`⚠️ ${p.callsign} perdeu sinal — aguardando reconexão (${Math.round(graceMs / 1000)}s)...`, 'warn');

    const timer = setTimeout(() => {
      this.expireReconnectGrace(p.peerId);
    }, graceMs);
    this.reconnectTimers.set(p.peerId, timer);
    return true;
  }

  expireReconnectGrace(peerId: string): boolean {
    if (this.mode !== 'host') return false;
    const p = this.getPlayer(peerId);
    if (!p || p.status !== 'RECONNECTING') return false;

    this.cancelReconnectTimer(p.peerId);
    p.connected = false;
    p.reconnecting = false;
    p.ready = false;
    p.status = 'DISCONNECTED';
    p.disconnectDeadline = undefined;
    this.waveVotes.delete(p.peerId);
    this.recalculateMaxTowers();
    this.statusText = `ESQUADRÃO (${this.getConnectedPlayerCount()}/${MAX_PLAYERS}) — ${this.roomCode}`;
    this.broadcastLobbyState();
    this.broadcastRadio(`⏳ Tempo de reconexão de ${p.callsign} esgotado. Torres transferidas ao HOST.`, 'warn');
    return true;
  }

  checkHostWatchdog(nowMs = Date.now()): boolean {
    if (this.mode !== 'client' || !this.inMatch || this.lastHostPacketAt <= 0) return false;
    const elapsed = nowMs - this.lastHostPacketAt;
    if (elapsed > HOST_WATCHDOG_MS) {
      if (!this.hostSignalLost) {
        this.hostSignalLost = true;
        this.statusText = '⚠️ SINAL DO HOST PERDIDO — TENTANDO RECONEXÃO...';
        this.emitLobbyUpdate();
        bus.emit('coop:hostSignalLost', { lost: true, elapsedMs: elapsed });
        this.radioHandlers.forEach((fn) =>
          fn({ text: '⚠️ SINAL DO HOST PERDIDO — TENTANDO RECONEXÃO...', level: 'alert' })
        );
      }
      this.requestResync();
      return true;
    }
    return false;
  }

  requestResync() {
    if (this.mode === 'client') {
      this.sendEnvelope('RESYNC_REQUEST', {
        peerId: this.localPeerId,
        sessionToken: this.sessionToken,
        lastSequence: this.lastAppliedSequence
      });
    }
  }

  // === TRANSPORT LAYER (IN-PROC + BROADCASTCHANNEL + PEERJS WEBRTC) ===

  private openTransport(roomCode: string, asHost: boolean, allowPeerJs = true) {
    let set = MultiplayerManager.inProcChannels.get(roomCode);
    if (!set) {
      set = new Set<MultiplayerManager>();
      MultiplayerManager.inProcChannels.set(roomCode, set);
    }
    set.add(this);

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.bc = new BroadcastChannel(`defcon_coop_${roomCode}`);
        this.bc.onmessage = (ev) => {
          if (ev?.data) this.handleEnvelope(ev.data, null);
        };
      } catch {
        this.bc = null;
      }
    }

    if (allowPeerJs && typeof window !== 'undefined' && typeof RTCPeerConnection !== 'undefined') {
      void this.initPeerJs(roomCode, asHost);
    }
  }

  private async initPeerJs(roomCode: string, asHost: boolean) {
    try {
      const mod = await import('peerjs');
      const PeerCtor: any = (mod as any).Peer || (mod as any).default;
      if (!PeerCtor || this.mode === 'none' || this.roomCode !== roomCode) return;

      const peerOpts = {
        debug: 0,
        config: {
          iceServers: this.buildIceServers()
        }
      };

      const peer = asHost ? new PeerCtor(roomCodeToPeerId(roomCode), peerOpts) : new PeerCtor(undefined, peerOpts);
      this.peer = peer;

      if (asHost) {
        peer.on('open', () => {
          this.statusText = `SALA ONLINE (${roomCode}) — P2P PRONTO`;
          this.emitLobbyUpdate();
        });
        peer.on('connection', (conn: any) => {
          conn.on('data', (data: any) => {
            if (data?.senderId) {
              this.hostConns.set(data.senderId, conn);
            }
            this.handleEnvelope(data, conn);
          });
          conn.on('close', () => {
            for (const [pId, c] of this.hostConns) {
              if (c === conn) {
                this.hostConns.delete(pId);
                this.simulateUnexpectedDisconnect(pId, RECONNECT_GRACE_MS);
                break;
              }
            }
          });
        });
      } else {
        peer.on('open', () => {
          if (this.mode !== 'client' || this.roomCode !== roomCode) return;
          const conn = peer.connect(roomCodeToPeerId(roomCode), { reliable: true });
          this.clientHostConn = conn;
          conn.on('open', () => {
            this.sendEnvelopeToPeer(
              conn,
              this.makeEnvelope('JOIN_REQUEST', {
                peerId: this.localPeerId,
                sessionToken: this.sessionToken,
                callsign: this.localCallsign,
                loadout: this.localLoadout
              })
            );
          });
          conn.on('data', (data: any) => this.handleEnvelope(data, conn));
          conn.on('close', () => {
            if (this.mode === 'client' && this.inMatch) {
              this.hostSignalLost = true;
              this.statusText = '⚠️ SINAL DO HOST PERDIDO — TENTANDO RECONEXÃO...';
              this.emitLobbyUpdate();
              bus.emit('coop:hostSignalLost', { lost: true, elapsedMs: HOST_WATCHDOG_MS });
              this.radioHandlers.forEach((fn) =>
                fn({ text: '⚠️ SINAL DO HOST PERDIDO — TENTANDO RECONEXÃO...', level: 'alert' })
              );
            }
          });
        });
      }

      peer.on('error', () => {
        // Fallback smoothly to BroadcastChannel if signaling server unavailable
      });
    } catch {
      // Fallback smoothly to BroadcastChannel / in-proc transport
    }
  }

  private startHostPingLoop() {
    if (this.pingTimer) clearInterval(this.pingTimer);
    if (typeof window === 'undefined') return;
    this.pingTimer = setInterval(() => {
      if (this.mode === 'host' && this.players.length > 1) {
        this.sendEnvelope('HEARTBEAT', { ts: Date.now() });
      }
    }, 2000);
  }

  private startClientWatchdogLoop() {
    if (this.watchdogTimer) clearInterval(this.watchdogTimer);
    if (typeof window === 'undefined') return;
    this.watchdogTimer = setInterval(() => {
      this.checkHostWatchdog(Date.now());
    }, 1000);
  }

  private makeEnvelope(type: string, payload?: any, targetId?: string, sequence?: number): NetEnvelope {
    return {
      msgId: `${this.localPeerId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      roomCode: this.roomCode,
      senderId: this.localPeerId,
      type,
      payload,
      targetId,
      sequence,
      ts: Date.now()
    };
  }

  private sendEnvelopeToPeer(conn: any, env: NetEnvelope) {
    try {
      if (conn && conn.open) conn.send(env);
    } catch {
      // Ignore send errors on closing channel
    }
  }

  private dispatchEnvelope(env: NetEnvelope) {
    if (!env.roomCode || this.mode === 'none') return;

    const peers = MultiplayerManager.inProcChannels.get(env.roomCode);
    if (peers) {
      for (const peerMgr of peers) {
        if (peerMgr === this) continue;
        peerMgr.handleEnvelope(env, null);
      }
    }

    if (this.bc) {
      try {
        this.bc.postMessage(env);
      } catch {
        // Ignore closed channel errors
      }
    }

    if (this.mode === 'host') {
      if (env.targetId) {
        const targetConn = this.hostConns.get(env.targetId);
        if (targetConn) this.sendEnvelopeToPeer(targetConn, env);
      } else {
        for (const conn of this.hostConns.values()) {
          this.sendEnvelopeToPeer(conn, env);
        }
      }
    } else if (this.mode === 'client' && this.clientHostConn) {
      this.sendEnvelopeToPeer(this.clientHostConn, env);
    }
  }

  sendEnvelope(type: string, payload?: any, targetId?: string, sequence?: number) {
    if (this.mode === 'none') return;
    const env = this.makeEnvelope(type, payload, targetId, sequence);
    this.dispatchEnvelope(env);
  }

  private recordSeen(msgId: string): boolean {
    if (this.seenMsgSet.has(msgId)) return false;
    this.seenMsgSet.add(msgId);
    this.seenMsgIds.push(msgId);
    if (this.seenMsgIds.length > 600) {
      const drop = this.seenMsgIds.shift()!;
      this.seenMsgSet.delete(drop);
    }
    return true;
  }

  // === INCOMING PACKET HANDLER ===

  private handleEnvelope(env: NetEnvelope, sourceConn: any) {
    if (!env || typeof env !== 'object') return;
    if (env.roomCode !== this.roomCode || env.senderId === this.localPeerId) return;
    if (env.targetId && env.targetId !== this.localPeerId) return;
    if (!this.recordSeen(env.msgId)) return;

    const { type, payload, senderId } = env;

    if (this.mode === 'host') {
      if (type === 'JOIN_REQUEST') {
        if (sourceConn) this.hostConns.set(senderId, sourceConn);
        this.handleHostJoinRequest(senderId, payload, sourceConn);
        return;
      }
      if (type === 'RESYNC_REQUEST') {
        if (sourceConn) this.hostConns.set(senderId, sourceConn);
        this.resyncHandlers.forEach((fn) => fn(senderId));
        return;
      }
      if (type === 'PLAYER_LEAVE') {
        this.handleExplicitLeave(payload?.peerId || senderId);
        return;
      }
      if (type === 'SET_CALLSIGN') {
        const p = this.getPlayer(senderId);
        if (p) {
          p.callsign = this.sanitizeCallsign(payload?.callsign);
          this.broadcastLobbyState();
        }
        return;
      }
      if (type === 'SET_LOADOUT') {
        const p = this.getPlayer(senderId);
        if (p) {
          p.loadout = validateDeckLoadout(payload?.loadout);
          this.broadcastLobbyState();
        }
        return;
      }
      if (type === 'SET_READY') {
        const p = this.getPlayer(senderId);
        if (p) {
          p.ready = !!payload?.ready;
          this.broadcastLobbyState();
        }
        return;
      }
      if (type === 'PING_RES' || type === 'PONG') {
        const p = this.getPlayer(senderId);
        if (p && typeof payload?.ts === 'number') {
          p.pingMs = Math.max(1, Math.round(Date.now() - payload.ts));
          this.emitLobbyUpdate();
        }
        return;
      }
      if (type.startsWith('CMD_')) {
        const secCheck = this.validateIncomingCommand(type, payload, senderId);
        if (!secCheck.ok) {
          this.sendEnvelope('COMMAND_REJECT', { commandType: type, reason: secCheck.reason }, senderId);
          return;
        }
        if (type === 'CMD_CURSOR_MOVE') {
          const p = this.getPlayer(senderId);
          const enriched = {
            playerId: senderId,
            callsign: p?.callsign || 'ALLY',
            color: p?.color || SQUAD_COLORS[1],
            col: payload.col,
            row: payload.row,
            selectedTowerType: payload.selectedTowerType || null
          };
          this.cursorHandlers.forEach((fn) => fn(enriched));
          this.sendEnvelope('CMD_CURSOR_MOVE', enriched);
          return;
        }
        if (type === 'CMD_TACTICAL_PING') {
          const p = this.getPlayer(senderId);
          const enriched = {
            playerId: senderId,
            callsign: p?.callsign || 'ALLY',
            color: p?.color || SQUAD_COLORS[1],
            pingType: payload.pingType,
            col: payload.col,
            row: payload.row,
            worldX: payload.worldX,
            worldZ: payload.worldZ
          };
          this.pingHandlers.forEach((fn) => fn(enriched));
          this.sendEnvelope('CMD_TACTICAL_PING', enriched);
          return;
        }
        this.cmdHandlers.forEach((fn) => fn(type, payload, senderId));
      }
      return;
    }

    // CLIENT RECEIVING FROM HOST
    if (this.mode === 'client') {
      this.lastHostPacketAt = Date.now();
      if (this.hostSignalLost) {
        this.hostSignalLost = false;
        this.statusText = this.inMatch
          ? `EM COMBATE // FASE ${this.selectedWorld}-${this.selectedStage}`
          : `ESQUADRÃO (${this.getConnectedPlayerCount()}/${MAX_PLAYERS}) — ${this.roomCode}`;
        bus.emit('coop:hostSignalLost', { lost: false, elapsedMs: 0 });
        this.emitLobbyUpdate();
      }

      if (type === 'JOIN_REJECTED') {
        if (this.pendingJoinTimer) {
          clearTimeout(this.pendingJoinTimer);
          this.pendingJoinTimer = null;
        }
        const reason = payload?.reason || 'Entrada recusada pela sala.';
        const resolve = this.pendingJoinResolve;
        this.pendingJoinResolve = null;
        this.leaveRoom(false);
        if (resolve) resolve({ ok: false, error: reason });
        return;
      }
      if (type === 'COMMAND_REJECT') {
        this.commandRejectHandlers.forEach((fn) => fn(payload));
        this.radioHandlers.forEach((fn) =>
          fn({ text: `🛡️ COMANDO RECUSADO (${payload?.commandType}): ${payload?.reason || ''}`, level: 'warn' })
        );
        return;
      }
      if (type === 'LOBBY_STATE') {
        this.applyLobbyState(payload);
        if (this.pendingJoinResolve) {
          if (this.pendingJoinTimer) {
            clearTimeout(this.pendingJoinTimer);
            this.pendingJoinTimer = null;
          }
          const resolve = this.pendingJoinResolve;
          this.pendingJoinResolve = null;
          resolve({ ok: true, lobby: this.getLobbyState() });
        }
        return;
      }
      if (type === 'START_MATCH') {
        this.inMatch = true;
        this.lastAppliedSequence = 0;
        this.selectedWorld = payload.worldId;
        this.selectedStage = payload.stageId;
        this.statusText = `EM COMBATE // FASE ${payload.worldId}-${payload.stageId}`;
        this.emitLobbyUpdate();
        this.startMatchHandlers.forEach((fn) => fn(payload));
        return;
      }
      if (type === 'STATE_SNAPSHOT') {
        const seq = typeof env.sequence === 'number' ? env.sequence : payload?.sequence;
        if (typeof seq === 'number') {
          if (seq <= this.lastAppliedSequence) {
            this.droppedStaleSnapshots += 1;
            return;
          }
          this.lastAppliedSequence = seq;
        }
        if (Array.isArray(payload?.combatEvents) && payload.combatEvents.length > 0) {
          this.combatEventHandlers.forEach((fn) => fn(payload.combatEvents));
        }
        this.snapshotHandlers.forEach((fn) => fn(payload));
        return;
      }
      if (type === 'COMBAT_EVENT') {
        const seq = typeof env.sequence === 'number' ? env.sequence : payload?.sequence;
        if (typeof seq === 'number' && seq < this.lastAppliedSequence) {
          return;
        }
        if (Array.isArray(payload?.events)) {
          this.combatEventHandlers.forEach((fn) => fn(payload.events));
        }
        return;
      }
      if (type === 'CMD_CURSOR_MOVE') {
        this.cursorHandlers.forEach((fn) => fn(payload));
        return;
      }
      if (type === 'CMD_TACTICAL_PING') {
        this.pingHandlers.forEach((fn) => fn(payload));
        return;
      }
      if (type === 'RADIO_LOG') {
        this.radioHandlers.forEach((fn) => fn(payload));
        return;
      }
      if (type === 'HEARTBEAT' || type === 'PING_REQ') {
        this.sendEnvelope('PONG', { ts: payload?.ts }, senderId);
      }
    }
  }

  private handleHostJoinRequest(peerId: string, payload: any, sourceConn: any) {
    const incomingToken = typeof payload?.sessionToken === 'string' ? payload.sessionToken : '';
    const existingById = this.getPlayer(peerId);
    const existingByToken = incomingToken ? this.getPlayerBySessionToken(incomingToken) : null;
    const existing = existingById || (existingByToken && !existingByToken.isHost ? existingByToken : null);

    if (existing) {
      const oldPeerId = existing.peerId;
      this.cancelReconnectTimer(oldPeerId);
      this.cancelReconnectTimer(peerId);

      // Rebind peerId if same sessionToken rejoined under a new WebRTC socket / peerId
      if (oldPeerId !== peerId) {
        existing.peerId = peerId;
        if (this.waveVotes.has(oldPeerId)) {
          this.waveVotes.delete(oldPeerId);
          this.waveVotes.add(peerId);
        }
        this.ownershipRebindHandlers.forEach((fn) =>
          fn({ oldPeerId, newPeerId: peerId, callsign: existing.callsign })
        );
      }

      const wasReconnecting = existing.status === 'RECONNECTING';
      existing.connected = true;
      existing.reconnecting = false;
      existing.status = 'ONLINE';
      existing.disconnectDeadline = undefined;
      existing.callsign = this.sanitizeCallsign(payload?.callsign || existing.callsign);
      existing.loadout = validateDeckLoadout(payload?.loadout || existing.loadout);

      this.recalculateMaxTowers();
      this.statusText = this.inMatch
        ? `EM COMBATE // FASE ${this.selectedWorld}-${this.selectedStage}`
        : `ESQUADRÃO (${this.getConnectedPlayerCount()}/${MAX_PLAYERS}) — ${this.roomCode}`;
      this.broadcastLobbyState();

      if (wasReconnecting || this.inMatch) {
        this.broadcastRadio(`✅ ${existing.callsign} reconectou e recuperou suas torres!`, 'good');
        if (this.inMatch) {
          this.sendEnvelope(
            'START_MATCH',
            {
              worldId: this.selectedWorld,
              stageId: this.selectedStage,
              coopScale: this.getEnemyHpScale(),
              fobMaxHp: this.getFobMaxHp()
            },
            peerId
          );
          this.resyncHandlers.forEach((fn) => fn(peerId));
        }
      }
      return;
    }

    const activeCount = this.players.filter((p) => p.status !== 'DISCONNECTED').length;
    if (activeCount >= MAX_PLAYERS) {
      const rejEnv = this.makeEnvelope(
        'JOIN_REJECTED',
        { reason: `SALA CHEIA (${MAX_PLAYERS}/${MAX_PLAYERS} COMANDANTES).` },
        peerId
      );
      this.sendEnvelopeToPeer(sourceConn, rejEnv);
      this.dispatchEnvelope(rejEnv);
      return;
    }

    // Prefer empty slots (never occupied or already DISCONNECTED)
    const activeSlots = new Set(
      this.players.filter((p) => p.status !== 'DISCONNECTED').map((p) => p.slotIndex)
    );
    let slotIndex = 0;
    while (activeSlots.has(slotIndex) && slotIndex < MAX_PLAYERS) slotIndex++;
    if (slotIndex >= MAX_PLAYERS) {
      const rejEnv = this.makeEnvelope(
        'JOIN_REJECTED',
        { reason: `SALA CHEIA (${MAX_PLAYERS}/${MAX_PLAYERS} COMANDANTES).` },
        peerId
      );
      this.sendEnvelopeToPeer(sourceConn, rejEnv);
      this.dispatchEnvelope(rejEnv);
      return;
    }

    // Remove dead DISCONNECTED placeholder on that slot if reusing slot
    this.players = this.players.filter((p) => p.slotIndex !== slotIndex);

    const hostBudget = this.players[0]?.budget ?? 750;
    const callsign = this.sanitizeCallsign(payload?.callsign);
    this.players.push({
      peerId,
      sessionToken: incomingToken || undefined,
      slotIndex,
      callsign,
      color: SQUAD_COLORS[slotIndex],
      roleLabel: SQUAD_ROLES[slotIndex],
      isHost: false,
      ready: false,
      loadout: validateDeckLoadout(payload?.loadout),
      budget: hostBudget,
      towerCount: 0,
      maxTowers: getMaxTowersPerPlayer(activeCount + 1),
      pingMs: 8,
      connected: true,
      status: 'ONLINE',
      reconnecting: false
    });
    this.recalculateMaxTowers();
    this.statusText = `ESQUADRÃO (${this.getConnectedPlayerCount()}/${MAX_PLAYERS}) — ${this.roomCode}`;
    this.broadcastLobbyState();
    this.broadcastRadio(`${callsign} conectou ao esquadrão!`, 'good');

    if (this.inMatch) {
      this.sendEnvelope(
        'START_MATCH',
        {
          worldId: this.selectedWorld,
          stageId: this.selectedStage,
          coopScale: this.getEnemyHpScale(),
          fobMaxHp: this.getFobMaxHp()
        },
        peerId
      );
      this.resyncHandlers.forEach((fn) => fn(peerId));
    }
  }

  private handleExplicitLeave(peerId: string) {
    if (this.mode !== 'host') return;
    const p = this.getPlayer(peerId);
    if (!p) return;

    this.cancelReconnectTimer(peerId);
    if (!this.inMatch) {
      this.players = this.players.filter((item) => item.peerId !== peerId);
    } else {
      p.connected = false;
      p.reconnecting = false;
      p.ready = false;
      p.status = 'DISCONNECTED';
      this.waveVotes.delete(peerId);
    }
    this.recalculateMaxTowers();
    this.statusText = `ESQUADRÃO (${this.getConnectedPlayerCount()}/${MAX_PLAYERS}) — ${this.roomCode}`;
    this.broadcastLobbyState();
    this.broadcastRadio(`⚠️ ${p.callsign} saiu da sala. Torres transferidas ao controle do HOST.`, 'warn');
  }

  private applyLobbyState(lobby: CoopLobbyState) {
    if (!lobby) return;
    this.hostPeerId = lobby.hostPeerId;
    this.selectedWorld = lobby.selectedWorld;
    this.selectedStage = lobby.selectedStage;
    this.inMatch = lobby.inMatch;
    this.players = (lobby.players || []).map((p) => ({ ...p }));
    this.waveVotes = new Set(lobby.waveVotes || []);
    this.waveVoteTimer = lobby.waveVoteTimer || 0;
    this.statusText = lobby.statusText || this.statusText;
    this.emitLobbyUpdate();
  }

  broadcastLobbyState() {
    if (this.mode !== 'host') return;
    this.recalculateMaxTowers();
    const state = this.getLobbyState();
    this.sendEnvelope('LOBBY_STATE', state);
    this.emitLobbyUpdate();
  }

  startCoopMatch(worldId?: number, stageId?: number, startingBudget = 750) {
    if (this.mode !== 'host') return;
    if (worldId !== undefined) this.selectedWorld = worldId;
    if (stageId !== undefined) this.selectedStage = stageId;
    this.inMatch = true;
    this.snapshotSeq = 0;
    this.combatEventQueue = [];
    this.waveVotes.clear();
    this.waveVoteTimer = 0;
    for (const p of this.players) {
      p.budget = startingBudget;
      p.towerCount = 0;
    }
    this.statusText = `EM COMBATE // FASE ${this.selectedWorld}-${this.selectedStage}`;
    this.broadcastLobbyState();
    const data = {
      worldId: this.selectedWorld,
      stageId: this.selectedStage,
      coopScale: this.getEnemyHpScale(),
      fobMaxHp: this.getFobMaxHp()
    };
    this.sendEnvelope('START_MATCH', data);
    this.startMatchHandlers.forEach((fn) => fn(data));
  }

  // === MATCH COMMANDS, SEQUENCING & EVENT BATCHING ===

  updateHostSquadBudgets(updater: (player: CoopPlayer) => void) {
    if (this.mode !== 'host') return;
    for (const p of this.players) {
      updater(p);
    }
    this.broadcastLobbyState();
  }

  setWaveVoteTimer(seconds: number) {
    this.waveVoteTimer = Math.max(0, seconds);
  }

  clearWaveVotes() {
    this.waveVotes.clear();
    this.waveVoteTimer = 0;
    if (this.mode === 'host') {
      this.broadcastLobbyState();
    }
  }

  registerWaveVote(playerId = this.localPeerId): { votes: number; required: number; passed: boolean } {
    if (this.mode === 'none') {
      return { votes: 1, required: 1, passed: true };
    }
    this.waveVotes.add(playerId);
    const votes = this.waveVotes.size;
    const required = getRequiredWaveVotes(this.getConnectedPlayerCount());
    const passed = votes >= required;
    if (votes === 1 && !passed && this.waveVoteTimer <= 0) {
      this.waveVoteTimer = 20.0;
    }
    if (this.mode === 'host') {
      this.broadcastLobbyState();
    }
    return { votes, required, passed };
  }

  queueCombatEvent(evt: CombatNetEvent) {
    if (this.mode !== 'host') return;
    if (this.combatEventQueue.length < 40) {
      this.combatEventQueue.push(evt);
    }
  }

  broadcastSnapshot(snapshot: any) {
    if (this.mode !== 'host') return;
    this.snapshotSeq += 1;
    const payload = {
      ...snapshot,
      sequence: this.snapshotSeq,
      combatEvents: this.combatEventQueue.length > 0 ? [...this.combatEventQueue] : undefined
    };
    this.combatEventQueue = [];
    this.sendEnvelope('STATE_SNAPSHOT', payload, undefined, this.snapshotSeq);
  }

  broadcastRadio(text: string, level = 'info', wave?: number) {
    if (this.mode !== 'host') return;
    this.sendEnvelope('RADIO_LOG', { text, level, wave });
  }

  sendCombatCommand(type: string, payload: any) {
    if (this.mode === 'host') {
      const check = this.validateIncomingCommand(type, payload, this.localPeerId);
      if (!check.ok) {
        this.commandRejectHandlers.forEach((fn) => fn({ commandType: type, reason: check.reason || 'Inválido' }));
        return;
      }
      this.cmdHandlers.forEach((fn) => fn(type, payload, this.localPeerId));
    } else if (this.mode === 'client') {
      this.sendEnvelope(type, payload);
    }
  }

  sendCursorMove(col: number, row: number, selectedTowerType: string | null) {
    if (this.mode === 'none') return;
    const now = Date.now();
    if (now - this.lastCursorSentAt < 83) return;
    this.lastCursorSentAt = now;

    const me = this.getLocalPlayer();
    const payload = {
      playerId: this.localPeerId,
      callsign: me?.callsign || this.localCallsign,
      color: me?.color || SQUAD_COLORS[0],
      col,
      row,
      selectedTowerType
    };
    this.sendEnvelope('CMD_CURSOR_MOVE', payload);
  }

  sendTacticalPing(pingType: PingType, col: number, row: number, worldX: number, worldZ: number) {
    const me = this.getLocalPlayer();
    const payload = {
      playerId: this.localPeerId,
      callsign: me?.callsign || this.localCallsign,
      color: me?.color || SQUAD_COLORS[0],
      pingType,
      col,
      row,
      worldX,
      worldZ
    };
    if (this.mode === 'host') {
      const sec = this.validateIncomingCommand('CMD_TACTICAL_PING', payload, this.localPeerId);
      if (!sec.ok) {
        this.radioHandlers.forEach((fn) => fn({ text: `⚠️ ${sec.reason}`, level: 'warn' }));
        return;
      }
      this.pingHandlers.forEach((fn) => fn(payload));
      this.sendEnvelope('CMD_TACTICAL_PING', payload);
    } else if (this.mode === 'client') {
      this.pingHandlers.forEach((fn) => fn(payload));
      this.sendEnvelope('CMD_TACTICAL_PING', payload);
    } else {
      this.pingHandlers.forEach((fn) => fn(payload));
    }
  }
}

export const multiplayer = new MultiplayerManager();
