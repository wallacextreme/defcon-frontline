import test from 'node:test';
import assert from 'node:assert/strict';

const memStore = new Map();
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
    setItem: (k, v) => memStore.set(k, String(v)),
    removeItem: (k) => memStore.delete(k),
    clear: () => memStore.clear()
  };
}

import {
  MultiplayerManager,
  SQUAD_COLORS,
  getMaxTowersPerPlayer,
  getCoopEnemyScale,
  getCoopFobMaxHp,
  getRequiredWaveVotes,
  normalizeRoomCode,
  roomCodeToPeerId,
  validateDeckLoadout,
  sanitizeCallsign,
  distributeKillReward
} from '../src/systems/MultiplayerManager.ts';

test('Lobby: Host creates DFC-XXXX room, allows up to 4 players, and rejects 5th player', async () => {
  const host = new MultiplayerManager('host-p1');
  const p2 = new MultiplayerManager('client-p2');
  const p3 = new MultiplayerManager('client-p3');
  const p4 = new MultiplayerManager('client-p4');
  const p5 = new MultiplayerManager('client-p5');

  host.setCallsign('CMDR-HOST');
  const lobby = host.createRoom(4, 1, 750);
  assert.match(lobby.roomCode, /^DFC-[A-Z0-9]{4}$/);
  assert.equal(normalizeRoomCode(lobby.roomCode.toLowerCase()), lobby.roomCode);
  assert.equal(roomCodeToPeerId(lobby.roomCode), `defcon-frontline-coop-${lobby.roomCode.slice(4)}`);
  assert.equal(lobby.players.length, 1);
  assert.equal(lobby.players[0].color, SQUAD_COLORS[0]);

  const r2 = await p2.joinRoom(lobby.roomCode, { timeoutMs: 800, allowPeerJs: false });
  const r3 = await p3.joinRoom(lobby.roomCode, { timeoutMs: 800, allowPeerJs: false });
  const r4 = await p4.joinRoom(lobby.roomCode, { timeoutMs: 800, allowPeerJs: false });

  assert.equal(r2.ok, true);
  assert.equal(r3.ok, true);
  assert.equal(r4.ok, true);

  const curLobby = host.getLobbyState();
  assert.equal(curLobby.players.length, 4);
  assert.deepEqual(
    curLobby.players.map((p) => p.color),
    ['#22c55e', '#38bdf8', '#facc15', '#c084fc']
  );

  // 5th player must be rejected cleanly with room-full error
  const r5 = await p5.joinRoom(lobby.roomCode, { timeoutMs: 800, allowPeerJs: false });
  assert.equal(r5.ok, false);
  assert.match(r5.error || '', /SALA CHEIA/i);
  assert.equal(host.getLobbyState().players.length, 4);

  p5.leaveRoom(false);
  p4.leaveRoom(true);
  p3.leaveRoom(true);
  p2.leaveRoom(true);
  host.leaveRoom(false);
});

test('Deck & Co-op Scaling: 6-tower deck validation, tower caps (30/20/15/12), enemy HP & FOB scaling (1P..4P)', () => {
  // Validated 6-tower loadout caps duplicates & unknown IDs
  const deck = validateDeckLoadout([
    'ballista',
    'ballista',
    'sniper_tower',
    'railgun',
    'unknown_tower',
    'tesla_tower',
    'cryo_tower',
    'phalanx',
    'ew_crew'
  ]);
  assert.equal(deck.length, 6);
  assert.deepEqual(deck, ['ballista', 'sniper_tower', 'railgun', 'tesla_tower', 'cryo_tower', 'phalanx']);

  // Scaling formulas across 1..4 players
  assert.equal(getMaxTowersPerPlayer(1), 30);
  assert.equal(getMaxTowersPerPlayer(2), 20);
  assert.equal(getMaxTowersPerPlayer(3), 15);
  assert.equal(getMaxTowersPerPlayer(4), 12);

  assert.equal(getCoopEnemyScale(1), 1.0);
  assert.equal(getCoopEnemyScale(2), 1.45);
  assert.equal(getCoopEnemyScale(3), 1.85);
  assert.equal(getCoopEnemyScale(4), 2.25);

  assert.equal(getCoopFobMaxHp(1), 20);
  assert.equal(getCoopFobMaxHp(2), 25);
  assert.equal(getCoopFobMaxHp(3), 30);
  assert.equal(getCoopFobMaxHp(4), 35);
});

