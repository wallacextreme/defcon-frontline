import * as THREE from 'three';
import {
  StaticMeshBatcher,
  getGeo,
  getChamferedBoxGeo,
  getRoundedBoxGeo,
  getChamferedCylinderGeo,
  getCutCornerSlabGeo,
  createSideExtrudeGeo,
  createPlanExtrudeGeo,
  createLatheYGeo,
  createLatheAlongZGeo,
  attachMuzzleFlashMesh,
  createContactShadowMesh
} from '../TowerRigPrimitives.ts';
import type { ModelMaterials, StructuralMatKey, TowerRig3D } from '../TowerRigPrimitives.ts';

function getSandbagPillowGeo(length = 0.5, radius = 0.14): THREE.BufferGeometry {
  const w = radius * 2.1;
  const h = radius * 1.4;
  return createSideExtrudeGeo(
    [
      [-w * 0.48, -h * 0.46],
      [w * 0.48, -h * 0.46],
      [w * 0.4, h * 0.46],
      [-w * 0.4, h * 0.46]
    ],
    length,
    0.025,
    0.025
  );
}

function addSandbagArc(
  batcher: StaticMeshBatcher,
  pivotKey: string,
  radius: number,
  count: number,
  baseY: number,
  tiers: number,
  startAng = 0,
  arcSpan = Math.PI * 2,
  bagLen = 0.48
): void {
  const bagGeo = getSandbagPillowGeo(bagLen, 0.145);
  const fullCircle = Math.abs(arcSpan - Math.PI * 2) < 1e-4;
  for (let t = 0; t < tiers; t++) {
    const tierOffset = (t % 2) * (arcSpan / Math.max(1, count) * 0.5);
    const tierCount = fullCircle ? count : Math.max(2, count - t);
    for (let i = 0; i < tierCount; i++) {
      const frac = fullCircle ? i / tierCount : tierCount === 1 ? 0.5 : i / (tierCount - 1);
      const a = startAng + frac * arcSpan + (fullCircle ? tierOffset : 0);
      batcher.add(
        pivotKey,
        'sandbag',
        bagGeo,
        Math.sin(a) * (radius - t * 0.03),
        baseY + t * 0.19,
        Math.cos(a) * (radius - t * 0.03),
        0,
        a,
        (i % 2 === 0 ? 1 : -1) * 0.03
      );
    }
  }
}

// ============================================================================
// 1. HESCO BASTION (1 level, isBarrier, no spec)
// ============================================================================

export function buildHescoModel(root: THREE.Group, mats: ModelMaterials, level: number): void {
  const batcher = new StaticMeshBatcher('hesco', level, null);

  root.add(createContactShadowMesh(1.88, 0.42));

  // Chamfered concrete plinth (corners at hypot(1.48, 0.90) = 1.73 <= 1.80)
  batcher.add('root', 'concreteDark', getCutCornerSlabGeo(2.96, 0.16, 2.96, 0.58, 0.03), 0, 0.08, 0);
  batcher.add('root', 'concrete', getCutCornerSlabGeo(2.44, 0.06, 2.44, 0.42, 0.015), 0, 0.18, 0);

  // 4 Hesco gabion cells (2x2) with corner steel stakes, wire bands, sandy fill & angular cap
  const cellFillGeo = getChamferedBoxGeo(1.06, 1.12, 1.06, 0.05);
  const cellCrownGeo = createLatheYGeo(
    [
      [0.01, 0.0],
      [0.52, 0.0],
      [0.44, 0.1],
      [0.01, 0.14]
    ],
    4
  );
  const stakeGeo = getChamferedBoxGeo(0.06, 1.24, 0.06, 0.01);
  const strapGeo = getChamferedBoxGeo(1.14, 0.04, 1.14, 0.008);

  const cellOffsets: ReadonlyArray<[number, number, number]> = [
    [-0.64, -0.64, 0.0],
    [0.64, -0.64, 0.04],
    [-0.64, 0.64, -0.03],
    [0.64, 0.64, 0.02]
  ];

  for (const [ox, oz, hJitter] of cellOffsets) {
    batcher.add('root', 'sandbag', cellFillGeo, ox, 0.74 + hJitter, oz);
    batcher.add('root', 'concrete', cellCrownGeo, ox, 1.29 + hJitter, oz, 0, Math.PI * 0.25, 0);

    for (const cx of [-0.54, 0.54]) {
      for (const cz of [-0.54, 0.54]) {
        batcher.add('root', 'darkSteel', stakeGeo, ox + cx, 0.8 + hJitter, oz + cz);
      }
    }
    batcher.add('root', 'steel', strapGeo, ox, 0.42, oz);
    batcher.add('root', 'steel', strapGeo, ox, 0.8 + hJitter * 0.5, oz);
    batcher.add('root', 'steel', strapGeo, ox, 1.18 + hJitter, oz);
  }

  // Outer protective sandbag collar (r = 1.44 + 0.15 < 1.65)
  addSandbagArc(batcher, 'root', 1.42, 12, 0.23, level >= 2 ? 2 : 1, 0, Math.PI * 2, 0.46);

  // Helical concertina wire coils along top ridge (batched in steel)
  const coilGeo = getGeo('hesco_concertina_v2', () => new THREE.TorusGeometry(0.24, 0.022, 4, 12));
  for (let i = -3; i <= 3; i++) {
    batcher.add('root', 'steel', coilGeo, i * 0.32, 1.54, 0, 0.12, Math.PI * 0.36 + i * 0.18, 0.14);
  }
  for (let i = -2; i <= 2; i++) {
    batcher.add('root', 'steel', coilGeo, 0, 1.54, i * 0.34, -0.14, Math.PI * 0.86 + i * 0.2, -0.12);
  }

  batcher.flush({ root }, mats);
}

// ============================================================================
// 2. M2 BUNKER / METRALHADORA
// ============================================================================

