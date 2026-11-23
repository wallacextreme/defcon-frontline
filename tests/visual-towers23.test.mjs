import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import {
  createTowerModel3D,
  createGhostTower3D,
  prewarmAllMilitaryModels
} from '../src/three/MilitaryModels3D.ts';
import { TOWER_BUILD_ORDER, TOWER_DEFINITIONS } from '../src/data/towers.js';

const ALL_TOWERS = [...TOWER_BUILD_ORDER];
const SPEC_TOWERS = ALL_TOWERS.filter((id) => id !== 'hesco');

const FULL_STATES = [
  { key: 'nv1', level: 1, spec: null },
  { key: 'nv2', level: 2, spec: null },
  { key: 'nv4', level: 4, spec: null },
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

const _va = new THREE.Vector3();
const _vb = new THREE.Vector3();
const _vc = new THREE.Vector3();
const _ab = new THREE.Vector3();
const _ac = new THREE.Vector3();
const _cross = new THREE.Vector3();

function computeMeshWorldSurfaceArea(mesh) {
  const geo = mesh.geometry;
  if (!geo) return 0;
  const pos = geo.getAttribute('position');
  if (!pos || pos.count < 3) return 0;

  const matWorld = mesh.matrixWorld;
  const idx = geo.index;
  const triCount = idx ? idx.count / 3 : pos.count / 3;
  let area = 0;

  for (let t = 0; t < triCount; t++) {
    const i0 = idx ? idx.getX(t * 3) : t * 3;
    const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
    _va.fromBufferAttribute(pos, i0).applyMatrix4(matWorld);
    _vb.fromBufferAttribute(pos, i1).applyMatrix4(matWorld);
    _vc.fromBufferAttribute(pos, i2).applyMatrix4(matWorld);
    _ab.subVectors(_vb, _va);
    _ac.subVectors(_vc, _va);
    _cross.crossVectors(_ab, _ac);
    area += 0.5 * _cross.length();
  }
  return area;
}

function isBrightEmissiveMaterial(mat) {
  if (!mat || mat.isMeshBasicMaterial) return false;
  if (mat.emissive && mat.emissive.getHex() !== 0 && (mat.emissiveIntensity ?? 0) >= 1.0) {
    return true;
  }
  return false;
}

function isActiveNonMetallicEmissive(mat, meshName = '') {
  if (!mat || mat.isMeshBasicMaterial) return false;
  if (!mat.emissive || mat.emissive.getHex() === 0) return false;
  const intensity = mat.emissiveIntensity ?? 0;
  // Exclude bare metallic copperAesa (0.35, metalness 0.85) and translucent ewRings aura
  if (intensity < 0.5) return false;
  if (meshName === 'ewRing' || (mat.transparent && mat.opacity < 0.5 && intensity < 1.0)) return false;
  return true;
}

test('All 23 Towers x Full States: geometry, <=4500 tris, maxRLow <= 1.84, batching <= 12/<= 8, and ghost contract', (t) => {
  assert.equal(ALL_TOWERS.length, 23, 'expected 23 towers in TOWER_BUILD_ORDER');
  assert.equal(SPEC_TOWERS.length, 22, 'expected 22 specialization-capable towers');

  withHeadlessCanvasDocument(() => {
    let maxTris = 0;
    let maxTrisTag = '';
    const over3500 = [];

    for (const defId of ALL_TOWERS) {
      const states = defId === 'hesco' ? [FULL_STATES[0]] : FULL_STATES;

      for (const state of states) {
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

        assert.ok(
          structuralMeshCount >= 1 && structuralMeshCount <= 12,
          `${tag}: structuralMeshCount=${structuralMeshCount} out of [1, 12]`
        );
        assert.ok(totalTris > 0 && totalTris <= 4500, `${tag}: triangle budget ${totalTris} out of (0, 4500]`);
        assert.ok(
          maxRLow <= 1.84,
          `${tag}: base radius at y <= 0.28 is ${maxRLow.toFixed(3)} (> 1.84 risks clipping ownerRingMesh 1.90..1.99)`
        );

        if (totalTris > maxTris) {
          maxTris = totalTris;
          maxTrisTag = tag;
        }
        if (totalTris > 3500) {
          over3500.push(`${tag}:${totalTris}`);
        }
      }

      // Ghost hologram contract for all 23 towers
      const ghost = createGhostTower3D(defId);
      assert.ok(ghost.root instanceof THREE.Group, `${defId}@ghost: root must be THREE.Group`);
      assert.equal(typeof ghost.setValid, 'function', `${defId}@ghost: setValid must be a function`);

      const drawables = [];
      ghost.root.traverse((child) => {
        if (child.isMesh || child.isLine || child.isLineSegments || child.isPoints) {
          drawables.push(child);
        }
      });

      assert.equal(drawables.length, 2, `${defId}@ghost: expected 2 drawables, got ${drawables.length}`);
      const meshes = drawables.filter((d) => d.isMesh);
      const lines = drawables.filter((d) => d.isLineSegments);
      assert.equal(meshes.length, 1, `${defId}@ghost: expected 1 Mesh`);
      assert.equal(lines.length, 1, `${defId}@ghost: expected 1 LineSegments`);

      const holoMesh = meshes[0];
      const edgesLines = lines[0];
      validateGeometry(holoMesh.geometry, `${defId}@ghost.mesh`, { requireNormalsAndUvs: true });
      validateGeometry(edgesLines.geometry, `${defId}@ghost.edges`, { requireNormalsAndUvs: false });
      assert.equal(edgesLines.geometry.getAttribute('position').count % 2, 0);

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

    t.diagnostic(`Max tris across all 23 towers: ${maxTris} (${maxTrisTag}); >3500 tris: ${over3500.length ? over3500.join(', ') : 'none'}`);
  });
});

test('All 23 Towers: missileCaps batched single noShadow mesh & complete TowerRig3D hooks coverage', () => {
  withHeadlessCanvasDocument(() => {
    const assertHook = (rig, field, tag) => {
      const val = rig[field];
      if (Array.isArray(val)) {
        assert.ok(val.length > 0, `${tag}: expected non-empty array for rig.${field}`);
        for (const item of val) {
          assert.ok(item instanceof THREE.Object3D && isDescendantOf(item, rig.root), `${tag}: rig.${field} item must be inside rig.root`);
        }
      } else {
        assert.ok(val instanceof THREE.Object3D && isDescendantOf(val, rig.root), `${tag}: expected Object3D for rig.${field}`);
      }
    };

    const assertSingleBatchedMissileCaps = (defId, level, spec = null) => {
      const tag = `${defId}@lv${level}${spec || ''}`;
      const rig = createTowerModel3D(defId, level, spec);
      assertHook(rig, 'missileCaps', tag);
      assert.equal(rig.missileCaps.length, 1, `${tag}: missileCaps must be batched into 1 mesh`);
      const capMesh = rig.missileCaps[0];
      assert.ok(capMesh instanceof THREE.Mesh, `${tag}: missileCaps[0] must be THREE.Mesh`);
      assert.equal(capMesh.userData?.noShadow, true, `${tag}: missileCaps[0] must set userData.noShadow=true`);
      assert.equal(capMesh.castShadow, false, `${tag}: missileCaps[0] must set castShadow=false`);
      assert.equal(capMesh.receiveShadow, false, `${tag}: missileCaps[0] must set receiveShadow=false`);
    };

    // Single batched missileCaps across all 5 missile/artillery towers
    for (const st of [
      { level: 2, spec: null },
      { level: 4, spec: null },
      { level: 5, spec: 'A' },
      { level: 6, spec: 'B' }
    ]) {
      assertSingleBatchedMissileCaps('patriot', st.level, st.spec);
    }
    for (const st of [
      { level: 4, spec: null },
      { level: 5, spec: 'A' },
      { level: 6, spec: 'B' }
    ]) {
      assertSingleBatchedMissileCaps('howitzer', st.level, st.spec);
    }
    for (const defId of ['javelin', 'tos1_mlrs', 'iron_dome']) {
      for (const st of FULL_STATES) {
        assertSingleBatchedMissileCaps(defId, st.level, st.spec);
      }
    }

    // gatlingPivot: phalanx (all levels) & m2_bunker Lv2+ (non-B single cannon)
    for (const st of FULL_STATES) {
      assertHook(createTowerModel3D('phalanx', st.level, st.spec), 'gatlingPivot', `phalanx@${st.key}`);
    }
    for (const st of [
      { key: 'nv2', level: 2, spec: null },
      { key: 'nv4', level: 4, spec: null },
      { key: '5A', level: 5, spec: 'A' }
    ]) {
      assertHook(createTowerModel3D('m2_bunker', st.level, st.spec), 'gatlingPivot', `m2_bunker@${st.key}`);
    }

    // ewRings (36-segment ring/torus, noShadow) on ew_crew, cryo_tower, iron_dome, eng_workshop Lv2+
    for (const defId of ['ew_crew', 'cryo_tower', 'iron_dome', 'eng_workshop']) {
      const states = defId === 'ew_crew' ? FULL_STATES : FULL_STATES.filter((s) => s.level >= 2);
      for (const st of states) {
        const tag = `${defId}@${st.key}`;
        const rig = createTowerModel3D(defId, st.level, st.spec);
        assertHook(rig, 'ewRings', tag);
        for (const ring of rig.ewRings) {
          assert.ok(ring instanceof THREE.Mesh, `${tag}: ewRing must be THREE.Mesh`);
          assert.equal(ring.userData?.noShadow, true, `${tag}: ewRing must be noShadow`);
          assert.equal(ring.castShadow, false, `${tag}: ewRing castShadow must be false`);
          assert.equal(ring.receiveShadow, false, `${tag}: ewRing receiveShadow must be false`);
          const segTris = getMeshTriangleCount(ring);
          assert.ok(
            segTris === 72 || segTris % 36 === 0,
            `${tag}: expected 36-seg ring/torus geometry (got ${segTris} tris)`
          );
        }
      }
    }

    // radarPivots coverage (note: patriot & javelin radarPivots unlock at visual tier 3 = gameplay Lv4+)
    const radarExpectations = [
      { defId: 'ew_crew', minLevel: 1 },
      { defId: 'patriot', minLevel: 4 },
      { defId: 'javelin', minLevel: 4 },
      { defId: 'iron_dome', minLevel: 1 },
      { defId: 'minefield', minLevel: 1 },
      { defId: 'eng_workshop', minLevel: 1 },
      { defId: 'energy_extractor', minLevel: 1 }
    ];
    for (const { defId, minLevel } of radarExpectations) {
      const testLevels = FULL_STATES.filter((s) => s.level >= minLevel);
      for (const st of testLevels) {
        assertHook(createTowerModel3D(defId, st.level, st.spec), 'radarPivots', `${defId}@${st.key}`);
      }
    }

    // turretPivot, barrelPivot, muzzlePoint, muzzleFlashMesh across all weapon towers
    const turretBarrelMuzzleTowers = [
      'ballista',
      'm2_bunker',
      'abrams_pit',
      'howitzer',
      'sniper_tower',
      'cryo_tower',
      'toxic_tower',
      'flamethrower',
      'helios_laser',
      'railgun',
      'harpoon_tower',
      'tos1_mlrs',
      'bushmaster',
      'javelin',
      'phalanx'
    ];
    for (const defId of turretBarrelMuzzleTowers) {
      for (const st of FULL_STATES) {
        const tag = `${defId}@${st.key}`;
        const rig = createTowerModel3D(defId, st.level, st.spec);
        assertHook(rig, 'turretPivot', tag);
        assertHook(rig, 'barrelPivot', tag);
        assertHook(rig, 'muzzlePoint', tag);
        assertHook(rig, 'muzzleFlashMesh', tag);
      }
    }

    // Turret + muzzle towers without barrelPivot
    for (const defId of ['patriot', 'tesla_tower', 'iron_dome']) {
      for (const st of FULL_STATES) {
        const tag = `${defId}@${st.key}`;
        const rig = createTowerModel3D(defId, st.level, st.spec);
        assertHook(rig, 'turretPivot', tag);
        assertHook(rig, 'muzzlePoint', tag);
        assertHook(rig, 'muzzleFlashMesh', tag);
      }
    }

    // Patriot aesaPanel on Lv2+
    for (const st of FULL_STATES.filter((s) => s.level >= 2)) {
      const rig = createTowerModel3D('patriot', st.level, st.spec);
      assertHook(rig, 'aesaPanel', `patriot@${st.key}`);
      assert.equal(rig.aesaPanel.userData?.noShadow, true);
    }
  });
});

test('All 22 Spec Towers: real geometric differentiation between 5A and 6B (delta tris > 0 or box delta > 0.08)', () => {
  withHeadlessCanvasDocument(() => {
    for (const defId of SPEC_TOWERS) {
      const def = TOWER_DEFINITIONS[defId];
      assert.ok(def?.specializations?.A && def?.specializations?.B, `${defId}: expected specs A & B in catalog`);

      const rigA = createTowerModel3D(defId, 5, 'A');
      const rigB = createTowerModel3D(defId, 6, 'B');

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
        triDelta > 0 || maxBoxDelta > 0.08,
        `${defId}: 5A vs 6B must differ structurally (trisA=${trisA}, trisB=${trisB}, boxDelta=${maxBoxDelta.toFixed(4)})`
      );
    }
  });
});

test('All 23 Towers: Art Bible emissive surface area ratio <= 6%', (t) => {
  withHeadlessCanvasDocument(() => {
    let maxBrightEmRatio = 0;
    let maxActiveTotalRatio = 0;
    let maxBrightTag = '';
    let maxActiveTag = '';

    for (const defId of ALL_TOWERS) {
      const states = defId === 'hesco' ? [FULL_STATES[0]] : FULL_STATES;
      for (const st of states) {
        const tag = `${defId}@${st.key}`;
        const rig = createTowerModel3D(defId, st.level, st.spec);
        rig.root.updateMatrixWorld(true);

        let structuralTotalArea = 0;
        let brightEmissiveArea = 0;
        let allVisibleArea = 0;
        let activeEmissiveArea = 0;

        rig.root.traverse((child) => {
          if (!child.isMesh || !child.visible) return;
          if (child.material?.isMeshBasicMaterial) return;
          const area = computeMeshWorldSurfaceArea(child);
          const isBright = isBrightEmissiveMaterial(child.material);
          const isActive = isActiveNonMetallicEmissive(child.material, child.name);

          allVisibleArea += area;
          if (isBright) brightEmissiveArea += area;
          if (isActive) activeEmissiveArea += area;
          if (!child.userData?.noShadow) {
            structuralTotalArea += area;
          }
        });

        assert.ok(structuralTotalArea > 0, `${tag}: expected positive structural surface area`);
        const brightRatio = brightEmissiveArea / allVisibleArea;
        const activeRatio = activeEmissiveArea / allVisibleArea;

        if (brightRatio > maxBrightEmRatio) {
          maxBrightEmRatio = brightRatio;
          maxBrightTag = tag;
        }
        if (activeRatio > maxActiveTotalRatio) {
          maxActiveTotalRatio = activeRatio;
          maxActiveTag = tag;
        }

        assert.ok(
          brightRatio <= 0.06,
          `${tag}: high-emissive ratio ${(brightRatio * 100).toFixed(2)}% exceeds Art Bible 6% limit`
        );
        assert.ok(
          activeRatio <= 0.06,
          `${tag}: active emissive ratio ${(activeRatio * 100).toFixed(2)}% exceeds Art Bible 6% limit`
        );
      }
    }

    t.diagnostic(
      `Max emissive area: bright(>=1.0)=${(maxBrightEmRatio * 100).toFixed(2)}% (${maxBrightTag}), activeNonMetallic=${(maxActiveTotalRatio * 100).toFixed(2)}% (${maxActiveTag})`
    );
  });
});

test('prewarmAllMilitaryModels executes with 0 errors and populates all 23 ghost holograms', () => {
  withHeadlessCanvasDocument(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 200);
    const ghostParent = new THREE.Group();
    let compileCalls = 0;
    const mockRenderer = {
      compile(compiledScene, compiledCam) {
        assert.strictEqual(compiledScene, scene);
        assert.strictEqual(compiledCam, camera);
        compileCalls++;
      }
    };

    const ghostMap = prewarmAllMilitaryModels(scene, camera, mockRenderer, ghostParent);
    assert.equal(compileCalls, 1);
    assert.equal(ghostMap.size, 23, `expected 23 cached ghost models, got ${ghostMap.size}`);
    for (const defId of ALL_TOWERS) {
      assert.ok(ghostMap.has(defId), `prewarmAllMilitaryModels missing ghost for ${defId}`);
      const gm = ghostMap.get(defId);
      assert.strictEqual(gm.root.parent, ghostParent);
      assert.equal(gm.root.visible, false);
    }
  });
});
