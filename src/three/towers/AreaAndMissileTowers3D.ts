import * as THREE from 'three';
import {
  type ModelMaterials,
  type StructuralMatKey,
  type TowerRig3D,
  StaticMeshBatcher,
  createBatchedMissileCapsMesh,
  getGeo,
  getChamferedBoxGeo,
  getChamferedCylinderGeo,
  getCutCornerSlabGeo,
  createSideExtrudeGeo,
  createPlanExtrudeGeo,
  createLatheYGeo,
  createLatheAlongZGeo,
  attachMuzzleFlashMesh,
  createContactShadowMesh
} from '../TowerRigPrimitives.ts';

function addSandbagArc(
  batcher: StaticMeshBatcher,
  radius: number,
  count: number,
  y: number,
  includeSecondTier = false
): void {
  const bagGeo = getChamferedBoxGeo(0.48, 0.19, 0.28, 0.045);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    batcher.add(
      'root',
      'sandbag',
      bagGeo,
      Math.sin(a) * radius,
      y,
      Math.cos(a) * radius,
      0,
      a,
      (i % 2 === 0 ? 1 : -1) * 0.03
    );
  }
  if (includeSecondTier) {
    const upperCount = Math.max(3, Math.floor(count * 0.4));
    for (let i = 0; i < upperCount; i++) {
      const a = -0.58 + (i / Math.max(1, upperCount - 1)) * 1.16;
      batcher.add(
        'root',
        'sandbag',
        bagGeo,
        Math.sin(a) * (radius - 0.02),
        y + 0.17,
        Math.cos(a) * (radius - 0.02),
        0,
        a,
        (i % 2 === 0 ? -1 : 1) * 0.025
      );
    }
  }
}

// ============================================================================
// 1. JAVELIN / ATGM BATTERY
// ============================================================================

