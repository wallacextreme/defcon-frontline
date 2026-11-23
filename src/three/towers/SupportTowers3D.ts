import * as THREE from 'three';
import {
  StaticMeshBatcher,
  createBatchedMissileCapsMesh,
  getGeo,
  getChamferedBoxGeo,
  getRoundedBoxGeo,
  getChamferedCylinderGeo,
  getCutCornerSlabGeo,
  createSideExtrudeGeo,
  createLatheYGeo,
  attachMuzzleFlashMesh,
  createContactShadowMesh
} from '../TowerRigPrimitives.ts';
import type {
  ModelMaterials,
  StructuralMatKey,
  TowerRig3D
} from '../TowerRigPrimitives.ts';

// ============================================================================
// SHARED ROTATION & CLOSED SOLID GEOMETRY HELPERS
// ============================================================================

const _rotQuat = new THREE.Quaternion();
const _rotEuler = new THREE.Euler();
const _offsetVec = new THREE.Vector3();

/**
 * Converts intrinsic YXZ rotation (yaw around Y, then local X pitch, then local Z roll)
 * into XYZ Euler angles expected by `StaticMeshBatcher.add`.
 */
function yxzToXyz(rx: number, ry: number, rz = 0): [number, number, number] {
  _rotEuler.set(rx, ry, rz, 'YXZ');
  _rotQuat.setFromEuler(_rotEuler);
  _rotEuler.setFromQuaternion(_rotQuat, 'XYZ');
  return [_rotEuler.x, _rotEuler.y, _rotEuler.z];
}

/**
 * Computes world-space offset of a local point `(lx, ly, lz)` rotated by intrinsic YXZ `(rx, ry, rz)`.
 */
function localOffsetYXZ(
  bx: number,
  by: number,
  bz: number,
  lx: number,
  ly: number,
  lz: number,
  rx: number,
  ry: number,
  rz = 0
): [number, number, number] {
  _rotEuler.set(rx, ry, rz, 'YXZ');
  _rotQuat.setFromEuler(_rotEuler);
  _offsetVec.set(lx, ly, lz).applyQuaternion(_rotQuat);
  return [bx + _offsetVec.x, by + _offsetVec.y, bz + _offsetVec.z];
}

/**
 * Lightweight cached BoxGeometry (12 tris) strictly for thin sub-0.08u trims, louver slats,
 * cage wires, and micro-details so hero volumes stay beveled while staying <= 3500 tris.
 */
function getTrimBoxGeo(w: number, h: number, d: number): THREE.BufferGeometry {
  const key = `tbox:${w.toFixed(3)}:${h.toFixed(3)}:${d.toFixed(3)}`;
  return getGeo(key, () => new THREE.BoxGeometry(w, h, d));
}

function getSolidParabolicDishGeo(scale = 1.0): THREE.BufferGeometry {
  const s = scale;
  return createLatheYGeo(
    [
      [0.001, -0.045 * s],
      [0.18 * s, -0.035 * s],
      [0.36 * s, 0.13 * s],
      [0.38 * s, 0.18 * s],
      [0.34 * s, 0.19 * s],
      [0.24 * s, 0.08 * s],
      [0.001, 0.025 * s]
    ],
    12
  );
}

// ============================================================================
// 1. IRON DOME — C4ISR ACTIVE SHIELD & TAMIR INTERCEPTOR BATTERY
// ============================================================================

