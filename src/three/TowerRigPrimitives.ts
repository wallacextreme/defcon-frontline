import * as THREE from 'three';
import { createPBRMaterial } from './ProceduralPBRTextures.ts';
import {
  applyMilitaryWearShader,
  MILITARY_WEAR_VARIANTS,
  updateMilitaryWearDirtColor
} from './SurfaceShaderKit.ts';
import {
  getRoundedBoxGeo,
  getChamferedCylinderGeo,
  mergeStaticGeometries,
  createContactShadowMesh
} from './MilitaryGeometryKit.ts';

export {
  getRoundedBoxGeo,
  getChamferedCylinderGeo,
  createContactShadowMesh
};

/**
 * Real-world NATO & OpFor PBR military palette.
 */
export const PALETTE = {
  natoOlive: 0x4b5320,
  natoOliveDark: 0x373e17,
  desertTan: 0xc2b280,
  sandbag: 0xb09a6b,
  gunmetal: 0x2a2d34,
  steel: 0x64748b,
  darkSteel: 0x3b424d,
  concrete: 0x6b7075,
  concreteDark: 0x474c52,
  russianCamo: 0x3b4d3b,
  russianDark: 0x2b392b,
  navalWhite: 0xe5e9f0,
  navalGray: 0x5c6773,
  rubber: 0x181a1e,
  brass: 0xc59b47,
  stealthGraphite: 0x1e242d,
  opticGreen: 0x22ff66,
  shtoraRed: 0xff2222,
  radarCyan: 0x22d3ee,
  amber: 0xf59e0b,
  ewPurple: 0xa855f7,
  afterburner: 0xff7b00
};

export interface ModelMaterials {
  olive: THREE.MeshStandardMaterial;
  oliveDark: THREE.MeshStandardMaterial;
  desertArmor: THREE.MeshStandardMaterial;
  sandbag: THREE.MeshStandardMaterial;
  gunmetal: THREE.MeshStandardMaterial;
  steel: THREE.MeshStandardMaterial;
  darkSteel: THREE.MeshStandardMaterial;
  diamondPlate: THREE.MeshStandardMaterial;
  concrete: THREE.MeshStandardMaterial;
  concreteDark: THREE.MeshStandardMaterial;
  rusCamo: THREE.MeshStandardMaterial;
  rusDark: THREE.MeshStandardMaterial;
  blackShark: THREE.MeshStandardMaterial;
  tracks: THREE.MeshStandardMaterial;
  tire: THREE.MeshStandardMaterial;
  navalWhite: THREE.MeshStandardMaterial;
  navalGray: THREE.MeshStandardMaterial;
  copperAesa: THREE.MeshStandardMaterial;
  camoNet: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  sapphireOptic: THREE.MeshStandardMaterial;
  opticGreen: THREE.MeshStandardMaterial;
  shtoraRed: THREE.MeshStandardMaterial;
  radarCyan: THREE.MeshStandardMaterial;
  amberGlow: THREE.MeshStandardMaterial;
  afterburner: THREE.MeshStandardMaterial;
  ewCyan: THREE.MeshStandardMaterial;
  empPurple: THREE.MeshStandardMaterial;
  rotorDisc: THREE.MeshStandardMaterial;
  specTrimA: THREE.MeshStandardMaterial;
  specTrimB: THREE.MeshStandardMaterial;
  specTrimTier: THREE.MeshStandardMaterial;
  ewRingSubtle: THREE.MeshStandardMaterial;
  muzzleFlashGold: THREE.MeshBasicMaterial;
  muzzleFlashCyan: THREE.MeshBasicMaterial;
}

export const TOWER_BIOME_DIRT_COLORS: Record<string, number> = {
  desert: 0x6b583e,
  arctic: 0x9bb2c9,
  industrial: 0x2a2f36,
  forest: 0x364429,
  canyon: 0x6e3a25,
  swamp: 0x253429,
  volcanic: 0x231715
};

