import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import {
  createTowerModel3D,
  createGhostTower3D,
  getMats,
  updateTowerWearBiomeDirtColor
} from '../src/three/MilitaryModels3D.ts';
import {
  computeTerrainMicroReliefY,
  createDesertSplatData,
  createDesertTerrainWarmMesh,
  disposeDesertDetailTextureCache,
  SPLAT_WIDTH,
  SPLAT_HEIGHT
} from '../src/three/TerrainSplatting3D.ts';
import { cellToWorldCenter, BOARD_W, BOARD_D } from '../src/three/TerrainDiorama3D.ts';
import { Pathfinder, GRID_COLS, GRID_ROWS, CELL } from '../src/systems/Pathfinder.js';
import { getStageConfig } from '../src/data/worlds.js';

const SLICE_TOWERS = ['howitzer', 'patriot', 'tesla_tower', 'phalanx', 'ew_crew'];

const SLICE_MODEL_STATES = [
  { key: 'lv1', level: 1, spec: null },
  { key: 'lv2', level: 2, spec: null },
  { key: 'lv4', level: 4, spec: null },
  { key: '5A', level: 5, spec: 'A' },
  { key: '6B', level: 6, spec: 'B' }
];

function createStub2DContext(canvas) {
  const noop = () => {};
  const grad = { addColorStop: noop };
  return {
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    save: noop,
    restore: noop,
    translate: noop,
    rotate: noop,
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    ellipse: noop,
    arc: noop,
    fill: noop,
    stroke: noop,
    fillRect: noop,
    strokeRect: noop,
    setLineDash: noop,
    createRadialGradient: () => grad,
    getImageData: (_x, _y, w, h) => ({
      width: w || canvas.width || 1,
      height: h || canvas.height || 1,
      data: new Uint8ClampedArray((w || canvas.width || 1) * (h || canvas.height || 1) * 4)
    }),
    createImageData: (w, h) => ({
      width: w,
      height: h,
      data: new Uint8ClampedArray(w * h * 4)
    }),
    putImageData: noop
  };
}

function withHeadlessCanvasDocument(fn) {
  const prevDoc = globalThis.document;
  if (prevDoc === undefined) {
    globalThis.document = {
      createElement(tag) {
        if (tag !== 'canvas') return {};
        const canvas = { width: 512, height: 512 };
        const ctx = createStub2DContext(canvas);
        canvas.getContext = () => ctx;
        return canvas;
      }
    };
  }
  try {
    return fn();
  } finally {
    if (prevDoc === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = prevDoc;
    }
  }
}

function assertFiniteAttribute(attr, label) {
  assert.ok(attr, `${label}: missing attribute`);
  assert.ok(attr.count > 0, `${label}: empty attribute count`);
  const arr = attr.array;
  for (let i = 0; i < arr.length; i++) {
    assert.ok(Number.isFinite(arr[i]), `${label}: non-finite value at index ${i}`);
  }
}

function validateGeometry(geo, label, { requireNormalsAndUvs = true } = {}) {
  assert.ok(geo instanceof THREE.BufferGeometry, `${label}: expected BufferGeometry`);
  const pos = geo.getAttribute('position');
  assertFiniteAttribute(pos, `${label}.position`);

  if (requireNormalsAndUvs) {
    assertFiniteAttribute(geo.getAttribute('normal'), `${label}.normal`);
    assertFiniteAttribute(geo.getAttribute('uv'), `${label}.uv`);
    assert.equal(geo.getAttribute('normal').count, pos.count, `${label}: normal count mismatch`);
    assert.equal(geo.getAttribute('uv').count, pos.count, `${label}: uv count mismatch`);
  }

  if (geo.index) {
    assert.ok(geo.index.count > 0 && geo.index.count % 3 === 0, `${label}: invalid index count`);
    const idxArr = geo.index.array;
    for (let i = 0; i < idxArr.length; i++) {
      assert.ok(
        Number.isInteger(idxArr[i]) && idxArr[i] >= 0 && idxArr[i] < pos.count,
        `${label}: out-of-bounds index ${idxArr[i]}`
      );
    }
  }
}

function getMeshTriangleCount(mesh) {
  const geo = mesh.geometry;
  if (!geo) return 0;
  if (geo.index) return geo.index.count / 3;
  const pos = geo.getAttribute('position');
  return pos ? pos.count / 3 : 0;
}