export function buildJavelin(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('javelin', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88));

  // Low octagonal base pad + diamond-plate turntable + sandbag revetment (r <= 1.72, y <= 0.28)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.52, 1.66, 0.16, 8, 0.03), 0, 0.08, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.14, 1.22, 0.08, 8, 0.02), 0, 0.2, 0);
  addSandbagArc(batcher, 1.42, 10, 0.21, level >= 2);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.24, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  const pivots: Record<string, THREE.Object3D> = { root, turret: turretPivot };

  if (level <= 1) {
    // Stabilized ATGM tripod pedestal + CLU thermal sight block
    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.28, 0.36, 0.34, 8, 0.025), 0, 0.17, 0);
    const legGeo = getChamferedBoxGeo(0.11, 0.11, 0.72, 0.02);
    for (const ang of [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]) {
      batcher.add(
        'turret',
        'darkSteel',
        legGeo,
        Math.sin(ang) * 0.42,
        0.16,
        Math.cos(ang) * 0.42,
        -0.38,
        ang,
        0
      );
    }
    batcher.add('turret', 'steel', getChamferedCylinderGeo(0.2, 0.24, 0.36, 8, 0.02), 0, 0.46, 0);
    batcher.add('turret', 'oliveDark', getChamferedBoxGeo(0.76, 0.16, 0.36, 0.025), 0, 0.68, 0);

    // Chamfered CLU optical-thermal targeting module
    batcher.add('turret', 'olive', getChamferedBoxGeo(0.32, 0.3, 0.46, 0.03), -0.46, 0.84, 0.12);
    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.095, 0.105, 0.12, 8, 0), -0.46, 0.85, 0.36, Math.PI / 2, 0, 0);
    batcher.add('turret', 'opticGreen', getChamferedCylinderGeo(0.06, 0.06, 0.04, 8, 0), -0.46, 0.85, 0.42, Math.PI / 2, 0, 0);
  } else if (level === 2) {
    // Armored RWS turret cradle + recessed glass visor + elevated CLU sight
    batcher.add('turret', 'desertArmor', getChamferedCylinderGeo(0.62, 0.7, 0.26, 8, 0.03), 0, 0.13, 0);
    const cabGeo = createSideExtrudeGeo(
      [
        [-0.56, 0.22],
        [0.48, 0.22],
        [0.58, 0.64],
        [0.18, 0.96],
        [-0.52, 0.94]
      ],
      0.86,
      0.035,
      0.035
    );
    batcher.add('turret', 'desertArmor', cabGeo);
    batcher.add('turret', 'glass', getChamferedBoxGeo(0.62, 0.22, 0.06, 0.01), 0, 0.72, 0.42, -0.46, 0, 0);

    // Chamfered CLU mast on cheek
    batcher.add('turret', 'oliveDark', getChamferedBoxGeo(0.34, 0.28, 0.44, 0.03), -0.48, 0.92, 0.22);
    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.09, 0.1, 0.1, 8, 0), -0.48, 0.92, 0.44, Math.PI / 2, 0, 0);
    batcher.add('turret', 'sapphireOptic', getChamferedCylinderGeo(0.058, 0.058, 0.04, 8, 0), -0.48, 0.92, 0.48, Math.PI / 2, 0, 0);
  } else {
    // Lv3+ / 5A / 6B: Heavy angular ATGM armored turret + AESA mast + rotating IFF scanner
    batcher.add('turret', 'desertArmor', getChamferedCylinderGeo(0.74, 0.84, 0.22, 8, 0.03), 0, 0.11, 0);
    const hullGeo = createSideExtrudeGeo(
      [
        [-0.82, 0.18],
        [0.78, 0.18],
        [0.94, 0.56],
        [0.44, 0.92],
        [-0.76, 0.92]
      ],
      1.26,
      0.04,
      0.04
    );
    batcher.add('turret', 'desertArmor', hullGeo);
    for (const sx of [-0.68, 0.68]) {
      batcher.add('turret', 'oliveDark', getChamferedBoxGeo(0.14, 0.36, 1.18, 0.025), sx, 0.48, -0.02);
    }

    // Elevated CLU / EO-IR targeting turret at bow
    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.18, 0.21, 0.26, 8, 0.02), 0, 0.84, 0.72);
    batcher.add('turret', 'sapphireOptic', getChamferedCylinderGeo(0.075, 0.075, 0.06, 8, 0), 0, 0.85, 0.88, Math.PI / 2, 0, 0);

    // Rear mast base + rotating radar/IFF head in radarPivots
    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.24, 0.3, 0.32, 8, 0.02), 0, 1.06, -0.36);

    const iffMast = new THREE.Group();
    iffMast.position.set(0, 1.24, -0.36);
    turretPivot.add(iffMast);
    rig.radarPivots = [iffMast];
    pivots.radar_0 = iffMast;

    batcher.add('radar_0', 'darkSteel', getChamferedCylinderGeo(0.06, 0.08, 0.26, 6, 0), 0, 0.13, 0);
    batcher.add('radar_0', 'steel', getChamferedBoxGeo(0.72, 0.16, 0.12, 0.02), 0, 0.28, 0);
    batcher.add('radar_0', 'copperAesa', getChamferedBoxGeo(0.54, 0.1, 0.04, 0.008), 0, 0.28, 0.07);
    batcher.add('radar_0', 'radarCyan', getChamferedBoxGeo(0.42, 0.04, 0.03, 0.005), 0, 0.38, 0);
  }

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, level <= 1 ? 0.82 : 0.94, 0.06);
  barrelPivot.rotation.x = -0.35;
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;
  pivots.barrel = barrelPivot;

  const capPositions: [number, number, number][] = [];
  let capRadius = 0.1;
  let capLengthScale = 1.0;
  let capMat: THREE.Material = mats.amberGlow;
  let muzzleZ = 0.96;

  if (specA) {
    // 5A: Brimstone Tandem II — 2 heavy inclined launch rails with larger Tandem HEAT warheads & blast deflectors
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(1.16, 0.18, 0.42, 0.025), 0, -0.06, 0);
    const railGeo = getChamferedBoxGeo(0.24, 0.22, 1.62, 0.03);
    const shroudGeo = getChamferedBoxGeo(0.34, 0.3, 1.18, 0.03);
    const deflectorGeo = getChamferedBoxGeo(0.36, 0.34, 0.08, 0.015);
    const trimGeo = getChamferedBoxGeo(0.05, 0.06, 1.08, 0.01);

    for (const rx of [-0.42, 0.42]) {
      batcher.add('barrel', 'darkSteel', railGeo, rx, 0.06, 0.08);
      batcher.add('barrel', 'olive', shroudGeo, rx, 0.06, -0.04);
      batcher.add('barrel', 'steel', deflectorGeo, rx, 0.08, -0.78, -0.36, 0, 0);
      batcher.add('barrel', 'specTrimA', trimGeo, rx + (rx < 0 ? -0.18 : 0.18), 0.06, -0.02);
      capPositions.push([rx, 0.06, 0.72]);
    }
    capRadius = 0.14;
    capLengthScale = 1.55;
    capMat = mats.amberGlow;
    muzzleZ = 1.16;
  } else if (specB) {
    // 6B: Salva Hexa Brimstone — wide hexagonal 6-cell (2x3) pod + lateral fairings + specTrimB
    const hexPodGeo = createSideExtrudeGeo(
      [
        [-0.78, -0.22],
        [0.78, -0.22],
        [0.82, 0.22],
        [-0.74, 0.22]
      ],
      1.36,
      0.04,
      0.04
    );
    batcher.add('barrel', 'oliveDark', hexPodGeo, 0, 0.04, 0.04);
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(1.44, 0.56, 0.16, 0.025), 0, 0.04, 0.76);
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(1.4, 0.52, 0.14, 0.02), 0, 0.04, -0.68);

    const tubeGeo = getChamferedCylinderGeo(0.11, 0.11, 1.54, 8, 0);
    for (const cx of [-0.38, 0, 0.38]) {
      for (const cy of [-0.1, 0.18]) {
        batcher.add('barrel', 'gunmetal', tubeGeo, cx, cy, 0.06, Math.PI / 2, 0, 0);
        capPositions.push([cx, cy, 0.82]);
      }
    }

    for (const sx of [-0.8, 0.8]) {
      batcher.add('barrel', 'desertArmor', getChamferedBoxGeo(0.22, 0.4, 1.24, 0.03), sx, 0.04, 0.02);
      batcher.add('barrel', 'specTrimB', getChamferedBoxGeo(0.05, 0.08, 1.06, 0.01), sx + (sx < 0 ? -0.11 : 0.11), 0.04, 0.04);
    }
    capRadius = 0.092;
    capLengthScale = 1.15;
    capMat = mats.navalWhite;
    muzzleZ = 1.04;
  } else if (level <= 1) {
    // Lv1: 1 armored inclined launch tube
    batcher.add('barrel', 'steel', getChamferedBoxGeo(0.46, 0.14, 0.34, 0.02), -0.18, 0, 0);
    batcher.add('barrel', 'olive', getChamferedCylinderGeo(0.17, 0.17, 1.4, 10, 0.02), 0.08, 0.02, 0.06, Math.PI / 2, 0, 0);
    batcher.add('barrel', 'darkSteel', getChamferedCylinderGeo(0.2, 0.2, 0.14, 10, 0.015), 0.08, 0.02, 0.72, Math.PI / 2, 0, 0);
    batcher.add('barrel', 'darkSteel', getChamferedCylinderGeo(0.19, 0.19, 0.14, 10, 0.015), 0.08, 0.02, -0.58, Math.PI / 2, 0, 0);
    capPositions.push([0.08, 0.02, 0.74]);
    capRadius = 0.115;
    capLengthScale = 1.1;
    capMat = mats.amberGlow;
    muzzleZ = 0.94;
  } else if (level === 2) {
    // Lv2: Dual armored launch tubes
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.96, 0.2, 0.42, 0.025), 0, -0.02, 0);
    const tubeGeo = getChamferedCylinderGeo(0.15, 0.15, 1.46, 10, 0.015);
    const collarGeo = getChamferedCylinderGeo(0.18, 0.18, 0.14, 10, 0);
    for (const tx of [-0.32, 0.32]) {
      batcher.add('barrel', 'olive', tubeGeo, tx, 0.04, 0.06, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'darkSteel', collarGeo, tx, 0.04, 0.74, Math.PI / 2, 0, 0);
      capPositions.push([tx, 0.04, 0.76]);
    }
    capRadius = 0.105;
    capLengthScale = 1.05;
    capMat = mats.navalWhite;
    muzzleZ = 0.96;
  } else {
    // Lv3: Quad armored launch tubes (two twin armored pods)
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(1.48, 0.2, 0.36, 0.025), 0, 0, -0.04);
    const podBoxGeo = getChamferedBoxGeo(0.46, 0.48, 1.48, 0.035);
    const bezelGeo = getChamferedBoxGeo(0.5, 0.52, 0.14, 0.02);
    const tubeGeo = getChamferedCylinderGeo(0.095, 0.095, 1.56, 8, 0);
    for (const px of [-0.62, 0.62]) {
      batcher.add('barrel', 'olive', podBoxGeo, px, 0.02, 0.06);
      batcher.add('barrel', 'darkSteel', bezelGeo, px, 0.02, 0.74);
      for (const oy of [-0.11, 0.13]) {
        batcher.add('barrel', 'gunmetal', tubeGeo, px, oy, 0.06, Math.PI / 2, 0, 0);
        capPositions.push([px, oy, 0.78]);
      }
    }
    capRadius = 0.088;
    capLengthScale = 1.05;
    capMat = mats.amberGlow;
    muzzleZ = 1.0;
  }

  const batchedCaps = createBatchedMissileCapsMesh(
    `javelin:${level}:${specialization ?? 'none'}:barrel_missileCaps`,
    capPositions,
    capRadius,
    capMat,
    capLengthScale,
    10
  );
  barrelPivot.add(batchedCaps);
  rig.missileCaps = [batchedCaps];

  batcher.flush(pivots, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.04, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.04, muzzleZ + 0.08, level >= 3 ? 1.15 : 0.95);
}

