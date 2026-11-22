import * as THREE from 'three';
import { GRID_COLS, GRID_ROWS, CELL } from '../systems/Pathfinder.js';
import { createSeededRng, hashSeed } from './MilitaryGeometryKit.ts';
import { createNormalTextureFromHeightCanvas } from './SurfaceShaderKit.ts';

export const SPLAT_WIDTH = 512;
export const SPLAT_HEIGHT = 292;
export const ROAD_MARKS_WIDTH = 2048;
export const ROAD_MARKS_HEIGHT = 1170;
export const DETAIL_TEXTURE_SIZE = 512;
export const DETAIL_REPEAT_X = 14;
export const DETAIL_REPEAT_Y = 8;

const CELL_WORLD = 4.0;
const BOARD_W = GRID_COLS * CELL_WORLD; // 112
const BOARD_D = GRID_ROWS * CELL_WORLD; // 64

// Shared road SDF constants (in grid-cell units, 1.0 = 4.0 world units)
const ROAD_CORNER_FILLET_CELL = 0.44;
const ROAD_HALF_WIDTH_CELL = 0.27;
const BERM_HALF_WIDTH_CELL = 0.46;

export interface SplatGridPoint {
  col: number;
  row: number;
  id?: string;
}

export interface DesertDetailTextures {
  sandMap: THREE.Texture;
  sandNorm: THREE.Texture;
  gravelMap: THREE.Texture;
  gravelNorm: THREE.Texture;
  asphaltMap: THREE.Texture;
  asphaltNorm: THREE.Texture;
}

let cachedDesertDetailTextures: DesertDetailTextures | null = null;
let cachedWarmMesh: THREE.Mesh | null = null;
let cachedWarmGeo: THREE.BufferGeometry | null = null;
let cachedWarmSplat: THREE.DataTexture | null = null;
let cachedWarmMarks: THREE.Texture | null = null;
let cachedWarmMat: THREE.MeshStandardMaterial | null = null;

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const span = edge1 - edge0;
  if (span <= 1e-6) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / span);
  return t * t * (3 - 2 * t);
}

function hash2D(ix: number, iy: number, seed: number): number {
  let h = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function valueNoise2D(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = hash2D(ix, iy, seed);
  const b = hash2D(ix + 1, iy, seed);
  const c = hash2D(ix, iy + 1, seed);
  const d = hash2D(ix + 1, iy + 1, seed);

  const ab = a + (b - a) * ux;
  const cd = c + (d - c) * ux;
  return ab + (cd - ab) * uy;
}

function periodicValueNoise2D(x: number, y: number, period: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const x0 = ((ix % period) + period) % period;
  const y0 = ((iy % period) + period) % period;
  const x1 = (x0 + 1) % period;
  const y1 = (y0 + 1) % period;

  const a = hash2D(x0, y0, seed);
  const b = hash2D(x1, y0, seed);
  const c = hash2D(x0, y1, seed);
  const d = hash2D(x1, y1, seed);

  const ab = a + (b - a) * ux;
  const cd = c + (d - c) * ux;
  return ab + (cd - ab) * uy;
}

function fbm2D(x: number, y: number, seed: number, octaves = 3): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise2D(x * freq, y * freq, seed + i * 97);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return norm > 0 ? sum / norm : 0;
}

const NOISE_LATTICE_SIZE = 256;
const NOISE_LATTICE_MASK = NOISE_LATTICE_SIZE - 1;
let cachedNoiseLattice: Float32Array | null = null;
let cachedSinLut: Float32Array | null = null;

function getDesertNoiseLattice(): Float32Array {
  if (cachedNoiseLattice) return cachedNoiseLattice;
  const rng = createSeededRng(hashSeed('desert_splat_fbm_v1', 1337));
  const arr = new Float32Array(NOISE_LATTICE_SIZE * NOISE_LATTICE_SIZE);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = rng();
  }
  cachedNoiseLattice = arr;
  return arr;
}

function getSinLut(): Float32Array {
  if (cachedSinLut) return cachedSinLut;
  const lut = new Float32Array(256);
  const scale = (Math.PI * 2) / 256;
  for (let i = 0; i < 256; i++) {
    lut[i] = 0.5 + 0.5 * Math.sin(i * scale);
  }
  cachedSinLut = lut;
  return lut;
}

function fastLatticeNoise2D(lattice: Float32Array, x: number, y: number): number {
  const sx = x + 4096.0;
  const sy = y + 4096.0;
  const ix = sx | 0;
  const iy = sy | 0;
  const fx = sx - ix;
  const fy = sy - iy;
  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);

  const x0 = ix & NOISE_LATTICE_MASK;
  const y0 = iy & NOISE_LATTICE_MASK;
  const x1 = (x0 + 1) & NOISE_LATTICE_MASK;
  const y1 = (y0 + 1) & NOISE_LATTICE_MASK;

  const row0 = y0 << 8;
  const row1 = y1 << 8;
  const a = lattice[row0 | x0];
  const b = lattice[row0 | x1];
  const c = lattice[row1 | x0];
  const d = lattice[row1 | x1];

  const ab = a + (b - a) * ux;
  const cd = c + (d - c) * ux;
  return ab + (cd - ab) * uy;
}

function distSqToSegment2D(px: number, pz: number, ax: number, az: number, bx: number, bz: number): number {
  const abx = bx - ax;
  const abz = bz - az;
  const lenSq = abx * abx + abz * abz;
  let t = lenSq > 1e-8 ? ((px - ax) * abx + (pz - az) * abz) / lenSq : 0;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  const dx = px - (ax + abx * t);
  const dz = pz - (az + abz * t);
  return dx * dx + dz * dz;
}

