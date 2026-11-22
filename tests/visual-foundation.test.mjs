import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import {
  QUALITY_STORAGE_KEY,
  QUALITY_PROFILES,
  QUALITY_TIERS,
  detectInitialQualityTier,
  loadSavedQualityTier,
  saveQualityTier,
  resolveQualityConfig,
  getThreeToneMapping,
  AdaptiveQualitySampler
} from '../src/three/GraphicsQuality.ts';

import {
  BIOME_LIGHTING_SPECS,
  getBiomeLightingSpec,
  createBiomeSkyDome,
  createBiomeEnvironment
} from '../src/three/BiomeEnvironment3D.ts';

import {
  hashSeed,
  createSeededRng,
  getRoundedBoxGeo,
  getChamferedCylinderGeo,
  normalizeForMerge,
  mergeStaticGeometries,
  createGhostEdges,
  createContactShadowMesh,
  applyVerticalAOToGeometry,
  disposeMilitaryGeometryKitCache
} from '../src/three/MilitaryGeometryKit.ts';

import {
  MILITARY_WEAR_VARIANTS,
  computeSobelNormals,
  applyMilitaryWearShader,
  updateMilitaryWearDirtColor
} from '../src/three/SurfaceShaderKit.ts';

import { WORLDS } from '../src/data/worlds.js';

function withMockStorage(fn) {
  const prev = globalThis.localStorage;
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
  try {
    return fn(store);
  } finally {
    if (prev === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = prev;
    }
  }
}

test('GraphicsQuality: all 4 presets match contract & are valid', () => {
  assert.deepEqual([...QUALITY_TIERS], ['low', 'medium', 'high', 'ultra']);

  assert.equal(QUALITY_PROFILES.low.dprCap, 1.0);
  assert.equal(QUALITY_PROFILES.low.useComposer, false);
  assert.equal(QUALITY_PROFILES.low.msaaSamples, 0);
  assert.equal(QUALITY_PROFILES.low.aaMode, 'native');
  assert.equal(QUALITY_PROFILES.low.shadowMapSize, 1024);
  assert.equal(QUALITY_PROFILES.low.bloomEnabled, false);
  assert.equal(QUALITY_PROFILES.low.gtaoEnabled, false);
  assert.equal(QUALITY_PROFILES.low.envEnabled, false);
  assert.equal(QUALITY_PROFILES.low.propDensity, 0.45);
  assert.equal(QUALITY_PROFILES.low.enableWind, false);
  assert.equal(QUALITY_PROFILES.low.enableWearShader, false);

  assert.equal(QUALITY_PROFILES.medium.dprCap, 1.25);
  assert.equal(QUALITY_PROFILES.medium.useComposer, true);
  assert.equal(QUALITY_PROFILES.medium.msaaSamples, 2);
  assert.equal(QUALITY_PROFILES.medium.aaMode, 'msaa');
  assert.equal(QUALITY_PROFILES.medium.shadowMapSize, 1536);
  assert.equal(QUALITY_PROFILES.medium.bloomEnabled, true);
  assert.equal(QUALITY_PROFILES.medium.gtaoEnabled, false);
  assert.equal(QUALITY_PROFILES.medium.propDensity, 0.75);
  assert.equal(QUALITY_PROFILES.medium.enableWind, false);
  assert.equal(QUALITY_PROFILES.medium.enableWearShader, true);

  assert.equal(QUALITY_PROFILES.high.dprCap, 1.5);
  assert.equal(QUALITY_PROFILES.high.useComposer, true);
  assert.equal(QUALITY_PROFILES.high.msaaSamples, 4);
  assert.equal(QUALITY_PROFILES.high.shadowMapSize, 2048);
  assert.equal(QUALITY_PROFILES.high.gtaoEnabled, false);
  assert.equal(QUALITY_PROFILES.high.propDensity, 1.0);
  assert.equal(QUALITY_PROFILES.high.enableWind, true);

  assert.equal(QUALITY_PROFILES.ultra.dprCap, 2.0);
  assert.equal(QUALITY_PROFILES.ultra.msaaSamples, 4);
  assert.equal(QUALITY_PROFILES.ultra.shadowMapSize, 2048);
  assert.equal(QUALITY_PROFILES.ultra.gtaoEnabled, true);
  assert.equal(QUALITY_PROFILES.ultra.enableWind, true);

  assert.equal(getThreeToneMapping('agx'), THREE.AgXToneMapping);
  assert.equal(getThreeToneMapping('aces'), THREE.ACESFilmicToneMapping);
  assert.equal(getThreeToneMapping('neutral'), THREE.NeutralToneMapping);
});