// ============================================================================
// 2. ABRAMS PIT / HEAVY CANNON BASTION
// ============================================================================

export function buildAbramsPit(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('abrams_pit', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88));

  // Octagonal excavated concrete & sandbag pit (y <= 0.28 within r <= 1.76)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.66, 1.76, 0.14, 8, 0.025), 0, 0.07, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.38, 1.44, 0.08, 8, 0.02), 0, 0.17, 0);
  addSandbagArc(batcher, 1.5, 12, 0.22, level >= 2);

  // Dug-in M1A2 hull inside concrete pit
  const hullMat: StructuralMatKey = level >= 2 ? 'oliveDark' : 'desertArmor';
  const hullGeo = createSideExtrudeGeo(
    [
      [-1.24, 0.22],
      [1.16, 0.22],
      [1.46, 0.44],
      [0.92, 0.68],
      [-1.2, 0.68]
    ],
    1.5,
    0.04,
    0.04
  );
  batcher.add('root', hullMat, hullGeo);

  const trackGeo = getChamferedBoxGeo(0.34, 0.36, 2.38, 0.06);
  const skirtGeo = getChamferedBoxGeo(0.12, 0.38, 2.34, 0.025);
  for (const sx of [-0.9, 0.9]) {
    batcher.add('root', 'tracks', trackGeo, sx, 0.32, 0);
    batcher.add('root', hullMat, skirtGeo, sx + (sx < 0 ? -0.16 : 0.16), 0.48, 0);
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.72, 0.04);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Angular Chobham composite turret
  const turretMat: StructuralMatKey = level >= 3 ? 'oliveDark' : 'desertArmor';
  const turretGeo = createSideExtrudeGeo(
    [
      [-1.18, 0.0],
      [0.64, 0.0],
      [1.1, 0.28],
      [0.66, 0.58],
      [-1.14, 0.58]
    ],
    1.58,
    0.045,
    0.045
  );
  batcher.add('turret', turretMat, turretGeo);

  // Flush sculpted Chobham composite cheek armor slabs (cleanly aligned with front slope, zero plane intersection)
  const cheekWedgeGeo = createSideExtrudeGeo(
    [
      [0.34, 0.04],
      [0.86, 0.04],
      [1.08, 0.28],
      [0.68, 0.56],
      [0.34, 0.56]
    ],
    0.46,
    0.03,
    0.03
  );
  batcher.add('turret', turretMat, cheekWedgeGeo, -0.56, 0.01, 0.04);
  batcher.add('turret', turretMat, cheekWedgeGeo, 0.56, 0.01, 0.04);

  // Rear bustle ammunition rack + stowage rails
  batcher.add('turret', 'oliveDark', getChamferedBoxGeo(1.44, 0.42, 0.54, 0.035), 0, 0.3, -1.04);
  batcher.add('turret', 'darkSteel', getChamferedBoxGeo(1.5, 0.08, 0.58, 0.015), 0, 0.52, -1.04);
  batcher.add('turret', 'darkSteel', getChamferedBoxGeo(1.48, 0.22, 0.06, 0.012), 0, 0.62, -1.3);
  for (const sx of [-0.66, 0.66]) {
    batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.06, 0.22, 0.52, 0.012), sx, 0.62, -1.04);
  }

  // CITV independent thermal viewer + commander CROWS pintle MG
  batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.16, 0.2, 0.26, 8, 0.02), -0.42, 0.71, 0.2);
  batcher.add('turret', 'sapphireOptic', getChamferedBoxGeo(0.18, 0.12, 0.06, 0.01), -0.42, 0.74, 0.34);
  batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.14, 0.16, 0.18, 8, 0), 0.44, 0.67, 0.08);
  batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.025, 0.025, 0.52, 6, 0), 0.44, 0.74, 0.36, Math.PI / 2, 0, 0);

  // Trophy APS radar panels & dual countermeasure launchers on cheeks
  if (level >= 2) {
    const apsBoxGeo = getChamferedBoxGeo(0.14, 0.3, 0.48, 0.025);
    const aesaGeo = getChamferedBoxGeo(0.05, 0.22, 0.32, 0.01);
    const tubeGeo = getChamferedCylinderGeo(0.075, 0.075, 0.28, 8, 0);
    for (const sx of [-0.88, 0.88]) {
      batcher.add('turret', 'darkSteel', apsBoxGeo, sx, 0.38, 0.05);
      batcher.add('turret', 'copperAesa', aesaGeo, sx + (sx < 0 ? -0.07 : 0.07), 0.38, 0.05);
      batcher.add('turret', 'darkSteel', tubeGeo, sx, 0.64, -0.16, 0.42, 0, sx < 0 ? 0.28 : -0.28);
      batcher.add('turret', 'radarCyan', getChamferedCylinderGeo(0.045, 0.045, 0.04, 8, 0), sx, 0.76, -0.09, 0.42, 0, sx < 0 ? 0.28 : -0.28);
    }
  }

  // Specialization armor & racks (keep distinct mat keys on turret <= 8!)
  if (specA) {
    // 5A: Obus Cluster M830A1 — ERA armor plates + lateral cluster submunition racks + specTrimA
    const eraGeo = getChamferedBoxGeo(0.42, 0.26, 0.1, 0.02);
    batcher.add('turret', 'oliveDark', eraGeo, -0.52, 0.3, 1.1, 0, 0.44, 0);
    batcher.add('turret', 'oliveDark', eraGeo, 0.52, 0.3, 1.1, 0, -0.44, 0);
    batcher.add('turret', 'specTrimA', getChamferedBoxGeo(0.36, 0.06, 0.06, 0.01), -0.54, 0.44, 1.12, 0, 0.44, 0);
    batcher.add('turret', 'specTrimA', getChamferedBoxGeo(0.36, 0.06, 0.06, 0.01), 0.54, 0.44, 1.12, 0, -0.44, 0);

    const canGeo = getChamferedCylinderGeo(0.085, 0.085, 0.46, 8, 0);
    for (const sx of [-0.94, 0.94]) {
      batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.24, 0.32, 0.72, 0.025), sx, 0.32, -0.58);
      for (const cz of [-0.76, -0.58, -0.4]) {
        batcher.add('turret', 'brass', canGeo, sx + (sx < 0 ? -0.06 : 0.06), 0.42, cz);
      }
    }
  } else if (specB) {
    // 6B: Munição Termocinética STAFF — reinforced Chobham frontal arrowhead wedges + STAFF mmW dome + specTrimB
    const wedgeGeo = createPlanExtrudeGeo(
      [
        [-0.32, -0.24],
        [0.32, -0.24],
        [0.14, 0.36],
        [-0.14, 0.36]
      ],
      0.34,
      0.03,
      0.03
    );
    batcher.add('turret', 'oliveDark', wedgeGeo, -0.52, 0.14, 1.06, 0, 0.36, 0);
    batcher.add('turret', 'oliveDark', wedgeGeo, 0.52, 0.14, 1.06, 0, -0.36, 0);
    batcher.add('turret', 'specTrimB', getChamferedBoxGeo(0.38, 0.06, 0.06, 0.01), -0.54, 0.5, 1.02, 0, 0.36, 0);
    batcher.add('turret', 'specTrimB', getChamferedBoxGeo(0.38, 0.06, 0.06, 0.01), 0.54, 0.5, 1.02, 0, -0.36, 0);
    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.18, 0.22, 0.18, 8, 0.02), 0, 0.67, -0.38);
    batcher.add('turret', 'specTrimB', getChamferedCylinderGeo(0.14, 0.14, 0.05, 8, 0), 0, 0.78, -0.38);
  }

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.29, 0.94);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  let muzzleZ = 2.68;
  if (specA) {
    // Short, thick mortar-howitzer barrel with heavy baffled muzzle brake
    const mortarGun = createLatheAlongZGeo(
      [
        [0.2, 0.0],
        [0.2, 0.54],
        [0.165, 0.58],
        [0.165, 1.62],
        [0.23, 1.66],
        [0.23, 1.98],
        [0.12, 2.02]
      ],
      10
    );
    batcher.add('barrel', 'gunmetal', mortarGun);
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.46, 0.36, 0.32, 0.03), 0, 0, 1.82);
    muzzleZ = 2.06;
  } else if (specB) {
    // High-velocity L/55 long smoothbore gun with thermal shroud & MRS tip
    const l55Gun = createLatheAlongZGeo(
      [
        [0.16, 0.0],
        [0.16, 0.68],
        [0.115, 0.72],
        [0.115, 1.5],
        [0.155, 1.56],
        [0.155, 2.0],
        [0.105, 2.06],
        [0.105, 3.0],
        [0.13, 3.06],
        [0.075, 3.1]
      ],
      10
    );
    batcher.add('barrel', 'gunmetal', l55Gun);
    batcher.add('barrel', 'steel', getChamferedCylinderGeo(0.12, 0.12, 0.72, 10, 0), 0, 0, 2.52, Math.PI / 2, 0, 0);
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.06, 0.14, 0.08, 0.01), 0, 0.12, 2.98);
    muzzleZ = 3.14;
  } else {
    const bLen = level <= 1 ? 2.28 : level === 2 ? 2.62 : 2.88;
    const bScale = level >= 3 ? 1.18 : 1.0;
    const evacZ = bLen * 0.56;
    const gunGeo = createLatheAlongZGeo(
      [
        [0.145 * bScale, 0.0],
        [0.145 * bScale, 0.58],
        [0.098 * bScale, 0.62],
        [0.098 * bScale, evacZ - 0.16],
        [0.148 * bScale, evacZ - 0.1],
        [0.148 * bScale, evacZ + 0.28],
        [0.09 * bScale, evacZ + 0.34],
        [0.09 * bScale, bLen - 0.06],
        [0.122 * bScale, bLen],
        [0.072 * bScale, bLen + 0.04]
      ],
      10
    );
    batcher.add('barrel', 'gunmetal', gunGeo);
    muzzleZ = bLen + 0.08;
  }

  batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, muzzleZ + 0.08, 1.55);
}

