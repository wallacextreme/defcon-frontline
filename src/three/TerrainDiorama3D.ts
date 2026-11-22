import * as THREE from 'three';
import {
  GRID_COLS,
  GRID_ROWS,
  TILE_SIZE,
  CELL
} from '../systems/Pathfinder.js';
import { PALETTE } from './MilitaryModels3D.ts';
import { createPBRMaterial } from './ProceduralPBRTextures.ts';
import {
  applyVerticalAOToGeometry,
  createSeededRng,
  getChamferedCylinderGeo,
  getRoundedBoxGeo,
  hashSeed,
  mergeStaticGeometries
} from './MilitaryGeometryKit.ts';
import {
  computeTerrainMicroReliefY,
  createDesertRoadMarksTexture,
  createDesertSplatTexture,
  createDesertTerrainMaterial
} from './TerrainSplatting3D.ts';

export const CELL_WORLD = 4.0;
export const WORLD_SCALE = CELL_WORLD / TILE_SIZE; // 4 / 64 = 0.0625
export const BOARD_W = GRID_COLS * CELL_WORLD; // 112
export const BOARD_D = GRID_ROWS * CELL_WORLD; // 64

export type WorldBiome = 'desert' | 'arctic' | 'industrial' | 'forest' | 'canyon' | 'swamp' | 'volcanic';

export interface StageTerrainFeatures {
  iceCells?: Array<[number, number]>;
  fogCells?: Array<[number, number]>;
  toxicCells?: Array<[number, number]>;
  lavaCells?: Array<[number, number]>;
  restrictedCells?: Array<[number, number]>;
}

export interface GridPoint {
  col: number;
  row: number;
  id?: string;
}

export function simToWorldX(simX: number): number {
  return simX * WORLD_SCALE - BOARD_W * 0.5;
}

export function simToWorldZ(simY: number): number {
  return simY * WORLD_SCALE - BOARD_D * 0.5;
}

export function cellToWorldCenter(col: number, row: number): { x: number; z: number } {
  return {
    x: (col + 0.5) * CELL_WORLD - BOARD_W * 0.5,
    z: (row + 0.5) * CELL_WORLD - BOARD_D * 0.5
  };
}

export function worldToSimX(wx: number): number {
  return (wx + BOARD_W * 0.5) / WORLD_SCALE;
}

export function worldToSimY(wz: number): number {
  return (wz + BOARD_D * 0.5) / WORLD_SCALE;
}

export function worldToCell(wx: number, wz: number): { col: number; row: number } {
  return {
    col: Math.floor((wx + BOARD_W * 0.5) / CELL_WORLD),
    row: Math.floor((wz + BOARD_D * 0.5) / CELL_WORLD)
  };
}

export function formatColLabel(col: number): string {
  if (col < 26) return String.fromCharCode(65 + col);
  return 'A' + String.fromCharCode(65 + (col - 26));
}

export interface DioramaHandles {
  group: THREE.Group;
  groundPlane: THREE.Mesh;
  update: (elapsed: number, dt: number) => void;
  dispose: () => void;
}

interface BiomeTheme {
  gradColors: [string, string, string];
  patchA: string;
  patchB: string;
  speckA: string;
  speckB: string;
  shoulderColor: string;
  roadColor: string;
  laneColor: string;
  plinthColor: number;
  rockPrimary: number;
  rockSecondary: number;
  foliageA: number;
  foliageB: number;
  scrub: number;
  trimColor: number;
}

const BIOME_THEMES: Record<WorldBiome, BiomeTheme> = {
  desert: {
    gradColors: ['#9d8356', '#ab8e5d', '#866e47'],
    patchA: 'rgba(196, 165, 108, 0.22)',
    patchB: 'rgba(116, 94, 58, 0.18)',
    speckA: 'rgba(232, 206, 152, 0.16)',
    speckB: 'rgba(54, 42, 24, 0.18)',
    shoulderColor: '#7a6849',
    roadColor: '#3a3d42',
    laneColor: 'rgba(234, 179, 8, 0.48)',
    plinthColor: 0x5c4a32,
    rockPrimary: 0xb68d5e,
    rockSecondary: 0x8f6b43,
    foliageA: 0x5d6e35,
    foliageB: 0x6f7f40,
    scrub: 0x837b46,
    trimColor: 0xf59e0b
  },
  arctic: {
    gradColors: ['#cbd5e1', '#dce7f3', '#b8cae0'],
    patchA: 'rgba(248, 250, 252, 0.36)',
    patchB: 'rgba(125, 165, 205, 0.24)',
    speckA: 'rgba(255, 255, 255, 0.26)',
    speckB: 'rgba(71, 104, 138, 0.18)',
    shoulderColor: '#7b92a8',
    roadColor: '#334155',
    laneColor: 'rgba(125, 211, 252, 0.55)',
    plinthColor: 0x2e4359,
    rockPrimary: 0x64748b,
    rockSecondary: 0x94a3b8,
    foliageA: 0x264638,
    foliageB: 0xe2e8f0,
    scrub: 0xcbd5e1,
    trimColor: 0x38bdf8
  },
  industrial: {
    gradColors: ['#434952', '#4c535d', '#373c44'],
    patchA: 'rgba(82, 88, 98, 0.24)',
    patchB: 'rgba(24, 28, 34, 0.26)',
    speckA: 'rgba(180, 188, 198, 0.12)',
    speckB: 'rgba(15, 18, 22, 0.24)',
    shoulderColor: '#575e68',
    roadColor: '#1f242b',
    laneColor: 'rgba(249, 115, 22, 0.5)',
    plinthColor: 0x22272e,
    rockPrimary: 0x6b7280,
    rockSecondary: 0x4b5563,
    foliageA: 0x3f4f3c,
    foliageB: 0x52525b,
    scrub: 0x78350f,
    trimColor: 0xf97316
  },
  forest: {
    gradColors: ['#3f5e36', '#4c703f', '#314c2a'],
    patchA: 'rgba(104, 152, 74, 0.22)',
    patchB: 'rgba(34, 58, 28, 0.22)',
    speckA: 'rgba(163, 206, 116, 0.15)',
    speckB: 'rgba(22, 38, 18, 0.2)',
    shoulderColor: '#695c44',
    roadColor: '#544634',
    laneColor: 'rgba(217, 179, 108, 0.48)',
    plinthColor: 0x2d3b26,
    rockPrimary: 0x6b7280,
    rockSecondary: 0x4b5563,
    foliageA: 0x2f6b2e,
    foliageB: 0x4d8b3e,
    scrub: 0x65a30d,
    trimColor: 0x4ade80
  },
  canyon: {
    gradColors: ['#8c4b2f', '#a15a39', '#6e3722'],
    patchA: 'rgba(194, 112, 68, 0.22)',
    patchB: 'rgba(72, 34, 22, 0.24)',
    speckA: 'rgba(228, 166, 118, 0.16)',
    speckB: 'rgba(42, 18, 12, 0.22)',
    shoulderColor: '#5c4b43',
    roadColor: '#2d3138',
    laneColor: 'rgba(251, 146, 60, 0.52)',
    plinthColor: 0x4b291d,
    rockPrimary: 0x9a4d32,
    rockSecondary: 0x6b3222,
    foliageA: 0x6b5c34,
    foliageB: 0x7c6a3c,
    scrub: 0x854d0e,
    trimColor: 0xf97316
  },
  swamp: {
    gradColors: ['#293d31', '#324a3b', '#1e2e24'],
    patchA: 'rgba(65, 108, 72, 0.24)',
    patchB: 'rgba(18, 30, 22, 0.3)',
    speckA: 'rgba(132, 182, 118, 0.14)',
    speckB: 'rgba(12, 20, 14, 0.26)',
    shoulderColor: '#3f4a3d',
    roadColor: '#2d352e',
    laneColor: 'rgba(163, 230, 53, 0.45)',
    plinthColor: 0x1a261f,
    rockPrimary: 0x4b584d,
    rockSecondary: 0x354037,
    foliageA: 0x264b33,
    foliageB: 0x4b7740,
    scrub: 0x65a30d,
    trimColor: 0xa3e635
  },
  volcanic: {
    gradColors: ['#2a1d1c', '#362220', '#1c1212'],
    patchA: 'rgba(185, 58, 24, 0.18)',
    patchB: 'rgba(12, 8, 8, 0.34)',
    speckA: 'rgba(249, 115, 22, 0.16)',
    speckB: 'rgba(10, 6, 6, 0.3)',
    shoulderColor: '#4a2b24',
    roadColor: '#1d1b1e',
    laneColor: 'rgba(239, 68, 68, 0.58)',
    plinthColor: 0x281310,
    rockPrimary: 0x373032,
    rockSecondary: 0x1f191a,
    foliageA: 0x7f1d1d,
    foliageB: 0x991b1b,
    scrub: 0xea580c,
    trimColor: 0xef4444
  }
};

