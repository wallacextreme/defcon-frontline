import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import { WORLDS } from '../src/data/worlds.js';
import { Pathfinder, GRID_COLS, GRID_ROWS, CELL } from '../src/systems/Pathfinder.js';
import {
  BOARD_W,
  BOARD_D,
  cellToWorldCenter,
  createBattlefieldDiorama3D
} from '../src/three/TerrainDiorama3D.ts';
import {
  BIOME_IDS,
  SPLAT_WIDTH,
  SPLAT_HEIGHT,
  computeTerrainMicroReliefY,
  createBiomeSplatData,
  createBiomeTerrainMaterial,
  createBiomeSplatTexture,
  createBiomeRoadMarksTexture,
  createDesertTerrainWarmMesh,
  createBiomeTerrainWarmMesh,
  getCachedDesertDetailTextures,
  getCachedBiomeDetailTextures,
  disposeDesertDetailTextureCache,
  disposeActiveBiomeDetailCache
} from '../src/three/TerrainSplatting3D.ts';
import {
  createBiomePropsWarmMeshes,
  disposeBiomePropsWarmCache
} from '../src/three/BiomeProps3D.ts';

function createStub2DContext(canvas) {
  const noop = () => {};
  const grad = { addColorStop: noop };
  return {
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    lineDashOffset: 0,
    font: '12px monospace',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    save: noop,
    restore: noop,
    translate: noop,
    rotate: noop,
    beginPath: noop,
    closePath: noop,
    rect: noop,
    clip: noop,
    moveTo: noop,
    lineTo: noop,
    arcTo: noop,
    ellipse: noop,
    arc: noop,
    fill: noop,
    stroke: noop,
    clearRect: noop,
    fillRect: noop,
    strokeRect: noop,
    fillText: noop,
    setLineDash: noop,
    createLinearGradient: () => grad,
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

function withCanvasDocument(fn) {
  const prevDoc = globalThis.document;
  globalThis.document = {
    createElement(tag) {
      if (tag !== 'canvas') return {};
      const canvas = { width: 512, height: 512 };
      const ctx = createStub2DContext(canvas);
      canvas.getContext = () => ctx;
      return canvas;
    }
  };
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

function getAllCampaignStages() {
  const list = [];
  for (const world of WORLDS) {
    for (const stage of world.stages) {
      list.push({
        world,
        stage,
        biome: stage.biome || world.biome
      });
    }
  }
  return list;
}

function assertFiniteBufferAttribute(attr, label) {
  assert.ok(attr, `${label}: missing attribute`);
  assert.ok(attr.count > 0, `${label}: empty attribute`);
  const arr = attr.array;
  for (let i = 0; i < arr.length; i++) {
    assert.ok(Number.isFinite(arr[i]), `${label}: non-finite value at ${i}`);
  }
}

function collectDioramaResources(root) {
  const geos = new Set();
  const mats = new Set();
  const textures = new Set();
  const texKeys = [
    'map',
    'normalMap',
    'roughnessMap',
    'metalnessMap',
    'bumpMap',
    'aoMap',
    'emissiveMap',
    'alphaMap'
  ];

  root.traverse((obj) => {
    if (obj.geometry) geos.add(obj.geometry);
    const matList = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
    for (const mat of matList) {
      mats.add(mat);
      for (const k of texKeys) {
        if (mat[k]) textures.add(mat[k]);
      }
      if (typeof mat.onBeforeCompile === 'function' && mat.userData) {
        for (const v of Object.values(mat.userData)) {
          if (v && typeof v === 'object' && !Array.isArray(v)) {
            for (const u of Object.values(v)) {
              if (u && u.value && u.value.isTexture) {
                textures.add(u.value);
              }
            }
          }
        }
      }
    }
  });

  return { geos, mats, textures };
}

test('Stage 4B — All 20 campaign stages x 7 biomes: anti-float invariant, ROCK relief > 0, InstancedMesh invariant, raycast proxy', () => {
  return withCanvasDocument(() => {
    const stages = getAllCampaignStages();
    assert.equal(stages.length, 20, 'expected exactly 20 campaign stages (1-1..4-5)');

  const coveredBiomes = new Set();
  const halfW = BOARD_W * 0.5;
  const halfD = BOARD_D * 0.5;
  const flatCellTypes = new Set([CELL.FREE, CELL.ROAD, CELL.SPAWN, CELL.FOB, CELL.RESTRICTED]);
  const pf = new Pathfinder();
  const raycaster = new THREE.Raycaster(new THREE.Vector3(6, 25, 4), new THREE.Vector3(0, -1, 0));

  try {
    for (const { stage, biome } of stages) {
      assert.ok(BIOME_IDS.includes(biome), `${stage.id}: unknown biome "${biome}"`);
      coveredBiomes.add(biome);

      pf.loadStageLayout(stage);

      let flatCellsChecked = 0;
      let rockCellsChecked = 0;
      let rockCentersPositive = 0;

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
                const y = computeTerrainMicroReliefY(wx, wz, pf.baseTerrain, biome);
                assert.equal(
                  y,
                  0,
                  `${stage.id} (${biome}): anti-float violation at (${c},${r}) cell=${cell} (${wx.toFixed(2)},${wz.toFixed(2)}) y=${y}`
                );
              }
            }
          } else if (cell === CELL.ROCK) {
            rockCellsChecked++;
            const yCenter = computeTerrainMicroReliefY(center.x, center.z, pf.baseTerrain, biome);
            if (yCenter > 0) rockCentersPositive++;
          }
        }
      }

      assert.ok(flatCellsChecked > 350, `${stage.id}: expected >350 flat cells, got ${flatCellsChecked}`);
      assert.ok(rockCellsChecked > 0, `${stage.id}: expected CELL.ROCK cells`);
      assert.equal(
        rockCentersPositive,
        rockCellsChecked,
        `${stage.id} (${biome}): expected all ${rockCellsChecked} ROCK centers > 0, got ${rockCentersPositive}`
      );

      // Build diorama with real Pathfinder layout
      const diorama = createBattlefieldDiorama3D(
        pf.baseTerrain,
        biome,
        stage.spawnPoints,
        stage.fobPoint,
        {
          restrictedCells: stage.restrictedCells,
          iceCells: stage.iceCells,
          fogCells: stage.fogCells,
          toxicCells: stage.toxicCells,
          lavaCells: stage.lavaCells
        }
      );

      assert.ok(diorama.group instanceof THREE.Group, `${stage.id}: diorama.group must be THREE.Group`);
      assert.ok(diorama.groundPlane instanceof THREE.Mesh, `${stage.id}: diorama.groundPlane must be THREE.Mesh`);
      assert.equal(diorama.groundPlane.visible, false, `${stage.id}: raycast proxy groundPlane must stay visible=false`);
      assert.equal(diorama.groundPlane.position.y, 0, `${stage.id}: raycast proxy groundPlane must sit at y=0`);

      // Verify Raycaster hits flat invisible groundPlane at y = 0 for all 7 biomes
      diorama.group.updateMatrixWorld(true);
      const hits = raycaster.intersectObject(diorama.groundPlane, false);
      assert.equal(hits.length, 1, `${stage.id} (${biome}): Raycaster must hit invisible groundPlane`);
      assert.ok(Math.abs(hits[0].point.y) < 1e-6, `${stage.id}: groundPlane hit y=${hits[0].point.y}`);

      // Verify visual terrain mesh uses the splat shader and micro-relief
      const expectedVisualName = biome === 'desert' ? 'DesertVisualTerrain' : `BiomeVisualTerrain_${biome}`;
      const visualTerrain = diorama.group.getObjectByName(expectedVisualName);
      assert.ok(visualTerrain instanceof THREE.Mesh, `${stage.id}: missing ${expectedVisualName}`);
      assertFiniteBufferAttribute(visualTerrain.geometry.getAttribute('position'), `${stage.id}.terrain.position`);
      assertFiniteBufferAttribute(visualTerrain.geometry.getAttribute('normal'), `${stage.id}.terrain.normal`);

      // Verify BiomeProps3D group invariant: 0 loose props outside InstancedMesh, all InstancedMesh have frustumCulled=false
      const biomePropsGroup = diorama.group.getObjectByName(`BiomeProps3D_${biome}`);
      assert.ok(biomePropsGroup instanceof THREE.Group, `${stage.id}: missing BiomeProps3D_${biome}`);

      let biomePropsLooseMeshes = 0;
      let instancedCount = 0;
      biomePropsGroup.traverse((node) => {
        if (node === biomePropsGroup) return;
        if (node.isInstancedMesh) {
          instancedCount++;
          assert.equal(
            node.frustumCulled,
            false,
            `${stage.id}: InstancedMesh "${node.name}" must have frustumCulled=false`
          );
          assertFiniteBufferAttribute(node.geometry.getAttribute('position'), `${stage.id}.${node.name}.pos`);
          assertFiniteBufferAttribute(node.instanceMatrix, `${stage.id}.${node.name}.instanceMatrix`);
        } else if (node.isMesh || node.isGroup) {
          biomePropsLooseMeshes++;
        }
      });

      assert.equal(
        biomePropsLooseMeshes,
        0,
        `${stage.id} (${biome}): found ${biomePropsLooseMeshes} loose non-InstancedMesh nodes inside BiomeProps3D`
      );
      if (biome !== 'desert') {
        assert.ok(instancedCount >= 3, `${stage.id} (${biome}): expected >= 3 InstancedMesh batches, got ${instancedCount}`);
      }

      // Check all InstancedMesh anywhere in diorama.group also respect frustumCulled === false
      diorama.group.traverse((node) => {
        if (node.isInstancedMesh) {
          assert.equal(node.frustumCulled, false, `${stage.id}: "${node.name}" must have frustumCulled=false`);
        }
      });

      diorama.update(1.5, 0.016);
      diorama.update(3.25, 0.016);
      diorama.dispose();
    }

    assert.deepEqual([...coveredBiomes].sort(), [...BIOME_IDS].sort(), 'all 7 biomes must be covered by the 20 stages');
  } finally {
    disposeActiveBiomeDetailCache();
    disposeDesertDetailTextureCache();
    disposeBiomePropsWarmCache();
  }
  });
});

