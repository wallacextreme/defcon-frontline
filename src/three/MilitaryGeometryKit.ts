import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface SeededRng {
  (): number;
  next(): number;
  range(min: number, max: number): number;
  int(min: number, max: number): number;
  fork(salt: string | number): SeededRng;
}

/**
 * Deterministic 32-bit FNV-1a seed hash across arbitrary string/number parts.
 */
export function hashSeed(...parts: ReadonlyArray<string | number>): number {
  let h = 0x811c9dc5;
  for (let p = 0; p < parts.length; p++) {
    const s = String(parts[p]);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    // Field separator so ('ab','c') !== ('a','bc').
    h ^= 0xff;
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Deterministic Mulberry32 PRNG (callable and method-accessible). Fully seeded and repeatable.
 */
export function createSeededRng(seed: number | string): SeededRng {
  let state = typeof seed === 'number' ? seed >>> 0 : hashSeed(seed);

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const rng = next as SeededRng;
  rng.next = next;
  rng.range = (min: number, max: number): number => min + (max - min) * next();
  rng.int = (min: number, max: number): number => {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    if (hi <= lo) return lo;
    return lo + Math.floor(next() * (hi - lo + 1));
  };
  rng.fork = (salt: string | number): SeededRng => createSeededRng(hashSeed(state, salt));

  return rng;
}

const geometryCache = new Map<string, THREE.BufferGeometry>();
let contactShadowTexture: THREE.Texture | null = null;
let contactShadowPlaneGeo: THREE.BufferGeometry | null = null;
const contactShadowMatCache = new Map<number, THREE.MeshBasicMaterial>();

function quantKey(v: number): string {
  return (Math.round(v * 10000) / 10000).toFixed(4);
}

/**
 * Returns a cached beveled RoundedBoxGeometry (note Three.js param order: segments before radius).
 */
export function getRoundedBoxGeo(
  w: number,
  h: number,
  d: number,
  radius?: number,
  segments = 2
): THREE.BufferGeometry {
  const minDim = Math.max(1e-4, Math.min(w, h, d));
  const rawRadius = radius ?? minDim * 0.12;
  const clampedRadius = Math.max(0.001, Math.min(rawRadius, minDim * 0.45));
  const clampedSegs = Math.max(1, Math.min(6, Math.round(segments)));

  const key = `rbox_${quantKey(w)}_${quantKey(h)}_${quantKey(d)}_${quantKey(clampedRadius)}_${clampedSegs}`;
  let geo = geometryCache.get(key);
  if (!geo) {
    geo = new RoundedBoxGeometry(w, h, d, clampedSegs, clampedRadius);
    geometryCache.set(key, geo);
  }
  return geo;
}

/**
 * Returns a cached closed chamfered cylinder/frustum built via LatheGeometry with outward normals.
 */
export function getChamferedCylinderGeo(
  rTop: number,
  rBot: number,
  h: number,
  radialSegs = 16,
  bevel?: number
): THREE.BufferGeometry {
  const safeTop = Math.max(0, rTop);
  const safeBot = Math.max(0, rBot);
  const safeH = Math.max(1e-4, h);
  const segs = Math.max(6, Math.min(48, Math.round(radialSegs)));

  const refR = Math.min(safeTop > 0 ? safeTop : safeBot, safeBot > 0 ? safeBot : safeTop);
  const defaultBevel = Math.min(Math.max(0.004, refR * 0.15), safeH * 0.18);
  const bH = Math.max(0, Math.min(bevel ?? defaultBevel, safeH * 0.42));
  const bTop = safeTop > 0 ? Math.min(bH, safeTop * 0.85) : 0;
  const bBot = safeBot > 0 ? Math.min(bH, safeBot * 0.85) : 0;

  const key = `ccyl_${quantKey(safeTop)}_${quantKey(safeBot)}_${quantKey(safeH)}_${segs}_${quantKey(bH)}`;
  let geo = geometryCache.get(key);
  if (!geo) {
    const halfH = safeH * 0.5;
    const points: THREE.Vector2[] = [];

    // Ordered bottom -> top so LatheGeometry emits outward-facing normals.
    points.push(new THREE.Vector2(0, -halfH));
    if (safeBot > 0) {
      if (bBot > 1e-5) {
        points.push(new THREE.Vector2(Math.max(0.0005, safeBot - bBot), -halfH));
        points.push(new THREE.Vector2(safeBot, -halfH + bH));
      } else {
        points.push(new THREE.Vector2(safeBot, -halfH));
      }
    }

    // Hard-surface support loops keep the cylinder wall shading crisp while chamfers catch rim light.
    if (bH > 1e-5 && safeH > bH * 3.5 && safeBot > 0 && safeTop > 0) {
      const wallSpan = safeH - 2 * bH;
      const inset = Math.min(bH * 0.45, wallSpan * 0.12);
      const tLo = inset / wallSpan;
      const tHi = 1 - tLo;
      points.push(new THREE.Vector2(safeBot + (safeTop - safeBot) * tLo, -halfH + bH + inset));
      points.push(new THREE.Vector2(safeBot + (safeTop - safeBot) * tHi, halfH - bH - inset));
    }

    if (safeTop > 0) {
      if (bTop > 1e-5) {
        points.push(new THREE.Vector2(safeTop, halfH - bH));
        points.push(new THREE.Vector2(Math.max(0.0005, safeTop - bTop), halfH));
      } else {
        points.push(new THREE.Vector2(safeTop, halfH));
      }
    }
    points.push(new THREE.Vector2(0, halfH));

    geo = new THREE.LatheGeometry(points, segs);
    geo.computeVertexNormals();
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    geometryCache.set(key, geo);
  }
  return geo;
}

export interface NormalizeForMergeOptions {
  includeColor?: boolean;
  defaultColor?: THREE.ColorRepresentation;
}

/**
 * Returns a fresh non-indexed BufferGeometry normalized to matching attributes
 * (`position`, `normal`, `uv`, and optional RGB `color`) so BufferGeometryUtils.mergeGeometries
 * never returns null. Does not mutate the input geometry.
 */
export function normalizeForMerge(
  geo: THREE.BufferGeometry,
  opts?: NormalizeForMergeOptions
): THREE.BufferGeometry {
  const out = geo.index ? geo.toNonIndexed() : geo.clone();
  const posAttr = out.getAttribute('position');
  const vertCount = posAttr ? posAttr.count : 0;

  if (!out.getAttribute('normal')) {
    out.computeVertexNormals();
  }

  if (!out.getAttribute('uv')) {
    const uvs = new Float32Array(vertCount * 2);
    if (posAttr) {
      for (let i = 0; i < vertCount; i++) {
        uvs[i * 2] = posAttr.getX(i) * 0.5 + 0.5;
        uvs[i * 2 + 1] = posAttr.getZ(i) * 0.5 + 0.5;
      }
    }
    out.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  }

  const includeColor = Boolean(opts?.includeColor);
  if (includeColor) {
    const existing = out.getAttribute('color');
    if (!existing) {
      const c = new THREE.Color(opts?.defaultColor ?? 0xffffff);
      const colors = new Float32Array(vertCount * 3);
      for (let i = 0; i < vertCount; i++) {
        const o = i * 3;
        colors[o] = c.r;
        colors[o + 1] = c.g;
        colors[o + 2] = c.b;
      }
      out.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    } else if (existing.itemSize !== 3 || !(existing.array instanceof Float32Array)) {
      const colors = new Float32Array(vertCount * 3);
      for (let i = 0; i < vertCount; i++) {
        const o = i * 3;
        colors[o] = existing.getX(i);
        colors[o + 1] = existing.getY(i);
        colors[o + 2] = existing.getZ(i);
      }
      out.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
  }

  // Strip any extra attributes (e.g., tangent, uv1, or mismatched color) and morph targets.
  for (const name of Object.keys(out.attributes)) {
    if (name === 'position' || name === 'normal' || name === 'uv') continue;
    if (includeColor && name === 'color') continue;
    out.deleteAttribute(name);
  }

  out.morphAttributes = {};
  out.morphTargetsRelative = false;
  out.clearGroups();
  return out;
}

export interface MergeStaticGeometriesOptions {
  preserveVertexColors?: boolean;
  disposeInputs?: boolean;
}

/**
 * Safely merges static BufferGeometries (mixing indexed & non-indexed, with or without vertex colors)
 * into a single non-indexed BufferGeometry. Never returns null for valid non-empty inputs.
 */
export function mergeStaticGeometries(
  geos: ReadonlyArray<THREE.BufferGeometry>,
  opts?: MergeStaticGeometriesOptions
): THREE.BufferGeometry {
  const valid = geos.filter((g) => {
    const pos = g?.getAttribute('position');
    return Boolean(pos && pos.count > 0);
  });

  if (valid.length === 0) {
    return new THREE.BufferGeometry();
  }

  const includeColor = opts?.preserveVertexColors ?? valid.some((g) => Boolean(g.getAttribute('color')));
  const normalized: THREE.BufferGeometry[] = new Array(valid.length);
  for (let i = 0; i < valid.length; i++) {
    normalized[i] = normalizeForMerge(valid[i], { includeColor });
  }

  const merged = mergeGeometries(normalized, false);

  for (let i = 0; i < normalized.length; i++) {
    normalized[i].dispose();
  }
  if (opts?.disposeInputs) {
    for (let i = 0; i < geos.length; i++) {
      geos[i]?.dispose();
    }
  }

  if (!merged) {
    throw new Error('MilitaryGeometryKit.mergeStaticGeometries: failed to merge normalized geometries');
  }

  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}

/**
 * Extracts crisp silhouette/crease line segments via EdgesGeometry for ghost previews.
 * Accepts either a single geometry or an array of geometries merged into one BufferGeometry.
 */
export function createGhostEdges(
  geos: THREE.BufferGeometry | ReadonlyArray<THREE.BufferGeometry>,
  thresholdAngle = 24
): THREE.BufferGeometry {
  const list = Array.isArray(geos) ? geos : [geos];
  if (list.length === 0) return new THREE.BufferGeometry();
  if (list.length === 1) {
    return new THREE.EdgesGeometry(list[0], thresholdAngle);
  }

  const edgeGeos: THREE.EdgesGeometry[] = [];
  let totalFloats = 0;
  for (let i = 0; i < list.length; i++) {
    const g = list[i];
    if (!g || !g.getAttribute('position')) continue;
    const eg = new THREE.EdgesGeometry(g, thresholdAngle);
    const pos = eg.getAttribute('position');
    if (pos && pos.count > 0) {
      edgeGeos.push(eg);
      totalFloats += pos.count * 3;
    } else {
      eg.dispose();
    }
  }

  const combined = new Float32Array(totalFloats);
  let offset = 0;
  for (let i = 0; i < edgeGeos.length; i++) {
    const pos = edgeGeos[i].getAttribute('position');
    const arr = pos.array as Float32Array;
    combined.set(arr, offset);
    offset += arr.length;
    edgeGeos[i].dispose();
  }

  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(combined, 3));
  out.computeBoundingBox();
  out.computeBoundingSphere();
  return out;
}

function getContactShadowTexture(): THREE.Texture {
  if (contactShadowTexture) return contactShadowTexture;

  const size = 64;
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const half = size * 0.5;
      const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0.0, 'rgba(0, 0, 0, 1.0)');
      grad.addColorStop(0.45, 'rgba(0, 0, 0, 0.72)');
      grad.addColorStop(0.75, 'rgba(0, 0, 0, 0.24)');
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
      contactShadowTexture = tex;
      return tex;
    }
  }

  // Headless / Node fallback DataTexture with identical radial falloff.
  const data = new Uint8Array(size * size * 4);
  const half = (size - 1) * 0.5;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x - half) / half;
      const dy = (y - half) / half;
      const dist = Math.min(1, Math.hypot(dx, dy));
      const inv = 1 - dist;
      const alpha = inv * inv * (3 - 2 * inv);
      const idx = (y * size + x) * 4;
      data[idx] = 0;
      data[idx + 1] = 0;
      data[idx + 2] = 0;
      data[idx + 3] = Math.round(alpha * 255);
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  contactShadowTexture = tex;
  return tex;
}