test('Permissions: P2 cannot upgrade/sell P1 tower, but CAN repair P1 damaged tower; Host inherits on disconnect', async () => {
  const host = new MultiplayerManager('p1-host');
  const p2 = new MultiplayerManager('p2-alpha');
  const lobby = host.createRoom(1, 1, 750, 'DFC-PERM');
  await p2.joinRoom(lobby.roomCode, { timeoutMs: 800, allowPeerJs: false });

  // Authoritative match state hosted by P1
  const matchTowers = new Map();
  matchTowers.set('t1', {
    id: 't1',
    defId: 'ballista',
    ownerId: host.localPeerId,
    level: 1,
    hp: 200,
    maxHp: 400
  });

  host.onHostCommand((type, payload, senderId) => {
    const t = matchTowers.get(payload.towerId);
    if (!t) return;
    if (type === 'CMD_UPGRADE_TOWER' || type === 'CMD_SELL_TOWER' || type === 'CMD_SPECIALIZE_TOWER' || type === 'CMD_SET_TARGETING') {
      if (!host.canModifyTower(t.ownerId, senderId)) return;
      if (type === 'CMD_UPGRADE_TOWER') t.level += 1;
      if (type === 'CMD_SELL_TOWER') matchTowers.delete(t.id);
    } else if (type === 'CMD_REPAIR_TOWER') {
      if (!host.canRepairTower(senderId)) return;
      const actor = host.getPlayer(senderId);
      const cost = 50;
      if (actor && actor.budget >= cost) {
        actor.budget -= cost;
        t.hp = t.maxHp;
      }
    }
  });

  assert.equal(host.canModifyTower(host.localPeerId, p2.localPeerId), false);
  assert.equal(host.canRepairTower(p2.localPeerId), true);

  // P2 tries unauthorized upgrade and sell on P1 tower
  p2.sendCombatCommand('CMD_UPGRADE_TOWER', { towerId: 't1' });
  p2.sendCombatCommand('CMD_SELL_TOWER', { towerId: 't1' });
  assert.equal(matchTowers.has('t1'), true);
  assert.equal(matchTowers.get('t1').level, 1);

  // P2 cooperatively repairs P1 damaged tower using P2 budget
  p2.sendCombatCommand('CMD_REPAIR_TOWER', { towerId: 't1' });
  assert.equal(matchTowers.get('t1').hp, 400);
  assert.equal(host.getPlayer(p2.localPeerId).budget, 700);

  // Host inherits permission if a client disconnects mid-match
  host.startCoopMatch(1, 1, 750);
  matchTowers.set('t2', { id: 't2', ownerId: p2.localPeerId, level: 1, hp: 300, maxHp: 300 });
  assert.equal(host.canModifyTower(p2.localPeerId, host.localPeerId), false);
  p2.leaveRoom(true);
  assert.equal(host.canModifyTower(p2.localPeerId, host.localPeerId), true);

  host.leaveRoom(false);
});