export function buildIronDome(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('iron_dome', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88, 0.42));

  // Octagonal C4ISR command plinth (strictly radius <= 1.78 <= 1.84 for y <= 0.28)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.66, 1.76, 0.19, 8, 0.035), 0, 0.095, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.38, 1.46, 0.09, 8, 0.02), 0, 0.235, 0);

  // 4 low armored stabilizing gussets & C4ISR conduit lugs inside r <= 1.56 (clear of ewRing r=1.62..1.69)
  const gussetGeo = getChamferedBoxGeo(0.28, 0.16, 0.56, 0.025);
  const lugGeo = getChamferedBoxGeo(0.22, 0.12, 0.26, 0.02);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    batcher.add('root', 'darkSteel', gussetGeo, Math.sin(a) * 1.28, 0.18, Math.cos(a) * 1.28, 0, a, 0);
    const ca = (i / 4) * Math.PI * 2;
    batcher.add('root', 'oliveDark', lugGeo, Math.sin(ca) * 1.32, 0.3, Math.cos(ca) * 1.32, 0, ca, 0);
  }

  // C4ISR command junction collar on plinth
  batcher.add('root', 'oliveDark', getChamferedCylinderGeo(1.06, 1.18, 0.2, 8, 0.03), 0, 0.36, 0);

  const pivots: Record<string, THREE.Object3D> = { root };
  rig.radarPivots = [];

  if (specA) {
    // ------------------------------------------------------------------------
    // SPEC A: Fortaleza de Plasma Aegis II
    // Tall armored Aegis central pinnacle + 4 inclined buttresses + twin pods + specTrimA crown
    // ------------------------------------------------------------------------
    // 4 heavy inclined fortress buttresses anchoring the citadel (r <= 1.46, clear of ewRing 1.62..1.69)
    const buttressGeo = createSideExtrudeGeo(
      [
        [-0.36, 0.0],
        [0.44, 0.0],
        [0.14, 0.78],
        [-0.36, 0.78]
      ],
      0.24,
      0.025,
      0.025
    );
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      batcher.add('root', 'desertArmor', buttressGeo, Math.sin(a) * 1.02, 0.28, Math.cos(a) * 1.02, 0, a, 0);
      batcher.add(
        'root',
        'darkSteel',
        getChamferedBoxGeo(0.18, 0.1, 0.34, 0.015),
        Math.sin(a) * 1.28,
        0.34,
        Math.cos(a) * 1.28,
        0,
        a,
        0
      );
    }

    // Citadel armored lower drum (y = 0.46..1.06)
    batcher.add('root', 'desertArmor', getChamferedCylinderGeo(0.86, 0.98, 0.62, 8, 0.04), 0, 0.76, 0);
    batcher.add('root', 'darkSteel', getChamferedCylinderGeo(0.92, 0.92, 0.12, 8, 0.02), 0, 1.06, 0);

    // Turret pivot sits cleanly above buttresses (y = 1.10) so twin pods rotate 360° with zero clipping
    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 1.1, 0);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;
    pivots.turret = turretPivot;

    // Armored turntable yoke + central Aegis pinnacle rising to y_local = 1.45 (world y = 2.55)
    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.76, 0.84, 0.18, 8, 0.025), 0, 0.09, 0);
    batcher.add('turret', 'desertArmor', getChamferedBoxGeo(1.48, 0.3, 0.92, 0.04), 0, 0.3, 0);

    // Central Aegis caged plasma spire (caged behind 4 thick darkSteel ribs -> <= 2% cyan emissive)
    batcher.add('turret', 'oliveDark', getChamferedCylinderGeo(0.36, 0.44, 0.34, 8, 0.03), 0, 0.56, -0.06);
    batcher.add('turret', 'radarCyan', getGeo('idome_core_a', () => new THREE.CylinderGeometry(0.105, 0.115, 0.6, 8)), 0, 1.0, -0.06);
    const ribGeo = getTrimBoxGeo(0.08, 0.72, 0.13);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      batcher.add('turret', 'darkSteel', ribGeo, Math.sin(a) * 0.24, 1.02, -0.06 + Math.cos(a) * 0.24, 0, a, 0);
    }
    batcher.add('turret', 'steel', getChamferedCylinderGeo(0.32, 0.34, 0.07, 8, 0.015), 0, 0.98, -0.06);
    batcher.add('turret', 'desertArmor', getChamferedCylinderGeo(0.28, 0.38, 0.24, 8, 0.03), 0, 1.44, -0.06);

    // Subtle Aegis specTrimA crown ring & yoke trim
    const aegisCrownGeo = getGeo('idome_specA_crown', () => new THREE.TorusGeometry(0.37, 0.024, 4, 20));
    batcher.add('turret', 'specTrimA', aegisCrownGeo, 0, 1.32, -0.06, Math.PI / 2, 0, 0);
    batcher.add('turret', 'specTrimA', getTrimBoxGeo(0.56, 0.05, 0.06), 0, 0.34, 0.48);

    // Twin reinforced Tamir interceptor pods on turret flanks
    const podGroup = new THREE.Group();
    podGroup.position.set(0, 0.52, 0.22);
    podGroup.rotation.x = -0.68;
    turretPivot.add(podGroup);
    pivots.pod = podGroup;

    const podBodyGeo = getChamferedBoxGeo(0.68, 0.66, 1.36, 0.035);
    const podCollarGeo = getChamferedBoxGeo(0.72, 0.7, 0.14, 0.02);
    const podTrimGeo = getTrimBoxGeo(0.62, 0.05, 0.06);
    const tubeGeo = getGeo('idome_tube_a', () => new THREE.CylinderGeometry(0.076, 0.076, 0.22, 6, 1, true));
    const capPositions: [number, number, number][] = [];

    for (const sx of [-0.76, 0.76]) {
      batcher.add('pod', 'desertArmor', podBodyGeo, sx, 0.1, 0);
      batcher.add('pod', 'darkSteel', podCollarGeo, sx, 0.1, 0.64);
      batcher.add('pod', 'specTrimA', podTrimGeo, sx, 0.45, 0.34);
      for (let c = 0; c < 3; c++) {
        for (let r = 0; r < 2; r++) {
          const tx = sx + (c - 1) * 0.19;
          const ty = -0.03 + r * 0.22;
          batcher.add('pod', 'gunmetal', tubeGeo, tx, ty, 0.62, Math.PI / 2, 0, 0);
          capPositions.push([tx, ty, 0.7]);
        }
      }
    }

    const batchedCaps = createBatchedMissileCapsMesh(
      `iron_dome:${level}:A:missileCaps`,
      capPositions,
      0.062,
      mats.navalWhite,
      1.15,
      10
    );
    podGroup.add(batchedCaps);
    rig.missileCaps = [batchedCaps];

    // Rotating AESA radar array atop the Aegis pinnacle
    const radarHead = new THREE.Group();
    radarHead.position.set(0, 1.66, -0.06);
    turretPivot.add(radarHead);
    rig.radarPivots.push(radarHead);
    pivots.radar_0 = radarHead;

    batcher.add('radar_0', 'darkSteel', getChamferedCylinderGeo(0.14, 0.18, 0.18, 8, 0.02), 0, 0, 0);
    batcher.add('radar_0', 'desertArmor', getChamferedBoxGeo(0.92, 0.48, 0.18, 0.03), 0, 0.24, 0, -0.22, 0, 0);
    batcher.add('radar_0', 'copperAesa', getChamferedBoxGeo(0.76, 0.36, 0.06, 0.015), 0, 0.24, 0.1, -0.22, 0, 0);

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0.14, 0.88);
    podGroup.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(podGroup, mats, 0, 0.14, 0.94, 1.25, true);
  } else if (specB) {
    // ------------------------------------------------------------------------
    // SPEC B: Matriz Regenerativa Quântica
    // 3 inclined phased-array harmonic panels around core + dual rotating radar matrix + specTrimB arcs
    // ------------------------------------------------------------------------
    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 0.44, 0);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;
    pivots.turret = turretPivot;

    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.92, 1.0, 0.2, 10, 0.03), 0, 0.1, 0);

    // Central caged quantum regeneration emitter core (heavy 6-rib darkSteel cage -> <= 2% cyan emissive)
    batcher.add('turret', 'oliveDark', getChamferedCylinderGeo(0.46, 0.56, 0.38, 10, 0.03), 0, 0.36, -0.18);
    batcher.add('turret', 'radarCyan', getGeo('idome_core_b', () => new THREE.CylinderGeometry(0.11, 0.11, 0.7, 8)), 0, 0.9, -0.18);
    const cageRibGeo = getTrimBoxGeo(0.075, 0.84, 0.12);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      batcher.add('turret', 'darkSteel', cageRibGeo, Math.sin(a) * 0.26, 0.92, -0.18 + Math.cos(a) * 0.26, 0, a, 0);
    }
    batcher.add('turret', 'steel', getChamferedCylinderGeo(0.36, 0.36, 0.08, 10, 0.015), 0, 0.92, -0.18);
    batcher.add('turret', 'oliveDark', getChamferedCylinderGeo(0.34, 0.42, 0.22, 10, 0.025), 0, 1.42, -0.18);

    // 3 inclined harmonic phased-array panels at 120° around the rear/flank core (clear of forward pod)
    const panelHousingGeo = getChamferedBoxGeo(0.68, 0.82, 0.14, 0.03);
    const panelArrayGeo = getTrimBoxGeo(0.54, 0.64, 0.05);
    const panelStrutGeo = getTrimBoxGeo(0.14, 0.52, 0.16);
    const panelArcGeo = getTrimBoxGeo(0.58, 0.055, 0.07);
    const panelAngles = [Math.PI, Math.PI * 0.36, -Math.PI * 0.36];
    for (const a of panelAngles) {
      const px = Math.sin(a) * 0.88;
      const pz = -0.18 + Math.cos(a) * 0.88;
      const [erx, ery, erz] = yxzToXyz(-0.34, a, 0);
      batcher.add('turret', 'darkSteel', panelStrutGeo, Math.sin(a) * 0.66, 0.46, -0.18 + Math.cos(a) * 0.66, 0, a, 0);
      batcher.add('turret', 'desertArmor', panelHousingGeo, px, 0.86, pz, erx, ery, erz);
      const [fx, fy, fz] = localOffsetYXZ(px, 0.86, pz, 0, 0, 0.08, -0.34, a, 0);
      batcher.add('turret', 'copperAesa', panelArrayGeo, fx, fy, fz, erx, ery, erz);
      const [ax, ay, az] = localOffsetYXZ(px, 0.86, pz, 0, 0.41, 0.05, -0.34, a, 0);
      batcher.add('turret', 'specTrimB', panelArcGeo, ax, ay, az, erx, ery, erz);
    }

    // Subtle specTrimB containment ring around upper core crown
    const crownArcGeo = getGeo('idome_specB_arc', () => new THREE.TorusGeometry(0.42, 0.024, 4, 20));
    batcher.add('turret', 'specTrimB', crownArcGeo, 0, 1.48, -0.18, Math.PI / 2, 0, 0);

    // Forward Tamir interceptor pod (4x3 = 12 missiles batched)
    const podGroup = new THREE.Group();
    podGroup.position.set(0, 0.62, 0.56);
    podGroup.rotation.x = -0.74;
    turretPivot.add(podGroup);
    pivots.pod = podGroup;

    batcher.add('pod', 'desertArmor', getChamferedBoxGeo(1.06, 0.72, 1.28, 0.035), 0, 0, 0);
    batcher.add('pod', 'darkSteel', getChamferedBoxGeo(1.1, 0.76, 0.14, 0.02), 0, 0, 0.6);
    const tubeGeo = getGeo('idome_tube_b', () => new THREE.CylinderGeometry(0.072, 0.072, 0.22, 6, 1, true));
    const capPositions: [number, number, number][] = [];
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        const tx = -0.33 + c * 0.22;
        const ty = -0.2 + r * 0.2;
        batcher.add('pod', 'gunmetal', tubeGeo, tx, ty, 0.58, Math.PI / 2, 0, 0);
        capPositions.push([tx, ty, 0.66]);
      }
    }
    const batchedCaps = createBatchedMissileCapsMesh(
      `iron_dome:${level}:B:missileCaps`,
      capPositions,
      0.058,
      mats.navalWhite,
      1.1,
      10
    );
    podGroup.add(batchedCaps);
    rig.missileCaps = [batchedCaps];

    // Crossbar & Dual rotating AESA radar matrix (radar_0 & radar_1, spaced cleanly at x = ±0.56)
    batcher.add('turret', 'darkSteel', getTrimBoxGeo(1.24, 0.12, 0.16), 0, 1.62, -0.18);
    const radarPanelGeo = getChamferedBoxGeo(0.62, 0.42, 0.14, 0.025);
    const radarFaceGeo = getTrimBoxGeo(0.5, 0.32, 0.05);
    for (let i = 0; i < 2; i++) {
      const sx = i === 0 ? -0.56 : 0.56;
      const rPivot = new THREE.Group();
      rPivot.position.set(sx, 1.72, -0.18);
      turretPivot.add(rPivot);
      rig.radarPivots.push(rPivot);
      const rKey = `radar_${i}`;
      pivots[rKey] = rPivot;
      batcher.add(rKey, 'darkSteel', getChamferedCylinderGeo(0.09, 0.11, 0.22, 8, 0.015), 0, 0.1, 0);
      batcher.add(rKey, 'desertArmor', radarPanelGeo, 0, 0.34, 0, -0.24, 0, 0);
      batcher.add(rKey, 'copperAesa', radarFaceGeo, 0, 0.34, 0.08, -0.24, 0, 0);
    }

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0.12, 0.84);
    podGroup.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(podGroup, mats, 0, 0.12, 0.9, 1.2, true);
  } else {
    // ------------------------------------------------------------------------
    // BASELINE (Lv1, Lv2-3, Lv4+): Tamir Interceptor + Caged Field Spire + Rotating AESA Mast
    // ------------------------------------------------------------------------
    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 0.44, 0);
    root.add(turretPivot);
    rig.turretPivot = turretPivot;
    pivots.turret = turretPivot;

    // Armored turntable + chassis deck
    batcher.add('turret', 'darkSteel', getChamferedCylinderGeo(0.88, 0.96, 0.18, 10, 0.03), 0, 0.09, 0);
    batcher.add('turret', 'desertArmor', getChamferedBoxGeo(1.26, 0.26, 1.46, 0.04), 0, 0.3, 0);

    // Rear Caged Field-Emitter Spire (heavy darkSteel cage -> <= 2.5% cyan emissive)
    const spireH = level === 1 ? 0.88 : level === 2 ? 1.06 : 1.24;
    batcher.add('turret', 'oliveDark', getChamferedCylinderGeo(0.32, 0.38, 0.28, 8, 0.025), 0, 0.54, -0.44);
    batcher.add(
      'turret',
      'radarCyan',
      getGeo(`idome_core_lv${level}`, () => new THREE.CylinderGeometry(0.1, 0.11, spireH * 0.62, 8)),
      0,
      0.62 + spireH * 0.34,
      -0.44
    );
    const ribGeo = getTrimBoxGeo(0.075, spireH * 0.72, 0.11);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      batcher.add('turret', 'darkSteel', ribGeo, Math.sin(a) * 0.22, 0.62 + spireH * 0.34, -0.44 + Math.cos(a) * 0.22, 0, a, 0);
    }
    if (level >= 2) {
      const coilGeo = getGeo('idome_base_coil', () => new THREE.TorusGeometry(0.29, 0.026, 4, 14));
      batcher.add('turret', 'copperAesa', coilGeo, 0, 0.78, -0.44, Math.PI / 2, 0, 0);
      if (level >= 3) {
        batcher.add('turret', 'copperAesa', coilGeo, 0, 1.08, -0.44, Math.PI / 2, 0, 0);
      }
    }
    batcher.add('turret', 'steel', getChamferedCylinderGeo(0.28, 0.34, 0.18, 8, 0.02), 0, 0.68 + spireH * 0.72, -0.44);
    if (level >= 3) {
      batcher.add('turret', 'specTrimTier', getTrimBoxGeo(0.76, 0.05, 0.06), 0, 0.36, 0.74);
    }

    // Rotating EL/M-2084 AESA Radar Mast atop rear spire (spins completely clear of launcher pod!)
    const radarHead = new THREE.Group();
    radarHead.position.set(0, 0.8 + spireH * 0.72, -0.44);
    turretPivot.add(radarHead);
    rig.radarPivots.push(radarHead);
    pivots.radar_0 = radarHead;

    const rW = level === 1 ? 0.72 : level === 2 ? 0.9 : 1.04;
    const rH = level === 1 ? 0.44 : level === 2 ? 0.56 : 0.62;
    batcher.add('radar_0', 'darkSteel', getChamferedCylinderGeo(0.11, 0.14, 0.2, 8, 0.015), 0, 0.08, 0);
    batcher.add('radar_0', 'desertArmor', getChamferedBoxGeo(rW, rH, 0.18, 0.03), 0, 0.32, 0, -0.22, 0, 0);
    batcher.add('radar_0', 'copperAesa', getTrimBoxGeo(rW * 0.82, rH * 0.74, 0.05), 0, 0.32, 0.1, -0.22, 0, 0);

    // Inclined Tamir Interceptor Launcher Pod on forward trunnions
    const podGroup = new THREE.Group();
    podGroup.position.set(0, 0.76, 0.4);
    podGroup.rotation.x = -0.76;
    turretPivot.add(podGroup);
    pivots.pod = podGroup;

    const cols = level === 1 ? 3 : level === 2 ? 4 : 5;
    const rows = level === 1 ? 2 : 3;
    const podW = cols * 0.24 + 0.18;
    const podH = rows * 0.24 + 0.16;
    batcher.add('pod', 'desertArmor', getChamferedBoxGeo(podW, podH, 1.38, 0.035), 0, 0, 0);
    batcher.add('pod', 'darkSteel', getChamferedBoxGeo(podW + 0.06, podH + 0.06, 0.14, 0.02), 0, 0, 0.64);
    if (level >= 2) {
      // Side armored blast-deflector cheeks
      for (const sx of [-(podW * 0.5 + 0.05), podW * 0.5 + 0.05]) {
        batcher.add('pod', 'darkSteel', getTrimBoxGeo(0.08, podH * 0.78, 0.96), sx, 0, 0.06);
      }
    }

    const tubeGeo = getGeo('idome_tube_base', () => new THREE.CylinderGeometry(0.074, 0.074, 0.22, 6, 1, true));
    const capPositions: [number, number, number][] = [];
    const startX = -((cols - 1) * 0.23) * 0.5;
    const startY = -((rows - 1) * 0.23) * 0.5;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const tx = startX + c * 0.23;
        const ty = startY + r * 0.23;
        batcher.add('pod', 'gunmetal', tubeGeo, tx, ty, 0.62, Math.PI / 2, 0, 0);
        capPositions.push([tx, ty, 0.7]);
      }
    }

    const batchedCaps = createBatchedMissileCapsMesh(
      `iron_dome:${level}:none:missileCaps`,
      capPositions,
      0.06,
      mats.navalWhite,
      1.08,
      10
    );
    podGroup.add(batchedCaps);
    rig.missileCaps = [batchedCaps];

    const muzzlePoint = new THREE.Object3D();
    muzzlePoint.position.set(0, 0.14, 0.92);
    podGroup.add(muzzlePoint);
    rig.muzzlePoint = muzzlePoint;
    rig.muzzleFlashMesh = attachMuzzleFlashMesh(podGroup, mats, 0, 0.14, 0.98, 1.15, true);
  }

  batcher.flush(pivots, mats);

  // Subtle 36-seg perimeter shield field ring on Lv2+ (outer r=1.74..1.80 clears all pillars & 0.91..1.01 pulse, noShadow = true)
  if (level >= 2) {
    rig.ewRings = [];
    const fieldRingGeo = getGeo('idome_ew_ring_36_v2', () => new THREE.RingGeometry(1.74, 1.8, 36));
    const fieldRing = new THREE.Mesh(fieldRingGeo, mats.ewRingSubtle);
    fieldRing.rotation.x = -Math.PI / 2;
    fieldRing.position.y = 0.29;
    fieldRing.userData.noShadow = true;
    fieldRing.castShadow = false;
    fieldRing.receiveShadow = false;
    root.add(fieldRing);
    rig.ewRings.push(fieldRing);
  }
}

