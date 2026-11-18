import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TOWER_DEFINITIONS,
  getTowerLevelSpec,
  getTowerUpgradeOptions
} from '../src/data/towers.js';
import { ENEMY_DEFINITIONS } from '../src/data/enemies.js';
import { getStageConfig } from '../src/data/worlds.js';
import { Pathfinder, CELL, TILE_SIZE, GRID_COLS, GRID_ROWS } from '../src/systems/Pathfinder.js';
import { resolveDamage } from '../src/systems/DamageSystem.js';

/**
 * Deterministic headless combat simulator exercising real A* routes,
 * tower upgrades + specializations A/B, enemy weapons vs tower HP/shields,
 * repair economy, support auras, and 9-type damage/resistances.
 */
function simulateStage(stageId, strategy = 'combined_arms') {
  const stage = getStageConfig(4, stageId);
  const pf = new Pathfinder();
  pf.loadStageLayout(stage);

  // Pick buildable tiles adjacent to road sorted by centrality & choke proximity
  const buildSlots = [];
  for (let r = 1; r < GRID_ROWS - 1; r++) {
    for (let c = 1; c < GRID_COLS - 1; c++) {
      if (!pf.isBuildable(c, r)) continue;
      let roadNeighbors = 0;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const rr = r + dr;
          const cc = c + dc;
          if (pf.inBounds(cc, rr) && pf.baseTerrain[rr][cc] === CELL.ROAD) {
            roadNeighbors += Math.abs(dr) <= 1 && Math.abs(dc) <= 1 ? 3 : 1;
          }
        }
      }
      if (roadNeighbors > 0) {
        const cx = (c + 0.5) * TILE_SIZE;
        const cy = (r + 0.5) * TILE_SIZE;
        const distFob = pf.getDistanceToFobPx(cx, cy);
        buildSlots.push({ col: c, row: r, x: cx, y: cy, score: roadNeighbors * 40 - distFob * 0.08 });
      }
    }
  }
  buildSlots.sort((a, b) => b.score - a.score);

  let budget = stage.startingBudget;
  let fobHp = 20;
  let totalTowerDamageTaken = 0;
  let totalTowersDestroyed = 0;
  const towers = [];
  const usedCells = new Set();

  const placeTower = (defId, slot) => {
    const def = TOWER_DEFINITIONS[defId];
    if (!def || budget < def.cost) return false;
    const key = `${slot.col},${slot.row}`;
    if (usedCells.has(key)) return false;
    usedCells.add(key);
    budget -= def.cost;
    const spec1 = getTowerLevelSpec(def, 1);
    towers.push({
      defId,
      def,
      col: slot.col,
      row: slot.row,
      x: slot.x,
      y: slot.y,
      level: 1,
      specialization: null,
      hp: spec1.maxHp || def.maxHp,
      maxHp: spec1.maxHp || def.maxHp,
      shield: 0,
      maxShield: 0,
      cd: 0,
      empTimer: 0,
      empDisabled: 0,
      incomeAccum: 0
    });
    return true;
  };

  // Balanced combined-arms build roster
  const buildPlan =
    strategy === 'ballista_only'
      ? ['ballista', 'ballista', 'ballista', 'ballista', 'ballista', 'ballista', 'ballista', 'ballista', 'ballista', 'ballista']
      : [
          'ballista',
          'm2_bunker',
          'flamethrower',
          'phalanx',
          'ew_crew',
          'cryo_tower',
          'tesla_tower',
          'abrams_pit',
          'iron_dome',
          'eng_workshop',
          'sniper_tower',
          'toxic_tower',
          'railgun',
          'patriot',
          'howitzer',
          'energy_extractor',
          'harpoon_tower',
          'tos1_mlrs'
        ];

  let nextPlanIdx = 0;
  const buyAndUpgrade = () => {
    // Emergency repairs first if any alive tower below 55% HP
    for (const t of towers) {
      if (t.hp < t.maxHp * 0.55) {
        const repCost = Math.max(10, Math.ceil(((t.maxHp - t.hp) / t.maxHp) * t.def.cost * 0.5));
        if (budget >= repCost) {
          budget -= repCost;
          t.hp = t.maxHp;
        }
      }
    }

    // Place core roster towers before stacking heavy upgrades
    const targetInitialCount = Math.min(strategy === 'ballista_only' ? 14 : 11, buildSlots.length);
    let progressed = true;
    while (progressed) {
      progressed = false;
      if (towers.length < targetInitialCount && nextPlanIdx < buildSlots.length) {
        const wanted = buildPlan[nextPlanIdx % buildPlan.length];
        const def = TOWER_DEFINITIONS[wanted];
        const slot = buildSlots.find((s) => !usedCells.has(`${s.col},${s.row}`));
        if (slot && budget >= def.cost && placeTower(wanted, slot)) {
          nextPlanIdx++;
          progressed = true;
          continue;
        }
      }

      if (strategy === 'combined_arms') {
        // Prioritize Radar & AA & Core DPS upgrades up to Lv6 with A/B specs
        const upgradeCandidate = towers
          .filter((t) => getTowerUpgradeOptions(t.def, t.level, t.specialization) !== null)
          .sort((a, b) => a.level - b.level)[0];
        if (upgradeCandidate) {
          const opt = getTowerUpgradeOptions(
            upgradeCandidate.def,
            upgradeCandidate.level,
            upgradeCandidate.specialization
          );
          if (opt.kind === 'common' && budget >= opt.cost) {
            budget -= opt.cost;
            upgradeCandidate.level = opt.nextLevel;
            const ns = getTowerLevelSpec(upgradeCandidate.def, upgradeCandidate.level, upgradeCandidate.specialization);
            upgradeCandidate.maxHp = ns.maxHp || Math.round(upgradeCandidate.def.maxHp * (1 + (upgradeCandidate.level - 1) * 0.35));
            upgradeCandidate.hp = upgradeCandidate.maxHp;
            progressed = true;
          } else if (opt.kind === 'specialize') {
            const branch = upgradeCandidate.level % 2 === 0 ? 'A' : 'B';
            const br = opt.branches[branch];
            if (budget >= br.cost) {
              budget -= br.cost;
              upgradeCandidate.specialization = branch;
              upgradeCandidate.level = opt.nextLevel;
              upgradeCandidate.hp = upgradeCandidate.maxHp;
              progressed = true;
            }
          }
        }
      }
    }
  };

  buyAndUpgrade();

  const dt = 0.1;
  const waveStats = [];

  for (const wave of stage.waves) {
    buyAndUpgrade();
    const waveQueue = [];
    for (const grp of wave.groups) {
      for (let i = 0; i < grp.count; i++) {
        waveQueue.push({
          time: grp.delay + i * grp.interval,
          type: grp.type,
          spawnIdx: i % pf.spawnPoints.length
        });
      }
    }
    waveQueue.sort((a, b) => a.time - b.time);

    const active = [];
    let elapsed = 0;
    const maxSimTime = 160;
    const hpMult = wave.hpMult || 1.0;

    while ((waveQueue.length > 0 || active.length > 0) && elapsed < maxSimTime && fobHp > 0) {
      elapsed += dt;
      while (waveQueue.length > 0 && waveQueue[0].time <= elapsed) {
        const sp = waveQueue.shift();
        const def = ENEMY_DEFINITIONS[sp.type];
        const spawnCell = pf.spawnPoints[sp.spawnIdx];
        const path = pf.spawnPaths.get(spawnCell.id) || [];
        active.push({
          type: sp.type,
          def,
          domain: def.domain,
          armorClass: def.armorClass,
          x: (spawnCell.col + 0.5) * TILE_SIZE,
          y: (spawnCell.row + 0.5) * TILE_SIZE,
          hp: Math.round(def.maxHp * hpMult),
          maxHp: Math.round(def.maxHp * hpMult),
          shield: Math.round((def.maxShield || 0) * (def.isBoss ? hpMult : 1)),
          maxShield: Math.round((def.maxShield || 0) * (def.isBoss ? hpMult : 1)),
          speed: def.speed,
          reward: def.reward,
          fobDamage: def.fobDamage,
          isMechanized: !!def.isMechanized,
          hasEra: !!def.hasEra,
          eraIntact: !!def.hasEra,
          hasAps: !!def.hasAps,
          apsCooldownTimer: 0,
          apsMaxCooldown: def.apsCooldown || 4,
          isStealth: !!def.isStealth,
          stealthRevealed: false,
          revealedTimer: 0,
          slowImmune: !!def.slowImmune,
          frontalShieldReduction: def.frontalShieldReduction || 0,
          isBurrowed: !!def.canBurrow,
          resistances: def.resistances || null,
          path,
          pathIdx: 1,
          distToFob: 9999,
          ewSlow: 0,
          ewDamageAmp: 0,
          thermalVuln: 0,
          markedAmp: 0,
          corrosionReduction: 0,
          cryoSlow: 0,
          cryoTimer: 0,
          rootTimer: 0,
          stunTimer: 0,
          burnTimer: 0,
          burnDps: 0,
          poisonTimer: 0,
          poisonDps: 0,
          ewDisabled: false,
          atkTimer: def.towerAttack ? Math.min(2.0, def.towerAttack.interval * 0.5) : 999
        });
      }

      // 1. Support Auras & Buffs
      let globalReveal = false;
      for (const t of towers) {
        t.maxShield = 0;
        if (t.empDisabled > 0) t.empDisabled = Math.max(0, t.empDisabled - dt);
        if (t.empDisabled <= 0 && getTowerLevelSpec(t.def, t.level, t.specialization)?.globalStealthReveal) {
          globalReveal = true;
        }
      }
      for (const e of active) {
        e.ewSlow = 0;
        e.ewDamageAmp = 0;
        e.ewDisabled = false;
        e.stealthRevealed = globalReveal || e.revealedTimer > 0;
        if (e.revealedTimer > 0) e.revealedTimer = Math.max(0, e.revealedTimer - dt);
        if (e.cryoTimer > 0) {
          e.cryoTimer -= dt;
          if (e.cryoTimer <= 0) e.cryoSlow = 0;
        }
        if (e.rootTimer > 0) e.rootTimer = Math.max(0, e.rootTimer - dt);
        if (e.stunTimer > 0) e.stunTimer = Math.max(0, e.stunTimer - dt);
        if (e.burnTimer > 0) {
          e.burnTimer -= dt;
          e.hp -= resolveDamage(e, e.burnDps * dt, 'fire', { allowApsIntercept: false }).damage;
        }
        if (e.poisonTimer > 0) {
          e.poisonTimer -= dt;
          e.hp -= resolveDamage(e, e.poisonDps * dt, 'poison', { allowApsIntercept: false, ignoreShield: true }).damage;
        }
      }

      for (const t of towers) {
        if (t.empDisabled > 0) continue;
        const spec = getTowerLevelSpec(t.def, t.level, t.specialization);
        if (t.defId === 'ew_crew') {
          t.empTimer += dt;
          const fireEmp = spec.empInterval > 0 && t.empTimer >= spec.empInterval;
          if (fireEmp) t.empTimer = 0;
          for (const e of active) {
            if (Math.hypot(e.x - t.x, e.y - t.y) <= spec.range) {
              e.ewSlow = Math.max(e.ewSlow, spec.slowFactor || 0);
              e.ewDamageAmp = Math.max(e.ewDamageAmp, spec.damageAmp || 0);
              e.ewDisabled = !!spec.disablesActiveDefense;
              e.stealthRevealed = true;
              e.revealedTimer = Math.max(e.revealedTimer, 1.5);
              if (e.isBurrowed && spec.globalStealthReveal) e.isBurrowed = false;
              if (fireEmp && (e.isMechanized || e.maxShield > 0)) {
                e.stunTimer = Math.max(e.stunTimer, spec.empStunDuration || 1);
                e.hp -= resolveDamage(e, spec.damage || 80, 'emp', { allowApsIntercept: false }).damage;
              }
            }
          }
        } else if (t.defId === 'iron_dome') {
          for (const ally of towers) {
            if (Math.hypot(ally.x - t.x, ally.y - t.y) <= spec.range) {
              ally.maxShield = Math.max(ally.maxShield, spec.shieldCapacity || 400);
              ally.shield = Math.min(ally.maxShield, ally.shield + (spec.shieldRegenPerSec || 40) * dt);
            }
          }
        } else if (t.defId === 'eng_workshop') {
          for (const ally of towers) {
            if (ally.hp < ally.maxHp && Math.hypot(ally.x - t.x, ally.y - t.y) <= spec.range) {
              ally.hp = Math.min(ally.maxHp, ally.hp + (spec.healPerSec || 24) * dt);
            }
          }
        } else if (t.defId === 'energy_extractor' && spec.incomePerSec > 0) {
          t.incomeAccum += spec.incomePerSec * dt;
          if (t.incomeAccum >= 5) {
            const g = Math.floor(t.incomeAccum);
            t.incomeAccum -= g;
            budget += g;
          }
        }
      }

      // 2. Tower Firing
      for (const t of towers) {
        if (t.def.isBarrier || t.def.isSupportAura || t.empDisabled > 0) continue;
        const spec = getTowerLevelSpec(t.def, t.level, t.specialization);
        t.cd -= dt;
        if (t.cd > 0 || !spec.fireRate) continue;
        const cands = active.filter((e) => {
          if (e.hp <= 0) return false;
          if (e.isStealth && !e.stealthRevealed) return false;
          if (e.isBurrowed && !e.stealthRevealed && (spec.splashRadius || 0) < 40) return false;
          if (t.def.domain === 'ground' && e.domain !== 'ground') return false;
          if (t.def.domain === 'air' && e.domain !== 'air') return false;
          const d = Math.hypot(e.x - t.x, e.y - t.y);
          return d <= spec.range && d >= (spec.minRange || 0);
        });
        if (cands.length === 0) continue;
        cands.sort((a, b) => a.distToFob - b.distToFob);
        t.cd = 1 / spec.fireRate;
        const primary = cands[0];

        if (spec.splashRadius > 0) {
          for (const e of cands) {
            if (Math.hypot(e.x - primary.x, e.y - primary.y) <= spec.splashRadius) {
              const r = resolveDamage(e, spec.damage, spec.damageType, {
                armorPierce: spec.armorPierce || 0,
                armorIgnore: spec.armorIgnore || 0,
                heavyMultiplier: spec.heavyMultiplier || 1,
                tandemHeat: !!spec.tandemHeat,
                isSplash: true,
                allowApsIntercept: false
              });
              e.hp -= r.damage;
              if (spec.burnDps) {
                e.burnDps = Math.max(e.burnDps, spec.burnDps);
                e.burnTimer = Math.max(e.burnTimer, spec.burnDuration || 4);
              }
              if (spec.poisonDps) {
                e.poisonDps = Math.max(e.poisonDps, spec.poisonDps);
                e.poisonTimer = Math.max(e.poisonTimer, spec.poisonDuration || 4);
              }
              if (spec.corrosionAmount) e.corrosionReduction = Math.max(e.corrosionReduction, spec.corrosionAmount);
              if (spec.slowFactor && !e.slowImmune) {
                e.cryoSlow = Math.max(e.cryoSlow, spec.slowFactor);
                e.cryoTimer = Math.max(e.cryoTimer, spec.slowDuration || 2);
              }
            }
          }
        } else {
          const hitList =
            t.defId === 'tesla_tower' || t.defId === 'railgun' || spec.multiTargets || spec.pierceCount || spec.beamTargets
              ? cands.slice(0, spec.chainCount || spec.pierceCount || spec.multiTargets || spec.beamTargets || 1)
              : [primary];
          for (const tgt of hitList) {
            const r = resolveDamage(tgt, spec.damage, spec.damageType, {
              armorPierce: spec.armorPierce || 0,
              armorIgnore: spec.armorIgnore || 0,
              heavyMultiplier: spec.heavyMultiplier || 1,
              tandemHeat: !!spec.tandemHeat,
              critChance: spec.critChance || 0,
              critMultiplier: spec.critMultiplier || 1.6,
              allowApsIntercept: false
            });
            tgt.hp -= r.damage;
            if (spec.rootDuration) tgt.rootTimer = Math.max(tgt.rootTimer, spec.rootDuration);
            if (spec.markedAmp) tgt.markedAmp = Math.max(tgt.markedAmp, spec.markedAmp);
            if (spec.corrosionAmount) tgt.corrosionReduction = Math.max(tgt.corrosionReduction, spec.corrosionAmount);
            if (spec.stunDuration && (tgt.isMechanized || tgt.maxShield > 0)) tgt.stunTimer = Math.max(tgt.stunTimer, spec.stunDuration);
          }
        }
      }

      // 3. Remove Dead Enemies, Move Survivors, & Enemy Tower Attacks
      for (let i = active.length - 1; i >= 0; i--) {
        const e = active[i];
        if (e.hp <= 0) {
          budget += e.reward;
          active.splice(i, 1);
          continue;
        }
        if (e.def.canBurrow && e.isBurrowed && (towers.some((t) => Math.hypot(t.x - e.x, t.y - e.y) <= 95) || e.hp < e.maxHp * 0.6)) {
          e.isBurrowed = false;
        }

        // Enemy weapons damage nearest tower
        if (e.def.towerAttack && towers.length > 0 && !e.isBurrowed && e.stunTimer <= 0) {
          e.atkTimer -= dt;
          if (e.atkTimer <= 0) {
            const atk = e.def.towerAttack;
            const inRangeT = towers.filter((t) => Math.hypot(t.x - e.x, t.y - e.y) <= atk.range);
            if (inRangeT.length > 0) {
              e.atkTimer = atk.interval;
              const targetT = inRangeT[0];
              let dmg = atk.damage;
              if (targetT.shield > 0) {
                const abs = Math.min(targetT.shield, dmg);
                targetT.shield -= abs;
                dmg -= abs;
              }
              totalTowerDamageTaken += atk.damage;
              targetT.hp -= dmg;
              if (atk.empDisableDuration) targetT.empDisabled = Math.max(targetT.empDisabled, atk.empDisableDuration * 0.5);
              if (targetT.hp <= 0) {
                totalTowersDestroyed++;
                usedCells.delete(`${targetT.col},${targetT.row}`);
                budget += Math.round(targetT.def.cost * 0.3);
                const idx = towers.indexOf(targetT);
                if (idx !== -1) towers.splice(idx, 1);
              }
            } else {
              e.atkTimer = 0.5;
            }
          }
        }

        const slow = e.slowImmune ? 0 : Math.min(0.75, Math.max(e.ewSlow, e.cryoSlow));
        const spd = e.stunTimer > 0 || e.rootTimer > 0 ? 0 : e.speed * (1 - slow);

        if (e.domain === 'ground' && e.path.length > 0) {
          const wp = e.path[Math.min(e.pathIdx, e.path.length - 1)];
          const dx = wp.x - e.x;
          const dy = wp.y - e.y;
          const dist = Math.hypot(dx, dy);
          if (dist <= spd * dt + 2) {
            e.x = wp.x;
            e.y = wp.y;
            if (e.pathIdx < e.path.length - 1) e.pathIdx++;
          } else if (dist > 0) {
            e.x += (dx / dist) * spd * dt;
            e.y += (dy / dist) * spd * dt;
          }
          e.distToFob = pf.getDistanceToFobPx(e.x, e.y);
        } else {
          const fx = (pf.fobPoint.col + 0.5) * TILE_SIZE;
          const fy = (pf.fobPoint.row + 0.5) * TILE_SIZE;
          const dx = fx - e.x;
          const dy = fy - e.y;
          const d = Math.hypot(dx, dy);
          if (d > 1) {
            e.x += (dx / d) * spd * dt;
            e.y += (dy / d) * spd * dt;
          }
          e.distToFob = d;
        }

        const fx = (pf.fobPoint.col + 0.5) * TILE_SIZE;
        const fy = (pf.fobPoint.row + 0.5) * TILE_SIZE;
        if (Math.hypot(fx - e.x, fy - e.y) < 22) {
          fobHp = Math.max(0, fobHp - e.fobDamage);
          active.splice(i, 1);
        }
      }
    }

    const interest = Math.min(180, Math.floor(budget * 0.05));
    budget += interest;
    waveStats.push({ wave: wave.wave, fobHp, budget, towersAlive: towers.length });
    if (fobHp <= 0) break;
  }

  return {
    stageId,
    strategy,
    fobHp,
    budget,
    towersAlive: towers.length,
    totalTowerDamageTaken,
    totalTowersDestroyed,
    wavesCleared: waveStats.filter((w) => w.fobHp > 0).length,
    waveStats
  };
}

