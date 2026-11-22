import * as THREE from 'three';
import { createPBRMaterial } from './ProceduralPBRTextures.ts';
import { applyMilitaryWearShader, MILITARY_WEAR_VARIANTS } from './SurfaceShaderKit.ts';

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

interface ModelMaterials {
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
  muzzleFlashGold: THREE.MeshBasicMaterial;
  muzzleFlashCyan: THREE.MeshBasicMaterial;
}

let cachedMats: ModelMaterials | null = null;
const geoCache = new Map<string, THREE.BufferGeometry>();
const ghostCache = new Map<string, { root: THREE.Group; setValid: (valid: boolean) => void }>();

function getGeo<T extends THREE.BufferGeometry>(key: string, factory: () => T): T {
  const existing = geoCache.get(key);
  if (existing) return existing as T;
  const g = factory();
  geoCache.set(key, g);
  return g;
}

export function getMats(): ModelMaterials {
  if (cachedMats) return cachedMats;

  cachedMats = {
    olive: createPBRMaterial('natoArmorPlate', {
      color: 0xd4dcbe,
      roughness: 0.68,
      metalness: 0.24,
      envMapIntensity: 1.15,
      bumpScale: 0.035,
      repeat: [1.5, 1.5]
    }),
    oliveDark: createPBRMaterial('natoArmorPlate', {
      color: 0x9aa484,
      roughness: 0.72,
      metalness: 0.28,
      envMapIntensity: 1.1,
      bumpScale: 0.035,
      repeat: [1.5, 1.5]
    }),
    desertArmor: createPBRMaterial('desertCarcPlate', {
      color: 0xede6d3,
      roughness: 0.74,
      metalness: 0.16,
      envMapIntensity: 1.05,
      bumpScale: 0.03,
      repeat: [1.5, 1.5]
    }),
    sandbag: createPBRMaterial('sandbagBurlap', {
      roughness: 0.94,
      metalness: 0.02,
      bumpScale: 0.08,
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
      roughness: 0.34,
      metalness: 0.84,
      envMapIntensity: 1.3
    }),
    darkSteel: new THREE.MeshStandardMaterial({
      color: PALETTE.darkSteel,
      roughness: 0.38,
      metalness: 0.8,
      envMapIntensity: 1.25
    }),
    diamondPlate: createPBRMaterial('diamondSteelPlate', {
      roughness: 0.42,
      metalness: 0.78,
      bumpScale: 0.055,
      envMapIntensity: 1.25,
      repeat: [2, 2]
    }),
    concrete: createPBRMaterial('concreteBunker', {
      color: 0xd0d4da,
      roughness: 0.9,
      metalness: 0.06,
      bumpScale: 0.045,
      envMapIntensity: 0.8,
      repeat: [1.5, 1.5]
    }),
    concreteDark: createPBRMaterial('concreteBunker', {
      color: 0x9298a0,
      roughness: 0.88,
      metalness: 0.1,
      bumpScale: 0.045,
      envMapIntensity: 0.85,
      repeat: [1.5, 1.5]
    }),
    rusCamo: createPBRMaterial('opforCamoPlate', {
      roughness: 0.7,
      metalness: 0.24,
      bumpScale: 0.035,
      envMapIntensity: 1.1,
      repeat: [1.5, 1.5]
    }),
    rusDark: createPBRMaterial('opforCamoPlate', {
      color: 0xa2afa2,
      roughness: 0.74,
      metalness: 0.28,
      bumpScale: 0.035,
      envMapIntensity: 1.1,
      repeat: [1.5, 1.5]
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
      bumpScale: 0.075,
      envMapIntensity: 1.1,
      repeat: [1, 3.2]
    }),
    tire: createPBRMaterial('offroadTire', {
      roughness: 0.86,
      metalness: 0.08,
      bumpScale: 0.07,
      envMapIntensity: 0.75,
      repeat: [2, 1]
    }),
    navalWhite: new THREE.MeshStandardMaterial({
      color: PALETTE.navalWhite,
      roughness: 0.28,
      metalness: 0.3,
      envMapIntensity: 1.2
    }),
    navalGray: new THREE.MeshStandardMaterial({
      color: PALETTE.navalGray,
      roughness: 0.42,
      metalness: 0.62,
      envMapIntensity: 1.2
    }),
    copperAesa: new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0x451a03,
      emissiveIntensity: 0.45,
      roughness: 0.26,
      metalness: 0.85,
      envMapIntensity: 1.35
    }),
    camoNet: new THREE.MeshStandardMaterial({
      color: 0x5b6331,
      roughness: 0.92,
      metalness: 0.05,
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

  return cachedMats;
}

// ============================================================================
// CACHED CAD PROCEDURAL GEOMETRY HELPERS
// ============================================================================

function enableShadows(obj: THREE.Object3D, cast = true, receive = true) {
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

function addBox(
  parent: THREE.Object3D,
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  rx = 0,
  ry = 0,
  rz = 0
): THREE.Mesh {
  const geo = getGeo(`box:${w}:${h}:${d}`, () => new THREE.BoxGeometry(w, h, d));
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  parent.add(mesh);
  return mesh;
}

function addCyl(
  parent: THREE.Object3D,
  rt: number,
  rb: number,
  h: number,
  seg: number,
  mat: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  rx = 0,
  ry = 0,
  rz = 0
): THREE.Mesh {
  const geo = getGeo(`cyl:${rt}:${rb}:${h}:${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg));
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  parent.add(mesh);
  return mesh;
}

function createSideExtrudeGeo(
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

function createPlanExtrudeGeo(
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

function createLatheAlongZGeo(profileRZ: [number, number][], seg = 14): THREE.BufferGeometry {
  const key = `lz:${seg}:${profileRZ.map((p) => `${p[0]},${p[1]}`).join(';')}`;
  return getGeo(key, () => {
    const pts = profileRZ.map(([r, z]) => new THREE.Vector2(Math.max(0.0001, r), z));
    const geo = new THREE.LatheGeometry(pts, seg);
    geo.rotateX(Math.PI * 0.5);
    geo.computeVertexNormals();
    return geo;
  });
}

function createLatheYGeo(profileRY: [number, number][], seg = 18): THREE.BufferGeometry {
  const key = `ly:${seg}:${profileRY.map((p) => `${p[0]},${p[1]}`).join(';')}`;
  return getGeo(key, () => {
    const pts = profileRY.map(([r, y]) => new THREE.Vector2(Math.max(0.0001, r), y));
    const geo = new THREE.LatheGeometry(pts, seg);
    geo.computeVertexNormals();
    return geo;
  });
}

function addSandbagRing(
  parent: THREE.Object3D,
  radius: number,
  count: number,
  mat: THREE.Material,
  y = 0.22,
  levels = 1
) {
  const bagGeo = createSideExtrudeGeo(
    [
      [-0.17, -0.1],
      [0.17, -0.1],
      [0.15, 0.1],
      [-0.15, 0.1]
    ],
    0.54,
    0.025,
    0.025
  );

  for (let l = 0; l < levels; l++) {
    const offsetAng = l % 2 === 1 ? Math.PI / count : 0;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + offsetAng;
      const bag = new THREE.Mesh(bagGeo, mat);
      bag.position.set(Math.sin(a) * radius, y + l * 0.21, Math.cos(a) * radius);
      bag.rotation.y = a;
      bag.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.04;
      parent.add(bag);
    }
  }
}

function addMilitaryWheel(
  parent: THREE.Object3D,
  mats: ModelMaterials,
  x: number,
  radius: number,
  z: number,
  width = 0.24,
  hubMat: THREE.Material = mats.rusDark
): THREE.Group {
  const wheelGroup = new THREE.Group();
  wheelGroup.position.set(x, radius, z);
  parent.add(wheelGroup);

  addCyl(wheelGroup, radius, radius, width, 16, mats.tire, 0, 0, 0, 0, 0, Math.PI / 2);
  addCyl(wheelGroup, radius * 0.56, radius * 0.56, width + 0.02, 12, hubMat, 0, 0, 0, 0, 0, Math.PI / 2);
  addCyl(wheelGroup, radius * 0.24, radius * 0.28, width + 0.06, 8, mats.darkSteel, 0, 0, 0, 0, 0, Math.PI / 2);
  return wheelGroup;
}

function addMissileCap(
  parent: THREE.Object3D,
  _mats: ModelMaterials,
  r: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material
): THREE.Mesh {
  const capGeo = createLatheAlongZGeo(
    [
      [r * 0.95, 0],
      [r * 0.95, r * 0.7],
      [r * 0.55, r * 1.45],
      [0.001, r * 1.9]
    ],
    10
  );
  const cap = new THREE.Mesh(capGeo, mat);
  cap.position.set(x, y, z);
  parent.add(cap);
  return cap;
}

/**
 * Attaches a bloom-ready HDR emissive muzzle flash mesh (NO PointLight = ZERO shader recompiles).
 */
function attachMuzzleFlashMesh(
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
// PUBLIC RIG INTERFACES & FACTORY EXPORTS
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

export function createTowerModel3D(
  defId: string,
  level = 1,
  specialization: 'A' | 'B' | null = null
): TowerRig3D {
  const root = new THREE.Group();
  const rig: TowerRig3D = { root };
  const mats = getMats();
  const vLevel = level <= 1 ? 1 : level <= 3 ? 2 : 3;

  if (defId === 'hesco') {
    buildHescoModel(root, mats, vLevel);
    enableShadows(root, true, true);
    return rig;
  }

  if (defId === 'm2_bunker') {
    buildM2Bunker(root, rig, mats, vLevel);
  } else if (defId === 'bushmaster') {
    buildBushmaster(root, rig, mats, vLevel);
  } else if (defId === 'javelin') {
    buildJavelin(root, rig, mats, vLevel);
  } else if (defId === 'phalanx') {
    buildPhalanx(root, rig, mats, vLevel);
  } else if (defId === 'howitzer') {
    buildHowitzer(root, rig, mats, vLevel);
  } else if (defId === 'patriot') {
    buildPatriot(root, rig, mats, vLevel);
  } else if (defId === 'ew_crew') {
    buildEwCrew(root, rig, mats, vLevel);
  } else if (defId === 'abrams_pit') {
    buildAbramsPit(root, rig, mats, vLevel);
  } else if (defId === 'iron_dome') {
    buildIronDome(root, rig, mats, vLevel);
  } else if (defId === 'helios_laser') {
    buildHeliosLaser(root, rig, mats, vLevel);
  } else if (defId === 'tos1_mlrs') {
    buildTos1Mlrs(root, rig, mats, vLevel);
  } else if (defId === 'ballista') {
    buildBallista(root, rig, mats, vLevel);
  } else if (defId === 'sniper_tower') {
    buildSniperTower(root, rig, mats, vLevel);
  } else if (defId === 'cryo_tower') {
    buildCryoTower(root, rig, mats, vLevel);
  } else if (defId === 'tesla_tower') {
    buildTeslaTower(root, rig, mats, vLevel);
  } else if (defId === 'toxic_tower') {
    buildToxicTower(root, rig, mats, vLevel);
  } else if (defId === 'flamethrower') {
    buildFlamethrower(root, rig, mats, vLevel);
  } else if (defId === 'railgun') {
    buildRailgun(root, rig, mats, vLevel);
  } else if (defId === 'harpoon_tower') {
    buildHarpoonTower(root, rig, mats, vLevel);
  } else if (defId === 'minefield') {
    buildMinefieldLayer(root, rig, mats, vLevel);
  } else if (defId === 'eng_workshop') {
    buildEngWorkshop(root, rig, mats, vLevel);
  } else if (defId === 'energy_extractor') {
    buildEnergyExtractor(root, rig, mats, vLevel);
  }

  // Visual tier / specialization emblem ring on base
  if (level >= 4 || specialization) {
    const ringMat =
      specialization === 'A'
        ? mats.radarCyan
        : specialization === 'B'
          ? mats.amberGlow
          : mats.opticGreen;
    const specRing = new THREE.Mesh(
      getGeo('tower_spec_ring', () => new THREE.TorusGeometry(1.78, 0.055, 8, 28)),
      ringMat
    );
    specRing.rotation.x = Math.PI / 2;
    specRing.position.y = 0.24;
    specRing.userData.noShadow = true;
    root.add(specRing);

    if (level >= 6 && specialization) {
      const crownRing = new THREE.Mesh(
        getGeo('tower_master_ring', () => new THREE.TorusGeometry(1.92, 0.045, 8, 28)),
        specialization === 'A' ? mats.sapphireOptic : mats.afterburner
      );
      crownRing.rotation.x = Math.PI / 2;
      crownRing.position.y = 0.34;
      crownRing.userData.noShadow = true;
      root.add(crownRing);
    }
  }

  enableShadows(root, true, true);
  if (rig.ewRings) {
    rig.ewRings.forEach((r) => {
      r.castShadow = false;
      r.receiveShadow = false;
    });
  }
  return rig;
}

// ============================================================================
// ALLIED TOWERS (12 weapons, Lv1-3)
// ============================================================================

function buildHescoModel(root: THREE.Group, mats: ModelMaterials, level: number) {
  addBox(root, 3.35, 0.16, 3.35, mats.concreteDark, 0, 0.08, 0);

  const cellGeo = createPlanExtrudeGeo(
    [
      [-0.64, -0.64],
      [0.64, -0.64],
      [0.64, 0.64],
      [-0.64, 0.64]
    ],
    1.22,
    0.03,
    0.03
  );

  const offsets = [
    [-0.78, -0.78],
    [0.78, -0.78],
    [-0.78, 0.78],
    [0.78, 0.78]
  ];
  for (const [ox, oz] of offsets) {
    const cell = new THREE.Mesh(cellGeo, mats.sandbag);
    cell.position.set(ox, 0.16, oz);
    root.add(cell);
    addBox(root, 1.18, 0.14, 1.18, mats.concrete, ox, 1.44, oz);
    for (const cx of [-0.67, 0.67]) {
      for (const cz of [-0.67, 0.67]) {
        addBox(root, 0.06, 1.38, 0.06, mats.darkSteel, ox + cx, 0.82, oz + cz);
      }
    }
    addBox(root, 1.38, 0.05, 1.38, mats.steel, ox, 0.45, oz);
    addBox(root, 1.38, 0.05, 1.38, mats.steel, ox, 1.05, oz);
  }

  addSandbagRing(root, 1.65, 12, mats.sandbag, 0.24, level >= 2 ? 2 : 1);

  const coilGeo = getGeo('hesco_coil', () => new THREE.TorusGeometry(0.28, 0.03, 6, 12));
  for (let i = -3; i <= 3; i++) {
    const coil = new THREE.Mesh(coilGeo, mats.steel);
    coil.position.set(i * 0.36, 1.68, 0);
    coil.rotation.y = Math.PI * 0.35 + i * 0.2;
    root.add(coil);
  }
}

function buildM2Bunker(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.62, 1.74, 0.22, 8, mats.concrete, 0, 0.11, 0);
  addCyl(root, 1.04, 1.1, 0.16, 8, mats.diamondPlate, 0, 0.28, 0);
  addSandbagRing(root, 1.38, 12, mats.sandbag, 0.32, level >= 2 ? 3 : 2);

  if (level < 3) {
    addBox(root, 1.7, 0.06, 0.72, mats.camoNet, 0, 1.35, -0.82, -0.22, 0, 0);
    addCyl(root, 0.03, 0.03, 1.15, 6, mats.oliveDark, -0.82, 0.78, -1.05);
    addCyl(root, 0.03, 0.03, 1.15, 6, mats.oliveDark, 0.82, 0.78, -1.05);
  } else {
    addBox(root, 0.62, 0.42, 0.48, mats.oliveDark, -0.68, 0.56, -0.68);
    addBox(root, 0.48, 0.32, 0.36, mats.brass, 0.68, 0.5, -0.62);
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.38, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  if (level === 1) {
    for (const ang of [0, 2.2, -2.2]) {
      addBox(
        turretPivot,
        0.075,
        0.68,
        0.075,
        mats.darkSteel,
        Math.sin(ang) * 0.28,
        0.3,
        Math.cos(ang) * 0.28,
        Math.cos(ang) * 0.42,
        0,
        -Math.sin(ang) * 0.42
      );
    }
    addCyl(turretPivot, 0.14, 0.18, 0.36, 8, mats.gunmetal, 0, 0.62, 0);

    const shieldGeo = createSideExtrudeGeo(
      [
        [-0.04, -0.3],
        [0.04, -0.3],
        [0.08, 0.32],
        [-0.02, 0.32]
      ],
      0.92,
      0.02,
      0.02
    );
    const shield = new THREE.Mesh(shieldGeo, mats.olive);
    shield.position.set(0, 0.86, 0.36);
    turretPivot.add(shield);

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.88, 0.16);
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    addBox(barrelPivot, 0.24, 0.24, 0.64, mats.gunmetal, 0, 0, -0.06);
    addBox(barrelPivot, 0.22, 0.24, 0.3, mats.oliveDark, -0.28, -0.05, 0.02);
    addBox(barrelPivot, 0.16, 0.03, 0.18, mats.brass, -0.14, 0.04, 0.02, 0, 0, 0.35);

    const m2BarrelGeo = createLatheAlongZGeo([
      [0.085, 0.22],
      [0.085, 0.62],
      [0.05, 0.64],
      [0.05, 1.38],
      [0.065, 1.4],
      [0.042, 1.48]
    ]);
    barrelPivot.add(new THREE.Mesh(m2BarrelGeo, mats.gunmetal));

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 1.52);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 1.58, 0.75);
  } else if (level === 2) {
    addCyl(turretPivot, 0.36, 0.48, 0.68, 10, mats.darkSteel, 0, 0.34, 0);
    addBox(turretPivot, 0.42, 0.32, 0.36, mats.oliveDark, -0.45, 0.24, -0.2);
    addCyl(turretPivot, 0.22, 0.22, 0.36, 12, mats.olive, 0.42, 0.46, -0.12);
    const chuteGeo = getGeo('m134_chute', () => {
      const chuteCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0.42, 0.56, -0.08),
        new THREE.Vector3(0.32, 0.92, -0.04),
        new THREE.Vector3(0.14, 0.96, 0.06)
      );
      return new THREE.TubeGeometry(chuteCurve, 10, 0.055, 8, false);
    });
    turretPivot.add(new THREE.Mesh(chuteGeo, mats.brass));

    addBox(turretPivot, 0.95, 0.64, 0.08, mats.olive, 0, 0.94, 0.36, -0.16, 0, 0);
    addBox(turretPivot, 0.3, 0.3, 0.56, mats.gunmetal, 0, 0.96, 0.02);
    addCyl(turretPivot, 0.11, 0.11, 0.38, 12, mats.steel, 0, 1.15, -0.02, Math.PI / 2, 0, 0);

    const gatlingPivot = new THREE.Group();
    gatlingPivot.position.set(0, 0.96, 0.32);
    turretPivot.add(gatlingPivot);
    rig.gatlingPivot = gatlingPivot;

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      addCyl(gatlingPivot, 0.024, 0.024, 1.18, 6, mats.steel, Math.cos(a) * 0.095, Math.sin(a) * 0.095, 0.58, Math.PI / 2, 0, 0);
    }
    addCyl(gatlingPivot, 0.135, 0.135, 0.08, 12, mats.brass, 0, 0, 0.55, Math.PI / 2, 0, 0);
    addCyl(gatlingPivot, 0.135, 0.135, 0.09, 12, mats.gunmetal, 0, 0, 1.08, Math.PI / 2, 0, 0);

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0.96, 1.54);
    turretPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(turretPivot, mats, 0, 0.96, 1.62, 0.85);
  } else {
    addCyl(turretPivot, 0.44, 0.54, 0.42, 8, mats.desertArmor, 0, 0.21, 0);
    const yokeGeo = createSideExtrudeGeo(
      [
        [-0.36, 0.4],
        [0.34, 0.4],
        [0.42, 0.95],
        [0.14, 1.12],
        [-0.32, 0.96]
      ],
      0.16,
      0.02,
      0.02
    );
    for (const sx of [-0.4, 0.4]) {
      const yoke = new THREE.Mesh(yokeGeo, mats.desertArmor);
      yoke.position.set(sx, 0, 0);
      turretPivot.add(yoke);
    }

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.98, 0.08);
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    addBox(barrelPivot, 0.3, 0.28, 0.68, mats.gunmetal, 0, 0, 0);
    addBox(barrelPivot, 0.26, 0.34, 0.42, mats.oliveDark, -0.34, -0.08, -0.02);
    addBox(barrelPivot, 0.28, 0.32, 0.46, mats.darkSteel, 0.34, 0.06, 0.14);
    addCyl(barrelPivot, 0.085, 0.085, 0.06, 12, mats.sapphireOptic, 0.34, 0.1, 0.38, Math.PI / 2, 0, 0);
    addCyl(barrelPivot, 0.055, 0.055, 0.06, 10, mats.opticGreen, 0.27, -0.03, 0.38, Math.PI / 2, 0, 0);
    addCyl(barrelPivot, 0.038, 0.038, 0.06, 8, mats.shtoraRed, 0.41, -0.03, 0.38, Math.PI / 2, 0, 0);

    const crowsBarrel = createLatheAlongZGeo([
      [0.09, 0.34],
      [0.09, 0.72],
      [0.052, 0.74],
      [0.052, 1.54],
      [0.072, 1.56],
      [0.066, 1.66],
      [0.035, 1.68]
    ]);
    barrelPivot.add(new THREE.Mesh(crowsBarrel, mats.gunmetal));

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 1.72);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 1.78, 0.85);
  }
}

function buildBushmaster(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.48, 1.64, 0.24, 8, mats.concreteDark, 0, 0.12, 0);
  addCyl(root, 1.18, 1.28, 0.18, 8, mats.diamondPlate, 0, 0.32, 0);
  addCyl(root, 0.86, 0.96, 0.22, 8, mats.oliveDark, 0, 0.5, 0);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.62, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  if (level === 1) {
    const hullGeo = createSideExtrudeGeo(
      [
        [-0.95, 0.0],
        [0.85, 0.0],
        [1.02, 0.28],
        [0.52, 0.68],
        [-0.78, 0.68],
        [-1.08, 0.32]
      ],
      1.38,
      0.04,
      0.04
    );
    turretPivot.add(new THREE.Mesh(hullGeo, mats.olive));
    addBox(turretPivot, 0.82, 0.2, 0.56, mats.oliveDark, 0, 0.38, -1.04);

    for (const sx of [-0.74, 0.74]) {
      addCyl(turretPivot, 0.06, 0.06, 0.26, 6, mats.gunmetal, sx, 0.42, 0.58, Math.PI / 3, sx > 0 ? -0.3 : 0.3, 0);
    }

    addBox(turretPivot, 0.32, 0.28, 0.36, mats.darkSteel, 0.44, 0.78, 0.26);
    addBox(turretPivot, 0.2, 0.14, 0.08, mats.opticGreen, 0.44, 0.8, 0.46);

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.36, 0.9);
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    addBox(barrelPivot, 0.32, 0.28, 0.34, mats.gunmetal, 0, 0, 0.05);
    const bushGeo = createLatheAlongZGeo([
      [0.095, 0.16],
      [0.095, 0.55],
      [0.062, 0.58],
      [0.062, 1.38],
      [0.085, 1.4],
      [0.075, 1.56],
      [0.045, 1.58]
    ]);
    barrelPivot.add(new THREE.Mesh(bushGeo, mats.gunmetal));

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 1.62);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 1.68, 1.0);
  } else if (level === 2) {
    const hullGeo = createSideExtrudeGeo(
      [
        [-1.08, 0.0],
        [0.92, 0.0],
        [1.12, 0.32],
        [0.56, 0.76],
        [-0.88, 0.76],
        [-1.22, 0.35]
      ],
      1.66,
      0.045,
      0.045
    );
    turretPivot.add(new THREE.Mesh(hullGeo, mats.olive));
    for (const sx of [-0.9, 0.9]) {
      for (let i = 0; i < 3; i++) {
        addBox(turretPivot, 0.12, 0.34, 0.42, mats.desertArmor, sx, 0.36, 0.45 - i * 0.48);
      }
    }
    addBox(turretPivot, 1.34, 0.46, 0.72, mats.oliveDark, 0, 0.42, -1.16);
    addCyl(turretPivot, 0.18, 0.18, 0.42, 10, mats.brass, -0.42, 0.76, -1.12);
    addCyl(turretPivot, 0.18, 0.18, 0.42, 10, mats.brass, 0.42, 0.76, -1.12);
    addCyl(turretPivot, 0.08, 0.1, 0.45, 8, mats.steel, -0.35, 0.98, 0.12);
    addBox(turretPivot, 0.36, 0.24, 0.28, mats.darkSteel, -0.35, 1.24, 0.16);
    addCyl(turretPivot, 0.075, 0.075, 0.06, 10, mats.opticGreen, -0.35, 1.24, 0.31, Math.PI / 2, 0, 0);

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.38, 0.96);
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    addBox(barrelPivot, 0.64, 0.3, 0.36, mats.gunmetal, 0, 0, 0.06);
    const twinGeo = createLatheAlongZGeo([
      [0.085, 0.18],
      [0.085, 0.6],
      [0.055, 0.62],
      [0.055, 1.48],
      [0.078, 1.5],
      [0.04, 1.66]
    ]);
    for (const bx of [-0.19, 0.19]) {
      const m = new THREE.Mesh(twinGeo, mats.gunmetal);
      m.position.x = bx;
      barrelPivot.add(m);
    }

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 1.7);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 1.75, 1.15);
  } else {
    const stealthTurretGeo = createSideExtrudeGeo(
      [
        [-1.24, 0.0],
        [1.1, 0.0],
        [1.32, 0.34],
        [0.72, 0.84],
        [-0.95, 0.84],
        [-1.36, 0.38]
      ],
      1.86,
      0.06,
      0.06
    );
    turretPivot.add(new THREE.Mesh(stealthTurretGeo, mats.desertArmor));
    addBox(turretPivot, 0.64, 0.44, 0.72, mats.oliveDark, -0.62, 0.4, 0.74, 0, 0.42, 0);
    addBox(turretPivot, 0.64, 0.44, 0.72, mats.oliveDark, 0.62, 0.4, 0.74, 0, -0.42, 0);
    addBox(turretPivot, 1.52, 0.52, 0.78, mats.darkSteel, 0, 0.44, -1.24);
    addCyl(turretPivot, 0.26, 0.3, 0.24, 10, mats.darkSteel, -0.42, 0.96, -0.1);
    addBox(turretPivot, 0.32, 0.26, 0.3, mats.steel, -0.42, 1.2, -0.06);
    addBox(turretPivot, 0.22, 0.14, 0.06, mats.sapphireOptic, -0.42, 1.2, 0.1);
    addBox(turretPivot, 0.36, 0.3, 0.38, mats.darkSteel, 0.46, 0.92, 0.25);
    addBox(turretPivot, 0.24, 0.16, 0.06, mats.opticGreen, 0.46, 0.94, 0.45);

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.42, 1.04);
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    addBox(barrelPivot, 0.48, 0.36, 0.42, mats.gunmetal, 0, 0, 0.08);
    const ctaGeo = createLatheAlongZGeo([
      [0.14, 0.2],
      [0.14, 0.85],
      [0.095, 0.9],
      [0.095, 1.65],
      [0.125, 1.68],
      [0.115, 1.88],
      [0.06, 1.92]
    ]);
    barrelPivot.add(new THREE.Mesh(ctaGeo, mats.gunmetal));

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 1.95);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 2.02, 1.25);
  }
}

function buildJavelin(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.54, 1.68, 0.24, 8, mats.concreteDark, 0, 0.12, 0);
  addCyl(root, 1.05, 1.15, 0.16, 8, mats.diamondPlate, 0, 0.28, 0);
  addSandbagRing(root, 1.4, 10, mats.sandbag, 0.3, 1);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.36, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;
  rig.missileCaps = [];

  if (level === 1) {
    addCyl(turretPivot, 0.28, 0.38, 0.55, 8, mats.darkSteel, 0, 0.28, 0);
    addBox(turretPivot, 0.88, 0.18, 0.42, mats.steel, 0, 0.62, 0);
    addBox(turretPivot, 0.28, 0.28, 0.42, mats.olive, -0.52, 0.82, 0.12);
    addCyl(turretPivot, 0.08, 0.08, 0.06, 10, mats.opticGreen, -0.52, 0.82, 0.34, Math.PI / 2, 0, 0);

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.84, 0.05);
    barrelPivot.rotation.x = -0.34;
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    for (const tx of [-0.22, 0.22]) {
      addCyl(barrelPivot, 0.16, 0.16, 1.38, 12, mats.olive, tx, 0, 0.05, Math.PI / 2, 0, 0);
      addCyl(barrelPivot, 0.19, 0.19, 0.12, 12, mats.darkSteel, tx, 0, 0.72, Math.PI / 2, 0, 0);
      const cap = addMissileCap(barrelPivot, mats, 0.11, tx, 0, 0.62, mats.amberGlow);
      rig.missileCaps.push(cap);
    }

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 0.82);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 0.9, 1.0);
  } else if (level === 2) {
    addCyl(turretPivot, 0.56, 0.64, 0.45, 8, mats.desertArmor, 0, 0.22, 0);
    const cabGeo = createSideExtrudeGeo(
      [
        [-0.45, 0.45],
        [0.42, 0.45],
        [0.48, 0.92],
        [0.1, 1.24],
        [-0.45, 1.2]
      ],
      0.78,
      0.03,
      0.03
    );
    turretPivot.add(new THREE.Mesh(cabGeo, mats.desertArmor));
    addBox(turretPivot, 0.64, 0.36, 0.06, mats.glass, 0, 0.98, 0.34, -0.45, 0, 0);
    addBox(turretPivot, 0.28, 0.24, 0.28, mats.darkSteel, 0, 0.78, 0.62);
    addCyl(turretPivot, 0.065, 0.065, 0.05, 10, mats.opticGreen, 0, 0.78, 0.78, Math.PI / 2, 0, 0);

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 1.02, 0.05);
    barrelPivot.rotation.x = -0.36;
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    for (const px of [-0.68, 0.68]) {
      addBox(barrelPivot, 0.48, 0.48, 1.48, mats.oliveDark, px, 0, 0.05);
      for (const ox of [-0.11, 0.11]) {
        for (const oy of [-0.11, 0.11]) {
          addCyl(barrelPivot, 0.085, 0.085, 1.54, 8, mats.gunmetal, px + ox, oy, 0.06, Math.PI / 2, 0, 0);
          const cap = addMissileCap(barrelPivot, mats, 0.068, px + ox, oy, 0.76, mats.navalWhite);
          rig.missileCaps.push(cap);
        }
      }
    }

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 0.92);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 1.0, 1.1);
  } else {
    const hullGeo = createSideExtrudeGeo(
      [
        [-0.78, 0.18],
        [0.78, 0.18],
        [0.92, 0.62],
        [0.42, 0.98],
        [-0.72, 0.98]
      ],
      1.24,
      0.04,
      0.04
    );
    turretPivot.add(new THREE.Mesh(hullGeo, mats.desertArmor));
    addCyl(turretPivot, 0.42, 0.52, 0.28, 8, mats.darkSteel, 0, 1.12, -0.1);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      addBox(turretPivot, 0.34, 0.24, 0.06, mats.copperAesa, Math.sin(a) * 0.42, 1.12, -0.1 + Math.cos(a) * 0.42, 0, a, 0);
    }
    const iffMast = new THREE.Group();
    iffMast.position.set(0, 1.32, -0.1);
    addBox(iffMast, 0.65, 0.14, 0.1, mats.radarCyan, 0, 0.08, 0);
    turretPivot.add(iffMast);
    rig.radarPivots = [iffMast];

    addCyl(turretPivot, 0.18, 0.18, 0.28, 12, mats.darkSteel, 0, 0.84, 0.86);
    addCyl(turretPivot, 0.08, 0.08, 0.06, 10, mats.sapphireOptic, 0, 0.84, 1.0, Math.PI / 2, 0, 0);

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.84, 0.08);
    barrelPivot.rotation.x = -0.35;
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    addBox(barrelPivot, 0.52, 0.52, 1.5, mats.olive, -0.88, 0, 0.08);
    for (const ox of [-0.12, 0.12]) {
      for (const oy of [-0.12, 0.12]) {
        const cap = addMissileCap(barrelPivot, mats, 0.07, -0.88 + ox, oy, 0.78, mats.navalWhite);
        rig.missileCaps.push(cap);
      }
    }

    addBox(barrelPivot, 0.56, 0.52, 0.22, mats.steel, 0.86, 0, -0.05);
    for (const ox of [-0.14, 0.14]) {
      for (const oy of [-0.14, 0.14]) {
        addCyl(barrelPivot, 0.095, 0.095, 1.38, 10, mats.gunmetal, 0.86 + ox, oy, 0.05, Math.PI / 2, 0, 0);
        const cap = addMissileCap(barrelPivot, mats, 0.088, 0.86 + ox, oy, 0.74, mats.amberGlow);
        rig.missileCaps.push(cap);
      }
    }

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 0.94);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 1.05, 1.2);
  }
}

function buildPhalanx(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.54, 1.66, 0.24, 12, mats.concreteDark, 0, 0.12, 0);
  addCyl(root, 1.32, 1.38, 0.16, 12, mats.diamondPlate, 0, 0.3, 0);

  if (level >= 3) {
    for (const a of [0.78, 2.35, 3.92, 5.49]) {
      addBox(root, 0.28, 0.2, 0.92, mats.oliveDark, Math.sin(a) * 1.48, 0.2, Math.cos(a) * 1.48, 0, a, 0);
      addCyl(root, 0.22, 0.26, 0.12, 8, mats.steel, Math.sin(a) * 1.85, 0.06, Math.cos(a) * 1.85);
    }
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.38, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  const deckMat = level === 3 ? mats.desertArmor : mats.navalGray;
  const domeMat = level === 3 ? mats.desertArmor : mats.navalWhite;

  addCyl(turretPivot, 0.84, 0.94, 0.28, 16, deckMat, 0, 0.14, 0);
  addBox(turretPivot, 0.24, 0.96, 0.68, deckMat, -0.58, 0.68, 0);
  addBox(turretPivot, 0.24, 0.96, 0.68, deckMat, 0.58, 0.68, 0);
  addCyl(turretPivot, 0.44, 0.44, 0.56, 16, level === 3 ? mats.oliveDark : mats.navalWhite, 0, 0.54, 0.04, 0, 0, Math.PI / 2);

  const domeScale = level >= 2 ? 1.08 : 1.0;
  const domeGeo = createLatheYGeo([
    [0.01, 0.0],
    [0.44 * domeScale, 0.0],
    [0.46 * domeScale, 0.72 * domeScale],
    [0.41 * domeScale, 0.96 * domeScale],
    [0.24 * domeScale, 1.15 * domeScale],
    [0.01, 1.22 * domeScale]
  ]);
  const radome = new THREE.Mesh(domeGeo, domeMat);
  radome.position.set(0, 0.96, -0.02);
  turretPivot.add(radome);
  addCyl(turretPivot, 0.465 * domeScale, 0.465 * domeScale, 0.09, 20, mats.steel, 0, 1.62, -0.02);

  if (level >= 2) {
    addBox(turretPivot, 0.34, 0.16, 0.24, mats.steel, 0.62, 1.05, 0.22);
    addBox(turretPivot, 0.26, 0.38, 0.36, domeMat, 0.74, 1.22, 0.28);
    addCyl(turretPivot, 0.09, 0.09, 0.06, 12, mats.opticGreen, 0.74, 1.24, 0.47, Math.PI / 2, 0, 0);
  }

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.9, 0.28);
  barrelPivot.rotation.x = -0.18;
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  addBox(barrelPivot, 0.42, 0.38, 0.56, mats.gunmetal, 0, 0, 0.06);

  const gatlingPivot = new THREE.Group();
  gatlingPivot.position.set(0, 0, 0.3);
  barrelPivot.add(gatlingPivot);
  rig.gatlingPivot = gatlingPivot;

  const bLen = level >= 2 ? 1.48 : 1.25;
  const bRad = level >= 2 ? 0.026 : 0.021;
  const ringR = level >= 2 ? 0.115 : 0.095;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    addCyl(
      gatlingPivot,
      bRad,
      bRad,
      bLen,
      6,
      mats.gunmetal,
      Math.cos(a) * ringR,
      Math.sin(a) * ringR,
      bLen * 0.5,
      Math.PI / 2,
      0,
      0
    );
  }
  addCyl(gatlingPivot, ringR + 0.04, ringR + 0.04, 0.07, 14, mats.steel, 0, 0, bLen * 0.45, Math.PI / 2, 0, 0);
  addCyl(gatlingPivot, ringR + 0.045, ringR + 0.045, 0.09, 14, mats.steel, 0, 0, bLen * 0.92, Math.PI / 2, 0, 0);

  if (level >= 3) {
    addBox(turretPivot, 0.34, 0.44, 0.62, mats.darkSteel, -0.78, 1.15, 0.15);
    addCyl(turretPivot, 0.14, 0.16, 0.36, 12, mats.steel, -0.78, 1.15, 0.55, Math.PI / 2, 0, 0);
    addCyl(turretPivot, 0.1, 0.1, 0.06, 12, mats.radarCyan, -0.78, 1.15, 0.74, Math.PI / 2, 0, 0);
  }

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, bLen + 0.34);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, bLen + 0.38, 0.9);
}

function buildHowitzer(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  if (level === 1) {
    addCyl(root, 1.66, 1.8, 0.16, 12, mats.concreteDark, 0, 0.08, 0);
    addSandbagRing(root, 1.54, 10, mats.sandbag, 0.2, 1);

    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 0.2, 0);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;

    for (const [ang, len] of [[-0.55, 1.4], [0.55, 1.4], [-2.5, 1.05], [2.5, 1.05]]) {
      addBox(
        turretPivot,
        0.16,
        0.14,
        len,
        mats.oliveDark,
        Math.sin(ang) * (len * 0.58),
        0.22,
        -Math.cos(ang) * (len * 0.58),
        0,
        -ang,
        0
      );
      addBox(turretPivot, 0.36, 0.22, 0.22, mats.gunmetal, Math.sin(ang) * (len * 1.12), 0.12, -Math.cos(ang) * (len * 1.12), 0, -ang, 0);
    }

    addCyl(turretPivot, 0.54, 0.62, 0.32, 8, mats.olive, 0, 0.28, 0);
    addBox(turretPivot, 0.18, 0.62, 0.45, mats.oliveDark, -0.34, 0.66, 0.04);
    addBox(turretPivot, 0.18, 0.62, 0.45, mats.oliveDark, 0.34, 0.66, 0.04);
    addBox(turretPivot, 1.1, 0.68, 0.1, mats.olive, 0, 0.72, 0.36, -0.25, 0, 0);

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.78, 0.12);
    barrelPivot.rotation.x = -0.68;
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    addBox(barrelPivot, 0.38, 0.36, 0.82, mats.darkSteel, 0, 0, -0.2);
    addCyl(barrelPivot, 0.075, 0.075, 0.95, 10, mats.steel, -0.16, 0.14, 0.25, Math.PI / 2, 0, 0);
    addCyl(barrelPivot, 0.075, 0.075, 0.95, 10, mats.steel, 0.16, 0.14, 0.25, Math.PI / 2, 0, 0);

    const m777BarrelGeo = createLatheAlongZGeo([
      [0.145, 0.15],
      [0.145, 0.95],
      [0.105, 0.98],
      [0.105, 2.38],
      [0.175, 2.42],
      [0.175, 2.66],
      [0.08, 2.7]
    ]);
    barrelPivot.add(new THREE.Mesh(m777BarrelGeo, mats.gunmetal));

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 2.74);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 2.85, 1.65);
  } else if (level === 2) {
    addBox(root, 2.45, 0.22, 3.05, mats.concreteDark, 0, 0.11, 0);
    for (const sx of [-1.04, 1.04]) {
      addBox(root, 0.48, 0.44, 2.95, mats.tracks, sx, 0.34, 0);
      for (let w = 0; w < 5; w++) {
        addCyl(root, 0.2, 0.2, 0.5, 10, mats.steel, sx, 0.26, 1.0 - w * 0.5, 0, 0, Math.PI / 2);
      }
    }
    addBox(root, 1.72, 0.44, 2.72, mats.desertArmor, 0, 0.46, 0);
    for (const sx of [-0.68, 0.68]) {
      addBox(root, 0.28, 0.24, 0.42, mats.gunmetal, sx, 0.22, -1.52);
    }

    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 0.72, -0.15);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;

    const paladinTurretGeo = createSideExtrudeGeo(
      [
        [-1.38, 0.0],
        [0.82, 0.0],
        [0.98, 0.38],
        [0.54, 0.94],
        [-1.28, 0.94],
        [-1.44, 0.46]
      ],
      1.88,
      0.05,
      0.05
    );
    turretPivot.add(new THREE.Mesh(paladinTurretGeo, mats.desertArmor));
    for (let i = -2; i <= 2; i++) {
      addCyl(turretPivot, 0.06, 0.06, 0.42, 8, mats.brass, i * 0.22, 1.02, -1.05, Math.PI / 2, 0, 0);
    }

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.48, 0.84);
    barrelPivot.rotation.x = -0.62;
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    addBox(barrelPivot, 0.5, 0.42, 0.54, mats.desertArmor, 0, 0, 0.14);
    const l39Geo = createLatheAlongZGeo([
      [0.16, 0.2],
      [0.16, 0.72],
      [0.11, 0.75],
      [0.11, 1.32],
      [0.155, 1.38],
      [0.155, 1.72],
      [0.105, 1.78],
      [0.105, 2.55],
      [0.18, 2.6],
      [0.18, 2.86],
      [0.085, 2.9]
    ]);
    barrelPivot.add(new THREE.Mesh(l39Geo, mats.gunmetal));

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 2.94);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 3.05, 1.8);
  } else {
    addBox(root, 2.8, 0.14, 3.65, mats.concreteDark, 0, 0.07, 0);
    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 0.14, 0);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;

    addBox(turretPivot, 1.36, 0.34, 3.2, mats.darkSteel, 0, 0.52, -0.05);
    for (const wz of [1.08, -0.45, -1.25]) {
      addMilitaryWheel(turretPivot, mats, -0.84, 0.36, wz, 0.32, mats.desertArmor);
      addMilitaryWheel(turretPivot, mats, 0.84, 0.36, wz, 0.32, mats.desertArmor);
    }

    const cabGeo = createSideExtrudeGeo(
      [
        [0.54, 0.62],
        [1.56, 0.62],
        [1.62, 1.15],
        [1.36, 1.66],
        [0.54, 1.66]
      ],
      1.66,
      0.04,
      0.04
    );
    turretPivot.add(new THREE.Mesh(cabGeo, mats.desertArmor));
    addBox(turretPivot, 1.36, 0.36, 0.08, mats.glass, 0, 1.34, 1.56, -0.35, 0, 0);
    addBox(turretPivot, 1.72, 0.1, 1.9, mats.diamondPlate, 0, 0.72, -0.62);

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 1.05, -0.78);
    barrelPivot.rotation.x = -0.76;
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;
    rig.missileCaps = [];

    addBox(barrelPivot, 1.24, 0.86, 1.92, mats.oliveDark, 0, 0.4, 0.2);
    for (const rx of [-0.36, 0, 0.36]) {
      for (const ry of [0.22, 0.58]) {
        addCyl(barrelPivot, 0.14, 0.14, 1.98, 10, mats.gunmetal, rx, ry, 0.22, Math.PI / 2, 0, 0);
        const cap = addMissileCap(barrelPivot, mats, 0.115, rx, ry, 1.22, mats.navalWhite);
        rig.missileCaps.push(cap);
      }
    }

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0.4, 1.32);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.4, 1.4, 1.7);
  }
}

function buildPatriot(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addBox(root, 3.25, 0.2, 3.25, mats.concreteDark, 0, 0.1, 0);
  addBox(root, 2.65, 0.12, 2.65, mats.diamondPlate, 0, 0.26, 0);

  for (const ang of [0.78, 2.35, 3.92, 5.49]) {
    addBox(root, 0.26, 0.2, 1.02, mats.oliveDark, Math.sin(ang) * 1.38, 0.2, Math.cos(ang) * 1.38, 0, ang, 0);
    addCyl(root, 0.22, 0.26, 0.12, 8, mats.steel, Math.sin(ang) * 1.76, 0.06, Math.cos(ang) * 1.76);
  }

  addBox(root, 0.72, 0.56, 0.54, mats.oliveDark, 0, 0.58, -1.16);
  addBox(root, 0.22, 0.18, 0.08, mats.amberGlow, 0, 0.66, -1.44);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.34, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;
  rig.missileCaps = [];

  addCyl(turretPivot, 0.88, 0.96, 0.28, 12, mats.steel, 0, 0.14, 0);
  addBox(turretPivot, 1.38, 0.3, 1.66, mats.desertArmor, 0, 0.42, 0);

  const rackGroup = new THREE.Group();
  rackGroup.position.set(0, 0.82, -0.08);
  rackGroup.rotation.x = -0.66;
  turretPivot.add(rackGroup);

  const cols = level === 1 ? 2 : 4;
  const rows = level === 3 ? 3 : 2;
  const cellSpX = 0.44;
  const cellSpY = 0.44;
  const startX = -((cols - 1) * cellSpX) * 0.5;
  const startY = 0.18;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const tx = startX + c * cellSpX;
      const ty = startY + r * cellSpY;
      addBox(rackGroup, 0.38, 0.38, 2.28, mats.olive, tx, ty, 0.15);
      addBox(rackGroup, 0.4, 0.4, 0.14, mats.darkSteel, tx, ty, 1.26);
      const cap = addMissileCap(rackGroup, mats, 0.125, tx, ty, 1.24, level === 3 ? mats.radarCyan : mats.navalWhite);
      rig.missileCaps.push(cap);
    }
  }

  if (level >= 2) {
    const aesaMat = level === 3 ? mats.radarCyan : mats.copperAesa;
    const radarMount = new THREE.Group();
    radarMount.position.set(0, 1.35, -0.78);
    turretPivot.add(radarMount);

    addBox(radarMount, 1.18, 0.96, 0.24, mats.desertArmor, 0, 0.26, 0, -0.38, 0, 0);
    const panel = addBox(radarMount, 0.96, 0.78, 0.08, aesaMat, 0, 0.26, 0.14, -0.38, 0, 0);
    rig.aesaPanel = panel;

    if (level === 3) {
      rig.radarPivots = [];
      for (const sx of [-0.78, 0.78]) {
        const arm = new THREE.Group();
        arm.position.set(sx, 1.0, -0.72);
        addCyl(arm, 0.06, 0.08, 0.45, 6, mats.steel, 0, 0.22, 0);
        addBox(arm, 0.34, 0.22, 0.08, mats.radarCyan, 0, 0.46, 0);
        turretPivot.add(arm);
        rig.radarPivots.push(arm);
      }
    }
  }

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.55, 1.48);
  rackGroup.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(rackGroup, mats, 0, 0.55, 1.56, 1.4, true);
}

function buildEwCrew(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.54, 1.66, 0.22, 8, mats.concreteDark, 0, 0.11, 0);
  addCyl(root, 1.24, 1.32, 0.16, 8, mats.diamondPlate, 0, 0.28, 0);

  const shelterGeo = createSideExtrudeGeo(
    [
      [-0.78, 0.36],
      [0.78, 0.36],
      [0.78, 1.08],
      [-0.78, 1.08]
    ],
    1.56,
    0.04,
    0.04
  );
  root.add(new THREE.Mesh(shelterGeo, mats.oliveDark));
  addBox(root, 1.1, 0.18, 0.1, mats.radarCyan, 0, 0.92, 0.82);
  addBox(root, 0.32, 0.28, 0.08, mats.steel, -0.58, 0.68, 0.82);

  addCyl(root, 0.14, 0.24, 1.55, 6, mats.steel, 0, 1.85, 0);
  for (const h of [1.4, 1.9, 2.4]) {
    addBox(root, 0.62, 0.06, 0.62, mats.darkSteel, 0, h, 0);
  }

  rig.radarPivots = [];
  if (level === 1) {
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const pivot = new THREE.Group();
      pivot.position.set(Math.sin(a) * 0.56, 1.7 + i * 0.35, Math.cos(a) * 0.56);
      const dish = new THREE.Mesh(
        createLatheYGeo([
          [0.02, 0.0],
          [0.32, 0.08],
          [0.44, 0.22]
        ]),
        mats.steel
      );
      dish.rotation.x = Math.PI / 2 - 0.3;
      pivot.add(dish);
      addCyl(pivot, 0.03, 0.03, 0.36, 6, mats.radarCyan, 0, 0.08, 0.22, Math.PI / 2 - 0.3, 0, 0);
      root.add(pivot);
      rig.radarPivots.push(pivot);
    }
  } else if (level === 2) {
    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 2.15, 0);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;

    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const dishPivot = new THREE.Group();
      dishPivot.position.set(Math.sin(a) * 0.52, 0.15, Math.cos(a) * 0.52);
      dishPivot.rotation.y = a;
      addBox(dishPivot, 0.54, 0.42, 0.1, mats.darkSteel, 0, 0, 0, -0.22, 0, 0);
      addBox(dishPivot, 0.44, 0.32, 0.06, mats.copperAesa, 0, 0, 0.06, -0.22, 0, 0);
      turretPivot.add(dishPivot);
      rig.radarPivots.push(dishPivot);
    }
    for (const [ax, az] of [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]]) {
      addCyl(root, 0.025, 0.035, 1.3, 6, mats.steel, ax, 2.25, az);
      addCyl(root, 0.045, 0.045, 0.14, 8, mats.radarCyan, ax, 2.9, az);
    }
  } else {
    addCyl(root, 0.12, 0.18, 1.95, 10, mats.copperAesa, 0, 2.35, 0);
    for (let i = 0; i < 5; i++) {
      const coilGeo = getGeo(`ew_coil_${i}`, () => new THREE.TorusGeometry(0.28 - i * 0.02, 0.035, 8, 16));
      const coil = new THREE.Mesh(coilGeo, mats.radarCyan);
      coil.rotation.x = Math.PI / 2;
      coil.position.y = 1.9 + i * 0.28;
      root.add(coil);
    }
    addCyl(root, 0.2, 0.06, 0.28, 12, mats.radarCyan, 0, 3.45, 0);

    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const p = new THREE.Group();
      p.position.set(Math.sin(a) * 0.72, 1.85, Math.cos(a) * 0.72);
      p.rotation.y = a;
      addBox(p, 0.56, 0.42, 0.1, mats.radarCyan, 0, 0, 0, -0.45, 0, 0);
      root.add(p);
      rig.radarPivots.push(p);
    }
  }

  rig.ewRings = [];
  const ringCount = level >= 2 ? 2 : 1;
  for (let i = 0; i < ringCount; i++) {
    const ringGeo = getGeo(`ew_ring_${i}`, () => new THREE.TorusGeometry(0.95 + i * 0.35, 0.045, 8, 28));
    const ring = new THREE.Mesh(ringGeo, mats.ewCyan);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.85 + i * 0.6;
    ring.userData.noShadow = true;
    root.add(ring);
    rig.ewRings.push(ring);
  }
}

// ============================================================================
// 4 NEW ALLIED WAR WEAPONS (Abrams Pit, Iron Dome, HELIOS Laser, TOS-1A MLRS)
// ============================================================================

function buildAbramsPit(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  // Reinforced hull-down bunker apron + sandbag revetment
  addBox(root, 3.65, 0.2, 3.65, mats.concreteDark, 0, 0.1, 0);
  addBox(root, 3.2, 0.14, 3.2, mats.diamondPlate, 0, 0.24, 0);
  addSandbagRing(root, 1.72, 14, mats.sandbag, 0.26, level >= 2 ? 2 : 1);

  // Dug-in M1A2 SEPv3 hull inside concrete pit
  const hullGeo = createSideExtrudeGeo(
    [
      [-1.58, 0.3],
      [1.36, 0.3],
      [1.76, 0.56],
      [1.08, 0.84],
      [-1.56, 0.84]
    ],
    1.74,
    0.04,
    0.04
  );
  root.add(new THREE.Mesh(hullGeo, mats.desertArmor));

  // Heavy side skirt Chobham blocks
  for (const sx of [-1.02, 1.02]) {
    addBox(root, 0.36, 0.42, 3.15, mats.tracks, sx, 0.38, 0);
    addBox(root, 0.14, 0.44, 3.1, level >= 2 ? mats.oliveDark : mats.desertArmor, sx + (sx < 0 ? -0.2 : 0.2), 0.58, 0);
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.86, 0.05);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Angular M1A2 / Leopard 2A7 Chobham arrowhead turret
  const turretMat = level >= 3 ? mats.oliveDark : mats.desertArmor;
  const turretGeo = createSideExtrudeGeo(
    [
      [-1.38, 0.0],
      [0.72, 0.0],
      [1.24, 0.32],
      [0.74, 0.64],
      [-1.32, 0.64]
    ],
    1.76,
    0.05,
    0.05
  );
  turretPivot.add(new THREE.Mesh(turretGeo, turretMat));
  // Sloped Leopard/Abrams wedge cheek blocks
  addBox(turretPivot, 0.68, 0.42, 0.66, mats.desertArmor, -0.58, 0.32, 0.92, 0, 0.45, 0);
  addBox(turretPivot, 0.68, 0.42, 0.66, mats.desertArmor, 0.58, 0.32, 0.92, 0, -0.45, 0);
  // Blow-off rear bustle ammo rack
  addBox(turretPivot, 1.56, 0.48, 0.65, mats.oliveDark, 0, 0.34, -1.12);

  // CROWS roof MG & CITV thermal sight
  addCyl(turretPivot, 0.18, 0.22, 0.28, 10, mats.darkSteel, -0.45, 0.78, 0.22);
  addBox(turretPivot, 0.22, 0.16, 0.08, mats.sapphireOptic, -0.45, 0.82, 0.36);
  addCyl(turretPivot, 0.14, 0.16, 0.2, 8, mats.gunmetal, 0.46, 0.74, 0.1);
  addCyl(turretPivot, 0.025, 0.025, 0.58, 6, mats.gunmetal, 0.46, 0.82, 0.42, Math.PI / 2, 0, 0);

  if (level >= 2) {
    // Trophy APS radar panels & dual countermeasure launchers on turret flanks!
    for (const sx of [-0.96, 0.96]) {
      addBox(turretPivot, 0.14, 0.34, 0.52, mats.darkSteel, sx, 0.44, 0.05);
      addBox(turretPivot, 0.06, 0.26, 0.36, mats.copperAesa, sx + (sx < 0 ? -0.08 : 0.08), 0.44, 0.05);
      addCyl(turretPivot, 0.09, 0.09, 0.32, 8, mats.radarCyan, sx, 0.72, -0.18, 0.4, 0, sx < 0 ? 0.3 : -0.3);
    }
  }

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.34, 1.05);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  // Heavy 120mm L/55 (or 140mm XM360 on Lv3) smoothbore gun with bore evacuator
  const bScale = level >= 3 ? 1.24 : 1.0;
  const abramsGun = createLatheAlongZGeo([
    [0.14 * bScale, 0.0],
    [0.14 * bScale, 0.62],
    [0.095 * bScale, 0.66],
    [0.095 * bScale, 1.42],
    [0.145 * bScale, 1.48],
    [0.145 * bScale, 1.92],
    [0.088 * bScale, 1.98],
    [0.088 * bScale, 2.88],
    [0.12 * bScale, 2.94],
    [0.072 * bScale, 2.98]
  ]);
  barrelPivot.add(new THREE.Mesh(abramsGun, mats.gunmetal));

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, 3.02);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 3.12, 1.55);
}

function buildIronDome(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.62, 1.76, 0.22, 10, mats.concreteDark, 0, 0.11, 0);
  addCyl(root, 1.38, 1.46, 0.16, 10, mats.diamondPlate, 0, 0.28, 0);

  // Protective energy dome indicator ring on pad
  const ringGeo = getGeo('idome_ring', () => new THREE.TorusGeometry(1.52, 0.05, 8, 28));
  const domeRing = new THREE.Mesh(ringGeo, mats.radarCyan);
  domeRing.rotation.x = Math.PI / 2;
  domeRing.position.y = 0.36;
  root.add(domeRing);

  // EL/M-2084 Rotating Multi-Mission AESA Radar Mast at rear
  rig.radarPivots = [];
  const radarMast = new THREE.Group();
  radarMast.position.set(0, 0.38, -0.78);
  root.add(radarMast);
  addCyl(radarMast, 0.22, 0.28, 1.25, 8, mats.darkSteel, 0, 0.62, 0);

  const radarHead = new THREE.Group();
  radarHead.position.set(0, 1.38, 0);
  addBox(radarHead, 1.05, 0.72, 0.22, mats.desertArmor, 0, 0, 0, -0.22, 0, 0);
  addBox(radarHead, 0.88, 0.56, 0.08, level >= 2 ? mats.radarCyan : mats.copperAesa, 0, 0, 0.12, -0.22, 0, 0);
  radarMast.add(radarHead);
  rig.radarPivots.push(radarHead);

  // Rotating Tamir 20-Cell Vertical/Inclined Interceptor Launcher
  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.38, 0.28);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;
  rig.missileCaps = [];

  addCyl(turretPivot, 0.76, 0.86, 0.24, 12, mats.steel, 0, 0.12, 0);
  const pod = new THREE.Group();
  pod.position.set(0, 0.68, 0);
  pod.rotation.x = -0.82;
  turretPivot.add(pod);

  addBox(pod, 1.48, 0.96, 1.65, mats.desertArmor, 0, 0, 0);
  const cols = level >= 3 ? 5 : 4;
  const rows = 3;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const tx = -((cols - 1) * 0.28) * 0.5 + c * 0.28;
      const ty = -0.26 + r * 0.26;
      addCyl(pod, 0.09, 0.09, 1.72, 8, mats.gunmetal, tx, ty, 0.04, Math.PI / 2, 0, 0);
      const cap = addMissileCap(pod, mats, 0.07, tx, ty, 0.9, mats.radarCyan);
      rig.missileCaps.push(cap);
    }
  }

  // Nanorepair emitter spire on Lv2+
  if (level >= 2) {
    rig.ewRings = [];
    const rGeo = getGeo('idome_heal_ring', () => new THREE.TorusGeometry(1.15, 0.04, 8, 28));
    const hRing = new THREE.Mesh(rGeo, mats.ewCyan);
    hRing.rotation.x = Math.PI / 2;
    hRing.position.y = 1.65;
    hRing.userData.noShadow = true;
    root.add(hRing);
    rig.ewRings.push(hRing);
  }

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.2, 1.05);
  pod.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(pod, mats, 0, 0.2, 1.1, 1.2, true);
}

function buildHeliosLaser(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.58, 1.72, 0.24, 12, mats.concreteDark, 0, 0.12, 0);
  addCyl(root, 1.28, 1.38, 0.18, 12, mats.diamondPlate, 0, 0.3, 0);

  // High-voltage capacitor banks around base
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    addBox(root, 0.52, 0.44, 0.38, mats.navalGray, Math.sin(a) * 1.05, 0.58, Math.cos(a) * 1.05, 0, a, 0);
    addBox(root, 0.38, 0.14, 0.1, mats.radarCyan, Math.sin(a) * 1.22, 0.66, Math.cos(a) * 1.22, 0, a, 0);
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.42, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  addCyl(turretPivot, 0.68, 0.78, 0.52, 12, mats.navalWhite, 0, 0.26, 0);
  addBox(turretPivot, 1.18, 0.74, 1.28, level >= 2 ? mats.navalWhite : mats.navalGray, 0, 0.84, -0.05);

  if (level >= 2) {
    // Thermal radiator cooling fins
    for (const sx of [-0.66, 0.66]) {
      for (let f = 0; f < 4; f++) {
        addBox(turretPivot, 0.16, 0.52, 0.08, mats.steel, sx, 0.88, -0.45 + f * 0.28);
      }
    }
  }

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.94, 0.55);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  const emitPositions = level >= 3 ? [-0.36, 0.36] : [0];
  for (const ex of emitPositions) {
    // Laser beam director gimbal housing + giant glowing sapphire crystal lens
    addCyl(barrelPivot, 0.32, 0.34, 0.62, 14, mats.darkSteel, ex, 0, 0.22, Math.PI / 2, 0, 0);
    addCyl(barrelPivot, 0.24, 0.28, 0.22, 14, mats.steel, ex, 0, 0.56, Math.PI / 2, 0, 0);
    addCyl(barrelPivot, 0.2, 0.2, 0.08, 14, mats.sapphireOptic, ex, 0, 0.68, Math.PI / 2, 0, 0);
    addCyl(barrelPivot, 0.12, 0.12, 0.09, 12, mats.radarCyan, ex, 0, 0.7, Math.PI / 2, 0, 0);
  }

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, 0.75);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 0.78, 1.0, true);
}

function buildTos1Mlrs(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addBox(root, 2.85, 0.18, 3.45, mats.concreteDark, 0, 0.09, 0);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.18, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Armored tracked MLRS carrier chassis
  for (const sx of [-1.06, 1.06]) {
    addBox(turretPivot, 0.48, 0.46, 3.15, mats.tracks, sx, 0.32, 0);
    for (let w = 0; w < 5; w++) {
      addCyl(turretPivot, 0.2, 0.2, 0.5, 10, mats.steel, sx, 0.26, 1.1 - w * 0.55, 0, 0, Math.PI / 2);
    }
  }
  addBox(turretPivot, 1.68, 0.52, 2.85, mats.oliveDark, 0, 0.5, 0);
  // Forward armored cab
  addBox(turretPivot, 1.56, 0.56, 0.85, mats.desertArmor, 0, 0.92, 0.96);
  addBox(turretPivot, 1.24, 0.22, 0.08, mats.glass, 0, 1.0, 1.38);

  // Elevating 220mm Thermobaric Rocket Launcher Pod(s)
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 1.02, -0.35);
  barrelPivot.rotation.x = -0.62;
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;
  rig.missileCaps = [];

  const podOffsets = level >= 3 ? [-0.62, 0.62] : [0];
  for (const px of podOffsets) {
    const podW = level >= 3 ? 1.08 : 1.52;
    addBox(barrelPivot, podW, 0.96, 1.98, mats.olive, px, 0.42, 0.15);
    addBox(barrelPivot, podW + 0.08, 1.02, 0.16, mats.darkSteel, px, 0.42, 1.08);
    const cols = level >= 3 ? 4 : 6;
    const rows = 4;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const rx = px - ((cols - 1) * 0.22) * 0.5 + c * 0.22;
        const ry = 0.08 + r * 0.22;
        addCyl(barrelPivot, 0.085, 0.085, 2.02, 8, mats.gunmetal, rx, ry, 0.15, Math.PI / 2, 0, 0);
        const cap = addMissileCap(barrelPivot, mats, 0.068, rx, ry, 1.15, mats.afterburner);
        rig.missileCaps.push(cap);
      }
    }
  }

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.45, 1.25);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.45, 1.35, 1.6);
}

// ============================================================================
// 11 NEW EXPANSION TOWER MODELS
// ============================================================================

function buildBallista(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.48, 1.62, 0.2, 8, mats.concreteDark, 0, 0.1, 0);
  addSandbagRing(root, 1.38, 10, mats.sandbag, 0.24, 1);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.32, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  addCyl(turretPivot, 0.42, 0.56, 0.62, 8, mats.oliveDark, 0, 0.31, 0);
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.72, 0.05);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  // Heavy mechanical rail & torsion bow limbs
  addBox(barrelPivot, 0.28, 0.18, 1.85, mats.darkSteel, 0, 0, 0.25);
  addBox(barrelPivot, 1.55 + level * 0.25, 0.1, 0.18, mats.steel, 0, 0.04, 0.85);
  addBox(barrelPivot, 0.45, 0.12, 0.22, mats.brass, -0.78, 0.04, 0.58, 0, 0.48, 0);
  addBox(barrelPivot, 0.45, 0.12, 0.22, mats.brass, 0.78, 0.04, 0.58, 0, -0.48, 0);
  // Loaded steel bolt
  addCyl(barrelPivot, 0.045, 0.045, 1.45, 8, mats.amberGlow, 0, 0.12, 0.52, Math.PI / 2, 0, 0);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.12, 1.32);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.12, 1.38, 0.7);
}

function buildSniperTower(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addBox(root, 2.75, 0.22, 2.75, mats.concreteDark, 0, 0.11, 0);
  // Elevated observation scaffold & sniper nest
  for (const [lx, lz] of [[-0.95, -0.95], [0.95, -0.95], [-0.95, 0.95], [0.95, 0.95]]) {
    addBox(root, 0.16, 1.55, 0.16, mats.darkSteel, lx, 0.92, lz);
  }
  addBox(root, 2.25, 0.18, 2.25, mats.oliveDark, 0, 1.72, 0);
  addBox(root, 2.32, 0.28, 0.12, mats.camoNet, 0, 1.92, 1.08);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 1.84, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  addCyl(turretPivot, 0.48, 0.58, 0.34, 8, mats.olive, 0, 0.17, 0);
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.44, 0.15);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  addBox(barrelPivot, 0.32, 0.28, 0.95, mats.gunmetal, 0, 0, 0);
  addCyl(barrelPivot, 0.08, 0.08, 0.42, 10, mats.sapphireOptic, 0.18, 0.22, 0.15, Math.PI / 2, 0, 0);
  addCyl(barrelPivot, 0.055, 0.065, 2.3 + level * 0.25, 10, mats.gunmetal, 0, 0, 1.55, Math.PI / 2, 0, 0);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, 2.75);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 2.82, 0.95);
}

function buildCryoTower(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.52, 1.66, 0.22, 10, mats.concreteDark, 0, 0.11, 0);
  addCyl(root, 1.24, 1.32, 0.16, 10, mats.diamondPlate, 0, 0.28, 0);

  // Cryogenic nitrogen storage tanks
  for (const sx of [-0.88, 0.88]) {
    addCyl(root, 0.3, 0.3, 1.15, 12, mats.navalWhite, sx, 0.92, -0.35);
    addCyl(root, 0.32, 0.32, 0.14, 12, mats.radarCyan, sx, 1.32, -0.35);
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.42, 0.1);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  addCyl(turretPivot, 0.62, 0.72, 0.65, 10, mats.navalGray, 0, 0.34, 0);
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.72, 0.28);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  addBox(barrelPivot, 0.66, 0.46, 0.85, mats.navalWhite, 0, 0, 0.15);
  addCyl(barrelPivot, 0.22, 0.14, 0.95, 12, mats.radarCyan, 0, 0, 0.95, Math.PI / 2, 0, 0);

  if (level >= 2) {
    rig.ewRings = [];
    const ring = new THREE.Mesh(getGeo('cryo_aura_ring', () => new THREE.TorusGeometry(1.15, 0.04, 8, 24)), mats.ewCyan);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.45;
    ring.userData.noShadow = true;
    root.add(ring);
    rig.ewRings.push(ring);
  }

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, 1.45);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 1.52, 1.0, true);
}

function buildTeslaTower(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.56, 1.7, 0.24, 8, mats.concreteDark, 0, 0.12, 0);
  addCyl(root, 1.24, 1.34, 0.2, 8, mats.darkSteel, 0, 0.34, 0);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.45, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  addCyl(turretPivot, 0.34, 0.48, 1.75, 12, mats.copperAesa, 0, 0.9, 0);
  const ringCount = 3 + level;
  for (let i = 0; i < ringCount; i++) {
    const tor = new THREE.Mesh(
      getGeo(`tesla_coil_${i}`, () => new THREE.TorusGeometry(0.62 - i * 0.06, 0.065, 8, 20)),
      mats.steel
    );
    tor.rotation.x = Math.PI / 2;
    tor.position.y = 0.72 + i * 0.26;
    turretPivot.add(tor);
  }

  const orb = new THREE.Mesh(getGeo('tesla_orb', () => new THREE.SphereGeometry(0.42, 14, 12)), mats.radarCyan);
  orb.position.set(0, 1.95 + level * 0.15, 0);
  turretPivot.add(orb);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 1.95 + level * 0.15, 0);
  turretPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(turretPivot, mats, 0, 1.95 + level * 0.15, 0, 1.2, true);
}

function buildToxicTower(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.54, 1.66, 0.22, 8, mats.concreteDark, 0, 0.11, 0);
  addCyl(root, 1.24, 1.34, 0.18, 8, mats.oliveDark, 0, 0.3, 0);

  // Glowing green chemical vats
  for (const sx of [-0.78, 0.78]) {
    addCyl(root, 0.28, 0.28, 1.05, 12, mats.opticGreen, sx, 0.85, -0.25);
    addCyl(root, 0.32, 0.32, 0.14, 12, mats.darkSteel, sx, 1.35, -0.25);
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.42, 0.08);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  addCyl(turretPivot, 0.62, 0.72, 0.56, 10, mats.olive, 0, 0.28, 0);
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.64, 0.25);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  addBox(barrelPivot, 0.64, 0.44, 0.82, mats.oliveDark, 0, 0, 0.15);
  for (const bx of level >= 2 ? [-0.18, 0.18] : [0]) {
    addCyl(barrelPivot, 0.12, 0.15, 1.05, 10, mats.gunmetal, bx, 0, 0.85, Math.PI / 2, 0, 0);
    addCyl(barrelPivot, 0.13, 0.13, 0.1, 10, mats.opticGreen, bx, 0, 1.38, Math.PI / 2, 0, 0);
  }

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, 1.45);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 1.5, 0.9);
}

function buildFlamethrower(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.54, 1.66, 0.22, 8, mats.concreteDark, 0, 0.11, 0);
  addSandbagRing(root, 1.45, 12, mats.sandbag, 0.22, 1);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.35, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  addBox(turretPivot, 1.32, 0.65, 1.38, mats.desertArmor, 0, 0.42, 0);
  // Pressurized napalm fuel canisters on rear
  for (const fx of [-0.36, 0.36]) {
    addCyl(turretPivot, 0.24, 0.24, 0.88, 12, mats.shtoraRed, fx, 0.72, -0.78, Math.PI / 2, 0, 0);
  }

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.66, 0.55);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  const nozzles = level >= 2 ? [-0.22, 0.22] : [0];
  for (const nx of nozzles) {
    addCyl(barrelPivot, 0.11, 0.14, 1.25, 10, mats.gunmetal, nx, 0, 0.58, Math.PI / 2, 0, 0);
    addCyl(barrelPivot, 0.14, 0.08, 0.16, 10, mats.afterburner, nx, 0, 1.24, Math.PI / 2, 0, 0);
  }

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, 1.35);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 1.45, 1.35);
}

function buildRailgun(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addBox(root, 3.15, 0.22, 3.15, mats.concreteDark, 0, 0.11, 0);
  addBox(root, 2.65, 0.16, 2.65, mats.diamondPlate, 0, 0.28, 0);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.38, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  addBox(turretPivot, 1.68, 0.68, 1.95, mats.navalGray, 0, 0.42, -0.15);
  // Dual capacitor glowing rails
  for (const sx of [-0.62, 0.62]) {
    addBox(turretPivot, 0.26, 0.52, 1.35, mats.radarCyan, sx, 0.52, -0.2);
  }

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.66, 0.65);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  // Twin parallel magnetic accelerator rails with glowing core gap
  const railLen = 2.25 + level * 0.22;
  addBox(barrelPivot, 0.12, 0.28, railLen, mats.darkSteel, -0.16, 0, railLen * 0.42);
  addBox(barrelPivot, 0.12, 0.28, railLen, mats.darkSteel, 0.16, 0, railLen * 0.42);
  addBox(barrelPivot, 0.08, 0.14, railLen * 0.9, mats.sapphireOptic, 0, 0, railLen * 0.42);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, railLen * 0.95);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, railLen, 1.2, true);
}

function buildHarpoonTower(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.5, 1.62, 0.22, 8, mats.concreteDark, 0, 0.11, 0);
  addCyl(root, 1.15, 1.24, 0.18, 8, mats.diamondPlate, 0, 0.3, 0);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.42, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  addCyl(turretPivot, 0.52, 0.64, 0.55, 8, mats.navalGray, 0, 0.28, 0);
  // Magnetic winch drum
  addCyl(turretPivot, 0.28, 0.28, 0.72, 12, mats.brass, 0, 0.72, -0.35, 0, 0, Math.PI / 2);

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.78, 0.15);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  const count = level >= 2 ? 2 : 1;
  for (let i = 0; i < count; i++) {
    const ox = count === 2 ? (i === 0 ? -0.24 : 0.24) : 0;
    addBox(barrelPivot, 0.18, 0.18, 1.45, mats.darkSteel, ox, 0, 0.42);
    addCyl(barrelPivot, 0.03, 0.14, 0.42, 6, mats.radarCyan, ox, 0, 1.32, Math.PI / 2, 0, 0);
  }

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, 1.48);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 1.55, 0.85, true);
}

function buildMinefieldLayer(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addBox(root, 2.85, 0.18, 2.85, mats.concreteDark, 0, 0.09, 0);
  addBox(root, 2.35, 0.14, 2.35, mats.diamondPlate, 0, 0.24, 0);

  // Automated mine dispenser depot with stacked landmines & beacon
  addBox(root, 1.45, 0.72, 1.45, mats.oliveDark, 0, 0.64, 0);
  addBox(root, 1.15, 0.14, 1.15, mats.amberGlow, 0, 1.04, 0);
  for (const [mx, mz] of [[-0.88, -0.88], [0.88, -0.88], [-0.88, 0.88], [0.88, 0.88]]) {
    addCyl(root, 0.24, 0.28, 0.16, 10, mats.gunmetal, mx, 0.38, mz);
    addCyl(root, 0.08, 0.08, 0.08, 8, level >= 3 ? mats.radarCyan : mats.shtoraRed, mx, 0.48, mz);
  }
  const mast = new THREE.Group();
  mast.position.set(0, 1.12, 0);
  addCyl(mast, 0.06, 0.08, 0.65, 8, mats.steel, 0, 0.32, 0);
  addBox(mast, 0.56, 0.14, 0.1, mats.amberGlow, 0, 0.68, 0);
  root.add(mast);
  rig.radarPivots = [mast];
}

function buildEngWorkshop(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addBox(root, 3.25, 0.2, 3.25, mats.concreteDark, 0, 0.1, 0);
  addBox(root, 2.8, 0.12, 2.8, mats.diamondPlate, 0, 0.24, 0);

  // Armored repair bay hangar + overhead crane gantry
  addBox(root, 2.25, 0.95, 1.85, mats.desertArmor, 0, 0.76, -0.15);
  addBox(root, 1.65, 0.18, 0.12, mats.sapphireOptic, 0, 1.02, 0.82);
  addBox(root, 0.24, 1.4, 0.24, mats.steel, -1.15, 0.98, 0.55);
  addBox(root, 0.24, 1.4, 0.24, mats.steel, 1.15, 0.98, 0.55);
  addBox(root, 2.65, 0.22, 0.26, mats.amberGlow, 0, 1.72, 0.55);

  const crane = new THREE.Group();
  crane.position.set(0, 1.32, -0.15);
  addBox(crane, 1.9, 0.14, 0.16, mats.radarCyan, 0, 0.48, 0);
  root.add(crane);
  rig.radarPivots = [crane];

  if (level >= 1) {
    rig.ewRings = [];
    const hRing = new THREE.Mesh(
      getGeo('eng_heal_ring', () => new THREE.TorusGeometry(1.35, 0.04, 8, 28)),
      mats.ewCyan
    );
    hRing.rotation.x = Math.PI / 2;
    hRing.position.y = 1.6;
    hRing.userData.noShadow = true;
    root.add(hRing);
    rig.ewRings.push(hRing);
  }
}

function buildEnergyExtractor(root: THREE.Group, rig: TowerRig3D, mats: ModelMaterials, level: number) {
  addCyl(root, 1.56, 1.72, 0.22, 10, mats.concreteDark, 0, 0.11, 0);
  addCyl(root, 1.32, 1.4, 0.16, 10, mats.diamondPlate, 0, 0.28, 0);

  // Geothermal / fusion energy turbine core + spinning cooling rotor
  addCyl(root, 0.78, 0.92, 0.85, 10, mats.oliveDark, 0, 0.72, 0);
  addCyl(root, 0.42, 0.42, 1.35, 14, mats.amberGlow, 0, 1.25, 0);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    addBox(root, 0.26, 1.05, 0.22, mats.copperAesa, Math.sin(a) * 0.82, 0.92, Math.cos(a) * 0.82, 0, a, 0);
  }

  const turbine = new THREE.Group();
  turbine.position.set(0, 1.98, 0);
  addBox(turbine, 1.9 + level * 0.15, 0.1, 0.24, mats.radarCyan, 0, 0, 0);
  addBox(turbine, 0.24, 0.1, 1.9 + level * 0.15, mats.radarCyan, 0, 0, 0);
  root.add(turbine);
  rig.radarPivots = [turbine];
}

// ============================================================================
// OPFOR ENEMY MODELS (All 8 base + 3 Sub-Bosses + 4 Stage Bosses + 3 Mega Bosses)
// ============================================================================

export function createEnemyModel3D(type: string): EnemyRig3D {
  const root = new THREE.Group();
  const hullGroup = new THREE.Group();
  root.add(hullGroup);

  const mats = getMats();
  const rig: EnemyRig3D = {
    root,
    hullGroup,
    hitMeshes: []
  };

  if (type === 'infantry') {
    buildInfantrySquad(hullGroup, rig, mats);
  } else if (type === 'imv') {
    buildImv(hullGroup, rig, mats);
  } else if (type === 'ifv') {
    buildIfv(hullGroup, rig, mats);
  } else if (type === 'drone_swarm') {
    buildDroneSwarm(hullGroup, rig, mats);
  } else if (type === 'mbt') {
    buildMbt(hullGroup, rig, mats);
  } else if (type === 'heli') {
    buildHeli(hullGroup, rig, mats);
  } else if (type === 'stealth') {
    buildStealth(hullGroup, rig, mats);
  } else if (type === 'boss' || type === 'boss_terminator') {
    buildBossTerminator(hullGroup, rig, mats, type === 'boss_terminator' ? 1.38 : 1.32);
  } else if (type === 'subboss_tos1') {
    buildSubBossTos1(hullGroup, rig, mats);
  } else if (type === 'subboss_pantsir') {
    buildSubBossPantsir(hullGroup, rig, mats);
  } else if (type === 'subboss_ka50') {
    buildSubBossKa50(hullGroup, rig, mats);
  } else if (type === 'boss_koalitsiya') {
    buildBossKoalitsiya(hullGroup, rig, mats);
  } else if (type === 'boss_tu160') {
    buildBossTu160(hullGroup, rig, mats);
  } else if (type === 'boss_armata') {
    buildBossArmata(hullGroup, rig, mats);
  } else if (type === 'megaboss_scud_convoy') {
    buildMegaBossScud(hullGroup, rig, mats);
  } else if (type === 'megaboss_object279') {
    buildMegaBossObject279(hullGroup, rig, mats);
  } else if (type === 'megaboss_kirov_airship') {
    buildMegaBossKirov(hullGroup, rig, mats);
  } else if (type === 'recruta') {
    buildInfantrySquad(hullGroup, rig, mats);
  } else if (type === 'corredor') {
    buildCorredor(hullGroup, rig, mats);
  } else if (type === 'batedor_plasma') {
    buildBatedorPlasma(hullGroup, rig, mats);
  } else if (type === 'escudeiro') {
    buildEscudeiro(hullGroup, rig, mats);
  } else if (type === 'brutamontes') {
    buildBrutamontes(hullGroup, rig, mats);
  } else if (type === 'artilheiro') {
    buildArtilheiro(hullGroup, rig, mats);
  } else if (type === 'demolidor') {
    buildDemolidor(hullGroup, rig, mats);
  } else if (type === 'drone_recon') {
    buildDroneRecon(hullGroup, rig, mats);
  } else if (type === 'drone_bombardeiro') {
    buildDroneBombardeiro(hullGroup, rig, mats);
  } else if (type === 'cacador_furtivo') {
    buildCacadorFurtivo(hullGroup, rig, mats);
  } else if (type === 'medico_combate') {
    buildMedicoCombate(hullGroup, rig, mats);
  } else if (type === 'emissor_escudo') {
    buildEmissorEscudo(hullGroup, rig, mats);
  } else if (type === 'enxame_corrosivo') {
    buildEnxameCorrosivo(hullGroup, rig, mats);
  } else if (type === 'atirador_elite') {
    buildAtiradorElite(hullGroup, rig, mats);
  } else if (type === 'sabotador_emp') {
    buildSabotadorEmp(hullGroup, rig, mats);
  } else if (type === 'escavador') {
    buildEscavador(hullGroup, rig, mats);
  } else if (type === 'corrosivo') {
    buildCorrosivo(hullGroup, rig, mats);
  } else if (type === 'piromante') {
    buildPiromante(hullGroup, rig, mats);
  } else if (type === 'criomante') {
    buildCriomante(hullGroup, rig, mats);
  } else if (type === 'tita_cerco') {
    buildTitaCerco(hullGroup, rig, mats);
  }

  const clonedPerEnemy = new Map<THREE.Material, THREE.Material>();
  const skipFlashSet = new Set<THREE.Material>([
    mats.opticGreen,
    mats.shtoraRed,
    mats.radarCyan,
    mats.amberGlow,
    mats.afterburner,
    mats.rotorDisc,
    mats.empPurple
  ]);

  hullGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const m = child as THREE.Mesh;
      const origMat = m.material as THREE.MeshStandardMaterial;
      if (origMat === mats.rotorDisc || m.userData?.noShadow) {
        m.castShadow = false;
        m.receiveShadow = false;
        return;
      }
      m.castShadow = true;
      m.receiveShadow = true;

      if (type !== 'stealth' && type !== 'cacador_furtivo' && origMat && !skipFlashSet.has(origMat)) {
        let copy = clonedPerEnemy.get(origMat);
        if (!copy) {
          copy = origMat.clone();
          clonedPerEnemy.set(origMat, copy);
        }
        m.material = copy;
      }
      rig.hitMeshes.push(m);
    }
  });

  const ewRing = new THREE.Mesh(
    getGeo('enemy_ew_ring', () => new THREE.RingGeometry(1.3, 1.52, 24)),
    new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.78
    })
  );
  ewRing.rotation.x = -Math.PI / 2;
  ewRing.position.y = 0.14;
  ewRing.visible = false;
  root.add(ewRing);
  rig.ewRing = ewRing;

  const prepRing = new THREE.Mesh(
    getGeo('enemy_prep_ring', () => new THREE.RingGeometry(1.5, 1.85, 24)),
    new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    })
  );
  prepRing.rotation.x = -Math.PI / 2;
  prepRing.position.y = 0.18;
  prepRing.visible = false;
  root.add(prepRing);
  rig.prepRing = prepRing;

  return rig;
}

function addApsShieldSphere(hullGroup: THREE.Group, rig: EnemyRig3D, radius = 2.65, y = 1.1) {
  const apsShield = new THREE.Mesh(
    getGeo(`aps_sphere_${radius}`, () => new THREE.SphereGeometry(radius, 20, 14)),
    new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.18,
      wireframe: true
    })
  );
  apsShield.position.y = y;
  apsShield.userData.noShadow = true;
  apsShield.castShadow = false;
  apsShield.receiveShadow = false;
  hullGroup.add(apsShield);
  rig.apsShield = apsShield;
}

function buildInfantrySquad(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const offsets = [
    [0, 0.56],
    [-0.58, -0.45],
    [0.58, -0.45]
  ];
  rig.legs = [];

  for (const [ox, oz] of offsets) {
    const soldier = new THREE.Group();
    soldier.position.set(ox, 0, oz);
    const legL = addBox(soldier, 0.14, 0.42, 0.16, mats.rusDark, -0.1, 0.21, 0);
    const legR = addBox(soldier, 0.14, 0.42, 0.16, mats.rusDark, 0.1, 0.21, 0);
    rig.legs.push(legL, legR);

    addBox(soldier, 0.38, 0.44, 0.25, mats.rusCamo, 0, 0.62, 0);
    addBox(soldier, 0.34, 0.32, 0.08, mats.oliveDark, 0, 0.64, 0.14);
    addBox(soldier, 0.3, 0.34, 0.16, mats.darkSteel, 0, 0.65, -0.17);
    addCyl(soldier, 0.14, 0.16, 0.22, 10, mats.oliveDark, 0, 0.99, 0);
    addBox(soldier, 0.22, 0.1, 0.1, mats.gunmetal, 0, 0.98, 0.11);
    addCyl(soldier, 0.032, 0.032, 0.08, 6, mats.opticGreen, -0.055, 0.99, 0.18, Math.PI / 2, 0, 0);
    addCyl(soldier, 0.032, 0.032, 0.08, 6, mats.opticGreen, 0.055, 0.99, 0.18, Math.PI / 2, 0, 0);
    addBox(soldier, 0.065, 0.1, 0.56, mats.gunmetal, 0.14, 0.64, 0.32);
    addCyl(soldier, 0.022, 0.022, 0.26, 6, mats.darkSteel, 0.14, 0.65, 0.68, Math.PI / 2, 0, 0);
    addBox(soldier, 0.045, 0.16, 0.07, mats.rusDark, 0.14, 0.53, 0.34, -0.25, 0, 0);
    addBox(soldier, 0.05, 0.06, 0.08, mats.steel, 0.14, 0.72, 0.28);
    hullGroup.add(soldier);
  }
}

function buildImv(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const bodyGeo = createSideExtrudeGeo(
    [
      [-1.32, 0.42],
      [1.36, 0.42],
      [1.42, 0.72],
      [0.62, 0.86],
      [0.32, 1.24],
      [-1.24, 1.24],
      [-1.36, 0.84]
    ],
    1.36,
    0.04,
    0.04
  );
  hullGroup.add(new THREE.Mesh(bodyGeo, mats.rusCamo));
  addBox(hullGroup, 1.12, 0.3, 0.06, mats.glass, 0, 1.02, 0.49, -0.68, 0, 0);
  addBox(hullGroup, 0.06, 0.24, 0.88, mats.glass, -0.71, 1.02, -0.18);
  addBox(hullGroup, 0.06, 0.24, 0.88, mats.glass, 0.71, 1.02, -0.18);
  addBox(hullGroup, 0.92, 0.26, 0.08, mats.darkSteel, 0, 0.58, 1.44);
  addBox(hullGroup, 1.28, 0.18, 0.14, mats.gunmetal, 0, 0.44, 1.48);
  addBox(hullGroup, 0.15, 0.1, 0.06, mats.amberGlow, -0.48, 0.6, 1.44);
  addBox(hullGroup, 0.15, 0.1, 0.06, mats.amberGlow, 0.48, 0.6, 1.44);
  addCyl(hullGroup, 0.3, 0.3, 0.18, 12, mats.tire, 0, 0.78, -1.42, Math.PI / 2, 0, 0);
  addBox(hullGroup, 0.22, 0.34, 0.14, mats.oliveDark, -0.46, 0.78, -1.4);

  rig.wheels = [
    addMilitaryWheel(hullGroup, mats, -0.76, 0.36, 0.92, 0.24),
    addMilitaryWheel(hullGroup, mats, 0.76, 0.36, 0.92, 0.24),
    addMilitaryWheel(hullGroup, mats, -0.76, 0.36, -0.88, 0.24),
    addMilitaryWheel(hullGroup, mats, 0.76, 0.36, -0.88, 0.24)
  ];

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 1.28, -0.2);
  hullGroup.add(turretPivot);
  rig.turretPivot = turretPivot;

  addCyl(turretPivot, 0.32, 0.34, 0.14, 12, mats.darkSteel, 0, 0.06, 0);
  addBox(turretPivot, 0.56, 0.28, 0.06, mats.rusDark, 0, 0.24, 0.24, -0.18, 0, 0);
  addBox(turretPivot, 0.14, 0.14, 0.42, mats.gunmetal, 0, 0.26, 0.14);
  addCyl(turretPivot, 0.032, 0.036, 0.85, 8, mats.gunmetal, 0, 0.28, 0.66, Math.PI / 2, 0, 0);
}

function buildIfv(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const hullGeo = createSideExtrudeGeo(
    [
      [-1.78, 0.52],
      [-1.52, 0.34],
      [1.42, 0.34],
      [1.86, 0.68],
      [1.18, 0.98],
      [-1.68, 0.98],
      [-1.82, 0.76]
    ],
    1.56,
    0.045,
    0.045
  );
  hullGroup.add(new THREE.Mesh(hullGeo, mats.rusCamo));
  addBox(hullGroup, 1.38, 0.12, 1.15, mats.rusDark, 0, 1.04, -1.02);
  addBox(hullGroup, 1.1, 0.08, 0.34, mats.oliveDark, 0, 0.62, 1.72, -0.4, 0, 0);
  addCyl(hullGroup, 0.16, 0.18, 0.24, 10, mats.darkSteel, -0.45, 0.48, -1.86, Math.PI / 2, 0, 0);
  addCyl(hullGroup, 0.16, 0.18, 0.24, 10, mats.darkSteel, 0.45, 0.48, -1.86, Math.PI / 2, 0, 0);
  addBox(hullGroup, 0.14, 0.1, 0.06, mats.amberGlow, -0.58, 0.78, 1.74);
  addBox(hullGroup, 0.14, 0.1, 0.06, mats.amberGlow, 0.58, 0.78, 1.74);

  rig.wheels = [];
  for (const wz of [1.22, 0.42, -0.42, -1.22]) {
    rig.wheels.push(
      addMilitaryWheel(hullGroup, mats, -0.84, 0.34, wz, 0.24),
      addMilitaryWheel(hullGroup, mats, 0.84, 0.34, wz, 0.24)
    );
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 1.02, 0.26);
  hullGroup.add(turretPivot);
  rig.turretPivot = turretPivot;

  addCyl(turretPivot, 0.38, 0.56, 0.36, 8, mats.rusDark, 0, 0.18, 0);
  addBox(turretPivot, 0.22, 0.2, 0.22, mats.darkSteel, 0.28, 0.34, 0.12);
  addCyl(turretPivot, 0.065, 0.065, 0.05, 8, mats.opticGreen, 0.28, 0.34, 0.24, Math.PI / 2, 0, 0);

  const autocannonGeo = createLatheAlongZGeo([
    [0.065, 0.28],
    [0.065, 0.62],
    [0.04, 0.64],
    [0.04, 1.44],
    [0.056, 1.46],
    [0.032, 1.54]
  ]);
  turretPivot.add(new THREE.Mesh(autocannonGeo, mats.gunmetal));
  addCyl(turretPivot, 0.018, 0.018, 0.65, 6, mats.steel, -0.14, 0.22, 0.62, Math.PI / 2, 0, 0);
}

function buildDroneSwarm(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const airframe = new THREE.Group();
  airframe.position.y = 3.85;
  hullGroup.add(airframe);

  rig.rotors = [];
  const wingGeo = createPlanExtrudeGeo(
    [
      [0, 0.92],
      [1.26, -0.68],
      [0.24, -0.68],
      [0, -0.54],
      [-0.24, -0.68],
      [-1.26, -0.68]
    ],
    0.055,
    0.02,
    0.02
  );
  const fuseGeo = createLatheAlongZGeo([
    [0.01, 1.15],
    [0.12, 0.85],
    [0.15, 0.35],
    [0.15, -0.68],
    [0.11, -0.84],
    [0.01, -0.86]
  ]);

  const members: [number, number, number, number][] = [
    [0, 0.14, 0.95, 0.72],
    [-1.25, -0.12, -0.82, 0.64],
    [1.25, 0.12, -0.82, 0.64]
  ];

  for (const [mx, my, mz, sc] of members) {
    const uav = new THREE.Group();
    uav.position.set(mx, my, mz);
    uav.scale.setScalar(sc);
    airframe.add(uav);

    uav.add(new THREE.Mesh(fuseGeo, mats.desertArmor));
    uav.add(new THREE.Mesh(wingGeo, mats.desertArmor));
    addCyl(uav, 0.055, 0.085, 0.18, 8, mats.darkSteel, 0, 0, 1.0, Math.PI / 2, 0, 0);
    addBox(uav, 0.05, 0.36, 0.44, mats.darkSteel, -1.2, 0.04, -0.45);
    addBox(uav, 0.05, 0.36, 0.44, mats.darkSteel, 1.2, 0.04, -0.45);
    addCyl(uav, 0.045, 0.045, 0.05, 8, mats.shtoraRed, 0, 0.14, -0.65);
    addCyl(uav, 0.13, 0.1, 0.22, 8, mats.gunmetal, 0, 0, -0.78, Math.PI / 2, 0, 0);

    const prop = new THREE.Group();
    prop.position.set(0, 0, -0.94);
    addBox(prop, 0.78, 0.09, 0.03, mats.tire, 0, 0, 0);
    uav.add(prop);
    rig.rotors.push(prop);
  }
}

function buildMbt(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const hullGeo = createSideExtrudeGeo(
    [
      [-1.72, 0.42],
      [1.36, 0.42],
      [1.92, 0.66],
      [1.22, 0.94],
      [-1.68, 0.94]
    ],
    1.62,
    0.04,
    0.04
  );
  hullGroup.add(new THREE.Mesh(hullGeo, mats.rusCamo));
  addBox(hullGroup, 1.32, 0.1, 0.75, mats.darkSteel, 0, 0.98, -1.16);
  for (const fx of [-0.42, 0.42]) {
    addCyl(hullGroup, 0.18, 0.18, 0.68, 12, mats.oliveDark, fx, 0.72, -1.82, 0, 0, Math.PI / 2);
  }

  for (const sx of [-1.02, 1.02]) {
    addBox(hullGroup, 0.46, 0.48, 3.56, mats.tracks, sx, 0.32, 0);
    addBox(hullGroup, 0.1, 0.4, 3.48, mats.rusDark, sx + (sx < 0 ? -0.24 : 0.24), 0.56, 0);
    for (let w = 0; w < 6; w++) {
      addCyl(hullGroup, 0.22, 0.22, 0.48, 10, mats.steel, sx, 0.26, 1.35 - w * 0.54, 0, 0, Math.PI / 2);
    }
  }

  rig.eraMeshes = [];
  for (let i = -2; i <= 2; i++) {
    const era = addBox(hullGroup, 0.28, 0.12, 0.28, mats.olive, i * 0.3, 0.84, 1.54, 0.38, 0, 0);
    rig.eraMeshes.push(era);
  }
  for (const sx of [-1.28, 1.28]) {
    for (let i = 0; i < 4; i++) {
      const sideEra = addBox(hullGroup, 0.08, 0.28, 0.48, mats.olive, sx, 0.62, 1.02 - i * 0.66);
      rig.eraMeshes.push(sideEra);
    }
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.96, 0.1);
  hullGroup.add(turretPivot);
  rig.turretPivot = turretPivot;

  const turretGeo = createSideExtrudeGeo(
    [
      [-1.08, 0.0],
      [0.72, 0.0],
      [1.04, 0.22],
      [0.64, 0.5],
      [-1.02, 0.5]
    ],
    1.56,
    0.05,
    0.05
  );
  turretPivot.add(new THREE.Mesh(turretGeo, mats.rusCamo));
  addBox(turretPivot, 0.58, 0.4, 0.6, mats.rusDark, -0.58, 0.24, 0.72, 0, 0.46, 0);
  addBox(turretPivot, 0.58, 0.4, 0.6, mats.rusDark, 0.58, 0.24, 0.72, 0, -0.46, 0);
  addBox(turretPivot, 1.18, 0.38, 0.52, mats.darkSteel, 0, 0.3, -0.92);
  addCyl(turretPivot, 0.24, 0.26, 0.18, 8, mats.oliveDark, -0.34, 0.58, -0.14);
  addCyl(turretPivot, 0.028, 0.028, 0.58, 6, mats.gunmetal, -0.34, 0.7, 0.2, Math.PI / 2, 0, 0);
  addBox(turretPivot, 0.18, 0.14, 0.12, mats.shtoraRed, -0.46, 0.3, 0.98);
  addBox(turretPivot, 0.18, 0.14, 0.12, mats.shtoraRed, 0.46, 0.3, 0.98);

  const gun125Geo = createLatheAlongZGeo([
    [0.095, 0.62],
    [0.095, 1.48],
    [0.145, 1.54],
    [0.145, 1.96],
    [0.085, 2.02],
    [0.085, 2.98],
    [0.11, 3.0],
    [0.07, 3.04]
  ]);
  const barrel = new THREE.Mesh(gun125Geo, mats.gunmetal);
  barrel.position.set(0, 0.24, 0.0);
  turretPivot.add(barrel);
}

function buildHeli(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials, bodyMat = mats.rusCamo, alt = 4.2) {
  const airframe = new THREE.Group();
  airframe.position.y = alt;
  hullGroup.add(airframe);

  const fuseGeo = createSideExtrudeGeo(
    [
      [-0.95, -0.34],
      [0.95, -0.34],
      [1.62, -0.06],
      [0.86, 0.44],
      [-0.86, 0.46]
    ],
    0.84,
    0.05,
    0.05
  );
  airframe.add(new THREE.Mesh(fuseGeo, bodyMat));
  addBox(airframe, 0.74, 0.36, 0.92, mats.glass, 0, 0.24, 0.74, 0.34, 0, 0);
  addCyl(airframe, 0.18, 0.18, 0.24, 10, mats.darkSteel, 0, -0.26, 1.38);
  addCyl(airframe, 0.08, 0.08, 0.05, 8, mats.sapphireOptic, 0, -0.26, 1.5, Math.PI / 2, 0, 0);
  addCyl(airframe, 0.038, 0.042, 0.85, 6, mats.gunmetal, 0.24, -0.3, 1.56, Math.PI / 2, 0, 0);

  addBox(airframe, 2.72, 0.12, 0.56, mats.rusDark, 0, 0.08, -0.08);
  for (const px of [-1.08, -0.7, 0.7, 1.08]) {
    addCyl(airframe, 0.13, 0.13, 0.64, 10, mats.gunmetal, px, -0.1, -0.06, Math.PI / 2, 0, 0);
  }
  for (const ex of [-0.46, 0.46]) {
    addCyl(airframe, 0.22, 0.2, 1.18, 10, mats.darkSteel, ex, 0.36, -0.22, Math.PI / 2, 0, 0);
  }
  addBox(airframe, 0.28, 0.32, 1.78, bodyMat, 0, 0.1, -1.78);
  addBox(airframe, 0.08, 0.84, 0.52, mats.rusDark, 0, 0.42, -2.56, -0.28, 0, 0);
  addBox(airframe, 1.24, 0.08, 0.34, mats.rusDark, 0, 0.16, -2.48);

  addCyl(airframe, 0.1, 0.13, 0.62, 8, mats.steel, 0, 0.6, 0);
  const rotorTop = new THREE.Group();
  rotorTop.position.set(0, 0.88, 0);
  const rotorBot = new THREE.Group();
  rotorBot.position.set(0, 0.68, 0);

  const bladeGeo = getGeo('heli_blade', () => new THREE.BoxGeometry(0.16, 0.025, 2.05));
  const bladeGeo2 = getGeo('heli_blade2', () => new THREE.BoxGeometry(0.16, 0.025, 1.95));
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const b1 = new THREE.Mesh(bladeGeo, mats.gunmetal);
    b1.position.set(Math.sin(a) * 1.0, 0, Math.cos(a) * 1.0);
    b1.rotation.y = a;
    rotorTop.add(b1);

    const a2 = a + Math.PI / 3;
    const b2 = new THREE.Mesh(bladeGeo2, mats.darkSteel);
    b2.position.set(Math.sin(a2) * 0.95, 0, Math.cos(a2) * 0.95);
    b2.rotation.y = a2;
    rotorBot.add(b2);
  }
  airframe.add(rotorTop, rotorBot);

  const blurDisc = new THREE.Mesh(getGeo('heli_disc', () => new THREE.CircleGeometry(2.05, 24)), mats.rotorDisc);
  blurDisc.rotation.x = -Math.PI / 2;
  blurDisc.position.set(0, 0.78, 0);
  blurDisc.userData.noShadow = true;
  airframe.add(blurDisc);

  rig.rotors = [rotorTop, rotorBot];
}

function buildStealth(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const airframe = new THREE.Group();
  airframe.position.y = 4.6;
  hullGroup.add(airframe);

  const stealthBodyMat = new THREE.MeshStandardMaterial({
    color: PALETTE.stealthGraphite,
    roughness: 0.34,
    metalness: 0.66,
    envMapIntensity: 1.35,
    transparent: true,
    opacity: 0.34
  });
  const stealthWingMat = new THREE.MeshStandardMaterial({
    color: 0x2b3340,
    roughness: 0.42,
    metalness: 0.58,
    envMapIntensity: 1.25,
    transparent: true,
    opacity: 0.34
  });
  const stealthCanopyMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a5f,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 0.92,
    envMapIntensity: 1.5,
    transparent: true,
    opacity: 0.55
  });
  const burnerMat = mats.afterburner.clone();
  burnerMat.transparent = true;
  burnerMat.opacity = 0.65;

  rig.stealthMaterials = [stealthBodyMat, stealthWingMat, stealthCanopyMat, burnerMat];

  const wingGeo = createPlanExtrudeGeo(
    [
      [0, 2.02],
      [0.36, 1.15],
      [0.64, 0.78],
      [2.05, -0.58],
      [1.82, -1.08],
      [0.72, -0.84],
      [0.52, -1.42],
      [-0.52, -1.42],
      [-0.72, -0.84],
      [-1.82, -1.08],
      [-2.05, -0.58],
      [-0.64, 0.78],
      [-0.36, 1.15]
    ],
    0.13,
    0.035,
    0.035
  );
  const planform = new THREE.Mesh(wingGeo, stealthWingMat);
  planform.position.y = 0.02;
  airframe.add(planform);

  addBox(airframe, 0.62, 0.26, 2.85, stealthBodyMat, 0, 0.1, 0.2);
  addBox(airframe, 0.34, 0.24, 0.98, stealthCanopyMat, 0, 0.28, 0.7, 0.12, 0, 0);
  addBox(airframe, 0.065, 0.64, 0.68, stealthBodyMat, -0.72, 0.36, -0.96, -0.22, 0, 0.48);
  addBox(airframe, 0.065, 0.64, 0.68, stealthBodyMat, 0.72, 0.36, -0.96, -0.22, 0, -0.48);

  const flameGeo = getGeo('stealth_flame', () => new THREE.ConeGeometry(0.13, 0.62, 8));
  for (const nx of [-0.3, 0.3]) {
    addCyl(airframe, 0.16, 0.19, 0.45, 10, stealthBodyMat, nx, 0.08, -1.38, Math.PI / 2, 0, 0);
    const flame = new THREE.Mesh(flameGeo, burnerMat);
    flame.rotation.x = -Math.PI / 2;
    flame.position.set(nx, 0.08, -1.84);
    airframe.add(flame);
  }
}

function buildBossTerminator(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials, scale = 1.32) {
  const bossGroup = new THREE.Group();
  bossGroup.scale.setScalar(scale);
  hullGroup.add(bossGroup);

  const hullGeo = createSideExtrudeGeo(
    [
      [-1.82, 0.42],
      [1.46, 0.42],
      [2.05, 0.66],
      [1.24, 0.98],
      [-1.78, 0.98]
    ],
    1.8,
    0.05,
    0.05
  );
  bossGroup.add(new THREE.Mesh(hullGeo, mats.rusDark));
  addBox(bossGroup, 2.02, 0.32, 0.24, mats.gunmetal, 0, 0.32, 2.12, -0.25, 0, 0);

  for (let i = -3; i <= 3; i++) {
    addBox(bossGroup, 0.04, 0.56, 0.06, mats.steel, i * 0.24, 0.72, -1.94);
  }
  addBox(bossGroup, 1.66, 0.06, 0.08, mats.steel, 0, 0.96, -1.94);

  rig.eraMeshes = [];
  for (const sx of [-1.14, 1.14]) {
    addBox(bossGroup, 0.52, 0.54, 3.78, mats.tracks, sx, 0.34, 0);
    addBox(bossGroup, 0.12, 0.44, 3.68, mats.rusDark, sx + (sx < 0 ? -0.28 : 0.28), 0.58, 0);
    for (let w = 0; w < 6; w++) {
      addCyl(bossGroup, 0.25, 0.25, 0.54, 10, mats.steel, sx, 0.28, 1.42 - w * 0.56, 0, 0, Math.PI / 2);
    }
    for (let i = 0; i < 5; i++) {
      const era = addBox(bossGroup, 0.1, 0.32, 0.5, mats.olive, sx + (sx < 0 ? -0.34 : 0.34), 0.64, 1.2 - i * 0.62);
      rig.eraMeshes.push(era);
    }
  }

  addBox(bossGroup, 0.32, 0.28, 0.58, mats.darkSteel, -0.82, 0.98, 1.16);
  addBox(bossGroup, 0.32, 0.28, 0.58, mats.darkSteel, 0.82, 0.98, 1.16);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 1.0, 0.05);
  bossGroup.add(turretPivot);
  rig.turretPivot = turretPivot;

  addBox(turretPivot, 1.26, 0.5, 1.48, mats.rusCamo, 0, 0.25, 0);
  addBox(turretPivot, 0.9, 0.44, 0.94, mats.darkSteel, 0, 0.68, -0.08);
  const dualGunGeo = createLatheAlongZGeo([
    [0.075, 0.22],
    [0.075, 0.62],
    [0.05, 0.64],
    [0.05, 1.72],
    [0.07, 1.74],
    [0.04, 1.88]
  ]);
  for (const gx of [-0.22, 0.22]) {
    const gMesh = new THREE.Mesh(dualGunGeo, mats.gunmetal);
    gMesh.position.set(gx, 0.62, 0.18);
    turretPivot.add(gMesh);
  }

  for (const sx of [-0.84, 0.84]) {
    addBox(turretPivot, 0.28, 0.42, 0.22, mats.steel, sx * 0.78, 0.42, 0);
    for (const ty of [0.26, 0.52]) {
      addCyl(turretPivot, 0.11, 0.11, 1.4, 10, mats.olive, sx, ty, 0.08, Math.PI / 2, 0, 0);
      addCyl(turretPivot, 0.08, 0.08, 0.06, 8, mats.shtoraRed, sx, ty, 0.8, Math.PI / 2, 0, 0);
    }
  }

  const apsMast = new THREE.Group();
  apsMast.position.set(0, 0.96, -0.28);
  addCyl(apsMast, 0.09, 0.11, 0.34, 8, mats.steel, 0, 0.16, 0);
  addBox(apsMast, 0.76, 0.18, 0.14, mats.radarCyan, 0, 0.38, 0);
  turretPivot.add(apsMast);
  rig.rotors = [apsMast];

  addApsShieldSphere(hullGroup, rig, 2.7, 1.1);
}

// === NEW SUB-BOSSES ===
function buildSubBossTos1(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const g = new THREE.Group();
  g.scale.setScalar(1.22);
  hullGroup.add(g);

  addBox(g, 1.65, 0.52, 3.45, mats.rusDark, 0, 0.58, 0);
  for (const sx of [-1.02, 1.02]) {
    addBox(g, 0.48, 0.52, 3.55, mats.tracks, sx, 0.34, 0);
    for (let w = 0; w < 6; w++) {
      addCyl(g, 0.22, 0.22, 0.5, 10, mats.steel, sx, 0.26, 1.35 - w * 0.54, 0, 0, Math.PI / 2);
    }
  }

  rig.eraMeshes = [];
  for (let i = -2; i <= 2; i++) {
    rig.eraMeshes.push(addBox(g, 0.28, 0.14, 0.28, mats.olive, i * 0.3, 0.86, 1.56, 0.35, 0, 0));
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.95, 0);
  g.add(turretPivot);
  rig.turretPivot = turretPivot;

  addCyl(turretPivot, 0.72, 0.82, 0.22, 12, mats.darkSteel, 0, 0.11, 0);
  const pod = new THREE.Group();
  pod.position.set(0, 0.65, 0);
  pod.rotation.x = -0.35;
  turretPivot.add(pod);

  addBox(pod, 1.72, 1.02, 2.15, mats.rusCamo, 0, 0, 0);
  for (let c = 0; c < 6; c++) {
    for (let r = 0; r < 4; r++) {
      const rx = -0.62 + c * 0.25;
      const ry = -0.34 + r * 0.22;
      addCyl(pod, 0.085, 0.085, 2.2, 8, mats.gunmetal, rx, ry, 0.02, Math.PI / 2, 0, 0);
      addCyl(pod, 0.06, 0.06, 0.06, 8, mats.afterburner, rx, ry, 1.14, Math.PI / 2, 0, 0);
    }
  }
}

function buildSubBossPantsir(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const g = new THREE.Group();
  g.scale.setScalar(1.2);
  hullGroup.add(g);

  // KamAZ-6560 8x8 Armored Truck Chassis
  addBox(g, 1.62, 0.42, 4.1, mats.darkSteel, 0, 0.56, 0);
  addBox(g, 1.68, 0.92, 1.25, mats.rusCamo, 0, 1.06, 1.48);
  addBox(g, 1.38, 0.32, 0.08, mats.glass, 0, 1.18, 2.12);

  rig.wheels = [];
  for (const wz of [1.55, 0.55, -0.55, -1.55]) {
    rig.wheels.push(
      addMilitaryWheel(g, mats, -0.92, 0.4, wz, 0.28),
      addMilitaryWheel(g, mats, 0.92, 0.4, wz, 0.28)
    );
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.92, -0.55);
  g.add(turretPivot);
  rig.turretPivot = turretPivot;

  addBox(turretPivot, 1.42, 0.72, 1.65, mats.rusDark, 0, 0.36, 0);
  // Twin 30mm 2A38M autocannons + 12 SAM tubes (6 per side)
  for (const sx of [-0.46, 0.46]) {
    addCyl(turretPivot, 0.055, 0.055, 1.65, 8, mats.gunmetal, sx, 0.45, 1.1, Math.PI / 2, 0, 0);
  }
  for (const sx of [-0.95, 0.95]) {
    addBox(turretPivot, 0.38, 0.78, 1.72, mats.oliveDark, sx, 0.52, 0.08, -0.22, 0, 0);
    for (let r = 0; r < 3; r++) {
      addCyl(turretPivot, 0.08, 0.08, 0.1, 8, mats.shtoraRed, sx, 0.35 + r * 0.22, 0.96, Math.PI / 2, 0, 0);
    }
  }

  // Spinning Pantsir acquisition radar on top
  const radar = new THREE.Group();
  radar.position.set(0, 1.05, -0.25);
  addCyl(radar, 0.12, 0.15, 0.35, 8, mats.steel, 0, 0.12, 0);
  addBox(radar, 1.1, 0.36, 0.14, mats.radarCyan, 0, 0.36, 0);
  turretPivot.add(radar);
  rig.rotors = [radar];

  addApsShieldSphere(hullGroup, rig, 2.7, 1.2);
}

function buildSubBossKa50(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const g = new THREE.Group();
  g.scale.setScalar(1.22);
  hullGroup.add(g);
  buildHeli(g, rig, mats, mats.blackShark, 4.35);
}

// === NEW STAGE BOSSES ===
function buildBossKoalitsiya(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const g = new THREE.Group();
  g.scale.setScalar(1.34);
  hullGroup.add(g);

  // Armata-derived heavy SPG hull
  addBox(g, 1.85, 0.58, 3.85, mats.rusCamo, 0, 0.62, 0);
  for (const sx of [-1.14, 1.14]) {
    addBox(g, 0.5, 0.52, 3.9, mats.tracks, sx, 0.34, 0);
    for (let w = 0; w < 7; w++) {
      addCyl(g, 0.23, 0.23, 0.52, 10, mats.steel, sx, 0.28, 1.5 - w * 0.5, 0, 0, Math.PI / 2);
    }
  }
  rig.eraMeshes = [];
  for (let i = -2; i <= 2; i++) {
    rig.eraMeshes.push(addBox(g, 0.3, 0.14, 0.32, mats.olive, i * 0.32, 0.92, 1.75, 0.32, 0, 0));
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.94, -0.15);
  g.add(turretPivot);
  rig.turretPivot = turretPivot;

  const spgTurret = createSideExtrudeGeo(
    [
      [-1.55, 0.0],
      [0.95, 0.0],
      [1.15, 0.42],
      [0.65, 1.02],
      [-1.45, 1.02]
    ],
    1.88,
    0.05,
    0.05
  );
  turretPivot.add(new THREE.Mesh(spgTurret, mats.rusDark));

  // Signature twin 152mm barrels!
  const barrel152 = createLatheAlongZGeo([
    [0.14, 0.2],
    [0.14, 0.9],
    [0.1, 0.95],
    [0.1, 2.75],
    [0.17, 2.8],
    [0.17, 3.08],
    [0.08, 3.12]
  ]);
  for (const bx of [-0.24, 0.24]) {
    const b = new THREE.Mesh(barrel152, mats.gunmetal);
    b.position.set(bx, 0.52, 0.72);
    b.rotation.x = -0.16;
    turretPivot.add(b);
  }
}

function buildBossTu160(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  // Giant Supersonic Strategic Bomber "White Swan" at y = 5.0
  const airframe = new THREE.Group();
  airframe.position.y = 5.0;
  airframe.scale.setScalar(1.38);
  hullGroup.add(airframe);

  // Long needle-nose blended fuselage
  const fuseGeo = createLatheAlongZGeo([
    [0.01, 4.2],
    [0.24, 3.1],
    [0.42, 1.8],
    [0.48, 0.0],
    [0.44, -2.5],
    [0.22, -3.7],
    [0.01, -4.0]
  ]);
  airframe.add(new THREE.Mesh(fuseGeo, mats.navalWhite));
  addBox(airframe, 0.52, 0.28, 1.15, mats.glass, 0, 0.36, 2.15, 0.14, 0, 0);

  // Swept variable-geometry wings
  const wingGeo = createPlanExtrudeGeo(
    [
      [0, 1.65],
      [0.75, 0.95],
      [4.2, -1.65],
      [3.95, -2.25],
      [0.85, -1.35],
      [0, -1.85],
      [-0.85, -1.35],
      [-3.95, -2.25],
      [-4.2, -1.65],
      [-0.75, 0.95]
    ],
    0.12,
    0.03,
    0.03
  );
  airframe.add(new THREE.Mesh(wingGeo, mats.navalWhite));

  // Swept T-tail stabilizer
  addBox(airframe, 0.12, 1.45, 1.1, mats.navalWhite, 0, 0.75, -3.15, -0.36, 0, 0);
  addBox(airframe, 2.3, 0.08, 0.75, mats.navalWhite, 0, 1.28, -3.35);

  // 4 Kuznetsov NK-32 afterburning engine nacelles
  for (const ex of [-1.05, -0.62, 0.62, 1.05]) {
    addBox(airframe, 0.34, 0.32, 2.25, mats.navalGray, ex, -0.14, -1.45);
    addCyl(airframe, 0.14, 0.16, 0.52, 8, mats.afterburner, ex, -0.14, -2.75, Math.PI / 2, 0, 0);
  }
  rig.rotors = [];
}

function buildBossArmata(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const g = new THREE.Group();
  g.scale.setScalar(1.36);
  hullGroup.add(g);

  const hullGeo = createSideExtrudeGeo(
    [
      [-1.95, 0.42],
      [1.52, 0.42],
      [2.12, 0.68],
      [1.35, 0.98],
      [-1.92, 0.98]
    ],
    1.86,
    0.04,
    0.04
  );
  g.add(new THREE.Mesh(hullGeo, mats.rusCamo));
  for (const sx of [-1.14, 1.14]) {
    addBox(g, 0.5, 0.5, 3.95, mats.tracks, sx, 0.34, 0);
    for (let w = 0; w < 7; w++) {
      addCyl(g, 0.23, 0.23, 0.52, 10, mats.steel, sx, 0.28, 1.54 - w * 0.51, 0, 0, Math.PI / 2);
    }
  }

  rig.eraMeshes = [];
  for (let i = -2; i <= 2; i++) {
    rig.eraMeshes.push(addBox(g, 0.3, 0.14, 0.3, mats.oliveDark, i * 0.34, 0.92, 1.75, 0.36, 0, 0));
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 1.0, 0.08);
  g.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Angular unmanned T-14 Armata stealth shroud
  const t14Turret = createSideExtrudeGeo(
    [
      [-1.24, 0.0],
      [0.88, 0.0],
      [1.32, 0.28],
      [0.82, 0.68],
      [-1.18, 0.68]
    ],
    1.52,
    0.04,
    0.04
  );
  turretPivot.add(new THREE.Mesh(t14Turret, mats.rusDark));

  // Afganit APS tubes around base
  for (const sx of [-0.88, 0.88]) {
    for (let i = 0; i < 4; i++) {
      addCyl(turretPivot, 0.085, 0.085, 0.38, 8, mats.darkSteel, sx, 0.18, 0.55 - i * 0.34, 0.45, 0, sx < 0 ? 0.5 : -0.5);
    }
  }

  // Electronic Warfare EMP Pulse Spire on roof
  addCyl(turretPivot, 0.08, 0.12, 0.85, 8, mats.steel, -0.35, 1.05, -0.35);
  addCyl(turretPivot, 0.18, 0.06, 0.28, 10, mats.empPurple, -0.35, 1.54, -0.35);

  const gun125 = createLatheAlongZGeo([
    [0.12, 0.5],
    [0.12, 1.55],
    [0.095, 1.6],
    [0.095, 3.25],
    [0.13, 3.3],
    [0.08, 3.35]
  ]);
  const barrel = new THREE.Mesh(gun125, mats.gunmetal);
  barrel.position.set(0, 0.35, 0);
  turretPivot.add(barrel);

  const mast = new THREE.Group();
  mast.position.set(0.32, 0.9, -0.15);
  addBox(mast, 0.56, 0.18, 0.12, mats.radarCyan, 0, 0, 0);
  turretPivot.add(mast);
  rig.rotors = [mast];

  addApsShieldSphere(hullGroup, rig, 2.85, 1.15);
}

// === WORLD MEGA BOSSES (STAGE 5) ===
function buildMegaBossScud(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const g = new THREE.Group();
  g.scale.setScalar(1.42);
  hullGroup.add(g);

  // Massive MAZ-7917 16x16 TEL chassis
  addBox(g, 2.05, 0.52, 5.8, mats.darkSteel, 0, 0.65, 0);
  addBox(g, 2.15, 0.36, 5.4, mats.rusCamo, 0, 1.02, 0);
  // Twin forward armored cabs straddling missile nose
  for (const cx of [-0.72, 0.72]) {
    addBox(g, 0.68, 0.88, 1.48, mats.rusCamo, cx, 1.18, 2.08);
    addBox(g, 0.52, 0.34, 0.08, mats.glass, cx, 1.32, 2.82);
  }

  // 16 giant off-road wheels (8 per side!)
  rig.wheels = [];
  for (let i = 0; i < 8; i++) {
    const wz = 2.38 - i * 0.68;
    rig.wheels.push(
      addMilitaryWheel(g, mats, -1.12, 0.44, wz, 0.3),
      addMilitaryWheel(g, mats, 1.12, 0.44, wz, 0.3)
    );
  }

  rig.eraMeshes = [];
  for (const sx of [-1.22, 1.22]) {
    for (let i = 0; i < 6; i++) {
      rig.eraMeshes.push(addBox(g, 0.12, 0.34, 0.52, mats.oliveDark, sx, 0.96, 1.8 - i * 0.72));
    }
  }

  // Giant elevated Topol-M / Iskander-M ballistic missile canister
  const missilePod = new THREE.Group();
  missilePod.position.set(0, 1.55, -0.35);
  missilePod.rotation.x = -0.32;
  g.add(missilePod);

  addCyl(missilePod, 0.46, 0.48, 4.4, 14, mats.olive, 0, 0.35, 0, Math.PI / 2, 0, 0);
  addCyl(missilePod, 0.02, 0.44, 0.88, 14, mats.shtoraRed, 0, 0.35, 2.6, Math.PI / 2, 0, 0);

  // Autonomous roof turret
  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 1.4, 1.4);
  g.add(turretPivot);
  rig.turretPivot = turretPivot;
  addCyl(turretPivot, 0.36, 0.44, 0.32, 10, mats.darkSteel, 0, 0.15, 0);
  addCyl(turretPivot, 0.055, 0.055, 1.15, 8, mats.gunmetal, -0.14, 0.24, 0.55, Math.PI / 2, 0, 0);
  addCyl(turretPivot, 0.055, 0.055, 1.15, 8, mats.gunmetal, 0.14, 0.24, 0.55, Math.PI / 2, 0, 0);

  const radar = new THREE.Group();
  radar.position.set(0, 0.45, -0.1);
  addBox(radar, 0.85, 0.2, 0.12, mats.radarCyan, 0, 0, 0);
  turretPivot.add(radar);
  rig.rotors = [radar];

  addApsShieldSphere(hullGroup, rig, 3.65, 1.45);
}

function buildMegaBossObject279(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const g = new THREE.Group();
  g.scale.setScalar(1.48);
  hullGroup.add(g);

  // Iconic Object 279 "Kotin" 4-Track Underbody!
  for (const sx of [-1.25, -0.52, 0.52, 1.25]) {
    addBox(g, 0.42, 0.46, 3.85, mats.tracks, sx, 0.32, 0);
    for (let w = 0; w < 6; w++) {
      addCyl(g, 0.19, 0.19, 0.44, 8, mats.steel, sx, 0.26, 1.45 - w * 0.58, 0, 0, Math.PI / 2);
    }
  }

  // Elliptical nuclear-shockwave-deflecting cast saucer hull
  const saucer = new THREE.Mesh(
    getGeo('obj279_hull', () => new THREE.SphereGeometry(1.85, 20, 12)),
    mats.rusDark
  );
  saucer.scale.set(1.12, 0.36, 1.38);
  saucer.position.set(0, 0.82, 0);
  g.add(saucer);

  rig.eraMeshes = [];
  for (let i = -3; i <= 3; i++) {
    rig.eraMeshes.push(addBox(g, 0.28, 0.14, 0.28, mats.olive, i * 0.32, 0.92, 1.98, 0.35, 0, 0));
  }

  // Heavy domed cast turret + 130mm M-65 rifled cannon
  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 1.08, 0.08);
  g.add(turretPivot);
  rig.turretPivot = turretPivot;

  const dome = new THREE.Mesh(getGeo('obj279_turret', () => new THREE.SphereGeometry(1.12, 16, 12)), mats.rusCamo);
  dome.scale.set(1.06, 0.56, 1.24);
  dome.position.y = 0.24;
  turretPivot.add(dome);

  // Side missile pods on turret cheeks
  for (const sx of [-1.18, 1.18]) {
    addBox(turretPivot, 0.38, 0.46, 1.1, mats.darkSteel, sx, 0.34, 0);
    addCyl(turretPivot, 0.1, 0.1, 0.08, 8, mats.amberGlow, sx, 0.34, 0.58, Math.PI / 2, 0, 0);
  }

  const gun130 = createLatheAlongZGeo([
    [0.15, 0.65],
    [0.15, 1.55],
    [0.11, 1.62],
    [0.11, 3.4],
    [0.17, 3.45],
    [0.17, 3.72],
    [0.09, 3.76]
  ]);
  const barrel = new THREE.Mesh(gun130, mats.gunmetal);
  barrel.position.set(0, 0.36, 0.1);
  turretPivot.add(barrel);

  const radar = new THREE.Group();
  radar.position.set(0, 0.92, -0.2);
  addBox(radar, 0.78, 0.18, 0.12, mats.radarCyan, 0, 0, 0);
  turretPivot.add(radar);
  rig.rotors = [radar];

  addApsShieldSphere(hullGroup, rig, 3.35, 1.2);
}

function buildMegaBossKirov(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  // Giant Armored Strategic Flying Carrier at y = 5.4
  const airship = new THREE.Group();
  airship.position.y = 5.4;
  airship.scale.setScalar(1.45);
  hullGroup.add(airship);

  // Armored armored dirigible / flying carrier hull
  const envelope = new THREE.Mesh(
    getGeo('kirov_hull', () => new THREE.CylinderGeometry(1.18, 1.18, 5.2, 16)),
    mats.rusDark
  );
  envelope.rotation.x = Math.PI / 2;
  envelope.scale.set(1.25, 1.0, 0.92);
  airship.add(envelope);

  const nose = new THREE.Mesh(getGeo('kirov_nose', () => new THREE.SphereGeometry(1.18, 16, 12)), mats.rusCamo);
  nose.scale.set(1.25, 0.92, 1.25);
  nose.position.z = 2.6;
  airship.add(nose);

  const tailCone = new THREE.Mesh(getGeo('kirov_tail', () => new THREE.ConeGeometry(1.18, 2.2, 16)), mats.rusCamo);
  tailCone.rotation.x = -Math.PI / 2;
  tailCone.scale.set(1.25, 1.0, 0.92);
  tailCone.position.z = -3.7;
  airship.add(tailCone);

  // Command Gondola + Ventral Drone/Bomb Bay + Tail Fins
  addBox(airship, 1.12, 0.65, 3.2, mats.darkSteel, 0, -1.18, 0.35);
  addBox(airship, 0.88, 0.28, 0.45, mats.shtoraRed, 0, -1.16, 1.98);
  addBox(airship, 0.14, 1.75, 1.45, mats.rusCamo, 0, 1.25, -2.55);
  addBox(airship, 3.25, 0.14, 1.25, mats.rusCamo, 0, 0, -2.55);

  // 4 Ducted Outrigger Lift-Turbofans with Spinning Rotors
  rig.rotors = [];
  const rotorBladeGeo = getGeo('kirov_rotor', () => new THREE.BoxGeometry(1.55, 0.04, 0.2));
  for (const [rx, rz] of [[-2.05, 1.35], [2.05, 1.35], [-2.05, -1.35], [2.05, -1.35]]) {
    addBox(airship, 1.15, 0.18, 0.45, mats.steel, rx * 0.68, 0.1, rz);
    addCyl(airship, 0.92, 0.92, 0.28, 14, mats.darkSteel, rx, 0.1, rz);
    const prop = new THREE.Group();
    prop.position.set(rx, 0.26, rz);
    const b1 = new THREE.Mesh(rotorBladeGeo, mats.amberGlow);
    const b2 = new THREE.Mesh(rotorBladeGeo, mats.amberGlow);
    b2.rotation.y = Math.PI / 2;
    prop.add(b1, b2);
    airship.add(prop);
    rig.rotors.push(prop);
  }

  addApsShieldSphere(hullGroup, rig, 4.1, 5.4);
}

// ============================================================================
// 20 NEW EXPANSION ENEMY MODELS
// ============================================================================

function addEnergyShieldDome(hullGroup: THREE.Group, rig: EnemyRig3D, radius = 1.45, y = 0.9) {
  const es = new THREE.Mesh(
    getGeo(`eshield_${radius}`, () => new THREE.SphereGeometry(radius, 16, 12)),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      wireframe: true
    })
  );
  es.position.y = y;
  es.userData.noShadow = true;
  es.castShadow = false;
  es.receiveShadow = false;
  hullGroup.add(es);
  rig.energyShieldMesh = es;
}

function buildHumanoidSoldier(
  hullGroup: THREE.Group,
  rig: EnemyRig3D,
  mats: ModelMaterials,
  opts: {
    scale?: number;
    bodyMat?: THREE.Material;
    accentMat?: THREE.Material;
    weaponLen?: number;
    hasBackpack?: boolean;
    hasShield?: boolean;
    hasHammer?: boolean;
    hasRpg?: boolean;
    hasMortar?: boolean;
  }
) {
  const g = new THREE.Group();
  const sc = opts.scale || 1.25;
  g.scale.setScalar(sc);
  hullGroup.add(g);

  const bodyMat = opts.bodyMat || mats.rusCamo;
  const accMat = opts.accentMat || mats.darkSteel;

  rig.legs = [];
  const legL = addBox(g, 0.22, 0.56, 0.24, mats.rusDark, -0.15, 0.28, 0);
  const legR = addBox(g, 0.22, 0.56, 0.24, mats.rusDark, 0.15, 0.28, 0);
  rig.legs.push(legL, legR);

  addBox(g, 0.54, 0.6, 0.34, bodyMat, 0, 0.84, 0);
  addBox(g, 0.46, 0.42, 0.12, accMat, 0, 0.88, 0.18);
  addCyl(g, 0.2, 0.22, 0.3, 10, accMat, 0, 1.32, 0);
  addBox(g, 0.28, 0.12, 0.12, mats.opticGreen, 0, 1.32, 0.17);

  if (opts.hasBackpack) {
    addBox(g, 0.44, 0.52, 0.28, accMat, 0, 0.9, -0.26);
  }
  if (opts.hasShield) {
    addBox(g, 0.82, 1.18, 0.14, mats.steel, -0.15, 0.82, 0.46);
    addBox(g, 0.45, 0.16, 0.08, mats.radarCyan, -0.15, 1.12, 0.55);
  }
  if (opts.hasHammer) {
    addCyl(g, 0.05, 0.05, 1.1, 8, mats.steel, 0.42, 0.88, 0.36, Math.PI / 3, 0, 0);
    addBox(g, 0.36, 0.32, 0.58, mats.gunmetal, 0.42, 1.18, 0.78);
  } else if (opts.hasRpg) {
    addCyl(g, 0.1, 0.1, 1.55, 10, mats.oliveDark, 0.34, 1.15, 0.25, Math.PI / 2, 0, 0);
    addCyl(g, 0.04, 0.13, 0.28, 8, mats.shtoraRed, 0.34, 1.15, 1.1, Math.PI / 2, 0, 0);
  } else if (opts.hasMortar) {
    addCyl(g, 0.15, 0.18, 1.05, 10, mats.gunmetal, 0, 0.95, -0.22, -0.45, 0, 0);
  } else {
    const wLen = opts.weaponLen || 0.9;
    addBox(g, 0.1, 0.14, wLen, mats.gunmetal, 0.28, 0.88, 0.38);
  }
}

function buildCorredor(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  for (const [ox, oz] of [[0, 0.45], [-0.55, -0.42], [0.55, -0.42]]) {
    const sub = new THREE.Group();
    sub.position.set(ox, 0, oz);
    const l1 = addBox(sub, 0.14, 0.42, 0.16, mats.rusDark, -0.1, 0.21, 0);
    const l2 = addBox(sub, 0.14, 0.42, 0.16, mats.rusDark, 0.1, 0.21, 0);
    if (!rig.legs) rig.legs = [];
    rig.legs.push(l1, l2);
    addBox(sub, 0.36, 0.42, 0.24, mats.shtoraRed, 0, 0.62, 0);
    addCyl(sub, 0.13, 0.15, 0.2, 8, mats.darkSteel, 0, 0.96, 0);
    addBox(sub, 0.04, 0.08, 0.52, mats.steel, -0.24, 0.62, 0.24);
    addBox(sub, 0.04, 0.08, 0.52, mats.steel, 0.24, 0.62, 0.24);
    hullGroup.add(sub);
  }
}

function buildBatedorPlasma(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  buildHumanoidSoldier(hullGroup, rig, mats, {
    scale: 1.25,
    bodyMat: mats.navalGray,
    accentMat: mats.radarCyan,
    weaponLen: 0.72
  });
  addEnergyShieldDome(hullGroup, rig, 1.35, 0.95);
}

function buildEscudeiro(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  buildHumanoidSoldier(hullGroup, rig, mats, {
    scale: 1.42,
    bodyMat: mats.darkSteel,
    accentMat: mats.steel,
    hasShield: true,
    weaponLen: 0.6
  });
}

function buildBrutamontes(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  buildHumanoidSoldier(hullGroup, rig, mats, {
    scale: 1.9,
    bodyMat: mats.rusDark,
    accentMat: mats.gunmetal,
    hasHammer: true
  });
}

function buildArtilheiro(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  buildHumanoidSoldier(hullGroup, rig, mats, {
    scale: 1.45,
    bodyMat: mats.oliveDark,
    accentMat: mats.amberGlow,
    hasBackpack: true,
    hasMortar: true
  });
}

function buildDemolidor(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  buildHumanoidSoldier(hullGroup, rig, mats, {
    scale: 1.48,
    bodyMat: mats.rusDark,
    accentMat: mats.afterburner,
    hasBackpack: true,
    hasRpg: true
  });
}

function buildDroneRecon(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const airframe = new THREE.Group();
  airframe.position.y = 3.6;
  hullGroup.add(airframe);
  addBox(airframe, 1.5, 0.14, 0.55, mats.navalGray, 0, 0, 0);
  addCyl(airframe, 0.16, 0.22, 1.35, 10, mats.darkSteel, 0, 0, 0.1, Math.PI / 2, 0, 0);
  addCyl(airframe, 0.12, 0.12, 0.1, 8, mats.radarCyan, 0, 0, 0.78, Math.PI / 2, 0, 0);
  rig.rotors = [];
  for (const px of [-0.72, 0.72]) {
    const p = new THREE.Group();
    p.position.set(px, 0.14, 0);
    addBox(p, 0.65, 0.03, 0.08, mats.tire, 0, 0, 0);
    airframe.add(p);
    rig.rotors.push(p);
  }
  addEnergyShieldDome(hullGroup, rig, 1.45, 3.6);
}

function buildDroneBombardeiro(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const airframe = new THREE.Group();
  airframe.position.y = 4.2;
  airframe.scale.setScalar(1.28);
  hullGroup.add(airframe);
  addBox(airframe, 2.35, 0.18, 0.85, mats.rusDark, 0, 0, 0);
  addBox(airframe, 0.68, 0.42, 1.85, mats.gunmetal, 0, 0.05, 0.1);
  addBox(airframe, 0.24, 0.22, 0.72, mats.afterburner, -0.25, -0.22, 0);
  addBox(airframe, 0.24, 0.22, 0.72, mats.afterburner, 0.25, -0.22, 0);
  rig.rotors = [];
  for (const px of [-1.05, 1.05]) {
    const p = new THREE.Group();
    p.position.set(px, 0.2, 0);
    addBox(p, 0.95, 0.04, 0.1, mats.amberGlow, 0, 0, 0);
    airframe.add(p);
    rig.rotors.push(p);
  }
}

function buildCacadorFurtivo(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const stealthMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.65,
    transparent: true,
    opacity: 0.34
  });
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.9,
    transparent: true,
    opacity: 0.55
  });
  rig.stealthMaterials = [stealthMat, bladeMat];

  const g = new THREE.Group();
  g.scale.setScalar(1.32);
  hullGroup.add(g);
  rig.legs = [
    addBox(g, 0.18, 0.5, 0.2, stealthMat, -0.14, 0.25, 0),
    addBox(g, 0.18, 0.5, 0.2, stealthMat, 0.14, 0.25, 0)
  ];
  addBox(g, 0.48, 0.56, 0.3, stealthMat, 0, 0.78, 0);
  addCyl(g, 0.18, 0.2, 0.28, 10, stealthMat, 0, 1.24, 0);
  addBox(g, 0.06, 0.1, 0.65, bladeMat, -0.28, 0.74, 0.35);
  addBox(g, 0.06, 0.1, 0.65, bladeMat, 0.28, 0.74, 0.35);
}

function buildMedicoCombate(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  buildHumanoidSoldier(hullGroup, rig, mats, {
    scale: 1.32,
    bodyMat: mats.navalWhite,
    accentMat: mats.opticGreen,
    hasBackpack: true,
    weaponLen: 0.72
  });
  addBox(hullGroup, 0.42, 0.14, 0.12, mats.opticGreen, 0, 1.25, -0.35);
  addBox(hullGroup, 0.14, 0.42, 0.12, mats.opticGreen, 0, 1.25, -0.35);
}

function buildEmissorEscudo(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const g = new THREE.Group();
  hullGroup.add(g);
  addCyl(g, 0.78, 0.94, 0.55, 10, mats.navalGray, 0, 0.42, 0);
  rig.wheels = [
    addMilitaryWheel(g, mats, -0.82, 0.32, 0.62, 0.22),
    addMilitaryWheel(g, mats, 0.82, 0.32, 0.62, 0.22),
    addMilitaryWheel(g, mats, -0.82, 0.32, -0.62, 0.22),
    addMilitaryWheel(g, mats, 0.82, 0.32, -0.62, 0.22)
  ];
  addCyl(g, 0.18, 0.24, 0.95, 10, mats.darkSteel, 0, 1.1, 0);
  const orb = new THREE.Mesh(getGeo('emissor_orb', () => new THREE.SphereGeometry(0.42, 14, 12)), mats.radarCyan);
  orb.position.set(0, 1.75, 0);
  g.add(orb);
  addEnergyShieldDome(hullGroup, rig, 1.75, 1.1);
}

function buildEnxameCorrosivo(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  for (const [ox, oz] of [[0, 0.5], [-0.55, -0.35], [0.55, -0.35], [0, -0.65]]) {
    const bug = new THREE.Group();
    bug.position.set(ox, 0, oz);
    addBox(bug, 0.34, 0.24, 0.52, mats.opticGreen, 0, 0.24, 0);
    addBox(bug, 0.22, 0.16, 0.22, mats.oliveDark, 0, 0.28, 0.28);
    hullGroup.add(bug);
  }
}

function buildAtiradorElite(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  buildHumanoidSoldier(hullGroup, rig, mats, {
    scale: 1.32,
    bodyMat: mats.oliveDark,
    accentMat: mats.shtoraRed,
    weaponLen: 1.65
  });
}

function buildSabotadorEmp(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  buildHumanoidSoldier(hullGroup, rig, mats, {
    scale: 1.38,
    bodyMat: mats.darkSteel,
    accentMat: mats.empPurple,
    hasBackpack: true,
    weaponLen: 0.82
  });
  addCyl(hullGroup, 0.05, 0.05, 0.95, 8, mats.empPurple, -0.18, 1.75, -0.25);
  addEnergyShieldDome(hullGroup, rig, 1.4, 1.0);
}

function buildEscavador(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const g = new THREE.Group();
  hullGroup.add(g);
  addBox(g, 1.35, 0.62, 2.15, mats.darkSteel, 0, 0.56, -0.1);
  for (const sx of [-0.78, 0.78]) {
    addBox(g, 0.34, 0.42, 2.2, mats.tracks, sx, 0.26, -0.1);
  }
  const drillPivot = new THREE.Group();
  drillPivot.position.set(0, 0.58, 1.35);
  const cone = new THREE.Mesh(getGeo('escavador_drill', () => new THREE.ConeGeometry(0.55, 1.35, 10)), mats.amberGlow);
  cone.rotation.x = Math.PI / 2;
  drillPivot.add(cone);
  g.add(drillPivot);
  rig.rotors = [drillPivot];
}

function buildCorrosivo(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  buildHumanoidSoldier(hullGroup, rig, mats, {
    scale: 1.65,
    bodyMat: mats.olive,
    accentMat: mats.opticGreen,
    hasBackpack: true,
    weaponLen: 1.15
  });
}

function buildPiromante(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  buildHumanoidSoldier(hullGroup, rig, mats, {
    scale: 1.55,
    bodyMat: mats.shtoraRed,
    accentMat: mats.afterburner,
    hasBackpack: true,
    weaponLen: 1.25
  });
}

function buildCriomante(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  buildHumanoidSoldier(hullGroup, rig, mats, {
    scale: 1.55,
    bodyMat: mats.navalWhite,
    accentMat: mats.radarCyan,
    hasBackpack: true,
    weaponLen: 1.25
  });
  addEnergyShieldDome(hullGroup, rig, 1.55, 1.05);
}

function buildTitaCerco(hullGroup: THREE.Group, rig: EnemyRig3D, mats: ModelMaterials) {
  const g = new THREE.Group();
  g.scale.setScalar(1.52);
  hullGroup.add(g);

  // Massive Quad-Track Siege Titan chassis
  addBox(g, 2.25, 0.74, 4.1, mats.rusDark, 0, 0.72, 0);
  for (const sx of [-1.25, 1.25]) {
    addBox(g, 0.55, 0.56, 4.25, mats.tracks, sx, 0.36, 0);
    for (let w = 0; w < 6; w++) {
      addCyl(g, 0.26, 0.26, 0.58, 10, mats.steel, sx, 0.3, 1.5 - w * 0.6, 0, 0, Math.PI / 2);
    }
  }

  rig.eraMeshes = [];
  for (let i = -3; i <= 3; i++) {
    rig.eraMeshes.push(addBox(g, 0.32, 0.16, 0.34, mats.amberGlow, i * 0.32, 1.06, 1.98, 0.35, 0, 0));
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 1.18, 0.05);
  g.add(turretPivot);
  rig.turretPivot = turretPivot;

  addBox(turretPivot, 1.78, 0.88, 2.15, mats.gunmetal, 0, 0.44, 0);
  // Twin 203mm Siege Cannons + Seismic Shockwave Hammer Core
  for (const bx of [-0.42, 0.42]) {
    addCyl(turretPivot, 0.16, 0.19, 2.65, 12, mats.steel, bx, 0.56, 1.55, Math.PI / 2, 0, 0);
  }
  addBox(turretPivot, 1.1, 0.32, 0.24, mats.shtoraRed, 0, 0.96, -0.4);

  const radar = new THREE.Group();
  radar.position.set(0, 1.16, -0.2);
  addBox(radar, 0.95, 0.22, 0.14, mats.radarCyan, 0, 0, 0);
  turretPivot.add(radar);
  rig.rotors = [radar];

  addApsShieldSphere(hullGroup, rig, 3.45, 1.35);
  addEnergyShieldDome(hullGroup, rig, 3.85, 1.35);
}

// ============================================================================
// AIRSTRIKE, ORDNANCE & CACHED HOLOGRAPHIC GHOST HELPERS
// ============================================================================

export function createA10Warthog3D(): THREE.Group {
  const jet = new THREE.Group();
  const mats = getMats();

  const fuseGeo = createLatheAlongZGeo([
    [0.01, 3.05],
    [0.24, 2.55],
    [0.39, 1.75],
    [0.42, 0.45],
    [0.36, -1.85],
    [0.18, -2.55],
    [0.01, -2.65]
  ]);
  jet.add(new THREE.Mesh(fuseGeo, mats.navalGray));
  addCyl(jet, 0.11, 0.11, 0.95, 10, mats.gunmetal, 0, -0.14, 3.15, Math.PI / 2, 0, 0);
  addBox(jet, 0.42, 0.36, 1.38, mats.glass, 0, 0.38, 1.35, 0.1, 0, 0);

  const a10Wing = createPlanExtrudeGeo(
    [
      [-3.3, 0.42],
      [3.3, 0.42],
      [3.18, -0.62],
      [0.45, -0.56],
      [-0.45, -0.56],
      [-3.18, -0.62]
    ],
    0.1,
    0.025,
    0.025
  );
  const wingMesh = new THREE.Mesh(a10Wing, mats.navalGray);
  wingMesh.position.set(0, -0.06, 0.18);
  jet.add(wingMesh);

  for (const px of [-2.3, -1.5, 1.5, 2.3]) {
    addBox(jet, 0.08, 0.16, 0.55, mats.darkSteel, px, -0.14, 0.15);
    addCyl(jet, 0.095, 0.095, 0.92, 8, mats.olive, px, -0.26, 0.15, Math.PI / 2, 0, 0);
  }

  for (const ex of [-0.68, 0.68]) {
    addCyl(jet, 0.28, 0.26, 1.58, 12, mats.darkSteel, ex, 0.48, -1.15, Math.PI / 2, 0, 0);
    addCyl(jet, 0.22, 0.22, 0.06, 10, mats.steel, ex, 0.48, -0.35, Math.PI / 2, 0, 0);
    addCyl(jet, 0.2, 0.2, 0.14, 10, mats.afterburner, ex, 0.48, -1.96, Math.PI / 2, 0, 0);
  }

  addBox(jet, 2.48, 0.1, 0.62, mats.navalGray, 0, 0.14, -2.18);
  addBox(jet, 0.1, 0.98, 0.68, mats.darkSteel, -1.2, 0.46, -2.2);
  addBox(jet, 0.1, 0.98, 0.68, mats.darkSteel, 1.2, 0.46, -2.2);

  enableShadows(jet, true, false);
  return jet;
}

export function createB52Bomber3D(): THREE.Group {
  const jet = new THREE.Group();
  const mats = getMats();
  jet.scale.setScalar(1.35);

  const fuseGeo = createLatheAlongZGeo([
    [0.01, 4.2],
    [0.34, 3.2],
    [0.46, 1.8],
    [0.46, -2.4],
    [0.24, -3.9],
    [0.01, -4.15]
  ]);
  jet.add(new THREE.Mesh(fuseGeo, mats.navalGray));
  addBox(jet, 0.56, 0.28, 1.05, mats.glass, 0, 0.36, 2.55, 0.12, 0, 0);

  const wingGeo = createPlanExtrudeGeo(
    [
      [0, 1.4],
      [1.1, 0.75],
      [5.4, -1.55],
      [5.1, -2.15],
      [0.85, -0.8],
      [0, -0.95],
      [-0.85, -0.8],
      [-5.1, -2.15],
      [-5.4, -1.55],
      [-1.1, 0.75]
    ],
    0.11,
    0.025,
    0.025
  );
  const wing = new THREE.Mesh(wingGeo, mats.navalGray);
  wing.position.set(0, 0.16, 0.25);
  jet.add(wing);

  // 8 iconic TF33 turbofans in 4 twin pods under the swept wings
  for (const [px, pz] of [[-1.95, 0.05], [-3.35, -0.65], [1.95, 0.05], [3.35, -0.65]]) {
    addBox(jet, 0.48, 0.26, 1.35, mats.darkSteel, px, -0.18, pz);
    addCyl(jet, 0.12, 0.12, 0.15, 8, mats.afterburner, px - 0.12, -0.18, pz - 0.72, Math.PI / 2, 0, 0);
    addCyl(jet, 0.12, 0.12, 0.15, 8, mats.afterburner, px + 0.12, -0.18, pz - 0.72, Math.PI / 2, 0, 0);
  }

  addBox(jet, 0.12, 1.65, 1.15, mats.darkSteel, 0, 0.92, -3.35, -0.25, 0, 0);
  addBox(jet, 2.75, 0.09, 0.75, mats.navalGray, 0, 0.24, -3.5);

  enableShadows(jet, true, false);
  return jet;
}

export function createMissileMesh3D(kind: string): THREE.Group {
  const g = new THREE.Group();
  const mats = getMats();
  const isBoss = kind.startsWith('boss_') || kind.startsWith('enemy_');
  const isBig = kind === 'hellfire' || kind === 'patriot' || kind.startsWith('boss_');
  const r = kind === 'hellfire' ? 0.155 : isBoss ? 0.13 : isBig ? 0.115 : 0.085;
  const len = kind === 'hellfire' ? 1.48 : isBoss ? 1.15 : isBig ? 1.15 : 0.85;
  const bodyMat =
    kind === 'patriot'
      ? mats.navalWhite
      : kind === 'enemy_emp'
        ? mats.empPurple
        : kind === 'enemy_acid' || kind === 'toxic'
          ? mats.opticGreen
          : kind === 'enemy_cryo' || kind === 'cryo'
            ? mats.radarCyan
            : isBoss
              ? mats.shtoraRed
              : kind === 'hellfire'
                ? mats.darkSteel
                : mats.olive;

  const bodyGeo = createLatheAlongZGeo([
    [0.001, len * 0.72],
    [r * 0.72, len * 0.56],
    [r, len * 0.42],
    [r, -len * 0.46],
    [r * 0.78, -len * 0.52]
  ]);
  g.add(new THREE.Mesh(bodyGeo, bodyMat));

  addCyl(
    g,
    r * 0.35,
    r * 0.7,
    len * 0.14,
    8,
    kind === 'hellfire' || isBoss ? mats.amberGlow : mats.steel,
    0,
    0,
    len * 0.58,
    Math.PI / 2,
    0,
    0
  );

  addBox(g, r * 3.8, r * 0.35, len * 0.22, mats.gunmetal, 0, 0, -len * 0.36);
  addBox(g, r * 0.35, r * 3.8, len * 0.22, mats.gunmetal, 0, 0, -len * 0.36);

  const exhaustGeo = getGeo(`exhaust_${r}`, () => new THREE.ConeGeometry(r * 0.9, 0.36, 8));
  const exhaust = new THREE.Mesh(exhaustGeo, mats.afterburner);
  exhaust.rotation.x = -Math.PI / 2;
  exhaust.position.z = -len * 0.68;
  g.add(exhaust);

  return g;
}

/**
 * Returns a single cached Ghost 3D hologram per tower type (zero allocation on hover or click).
 */
export function createGhostTower3D(defId: string): { root: THREE.Group; setValid: (valid: boolean) => void } {
  const cached = ghostCache.get(defId);
  if (cached) return cached;

  const { root } = createTowerModel3D(defId, 1);
  const holoMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    transparent: true,
    opacity: 0.45,
    depthWrite: false
  });
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x4ade80,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });

  const meshes: THREE.Mesh[] = [];
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      meshes.push(child as THREE.Mesh);
    }
  });

  for (const m of meshes) {
    m.castShadow = false;
    m.receiveShadow = false;
    if (m.userData?.noShadow) {
      m.visible = false;
      continue;
    }
    m.material = holoMat;
    const wire = new THREE.Mesh(m.geometry, wireMat);
    wire.scale.setScalar(1.01);
    m.add(wire);
  }

  const entry = {
    root,
    setValid: (valid: boolean) => {
      holoMat.color.setHex(valid ? 0x22c55e : 0xef4444);
      wireMat.color.setHex(valid ? 0x86efac : 0xfca5a5);
    }
  };
  ghostCache.set(defId, entry);
  return entry;
}

let cachedWearWarmGeo: THREE.BoxGeometry | null = null;
let cachedWearWarmMat: THREE.MeshStandardMaterial | null = null;
let cachedWearWarmMesh: THREE.Mesh | null = null;

/**
 * Pre-warms all tower geometries, ghost holograms, enemy rigs, and compiles WebGL shaders at boot
 * so placing towers or spawning bosses causes 0ms frame hitch.
 */
export function prewarmAllMilitaryModels(
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  ghostParent: THREE.Group
): Map<string, { root: THREE.Group; setValid: (valid: boolean) => void }> {
  getMats();

  const warmGroup = new THREE.Group();
  warmGroup.position.set(0, -100, 0);
  scene.add(warmGroup);

  const towerIds = [
    'ballista',
    'm2_bunker',
    'abrams_pit',
    'howitzer',
    'sniper_tower',
    'cryo_tower',
    'tesla_tower',
    'toxic_tower',
    'flamethrower',
    'helios_laser',
    'railgun',
    'patriot',
    'phalanx',
    'harpoon_tower',
    'tos1_mlrs',
    'minefield',
    'ew_crew',
    'eng_workshop',
    'iron_dome',
    'energy_extractor',
    'bushmaster',
    'javelin',
    'hesco'
  ];

  for (const id of towerIds) {
    const gm = createGhostTower3D(id);
    gm.root.visible = false;
    if (gm.root.parent !== ghostParent) {
      ghostParent.add(gm.root);
    }

    const maxLv = id === 'hesco' ? 1 : 4;
    for (let lv = 1; lv <= maxLv; lv++) {
      const rig = createTowerModel3D(id, lv);
      warmGroup.add(rig.root);
    }
    if (id !== 'hesco') {
      warmGroup.add(createTowerModel3D(id, 5, 'A').root);
      warmGroup.add(createTowerModel3D(id, 6, 'B').root);
    }
  }

  const enemyTypes = [
    'infantry',
    'imv',
    'ifv',
    'drone_swarm',
    'mbt',
    'heli',
    'stealth',
    'boss',
    'subboss_tos1',
    'subboss_pantsir',
    'subboss_ka50',
    'boss_koalitsiya',
    'boss_terminator',
    'boss_tu160',
    'boss_armata',
    'megaboss_scud_convoy',
    'megaboss_object279',
    'megaboss_kirov_airship',
    'recruta',
    'corredor',
    'batedor_plasma',
    'escudeiro',
    'brutamontes',
    'artilheiro',
    'demolidor',
    'drone_recon',
    'drone_bombardeiro',
    'cacador_furtivo',
    'medico_combate',
    'emissor_escudo',
    'enxame_corrosivo',
    'atirador_elite',
    'sabotador_emp',
    'escavador',
    'corrosivo',
    'piromante',
    'criomante',
    'tita_cerco'
  ];
  for (const et of enemyTypes) {
    warmGroup.add(createEnemyModel3D(et).root);
  }

  warmGroup.add(createA10Warthog3D());
  warmGroup.add(createB52Bomber3D());
  warmGroup.add(createMissileMesh3D('javelin'));
  warmGroup.add(createMissileMesh3D('patriot'));
  warmGroup.add(createMissileMesh3D('hellfire'));
  warmGroup.add(createMissileMesh3D('boss_missile'));

  // Prewarm SurfaceShaderKit military wear shader variant once at boot.
  // Keep cached at module scope (NEVER dispose immediately after compile — Chrome KHR_parallel_shader_compile is async).
  if (!cachedWearWarmMesh) {
    cachedWearWarmGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    cachedWearWarmMat = new THREE.MeshStandardMaterial({ color: PALETTE.natoOlive, roughness: 0.78, metalness: 0.04 });
    applyMilitaryWearShader(cachedWearWarmMat, { variantKey: MILITARY_WEAR_VARIANTS.ARMOR });
    cachedWearWarmMesh = new THREE.Mesh(cachedWearWarmGeo, cachedWearWarmMat);
  }
  warmGroup.add(cachedWearWarmMesh);

  renderer.compile(scene, camera);

  scene.remove(warmGroup);
  return ghostCache;
}