function countRigTriangles(root, { excludeNoShadow = false } = {}) {
  let tris = 0;
  root.traverse((child) => {
    if (!child.isMesh) return;
    if (excludeNoShadow && child.userData?.noShadow) return;
    tris += getMeshTriangleCount(child);
  });
  return tris;
}

function computeStructuralBounds(root) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3();
  const childBox = new THREE.Box3();
  let hasMesh = false;
  root.traverse((child) => {
    if (!child.isMesh || child.userData?.noShadow) return;
    if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
    childBox.copy(child.geometry.boundingBox).applyMatrix4(child.matrixWorld);
    box.union(childBox);
    hasMesh = true;
  });
  assert.ok(hasMesh, 'expected at least one structural mesh for bounds');
  const size = new THREE.Vector3();
  box.getSize(size);
  return { box, size };
}

function isDescendantOf(node, ancestor) {
  let cur = node;
  while (cur) {
    if (cur === ancestor) return true;
    cur = cur.parent;
  }
  return false;
}

test('Vertical Slice Towers: 5 towers x 6 states valid geometry, triangle budget, compact batching, and ghost contract', () => {
  withHeadlessCanvasDocument(() => {
    for (const defId of SLICE_TOWERS) {
      for (const state of SLICE_MODEL_STATES) {
        const tag = `${defId}@${state.key}`;
        const rig = createTowerModel3D(defId, state.level, state.spec);
        assert.ok(rig.root instanceof THREE.Group, `${tag}: root must be THREE.Group`);
        rig.root.updateMatrixWorld(true);

        const missileCapSet = new Set(rig.missileCaps ?? []);
        let totalTris = 0;
        let structuralMeshCount = 0;
        let maxRLow = 0;
        const vLow = new THREE.Vector3();

        rig.root.traverse((node) => {
          // Check direct non-noShadow, non-missileCap drawables on root and every pivot/sub-group
          let directCompactMeshes = 0;
          for (const child of node.children) {
            if (!child.isMesh) continue;
            validateGeometry(child.geometry, `${tag}:${child.name || 'mesh'}`, {
              requireNormalsAndUvs: true
            });
            totalTris += getMeshTriangleCount(child);
            if (!child.userData?.noShadow && !missileCapSet.has(child)) {
              directCompactMeshes++;
              structuralMeshCount++;
            }
            if (!child.userData?.noShadow) {
              const posAttr = child.geometry.getAttribute('position');
              for (let i = 0; i < posAttr.count; i++) {
                vLow.fromBufferAttribute(posAttr, i).applyMatrix4(child.matrixWorld);
                if (vLow.y <= 0.28) {
                  const rHoriz = Math.hypot(vLow.x, vLow.z);
                  if (rHoriz > maxRLow) maxRLow = rHoriz;
                }
              }
            }
          }
          assert.ok(
            directCompactMeshes <= 8,
            `${tag}: node "${node.name || 'pivot'}" has ${directCompactMeshes} unbatched non-noShadow meshes (expected <= 8)`
          );
        });

        assert.ok(structuralMeshCount >= 1, `${tag}: expected >= 1 structural mesh`);
        assert.ok(totalTris > 0 && totalTris <= 4500, `${tag}: triangle budget ${totalTris} out of (0, 4500]`);
        assert.ok(
          maxRLow <= 1.84,
          `${tag}: base radius at y <= 0.28 is ${maxRLow.toFixed(3)} (> 1.84 risks clipping ownerRingMesh 1.90..1.99)`
        );
      }

      // State 6: Ghost hologram contract (exact 2 drawables: 1 Mesh + 1 LineSegments of EdgesGeometry)
      const ghost = createGhostTower3D(defId);
      assert.ok(ghost.root instanceof THREE.Group, `${defId}@ghost: root must be THREE.Group`);
      assert.equal(typeof ghost.setValid, 'function', `${defId}@ghost: setValid must be a function`);

      const drawables = [];
      ghost.root.traverse((child) => {
        if (child.isMesh || child.isLine || child.isLineSegments || child.isPoints) {
          drawables.push(child);
        }
      });

      assert.equal(drawables.length, 2, `${defId}@ghost: expected exactly 2 drawables, got ${drawables.length}`);
      const meshes = drawables.filter((d) => d.isMesh);
      const lines = drawables.filter((d) => d.isLineSegments);
      assert.equal(meshes.length, 1, `${defId}@ghost: expected 1 Mesh`);
      assert.equal(lines.length, 1, `${defId}@ghost: expected 1 LineSegments`);

      const holoMesh = meshes[0];
      const edgesLines = lines[0];
      validateGeometry(holoMesh.geometry, `${defId}@ghost.mesh`, { requireNormalsAndUvs: true });
      validateGeometry(edgesLines.geometry, `${defId}@ghost.edges`, { requireNormalsAndUvs: false });
      assert.equal(edgesLines.geometry.getAttribute('position').count % 2, 0, `${defId}@ghost: line pairs must be even`);

      const ghostTris = getMeshTriangleCount(holoMesh);
      assert.ok(ghostTris > 0 && ghostTris <= 4500, `${defId}@ghost: tris ${ghostTris} out of (0, 4500]`);
      assert.equal(holoMesh.material.transparent, true);
      assert.equal(holoMesh.material.depthWrite, false);
      assert.equal(holoMesh.castShadow, false);
      assert.equal(holoMesh.receiveShadow, false);
      assert.equal(edgesLines.renderOrder, 2);

      ghost.setValid(false);
      assert.equal(holoMesh.material.color.getHex(), 0xf97316);
      assert.equal(edgesLines.material.color.getHex(), 0xfdba74);
      ghost.setValid(true);
      assert.equal(holoMesh.material.color.getHex(), 0x38bdf8);
      assert.equal(edgesLines.material.color.getHex(), 0x7dd3fc);
    }
  });
});

