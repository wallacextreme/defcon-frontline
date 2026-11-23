import * as THREE from 'three';
import {
  applyMilitaryWearShader,
  MILITARY_WEAR_VARIANTS
} from './SurfaceShaderKit.ts';
import {
  getRoundedBoxGeo,
  getChamferedCylinderGeo,
  mergeStaticGeometries,
  createGhostEdges,
  createContactShadowMesh
} from './MilitaryGeometryKit.ts';
import {
  PALETTE,
  getGeo,
  getChamferedBoxGeo,
  StaticMeshBatcher,
  getCutCornerSlabGeo,
  createBatchedMissileCapsMesh,
  getMats,
  updateTowerWearBiomeDirtColor,
  getActiveTowerDirtColor,
  enableShadows,
  createSideExtrudeGeo,
  createPlanExtrudeGeo,
  createLatheAlongZGeo,
  createLatheYGeo,
  attachMuzzleFlashMesh
} from './TowerRigPrimitives.ts';
import type {
  ModelMaterials,
  TowerRig3D,
  EnemyRig3D
} from './TowerRigPrimitives.ts';
import {
  buildHescoModel,
  buildM2Bunker,
  buildBushmaster,
  buildBallista,
  buildSniperTower
} from './towers/LegacyAndPrecisionTowers3D.ts';
import {
  buildJavelin,
  buildAbramsPit,
  buildTos1Mlrs,
  buildMinefieldLayer,
  buildHarpoonTower
} from './towers/AreaAndMissileTowers3D.ts';
import {
  buildCryoTower,
  buildToxicTower,
  buildFlamethrower,
  buildHeliosLaser,
  buildRailgun
} from './towers/ElementalTowers3D.ts';
import {
  buildIronDome,
  buildEngWorkshop,
  buildEnergyExtractor
} from './towers/SupportTowers3D.ts';

export {
  PALETTE,
  getMats,
  updateTowerWearBiomeDirtColor
};
export type {
  TowerRig3D,
  EnemyRig3D
};

const ghostCache = new Map<string, { root: THREE.Group; setValid: (valid: boolean) => void }>();

// ============================================================================
// LEGACY PROCEDURAL GEOMETRY HELPERS (for enemies, aircraft & missiles)
// ============================================================================

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

