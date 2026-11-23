import * as THREE from 'three';
import type {
  ModelMaterials,
  StructuralMatKey,
  TowerRig3D
} from '../TowerRigPrimitives.ts';
import {
  StaticMeshBatcher,
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

function getSimpleBoxGeo(w: number, h: number, d: number): THREE.BufferGeometry {
  return getGeo(`elem_box:${w.toFixed(3)}:${h.toFixed(3)}:${d.toFixed(3)}`, () => new THREE.BoxGeometry(w, h, d));
}

function getSimpleCylGeo(rt: number, rb: number, h: number, seg = 8): THREE.BufferGeometry {
  return getGeo(
    `elem_cyl:${rt.toFixed(3)}:${rb.toFixed(3)}:${h.toFixed(3)}:${seg}`,
    () => new THREE.CylinderGeometry(rt, rb, h, seg)
  );
}

// ============================================================================
// 1. CRYO TOWER — LN2 Cryogenic Thermal Suppression Battery
// ============================================================================

export function buildCryoTower(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('cryo_tower', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';
  const trimMat: StructuralMatKey = specA ? 'specTrimA' : specB ? 'specTrimB' : 'specTrimTier';

  root.add(createContactShadowMesh(1.88));

  // Octagonal insulated concrete plinth + raised diamond-plate service deck (r <= 1.74 at y <= 0.28)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.6, 1.74, 0.22, 8, 0.04), 0, 0.11, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.3, 1.38, 0.14, 8, 0.025), 0, 0.29, 0);

  // 4 octagonal anchor tie-down lugs (strictly inside r <= 1.66)
  const lugGeo = getChamferedBoxGeo(0.24, 0.16, 0.34, 0.025);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    batcher.add('root', 'darkSteel', lugGeo, Math.sin(a) * 1.4, 0.22, Math.cos(a) * 1.4, 0, a, 0);
  }

  // Rear cryo manifold skid & flanged cryogenic transfer piping
  batcher.add('root', 'darkSteel', getChamferedBoxGeo(1.56, 0.14, 0.54, 0.025), 0, 0.42, -0.56);
  const pipeHorizGeo = getSimpleCylGeo(0.06, 0.06, 1.46, 8);
  const flangeGeo = getSimpleCylGeo(0.105, 0.105, 0.055, 8);
  batcher.add('root', 'darkSteel', pipeHorizGeo, 0, 0.56, -0.56, 0, 0, Math.PI / 2);
  for (const fx of [-0.52, 0, 0.52]) {
    batcher.add('root', 'brass', flangeGeo, fx, 0.56, -0.56, 0, 0, Math.PI / 2);
  }

  // Insulated LN2 vacuum Dewar tanks (heavier twin cryo vessels on specA)
  const tankR = specA ? 0.31 : level >= 3 ? 0.28 : 0.25;
  const tankH = specA ? 1.24 : level >= 2 ? 1.06 : 0.92;
  const tankX = specA ? 0.86 : 0.82;
  const tankZ = -0.46;
  const tankGeo = createLatheYGeo(
    [
      [0.01, 0.0],
      [tankR * 0.86, 0.0],
      [tankR, 0.09],
      [tankR, tankH - 0.12],
      [tankR * 0.78, tankH],
      [0.01, tankH + 0.04]
    ],
    12
  );
  const bandGeo = getSimpleCylGeo(tankR + 0.022, tankR + 0.022, 0.065, 10);
  const valveCapGeo = getSimpleCylGeo(0.068, 0.092, 0.14, 8);
  const ribGeo = getSimpleBoxGeo(0.048, tankH * 0.82, 0.058);
  const slitFrameGeo = getSimpleBoxGeo(0.095, 0.38, 0.055);
  const slitCoreGeo = getSimpleBoxGeo(0.038, 0.3, 0.026);

  for (const sx of [-tankX, tankX]) {
    const sign = sx < 0 ? -1 : 1;
    batcher.add('root', 'navalWhite', tankGeo, sx, 0.36, tankZ);
    batcher.add('root', 'darkSteel', bandGeo, sx, 0.58, tankZ);
    batcher.add('root', 'darkSteel', bandGeo, sx, 0.36 + tankH * 0.68, tankZ);
    batcher.add('root', 'brass', valveCapGeo, sx, 0.36 + tankH + 0.08, tankZ);

    // Protective darkSteel armor ribs flanking each tank + narrow recessed cyan fluid sight-glass (<= 2% emissive)
    for (const ang of [-0.65, 0.65, Math.PI]) {
      const a = sign > 0 ? ang : Math.PI - ang;
      batcher.add(
        'root',
        'darkSteel',
        ribGeo,
        sx + Math.cos(a) * (tankR + 0.015),
        0.36 + tankH * 0.46,
        tankZ + Math.sin(a) * (tankR + 0.015),
        0,
        -a,
        0
      );
    }
    batcher.add('root', 'darkSteel', slitFrameGeo, sx + sign * (tankR - 0.004), 0.36 + tankH * 0.48, tankZ, 0, Math.PI / 2, 0);
    batcher.add('root', 'radarCyan', slitCoreGeo, sx + sign * (tankR + 0.018), 0.36 + tankH * 0.48, tankZ, 0, Math.PI / 2, 0);

    // SpecA heavy cryo blast shields & discrete specTrimA accent strips
    if (specA) {
      batcher.add('root', 'darkSteel', getChamferedBoxGeo(0.08, tankH * 0.78, 0.44, 0.02), sx + sign * (tankR + 0.07), 0.36 + tankH * 0.44, tankZ + 0.12, 0, sign * 0.36, 0);
      batcher.add('root', 'specTrimA', getSimpleBoxGeo(0.036, 0.42, 0.048), sx + sign * (tankR + 0.11), 0.36 + tankH * 0.5, tankZ + 0.16, 0, sign * 0.36, 0);
    }
  }

  // Upper inter-tank balance conduit at Lv2+
  if (level >= 2) {
    const crossY = 0.36 + tankH - 0.12;
    batcher.add('root', 'darkSteel', getSimpleCylGeo(0.044, 0.044, tankX * 1.9, 8), 0, crossY, tankZ, 0, 0, Math.PI / 2);
    batcher.add('root', 'brass', flangeGeo, 0, crossY, tankZ, 0, 0, Math.PI / 2);
  }

  // Turret pivot
  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.36, 0.08);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Armored slewing collar + contoured thermal compressor hull
  batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.68, 0.76, 0.2, 10, 0.03), 0, 0.1, 0);
  const hullGeo = createSideExtrudeGeo(
    [
      [-0.58, 0.18],
      [0.54, 0.18],
      [0.64, 0.44],
      [0.42, 0.78],
      [-0.46, 0.82],
      [-0.64, 0.52]
    ],
    0.96,
    0.03,
    0.03
  );
  batcher.add('turret', 'navalWhite', hullGeo, 0, 0, 0);
  batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.84, 0.24, 0.44, 0.025), 0, 0.52, -0.52);
  batcher.add('turret', 'brass', getSimpleCylGeo(0.078, 0.078, 0.62, 8), 0, 0.68, -0.5, 0, 0, Math.PI / 2);

  // Side thermal heat-exchanger fin racks (Lv3+ non-specB)
  if (level >= 3 && !specB) {
    const finGeo = getSimpleBoxGeo(0.055, 0.38, 0.48);
    for (const sx of [-0.58, 0.58]) {
      for (let f = 0; f < 3; f++) {
        batcher.add('turret', 'darkSteel', finGeo, sx + (sx > 0 ? f * 0.075 : -f * 0.075), 0.52, -0.08);
      }
    }
  }

  if (level >= 4 && !specA && !specB) {
    batcher.add('turret', trimMat, getSimpleBoxGeo(0.038, 0.055, 0.46), -0.51, 0.64, 0.05);
    batcher.add('turret', trimMat, getSimpleBoxGeo(0.038, 0.055, 0.46), 0.51, 0.64, 0.05);
  }

  // Barrel pivot
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.78, 0.28);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  let muzzleZ = 1.44;

  if (specB) {
    // 6B: Tempestade Ártica Perpétua — 360° diffuser dome with 4 radial vortex nozzles + wide heat exchangers
    const domeGeo = createLatheYGeo(
      [
        [0.01, 0.0],
        [0.58, 0.0],
        [0.64, 0.16],
        [0.54, 0.48],
        [0.32, 0.72],
        [0.01, 0.8]
      ],
      14
    );
    batcher.add('turret', 'navalWhite', domeGeo, 0, 0.8, -0.02);
    batcher.add('turret', 'darkSteel', getSimpleCylGeo(0.46, 0.52, 0.12, 12), 0, 1.38, -0.02);
    batcher.add('turret', 'brass', getSimpleCylGeo(0.22, 0.27, 0.12, 10), 0, 1.62, -0.02);
    batcher.add(
      'turret',
      'specTrimB',
      getGeo('elem_cryo_6b_crown', () => new THREE.TorusGeometry(0.49, 0.024, 4, 18)),
      0,
      1.38,
      -0.02,
      Math.PI / 2,
      0,
      0
    );

    // 4 radial 360° vortex spray nozzles + 4 wide twin-plate heat exchangers
    const radialNozGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.13, 0.0],
        [0.11, 0.34],
        [0.18, 0.54],
        [0.14, 0.58],
        [0.01, 0.46]
      ],
      8
    );
    const exchPlateGeo = getChamferedBoxGeo(0.56, 0.46, 0.12, 0.02);
    const exchFinGeo = getSimpleBoxGeo(0.48, 0.05, 0.18);
    const exchTrimGeo = getSimpleBoxGeo(0.34, 0.04, 0.04);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      batcher.add('turret', 'darkSteel', radialNozGeo, Math.sin(a) * 0.54, 1.12, Math.cos(a) * 0.54 - 0.02, 0, a, 0);
      batcher.add('turret', 'brass', getSimpleCylGeo(0.135, 0.135, 0.05, 8), Math.sin(a) * 0.72, 1.12, Math.cos(a) * 0.72 - 0.02, Math.PI / 2, 0, -a);

      // Wide radial heat exchanger banks on lower turret skirt
      batcher.add('turret', 'darkSteel', exchPlateGeo, Math.sin(a) * 0.88, 0.46, Math.cos(a) * 0.88, 0, a, 0);
      batcher.add('turret', 'darkSteel', exchFinGeo, Math.sin(a) * 0.88, 0.58, Math.cos(a) * 0.88, 0, a, 0);
      batcher.add('turret', 'specTrimB', exchTrimGeo, Math.sin(a) * 0.96, 0.66, Math.cos(a) * 0.96, 0, a, 0);
    }

    // Compact forward cryo emitter stub on barrelPivot
    batcher.add('barrel', 'darkSteel', getSimpleCylGeo(0.16, 0.2, 0.52, 10), 0, 0.02, 0.34, Math.PI / 2, 0, 0);
    batcher.add('barrel', 'sapphireOptic', getSimpleCylGeo(0.08, 0.08, 0.05, 8), 0, 0.02, 0.58, Math.PI / 2, 0, 0);
    muzzleZ = 0.72;
  } else if (specA) {
    // 5A: Zero Absoluto Criogênico — long focused cryogenic lance with 5 fin collars + specTrimA
    batcher.add('barrel', 'navalWhite', getChamferedBoxGeo(0.62, 0.44, 0.76, 0.04), 0, 0.02, 0.14);
    const lanceGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.17, 0.0],
        [0.145, 0.92],
        [0.12, 1.56],
        [0.155, 1.78],
        [0.105, 1.84],
        [0.01, 1.68]
      ],
      10
    );
    batcher.add('barrel', 'darkSteel', lanceGeo, 0, 0.02, 0.38);

    // 5 stepped cooling fin collars along the focused cryo lance
    const collarGeo = getSimpleCylGeo(0.24, 0.24, 0.06, 10);
    for (let c = 0; c < 5; c++) {
      const scaleR = 1.0 - c * 0.07;
      batcher.add('barrel', c % 2 === 0 ? 'darkSteel' : 'navalWhite', collarGeo, 0, 0.02, 0.68 + c * 0.26, Math.PI / 2, 0, 0, scaleR, 1, scaleR);
    }

    // Twin side cryogenic focusing rails + brass cryo-feed conduits + crisp specTrimA strips
    const railGeo = getSimpleBoxGeo(0.07, 0.14, 1.54);
    const trimRailGeo = getSimpleBoxGeo(0.028, 0.044, 1.1);
    for (const sx of [-0.22, 0.22]) {
      batcher.add('barrel', 'darkSteel', railGeo, sx, 0.02, 1.18);
      batcher.add('barrel', 'brass', getSimpleCylGeo(0.032, 0.032, 0.92, 6), sx * 1.15, -0.12, 0.76, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'specTrimA', trimRailGeo, sx + (sx > 0 ? 0.035 : -0.035), 0.02, 1.16);
    }

    // Deeply recessed sapphire focus tip
    batcher.add('barrel', 'sapphireOptic', getSimpleCylGeo(0.065, 0.065, 0.05, 8), 0, 0.02, 2.08, Math.PI / 2, 0, 0);
    muzzleZ = 2.26;
  } else {
    // Baseline Lv1–Lv4 inverted thermal projector with cooling fins
    batcher.add('barrel', 'navalWhite', getChamferedBoxGeo(0.6, 0.42, 0.74, 0.04), 0, 0.02, 0.14);
    const projGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.18, 0.0],
        [0.14, 0.56],
        [0.24, 0.94],
        [0.2, 0.98],
        [0.01, 0.8]
      ],
      10
    );
    batcher.add('barrel', 'darkSteel', projGeo, 0, 0.02, 0.42);

    const finCount = level === 1 ? 2 : level === 2 ? 3 : 4;
    const finCollarGeo = getSimpleCylGeo(0.24, 0.24, 0.055, 10);
    for (let i = 0; i < finCount; i++) {
      batcher.add('barrel', 'darkSteel', finCollarGeo, 0, 0.02, 0.6 + i * 0.18, Math.PI / 2, 0, 0);
    }
    batcher.add('barrel', 'brass', getSimpleCylGeo(0.038, 0.038, 0.76, 6), 0.24, -0.08, 0.62, Math.PI / 2, 0, 0);
    batcher.add('barrel', 'sapphireOptic', getSimpleCylGeo(0.085, 0.085, 0.05, 8), 0, 0.02, 1.24, Math.PI / 2, 0, 0);
    muzzleZ = 1.44;
  }

  batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

  // Collision-free 36-segment cryo aura ring at Lv2+ (y=1.58 clears barrel max y=1.38 and tanks/dome r<=1.32)
  if (level >= 2) {
    rig.ewRings = [];
    const ringGeo = getGeo('elem_cryo_ew_ring_36', () => new THREE.RingGeometry(1.62, 1.69, 36));
    const ring = new THREE.Mesh(ringGeo, mats.ewRingSubtle);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 1.58;
    ring.userData.noShadow = true;
    ring.castShadow = false;
    ring.receiveShadow = false;
    root.add(ring);
    rig.ewRings.push(ring);
  }

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.02, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.02, muzzleZ + 0.06, specA ? 1.15 : 1.0, true);
}