test('Co-op Economy & Voting: CMD_DONATE_CASH prevents overdraft and CMD_VOTE_NEXT_WAVE tracks quorum', async () => {
  const host = new MultiplayerManager('econ-host');
  const p2 = new MultiplayerManager('econ-p2');
  const p3 = new MultiplayerManager('econ-p3');
  const lobby = host.createRoom(2, 1, 500, 'DFC-ECON');
  await p2.joinRoom(lobby.roomCode, { timeoutMs: 800, allowPeerJs: false });
  await p3.joinRoom(lobby.roomCode, { timeoutMs: 800, allowPeerJs: false });
  host.startCoopMatch(2, 1, 500);

  assert.equal(getRequiredWaveVotes(3), 2);

  // Anti-negative donation check
  const badOverdraft = host.validateDonation(host.localPeerId, p2.localPeerId, 999);
  assert.equal(badOverdraft.ok, false);
  const badNegative = host.validateDonation(host.localPeerId, p2.localPeerId, -50);
  assert.equal(badNegative.ok, false);

  let wavesStarted = 0;
  host.onHostCommand((type, payload, senderId) => {
    if (type === 'CMD_DONATE_CASH') {
      const res = host.validateDonation(senderId, payload.toPlayerId, payload.amount);
      if (res.ok) {
        host.getPlayer(senderId).budget -= payload.amount;
        host.getPlayer(payload.toPlayerId).budget += payload.amount;
        host.broadcastLobbyState();
      }
    } else if (type === 'CMD_VOTE_NEXT_WAVE') {
      const v = host.registerWaveVote(senderId);
      if (v.passed) {
        wavesStarted += 1;
        host.clearWaveVotes();
      }
    }
  });

  // Host donates $150 to P2
  host.sendCombatCommand('CMD_DONATE_CASH', { toPlayerId: p2.localPeerId, amount: 150 });
  assert.equal(host.getPlayer(host.localPeerId).budget, 350);
  assert.equal(host.getPlayer(p2.localPeerId).budget, 650);
  assert.equal(p2.getPlayer(p2.localPeerId).budget, 650);

  // Wave vote requires 2 of 3 players
  p2.sendCombatCommand('CMD_VOTE_NEXT_WAVE', {});
  assert.equal(wavesStarted, 0);
  assert.equal(p3.getLobbyState().waveVotes.length, 1);

  p3.sendCombatCommand('CMD_VOTE_NEXT_WAVE', {});
  assert.equal(wavesStarted, 1);
  assert.equal(host.getLobbyState().waveVotes.length, 0);

  p3.leaveRoom(true);
  p2.leaveRoom(true);
  host.leaveRoom(false);
});

test('Sync Protocol: STATE_SNAPSHOT, START_MATCH, and CMD_TACTICAL_PING synchronize cleanly between Host and Client', async () => {
  const host = new MultiplayerManager('sync-host');
  const client = new MultiplayerManager('sync-client');
  const lobby = host.createRoom(4, 5, 900, 'DFC-SYNC');
  await client.joinRoom(lobby.roomCode, { timeoutMs: 800, allowPeerJs: false });

  let clientStartPayload = null;
  let clientSnap = null;
  let clientPing = null;
  client.onStartMatch((d) => (clientStartPayload = d));
  client.onSnapshot((s) => (clientSnap = s));
  client.onTacticalPing((p) => (clientPing = p));

  host.startCoopMatch(4, 5, 900);
  assert.deepEqual(clientStartPayload, {
    worldId: 4,
    stageId: 5,
    coopScale: 1.45,
    fobMaxHp: 25
  });

  host.broadcastSnapshot({
    worldId: 4,
    stageId: 5,
    fobHp: 24,
    fobMaxHp: 25,
    currentWave: 3,
    totalWaves: 10,
    towers: [{ id: 'rail_1', defId: 'railgun', col: 8, row: 4, level: 5, specialization: 'A' }],
    enemies: [{ id: 12, type: 'tita_cerco', hp: 18500, maxHp: 19575 }]
  });

  assert.equal(clientSnap.currentWave, 3);
  assert.equal(clientSnap.fobMaxHp, 25);
  assert.equal(clientSnap.towers[0].specialization, 'A');
  assert.equal(clientSnap.enemies[0].type, 'tita_cerco');

  client.sendTacticalPing('BOSS', 12, 7, 10, 5);
  assert.equal(clientPing.pingType, 'BOSS');
  assert.equal(clientPing.playerId, client.localPeerId);

  client.leaveRoom(true);
  host.leaveRoom(false);
});

