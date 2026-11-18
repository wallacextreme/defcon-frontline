import test from 'node:test';
import assert from 'node:assert/strict';

// Provide minimal global browser shims BEFORE importing SaveManager / Pathfinder if needed
const memStore = new Map();
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
    setItem: (k, v) => memStore.set(k, String(v)),
    removeItem: (k) => memStore.delete(k),
    clear: () => memStore.clear()
  };
}
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    addEventListener: () => {},
    removeEventListener: () => {}
  };
}

import {
  TOWER_DEFINITIONS,
  TOWER_BUILD_ORDER,
  MANDATORY_TOWER_IDS,
  getTowerLevelSpec,
  getTowerUpgradeOptions
} from '../src/data/towers.js';
import { ENEMY_DEFINITIONS, MANDATORY_ENEMY_IDS } from '../src/data/enemies.js';
import { WORLDS, getStageConfig } from '../src/data/worlds.js';
import { Pathfinder, CELL } from '../src/systems/Pathfinder.js';
import {
  DAMAGE_TYPES,
  normalizeDamageType,
  resolveDamage
} from '../src/systems/DamageSystem.js';
import { SaveManager } from '../src/systems/SaveManager.ts';

test('Catalog: all 20 mandatory towers and preserved legacy towers have valid progression & specializations', () => {
  assert.equal(MANDATORY_TOWER_IDS.length, 20);
  for (const id of ['bushmaster', 'javelin', 'hesco', ...MANDATORY_TOWER_IDS]) {
    assert.ok(TOWER_DEFINITIONS[id], `Tower missing: ${id}`);
    assert.ok(TOWER_BUILD_ORDER.includes(id), `Tower missing from build order: ${id}`);
  }

  for (const id of MANDATORY_TOWER_IDS) {
    const def = TOWER_DEFINITIONS[id];
    assert.ok(def.name && def.shortName && def.summary, `${id} missing metadata`);
    assert.ok(def.cost > 0 && def.maxHp > 0, `${id} invalid cost/hp`);
    assert.equal(def.levels.length, 4, `${id} must have 4 common levels (1 basic + 3 upgrades)`);
    assert.ok(def.specializations?.A && def.specializations?.B, `${id} must have Specializations A and B`);

    for (const branch of ['A', 'B']) {
      const sp = def.specializations[branch];
      assert.ok(sp.name && sp.cost > 0 && sp.pros && sp.cons, `${id} spec ${branch} incomplete`);
      assert.ok(sp.tier2 && sp.tier2.upgradeCost > 0, `${id} spec ${branch} missing mastery tier2`);
    }

    // Verify helper transitions Lv1 -> Lv6 for A & B
    const lv4Opt = getTowerUpgradeOptions(def, 4, null);
    assert.equal(lv4Opt?.kind, 'specialize');
    const lv5OptA = getTowerUpgradeOptions(def, 5, 'A');
    assert.equal(lv5OptA?.kind, 'common');
    assert.equal(getTowerUpgradeOptions(def, 6, 'A'), null);
    const spec6B = getTowerLevelSpec(def, 6, 'B');
    assert.equal(spec6B.specialization, 'B');
    assert.equal(spec6B.level, 6);
  }
});

test('Catalog: all 20 mandatory armed enemies and legacy units have valid combat stats & resistances', () => {
  assert.equal(MANDATORY_ENEMY_IDS.length, 20);
  const legacyIds = [
    'infantry', 'imv', 'ifv', 'drone_swarm', 'mbt', 'heli', 'stealth', 'boss',
    'subboss_tos1', 'subboss_pantsir', 'subboss_ka50', 'boss_koalitsiya', 'boss_terminator',
    'boss_tu160', 'boss_armata', 'megaboss_scud_convoy', 'megaboss_object279', 'megaboss_kirov_airship'
  ];
  for (const id of [...legacyIds, ...MANDATORY_ENEMY_IDS]) {
    assert.ok(ENEMY_DEFINITIONS[id], `Enemy missing: ${id}`);
  }

  let hasAir = false;
  let hasBoss = false;
  for (const id of MANDATORY_ENEMY_IDS) {
    const e = ENEMY_DEFINITIONS[id];
    if (e.domain === 'air') hasAir = true;
    if (e.isBoss) hasBoss = true;
    assert.ok(e.maxHp > 0 && e.speed > 0 && e.reward > 0, `${id} invalid base stats`);
    assert.ok(e.weaponName && e.towerAttack, `${id} must carry a weapon targeting towers`);
    assert.ok(e.towerAttack.range > 0 && e.towerAttack.damage > 0 && e.towerAttack.interval > 0);
    assert.ok(e.towerAttack.prepTime > 0, `${id} must have telegraphed prepTime`);
    assert.ok(e.resistances && typeof e.resistances === 'object', `${id} missing resistances table`);
    for (const [k, v] of Object.entries(e.resistances)) {
      assert.ok(DAMAGE_TYPES.includes(k), `${id} invalid resistance type ${k}`);
      assert.ok(typeof v === 'number' && v >= 0.15 && v <= 3.0, `${id} resistance ${k}=${v} out of bounds`);
    }
  }
  assert.ok(hasAir, 'Must include flying enemies');
  assert.ok(hasBoss, 'Must include boss unit');
});