// ============================================================================
// 3. TOS-1A MLRS / ROCKET ARTILLERY BATTERY
// ============================================================================

export function buildTos1Mlrs(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('tos1_mlrs', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88));

  // Cut-corner turntable pad + angled stabilizer blades (y <= 0.28, r <= 1.72)
  batcher.add('root', 'concreteDark', getCutCornerSlabGeo(2.54, 0.16, 2.74, 0.62, 0.03), 0, 0.08, 0);
  for (const sz of [-1.22, 1.22]) {
    batcher.add('root', 'darkSteel', getChamferedBoxGeo(1.16, 0.16, 0.18, 0.025), 0, 0.14, sz, sz > 0 ? 0.22 : -0.22, 0, 0);
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.18, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Tracked armored carrier chassis
  const trackGeo = getChamferedBoxGeo(0.4, 0.42, 2.46, 0.06);
  const wheelGeo = getChamferedCylinderGeo(0.16, 0.16, 0.43, 8, 0);
  for (const sx of [-0.92, 0.92]) {
    batcher.add('turret', 'tracks', trackGeo, sx, 0.29, 0);
    for (let w = 0; w < 5; w++) {
      batcher.add('turret', 'steel', wheelGeo, sx, 0.22, 0.92 - w * 0.46, 0, 0, Math.PI / 2);
    }
  }

  const hullGeo = createSideExtrudeGeo(
    [
      [-1.18, 0.22],
      [1.1, 0.22],
      [1.26, 0.5],
      [0.86, 0.72],
      [-1.16, 0.72]
    ],
    1.44,
    0.04,
    0.04
  );
  batcher.add('turret', 'rusCamo', hullGeo);

  // Armored forward crew cab + recessed glass slit
  batcher.add('turret', 'rusDark', getChamferedBoxGeo(1.36, 0.46, 0.76, 0.04), 0, 0.88, 0.74);
  batcher.add('turret', 'glass', getChamferedBoxGeo(1.06, 0.18, 0.06, 0.01), 0, 0.95, 1.12);

  // Hydraulic elevation cradle
  for (const sx of [-0.52, 0.52]) {
    batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.18, 0.44, 0.42, 0.025), sx, 0.9, -0.26);
    batcher.add('turret', 'steel', getChamferedCylinderGeo(0.055, 0.075, 0.56, 8, 0), sx, 0.84, 0.06, 0.52, 0, 0);
  }

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 1.02, -0.26);
  barrelPivot.rotation.x = -0.58;
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  const capPositions: [number, number, number][] = [];
  let capRadius = 0.072;
  let capLengthScale = 1.05;
  let capMat: THREE.Material = mats.navalWhite;
  let muzzleZ = 1.18;

  if (specA) {
    // 5A: Chuva de Fogo Apocalipse 20x — wide 5x4 thermobaric pod + armored flank fins + specTrimA
    batcher.add('barrel', 'rusCamo', getChamferedBoxGeo(1.46, 1.08, 1.84, 0.045), 0, 0.44, 0.08);
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(1.52, 1.14, 0.14, 0.025), 0, 0.44, 0.98);
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(1.5, 1.1, 0.14, 0.025), 0, 0.44, -0.8);

    const tubeGeo = getChamferedCylinderGeo(0.078, 0.078, 1.88, 6, 0);
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 4; r++) {
        const rx = -0.48 + c * 0.24;
        const ry = 0.1 + r * 0.22;
        batcher.add('barrel', 'gunmetal', tubeGeo, rx, ry, 0.08, Math.PI / 2, 0, 0);
        capPositions.push([rx, ry, 1.02]);
      }
    }

    for (const sx of [-0.82, 0.82]) {
      batcher.add('barrel', 'rusDark', getChamferedBoxGeo(0.14, 0.72, 1.48, 0.03), sx, 0.44, 0.06);
      batcher.add('barrel', 'specTrimA', getChamferedBoxGeo(0.05, 0.08, 1.24, 0.01), sx + (sx < 0 ? -0.07 : 0.07), 0.44, 0.06);
    }
    capRadius = 0.062;
    capLengthScale = 1.15;
    capMat = mats.brass;
    muzzleZ = 1.18;
  } else if (specB) {
    // 6B: Mísseis ATACMS de Cerco — 2 heavy large-diameter tactical ballistic missile containers + 2 giant warheads
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(1.42, 0.22, 1.16, 0.03), 0, 0.06, 0);
    const podGeo = getChamferedBoxGeo(0.64, 0.64, 2.02, 0.045);
    const frameGeo = getChamferedBoxGeo(0.7, 0.7, 0.16, 0.025);
    const braceGeo = getChamferedBoxGeo(0.72, 0.14, 0.14, 0.02);
    const trimGeo = getChamferedBoxGeo(0.05, 0.08, 1.56, 0.01);

    for (const sx of [-0.42, 0.42]) {
      batcher.add('barrel', 'oliveDark', podGeo, sx, 0.42, 0.12);
      batcher.add('barrel', 'darkSteel', frameGeo, sx, 0.42, 1.06);
      batcher.add('barrel', 'darkSteel', frameGeo, sx, 0.42, -0.82);
      batcher.add('barrel', 'steel', braceGeo, sx, 0.42, 0.12);
      batcher.add('barrel', 'specTrimB', trimGeo, sx + (sx < 0 ? -0.34 : 0.34), 0.42, 0.12);
      capPositions.push([sx, 0.42, 1.08]);
    }
    capRadius = 0.21;
    capLengthScale = 1.55;
    capMat = mats.navalWhite;
    muzzleZ = 1.44;
  } else {
    // Standard: 12 tubes (4x3) at Lv1/Lv2 -> 16 tubes (4x4) at Lv3
    const rows = level >= 3 ? 4 : 3;
    const podH = rows === 4 ? 1.04 : 0.84;
    const podCenterY = rows === 4 ? 0.44 : 0.34;
    batcher.add('barrel', 'olive', getChamferedBoxGeo(1.22, podH, 1.78, 0.045), 0, podCenterY, 0.08);
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(1.28, podH + 0.06, 0.14, 0.025), 0, podCenterY, 0.94);

    if (level >= 2) {
      for (const sx of [-0.66, 0.66]) {
        batcher.add('barrel', 'oliveDark', getChamferedBoxGeo(0.1, podH * 0.72, 1.4, 0.02), sx, podCenterY, 0.08);
      }
    }

    const tubeGeo = getChamferedCylinderGeo(0.082, 0.082, 1.82, 6, 0);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < rows; r++) {
        const rx = -0.375 + c * 0.25;
        const ry = 0.11 + r * 0.22;
        batcher.add('barrel', 'gunmetal', tubeGeo, rx, ry, 0.08, Math.PI / 2, 0, 0);
        capPositions.push([rx, ry, 0.99]);
      }
    }
    capRadius = 0.068;
    capLengthScale = 1.05;
    capMat = mats.navalWhite;
    muzzleZ = 1.15;
  }

  const batchedCaps = createBatchedMissileCapsMesh(
    `tos1_mlrs:${level}:${specialization ?? 'none'}:barrel_missileCaps`,
    capPositions,
    capRadius,
    capMat,
    capLengthScale,
    specB ? 12 : 8
  );
  barrelPivot.add(batchedCaps);
  rig.missileCaps = [batchedCaps];

  batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.42, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.42, muzzleZ + 0.08, 1.55);
}

