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

export type BiomeId = 'desert' | 'arctic' | 'industrial' | 'forest' | 'canyon' | 'swamp' | 'volcanic';
export type NonDesertBiomeId = Exclude<BiomeId, 'desert'>;

export const BIOME_IDS: readonly BiomeId[] = Object.freeze([
  'desert',
  'arctic',
  'industrial',
  'forest',
  'canyon',
  'swamp',
  'volcanic'
]);

const BIOME_ID_SET = new Set<string>(BIOME_IDS);

function isKnownBiome(biome: string): biome is BiomeId {
  return BIOME_ID_SET.has(biome);
}

function normalizeBiomeId(biome: string): BiomeId {
  return isKnownBiome(biome) ? biome : 'desert';
}

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

export interface BiomeDetailTextures {
  floorMap: THREE.Texture;
  floorNorm: THREE.Texture;
  bermMap: THREE.Texture;
  bermNorm: THREE.Texture;
  roadMap: THREE.Texture;
  roadNorm: THREE.Texture;
}

let cachedDesertDetailTextures: DesertDetailTextures | null = null;
let cachedWarmMesh: THREE.Mesh | null = null;
let cachedWarmGeo: THREE.BufferGeometry | null = null;
let cachedWarmSplat: THREE.DataTexture | null = null;
let cachedWarmMarks: THREE.Texture | null = null;
let cachedWarmMat: THREE.MeshStandardMaterial | null = null;

let cachedActiveNonDesertDetail: { biome: NonDesertBiomeId; textures: BiomeDetailTextures } | null = null;
let cachedBiomeWarmMesh: THREE.Mesh | null = null;
let cachedBiomeWarmGeo: THREE.BufferGeometry | null = null;
let cachedBiomeWarmSplat: THREE.DataTexture | null = null;
let cachedBiomeWarmMarks: THREE.Texture | null = null;
let cachedBiomeWarmMat: THREE.MeshStandardMaterial | null = null;
let cachedBiomeWarmTextures: THREE.Texture[] = [];

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
 * or outside the board perimeter across all 7 biomes.
 */