test('Stage 4B — Special terrain surfaces exact counts in 4-2, 4-3, 4-4, 4-5 + fog dual-layer drift', () => {
  return withCanvasDocument(() => {
    const pf = new Pathfinder();
  const findInst = (group, name) => {
    const obj = group.getObjectByName(name);
    assert.ok(obj && obj.isInstancedMesh, `expected InstancedMesh "${name}"`);
    return obj;
  };

  try {
    // 4-2 (canyon): 14 restrictedCells
    {
      const stage42 = getAllCampaignStages().find((s) => s.stage.id === '4-2');
      pf.loadStageLayout(stage42.stage);
      const d = createBattlefieldDiorama3D(
        pf.baseTerrain,
        stage42.biome,
        stage42.stage.spawnPoints,
        stage42.stage.fobPoint,
        { restrictedCells: stage42.stage.restrictedCells }
      );
      assert.equal(findInst(d.group, 'SpecialRestrictedSlabs').count, 14);
      d.dispose();
    }

    // 4-3 (arctic): 22 iceCells, 12 restrictedCells
    {
      const stage43 = getAllCampaignStages().find((s) => s.stage.id === '4-3');
      pf.loadStageLayout(stage43.stage);
      const d = createBattlefieldDiorama3D(
        pf.baseTerrain,
        stage43.biome,
        stage43.stage.spawnPoints,
        stage43.stage.fobPoint,
        {
          iceCells: stage43.stage.iceCells,
          restrictedCells: stage43.stage.restrictedCells
        }
      );
      const iceInst = findInst(d.group, 'SpecialIceSheets');
      assert.equal(iceInst.count, 22);
      assert.equal(iceInst.material.roughness, 0.16);
      assert.equal(iceInst.material.transmission ?? 0, 0);
      assert.equal(findInst(d.group, 'SpecialRestrictedSlabs').count, 12);
      d.dispose();
    }

    // 4-4 (swamp): 8 toxicCells, 26 fogCells in 2 layers
    {
      const stage44 = getAllCampaignStages().find((s) => s.stage.id === '4-4');
      pf.loadStageLayout(stage44.stage);
      const d = createBattlefieldDiorama3D(
        pf.baseTerrain,
        stage44.biome,
        stage44.stage.spawnPoints,
        stage44.stage.fobPoint,
        {
          toxicCells: stage44.stage.toxicCells,
          fogCells: stage44.stage.fogCells
        }
      );
      assert.equal(findInst(d.group, 'SpecialToxicCorrodedRims').count, 8);
      assert.equal(findInst(d.group, 'SpecialToxicViscousPools').count, 8);
      const fogLow = findInst(d.group, 'SpecialFogLayerLow');
      const fogHigh = findInst(d.group, 'SpecialFogLayerHigh');
      assert.equal(fogLow.count, 26);
      assert.equal(fogHigh.count, 26);
      assert.equal(fogLow.material.depthWrite, false);
      assert.equal(fogHigh.material.depthWrite, false);

      d.update(1.2, 0.016);
      assert.notEqual(fogLow.position.x, fogHigh.position.x, 'fog layers must drift on opposite trajectories');
      d.dispose();
    }

    // 4-5 (volcanic): 10 lavaCells
    {
      const stage45 = getAllCampaignStages().find((s) => s.stage.id === '4-5');
      pf.loadStageLayout(stage45.stage);
      const d = createBattlefieldDiorama3D(
        pf.baseTerrain,
        stage45.biome,
        stage45.stage.spawnPoints,
        stage45.stage.fobPoint,
        { lavaCells: stage45.stage.lavaCells }
      );
      assert.equal(findInst(d.group, 'SpecialLavaBasaltRims').count, 10);
      assert.equal(findInst(d.group, 'SpecialLavaMoltenBeds').count, 10);
      d.dispose();
    }
  } finally {
    disposeActiveBiomeDetailCache();
    disposeDesertDetailTextureCache();
    disposeBiomePropsWarmCache();
  }
  });
});