// ============================================================================
// PUBLIC TOWER MODEL FACTORY
// ============================================================================

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
    buildM2Bunker(root, rig, mats, vLevel, specialization);
  } else if (defId === 'bushmaster') {
    buildBushmaster(root, rig, mats, vLevel, specialization);
  } else if (defId === 'javelin') {
    buildJavelin(root, rig, mats, vLevel, specialization);
  } else if (defId === 'phalanx') {
    buildPhalanx(root, rig, mats, vLevel, specialization);
  } else if (defId === 'howitzer') {
    buildHowitzer(root, rig, mats, vLevel, specialization);
  } else if (defId === 'patriot') {
    buildPatriot(root, rig, mats, vLevel, specialization);
  } else if (defId === 'ew_crew') {
    buildEwCrew(root, rig, mats, vLevel, specialization);
  } else if (defId === 'abrams_pit') {
    buildAbramsPit(root, rig, mats, vLevel, specialization);
  } else if (defId === 'iron_dome') {
    buildIronDome(root, rig, mats, vLevel, specialization);
  } else if (defId === 'helios_laser') {
    buildHeliosLaser(root, rig, mats, vLevel, specialization);
  } else if (defId === 'tos1_mlrs') {
    buildTos1Mlrs(root, rig, mats, vLevel, specialization);
  } else if (defId === 'ballista') {
    buildBallista(root, rig, mats, vLevel, specialization);
  } else if (defId === 'sniper_tower') {
    buildSniperTower(root, rig, mats, vLevel, specialization);
  } else if (defId === 'cryo_tower') {
    buildCryoTower(root, rig, mats, vLevel, specialization);
  } else if (defId === 'tesla_tower') {
    buildTeslaTower(root, rig, mats, vLevel, specialization);
  } else if (defId === 'toxic_tower') {
    buildToxicTower(root, rig, mats, vLevel, specialization);
  } else if (defId === 'flamethrower') {
    buildFlamethrower(root, rig, mats, vLevel, specialization);
  } else if (defId === 'railgun') {
    buildRailgun(root, rig, mats, vLevel, specialization);
  } else if (defId === 'harpoon_tower') {
    buildHarpoonTower(root, rig, mats, vLevel, specialization);
  } else if (defId === 'minefield') {
    buildMinefieldLayer(root, rig, mats, vLevel, specialization);
  } else if (defId === 'eng_workshop') {
    buildEngWorkshop(root, rig, mats, vLevel, specialization);
  } else if (defId === 'energy_extractor') {
    buildEnergyExtractor(root, rig, mats, vLevel, specialization);
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
// HERO TOWERS (Fase 2 Vertical Slice — 5 towers preserved in-place)
// ============================================================================

function buildPhalanx(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
) {
  const batcher = new StaticMeshBatcher('phalanx', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.85, 0.42));

  // Base cylinder & diamond deck (footprint strictly <= 1.76u for ownerRingMesh clearance)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.52, 1.62, 0.22, 12, 0.04), 0, 0.11, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.3, 1.36, 0.16, 12, 0.03), 0, 0.29, 0);

  if (level >= 3) {
    const stabArmGeo = getChamferedBoxGeo(0.24, 0.16, 0.68, 0.025);
    const stabPadGeo = getChamferedCylinderGeo(0.16, 0.18, 0.12, 6, 0.02);
    for (const a of [0.78, 2.35, 3.92, 5.49]) {
      batcher.add('root', 'concreteDark', stabArmGeo, Math.sin(a) * 1.32, 0.18, Math.cos(a) * 1.32, 0, a, 0);
      batcher.add('root', 'concreteDark', stabPadGeo, Math.sin(a) * 1.56, 0.06, Math.cos(a) * 1.56);
    }
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.37, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Smooth 20-seg turntable & beveled elevation cradles in satin navalGray
  batcher.add('turret', 'navalGray', getChamferedCylinderGeo(0.84, 0.94, 0.28, 20, 0.04), 0, 0.14, 0);
  batcher.add('turret', 'navalGray', getChamferedBoxGeo(0.24, 0.96, 0.68, 0.04), -0.58, 0.68, 0);
  batcher.add('turret', 'navalGray', getChamferedBoxGeo(0.24, 0.96, 0.68, 0.04), 0.58, 0.68, 0);

  // Lower 20mm ammo drum(s) + 5A macro armored bustle & twin external lateral rotary ammo drums
  if (specA) {
    batcher.add('turret', 'navalGray', getChamferedBoxGeo(0.96, 0.72, 0.56, 0.04), 0, 0.76, -0.56);
    batcher.add('turret', 'navalGray', getChamferedBoxGeo(1.02, 0.12, 0.58, 0.02), 0, 1.06, -0.56);
    const twinDrumGeo = getChamferedCylinderGeo(0.27, 0.27, 0.56, 10, 0.035);
    for (const sx of [-0.88, 0.88]) {
      batcher.add('turret', 'navalGray', twinDrumGeo, sx, 0.74, -0.02, 0, 0, Math.PI / 2);
    }
    batcher.add(
      'turret',
      'navalGray',
      getChamferedCylinderGeo(0.34, 0.34, 0.52, 10, 0.03),
      0,
      0.52,
      0.04,
      0,
      0,
      Math.PI / 2
    );
  } else {
    batcher.add(
      'turret',
      'navalGray',
      getChamferedCylinderGeo(0.42, 0.42, 0.56, 12, 0.035),
      0,
      0.54,
      0.04,
      0,
      0,
      Math.PI / 2
    );
  }

  // Smooth 24-seg R2-D2 beveled radome in satin dielectric navalWhite
  const domeScale = level >= 2 ? 1.08 : 1.0;
  const domeGeo = createLatheYGeo(
    [
      [0.01, 0.0],
      [0.44 * domeScale, 0.0],
      [0.46 * domeScale, 0.72 * domeScale],
      [0.36 * domeScale, 1.04 * domeScale],
      [0.01, 1.22 * domeScale]
    ],
    24
  );
  batcher.add('turret', 'navalWhite', domeGeo, 0, 0.96, -0.02);

  // Smooth 24-seg metallic radome seam rings (batched into navalGray -> zero steel draw call!)
  const seamRingTop = getGeo(
    `phalanx_seam_top_v2:${domeScale.toFixed(2)}`,
    () => new THREE.TorusGeometry(0.456 * domeScale, 0.024, 3, 24)
  );
  const seamRingBot = getGeo(
    `phalanx_seam_bot_v2:${domeScale.toFixed(2)}`,
    () => new THREE.TorusGeometry(0.458 * domeScale, 0.022, 3, 24)
  );
  batcher.add('turret', 'navalGray', seamRingTop, 0, 1.56, -0.02, Math.PI / 2, 0, 0);
  batcher.add('turret', 'navalGray', seamRingBot, 0, 1.12, -0.02, Math.PI / 2, 0, 0);

  // Unified sensor optic key per variant (zero extra emissive material batches)
  const opticMat: StructuralMatKey = specB ? 'specTrimB' : 'specTrimA';

  // Lv2+ right FLIR optical module
  if (level >= 2) {
    batcher.add('turret', 'navalGray', getChamferedBoxGeo(0.32, 0.14, 0.24, 0.02), 0.62, 1.05, 0.22);
    batcher.add('turret', 'navalWhite', getChamferedBoxGeo(0.26, 0.38, 0.36, 0.03), 0.74, 1.22, 0.28);
    batcher.add(
      'turret',
      opticMat,
      getChamferedCylinderGeo(0.085, 0.085, 0.06, 8, 0.01),
      0.74,
      1.24,
      0.47,
      Math.PI / 2,
      0,
      0
    );
  }

  // Lv3+ left tracking radar pod
  if (level >= 3) {
    batcher.add('turret', 'navalGray', getChamferedBoxGeo(0.34, 0.44, 0.62, 0.03), -0.78, 1.15, 0.15);
    batcher.add(
      'turret',
      'navalGray',
      getChamferedCylinderGeo(0.14, 0.16, 0.34, 8, 0.02),
      -0.78,
      1.15,
      0.54,
      Math.PI / 2,
      0,
      0
    );
    batcher.add(
      'turret',
      opticMat,
      getChamferedCylinderGeo(0.09, 0.09, 0.05, 8, 0.01),
      -0.78,
      1.15,
      0.72,
      Math.PI / 2,
      0,
      0
    );
  }

  const pivots: Record<string, THREE.Object3D> = { root, turret: turretPivot };

  // Macro 5A vs 6B silhouette differentiation (legible at 90-140u)
  if (specA) {
    // 5A: Wide dual-lens dorsal E/O sensor hood
    batcher.add('turret', 'navalWhite', getChamferedBoxGeo(0.68, 0.28, 0.52, 0.04), 0, 2.28, 0.04);
    for (const lx of [-0.17, 0.17]) {
      batcher.add(
        'turret',
        'specTrimA',
        getChamferedCylinderGeo(0.09, 0.09, 0.06, 8, 0.01),
        lx,
        2.29,
        0.31,
        Math.PI / 2,
        0,
        0
      );
    }
  } else if (specB) {
    // 6B: Tall rotating Doppler radar T-bar atop radome + 2 winged lateral proximity micro-missile pods
    const dopplerPivot = new THREE.Group();
    dopplerPivot.position.set(0, 2.24, -0.02);
    turretPivot.add(dopplerPivot);
    rig.radarPivots = [dopplerPivot];
    pivots.radar_0 = dopplerPivot;

    batcher.add('radar_0', 'navalWhite', getChamferedCylinderGeo(0.075, 0.095, 0.32, 8, 0.015), 0, 0.16, 0);
    batcher.add('radar_0', 'navalWhite', getChamferedBoxGeo(1.42, 0.22, 0.18, 0.03), 0, 0.36, 0);

    for (const sx of [-1, 1]) {
      // Wing pylon + sleek lateral proximity pod on shoulder
      batcher.add(
        'turret',
        'navalGray',
        getChamferedBoxGeo(0.54, 0.1, 0.38, 0.02),
        sx * 0.68,
        1.52,
        0.04,
        0,
        0,
        sx * 0.22
      );
      batcher.add('turret', 'navalWhite', getChamferedBoxGeo(0.32, 0.36, 0.78, 0.04), sx * 0.98, 1.6, 0.08);
      batcher.add('turret', 'specTrimB', getChamferedBoxGeo(0.22, 0.24, 0.12, 0.02), sx * 0.98, 1.6, 0.5);
    }
  }

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.9, 0.28);
  barrelPivot.rotation.x = -0.18;
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  const gatlingPivot = new THREE.Group();
  gatlingPivot.position.set(0, 0, 0.22);
  barrelPivot.add(gatlingPivot);
  rig.gatlingPivot = gatlingPivot;
  pivots.gatling = gatlingPivot;

  // Cylindrical rotary breech + 6 gatling barrels + chamfered cooling clamps (always 1 gunmetal mesh)
  batcher.add(
    'gatling',
    'gunmetal',
    getChamferedCylinderGeo(0.21, 0.23, 0.48, 10, 0.025),
    0,
    0,
    -0.06,
    Math.PI / 2,
    0,
    0
  );

  const bLen = specB ? 1.88 : level >= 2 ? 1.5 : 1.28;
  const bRad = specA ? 0.034 : level >= 2 ? 0.026 : 0.022;
  const ringR = level >= 2 ? 0.115 : 0.095;
  const barrelRodGeo = getGeo(
    `phalanx_rod:${bRad.toFixed(4)}:${bLen.toFixed(4)}`,
    () => new THREE.CylinderGeometry(bRad, bRad, bLen, 6)
  );
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    batcher.add(
      'gatling',
      'gunmetal',
      barrelRodGeo,
      Math.cos(a) * ringR,
      Math.sin(a) * ringR,
      bLen * 0.5 + 0.1,
      Math.PI / 2,
      0,
      0
    );
  }
  batcher.add(
    'gatling',
    'gunmetal',
    getChamferedCylinderGeo(ringR + 0.044, ringR + 0.044, 0.08, 8, 0.015),
    0,
    0,
    bLen * 0.45 + 0.1,
    Math.PI / 2,
    0,
    0
  );
  batcher.add(
    'gatling',
    'gunmetal',
    getChamferedCylinderGeo(ringR + 0.05, ringR + 0.05, 0.1, 8, 0.018),
    0,
    0,
    bLen * 0.9 + 0.1,
    Math.PI / 2,
    0,
    0
  );

  if (specA) {
    // 5A thick heavy flak muzzle suppressor & barrel shroud
    batcher.add(
      'gatling',
      'gunmetal',
      getChamferedCylinderGeo(ringR + 0.09, ringR + 0.095, 0.5, 10, 0.025),
      0,
      0,
      bLen * 0.78 + 0.1,
      Math.PI / 2,
      0,
      0
    );
  } else if (specB) {
    // 6B prominent proximity-fuze induction muzzle sleeve in gunmetal (zero extra draw call)
    batcher.add(
      'gatling',
      'gunmetal',
      getChamferedCylinderGeo(ringR + 0.068, ringR + 0.068, 0.18, 10, 0.02),
      0,
      0,
      bLen * 0.8 + 0.1,
      Math.PI / 2,
      0,
      0
    );
  }

  batcher.flush(pivots, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, bLen + 0.36);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, bLen + 0.42, 0.9);
}