// ============================================================================
// 2. TOXIC TOWER — Armored CBRN Chemical Dispersion Battery
// ============================================================================

export function buildToxicTower(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('toxic_tower', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88));

  // Octagonal hazmat containment plinth + raised oliveDark sump curb (r <= 1.76 at y <= 0.28)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.62, 1.76, 0.22, 8, 0.04), 0, 0.11, 0);
  batcher.add('root', 'oliveDark', getChamferedCylinderGeo(1.34, 1.42, 0.15, 8, 0.03), 0, 0.295, 0);
  batcher.add('root', 'diamondPlate', getSimpleCylGeo(1.06, 1.1, 0.05, 8), 0, 0.37, 0);

  // 4 octagonal hazard stanchions
  const postGeo = getSimpleCylGeo(0.055, 0.065, 0.3, 6);
  const postCapGeo = getSimpleCylGeo(0.065, 0.065, 0.05, 6);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    batcher.add('root', 'darkSteel', postGeo, Math.sin(a) * 1.44, 0.26, Math.cos(a) * 1.44);
    batcher.add('root', 'brass', postCapGeo, Math.sin(a) * 1.44, 0.42, Math.cos(a) * 1.44);
  }

  // Ribbed pressurized chemical drums wrapped in protective darkSteel cages (sight-glass <= 2% emissive)
  const drumH = level >= 3 ? 1.02 : 0.9;
  const drumR = 0.27;
  const drumGeo = createLatheYGeo(
    [
      [0.01, 0.0],
      [drumR, 0.0],
      [drumR, drumH * 0.22],
      [drumR + 0.028, drumH * 0.28],
      [drumR, drumH * 0.34],
      [drumR, drumH * 0.66],
      [drumR + 0.028, drumH * 0.72],
      [drumR, drumH * 0.78],
      [drumR * 0.88, drumH],
      [0.01, drumH]
    ],
    10
  );
  const cageBarGeo = getSimpleBoxGeo(0.044, drumH + 0.06, 0.048);
  const hoopGeo = getSimpleCylGeo(drumR + 0.042, drumR + 0.042, 0.055, 10);
  const gaugeBezelGeo = getSimpleBoxGeo(0.085, 0.34, 0.055);
  const gaugeSlitGeo = getSimpleBoxGeo(0.035, 0.26, 0.024);
  const valveGeo = getSimpleCylGeo(0.068, 0.088, 0.14, 8);

  const drumSlots: Array<{ x: number; z: number; scale: number; hasSight: boolean }> = specA
    ? [
        // 5A: Doubled pressurized chemical drums (4 ribbed hazmat drums total)
        { x: -0.86, z: -0.32, scale: 1.0, hasSight: true },
        { x: 0.86, z: -0.32, scale: 1.0, hasSight: true },
        { x: -0.58, z: -0.82, scale: 0.84, hasSight: false },
        { x: 0.58, z: -0.82, scale: 0.84, hasSight: false }
      ]
    : [
        { x: -0.82, z: -0.34, scale: 1.0, hasSight: true },
        { x: 0.82, z: -0.34, scale: 1.0, hasSight: true }
      ];

  for (const d of drumSlots) {
    const sign = d.x < 0 ? -1 : 1;
    batcher.add('root', 'oliveDark', drumGeo, d.x, 0.36, d.z, 0, 0, 0, d.scale, d.scale, d.scale);
    batcher.add('root', 'darkSteel', hoopGeo, d.x, 0.36 + drumH * d.scale * 0.22, d.z, 0, 0, 0, d.scale, 1, d.scale);
    batcher.add('root', 'darkSteel', hoopGeo, d.x, 0.36 + drumH * d.scale * 0.78, d.z, 0, 0, 0, d.scale, 1, d.scale);
    batcher.add('root', 'brass', valveGeo, d.x, 0.36 + drumH * d.scale + 0.06, d.z);

    // 4 protective roll-cage bars around each drum
    const rCage = (drumR + 0.032) * d.scale;
    for (let b = 0; b < 4; b++) {
      const a = (b / 4) * Math.PI * 2 + Math.PI / 4;
      batcher.add('root', 'darkSteel', cageBarGeo, d.x + Math.sin(a) * rCage, 0.36 + drumH * d.scale * 0.5, d.z + Math.cos(a) * rCage, 0, a, 0, 1, d.scale, 1);
    }

    // Narrow recessed green fluid sight-glass on outer flank of primary drums
    if (d.hasSight) {
      batcher.add('root', 'darkSteel', gaugeBezelGeo, d.x + sign * (drumR * d.scale + 0.015), 0.36 + drumH * d.scale * 0.5, d.z, 0, Math.PI / 2, 0);
      batcher.add('root', 'opticGreen', gaugeSlitGeo, d.x + sign * (drumR * d.scale + 0.038), 0.36 + drumH * d.scale * 0.5, d.z, 0, Math.PI / 2, 0);
    }
  }

  // Rear brass/steel pressure header manifold linking the drums
  batcher.add('root', 'darkSteel', getSimpleCylGeo(0.048, 0.048, 1.48, 8), 0, 0.58, -0.58, 0, 0, Math.PI / 2);
  batcher.add('root', 'brass', getSimpleCylGeo(0.095, 0.095, 0.14, 8), 0, 0.58, -0.58, 0, 0, Math.PI / 2);

  // Turret pivot
  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.38, 0.06);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Armored CBRN pedestal + pump turret housing
  batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.64, 0.72, 0.2, 10, 0.03), 0, 0.1, 0);
  const cbrnHullGeo = createSideExtrudeGeo(
    [
      [-0.56, 0.18],
      [0.52, 0.18],
      [0.62, 0.44],
      [0.36, 0.76],
      [-0.48, 0.78],
      [-0.62, 0.46]
    ],
    0.94,
    0.03,
    0.03
  );
  batcher.add('turret', 'oliveDark', cbrnHullGeo, 0, 0, 0);
  batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.76, 0.32, 0.38, 0.025), 0, 0.52, -0.54);

  if (level >= 2 && !specB) {
    // Twin side pressure scrubber bottles
    const scrubGeo = getSimpleCylGeo(0.11, 0.11, 0.46, 8);
    const scrubCapGeo = getSimpleCylGeo(0.06, 0.08, 0.09, 6);
    for (const sx of [-0.56, 0.56]) {
      batcher.add('turret', 'oliveDark', scrubGeo, sx, 0.48, -0.14);
      batcher.add('turret', 'brass', scrubCapGeo, sx, 0.74, -0.14);
    }
  }

  if (level >= 4 && !specA && !specB) {
    batcher.add('turret', 'specTrimTier', getSimpleBoxGeo(0.038, 0.055, 0.4), -0.49, 0.62, 0.06);
    batcher.add('turret', 'specTrimTier', getSimpleBoxGeo(0.038, 0.055, 0.4), 0.49, 0.62, 0.06);
  }

  // Barrel pivot
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.68, 0.26);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  let muzzleZ = 1.42;

  if (specA) {
    // 5A: Nuvem Pestilenta Letal — elevated atomizing dome with 4 cross injectors + specTrimA
    batcher.add('turret', 'darkSteel', getSimpleCylGeo(0.24, 0.32, 0.54, 10), 0, 1.0, -0.04);
    const domeGeo = createLatheYGeo(
      [
        [0.01, 0.0],
        [0.44, 0.0],
        [0.52, 0.2],
        [0.44, 0.46],
        [0.22, 0.62],
        [0.01, 0.65]
      ],
      12
    );
    batcher.add('turret', 'oliveDark', domeGeo, 0, 1.24, -0.04);
    batcher.add('turret', 'brass', getSimpleCylGeo(0.18, 0.22, 0.14, 8), 0, 1.9, -0.04);

    // 4 protective cage ribs + 4 cross-mounted pressurized mist injectors
    const ribArchGeo = getSimpleBoxGeo(0.055, 0.52, 0.08);
    const injNozGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.11, 0.0],
        [0.09, 0.34],
        [0.16, 0.52],
        [0.12, 0.56],
        [0.01, 0.45]
      ],
      8
    );
    const nozRingGeo = getSimpleCylGeo(0.12, 0.12, 0.05, 8);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      batcher.add('turret', 'darkSteel', ribArchGeo, Math.sin(a) * 0.48, 1.54, Math.cos(a) * 0.48 - 0.04, 0, a, 0);
      batcher.add('turret', 'gunmetal', injNozGeo, Math.sin(a) * 0.42, 1.48, Math.cos(a) * 0.42 - 0.04, 0, a, 0);
      batcher.add('turret', 'brass', nozRingGeo, Math.sin(a) * 0.58, 1.48, Math.cos(a) * 0.58 - 0.04, Math.PI / 2, 0, -a);
    }
    batcher.add(
      'turret',
      'specTrimA',
      getGeo('elem_toxic_5a_ring', () => new THREE.TorusGeometry(0.46, 0.024, 4, 18)),
      0,
      1.3,
      -0.04,
      Math.PI / 2,
      0,
      0
    );

    // Compact forward atomizer emitter on barrelPivot
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.56, 0.38, 0.64, 0.035), 0, 0.02, 0.12);
    batcher.add('barrel', 'gunmetal', injNozGeo, 0, 0.02, 0.42, 0, 0, 0, 1.15, 1.15, 1.35);
    batcher.add('barrel', 'brass', getSimpleCylGeo(0.14, 0.14, 0.07, 8), 0, 0.02, 0.86, Math.PI / 2, 0, 0);
    muzzleZ = 1.2;
  } else if (specB) {
    // 6B: Ácido Dissolvente Molecular — twin high-pressure acid-jet lances + titanium mantlet shield + side pumps + specTrimB
    const pumpBodyGeo = getChamferedBoxGeo(0.32, 0.48, 0.72, 0.03);
    const pistonGeo = getSimpleCylGeo(0.065, 0.065, 0.52, 8);
    const pumpCapGeo = getSimpleBoxGeo(0.36, 0.08, 0.52);
    const pumpTrimGeo = getSimpleBoxGeo(0.038, 0.075, 0.46);
    for (const sx of [-0.66, 0.66]) {
      batcher.add('turret', 'darkSteel', pumpBodyGeo, sx, 0.52, -0.08);
      batcher.add('turret', 'brass', pistonGeo, sx, 0.56, 0.24, Math.PI / 2, 0, 0);
      batcher.add('turret', 'darkSteel', pumpCapGeo, sx, 0.78, -0.1);
      batcher.add('turret', 'specTrimB', pumpTrimGeo, sx + (sx > 0 ? 0.17 : -0.17), 0.64, -0.06);
    }

    // Heavy sloped titanium mantlet shield wrapping barrel trunnions
    const mantletGeo = createSideExtrudeGeo(
      [
        [-0.22, -0.26],
        [0.24, -0.24],
        [0.36, 0.04],
        [0.18, 0.34],
        [-0.24, 0.32]
      ],
      0.98,
      0.03,
      0.03
    );
    batcher.add('barrel', 'darkSteel', mantletGeo, 0, 0.04, 0.16);
    batcher.add('barrel', 'darkSteel', getSimpleBoxGeo(0.84, 0.12, 0.34), 0, 0.34, 0.1);
    batcher.add('barrel', 'specTrimB', getSimpleBoxGeo(0.76, 0.045, 0.048), 0, 0.24, 0.36);

    // Dual high-pressure acid-jet lances
    const lanceGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.115, 0.0],
        [0.105, 0.88],
        [0.075, 1.38],
        [0.095, 1.5],
        [0.065, 1.56],
        [0.01, 1.52]
      ],
      8
    );
    const jacketGeo = getSimpleBoxGeo(0.14, 0.2, 0.82);
    const collarGeo = getSimpleCylGeo(0.11, 0.11, 0.07, 8);
    const tipRingGeo = getSimpleCylGeo(0.042, 0.042, 0.04, 8);
    for (const bx of [-0.24, 0.24]) {
      batcher.add('barrel', 'gunmetal', lanceGeo, bx, 0.02, 0.28);
      batcher.add('barrel', 'darkSteel', jacketGeo, bx, 0.02, 0.68);
      batcher.add('barrel', 'brass', collarGeo, bx, 0.02, 1.24, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'opticGreen', tipRingGeo, bx, 0.02, 1.78, Math.PI / 2, 0, 0);
    }
    batcher.add('barrel', 'darkSteel', getSimpleBoxGeo(0.56, 0.08, 0.12), 0, 0.02, 1.12);
    muzzleZ = 1.88;
  } else {
    // Baseline Lv1–Lv4 industrial sprayer receiver & shrouded nozzle(s)
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.62, 0.42, 0.76, 0.035), 0, 0.02, 0.14);
    const sprayerGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.13, 0.0],
        [0.11, 0.68],
        [0.165, 0.92],
        [0.135, 0.96],
        [0.01, 0.82]
      ],
      8
    );
    const nozzles = level >= 2 ? [-0.19, 0.19] : [0];
    const swirlGeo = getSimpleCylGeo(0.135, 0.135, 0.065, 8);
    const tipGeo = getSimpleCylGeo(0.05, 0.05, 0.04, 8);
    for (const bx of nozzles) {
      batcher.add('barrel', 'gunmetal', sprayerGeo, bx, 0.02, 0.42);
      batcher.add('barrel', 'brass', swirlGeo, bx, 0.02, 0.92, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'opticGreen', tipGeo, bx, 0.02, 1.3, Math.PI / 2, 0, 0);
    }
    if (level >= 3) {
      batcher.add('barrel', 'darkSteel', getSimpleBoxGeo(0.62, 0.1, 0.46), 0, 0.24, 0.66);
    }
    muzzleZ = 1.42;
  }

  batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.02, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.02, muzzleZ + 0.06, specB ? 1.05 : 0.92, false);
}