let activeTowerDirtColor = TOWER_BIOME_DIRT_COLORS.desert;
let cachedMats: ModelMaterials | null = null;
const geoCache = new Map<string, THREE.BufferGeometry>();
const mergedGeoCache = new Map<string, THREE.BufferGeometry>();

export function getActiveTowerDirtColor(): number {
  return activeTowerDirtColor;
}

export function getGeo<T extends THREE.BufferGeometry>(key: string, factory: () => T): T {
  const existing = geoCache.get(key);
  if (existing) return existing as T;
  const g = factory();
  geoCache.set(key, g);
  return g;
}

export function getChamferedBoxGeo(w: number, h: number, d: number, bevel = 0.03): THREE.BufferGeometry {
  const b = Math.max(0.002, Math.min(bevel, w * 0.22, h * 0.22, d * 0.22));
  const key = `cbox:${w.toFixed(4)}:${h.toFixed(4)}:${d.toFixed(4)}:${b.toFixed(4)}`;
  return getGeo(key, () => {
    const hw = Math.max(0.002, w * 0.5 - b);
    const hh = Math.max(0.002, h * 0.5 - b);
    const coreD = Math.max(0.004, d - 2 * b);
    const shape = new THREE.Shape();
    shape.moveTo(-hw, -hh);
    shape.lineTo(hw, -hh);
    shape.lineTo(hw, hh);
    shape.lineTo(-hw, hh);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: coreD,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: b,
      bevelThickness: b
    });
    geo.translate(0, 0, -coreD * 0.5);
    geo.computeVertexNormals();
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    return geo;
  });
}

export type StructuralMatKey = keyof ModelMaterials;

interface BatchItem {
  pivotKey: string;
  matKey: StructuralMatKey;
  geo: THREE.BufferGeometry;
  px: number;
  py: number;
  pz: number;
  rx: number;
  ry: number;
  rz: number;
  sx: number;
  sy: number;
  sz: number;
}

const batchScratchPos = new THREE.Vector3();
const batchScratchEuler = new THREE.Euler();
const batchScratchQuat = new THREE.Quaternion();
const batchScratchScale = new THREE.Vector3();
const batchScratchMat = new THREE.Matrix4();

/**
 * Collects static geometry parts by `(pivotKey, matKey)`, transforming temporary clones
 * and caching one merged BufferGeometry per `(defId, vLevel, spec, pivotKey, matKey)`.
 */
export class StaticMeshBatcher {
  private readonly cachePrefix: string;
  private readonly items: BatchItem[] = [];

  constructor(defId: string, vLevel: number, spec: 'A' | 'B' | null) {
    this.cachePrefix = `${defId}:${vLevel}:${spec ?? 'none'}`;
  }

  add(
    pivotKey: string,
    matKey: StructuralMatKey,
    geo: THREE.BufferGeometry,
    px = 0,
    py = 0,
    pz = 0,
    rx = 0,
    ry = 0,
    rz = 0,
    sx = 1,
    sy = 1,
    sz = 1
  ): void {
    this.items.push({ pivotKey, matKey, geo, px, py, pz, rx, ry, rz, sx, sy, sz });
  }