// ============================================================================
// 4. MINEFIELD LAYER (<= 5% EMISSIVE AREA)
// ============================================================================

export function buildMinefieldLayer(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('minefield', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88));

  // Chamfered octagonal central distributor slab (y <= 0.28, r <= 1.66)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.54, 1.66, 0.15, 8, 0.03), 0, 0.075, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.14, 1.22, 0.07, 8, 0.018), 0, 0.18, 0);

  // Central octagonal armored mine dispenser hub
  batcher.add('root', 'oliveDark', getChamferedCylinderGeo(0.56, 0.68, 0.46, 8, 0.03), 0, 0.44, 0);
  batcher.add('root', 'darkSteel', getChamferedCylinderGeo(0.46, 0.54, 0.14, 8, 0.02), 0, 0.72, 0);

  // 4 armored dispenser chutes around hub
  const chuteGeo = getChamferedBoxGeo(0.24, 0.22, 0.34, 0.025);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    batcher.add('root', 'steel', chuteGeo, Math.sin(a) * 0.62, 0.38, Math.cos(a) * 0.62, 0.28, a, 0);
  }

  // Subtle metallic perimeter stakes (single combined lathe per stake, r = 1.52 <= 1.68)
  const mineCount = specA || specB ? 8 : level <= 1 ? 5 : level === 2 ? 6 : 8;
  const stakeGeo = createLatheYGeo(
    [
      [0.032, 0.0],
      [0.028, 0.36],
      [0.048, 0.37],
      [0.048, 0.42],
      [0.001, 0.43]
    ],
    6
  );
  for (let i = 0; i < mineCount; i++) {
    const a = (i / mineCount) * Math.PI * 2 + Math.PI / mineCount;
    batcher.add('root', 'steel', stakeGeo, Math.sin(a) * 1.52, 0.15, Math.cos(a) * 1.52);
  }

  // Ring of 5..8 chamfered anti-tank mines (single stepped lathe per mine, r = 1.26 <= 1.68)
  const mineR = specA ? 0.23 : 0.19;
  const mineH = specA ? 0.16 : 0.11;
  const mineGeo = createLatheYGeo(
    [
      [mineR, 0.0],
      [mineR, mineH * 0.75],
      [mineR * 0.85, mineH],
      [mineR * 0.54, mineH],
      [mineR * 0.48, mineH + 0.04],
      [0.001, mineH + 0.045]
    ],
    8
  );
  const pipGeo = getChamferedCylinderGeo(0.024, 0.024, 0.025, 6, 0);
  const finGeo = getChamferedBoxGeo(0.04, 0.1, 0.28, 0.008);
  const mineTrimGeo = getGeo(`mine_trim_${specA ? 'a' : 'b'}`, () => new THREE.TorusGeometry(mineR * 0.72, 0.015, 4, 10));

  for (let i = 0; i < mineCount; i++) {
    const a = (i / mineCount) * Math.PI * 2;
    const mr = specA ? 1.24 : 1.26;
    const mx = Math.sin(a) * mr;
    const mz = Math.cos(a) * mr;
    batcher.add('root', 'gunmetal', mineGeo, mx, 0.16, mz);
    // Tiny recessed status pip (total emissive << 1%)
    batcher.add('root', specB ? 'radarCyan' : 'shtoraRed', pipGeo, mx, 0.16 + mineH + 0.055, mz);

    if (specA) {
      // Seismic demolition charge cross-fins + specTrimA ring
      batcher.add('root', 'darkSteel', finGeo, mx, 0.16 + mineH * 0.65, mz, 0, a, 0);
      batcher.add('root', 'specTrimA', mineTrimGeo, mx, 0.16 + mineH + 0.015, mz, Math.PI / 2, 0, 0);
    }
  }

  if (specA) {
    // 5A: Minas Sísmicas de Demolição — reinforced central mortar dispenser + specTrimA ring
    batcher.add('root', 'darkSteel', getChamferedCylinderGeo(0.24, 0.28, 0.44, 8, 0.02), 0, 0.92, 0);
    batcher.add('root', 'steel', getChamferedCylinderGeo(0.28, 0.28, 0.1, 8, 0), 0, 1.12, 0);
    batcher.add('root', 'specTrimA', getGeo('mine_hub_trimA', () => new THREE.TorusGeometry(0.52, 0.024, 4, 12)), 0, 0.74, 0, Math.PI / 2, 0, 0);
  } else if (specB) {
    // 6B: Malha EMP Estática — compact copper-coiled pylons + caged capacitor core + specTrimB
    const pylonGeo = getChamferedCylinderGeo(0.08, 0.11, 0.64, 8, 0);
    const coilGeo = getChamferedCylinderGeo(0.115, 0.115, 0.22, 8, 0);
    const conduitGeo = getChamferedBoxGeo(0.045, 0.045, 0.48, 0.01);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const px = Math.sin(a) * 1.44;
      const pz = Math.cos(a) * 1.44;
      batcher.add('root', 'darkSteel', pylonGeo, px, 0.44, pz);
      batcher.add('root', 'copperAesa', coilGeo, px, 0.56, pz);
      batcher.add('root', 'specTrimB', getChamferedCylinderGeo(0.075, 0.075, 0.05, 8, 0), px, 0.78, pz);
      batcher.add('root', 'copperAesa', conduitGeo, Math.sin(a) * 1.06, 0.2, Math.cos(a) * 1.06, 0, a, 0);
    }

    // Caged capacitor core behind 6 thick darkSteel ribs (<= 3% emissive)
    batcher.add('root', 'empPurple', getChamferedCylinderGeo(0.13, 0.13, 0.36, 8, 0), 0, 0.96, 0);
    const ribGeo = getChamferedBoxGeo(0.055, 0.44, 0.075, 0.01);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      batcher.add('root', 'darkSteel', ribGeo, Math.sin(a) * 0.22, 0.96, Math.cos(a) * 0.22, 0, a, 0);
    }
    batcher.add('root', 'darkSteel', getChamferedCylinderGeo(0.28, 0.32, 0.1, 8, 0.015), 0, 1.2, 0);
    batcher.add('root', 'specTrimB', getGeo('mine_hub_trimB', () => new THREE.TorusGeometry(0.28, 0.02, 4, 12)), 0, 0.78, 0, Math.PI / 2, 0, 0);
  }

  // Compact rotating sensor mast in radarPivots
  const mast = new THREE.Group();
  mast.position.set(0, specA || specB ? 1.22 : 0.78, 0);
  root.add(mast);
  rig.radarPivots = [mast];

  batcher.add('radar_0', 'steel', getChamferedCylinderGeo(0.045, 0.065, 0.42, 6, 0), 0, 0.21, 0);
  batcher.add('radar_0', 'darkSteel', getChamferedBoxGeo(0.46, 0.11, 0.12, 0.018), 0, 0.44, 0);
  batcher.add('radar_0', specB ? 'specTrimB' : 'radarCyan', getChamferedBoxGeo(0.22, 0.04, 0.03, 0.005), 0, 0.44, 0.07);

  batcher.flush({ root, radar_0: mast }, mats);
}