test('Stage 4B — Determinism of createBiomeSplatData and customProgramCacheKey() shader patches (all 5 shaders)', () => {
  return withCanvasDocument(() => {
    const pf = new Pathfinder();
  const stage41 = getAllCampaignStages().find((s) => s.stage.id === '4-1').stage;
  pf.loadStageLayout(stage41);

  try {
    // 1. Splatmap byte-for-byte determinism across all 7 biomes
    for (const biome of BIOME_IDS) {
      const a = createBiomeSplatData(pf.baseTerrain, biome, stage41.spawnPoints, stage41.fobPoint);
      const b = createBiomeSplatData(pf.baseTerrain, biome, stage41.spawnPoints, stage41.fobPoint);
      assert.equal(a.length, SPLAT_WIDTH * SPLAT_HEIGHT * 4);
      assert.equal(Buffer.compare(a, b), 0, `${biome}: createBiomeSplatData must be deterministic`);

      let hasRoad = false;
      let hasBerm = false;
      let hasAO = false;
      for (let i = 0; i < a.length; i += 4) {
        if (a[i] > 200) hasRoad = true;
        if (a[i + 1] > 100) hasBerm = true;
        if (a[i + 3] < 220) hasAO = true;
      }
      assert.ok(hasRoad && hasBerm && hasAO, `${biome}: splatmap must populate road, berm, and baked AO`);
    }

    // 2. Verify all 5 customProgramCacheKey() shaders & r187 onBeforeCompile patches
    const foundKeys = new Set();

    const compileStandardPatch = (mat, label) => {
      const key = mat.customProgramCacheKey?.();
      assert.ok(key, `${label}: missing customProgramCacheKey()`);
      foundKeys.add(key);

      const mockShader = {
        uniforms: {},
        vertexShader: THREE.ShaderLib.standard.vertexShader,
        fragmentShader: THREE.ShaderLib.standard.fragmentShader
      };
      mat.onBeforeCompile(mockShader, null);
      assert.ok(
        Object.keys(mockShader.uniforms).length > 0 &&
          (mockShader.vertexShader !== THREE.ShaderLib.standard.vertexShader ||
            mockShader.fragmentShader !== THREE.ShaderLib.standard.fragmentShader),
        `${label} (${key}): onBeforeCompile must attach uniforms and patch vertex or fragment shader`
      );
      return mockShader;
    };

    // Desert & Unified Biome warm meshes
    const desertWarm = createDesertTerrainWarmMesh();
    const biomeWarm = createBiomeTerrainWarmMesh();
    compileStandardPatch(desertWarm.material, 'DesertWarm');
    compileStandardPatch(biomeWarm.material, 'BiomeWarm');

    // BiomeProps warm meshes (foliage wind, lava flow, toxic pool)
    const propsWarms = createBiomePropsWarmMeshes();
    assert.equal(propsWarms.length, 3);
    for (const m of propsWarms) {
      assert.ok(m instanceof THREE.InstancedMesh, `${m.name}: warm mesh must be InstancedMesh for USE_INSTANCING`);
      compileStandardPatch(m.material, m.name);
    }

    // Also verify runtime stage materials match the exact same customProgramCacheKey values
    const stageMap = new Map(getAllCampaignStages().map((s) => [s.stage.id, s]));

    // Forest 4-1 -> defcon_biome_splat_v1 + defcon_foliage_wind_v1
    {
      const { stage, biome } = stageMap.get('4-1');
      pf.loadStageLayout(stage);
      const d = createBattlefieldDiorama3D(pf.baseTerrain, biome, stage.spawnPoints, stage.fobPoint);
      const terrain = d.group.getObjectByName('BiomeVisualTerrain_forest');
      const canopy = d.group.getObjectByName('ForestTreeCanopies');
      assert.equal(terrain.material.customProgramCacheKey(), 'defcon_biome_splat_v1');
      assert.equal(canopy.material.customProgramCacheKey(), 'defcon_foliage_wind_v1');
      d.dispose();
    }

    // Swamp 4-4 -> defcon_toxic_pool_v1
    {
      const { stage, biome } = stageMap.get('4-4');
      pf.loadStageLayout(stage);
      const d = createBattlefieldDiorama3D(pf.baseTerrain, biome, stage.spawnPoints, stage.fobPoint, {
        toxicCells: stage.toxicCells,
        fogCells: stage.fogCells
      });
      const pool = d.group.getObjectByName('SpecialToxicViscousPools');
      assert.equal(pool.material.customProgramCacheKey(), 'defcon_toxic_pool_v1');
      d.dispose();
    }

    // Volcanic 4-5 -> defcon_lava_flow_v1
    {
      const { stage, biome } = stageMap.get('4-5');
      pf.loadStageLayout(stage);
      const d = createBattlefieldDiorama3D(pf.baseTerrain, biome, stage.spawnPoints, stage.fobPoint, {
        lavaCells: stage.lavaCells
      });
      const lava = d.group.getObjectByName('SpecialLavaMoltenBeds');
      assert.equal(lava.material.customProgramCacheKey(), 'defcon_lava_flow_v1');
      d.dispose();
    }

    assert.deepEqual(
      [...foundKeys].sort(),
      [
        'defcon_biome_splat_v1',
        'defcon_desert_splat_v1',
        'defcon_foliage_wind_v1',
        'defcon_lava_flow_v1',
        'defcon_toxic_pool_v1'
      ]
    );
  } finally {
    disposeActiveBiomeDetailCache();
    disposeDesertDetailTextureCache();
    disposeBiomePropsWarmCache();
  }
  });
});