function createHeadlessTextureFallback(r: number, g: number, b: number, isSrgb = false): THREE.DataTexture {
  const tex = new THREE.DataTexture(new Uint8Array([r, g, b, 255]), 1, 1, THREE.RGBAFormat);
  if (isSrgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createTerrainTextures(
  baseTerrain: Uint8Array[],
  biome: WorldBiome
): {
  map: THREE.Texture;
  roughnessMap: THREE.Texture;
  bumpMap: THREE.Texture;
} {
  if (typeof document === 'undefined') {
    return {
      map: createHeadlessTextureFallback(128, 128, 128, true),
      roughnessMap: createHeadlessTextureFallback(220, 220, 220, false),
      bumpMap: createHeadlessTextureFallback(128, 128, 128, false)
    };
  }

  const theme = BIOME_THEMES[biome];
  const w = 2240;
  const h = 1280;
  const tileW = w / GRID_COLS;
  const tileH = h / GRID_ROWS;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = w;
  roughCanvas.height = h;
  const rctx = roughCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const bctx = bumpCanvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, theme.gradColors[0]);
  grad.addColorStop(0.5, theme.gradColors[1]);
  grad.addColorStop(1, theme.gradColors[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  rctx.fillStyle = biome === 'arctic' ? '#b0b0b0' : '#dcdcdc';
  rctx.fillRect(0, 0, w, h);

  bctx.fillStyle = '#7c7c7c';
  bctx.fillRect(0, 0, w, h);

  let seed = biome === 'desert' ? 1337 : biome === 'arctic' ? 4242 : 7890;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 520; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const rad = 18 + rand() * 88;
    const isA = rand() > 0.45;
    ctx.fillStyle = isA ? theme.patchA : theme.patchB;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();

    bctx.fillStyle = isA ? 'rgba(152, 152, 152, 0.14)' : 'rgba(96, 96, 96, 0.14)';
    bctx.beginPath();
    bctx.arc(x, y, rad * 0.72, 0, Math.PI * 2);
    bctx.fill();
  }

  // Biome-specific surface features (non-desert biomes preserved intact until Phase 4)
  if (biome === 'arctic') {
    ctx.strokeStyle = 'rgba(90, 145, 195, 0.38)';
    ctx.lineWidth = 2;
    bctx.strokeStyle = '#383838';
    bctx.lineWidth = 3;
    for (let i = 0; i < 42; i++) {
      let cx = rand() * w;
      let cy = rand() * h;
      ctx.beginPath();
      bctx.beginPath();
      ctx.moveTo(cx, cy);
      bctx.moveTo(cx, cy);
      for (let seg = 0; seg < 6; seg++) {
        cx += (rand() - 0.5) * 90;
        cy += (rand() - 0.5) * 90;
        ctx.lineTo(cx, cy);
        bctx.lineTo(cx, cy);
      }
      ctx.stroke();
      bctx.stroke();
    }
  } else if (biome === 'industrial') {
    ctx.strokeStyle = 'rgba(20, 24, 30, 0.34)';
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += tileW * 2) {
      ctx.strokeRect(x, 0, tileW * 2, h);
    }
    for (const ry of [tileH * 0.45, h - tileH * 0.45]) {
      ctx.fillStyle = 'rgba(30, 26, 22, 0.55)';
      for (let x = 12; x < w; x += 22) {
        ctx.fillRect(x, ry - 12, 8, 24);
      }
      ctx.strokeStyle = '#7c8591';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, ry - 7);
      ctx.lineTo(w, ry - 7);
      ctx.moveTo(0, ry + 7);
      ctx.lineTo(w, ry + 7);
      ctx.stroke();
    }
  } else if (biome === 'forest') {
    ctx.strokeStyle = 'rgba(134, 239, 172, 0.08)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 65; i++) {
      const gx = rand() * w;
      const gy = rand() * h;
      ctx.beginPath();
      ctx.ellipse(gx, gy, 35 + rand() * 55, 18 + rand() * 35, rand() * Math.PI, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (biome === 'canyon') {
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.14)';
    ctx.lineWidth = 2.5;
    for (let y = 30; y < h; y += 54) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 64) {
        const wy = y + Math.cos(x * 0.01 + y * 0.02) * 10;
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }
  } else if (biome === 'swamp') {
    for (let i = 0; i < 38; i++) {
      const mx = rand() * w;
      const my = rand() * h;
      const rad = 28 + rand() * 64;
      ctx.fillStyle = 'rgba(20, 48, 36, 0.32)';
      ctx.beginPath();
      ctx.arc(mx, my, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (biome === 'volcanic') {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.38)';
    ctx.lineWidth = 2.2;
    for (let i = 0; i < 36; i++) {
      let lx = rand() * w;
      let ly = rand() * h;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      for (let seg = 0; seg < 5; seg++) {
        lx += (rand() - 0.5) * 95;
        ly += (rand() - 0.5) * 95;
        ctx.lineTo(lx, ly);
      }
      ctx.stroke();
    }
  }

  for (let i = 0; i < 9500; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const sz = 1 + rand() * 3.4;
    const light = rand() > 0.5;
    ctx.fillStyle = light ? theme.speckA : theme.speckB;
    ctx.fillRect(x, y, sz, sz);
    bctx.fillStyle = light ? 'rgba(210, 210, 210, 0.2)' : 'rgba(65, 65, 65, 0.22)';
    bctx.fillRect(x, y, sz, sz);
  }

  ctx.strokeStyle = biome === 'arctic' ? 'rgba(51, 65, 85, 0.14)' : 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  bctx.strokeStyle = 'rgba(40, 40, 40, 0.14)';
  bctx.lineWidth = 1.5;
  for (let c = 0; c <= GRID_COLS; c++) {
    const x = c * tileW;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    bctx.beginPath();
    bctx.moveTo(x, 0);
    bctx.lineTo(x, h);
    bctx.stroke();
  }
  for (let r = 0; r <= GRID_ROWS; r++) {
    const y = r * tileH;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    bctx.beginPath();
    bctx.moveTo(0, y);
    bctx.lineTo(w, y);
    bctx.stroke();
  }

  const isRoadLike = (c: number, r: number) => {
    if (c < 0 || c >= GRID_COLS || r < 0 || r >= GRID_ROWS) return false;
    const t = baseTerrain[r][c];
    return t === CELL.ROAD || t === CELL.SPAWN || t === CELL.FOB;
  };

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (!isRoadLike(c, r)) continue;
      const cx = (c + 0.5) * tileW;
      const cy = (r + 0.5) * tileH;
      const armW = tileW * 0.72;
      ctx.fillStyle = theme.shoulderColor;
      ctx.beginPath();
      ctx.arc(cx, cy, armW * 0.5, 0, Math.PI * 2);
      ctx.fill();
      if (isRoadLike(c + 1, r)) ctx.fillRect(cx, cy - armW * 0.5, tileW, armW);
      if (isRoadLike(c, r + 1)) ctx.fillRect(cx - armW * 0.5, cy, armW, tileH);

      bctx.fillStyle = '#989898';
      bctx.beginPath();
      bctx.arc(cx, cy, armW * 0.5, 0, Math.PI * 2);
      bctx.fill();
      if (isRoadLike(c + 1, r)) bctx.fillRect(cx, cy - armW * 0.5, tileW, armW);
      if (isRoadLike(c, r + 1)) bctx.fillRect(cx - armW * 0.5, cy, armW, tileH);
    }
  }

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (!isRoadLike(c, r)) continue;
      const cx = (c + 0.5) * tileW;
      const cy = (r + 0.5) * tileH;
      const roadW = tileW * 0.56;

      ctx.fillStyle = theme.roadColor;
      ctx.beginPath();
      ctx.arc(cx, cy, roadW * 0.5, 0, Math.PI * 2);
      ctx.fill();
      if (isRoadLike(c + 1, r)) ctx.fillRect(cx, cy - roadW * 0.5, tileW, roadW);
      if (isRoadLike(c, r + 1)) ctx.fillRect(cx - roadW * 0.5, cy, roadW, tileH);

      bctx.fillStyle = '#828282';
      bctx.beginPath();
      bctx.arc(cx, cy, roadW * 0.5, 0, Math.PI * 2);
      bctx.fill();
      if (isRoadLike(c + 1, r)) bctx.fillRect(cx, cy - roadW * 0.5, tileW, roadW);
      if (isRoadLike(c, r + 1)) bctx.fillRect(cx - roadW * 0.5, cy, roadW, tileH);

      rctx.fillStyle = '#949494';
      rctx.beginPath();
      rctx.arc(cx, cy, roadW * 0.5, 0, Math.PI * 2);
      rctx.fill();
      if (isRoadLike(c + 1, r)) rctx.fillRect(cx, cy - roadW * 0.5, tileW, roadW);
      if (isRoadLike(c, r + 1)) rctx.fillRect(cx - roadW * 0.5, cy, roadW, tileH);

      const trackOff = tileW * 0.13;
      if (isRoadLike(c + 1, r)) {
        ctx.strokeStyle = 'rgba(20, 22, 25, 0.35)';
        ctx.lineWidth = 6;
        for (const off of [-trackOff, trackOff]) {
          ctx.beginPath();
          ctx.moveTo(cx, cy + off);
          ctx.lineTo(cx + tileW, cy + off);
          ctx.stroke();
        }
        ctx.strokeStyle = theme.laneColor;
        ctx.lineWidth = 2.2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + tileW, cy);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (isRoadLike(c, r + 1)) {
        ctx.strokeStyle = 'rgba(20, 22, 25, 0.35)';
        ctx.lineWidth = 6;
        for (const off of [-trackOff, trackOff]) {
          ctx.beginPath();
          ctx.moveTo(cx + off, cy);
          ctx.lineTo(cx + off, cy + tileH);
          ctx.stroke();
        }
        ctx.strokeStyle = theme.laneColor;
        ctx.lineWidth = 2.2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy + tileH);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  for (let i = 0; i < 3600; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const light = rand() > 0.5;
    ctx.fillStyle = light ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.08)';
    ctx.fillRect(x, y, 2, 2);
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.anisotropy = 4;
  return { map, roughnessMap, bumpMap };
}