// ============================================================================
// 2. ENGINEERING WORKSHOP — ARMORED FIELD DEPOT & SLEWING RECOVERY CRANE
// ============================================================================

export function buildEngWorkshop(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('eng_workshop', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88, 0.42));

  // Cut-corner reinforced concrete work apron (w=2.96, corner=0.62 -> max corner radius = 1.72 <= 1.84!)
  batcher.add('root', 'concreteDark', getCutCornerSlabGeo(2.96, 0.19, 2.96, 0.62, 0.035), 0, 0.035, 0);
  batcher.add('root', 'diamondPlate', getCutCornerSlabGeo(2.58, 0.08, 2.58, 0.54, 0.02), 0, 0.21, 0);

  // Armored campaign repair depot shelter (sloped military roof profile)
  const shelterGeo = createSideExtrudeGeo(
    [
      [-0.86, 0.0],
      [0.72, 0.0],
      [0.72, 0.66],
      [0.44, 0.84],
      [-0.86, 0.84]
    ],
    1.76,
    0.035,
    0.035
  );
  batcher.add('root', specB ? 'oliveDark' : 'desertArmor', shelterGeo, 0, 0.28, -0.34);

  // Recessed dark bay shutter door + armored lintel + roof reinforcement ribs
  batcher.add('root', 'darkSteel', getTrimBoxGeo(1.18, 0.56, 0.12), -0.06, 0.58, 0.38);
  batcher.add('root', 'steel', getTrimBoxGeo(1.32, 0.1, 0.18), -0.06, 0.9, 0.4);
  for (const rx of [-0.62, 0, 0.62]) {
    batcher.add('root', 'oliveDark', getTrimBoxGeo(0.12, 0.08, 1.38), rx, 1.15, -0.42);
  }

  // Rear auxiliary generator & exhaust stack on shelter back
  batcher.add('root', 'oliveDark', getChamferedBoxGeo(0.74, 0.46, 0.36, 0.03), 0.34, 0.52, -1.26);
  batcher.add('root', 'darkSteel', getGeo('eng_exhaust', () => new THREE.CylinderGeometry(0.055, 0.065, 0.62, 8)), 0.58, 0.98, -1.28);

  // Left flank spare off-road wheel rack (2 tires at Lv1, 3 at Lv2+)
  const tireCount = level === 1 ? 2 : 3;
  const tireGeo = getChamferedCylinderGeo(0.24, 0.24, 0.15, 10, 0.03);
  const hubGeo = getGeo('eng_wheel_hub', () => new THREE.CylinderGeometry(0.11, 0.11, 0.17, 8));
  batcher.add('root', 'darkSteel', getTrimBoxGeo(0.24, 0.08, tireCount * 0.28 + 0.18), -1.06, 0.32, 0.28);
  for (let i = 0; i < tireCount; i++) {
    const tz = 0.04 + i * 0.26;
    batcher.add('root', 'tire', tireGeo, -1.06, 0.58, tz, 0, 0, Math.PI / 2);
    batcher.add('root', 'steel', hubGeo, -1.06, 0.58, tz, 0, 0, Math.PI / 2);
  }

  // Front-right welding workbench + steel/oliveDark gas welding cylinders
  batcher.add('root', 'darkSteel', getChamferedBoxGeo(0.68, 0.34, 0.42, 0.025), 0.72, 0.45, 0.76);
  batcher.add('root', 'steel', getTrimBoxGeo(0.74, 0.06, 0.46), 0.72, 0.64, 0.76);
  batcher.add('root', 'steel', getGeo('eng_gas_brass', () => new THREE.CylinderGeometry(0.065, 0.065, 0.46, 8)), 1.12, 0.52, 0.68);
  batcher.add('root', 'oliveDark', getGeo('eng_gas_olive', () => new THREE.CylinderGeometry(0.065, 0.065, 0.42, 8)), 1.12, 0.5, 0.84);

  // Small caged hazard/repair beacon on roof corner (<= 0.5% emissive!)
  const beaconMat: StructuralMatKey = specA ? 'radarCyan' : 'amberGlow';
  batcher.add('root', 'darkSteel', getGeo('eng_b_base', () => new THREE.CylinderGeometry(0.11, 0.13, 0.08, 8)), -0.68, 1.16, -0.84);
  batcher.add('root', beaconMat, getGeo('eng_b_bulb', () => new THREE.CylinderGeometry(0.055, 0.055, 0.13, 8)), -0.68, 1.25, -0.84);
  batcher.add('root', 'darkSteel', getGeo('eng_b_cap', () => new THREE.CylinderGeometry(0.095, 0.095, 0.04, 8)), -0.68, 1.33, -0.84);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    batcher.add('root', 'darkSteel', getTrimBoxGeo(0.024, 0.16, 0.024), -0.68 + Math.sin(a) * 0.085, 1.25, -0.84 + Math.cos(a) * 0.085);
  }

  const pivots: Record<string, THREE.Object3D> = { root };
  rig.radarPivots = [];

  if (specA) {
    // ------------------------------------------------------------------------
    // SPEC A: Nanorreparo Industrial Turbo
    // Dual articulated robotic arms on rotor + 2 micro-drone helipads + lateral compressors + specTrimA
    // ------------------------------------------------------------------------
    // Lateral industrial air/nano-compressors with copper pressure manifolds
    for (const sx of [-1.06, 1.06]) {
      batcher.add('root', 'steel', getChamferedBoxGeo(0.38, 0.48, 0.62, 0.03), sx, 0.54, -0.58);
      batcher.add('root', 'copperAesa', getChamferedCylinderGeo(0.11, 0.11, 0.52, 8, 0.018), sx, 0.84, -0.58, Math.PI / 2, 0, 0);
      batcher.add('root', 'specTrimA', getTrimBoxGeo(0.05, 0.06, 0.44), sx + (sx < 0 ? -0.19 : 0.19), 0.64, -0.58);
    }

    // Twin elevated micro-drone helipads (cantilevered cleanly at y = 1.02, r <= 1.46 clear of ewRing)
    const padDeckGeo = getChamferedCylinderGeo(0.36, 0.39, 0.07, 8, 0.015);
    const droneBodyGeo = getTrimBoxGeo(0.16, 0.07, 0.18);
    const droneArmGeo = getTrimBoxGeo(0.3, 0.025, 0.03);
    for (const sx of [-0.92, 0.92]) {
      batcher.add('root', 'darkSteel', getTrimBoxGeo(0.12, 0.68, 0.12), sx, 0.64, 0.66);
      batcher.add('root', 'diamondPlate', padDeckGeo, sx, 1.02, 0.66);
      batcher.add('root', 'specTrimA', getTrimBoxGeo(0.34, 0.02, 0.045), sx, 1.065, 0.66);
      batcher.add('root', 'specTrimA', getTrimBoxGeo(0.045, 0.02, 0.34), sx, 1.065, 0.66);
      // Parked micro-repair quad-drone
      batcher.add('root', 'darkSteel', droneBodyGeo, sx, 1.12, 0.66);
      batcher.add('root', 'steel', droneArmGeo, sx, 1.13, 0.66, 0, Math.PI / 4, 0);
      batcher.add('root', 'steel', droneArmGeo, sx, 1.13, 0.66, 0, -Math.PI / 4, 0);
    }

    // Slewing central dual-robotic-arm rotor atop depot roof (y = 1.18, spins clear of helipads!)
    const rotorPivot = new THREE.Group();
    rotorPivot.position.set(0, 1.18, -0.34);
    root.add(rotorPivot);
    rig.radarPivots.push(rotorPivot);
    pivots.radar_0 = rotorPivot;

    batcher.add('radar_0', 'darkSteel', getChamferedCylinderGeo(0.34, 0.42, 0.24, 8, 0.025), 0, 0.12, 0);
    batcher.add('radar_0', 'oliveDark', getChamferedBoxGeo(0.68, 0.26, 0.52, 0.035), 0, 0.32, 0);
    batcher.add('radar_0', 'specTrimA', getTrimBoxGeo(0.56, 0.05, 0.54), 0, 0.34, 0);

    // Dual articulated robotic manipulator arms (mirrored left & right)
    const upperArmGeo = getTrimBoxGeo(0.12, 0.14, 0.72);
    const foreArmGeo = getTrimBoxGeo(0.09, 0.11, 0.64);
    const jointGeo = getGeo('eng_arm_joint', () => new THREE.CylinderGeometry(0.095, 0.095, 0.16, 8));
    const tipGeo = getGeo('eng_arm_tip', () => new THREE.CylinderGeometry(0.035, 0.05, 0.14, 6));
    for (const sx of [-0.36, 0.36]) {
      batcher.add('radar_0', 'brass', jointGeo, sx, 0.42, 0.1, 0, 0, Math.PI / 2);
      batcher.add('radar_0', 'steel', upperArmGeo, sx, 0.62, 0.38, -0.58, 0, 0);
      batcher.add('radar_0', 'brass', jointGeo, sx, 0.82, 0.66, 0, 0, Math.PI / 2);
      batcher.add('radar_0', 'darkSteel', foreArmGeo, sx, 0.72, 0.96, 0.34, 0, 0);
      batcher.add('radar_0', 'specTrimA', tipGeo, sx, 0.62, 1.26, Math.PI / 2 + 0.34, 0, 0);
    }
  } else if (specB) {
    // ------------------------------------------------------------------------
    // SPEC B: Bastião de Engenharia Imortal
    // Armored casemate canopy with deflector plates + heavy crane boom + stacked armor plates + specTrimB
    // ------------------------------------------------------------------------
    // Heavy sloped casemate canopy & armored deflector plates shielding the depot
    const casemateRoofGeo = createSideExtrudeGeo(
      [
        [-1.08, 0.0],
        [0.98, 0.0],
        [0.64, 0.34],
        [-0.86, 0.34]
      ],
      2.12,
      0.035,
      0.035
    );
    batcher.add('root', 'desertArmor', casemateRoofGeo, 0, 1.12, -0.26);
    // Corner armored casemate stanchions & glacis side deflector skirts
    for (const sx of [-0.98, 0.98]) {
      batcher.add('root', 'darkSteel', getChamferedBoxGeo(0.18, 0.92, 0.22, 0.025), sx, 0.74, 0.54);
      batcher.add('root', 'oliveDark', getChamferedBoxGeo(0.14, 0.56, 1.48, 0.025), sx + (sx < 0 ? -0.1 : 0.1), 0.68, -0.24, 0, 0, sx < 0 ? 0.22 : -0.22);
    }
    // Casemate amber hazard brow trim
    batcher.add('root', 'specTrimB', getChamferedBoxGeo(1.72, 0.06, 0.06, 0.01), 0, 1.24, 0.72);

    // Stacked composite armor plates on front-left heavy pallet
    const plateGeo = getChamferedBoxGeo(0.62, 0.08, 0.44, 0.015);
    for (let p = 0; p < 3; p++) {
      batcher.add('root', p % 2 === 0 ? 'desertArmor' : 'oliveDark', plateGeo, -0.54, 0.34 + p * 0.095, 0.88, 0, 0.12 * (p - 1), 0);
    }

    // Heavy-lift armored recovery crane boom atop casemate roof (y = 1.46, spins completely clear!)
    const cranePivot = new THREE.Group();
    cranePivot.position.set(0, 1.46, -0.34);
    root.add(cranePivot);
    rig.radarPivots.push(cranePivot);
    pivots.radar_0 = cranePivot;

    batcher.add('radar_0', 'darkSteel', getChamferedCylinderGeo(0.42, 0.48, 0.22, 10, 0.025), 0, 0.11, 0);
    batcher.add('radar_0', 'oliveDark', getRoundedBoxGeo(0.76, 0.34, 0.86, 0.04, 1), 0, 0.34, -0.1);
    batcher.add('radar_0', 'concreteDark', getChamferedBoxGeo(0.68, 0.28, 0.26, 0.025), 0, 0.32, -0.62);
    // Heavy twin-girder recovery boom + twin brass hydraulic rams + hoist hook
    for (const bx of [-0.14, 0.14]) {
      batcher.add('radar_0', 'steel', getChamferedBoxGeo(0.11, 0.16, 1.56, 0.02), bx, 0.72, 0.56, -0.44, 0, 0);
      batcher.add('radar_0', 'brass', getChamferedCylinderGeo(0.045, 0.055, 0.68, 8, 0.01), bx, 0.52, 0.38, -0.78, 0, 0);
    }
    batcher.add('radar_0', 'specTrimB', getChamferedBoxGeo(0.42, 0.06, 0.12, 0.01), 0, 0.98, 1.12, -0.44, 0, 0);
    batcher.add('radar_0', 'darkSteel', getChamferedCylinderGeo(0.03, 0.03, 0.42, 6, 0.005), 0, 0.84, 1.24);
    batcher.add('radar_0', 'brass', getChamferedBoxGeo(0.16, 0.18, 0.14, 0.02), 0, 0.6, 1.24);
  } else {
    // ------------------------------------------------------------------------
    // BASELINE (Lv1, Lv2-3, Lv4+): Industrial Articulated Crane (brass/steel) + Gantry Pillars on Lv2+
    // ------------------------------------------------------------------------
    if (level >= 2) {
      // Heavy steel depot side pilasters & overhead bracing frame
      for (const sx of [-0.94, 0.94]) {
        batcher.add('root', 'steel', getChamferedBoxGeo(0.14, 0.88, 0.16, 0.02), sx, 0.72, 0.46);
      }
      batcher.add('root', 'darkSteel', getChamferedBoxGeo(2.02, 0.12, 0.16, 0.02), 0, 1.12, 0.46);
    }
    if (level >= 3) {
      // Armored tool/supply crate stack & tier trim strip
      batcher.add('root', 'oliveDark', getChamferedBoxGeo(0.56, 0.28, 0.38, 0.025), -0.46, 0.42, 0.84);
      batcher.add('root', 'specTrimTier', getChamferedBoxGeo(1.1, 0.045, 0.05, 0.008), 0, 1.12, 0.54);
    }

    // Slewing articulated industrial crane atop depot (y = 1.16, spins freely 360°)
    const cranePivot = new THREE.Group();
    cranePivot.position.set(0, 1.16, -0.34);
    root.add(cranePivot);
    rig.radarPivots.push(cranePivot);
    pivots.radar_0 = cranePivot;

    batcher.add('radar_0', 'darkSteel', getChamferedCylinderGeo(0.32, 0.38, 0.2, 10, 0.025), 0, 0.1, 0);
    batcher.add('radar_0', 'oliveDark', getChamferedBoxGeo(0.56, 0.28, 0.72, 0.03), 0, 0.3, -0.06);
    batcher.add('radar_0', 'brass', getChamferedCylinderGeo(0.14, 0.14, 0.36, 10, 0.02), 0, 0.34, -0.34, 0, 0, Math.PI / 2);

    const boomLen = level === 1 ? 1.12 : level === 2 ? 1.32 : 1.48;
    // Lower primary steel boom + brass hydraulic lift cylinder + outer articulated jib + hoist block
    batcher.add('radar_0', 'steel', getChamferedBoxGeo(0.18, 0.16, boomLen, 0.02), 0, 0.62, boomLen * 0.36, -0.48, 0, 0);
    batcher.add('radar_0', 'brass', getChamferedCylinderGeo(0.052, 0.062, 0.62, 8, 0.012), 0, 0.46, 0.34, -0.86, 0, 0);
    batcher.add('radar_0', 'darkSteel', getChamferedBoxGeo(0.13, 0.12, 0.56, 0.018), 0, 0.84 + boomLen * 0.14, boomLen * 0.84, 0.22, 0, 0);
    batcher.add('radar_0', 'darkSteel', getChamferedCylinderGeo(0.024, 0.024, 0.38, 6, 0.005), 0, 0.66 + boomLen * 0.12, boomLen * 1.04);
    batcher.add('radar_0', 'brass', getChamferedBoxGeo(0.14, 0.14, 0.12, 0.018), 0, 0.46 + boomLen * 0.12, boomLen * 1.04);
  }

  batcher.flush(pivots, mats);

  // Smooth 36-seg repair aura ring on Lv2+ (outer r=1.75..1.81 clears concrete apron, compressors & helipads even under pulse)
  if (level >= 2) {
    rig.ewRings = [];
    const repairRingGeo = getGeo('eng_ew_ring_36_v2', () => new THREE.RingGeometry(1.75, 1.81, 36));
    const repairRing = new THREE.Mesh(repairRingGeo, mats.ewRingSubtle);
    repairRing.rotation.x = -Math.PI / 2;
    repairRing.position.y = 0.31;
    repairRing.userData.noShadow = true;
    repairRing.castShadow = false;
    repairRing.receiveShadow = false;
    root.add(repairRing);
    rig.ewRings.push(repairRing);
  }
}

