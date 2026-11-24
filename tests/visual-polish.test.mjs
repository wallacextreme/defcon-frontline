import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';

import {
  createA10Warthog3D,
  createB52Bomber3D,
  createMissileMesh3D,
  createTowerModel3D
} from '../src/three/MilitaryModels3D.ts';
import {
  StaticMeshBatcher,
  getMats,
  enableShadows
} from '../src/three/TowerRigPrimitives.ts';
import {
  SPLAT_WIDTH,
  SPLAT_HEIGHT,
  createBiomeSplatData,
  createBiomeRoadMarksTexture
} from '../src/three/TerrainSplatting3D.ts';
import { getStageConfig } from '../src/data/worlds.js';
import { Pathfinder, GRID_COLS, GRID_ROWS, CELL } from '../src/systems/Pathfinder.js';

function createMockDocumentCanvas() {
  const prevDoc = globalThis.document;
  const makeCtx = (canvas) => ({
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    lineDashOffset: 0,
    globalAlpha: 1,
    font: '12px monospace',
    textAlign: 'left',
    save() {},
    restore() {},
    translate() {},
    rotate() {},
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    arc() {},
    quadraticCurveTo() {},
    ellipse() {},
    fill() {},
    stroke() {},
    fillRect() {},
    strokeRect() {},
    clearRect() {},
    setLineDash() {},
    createLinearGradient: () => ({ addColorStop() {} }),
    createRadialGradient: () => ({ addColorStop() {} }),
    getImageData: (_x, _y, w, h) => ({
      width: w || canvas.width || 1,
      height: h || canvas.height || 1,
      data: new Uint8ClampedArray((w || canvas.width || 1) * (h || canvas.height || 1) * 4)
    }),
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }),
    putImageData() {}
  });
  globalThis.document = {
    createElement: (tag) => {
      if (tag !== 'canvas') return {};
      const canvas = { width: 512, height: 512 };
      const ctx = makeCtx(canvas);
      canvas.getContext = () => ctx;
      return canvas;
    }
  };
  return () => {
    if (prevDoc === undefined) delete globalThis.document;
    else globalThis.document = prevDoc;
  };
}

function assertFiniteMeshes(root, label) {
  let meshCount = 0;
  let totalTris = 0;
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.geometry) return;
    meshCount++;
    const pos = obj.geometry.getAttribute('position');
    assert.ok(pos && pos.count > 0, `${label}: mesh has empty position attribute`);
    for (let i = 0; i < pos.count; i++) {
      assert.ok(
        Number.isFinite(pos.getX(i)) && Number.isFinite(pos.getY(i)) && Number.isFinite(pos.getZ(i)),
        `${label}: non-finite vertex at index ${i}`
      );
    }
    const idx = obj.geometry.getIndex();
    totalTris += idx ? idx.count / 3 : pos.count / 3;
  });
  assert.ok(meshCount > 0, `${label}: expected >= 1 mesh`);
  return { meshCount, totalTris };
}

test('Stage 5A/5B Aircraft & Missiles: A-10, B-52 and all missile kinds are AAA batched with valid +Z silhouettes & noShadow exhausts', () => {
  const restoreDoc = createMockDocumentCanvas();
  try {
    const a10 = createA10Warthog3D();
    const a10Stats = assertFiniteMeshes(a10, 'A-10 Warthog');
    assert.ok(a10Stats.meshCount <= 14, `A-10 batched meshCount too high: ${a10Stats.meshCount}`);
    assert.ok(a10Stats.totalTris >= 800, `A-10 expected rich geometry, got ${a10Stats.totalTris} tris`);
    const a10Box = new THREE.Box3().setFromObject(a10);
    assert.ok(a10Box.max.z > 1.0 && a10Box.min.z < -1.0, 'A-10 spans along Z axis');
    assert.ok(a10Box.max.x - a10Box.min.x > 6.0, 'A-10 has wide straight wingspan');

    const b52 = createB52Bomber3D();
    const b52Stats = assertFiniteMeshes(b52, 'B-52 Bomber');
    assert.ok(b52Stats.meshCount <= 10, `B-52 batched meshCount too high: ${b52Stats.meshCount}`);
    assert.ok(b52Stats.totalTris >= 800, `B-52 expected rich geometry, got ${b52Stats.totalTris} tris`);
    const b52Box = new THREE.Box3().setFromObject(b52);
    assert.ok(b52Box.max.x - b52Box.min.x > 10.0, 'B-52 has heavy bomber wingspan');

    const kinds = ['patriot', 'hellfire', 'javelin', 'boss_missile', 'enemy_emp', 'enemy_acid', 'enemy_cryo', 'toxic', 'cryo'];
    for (const kind of kinds) {
      const missile = createMissileMesh3D(kind);
      const mStats = assertFiniteMeshes(missile, `Missile(${kind})`);
      assert.ok(mStats.meshCount >= 2 && mStats.meshCount <= 8, `Missile(${kind}) meshCount=${mStats.meshCount}`);
      let hasNoShadowPlume = false;
      missile.traverse((obj) => {
        if (obj.isMesh && obj.userData?.noShadow) {
          assert.equal(obj.castShadow, false, `Missile(${kind}) plume must not cast shadows`);
          hasNoShadowPlume = true;
        }
      });
      assert.ok(hasNoShadowPlume, `Missile(${kind}) must mark exhaust plume userData.noShadow`);
    }
  } finally {
    restoreDoc();
  }
});