function distToBox2D(px: number, pz: number, minX: number, maxX: number, minZ: number, maxZ: number): number {
  const dx = px < minX ? minX - px : px > maxX ? px - maxX : 0;
  const dz = pz < minZ ? minZ - pz : pz > maxZ ? pz - maxZ : 0;
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Deterministic terrain micro-relief height at world coordinates (wx, wz).
 * Anti-float invariant: strictly returns 0 across ALL playable/navigable cells
 * (CELL.FREE, CELL.ROAD, CELL.SPAWN, CELL.FOB, CELL.TOWER, CELL.BARRIER, CELL.RESTRICTED)
 * and along their exact boundaries, rising gently only inside CELL.ROCK formations
 * or outside the board perimeter.
 */
export function computeTerrainMicroReliefY(
  wx: number,
  wz: number,
  baseTerrain: Uint8Array[],
  biome: string
): number {
  if (biome !== 'desert') return 0;

  const halfW = BOARD_W * 0.5;
  const halfD = BOARD_D * 0.5;
  const eps = 1e-4;

  // Outside playable board boundary -> subtle gentle dune margin (0 right at border)
  if (Math.abs(wx) > halfW + eps || Math.abs(wz) > halfD + eps) {
    const outerDist = Math.max(0, Math.abs(wx) - halfW, Math.abs(wz) - halfD);
    const outerFade = smoothstep(0, 1.5, outerDist);
    const n = fbm2D(wx * 0.08 + 13.7, wz * 0.08 - 5.1, 4109, 2);
    return outerFade * (0.08 + 0.16 * n);
  }

  // Strictly flat along the board outer rim so plinth/ruler strips align flush
  const rimDist = Math.min(halfW - Math.abs(wx), halfD - Math.abs(wz));
  if (rimDist <= 0.01) return 0;

  const c = Math.min(GRID_COLS - 1, Math.max(0, Math.floor((wx + halfW) / CELL_WORLD)));
  const r = Math.min(GRID_ROWS - 1, Math.max(0, Math.floor((wz + halfD) / CELL_WORLD)));
  const currentCell = baseTerrain[r]?.[c];
  if (currentCell !== CELL.ROCK) return 0;

  // Check 3x3 neighborhood so every vertex touching a non-ROCK cell stays strictly at y = 0
  let minNonRockDist = Infinity;
  const rMin = Math.max(0, r - 1);
  const rMax = Math.min(GRID_ROWS - 1, r + 1);
  const cMin = Math.max(0, c - 1);
  const cMax = Math.min(GRID_COLS - 1, c + 1);

  for (let nr = rMin; nr <= rMax; nr++) {
    const rowArr = baseTerrain[nr];
    if (!rowArr) continue;
    const minZ = nr * CELL_WORLD - halfD;
    const maxZ = minZ + CELL_WORLD;
    for (let nc = cMin; nc <= cMax; nc++) {
      if (rowArr[nc] === CELL.ROCK) continue;
      const minX = nc * CELL_WORLD - halfW;
      const maxX = minX + CELL_WORLD;
      const d = distToBox2D(wx, wz, minX, maxX, minZ, maxZ);
      if (d < minNonRockDist) minNonRockDist = d;
    }
  }

  if (minNonRockDist <= 0.005) return 0;

  const interiorMask = smoothstep(0.02, 1.35, minNonRockDist) * smoothstep(0.02, 0.85, rimDist);
  if (interiorMask <= 0) return 0;

  const moundNoise = fbm2D(wx * 0.19 + 7.4, wz * 0.19 - 3.9, 1987, 3);
  return interiorMask * (0.18 + 0.22 * moundNoise);
}

interface CellDescriptor {
  roadLike: boolean;
  rock: boolean;
  spawn: boolean;
  fob: boolean;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  isTurn: boolean;
  turnDx: number;
  turnDz: number;
  nearRoad: boolean;
  nearRockOrPad: boolean;
}

function isCellRoadLike(baseTerrain: Uint8Array[], c: number, r: number): boolean {
  if (c < 0 || c >= GRID_COLS || r < 0 || r >= GRID_ROWS) return false;
  const t = baseTerrain[r]?.[c];
  return t === CELL.ROAD || t === CELL.SPAWN || t === CELL.FOB;
}

interface CellSpatialCache {
  segs: Float32Array;
  arcs: Float32Array;
  rocks: Float32Array;
  pads: Float32Array;
  hasAnyFeature: boolean;
}

/**
 * Generates deterministic 512x292 RGBA splatmap data (top-down row 0 = North r=0):
 * - R: continuous road asphalt mask (with smooth corner fillets)
 * - G: compacted gravel berm & pad apron mask
 * - B: organic domain-warped FBM wind-sand vs hardpan variation (0 circular blobs!)
 * - A: baked ambient occlusion around ROCKs, road edges, Spawns, and FOB
 */
export function createDesertSplatData(
  baseTerrain: Uint8Array[],
  spawnPoints: ReadonlyArray<SplatGridPoint> = [],
  fobPoint?: SplatGridPoint
): Uint8Array {
  const lattice = getDesertNoiseLattice();
  const sinLut = getSinLut();
  const totalCells = GRID_COLS * GRID_ROWS;
  const cells: CellDescriptor[] = new Array(totalCells);

  const spawnLookup = new Set<number>();
  for (const sp of spawnPoints) {
    if (sp && sp.col >= 0 && sp.col < GRID_COLS && sp.row >= 0 && sp.row < GRID_ROWS) {
      spawnLookup.add(sp.row * GRID_COLS + sp.col);
    }
  }
  const fobKey =
    fobPoint && fobPoint.col >= 0 && fobPoint.col < GRID_COLS && fobPoint.row >= 0 && fobPoint.row < GRID_ROWS
      ? fobPoint.row * GRID_COLS + fobPoint.col
      : -1;

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const idx = r * GRID_COLS + c;
      const cellVal = baseTerrain[r]?.[c] ?? CELL.FREE;
      const roadLike = cellVal === CELL.ROAD || cellVal === CELL.SPAWN || cellVal === CELL.FOB;
      const up = isCellRoadLike(baseTerrain, c, r - 1);
      const down = isCellRoadLike(baseTerrain, c, r + 1);
      const left = isCellRoadLike(baseTerrain, c - 1, r);
      const right = isCellRoadLike(baseTerrain, c + 1, r);
      const deg = (up ? 1 : 0) + (down ? 1 : 0) + (left ? 1 : 0) + (right ? 1 : 0);
      const isTurn = roadLike && cellVal === CELL.ROAD && deg === 2 && (up || down) && (left || right);

      cells[idx] = {
        roadLike,
        rock: cellVal === CELL.ROCK,
        spawn: cellVal === CELL.SPAWN || spawnLookup.has(idx),
        fob: cellVal === CELL.FOB || idx === fobKey,
        up,
        down,
        left,
        right,
        isTurn,
        turnDx: right ? 1 : -1,
        turnDz: down ? 1 : -1,
        nearRoad: false,
        nearRockOrPad: false
      };
    }
  }

  // Precompute deduplicated spatial feature lists per cell (3x3 neighborhood)
  const fillet = ROAD_CORNER_FILLET_CELL;
  const spatialCache: CellSpatialCache[] = new Array(totalCells);

  for (let r = 0; r < GRID_ROWS; r++) {
    const r0 = Math.max(0, r - 1);
    const r1 = Math.min(GRID_ROWS - 1, r + 1);
    for (let c = 0; c < GRID_COLS; c++) {
      const c0 = Math.max(0, c - 1);
      const c1 = Math.min(GRID_COLS - 1, c + 1);
      const segList: number[] = [];
      const arcList: number[] = [];
      const rockList: number[] = [];
      const padList: number[] = [];

      for (let nr = r0; nr <= r1; nr++) {
        const cz = nr + 0.5;
        for (let nc = c0; nc <= c1; nc++) {
          const nb = cells[nr * GRID_COLS + nc];
          const cx = nc + 0.5;
          if (nb.roadLike) {
            if (nb.isTurn) {
              const dx = nb.turnDx;
              const dz = nb.turnDz;
              segList.push(cx + dx * 0.5, cz, cx + dx * fillet, cz);
              segList.push(cx, cz + dz * 0.5, cx, cz + dz * fillet);
              arcList.push(cx + dx * fillet, cz + dz * fillet, dx, dz, cx + dx * fillet, cz, cx, cz + dz * fillet);
            } else {
              // Merge collinear horizontal/vertical spans across the 3x3 window:
              // only emit an arm from (cx, cz) when it ends at cell edge of a turn or doesn't double-cover an interior link.
              const leftNb = nc > 0 ? cells[nr * GRID_COLS + nc - 1] : null;
              const upNb = nr > 0 ? cells[(nr - 1) * GRID_COLS + nc] : null;
              if (nb.left && (!leftNb || !leftNb.roadLike || leftNb.isTurn || nc - 1 < c0)) {
                segList.push(cx, cz, cx - 0.5, cz);
              }
              if (nb.right) {
                const rightNb = nc + 1 < GRID_COLS ? cells[nr * GRID_COLS + nc + 1] : null;
                if (rightNb && rightNb.roadLike && !rightNb.isTurn && nc + 1 <= c1) {
                  segList.push(cx, cz, cx + 1.0, cz);
                } else {
                  segList.push(cx, cz, cx + 0.5, cz);
                }
              }
              if (nb.up && (!upNb || !upNb.roadLike || upNb.isTurn || nr - 1 < r0)) {
                segList.push(cx, cz, cx, cz - 0.5);
              }
              if (nb.down) {
                const downNb = nr + 1 < GRID_ROWS ? cells[(nr + 1) * GRID_COLS + nc] : null;
                if (downNb && downNb.roadLike && !downNb.isTurn && nr + 1 <= r1) {
                  segList.push(cx, cz, cx, cz + 1.0);
                } else {
                  segList.push(cx, cz, cx, cz + 0.5);
                }
              }
              if (!nb.left && !nb.right && !nb.up && !nb.down) {
                segList.push(cx, cz, cx, cz);
              }
              // Smooth corner flare arcs for T-junctions & 4-way crossings matching roadMarks
              if (nb.right && nb.up) {
                arcList.push(cx + fillet, cz - fillet, 1, -1, cx + fillet, cz, cx, cz - fillet);
              }
              if (nb.right && nb.down) {
                arcList.push(cx + fillet, cz + fillet, 1, 1, cx + fillet, cz, cx, cz + fillet);
              }
              if (nb.left && nb.up) {
                arcList.push(cx - fillet, cz - fillet, -1, -1, cx - fillet, cz, cx, cz - fillet);
              }
              if (nb.left && nb.down) {
                arcList.push(cx - fillet, cz + fillet, -1, 1, cx - fillet, cz, cx, cz + fillet);
              }
            }
          }
          if (nb.rock) rockList.push(cx, cz);
          if (nb.spawn) padList.push(cx - 0.48, cx + 0.48, cz - 0.48, cz + 0.48);
          if (nb.fob) padList.push(cx - 0.49, cx + 0.49, cz - 0.58, cz + 0.58);
        }
      }

      spatialCache[r * GRID_COLS + c] = {
        segs: new Float32Array(segList),
        arcs: new Float32Array(arcList),
        rocks: new Float32Array(rockList),
        pads: new Float32Array(padList),
        hasAnyFeature: segList.length > 0 || arcList.length > 0 || rockList.length > 0 || padList.length > 0
      };
    }
  }

  // Precompute 2x downsampled domain-warped FBM & sand base field (256x146 -> bilinearly interpolated per pixel)
  // keeping full 512x292 resolution for road SDF, gravel berms, and baked AO!
  const NW = 257;
  const NH = 147;
  const fbmField = new Float32Array(NW * NH);
  const sandField = new Float32Array(NW * NH);
  const nInvW = GRID_COLS / (NW - 1);
  const nInvH = GRID_ROWS / (NH - 1);

  for (let ny = 0; ny < NH; ny++) {
    const gz = ny * nInvH;
    const rowOff = ny * NW;
    for (let nx = 0; nx < NW; nx++) {
      const gx = nx * nInvW;
      const uWind = gx * 0.34 + gz * 0.18;
      const vWind = -gx * 0.11 + gz * 0.44;
      const warpX = fastLatticeNoise2D(lattice, uWind * 0.55 + 3.1, vWind * 0.55 - 2.7) - 0.5;
      const warpY = fastLatticeNoise2D(lattice, uWind * 0.55 + 37.4, vWind * 0.55 + 19.3) - 0.5;
      const wx = uWind + warpX * 1.45;
      const wy = vWind + warpY * 1.45;
      const n0 = fastLatticeNoise2D(lattice, wx, wy);
      const n1 = fastLatticeNoise2D(lattice, wx * 2.03 + 17.0, wy * 2.03 + 11.0);
      const n2 = fastLatticeNoise2D(lattice, wx * 4.11 + 53.0, wy * 4.11 + 29.0);
      const duneFbm = n0 * 0.5714286 + n1 * 0.2857143 + n2 * 0.1428571;

      const phase = (gx * 0.725 + gz * 0.325 + warpX * 1.2) * 256.0;
      const rippleWave = sinLut[(phase | 0) & 255];
      fbmField[rowOff + nx] = duneFbm;
      sandField[rowOff + nx] = clamp01(duneFbm * 0.78 + rippleWave * 0.22);
    }
  }

  const out = new Uint8Array(SPLAT_WIDTH * SPLAT_HEIGHT * 4);
  const invW = GRID_COLS / SPLAT_WIDTH;
  const invH = GRID_ROWS / SPLAT_HEIGHT;
  const roadEdge0 = ROAD_HALF_WIDTH_CELL - 0.035;
  const roadEdge1Base = ROAD_HALF_WIDTH_CELL + 0.04;
  const bermEdge0 = BERM_HALF_WIDTH_CELL - 0.08;
  const bermEdge1Base = BERM_HALF_WIDTH_CELL + 0.09;

  for (let py = 0; py < SPLAT_HEIGHT; py++) {
    const gz = (py + 0.5) * invH;
    const r = Math.min(GRID_ROWS - 1, Math.max(0, gz | 0));
    const rowCellOffset = r * GRID_COLS;
    const pyOutOffset = py * SPLAT_WIDTH * 4;

    const fy = (py + 0.5) * 0.5;
    const ny0 = fy | 0;
    const ny1 = ny0 + 1;
    const ty = fy - ny0;
    const fRow0 = ny0 * NW;
    const fRow1 = ny1 * NW;

    for (let px = 0; px < SPLAT_WIDTH; px++) {
      const gx = (px + 0.5) * invW;
      const c = Math.min(GRID_COLS - 1, Math.max(0, gx | 0));
      const sc = spatialCache[rowCellOffset + c];

      const fx = (px + 0.5) * 0.5;
      const nx0 = fx | 0;
      const nx1 = nx0 + 1;
      const tx = fx - nx0;

      const f00 = fbmField[fRow0 + nx0];
      const f10 = fbmField[fRow0 + nx1];
      const f01 = fbmField[fRow1 + nx0];
      const f11 = fbmField[fRow1 + nx1];
      const duneFbm = (f00 + (f10 - f00) * tx) * (1 - ty) + (f01 + (f11 - f01) * tx) * ty;

      const s00 = sandField[fRow0 + nx0];
      const s10 = sandField[fRow0 + nx1];
      const s01 = sandField[fRow1 + nx0];
      const s11 = sandField[fRow1 + nx1];
      const sandBlend = (s00 + (s10 - s00) * tx) * (1 - ty) + (s01 + (s11 - s01) * tx) * ty;

      const edgeJitter = (duneFbm - 0.5) * 0.055;

      let roadW = 0;
      let gravelW = 0;
      let rockGravel = 0;
      let rockAO = 1.0;
      let padAO = 1.0;
      let curbAO = 1.0;

      if (sc.hasAnyFeature) {
        let minRoadDist = 9.0;
        const segs = sc.segs;
        const arcs = sc.arcs;
        if (segs.length > 0 || arcs.length > 0) {
          let minRoadSq = 81.0;
          for (let i = 0; i < segs.length; i += 4) {
            const ax = segs[i];
            const az = segs[i + 1];
            const abx = segs[i + 2] - ax;
            const abz = segs[i + 3] - az;
            const lenSq = abx * abx + abz * abz;
            let t = lenSq > 1e-8 ? ((gx - ax) * abx + (gz - az) * abz) / lenSq : 0;
            if (t < 0) t = 0;
            else if (t > 1) t = 1;
            const ddx = gx - (ax + abx * t);
            const ddz = gz - (az + abz * t);
            const dSq = ddx * ddx + ddz * ddz;
            if (dSq < minRoadSq) minRoadSq = dSq;
          }
          for (let i = 0; i < arcs.length; i += 8) {
            const arcCx = arcs[i];
            const arcCz = arcs[i + 1];
            const dx = arcs[i + 2];
            const dz = arcs[i + 3];
            const vx = gx - arcCx;
            const vz = gz - arcCz;
            let dSq: number;
            if (dx * vx <= 0 && dz * vz <= 0) {
              const dr = Math.sqrt(vx * vx + vz * vz) - fillet;
              dSq = dr * dr;
            } else {
              const ex1 = gx - arcs[i + 4];
              const ez1 = gz - arcs[i + 5];
              const ex2 = gx - arcs[i + 6];
              const ez2 = gz - arcs[i + 7];
              const d1 = ex1 * ex1 + ez1 * ez1;
              const d2 = ex2 * ex2 + ez2 * ez2;
              dSq = d1 < d2 ? d1 : d2;
            }
            if (dSq < minRoadSq) minRoadSq = dSq;
          }
          minRoadDist = Math.sqrt(minRoadSq);
          if (minRoadDist < 0.45) {
            roadW = 1.0 - smoothstep(roadEdge0, roadEdge1Base + edgeJitter * 0.45, minRoadDist);
            const curbDist = Math.abs(minRoadDist - (ROAD_HALF_WIDTH_CELL + 0.02));
            curbAO = 0.87 + 0.13 * smoothstep(0.0, 0.14, curbDist);
          }
        }

        const rocks = sc.rocks;
        if (rocks.length > 0) {
          let minRockSq = 81.0;
          for (let i = 0; i < rocks.length; i += 2) {
            const dx = gx - rocks[i];
            const dz = gz - rocks[i + 1];
            const dSq = dx * dx + dz * dz;
            if (dSq < minRockSq) minRockSq = dSq;
          }
          const minRockDist = Math.sqrt(minRockSq);
          if (minRockDist < 0.85) {
            rockGravel = 1.0 - smoothstep(0.28, 0.72 + edgeJitter * 1.2, minRockDist);
            rockAO = 0.54 + 0.46 * smoothstep(0.18, 0.66 + edgeJitter * 0.6, minRockDist);
          }
        }

        let minPadDist = 9.0;
        const pads = sc.pads;
        if (pads.length > 0) {
          for (let i = 0; i < pads.length; i += 4) {
            const dPad = distToBox2D(gx, gz, pads[i], pads[i + 1], pads[i + 2], pads[i + 3]);
            if (dPad < minPadDist) minPadDist = dPad;
          }
          if (minPadDist < 0.45) {
            padAO = 0.62 + 0.38 * smoothstep(0.0, 0.22, minPadDist);
          }
        }

        const roadBerm =
          minRoadDist < 0.65
            ? (1.0 - smoothstep(bermEdge0, bermEdge1Base + edgeJitter, minRoadDist)) * (1.0 - roadW * 0.85)
            : 0;
        const padBerm = minPadDist < 0.45 ? 1.0 - smoothstep(0.04, 0.30 + edgeJitter, minPadDist) : 0;
        gravelW = roadBerm > padBerm * 0.92 ? roadBerm : padBerm * 0.92;
        if (rockGravel * 0.88 > gravelW) gravelW = rockGravel * 0.88;
        if (gravelW > 1) gravelW = 1;
        else if (gravelW < 0) gravelW = 0;
      }

      const duneWeight = clamp01(sandBlend * (1.0 - rockGravel * 0.42));
      const macroAO = 0.93 + 0.07 * duneFbm;
      const ao = clamp01((rockAO < padAO ? rockAO : padAO) * curbAO * macroAO);

      const o = pyOutOffset + px * 4;
      out[o] = (roadW * 255 + 0.5) | 0;
      out[o + 1] = (gravelW * 255 + 0.5) | 0;
      out[o + 2] = (duneWeight * 255 + 0.5) | 0;
      out[o + 3] = (ao * 255 + 0.5) | 0;
    }
  }

  return out;
}