test('GraphicsQuality: URL query parsing, A/B overrides, and localStorage persistence (isolated from SaveManager)', () => {
  withMockStorage((store) => {
    assert.equal(QUALITY_STORAGE_KEY, 'defcon.graphicsQuality');
    assert.equal(loadSavedQualityTier(), null);

    // Seed an unrelated SaveManager key and verify GraphicsQuality never alters it.
    store.set('defcon_frontline_save_v1', '{"keep":true}');
    assert.equal(saveQualityTier('medium'), true);
    assert.equal(loadSavedQualityTier(), 'medium');
    assert.equal(store.get('defcon_frontline_save_v1'), '{"keep":true}');

    const fromStorage = resolveQualityConfig('');
    assert.equal(fromStorage.tier, 'medium');
    assert.equal(fromStorage.source, 'storage');

    const resolved = resolveQualityConfig(
      '?quality=high&aa=smaa&tonemap=neutral&ibl=room&bloom=legacy&gtao=1'
    );
    assert.equal(resolved.tier, 'high');
    assert.equal(resolved.source, 'query');
    assert.equal(resolved.profile.aaMode, 'smaa');
    assert.equal(resolved.profile.msaaSamples, 0);
    assert.equal(resolved.profile.useComposer, true);
    assert.equal(resolved.profile.toneMapMode, 'neutral');
    assert.equal(resolved.profile.iblMode, 'room');
    assert.equal(resolved.profile.bloomMode, 'legacy');
    assert.equal(resolved.profile.bloomThreshold, 0.82);
    assert.equal(resolved.profile.bloomStrength, 0.45);
    assert.equal(resolved.profile.gtaoEnabled, true);

    // Verify QUALITY_PROFILES remained immutable
    assert.equal(QUALITY_PROFILES.high.aaMode, 'msaa');
    assert.equal(QUALITY_PROFILES.high.gtaoEnabled, false);
    assert.equal(QUALITY_PROFILES.high.toneMapMode, 'agx');

    const bloomOff = resolveQualityConfig('?quality=ultra&aa=off&bloom=off&gtao=0&tonemap=aces&ibl=biome');
    assert.equal(bloomOff.profile.aaMode, 'off');
    assert.equal(bloomOff.profile.msaaSamples, 0);
    assert.equal(bloomOff.profile.bloomEnabled, false);
    assert.equal(bloomOff.profile.gtaoEnabled, false);
    assert.equal(bloomOff.profile.toneMapMode, 'aces');
    assert.equal(bloomOff.profile.iblMode, 'biome');
  });

  // Deterministic hardware heuristic checks (including Intel UHD/HD integrated GPU -> medium)
  assert.equal(detectInitialQualityTier({ innerWidth: 1440, innerHeight: 900, hardwareConcurrency: 8, deviceMemory: 8 }), 'high');
  assert.equal(
    detectInitialQualityTier({
      innerWidth: 1440,
      innerHeight: 900,
      hardwareConcurrency: 8,
      deviceMemory: 16,
      rendererString: 'ANGLE (Intel, Intel(R) UHD Graphics 630 (0x00003E9B) Direct3D11 vs_5_0 ps_5_0, D3D11)'
    }),
    'medium'
  );
  assert.equal(
    detectInitialQualityTier({
      innerWidth: 1920,
      innerHeight: 1080,
      hardwareConcurrency: 8,
      deviceMemory: 16,
      rendererString: 'Intel(R) HD Graphics 520'
    }),
    'medium'
  );
  assert.equal(
    detectInitialQualityTier({
      innerWidth: 1920,
      innerHeight: 1080,
      hardwareConcurrency: 8,
      deviceMemory: 16,
      rendererString: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)'
    }),
    'high'
  );
  assert.equal(detectInitialQualityTier({ innerWidth: 390, innerHeight: 844, hardwareConcurrency: 6, deviceMemory: 6, maxTouchPoints: 5 }), 'medium');
  assert.equal(detectInitialQualityTier({ innerWidth: 390, innerHeight: 844, hardwareConcurrency: 4, deviceMemory: 2, maxTouchPoints: 5 }), 'low');
  assert.equal(detectInitialQualityTier({ innerWidth: 1920, innerHeight: 1080, gpuRenderer: 'Google SwiftShader' }), 'low');
});