  flush(pivots: Record<string, THREE.Object3D>, mats: ModelMaterials): THREE.Mesh[] {
    const groups = new Map<string, { pivotKey: string; matKey: StructuralMatKey; list: BatchItem[] }>();
    for (let i = 0; i < this.items.length; i++) {
      const it = this.items[i];
      const gk = `${it.pivotKey}:${it.matKey}`;
      let g = groups.get(gk);
      if (!g) {
        g = { pivotKey: it.pivotKey, matKey: it.matKey, list: [] };
        groups.set(gk, g);
      }
      g.list.push(it);
    }

    const created: THREE.Mesh[] = [];
    for (const { pivotKey, matKey, list } of groups.values()) {
      const parent = pivots[pivotKey];
      if (!parent) continue;

      const cacheKey = `${this.cachePrefix}:${pivotKey}:${matKey}`;
      let mergedGeo = mergedGeoCache.get(cacheKey);
      if (!mergedGeo) {
        const clones: THREE.BufferGeometry[] = new Array(list.length);
        for (let i = 0; i < list.length; i++) {
          const it = list[i];
          const clone = it.geo.clone();
          batchScratchPos.set(it.px, it.py, it.pz);
          batchScratchEuler.set(it.rx, it.ry, it.rz);
          batchScratchQuat.setFromEuler(batchScratchEuler);
          batchScratchScale.set(it.sx, it.sy, it.sz);
          batchScratchMat.compose(batchScratchPos, batchScratchQuat, batchScratchScale);
          clone.applyMatrix4(batchScratchMat);
          clones[i] = clone;
        }
        mergedGeo = mergeStaticGeometries(clones, {
          preserveVertexColors: false,
          disposeInputs: true
        });
        mergedGeoCache.set(cacheKey, mergedGeo);
      }

      const mesh = new THREE.Mesh(mergedGeo, mats[matKey] as THREE.Material);
      mesh.name = `${pivotKey}_${matKey}`;
      const isEmissiveTrim = matKey === 'specTrimA' || matKey === 'specTrimB' || matKey === 'specTrimTier';
      if (isEmissiveTrim || matKey === 'diamondPlate' || pivotKey.startsWith('radar_')) {
        mesh.userData.noShadow = true;
        mesh.castShadow = false;
        if (isEmissiveTrim) {
          mesh.receiveShadow = false;
        }
      }
      parent.add(mesh);
      created.push(mesh);
    }

    return created;
  }
}

export function getCutCornerSlabGeo(
  w: number,
  h: number,
  d: number,
  corner = 0.55,
  bevel = 0.03
): THREE.BufferGeometry {
  const b = Math.min(bevel, h * 0.25);
  const hw = Math.max(0.05, w * 0.5 - b);
  const hd = Math.max(0.05, d * 0.5 - b);
  const c = Math.max(0.04, Math.min(corner, hw * 0.72, hd * 0.72));
  const coreH = Math.max(0.02, h - 2 * b);
  return createPlanExtrudeGeo(
    [
      [-hw + c, -hd],
      [hw - c, -hd],
      [hw, -hd + c],
      [hw, hd - c],
      [hw - c, hd],
      [-hw + c, hd],
      [-hw, hd - c],
      [-hw, -hd + c]
    ],
    coreH,
    b,
    b
  );
}

export function createBatchedMissileCapsMesh(
  cacheKey: string,
  positions: ReadonlyArray<[number, number, number]>,
  r: number,
  mat: THREE.Material,
  lengthScale = 1.0,
  radialSegs = 12
): THREE.Mesh {
  let mergedGeo = mergedGeoCache.get(cacheKey);
  if (!mergedGeo) {
    const baseGeo = createLatheAlongZGeo(
      [
        [r * 0.95, 0],
        [r * 0.95, r * 0.7 * lengthScale],
        [r * 0.55, r * 1.45 * lengthScale],
        [0.001, r * 1.9 * lengthScale]
      ],
      radialSegs
    );
    const clones: THREE.BufferGeometry[] = new Array(positions.length);
    for (let i = 0; i < positions.length; i++) {
      const [px, py, pz] = positions[i];
      const clone = baseGeo.clone();
      clone.translate(px, py, pz);
      clones[i] = clone;
    }
    mergedGeo = mergeStaticGeometries(clones, {
      preserveVertexColors: false,
      disposeInputs: true
    });
    mergedGeoCache.set(cacheKey, mergedGeo);
  }
  const mesh = new THREE.Mesh(mergedGeo, mat);
  mesh.name = 'missileCaps_batched';
  mesh.userData.noShadow = true;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}