test('Stage 5A Shadow-Pass Trim: non-silhouette trims skip castShadow while structural hulls preserve shadows', () => {
  const restoreDoc = createMockDocumentCanvas();
  try {
    const unitBox = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const batcher = new StaticMeshBatcher('test_shadow_trim', 1, null);
    batcher.add('root', 'darkSteel', unitBox, 0, 0.5, 0);
    batcher.add('root', 'brass', unitBox, 0.2, 0.6, 0.2);
    batcher.add('root', 'sapphireOptic', unitBox, -0.2, 0.7, 0.1);
    batcher.add('root', 'copperAesa', unitBox, 0, 0.8, 0.3);
    const grp = new THREE.Group();
    batcher.flush({ root: grp }, getMats());
    enableShadows(grp, true, true);

    let structuralCasts = 0;
    let trimCasts = 0;
    let trimReceives = 0;
    grp.traverse((obj) => {
      if (!obj.isMesh) return;
      if (obj.userData?.noCastShadow) {
        assert.equal(obj.castShadow, false, 'noCastShadow trim must have castShadow=false');
        trimCasts++;
        if (obj.receiveShadow) trimReceives++;
      } else if (obj.castShadow) {
        structuralCasts++;
      }
    });
    assert.equal(structuralCasts, 1, 'structural darkSteel batch casts shadow');
    assert.equal(trimCasts, 3, 'brass/sapphireOptic/copperAesa trims skip shadow pass');
    assert.equal(trimReceives, 3, 'trims keep receiveShadow=true');

    // Verify upgraded towers preserve structural shadow casting while skipping non-silhouette trims
    let towerCast = 0;
    let towerNoCast = 0;
    for (const defId of ['ballista', 'cryo_tower', 'railgun', 'iron_dome']) {
      const rig = createTowerModel3D(defId, 6, 'B');
      enableShadows(rig.root, true, true);
      rig.root.traverse((obj) => {
        if (!obj.isMesh) return;
        if (obj.castShadow) towerCast++;
        if (obj.userData?.noCastShadow) {
          assert.equal(obj.castShadow, false, `${defId} noCastShadow trim skips shadow pass`);
          towerNoCast++;
        }
      });
    }
    assert.ok(towerCast >= 20, `upgraded towers preserve structural shadow casting (got ${towerCast})`);
    assert.ok(towerNoCast >= 10, `upgraded towers skip shadow pass on trims/optics (got ${towerNoCast})`);
  } finally {
    restoreDoc();
  }
});