test('Reconnection Grace Window: 20s timeout keeps slot & blocks takeover, reconnect rebinds ownership, and expiry transfers to Host', async () => {
  const sessionStore = new Map();
  const prevSessionStorage = globalThis.sessionStorage;
  const host = new MultiplayerManager('rcn-host');

  globalThis.sessionStorage = {
    getItem: (k) => (sessionStore.has(k) ? sessionStore.get(k) : null),
    setItem: (k, v) => sessionStore.set(k, String(v)),
    removeItem: (k) => sessionStore.delete(k),
    clear: () => sessionStore.clear()
  };

  let p2 = null;
  let p2Refreshed = null;
  try {
    p2 = new MultiplayerManager('rcn-p2-a');
    const lobby = host.createRoom(2, 2, 700, 'DFC-RCN1');
    await p2.joinRoom(lobby.roomCode, { timeoutMs: 800, allowPeerJs: false });
    host.startCoopMatch(2, 2, 700);
    host.getPlayer(p2.localPeerId).budget = 435;

    let rebindEvent = null;
    host.onOwnershipRebind((evt) => {
      rebindEvent = evt;
    });

    // Unexpected disconnect keeps P2 slot in RECONNECTING and protects its towers
    const startedGrace = host.simulateUnexpectedDisconnect(p2.localPeerId, 20000);
    assert.equal(startedGrace, true);
    const midPlayer = host.getPlayer(p2.localPeerId);
    assert.equal(midPlayer.status, 'RECONNECTING');
    assert.equal(midPlayer.reconnecting, true);
    assert.equal(host.canModifyTower(p2.localPeerId, host.localPeerId), false);

    // Same sessionToken reconnects from refreshed tab (new peerId)
    p2.leaveRoom(false); // simulate transport drop without explicit PLAYER_LEAVE
    p2Refreshed = new MultiplayerManager('rcn-p2-b');
    const rejoin = await p2Refreshed.joinRoom(lobby.roomCode, { timeoutMs: 800, allowPeerJs: false });
    assert.equal(rejoin.ok, true);
    assert.ok(rebindEvent);
    assert.equal(rebindEvent.oldPeerId, 'rcn-p2-a');
    assert.equal(rebindEvent.newPeerId, 'rcn-p2-b');
    assert.equal(host.getPlayer('rcn-p2-b').budget, 435);
    assert.equal(host.getPlayer('rcn-p2-b').status, 'ONLINE');

    // Second drop followed by grace expiry transfers tower ownership to Host
    host.simulateUnexpectedDisconnect('rcn-p2-b', 20000);
    assert.equal(host.canModifyTower('rcn-p2-b', host.localPeerId), false);
    const expired = host.expireReconnectGrace('rcn-p2-b');
    assert.equal(expired, true);
    assert.equal(host.getPlayer('rcn-p2-b').status, 'DISCONNECTED');
    assert.equal(host.canModifyTower('rcn-p2-b', host.localPeerId), true);
  } finally {
    p2Refreshed?.leaveRoom(false);
    p2?.leaveRoom(false);
    host.leaveRoom(false);
    if (prevSessionStorage === undefined) {
      delete globalThis.sessionStorage;
    } else {
      globalThis.sessionStorage = prevSessionStorage;
    }
  }
});