test('GraphicsQuality: AdaptiveQualitySampler warmup, dynamic DPR scaling, and p95 tier downgrade', () => {
  const sampler = new AdaptiveQualitySampler({
    initialTier: 'high',
    warmupSec: 2.0,
    windowSec: 3.0,
    p95BudgetMs: 25,
    allowDynamicDpr: true,
    dprStep: 0.2
  });

  // During 2s warmup, even slow frames must NOT trigger any downgrade.
  for (let i = 0; i < 40; i++) {
    const d = sampler.recordFrame(50, 0.05);
    assert.equal(d.changed, false);
    assert.equal(sampler.getTier(), 'high');
  }

  // Mild overload (~28ms <= 25 * 1.25 = 31.25ms) over 3s window scales DPR down on High first.
  let decision = null;
  for (let i = 0; i < 120; i++) {
    const d = sampler.recordFrame(28, 0.028);
    if (d.changed) {
      decision = { ...d };
      break;
    }
  }
  assert.ok(decision, 'expected mild overload to trigger dynamic DPR step-down');
  assert.equal(decision.action, 'dpr_down');
  assert.equal(decision.tier, 'high');
  assert.ok(decision.dprScale < 1.0);
  assert.ok(sampler.getEffectiveDpr(2.0) < 1.5);

  // Heavy sustained overload (48ms >> 25ms) downgrades 1 tier from high -> medium.
  let downgrade = null;
  for (let i = 0; i < 120; i++) {
    const d = sampler.recordFrame(48, 0.048);
    if (d.changed) {
      downgrade = { ...d };
      break;
    }
  }
  assert.ok(downgrade, 'expected heavy overload to trigger tier downgrade');
  assert.equal(downgrade.action, 'tier_down');
  assert.equal(downgrade.tier, 'medium');
  assert.equal(sampler.getTier(), 'medium');
  assert.equal(sampler.getDprScale(), 1.0);
});