function buildHowitzer(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
) {
  const batcher = new StaticMeshBatcher('howitzer', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.92, 0.42));

  if (level === 1) {
    batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.66, 1.76, 0.16, 8, 0.03), 0, 0.08, 0);
    batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.06, 1.16, 0.08, 12, 0.02), 0, 0.18, 0);

    const bagGeo = getRoundedBoxGeo(0.54, 0.22, 0.32, 0.06, 1);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      batcher.add(
        'root',
        'sandbag',
        bagGeo,
        Math.sin(a) * 1.48,
        0.22,
        Math.cos(a) * 1.48,
        0,
        a,
        (i % 2 === 0 ? 1 : -1) * 0.035
      );
    }
    for (let i = 0; i < 4; i++) {
      const a = -0.66 + i * 0.44;
      batcher.add('root', 'sandbag', bagGeo, Math.sin(a) * 1.46, 0.41, Math.cos(a) * 1.46, 0, a, 0.02);
    }

    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 0.2, 0);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;

    for (const [ang, len] of [
      [-0.55, 1.32],
      [0.55, 1.32],
      [-2.5, 1.02],
      [2.5, 1.02]
    ]) {
      batcher.add(
        'turret',
        'oliveDark',
        getChamferedBoxGeo(0.16, 0.14, len, 0.025),
        Math.sin(ang) * (len * 0.56),
        0.2,
        -Math.cos(ang) * (len * 0.56),
        0,
        -ang,
        0
      );
      batcher.add(
        'turret',
        'oliveDark',
        getChamferedBoxGeo(0.34, 0.22, 0.22, 0.03),
        Math.sin(ang) * (len * 1.1),
        0.12,
        -Math.cos(ang) * (len * 1.1),
        0,
        -ang,
        0
      );
    }

    batcher.add('turret', 'olive', getChamferedCylinderGeo(0.54, 0.62, 0.3, 8, 0.04), 0, 0.24, 0);
    batcher.add('turret', 'olive', getChamferedBoxGeo(0.18, 0.6, 0.46, 0.025), -0.34, 0.62, 0.04);
    batcher.add('turret', 'olive', getChamferedBoxGeo(0.18, 0.6, 0.46, 0.025), 0.34, 0.62, 0.04);
    batcher.add('turret', 'olive', getChamferedBoxGeo(0.46, 0.66, 0.09, 0.02), 0, 0.68, 0.36, -0.24, 0, 0);
    batcher.add('turret', 'olive', getChamferedBoxGeo(0.4, 0.62, 0.09, 0.02), -0.38, 0.67, 0.3, -0.24, -0.22, 0);
    batcher.add('turret', 'olive', getChamferedBoxGeo(0.4, 0.62, 0.09, 0.02), 0.38, 0.67, 0.3, -0.24, 0.22, 0);

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.74, 0.12);
    barrelPivot.rotation.x = -0.68;
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    batcher.add('barrel', 'gunmetal', getRoundedBoxGeo(0.38, 0.36, 0.82, 0.04, 1), 0, 0, -0.2);
    batcher.add(
      'barrel',
      'gunmetal',
      getChamferedCylinderGeo(0.075, 0.075, 0.94, 10, 0.015),
      -0.16,
      0.14,
      0.25,
      Math.PI / 2,
      0,
      0
    );
    batcher.add(
      'barrel',
      'gunmetal',
      getChamferedCylinderGeo(0.075, 0.075, 0.94, 10, 0.015),
      0.16,
      0.14,
      0.25,
      Math.PI / 2,
      0,
      0
    );
    batcher.add(
      'barrel',
      'gunmetal',
      getChamferedCylinderGeo(0.175, 0.175, 0.22, 10, 0.02),
      0,
      0,
      1.05,
      Math.PI / 2,
      0,
      0
    );

    const m777BarrelGeo = createLatheAlongZGeo(
      [
        [0.145, 0.15],
        [0.145, 0.95],
        [0.105, 0.98],
        [0.105, 2.38],
        [0.178, 2.42],
        [0.178, 2.66],
        [0.08, 2.7]
      ],
      12
    );
    batcher.add('barrel', 'gunmetal', m777BarrelGeo);

    batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 2.74);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 2.85, 1.65);
  } else if (level === 2) {
    // Compact chamfered slab (corners <= 1.63u for ownerRingMesh clearance)
    batcher.add('root', 'concreteDark', getCutCornerSlabGeo(2.48, 0.18, 2.92, 0.52, 0.03), 0, 0.03, 0);

    const trackGeo = getRoundedBoxGeo(0.42, 0.42, 2.6, 0.11, 1);
    const roadWheelGeo = getChamferedCylinderGeo(0.18, 0.18, 0.45, 8, 0.025);
    for (const sx of [-0.96, 0.96]) {
      batcher.add('root', 'tracks', trackGeo, sx, 0.33, 0);
      for (let w = 0; w < 6; w++) {
        batcher.add('root', 'tracks', roadWheelGeo, sx, 0.23, 1.0 - w * 0.4, 0, 0, Math.PI / 2);
      }
    }

    batcher.add('root', 'desertArmor', getRoundedBoxGeo(1.66, 0.44, 2.52, 0.06, 2), 0, 0.46, 0);
    batcher.add('root', 'desertArmor', getChamferedBoxGeo(1.54, 0.22, 0.52, 0.03), 0, 0.54, 1.18, 0.28, 0, 0);
    for (const sx of [-0.62, 0.62]) {
      batcher.add('root', 'desertArmor', getChamferedBoxGeo(0.26, 0.22, 0.36, 0.03), sx, 0.22, -1.34);
    }

    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 0.72, -0.15);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;

    const paladinTurretGeo = createSideExtrudeGeo(
      [
        [-1.32, 0.0],
        [0.82, 0.0],
        [0.98, 0.38],
        [0.54, 0.94],
        [-1.24, 0.94],
        [-1.38, 0.46]
      ],
      1.84,
      0.05,
      0.05
    );
    batcher.add('turret', 'desertArmor', paladinTurretGeo);
    batcher.add('turret', 'desertArmor', getChamferedCylinderGeo(0.3, 0.34, 0.18, 10, 0.03), -0.46, 1.02, 0.16);
    for (const sx of [-0.96, 0.96]) {
      batcher.add('turret', 'desertArmor', getChamferedBoxGeo(0.16, 0.38, 0.92, 0.03), sx, 0.58, -0.35);
    }

    const shellGeo = getChamferedCylinderGeo(0.058, 0.058, 0.42, 8, 0.012);
    for (let i = -2; i <= 2; i++) {
      batcher.add('turret', 'brass', shellGeo, i * 0.22, 1.02, -1.02, Math.PI / 2, 0, 0);
    }

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.48, 0.84);
    barrelPivot.rotation.x = -0.62;
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    batcher.add('barrel', 'gunmetal', getRoundedBoxGeo(0.5, 0.42, 0.54, 0.05, 1), 0, 0, 0.14);
    const l39Geo = createLatheAlongZGeo(
      [
        [0.16, 0.2],
        [0.16, 0.72],
        [0.11, 0.75],
        [0.11, 1.32],
        [0.158, 1.38],
        [0.158, 1.72],
        [0.105, 1.78],
        [0.105, 2.55],
        [0.182, 2.6],
        [0.182, 2.86],
        [0.085, 2.9]
      ],
      12
    );
    batcher.add('barrel', 'gunmetal', l39Geo);

    batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0, 2.94);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, 3.05, 1.8);
  } else {
    // Compact chamfered pad 2.64x3.26 (corner <= 1.74u) & chassis/wheels inside [-1.18..+1.04]
    batcher.add('root', 'concreteDark', getCutCornerSlabGeo(2.64, 0.14, 3.26, 0.72, 0.03), 0, 0.03, 0);

    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 0.14, 0);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;

    batcher.add('turret', 'darkSteel', getChamferedBoxGeo(1.24, 0.32, 2.54, 0.04), 0, 0.5, -0.06);
    const tireGeo = getChamferedCylinderGeo(0.33, 0.33, 0.28, 10, 0.045);
    const hubGeo = getChamferedCylinderGeo(0.16, 0.16, 0.32, 8, 0.02);
    for (const wz of [1.0, -0.36, -1.12]) {
      batcher.add('turret', 'tire', tireGeo, -0.76, 0.33, wz, 0, 0, Math.PI / 2);
      batcher.add('turret', 'tire', tireGeo, 0.76, 0.33, wz, 0, 0, Math.PI / 2);
      batcher.add('turret', 'desertArmor', hubGeo, -0.76, 0.33, wz, 0, 0, Math.PI / 2);
      batcher.add('turret', 'desertArmor', hubGeo, 0.76, 0.33, wz, 0, 0, Math.PI / 2);
    }

    const cabGeo = createSideExtrudeGeo(
      [
        [0.44, 0.58],
        [1.36, 0.58],
        [1.42, 1.08],
        [1.18, 1.56],
        [0.44, 1.56]
      ],
      1.5,
      0.04,
      0.04
    );
    batcher.add('turret', 'desertArmor', cabGeo);
    batcher.add('turret', 'desertArmor', getChamferedBoxGeo(1.56, 0.12, 1.72, 0.03), 0, 0.68, -0.58);
    batcher.add('turret', 'darkSteel', getChamferedBoxGeo(1.24, 0.32, 0.09, 0.02), 0, 1.26, 1.36, -0.35, 0, 0);
    batcher.add('turret', 'darkSteel', getChamferedBoxGeo(1.52, 0.16, 0.14, 0.025), 0, 0.54, 1.44);

    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 1.0, -0.68);
    barrelPivot.rotation.x = -0.76;
    turretPivot.add(barrelPivot);
    rig.barrelPivot = barrelPivot;

    batcher.add('barrel', 'oliveDark', getChamferedBoxGeo(1.22, 0.84, 1.84, 0.045), 0, 0.4, 0.16);
    const tubeGeo = getChamferedCylinderGeo(0.135, 0.135, 1.88, 8, 0.015);
    const capPositions: [number, number, number][] = [];
    for (const rx of [-0.35, 0, 0.35]) {
      for (const ry of [0.22, 0.56]) {
        batcher.add('barrel', 'oliveDark', tubeGeo, rx, ry, 0.18, Math.PI / 2, 0, 0);
        capPositions.push([rx, ry, 1.12]);
      }
    }

    const batchedCaps = createBatchedMissileCapsMesh(
      `howitzer:${level}:${specialization ?? 'none'}:barrel_missileCaps`,
      capPositions,
      0.11,
      mats.navalWhite,
      1.0,
      12
    );
    barrelPivot.add(batchedCaps);
    rig.missileCaps = [batchedCaps];

    if (specA) {
      // 5A: Thermobaric pressurized flank tanks + steel straps + thermal deflector shield + subtle amber bands
      batcher.add('turret', 'desertArmor', getChamferedBoxGeo(1.56, 0.48, 0.1, 0.025), 0, 1.0, 0.34);
      const tankGeo = getChamferedCylinderGeo(0.17, 0.17, 1.12, 10, 0.035);
      const strapGeo = getChamferedBoxGeo(0.38, 0.36, 0.08, 0.015);
      for (const sx of [-0.78, 0.78]) {
        batcher.add('turret', 'darkSteel', tankGeo, sx, 0.9, -0.58, Math.PI / 2, 0, 0);
        batcher.add('turret', 'desertArmor', strapGeo, sx, 0.9, -0.3);
        batcher.add('turret', 'desertArmor', strapGeo, sx, 0.9, -0.86);
        batcher.add(
          'turret',
          'specTrimB',
          getChamferedCylinderGeo(0.18, 0.18, 0.07, 10, 0.01),
          sx,
          0.9,
          -0.06,
          Math.PI / 2,
          0,
          0
        );
      }
    } else if (specB) {
      // 6B: Dual lateral cluster sub-munition pods + fuse antenna + telemetry dome
      batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.17, 0.21, 0.2, 10, 0.03), 0.34, 1.66, 0.88);
      batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.025, 0.035, 0.78, 6, 0.005), -0.52, 1.94, 0.72);
      batcher.add('turret', 'specTrimA', getChamferedCylinderGeo(0.1, 0.12, 0.08, 10, 0.015), 0.34, 1.78, 0.88);
      for (const sx of [-0.8, 0.8]) {
        batcher.add('barrel', 'oliveDark', getChamferedBoxGeo(0.36, 0.52, 1.48, 0.04), sx, 0.4, 0.12);
        batcher.add('barrel', 'oliveDark', getChamferedBoxGeo(0.32, 0.44, 0.12, 0.02), sx, 0.4, 0.88);
      }
    }

    batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0.4, 1.24);
    barrelPivot.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.4, 1.32, 1.7);
  }
}

