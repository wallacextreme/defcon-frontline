import { getStageConfig } from '../data/worlds.js';

export const GRID_COLS = 28;
export const GRID_ROWS = 16;
export const TILE_SIZE = 64;

export const CELL = {
  FREE: 0,
  ROAD: 1,
  ROCK: 2,
  SPAWN: 3,
  FOB: 4,
  TOWER: 5,
  BARRIER: 6
};

export const SPAWN_POINTS = [
  { col: 0, row: 3, id: 'ALPHA' },
  { col: 0, row: 12, id: 'BRAVO' }
];

export const FOB_POINT = { col: 27, row: 7 };

const DIRS = [
  { dc: 1, dr: 0 },
  { dc: -1, dr: 0 },
  { dc: 0, dr: 1 },
  { dc: 0, dr: -1 }
];

/**
 * Tactical 28x16 Grid & Zero-Alloc Flat-Index A* Pathfinder with binary min-heap,
 * anti-blocking validation, and precomputed reverse-Dijkstra distance field.
 */
export class Pathfinder {
  constructor() {
    this.totalCells = GRID_COLS * GRID_ROWS;
    this.grid = Array.from({ length: GRID_ROWS }, () => new Uint8Array(GRID_COLS));
    this.baseTerrain = Array.from({ length: GRID_ROWS }, () => new Uint8Array(GRID_COLS));
    this.distField = Array.from({ length: GRID_ROWS }, () => new Float32Array(GRID_COLS));
    this.flatGrid = new Uint8Array(this.totalCells);
    this.flatBase = new Uint8Array(this.totalCells);
    this.flatDist = new Float32Array(this.totalCells);

    // Pre-allocated scratch buffers (0 heap allocations during hover / A* search)
    this.gScore = new Float32Array(this.totalCells);
    this.fScore = new Float32Array(this.totalCells);
    this.cameFrom = new Int32Array(this.totalCells);
    this.closed = new Uint8Array(this.totalCells);
    this.inOpen = new Uint8Array(this.totalCells);
    this.openHeap = new Int32Array(this.totalCells);
    this.checkedMask = new Uint8Array(this.totalCells);
    this.bfsQueueIdx = new Int32Array(this.totalCells * 2);
    this.bfsQueueDist = new Float32Array(this.totalCells * 2);

    this.spawnPoints = SPAWN_POINTS.map((s) => ({ ...s }));
    this.fobPoint = { ...FOB_POINT };
    this.roadCells = [];
    this.rockCells = [];
    this.spawnPaths = new Map();

    this.loadStageLayout(getStageConfig(1, 1));
  }

  loadStageLayout(stageConfig) {
    this.spawnPoints = (stageConfig.spawnPoints || SPAWN_POINTS).map((s) => ({ ...s }));
    this.fobPoint = { ...(stageConfig.fobPoint || FOB_POINT) };
    this.roadCells = stageConfig.roadCells || [];
    this.rockCells = stageConfig.rockCells || [];
    this.reset();
  }