test('MilitaryGeometryKit: seeded PRNG determinism, cached primitives, merge normalization, ghost edges, contact shadow, vertical AO', () => {
  const s1 = hashSeed('howitzer', 1, 'desert');
  const s2 = hashSeed('howitzer', 1, 'desert');
  const s3 = hashSeed('howitzer', 2, 'desert');
  assert.equal(s1, s2);
  assert.notEqual(s1, s3);

  const rngA = createSeededRng(s1);
  const rngB = createSeededRng(s1);
  const seqA = Array.from({ length: 12 }, () => rngA());
  const seqB = Array.from({ length: 12 }, () => rngB.next());
  assert.deepEqual(seqA, seqB);
  for (const v of seqA) {
    assert.ok(v >= 0 && v < 1);
  }
  assert.equal(rngA.fork('detail').next(), rngB.fork('detail').next());

  // Cached RoundedBoxGeometry
  const rb1 = getRoundedBoxGeo(1.2, 0.8, 1.5, 0.08, 2);
  const rb2 = getRoundedBoxGeo(1.2, 0.8, 1.5, 0.08, 2);
  assert.strictEqual(rb1, rb2);
  assert.ok(rb1.getAttribute('position').count > 36);

  // Cached ChamferedCylinderGeometry with outward normals
  const cyl1 = getChamferedCylinderGeo(0.5, 0.65, 1.4, 16, 0.08);
  const cyl2 = getChamferedCylinderGeo(0.5, 0.65, 1.4, 16, 0.08);
  assert.strictEqual(cyl1, cyl2);
  const cPos = cyl1.getAttribute('position');
  const cNorm = cyl1.getAttribute('normal');
  let radialOutward = 0;
  for (let i = 0; i < cPos.count; i++) {
    const x = cPos.getX(i);
    const y = cPos.getY(i);
    const z = cPos.getZ(i);
    if (Math.abs(y) < 0.65 && Math.hypot(x, z) > 0.3) {
      const dot = x * cNorm.getX(i) + z * cNorm.getZ(i);
      assert.ok(dot > 0, 'chamfered cylinder side normal must face outward');
      radialOutward++;
    }
  }
  assert.ok(radialOutward > 0);

  // Merge indexed + non-indexed + mixed vertex colors cleanly (must NEVER return null)
  const indexedBox = new THREE.BoxGeometry(1, 1, 1); // indexed, no color
  const nonIndexedRounded = rb1.clone(); // non-indexed, no color
  const coloredCyl = new THREE.CylinderGeometry(0.4, 0.4, 1, 12);
  applyVerticalAOToGeometry(coloredCyl, -0.5, 0.5, 0.45);

  const normBox = normalizeForMerge(indexedBox, { includeColor: true });
  assert.equal(normBox.index, null);
  assert.ok(normBox.getAttribute('position'));
  assert.ok(normBox.getAttribute('normal'));
  assert.ok(normBox.getAttribute('uv'));
  assert.ok(normBox.getAttribute('color'));
  normBox.dispose();

  const merged = mergeStaticGeometries([indexedBox, nonIndexedRounded, coloredCyl]);
  assert.ok(merged instanceof THREE.BufferGeometry);
  assert.equal(merged.index, null);
  assert.ok(merged.getAttribute('position').count > 0);
  assert.ok(merged.getAttribute('normal').count === merged.getAttribute('position').count);
  assert.ok(merged.getAttribute('uv').count === merged.getAttribute('position').count);
  assert.ok(merged.getAttribute('color').count === merged.getAttribute('position').count);

  // Verify vertical AO stays strictly in [0, 1] and is darker at bottom than top
  const aoColors = coloredCyl.getAttribute('color');
  const aoPos = coloredCyl.getAttribute('position');
  let minTopR = 1;
  let maxBotR = 0;
  for (let i = 0; i < aoColors.count; i++) {
    const r = aoColors.getX(i);
    const g = aoColors.getY(i);
    const b = aoColors.getZ(i);
    assert.ok(r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1);
    const y = aoPos.getY(i);
    if (y > 0.45) minTopR = Math.min(minTopR, r);
    if (y < -0.45) maxBotR = Math.max(maxBotR, r);
  }
  assert.ok(maxBotR < minTopR, 'bottom vertices must have darker AO than top vertices');

  // Ghost edges extraction across multiple geometries
  const ghostEdges = createGhostEdges([indexedBox, nonIndexedRounded], 24);
  assert.ok(ghostEdges.getAttribute('position').count > 0);
  assert.equal(ghostEdges.getAttribute('position').count % 2, 0);

  // Contact shadow mesh contract
  const contact = createContactShadowMesh(1.8, 0.4);
  assert.equal(contact.position.y, 0.025);
  assert.equal(contact.userData.noShadow, true);
  assert.equal(contact.material.depthWrite, false);
  assert.equal(contact.material.transparent, true);
  assert.equal(contact.castShadow, false);

  indexedBox.dispose();
  nonIndexedRounded.dispose();
  coloredCyl.dispose();
  merged.dispose();
  ghostEdges.dispose();
  disposeMilitaryGeometryKitCache();
});