function buildPatriot(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
) {
  const batcher = new StaticMeshBatcher('patriot', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.94, 0.44));

  // Chamfered octagonal base (r <= 1.78u) + outriggers ending strictly <= 1.76u for ownerRingMesh clearance
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.7, 1.78, 0.2, 8, 0.04), 0, 0.1, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.42, 1.48, 0.12, 8, 0.03), 0, 0.26, 0);

  const outriggerArm = getChamferedBoxGeo(0.24, 0.18, 0.72, 0.03);
  const outriggerPad = getChamferedCylinderGeo(0.18, 0.2, 0.12, 8, 0.025);
  for (const ang of [0.78, 2.35, 3.92, 5.49]) {
    batcher.add('root', 'concreteDark', outriggerArm, Math.sin(ang) * 1.24, 0.18, Math.cos(ang) * 1.24, 0, ang, 0);
    batcher.add('root', 'concreteDark', outriggerPad, Math.sin(ang) * 1.56, 0.06, Math.cos(ang) * 1.56);
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.34, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  batcher.add('turret', 'desertArmor', getChamferedCylinderGeo(0.88, 0.96, 0.28, 12, 0.04), 0, 0.14, 0);
  batcher.add('turret', 'desertArmor', getChamferedBoxGeo(1.42, 0.3, 1.66, 0.04), 0, 0.42, 0);
  batcher.add('turret', 'desertArmor', getChamferedBoxGeo(0.76, 0.5, 0.48, 0.04), 0, 0.56, -1.04);

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

  const canisterGeo = getChamferedBoxGeo(0.38, 0.38, 2.28, 0.035);
  const collarGeo = getChamferedBoxGeo(0.41, 0.41, 0.16, 0.025);
  const warheadLenScale = specA ? 1.65 : 1.0;

  const capPositions: [number, number, number][] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const tx = startX + c * cellSpX;
      const ty = startY + r * cellSpY;
      batcher.add('rack', 'olive', canisterGeo, tx, ty, 0.15);
      batcher.add('rack', 'darkSteel', collarGeo, tx, ty, 1.24);
      capPositions.push([tx, ty, 1.24]);
    }
  }

  // Batched 14-seg missileCaps mesh (noShadow = true -> 1 draw call instead of 8..24!)
  const batchedCaps = createBatchedMissileCapsMesh(
    `patriot:${level}:${specialization ?? 'none'}:rack_missileCaps`,
    capPositions,
    0.125,
    mats.navalWhite,
    warheadLenScale,
    14
  );
  rackGroup.add(batchedCaps);
  rig.missileCaps = [batchedCaps];

  // 6B: Dual flank micro-missile swarm pods + reinforced gantry portal arch
  if (specB) {
    const podGeo = getChamferedBoxGeo(0.44, 0.68, 1.62, 0.045);
    const microCapGeo = getChamferedBoxGeo(0.36, 0.58, 0.12, 0.02);
    for (const sx of [-1.14, 1.14]) {
      batcher.add('rack', 'olive', podGeo, sx, 0.52, 0.12);
      batcher.add('rack', 'darkSteel', microCapGeo, sx, 0.52, 0.94);
    }
    batcher.add('rack', 'darkSteel', getChamferedBoxGeo(0.14, 1.25, 0.22, 0.02), -0.94, 0.62, 0.45);
    batcher.add('rack', 'darkSteel', getChamferedBoxGeo(0.14, 1.25, 0.22, 0.02), 0.94, 0.62, 0.45);
    batcher.add('rack', 'darkSteel', getChamferedBoxGeo(2.04, 0.16, 0.24, 0.025), 0, 1.26, 0.45);
  }

  const pivots: Record<string, THREE.Object3D> = {
    root,
    turret: turretPivot,
    rack: rackGroup
  };

  if (level >= 2) {
    const radarMount = new THREE.Group();
    radarMount.position.set(0, 1.35, -0.78);
    turretPivot.add(radarMount);

    // Enlarged long-range AESA fairing & collar batched inside turret for 5A
    if (specA) {
      batcher.add('turret', 'desertArmor', getChamferedBoxGeo(1.48, 1.12, 0.28, 0.045), 0, 1.64, -0.78, -0.38, 0, 0);
      batcher.add('turret', 'specTrimA', getChamferedBoxGeo(1.2, 0.92, 0.06, 0.02), 0, 1.64, -0.64, -0.38, 0, 0);
    } else {
      batcher.add('turret', 'desertArmor', getChamferedBoxGeo(1.18, 0.96, 0.24, 0.04), 0, 1.61, -0.78, -0.38, 0, 0);
    }

    const panel = new THREE.Mesh(
      getChamferedBoxGeo(specA ? 1.08 : 0.96, specA ? 0.82 : 0.78, 0.08, 0.02),
      mats.copperAesa
    );
    panel.position.set(0, specA ? 0.29 : 0.26, 0.16);
    panel.rotation.x = -0.38;
    panel.userData.noShadow = true;
    radarMount.add(panel);
    rig.aesaPanel = panel;

    if (level === 3) {
      rig.radarPivots = [];
      const sides = [-0.78, 0.78];
      for (let i = 0; i < sides.length; i++) {
        const sx = sides[i];
        const arm = new THREE.Group();
        arm.position.set(sx, 1.0, -0.72);
        turretPivot.add(arm);
        rig.radarPivots.push(arm);
        const rKey = `radar_${i}`;
        pivots[rKey] = arm;
        batcher.add(rKey, 'darkSteel', getChamferedCylinderGeo(0.06, 0.08, 0.45, 6, 0.015), 0, 0.22, 0);
        batcher.add(rKey, 'darkSteel', getChamferedBoxGeo(0.36, 0.24, 0.1, 0.02), 0, 0.46, 0);
      }
    }
  }

  batcher.flush(pivots, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.55, 1.48);
  rackGroup.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(rackGroup, mats, 0, 0.55, 1.56, 1.4, true);
}