export function buildM2Bunker(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('m2_bunker', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88, 0.42));

  // Octagonal concrete foundation & diamond plate firing floor (radius <= 1.72)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.58, 1.7, 0.22, 8, 0.035), 0, 0.11, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.14, 1.2, 0.12, 8, 0.025), 0, 0.26, 0);

  // Casemate parapet: beveled sandbags around sides/rear + concrete casemate cheeks & steel lintel beams
  addSandbagArc(batcher, 'root', 1.4, 10, 0.28, level >= 2 ? 2 : 1, Math.PI * 0.22, Math.PI * 1.56, 0.48);

  const cheekGeo = createPlanExtrudeGeo(
    [
      [-0.36, -0.58],
      [0.34, -0.58],
      [0.44, 0.42],
      [-0.22, 0.56]
    ],
    0.72,
    0.03,
    0.03
  );
  batcher.add('root', 'concreteDark', cheekGeo, -1.04, 0.24, -0.1, 0, 0.28, 0);
  batcher.add('root', 'concreteDark', cheekGeo, 1.04, 0.24, -0.1, 0, -0.28, 0, -1, 1, 1);

  // Rear concrete casemate backstop & steel roof beams framing the firing slit
  batcher.add('root', 'concreteDark', getChamferedBoxGeo(1.52, 0.78, 0.34, 0.035), 0, 0.62, -1.06);
  for (const sx of [-0.72, 0.72]) {
    batcher.add('root', 'darkSteel', getChamferedBoxGeo(0.12, 0.96, 0.12, 0.015), sx, 0.7, -0.92);
  }
  batcher.add('root', 'darkSteel', getChamferedBoxGeo(1.76, 0.12, 0.26, 0.02), 0, 1.18, -0.82);

  if (level >= 2) {
    // Reinforced casemate armored brow lintel & firing slit frame
    batcher.add('root', 'concreteDark', getChamferedBoxGeo(1.86, 0.18, 0.74, 0.035), 0, 1.38, -0.58, -0.1, 0, 0);
    batcher.add('root', 'darkSteel', getChamferedBoxGeo(1.92, 0.08, 0.16, 0.015), 0, 1.32, -0.2);
    batcher.add('root', 'darkSteel', getChamferedBoxGeo(0.46, 0.32, 0.36, 0.03), -0.68, 0.44, -0.62);
    batcher.add('root', 'darkSteel', getChamferedBoxGeo(0.4, 0.26, 0.3, 0.025), 0.68, 0.4, -0.58);
    if (level >= 3) {
      // Lv4+ reinforced concrete side buttresses & armored roof plates
      for (const sx of [-1.08, 1.08]) {
        batcher.add('root', 'darkSteel', getChamferedBoxGeo(0.14, 0.56, 0.88, 0.02), sx, 0.96, -0.22);
      }
      batcher.add('root', 'darkSteel', getChamferedBoxGeo(1.72, 0.1, 0.62, 0.02), 0, 1.5, -0.58, -0.1, 0, 0);
    }
  } else {
    // Lv1 tactical camo net canopy over rear casemate posts
    batcher.add('root', 'camoNet', getChamferedBoxGeo(1.66, 0.06, 0.72, 0.015), 0, 1.28, -0.64, -0.2, 0, 0);
    batcher.add('root', 'darkSteel', getChamferedBoxGeo(0.42, 0.28, 0.32, 0.025), -0.68, 0.4, -0.62);
  }

  // Turret pivot
  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.32, 0.06);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.62, 0.7, 0.16, 12, 0.025), 0, 0.08, 0);

  if (level === 1) {
    // M3 heavy tripod legs + pintle + beveled gun shield
    const legGeo = getChamferedBoxGeo(0.08, 0.68, 0.08, 0.015);
    for (const ang of [0, 2.2, -2.2]) {
      batcher.add(
        'turret',
        'darkSteel',
        legGeo,
        Math.sin(ang) * 0.26,
        0.34,
        Math.cos(ang) * 0.26,
        Math.cos(ang) * 0.4,
        0,
        -Math.sin(ang) * 0.4
      );
    }
    batcher.add('turret', 'gunmetal', getChamferedCylinderGeo(0.14, 0.18, 0.34, 8, 0.02), 0, 0.66, 0);

    const shieldGeo = createSideExtrudeGeo(
      [
        [-0.04, -0.28],
        [0.05, -0.28],
        [0.09, 0.3],
        [-0.03, 0.3]
      ],
      0.88,
      0.02,
      0.02
    );
    batcher.add('turret', 'olive', shieldGeo, 0, 0.92, 0.32);
  } else if (specB) {
    // 6B APFSDS heavy turret pedestal, thick sloped mantlet shield & optic block
    batcher.add('turret', 'desertArmor', getChamferedCylinderGeo(0.44, 0.54, 0.38, 8, 0.03), 0, 0.22, 0);
    const yokeGeo = createSideExtrudeGeo(
      [
        [-0.36, 0.36],
        [0.34, 0.36],
        [0.42, 0.96],
        [0.14, 1.14],
        [-0.32, 0.96]
      ],
      0.16,
      0.02,
      0.02
    );
    batcher.add('turret', 'olive', yokeGeo, -0.4, 0, 0);
    batcher.add('turret', 'olive', yokeGeo, 0.4, 0, 0);
    batcher.add('turret', 'olive', getChamferedBoxGeo(0.98, 0.58, 0.16, 0.03), 0, 0.96, 0.34, -0.22, 0, 0);
    batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.32, 0.34, 0.46, 0.03), 0.48, 1.06, 0.14);
    batcher.add(
      'turret',
      'sapphireOptic',
      getChamferedCylinderGeo(0.08, 0.08, 0.06, 10, 0.01),
      0.48,
      1.1,
      0.38,
      Math.PI / 2,
      0,
      0
    );
    batcher.add(
      'turret',
      'opticGreen',
      getChamferedCylinderGeo(0.045, 0.045, 0.05, 8, 0.008),
      0.48,
      0.97,
      0.38,
      Math.PI / 2,
      0,
      0
    );
    for (const sx of [-0.52, 0.52]) {
      batcher.add('turret', 'specTrimB', getChamferedBoxGeo(0.06, 0.26, 0.44, 0.01), sx, 0.78, 0.04);
    }
  } else {
    // Lv2+ / 5A armored rotary turret pedestal + ammo feed drum(s)
    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.38, 0.5, 0.56, 10, 0.03), 0, 0.3, 0);
    const yokeGeo = createSideExtrudeGeo(
      [
        [-0.32, 0.42],
        [0.32, 0.42],
        [0.36, 0.94],
        [0.12, 1.08],
        [-0.3, 0.94]
      ],
      0.14,
      0.02,
      0.02
    );
    batcher.add('turret', 'oliveDark', yokeGeo, -0.34, 0, 0);
    batcher.add('turret', 'oliveDark', yokeGeo, 0.34, 0, 0);

    if (specA) {
      // 5A Vulcan GAU-19: twin lateral ammo boxes, brass feed chutes & specTrimA armor plates
      for (const sx of [-0.58, 0.58]) {
        batcher.add('turret', 'oliveDark', getChamferedBoxGeo(0.34, 0.46, 0.56, 0.03), sx, 0.62, -0.06);
        batcher.add('turret', 'brass', getChamferedBoxGeo(0.16, 0.14, 0.34, 0.02), sx * 0.68, 0.88, -0.02, 0, 0, sx * 0.45);
        batcher.add('turret', 'specTrimA', getChamferedBoxGeo(0.05, 0.24, 0.42, 0.01), sx * 1.32, 0.64, -0.06);
      }
      batcher.add('turret', 'oliveDark', getChamferedBoxGeo(0.98, 0.56, 0.1, 0.025), 0, 0.96, 0.32, -0.18, 0, 0);
    } else {
      batcher.add('turret', 'oliveDark', getChamferedCylinderGeo(0.22, 0.22, 0.38, 10, 0.025), 0.46, 0.48, -0.12);
      batcher.add('turret', 'brass', getChamferedBoxGeo(0.18, 0.12, 0.28, 0.02), 0.32, 0.78, -0.04, 0, 0, -0.55);
      batcher.add('turret', 'oliveDark', getChamferedBoxGeo(0.92, 0.54, 0.09, 0.02), 0, 0.94, 0.32, -0.18, 0, 0);
    }
  }

  // Barrel pivot (slides on Z for recoil, pitches on X for elevation)
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.96, 0.12);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  let gatlingPivot: THREE.Group | undefined;
  let muzzleZ = 1.56;

  if (level === 1) {
    batcher.add('barrel', 'gunmetal', getChamferedBoxGeo(0.24, 0.24, 0.62, 0.025), 0, 0, -0.06);
    batcher.add('barrel', 'oliveDark', getChamferedBoxGeo(0.22, 0.24, 0.3, 0.02), -0.26, -0.04, 0.02);
    batcher.add('barrel', 'brass', getChamferedBoxGeo(0.14, 0.04, 0.18, 0.008), -0.13, 0.04, 0.02, 0, 0, 0.32);

    const m2BarrelGeo = createLatheAlongZGeo(
      [
        [0.085, 0.22],
        [0.085, 0.62],
        [0.05, 0.64],
        [0.05, 1.38],
        [0.066, 1.4],
        [0.042, 1.5]
      ],
      10
    );
    batcher.add('barrel', 'gunmetal', m2BarrelGeo);
    muzzleZ = 1.54;
  } else if (specB) {
    // Heavy long tungsten APFSDS barrel + slotted muzzle brake + mantlet collar
    batcher.add('barrel', 'gunmetal', getChamferedBoxGeo(0.34, 0.32, 0.74, 0.03), 0, 0, -0.02);
    batcher.add('barrel', 'steel', getChamferedCylinderGeo(0.14, 0.16, 0.28, 10, 0.02), 0, 0, 0.42, Math.PI / 2, 0, 0);

    const apBarrelGeo = createLatheAlongZGeo(
      [
        [0.095, 0.34],
        [0.095, 0.78],
        [0.064, 0.82],
        [0.064, 1.72],
        [0.098, 1.75],
        [0.098, 1.94],
        [0.048, 1.96]
      ],
      12
    );
    batcher.add('barrel', 'gunmetal', apBarrelGeo);
    // Slotted muzzle brake baffles
    for (const bz of [1.78, 1.88]) {
      batcher.add('barrel', 'steel', getChamferedBoxGeo(0.24, 0.16, 0.05, 0.01), 0, 0, bz);
    }
    muzzleZ = 2.0;
  } else {
    // Rotary multi-barrel cannon in gatlingPivot (rotates around local Z)
    batcher.add('barrel', 'gunmetal', getChamferedBoxGeo(0.32, 0.3, 0.62, 0.03), 0, 0, -0.1);
    if (specA) {
      // Compact laser sight module on top of receiver
      batcher.add('barrel', 'gunmetal', getChamferedBoxGeo(0.16, 0.12, 0.32, 0.015), 0.18, 0.2, 0.06);
      batcher.add(
        'barrel',
        'opticGreen',
        getChamferedCylinderGeo(0.035, 0.035, 0.04, 8, 0.006),
        0.18,
        0.2,
        0.23,
        Math.PI / 2,
        0,
        0
      );
    } else {
      batcher.add(
        'barrel',
        'steel',
        getChamferedCylinderGeo(0.1, 0.1, 0.36, 10, 0.015),
        0,
        0.2,
        -0.06,
        Math.PI / 2,
        0,
        0
      );
    }

    gatlingPivot = new THREE.Group();
    gatlingPivot.position.set(0, 0, 0.22);
    barrelPivot.add(gatlingPivot);
    rig.gatlingPivot = gatlingPivot;

    const bLen = specA ? 1.44 : level >= 3 ? 1.28 : 1.16;
    const bRad = specA ? 0.029 : 0.023;
    const ringR = specA ? 0.122 : 0.096;
    const barrelCount = 6;
    const rodGeo = getGeo(
      `m2_rod:${bRad.toFixed(3)}:${bLen.toFixed(2)}`,
      () => new THREE.CylinderGeometry(bRad, bRad, bLen, 6)
    );

    batcher.add(
      'gatling',
      'gunmetal',
      getChamferedCylinderGeo(ringR + 0.055, ringR + 0.06, 0.24, 10, 0.02),
      0,
      0,
      0.04,
      Math.PI / 2,
      0,
      0
    );

    for (let i = 0; i < barrelCount; i++) {
      const a = (i / barrelCount) * Math.PI * 2;
      batcher.add(
        'gatling',
        'steel',
        rodGeo,
        Math.cos(a) * ringR,
        Math.sin(a) * ringR,
        bLen * 0.5 + 0.08,
        Math.PI / 2,
        0,
        0
      );
    }
    // Copper/brass and steel rotary clamp rings
    batcher.add(
      'gatling',
      specA ? 'copperAesa' : 'brass',
      getChamferedCylinderGeo(ringR + 0.042, ringR + 0.042, 0.08, 10, 0.012),
      0,
      0,
      bLen * 0.44 + 0.08,
      Math.PI / 2,
      0,
      0
    );
    batcher.add(
      'gatling',
      'gunmetal',
      getChamferedCylinderGeo(ringR + 0.046, ringR + 0.046, 0.09, 10, 0.015),
      0,
      0,
      bLen * 0.88 + 0.08,
      Math.PI / 2,
      0,
      0
    );
    if (specA) {
      batcher.add(
        'gatling',
        'copperAesa',
        getChamferedCylinderGeo(ringR + 0.048, ringR + 0.048, 0.07, 10, 0.012),
        0,
        0,
        bLen * 0.22 + 0.08,
        Math.PI / 2,
        0,
        0
      );
    }
    muzzleZ = bLen + 0.34;
  }

  const pivots: Record<string, THREE.Object3D> = {
    root,
    turret: turretPivot,
    barrel: barrelPivot
  };
  if (gatlingPivot) {
    pivots.gatling = gatlingPivot;
  }
  batcher.flush(pivots, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, muzzleZ + 0.06, specB ? 0.95 : 0.82);
}