test('SurfaceShaderKit: Sobel flat/sloped normal math & deterministic wear shader cache key + r187 patch', () => {
  // 1) Flat surface -> exact (128, 128, 255, 255)
  const flat = new Uint8Array(16 * 16).fill(128);
  const flatNormals = computeSobelNormals(flat, 16, 16, 2.0);
  assert.equal(flatNormals.length, 16 * 16 * 4);
  for (let i = 0; i < flatNormals.length; i += 4) {
    assert.equal(flatNormals[i], 128);
    assert.equal(flatNormals[i + 1], 128);
    assert.equal(flatNormals[i + 2], 255);
    assert.equal(flatNormals[i + 3], 255);
  }

  // 2) Linearly rising ramp along +X (with clamp wrap=false): interior pixels tilt toward -X (R < 128, G = 128, B < 255)
  const rampX = new Float32Array(8 * 8);
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      rampX[y * 8 + x] = x / 7;
    }
  }
  const slopeX = computeSobelNormals(rampX, 8, 8, 2.0, { wrap: false });
  const centerIdx = (4 * 8 + 4) * 4;
  assert.ok(slopeX[centerIdx] < 115, `expected R < 115 on +X ramp, got ${slopeX[centerIdx]}`);
  assert.equal(slopeX[centerIdx + 1], 128);
  assert.ok(slopeX[centerIdx + 2] > 200 && slopeX[centerIdx + 2] < 255);
  assert.equal(slopeX[centerIdx + 3], 255);

  // 3) Linearly rising ramp along +Y (down in canvas = -V in GLSL): interior pixels tilt toward +V (R = 128, G > 128)
  const rampY = new Float32Array(8 * 8);
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      rampY[y * 8 + x] = y / 7;
    }
  }
  const slopeY = computeSobelNormals(rampY, 8, 8, 2.0, { wrap: false });
  assert.equal(slopeY[centerIdx], 128);
  assert.ok(slopeY[centerIdx + 1] > 140, `expected G > 140 on +Y ramp, got ${slopeY[centerIdx + 1]}`);
  assert.ok(slopeY[centerIdx + 2] > 200 && slopeY[centerIdx + 2] < 255);

  // 4) Wear shader deterministic customProgramCacheKey & r187 ShaderLib.standard patching
  const matA = new THREE.MeshStandardMaterial({ color: 0x556644, roughness: 0.78, metalness: 0.04 });
  const matB = new THREE.MeshStandardMaterial({ color: 0x445533, roughness: 0.74, metalness: 0.04 });
  const matSteel = new THREE.MeshStandardMaterial({ color: 0x333840, roughness: 0.35, metalness: 0.88 });

  applyMilitaryWearShader(matA, { variantKey: MILITARY_WEAR_VARIANTS.ARMOR, dirtColor: 0x8a7554 });
  applyMilitaryWearShader(matB, { variantKey: MILITARY_WEAR_VARIANTS.ARMOR, dirtColor: 0x5c4a32 });
  applyMilitaryWearShader(matSteel, { variantKey: MILITARY_WEAR_VARIANTS.STEEL });

  assert.equal(matA.customProgramCacheKey(), 'defcon_wear_v1_armor');
  assert.equal(matB.customProgramCacheKey(), 'defcon_wear_v1_armor');
  assert.equal(matSteel.customProgramCacheKey(), 'defcon_wear_v1_steel');

  // Simulate Three.js r187 shader compile pass directly on ShaderLib.standard sources
  const mockShader = {
    uniforms: {},
    vertexShader: THREE.ShaderLib.standard.vertexShader,
    fragmentShader: THREE.ShaderLib.standard.fragmentShader
  };
  matA.onBeforeCompile(mockShader, null);
  assert.ok(mockShader.vertexShader.includes('vDefconWorldPos'));
  assert.ok(mockShader.vertexShader.includes('vDefconWorldNormal'));
  assert.ok(mockShader.fragmentShader.includes('uDefconDirtColor'));
  assert.ok(mockShader.fragmentShader.includes('defconDirtMask'));
  assert.ok(mockShader.fragmentShader.includes('defconWearMask'));
  assert.ok(mockShader.uniforms.uDefconDirtColor);

  assert.equal(updateMilitaryWearDirtColor(matA, 0x223344), true);
  assert.equal(matA.userData.defconWearUniforms.uDefconDirtColor.value.getHex(), 0x223344);

  matA.dispose();
  matB.dispose();
  matSteel.dispose();
});