test('Stage 4B — 20-stage cycle + return to 1-1 with Canvas DOM: zero leaked textures/geometries/materials', () => {
  withCanvasDocument(() => {
    const stages = getAllCampaignStages();
    const pf = new Pathfinder();

    try {
      // Prime 1-1 desert baseline & capture module-persistent textures (PBR atlas + desert detail cache)
      const first = stages[0];
      pf.loadStageLayout(first.stage);
      const baseDiorama = createBattlefieldDiorama3D(
        pf.baseTerrain,
        first.biome,
        first.stage.spawnPoints,
        first.stage.fobPoint
      );
      const baseRes = collectDioramaResources(baseDiorama.group);
      const baseDisposedTex = new Set();
      for (const t of baseRes.textures) {
        t.addEventListener('dispose', () => baseDisposedTex.add(t));
      }
      baseDiorama.dispose();

      const persistentGlobalTexSet = new Set(Object.values(getCachedDesertDetailTextures()));
      for (const t of baseRes.textures) {
        if (!baseDisposedTex.has(t)) persistentGlobalTexSet.add(t);
      }
      assert.ok(persistentGlobalTexSet.size >= 6, 'expected persistent global/desert cached textures');

      const seenNonDesertDetailTextures = new Set();
      let nonDesertDisposedCount = 0;

      // Cycle through all 20 stages in order (1-1 -> 4-5), then return to 1-1
      const cycle = [...stages, first];
      for (const { stage, biome } of cycle) {
        pf.loadStageLayout(stage);
        const d = createBattlefieldDiorama3D(
          pf.baseTerrain,
          biome,
          stage.spawnPoints,
          stage.fobPoint,
          {
            restrictedCells: stage.restrictedCells,
            iceCells: stage.iceCells,
            fogCells: stage.fogCells,
            toxicCells: stage.toxicCells,
            lavaCells: stage.lavaCells
          }
        );

        const res = collectDioramaResources(d.group);
        let disposedGeos = 0;
        let disposedMats = 0;
        let disposedNonCachedTex = 0;

        for (const g of res.geos) {
          g.addEventListener('dispose', () => {
            disposedGeos++;
          });
        }
        for (const m of res.mats) {
          m.addEventListener('dispose', () => {
            disposedMats++;
          });
        }
        for (const t of res.textures) {
          if (persistentGlobalTexSet.has(t)) continue;
          if (biome !== 'desert') {
            const activeSet = getCachedBiomeDetailTextures(biome);
            if (Object.values(activeSet).includes(t)) {
              if (!seenNonDesertDetailTextures.has(t)) {
                seenNonDesertDetailTextures.add(t);
                t.addEventListener('dispose', () => {
                  nonDesertDisposedCount++;
                });
              }
              continue;
            }
          }
          t.addEventListener('dispose', () => {
            disposedNonCachedTex++;
          });
        }

        const expectedPerDioramaTex = [...res.textures].filter((t) => {
          if (persistentGlobalTexSet.has(t)) return false;
          if (biome !== 'desert') {
            const activeSet = getCachedBiomeDetailTextures(biome);
            if (Object.values(activeSet).includes(t)) return false;
          }
          return true;
        }).length;

        d.dispose();

        assert.equal(disposedGeos, res.geos.size, `${stage.id}: leaked geometries on diorama.dispose()`);
        assert.equal(disposedMats, res.mats.size, `${stage.id}: leaked materials on diorama.dispose()`);
        assert.equal(disposedNonCachedTex, expectedPerDioramaTex, `${stage.id}: leaked textures on diorama.dispose()`);
      }

      // After cycling all 20 stages and returning to 1-1 (desert), ALL non-desert cached detail textures must be disposed (Δtex === 0)
      assert.ok(seenNonDesertDetailTextures.size > 0, 'expected non-desert detail textures to be created across Worlds 2-4');
      assert.equal(
        nonDesertDisposedCount,
        seenNonDesertDetailTextures.size,
        `expected all ${seenNonDesertDetailTextures.size} non-desert detail textures disposed upon returning to 1-1, got ${nonDesertDisposedCount}`
      );

      // Verify BiomeTerrainMaterial + Splat + RoadMarks work cleanly under Canvas DOM too
      const splat = createBiomeSplatTexture(pf.baseTerrain, 'volcanic', first.stage.spawnPoints, first.stage.fobPoint);
      const marks = createBiomeRoadMarksTexture(pf.baseTerrain, 'volcanic');
      const mat = createBiomeTerrainMaterial('volcanic', splat, marks);
      assert.equal(mat.customProgramCacheKey(), 'defcon_biome_splat_v1');
      splat.dispose();
      marks.dispose();
      mat.dispose();

      // Explicit cache disposal is idempotent
      disposeActiveBiomeDetailCache();
      disposeActiveBiomeDetailCache();
    } finally {
      disposeActiveBiomeDetailCache();
      disposeDesertDetailTextureCache();
      disposeBiomePropsWarmCache();
    }
  });
});