test('Stage 5A Splatting Fixes: 4-1 parallel double-lane corridor has zero inner oval berm holes & 4-3 arctic road raises contrast', () => {
  const restoreDoc = createMockDocumentCanvas();
  try {
    const stage41 = getStageConfig(4, 1);
    const pf = new Pathfinder();
    pf.loadStageLayout(stage41);
    const splat41 = createBiomeSplatData(pf.grid, 'forest');

    // Inspect centerline along rows 7-8 seam (parallel double-lane row corridor cols 1..7)
    // World grid 28 cols -> splat width 256, grid 16 rows -> splat height 146.
    const seamY = Math.round((8 / GRID_ROWS) * SPLAT_HEIGHT);
    let bermDrops = 0;
    let sampled = 0;
    for (let col = 2; col <= 7; col++) {
      if (pf.grid[7]?.[col] === CELL.ROAD && pf.grid[8]?.[col] === CELL.ROAD) {
        const px = Math.round(((col + 0.5) / GRID_COLS) * SPLAT_WIDTH);
        const idx = (seamY * SPLAT_WIDTH + px) * 4;
        const rRoad = splat41[idx];
        const gBerm = splat41[idx + 1];
        sampled++;
        if (gBerm > rRoad) bermDrops++;
      }
    }
    assert.ok(sampled >= 4, 'Stage 4-1 must contain parallel double-lane cells along rows 7-8');
    assert.equal(bermDrops, 0, `4-1 double-lane interior seam must have 0 berm oval drops (got ${bermDrops}/${sampled})`);

    // Road marks texture still generates cleanly on forest 4-1 & arctic 4-3
    const marks41 = createBiomeRoadMarksTexture(pf.grid, 'forest');
    assert.ok(marks41.isTexture);
    marks41.dispose();

    const terrainSrc = fs.readFileSync(path.resolve('src/three/TerrainSplatting3D.ts'), 'utf8');
    const arcticMatch = terrainSrc.match(/arctic:\s*\{[\s\S]*?roadBase:\s*\[(\d+),\s*(\d+),\s*(\d+)\]/);
    assert.ok(arcticMatch, 'TerrainSplatting3D arctic palette must define roadBase');
    const [, arR, arG, arB] = arcticMatch.map(Number);
    const arcticLuma = 0.2126 * arR + 0.7152 * arG + 0.0722 * arB;
    assert.ok(
      arcticLuma >= 75 && arcticLuma <= 125,
      `Arctic road albedo luminance calibrated for >=3:1 contrast vs snow & dark enemies (got ${arcticLuma.toFixed(1)} from [${arR},${arG},${arB}])`
    );
  } finally {
    restoreDoc();
  }
});

test('Stage 5A/5B UI, Quality Wiring & Projectile Polish contracts', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const css = fs.readFileSync(path.resolve('src/styles/tactical.css'), 'utf8');
  const hud = fs.readFileSync(path.resolve('src/ui/HudController.js'), 'utf8');
  const saveMgr = fs.readFileSync(path.resolve('src/systems/SaveManager.ts'), 'utf8');
  const bf = fs.readFileSync(path.resolve('src/three/Battlefield3D.ts'), 'utf8');

  // Topbar mobile responsive spans & CSS rules
  assert.match(html, /class="hide-sm-label"/, 'index.html uses hide-sm-label for compact mobile topbar');
  assert.match(html, /id="quality-mode-badge"/, '#tab-save includes quality mode badge');
  assert.match(html, /id="help-quality-badge"/, '#help-modal includes mirrored quality mode badge');
  for (const tier of ['low', 'medium', 'high', 'ultra']) {
    const matches = html.match(new RegExp(`data-quality="${tier}"`, 'g')) || [];
    assert.ok(matches.length >= 2, `Tier ${tier} button present in both #tab-save and #help-modal`);
  }
  assert.match(css, /\.hide-sm-label\s*\{\s*display:\s*none;\s*\}/, 'tactical.css hides verbose topbar labels under 640px');
  assert.match(css, /\.quality-settings-card/, 'tactical.css styles quality selector card');

  // Quality selector bus wiring & SaveManager isolation
  assert.match(hud, /bus\.emit\('cmd:setQuality'/, 'HudController emits cmd:setQuality');
  assert.match(hud, /bus\.on\('quality:changed'/, 'HudController listens to quality:changed');
  assert.match(hud, /state\?\.qualityTier|s\.qualityTier/, 'HudController syncs qualityTier on hud:state');
  assert.doesNotMatch(saveMgr, /graphicsQuality|qualityTier/, 'SaveManager schema remains 100% untouched');

  // Battlefield3D wiring & visual polish
  assert.match(bf, /bus\.on\('cmd:setQuality'/, 'Battlefield3D handles cmd:setQuality');
  assert.match(bf, /bus\.emit\('quality:changed'/, 'Battlefield3D broadcasts quality:changed');
  assert.match(bf, /qualityTier:\s*this\.qualityConfig\.tier/, 'Battlefield3D emits qualityTier in hud:state');
  assert.doesNotMatch(bf, /private bulletGeo\s*=\s*new THREE\.BoxGeometry/, 'bulletGeo is no longer crude BoxGeometry');
  assert.doesNotMatch(bf, /private shellGeo\s*=\s*new THREE\.SphereGeometry/, 'shellGeo is no longer crude SphereGeometry');
  assert.match(bf, /private ewPulseGeo\s*=\s*new THREE\.RingGeometry\(0\.965,\s*1\.0,\s*48\)/, 'ewPulseGeo uses ultra-thin hairline ring');
});