function buildEwCrew(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
) {
  const batcher = new StaticMeshBatcher('ew_crew', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.85, 0.4));

  // Utility C4ISR base + command shelter + AC cooling louvers + rear tactical generator (NO weapon barrels)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.54, 1.66, 0.22, 8, 0.04), 0, 0.11, 0);

  batcher.add('root', 'oliveDark', getRoundedBoxGeo(1.56, 0.72, 1.56, 0.05, 1), 0, 0.64, 0);
  batcher.add('root', 'oliveDark', getChamferedBoxGeo(0.64, 0.44, 0.42, 0.04), 0, 0.5, -0.94);
  batcher.add('root', 'oliveDark', getChamferedBoxGeo(0.42, 0.36, 0.28, 0.03), 0.78, 0.64, -0.2);

  batcher.add('root', 'steel', getChamferedBoxGeo(0.32, 0.28, 0.08, 0.015), -0.52, 0.6, 0.8);
  batcher.add('root', 'steel', getChamferedBoxGeo(0.12, 0.26, 0.24, 0.015), 0.96, 0.64, -0.2);
  batcher.add('root', 'steel', getChamferedCylinderGeo(0.14, 0.24, 1.5, 8, 0.025), 0, 1.74, 0);
  for (const h of [1.34, 1.84, 2.32]) {
    batcher.add('root', 'steel', getChamferedBoxGeo(0.62, 0.06, 0.62, 0.015), 0, h, 0);
  }

  // Thin tactical visor bar on shelter (<= 2% emissive area)
  const visorMat: StructuralMatKey = specB ? 'specTrimB' : 'specTrimA';
  batcher.add('root', visorMat, getChamferedBoxGeo(1.02, 0.09, 0.06, 0.01), 0, 0.84, 0.8);

  const pivots: Record<string, THREE.Object3D> = { root };
  rig.radarPivots = [];

  // Closed solid parabolic dish profile (zero back-face culling + crisp ghost silhouette)
  const solidDishGeo = createLatheYGeo(
    [
      [0.001, -0.05],
      [0.22, -0.04],
      [0.44, 0.16],
      [0.46, 0.22],
      [0.42, 0.23],
      [0.3, 0.1],
      [0.001, 0.03]
    ],
    16
  );

  if (level === 1) {
    const feedGeo = getChamferedCylinderGeo(0.028, 0.038, 0.3, 6, 0.006);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const pivot = new THREE.Group();
      pivot.position.set(Math.sin(a) * 0.56, 1.82 + i * 0.28, Math.cos(a) * 0.56);
      root.add(pivot);
      rig.radarPivots.push(pivot);

      const rKey = `radar_${i}`;
      pivots[rKey] = pivot;
      batcher.add(rKey, 'steel', solidDishGeo, 0, 0, 0, Math.PI / 2 - 0.3, 0, 0);
      batcher.add(rKey, 'steel', feedGeo, 0, 0.07, 0.2, Math.PI / 2 - 0.3, 0, 0);
    }
  } else if (level === 2) {
    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 2.15, 0);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;
    pivots.turret = turretPivot;

    const panelGeo = getChamferedBoxGeo(0.52, 0.38, 0.12, 0.025);
    // Front/back EW arrays batched inside turretPivot + 2 opposing scanning side radarPivots
    batcher.add('turret', 'copperAesa', panelGeo, 0, 0.15, 0.52, -0.22, 0, 0);
    batcher.add('turret', 'copperAesa', panelGeo, 0, 0.15, -0.52, -0.22, Math.PI, 0);
    for (let i = 0; i < 2; i++) {
      const sx = i === 0 ? -0.52 : 0.52;
      const dishPivot = new THREE.Group();
      dishPivot.position.set(sx, 0.15, 0);
      dishPivot.rotation.y = i === 0 ? -Math.PI / 2 : Math.PI / 2;
      turretPivot.add(dishPivot);
      rig.radarPivots.push(dishPivot);

      const rKey = `radar_${i}`;
      pivots[rKey] = dishPivot;
      batcher.add(rKey, 'copperAesa', panelGeo, 0, 0, 0, -0.22, 0, 0);
    }

    const whipGeo = getChamferedCylinderGeo(0.022, 0.032, 1.25, 6, 0.005);
    for (const [ax, az] of [
      [-0.48, -0.48],
      [0.48, -0.48],
      [-0.48, 0.48],
      [0.48, 0.48]
    ]) {
      batcher.add('root', 'steel', whipGeo, ax, 2.15, az);
    }
  } else {
    // Lv4+ / 5A / 6B: Copper EW column + rotating turretPivot + specialization hardware
    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 2.05, 0);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;
    pivots.turret = turretPivot;

    batcher.add('turret', 'copperAesa', getChamferedCylinderGeo(0.12, 0.18, 1.9, 10, 0.02), 0, 0.27, 0);
    for (let i = 0; i < 4; i++) {
      const coilGeo = getGeo(`ew_choke_${i}`, () => new THREE.TorusGeometry(0.26 - i * 0.02, 0.026, 4, 14));
      batcher.add('turret', 'copperAesa', coilGeo, 0, -0.17 + i * 0.3, 0, Math.PI / 2, 0, 0);
    }

    if (specA) {
      // 5A: Wide rotating AWACS / S-band radar bar atop mast + twin lateral long-range masts
      for (const sx of [-0.78, 0.78]) {
        batcher.add('root', 'steel', getChamferedCylinderGeo(0.04, 0.06, 1.45, 6, 0.01), sx, 1.85, -0.15);
        batcher.add('root', 'steel', getChamferedCylinderGeo(0.1, 0.12, 0.22, 8, 0.02), sx, 2.62, -0.15);
      }

      const barPivot = new THREE.Group();
      barPivot.position.set(0, 1.42, 0);
      turretPivot.add(barPivot);
      rig.radarPivots.push(barPivot);
      pivots.radar_0 = barPivot;

      batcher.add('radar_0', 'navalWhite', getRoundedBoxGeo(1.78, 0.34, 0.28, 0.05, 1), 0, 0, 0);
      batcher.add('radar_0', 'specTrimA', getChamferedBoxGeo(1.56, 0.07, 0.3, 0.01), 0, 0, 0);

      for (let i = 0; i < 2; i++) {
        const sx = i === 0 ? -0.68 : 0.68;
        const p = new THREE.Group();
        p.position.set(sx, 0.1, 0);
        p.rotation.y = i === 0 ? -Math.PI / 2 : Math.PI / 2;
        turretPivot.add(p);
        rig.radarPivots.push(p);
        const rKey = `radar_${i + 1}`;
        pivots[rKey] = p;
        batcher.add(rKey, 'steel', getChamferedBoxGeo(0.46, 0.34, 0.09, 0.02), 0, 0, 0, -0.35, 0, 0);
      }
    } else if (specB) {
      // 6B: Rotating electro-optical/thermal laser designator pod + 2 solid tilted uplink dishes + amber accent
      const podPivot = new THREE.Group();
      podPivot.position.set(0, 1.38, 0);
      turretPivot.add(podPivot);
      rig.radarPivots.push(podPivot);
      pivots.radar_0 = podPivot;

      batcher.add('radar_0', 'darkSteel', getChamferedBoxGeo(0.56, 0.42, 0.56, 0.045), 0, 0, 0);
      batcher.add('radar_0', 'specTrimB', getChamferedCylinderGeo(0.095, 0.095, 0.08, 8, 0.01), -0.14, 0, 0.28, Math.PI / 2, 0, 0);
      batcher.add('radar_0', 'specTrimB', getChamferedCylinderGeo(0.095, 0.095, 0.08, 8, 0.01), 0.14, 0, 0.28, Math.PI / 2, 0, 0);

      const uplinkFeedGeo = getChamferedCylinderGeo(0.025, 0.035, 0.28, 6, 0.005);
      for (let i = 0; i < 2; i++) {
        const sx = i === 0 ? -0.72 : 0.72;
        const p = new THREE.Group();
        p.position.set(sx, 0.15, 0);
        p.rotation.y = i === 0 ? -Math.PI / 2 : Math.PI / 2;
        turretPivot.add(p);
        rig.radarPivots.push(p);
        const rKey = `radar_${i + 1}`;
        pivots[rKey] = p;
        batcher.add(rKey, 'steel', solidDishGeo, 0, 0, 0, Math.PI / 2 - 0.35, 0, 0);
        batcher.add(rKey, 'steel', uplinkFeedGeo, 0, 0.08, 0.18, Math.PI / 2 - 0.35, 0, 0);
      }
    } else {
      // Lv4+ baseline: 2 turret EW panels + 2 opposing scanning side EW panels
      const panelGeo = getChamferedBoxGeo(0.54, 0.4, 0.1, 0.02);
      batcher.add('turret', 'steel', panelGeo, 0, 0.05, 0.7, -0.4, 0, 0);
      batcher.add('turret', 'steel', panelGeo, 0, 0.05, -0.7, -0.4, Math.PI, 0);
      for (let i = 0; i < 2; i++) {
        const sx = i === 0 ? -0.7 : 0.7;
        const p = new THREE.Group();
        p.position.set(sx, 0.05, 0);
        p.rotation.y = i === 0 ? -Math.PI / 2 : Math.PI / 2;
        turretPivot.add(p);
        rig.radarPivots.push(p);
        const rKey = `radar_${i}`;
        pivots[rKey] = p;
        batcher.add(rKey, 'steel', panelGeo, 0, 0, 0, -0.4, 0, 0);
      }
    }
  }

  batcher.flush(pivots, mats);

  // Smooth 36-seg ewRings positioned outside dishes & antennas (no collision with dishes in 6B)
  rig.ewRings = [];
  const ringConfigs: Array<{ r: number; y: number }> =
    level >= 2
      ? [
        { r: 1.18, y: 1.46 },
        { r: 1.42, y: 3.1 }
      ]
      : [{ r: 1.18, y: 1.46 }];
  for (let i = 0; i < ringConfigs.length; i++) {
    const cfg = ringConfigs[i];
    const ringGeo = getGeo(`ew_ring_v4_${i}`, () => new THREE.TorusGeometry(cfg.r, 0.028, 6, 36));
    const ring = new THREE.Mesh(ringGeo, mats.ewRingSubtle);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = cfg.y;
    ring.userData.noShadow = true;
    root.add(ring);
    rig.ewRings.push(ring);
  }
}