// ============================================================================
// 3. FLAMETHROWER — Armored Thermal Deflector Casemate & Napalm Battery
// ============================================================================

export function buildFlamethrower(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('flamethrower', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88));

  // Cut-corner concrete bunker apron (corner r = hypot(1.52 - 0.68, 1.52) = 1.737 <= 1.84)
  batcher.add('root', 'concreteDark', getCutCornerSlabGeo(3.04, 0.22, 3.04, 0.68, 0.04), 0, 0.11, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.26, 1.34, 0.13, 8, 0.025), 0, 0.285, 0);

  // Low armored sandbag revetment parapet blocks tucked inside r <= 1.72
  const bagGeo = getChamferedBoxGeo(0.54, 0.2, 0.24, 0.045);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    batcher.add('root', 'sandbag', bagGeo, Math.sin(a) * 1.38, 0.26, Math.cos(a) * 1.38, 0, a, 0);
  }
  // 4 corner steel blast deflector aprons
  const apronGeo = getSimpleBoxGeo(0.36, 0.24, 0.11);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    batcher.add('root', 'darkSteel', apronGeo, Math.sin(a) * 1.44, 0.28, Math.cos(a) * 1.44, -0.22, a, 0);
  }

  // Turret pivot
  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.35, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Armored heat-deflector casemate hull
  batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.76, 0.84, 0.16, 8, 0.025), 0, 0.08, 0);
  const casemateGeo = createSideExtrudeGeo(
    [
      [-0.68, 0.14],
      [0.64, 0.14],
      [0.74, 0.38],
      [0.52, 0.78],
      [-0.58, 0.82],
      [-0.74, 0.46]
    ],
    1.18,
    0.035,
    0.035
  );
  batcher.add('turret', 'desertArmor', casemateGeo, 0, 0, 0);

  // Sloped frontal heat-deflector brow shield & top observation cupola
  batcher.add('turret', 'darkSteel', getChamferedBoxGeo(1.06, 0.12, 0.44, 0.02), 0, 0.82, 0.34, 0.18, 0, 0);
  batcher.add('turret', 'darkSteel', getSimpleCylGeo(0.24, 0.28, 0.16, 8), -0.26, 0.88, -0.18);
  batcher.add('turret', 'glass', getSimpleBoxGeo(0.22, 0.07, 0.12), -0.26, 0.9, -0.02);

  // Twin rear pressurized napalm tanks held by steel straps (non-emissive rusDark/navalGray — ZERO shtoraRed!)
  const tankR = specA ? 0.27 : 0.23;
  const tankLen = specA ? 1.04 : 0.88;
  const rearTankGeo = createLatheAlongZGeo(
    [
      [0.01, -tankLen * 0.5],
      [tankR * 0.78, -tankLen * 0.45],
      [tankR, -tankLen * 0.34],
      [tankR, tankLen * 0.34],
      [tankR * 0.78, tankLen * 0.45],
      [0.01, tankLen * 0.5]
    ],
    10
  );
  const strapGeo = getSimpleCylGeo(tankR + 0.024, tankR + 0.024, 0.065, 10);
  const valveGeo = getSimpleCylGeo(0.065, 0.08, 0.14, 6);
  const tankMat: StructuralMatKey = specA ? 'navalGray' : 'rusDark';

  for (const fx of [-0.36, 0.36]) {
    batcher.add('turret', tankMat, rearTankGeo, fx, 0.68, -0.84, 0.12, 0, 0);
    batcher.add('turret', 'darkSteel', strapGeo, fx, 0.64, -0.62, Math.PI / 2 + 0.12, 0, 0);
    batcher.add('turret', 'darkSteel', strapGeo, fx, 0.71, -1.04, Math.PI / 2 + 0.12, 0, 0);
    batcher.add('turret', 'brass', valveGeo, fx, 0.92, -0.86);
  }
  batcher.add('turret', 'darkSteel', getSimpleBoxGeo(1.04, 0.12, 0.58), 0, 0.44, -0.84);
  if (level >= 2) {
    batcher.add('turret', 'darkSteel', getSimpleBoxGeo(1.06, 0.07, 0.68), 0, 0.98, -0.82, 0.12, 0, 0);
  }

  // Side armor louvers / copper thermal radiators / saddlebags
  if (specA) {
    // 5A: Heavy copper radiator fin stacks on both flanks + specTrimA bars
    const cuFinGeo = getSimpleBoxGeo(0.18, 0.44, 0.065);
    const sideMountGeo = getSimpleBoxGeo(0.16, 0.52, 0.96);
    const sideTrimGeo = getSimpleBoxGeo(0.036, 0.05, 0.72);
    for (const sx of [-0.7, 0.7]) {
      batcher.add('turret', 'darkSteel', sideMountGeo, sx * 0.92, 0.52, -0.06);
      for (let f = 0; f < 5; f++) {
        batcher.add('turret', 'copperAesa', cuFinGeo, sx + (sx > 0 ? 0.08 : -0.08), 0.52, -0.4 + f * 0.17);
      }
      batcher.add('turret', 'specTrimA', sideTrimGeo, sx + (sx > 0 ? 0.18 : -0.18), 0.76, -0.06);
    }
  } else if (specB) {
    // 6B: Wide lateral armored fuel saddlebags (pannier drums) + specTrimB collectors
    const saddleGeo = createLatheAlongZGeo(
      [
        [0.01, -0.58],
        [0.24, -0.5],
        [0.29, -0.36],
        [0.29, 0.36],
        [0.24, 0.5],
        [0.01, 0.58]
      ],
      10
    );
    const saddleStrapGeo = getSimpleCylGeo(0.312, 0.312, 0.07, 10);
    const sideGuardGeo = getChamferedBoxGeo(0.1, 0.38, 0.92, 0.02);
    const sidePipeGeo = getSimpleCylGeo(0.05, 0.05, 0.32, 6);
    const sideTrimGeo = getSimpleBoxGeo(0.042, 0.06, 0.68);
    for (const sx of [-0.88, 0.88]) {
      batcher.add('turret', 'rusDark', saddleGeo, sx, 0.5, -0.06);
      batcher.add('turret', 'darkSteel', saddleStrapGeo, sx, 0.5, -0.32, Math.PI / 2, 0, 0);
      batcher.add('turret', 'darkSteel', saddleStrapGeo, sx, 0.5, 0.2, Math.PI / 2, 0, 0);
      batcher.add('turret', 'desertArmor', sideGuardGeo, sx + (sx > 0 ? 0.28 : -0.28), 0.52, -0.06);
      batcher.add('turret', 'brass', sidePipeGeo, sx * 0.85, 0.76, -0.28, 0, 0, Math.PI / 2);
      batcher.add('turret', 'specTrimB', sideTrimGeo, sx + (sx > 0 ? 0.34 : -0.34), 0.64, -0.06);
    }
  } else if (level >= 3) {
    for (const sx of [-0.65, 0.65]) {
      batcher.add('turret', 'darkSteel', getSimpleBoxGeo(0.12, 0.34, 0.72), sx, 0.52, -0.08);
      batcher.add('turret', 'copperAesa', getSimpleCylGeo(0.04, 0.04, 0.74, 6), sx, 0.3, -0.1, Math.PI / 2, 0, 0);
    }
    if (level >= 4) {
      batcher.add('turret', 'specTrimTier', getSimpleBoxGeo(0.038, 0.052, 0.44), -0.64, 0.7, 0.02);
      batcher.add('turret', 'specTrimTier', getSimpleBoxGeo(0.038, 0.052, 0.44), 0.64, 0.7, 0.02);
    }
  }

  // Barrel pivot
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.64, 0.54);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  let muzzleZ = 1.38;

  if (specA) {
    // 5A: Incinerador Plasma-Térmico — 3 plasma-thermal nozzles inside armored cowling shroud
    const cowlingGeo = createSideExtrudeGeo(
      [
        [-0.1, -0.24],
        [0.98, -0.2],
        [1.18, 0.04],
        [0.94, 0.28],
        [-0.1, 0.26]
      ],
      0.86,
      0.03,
      0.03
    );
    batcher.add('barrel', 'darkSteel', cowlingGeo, 0, 0.02, 0.08);
    batcher.add('barrel', 'darkSteel', getSimpleBoxGeo(0.92, 0.14, 0.78), 0, 0.24, 0.34);
    batcher.add('barrel', 'specTrimA', getSimpleBoxGeo(0.036, 0.048, 0.74), -0.45, 0.08, 0.56);
    batcher.add('barrel', 'specTrimA', getSimpleBoxGeo(0.036, 0.048, 0.74), 0.45, 0.08, 0.56);

    const triNozGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.095, 0.0],
        [0.085, 0.96],
        [0.115, 1.14],
        [0.088, 1.2],
        [0.01, 1.14]
      ],
      8
    );
    const cuCollarGeo = getSimpleCylGeo(0.11, 0.11, 0.09, 8);
    const pilotGeo = getSimpleCylGeo(0.032, 0.032, 0.05, 6);
    const triOffsets: Array<[number, number]> = [
      [-0.22, -0.06],
      [0.22, -0.06],
      [0, 0.12]
    ];
    for (const [nx, ny] of triOffsets) {
      batcher.add('barrel', 'darkSteel', triNozGeo, nx, ny, 0.36);
      batcher.add('barrel', 'copperAesa', cuCollarGeo, nx, ny, 1.18, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'afterburner', pilotGeo, nx, ny, 1.54, Math.PI / 2, 0, 0);
    }
    muzzleZ = 1.62;
  } else if (specB) {
    // 6B: Mar de Napalm Adesivo — twin wide-bore gel-napalm mortars
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.84, 0.42, 0.56, 0.035), 0, 0.02, 0.14);
    const mortarGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.19, 0.0],
        [0.17, 0.54],
        [0.23, 0.88],
        [0.185, 0.94],
        [0.01, 0.74]
      ],
      10
    );
    const mortarRingGeo = getSimpleCylGeo(0.2, 0.2, 0.075, 10);
    const hoodGeo = getSimpleBoxGeo(0.08, 0.08, 0.22);
    const pilotGeo = getSimpleCylGeo(0.032, 0.032, 0.05, 6);
    for (const mx of [-0.26, 0.26]) {
      batcher.add('barrel', 'gunmetal', mortarGeo, mx, 0.06, 0.32, -0.14, 0, 0);
      batcher.add('barrel', 'brass', mortarRingGeo, mx, 0.12, 0.78, Math.PI / 2 - 0.14, 0, 0);
      batcher.add('barrel', 'darkSteel', hoodGeo, mx, -0.12, 1.06);
      batcher.add('barrel', 'afterburner', pilotGeo, mx, -0.12, 1.18, Math.PI / 2, 0, 0);
    }
    batcher.add('barrel', 'specTrimB', getSimpleBoxGeo(0.62, 0.048, 0.055), 0, 0.26, 0.42);
    muzzleZ = 1.32;
  } else {
    // Baseline Lv1–Lv4 ventilated thermal projector shroud + tiny pilot ignitor (<= 1.2% emissive)
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.58, 0.36, 0.46, 0.035), 0, 0.02, 0.1);
    const shroudGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.135, 0.0],
        [0.125, 0.72],
        [0.155, 0.94],
        [0.115, 1.04],
        [0.01, 0.9]
      ],
      8
    );
    const nozzles = level >= 2 ? [-0.2, 0.2] : [0];
    const ribCollarGeo = getSimpleCylGeo(0.155, 0.155, 0.065, 8);
    const ignTubeGeo = getSimpleCylGeo(0.03, 0.03, 0.44, 6);
    const pilotGeo = getSimpleCylGeo(0.034, 0.022, 0.065, 6);
    for (const nx of nozzles) {
      batcher.add('barrel', 'gunmetal', shroudGeo, nx, 0.02, 0.28);
      batcher.add('barrel', 'darkSteel', ribCollarGeo, nx, 0.02, 0.62, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'darkSteel', ribCollarGeo, nx, 0.02, 0.92, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'darkSteel', ignTubeGeo, nx, -0.14, 0.92, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'afterburner', pilotGeo, nx, -0.14, 1.18, Math.PI / 2, 0, 0);
    }
    muzzleZ = 1.38;
  }

  batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.02, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.02, muzzleZ + 0.08, specB ? 1.45 : 1.35, false);
}