export function getMats(): ModelMaterials {
  if (cachedMats) return cachedMats;

  const mats: ModelMaterials = {
    olive: createPBRMaterial('natoArmorPlate', {
      color: 0xd4dcbe,
      roughness: 0.74,
      metalness: 0.04,
      envMapIntensity: 1.05,
      repeat: [1, 1]
    }),
    oliveDark: createPBRMaterial('natoArmorPlate', {
      color: 0x9aa484,
      roughness: 0.76,
      metalness: 0.05,
      envMapIntensity: 1.0,
      repeat: [1, 1]
    }),
    desertArmor: createPBRMaterial('desertCarcPlate', {
      color: 0xede6d3,
      roughness: 0.78,
      metalness: 0.04,
      envMapIntensity: 1.0,
      repeat: [1, 1]
    }),
    sandbag: createPBRMaterial('sandbagBurlap', {
      roughness: 0.94,
      metalness: 0.0,
      envMapIntensity: 0.65,
      repeat: [1.2, 1.2]
    }),
    gunmetal: new THREE.MeshStandardMaterial({
      color: PALETTE.gunmetal,
      roughness: 0.3,
      metalness: 0.88,
      envMapIntensity: 1.35
    }),
    steel: new THREE.MeshStandardMaterial({
      color: 0x7a899b,
      roughness: 0.44,
      metalness: 0.82,
      envMapIntensity: 1.05
    }),
    darkSteel: new THREE.MeshStandardMaterial({
      color: PALETTE.darkSteel,
      roughness: 0.46,
      metalness: 0.78,
      envMapIntensity: 1.05
    }),
    diamondPlate: createPBRMaterial('diamondSteelPlate', {
      roughness: 0.56,
      metalness: 0.78,
      normalScale: new THREE.Vector2(0.42, 0.42),
      envMapIntensity: 1.0,
      repeat: [2, 2]
    }),
    concrete: createPBRMaterial('concreteBunker', {
      color: 0xd0d4da,
      roughness: 0.9,
      metalness: 0.02,
      envMapIntensity: 0.78,
      repeat: [1, 1]
    }),
    concreteDark: createPBRMaterial('concreteBunker', {
      color: 0x9298a0,
      roughness: 0.88,
      metalness: 0.03,
      envMapIntensity: 0.82,
      repeat: [1, 1]
    }),
    rusCamo: createPBRMaterial('opforCamoPlate', {
      roughness: 0.72,
      metalness: 0.04,
      envMapIntensity: 1.05,
      repeat: [1, 1]
    }),
    rusDark: createPBRMaterial('opforCamoPlate', {
      color: 0xa2afa2,
      roughness: 0.75,
      metalness: 0.05,
      envMapIntensity: 1.05,
      repeat: [1, 1]
    }),
    blackShark: new THREE.MeshStandardMaterial({
      color: 0x1a1e24,
      roughness: 0.42,
      metalness: 0.55,
      envMapIntensity: 1.2
    }),
    tracks: createPBRMaterial('tankTracks', {
      roughness: 0.62,
      metalness: 0.65,
      envMapIntensity: 1.1,
      repeat: [1, 3.2]
    }),
    tire: createPBRMaterial('offroadTire', {
      roughness: 0.86,
      metalness: 0.02,
      envMapIntensity: 0.72,
      repeat: [2, 1]
    }),
    navalWhite: new THREE.MeshStandardMaterial({
      color: 0xd8dde4,
      roughness: 0.42,
      metalness: 0.04,
      envMapIntensity: 1.0
    }),
    navalGray: new THREE.MeshStandardMaterial({
      color: PALETTE.navalGray,
      roughness: 0.56,
      metalness: 0.05,
      envMapIntensity: 1.05
    }),
    copperAesa: new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0x451a03,
      emissiveIntensity: 0.35,
      roughness: 0.26,
      metalness: 0.85,
      envMapIntensity: 1.35
    }),
    camoNet: new THREE.MeshStandardMaterial({
      color: 0x5b6331,
      roughness: 0.92,
      metalness: 0.0,
      side: THREE.DoubleSide
    }),
    brass: new THREE.MeshStandardMaterial({
      color: PALETTE.brass,
      roughness: 0.26,
      metalness: 0.9,
      envMapIntensity: 1.35
    }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x0b1628,
      roughness: 0.08,
      metalness: 0.92,
      envMapIntensity: 1.5
    }),
    sapphireOptic: new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.85,
      roughness: 0.1,
      metalness: 0.9,
      envMapIntensity: 1.5
    }),
    opticGreen: new THREE.MeshStandardMaterial({
      color: PALETTE.opticGreen,
      emissive: PALETTE.opticGreen,
      emissiveIntensity: 2.0,
      roughness: 0.18
    }),
    shtoraRed: new THREE.MeshStandardMaterial({
      color: PALETTE.shtoraRed,
      emissive: PALETTE.shtoraRed,
      emissiveIntensity: 2.5,
      roughness: 0.2
    }),
    radarCyan: new THREE.MeshStandardMaterial({
      color: PALETTE.radarCyan,
      emissive: PALETTE.radarCyan,
      emissiveIntensity: 1.9,
      roughness: 0.2
    }),
    amberGlow: new THREE.MeshStandardMaterial({
      color: PALETTE.amber,
      emissive: PALETTE.amber,
      emissiveIntensity: 1.9,
      roughness: 0.2
    }),
    afterburner: new THREE.MeshStandardMaterial({
      color: PALETTE.afterburner,
      emissive: PALETTE.afterburner,
      emissiveIntensity: 3.1,
      roughness: 0.2
    }),
    ewCyan: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.6,
      transparent: true,
      opacity: 0.45,
      roughness: 0.2,
      side: THREE.DoubleSide
    }),
    empPurple: new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0xa855f7,
      emissiveIntensity: 2.2,
      roughness: 0.2
    }),
    rotorDisc: new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.16,
      roughness: 0.5,
      depthWrite: false,
      side: THREE.DoubleSide
    }),
    // Discrete tactical trims (< bloom threshold 1.14) for <= 5% emissive area
    specTrimA: new THREE.MeshStandardMaterial({
      color: PALETTE.radarCyan,
      emissive: 0x0891b2,
      emissiveIntensity: 0.65,
      roughness: 0.32,
      metalness: 0.45
    }),
    specTrimB: new THREE.MeshStandardMaterial({
      color: PALETTE.amber,
      emissive: 0xb45309,
      emissiveIntensity: 0.65,
      roughness: 0.32,
      metalness: 0.45
    }),
    specTrimTier: new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x15803d,
      emissiveIntensity: 0.55,
      roughness: 0.35,
      metalness: 0.45
    }),
    ewRingSubtle: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.36,
      roughness: 0.25,
      depthWrite: false,
      side: THREE.DoubleSide
    }),
    // HDR MeshBasicMaterial (color > 1 triggers UnrealBloomPass without ANY PointLight)
    muzzleFlashGold: new THREE.MeshBasicMaterial({
      color: new THREE.Color(2.4, 1.75, 0.55),
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }),
    muzzleFlashCyan: new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.55, 1.95, 2.5),
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  };

  // Global SurfaceShaderKit wear shader strictly partitioned into 3 canonical variants
  for (const key of ['olive', 'oliveDark', 'desertArmor', 'navalGray'] as const) {
    applyMilitaryWearShader(mats[key], {
      variantKey: MILITARY_WEAR_VARIANTS.ARMOR,
      dirtHeight: 0.72,
      dirtStrength: 0.34,
      dirtColor: activeTowerDirtColor,
      edgeWearStrength: 0.18,
      macroVarStrength: 0.06
    });
  }
  applyMilitaryWearShader(mats.navalWhite, {
    variantKey: MILITARY_WEAR_VARIANTS.ARMOR,
    dirtHeight: 0.55,
    dirtStrength: 0.22,
    dirtColor: activeTowerDirtColor,
    edgeWearStrength: 0.12,
    macroVarStrength: 0.04
  });

  for (const key of ['gunmetal', 'steel', 'darkSteel', 'diamondPlate'] as const) {
    applyMilitaryWearShader(mats[key], {
      variantKey: MILITARY_WEAR_VARIANTS.STEEL,
      dirtHeight: 0.6,
      dirtStrength: 0.28,
      dirtColor: activeTowerDirtColor,
      edgeWearStrength: 0.22,
      macroVarStrength: 0.05
    });
  }

  for (const key of ['concrete', 'concreteDark', 'sandbag'] as const) {
    applyMilitaryWearShader(mats[key], {
      variantKey: MILITARY_WEAR_VARIANTS.CONCRETE,
      dirtHeight: 0.55,
      dirtStrength: 0.4,
      dirtColor: activeTowerDirtColor,
      edgeWearStrength: 0.07,
      macroVarStrength: 0.07
    });
  }

  cachedMats = mats;
  return cachedMats;
}

