import * as THREE from 'three';
import {
  GRID_COLS,
  GRID_ROWS,
  TILE_SIZE,
  CELL
} from '../systems/Pathfinder.js';
import { PALETTE } from './MilitaryModels3D.ts';
import { createPBRMaterial } from './ProceduralPBRTextures.ts';

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

function createTerrainTextures(
  baseTerrain: Uint8Array[],
  biome: WorldBiome
): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
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

  // Biome-specific surface features
  if (biome === 'desert') {
    // Wind-blown sand dune ripples
    ctx.strokeStyle = 'rgba(220, 195, 145, 0.14)';
    ctx.lineWidth = 3;
    for (let y = 20; y < h; y += 38) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 64) {
        const wy = y + Math.sin(x * 0.012 + y * 0.03) * 8;
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }
  } else if (biome === 'arctic') {
    // Glacial ice cracks
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
    // Concrete slab expansion joints & steel railway ties
    ctx.strokeStyle = 'rgba(20, 24, 30, 0.34)';
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += tileW * 2) {
      ctx.strokeRect(x, 0, tileW * 2, h);
    }
    // Railway track strip near top and bottom edges
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

  // Subtle engineering survey grid lines (28x16)
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

  // Connected road network
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

function createRulerLabelTexture(labels: string[], horizontal: boolean): THREE.CanvasTexture {
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

export function createBattlefieldDiorama3D(
  baseTerrain: Uint8Array[],
  biome: WorldBiome = 'desert',
  spawnPoints: GridPoint[] = [{ col: 0, row: 3, id: 'ALPHA' }, { col: 0, row: 12, id: 'BRAVO' }],
  fobPoint: GridPoint = { col: 27, row: 7 },
  stageFeatures: StageTerrainFeatures = {}
): DioramaHandles {
  const group = new THREE.Group();
  const theme = BIOME_THEMES[biome] || BIOME_THEMES.desert;
  const { map, roughnessMap, bumpMap } = createTerrainTextures(baseTerrain, biome);
  const disposableTextures: THREE.Texture[] = [map, roughnessMap, bumpMap];
  const disposableGeos: THREE.BufferGeometry[] = [];
  const disposableMats: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    disposableGeos.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    disposableMats.push(m);
    return m;
  };

  // 1. Main Battlefield Ground Surface (28x16 = 112x64 world units)
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
  const groundPlane = new THREE.Mesh(groundGeo, groundMat);
  groundPlane.rotation.x = -Math.PI / 2;
  groundPlane.receiveShadow = true;
  group.add(groundPlane);

  // 2. Plinth Base
  const earthSlab = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(BOARD_W + 2.8, 2.2, BOARD_D + 2.8)),
    trackMat(new THREE.MeshStandardMaterial({ color: theme.plinthColor, roughness: 0.94, metalness: 0.05 }))
  );
  earthSlab.position.set(0, -1.11, 0);
  earthSlab.receiveShadow = true;
  group.add(earthSlab);

  const steelPlinth = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(BOARD_W + 4.6, 2.0, BOARD_D + 4.6)),
    trackMat(createPBRMaterial('diamondSteelPlate', { color: 0x4b5c6e, roughness: 0.5, metalness: 0.72, bumpScale: 0.04, repeat: [22, 13] }))
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

  // Shared Diorama Prop Materials
  const concreteMat = trackMat(createPBRMaterial('concreteBunker', { color: 0xd0d4da, roughness: 0.88, bumpScale: 0.05, repeat: [1.5, 1.5] }));
  const darkConcreteMat = trackMat(createPBRMaterial('concreteBunker', { color: 0x8b9098, roughness: 0.88, bumpScale: 0.05, repeat: [1.5, 1.5] }));
  const asphaltPadMat = trackMat(createPBRMaterial('tacticalAsphalt', { roughness: 0.84, metalness: 0.1, bumpScale: 0.04, repeat: [2, 2] }));
  const diamondMat = trackMat(createPBRMaterial('diamondSteelPlate', { roughness: 0.44, metalness: 0.78, bumpScale: 0.05, repeat: [2, 2] }));
  const oliveMat = trackMat(createPBRMaterial('natoArmorPlate', { color: 0xd0d8ba, roughness: 0.72, metalness: 0.22, bumpScale: 0.035 }));
  const sandbagMat = trackMat(createPBRMaterial('sandbagBurlap', { roughness: 0.94, metalness: 0.02, bumpScale: 0.08 }));
  const steelMat = trackMat(new THREE.MeshStandardMaterial({ color: PALETTE.steel, roughness: 0.36, metalness: 0.82, envMapIntensity: 1.25 }));
  const hazardRedMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.55, metalness: 0.25 }));
  const cyanGlowMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 2.0
    })
  );
  const warmLampMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 2.2
    })
  );

  // Shared prop geometries
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
    poleGroup.add(lamp);
    parent.add(poleGroup);
  };

  // 3. Rock Outcrops / Snow Glaciers / Industrial Ruins on CELL.ROCK
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

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (baseTerrain[r][c] !== CELL.ROCK) continue;
      const { x, z } = cellToWorldCenter(c, r);
      const outcrop = new THREE.Group();
      outcrop.position.set(x, 0, z);

      if (biome === 'industrial') {
        // Industrial ruined concrete block + rusted I-beams / cooling silo
        const block = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.5, 1.4, 2.3)), rockDarkMat);
        block.position.set(0, 0.7, 0);
        block.rotation.y = ((c + r) % 4) * 0.25;
        block.castShadow = true;
        block.receiveShadow = true;
        outcrop.add(block);

        const silo = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.75, 0.85, 2.1, 10)), rockMat);
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
          // Pine / forest / marsh trees
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
          // Desert / Canyon scrub
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

  // 3b. Special Stage Terrain Feature Tiles (Restricted, Ice, Fog, Toxic, Lava)
  const tileOverlayGeo = trackGeo(new THREE.PlaneGeometry(CELL_WORLD * 0.92, CELL_WORLD * 0.92));
  const addFeatureTiles = (cells: Array<[number, number]> | undefined, color: number, opacity: number, yPos: number) => {
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

  // 4. Illuminated Spawn Helipads
  const animatedBeacons: THREE.Mesh[] = [];
  const stripeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.9,
      roughness: 0.4
    })
  );
  const beaconMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xf87171, emissive: 0xef4444, emissiveIntensity: 2.0 })
  );

  const slabGeo = trackGeo(new THREE.BoxGeometry(3.82, 0.14, 3.82));
  const ringGeo = trackGeo(new THREE.RingGeometry(1.15, 1.38, 24));
  const hSideGeo = trackGeo(new THREE.BoxGeometry(0.18, 0.02, 1.2));
  const hBarGeo = trackGeo(new THREE.BoxGeometry(0.9, 0.02, 0.18));
  const postPadGeo = trackGeo(new THREE.CylinderGeometry(0.08, 0.1, 0.25, 8));
  const beaconGeo = trackGeo(new THREE.SphereGeometry(0.11, 8, 8));

  for (const sp of spawnPoints) {
    const { x, z } = cellToWorldCenter(sp.col, sp.row);
    const pad = new THREE.Group();
    pad.position.set(x, 0, z);

    const slab = new THREE.Mesh(slabGeo, asphaltPadMat);
    slab.position.y = 0.07;
    slab.receiveShadow = true;
    pad.add(slab);

    const ring = new THREE.Mesh(
      ringGeo,
      trackMat(new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide }))
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.15;
    pad.add(ring);

    const hLeft = new THREE.Mesh(hSideGeo, stripeMat);
    hLeft.position.set(-0.42, 0.15, 0);
    const hRight = new THREE.Mesh(hSideGeo, stripeMat);
    hRight.position.set(0.42, 0.15, 0);
    const hBar = new THREE.Mesh(hBarGeo, stripeMat);
    hBar.position.set(0, 0.15, 0);
    pad.add(hLeft, hRight, hBar);

    for (const [bx, bz] of [[-1.68, -1.68], [1.68, -1.68], [-1.68, 1.68], [1.68, 1.68]]) {
      const post = new THREE.Mesh(postPadGeo, concreteMat);
      post.position.set(bx, 0.2, bz);
      pad.add(post);
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(bx, 0.36, bz);
      pad.add(beacon);
      animatedBeacons.push(beacon);
    }

    addFuelDrum(pad, -1.52, 0.14, -1.16, true);
    addFuelDrum(pad, -1.24, 0.14, -1.48, false);
    addAmmoCrate(pad, -1.42, 0.14, 1.32, 0.25);
    addLightPole(pad, -1.72, 1.72, Math.PI * 0.75);

    group.add(pad);
  }

  // 5. Road Turn Shoulder Props
  const isRoad = (c: number, r: number) =>
    c >= 0 && c < GRID_COLS && r >= 0 && r < GRID_ROWS && baseTerrain[r][c] === CELL.ROAD;
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

  // 6. Allied FOB HQ Military Complex
  const fobPos = cellToWorldCenter(fobPoint.col, fobPoint.row);
  const fobGroup = new THREE.Group();
  fobGroup.position.set(fobPos.x, 0, fobPos.z);

  const fobApron = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.92, 0.18, 4.65)), darkConcreteMat);
  fobApron.position.y = 0.09;
  fobApron.receiveShadow = true;
  fobGroup.add(fobApron);

  const bunker = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.12, 1.25, 2.2)), concreteMat);
  bunker.position.set(0.35, 0.72, -0.35);
  bunker.castShadow = true;
  bunker.receiveShadow = true;
  fobGroup.add(bunker);

  const roof = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.34, 0.22, 2.42)), diamondMat);
  roof.position.set(0.35, 1.42, -0.35);
  roof.castShadow = true;
  roof.receiveShadow = true;
  fobGroup.add(roof);

  const slit = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 0.16, 1.42)), cyanGlowMat);
  slit.position.set(-0.72, 1.02, -0.35);
  fobGroup.add(slit);

  const wallBagGeo = trackGeo(new THREE.BoxGeometry(0.38, 0.24, 0.56));
  for (let tier = 0; tier < 2; tier++) {
    for (let i = -3; i <= 3; i++) {
      const bag = new THREE.Mesh(wallBagGeo, sandbagMat);
      bag.position.set(-1.55, 0.28 + tier * 0.22, i * 0.58 + (tier % 2 === 1 ? 0.14 : 0));
      bag.castShadow = true;
      bag.receiveShadow = true;
      fobGroup.add(bag);
    }
  }

  const tentBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.35, 0.72, 1.45)), oliveMat);
  tentBody.position.set(0.55, 0.52, 1.38);
  tentBody.castShadow = true;
  tentBody.receiveShadow = true;
  fobGroup.add(tentBody);

  const tentRoof = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(1.06, 0.55, 4)), oliveMat);
  tentRoof.rotation.y = Math.PI / 4;
  tentRoof.position.set(0.55, 1.15, 1.38);
  tentRoof.castShadow = true;
  fobGroup.add(tentRoof);

  addAmmoCrate(fobGroup, -0.85, 0.18, 1.48, 0.2);
  addFuelDrum(fobGroup, -0.45, 0.18, 1.75, false);
  addFuelDrum(fobGroup, -0.78, 0.18, 1.88, true);
  addLightPole(fobGroup, -1.65, -1.95, Math.PI * 0.25);
  addLightPole(fobGroup, -1.65, 1.95, Math.PI * 0.75);

  const commMast = new THREE.Group();
  commMast.position.set(0.35, 1.54, -0.35);
  const mastPole = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.08, 0.11, 1.1, 8)), steelMat);
  mastPole.position.y = 0.55;
  commMast.add(mastPole);
  const dishPivot = new THREE.Group();
  dishPivot.position.y = 1.15;
  const dish = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.55, 0.14, 0.22, 12)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35, metalness: 0.4 }))
  );
  dish.rotation.x = Math.PI / 3;
  dishPivot.add(dish);
  const feed = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 6)), cyanGlowMat);
  feed.rotation.x = Math.PI / 3;
  feed.position.set(0, 0.16, 0.22);
  dishPivot.add(feed);
  commMast.add(dishPivot);
  fobGroup.add(commMast);

  const searchlightPivot = new THREE.Group();
  searchlightPivot.position.set(-0.45, 1.56, 0.45);
  const slHead = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.14, 0.18, 0.32, 8)), steelMat);
  slHead.rotation.x = Math.PI / 2 - 0.25;
  searchlightPivot.add(slHead);
  const coneGeo = trackGeo(new THREE.ConeGeometry(1.4, 8.5, 16, 1, true));
  coneGeo.translate(0, -4.25, 0);
  coneGeo.rotateX(Math.PI / 2 - 0.18);
  const coneMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  const lightCone = new THREE.Mesh(coneGeo, coneMat);
  lightCone.position.z = 0.15;
  searchlightPivot.add(lightCone);
  fobGroup.add(searchlightPivot);

  group.add(fobGroup);

  return {
    group,
    groundPlane,
    update: (elapsed: number, dt: number) => {
      dishPivot.rotation.y += dt * 1.4;
      searchlightPivot.rotation.y = Math.PI + Math.sin(elapsed * 0.75) * 0.75;
      const pulse = 0.8 + Math.sin(elapsed * 5.0) * 0.6;
      beaconMat.emissiveIntensity = 1.2 + pulse;
    },
    dispose: () => {
      for (const tex of disposableTextures) tex.dispose();
      for (const geo of disposableGeos) geo.dispose();
      for (const mat of disposableMats) mat.dispose();
    }
  };
}