// ============================================================================
// 4. HELIOS LASER — Precision C4ISR Directed-Energy Optical Gimbal
// ============================================================================

export function buildHeliosLaser(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('helios_laser', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88));

  // 12-sided naval concrete plinth + diamond-plate equipment deck (r <= 1.74 at y <= 0.28)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.6, 1.74, 0.22, 12, 0.04), 0, 0.11, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.3, 1.38, 0.14, 10, 0.025), 0, 0.29, 0);

  // 4 armored high-voltage power conditioning cabinets around base (NO glowing blocks!)
  const capGeo = getChamferedBoxGeo(0.5, 0.42, 0.36, 0.03);
  const capVentGeo = getSimpleBoxGeo(0.38, 0.2, 0.06);
  const pinGeo = getSimpleCylGeo(0.048, 0.048, 0.12, 6);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    batcher.add('root', 'darkSteel', capGeo, Math.sin(a) * 1.06, 0.54, Math.cos(a) * 1.06, 0, a, 0);
    batcher.add('root', 'darkSteel', capVentGeo, Math.sin(a) * 1.24, 0.54, Math.cos(a) * 1.24, 0, a, 0);
    batcher.add('root', 'brass', pinGeo, Math.sin(a) * 1.04, 0.78, Math.cos(a) * 1.04);
  }

  // Turret pivot
  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.36, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Precision C4ISR pedestal column + twin gimbal yoke arms
  const pedGeo = createLatheYGeo(
    [
      [0.01, 0.0],
      [0.78, 0.0],
      [0.72, 0.18],
      [0.6, 0.32],
      [0.6, 0.62],
      [0.68, 0.69],
      [0.01, 0.7]
    ],
    12
  );
  batcher.add('turret', 'navalWhite', pedGeo, 0, 0, 0);
  batcher.add('turret', 'darkSteel', getSimpleCylGeo(0.76, 0.8, 0.1, 12), 0, 0.12, 0);

  // Twin beveled gimbal yoke uprights cradling barrelPivot
  const yokeGeo = createSideExtrudeGeo(
    [
      [-0.36, 0.6],
      [0.34, 0.6],
      [0.24, 1.26],
      [-0.22, 1.26]
    ],
    0.18,
    0.025,
    0.025
  );
  const yokeSpread = specB ? 0.68 : 0.54;
  const trunGeo = getSimpleCylGeo(0.14, 0.14, 0.12, 8);
  for (const sx of [-yokeSpread, yokeSpread]) {
    batcher.add('turret', level >= 2 ? 'navalWhite' : 'navalGray', yokeGeo, sx, 0, 0.04);
    batcher.add('turret', 'darkSteel', trunGeo, sx + (sx > 0 ? 0.08 : -0.08), 1.06, 0.08, 0, 0, Math.PI / 2);
  }

  // Rear optical diode chiller cabinet
  batcher.add('turret', 'navalGray', getChamferedBoxGeo(0.92, 0.52, 0.52, 0.03), 0, 0.84, -0.44);
  batcher.add('turret', 'darkSteel', getSimpleBoxGeo(0.76, 0.34, 0.1), 0, 0.84, -0.71);

  // Stepped radiator wings (scale with level; wider on specB)
  const wingFinCount = level === 1 ? 3 : level === 2 ? 4 : 5;
  const wingSpan = specB ? 0.42 : 0.28;
  const wingBaseX = specB ? 0.82 : 0.66;
  const spineGeo = getSimpleCylGeo(0.038, 0.038, 0.72, 6);
  for (const sign of [-1, 1]) {
    batcher.add('turret', 'copperAesa', spineGeo, sign * (wingBaseX + 0.04), 0.78, -0.18, Math.PI / 2, 0, 0);
    for (let f = 0; f < wingFinCount; f++) {
      const fLen = wingSpan * (0.72 + (f / Math.max(1, wingFinCount - 1)) * 0.45);
      const finGeo = getSimpleBoxGeo(fLen, 0.42 - f * 0.02, 0.055);
      batcher.add(
        'turret',
        'darkSteel',
        finGeo,
        sign * (wingBaseX + fLen * 0.45),
        0.78 + f * 0.03,
        -0.46 + f * 0.17,
        0,
        sign * -0.22,
        0
      );
    }
  }

  // SpecA tall rear high-voltage capacitor bank tower
  if (specA) {
    batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.98, 1.08, 0.46, 0.03), 0, 1.32, -0.54);
    batcher.add('turret', 'navalWhite', getSimpleBoxGeo(0.84, 0.92, 0.12), 0, 1.34, -0.78);
    const capBusGeo = getSimpleCylGeo(0.044, 0.044, 0.64, 6);
    const capTrimGeo = getSimpleBoxGeo(0.04, 0.54, 0.048);
    for (const sx of [-0.34, 0.34]) {
      batcher.add('turret', 'copperAesa', capBusGeo, sx, 1.54, -0.32, 0.35, 0, 0);
      batcher.add('turret', 'specTrimA', capTrimGeo, sx * 1.48, 1.38, -0.54);
    }
  } else if (specB) {
    // 6B wide collector hood behind the 2x2 array
    batcher.add('turret', 'navalGray', getChamferedBoxGeo(1.42, 0.48, 0.56, 0.03), 0, 0.92, -0.46);
    batcher.add('turret', 'specTrimB', getSimpleBoxGeo(1.24, 0.045, 0.048), 0, 1.18, -0.44);
  } else if (level >= 4) {
    batcher.add('turret', 'specTrimTier', getSimpleBoxGeo(0.038, 0.34, 0.048), -0.64, 0.96, 0.08);
    batcher.add('turret', 'specTrimTier', getSimpleBoxGeo(0.038, 0.34, 0.048), 0.64, 0.96, 0.08);
  }

  // Barrel pivot — Optical Beam Director Gimbal
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 1.06, 0.08);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  let muzzleZ = 1.08;

  if (specA) {
    // 5A: Feixe Hiperfocado Ômega — giant extended collimator telescope + heavy cooling fins + deep recessed mirror
    batcher.add('barrel', 'navalWhite', getChamferedBoxGeo(0.84, 0.62, 0.88, 0.04), 0, 0, 0.06);
    const omegaTubeGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.32, 0.0],
        [0.3, 0.72],
        [0.26, 1.38],
        [0.31, 1.66],
        [0.26, 1.72],
        [0.19, 1.54],
        [0.01, 1.24]
      ],
      12
    );
    batcher.add('barrel', 'darkSteel', omegaTubeGeo, 0, 0, 0.24);

    // 4 heavy radial collimator heat-sink collars
    const finRingGeo = getSimpleCylGeo(0.37, 0.37, 0.07, 10);
    for (let i = 0; i < 4; i++) {
      batcher.add('barrel', i % 2 === 0 ? 'navalWhite' : 'steel', finRingGeo, 0, 0, 0.56 + i * 0.26, Math.PI / 2, 0, 0);
    }
    const railGeo = getSimpleBoxGeo(0.08, 0.14, 1.32);
    const railTrimGeo = getSimpleBoxGeo(0.028, 0.044, 0.96);
    for (const sx of [-0.36, 0.36]) {
      batcher.add('barrel', 'darkSteel', railGeo, sx, 0, 1.04);
      batcher.add('barrel', 'specTrimA', railTrimGeo, sx + (sx > 0 ? 0.04 : -0.04), 0, 1.04);
    }
    // Deep recessed focusing mirror inside aperture hood (<= 1.5% emissive!)
    batcher.add('barrel', 'sapphireOptic', getSimpleCylGeo(0.16, 0.16, 0.05, 10), 0, 0, 1.46, Math.PI / 2, 0, 0);
    batcher.add('barrel', 'radarCyan', getSimpleCylGeo(0.055, 0.055, 0.04, 8), 0, 0, 1.5, Math.PI / 2, 0, 0);
    muzzleZ = 2.0;
  } else if (specB) {
    // 6B: Matriz Quádrupla Iron Beam — 2x2 prismatic splitter array (4 steel-framed recessed lenses)
    batcher.add('barrel', 'navalWhite', getChamferedBoxGeo(1.16, 0.88, 0.78, 0.04), 0, 0.02, 0.14);
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(1.22, 0.94, 0.24, 0.03), 0, 0.02, 0.56);

    const quadHoodGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.2, 0.0],
        [0.19, 0.32],
        [0.155, 0.38],
        [0.01, 0.24]
      ],
      8
    );
    const bezelGeo = getSimpleCylGeo(0.185, 0.195, 0.07, 8);
    const lensGeo = getSimpleCylGeo(0.095, 0.095, 0.04, 8);
    const lensOffsets: Array<[number, number]> = [
      [-0.27, 0.2],
      [0.27, 0.2],
      [-0.27, -0.18],
      [0.27, -0.18]
    ];
    for (const [lx, ly] of lensOffsets) {
      batcher.add('barrel', 'darkSteel', quadHoodGeo, lx, ly, 0.58);
      batcher.add('barrel', 'steel', bezelGeo, lx, ly, 0.72, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'sapphireOptic', lensGeo, lx, ly, 0.82, Math.PI / 2, 0, 0);
    }
    batcher.add('barrel', 'specTrimB', getSimpleBoxGeo(1.06, 0.04, 0.048), 0, 0.48, 0.56);
    batcher.add('barrel', 'specTrimB', getSimpleBoxGeo(1.06, 0.04, 0.048), 0, -0.44, 0.56);
    muzzleZ = 1.02;
  } else {
    // Baseline Lv1–Lv4 deeply hooded optical beam director
    batcher.add('barrel', 'navalWhite', getChamferedBoxGeo(0.84, 0.58, 0.78, 0.04), 0, 0, 0.08);
    batcher.add('barrel', 'darkSteel', getSimpleBoxGeo(0.32, 0.16, 0.44), 0, 0.36, 0.18);
    batcher.add('barrel', 'sapphireOptic', getSimpleBoxGeo(0.22, 0.1, 0.06), 0, 0.36, 0.4);

    const emitPositions = level >= 3 ? [-0.24, 0.24] : [0];
    const rScale = level >= 3 ? 0.78 : 1.0;
    const hoodGeo = createLatheAlongZGeo(
      [
        [0.01, 0.0],
        [0.29 * rScale, 0.0],
        [0.28 * rScale, 0.42],
        [0.24 * rScale, 0.66],
        [0.2 * rScale, 0.7],
        [0.01, 0.46]
      ],
      10
    );
    const ringGeo = getSimpleCylGeo(0.27 * rScale, 0.29 * rScale, 0.1, 10);
    const mirrorGeo = getSimpleCylGeo(0.145 * rScale, 0.145 * rScale, 0.05, 10);
    const coreGeo = getSimpleCylGeo(0.055 * rScale, 0.055 * rScale, 0.04, 8);
    for (const ex of emitPositions) {
      batcher.add('barrel', 'darkSteel', hoodGeo, ex, 0, 0.36);
      batcher.add('barrel', 'steel', ringGeo, ex, 0, 0.62, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'sapphireOptic', mirrorGeo, ex, 0, 0.84, Math.PI / 2, 0, 0);
      batcher.add('barrel', 'radarCyan', coreGeo, ex, 0, 0.88, Math.PI / 2, 0, 0);
    }
    muzzleZ = 1.1;
  }

  batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  // cyan = false per Art Bible specification for HELIOS Laser
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0, muzzleZ + 0.06, specA ? 1.15 : 1.0, false);
}