test('Balance Simulation: combined-arms + upgrades beats all 5 World 4 stages with active structural combat', () => {
  for (const stageId of [1, 2, 3, 4, 5]) {
    const res = simulateStage(stageId, 'combined_arms');
    assert.equal(
      res.wavesCleared,
      10,
      `Stage 4-${stageId} should clear all 10 waves with combined arms (cleared ${res.wavesCleared}, fobHp=${res.fobHp})`
    );
    assert.ok(res.fobHp > 0 && res.fobHp <= 20, `Stage 4-${stageId} ended with invalid FOB HP ${res.fobHp}`);
    assert.ok(
      res.totalTowerDamageTaken > 0,
      `Stage 4-${stageId} enemy weapons must engage and damage player structures (damageTaken=${res.totalTowerDamageTaken})`
    );
  }
});

test('Balance Anti-Exploit: single low-tier Ballista spam cannot clear stealth/air/boss late-game stage 4-5', () => {
  const exploitRes = simulateStage(5, 'ballista_only');
  assert.ok(
    exploitRes.fobHp <= 0 || exploitRes.wavesCleared < 10,
    `Single-tower Ballista spam should NOT sweep World 4-5 boss stage (fobHp=${exploitRes.fobHp}, cleared=${exploitRes.wavesCleared})`
  );
});