export function computeTerrainMicroReliefY(
  wx: number,
  wz: number,
  baseTerrain: Uint8Array[],
  biome: string
): number {
  if (!isKnownBiome(biome)) return 0;

  const halfW = BOARD_W * 0.5;
  const halfD = BOARD_D * 0.5;
  const eps = 1e-4;

  // Outside playable board boundary -> subtle biome-tuned perimeter relief (0 right at border)
  if (Math.abs(wx) > halfW + eps || Math.abs(wz) > halfD + eps) {
    const outerDist = Math.max(0, Math.abs(wx) - halfW, Math.abs(wz) - halfD);
    const outerFade = smoothstep(0, 1.5, outerDist);
    if (biome === 'desert') {
      const n = fbm2D(wx * 0.08 + 13.7, wz * 0.08 - 5.1, 4109, 2);
      return outerFade * (0.08 + 0.16 * n);
    }
    if (biome === 'arctic') {
      const n = fbm2D(wx * 0.075 + 5.2, wz * 0.095 - 9.4, 4211, 2);
      return outerFade * (0.10 + 0.18 * n);
    }
    if (biome === 'industrial') {
      const n = fbm2D(wx * 0.11 - 2.3, wz * 0.11 + 8.1, 4327, 2);
      return outerFade * (0.06 + 0.12 * n);
    }
    if (biome === 'forest') {
      const n = fbm2D(wx * 0.095 + 17.3, wz * 0.095 - 3.6, 4441, 2);
      return outerFade * (0.09 + 0.15 * n);
    }
    if (biome === 'canyon') {
      const n = fbm2D(wx * 0.085 - 11.4, wz * 0.085 + 6.2, 4567, 2);
      const terrace = smoothstep(0.25, 0.78, n) * 0.65 + (Math.floor(n * 3) / 3) * 0.35;
      return outerFade * (0.12 + 0.20 * terrace);
    }
    if (biome === 'swamp') {
      const n = fbm2D(wx * 0.10 + 2.7, wz * 0.10 + 14.1, 4679, 2);
      return outerFade * (0.05 + 0.10 * n);
    }
    // volcanic
    const n = fbm2D(wx * 0.11 - 7.8, wz * 0.11 - 4.5, 4793, 2);
    const ridge = 1.0 - Math.abs(n * 2.0 - 1.0);
    return outerFade * (0.11 + 0.22 * ridge);
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

  if (biome === 'desert') {
    const moundNoise = fbm2D(wx * 0.19 + 7.4, wz * 0.19 - 3.9, 1987, 3);
    return interiorMask * (0.18 + 0.22 * moundNoise);
  }
  if (biome === 'arctic') {
    const driftNoise = fbm2D(wx * 0.14 + 3.2, wz * 0.21 - 8.4, 2113, 3);
    return interiorMask * (0.20 + 0.24 * driftNoise);
  }
  if (biome === 'industrial') {
    const n = fbm2D(wx * 0.22 - 4.1, wz * 0.22 + 6.7, 3109, 2);
    const slabStep = (Math.floor(n * 4) / 4) * 0.55 + n * 0.45;
    return interiorMask * (0.14 + 0.18 * slabStep);
  }
  if (biome === 'forest') {
    const rootMoss = fbm2D(wx * 0.24 + 11.1, wz * 0.24 - 2.3, 4127, 3);
    return interiorMask * (0.18 + 0.20 * rootMoss);
  }
  if (biome === 'canyon') {
    const n = fbm2D(wx * 0.17 - 9.2, wz * 0.17 + 4.8, 5119, 3);
    const terrace = smoothstep(0.2, 0.8, n) * 0.65 + (Math.round(n * 3) / 3) * 0.35;
    return interiorMask * (0.24 + 0.26 * terrace);
  }
  if (biome === 'swamp') {
    const hummock = fbm2D(wx * 0.21 + 5.6, wz * 0.21 + 1.9, 6131, 2);
    return interiorMask * (0.12 + 0.16 * hummock);
  }
  // volcanic basalt ridges
  const n = fbm2D(wx * 0.23 - 6.3, wz * 0.23 - 7.5, 7151, 3);
  const ridge = 1.0 - Math.abs(n * 2.0 - 1.0);
  return interiorMask * (0.22 + 0.28 * ridge);
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

const SPLAT_FIELD_NW = 257;
const SPLAT_FIELD_NH = 147;

function buildSplatSpatialCache(
  baseTerrain: Uint8Array[],
  spawnPoints: ReadonlyArray<SplatGridPoint> = [],
  fobPoint?: SplatGridPoint
): CellSpatialCache[] {
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

  return spatialCache;
}

function computeDesertSplatFields(
  lattice: Float32Array,
  sinLut: Float32Array,
  fbmField: Float32Array,
  sandField: Float32Array
): void {
  const nInvW = GRID_COLS / (SPLAT_FIELD_NW - 1);
  const nInvH = GRID_ROWS / (SPLAT_FIELD_NH - 1);

  for (let ny = 0; ny < SPLAT_FIELD_NH; ny++) {
    const gz = ny * nInvH;
    const rowOff = ny * SPLAT_FIELD_NW;
    for (let nx = 0; nx < SPLAT_FIELD_NW; nx++) {
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
}

const BIOME_SPLAT_FIELD_OFFSETS: Record<NonDesertBiomeId, [number, number]> = {
  arctic: [41.3, 19.7],
  industrial: [83.1, 61.4],
  forest: [127.6, 37.2],
  canyon: [163.8, 91.5],
  swamp: [201.4, 47.9],
  volcanic: [239.2, 113.6]
};

function computeNonDesertSplatFields(
  biome: NonDesertBiomeId,
  lattice: Float32Array,
  sinLut: Float32Array,
  fbmField: Float32Array,
  floorField: Float32Array
): void {
  const nInvW = GRID_COLS / (SPLAT_FIELD_NW - 1);
  const nInvH = GRID_ROWS / (SPLAT_FIELD_NH - 1);
  const [ox, oz] = BIOME_SPLAT_FIELD_OFFSETS[biome];

  for (let ny = 0; ny < SPLAT_FIELD_NH; ny++) {
    const gz = ny * nInvH;
    const rowOff = ny * SPLAT_FIELD_NW;
    for (let nx = 0; nx < SPLAT_FIELD_NW; nx++) {
      const gx = nx * nInvW;
      const u = gx * 0.30 + gz * 0.22 + ox;
      const v = -gx * 0.14 + gz * 0.38 + oz;
      const warpX = fastLatticeNoise2D(lattice, u * 0.52 + 4.3, v * 0.52 - 3.1) - 0.5;
      const warpY = fastLatticeNoise2D(lattice, u * 0.52 + 31.7, v * 0.52 + 15.9) - 0.5;
      const wx = u + warpX * 1.35;
      const wy = v + warpY * 1.35;
      const n0 = fastLatticeNoise2D(lattice, wx, wy);
      const n1 = fastLatticeNoise2D(lattice, wx * 2.07 + 19.0, wy * 2.07 + 13.0);
      const n2 = fastLatticeNoise2D(lattice, wx * 4.19 + 47.0, wy * 4.19 + 31.0);
      const fbm = n0 * 0.5714286 + n1 * 0.2857143 + n2 * 0.1428571;

      fbmField[rowOff + nx] = fbm;

      if (biome === 'arctic') {
        const phase = (gx * 0.55 + gz * 0.38 + warpX * 1.1) * 256.0;
        const driftWave = sinLut[(phase | 0) & 255];
        floorField[rowOff + nx] = clamp01(fbm * 0.72 + driftWave * 0.28);
      } else if (biome === 'industrial') {
        // Subtle weathered concrete bay staining + slab variation (no hard grid artifacts)
        const bayX = Math.abs(((gx * 0.5) % 1) - 0.5) * 2.0;
        const bayZ = Math.abs(((gz * 0.5) % 1) - 0.5) * 2.0;
        const slabFactor = 0.5 + 0.5 * (bayX * 0.4 + bayZ * 0.4);
        floorField[rowOff + nx] = clamp01(fbm * 0.76 + slabFactor * 0.24);
      } else if (biome === 'forest') {
        const mossWave = sinLut[((gx * 0.42 - gz * 0.28 + warpY * 1.4) * 256.0) & 255];
        floorField[rowOff + nx] = clamp01(fbm * 0.80 + mossWave * 0.20);
      } else if (biome === 'canyon') {
        const strataPhase = (gx * 0.24 + gz * 0.62 + warpX * 1.55) * 256.0;
        const strataWave = sinLut[(strataPhase | 0) & 255];
        floorField[rowOff + nx] = clamp01(fbm * 0.64 + strataWave * 0.36);
      } else if (biome === 'swamp') {
        // Smooth organic puddles where floorField < 0.45 triggers subtle wet specular basins
        const basin = smoothstep(0.24, 0.76, fbm * 0.86 + n1 * 0.14);
        floorField[rowOff + nx] = clamp01(basin);
      } else {
        // volcanic: cooled basalt flow ribbons + ash streaks
        const ridge = 1.0 - Math.abs(fbm * 2.0 - 1.0);
        const flowWave = sinLut[((gx * 0.48 + gz * 0.34 + warpX * 1.6) * 256.0) & 255];
        floorField[rowOff + nx] = clamp01(ridge * 0.62 + flowWave * 0.38);
      }
    }
  }
}

function packSplatFromFields(
  spatialCache: CellSpatialCache[],
  fbmField: Float32Array,
  floorField: Float32Array
): Uint8Array {
  const fillet = ROAD_CORNER_FILLET_CELL;
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
    const fRow0 = ny0 * SPLAT_FIELD_NW;
    const fRow1 = ny1 * SPLAT_FIELD_NW;

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

      const s00 = floorField[fRow0 + nx0];
      const s10 = floorField[fRow0 + nx1];
      const s01 = floorField[fRow1 + nx0];
      const s11 = floorField[fRow1 + nx1];
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

function buildSplatTextureFromTopDown(topDown: Uint8Array): THREE.DataTexture {
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
  const spatialCache = buildSplatSpatialCache(baseTerrain, spawnPoints, fobPoint);
  const fbmField = new Float32Array(SPLAT_FIELD_NW * SPLAT_FIELD_NH);
  const sandField = new Float32Array(SPLAT_FIELD_NW * SPLAT_FIELD_NH);
  computeDesertSplatFields(lattice, sinLut, fbmField, sandField);
  return packSplatFromFields(spatialCache, fbmField, sandField);
}

/**
 * Generates deterministic 512x292 RGBA splatmap data for any of the 7 biomes.
 * Delegates to createDesertSplatData() for 'desert' to preserve exact byte-for-byte identity.
 */
export function createBiomeSplatData(
  baseTerrain: Uint8Array[],
  biome: string,
  spawnPoints: ReadonlyArray<SplatGridPoint> = [],
  fobPoint?: SplatGridPoint
): Uint8Array {
  const normBiome = normalizeBiomeId(biome);
  if (normBiome === 'desert') {
    return createDesertSplatData(baseTerrain, spawnPoints, fobPoint);
  }
  const lattice = getDesertNoiseLattice();
  const sinLut = getSinLut();
  const spatialCache = buildSplatSpatialCache(baseTerrain, spawnPoints, fobPoint);
  const fbmField = new Float32Array(SPLAT_FIELD_NW * SPLAT_FIELD_NH);
  const floorField = new Float32Array(SPLAT_FIELD_NW * SPLAT_FIELD_NH);
  computeNonDesertSplatFields(normBiome, lattice, sinLut, fbmField, floorField);
  return packSplatFromFields(spatialCache, fbmField, floorField);
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
  return buildSplatTextureFromTopDown(createDesertSplatData(baseTerrain, spawnPoints, fobPoint));
}

/**
 * Builds a linear-space (NoColorSpace) RGBA DataTexture from createBiomeSplatData() for any of the 7 biomes.
 */
export function createBiomeSplatTexture(
  baseTerrain: Uint8Array[],
  biome: string,
  spawnPoints: ReadonlyArray<SplatGridPoint> = [],
  fobPoint?: SplatGridPoint
): THREE.DataTexture {
  return buildSplatTextureFromTopDown(createBiomeSplatData(baseTerrain, biome, spawnPoints, fobPoint));
}

interface RoadMarksStyle {
  gridStroke: string;
  crosshairStroke: string;
  tireTrackStroke: string;
  tireTrackWidth: number;
  curbStroke: string;
  curbWidth: number;
  centerStroke: string;
  centerWidth: number;
  centerDash: [number, number];
  outerShoulderStroke?: string;
  outerShoulderWidth?: number;
  jointStroke?: string;
}

const ROAD_MARKS_STYLES: Record<BiomeId, RoadMarksStyle> = {
  desert: {
    gridStroke: 'rgba(42, 32, 20, 0.14)',
    crosshairStroke: 'rgba(255, 240, 205, 0.17)',
    tireTrackStroke: 'rgba(18, 18, 20, 0.25)',
    tireTrackWidth: 5.6,
    curbStroke: 'rgba(218, 198, 158, 0.18)',
    curbWidth: 2.2,
    centerStroke: 'rgba(234, 179, 8, 0.68)',
    centerWidth: 3.2,
    centerDash: [14, 14]
  },
  arctic: {
    gridStroke: 'rgba(30, 52, 78, 0.18)',
    crosshairStroke: 'rgba(224, 242, 254, 0.28)',
    outerShoulderStroke: 'rgba(202, 218, 234, 0.36)',
    outerShoulderWidth: 8.5,
    tireTrackStroke: 'rgba(10, 16, 24, 0.34)',
    tireTrackWidth: 5.8,
    curbStroke: 'rgba(148, 196, 232, 0.42)',
    curbWidth: 2.6,
    centerStroke: 'rgba(125, 211, 252, 0.86)',
    centerWidth: 3.4,
    centerDash: [14, 14]
  },
  industrial: {
    gridStroke: 'rgba(16, 20, 26, 0.24)',
    crosshairStroke: 'rgba(249, 115, 22, 0.22)',
    jointStroke: 'rgba(16, 20, 26, 0.34)',
    tireTrackStroke: 'rgba(10, 12, 16, 0.36)',
    tireTrackWidth: 5.8,
    curbStroke: 'rgba(186, 196, 208, 0.38)',
    curbWidth: 2.6,
    centerStroke: 'rgba(249, 115, 22, 0.86)',
    centerWidth: 3.6,
    centerDash: [16, 12]
  },
  forest: {
    gridStroke: 'rgba(24, 38, 20, 0.18)',
    crosshairStroke: 'rgba(216, 238, 192, 0.22)',
    outerShoulderStroke: 'rgba(78, 62, 42, 0.28)',
    outerShoulderWidth: 7.5,
    tireTrackStroke: 'rgba(28, 20, 12, 0.40)',
    tireTrackWidth: 6.4,
    curbStroke: 'rgba(212, 186, 134, 0.38)',
    curbWidth: 2.4,
    centerStroke: 'rgba(236, 212, 152, 0.80)',
    centerWidth: 3.2,
    centerDash: [14, 14]
  },
  canyon: {
    gridStroke: 'rgba(56, 24, 14, 0.18)',
    crosshairStroke: 'rgba(253, 186, 116, 0.22)',
    outerShoulderStroke: 'rgba(176, 88, 52, 0.34)',
    outerShoulderWidth: 8.0,
    tireTrackStroke: 'rgba(16, 14, 16, 0.30)',
    tireTrackWidth: 5.6,
    curbStroke: 'rgba(234, 148, 92, 0.36)',
    curbWidth: 2.4,
    centerStroke: 'rgba(251, 146, 60, 0.86)',
    centerWidth: 3.4,
    centerDash: [14, 14]
  },
  swamp: {
    gridStroke: 'rgba(18, 30, 22, 0.22)',
    crosshairStroke: 'rgba(163, 230, 53, 0.22)',
    jointStroke: 'rgba(18, 26, 20, 0.38)',
    outerShoulderStroke: 'rgba(96, 132, 74, 0.26)',
    outerShoulderWidth: 7.0,
    tireTrackStroke: 'rgba(14, 20, 16, 0.36)',
    tireTrackWidth: 5.8,
    curbStroke: 'rgba(154, 186, 118, 0.34)',
    curbWidth: 2.4,
    centerStroke: 'rgba(163, 230, 53, 0.78)',
    centerWidth: 3.2,
    centerDash: [12, 14]
  },
  volcanic: {
    gridStroke: 'rgba(180, 150, 140, 0.14)',
    crosshairStroke: 'rgba(252, 165, 165, 0.24)',
    tireTrackStroke: 'rgba(10, 8, 10, 0.36)',
    tireTrackWidth: 5.6,
    curbStroke: 'rgba(192, 200, 212, 0.56)',
    curbWidth: 3.0,
    centerStroke: 'rgba(251, 113, 44, 0.90)',
    centerWidth: 3.4,
    centerDash: [14, 14]
  }
};

function renderRoadMarksTexture(baseTerrain: Uint8Array[], style: RoadMarksStyle): THREE.CanvasTexture {
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
  if (typeof ctx.clearRect === 'function') {
    ctx.clearRect(0, 0, w, h);
  }

  // 1. Subtle tactical engineering survey grid on buildable FREE cells
  ctx.strokeStyle = style.gridStroke;
  ctx.lineWidth = 1.6;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (baseTerrain[r]?.[c] !== CELL.FREE) continue;
      ctx.strokeRect(c * tileW + 0.8, r * tileH + 0.8, tileW - 1.6, tileH - 1.6);
    }
  }

  // Corner survey crosshairs at FREE grid vertices for crisp tactical alignment
  ctx.strokeStyle = style.crosshairStroke;
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
  const outerShoulderOffset = tileW * (ROAD_HALF_WIDTH_CELL + 0.06);

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
      if (typeof ctx.arcTo === 'function') {
        ctx.arcTo(ix, iy, ix, yEdge, arcR);
      }
      ctx.lineTo(ix, yEdge);
    } else if (typeof ctx.arcTo === 'function') {
      ctx.arcTo(ix, iy, ix, cy + dz * filletPx, arcR);
    }
    ctx.stroke();
  };

  const strokeRoadGeometry = (
    offset: number,
    strokeColor: string,
    lineWidth: number,
    dashPattern: [number, number] | null,
    mode: 'tracks' | 'curbs' | 'center'
  ) => {
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';
    if (dashPattern) {
      ctx.setLineDash(dashPattern);
      ctx.lineDashOffset = dashPattern[0] * 0.5;
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
          const dx = right ? 1 : -1;
          const dz = down ? 1 : -1;
          const signs = offset === 0 ? [0] : [-offset, offset];
          for (const s of signs) {
            strokeCornerFillet(cx, cy, dx, dz, s, true, true);
          }
        } else if (deg === 3) {
          const thruVert = up && down;
          if (thruVert) {
            const dx = right ? 1 : -1;
            if (mode === 'center') {
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
              const closedX = cx - dx * offset;
              ctx.beginPath();
              ctx.moveTo(closedX, cy - halfH);
              ctx.lineTo(closedX, cy + halfH);
              ctx.stroke();

              strokeCornerFillet(cx, cy, dx, -1, offset, true, true);
              strokeCornerFillet(cx, cy, dx, 1, offset, true, true);
            } else {
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

  // Optional outer shoulder accumulation (snow drifts, sandstone dust, damp moss, dirt verge)
  if (style.outerShoulderStroke && style.outerShoulderWidth) {
    strokeRoadGeometry(outerShoulderOffset, style.outerShoulderStroke, style.outerShoulderWidth, null, 'curbs');
  }

  // Optional transverse concrete/causeway slab joints along straight road segments
  if (style.jointStroke) {
    ctx.save();
    ctx.strokeStyle = style.jointStroke;
    ctx.lineWidth = 2.0;
    const slabSpan = tileW * (ROAD_HALF_WIDTH_CELL - 0.04);
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (baseTerrain[r]?.[c] !== CELL.ROAD) continue;
        const cx = (c + 0.5) * tileW;
        const cy = (r + 0.5) * tileH;
        const up = isCellRoadLike(baseTerrain, c, r - 1);
        const down = isCellRoadLike(baseTerrain, c, r + 1);
        const left = isCellRoadLike(baseTerrain, c - 1, r);
        const right = isCellRoadLike(baseTerrain, c + 1, r);
        if ((left || right) && !up && !down) {
          for (const frac of [-0.25, 0.25]) {
            const jx = cx + frac * tileW;
            ctx.beginPath();
            ctx.moveTo(jx, cy - slabSpan);
            ctx.lineTo(jx, cy + slabSpan);
            ctx.stroke();
          }
        } else if ((up || down) && !left && !right) {
          for (const frac of [-0.25, 0.25]) {
            const jy = cy + frac * tileH;
            ctx.beginPath();
            ctx.moveTo(cx - slabSpan, jy);
            ctx.lineTo(cx + slabSpan, jy);
            ctx.stroke();
          }
        }
      }
    }
    ctx.restore();
  }

  // Subtle dark rubber tire wear tracks
  strokeRoadGeometry(trackOffset, style.tireTrackStroke, style.tireTrackWidth, null, 'tracks');

  // Road shoulder curb marks
  strokeRoadGeometry(curbOffset, style.curbStroke, style.curbWidth, null, 'curbs');

  // Crisp tactical dashed centerline
  strokeRoadGeometry(0, style.centerStroke, style.centerWidth, style.centerDash, 'center');

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
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
  return renderRoadMarksTexture(baseTerrain, ROAD_MARKS_STYLES.desert);
}

/**
 * Generates a biome-authentic 2048x1170 transparent overlay CanvasTexture for any of the 7 biomes.
 */
export function createBiomeRoadMarksTexture(baseTerrain: Uint8Array[], biome: string): THREE.CanvasTexture {
  return renderRoadMarksTexture(baseTerrain, ROAD_MARKS_STYLES[normalizeBiomeId(biome)]);
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

function disposeBiomeDetailSet(detail: BiomeDetailTextures): void {
  detail.floorMap.dispose();
  detail.floorNorm.dispose();
  detail.bermMap.dispose();
  detail.bermNorm.dispose();
  detail.roadMap.dispose();
  detail.roadNorm.dispose();
}

/**
 * Disposes the currently cached non-desert biome detail textures and unified biome warm mesh.
 * Keeps total terrain detail VRAM bounded (<= 12 MiB) across all 20 campaign stages.
 */
export function disposeActiveBiomeDetailCache(): void {
  if (cachedActiveNonDesertDetail) {
    disposeBiomeDetailSet(cachedActiveNonDesertDetail.textures);
    cachedActiveNonDesertDetail = null;
  }
  if (cachedBiomeWarmGeo) {
    cachedBiomeWarmGeo.dispose();
    cachedBiomeWarmGeo = null;
  }
  if (cachedBiomeWarmMat) {
    cachedBiomeWarmMat.dispose();
    cachedBiomeWarmMat = null;
  }
  if (cachedBiomeWarmSplat) {
    cachedBiomeWarmSplat.dispose();
    cachedBiomeWarmSplat = null;
  }
  if (cachedBiomeWarmMarks) {
    cachedBiomeWarmMarks.dispose();
    cachedBiomeWarmMarks = null;
  }
  for (const tex of cachedBiomeWarmTextures) {
    tex.dispose();
  }
  cachedBiomeWarmTextures = [];
  cachedBiomeWarmMesh = null;
}

interface BiomeDetailPalette {
  headlessFloor: readonly [number, number, number];
  headlessBerm: readonly [number, number, number];
  headlessRoad: readonly [number, number, number];
  bermBase: readonly [number, number, number];
  bermChipLight: string;
  bermChipDark: string;
  roadBase: readonly [number, number, number];
  roadDustBias: readonly [number, number, number];
  floorStrength: number;
  bermStrength: number;
  roadStrength: number;
}

const BIOME_DETAIL_PALETTES: Record<NonDesertBiomeId, BiomeDetailPalette> = {
  arctic: {
    headlessFloor: [192, 208, 224], // #c0d0e0 within #b6c7d8..#cbd9e6
    headlessBerm: [110, 130, 152],
    headlessRoad: [40, 51, 64],
    bermBase: [110, 130, 152],
    bermChipLight: 'rgba(182, 202, 222, 0.28)',
    bermChipDark: 'rgba(54, 70, 90, 0.28)',
    roadBase: [40, 51, 64],
    roadDustBias: [18, 24, 32],
    floorStrength: 1.85,
    bermStrength: 2.5,
    roadStrength: 1.7
  },
  industrial: {
    headlessFloor: [84, 92, 104],
    headlessBerm: [64, 70, 80],
    headlessRoad: [36, 40, 48],
    bermBase: [64, 70, 80],
    bermChipLight: 'rgba(124, 132, 144, 0.24)',
    bermChipDark: 'rgba(28, 32, 38, 0.30)',
    roadBase: [36, 40, 48],
    roadDustBias: [14, 15, 16],
    floorStrength: 2.0,
    bermStrength: 2.6,
    roadStrength: 1.9
  },
  forest: {
    headlessFloor: [74, 108, 60],
    headlessBerm: [89, 76, 56],
    headlessRoad: [76, 61, 43],
    bermBase: [89, 76, 56],
    bermChipLight: 'rgba(132, 114, 86, 0.26)',
    bermChipDark: 'rgba(44, 36, 24, 0.28)',
    roadBase: [76, 61, 43],
    roadDustBias: [22, 18, 12],
    floorStrength: 2.2,
    bermStrength: 2.5,
    roadStrength: 2.1
  },
  canyon: {
    headlessFloor: [154, 84, 53],
    headlessBerm: [104, 60, 44],
    headlessRoad: [42, 44, 50],
    bermBase: [104, 60, 44],
    bermChipLight: 'rgba(168, 102, 70, 0.28)',
    bermChipDark: 'rgba(54, 28, 20, 0.28)',
    roadBase: [42, 44, 50],
    roadDustBias: [32, 16, 10],
    floorStrength: 2.4,
    bermStrength: 2.7,
    roadStrength: 1.9
  },
  swamp: {
    headlessFloor: [52, 78, 60],
    headlessBerm: [61, 71, 58],
    headlessRoad: [45, 53, 46],
    bermBase: [61, 71, 58],
    bermChipLight: 'rgba(98, 114, 88, 0.24)',
    bermChipDark: 'rgba(26, 34, 26, 0.30)',
    roadBase: [45, 53, 46],
    roadDustBias: [14, 22, 14],
    floorStrength: 2.0,
    bermStrength: 2.4,
    roadStrength: 2.0
  },
  volcanic: {
    headlessFloor: [49, 41, 43], // #31292b within #282224..#3a3133 (L* 22-32%)
    headlessBerm: [68, 56, 56],
    headlessRoad: [78, 72, 74], // Weathered ash-slate steel road for >= 3:1 dark enemy contrast in grayscale
    bermBase: [68, 56, 56],
    bermChipLight: 'rgba(116, 94, 88, 0.28)',
    bermChipDark: 'rgba(24, 19, 20, 0.30)',
    roadBase: [78, 72, 74],
    roadDustBias: [18, 12, 10],
    floorStrength: 2.5,
    bermStrength: 2.8,
    roadStrength: 1.9
  }
};

function drawWrappedAngularChips(
  mctx: CanvasRenderingContext2D,
  hctx: CanvasRenderingContext2D,
  size: number,
  rng: ReturnType<typeof createSeededRng>,
  lightColor: string,
  darkColor: string,
  count: number
): void {
  for (let i = 0; i < count; i++) {
    const px = rng() * size;
    const py = rng() * size;
    const pw = 2.0 + rng() * 4.5;
    const ph = 1.5 + rng() * 3.5;
    const ang = rng() * Math.PI;
    const light = rng() > 0.45;
    const color = light ? lightColor : darkColor;
    const hColor = light ? 'rgba(220, 220, 220, 0.34)' : 'rgba(55, 55, 55, 0.30)';

    for (const ox of [-size, 0, size]) {
      for (const oy of [-size, 0, size]) {
        if (px + ox < -10 || px + ox > size + 10 || py + oy < -10 || py + oy > size + 10) continue;
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
}

function createBiomeDetailPair(
  biome: NonDesertBiomeId,
  slot: 'floor' | 'berm' | 'road',
  anisotropy: number
): { map: THREE.CanvasTexture; norm: THREE.CanvasTexture } {
  // 256x256 tileable maps (4x fewer pixels -> ~4x faster biome switch loadStage & 4x less VRAM)
  const S = 256;
  const pal = BIOME_DETAIL_PALETTES[biome];
  const seedBase = hashSeed('biome_detail_v1', biome, slot) & 0xffff;
  const rng = createSeededRng(hashSeed('biome_detail_rng', biome, slot));

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

  if (slot === 'floor') {
    for (let y = 0; y < S; y++) {
      const v = y / S;
      for (let x = 0; x < S; x++) {
        const u = x / S;
        const nLo = periodicValueNoise2D(u * 16, v * 16, 16, seedBase + 101);
        const nMid = periodicValueNoise2D(u * 48, v * 48, 48, seedBase + 307);
        const nFine = periodicValueNoise2D(u * 128, v * 128, 128, seedBase + 613);

        let rCol = 128;
        let gCol = 128;
        let bCol = 128;
        let hVal = 0.5;

        if (biome === 'arctic') {
          // Compact wind-scoured snow sastrugi calibrated strictly to #b6c7d8..#cbd9e6 (zero whiteout)
          const warp = (nLo - 0.5) * 0.44 + (nMid - 0.5) * 0.16;
          const phase = twoPi * (u * 2.0 + v * 7.0 + warp);
          const sastrugi = 0.5 + 0.36 * Math.sin(phase) + 0.14 * Math.sin(phase * 2.0 - 0.5);
          const mixT = clamp01(sastrugi * 0.65 + nMid * 0.25 + nFine * 0.10);
          rCol = Math.round(182 + (203 - 182) * mixT);
          gCol = Math.round(199 + (217 - 199) * mixT);
          bCol = Math.round(216 + (230 - 216) * mixT);
          hVal = clamp01(0.45 + (sastrugi - 0.5) * 0.36 + (nFine - 0.5) * 0.14);
        } else if (biome === 'industrial') {
          // Weathered concrete slabs with tileable expansion joints & hairline fractures
          const seamU = Math.min(u % 0.5, 0.5 - (u % 0.5));
          const seamV = Math.min(v % 0.5, 0.5 - (v % 0.5));
          const joint = 1.0 - smoothstep(0.002, 0.011, Math.min(seamU, seamV)) * 0.32;
          const crackA = Math.abs(periodicValueNoise2D(u * 24 + 0.2, v * 24 - 0.3, 24, seedBase + 811) - 0.5);
          const crackMask = 1.0 - smoothstep(0.012, 0.045, crackA) * 0.22;
          const tone = (0.86 + nLo * 0.16 + (nMid - 0.5) * 0.12 + (nFine - 0.5) * 0.10) * joint * crackMask;
          rCol = Math.min(255, Math.max(0, Math.round(86 * tone)));
          gCol = Math.min(255, Math.max(0, Math.round(94 * tone)));
          bCol = Math.min(255, Math.max(0, Math.round(106 * tone)));
          hVal = clamp01((0.50 + (nMid - 0.5) * 0.24 + (nFine - 0.5) * 0.18) * joint * crackMask);
        } else if (biome === 'forest') {
          // Tactical moss & turf loam with anisotropic blade/needle grain
          const blade = periodicValueNoise2D(u * 96, v * 32, 96, seedBase + 919);
          const tone = 0.84 + nLo * 0.18 + (blade - 0.5) * 0.16 + (nFine - 0.5) * 0.12;
          const dryBias = (nLo - 0.5) * 14;
          rCol = Math.min(255, Math.max(0, Math.round((74 + dryBias) * tone)));
          gCol = Math.min(255, Math.max(0, Math.round(108 * tone)));
          bCol = Math.min(255, Math.max(0, Math.round((59 - dryBias * 0.4) * tone)));
          hVal = clamp01(0.46 + (blade - 0.5) * 0.34 + (nFine - 0.5) * 0.24);
        } else if (biome === 'canyon') {
          // Stratified red terracotta sandstone bands
          const strataPhase = twoPi * (v * 6.0 + (nLo - 0.5) * 0.85 + (nMid - 0.5) * 0.22);
          const strata = 0.5 + 0.5 * Math.sin(strataPhase);
          const tone = 0.84 + strata * 0.20 + (nMid - 0.5) * 0.14 + (nFine - 0.5) * 0.12;
          rCol = Math.min(255, Math.max(0, Math.round((148 + strata * 16) * tone)));
          gCol = Math.min(255, Math.max(0, Math.round((80 + strata * 10) * tone)));
          bCol = Math.min(255, Math.max(0, Math.round((51 + strata * 6) * tone)));
          hVal = clamp01(0.44 + (strata - 0.5) * 0.34 + (nMid - 0.5) * 0.22 + (nFine - 0.5) * 0.16);
        } else if (biome === 'swamp') {
          // Damp peat mud & organic moss mottling
          const silt = periodicValueNoise2D(u * 32, v * 32, 32, seedBase + 997);
          const tone = 0.82 + nLo * 0.20 + (silt - 0.5) * 0.16 + (nFine - 0.5) * 0.12;
          const mossShift = Math.max(0, nLo - 0.52) * 26;
          rCol = Math.min(255, Math.max(0, Math.round((50 + mossShift * 0.4) * tone)));
          gCol = Math.min(255, Math.max(0, Math.round((74 + mossShift) * tone)));
          bCol = Math.min(255, Math.max(0, Math.round((58 + mossShift * 0.2) * tone)));
          hVal = clamp01(0.46 + (silt - 0.5) * 0.30 + (nFine - 0.5) * 0.20);
        } else {
          // Volcanic porous basalt & ash calibrated strictly to #282224..#3a3133 (L* 22-32%)
          const pores = periodicValueNoise2D(u * 96, v * 96, 96, seedBase + 1093);
          const pit = pores < 0.24 ? -0.18 : pores > 0.78 ? 0.10 : 0.0;
          const mixT = clamp01(0.35 + (nLo - 0.5) * 0.5 + (nMid - 0.5) * 0.35 + pit + (nFine - 0.5) * 0.2);
          rCol = Math.round(40 + (58 - 40) * mixT);
          gCol = Math.round(34 + (49 - 34) * mixT);
          bCol = Math.round(36 + (51 - 36) * mixT);
          hVal = clamp01(0.48 + (nMid - 0.5) * 0.32 + pit * 0.75 + (nFine - 0.5) * 0.22);
        }

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
  } else if (slot === 'berm') {
    const [br, bg, bb] = pal.bermBase;
    for (let y = 0; y < S; y++) {
      const v = y / S;
      for (let x = 0; x < S; x++) {
        const u = x / S;
        const nLo = periodicValueNoise2D(u * 16, v * 16, 16, seedBase + 211);
        const nMid = periodicValueNoise2D(u * 48, v * 48, 48, seedBase + 433);
        const nFine = periodicValueNoise2D(u * 128, v * 128, 128, seedBase + 757);
        const tone = 0.85 + nLo * 0.16 + (nMid - 0.5) * 0.14 + (nFine - 0.5) * 0.12;
        const hVal = clamp01(0.46 + (nMid - 0.5) * 0.36 + (nFine - 0.5) * 0.28);

        const o = (y * S + x) * 4;
        mData[o] = Math.min(255, Math.max(0, Math.round(br * tone)));
        mData[o + 1] = Math.min(255, Math.max(0, Math.round(bg * tone)));
        mData[o + 2] = Math.min(255, Math.max(0, Math.round(bb * tone)));
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
    drawWrappedAngularChips(mctx, hctx, S, rng, pal.bermChipLight, pal.bermChipDark, 580);
  } else {
    const [rr, rg, rb] = pal.roadBase;
    const [dr, dg, db] = pal.roadDustBias;
    for (let y = 0; y < S; y++) {
      const v = y / S;
      for (let x = 0; x < S; x++) {
        const u = x / S;
        const nMacro = periodicValueNoise2D(u * 16, v * 16, 16, seedBase + 313);
        const nFine = periodicValueNoise2D(u * 128, v * 128, 128, seedBase + 547);
        const speck = periodicValueNoise2D(u * 256, v * 256, 256, seedBase + 887);
        const dustTint = (nMacro - 0.5) * 0.24;
        const chip = speck > 0.72 ? 0.14 : speck < 0.22 ? -0.10 : 0.0;
        const base = 0.88 + (nFine - 0.5) * 0.20 + chip;
        const hVal = clamp01(0.48 + (nFine - 0.5) * 0.30 + chip * 0.85);

        const o = (y * S + x) * 4;
        mData[o] = Math.min(255, Math.max(0, Math.round((rr + dustTint * dr) * base)));
        mData[o + 1] = Math.min(255, Math.max(0, Math.round((rg + dustTint * dg) * base)));
        mData[o + 2] = Math.min(255, Math.max(0, Math.round((rb + dustTint * db) * base)));
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

  const strength = slot === 'floor' ? pal.floorStrength : slot === 'berm' ? pal.bermStrength : pal.roadStrength;
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
 * Returns module-cached 512x512 tileable detail textures (repeat 14x8 = 64 px/u) for any of the 7 biomes.
 * Keeps at most ONE non-desert biome detail set in memory at a time, automatically disposing the previous
 * non-desert set upon switching biomes so VRAM remains bounded (<= 12 MiB).
 */
export function getCachedBiomeDetailTextures(biome: string, maxAnisotropy = 8): BiomeDetailTextures {
  const normBiome = normalizeBiomeId(biome);
  if (normBiome === 'desert') {
    const d = getCachedDesertDetailTextures(maxAnisotropy);
    return {
      floorMap: d.sandMap,
      floorNorm: d.sandNorm,
      bermMap: d.gravelMap,
      bermNorm: d.gravelNorm,
      roadMap: d.asphaltMap,
      roadNorm: d.asphaltNorm
    };
  }

  if (cachedActiveNonDesertDetail) {
    if (cachedActiveNonDesertDetail.biome === normBiome) {
      return cachedActiveNonDesertDetail.textures;
    }
    disposeBiomeDetailSet(cachedActiveNonDesertDetail.textures);
    cachedActiveNonDesertDetail = null;
  }

  const pal = BIOME_DETAIL_PALETTES[normBiome];
  let textures: BiomeDetailTextures;

  if (typeof document === 'undefined') {
    textures = {
      floorMap: makeHeadlessDetailFallback(pal.headlessFloor[0], pal.headlessFloor[1], pal.headlessFloor[2], false),
      floorNorm: makeHeadlessDetailFallback(128, 128, 255, true),
      bermMap: makeHeadlessDetailFallback(pal.headlessBerm[0], pal.headlessBerm[1], pal.headlessBerm[2], false),
      bermNorm: makeHeadlessDetailFallback(128, 128, 255, true),
      roadMap: makeHeadlessDetailFallback(pal.headlessRoad[0], pal.headlessRoad[1], pal.headlessRoad[2], false),
      roadNorm: makeHeadlessDetailFallback(128, 128, 255, true)
    };
  } else {
    const floor = createBiomeDetailPair(normBiome, 'floor', maxAnisotropy);
    const berm = createBiomeDetailPair(normBiome, 'berm', maxAnisotropy);
    const road = createBiomeDetailPair(normBiome, 'road', maxAnisotropy);
    textures = {
      floorMap: floor.map,
      floorNorm: floor.norm,
      bermMap: berm.map,
      bermNorm: berm.norm,
      roadMap: road.map,
      roadNorm: road.norm
    };
  }

  cachedActiveNonDesertDetail = { biome: normBiome, textures };
  return textures;
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

interface BiomeShaderParams {
  floorTintA: readonly [number, number, number];
  floorTintB: readonly [number, number, number];
  bermTint: readonly [number, number, number];
  roadTint: readonly [number, number, number];
  macroAmp: number;
  roughFloor: readonly [number, number];
  roughBermRoad: readonly [number, number];
  wetPuddleStrength: number;
  antiTileStrength: number;
  normalScale: number;
}

const BIOME_SHADER_PARAMS: Record<NonDesertBiomeId, BiomeShaderParams> = {
  arctic: {
    floorTintA: [0.92, 0.96, 1.00],
    floorTintB: [1.00, 1.00, 1.00],
    bermTint: [0.95, 0.98, 1.02],
    roadTint: [0.94, 0.98, 1.04],
    macroAmp: 0.04,
    roughFloor: [0.80, 0.88],
    roughBermRoad: [0.82, 0.50],
    wetPuddleStrength: 0.24,
    antiTileStrength: 0.14,
    normalScale: 0.78
  },
  industrial: {
    floorTintA: [0.90, 0.91, 0.93],
    floorTintB: [1.04, 1.04, 1.05],
    bermTint: [0.94, 0.95, 0.96],
    roadTint: [0.96, 0.96, 0.98],
    macroAmp: 0.08,
    roughFloor: [0.76, 0.86],
    roughBermRoad: [0.85, 0.70],
    wetPuddleStrength: 0.0,
    antiTileStrength: 0.02,
    normalScale: 0.85
  },
  forest: {
    floorTintA: [0.86, 0.94, 0.82],
    floorTintB: [1.04, 1.06, 0.94],
    bermTint: [0.95, 0.92, 0.86],
    roadTint: [0.98, 0.94, 0.88],
    macroAmp: 0.12,
    roughFloor: [0.84, 0.93],
    roughBermRoad: [0.88, 0.84],
    wetPuddleStrength: 0.0,
    antiTileStrength: 0.14,
    normalScale: 0.88
  },
  canyon: {
    floorTintA: [0.88, 0.82, 0.78],
    floorTintB: [1.05, 1.00, 0.94],
    bermTint: [0.94, 0.86, 0.82],
    roadTint: [0.96, 0.94, 0.94],
    macroAmp: 0.11,
    roughFloor: [0.85, 0.94],
    roughBermRoad: [0.88, 0.76],
    wetPuddleStrength: 0.0,
    antiTileStrength: 0.13,
    normalScale: 0.92
  },
  swamp: {
    floorTintA: [0.82, 0.90, 0.84],
    floorTintB: [1.02, 1.04, 0.94],
    bermTint: [0.90, 0.94, 0.88],
    roadTint: [0.94, 0.96, 0.92],
    macroAmp: 0.10,
    roughFloor: [0.40, 0.90],
    roughBermRoad: [0.76, 0.56],
    wetPuddleStrength: 0.72,
    antiTileStrength: 0.14,
    normalScale: 0.84
  },
  volcanic: {
    floorTintA: [0.88, 0.82, 0.82],
    floorTintB: [1.04, 0.96, 0.96],
    bermTint: [0.94, 0.88, 0.86],
    roadTint: [0.95, 0.95, 0.98],
    macroAmp: 0.10,
    roughFloor: [0.82, 0.92],
    roughBermRoad: [0.86, 0.74],
    wetPuddleStrength: 0.0,
    antiTileStrength: 0.14,
    normalScale: 0.95
  }
};

const BIOME_MAP_PARS = /* glsl */ `
#include <map_pars_fragment>
uniform sampler2D uBiomeRoadMarks;
uniform sampler2D uBiomeFloorMap;
uniform sampler2D uBiomeBermMap;
uniform sampler2D uBiomeRoadMap;
uniform sampler2D uBiomeBermNorm;
uniform sampler2D uBiomeRoadNorm;
uniform vec2 uBiomeDetailRepeat;
uniform vec3 uFloorTintA;
uniform vec3 uFloorTintB;
uniform vec3 uBermTint;
uniform vec3 uRoadTint;
uniform float uMacroAmp;
uniform vec2 uRoughRangeFloor;
uniform vec2 uRoughBermRoad;
uniform float uWetPuddleStrength;
uniform float uAntiTileStrength;
`;

const BIOME_MAP_FRAG = /* glsl */ `
#ifdef USE_MAP
  vec4 defconSplat = texture2D( map, vMapUv );
  vec2 defconMacroWorld = vMapUv * vec2( 112.0, 64.0 );
  vec2 defconDetailBaseUv = vMapUv * uBiomeDetailRepeat;

  vec2 defconAntiTile = vec2(
    sin( defconMacroWorld.x * 0.11 + defconMacroWorld.y * 0.08 ),
    cos( defconMacroWorld.x * 0.07 - defconMacroWorld.y * 0.13 )
  ) * uAntiTileStrength;
  vec2 defconFloorUv = defconDetailBaseUv + defconAntiTile;
  vec2 defconBermUv = defconDetailBaseUv - defconAntiTile * 0.72 + vec2( 0.37, 0.19 );
  vec2 defconRoadUv = defconDetailBaseUv;

  vec3 defconFloorTex = texture2D( uBiomeFloorMap, defconFloorUv ).rgb;
  vec3 defconBermTex = texture2D( uBiomeBermMap, defconBermUv ).rgb;
  vec3 defconRoadTex = texture2D( uBiomeRoadMap, defconRoadUv ).rgb;

  float defconWRoad = smoothstep( 0.10, 0.90, clamp( defconSplat.r, 0.0, 1.0 ) );
  float defconWBerm = clamp( defconSplat.g * ( 1.0 - defconWRoad ), 0.0, 1.0 );
  float defconWFloor = max( 0.0, 1.0 - defconWRoad - defconWBerm );
  float defconVarW = clamp( defconSplat.b, 0.0, 1.0 );
  float defconBakedAO = mix( 0.50, 1.0, clamp( defconSplat.a, 0.0, 1.0 ) );

  float defconMacroWave = 0.5 + 0.5 * sin( defconMacroWorld.x * 0.17 - defconMacroWorld.y * 0.14 );
  float defconMacroTone = ( 1.0 - uMacroAmp * 0.5 ) + uMacroAmp * defconMacroWave;

  vec3 defconFloorTint = mix( uFloorTintA, uFloorTintB, defconVarW );
  vec3 defconFloorCol = defconFloorTex * defconFloorTint * defconMacroTone;

  float defconWetMask = smoothstep( 0.52, 0.92, 1.0 - defconVarW ) * uWetPuddleStrength * defconWFloor;
  defconFloorCol *= ( 1.0 - defconWetMask * 0.24 );

  vec3 defconBermCol = defconBermTex * uBermTint;
  vec3 defconRoadCol = defconRoadTex * uRoadTint;

  vec3 defconTerrainCol = defconFloorCol * defconWFloor
                        + defconBermCol * defconWBerm
                        + defconRoadCol * defconWRoad;

  vec4 defconRoadMarks = texture2D( uBiomeRoadMarks, vMapUv );
  defconTerrainCol = mix( defconTerrainCol, defconRoadMarks.rgb, defconRoadMarks.a );
  defconTerrainCol *= defconBakedAO;

  diffuseColor.rgb *= defconTerrainCol;
#endif
`;

const BIOME_ROUGHNESS_FRAG = /* glsl */ `
float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
  vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
  roughnessFactor *= texelRoughness.g;
#endif
#ifdef USE_MAP
  float defconFloorRough = mix( uRoughRangeFloor.x, uRoughRangeFloor.y, defconVarW );
  defconFloorRough = mix( defconFloorRough, max( 0.28, uRoughRangeFloor.x * 0.55 ), defconWetMask );
  float defconMatRough = mix( defconFloorRough, uRoughBermRoad.x, defconWBerm );
  defconMatRough = mix( defconMatRough, uRoughBermRoad.y, defconWRoad );
  roughnessFactor = clamp( mix( defconMatRough, 0.80, defconRoadMarks.a * 0.50 ), 0.26, 0.96 );
#endif
`;

const BIOME_NORMAL_MAPS_FRAG = /* glsl */ `
#if defined( USE_NORMALMAP_TANGENTSPACE ) && defined( USE_MAP )
  vec3 defconNFloor = texture2D( normalMap, defconFloorUv ).xyz * 2.0 - 1.0;
  vec3 defconNBerm = texture2D( uBiomeBermNorm, defconBermUv ).xyz * 2.0 - 1.0;
  vec3 defconNRoad = texture2D( uBiomeRoadNorm, defconRoadUv ).xyz * 2.0 - 1.0;
  defconNFloor.xy *= ( 1.0 - defconWetMask * 0.65 );
  vec3 mapN = normalize( defconNFloor * defconWFloor + defconNBerm * defconWBerm + defconNRoad * defconWRoad );
  mapN.xy *= normalScale;
  normal = normalize( tbn * mapN );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
  vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
  mapN.xy *= normalScale;
  normal = normalize( tbn * mapN );
#endif
`;

function buildUnifiedBiomeTerrainMaterial(
  biome: NonDesertBiomeId,
  splatTex: THREE.Texture,
  roadMarksTex: THREE.Texture,
  detail: BiomeDetailTextures
): THREE.MeshStandardMaterial {
  const p = BIOME_SHADER_PARAMS[biome];
  const mat = new THREE.MeshStandardMaterial({
    map: splatTex,
    normalMap: detail.floorNorm,
    normalScale: new THREE.Vector2(p.normalScale, p.normalScale),
    roughness: 0.88,
    metalness: 0.02,
    envMapIntensity: 0.72
  });

  mat.customProgramCacheKey = () => 'defcon_biome_splat_v1';

  const uniforms = {
    uBiomeRoadMarks: { value: roadMarksTex },
    uBiomeFloorMap: { value: detail.floorMap },
    uBiomeBermMap: { value: detail.bermMap },
    uBiomeRoadMap: { value: detail.roadMap },
    uBiomeBermNorm: { value: detail.bermNorm },
    uBiomeRoadNorm: { value: detail.roadNorm },
    uBiomeDetailRepeat: { value: new THREE.Vector2(DETAIL_REPEAT_X, DETAIL_REPEAT_Y) },
    uFloorTintA: { value: new THREE.Vector3(p.floorTintA[0], p.floorTintA[1], p.floorTintA[2]) },
    uFloorTintB: { value: new THREE.Vector3(p.floorTintB[0], p.floorTintB[1], p.floorTintB[2]) },
    uBermTint: { value: new THREE.Vector3(p.bermTint[0], p.bermTint[1], p.bermTint[2]) },
    uRoadTint: { value: new THREE.Vector3(p.roadTint[0], p.roadTint[1], p.roadTint[2]) },
    uMacroAmp: { value: p.macroAmp },
    uRoughRangeFloor: { value: new THREE.Vector2(p.roughFloor[0], p.roughFloor[1]) },
    uRoughBermRoad: { value: new THREE.Vector2(p.roughBermRoad[0], p.roughBermRoad[1]) },
    uWetPuddleStrength: { value: p.wetPuddleStrength },
    uAntiTileStrength: { value: p.antiTileStrength }
  };

  mat.userData.defconBiomeSplatUniforms = uniforms;

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <map_pars_fragment>', BIOME_MAP_PARS)
      .replace('#include <map_fragment>', BIOME_MAP_FRAG)
      .replace('#include <roughnessmap_fragment>', BIOME_ROUGHNESS_FRAG)
      .replace('#include <normal_fragment_maps>', BIOME_NORMAL_MAPS_FRAG);
  };

  mat.needsUpdate = true;
  return mat;
}

/**
 * Creates the terrain splatting MeshStandardMaterial for any of the 7 biomes:
 * - 'desert': delegates to createDesertTerrainMaterial ('defcon_desert_splat_v1')
 * - remaining 6 biomes: shares a single uniform-parameterized shader ('defcon_biome_splat_v1')
 */
export function createBiomeTerrainMaterial(
  biome: string,
  splatTex: THREE.Texture,
  roadMarksTex: THREE.Texture
): THREE.MeshStandardMaterial {
  const normBiome = normalizeBiomeId(biome);
  if (normBiome === 'desert') {
    return createDesertTerrainMaterial(splatTex, roadMarksTex);
  }
  const detail = getCachedBiomeDetailTextures(normBiome);
  return buildUnifiedBiomeTerrainMaterial(normBiome, splatTex, roadMarksTex, detail);
}

/**
 * Returns a module-cached small mesh wired with the unified biome splatting shader
 * (`'defcon_biome_splat_v1'`) for safe boot prewarming under KHR_parallel_shader_compile.
 * Uses tiny dedicated 1x1 textures so active biome detail cache swaps never invalidate it.
 */
export function createBiomeTerrainWarmMesh(): THREE.Mesh {
  if (!cachedBiomeWarmMesh) {
    const warmTerrain = Array.from({ length: GRID_ROWS }, () => new Uint8Array(GRID_COLS));
    warmTerrain[7][0] = CELL.SPAWN;
    warmTerrain[7][1] = CELL.ROAD;
    warmTerrain[7][27] = CELL.FOB;
    cachedBiomeWarmSplat = createBiomeSplatTexture(warmTerrain, 'arctic', [{ col: 0, row: 7 }], { col: 27, row: 7 });
    const marksFallback = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1, THREE.RGBAFormat);
    marksFallback.colorSpace = THREE.SRGBColorSpace;
    marksFallback.needsUpdate = true;
    cachedBiomeWarmMarks = marksFallback;

    const warmDetail: BiomeDetailTextures = {
      floorMap: makeHeadlessDetailFallback(192, 208, 224, false),
      floorNorm: makeHeadlessDetailFallback(128, 128, 255, true),
      bermMap: makeHeadlessDetailFallback(110, 130, 152, false),
      bermNorm: makeHeadlessDetailFallback(128, 128, 255, true),
      roadMap: makeHeadlessDetailFallback(40, 51, 64, false),
      roadNorm: makeHeadlessDetailFallback(128, 128, 255, true)
    };
    cachedBiomeWarmTextures = [
      warmDetail.floorMap,
      warmDetail.floorNorm,
      warmDetail.bermMap,
      warmDetail.bermNorm,
      warmDetail.roadMap,
      warmDetail.roadNorm
    ];

    cachedBiomeWarmMat = buildUnifiedBiomeTerrainMaterial(
      'arctic',
      cachedBiomeWarmSplat,
      cachedBiomeWarmMarks,
      warmDetail
    );
    cachedBiomeWarmGeo = new THREE.PlaneGeometry(1, 1);
    cachedBiomeWarmMesh = new THREE.Mesh(cachedBiomeWarmGeo, cachedBiomeWarmMat);
    cachedBiomeWarmMesh.name = 'BiomeTerrainWarmMesh';
  }
  return cachedBiomeWarmMesh;
}