function getContactShadowPlaneGeo(): THREE.BufferGeometry {
  if (!contactShadowPlaneGeo) {
    const geo = new THREE.PlaneGeometry(2, 2);
    geo.rotateX(-Math.PI / 2);
    contactShadowPlaneGeo = geo;
  }
  return contactShadowPlaneGeo;
}

/**
 * Creates a soft ground-contact shadow decal mesh (`y = 0.025`, `depthWrite = false`,
 * `userData.noShadow = true`) using a shared cached radial texture and unit plane.
 */
export function createContactShadowMesh(radius = 1.65, opacity = 0.42): THREE.Mesh {
  const safeRadius = Math.max(0.1, radius);
  const safeOpacity = Math.max(0, Math.min(1, opacity));
  const opacityBucket = Math.round(safeOpacity * 100);

  let mat = contactShadowMatCache.get(opacityBucket);
  if (!mat) {
    mat = new THREE.MeshBasicMaterial({
      map: getContactShadowTexture(),
      transparent: true,
      opacity: opacityBucket / 100,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    contactShadowMatCache.set(opacityBucket, mat);
  }

  const mesh = new THREE.Mesh(getContactShadowPlaneGeo(), mat);
  mesh.name = 'ContactShadow';
  mesh.position.y = 0.025;
  mesh.scale.set(safeRadius, 1, safeRadius);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.renderOrder = 1;
  mesh.userData.noShadow = true;
  mesh.userData.sharedResources = true;
  return mesh;
}

/**
 * Bakes smooth vertical ambient occlusion into a geometry's RGB `color` vertex attribute.
 * All resulting color channels are guaranteed finite and clamped to [0, 1].
 */
export function applyVerticalAOToGeometry(
  geo: THREE.BufferGeometry,
  minY?: number,
  maxY?: number,
  bottomFactor = 0.55
): THREE.BufferGeometry {
  const posAttr = geo.getAttribute('position');
  if (!posAttr || posAttr.count === 0) return geo;

  let loY = minY;
  let hiY = maxY;
  if (loY === undefined || hiY === undefined) {
    if (!geo.boundingBox) geo.computeBoundingBox();
    const bb = geo.boundingBox;
    if (loY === undefined) loY = bb ? bb.min.y : 0;
    if (hiY === undefined) hiY = bb ? bb.max.y : 1;
  }

  const clampedBottom = Math.max(0, Math.min(1, bottomFactor));
  const span = Math.max(1e-5, hiY - loY);
  const count = posAttr.count;
  const existing = geo.getAttribute('color');
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const y = posAttr.getY(i);
    const t = Math.max(0, Math.min(1, (y - loY) / span));
    const smooth = t * t * (3 - 2 * t);
    const ao = Math.max(0, Math.min(1, clampedBottom + (1 - clampedBottom) * smooth));
    const o = i * 3;

    if (existing) {
      colors[o] = Math.max(0, Math.min(1, existing.getX(i) * ao));
      colors[o + 1] = Math.max(0, Math.min(1, existing.getY(i) * ao));
      colors[o + 2] = Math.max(0, Math.min(1, existing.getZ(i) * ao));
    } else {
      colors[o] = ao;
      colors[o + 1] = ao;
      colors[o + 2] = ao;
    }
  }

  const colorAttr = new THREE.BufferAttribute(colors, 3);
  colorAttr.needsUpdate = true;
  geo.setAttribute('color', colorAttr);
  return geo;
}

/**
 * Disposes all cached primitives and contact-shadow resources held by MilitaryGeometryKit.
 */
export function disposeMilitaryGeometryKitCache(): void {
  for (const geo of geometryCache.values()) {
    geo.dispose();
  }
  geometryCache.clear();

  if (contactShadowPlaneGeo) {
    contactShadowPlaneGeo.dispose();
    contactShadowPlaneGeo = null;
  }
  for (const mat of contactShadowMatCache.values()) {
    mat.dispose();
  }
  contactShadowMatCache.clear();
  if (contactShadowTexture) {
    contactShadowTexture.dispose();
    contactShadowTexture = null;
  }
}