/**
 * Updates the world-space base dirt color uniform across all structural tower materials in-place.
 */
export function updateTowerWearBiomeDirtColor(biome: string): void {
  const dirtHex = TOWER_BIOME_DIRT_COLORS[biome] ?? TOWER_BIOME_DIRT_COLORS.desert;
  activeTowerDirtColor = dirtHex;
  if (!cachedMats) return;
  for (const mat of Object.values(cachedMats)) {
    updateMilitaryWearDirtColor(mat, dirtHex);
  }
}

// ============================================================================
// CACHED CAD PROCEDURAL GEOMETRY HELPERS
// ============================================================================

export function enableShadows(obj: THREE.Object3D, cast = true, receive = true) {
  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const m = child as THREE.Mesh;
      if (m.userData?.noShadow) {
        m.castShadow = false;
        m.receiveShadow = false;
      } else {
        m.castShadow = cast;
        m.receiveShadow = receive;
      }
    }
  });
}

export function createSideExtrudeGeo(
  pointsZY: [number, number][],
  width: number,
  bevelSize = 0.035,
  bevelThickness = 0.035
): THREE.BufferGeometry {
  const key = `se:${width}:${bevelSize}:${bevelThickness}:${pointsZY.map((p) => `${p[0]},${p[1]}`).join(';')}`;
  return getGeo(key, () => {
    const shape = new THREE.Shape();
    shape.moveTo(pointsZY[0][0], pointsZY[0][1]);
    for (let i = 1; i < pointsZY.length; i++) {
      shape.lineTo(pointsZY[i][0], pointsZY[i][1]);
    }
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: width,
      bevelEnabled: bevelSize > 0 && bevelThickness > 0,
      bevelSegments: 2,
      steps: 1,
      bevelSize,
      bevelThickness
    });
    geo.translate(0, 0, -width * 0.5);
    geo.rotateY(-Math.PI * 0.5);
    geo.computeVertexNormals();
    return geo;
  });
}