function createRulerLabelTexture(labels: string[], horizontal: boolean): THREE.Texture {
  if (typeof document === 'undefined') {
    return createHeadlessTextureFallback(20, 28, 36, true);
  }

  const count = labels.length;
  const cw = horizontal ? count * 64 : 64;
  const ch = horizontal ? 48 : count * 64;
  const c = document.createElement('canvas');
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#141c24';
  ctx.fillRect(0, 0, cw, ch);

  ctx.fillStyle = '#7dd3fc';
  ctx.font = 'bold 22px Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < count; i++) {
    if (horizontal) {
      ctx.fillText(labels[i], (i + 0.5) * 64, 24);
    } else {
      ctx.fillText(labels[i], 32, (i + 0.5) * 64);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const _tmpMatrix = new THREE.Matrix4();
const _tmpQuat = new THREE.Quaternion();
const _tmpEuler = new THREE.Euler();
const _tmpPos = new THREE.Vector3();
const _tmpScale = new THREE.Vector3();

function cloneTransformed(
  source: THREE.BufferGeometry,
  px: number,
  py: number,
  pz: number,
  rx = 0,
  ry = 0,
  rz = 0,
  sx = 1,
  sy = 1,
  sz = 1
): THREE.BufferGeometry {
  const g = source.clone();
  _tmpEuler.set(rx, ry, rz);
  _tmpQuat.setFromEuler(_tmpEuler);
  _tmpPos.set(px, py, pz);
  _tmpScale.set(sx, sy, sz);
  _tmpMatrix.compose(_tmpPos, _tmpQuat, _tmpScale);
  g.applyMatrix4(_tmpMatrix);
  return g;
}

function perturbRadialGeometry(
  geo: THREE.BufferGeometry,
  seed: number,
  radialAmp: number,
  yOffset = 0,
  pinBottom = true
): THREE.BufferGeometry {
  const out = geo.index ? geo.toNonIndexed() : geo.clone();
  const pos = out.getAttribute('position');
  if (!out.boundingBox) out.computeBoundingBox();
  const minY = out.boundingBox ? out.boundingBox.min.y : 0;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    if (r > 1e-4) {
      const ang = Math.atan2(z, x);
      const warp =
        1.0 +
        radialAmp *
          (0.55 * Math.cos(ang * 3.0 + seed * 0.7) +
            0.30 * Math.sin(ang * 5.0 - seed * 1.3) +
            0.15 * Math.cos(ang * 2.0 + y * 2.2 + seed));
      const vertMod = pinBottom && y <= minY + 0.04 ? 0.96 + 0.04 * warp : warp;
      pos.setX(i, x * vertMod);
      pos.setZ(i, z * vertMod);
    }
    pos.setY(i, y + yOffset);
  }
  pos.needsUpdate = true;
  out.computeVertexNormals();
  return out;
}

/**
 * Builds 3 visually distinct asymmetric stratified sandstone mesa variants:
 * - 0: Broad double-stepped wide plateau
 * - 1: Wind-sculpted asymmetric hoodoo peak
 * - 2: Elongated stratified ridge block crest
 */
function buildDesertMesaVariant(variant: 0 | 1 | 2): THREE.BufferGeometry {
  interface MesaTierSpec {
    rTop: number;
    rBot: number;
    h: number;
    yBase: number;
    ox: number;
    oz: number;
    segs: number;
    seed: number;
    amp: number;
    sx: number;
    sz: number;
  }

  let tiers: MesaTierSpec[];
  let maxH: number;

  if (variant === 0) {
    // Variant 0: Broad double-stepped wide plateau
    tiers = [
      { rTop: 1.44, rBot: 1.64, h: 0.44, yBase: 0.0, ox: 0.0, oz: 0.0, segs: 8, seed: 1.2, amp: 0.15, sx: 1.06, sz: 0.94 },
      { rTop: 1.18, rBot: 1.38, h: 0.44, yBase: 0.38, ox: -0.06, oz: 0.04, segs: 8, seed: 2.8, amp: 0.16, sx: 1.04, sz: 0.96 },
      { rTop: 0.72, rBot: 0.92, h: 0.34, yBase: 0.76, ox: 0.12, oz: -0.08, segs: 7, seed: 4.4, amp: 0.14, sx: 0.95, sz: 1.05 }
    ];
    maxH = 1.10;
  } else if (variant === 1) {
    // Variant 1: Wind-sculpted asymmetric hoodoo peak
    tiers = [
      { rTop: 1.26, rBot: 1.48, h: 0.40, yBase: 0.0, ox: 0.0, oz: 0.0, segs: 7, seed: 7.1, amp: 0.18, sx: 0.96, sz: 1.02 },
      { rTop: 0.92, rBot: 1.14, h: 0.48, yBase: 0.34, ox: 0.10, oz: -0.06, segs: 7, seed: 9.4, amp: 0.20, sx: 0.92, sz: 0.96 },
      { rTop: 0.62, rBot: 0.84, h: 0.46, yBase: 0.76, ox: 0.18, oz: -0.10, segs: 6, seed: 11.3, amp: 0.19, sx: 0.88, sz: 0.92 },
      { rTop: 0.32, rBot: 0.54, h: 0.44, yBase: 1.16, ox: 0.24, oz: -0.12, segs: 6, seed: 13.7, amp: 0.16, sx: 0.85, sz: 0.90 }
    ];
    maxH = 1.60;
  } else {
    // Variant 2: Elongated stratified ridge block crest
    tiers = [
      { rTop: 1.28, rBot: 1.46, h: 0.42, yBase: 0.0, ox: 0.0, oz: 0.0, segs: 8, seed: 15.2, amp: 0.14, sx: 1.24, sz: 0.78 },
      { rTop: 1.04, rBot: 1.20, h: 0.44, yBase: 0.36, ox: -0.10, oz: 0.03, segs: 7, seed: 17.5, amp: 0.15, sx: 1.28, sz: 0.74 },
      { rTop: 0.74, rBot: 0.94, h: 0.42, yBase: 0.74, ox: -0.18, oz: 0.05, segs: 6, seed: 19.9, amp: 0.15, sx: 1.32, sz: 0.68 },
      { rTop: 0.46, rBot: 0.62, h: 0.28, yBase: 1.10, ox: -0.22, oz: 0.04, segs: 6, seed: 21.6, amp: 0.13, sx: 1.30, sz: 0.65 }
    ];
    maxH = 1.38;
  }

  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    const base = getChamferedCylinderGeo(t.rTop, t.rBot, t.h, t.segs, Math.min(0.06, t.h * 0.18));
    const sculpted = perturbRadialGeometry(base, t.seed, t.amp, 0, i === 0);
    applyVerticalAOToGeometry(sculpted, -t.h * 0.5, t.h * 0.5, i === 0 ? 0.52 : 0.68);
    const positioned = cloneTransformed(sculpted, t.ox, t.yBase + t.h * 0.5, t.oz, 0, i * 0.38 + variant * 0.55, 0, t.sx, 1, t.sz);
    sculpted.dispose();
    parts.push(positioned);
  }

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: true, disposeInputs: true });
  applyVerticalAOToGeometry(merged, 0.0, maxH, 0.55);
  return merged;
}

/**
 * Builds an angular fractured desert talus boulder geometry with base AO.
 */
function buildDesertTalusGeometry(): THREE.BufferGeometry {
  const base = getChamferedCylinderGeo(0.36, 0.56, 0.52, 6, 0.075);
  const sculpted = perturbRadialGeometry(base, 8.3, 0.22, 0.26, true);
  const tilted = cloneTransformed(sculpted, 0, 0, 0, 0.08, 0, -0.06);
  sculpted.dispose();
  applyVerticalAOToGeometry(tilted, 0.0, 0.52, 0.48);
  return tilted;
}

/**
 * Builds a low, wide gravel/talus collar apron anchoring rock formations into the ground.
 */
function buildDesertGravelSkirtGeometry(): THREE.BufferGeometry {
  const base = getChamferedCylinderGeo(1.06, 2.04, 0.24, 10, 0.06);
  const sculpted = perturbRadialGeometry(base, 3.7, 0.14, 0.0, false);
  applyVerticalAOToGeometry(sculpted, -0.12, 0.12, 0.42);
  return sculpted;
}

/**
 * Builds a splayed organic dry desert scrub tuft (no spherical blobs).
 */
function buildDesertScrubGeometry(): THREE.BufferGeometry {
  const rng = createSeededRng(hashSeed('desert_scrub_geo'));
  const parts: THREE.BufferGeometry[] = [];
  const twigBase = new THREE.ConeGeometry(0.14, 0.46, 5);

  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2 + rng.range(-0.22, 0.22);
    const tilt = rng.range(0.32, 0.62);
    const hScale = rng.range(0.72, 1.18);
    const rScale = rng.range(0.85, 1.25);
    const dist = rng.range(0.06, 0.14);
    const frond = cloneTransformed(
      twigBase,
      Math.cos(ang) * dist,
      0.16 * hScale,
      Math.sin(ang) * dist,
      Math.sin(ang) * tilt,
      ang,
      -Math.cos(ang) * tilt,
      rScale,
      hScale,
      rScale
    );
    parts.push(frond);
  }
  twigBase.dispose();

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: false, disposeInputs: true });
  applyVerticalAOToGeometry(merged, 0.0, 0.42, 0.42);
  return merged;
}