function buildTeslaTower(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
) {
  const batcher = new StaticMeshBatcher('tesla_tower', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.85, 0.44));

  // Octagonal concrete base & pedestal collar
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.62, 1.76, 0.24, 8, 0.04), 0, 0.12, 0);
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.26, 1.38, 0.16, 8, 0.03), 0, 0.3, 0);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.38, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Armored turntable + 4 angular steel buttresses
  batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(1.14, 1.24, 0.16, 8, 0.03), 0, 0.08, 0);
  const buttressGeo = getChamferedBoxGeo(0.2, 0.58, 0.46, 0.03);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    batcher.add(
      'turret',
      'darkSteel',
      buttressGeo,
      Math.sin(a) * 0.86,
      0.32,
      Math.cos(a) * 0.86,
      0,
      a,
      0
    );
  }

  // Side transformer/capacitor housings with cooling fins (2 at Lv1 -> 4 at Lv2+; 6B swaps to 2 mega-capacitors)
  const capAngles = specB ? [] : level === 1 ? [Math.PI * 0.5, Math.PI * 1.5] : [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
  const capBodyGeo = getChamferedBoxGeo(0.32, 0.54, 0.32, 0.04);
  const capFinGeo = getChamferedBoxGeo(0.38, 0.06, 0.38, 0.01);
  const capInsulGeo = getChamferedCylinderGeo(0.08, 0.1, 0.16, 6, 0.015);
  for (const a of capAngles) {
    const cx = Math.sin(a) * 0.96;
    const cz = Math.cos(a) * 0.96;
    batcher.add('turret', 'darkSteel', capBodyGeo, cx, 0.36, cz, 0, a, 0);
    batcher.add('turret', 'darkSteel', capFinGeo, cx, 0.4, cz, 0, a, 0);
    batcher.add('turret', 'navalWhite', capInsulGeo, cx, 0.7, cz);
  }

  // 6B: 2 armored cylindrical 16-seg mega-capacitors on flanks + heavy copper busbars + darkSteel collar clamps
  if (specB) {
    const megaGeo = getChamferedCylinderGeo(0.27, 0.29, 1.06, 16, 0.04);
    const busVertGeo = getGeo('tesla_6b_bus_v', () => new THREE.BoxGeometry(0.08, 0.58, 0.08));
    const clampGeo = getGeo('tesla_6b_clamp', () => new THREE.BoxGeometry(0.18, 0.14, 0.18));
    const collarBoxGeo = getGeo('tesla_6b_collar', () => new THREE.BoxGeometry(0.46, 0.07, 0.46));
    const busCrossGeo = getGeo('tesla_6b_bus_h', () => new THREE.BoxGeometry(2.04, 0.08, 0.08));
    for (const sx of [-1.18, 1.18]) {
      batcher.add('turret', 'darkSteel', megaGeo, sx, 0.58, 0);
      batcher.add('turret', 'navalWhite', getChamferedCylinderGeo(0.16, 0.2, 0.18, 6, 0.02), sx, 1.18, 0);
      batcher.add('turret', 'copperAesa', busVertGeo, sx * 0.85, 0.98, 0);
      batcher.add('turret', 'darkSteel', clampGeo, sx * 0.85, 1.24, 0);
      batcher.add('turret', 'specTrimB', collarBoxGeo, sx, 0.84, 0);
    }
    batcher.add('turret', 'copperAesa', busCrossGeo, 0, 1.24, 0);
    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.32, 0.34, 0.14, 12, 0.02), 0, 1.24, 0);
  }

  // Smooth 18-seg ribbed ceramic insulator column (grows taller Lv1 -> Lv2-3 -> Lv4+)
  const colH = level === 1 ? 1.55 : level === 2 ? 1.85 : 2.15;
  const shedCount = level === 1 ? 3 : level === 2 ? 4 : 5;
  const colProfile: [number, number][] = [[0.01, 0.0], [0.42, 0.0]];
  for (let i = 0; i < shedCount; i++) {
    const y0 = 0.14 + (i / shedCount) * (colH - 0.28);
    const yMid = y0 + (colH - 0.28) / (shedCount * 2);
    const rBase = 0.34 - (i / shedCount) * 0.09;
    colProfile.push([rBase * 0.72, y0], [rBase, yMid], [rBase * 0.72, yMid + 0.06]);
  }
  colProfile.push([0.24, colH], [0.01, colH]);
  batcher.add('turret', 'navalWhite', createLatheYGeo(colProfile, 18), 0, 0.16, 0);

  // Copper helical winding coils along upper column
  const coilCount = level === 1 ? 3 : level === 2 ? 4 : 5;
  for (let i = 0; i < coilCount; i++) {
    const coilR = 0.45 - i * 0.028;
    const coilGeo = getGeo(`tesla_coil_v5_${i}`, () => new THREE.TorusGeometry(coilR, 0.036, 3, 10));
    batcher.add('turret', 'copperAesa', coilGeo, 0, 0.62 + i * 0.26, 0, Math.PI / 2 + 0.06, 0, 0);
  }

  // 3 -> 4 external lightning arrestor pylons
  const pylonCount = level >= 3 ? 4 : 3;
  const pylonGeo = getChamferedCylinderGeo(0.038, 0.072, colH * 0.86, 6, 0.015);
  const tipMat: StructuralMatKey = specB ? 'specTrimB' : 'specTrimA';
  const tipGeo = getGeo('tesla_tip_cone', () => new THREE.ConeGeometry(0.048, 0.18, 4));
  for (let i = 0; i < pylonCount; i++) {
    const a = (i / pylonCount) * Math.PI * 2 + 0.35;
    const px = Math.sin(a) * 0.72;
    const pz = Math.cos(a) * 0.72;
    batcher.add('turret', 'darkSteel', pylonGeo, px, 0.18 + colH * 0.43, pz);
    batcher.add('turret', tipMat, tipGeo, px, 0.22 + colH * 0.86, pz);
  }

  // Top metallic crown + smooth 24-seg dark conductive toroid(s) + controlled <= 5% emissive discharge ring
  const topY = colH + 0.24;
  batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.28, 0.34, 0.18, 10, 0.025), 0, topY - 0.06, 0);

  const mainToroidGeo = getGeo('tesla_toroid_main_v4', () => new THREE.TorusGeometry(0.56, 0.105, 5, 24));
  batcher.add('turret', 'darkSteel', mainToroidGeo, 0, topY + 0.08, 0, Math.PI / 2, 0, 0);

  if (specB) {
    // 6B: Heavy double 24-seg toroid + amber overload collector ring
    const upperToroidGeo = getGeo('tesla_toroid_upper_v4', () => new THREE.TorusGeometry(0.46, 0.09, 5, 24));
    batcher.add('turret', 'darkSteel', upperToroidGeo, 0, topY + 0.3, 0, Math.PI / 2, 0, 0);
    const overloadRingGeo = getGeo('tesla_overload_ring_v4', () => new THREE.TorusGeometry(0.58, 0.028, 4, 24));
    batcher.add('turret', 'specTrimB', overloadRingGeo, 0, topY + 0.19, 0, Math.PI / 2, 0, 0);
  } else {
    // Subtle inner cyan discharge arc collar (<= 5% projected area)
    const arcRingGeo = getGeo('tesla_arc_ring_v4', () => new THREE.TorusGeometry(0.38, 0.024, 4, 24));
    batcher.add('turret', 'specTrimA', arcRingGeo, 0, topY + 0.12, 0, Math.PI / 2, 0, 0);
  }

  if (specA) {
    // 5A: Coaxial 3-phase star emitter arms computed via Quaternion().setFromUnitVectors(UP, dir)
    const armGeo = getChamferedCylinderGeo(0.052, 0.062, 0.68, 8, 0.015);
    const cuffGeo = getChamferedCylinderGeo(0.088, 0.088, 0.22, 8, 0.02);
    const upVec = new THREE.Vector3(0, 1, 0);
    const dirVec = new THREE.Vector3();
    const qBranch = new THREE.Quaternion();
    const eBranch = new THREE.Euler();
    const hubOriginY = topY + 0.12;
    const tilt = 0.64;

    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      dirVec.set(Math.sin(a) * Math.sin(tilt), Math.cos(tilt), Math.cos(a) * Math.sin(tilt)).normalize();
      qBranch.setFromUnitVectors(upVec, dirVec);
      eBranch.setFromQuaternion(qBranch, 'XYZ');

      batcher.add(
        'turret',
        'darkSteel',
        armGeo,
        dirVec.x * 0.36,
        hubOriginY + dirVec.y * 0.36,
        dirVec.z * 0.36,
        eBranch.x,
        eBranch.y,
        eBranch.z
      );
      batcher.add(
        'turret',
        'navalWhite',
        cuffGeo,
        dirVec.x * 0.44,
        hubOriginY + dirVec.y * 0.44,
        dirVec.z * 0.44,
        eBranch.x,
        eBranch.y,
        eBranch.z
      );
      batcher.add(
        'turret',
        'specTrimA',
        tipGeo,
        dirVec.x * 0.76,
        hubOriginY + dirVec.y * 0.76,
        dirVec.z * 0.76,
        eBranch.x,
        eBranch.y,
        eBranch.z
      );
    }
  }

  batcher.flush({ root, turret: turretPivot }, mats);

  const muzzleY = topY + (specA ? 0.42 : specB ? 0.34 : 0.16);
  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, muzzleY, 0);
  turretPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(turretPivot, mats, 0, muzzleY, 0, 1.2, true);
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
 * Returns a single cached Ghost 3D hologram per tower type (2 drawables: 1 merged translucent mesh + 1 crisp EdgesGeometry).
 */