export function createPlanExtrudeGeo(
  pointsXZ: [number, number][],
  height: number,
  bevelSize = 0.03,
  bevelThickness = 0.03
): THREE.BufferGeometry {
  const key = `pe:${height}:${bevelSize}:${bevelThickness}:${pointsXZ.map((p) => `${p[0]},${p[1]}`).join(';')}`;
  return getGeo(key, () => {
    const shape = new THREE.Shape();
    shape.moveTo(pointsXZ[0][0], -pointsXZ[0][1]);
    for (let i = 1; i < pointsXZ.length; i++) {
      shape.lineTo(pointsXZ[i][0], -pointsXZ[i][1]);
    }
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: bevelSize > 0 && bevelThickness > 0,
      bevelSegments: 2,
      steps: 1,
      bevelSize,
      bevelThickness
    });
    geo.rotateX(-Math.PI * 0.5);
    geo.computeVertexNormals();
    return geo;
  });
}

export function createLatheAlongZGeo(profileRZ: [number, number][], seg = 14): THREE.BufferGeometry {
  const key = `lz:${seg}:${profileRZ.map((p) => `${p[0]},${p[1]}`).join(';')}`;
  return getGeo(key, () => {
    const pts = profileRZ.map(([r, z]) => new THREE.Vector2(Math.max(0.0001, r), z));
    const geo = new THREE.LatheGeometry(pts, seg);
    geo.rotateX(Math.PI * 0.5);
    geo.computeVertexNormals();
    return geo;
  });
}