  reset() {
    for (let r = 0; r < GRID_ROWS; r++) {
      this.grid[r].fill(CELL.FREE);
      this.baseTerrain[r].fill(CELL.FREE);
      this.distField[r].fill(Infinity);
    }
    this.flatGrid.fill(CELL.FREE);
    this.flatBase.fill(CELL.FREE);
    this.flatDist.fill(Infinity);

    for (const [c, r] of this.roadCells) {
      if (!this.inBounds(c, r)) continue;
      this.baseTerrain[r][c] = CELL.ROAD;
      this.grid[r][c] = CELL.ROAD;
      const idx = r * GRID_COLS + c;
      this.flatBase[idx] = CELL.ROAD;
      this.flatGrid[idx] = CELL.ROAD;
    }

    for (const [c, r] of this.rockCells) {
      if (!this.inBounds(c, r)) continue;
      const idx = r * GRID_COLS + c;
      // Never place a rock on a road, spawn, or FOB
      if (this.flatBase[idx] === CELL.ROAD) continue;
      this.baseTerrain[r][c] = CELL.ROCK;
      this.grid[r][c] = CELL.ROCK;
      this.flatBase[idx] = CELL.ROCK;
      this.flatGrid[idx] = CELL.ROCK;
    }

    for (const sp of this.spawnPoints) {
      this.baseTerrain[sp.row][sp.col] = CELL.SPAWN;
      this.grid[sp.row][sp.col] = CELL.SPAWN;
      const idx = sp.row * GRID_COLS + sp.col;
      this.flatBase[idx] = CELL.SPAWN;
      this.flatGrid[idx] = CELL.SPAWN;
    }

    const fobIdx = this.fobPoint.row * GRID_COLS + this.fobPoint.col;
    this.baseTerrain[this.fobPoint.row][this.fobPoint.col] = CELL.FOB;
    this.grid[this.fobPoint.row][this.fobPoint.col] = CELL.FOB;
    this.flatBase[fobIdx] = CELL.FOB;
    this.flatGrid[fobIdx] = CELL.FOB;

    this.recomputeNavigation();
  }

  inBounds(col, row) {
    return col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS;
  }

  isPassable(col, row) {
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return false;
    const t = this.flatGrid[row * GRID_COLS + col];
    return t === CELL.FREE || t === CELL.ROAD || t === CELL.SPAWN || t === CELL.FOB;
  }

  isBuildable(col, row) {
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return false;
    const t = this.flatGrid[row * GRID_COLS + col];
    return t === CELL.FREE || t === CELL.ROAD;
  }

  tileCost(col, row) {
    return this.flatBase[row * GRID_COLS + col] === CELL.ROAD ? 0.96 : 1.0;
  }

  /**
   * Checks whether placing a structure at (col, row) keeps valid A* routes
   * from all spawns AND all active ground enemies to the FOB.
   */
  canPlaceAt(col, row, activeGroundEnemies = []) {
    if (!this.isBuildable(col, row)) {
      return { ok: false, reason: 'Célula ocupada ou terreno intransponível.' };
    }

    const cellIdx = row * GRID_COLS + col;
    const prev = this.flatGrid[cellIdx];
    this.flatGrid[cellIdx] = CELL.BARRIER;
    this.grid[row][col] = CELL.BARRIER;

    let valid = true;
    const previewPaths = new Map();

    // 1. Validate every spawn point has a path to FOB
    for (let i = 0; i < this.spawnPoints.length; i++) {
      const sp = this.spawnPoints[i];
      const path = this.findPath(sp.col, sp.row);
      if (!path) {
        valid = false;
        break;
      }
      previewPaths.set(sp.id, path);
    }

    // 2. Validate no active ground enemy becomes trapped (using flat checkedMask, 0 allocations)
    if (valid && activeGroundEnemies.length > 0) {
      this.checkedMask.fill(0);
      for (let i = 0; i < activeGroundEnemies.length; i++) {
        const enemy = activeGroundEnemies[i];
        const ec = Math.floor(enemy.x / TILE_SIZE);
        const er = Math.floor(enemy.y / TILE_SIZE);
        if (ec < 0 || ec >= GRID_COLS || er < 0 || er >= GRID_ROWS) continue;
        if (ec === col && er === row) {
          valid = false;
          break;
        }
        const eIdx = er * GRID_COLS + ec;
        if (this.checkedMask[eIdx] === 0) {
          this.checkedMask[eIdx] = 1;
          if (!this.hasPathFast(ec, er)) {
            valid = false;
            break;
          }
        }
      }
    }

    this.flatGrid[cellIdx] = prev;
    this.grid[row][col] = prev;

    if (!valid) {
      return {
        ok: false,
        reason: 'ROTA BLOQUEADA: Proibido fechar 100% do caminho até a FOB!',
        previewPaths: null
      };
    }

    return { ok: true, previewPaths };
  }