test('Vertical Slice Towers: complete coverage of all 9 active TowerRig3D fields', () => {
  withHeadlessCanvasDocument(() => {
    const expectedFields = [
      'turretPivot',
      'barrelPivot',
      'gatlingPivot',
      'radarPivots',
      'ewRings',
      'missileCaps',
      'muzzlePoint',
      'muzzleFlashMesh',
      'aesaPanel'
    ];
    const coveredFields = new Set();

    const markCovered = (rig, fields) => {
      for (const f of fields) {
        const val = rig[f];
        if (Array.isArray(val)) {
          assert.ok(val.length > 0, `expected non-empty array for rig.${f}`);
          for (const item of val) {
            assert.ok(item instanceof THREE.Object3D && isDescendantOf(item, rig.root));
          }
        } else {
          assert.ok(val instanceof THREE.Object3D && isDescendantOf(val, rig.root), `expected Object3D for rig.${f}`);
        }
        coveredFields.add(f);
      }
    };

    // howitzer Lv1 + Lv4 (barrelPivot + batched missileCaps)
    const howitzerLv1 = createTowerModel3D('howitzer', 1);
    markCovered(howitzerLv1, ['turretPivot', 'barrelPivot', 'muzzlePoint', 'muzzleFlashMesh']);
    const howitzerLv4 = createTowerModel3D('howitzer', 4);
    markCovered(howitzerLv4, ['turretPivot', 'barrelPivot', 'missileCaps', 'muzzlePoint', 'muzzleFlashMesh']);
    assert.ok(howitzerLv4.missileCaps.length >= 1);
    assert.ok(howitzerLv4.missileCaps[0] instanceof THREE.Mesh);
    assert.equal(howitzerLv4.missileCaps[0].userData.noShadow, true);

    // patriot Lv2 (aesaPanel + batched missileCaps) + Lv4 (radarPivots + aesaPanel + batched missileCaps)
    const patriotLv2 = createTowerModel3D('patriot', 2);
    markCovered(patriotLv2, ['turretPivot', 'aesaPanel', 'missileCaps', 'muzzlePoint', 'muzzleFlashMesh']);
    assert.ok(patriotLv2.aesaPanel instanceof THREE.Mesh);
    assert.equal(patriotLv2.aesaPanel.userData.noShadow, true);
    assert.ok(patriotLv2.missileCaps.length >= 1);
    assert.ok(patriotLv2.missileCaps[0] instanceof THREE.Mesh);
    assert.equal(patriotLv2.missileCaps[0].userData.noShadow, true);

    const patriotLv4 = createTowerModel3D('patriot', 4);
    markCovered(patriotLv4, ['turretPivot', 'aesaPanel', 'radarPivots', 'missileCaps', 'muzzlePoint', 'muzzleFlashMesh']);
    assert.equal(patriotLv4.radarPivots.length, 2);
    assert.ok(patriotLv4.missileCaps.length >= 1);
    assert.ok(patriotLv4.missileCaps[0] instanceof THREE.Mesh);
    assert.equal(patriotLv4.missileCaps[0].userData.noShadow, true);
    assert.ok(
      getMeshTriangleCount(patriotLv4.missileCaps[0]) > getMeshTriangleCount(patriotLv2.missileCaps[0]),
      'patriotLv4 batched missileCaps (12) must have more triangles than patriotLv2 (8)'
    );

    // phalanx Lv1 (gatlingPivot + barrelPivot)
    const phalanxLv1 = createTowerModel3D('phalanx', 1);
    markCovered(phalanxLv1, ['turretPivot', 'barrelPivot', 'gatlingPivot', 'muzzlePoint', 'muzzleFlashMesh']);

    // tesla_tower Lv1
    const teslaLv1 = createTowerModel3D('tesla_tower', 1);
    markCovered(teslaLv1, ['turretPivot', 'muzzlePoint', 'muzzleFlashMesh']);

    // ew_crew Lv1 & Lv2 (radarPivots + ewRings)
    const ewLv1 = createTowerModel3D('ew_crew', 1);
    markCovered(ewLv1, ['radarPivots', 'ewRings']);
    assert.equal(ewLv1.radarPivots.length, 3);
    assert.equal(ewLv1.ewRings.length, 1);

    const ewLv2 = createTowerModel3D('ew_crew', 2);
    markCovered(ewLv2, ['turretPivot', 'radarPivots', 'ewRings']);
    assert.equal(ewLv2.radarPivots.length, 2);
    assert.equal(ewLv2.ewRings.length, 2);

    assert.deepEqual([...coveredFields].sort(), [...expectedFields].sort());
  });
});