test('Anti-Kill-Steal Reward: distributeKillReward splits proportionally with exact integer sum and Boss +35% assist', () => {
  // 70% / 30% damage split on $100 enemy even if P2 landed the final hit
  const split = distributeKillReward(100, { p1: 700, p2: 300 }, 'p2', ['p1', 'p2'], false);
  assert.equal(split.p1, 70);
  assert.equal(split.p2, 30);
  assert.equal(split.p1 + split.p2, 100);

  // Odd remainder must still sum strictly to totalReward ($10 / 3 players)
  const odd = distributeKillReward(10, { p1: 500, p2: 300, p3: 300 }, 'p3', ['p1', 'p2', 'p3'], false);
  const oddSum = Object.values(odd).reduce((acc, v) => acc + v, 0);
  assert.equal(oddSum, 10);
  assert.equal(odd.p1, 5); // highest damage gets the $1 integer remainder cleanly

  // Boss kill adds +35% assist payout for non-killer allies while main payouts sum to totalReward
  const boss = distributeKillReward(200, { p1: 1500, p2: 500 }, 'p2', ['p1', 'p2', 'p3'], true);
  assert.equal(boss.p1, 150);
  assert.equal(boss.p2, 50);
  assert.equal(boss.assist?.p1, 70);
  assert.equal(boss.assist?.p3, 70);
  assert.equal(boss.assist?.p2, undefined);

  // Untracked / Singleplayer fallback pays 100% to killerId
  const sp = distributeKillReward(45, {}, 'local', ['local'], false);
  assert.deepEqual(sp, { local: 45 });
});

test('Hardening Security: stale sequence packets are dropped, callsigns strip XSS, ping cooldown & bounds reject abuse', async () => {
  // XSS sanitization & 16-char cap
  const cleanXss = sanitizeCallsign('<script>alert(1)</script>CMDR_ALPHA_SUPERLONG');
  assert.equal(cleanXss.includes('<'), false);
  assert.equal(cleanXss.includes('script'), false);
  assert.ok(cleanXss.length <= 16);

  const host = new MultiplayerManager('sec-host');
  const client = new MultiplayerManager('sec-client');
  const lobby = host.createRoom(1, 1, 750, 'DFC-SECU');
  await client.joinRoom(lobby.roomCode, { timeoutMs: 800, allowPeerJs: false });

  const wavesSeen = [];
  client.onSnapshot((s) => wavesSeen.push(s.currentWave));

  // Sequence 1 -> 2 applied cleanly
  host.broadcastSnapshot({ currentWave: 1, towers: [], enemies: [] });
  host.broadcastSnapshot({ currentWave: 2, towers: [], enemies: [] });
  assert.deepEqual(wavesSeen, [1, 2]);

  // Inject out-of-order stale sequence 1 via transport
  const ch = new BroadcastChannel(`defcon_coop_${lobby.roomCode}`);
  ch.postMessage({
    msgId: 'stale-seq-1',
    roomCode: lobby.roomCode,
    senderId: host.localPeerId,
    type: 'STATE_SNAPSHOT',
    sequence: 1,
    payload: { currentWave: 1, sequence: 1, towers: [], enemies: [] },
    ts: Date.now()
  });
  await new Promise((r) => setTimeout(r, 40));
  ch.close();

  assert.deepEqual(wavesSeen, [1, 2]);
  assert.equal(client.droppedStaleSnapshots, 1);

  // 1.5s ping cooldown enforcement
  const ping1 = host.validateIncomingCommand('CMD_TACTICAL_PING', { pingType: 'BOSS' }, 'client-x', 10000);
  const ping2 = host.validateIncomingCommand('CMD_TACTICAL_PING', { pingType: 'BOSS' }, 'client-x', 10400);
  const ping3 = host.validateIncomingCommand('CMD_TACTICAL_PING', { pingType: 'BOSS' }, 'client-x', 11600);
  assert.equal(ping1.ok, true);
  assert.equal(ping2.ok, false);
  assert.equal(ping3.ok, true);

  // Malformed NaN / out-of-bounds CMD_BUILD_TOWER rejected & emits COMMAND_REJECT
  let rejectedReason = '';
  host.onCommandReject((info) => {
    rejectedReason = `${info.commandType}:${info.reason}`;
  });
  host.sendCombatCommand('CMD_BUILD_TOWER', { towerType: 'm2_bunker', col: 99, row: -2 });
  assert.match(rejectedReason, /CMD_BUILD_TOWER/);

  const nanCheck = host.validateIncomingCommand('CMD_AIR_SUPPORT', { worldX: NaN, worldZ: 0 }, 'client-x', 12000);
  assert.equal(nanCheck.ok, false);

  client.leaveRoom(true);
  host.leaveRoom(false);
});