test('BiomeEnvironment3D: all 7 biomes defined, worlds.js color identity preserved, arctic white-out constrained', () => {
  const requiredBiomes = ['desert', 'arctic', 'industrial', 'forest', 'canyon', 'swamp', 'volcanic'];
  assert.deepEqual(Object.keys(BIOME_LIGHTING_SPECS).sort(), [...requiredBiomes].sort());

  // Build lookup of canonical colors from src/data/worlds.js
  const worldColors = new Map();
  for (const w of WORLDS) {
    worldColors.set(w.biome, {
      skyColor: w.skyColor,
      fogColor: w.fogColor,
      sunColor: w.sunColor,
      rimColor: w.rimColor
    });
    for (const s of w.stages || []) {
      if (s.biome) {
        worldColors.set(s.biome, {
          skyColor: s.skyColor ?? w.skyColor,
          fogColor: s.fogColor ?? w.fogColor,
          sunColor: s.sunColor ?? w.sunColor,
          rimColor: s.rimColor ?? w.rimColor
        });
      }
    }
  }

  for (const biome of requiredBiomes) {
    const spec = BIOME_LIGHTING_SPECS[biome];
    const wc = worldColors.get(biome);
    assert.ok(wc, `worlds.js missing biome ${biome}`);
    assert.equal(spec.skyColor, wc.skyColor, `${biome} skyColor mismatch with worlds.js`);
    assert.equal(spec.fogColor, wc.fogColor, `${biome} fogColor mismatch with worlds.js`);
    assert.equal(spec.sunColor, wc.sunColor, `${biome} sunColor mismatch with worlds.js`);
    assert.equal(spec.rimColor, wc.rimColor, `${biome} rimColor mismatch with worlds.js`);

    assert.ok(Number.isFinite(spec.sunIntensity) && spec.sunIntensity > 0 && spec.sunIntensity <= 3.5);
    assert.ok(Number.isFinite(spec.hemiIntensity) && spec.hemiIntensity > 0 && spec.hemiIntensity <= 1.6);
    assert.ok(Number.isFinite(spec.rimIntensity) && spec.rimIntensity > 0 && spec.rimIntensity <= 1.6);
    assert.ok(Number.isFinite(spec.envIntensity) && spec.envIntensity > 0 && spec.envIntensity <= 1.4);
    assert.ok(Number.isFinite(spec.exposure) && spec.exposure >= 0.8 && spec.exposure <= 1.25);
    assert.equal(spec.sunPosition.length, 3);
    assert.equal(spec.rimPosition.length, 3);
  }

  // Explicit Arctic white-out guardrails (preserved at 0% >=245) & dark-biome exposure floors
  const arctic = BIOME_LIGHTING_SPECS.arctic;
  assert.ok(arctic.sunIntensity <= 1.85, `arctic sunIntensity too high: ${arctic.sunIntensity}`);
  assert.ok(arctic.envIntensity <= 0.72, `arctic envIntensity too high: ${arctic.envIntensity}`);
  assert.ok(arctic.exposure <= 0.96, `arctic exposure too high: ${arctic.exposure}`);
  assert.ok(arctic.hemiIntensity <= 0.7, `arctic hemiIntensity too high: ${arctic.hemiIntensity}`);

  const volcanic = BIOME_LIGHTING_SPECS.volcanic;
  assert.ok(volcanic.sunIntensity >= 2.8 && volcanic.hemiIntensity >= 1.3 && volcanic.exposure >= 1.12);
  const industrial = BIOME_LIGHTING_SPECS.industrial;
  assert.ok(industrial.sunIntensity >= 2.6 && industrial.hemiIntensity >= 1.05 && industrial.exposure >= 1.1);

  // Sky dome & headless environment handle lifecycle
  const dome = createBiomeSkyDome(getBiomeLightingSpec('arctic'));
  assert.equal(dome.material.side, THREE.BackSide);
  assert.equal(dome.material.depthWrite, false);
  assert.equal(dome.material.fog, false);
  assert.equal(dome.userData.noShadow, true);
  dome.geometry.dispose();
  dome.material.dispose();

  const envHandle = createBiomeEnvironment(null, 'volcanic', { envEnabled: false });
  assert.equal(envHandle.biome, 'volcanic');
  assert.equal(envHandle.envRT, null);
  assert.equal(envHandle.envMap, null);
  assert.ok(envHandle.skyDome instanceof THREE.Mesh);
  envHandle.dispose();
  // Dispose must be idempotent
  envHandle.dispose();
});