// ============================================================================
// 5. HARPOON TOWER / TITANIUM MAGNETIC WINCH LAUNCHER
// ============================================================================

function addBarbedHarpoon(
  batcher: StaticMeshBatcher,
  ox: number,
  oy: number,
  oz: number,
  yaw: number,
  scale: number,
  matsKeyTip: StructuralMatKey = 'navalWhite',
  trimKey: StructuralMatKey | null = null
): void {
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const place = (lx: number, ly: number, lz: number): [number, number, number] => [
    ox + lx * cos + lz * sin,
    oy + ly,
    oz - lx * sin + lz * cos
  ];

  // Shaft
  const shaftGeo = getChamferedCylinderGeo(0.038 * scale, 0.042 * scale, 1.22 * scale, 6, 0);
  const [sx, sy, sz] = place(0, 0, 0.56 * scale);
  batcher.add('barrel', 'steel', shaftGeo, sx, sy, sz, Math.PI / 2, yaw, 0);

  // Sharp titanium conical head
  const tipGeo = createLatheAlongZGeo(
    [
      [0.082 * scale, 0],
      [0.045 * scale, 0.2 * scale],
      [0.001, 0.42 * scale]
    ],
    6
  );
  const [tx, ty, tz] = place(0, 0, 1.12 * scale);
  batcher.add('barrel', matsKeyTip, tipGeo, tx, ty, tz, 0, yaw, 0);

  // Swept triangular barbs
  const barbGeo = getChamferedBoxGeo(0.18 * scale, 0.035 * scale, 0.11 * scale, 0.008 * scale);
  const [blx, bly, blz] = place(-0.06 * scale, 0, 1.08 * scale);
  const [brx, bry, brz] = place(0.06 * scale, 0, 1.08 * scale);
  batcher.add('barrel', 'steel', barbGeo, blx, bly, blz, 0, yaw - 0.55, 0);
  batcher.add('barrel', 'steel', barbGeo, brx, bry, brz, 0, yaw + 0.55, 0);

  if (trimKey) {
    const [mx, my, mz] = place(0, 0, 0.98 * scale);
    batcher.add(
      'barrel',
      trimKey,
      getChamferedCylinderGeo(0.056 * scale, 0.056 * scale, 0.08 * scale, 6, 0),
      mx,
      my,
      mz,
      Math.PI / 2,
      yaw,
      0
    );
  }
}