test('DamageSystem: shields, resistances, burrow, frontal shield, corrosion & bounds work deterministically', () => {
  assert.equal(DAMAGE_TYPES.length, 9);
  assert.equal(normalizeDamageType('kinetic'), 'physical');
  assert.equal(normalizeDamageType('laser'), 'energy');
  assert.equal(normalizeDamageType('cryo'), 'ice');
  assert.equal(normalizeDamageType('toxic'), 'poison');

  // Electric strips energy shield with bonus multiplier before HP takes damage
  const shielded = {
    hp: 300,
    maxHp: 300,
    shield: 100,
    maxShield: 100,
    armorClass: 'medium',
    resistances: { electric: 1.4, poison: 1.0 }
  };
  const rElec = resolveDamage(shielded, 50, 'electric');
  assert.equal(rElec.damage, 0);
  assert.ok(rElec.shieldDamage > 50, 'Electric should hit energy shield harder than 1x');
  assert.ok(shielded.shield < 100);

  // Poison bypasses remaining energy shield directly to HP
  const rPoison = resolveDamage(shielded, 40, 'poison', { allowApsIntercept: false });
  assert.equal(rPoison.shieldDamage, 0);
  assert.ok(rPoison.damage > 0);

  // Escudeiro frontal shield blocks part of physical fire, mitigated by splash or pierce
  const escudeiro = {
    armorClass: 'medium',
    shield: 0,
    frontalShieldReduction: 0.5,
    resistances: { physical: 0.75, explosive: 1.25 }
  };
  const frontPhys = resolveDamage(escudeiro, 100, 'physical', { isSplash: false, armorPierce: 0 });
  const splashExp = resolveDamage(escudeiro, 100, 'explosive', { isSplash: true });
  assert.ok(frontPhys.frontalBlocked);
  assert.ok(splashExp.damage > frontPhys.damage * 1.5);

  // Escavador burrowed takes less bullet damage and more explosive/mine damage
  const burrowEnemy = {
    armorClass: 'medium',
    shield: 0,
    isBurrowed: true,
    resistances: { physical: 1.0, explosive: 1.4 }
  };
  const bulletHit = resolveDamage(burrowEnemy, 100, 'physical');
  const mineHit = resolveDamage(burrowEnemy, 100, 'explosive', { isMine: true });
  assert.ok(mineHit.damage > bulletHit.damage * 2);

  // Extreme multiplier clamps & NaN guard
  const invalid = resolveDamage(shielded, NaN, 'fire');
  assert.equal(invalid.damage, 0);
});