// ============================================================================
// 5. RAILGUN — Stealth Electromagnetic Hypervelocity Accelerator
// ============================================================================

export function buildRailgun(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('railgun', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88));

  // Stealth cut-corner reinforced pedestal (corner r = hypot(1.53 - 0.72, 1.53) = 1.731 <= 1.84)
  batcher.add('root', 'concreteDark', getCutCornerSlabGeo(3.06, 0.22, 3.06, 0.72, 0.04), 0, 0.11, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.34, 1.44, 0.14, 8, 0.03), 0, 0.29, 0);

  // 4 angular stealth recoil-spade buttresses tucked inside r <= 1.70
  const spadeGeo = getChamferedBoxGeo(0.28, 0.2, 0.44, 0.025);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    batcher.add('root', 'darkSteel', spadeGeo, Math.sin(a) * 1.4, 0.24, Math.cos(a) * 1.4, 0, a, 0);
  }

  // Turret pivot
  const turretPivot = new THREE.Group();
  turretPivot.position.set(0, 0.36, 0);
  root.add(turretPivot);
  rig.turretPivot = turretPivot;

  // Low-observable faceted stealth turret chassis
  batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.88, 0.96, 0.16, 8, 0.025), 0, 0.08, 0);
  const stealthHullGeo = createSideExtrudeGeo(
    [
      [-0.96, 0.16],
      [0.82, 0.16],
      [0.98, 0.36],
      [0.64, 0.78],
      [-0.78, 0.84],
      [-1.04, 0.54]
    ],
    1.36,
    0.03,
    0.03
  );
  batcher.add('turret', 'navalGray', stealthHullGeo, 0, 0, -0.08);
  batcher.add('turret', 'darkSteel', getChamferedBoxGeo(0.76, 0.22, 1.32, 0.03), 0, 0.82, -0.14);

  // Armored rear pulsed-power capacitor banks with copperAesa busbars (ZERO giant glowing boxes!)
  const capPodGeo = createSideExtrudeGeo(
    [
      [-0.98, 0.22],
      [0.36, 0.22],
      [0.48, 0.56],
      [0.18, 0.82],
      [-0.9, 0.86],
      [-1.04, 0.52]
    ],
    0.34,
    0.025,
    0.025
  );
  const busGeo = getSimpleBoxGeo(0.08, 0.12, 1.06);
  const louverGeo = getSimpleBoxGeo(0.1, 0.36, 0.74);
  for (const sx of [-0.82, 0.82]) {
    batcher.add('turret', 'darkSteel', capPodGeo, sx, 0, -0.18);
    batcher.add('turret', 'copperAesa', busGeo, sx * 0.88, 0.84, -0.22);
    batcher.add('turret', 'steel', louverGeo, sx + (sx > 0 ? 0.16 : -0.16), 0.52, -0.3);
  }

  // Fire-control EO sensor pod on turret roof at Lv2+
  if (level >= 2) {
    batcher.add('turret', 'darkSteel', getSimpleBoxGeo(0.28, 0.22, 0.34), -0.42, 0.94, 0.18);
    batcher.add('turret', 'glass', getSimpleBoxGeo(0.18, 0.1, 0.06), -0.42, 0.95, 0.35);
  }

  // SpecA: Twin tall rear megacapacitor towers + overhead copper busbars + specTrimA
  if (specA) {
    const megaCapGeo = getChamferedBoxGeo(0.38, 1.12, 0.52, 0.03);
    const megaCapTopGeo = getSimpleBoxGeo(0.42, 0.16, 0.56);
    const feedGeo = getSimpleCylGeo(0.052, 0.052, 0.68, 6);
    const capTrimGeo = getSimpleBoxGeo(0.04, 0.66, 0.048);
    for (const sx of [-0.62, 0.62]) {
      batcher.add('turret', 'darkSteel', megaCapGeo, sx, 1.24, -0.68);
      batcher.add('turret', 'navalGray', megaCapTopGeo, sx, 1.72, -0.68);
      batcher.add('turret', 'copperAesa', feedGeo, sx, 1.48, -0.34, 0.58, 0, 0);
      batcher.add('turret', 'specTrimA', capTrimGeo, sx + (sx > 0 ? 0.2 : -0.2), 1.28, -0.68);
    }
    batcher.add('turret', 'copperAesa', getSimpleBoxGeo(1.16, 0.09, 0.12), 0, 1.66, -0.68);
    batcher.add('turret', 'darkSteel', getSimpleBoxGeo(0.46, 0.2, 0.24), 0, 1.66, -0.68);
  }

  // SpecB: Heavy chamfered frontal turret glacis armor + flank busbar manifolds
  if (specB) {
    const glacisGeo = createPlanExtrudeGeo(
      [
        [-0.92, -0.18],
        [0.92, -0.18],
        [0.64, 0.32],
        [-0.64, 0.32]
      ],
      0.46,
      0.03,
      0.03
    );
    batcher.add('turret', 'darkSteel', glacisGeo, 0, 0.34, 0.72);
    const trimGeo = getSimpleBoxGeo(0.042, 0.056, 0.68);
    for (const sx of [-0.94, 0.94]) {
      batcher.add('turret', 'specTrimB', trimGeo, sx, 0.78, -0.22);
    }
  } else if (level >= 4 && !specA) {
    const trimGeo = getSimpleBoxGeo(0.038, 0.052, 0.54);
    for (const sx of [-0.92, 0.92]) {
      batcher.add('turret', 'specTrimTier', trimGeo, sx, 0.76, -0.2);
    }
  }

  // Barrel pivot — Electromagnetic Rail Assembly
  const barrelPivot = new THREE.Group();
  barrelPivot.position.set(0, 0.78, 0.38);
  turretPivot.add(barrelPivot);
  rig.barrelPivot = barrelPivot;

  let muzzleZ = 2.45;

  if (specA) {
    // 5A: Canhão Hipersônico 64MJ — extra-long twin rails with 4 heavy structural clamps + copper busbars
    const railLen = 3.12;
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.74, 0.48, 0.86, 0.04), 0, 0, 0.24);
    const railGeo = getChamferedBoxGeo(0.14, 0.3, railLen, 0.02);
    const cuBusGeo = getSimpleBoxGeo(0.06, 0.14, railLen * 0.9);
    for (const sx of [-0.18, 0.18]) {
      batcher.add('barrel', 'darkSteel', railGeo, sx, 0, railLen * 0.48);
      batcher.add('barrel', 'copperAesa', cuBusGeo, sx * 1.48, 0, railLen * 0.46);
    }

    // 4 heavy structural C-clamp bridges along the 64MJ hypervelocity rails
    const clampTopGeo = getSimpleBoxGeo(0.64, 0.12, 0.22);
    const clampSideGeo = getSimpleBoxGeo(0.12, 0.44, 0.22);
    const clampTrimGeo = getSimpleBoxGeo(0.038, 0.16, 0.075);
    for (let c = 0; c < 4; c++) {
      const cz = 0.84 + c * 0.62;
      batcher.add('barrel', 'navalGray', clampTopGeo, 0, 0.2, cz);
      batcher.add('barrel', 'navalGray', clampTopGeo, 0, -0.2, cz);
      batcher.add('barrel', 'darkSteel', clampSideGeo, -0.28, 0, cz);
      batcher.add('barrel', 'darkSteel', clampSideGeo, 0.28, 0, cz);
      batcher.add('barrel', 'specTrimA', clampTrimGeo, -0.35, 0, cz);
      batcher.add('barrel', 'specTrimA', clampTrimGeo, 0.35, 0, cz);
    }

    // Narrow recessed internal plasma slot strip (<= 2% emissive!)
    batcher.add('barrel', 'radarCyan', getSimpleBoxGeo(0.042, 0.06, railLen * 0.82), 0, 0, railLen * 0.46);
    muzzleZ = railLen * 0.98;
  } else if (specB) {
    // 6B: Ruptura Sabot Magnetizada — wide twin sabot muzzle + large annular accelerator coils + chamfered frontal shield
    const railLen = 2.48;
    const shieldGeo = createSideExtrudeGeo(
      [
        [-0.24, -0.32],
        [0.34, -0.28],
        [0.48, 0.04],
        [0.24, 0.38],
        [-0.26, 0.34]
      ],
      1.12,
      0.03,
      0.03
    );
    batcher.add('barrel', 'navalGray', shieldGeo, 0, 0.02, 0.24);
    batcher.add('barrel', 'darkSteel', getSimpleBoxGeo(0.96, 0.12, 0.42), 0, 0.36, 0.18);

    // Wide twin-bore sabot rails
    const wideRailGeo = getChamferedBoxGeo(0.16, 0.34, railLen, 0.025);
    const cuRailGeo = getSimpleBoxGeo(0.07, 0.16, railLen * 0.88);
    const slotGeo = getSimpleBoxGeo(0.044, 0.065, railLen * 0.78);
    for (const sx of [-0.26, 0.26]) {
      batcher.add('barrel', 'darkSteel', wideRailGeo, sx, 0.02, railLen * 0.46);
      batcher.add('barrel', 'copperAesa', cuRailGeo, sx * 1.38, 0.02, railLen * 0.45);
      batcher.add('barrel', 'sapphireOptic', slotGeo, sx * 0.52, 0.02, railLen * 0.46);
    }
    batcher.add('barrel', 'darkSteel', getSimpleBoxGeo(0.12, 0.24, railLen * 0.94), 0, 0.02, railLen * 0.45);

    // 3 large annular electromagnetic accelerator coils encircling the wide twin rails
    const coilOuterGeo = getGeo('elem_rail_6b_coil_outer', () => new THREE.TorusGeometry(0.46, 0.082, 5, 16));
    const coilCopperGeo = getGeo('elem_rail_6b_coil_cu', () => new THREE.TorusGeometry(0.41, 0.045, 4, 16));
    const coilTrimGeo = getGeo('elem_rail_6b_coil_trim', () => new THREE.TorusGeometry(0.49, 0.02, 4, 16));
    for (let c = 0; c < 3; c++) {
      const cz = 0.82 + c * 0.58;
      batcher.add('barrel', 'darkSteel', coilOuterGeo, 0, 0.02, cz);
      batcher.add('barrel', 'copperAesa', coilCopperGeo, 0, 0.02, cz);
      batcher.add('barrel', 'specTrimB', coilTrimGeo, 0, 0.02, cz);
    }
    muzzleZ = railLen * 0.96;
  } else {
    // Baseline Lv1–Lv4 parallel electromagnetic rails + copper busbars + recessed narrow plasma slot
    const railLen = 2.08 + level * 0.16;
    batcher.add('barrel', 'darkSteel', getChamferedBoxGeo(0.68, 0.44, 0.76, 0.035), 0, 0, 0.2);

    const railGeo = getChamferedBoxGeo(0.13, 0.28, railLen, 0.02);
    const cuBusGeo = getSimpleBoxGeo(0.055, 0.12, railLen * 0.88);
    for (const sx of [-0.17, 0.17]) {
      batcher.add('barrel', 'darkSteel', railGeo, sx, 0, railLen * 0.46);
      batcher.add('barrel', 'copperAesa', cuBusGeo, sx * 1.44, 0, railLen * 0.45);
    }

    const yokeCount = level === 1 ? 2 : level <= 3 ? 3 : 4;
    const bridgeGeo = getSimpleBoxGeo(0.54, 0.1, 0.16);
    for (let y = 0; y < yokeCount; y++) {
      const yz = 0.74 + y * ((railLen - 0.95) / Math.max(1, yokeCount - 1));
      batcher.add('barrel', 'steel', bridgeGeo, 0, 0.17, yz);
      batcher.add('barrel', 'steel', bridgeGeo, 0, -0.17, yz);
    }

    batcher.add('barrel', 'radarCyan', getSimpleBoxGeo(0.04, 0.055, railLen * 0.8), 0, 0, railLen * 0.45);
    muzzleZ = railLen * 0.96;
  }

  batcher.flush({ root, turret: turretPivot, barrel: barrelPivot }, mats);

  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 0.01, muzzleZ);
  barrelPivot.add(muzzlePoint);
  rig.muzzlePoint = muzzlePoint;
  rig.muzzleFlashMesh = attachMuzzleFlashMesh(barrelPivot, mats, 0, 0.01, muzzleZ + 0.08, specA ? 1.35 : 1.2, true);
}