export function buildHarpoonTower(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('harpoon_tower', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88));

  // Industrial naval deck pad + anchor cleats (y <= 0.28, r <= 1.72)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.54, 1.66, 0.16, 8, 0.03), 0, 0.08, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.22, 1.3, 0.08, 8, 0.02), 0, 0.2, 0);
  const cleatGeo = getChamferedBoxGeo(0.24, 0.14, 0.34, 0.025);
  for (const ang of [0.78, 2.35, 3.92, 5.49]) {
    batcher.add('root', 'darkSteel', cleatGeo, Math.sin(ang) * 1.38, 0.18, Math.cos(ang) * 1.38, 0, ang, 0);
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.24, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Naval/industrial turret pedestal & trunnion cheeks
  batcher.add('turret', 'navalGray', getChamferedCylinderGeo(0.64, 0.76, 0.34, 8, 0.035), 0, 0.17, 0);
  const cheekGeo = createSideExtrudeGeo(
    [
      [-0.68, 0.3],
      [0.42, 0.3],
      [0.34, 0.84],
      [-0.58, 0.84]
    ],
    0.2,
    0.03,
    0.03
  );
  batcher.add('turret', 'navalGray', cheekGeo, -0.44, 0, 0);
  batcher.add('turret', 'navalGray', cheekGeo, 0.44, 0, 0);
  batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.84, 0.24, 0.72, 0.03), 0, 0.44, -0.14);

  // Industrial grooved steel-cable winch drum via createLatheYGeo
  const spoolGeo = createLatheYGeo(
    [
      [0.32, -0.32],
      [0.32, -0.26],
      [0.23, -0.24],
      [0.23, 0.24],
      [0.32, 0.26],
      [0.32, 0.32]
    ],
    10
  );

  if (specA) {
    // 5A: Grilhão Titânico de Aço — dual heavy winches + stabilizer claws + specTrimA
    for (const sx of [-0.42, 0.42]) {
      batcher.add('turret', 'darkSteel', spoolGeo, sx, 0.66, -0.48, 0, 0, Math.PI / 2, 0.82, 0.62, 0.82);
      batcher.add('turret', 'brass', getChamferedCylinderGeo(0.2, 0.2, 0.28, 10, 0), sx, 0.66, -0.48, 0, 0, Math.PI / 2);
      // Heavy rear stabilizer claws
      batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.18, 0.42, 0.62, 0.03), sx * 1.45, 0.28, -0.78, 0.42, sx < 0 ? -0.25 : 0.25, 0);
      batcher.add('turret', 'specTrimA', getChamferedBoxGeo(0.06, 0.34, 0.48, 0.015), sx * 1.32, 0.56, 0.02);
    }
  } else {
    batcher.add('turret', 'darkSteel', spoolGeo, 0, 0.66, -0.42, 0, 0, Math.PI / 2);
    batcher.add('turret', 'brass', getChamferedCylinderGeo(0.24, 0.24, 0.44, 10, 0), 0, 0.66, -0.42, 0, 0, Math.PI / 2);
  }

  if (specB) {
    // 6B: Rede Magnética Quíntupla — lateral capacitor banks + copper coils + specTrimB
    for (const sx of [-0.74, 0.74]) {
      batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.18, 0.2, 0.56, 8, 0.02), sx, 0.52, -0.06);
      batcher.add('turret', 'copperAesa', getChamferedCylinderGeo(0.2, 0.2, 0.24, 8, 0), sx, 0.52, -0.06);
      batcher.add('turret', 'specTrimB', getChamferedCylinderGeo(0.19, 0.19, 0.06, 8, 0), sx, 0.82, -0.06);
    }
  }

  // Hydraulic elevation piston
  batcher.add('turret', 'steel', getChamferedCylinderGeo(0.065, 0.085, 0.52, 6, 0), 0, 0.66, 0.12, 0.45, 0, 0);

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.84, 0.14);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  let muzzleZ = 1.62;
  if (specA) {
    // 5A: Giant siege harpoon launcher with massive triangular barbs & slim side guide brackets (<= 2.5% emissive)
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.42, 0.3, 1.72, 0.035), 0, -0.02, 0.42);
    batcher.add('barrel', 'navalGray', getChamferedBoxGeo(0.5, 0.22, 0.56, 0.03), 0, 0, -0.14);
    for (const sx of [-0.21, 0.21]) {
      batcher.add('barrel', 'specTrimA', getChamferedBoxGeo(0.045, 0.045, 0.72, 0.008), sx, 0.14, 0.62);
    }
    addBarbedHarpoon(batcher, 0, 0.12, 0.12, 0, 1.38, 'navalWhite', 'specTrimA');
    muzzleZ = 2.08;
  } else if (specB) {
    // 6B: Widened fan head with 5 diverging harpoons/electro-nodes
    const fanGeo = createPlanExtrudeGeo(
      [
        [-0.42, -0.22],
        [0.42, -0.22],
        [0.88, 0.58],
        [-0.88, 0.58]
      ],
      0.22,
      0.03,
      0.03
    );
    batcher.add('barrel', 'darkSteel', fanGeo, 0, -0.11, 0.16);
    batcher.add('barrel', 'specTrimB', getChamferedBoxGeo(1.56, 0.05, 0.08, 0.01), 0, 0.13, 0.72);
    const fanAngles = [-0.34, -0.17, 0, 0.17, 0.34];
    for (let i = 0; i < fanAngles.length; i++) {
      const ang = fanAngles[i];
      const rx = Math.sin(ang) * 0.56;
      batcher.add('barrel', 'steel', getChamferedBoxGeo(0.11, 0.11, 0.88, 0.015), rx * 0.85, 0.02, 0.34, 0, ang, 0);
      addBarbedHarpoon(batcher, rx * 0.65, 0.08, 0.12, ang, 0.92, 'steel', 'specTrimB');
    }
    muzzleZ = 1.62;
  } else {
    // Standard: Lv1 (1 rail) -> Lv2 (2 rails) -> Lv3 (2 heavy rails + copper EM coils + optic)
    const count = level >= 2 ? 2 : 1;
    const railOffsets = count === 2 ? [-0.26, 0.26] : [0];
    batcher.add('barrel', 'navalGray', getChamferedBoxGeo(count === 2 ? 0.82 : 0.44, 0.24, 0.62, 0.03), 0, -0.02, -0.06);

    for (const ox of railOffsets) {
      batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.2, 0.18, 1.38, 0.025), ox, 0, 0.38);
      batcher.add('barrel', 'steel', getChamferedBoxGeo(0.24, 0.22, 0.16, 0.02), ox, 0, 0.96);
      if (level >= 3) {
        batcher.add('barrel', 'copperAesa', getChamferedBoxGeo(0.23, 0.21, 0.28, 0.02), ox, 0, 0.56);
      }
      addBarbedHarpoon(batcher, ox, 0.08, 0.04, 0, level >= 3 ? 1.08 : 1.0, 'navalWhite');
    }

    if (level >= 2) {
      batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.14, 0.12, 0.22, 0.02), 0, 0.16, 0.14);
      batcher.add('barrel', 'sapphireOptic', getChamferedCylinderGeo(0.04, 0.04, 0.05, 8, 0), 0, 0.16, 0.26, Math.PI / 2, 0, 0);
    }
    muzzleZ = 1.62;
  }

  batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.08, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.08, muzzleZ + 0.08, 0.9, true);
}