/**
 * Builds a linear-space (NoColorSpace) RGBA DataTexture from createDesertSplatData().
 * Rows are inverted on copy with flipY = false so WebGL2 texSubImage2D matches
 * PlaneGeometry UV orientation (uv.y = 1 at North r=0, uv.y = 0 at South r=15) on all drivers.
 */
export function createDesertSplatTexture(
  baseTerrain: Uint8Array[],
  spawnPoints: ReadonlyArray<SplatGridPoint> = [],
  fobPoint?: SplatGridPoint
): THREE.DataTexture {
  const topDown = createDesertSplatData(baseTerrain, spawnPoints, fobPoint);
  const flipped = new Uint8Array(topDown.length);
  const rowBytes = SPLAT_WIDTH * 4;
  for (let py = 0; py < SPLAT_HEIGHT; py++) {
    const srcOffset = py * rowBytes;
    const dstOffset = (SPLAT_HEIGHT - 1 - py) * rowBytes;
    flipped.set(topDown.subarray(srcOffset, srcOffset + rowBytes), dstOffset);
  }

  const tex = new THREE.DataTexture(flipped, SPLAT_WIDTH, SPLAT_HEIGHT, THREE.RGBAFormat);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 4;
  tex.flipY = false;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a crisp 2048x1170 (~18.3 px/u) transparent overlay CanvasTexture containing:
 * - Subtle tactical 28x16 build-grid intersections on FREE cells
 * - Smooth continuous road centerline dashes, curved T-junctions/crossings, tire tracks, and curb marks
 * Works safely in headless Node via DataTexture fallback when document is undefined.
 */
export function createDesertRoadMarksTexture(baseTerrain: Uint8Array[]): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    const fallback = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1, THREE.RGBAFormat);
    fallback.colorSpace = THREE.SRGBColorSpace;
    fallback.needsUpdate = true;
    return fallback as unknown as THREE.CanvasTexture;
  }

  const w = ROAD_MARKS_WIDTH;
  const h = ROAD_MARKS_HEIGHT;
  const tileW = w / GRID_COLS;
  const tileH = h / GRID_ROWS;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  // 1. Subtle tactical engineering survey grid on buildable FREE cells
  ctx.strokeStyle = 'rgba(42, 32, 20, 0.14)';
  ctx.lineWidth = 1.6;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (baseTerrain[r]?.[c] !== CELL.FREE) continue;
      ctx.strokeRect(c * tileW + 0.8, r * tileH + 0.8, tileW - 1.6, tileH - 1.6);
    }
  }

  // Corner survey crosshairs at FREE grid vertices for crisp tactical alignment
  ctx.strokeStyle = 'rgba(255, 240, 205, 0.17)';
  ctx.lineWidth = 2.0;
  for (let r = 0; r <= GRID_ROWS; r++) {
    const py = r * tileH;
    for (let c = 0; c <= GRID_COLS; c++) {
      const hasFree =
        baseTerrain[r]?.[c] === CELL.FREE ||
        baseTerrain[r - 1]?.[c] === CELL.FREE ||
        baseTerrain[r]?.[c - 1] === CELL.FREE ||
        baseTerrain[r - 1]?.[c - 1] === CELL.FREE;
      if (!hasFree) continue;
      const px = c * tileW;
      ctx.beginPath();
      ctx.moveTo(px - 6, py);
      ctx.lineTo(px + 6, py);
      ctx.moveTo(px, py - 6);
      ctx.lineTo(px, py + 6);
      ctx.stroke();
    }
  }

  // 2. Smooth continuous road markings aligned 1:1 with the splatmap road SDF
  const filletPx = ROAD_CORNER_FILLET_CELL * tileW;
  const halfW = tileW * 0.5;
  const halfH = tileH * 0.5;
  const trackOffset = tileW * 0.115;
  const curbOffset = tileW * (ROAD_HALF_WIDTH_CELL - 0.025);

  const strokeCornerFillet = (
    cx: number,
    cy: number,
    dx: number,
    dz: number,
    s: number,
    drawStubX: boolean,
    drawStubZ: boolean
  ) => {
    const xEdge = cx + dx * halfW;
    const yEdge = cy + dz * halfH;
    const ix = cx + dx * s;
    const iy = cy + dz * s;
    const arcR = Math.max(3, filletPx - s);
    ctx.beginPath();
    if (drawStubX) {
      ctx.moveTo(xEdge, iy);
    } else {
      ctx.moveTo(cx + dx * filletPx, iy);
    }
    if (drawStubZ) {
      ctx.arcTo(ix, iy, ix, yEdge, arcR);
      ctx.lineTo(ix, yEdge);
    } else {
      ctx.arcTo(ix, iy, ix, cy + dz * filletPx, arcR);
    }
    ctx.stroke();
  };

  const strokeRoadGeometry = (
    offset: number,
    style: string,
    lineWidth: number,
    dashed: boolean,
    mode: 'tracks' | 'curbs' | 'center'
  ) => {
    ctx.save();
    ctx.strokeStyle = style;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';
    if (dashed) {
      ctx.setLineDash([14, 14]);
      ctx.lineDashOffset = 7.0;
    } else {
      ctx.setLineDash([]);
    }

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (baseTerrain[r]?.[c] !== CELL.ROAD) continue;

        const cx = (c + 0.5) * tileW;
        const cy = (r + 0.5) * tileH;
        const up = isCellRoadLike(baseTerrain, c, r - 1);
        const down = isCellRoadLike(baseTerrain, c, r + 1);
        const left = isCellRoadLike(baseTerrain, c - 1, r);
        const right = isCellRoadLike(baseTerrain, c + 1, r);
        const deg = (up ? 1 : 0) + (down ? 1 : 0) + (left ? 1 : 0) + (right ? 1 : 0);

        if (deg === 2 && (up || down) && (left || right)) {
          // Pure 90-degree L-turn
          const dx = right ? 1 : -1;
          const dz = down ? 1 : -1;
          const signs = offset === 0 ? [0] : [-offset, offset];
          for (const s of signs) {
            strokeCornerFillet(cx, cy, dx, dz, s, true, true);
          }
        } else if (deg === 3) {
          // Smooth T-junction
          const thruVert = up && down;
          if (thruVert) {
            const dx = right ? 1 : -1;
            if (mode === 'center') {
              // Main vertical dashed centerline + curved branch merge fillets
              ctx.beginPath();
              ctx.moveTo(cx, cy - halfH);
              ctx.lineTo(cx, cy + halfH);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(cx + dx * halfW, cy);
              ctx.lineTo(cx + dx * filletPx, cy);
              ctx.stroke();

              strokeCornerFillet(cx, cy, dx, -1, 0, false, false);
              strokeCornerFillet(cx, cy, dx, 1, 0, false, false);
            } else if (mode === 'curbs') {
              // Continuous curb on the unbranched side; two rounded corner curbs on the branched side
              const closedX = cx - dx * offset;
              ctx.beginPath();
              ctx.moveTo(closedX, cy - halfH);
              ctx.lineTo(closedX, cy + halfH);
              ctx.stroke();

              strokeCornerFillet(cx, cy, dx, -1, offset, true, true);
              strokeCornerFillet(cx, cy, dx, 1, offset, true, true);
            } else {
              // Twin tire tracks: straight through + curved merges into both directions
              for (const s of [-offset, offset]) {
                ctx.beginPath();
                ctx.moveTo(cx + s, cy - halfH);
                ctx.lineTo(cx + s, cy + halfH);
                ctx.stroke();
              }
              strokeCornerFillet(cx, cy, dx, -1, offset, true, true);
              strokeCornerFillet(cx, cy, dx, -1, -offset, true, true);
              strokeCornerFillet(cx, cy, dx, 1, offset, true, true);
              strokeCornerFillet(cx, cy, dx, 1, -offset, true, true);
            }
          } else {
            const dz = down ? 1 : -1;
            if (mode === 'center') {
              ctx.beginPath();
              ctx.moveTo(cx - halfW, cy);
              ctx.lineTo(cx + halfW, cy);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(cx, cy + dz * halfH);
              ctx.lineTo(cx, cy + dz * filletPx);
              ctx.stroke();

              strokeCornerFillet(cx, cy, -1, dz, 0, false, false);
              strokeCornerFillet(cx, cy, 1, dz, 0, false, false);
            } else if (mode === 'curbs') {
              const closedY = cy - dz * offset;
              ctx.beginPath();
              ctx.moveTo(cx - halfW, closedY);
              ctx.lineTo(cx + halfW, closedY);
              ctx.stroke();

              strokeCornerFillet(cx, cy, -1, dz, offset, true, true);
              strokeCornerFillet(cx, cy, 1, dz, offset, true, true);
            } else {
              for (const s of [-offset, offset]) {
                ctx.beginPath();
                ctx.moveTo(cx - halfW, cy + s);
                ctx.lineTo(cx + halfW, cy + s);
                ctx.stroke();
              }
              strokeCornerFillet(cx, cy, -1, dz, offset, true, true);
              strokeCornerFillet(cx, cy, -1, dz, -offset, true, true);
              strokeCornerFillet(cx, cy, 1, dz, offset, true, true);
              strokeCornerFillet(cx, cy, 1, dz, -offset, true, true);
            }
          }
        } else if (deg === 4) {
          // Smooth 4-way crossing
          if (mode === 'center') {
            ctx.beginPath();
            ctx.moveTo(cx - halfW, cy);
            ctx.lineTo(cx + halfW, cy);
            ctx.moveTo(cx, cy - halfH);
            ctx.lineTo(cx, cy + halfH);
            ctx.stroke();
          } else if (mode === 'curbs') {
            for (const dx of [-1, 1]) {
              for (const dz of [-1, 1]) {
                strokeCornerFillet(cx, cy, dx, dz, offset, true, true);
              }
            }
          } else {
            for (const s of [-offset, offset]) {
              ctx.beginPath();
              ctx.moveTo(cx - halfW, cy + s);
              ctx.lineTo(cx + halfW, cy + s);
              ctx.moveTo(cx + s, cy - halfH);
              ctx.lineTo(cx + s, cy + halfH);
              ctx.stroke();
            }
            for (const dx of [-1, 1]) {
              for (const dz of [-1, 1]) {
                strokeCornerFillet(cx, cy, dx, dz, offset, false, false);
              }
            }
          }
        } else {
          // Straight / dead-end / spawn-adjacent
          const drawArm = (nx: number, nz: number) => {
            const signs = offset === 0 ? [0] : [-offset, offset];
            for (const s of signs) {
              const ox = nz !== 0 ? s : 0;
              const oz = nx !== 0 ? s : 0;
              ctx.beginPath();
              ctx.moveTo(cx + ox, cy + oz);
              ctx.lineTo(cx + nx * halfW + ox, cy + nz * halfH + oz);
              ctx.stroke();
            }
          };
          if (left) drawArm(-1, 0);
          if (right) drawArm(1, 0);
          if (up) drawArm(0, -1);
          if (down) drawArm(0, 1);
        }
      }
    }
    ctx.restore();
  };

  // Subtle dark rubber tire wear tracks
  strokeRoadGeometry(trackOffset, 'rgba(18, 18, 20, 0.25)', 5.6, false, 'tracks');

  // Subtle worn road shoulder curb marks
  strokeRoadGeometry(curbOffset, 'rgba(218, 198, 158, 0.18)', 2.2, false, 'curbs');

  // Crisp tactical amber-yellow dashed centerline
  strokeRoadGeometry(0, 'rgba(234, 179, 8, 0.68)', 3.2, true, 'center');

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function makeHeadlessDetailFallback(r: number, g: number, b: number, isNormal = false): THREE.DataTexture {
  const data = new Uint8Array([r, g, b, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.colorSpace = isNormal ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(DETAIL_REPEAT_X, DETAIL_REPEAT_Y);
  tex.needsUpdate = true;
  return tex;
}

function createTileableDetailPair(
  kind: 'sand' | 'gravel' | 'asphalt',
  anisotropy: number
): { map: THREE.CanvasTexture; norm: THREE.CanvasTexture } {
  const S = DETAIL_TEXTURE_SIZE;
  const mapCanvas = document.createElement('canvas');
  mapCanvas.width = S;
  mapCanvas.height = S;
  const mctx = mapCanvas.getContext('2d')!;

  const heightCanvas = document.createElement('canvas');
  heightCanvas.width = S;
  heightCanvas.height = S;
  const hctx = heightCanvas.getContext('2d')!;

  const mapImg = mctx.createImageData(S, S);
  const heightImg = hctx.createImageData(S, S);
  const mData = mapImg.data;
  const hData = heightImg.data;

  const twoPi = Math.PI * 2;
  const rng = createSeededRng(hashSeed('desert_detail', kind));

  if (kind === 'sand') {
    // Wind-rippled eolian sand calibrated to ~#b59862 sRGB (meanLuma ~98-106 under AgX + BiomePMREM)
    for (let y = 0; y < S; y++) {
      const v = y / S;
      for (let x = 0; x < S; x++) {
        const u = x / S;
        const warp =
          (periodicValueNoise2D(u * 16, v * 16, 16, 511) - 0.5) * 0.48 +
          (periodicValueNoise2D(u * 32, v * 32, 32, 719) - 0.5) * 0.22;
        const phase = twoPi * (u * 3.0 + v * 10.0 + warp);
        // Asymmetric windward/leeward ripple profile
        const s = Math.sin(phase);
        const ripple = 0.5 + 0.38 * s + 0.12 * Math.sin(phase * 2.0 - 0.6);
        const micro = periodicValueNoise2D(u * 64, v * 64, 64, 911);
        const grain = periodicValueNoise2D(u * 128, v * 128, 128, 1103);

        const hVal = clamp01(0.42 + (ripple - 0.5) * 0.42 + (micro - 0.5) * 0.16 + (grain - 0.5) * 0.12);
        const tone = 0.88 + ripple * 0.16 + (micro - 0.5) * 0.08 + (grain - 0.5) * 0.07;

        const rCol = Math.min(255, Math.max(0, Math.round(176 * tone)));
        const gCol = Math.min(255, Math.max(0, Math.round(147 * tone)));
        const bCol = Math.min(255, Math.max(0, Math.round(95 * tone)));

        const o = (y * S + x) * 4;
        mData[o] = rCol;
        mData[o + 1] = gCol;
        mData[o + 2] = bCol;
        mData[o + 3] = 255;

        const hg = Math.round(hVal * 255);
        hData[o] = hg;
        hData[o + 1] = hg;
        hData[o + 2] = hg;
        hData[o + 3] = 255;
      }
    }
    mctx.putImageData(mapImg, 0, 0);
    hctx.putImageData(heightImg, 0, 0);
  } else if (kind === 'gravel') {
    // Desert hardpan & compacted mineral gravel (earthy warm ochre-taupe)
    for (let y = 0; y < S; y++) {
      const v = y / S;
      for (let x = 0; x < S; x++) {
        const u = x / S;
        const nLo = periodicValueNoise2D(u * 16, v * 16, 16, 2111);
        const nMid = periodicValueNoise2D(u * 48, v * 48, 48, 2333);
        const nFine = periodicValueNoise2D(u * 128, v * 128, 128, 2557);

        // Subtle dry silt fracture lines (periodic)
        const crackA = Math.abs(periodicValueNoise2D(u * 24 + 0.3, v * 24 - 0.2, 24, 2777) - 0.5);
        const crackMask = 1.0 - smoothstep(0.015, 0.06, crackA) * 0.24;

        const tone = (0.85 + nLo * 0.16 + (nMid - 0.5) * 0.14 + (nFine - 0.5) * 0.12) * (0.88 + 0.12 * crackMask);
        const hVal = clamp01((0.46 + (nMid - 0.5) * 0.36 + (nFine - 0.5) * 0.28) * (0.76 + 0.24 * crackMask));

        const o = (y * S + x) * 4;
        mData[o] = Math.min(255, Math.max(0, Math.round(145 * tone)));
        mData[o + 1] = Math.min(255, Math.max(0, Math.round(121 * tone)));
        mData[o + 2] = Math.min(255, Math.max(0, Math.round(83 * tone)));
        mData[o + 3] = 255;

        const hg = Math.round(hVal * 255);
        hData[o] = hg;
        hData[o + 1] = hg;
        hData[o + 2] = hg;
        hData[o + 3] = 255;
      }
    }
    mctx.putImageData(mapImg, 0, 0);
    hctx.putImageData(heightImg, 0, 0);

    // Tileable angular gravel chips (wrapped across all 9 tile offsets, zero circles)
    for (let i = 0; i < 650; i++) {
      const px = rng() * S;
      const py = rng() * S;
      const pw = 2.0 + rng() * 4.5;
      const ph = 1.5 + rng() * 3.5;
      const ang = rng() * Math.PI;
      const light = rng() > 0.45;
      const color = light ? 'rgba(184, 160, 120, 0.28)' : 'rgba(72, 58, 38, 0.26)';
      const hColor = light ? 'rgba(220, 220, 220, 0.34)' : 'rgba(55, 55, 55, 0.30)';

      for (const ox of [-S, 0, S]) {
        for (const oy of [-S, 0, S]) {
          if (px + ox < -10 || px + ox > S + 10 || py + oy < -10 || py + oy > S + 10) continue;
          mctx.save();
          mctx.translate(px + ox, py + oy);
          mctx.rotate(ang);
          mctx.fillStyle = color;
          mctx.fillRect(-pw * 0.5, -ph * 0.5, pw, ph);
          mctx.restore();

          hctx.save();
          hctx.translate(px + ox, py + oy);
          hctx.rotate(ang);
          hctx.fillStyle = hColor;
          hctx.fillRect(-pw * 0.5, -ph * 0.5, pw, ph);
          hctx.restore();
        }
      }
    }
  } else {
    // Tactical campaign desert asphalt with dusty mineral aggregate
    for (let y = 0; y < S; y++) {
      const v = y / S;
      for (let x = 0; x < S; x++) {
        const u = x / S;
        const nMacro = periodicValueNoise2D(u * 16, v * 16, 16, 3119);
        const nFine = periodicValueNoise2D(u * 128, v * 128, 128, 3331);
        const speck = periodicValueNoise2D(u * 256, v * 256, 256, 3559);

        const dustTint = (nMacro - 0.5) * 0.14;
        const chip = speck > 0.72 ? 0.14 : speck < 0.22 ? -0.10 : 0.0;
        const base = 0.88 + (nFine - 0.5) * 0.20 + chip;
        const hVal = clamp01(0.48 + (nFine - 0.5) * 0.30 + chip * 0.85);

        const o = (y * S + x) * 4;
        mData[o] = Math.min(255, Math.max(0, Math.round((56 + dustTint * 36) * base)));
        mData[o + 1] = Math.min(255, Math.max(0, Math.round((58 + dustTint * 24) * base)));
        mData[o + 2] = Math.min(255, Math.max(0, Math.round((62 + dustTint * 10) * base)));
        mData[o + 3] = 255;

        const hg = Math.round(hVal * 255);
        hData[o] = hg;
        hData[o + 1] = hg;
        hData[o + 2] = hg;
        hData[o + 3] = 255;
      }
    }
    mctx.putImageData(mapImg, 0, 0);
    hctx.putImageData(heightImg, 0, 0);
  }

  const map = new THREE.CanvasTexture(mapCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(DETAIL_REPEAT_X, DETAIL_REPEAT_Y);
  map.anisotropy = Math.max(1, anisotropy);
  map.needsUpdate = true;

  const strength = kind === 'sand' ? 2.1 : kind === 'gravel' ? 2.6 : 1.9;
  const norm = createNormalTextureFromHeightCanvas(
    heightCanvas,
    strength,
    DETAIL_REPEAT_X,
    DETAIL_REPEAT_Y,
    Math.max(1, anisotropy)
  );

  return { map, norm };
}

/**
 * Returns module-cached 512x512 tileable desert detail textures (repeat 14x8 = 64 px/u).
 * CRITICAL: Never dispose these textures inside diorama.dispose()!
 */
export function getCachedDesertDetailTextures(maxAnisotropy = 8): DesertDetailTextures {
  if (cachedDesertDetailTextures) return cachedDesertDetailTextures;

  if (typeof document === 'undefined') {
    cachedDesertDetailTextures = {
      sandMap: makeHeadlessDetailFallback(176, 147, 95, false),
      sandNorm: makeHeadlessDetailFallback(128, 128, 255, true),
      gravelMap: makeHeadlessDetailFallback(145, 121, 83, false),
      gravelNorm: makeHeadlessDetailFallback(128, 128, 255, true),
      asphaltMap: makeHeadlessDetailFallback(56, 58, 62, false),
      asphaltNorm: makeHeadlessDetailFallback(128, 128, 255, true)
    };
    return cachedDesertDetailTextures;
  }

  const sand = createTileableDetailPair('sand', maxAnisotropy);
  const gravel = createTileableDetailPair('gravel', maxAnisotropy);
  const asphalt = createTileableDetailPair('asphalt', maxAnisotropy);

  cachedDesertDetailTextures = {
    sandMap: sand.map,
    sandNorm: sand.norm,
    gravelMap: gravel.map,
    gravelNorm: gravel.norm,
    asphaltMap: asphalt.map,
    asphaltNorm: asphalt.norm
  };

  return cachedDesertDetailTextures;
}

/**
 * Disposes module-cached desert detail textures and warm mesh (only for app shutdown or tests).
 */
export function disposeDesertDetailTextureCache(): void {
  if (cachedDesertDetailTextures) {
    cachedDesertDetailTextures.sandMap.dispose();
    cachedDesertDetailTextures.sandNorm.dispose();
    cachedDesertDetailTextures.gravelMap.dispose();
    cachedDesertDetailTextures.gravelNorm.dispose();
    cachedDesertDetailTextures.asphaltMap.dispose();
    cachedDesertDetailTextures.asphaltNorm.dispose();
    cachedDesertDetailTextures = null;
  }
  if (cachedWarmGeo) {
    cachedWarmGeo.dispose();
    cachedWarmGeo = null;
  }
  if (cachedWarmMat) {
    cachedWarmMat.dispose();
    cachedWarmMat = null;
  }
  if (cachedWarmSplat) {
    cachedWarmSplat.dispose();
    cachedWarmSplat = null;
  }
  if (cachedWarmMarks) {
    cachedWarmMarks.dispose();
    cachedWarmMarks = null;
  }
  cachedWarmMesh = null;
}

const DESERT_MAP_PARS = /* glsl */ `
#include <map_pars_fragment>
uniform sampler2D uDesertRoadMarks;
uniform sampler2D uDesertSandMap;
uniform sampler2D uDesertGravelMap;
uniform sampler2D uDesertAsphaltMap;
uniform sampler2D uDesertGravelNorm;
uniform sampler2D uDesertAsphaltNorm;
uniform vec2 uDesertDetailRepeat;
`;

const DESERT_MAP_FRAG = /* glsl */ `
#ifdef USE_MAP
  vec4 defconSplat = texture2D( map, vMapUv );
  vec2 defconMacroWorld = vMapUv * vec2( 112.0, 64.0 );
  vec2 defconDetailBaseUv = vMapUv * uDesertDetailRepeat;

  // Low-frequency smooth anti-tiling offset breaks 8u tile repetition with zero extra fetches
  vec2 defconAntiTile = vec2(
    sin( defconMacroWorld.x * 0.11 + defconMacroWorld.y * 0.08 ),
    cos( defconMacroWorld.x * 0.07 - defconMacroWorld.y * 0.13 )
  ) * 0.14;
  vec2 defconSandUv = defconDetailBaseUv + defconAntiTile;
  vec2 defconGravelUv = defconDetailBaseUv - defconAntiTile * 0.72 + vec2( 0.37, 0.19 );
  vec2 defconAsphaltUv = defconDetailBaseUv;

  vec3 defconSandTex = texture2D( uDesertSandMap, defconSandUv ).rgb;
  vec3 defconGravelTex = texture2D( uDesertGravelMap, defconGravelUv ).rgb;
  vec3 defconAsphaltTex = texture2D( uDesertAsphaltMap, defconAsphaltUv ).rgb;

  float defconWAsphalt = smoothstep( 0.10, 0.90, clamp( defconSplat.r, 0.0, 1.0 ) );
  float defconWBerm = clamp( defconSplat.g * ( 1.0 - defconWAsphalt ), 0.0, 1.0 );
  float defconWFloor = max( 0.0, 1.0 - defconWAsphalt - defconWBerm );
  float defconDuneW = clamp( defconSplat.b, 0.0, 1.0 );
  float defconBakedAO = mix( 0.50, 1.0, clamp( defconSplat.a, 0.0, 1.0 ) );

  float defconMacroTone = 0.94 + 0.12 * ( 0.5 + 0.5 * sin( defconMacroWorld.x * 0.17 - defconMacroWorld.y * 0.14 ) );

  vec3 defconHardpanCol = defconGravelTex * vec3( 1.04, 0.96, 0.86 );
  vec3 defconFloorCol = mix( defconHardpanCol, defconSandTex, defconDuneW ) * defconMacroTone;
  vec3 defconBermCol = defconGravelTex * vec3( 0.88, 0.85, 0.80 );

  vec3 defconTerrainCol = defconFloorCol * defconWFloor
                        + defconBermCol * defconWBerm
                        + defconAsphaltTex * defconWAsphalt;

  vec4 defconRoadMarks = texture2D( uDesertRoadMarks, vMapUv );
  defconTerrainCol = mix( defconTerrainCol, defconRoadMarks.rgb, defconRoadMarks.a );
  defconTerrainCol *= defconBakedAO;

  diffuseColor.rgb *= defconTerrainCol;
#endif
`;

const DESERT_ROUGHNESS_FRAG = /* glsl */ `
float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
  vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
  roughnessFactor *= texelRoughness.g;
#endif
#ifdef USE_MAP
  float defconFloorRough = mix( 0.87, 0.93, defconDuneW );
  float defconMatRough = mix( defconFloorRough, 0.86, defconWBerm );
  defconMatRough = mix( defconMatRough, 0.78, defconWAsphalt );
  roughnessFactor = clamp( mix( defconMatRough, 0.82, defconRoadMarks.a * 0.55 ), 0.68, 0.96 );
#endif
`;

const DESERT_NORMAL_MAPS_FRAG = /* glsl */ `
#if defined( USE_NORMALMAP_TANGENTSPACE ) && defined( USE_MAP )
  vec3 defconNSand = texture2D( normalMap, defconSandUv ).xyz * 2.0 - 1.0;
  vec3 defconNGravel = texture2D( uDesertGravelNorm, defconGravelUv ).xyz * 2.0 - 1.0;
  vec3 defconNAsphalt = texture2D( uDesertAsphaltNorm, defconAsphaltUv ).xyz * 2.0 - 1.0;
  vec3 defconNFloor = mix( defconNGravel, defconNSand, defconDuneW );
  vec3 mapN = normalize( defconNFloor * defconWFloor + defconNGravel * defconWBerm + defconNAsphalt * defconWAsphalt );
  mapN.xy *= normalScale;
  normal = normalize( tbn * mapN );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
  vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
  mapN.xy *= normalScale;
  normal = normalize( tbn * mapN );
#endif
`;

/**
 * Creates the desert splatting MeshStandardMaterial patched for Three.js r187
 * (`customProgramCacheKey = () => 'defcon_desert_splat_v1'`).
 * Blends 64 px/u sand, gravel/hardpan, and asphalt albedo + Sobel tangent-space normals,
 * differentiated roughness, road markings, and baked AO.
 */
export function createDesertTerrainMaterial(
  splatTex: THREE.Texture,
  roadMarksTex: THREE.Texture
): THREE.MeshStandardMaterial {
  const detail = getCachedDesertDetailTextures();

  const mat = new THREE.MeshStandardMaterial({
    map: splatTex,
    normalMap: detail.sandNorm,
    normalScale: new THREE.Vector2(0.85, 0.85),
    roughness: 0.9,
    metalness: 0.02,
    envMapIntensity: 0.72
  });

  mat.customProgramCacheKey = () => 'defcon_desert_splat_v1';

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uDesertRoadMarks = { value: roadMarksTex };
    shader.uniforms.uDesertSandMap = { value: detail.sandMap };
    shader.uniforms.uDesertGravelMap = { value: detail.gravelMap };
    shader.uniforms.uDesertAsphaltMap = { value: detail.asphaltMap };
    shader.uniforms.uDesertGravelNorm = { value: detail.gravelNorm };
    shader.uniforms.uDesertAsphaltNorm = { value: detail.asphaltNorm };
    shader.uniforms.uDesertDetailRepeat = { value: new THREE.Vector2(DETAIL_REPEAT_X, DETAIL_REPEAT_Y) };

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <map_pars_fragment>', DESERT_MAP_PARS)
      .replace('#include <map_fragment>', DESERT_MAP_FRAG)
      .replace('#include <roughnessmap_fragment>', DESERT_ROUGHNESS_FRAG)
      .replace('#include <normal_fragment_maps>', DESERT_NORMAL_MAPS_FRAG);
  };

  mat.needsUpdate = true;
  return mat;
}

/**
 * Returns a module-cached small mesh wired with the desert splatting shader for
 * safe prewarming without premature material disposal under KHR_parallel_shader_compile.
 */
export function createDesertTerrainWarmMesh(): THREE.Mesh {
  if (!cachedWarmMesh) {
    const warmTerrain = Array.from({ length: GRID_ROWS }, () => new Uint8Array(GRID_COLS));
    warmTerrain[7][0] = CELL.SPAWN;
    warmTerrain[7][1] = CELL.ROAD;
    warmTerrain[7][27] = CELL.FOB;
    cachedWarmSplat = createDesertSplatTexture(warmTerrain, [{ col: 0, row: 7 }], { col: 27, row: 7 });
    cachedWarmMarks = createDesertRoadMarksTexture(warmTerrain);
    cachedWarmMat = createDesertTerrainMaterial(cachedWarmSplat, cachedWarmMarks);
    cachedWarmGeo = new THREE.PlaneGeometry(1, 1);
    cachedWarmMesh = new THREE.Mesh(cachedWarmGeo, cachedWarmMat);
    cachedWarmMesh.name = 'DesertTerrainWarmMesh';
  }
  return cachedWarmMesh;
}