export function createBattlefieldDiorama3D(
  baseTerrain: Uint8Array[],
  biome: WorldBiome = 'desert',
  spawnPoints: GridPoint[] = [{ col: 0, row: 3, id: 'ALPHA' }, { col: 0, row: 12, id: 'BRAVO' }],
  fobPoint: GridPoint = { col: 27, row: 7 },
  stageFeatures: StageTerrainFeatures = {}
): DioramaHandles {
  const group = new THREE.Group();
  const theme = BIOME_THEMES[biome] || BIOME_THEMES.desert;
  const disposableTextures: THREE.Texture[] = [];
  const disposableGeos: THREE.BufferGeometry[] = [];
  const disposableMats: THREE.Material[] = [];
  const disposableInstances: THREE.InstancedMesh[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    disposableGeos.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    disposableMats.push(m);
    return m;
  };
  const trackInst = <T extends THREE.InstancedMesh>(inst: T): T => {
    disposableInstances.push(inst);
    return inst;
  };

  // 1. Main Battlefield Ground Surface (28x16 = 112x64 world units)
  let groundPlane: THREE.Mesh;

  if (biome === 'desert') {
    const splatTex = createDesertSplatTexture(baseTerrain, spawnPoints, fobPoint);
    const roadMarksTex = createDesertRoadMarksTexture(baseTerrain);
    disposableTextures.push(splatTex, roadMarksTex);

    const visualGeo = trackGeo(new THREE.PlaneGeometry(BOARD_W, BOARD_D, 56, 32));
    visualGeo.rotateX(-Math.PI / 2);
    const posAttr = visualGeo.getAttribute('position');
    for (let i = 0; i < posAttr.count; i++) {
      const wx = posAttr.getX(i);
      const wz = posAttr.getZ(i);
      const wy = computeTerrainMicroReliefY(wx, wz, baseTerrain, biome);
      posAttr.setY(i, wy);
    }
    posAttr.needsUpdate = true;
    visualGeo.computeVertexNormals();
    visualGeo.computeBoundingBox();
    visualGeo.computeBoundingSphere();

    const visualMat = trackMat(createDesertTerrainMaterial(splatTex, roadMarksTex));
    const visualTerrainMesh = new THREE.Mesh(visualGeo, visualMat);
    visualTerrainMesh.name = 'DesertVisualTerrain';
    visualTerrainMesh.receiveShadow = true;
    visualTerrainMesh.castShadow = false;
    group.add(visualTerrainMesh);

    // Flat invisible raycast proxy at y = 0 (Three.js r187 Raycaster intersects visible=false meshes with material)
    const proxyGeo = trackGeo(new THREE.PlaneGeometry(BOARD_W, BOARD_D));
    const proxyMat = trackMat(new THREE.MeshBasicMaterial());
    groundPlane = new THREE.Mesh(proxyGeo, proxyMat);
    groundPlane.name = 'DesertRaycastGroundProxy';
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = 0;
    groundPlane.visible = false;
    groundPlane.castShadow = false;
    groundPlane.receiveShadow = false;
    group.add(groundPlane);
  } else {
    const { map, roughnessMap, bumpMap } = createTerrainTextures(baseTerrain, biome);
    disposableTextures.push(map, roughnessMap, bumpMap);

    const groundGeo = trackGeo(new THREE.PlaneGeometry(BOARD_W, BOARD_D));
    const groundMat = trackMat(
      new THREE.MeshStandardMaterial({
        map,
        roughnessMap,
        bumpMap,
        bumpScale: 0.05,
        roughness: biome === 'arctic' ? 0.65 : 0.92,
        metalness: 0.04,
        envMapIntensity: biome === 'arctic' ? 0.95 : 0.75
      })
    );
    groundPlane = new THREE.Mesh(groundGeo, groundMat);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.receiveShadow = true;
    group.add(groundPlane);
  }

  // 2. C4ISR Plinth Base with Chamfered Metallic Perimeter Reinforcement
  const earthSlab = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(BOARD_W + 2.8, 2.2, BOARD_D + 2.8)),
    trackMat(new THREE.MeshStandardMaterial({ color: theme.plinthColor, roughness: 0.94, metalness: 0.04 }))
  );
  earthSlab.position.set(0, -1.11, 0);
  earthSlab.receiveShadow = true;
  group.add(earthSlab);

  const steelPlinth = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(BOARD_W + 4.6, 2.0, BOARD_D + 4.6)),
    trackMat(
      createPBRMaterial('diamondSteelPlate', {
        color: 0x4b5c6e,
        roughness: 0.5,
        metalness: 0.72,
        bumpScale: 0.04,
        repeat: [22, 13]
      })
    )
  );
  steelPlinth.position.set(0, -2.6, 0);
  group.add(steelPlinth);

  const tableFloor = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(460, 460)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x0b1118, roughness: 0.92, metalness: 0.15 }))
  );
  tableFloor.rotation.x = -Math.PI / 2;
  tableFloor.position.y = -3.62;
  tableFloor.receiveShadow = true;
  group.add(tableFloor);

  const trimGeo = trackGeo(new THREE.EdgesGeometry(new THREE.BoxGeometry(BOARD_W + 2.85, 0.14, BOARD_D + 2.85)));
  const trim = new THREE.LineSegments(
    trimGeo,
    trackMat(new THREE.LineBasicMaterial({ color: theme.trimColor, transparent: true, opacity: 0.5 }))
  );
  trim.position.set(0, 0.03, 0);
  group.add(trim);

  // Coordinate ruler strips (A..AB along North, 01..16 along West)
  const colLabels = Array.from({ length: GRID_COLS }, (_, i) => formatColLabel(i));
  const northTex = createRulerLabelTexture(colLabels, true);
  disposableTextures.push(northTex);
  const northStrip = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(BOARD_W, 1.15)),
    trackMat(new THREE.MeshBasicMaterial({ map: northTex }))
  );
  northStrip.rotation.x = -Math.PI / 2;
  northStrip.position.set(0, 0.05, -BOARD_D * 0.5 - 0.72);
  group.add(northStrip);

  const rowLabels = Array.from({ length: GRID_ROWS }, (_, i) => String(i + 1).padStart(2, '0'));
  const westTex = createRulerLabelTexture(rowLabels, false);
  disposableTextures.push(westTex);
  const westStrip = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(1.15, BOARD_D)),
    trackMat(new THREE.MeshBasicMaterial({ map: westTex }))
  );
  westStrip.rotation.x = -Math.PI / 2;
  westStrip.position.set(-BOARD_W * 0.5 - 0.72, 0.05, 0);
  group.add(westStrip);

  // Shared Diorama Prop Materials (dielectrics calibrated to metalness <= 0.05)
  const concreteMat = trackMat(
    createPBRMaterial('concreteBunker', { color: 0xd0d4da, roughness: 0.88, metalness: 0.02, bumpScale: 0.05, repeat: [1.5, 1.5] })
  );
  const darkConcreteMat = trackMat(
    createPBRMaterial('concreteBunker', { color: 0x8b9098, roughness: 0.88, metalness: 0.02, bumpScale: 0.05, repeat: [1.5, 1.5] })
  );
  const diamondMat = trackMat(
    createPBRMaterial('diamondSteelPlate', { roughness: 0.44, metalness: 0.78, bumpScale: 0.05, repeat: [2, 2] })
  );
  const oliveMat = trackMat(
    createPBRMaterial('natoArmorPlate', { color: 0xd0d8ba, roughness: 0.72, metalness: 0.04, bumpScale: 0.035 })
  );
  const sandbagMat = trackMat(
    createPBRMaterial('sandbagBurlap', { roughness: 0.94, metalness: 0.0, bumpScale: 0.08 })
  );
  const steelMat = trackMat(
    new THREE.MeshStandardMaterial({ color: PALETTE.steel, roughness: 0.36, metalness: 0.82, envMapIntensity: 1.25 })
  );
  const plinthChassisMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x3b4450, roughness: 0.44, metalness: 0.76, envMapIntensity: 1.05 })
  );
  const hazardRedMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.55, metalness: 0.04 }));
  const cyanGlowMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.45
    })
  );
  const warmLampMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 1.6
    })
  );

  // Beveled C4ISR armored bezel framing the outer perimeter of earthSlab (outside A..AB and 01..16 strips)
  const railLong = getRoundedBoxGeo(BOARD_W + 3.4, 0.24, 0.34, 0.05, 2);
  const railShort = getRoundedBoxGeo(0.34, 0.24, BOARD_D + 3.4, 0.05, 2);
  const cornerBracket = getRoundedBoxGeo(0.88, 0.32, 0.88, 0.07, 2);
  const plinthFrameParts: THREE.BufferGeometry[] = [
    cloneTransformed(railLong, 0, -0.02, -BOARD_D * 0.5 - 1.56),
    cloneTransformed(railLong, 0, -0.02, BOARD_D * 0.5 + 1.56),
    cloneTransformed(railShort, -BOARD_W * 0.5 - 1.56, -0.02, 0),
    cloneTransformed(railShort, BOARD_W * 0.5 + 1.56, -0.02, 0),
    cloneTransformed(cornerBracket, -BOARD_W * 0.5 - 1.54, 0.01, -BOARD_D * 0.5 - 1.54),
    cloneTransformed(cornerBracket, BOARD_W * 0.5 + 1.54, 0.01, -BOARD_D * 0.5 - 1.54),
    cloneTransformed(cornerBracket, -BOARD_W * 0.5 - 1.54, 0.01, BOARD_D * 0.5 + 1.54),
    cloneTransformed(cornerBracket, BOARD_W * 0.5 + 1.54, 0.01, BOARD_D * 0.5 + 1.54)
  ];
  const plinthFrameGeo = trackGeo(mergeStaticGeometries(plinthFrameParts, { disposeInputs: true }));
  const plinthFrameMesh = new THREE.Mesh(plinthFrameGeo, plinthChassisMat);
  plinthFrameMesh.name = 'C4ISRPlinthBezel';
  plinthFrameMesh.receiveShadow = true;
  group.add(plinthFrameMesh);

  // Shared non-desert prop geometries & helpers
  const drumGeo = trackGeo(new THREE.CylinderGeometry(0.15, 0.15, 0.42, 12));
  const crateGeo = trackGeo(new THREE.BoxGeometry(0.46, 0.28, 0.32));
  const postGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.05, 1.35, 6));
  const armGeo = trackGeo(new THREE.BoxGeometry(0.05, 0.04, 0.34));
  const lampGeo = trackGeo(new THREE.BoxGeometry(0.14, 0.06, 0.16));

  const addFuelDrum = (parent: THREE.Object3D, x: number, y: number, z: number, hazard = false) => {
    const drum = new THREE.Mesh(drumGeo, hazard ? hazardRedMat : oliveMat);
    drum.position.set(x, y + 0.21, z);
    drum.castShadow = true;
    drum.receiveShadow = true;
    parent.add(drum);
  };

  const addAmmoCrate = (parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => {
    const crate = new THREE.Mesh(crateGeo, oliveMat);
    crate.position.set(x, y + 0.14, z);
    crate.rotation.y = ry;
    crate.castShadow = true;
    crate.receiveShadow = true;
    parent.add(crate);
  };

  const addLightPole = (parent: THREE.Object3D, x: number, z: number, inwardAngle = 0) => {
    const poleGroup = new THREE.Group();
    poleGroup.position.set(x, 0, z);
    poleGroup.rotation.y = inwardAngle;
    const post = new THREE.Mesh(postGeo, steelMat);
    post.position.y = 0.675;
    post.castShadow = true;
    poleGroup.add(post);
    const arm = new THREE.Mesh(armGeo, steelMat);
    arm.position.set(0, 1.34, 0.14);
    poleGroup.add(arm);
    const lamp = new THREE.Mesh(lampGeo, warmLampMat);
    lamp.position.set(0, 1.31, 0.26);
    lamp.userData.noShadow = true;
    poleGroup.add(lamp);
    parent.add(poleGroup);
  };

  // 3. Rock Outcrops / Desert Stratified Mesas (InstancedMesh) / Biome Props
  if (biome === 'desert') {
    const rockCoords: Array<{ c: number; r: number }> = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (baseTerrain[r][c] === CELL.ROCK) rockCoords.push({ c, r });
      }
    }

    if (rockCoords.length > 0) {
      const mesaGeos: [THREE.BufferGeometry, THREE.BufferGeometry, THREE.BufferGeometry] = [
        trackGeo(buildDesertMesaVariant(0)),
        trackGeo(buildDesertMesaVariant(1)),
        trackGeo(buildDesertMesaVariant(2))
      ];
      const talusGeo = trackGeo(buildDesertTalusGeometry());
      const skirtGeo = trackGeo(buildDesertGravelSkirtGeometry());
      const scrubGeo = trackGeo(buildDesertScrubGeometry());

      const desertRockMat = trackMat(
        createPBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.91,
          metalness: 0.02,
          bumpScale: 0.07,
          envMapIntensity: 0.62,
          vertexColors: true,
          flatShading: true
        })
      );
      const desertSkirtMat = trackMat(
        createPBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.95,
          metalness: 0.01,
          bumpScale: 0.05,
          envMapIntensity: 0.55,
          vertexColors: true
        })
      );
      const desertScrubMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.92,
          metalness: 0.0,
          vertexColors: true,
          flatShading: true
        })
      );

      const nRocks = rockCoords.length;
      const talusPerRock = 3;
      const scrubPerRock = 2;

      // Partition rocks across the 3 asymmetric mesa variants, ensuring adjacent pairs differ
      const variantByCell = new Map<string, number>();
      const mesaBuckets: Array<Array<{ matrix: THREE.Matrix4; hex: number }>> = [[], [], []];

      const skirtInst = trackInst(new THREE.InstancedMesh(skirtGeo, desertSkirtMat, nRocks));
      skirtInst.name = 'DesertRockGravelSkirts';
      skirtInst.frustumCulled = false;
      skirtInst.castShadow = false;
      skirtInst.receiveShadow = true;

      const talusInst = trackInst(new THREE.InstancedMesh(talusGeo, desertRockMat, nRocks * talusPerRock));
      talusInst.name = 'DesertTalusBoulders';
      talusInst.frustumCulled = false;
      talusInst.castShadow = true;
      talusInst.receiveShadow = true;

      const scrubInst = trackInst(new THREE.InstancedMesh(scrubGeo, desertScrubMat, nRocks * scrubPerRock));
      scrubInst.name = 'DesertDryScrub';
      scrubInst.frustumCulled = false;
      scrubInst.castShadow = true;
      scrubInst.receiveShadow = true;

      const rockPalette = [0xc2925e, 0xb58553, 0xa87a4a, 0xce9d68];
      const skirtPalette = [0x6f583b, 0x7b6344, 0x645036];
      const scrubPalette = [0x6e6f3d, 0x7e7542, 0x5d6436, 0x8a7d48];
      const instColor = new THREE.Color();
      const dummy = new THREE.Object3D();

      let talusIdx = 0;
      let scrubIdx = 0;

      for (let i = 0; i < nRocks; i++) {
        const { c, r } = rockCoords[i];
        const rng = createSeededRng(hashSeed('desert_rock_cell', c, r));
        const { x, z } = cellToWorldCenter(c, r);
        const mx = x + rng.range(-0.22, 0.22);
        const mz = z + rng.range(-0.22, 0.22);
        const reliefY = computeTerrainMicroReliefY(mx, mz, baseTerrain, biome);

        // Select mesa variant (avoiding twin silhouettes on adjacent CELL.ROCK pairs)
        let variant = hashSeed('mesa_var', c, r) % 3;
        const prevAbove = variantByCell.get(`${c},${r - 1}`);
        const prevLeft = variantByCell.get(`${c - 1},${r}`);
        if (variant === prevAbove || variant === prevLeft) {
          variant = (variant + 1) % 3;
          if (variant === prevAbove || variant === prevLeft) {
            variant = (variant + 1) % 3;
          }
        }
        variantByCell.set(`${c},${r}`, variant);

        // Stratified plateau mesa transform
        dummy.position.set(mx, Math.max(0, reliefY - 0.05), mz);
        dummy.rotation.set(rng.range(-0.04, 0.04), rng.range(0, Math.PI * 2), rng.range(-0.04, 0.04));
        dummy.scale.set(rng.range(0.88, 1.18), rng.range(0.82, 1.24), rng.range(0.86, 1.16));
        dummy.updateMatrix();
        mesaBuckets[variant].push({
          matrix: dummy.matrix.clone(),
          hex: rockPalette[rng.int(0, rockPalette.length - 1)]
        });

        // Dark talus/gravel collar anchoring base cleanly into terrain
        dummy.position.set(mx, Math.max(-0.02, reliefY * 0.45 - 0.03), mz);
        dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
        dummy.scale.set(rng.range(0.98, 1.16), rng.range(0.85, 1.1), rng.range(0.96, 1.14));
        dummy.updateMatrix();
        skirtInst.setMatrixAt(i, dummy.matrix);
        instColor.setHex(skirtPalette[rng.int(0, skirtPalette.length - 1)]);
        skirtInst.setColorAt(i, instColor);

        // Clustered angular talus boulders around mesa perimeter
        for (let b = 0; b < talusPerRock; b++) {
          const ang = (b / talusPerRock) * Math.PI * 2 + rng.range(-0.45, 0.45);
          const rad = rng.range(0.92, 1.42);
          const bx = x + Math.cos(ang) * rad;
          const bz = z + Math.sin(ang) * rad;
          const bRelief = computeTerrainMicroReliefY(bx, bz, baseTerrain, biome);

          dummy.position.set(bx, Math.max(-0.03, bRelief - 0.04), bz);
          dummy.rotation.set(rng.range(-0.12, 0.12), rng.range(0, Math.PI * 2), rng.range(-0.12, 0.12));
          dummy.scale.set(rng.range(0.75, 1.28), rng.range(0.68, 1.18), rng.range(0.75, 1.22));
          dummy.updateMatrix();
          talusInst.setMatrixAt(talusIdx, dummy.matrix);
          instColor.setHex(rockPalette[rng.int(0, rockPalette.length - 1)]);
          talusInst.setColorAt(talusIdx, instColor);
          talusIdx++;
        }

        // Leeward dry desert scrub tufts
        for (let s = 0; s < scrubPerRock; s++) {
          const ang = s * Math.PI + rng.range(-0.65, 0.65) + 0.5;
          const rad = rng.range(1.18, 1.62);
          const sx = x + Math.cos(ang) * rad;
          const sz = z + Math.sin(ang) * rad;
          const sRelief = computeTerrainMicroReliefY(sx, sz, baseTerrain, biome);

          dummy.position.set(sx, Math.max(0, sRelief - 0.02), sz);
          dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
          dummy.scale.setScalar(rng.range(0.85, 1.32));
          dummy.updateMatrix();
          scrubInst.setMatrixAt(scrubIdx, dummy.matrix);
          instColor.setHex(scrubPalette[rng.int(0, scrubPalette.length - 1)]);
          scrubInst.setColorAt(scrubIdx, instColor);
          scrubIdx++;
        }
      }

      for (let v = 0; v < 3; v++) {
        const items = mesaBuckets[v];
        if (items.length === 0) continue;
        const mInst = trackInst(new THREE.InstancedMesh(mesaGeos[v], desertRockMat, items.length));
        mInst.name = `DesertStratifiedMesas_v${v}`;
        mInst.frustumCulled = false;
        mInst.castShadow = true;
        mInst.receiveShadow = true;
        for (let idx = 0; idx < items.length; idx++) {
          mInst.setMatrixAt(idx, items[idx].matrix);
          instColor.setHex(items[idx].hex);
          mInst.setColorAt(idx, instColor);
        }
        mInst.instanceMatrix.needsUpdate = true;
        if (mInst.instanceColor) mInst.instanceColor.needsUpdate = true;
        group.add(mInst);
      }

      skirtInst.instanceMatrix.needsUpdate = true;
      if (skirtInst.instanceColor) skirtInst.instanceColor.needsUpdate = true;
      talusInst.instanceMatrix.needsUpdate = true;
      if (talusInst.instanceColor) talusInst.instanceColor.needsUpdate = true;
      scrubInst.instanceMatrix.needsUpdate = true;
      if (scrubInst.instanceColor) scrubInst.instanceColor.needsUpdate = true;

      group.add(skirtInst, talusInst, scrubInst);
    }
  } else {
    // Non-desert biomes preserved intact until Phase 4
    const rockMat = trackMat(
      createPBRMaterial('concreteBunker', {
        color: theme.rockPrimary,
        roughness: biome === 'arctic' ? 0.55 : 0.9,
        metalness: biome === 'industrial' ? 0.35 : 0.06,
        bumpScale: 0.08,
        flatShading: true
      })
    );
    const rockDarkMat = trackMat(
      createPBRMaterial('concreteBunker', {
        color: theme.rockSecondary,
        roughness: 0.88,
        metalness: biome === 'industrial' ? 0.45 : 0.05,
        bumpScale: 0.08,
        flatShading: true
      })
    );
    const trunkMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x4b3621, roughness: 0.9 }));
    const foliageMat1 = trackMat(new THREE.MeshStandardMaterial({ color: theme.foliageA, roughness: 0.85, flatShading: true }));
    const foliageMat2 = trackMat(new THREE.MeshStandardMaterial({ color: theme.foliageB, roughness: 0.85, flatShading: true }));
    const scrubMat = trackMat(new THREE.MeshStandardMaterial({ color: theme.scrub, roughness: 0.9, flatShading: true }));

    const mainRockGeo = trackGeo(new THREE.DodecahedronGeometry(1.38, 0));
    const subRockGeo = trackGeo(new THREE.DodecahedronGeometry(0.68, 0));
    const trunkGeo = trackGeo(new THREE.CylinderGeometry(0.08, 0.13, 0.72, 6));
    const cone1Geo = trackGeo(new THREE.ConeGeometry(0.58, 0.95, 7));
    const cone2Geo = trackGeo(new THREE.ConeGeometry(0.45, 0.82, 7));
    const cone3Geo = trackGeo(new THREE.ConeGeometry(0.28, 0.62, 6));
    const bushGeo = trackGeo(new THREE.DodecahedronGeometry(0.32, 0));
    const beamGeo = trackGeo(new THREE.BoxGeometry(0.26, 2.2, 0.26));
    const indBlockGeo = trackGeo(new THREE.BoxGeometry(2.5, 1.4, 2.3));
    const indSiloGeo = trackGeo(new THREE.CylinderGeometry(0.75, 0.85, 2.1, 10));

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (baseTerrain[r][c] !== CELL.ROCK) continue;
        const { x, z } = cellToWorldCenter(c, r);
        const outcrop = new THREE.Group();
        outcrop.position.set(x, 0, z);

        if (biome === 'industrial') {
          const block = new THREE.Mesh(indBlockGeo, rockDarkMat);
          block.position.set(0, 0.7, 0);
          block.rotation.y = ((c + r) % 4) * 0.25;
          block.castShadow = true;
          block.receiveShadow = true;
          outcrop.add(block);

          const silo = new THREE.Mesh(indSiloGeo, rockMat);
          silo.position.set(0.4, 1.05, -0.35);
          silo.castShadow = true;
          silo.receiveShadow = true;
          outcrop.add(silo);

          const girder = new THREE.Mesh(beamGeo, scrubMat);
          girder.position.set(-0.75, 1.1, 0.6);
          girder.rotation.set(0.28, 0.4, -0.22);
          girder.castShadow = true;
          outcrop.add(girder);
        } else {
          const mainRock = new THREE.Mesh(mainRockGeo, rockMat);
          mainRock.scale.set(1.22, 0.88, 1.05);
          mainRock.position.set(0, 0.72, 0);
          mainRock.rotation.set(0.3, c * 1.1 + r, 0.2);
          mainRock.castShadow = true;
          mainRock.receiveShadow = true;
          outcrop.add(mainRock);

          for (let i = 0; i < 3; i++) {
            const ang = i * 2.1 + c + r;
            const sub = new THREE.Mesh(subRockGeo, i % 2 === 0 ? rockDarkMat : rockMat);
            sub.position.set(Math.cos(ang) * 1.05, 0.36, Math.sin(ang) * 0.95);
            sub.scale.set(1.1, 0.75, 0.95);
            sub.rotation.set(ang, ang * 0.7, 0);
            sub.castShadow = true;
            sub.receiveShadow = true;
            outcrop.add(sub);
          }

          if (biome === 'arctic' || biome === 'forest' || biome === 'swamp') {
            for (let t = 0; t < 2; t++) {
              const ta = t * 2.7 + r * 0.9 + c * 0.4;
              const tree = new THREE.Group();
              tree.position.set(Math.cos(ta) * 1.18, 0, Math.sin(ta) * 1.15);
              const trunk = new THREE.Mesh(trunkGeo, trunkMat);
              trunk.position.y = 0.36;
              trunk.castShadow = true;
              tree.add(trunk);

              const c1 = new THREE.Mesh(cone1Geo, foliageMat1);
              c1.position.y = 0.92;
              c1.castShadow = true;
              tree.add(c1);

              const c2 = new THREE.Mesh(cone2Geo, foliageMat2);
              c2.position.y = 1.38;
              c2.castShadow = true;
              tree.add(c2);

              const c3 = new THREE.Mesh(cone3Geo, foliageMat2);
              c3.position.y = 1.76;
              c3.castShadow = true;
              tree.add(c3);
              outcrop.add(tree);
            }
          } else if (biome === 'volcanic') {
            const spire = new THREE.Mesh(cone1Geo, scrubMat);
            spire.position.set(0.3, 1.32, 0.2);
            spire.scale.set(0.65, 1.4, 0.65);
            outcrop.add(spire);
          } else {
            const bush = new THREE.Mesh(bushGeo, scrubMat);
            bush.position.set(-1.05, 0.2, 0.88);
            bush.scale.set(1.2, 0.7, 1.1);
            bush.castShadow = true;
            outcrop.add(bush);
          }
        }

        group.add(outcrop);
      }
    }
  }

  // 3b. Special Stage Terrain Feature Tiles (Restricted, Ice, Fog, Toxic, Lava)
  const tileOverlayGeo = trackGeo(new THREE.PlaneGeometry(CELL_WORLD * 0.92, CELL_WORLD * 0.92));
  const addFeatureTiles = (
    cells: Array<[number, number]> | undefined,
    color: number,
    opacity: number,
    yPos: number
  ) => {
    if (!cells || cells.length === 0) return;
    const mat = trackMat(
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    for (const [c, r] of cells) {
      if (c < 0 || c >= GRID_COLS || r < 0 || r >= GRID_ROWS) continue;
      const { x, z } = cellToWorldCenter(c, r);
      const tile = new THREE.Mesh(tileOverlayGeo, mat);
      tile.rotation.x = -Math.PI / 2;
      tile.position.set(x, yPos, z);
      group.add(tile);
    }
  };

  addFeatureTiles(stageFeatures.restrictedCells, 0x64748b, 0.38, 0.04);
  addFeatureTiles(stageFeatures.iceCells, 0x7dd3fc, 0.28, 0.045);
  addFeatureTiles(stageFeatures.fogCells, 0x94a3b8, 0.26, 0.16);
  addFeatureTiles(stageFeatures.toxicCells, 0x84cc16, 0.28, 0.05);
  addFeatureTiles(stageFeatures.lavaCells, 0xef4444, 0.45, 0.055);

  // Dedicated AO-enabled PBR materials for Hero Spawn Helipads & Hero FOB HQ
  const padDarkConcreteAO = trackMat(
    createPBRMaterial('concreteBunker', {
      color: 0x8c929a,
      roughness: 0.88,
      metalness: 0.02,
      bumpScale: 0.04,
      repeat: [1.5, 1.5],
      vertexColors: true
    })
  );
  const padConcreteAO = trackMat(
    createPBRMaterial('concreteBunker', {
      color: 0xd0d4da,
      roughness: 0.88,
      metalness: 0.02,
      bumpScale: 0.05,
      repeat: [1.5, 1.5],
      vertexColors: true
    })
  );
  const padOliveAO = trackMat(
    createPBRMaterial('natoArmorPlate', {
      color: 0xc2ccb0,
      roughness: 0.74,
      metalness: 0.04,
      bumpScale: 0.035,
      vertexColors: true
    })
  );
  const padHazardAO = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.55, metalness: 0.04, vertexColors: true })
  );
  const padSteelAO = trackMat(
    new THREE.MeshStandardMaterial({
      color: PALETTE.steel,
      roughness: 0.36,
      metalness: 0.82,
      envMapIntensity: 1.2,
      vertexColors: true
    })
  );
  const fobSandbagAO = trackMat(
    createPBRMaterial('sandbagBurlap', { roughness: 0.94, metalness: 0.0, bumpScale: 0.08, vertexColors: true })
  );

  // 4. Hero Spawn Helipads (Global across all biomes, beveled + merged with vertical AO)
  const stripeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xdc3b3b,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.25,
      roughness: 0.52,
      metalness: 0.04
    })
  );
  // Emissive area <= 5% projected area; gentle pulse <= 1.2 Hz
  const beaconMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf87171,
      emissive: 0xef4444,
      emissiveIntensity: 1.15
    })
  );

  // Shared merged helipad geometries
  const padSlabGeo = trackGeo(
    (() => {
      const mainSlab = getRoundedBoxGeo(3.84, 0.16, 3.84, 0.045, 2);
      const apronTrim = getRoundedBoxGeo(3.92, 0.06, 3.92, 0.02, 2);
      const parts = [cloneTransformed(mainSlab, 0, 0.08, 0), cloneTransformed(apronTrim, 0, 0.03, 0)];
      const merged = mergeStaticGeometries(parts, { disposeInputs: true });
      applyVerticalAOToGeometry(merged, 0.0, 0.16, 0.55);
      return merged;
    })()
  );

  const padConcreteGeo = trackGeo(
    (() => {
      const curbN = getRoundedBoxGeo(2.2, 0.14, 0.18, 0.035, 2);
      const curbW = getRoundedBoxGeo(0.18, 0.14, 2.2, 0.035, 2);
      const bollard = getChamferedCylinderGeo(0.08, 0.11, 0.26, 8, 0.025);
      const parts: THREE.BufferGeometry[] = [
        cloneTransformed(curbN, 0, 0.20, -1.78),
        cloneTransformed(curbN, 0, 0.20, 1.78),
        cloneTransformed(curbW, 1.78, 0.20, 0)
      ];
      for (const [bx, bz] of [
        [-1.68, -1.68],
        [1.68, -1.68],
        [-1.68, 1.68],
        [1.68, 1.68]
      ]) {
        parts.push(cloneTransformed(bollard, bx, 0.26, bz));
      }
      const merged = mergeStaticGeometries(parts, { disposeInputs: true });
      applyVerticalAOToGeometry(merged, 0.13, 0.39, 0.52);
      return merged;
    })()
  );

  const padMarkingsGeo = trackGeo(
    (() => {
      const hSide = getRoundedBoxGeo(0.18, 0.022, 1.18, 0.008, 1);
      const hBar = getRoundedBoxGeo(0.88, 0.022, 0.18, 0.008, 1);
      const cornerBarA = getRoundedBoxGeo(0.42, 0.02, 0.09, 0.006, 1);
      const cornerBarB = getRoundedBoxGeo(0.09, 0.02, 0.42, 0.006, 1);
      const parts: THREE.BufferGeometry[] = [
        cloneTransformed(hSide, -0.42, 0.168, 0),
        cloneTransformed(hSide, 0.42, 0.168, 0),
        cloneTransformed(hBar, 0, 0.168, 0)
      ];
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          parts.push(cloneTransformed(cornerBarA, sx * 1.18, 0.167, sz * 1.35));
          parts.push(cloneTransformed(cornerBarB, sx * 1.35, 0.167, sz * 1.18));
        }
      }
      return mergeStaticGeometries(parts, { disposeInputs: true });
    })()
  );

  const ringGeo = trackGeo(new THREE.RingGeometry(1.14, 1.32, 24));
  const ringMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xdc3b3b, side: THREE.DoubleSide }));
  const beaconGeo = trackGeo(new THREE.SphereGeometry(0.085, 8, 8));

  const padOlivePropsGeo = trackGeo(
    (() => {
      const drum = getChamferedCylinderGeo(0.15, 0.15, 0.42, 12, 0.025);
      const crate = getRoundedBoxGeo(0.46, 0.28, 0.32, 0.04, 2);
      const parts = [
        cloneTransformed(drum, -1.24, 0.16 + 0.21, -1.46),
        cloneTransformed(crate, -1.40, 0.16 + 0.14, 1.32, 0, 0.25, 0)
      ];
      const merged = mergeStaticGeometries(parts, { disposeInputs: true });
      applyVerticalAOToGeometry(merged, 0.16, 0.58, 0.48);
      return merged;
    })()
  );

  const padHazardDrumGeo = trackGeo(
    (() => {
      const drum = getChamferedCylinderGeo(0.15, 0.15, 0.42, 12, 0.025);
      const out = cloneTransformed(drum, -1.52, 0.16 + 0.21, -1.16);
      applyVerticalAOToGeometry(out, 0.16, 0.58, 0.48);
      return out;
    })()
  );

  const padPoleSteelGeo = trackGeo(
    (() => {
      const pole = getChamferedCylinderGeo(0.036, 0.052, 1.35, 8, 0.01);
      const arm = getRoundedBoxGeo(0.055, 0.045, 0.34, 0.01, 1);
      const yaw = Math.PI * 0.75;
      const parts = [cloneTransformed(pole, 0, 0.675, 0), cloneTransformed(arm, 0, 1.34, 0.14)];
      const localMerged = mergeStaticGeometries(parts, { disposeInputs: true });
      const worldPlaced = cloneTransformed(localMerged, -1.72, 0, 1.72, 0, yaw, 0);
      localMerged.dispose();
      applyVerticalAOToGeometry(worldPlaced, 0.0, 1.38, 0.54);
      return worldPlaced;
    })()
  );

  const padPoleLampGeo = trackGeo(
    (() => {
      const lamp = getRoundedBoxGeo(0.13, 0.055, 0.15, 0.012, 1);
      const yaw = Math.PI * 0.75;
      const local = cloneTransformed(lamp, 0, 1.31, 0.26);
      const placed = cloneTransformed(local, -1.72, 0, 1.72, 0, yaw, 0);
      local.dispose();
      return placed;
    })()
  );

  for (const sp of spawnPoints) {
    const { x, z } = cellToWorldCenter(sp.col, sp.row);
    const pad = new THREE.Group();
    pad.position.set(x, 0, z);

    const slab = new THREE.Mesh(padSlabGeo, padDarkConcreteAO);
    slab.receiveShadow = true;
    pad.add(slab);

    const curbsAndPosts = new THREE.Mesh(padConcreteGeo, padConcreteAO);
    curbsAndPosts.castShadow = true;
    curbsAndPosts.receiveShadow = true;
    pad.add(curbsAndPosts);

    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.163;
    ring.userData.noShadow = true;
    pad.add(ring);

    const markings = new THREE.Mesh(padMarkingsGeo, stripeMat);
    markings.userData.noShadow = true;
    pad.add(markings);

    const oliveProps = new THREE.Mesh(padOlivePropsGeo, padOliveAO);
    oliveProps.castShadow = true;
    oliveProps.receiveShadow = true;
    pad.add(oliveProps);

    const hazardDrum = new THREE.Mesh(padHazardDrumGeo, padHazardAO);
    hazardDrum.castShadow = true;
    hazardDrum.receiveShadow = true;
    pad.add(hazardDrum);

    const poleMesh = new THREE.Mesh(padPoleSteelGeo, padSteelAO);
    poleMesh.castShadow = true;
    pad.add(poleMesh);

    const lampMesh = new THREE.Mesh(padPoleLampGeo, warmLampMat);
    lampMesh.userData.noShadow = true;
    pad.add(lampMesh);

    for (const [bx, bz] of [
      [-1.68, -1.68],
      [1.68, -1.68],
      [-1.68, 1.68],
      [1.68, 1.68]
    ]) {
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(bx, 0.40, bz);
      beacon.userData.noShadow = true;
      pad.add(beacon);
    }

    group.add(pad);
  }

  // 5. Road Turn Shoulder Props (Desert uses InstancedMesh; other biomes preserved intact)
  const isRoad = (c: number, r: number) =>
    c >= 0 && c < GRID_COLS && r >= 0 && r < GRID_ROWS && baseTerrain[r][c] === CELL.ROAD;

  if (biome === 'desert') {
    const bagTransforms: THREE.Matrix4[] = [];
    const bagColors: number[] = [];
    const drumTransforms: THREE.Matrix4[] = [];
    const drumColors: number[] = [];
    const poleTransforms: THREE.Matrix4[] = [];

    const dummy = new THREE.Object3D();
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (baseTerrain[r][c] !== CELL.ROAD) continue;
        const up = isRoad(c, r - 1);
        const down = isRoad(c, r + 1);
        const left = isRoad(c - 1, r);
        const right = isRoad(c + 1, r);

        const isTurn = (up || down) && (left || right) && !(up && down) && !(left && right);
        if (!isTurn) continue;

        const { x, z } = cellToWorldCenter(c, r);
        const ox = left ? 1.56 : -1.56;
        const oz = up ? 1.56 : -1.56;
        const turnRng = createSeededRng(hashSeed('desert_turn_prop', c, r));

        for (let b = 0; b < 3; b++) {
          dummy.position.set(
            x + ox * (1 - b * 0.14),
            0.11 + (b === 2 ? 0.18 : 0),
            z + oz * (1 - (2 - b) * 0.14)
          );
          dummy.rotation.set(0, (ox * oz > 0 ? -1 : 1) * (Math.PI / 4) + turnRng.range(-0.08, 0.08), 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          bagTransforms.push(dummy.matrix.clone());
          bagColors.push(b % 2 === 0 ? 0xeae2ce : 0xd4c7aa);
        }

        if ((c + r) % 2 === 0) {
          dummy.position.set(x + ox, 0, z + oz);
          dummy.rotation.set(0, Math.atan2(-ox, -oz), 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          poleTransforms.push(dummy.matrix.clone());
        } else {
          dummy.position.set(x + ox, 0.21, z + oz);
          dummy.rotation.set(0, turnRng.range(0, Math.PI * 2), 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          drumTransforms.push(dummy.matrix.clone());
          drumColors.push((c + r) % 3 === 0 ? 0xa95335 : 0xc2ccb0);
        }
      }
    }

    const colorTmp = new THREE.Color();
    if (bagTransforms.length > 0) {
      const bagBevelGeo = trackGeo(getRoundedBoxGeo(0.44, 0.22, 0.28, 0.055, 2).clone());
      applyVerticalAOToGeometry(bagBevelGeo, -0.11, 0.11, 0.48);
      const desertBagMat = trackMat(
        createPBRMaterial('sandbagBurlap', { color: 0xffffff, roughness: 0.94, metalness: 0.0, bumpScale: 0.08, vertexColors: true })
      );
      const bagInst = trackInst(new THREE.InstancedMesh(bagBevelGeo, desertBagMat, bagTransforms.length));
      bagInst.name = 'DesertTurnSandbags';
      bagInst.frustumCulled = false;
      bagInst.castShadow = true;
      bagInst.receiveShadow = true;
      for (let i = 0; i < bagTransforms.length; i++) {
        bagInst.setMatrixAt(i, bagTransforms[i]);
        colorTmp.setHex(bagColors[i]);
        bagInst.setColorAt(i, colorTmp);
      }
      bagInst.instanceMatrix.needsUpdate = true;
      if (bagInst.instanceColor) bagInst.instanceColor.needsUpdate = true;
      group.add(bagInst);
    }

    if (drumTransforms.length > 0) {
      const desertDrumGeo = trackGeo(getChamferedCylinderGeo(0.15, 0.15, 0.42, 12, 0.025).clone());
      applyVerticalAOToGeometry(desertDrumGeo, -0.21, 0.21, 0.52);
      const desertDrumMat = trackMat(
        createPBRMaterial('natoArmorPlate', { color: 0xffffff, roughness: 0.72, metalness: 0.05, bumpScale: 0.035, vertexColors: true })
      );
      const drumInst = trackInst(new THREE.InstancedMesh(desertDrumGeo, desertDrumMat, drumTransforms.length));
      drumInst.name = 'DesertTurnDrums';
      drumInst.frustumCulled = false;
      drumInst.castShadow = true;
      drumInst.receiveShadow = true;
      for (let i = 0; i < drumTransforms.length; i++) {
        drumInst.setMatrixAt(i, drumTransforms[i]);
        colorTmp.setHex(drumColors[i]);
        drumInst.setColorAt(i, colorTmp);
      }
      drumInst.instanceMatrix.needsUpdate = true;
      if (drumInst.instanceColor) drumInst.instanceColor.needsUpdate = true;
      group.add(drumInst);
    }

    if (poleTransforms.length > 0) {
      const poleParts = [
        cloneTransformed(getChamferedCylinderGeo(0.036, 0.052, 1.35, 8, 0.01), 0, 0.675, 0),
        cloneTransformed(getRoundedBoxGeo(0.055, 0.045, 0.34, 0.01, 1), 0, 1.34, 0.14)
      ];
      const mergedPoleGeo = trackGeo(mergeStaticGeometries(poleParts, { disposeInputs: true }));
      const poleInst = trackInst(new THREE.InstancedMesh(mergedPoleGeo, steelMat, poleTransforms.length));
      poleInst.name = 'DesertTurnLightPoles';
      poleInst.frustumCulled = false;
      poleInst.castShadow = true;
      poleInst.receiveShadow = false;

      const lampBevelGeo = trackGeo(
        cloneTransformed(getRoundedBoxGeo(0.13, 0.055, 0.15, 0.012, 1), 0, 1.31, 0.26)
      );
      const lampInst = trackInst(new THREE.InstancedMesh(lampBevelGeo, warmLampMat, poleTransforms.length));
      lampInst.name = 'DesertTurnPoleLamps';
      lampInst.frustumCulled = false;
      lampInst.castShadow = false;
      lampInst.receiveShadow = false;
      lampInst.userData.noShadow = true;

      for (let i = 0; i < poleTransforms.length; i++) {
        poleInst.setMatrixAt(i, poleTransforms[i]);
        lampInst.setMatrixAt(i, poleTransforms[i]);
      }
      poleInst.instanceMatrix.needsUpdate = true;
      lampInst.instanceMatrix.needsUpdate = true;
      group.add(poleInst, lampInst);
    }
  } else {
    const bagGeo = trackGeo(new THREE.BoxGeometry(0.42, 0.22, 0.26));
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (baseTerrain[r][c] !== CELL.ROAD) continue;
        const up = isRoad(c, r - 1);
        const down = isRoad(c, r + 1);
        const left = isRoad(c - 1, r);
        const right = isRoad(c + 1, r);

        const isTurn = (up || down) && (left || right) && !(up && down) && !(left && right);
        if (!isTurn) continue;

        const { x, z } = cellToWorldCenter(c, r);
        const ox = left ? 1.56 : -1.56;
        const oz = up ? 1.56 : -1.56;

        for (let b = 0; b < 3; b++) {
          const bag = new THREE.Mesh(bagGeo, sandbagMat);
          bag.position.set(x + ox * (1 - b * 0.14), 0.11 + (b === 2 ? 0.18 : 0), z + oz * (1 - (2 - b) * 0.14));
          bag.rotation.y = (ox * oz > 0 ? -1 : 1) * (Math.PI / 4);
          bag.castShadow = true;
          bag.receiveShadow = true;
          group.add(bag);
        }

        if ((c + r) % 2 === 0) {
          addLightPole(group, x + ox, z + oz, Math.atan2(-ox, -oz));
        } else {
          addFuelDrum(group, x + ox, 0, z + oz, false);
        }
      }
    }
  }

  // 6. Allied FOB HQ Military Complex (Global across all biomes, chamfered + merged + inward searchlight)
  const fobPos = cellToWorldCenter(fobPoint.col, fobPoint.row);
  const fobGroup = new THREE.Group();
  fobGroup.position.set(fobPos.x, 0, fobPos.z);

  const fobApronGeo = trackGeo(
    (() => {
      const apron = getRoundedBoxGeo(3.92, 0.18, 4.65, 0.045, 2);
      const step = getRoundedBoxGeo(2.42, 0.12, 2.52, 0.035, 2);
      const parts = [cloneTransformed(apron, 0, 0.09, 0), cloneTransformed(step, 0.35, 0.16, -0.35)];
      const merged = mergeStaticGeometries(parts, { disposeInputs: true });
      applyVerticalAOToGeometry(merged, 0.0, 0.22, 0.56);
      return merged;
    })()
  );
  const fobApron = new THREE.Mesh(fobApronGeo, padDarkConcreteAO);
  fobApron.receiveShadow = true;
  fobGroup.add(fobApron);

  // Multi-level chamfered bunker casemate
  const fobBunkerGeo = trackGeo(
    (() => {
      const lower = getRoundedBoxGeo(2.14, 0.80, 2.22, 0.06, 2);
      const upper = getRoundedBoxGeo(1.82, 0.48, 1.90, 0.05, 2);
      const ventPod = getRoundedBoxGeo(0.46, 0.38, 0.62, 0.04, 2);
      const parts = [
        cloneTransformed(lower, 0.35, 0.56, -0.35),
        cloneTransformed(upper, 0.35, 1.14, -0.35),
        cloneTransformed(ventPod, 1.38, 0.48, -0.62)
      ];
      const merged = mergeStaticGeometries(parts, { disposeInputs: true });
      applyVerticalAOToGeometry(merged, 0.16, 1.38, 0.52);
      return merged;
    })()
  );
  const bunker = new THREE.Mesh(fobBunkerGeo, padConcreteAO);
  bunker.castShadow = true;
  bunker.receiveShadow = true;
  fobGroup.add(bunker);

  const roofGeo = trackGeo(
    (() => {
      const mainRoof = getRoundedBoxGeo(2.34, 0.22, 2.42, 0.04, 2);
      const out = cloneTransformed(mainRoof, 0.35, 1.43, -0.35);
      return out;
    })()
  );
  const roof = new THREE.Mesh(roofGeo, diamondMat);
  roof.castShadow = true;
  roof.receiveShadow = true;
  fobGroup.add(roof);

  // Contained cyan command observation slit (<= 5% projected area)
  const slit = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 0.14, 1.34)), cyanGlowMat);
  slit.position.set(-0.56, 1.06, -0.35);
  slit.userData.noShadow = true;
  fobGroup.add(slit);

  // Merged Hesco / beveled sandbag perimeter wall with vertical AO
  const fobWallBagGeo = trackGeo(
    (() => {
      const bagProto = getRoundedBoxGeo(0.38, 0.23, 0.56, 0.055, 2);
      const parts: THREE.BufferGeometry[] = [];
      for (let tier = 0; tier < 2; tier++) {
        for (let i = -3; i <= 3; i++) {
          parts.push(
            cloneTransformed(
              bagProto,
              -1.55,
              0.28 + tier * 0.22,
              i * 0.58 + (tier % 2 === 1 ? 0.14 : 0)
            )
          );
        }
      }
      const merged = mergeStaticGeometries(parts, { disposeInputs: true });
      applyVerticalAOToGeometry(merged, 0.16, 0.62, 0.48);
      return merged;
    })()
  );
  const fobWallMesh = new THREE.Mesh(fobWallBagGeo, fobSandbagAO);
  fobWallMesh.castShadow = true;
  fobWallMesh.receiveShadow = true;
  fobGroup.add(fobWallMesh);

  // Command shelter tent + merged olive crate/drum props
  const fobOliveGeo = trackGeo(
    (() => {
      const tentBody = getRoundedBoxGeo(1.36, 0.72, 1.46, 0.06, 2);
      const tentRoof = new THREE.ConeGeometry(1.06, 0.54, 4);
      const crate = getRoundedBoxGeo(0.46, 0.28, 0.32, 0.04, 2);
      const drum = getChamferedCylinderGeo(0.15, 0.15, 0.42, 12, 0.025);
      const parts = [
        cloneTransformed(tentBody, 0.55, 0.52, 1.38),
        cloneTransformed(tentRoof, 0.55, 1.14, 1.38, 0, Math.PI / 4, 0),
        cloneTransformed(crate, -0.85, 0.18 + 0.14, 1.48, 0, 0.2, 0),
        cloneTransformed(drum, -0.45, 0.18 + 0.21, 1.75)
      ];
      const merged = mergeStaticGeometries(parts, { disposeInputs: true });
      applyVerticalAOToGeometry(merged, 0.16, 1.42, 0.52);
      return merged;
    })()
  );
  const fobOliveMesh = new THREE.Mesh(fobOliveGeo, padOliveAO);
  fobOliveMesh.castShadow = true;
  fobOliveMesh.receiveShadow = true;
  fobGroup.add(fobOliveMesh);

  addFuelDrum(fobGroup, -0.78, 0.18, 1.88, true);
  addLightPole(fobGroup, -1.65, -1.95, Math.PI * 0.25);
  addLightPole(fobGroup, -1.65, 1.95, Math.PI * 0.75);

  const commMast = new THREE.Group();
  commMast.position.set(0.35, 1.54, -0.35);
  const mastPole = new THREE.Mesh(trackGeo(getChamferedCylinderGeo(0.08, 0.11, 1.1, 8, 0.015).clone()), steelMat);
  mastPole.position.y = 0.55;
  commMast.add(mastPole);
  const dishPivot = new THREE.Group();
  dishPivot.position.y = 1.15;
  const dish = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.55, 0.14, 0.22, 12)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xd8dde4, roughness: 0.38, metalness: 0.35 }))
  );
  dish.rotation.x = Math.PI / 3;
  dishPivot.add(dish);
  const feed = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 6)), cyanGlowMat);
  feed.rotation.x = Math.PI / 3;
  feed.position.set(0, 0.16, 0.22);
  feed.userData.noShadow = true;
  dishPivot.add(feed);
  commMast.add(dishPivot);
  fobGroup.add(commMast);

  // DEFINITIVE FIX: FOB Searchlight strictly pointed inward (-X) with bounded cone & oscillation
  // so it NEVER leaks outside the right edge of the plinth.
  const searchlightPivot = new THREE.Group();
  searchlightPivot.position.set(-0.45, 1.56, 0.45);
  searchlightPivot.rotation.y = -Math.PI * 0.5;
  const slHead = new THREE.Mesh(trackGeo(getChamferedCylinderGeo(0.16, 0.12, 0.30, 10, 0.02).clone()), steelMat);
  slHead.rotation.x = Math.PI / 2 + 0.26;
  searchlightPivot.add(slHead);

  const coneGeo = trackGeo(new THREE.ConeGeometry(0.55, 3.0, 20, 4, true));
  {
    // Smooth quadratic alpha/color fade to pure black well before the bottom rim (zero hard ellipse on ground)
    const cPos = coneGeo.getAttribute('position');
    const cColors = new Float32Array(cPos.count * 3);
    for (let i = 0; i < cPos.count; i++) {
      const y = cPos.getY(i);
      const t = Math.max(0, Math.min(1, (y + 1.5) / 3.0));
      const fade = t > 0.22 ? Math.pow((t - 0.22) / 0.78, 2.0) : 0.0;
      const o = i * 3;
      cColors[o] = 0.73 * fade;
      cColors[o + 1] = 0.90 * fade;
      cColors[o + 2] = 1.0 * fade;
    }
    coneGeo.setAttribute('color', new THREE.BufferAttribute(cColors, 3));
  }
  coneGeo.translate(0, -1.5, 0);
  coneGeo.rotateX(-(Math.PI / 2 - 0.26));
  const coneMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      vertexColors: true,
      transparent: true,
      opacity: 0.065,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  const lightCone = new THREE.Mesh(coneGeo, coneMat);
  lightCone.position.set(0, 0, 0.16);
  lightCone.castShadow = false;
  lightCone.receiveShadow = false;
  lightCone.userData.noShadow = true;
  searchlightPivot.add(lightCone);
  fobGroup.add(searchlightPivot);

  group.add(fobGroup);

  return {
    group,
    groundPlane,
    update: (elapsed: number, dt: number) => {
      dishPivot.rotation.y += dt * 1.4;
      // Oscillate strictly within [-0.36, +0.36] around -X (inward into the board)
      searchlightPivot.rotation.y = -Math.PI * 0.5 + Math.sin(elapsed * 0.75) * 0.36;
      // Gentle breathing beacon pulse at 0.95 Hz (<= 1.2 Hz, WCAG-safe)
      beaconMat.emissiveIntensity = 1.05 + Math.sin(elapsed * Math.PI * 2 * 0.95) * 0.35;
    },
    dispose: () => {
      for (const inst of disposableInstances) inst.dispose();
      for (const tex of disposableTextures) tex.dispose();
      for (const geo of disposableGeos) geo.dispose();
      for (const mat of disposableMats) mat.dispose();
    }
  };
}