// ============================================================================
// 3. M242 BUSHMASTER 25MM (IFV TURRET)
// ============================================================================

export function buildBushmaster(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('bushmaster', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88, 0.42));

  // Octagonal IFV foundation + diamond plate deck + armored turret ring (radius <= 1.66)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.5, 1.64, 0.22, 8, 0.035), 0, 0.11, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.2, 1.28, 0.14, 8, 0.025), 0, 0.28, 0);
  batcher.add('root', 'oliveDark', getChamferedCylinderGeo(0.88, 0.98, 0.2, 8, 0.03), 0, 0.45, 0);

  if (level >= 2) {
    const lugGeo = getChamferedBoxGeo(0.24, 0.16, 0.38, 0.025);
    for (const a of [0.78, 2.35, 3.92, 5.49]) {
      batcher.add('root', 'darkSteel', lugGeo, Math.sin(a) * 1.12, 0.32, Math.cos(a) * 1.12, 0, a, 0);
    }
  }

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.55, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  const hullMat: StructuralMatKey = level >= 3 || specA || specB ? 'desertArmor' : 'olive';
  const hullW = specB ? 1.72 : level >= 2 ? 1.54 : 1.38;
  const hullScale = level >= 2 ? 1.1 : 1.0;

  // Angular Bradley/LAV chamfered turret hull
  const turretHullGeo = createSideExtrudeGeo(
    [
      [-0.95 * hullScale, 0.0],
      [0.86 * hullScale, 0.0],
      [1.04 * hullScale, 0.28 * hullScale],
      [0.54 * hullScale, 0.68 * hullScale],
      [-0.78 * hullScale, 0.68 * hullScale],
      [-1.08 * hullScale, 0.32 * hullScale]
    ],
    hullW,
    0.045,
    0.045
  );
  batcher.add('turret', hullMat, turretHullGeo, 0, 0, 0);

  // Rear bustle stowage rack
  batcher.add('turret', 'oliveDark', getChamferedBoxGeo(hullW * 0.72, 0.34, 0.54, 0.03), 0, 0.42, -1.04 * hullScale);

  // Front cheek smoke grenade dischargers
  const smokeTubeGeo = getChamferedCylinderGeo(0.055, 0.055, 0.24, 6, 0.01);
  for (const sx of [-1, 1]) {
    batcher.add(
      'turret',
      'darkSteel',
      smokeTubeGeo,
      sx * (hullW * 0.5 + 0.08),
      0.4,
      0.56 * hullScale,
      Math.PI / 3,
      sx > 0 ? -0.32 : 0.32,
      0
    );
  }

  // Commander's cupola (left roof) + gunner's stabilized E/O sight pod (right roof)
  batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.26, 0.3, 0.18, 10, 0.02), -0.34, 0.78 * hullScale, -0.08);
  batcher.add('turret', 'sapphireOptic', getChamferedCylinderGeo(0.22, 0.22, 0.06, 10, 0.01), -0.34, 0.87 * hullScale, -0.08);

  batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.32, 0.26, 0.36, 0.025), 0.4, 0.8 * hullScale, 0.24);
  batcher.add('turret', 'opticGreen', getChamferedBoxGeo(0.2, 0.14, 0.06, 0.01), 0.4, 0.81 * hullScale, 0.43);

  // Compact lateral pod (left flank)
  batcher.add('turret', 'oliveDark', getChamferedBoxGeo(0.28, 0.38, 0.74, 0.03), -hullW * 0.5 - 0.16, 0.38, -0.04);
  batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.22, 0.28, 0.08, 0.015), -hullW * 0.5 - 0.16, 0.38, 0.35);

  if (level >= 2 && !specA && !specB) {
    // Applique flank armor tiles & rear brass ammo cans
    for (const sx of [-hullW * 0.5 - 0.06, hullW * 0.5 + 0.06]) {
      batcher.add('turret', 'oliveDark', getChamferedBoxGeo(0.1, 0.32, 0.96, 0.02), sx, 0.34, 0.02);
    }
    batcher.add('turret', 'brass', getChamferedCylinderGeo(0.16, 0.16, 0.36, 8, 0.02), 0.4, 0.68, -1.06);
    if (level >= 3) {
      // Lv4+ ERA cheek wedges & elevated tactical mast
      for (const sx of [-1, 1]) {
        batcher.add('turret', 'oliveDark', getChamferedBoxGeo(0.48, 0.36, 0.52, 0.03), sx * 0.54, 0.36, 0.72, 0, sx * -0.38, 0);
      }
      batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.05, 0.06, 0.42, 6, 0.01), -0.44, 0.98, -0.45);
    }
  }

  if (specA) {
    // 5A Sabot DU Mark II: armored DU drum bustle, angular laser rangefinder & specTrimA flank plates
    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.3, 0.32, 0.52, 10, 0.03), 0, 0.68, -0.96, 0, 0, Math.PI / 2);
    batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.34, 0.24, 0.44, 0.025), -0.34, 1.0, 0.12);
    batcher.add('turret', 'specTrimA', getChamferedBoxGeo(0.22, 0.12, 0.06, 0.01), -0.34, 1.0, 0.35);
    for (const sx of [-1, 1]) {
      batcher.add('turret', 'oliveDark', getChamferedBoxGeo(0.14, 0.36, 1.08, 0.025), sx * (hullW * 0.5 + 0.06), 0.36, 0.04);
      batcher.add('turret', 'specTrimA', getChamferedBoxGeo(0.05, 0.14, 0.72, 0.01), sx * (hullW * 0.5 + 0.14), 0.42, 0.04);
    }
  } else if (specB) {
    // 6B Dual 40mm HEIT: twin external HEIT feed hoppers + wide twin flank pods + specTrimB
    for (const sx of [-1, 1]) {
      batcher.add('turret', 'oliveDark', getChamferedBoxGeo(0.3, 0.4, 0.88, 0.03), sx * (hullW * 0.5 + 0.14), 0.4, 0.02);
      batcher.add('turret', 'brass', getChamferedBoxGeo(0.2, 0.22, 0.42, 0.02), sx * 0.52, 0.68, -0.88);
      batcher.add('turret', 'specTrimB', getChamferedBoxGeo(0.05, 0.16, 0.64, 0.01), sx * (hullW * 0.5 + 0.3), 0.42, 0.02);
    }
  }

  // Barrel pivot
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.36 * hullScale, 0.96 * hullScale);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  let muzzleZ = 1.65;

  if (specB) {
    // Twin parallel 40mm HEIT barrels with fragmentation muzzle brakes
    batcher.add('barrel', 'gunmetal', getChamferedBoxGeo(0.7, 0.34, 0.4, 0.03), 0, 0, 0.06);
    batcher.add('barrel', 'brass', getChamferedBoxGeo(0.56, 0.12, 0.3, 0.02), 0, -0.18, 0.04);

    const twinBarrelGeo = createLatheAlongZGeo(
      [
        [0.095, 0.18],
        [0.095, 0.64],
        [0.064, 0.68],
        [0.064, 1.48],
        [0.096, 1.5],
        [0.092, 1.68],
        [0.048, 1.7]
      ],
      10
    );
    for (const bx of [-0.21, 0.21]) {
      batcher.add('barrel', 'gunmetal', twinBarrelGeo, bx, 0, 0);
      batcher.add('barrel', 'steel', getChamferedBoxGeo(0.18, 0.12, 0.06, 0.01), bx, 0, 1.58);
    }
    muzzleZ = 1.74;
  } else if (specA) {
    // Elongated HVAP / DU Sabot 50mm barrel with thermal sleeve & bore evacuator
    batcher.add('barrel', 'gunmetal', getChamferedBoxGeo(0.48, 0.36, 0.44, 0.03), 0, 0, 0.08);
    batcher.add('barrel', 'specTrimA', getChamferedBoxGeo(0.52, 0.08, 0.26, 0.01), 0, 0.16, 0.1);

    const hvapGeo = createLatheAlongZGeo(
      [
        [0.125, 0.2],
        [0.125, 0.72],
        [0.078, 0.76],
        [0.078, 1.16],
        [0.105, 1.2],
        [0.105, 1.38],
        [0.072, 1.42],
        [0.072, 1.9],
        [0.102, 1.92],
        [0.095, 2.08],
        [0.048, 2.1]
      ],
      12
    );
    batcher.add('barrel', 'gunmetal', hvapGeo);
    batcher.add('barrel', 'steel', getChamferedCylinderGeo(0.088, 0.088, 0.24, 10, 0.015), 0, 0, 0.96, Math.PI / 2, 0, 0);
    muzzleZ = 2.14;
  } else {
    // Standard 25mm Bushmaster fluted barrel (extended & heavier at Lv2+)
    batcher.add('barrel', 'gunmetal', getChamferedBoxGeo(0.36, 0.3, 0.38, 0.025), 0, 0, 0.06);
    const lenScale = level >= 2 ? 1.12 : 1.0;
    const bushGeo = createLatheAlongZGeo(
      [
        [0.1, 0.18],
        [0.1, 0.56 * lenScale],
        [0.062, 0.6 * lenScale],
        [0.062, 1.34 * lenScale],
        [0.086, 1.36 * lenScale],
        [0.076, 1.52 * lenScale],
        [0.044, 1.54 * lenScale]
      ],
      10
    );
    batcher.add('barrel', 'gunmetal', bushGeo);
    // Fluted cooling collar rings
    for (const rz of [0.76, 0.96, 1.16]) {
      batcher.add(
        'barrel',
        'steel',
        getChamferedCylinderGeo(0.075, 0.075, 0.06, 8, 0.01),
        0,
        0,
        rz * lenScale,
        Math.PI / 2,
        0,
        0
      );
    }
    muzzleZ = 1.58 * lenScale;
  }

  batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, muzzleZ + 0.06, specA || specB ? 1.15 : 0.98);
}