export function createGhostTower3D(defId: string): { root: THREE.Group; setValid: (valid: boolean) => void } {
  const cached = ghostCache.get(defId);
  if (cached) return cached;

  const { root: srcRoot } = createTowerModel3D(defId, 1);
  srcRoot.updateMatrixWorld(true);

  const clones: THREE.BufferGeometry[] = [];
  srcRoot.traverse((child) => {
    const m = child as THREE.Mesh;
    if (!m.isMesh || m.userData?.noShadow) return;
    const cloned = m.geometry.clone();
    cloned.applyMatrix4(m.matrixWorld);
    clones.push(cloned);
  });

  const mergedGeo = mergeStaticGeometries(clones, {
    preserveVertexColors: false,
    disposeInputs: true
  });
  const edgesGeo = createGhostEdges(mergedGeo, 24);

  const holoMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.34,
    depthWrite: false
  });
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.78,
    depthWrite: false
  });

  const ghostRoot = new THREE.Group();
  const holoMesh = new THREE.Mesh(mergedGeo, holoMat);
  holoMesh.castShadow = false;
  holoMesh.receiveShadow = false;

  const edgesLines = new THREE.LineSegments(edgesGeo, lineMat);
  edgesLines.renderOrder = 2;

  ghostRoot.add(holoMesh, edgesLines);

  const entry = {
    root: ghostRoot,
    setValid: (valid: boolean) => {
      holoMat.color.setHex(valid ? 0x38bdf8 : 0xf97316);
      lineMat.color.setHex(valid ? 0x7dd3fc : 0xfdba74);
    }
  };
  ghostCache.set(defId, entry);
  return entry;
}