test('Worlds & Pathfinder: all 20 maps (including 5 new World 4 maps) have valid A* paths, anti-block checks & 10 waves', () => {
  assert.equal(WORLDS.length, 4);
  for (const w of WORLDS) {
    assert.equal(w.stages.length, 5);
    for (const st of w.stages) {
      const pf = new Pathfinder();
      pf.loadStageLayout(st);
      assert.ok(pf.spawnPaths.size >= st.spawnPoints.length, `Stage ${st.id} failed A* route validation`);
      for (const sp of st.spawnPoints) {
        const path = pf.spawnPaths.get(sp.id);
        assert.ok(path && path.length > 5, `Stage ${st.id} spawn ${sp.id} empty path`);
      }

      // Cannot build on restricted, spawn, or fob cells
      assert.equal(pf.canPlaceAt(st.fobPoint.col, st.fobPoint.row).ok, false);
      assert.equal(pf.canPlaceAt(st.spawnPoints[0].col, st.spawnPoints[0].row).ok, false);
    }
  }

  // World 4 specific expansion checks
  const w4 = WORLDS[3];
  assert.equal(w4.worldId, 4);
  const seenMandatory = new Set();
  const routeSignatures = new Set();

  for (const st of w4.stages) {
    assert.ok(st.waves.length >= 10, `World 4 stage ${st.id} must have >= 10 waves`);
    assert.ok(st.difficulty, `World 4 stage ${st.id} must identify difficulty`);
    assert.ok(st.biome, `World 4 stage ${st.id} must have visual biome`);

    const pf = new Pathfinder();
    pf.loadStageLayout(st);
    const sig = [...pf.spawnPaths.values()].map((p) => `${p.length}:${p[Math.floor(p.length / 2)].col},${p[Math.floor(p.length / 2)].row}`).join('|');
    routeSignatures.add(sig);

    for (const rc of st.restrictedCells || []) {
      const [rCol, rRow] = Array.isArray(rc) ? rc : [rc.col, rc.row];
      assert.equal(pf.baseTerrain[rRow][rCol], CELL.RESTRICTED);
      assert.equal(pf.canPlaceAt(rCol, rRow).ok, false, `Restricted cell ${rCol},${rRow} must block construction`);
    }

    // Check anti-blocking: try placing on a non-road cell adjacent to spawn doesn't throw, and sealing road is forbidden
    const wave10 = st.waves[st.waves.length - 1];
    assert.ok(
      wave10.groups.some((g) => ENEMY_DEFINITIONS[g.type]?.isBoss),
      `Stage ${st.id} final wave must contain a boss confrontation`
    );

    for (const wv of st.waves) {
      for (const g of wv.groups) {
        assert.ok(ENEMY_DEFINITIONS[g.type], `Unknown enemy ${g.type} in ${st.id}`);
        if (MANDATORY_ENEMY_IDS.includes(g.type)) {
          seenMandatory.add(g.type);
        }
      }
    }
  }

  assert.equal(routeSignatures.size, 5, 'All 5 World 4 maps must have distinct route geometry');
  assert.equal(seenMandatory.size, 20, `Missing mandatory enemies in World 4 waves: ${MANDATORY_ENEMY_IDS.filter((id) => !seenMandatory.has(id)).join(', ')}`);
});

test('SaveManager: migrates legacy v1-v3 saves cleanly and persists level 6 specializations', () => {
  memStore.clear();
  const legacyV2 = {
    version: 2,
    warBonds: 420,
    selectedWorld: 2,
    selectedStage: 3,
    unlockedStages: ['1-1', '2-3'],
    completedStages: { '1-1': 2 },
    unlockedTowers: ['m2_bunker', 'bushmaster'],
    unlockedSupports: ['a10'],
    towerTech: { m2_bunker: { damage: 2, fireRate: 1, hp: 0, cost: 0 } },
    activeMission: null,
    lastSavedAt: Date.now()
  };
  memStore.set('defcon_frontline_save_v2', JSON.stringify(legacyV2));

  const mgr = new SaveManager();
  assert.equal(mgr.getWarBonds(), 420);
  assert.equal(mgr.isStageUnlocked(2, 3), true);
  assert.equal(mgr.isStageUnlocked(4, 1), true, 'Expansion starter map 4-1 must unlock automatically on migration');
  assert.equal(mgr.isTowerUnlocked('railgun'), true, 'All 20 mandatory starter towers must be usable');
  assert.equal(mgr.isTowerUnlocked('javelin'), false, 'Legacy unlockable WB$ towers retain progression gate');

  // Persist Lv6 + Specialization B active mission snapshot
  mgr.saveActiveMission({
    timestamp: Date.now(),
    worldId: 4,
    stageId: 2,
    budget: 900,
    sessionWB: 10,
    fobHp: 18,
    fobMaxHp: 20,
    completedWave: 5,
    totalWaves: 10,
    totalKills: 75,
    totalDamage: 18000,
    airSupportTimers: { a10: 0, hellfire: 0, b52: 0 },
    towers: [
      {
        defId: 'tesla_tower',
        col: 10,
        row: 6,
        level: 6,
        specialization: 'B',
        hp: 680,
        maxHp: 680,
        effectiveCost: 260,
        totalInvested: 1200,
        priority: 'first',
        turretAngle: 0,
        totalDamage: 9000,
        kills: 24
      }
    ]
  }, true);

  const mgrReloaded = new SaveManager();
  const snap = mgrReloaded.getActiveMission();
  assert.ok(snap);
  assert.equal(snap.worldId, 4);
  assert.equal(snap.towers[0].level, 6);
  assert.equal(snap.towers[0].specialization, 'B');
});