// ============================================================================
// 3. ENERGY EXTRACTOR — MOBILE FISSION TURBINE-GENERATOR
// ============================================================================

export function buildEnergyExtractor(
  root: THREE.Group,
  rig: TowerRig3D,
  mats: ModelMaterials,
  level: number,
  specialization: 'A' | 'B' | null = null
): void {
  const batcher = new StaticMeshBatcher('energy_extractor', level, specialization);
  const specA = specialization === 'A';
  const specB = specialization === 'B';

  root.add(createContactShadowMesh(1.88, 0.42));

  // Heavy octagonal concrete foundation & steel generator skid (radius <= 1.76 <= 1.84 for y <= 0.28)
  batcher.add('root', 'concreteDark', getChamferedCylinderGeo(1.66, 1.76, 0.18, 8, 0.035), 0, 0.09, 0);
  batcher.add('root', 'diamondPlate', getChamferedCylinderGeo(1.42, 1.48, 0.09, 8, 0.02), 0, 0.225, 0);

  // Welded structural steel skid rails (I-beam runners inside r <= 1.54)
  for (const sx of [-0.94, 0.94]) {
    batcher.add('root', 'darkSteel', getTrimBoxGeo(0.22, 0.14, 2.26), sx, 0.31, 0);
  }
  for (const sz of [-0.96, 0.96]) {
    batcher.add('root', 'darkSteel', getTrimBoxGeo(2.08, 0.12, 0.18), 0, 0.31, sz);
  }

  // Central heavily-caged nuclear/fission pressure vessel (<= 2% amber emissive through thick steel ribs!)
  const coreH = specA ? 1.12 : level === 1 ? 1.08 : level === 2 ? 1.26 : 1.42;
  batcher.add('root', 'oliveDark', getChamferedCylinderGeo(0.68, 0.78, 0.34, 10, 0.03), 0, 0.48, 0);
  batcher.add(
    'root',
    'amberGlow',
    getGeo(`ext_core_${specA ? 'a' : level}`, () => new THREE.CylinderGeometry(0.19, 0.2, coreH * 0.68, 8, 1, true)),
    0,
    0.62 + coreH * 0.42,
    0
  );

  // 6 thick structural steel containment ribs + horizontal armored baffle collars enclosing the core
  const cageRibGeo = getTrimBoxGeo(0.13, coreH * 0.88, 0.22);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    batcher.add('root', 'darkSteel', cageRibGeo, Math.sin(a) * 0.44, 0.62 + coreH * 0.44, Math.cos(a) * 0.44, 0, a, 0);
  }
  const baffleCount = level >= 2 ? 3 : 2;
  const baffleGeo = getGeo('ext_baffle', () => new THREE.TorusGeometry(0.54, 0.042, 4, 14));
  for (let b = 0; b < baffleCount; b++) {
    const by = 0.78 + (b / Math.max(1, baffleCount - 1)) * (coreH * 0.56);
    batcher.add('root', 'steel', baffleGeo, 0, by, 0, Math.PI / 2, 0, 0);
  }

  // Copper induction winding coils around reactor pressure core (using exact key 'copperAesa')
  const coilCount = level === 1 ? 2 : 3;
  const coilGeo = getGeo('extractor_copper_coil', () => new THREE.TorusGeometry(0.62, 0.044, 4, 14));
  for (let i = 0; i < coilCount; i++) {
    const cy = 0.74 + i * (coreH * 0.26);
    batcher.add('root', 'copperAesa', coilGeo, 0, cy, 0, Math.PI / 2, 0, 0);
  }

  // Heavy upper containment crown cap
  const crownY = 0.66 + coreH * 0.88;
  batcher.add('root', 'darkSteel', getChamferedCylinderGeo(0.54, 0.64, 0.2, 10, 0.03), 0, crownY, 0);

  // Louvered thermal radiator banks around perimeter (2 at Lv1, 4 at Lv2+; specA swaps side banks for giant dynamos)
  const radAngles = specA
    ? [0, Math.PI]
    : level === 1
      ? [0, Math.PI]
      : [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
  const radFrameGeo = getChamferedBoxGeo(0.68, 0.76, 0.28, 0.025);
  const radLouverGeo = getTrimBoxGeo(0.54, 0.06, 0.3);
  const radPipeGeo = getGeo('ext_rad_pipe', () => new THREE.CylinderGeometry(0.06, 0.06, 0.42, 6));
  for (const a of radAngles) {
    const rx = Math.sin(a) * 1.06;
    const rz = Math.cos(a) * 1.06;
    batcher.add('root', 'oliveDark', radFrameGeo, rx, 0.74, rz, 0, a, 0);
    const [lrx, lry, lrz] = yxzToXyz(0.24, a, 0);
    for (let f = 0; f < 3; f++) {
      batcher.add('root', 'steel', radLouverGeo, rx, 0.54 + f * 0.2, rz, lrx, lry, lrz);
    }
    // Coolant feeder manifold radially into core
    const [prx, pry, prz] = yxzToXyz(Math.PI / 2, a, 0);
    batcher.add('root', 'brass', radPipeGeo, Math.sin(a) * 0.82, 0.74, Math.cos(a) * 0.82, prx, pry, prz);
  }

  const pivots: Record<string, THREE.Object3D> = { root };
  rig.radarPivots = [];

  if (specA) {
    // ------------------------------------------------------------------------
    // SPEC A: Usina de Fissão Industrial
    // Tall armored cooling chimney + 2 giant copper-wound dynamos + heavy busbars + specTrimA fins
    // ------------------------------------------------------------------------
    // Solid closed hyperbolic/tapered industrial cooling chimney (zero back-face culling)
    const chimneyGeo = createLatheYGeo(
      [
        [0.54, 0.0],
        [0.64, 0.0],
        [0.56, 0.42],
        [0.48, 0.92],
        [0.53, 1.24],
        [0.51, 1.28],
        [0.43, 1.26],
        [0.4, 0.92],
        [0.46, 0.35],
        [0.001, 0.35]
      ],
      12
    );
    batcher.add('root', 'concrete', chimneyGeo, 0, crownY + 0.04, 0);
    // Steel reinforcement hoop bands & vertical cooling fins with specTrimA strips on chimney
    batcher.add('root', 'darkSteel', getGeo('ext_ch_hoop1', () => new THREE.TorusGeometry(0.58, 0.045, 4, 12)), 0, crownY + 0.44, 0, Math.PI / 2, 0, 0);
    batcher.add('root', 'darkSteel', getGeo('ext_ch_hoop2', () => new THREE.TorusGeometry(0.53, 0.045, 4, 12)), 0, crownY + 1.24, 0, Math.PI / 2, 0, 0);
    const finGeo = getTrimBoxGeo(0.08, 0.92, 0.2);
    const finTrimGeo = getTrimBoxGeo(0.04, 0.56, 0.05);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      batcher.add('root', 'darkSteel', finGeo, Math.sin(a) * 0.56, crownY + 0.64, Math.cos(a) * 0.56, 0, a, 0);
      batcher.add('root', 'specTrimA', finTrimGeo, Math.sin(a) * 0.66, crownY + 0.64, Math.cos(a) * 0.66, 0, a, 0);
    }

    // Two giant copper-wound flank dynamos + overhead copper high-voltage busbars
    const dynamoBodyGeo = getChamferedCylinderGeo(0.38, 0.38, 1.08, 10, 0.04);
    const dynamoCoilGeo = getGeo('extractor_dynamo_coil', () => new THREE.TorusGeometry(0.4, 0.045, 3, 10));
    const dynamoCapGeo = getChamferedCylinderGeo(0.28, 0.34, 0.14, 8, 0.02);
    const dynamoBadgeGeo = getGeo('ext_dyn_badge', () => new THREE.CylinderGeometry(0.13, 0.13, 0.04, 8));
    for (const sx of [-1.06, 1.06]) {
      batcher.add('root', 'darkSteel', getTrimBoxGeo(0.54, 0.22, 1.12), sx, 0.44, 0);
      batcher.add('root', 'oliveDark', dynamoBodyGeo, sx, 0.88, 0, Math.PI / 2, 0, 0);
      for (const cz of [-0.3, 0, 0.3]) {
        batcher.add('root', 'copperAesa', dynamoCoilGeo, sx, 0.88, cz);
      }
      batcher.add('root', 'steel', dynamoCapGeo, sx, 0.88, 0.58, Math.PI / 2, 0, 0);
      batcher.add('root', 'steel', dynamoCapGeo, sx, 0.88, -0.58, Math.PI / 2, 0, 0);
      batcher.add('root', 'specTrimA', dynamoBadgeGeo, sx, 0.88, 0.66, Math.PI / 2, 0, 0);
      // Heavy copper busbar riser & bridge into main reactor chimney
      batcher.add('root', 'copperAesa', getTrimBoxGeo(0.1, 0.64, 0.12), sx, 1.48, 0);
      batcher.add('root', 'copperAesa', getTrimBoxGeo(0.56, 0.1, 0.12), sx * 0.72, 1.76, 0);
    }

    // Heavy 6-blade industrial exhaust turbine fan spinning inside the cooling tower crown
    const fanPivot = new THREE.Group();
    fanPivot.position.set(0, crownY + 1.24, 0);
    root.add(fanPivot);
    rig.radarPivots.push(fanPivot);
    pivots.radar_0 = fanPivot;

    batcher.add('radar_0', 'gunmetal', getGeo('ext_fan_hub', () => new THREE.CylinderGeometry(0.14, 0.16, 0.18, 8)), 0, 0, 0);
    batcher.add('radar_0', 'brass', getGeo('ext_fan_cap', () => new THREE.CylinderGeometry(0.08, 0.1, 0.08, 8)), 0, 0.12, 0);
    const fanBladeGeo = getTrimBoxGeo(0.14, 0.035, 0.34);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const [brx, bry, brz] = yxzToXyz(0, a, 0.32);
      batcher.add('radar_0', 'steel', fanBladeGeo, Math.sin(a) * 0.24, 0, Math.cos(a) * 0.24, brx, bry, brz);
    }
  } else if (specB) {
    // ------------------------------------------------------------------------
    // SPEC B: Sincronizador Logístico Tático
    // C4ISR tactical transmission dish/antenna matrix atop turbine + 4 conductive pylons + specTrimB
    // ------------------------------------------------------------------------
    // 4 peripheral conductive transmission pylons (at 45° diagonals, r = 1.22, clear of turbine blades r <= 0.88)
    const pylonBaseGeo = getGeo('ext_pyl_base', () => new THREE.CylinderGeometry(0.16, 0.2, 0.16, 8));
    const pylonGeo = getGeo('ext_pyl_mast', () => new THREE.CylinderGeometry(0.055, 0.095, 1.38, 6));
    const pylonCoilGeo = getGeo('extractor_pylon_coil', () => new THREE.TorusGeometry(0.12, 0.024, 4, 10));
    const tipGeo = getGeo('extractor_pylon_tip', () => new THREE.ConeGeometry(0.072, 0.17, 6));
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const px = Math.sin(a) * 1.22;
      const pz = Math.cos(a) * 1.22;
      batcher.add('root', 'darkSteel', pylonBaseGeo, px, 0.36, pz);
      batcher.add('root', 'darkSteel', pylonGeo, px, 1.08, pz);
      batcher.add('root', 'copperAesa', pylonCoilGeo, px, 1.36, pz, Math.PI / 2, 0, 0);
      batcher.add('root', 'copperAesa', pylonCoilGeo, px, 1.56, pz, Math.PI / 2, 0, 0);
      batcher.add('root', 'specTrimB', tipGeo, px, 1.84, pz);
    }

    // Subtle specTrimB collector collar ring on crown (slim torus -> <= 0.6% emissive!)
    batcher.add('root', 'specTrimB', getGeo('ext_specB_collar', () => new THREE.TorusGeometry(0.57, 0.022, 4, 20)), 0, crownY + 0.08, 0, Math.PI / 2, 0, 0);

    // Primary spinning 6-blade turbine rotor (r <= 0.86, clear of corner pylons at r = 1.22!)
    const turbinePivot = new THREE.Group();
    turbinePivot.position.set(0, crownY + 0.22, 0);
    root.add(turbinePivot);
    rig.radarPivots.push(turbinePivot);
    pivots.radar_0 = turbinePivot;

    batcher.add('radar_0', 'gunmetal', getChamferedCylinderGeo(0.24, 0.28, 0.22, 10, 0.025), 0, 0, 0);
    const bladeGeo = getTrimBoxGeo(0.18, 0.045, 0.68);
    const tipWeightGeo = getTrimBoxGeo(0.16, 0.055, 0.1);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const [brx, bry, brz] = yxzToXyz(0, a, 0.22);
      batcher.add('radar_0', 'steel', bladeGeo, Math.sin(a) * 0.46, 0, Math.cos(a) * 0.46, brx, bry, brz);
      batcher.add('radar_0', 'brass', tipWeightGeo, Math.sin(a) * 0.78, 0, Math.cos(a) * 0.78, brx, bry, brz);
    }

    // Central elevated C4ISR tactical transmission mast & dual solid uplink dishes (radar_1)
    batcher.add('root', 'steel', getGeo('ext_dish_mast', () => new THREE.CylinderGeometry(0.09, 0.12, 0.64, 8)), 0, crownY + 0.56, 0);
    const dishPivot = new THREE.Group();
    dishPivot.position.set(0, crownY + 0.92, 0);
    root.add(dishPivot);
    rig.radarPivots.push(dishPivot);
    pivots.radar_1 = dishPivot;

    const dishGeo = getSolidParabolicDishGeo(0.92);
    const feedGeo = getGeo('ext_dish_feed', () => new THREE.CylinderGeometry(0.024, 0.032, 0.24, 6));
    batcher.add('radar_1', 'darkSteel', getTrimBoxGeo(0.96, 0.14, 0.18), 0, 0, 0);
    batcher.add('radar_1', 'specTrimB', getTrimBoxGeo(0.42, 0.055, 0.2), 0, 0.1, 0);
    for (const sx of [-0.48, 0.48]) {
      batcher.add('radar_1', 'navalWhite', dishGeo, sx, 0.06, 0.08, Math.PI / 2 - 0.28, 0, 0);
      batcher.add('radar_1', 'brass', feedGeo, sx, 0.12, 0.24, Math.PI / 2 - 0.28, 0, 0);
    }
  } else {
    // ------------------------------------------------------------------------
    // BASELINE (Lv1, Lv2-3, Lv4+): Spinning Armored Turbine Rotor (+ Static Stator Shroud on Lv2+)
    // ------------------------------------------------------------------------
    if (level >= 2) {
      // Static outer steel turbine stator shroud ring + 4 support struts
      const shroudGeo = getGeo('extractor_shroud_ring', () => new THREE.TorusGeometry(0.96, 0.065, 5, 22));
      batcher.add('root', 'darkSteel', shroudGeo, 0, crownY + 0.24, 0, Math.PI / 2, 0, 0);
      const strutGeo = getTrimBoxGeo(0.08, 0.34, 0.38);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const [srx, sry, srz] = yxzToXyz(-0.42, a, 0);
        batcher.add('root', 'steel', strutGeo, Math.sin(a) * 0.76, crownY + 0.08, Math.cos(a) * 0.76, srx, sry, srz);
      }
      // Twin pressurized coolant reserve drums on flanks
      for (const sx of [-0.94, 0.94]) {
        batcher.add('root', 'navalGray', getChamferedCylinderGeo(0.18, 0.18, 0.68, 8, 0.025), sx, 0.68, 0.88);
        batcher.add('root', 'brass', getGeo('ext_drum_cap', () => new THREE.CylinderGeometry(0.08, 0.1, 0.12, 8)), sx, 1.06, 0.88);
      }
    }
    if (level >= 3) {
      batcher.add('root', 'specTrimTier', getGeo('ext_tier_ring', () => new THREE.TorusGeometry(0.57, 0.022, 4, 20)), 0, crownY + 0.08, 0, Math.PI / 2, 0, 0);
    }

    // Spinning turbine rotor (4 blades on Lv1, 6 blades on Lv2+, solid steel + brass tips — ZERO glowing blades!)
    const turbinePivot = new THREE.Group();
    turbinePivot.position.set(0, crownY + 0.24, 0);
    root.add(turbinePivot);
    rig.radarPivots.push(turbinePivot);
    pivots.radar_0 = turbinePivot;

    batcher.add('radar_0', 'gunmetal', getChamferedCylinderGeo(0.24, 0.28, 0.24, 10, 0.025), 0, 0, 0);
    batcher.add('radar_0', 'brass', getChamferedCylinderGeo(0.12, 0.16, 0.14, 8, 0.02), 0, 0.18, 0);

    const bladeCount = level === 1 ? 4 : 6;
    const bladeLen = level === 1 ? 0.72 : 0.68;
    const bladeGeo = getTrimBoxGeo(0.19, 0.045, bladeLen);
    const tipGeo = getTrimBoxGeo(0.17, 0.055, 0.1);
    for (let i = 0; i < bladeCount; i++) {
      const a = (i / bladeCount) * Math.PI * 2;
      const rMid = 0.22 + bladeLen * 0.42;
      const rTip = 0.22 + bladeLen * 0.86;
      const [brx, bry, brz] = yxzToXyz(0, a, 0.24);
      batcher.add('radar_0', 'steel', bladeGeo, Math.sin(a) * rMid, 0, Math.cos(a) * rMid, brx, bry, brz);
      batcher.add('radar_0', 'brass', tipGeo, Math.sin(a) * rTip, 0, Math.cos(a) * rTip, brx, bry, brz);
    }
  }

  batcher.flush(pivots, mats);
}