  placeStructure(col, row, isBarrier) {
    const val = isBarrier ? CELL.BARRIER : CELL.TOWER;
    this.grid[row][col] = val;
    this.flatGrid[row * GRID_COLS + col] = val;
    this.recomputeNavigation();
  }

  removeStructure(col, row) {
    const baseVal = this.baseTerrain[row][col];
    this.grid[row][col] = baseVal;
    this.flatGrid[row * GRID_COLS + col] = baseVal;
    this.recomputeNavigation();
  }

  recomputeNavigation() {
    this.computeDistanceField();
    this.spawnPaths.clear();
    for (const sp of this.spawnPoints) {
      const path = this.findPath(sp.col, sp.row);
      if (path) this.spawnPaths.set(sp.id, path);
    }
  }

  /**
   * Reverse Dijkstra / weighted BFS from FOB using flat pre-allocated queues.
   */
  computeDistanceField() {
    for (let r = 0; r < GRID_ROWS; r++) {
      this.distField[r].fill(Infinity);
    }
    this.flatDist.fill(Infinity);

    const fobIdx = this.fobPoint.row * GRID_COLS + this.fobPoint.col;
    this.flatDist[fobIdx] = 0;
    this.distField[this.fobPoint.row][this.fobPoint.col] = 0;

    let head = 0;
    let tail = 0;
    this.bfsQueueIdx[tail] = fobIdx;
    this.bfsQueueDist[tail] = 0;
    tail++;

    while (head < tail) {
      const curIdx = this.bfsQueueIdx[head];
      const curDist = this.bfsQueueDist[head];
      head++;

      if (curDist > this.flatDist[curIdx]) continue;

      const cc = curIdx % GRID_COLS;
      const cr = (curIdx / GRID_COLS) | 0;

      for (let d = 0; d < 4; d++) {
        const nc = cc + DIRS[d].dc;
        const nr = cr + DIRS[d].dr;
        if (nc < 0 || nc >= GRID_COLS || nr < 0 || nr >= GRID_ROWS) continue;
        const nIdx = nr * GRID_COLS + nc;
        const t = this.flatGrid[nIdx];
        if (t !== CELL.FREE && t !== CELL.ROAD && t !== CELL.SPAWN && t !== CELL.FOB) continue;

        const stepCost = this.flatBase[nIdx] === CELL.ROAD ? 0.96 : 1.0;
        const nd = curDist + stepCost;
        if (nd < this.flatDist[nIdx]) {
          this.flatDist[nIdx] = nd;
          this.distField[nr][nc] = nd;
          this.bfsQueueIdx[tail] = nIdx;
          this.bfsQueueDist[tail] = nd;
          tail++;
        }
      }
    }
  }

  /**
   * Zero-alloc reachability check using flat pre-allocated buffers & binary min-heap.
   */
  hasPathFast(startCol, startRow) {
    return this.runAStar(startCol, startRow) !== -1;
  }

  /**
   * Standard A* pathfinder returning an array of world-coordinate waypoints
   * from (startCol, startRow) to fobPoint.
   */
  findPath(startCol, startRow) {
    const goalIdx = this.runAStar(startCol, startRow);
    if (goalIdx === -1) return null;
    return this.reconstructPath(goalIdx);
  }