// ============================================================================
// 4. BALLISTA (MODERN TACTICAL CARBON-STEEL & BRASS SCORPION)
// ============================================================================

export function buildBallista(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('ballista', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.86, 0.4));

  // Concrete base + diamond plate deck + sandbag parapet (radius <= 1.62)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.48, 1.6, 0.2, 8, 0.03), 0, 0.1, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.12, 1.18, 0.1, 8, 0.02), 0, 0.24, 0);
  addSandbagArc(batcher, 'root', 1.36, 8, 0.24, 1, 0, Math.PI * 2, 0.52);

  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.29, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Armored hydraulic tripod pedestal + central column + elevation yoke
  batcher.add('turret', 'gunmetal', getChamferedCylinderGeo(0.46, 0.56, 0.14, 10, 0.02), 0, 0.07, 0);
  const legGeo = getChamferedBoxGeo(0.14, 0.58, 0.16, 0.02);
  const cylGeo = getChamferedCylinderGeo(0.05, 0.05, 0.44, 8, 0.01);
  for (const ang of [0, 2.094, -2.094]) {
    batcher.add(
      'turret',
      'darkSteel',
      legGeo,
      Math.sin(ang) * 0.38,
      0.26,
      Math.cos(ang) * 0.38,
      Math.cos(ang) * 0.48,
      0,
      -Math.sin(ang) * 0.48
    );
    batcher.add(
      'turret',
      'brass',
      cylGeo,
      Math.sin(ang) * 0.46,
      0.24,
      Math.cos(ang) * 0.46,
      Math.cos(ang) * 0.38,
      0,
      -Math.sin(ang) * 0.38
    );
  }
  batcher.add('turret', 'oliveDark', getChamferedCylinderGeo(0.32, 0.4, 0.46, 8, 0.025), 0, 0.42, 0);
  const yokeGeo = createSideExtrudeGeo(
    [
      [-0.22, 0.0],
      [0.22, 0.0],
      [0.16, 0.36],
      [-0.16, 0.36]
    ],
    0.1,
    0.015,
    0.015
  );
  batcher.add('turret', 'darkSteel', yokeGeo, -0.26, 0.56, 0.04);
  batcher.add('turret', 'darkSteel', yokeGeo, 0.26, 0.56, 0.04);

  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.82, 0.05);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  // Grooved tactical rail body
  const railWidth = specB ? 0.84 : specA ? 0.42 : 0.32;
  batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(railWidth, 0.14, 1.84, 0.025), 0, 0, 0.26);
  // Side rail guide walls forming the grooved bolt track
  for (const sx of [-1, 1]) {
    batcher.add(
      'barrel',
      'steel',
      getChamferedBoxGeo(0.06, 0.08, 1.62, 0.012),
      sx * (railWidth * 0.5 - 0.03),
      0.1,
      0.34
    );
  }
  // Rear winch & trigger housing + sight optic
  batcher.add('barrel', 'gunmetal', getChamferedBoxGeo(0.36, 0.24, 0.46, 0.025), 0, 0.06, -0.56);
  batcher.add('barrel', 'brass', getChamferedCylinderGeo(0.12, 0.12, 0.42, 10, 0.015), 0, 0.1, -0.6, 0, 0, Math.PI / 2);
  batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.14, 0.12, 0.24, 0.015), 0.2, 0.2, -0.22);
  batcher.add('barrel', 'sapphireOptic', getChamferedCylinderGeo(0.04, 0.04, 0.05, 8, 0.008), 0.2, 0.2, -0.09, Math.PI / 2, 0, 0);

  // Twin torsion drums (brass cylinders + gunmetal caps)
  const drumX = specB ? 0.58 : 0.44;
  const drumR = specA ? 0.2 : 0.16;
  const drumGeo = getChamferedCylinderGeo(drumR, drumR, 0.44, 8, 0.02);
  const drumCapGeo = getChamferedCylinderGeo(drumR + 0.025, drumR + 0.025, 0.06, 8, 0.01);
  for (const sx of [-1, 1]) {
    batcher.add('barrel', 'brass', drumGeo, sx * drumX, 0.05, 0.8);
    batcher.add('barrel', 'gunmetal', drumCapGeo, sx * drumX, 0.28, 0.8);
    batcher.add('barrel', 'gunmetal', drumCapGeo, sx * drumX, -0.18, 0.8);
  }

  if (level >= 2 && !specA && !specB) {
    // Lv2+ lateral bolt magazine & armored prods
    batcher.add('barrel', 'oliveDark', getChamferedBoxGeo(0.2, 0.18, 0.52, 0.02), -0.32, -0.06, -0.12);
    if (level >= 3) {
      for (const sx of [-1, 1]) {
        batcher.add('barrel', 'oliveDark', getChamferedBoxGeo(0.1, 0.28, 0.68, 0.02), sx * 0.26, 0.14, 0.35, 0, sx * 0.16, 0);
      }
    }
  }

  // Compound angled bow limbs (carbon steel) + tension string rods
  const spanHalf = specB ? 1.18 : specA ? 1.12 : 0.94 + level * 0.06;
  const limbGeo = createPlanExtrudeGeo(
    [
      [0.0, -0.09],
      [spanHalf - drumX + 0.18, -0.28],
      [spanHalf - drumX + 0.22, -0.16],
      [0.04, 0.08]
    ],
    0.1,
    0.018,
    0.018
  );
  batcher.add('barrel', 'steel', limbGeo, drumX - 0.04, 0.0, 0.82);
  batcher.add('barrel', 'steel', limbGeo, -(drumX - 0.04), 0.0, 0.82, 0, 0, 0, -1, 1, 1);

  const stringGeo = getGeo('ballista_string_v2', () => new THREE.CylinderGeometry(0.014, 0.014, 1.0, 4));
  const tipX = spanHalf + 0.1;
  const tipZ = 0.58;
  const latchZ = -0.24;
  const strLen = Math.hypot(tipX, tipZ - latchZ);
  const strAng = Math.atan2(tipX, tipZ - latchZ);
  for (const sx of [-1, 1]) {
    batcher.add(
      'barrel',
      'brass',
      stringGeo,
      sx * tipX * 0.5,
      0.11,
      (tipZ + latchZ) * 0.5,
      Math.PI / 2,
      sx * strAng,
      0,
      1,
      strLen,
      1
    );
  }

  // Bolts & spec differentiation
  if (specA) {
    // 5A Depleted Uranium Siege Crossbow: stacked twin-tier arched yoke + raised hydraulic torsion towers + shield mantlet + DU mega-bolt
    const archShieldGeo = createSideExtrudeGeo(
      [
        [-0.24, 0.0],
        [0.24, 0.0],
        [0.08, 0.52],
        [-0.22, 0.52]
      ],
      0.78,
      0.025,
      0.025
    );
    batcher.add('barrel', 'oliveDark', archShieldGeo, 0, 0.16, 0.42);
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.92, 0.14, 0.32, 0.025), 0, 0.68, 0.44);
    batcher.add('barrel', 'specTrimA', getChamferedBoxGeo(0.84, 0.05, 0.1, 0.01), 0, 0.7, 0.62);

    // Tall elevated torsion-damper towers + upper secondary prod limbs visible clearly in 64px & C1
    for (const sx of [-1, 1]) {
      batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.2, 0.54, 0.32, 0.025), sx * 0.56, 0.34, 0.72);
      batcher.add('barrel', 'brass', getChamferedCylinderGeo(0.085, 0.085, 0.48, 8, 0.012), sx * 0.36, 0.4, 0.06, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'steel', getChamferedBoxGeo(0.72, 0.09, 0.14, 0.015), sx * 0.92, 0.52, 0.68, 0, sx * -0.22, 0);
      batcher.add('barrel', 'specTrimA', getChamferedBoxGeo(0.05, 0.09, 1.15, 0.008), sx * 0.24, 0.14, 0.3);
    }
    const megaBoltGeo = createLatheAlongZGeo(
      [
        [0.068, -0.18],
        [0.068, 1.02],
        [0.115, 1.05],
        [0.004, 1.56]
      ],
      8
    );
    batcher.add('barrel', 'gunmetal', megaBoltGeo, 0, 0.16, 0.18);
    batcher.add('barrel', 'specTrimA', getChamferedCylinderGeo(0.078, 0.078, 0.14, 8, 0.01), 0, 0.16, 1.14, Math.PI / 2, 0, 0);
  } else if (specB) {
    // 6B Quad Battery: 4 parallel loaded tungsten bolts + rotary magazine feeder + specTrimB cheeks
    batcher.add('barrel', 'oliveDark', getChamferedCylinderGeo(0.24, 0.24, 0.62, 10, 0.02), 0, -0.16, 0.04, 0, 0, Math.PI / 2);
    const smallBoltGeo = createLatheAlongZGeo(
      [
        [0.026, -0.14],
        [0.026, 0.92],
        [0.048, 0.94],
        [0.004, 1.24]
      ],
      6
    );
    for (const bx of [-0.3, -0.1, 0.1, 0.3]) {
      batcher.add('barrel', 'steel', smallBoltGeo, bx, 0.11, 0.12);
      batcher.add('barrel', 'brass', getChamferedBoxGeo(0.04, 0.06, 0.16, 0.008), bx, 0.12, 0.04);
    }
    for (const sx of [-1, 1]) {
      batcher.add('barrel', 'specTrimB', getChamferedBoxGeo(0.05, 0.08, 1.1, 0.008), sx * 0.45, 0.02, 0.26);
    }
  } else {
    // Standard loaded tungsten bolt (steel shaft, gunmetal head, brass fins)
    const boltGeo = createLatheAlongZGeo(
      [
        [0.036, -0.15],
        [0.036, 0.94],
        [0.065, 0.96],
        [0.004, 1.28]
      ],
      8
    );
    batcher.add('barrel', 'steel', boltGeo, 0, 0.11, 0.12);
    batcher.add('barrel', 'brass', getChamferedBoxGeo(0.09, 0.04, 0.18, 0.008), 0, 0.11, 0.05);
  }

  batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

  const muzzleZ = specA ? 1.56 : 1.42;
  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.12, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.12, muzzleZ + 0.06, 0.72);
}