test('Vertical Slice Towers: real geometric differentiation between 5A and 6B (beyond emblem rings)', () => {
  withHeadlessCanvasDocument(() => {
    for (const defId of SLICE_TOWERS) {
      const rigA = createTowerModel3D(defId, 5, 'A');
      const rigB = createTowerModel3D(defId, 6, 'B');

      // Exclude noShadow decorative rings/shadows so only structural geometry counts
      const trisA = countRigTriangles(rigA.root, { excludeNoShadow: true });
      const trisB = countRigTriangles(rigB.root, { excludeNoShadow: true });
      const boundsA = computeStructuralBounds(rigA.root).size;
      const boundsB = computeStructuralBounds(rigB.root).size;

      const triDelta = Math.abs(trisA - trisB);
      const maxBoxDelta = Math.max(
        Math.abs(boundsA.x - boundsB.x),
        Math.abs(boundsA.y - boundsB.y),
        Math.abs(boundsA.z - boundsB.z)
      );

      assert.ok(
        triDelta > 0 || maxBoxDelta > 0.05,
        `${defId}: 5A vs 6B must differ structurally (trisA=${trisA}, trisB=${trisB}, boxDelta=${maxBoxDelta.toFixed(4)})`
      );
    }
  });
});

test('MilitaryModels3D: calibrated dielectric PBR materials (metalness <= 0.05) and biome dirt uniform sync', () => {
  withHeadlessCanvasDocument(() => {
    const mats = getMats();

    const dielectricKeys = [
      'olive',
      'oliveDark',
      'desertArmor',
      'sandbag',
      'concrete',
      'concreteDark',
      'navalWhite',
      'navalGray',
      'rusCamo',
      'rusDark',
      'tire',
      'camoNet'
    ];

    for (const key of dielectricKeys) {
      const mat = mats[key];
      assert.ok(mat instanceof THREE.MeshStandardMaterial, `${key}: expected MeshStandardMaterial`);
      assert.ok(
        mat.metalness >= 0 && mat.metalness <= 0.05,
        `${key}: dielectric metalness ${mat.metalness} must be <= 0.05`
      );
      assert.equal(mat.vertexColors, false, `${key}: shared cached material must keep vertexColors=false`);
    }

    for (const metalKey of ['gunmetal', 'steel', 'darkSteel', 'diamondPlate', 'brass', 'copperAesa']) {
      assert.ok(
        mats[metalKey].metalness >= 0.75,
        `${metalKey}: bare metal must keep metalness >= 0.75, got ${mats[metalKey].metalness}`
      );
    }

    // Simulate r187 shader compile on wear-patched armor material and verify in-place biome dirt update
    const mockShader = {
      uniforms: {},
      vertexShader: THREE.ShaderLib.standard.vertexShader,
      fragmentShader: THREE.ShaderLib.standard.fragmentShader
    };
    const cacheKeyBefore = mats.olive.customProgramCacheKey();
    mats.olive.onBeforeCompile(mockShader, null);
    assert.ok(mockShader.uniforms.uDefconDirtColor, 'expected uDefconDirtColor uniform on wear material');

    for (const biome of ['desert', 'arctic', 'industrial', 'forest', 'canyon', 'swamp', 'volcanic']) {
      updateTowerWearBiomeDirtColor(biome);
      assert.equal(mats.olive.customProgramCacheKey(), cacheKeyBefore);
    }
    const arcticHex = (() => {
      updateTowerWearBiomeDirtColor('arctic');
      return mats.olive.userData.defconWearUniforms.uDefconDirtColor.value.getHex();
    })();
    const desertHex = (() => {
      updateTowerWearBiomeDirtColor('desert');
      return mats.olive.userData.defconWearUniforms.uDefconDirtColor.value.getHex();
    })();
    assert.notEqual(arcticHex, desertHex, 'biome dirt color uniform must change between arctic and desert');
  });
});