export function createLatheYGeo(profileRY: [number, number][], seg = 18): THREE.BufferGeometry {
  const key = `ly:${seg}:${profileRY.map((p) => `${p[0]},${p[1]}`).join(';')}`;
  return getGeo(key, () => {
    const pts = profileRY.map(([r, y]) => new THREE.Vector2(Math.max(0.0001, r), y));
    const geo = new THREE.LatheGeometry(pts, seg);
    geo.computeVertexNormals();
    return geo;
  });
}

/**
 * Attaches a bloom-ready HDR emissive muzzle flash mesh (NO PointLight = ZERO shader recompiles).
 */
export function attachMuzzleFlashMesh(
  parent: THREE.Object3D,
  mats: ModelMaterials,
  x: number,
  y: number,
  z: number,
  scale = 1.0,
  cyan = false
): THREE.Group {
  const flash = new THREE.Group();
  flash.position.set(x, y, z);
  flash.visible = false;

  const mat = cyan ? mats.muzzleFlashCyan : mats.muzzleFlashGold;
  const coreGeo = getGeo('mf_core', () => new THREE.SphereGeometry(0.22, 8, 6));
  const spikeGeo = getGeo('mf_spike', () => new THREE.ConeGeometry(0.14, 0.78, 6));

  const core = new THREE.Mesh(coreGeo, mat);
  core.userData.noShadow = true;
  flash.add(core);

  const forwardSpike = new THREE.Mesh(spikeGeo, mat);
  forwardSpike.rotation.x = Math.PI / 2;
  forwardSpike.position.z = 0.36;
  forwardSpike.userData.noShadow = true;
  flash.add(forwardSpike);

  const crossH = new THREE.Mesh(spikeGeo, mat);
  crossH.rotation.z = Math.PI / 2;
  crossH.scale.set(0.6, 0.75, 0.6);
  crossH.userData.noShadow = true;
  flash.add(crossH);

  flash.scale.setScalar(scale);
  parent.add(flash);
  return flash;
}

// ============================================================================
// PUBLIC RIG INTERFACES
// ============================================================================

export interface TowerRig3D {
  root: THREE.Group;
  turretPivot?: THREE.Group;
  barrelPivot?: THREE.Group;
  gatlingPivot?: THREE.Group;
  radarPivots?: THREE.Object3D[];
  ewRings?: THREE.Mesh[];
  missileCaps?: THREE.Object3D[];
  muzzlePoint?: THREE.Object3D;
  muzzleFlashMesh?: THREE.Group;
  laserBeam?: THREE.Mesh;
  aesaPanel?: THREE.Mesh;
}

export interface EnemyRig3D {
  root: THREE.Group;
  hullGroup: THREE.Group;
  turretPivot?: THREE.Group;
  rotors?: THREE.Object3D[];
  wheels?: THREE.Object3D[];
  legs?: THREE.Object3D[];
  ewRing?: THREE.Mesh;
  apsShield?: THREE.Mesh;
  energyShieldMesh?: THREE.Mesh;
  prepRing?: THREE.Mesh;
  eraMeshes?: THREE.Object3D[];
  stealthMaterials?: THREE.MeshStandardMaterial[];
  hitMeshes: THREE.Mesh[];
}