  runAStar(startCol, startRow) {
    if (!this.isPassable(startCol, startRow)) return -1;

    const gScore = this.gScore;
    const fScore = this.fScore;
    const cameFrom = this.cameFrom;
    const closed = this.closed;
    const inOpen = this.inOpen;
    const heap = this.openHeap;
    const flatGrid = this.flatGrid;
    const flatBase = this.flatBase;

    gScore.fill(Infinity);
    fScore.fill(Infinity);
    cameFrom.fill(-1);
    closed.fill(0);
    inOpen.fill(0);

    const goalCol = this.fobPoint.col;
    const goalRow = this.fobPoint.row;
    const startIdx = startRow * GRID_COLS + startCol;
    const goalIdx = goalRow * GRID_COLS + goalCol;

    gScore[startIdx] = 0;
    fScore[startIdx] = (Math.abs(startCol - goalCol) + Math.abs(startRow - goalRow)) * 0.96;

    let heapSize = 0;
    heap[heapSize++] = startIdx;
    inOpen[startIdx] = 1;

    while (heapSize > 0) {
      // Pop min from binary heap
      const current = heap[0];
      heapSize--;
      if (heapSize > 0) {
        const last = heap[heapSize];
        let pos = 0;
        const lastF = fScore[last];
        while (true) {
          const left = (pos << 1) + 1;
          if (left >= heapSize) break;
          const right = left + 1;
          let smallest = left;
          if (right < heapSize && fScore[heap[right]] < fScore[heap[left]]) {
            smallest = right;
          }
          if (lastF <= fScore[heap[smallest]]) break;
          heap[pos] = heap[smallest];
          pos = smallest;
        }
        heap[pos] = last;
      }

      if (current === goalIdx) {
        return goalIdx;
      }

      inOpen[current] = 0;
      closed[current] = 1;

      const cc = current % GRID_COLS;
      const cr = (current / GRID_COLS) | 0;
      const curG = gScore[current];

      // Unrolled 4-neighbor expansion
      for (let d = 0; d < 4; d++) {
        const nc = cc + DIRS[d].dc;
        const nr = cr + DIRS[d].dr;
        if (nc < 0 || nc >= GRID_COLS || nr < 0 || nr >= GRID_ROWS) continue;
        const nIdx = nr * GRID_COLS + nc;
        if (closed[nIdx]) continue;

        const t = flatGrid[nIdx];
        if (t !== CELL.FREE && t !== CELL.ROAD && t !== CELL.SPAWN && t !== CELL.FOB) continue;

        const stepCost = flatBase[nIdx] === CELL.ROAD ? 0.96 : 1.0;
        const tentativeG = curG + stepCost;

        if (tentativeG < gScore[nIdx]) {
          cameFrom[nIdx] = current;
          gScore[nIdx] = tentativeG;
          const newF = tentativeG + (Math.abs(nc - goalCol) + Math.abs(nr - goalRow)) * 0.96;
          fScore[nIdx] = newF;

          if (!inOpen[nIdx]) {
            inOpen[nIdx] = 1;
            let pos = heapSize++;
            while (pos > 0) {
              const parent = (pos - 1) >> 1;
              if (newF >= fScore[heap[parent]]) break;
              heap[pos] = heap[parent];
              pos = parent;
            }
            heap[pos] = nIdx;
          } else {
            // Sift up if already in heap
            let pos = -1;
            for (let k = 0; k < heapSize; k++) {
              if (heap[k] === nIdx) {
                pos = k;
                break;
              }
            }
            while (pos > 0) {
              const parent = (pos - 1) >> 1;
              if (newF >= fScore[heap[parent]]) break;
              const tmp = heap[parent];
              heap[parent] = heap[pos];
              heap[pos] = tmp;
              pos = parent;
            }
          }
        }
      }
    }

    return -1;
  }

  reconstructPath(current) {
    const tiles = [];
    const cameFrom = this.cameFrom;
    while (current !== -1) {
      const c = current % GRID_COLS;
      const r = (current / GRID_COLS) | 0;
      tiles.push({
        col: c,
        row: r,
        x: c * TILE_SIZE + TILE_SIZE * 0.5,
        y: r * TILE_SIZE + TILE_SIZE * 0.5
      });
      current = cameFrom[current];
    }
    tiles.reverse();
    return tiles;
  }

  getDistanceToFobPx(x, y) {
    const col = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(x / TILE_SIZE)));
    const row = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(y / TILE_SIZE)));
    const d = this.flatDist[row * GRID_COLS + col];
    if (!Number.isFinite(d)) {
      return Math.hypot(
        (this.fobPoint.col + 0.5) * TILE_SIZE - x,
        (this.fobPoint.row + 0.5) * TILE_SIZE - y
      );
    }
    return d * TILE_SIZE;
  }
}