test('TerrainSplatting3D (Stage 1-1 desert): anti-float invariant, ROCK relief > 0, splatmap determinism, warm mesh', () => {
  const pf = new Pathfinder();
  const stage11 = getStageConfig(1, 1);
  pf.loadStageLayout(stage11);

  const halfW = BOARD_W * 0.5;
  const halfD = BOARD_D * 0.5;
  let flatCellsChecked = 0;
  let rockCellsChecked = 0;
  let rockSamplesPositive = 0;

  const flatCellTypes = new Set([CELL.FREE, CELL.ROAD, CELL.SPAWN, CELL.FOB]);

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const cell = pf.baseTerrain[r][c];
      const center = cellToWorldCenter(c, r);

      if (flatCellTypes.has(cell)) {
        flatCellsChecked++;
        for (const dx of [-2.0, -1.5, 0, 1.5, 2.0]) {
          for (const dz of [-2.0, -1.5, 0, 1.5, 2.0]) {
            const wx = Math.max(-halfW, Math.min(halfW, center.x + dx));
            const wz = Math.max(-halfD, Math.min(halfD, center.z + dz));
            const y = computeTerrainMicroReliefY(wx, wz, pf.baseTerrain, 'desert');
            assert.equal(
              y,
              0,
              `Anti-float violation at cell (${c},${r}) type=${cell} (${wx.toFixed(2)}, ${wz.toFixed(2)}): got y=${y}`
            );
          }
        }
      } else if (cell === CELL.ROCK) {
        rockCellsChecked++;
        const yCenter = computeTerrainMicroReliefY(center.x, center.z, pf.baseTerrain, 'desert');
        if (yCenter > 0) rockSamplesPositive++;
      }
    }
  }

  assert.ok(flatCellsChecked > 350, `expected >350 navigable/buildable cells in 1-1, checked ${flatCellsChecked}`);
  assert.ok(rockCellsChecked > 0, 'expected Stage 1-1 to contain CELL.ROCK cells');
  assert.equal(
    rockSamplesPositive,
    rockCellsChecked,
    `expected all ${rockCellsChecked} ROCK cell centers to have positive micro-relief, got ${rockSamplesPositive}`
  );
  assert.equal(computeTerrainMicroReliefY(0, 0, pf.baseTerrain, 'arctic'), 0);

  // Exact byte-for-byte determinism of createDesertSplatData
  const splatA = createDesertSplatData(pf.baseTerrain, stage11.spawnPoints, stage11.fobPoint);
  const splatB = createDesertSplatData(pf.baseTerrain, stage11.spawnPoints, stage11.fobPoint);
  assert.ok(splatA instanceof Uint8Array);
  assert.equal(splatA.length, SPLAT_WIDTH * SPLAT_HEIGHT * 4);
  assert.equal(Buffer.compare(splatA, splatB), 0, 'createDesertSplatData must be strictly deterministic');

  let hasRoad = false;
  let hasBerm = false;
  let hasBakedAO = false;
  for (let i = 0; i < splatA.length; i += 4) {
    if (splatA[i] > 200) hasRoad = true;
    if (splatA[i + 1] > 100) hasBerm = true;
    if (splatA[i + 3] < 220) hasBakedAO = true;
  }
  assert.ok(hasRoad && hasBerm && hasBakedAO, 'splatmap must encode road, berm, and baked AO channels');

  // Module-cached desert warm mesh check
  const warmA = createDesertTerrainWarmMesh();
  const warmB = createDesertTerrainWarmMesh();
  assert.strictEqual(warmA, warmB);
  assert.ok(warmA instanceof THREE.Mesh);
  assert.equal(warmA.material.customProgramCacheKey(), 'defcon_desert_splat_v1');

  disposeDesertDetailTextureCache();
});