let cachedWearWarmGeo: THREE.BoxGeometry | null = null;
const cachedWearWarmMats: THREE.MeshStandardMaterial[] = [];
const cachedWearWarmMeshes: THREE.Mesh[] = [];

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

    const warmLevels = id === 'hesco' ? [1] : [1, 2, 4];
    for (const lv of warmLevels) {
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

  // Prewarm all 3 canonical SurfaceShaderKit wear shader variants (ARMOR, STEEL, CONCRETE) once at boot.
  // Keep cached at module scope (NEVER dispose immediately after compile — Chrome KHR_parallel_shader_compile is async).
  if (cachedWearWarmMeshes.length === 0) {
    cachedWearWarmGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const variantConfigs: Array<{ variant: string; color: number; roughness: number; metalness: number }> = [
      { variant: MILITARY_WEAR_VARIANTS.ARMOR, color: PALETTE.natoOlive, roughness: 0.74, metalness: 0.04 },
      { variant: MILITARY_WEAR_VARIANTS.STEEL, color: PALETTE.gunmetal, roughness: 0.34, metalness: 0.86 },
      { variant: MILITARY_WEAR_VARIANTS.CONCRETE, color: PALETTE.concrete, roughness: 0.9, metalness: 0.02 }
    ];
    for (const cfg of variantConfigs) {
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: cfg.roughness,
        metalness: cfg.metalness
      });
      applyMilitaryWearShader(mat, {
        variantKey: cfg.variant,
        dirtColor: getActiveTowerDirtColor()
      });
      const mesh = new THREE.Mesh(cachedWearWarmGeo, mat);
      cachedWearWarmMats.push(mat);
      cachedWearWarmMeshes.push(mesh);
    }
  }
  for (const warmMesh of cachedWearWarmMeshes) {
    warmGroup.add(warmMesh);
  }

  renderer.compile(scene, camera);

  scene.remove(warmGroup);
  return ghostCache;
}