// ============================================================================
// 5. SNIPER TOWER (ELEVATED LATTICE WATCHTOWER + .50 CAL / HYPERSONIC RAIL)
// ============================================================================

export function buildSniperTower(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('sniper_tower', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88, 0.42));

  // Cut-corner concrete slab (corner hypot(1.32, 0.82) = 1.55 <= 1.84)
  batcher.add('root', 'concreteDark', getCutCornerSlabGeo(2.64, 0.2, 2.64, 0.5, 0.03), 0, 0.1, 0);

  // 4 reinforced tapered steel legs + concrete footings + X-bracing lattice struts
  const legGeo = getChamferedBoxGeo(0.14, 1.62, 0.14, 0.02);
  const footGeo = getChamferedBoxGeo(0.3, 0.14, 0.3, 0.025);
  const corners: ReadonlyArray<[number, number, number, number]> = [
    [-0.86, -0.86, 0.1, -0.1],
    [0.86, -0.86, 0.1, 0.1],
    [-0.86, 0.86, -0.1, -0.1],
    [0.86, 0.86, -0.1, 0.1]
  ];
  for (const [lx, lz, rx, rz] of corners) {
    batcher.add('root', 'concreteDark', footGeo, lx * 1.06, 0.22, lz * 1.06);
    batcher.add('root', 'darkSteel', legGeo, lx, 0.94, lz, rx, 0, rz);
  }

  // Horizontal ring girders + diagonal X-braces on all 4 faces (terminated inside tapered corner columns)
  const hBeamGeo = getChamferedBoxGeo(1.6, 0.09, 0.09, 0.012);
  const xBraceGeo = getChamferedBoxGeo(1.52, 0.065, 0.065, 0.01);
  for (const side of [-1, 1]) {
    batcher.add('root', 'steel', hBeamGeo, 0, 0.92, side * 0.86);
    batcher.add('root', 'steel', hBeamGeo, side * 0.86, 0.92, 0, 0, Math.PI / 2, 0);
    batcher.add('root', 'darkSteel', xBraceGeo, 0, 0.92, side * 0.86, 0, 0, 0.68);
    batcher.add('root', 'darkSteel', xBraceGeo, 0, 0.92, side * 0.86, 0, 0, -0.68);
    batcher.add('root', 'darkSteel', xBraceGeo, side * 0.86, 0.92, 0, 0, Math.PI / 2, 0.68);
    batcher.add('root', 'darkSteel', xBraceGeo, side * 0.86, 0.92, 0, 0, Math.PI / 2, -0.68);
  }

  // Elevated chamfered sniper nest deck + armored parapet walls
  batcher.add('root', 'oliveDark', getCutCornerSlabGeo(2.14, 0.16, 2.14, 0.36, 0.03), 0, 1.72, 0);
  batcher.add('root', 'diamondPlate', getCutCornerSlabGeo(1.86, 0.04, 1.86, 0.3, 0.01), 0, 1.81, 0);

  const parapetGeo = getChamferedBoxGeo(1.78, 0.3, 0.1, 0.02);
  for (const side of [-1, 1]) {
    batcher.add('root', level >= 2 ? 'oliveDark' : 'camoNet', parapetGeo, 0, 1.94, side * 0.96);
    batcher.add('root', level >= 2 ? 'oliveDark' : 'camoNet', parapetGeo, side * 0.96, 1.94, 0, 0, Math.PI / 2, 0);
  }
  if (level >= 3) {
    // Lv4+ corner armor pillars & weather/ballistic sensor mast on watchtower deck
    for (const [px, pz] of [[-0.86, -0.86], [0.86, -0.86], [-0.86, 0.86], [0.86, 0.86]]) {
      batcher.add('root', 'darkSteel', getChamferedBoxGeo(0.16, 0.56, 0.16, 0.02), px, 2.08, pz);
    }
    batcher.add('root', 'steel', getChamferedCylinderGeo(0.04, 0.05, 0.68, 6, 0.008), -0.84, 2.48, -0.84);
  }

  // Turret pivot atop nest
  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 1.84, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  batcher.add('turret', 'olive', getChamferedCylinderGeo(0.46, 0.56, 0.24, 10, 0.03), 0, 0.12, 0);
  batcher.add('turret', 'olive', getChamferedBoxGeo(0.56, 0.24, 0.44, 0.025), 0, 0.24, -0.34);

  const cradleGeo = createSideExtrudeGeo(
    [
      [-0.24, 0.0],
      [0.24, 0.0],
      [0.18, 0.32],
      [-0.18, 0.32]
    ],
    0.1,
    0.015,
    0.015
  );
  batcher.add('turret', 'darkSteel', cradleGeo, -0.22, 0.2, 0.06);
  batcher.add('turret', 'darkSteel', cradleGeo, 0.22, 0.2, 0.06);

  if (specA) {
    for (const sx of [-0.34, 0.34]) {
      batcher.add('turret', 'specTrimA', getChamferedBoxGeo(0.05, 0.2, 0.46, 0.01), sx, 0.32, -0.06);
    }
  } else if (specB) {
    // Lateral EM capacitor banks on the turret cradle
    for (const sx of [-0.4, 0.4]) {
      batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.22, 0.28, 0.56, 0.025), sx, 0.32, -0.06);
      batcher.add('turret', 'copperAesa', getChamferedCylinderGeo(0.07, 0.07, 0.44, 8, 0.01), sx, 0.48, -0.06, Math.PI / 2, 0, 0);
      batcher.add('turret', 'specTrimB', getChamferedBoxGeo(0.04, 0.14, 0.44, 0.008), sx * 1.32, 0.32, -0.06);
    }
  }

  // Barrel pivot: Barrett .50 / Sabot / Hypersonic Rail rifle
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.48, 0.1);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  // Receiver + magazine + scope + lateral rangefinder
  batcher.add('barrel', 'gunmetal', getChamferedBoxGeo(0.26, 0.24, 0.96, 0.025), 0, 0, 0.04);
  batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.14, 0.22, 0.26, 0.02), 0, -0.18, 0.06);

  const scopeGeo = createLatheAlongZGeo(
    [
      [0.052, -0.24],
      [0.052, -0.14],
      [0.036, -0.12],
      [0.036, 0.18],
      [0.066, 0.22],
      [0.066, 0.42]
    ],
    10
  );
  batcher.add('barrel', 'darkSteel', scopeGeo, 0, 0.2, 0.08);
  batcher.add('barrel', 'sapphireOptic', getChamferedCylinderGeo(0.052, 0.052, 0.04, 8, 0.008), 0, 0.2, 0.51, Math.PI / 2, 0, 0);

  // Side laser rangefinder module
  batcher.add('barrel', 'steel', getChamferedBoxGeo(0.14, 0.12, 0.34, 0.015), 0.2, 0.06, 0.18);
  batcher.add('barrel', 'opticGreen', getChamferedCylinderGeo(0.032, 0.032, 0.04, 8, 0.006), 0.2, 0.06, 0.36, Math.PI / 2, 0, 0);

  let muzzleZ = 2.66;

  if (specA) {
    // 5A Calibre .50 Sabot Letal: extra-long heavy bull-barrel + massive suppressor/brake + multi-lens optic block
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.18, 0.18, 0.56, 0.02), -0.22, 0.1, 0.16);
    batcher.add('barrel', 'sapphireOptic', getChamferedCylinderGeo(0.055, 0.055, 0.05, 8, 0.008), -0.22, 0.1, 0.45, Math.PI / 2, 0, 0);
    batcher.add('barrel', 'specTrimA', getChamferedBoxGeo(0.3, 0.06, 0.58, 0.008), 0, 0.12, 0.18);

    const sabotBarrelGeo = createLatheAlongZGeo(
      [
        [0.075, 0.48],
        [0.075, 0.96],
        [0.058, 0.98],
        [0.058, 2.18],
        [0.095, 2.22],
        [0.095, 2.86],
        [0.05, 2.9]
      ],
      10
    );
    batcher.add('barrel', 'gunmetal', sabotBarrelGeo);
    // Massive rectangular muzzle brake / suppressor fins
    batcher.add('barrel', 'steel', getChamferedBoxGeo(0.24, 0.18, 0.28, 0.02), 0, 0, 2.74);
    muzzleZ = 2.94;
  } else if (specB) {
    // 6B Perfuração Hipersônica 6x: twin parallel EM accelerator rails + shroud + specTrimB rail strips
    const railLen = 2.38;
    for (const sx of [-0.14, 0.14]) {
      batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.09, 0.24, railLen, 0.015), sx, 0, 0.46 + railLen * 0.5);
      batcher.add('barrel', 'specTrimB', getChamferedBoxGeo(0.03, 0.06, railLen * 0.82, 0.006), sx * 1.38, 0, 0.46 + railLen * 0.5);
    }
    batcher.add('barrel', 'steel', getChamferedCylinderGeo(0.046, 0.055, railLen - 0.1, 8, 0.008), 0, 0, 0.46 + railLen * 0.5, Math.PI / 2, 0, 0);
    // Accelerator muzzle collar & mid support clamps
    for (const cz of [1.2, 1.95, 2.72]) {
      batcher.add('barrel', 'gunmetal', getChamferedBoxGeo(0.36, 0.28, 0.12, 0.018), 0, 0, cz);
    }
    muzzleZ = 2.9;
  } else {
    // Base / Lv2 / Lv3 .50 BMG anti-materiel barrel + rectangular Barrett muzzle brake
    const barrelLen = 2.12 + Math.min(2, level - 1) * 0.22;
    const rifleGeo = createLatheAlongZGeo(
      [
        [0.072, 0.48],
        [0.072, 0.88],
        [0.048, 0.92],
        [0.048, 0.48 + barrelLen],
        [0.064, 0.5 + barrelLen]
      ],
      10
    );
    batcher.add('barrel', 'gunmetal', rifleGeo);
    batcher.add('barrel', 'steel', getChamferedBoxGeo(0.22, 0.14, 0.22, 0.018), 0, 0, 0.52 + barrelLen);
    muzzleZ = 0.66 + barrelLen;
  }

  batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, muzzleZ + 0.06, specA ? 1.1 : 0.95, specB);
}
