import * as THREE from 'three';
import { GRID_COLS, GRID_ROWS, TILE_SIZE, CELL } from '../systems/Pathfinder.js';
import {
  applyVerticalAOToGeometry,
  createSeededRng,
  getChamferedCylinderGeo,
  getRoundedBoxGeo,
  hashSeed,
  mergeStaticGeometries
} from './MilitaryGeometryKit.ts';
import { createPBRMaterial } from './ProceduralPBRTextures.ts';
import { computeSobelNormals } from './SurfaceShaderKit.ts';

export type BiomePropsWorldBiome =
  | 'desert'
  | 'arctic'
  | 'industrial'
  | 'forest'
  | 'canyon'
  | 'swamp'
  | 'volcanic';

export interface BiomePropsStageFeatures {
  iceCells?: Array<[number, number]>;
  fogCells?: Array<[number, number]>;
  toxicCells?: Array<[number, number]>;
  lavaCells?: Array<[number, number]>;
  restrictedCells?: Array<[number, number]>;
}

export interface BiomePropsTheme {
  rockPrimary?: number;
  rockSecondary?: number;
  foliageA?: number;
  foliageB?: number;
  scrub?: number;
  trimColor?: number;
}

export interface BiomePropsParams {
  baseTerrain: Uint8Array[];
  biome: BiomePropsWorldBiome;
  theme?: BiomePropsTheme;
  stageFeatures?: BiomePropsStageFeatures;
  getMicroReliefY?: (wx: number, wz: number) => number;
  steelMat?: THREE.Material;
  oliveMat?: THREE.Material;
  hazardRedMat?: THREE.Material;
  sandbagMat?: THREE.Material;
  warmLampMat?: THREE.Material;
}

export interface BiomePropsHandles {
  group: THREE.Group;
  update: (elapsed: number, dt: number) => void;
  dispose: () => void;
}

// Local world-coordinate constants (zero circular dependency on TerrainDiorama3D.ts)
const CELL_WORLD = 4.0;
const BOARD_W = GRID_COLS * CELL_WORLD; // 112
const BOARD_D = GRID_ROWS * CELL_WORLD; // 64
// Keep TILE_SIZE referenced so bundler/strip-types validates the import cleanly
const _WORLD_SCALE_CHECK = CELL_WORLD / TILE_SIZE;
void _WORLD_SCALE_CHECK;

function cellToWorldCenter(col: number, row: number): { x: number; z: number } {
  return {
    x: (col + 0.5) * CELL_WORLD - BOARD_W * 0.5,
    z: (row + 0.5) * CELL_WORLD - BOARD_D * 0.5
  };
}

// Reusable build-time scratch objects (never allocated inside update())
const _tmpMatrix = new THREE.Matrix4();
const _tmpQuat = new THREE.Quaternion();
const _tmpEuler = new THREE.Euler();
const _tmpPos = new THREE.Vector3();
const _tmpScale = new THREE.Vector3();
const _tmpColor = new THREE.Color();
const _tmpColorA = new THREE.Color();
const _tmpColorB = new THREE.Color();
const _tmpColorC = new THREE.Color();

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const span = edge1 - edge0;
  if (span <= 1e-6) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / span);
  return t * t * (3 - 2 * t);
}

function hasCanvasDocument(): boolean {
  return typeof document !== 'undefined' && typeof document.createElement === 'function';
}

function makeSafePBRMaterial(
  key: string,
  overrides: THREE.MeshStandardMaterialParameters
): THREE.MeshStandardMaterial {
  if (hasCanvasDocument()) {
    return createPBRMaterial(key, overrides);
  }
  const { bumpScale: _bs, ...clean } = overrides;
  void _bs;
  return new THREE.MeshStandardMaterial(clean);
}

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

function setUniformVertexColor(geo: THREE.BufferGeometry, hex: number): THREE.BufferGeometry {
  const pos = geo.getAttribute('position');
  if (!pos) return geo;
  _tmpColor.setHex(hex);
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const o = i * 3;
    colors[o] = _tmpColor.r;
    colors[o + 1] = _tmpColor.g;
    colors[o + 2] = _tmpColor.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

function bakeVertexColors(
  geo: THREE.BufferGeometry,
  colorFn: (x: number, y: number, z: number, nx: number, ny: number, nz: number, out: THREE.Color) => void
): THREE.BufferGeometry {
  const pos = geo.getAttribute('position');
  if (!pos) return geo;
  if (!geo.getAttribute('normal')) geo.computeVertexNormals();
  const norm = geo.getAttribute('normal');
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    colorFn(
      pos.getX(i),
      pos.getY(i),
      pos.getZ(i),
      norm.getX(i),
      norm.getY(i),
      norm.getZ(i),
      _tmpColor
    );
    const o = i * 3;
    colors[o] = clamp01(_tmpColor.r);
    colors[o + 1] = clamp01(_tmpColor.g);
    colors[o + 2] = clamp01(_tmpColor.b);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

function selectNonAdjacentVariant(
  c: number,
  r: number,
  salt: string,
  count: number,
  variantByCell: Map<string, number>
): number {
  let v = hashSeed(salt, c, r) % count;
  const prevAbove = variantByCell.get(`${c},${r - 1}`);
  const prevLeft = variantByCell.get(`${c - 1},${r}`);
  if (v === prevAbove || v === prevLeft) {
    v = (v + 1) % count;
    if (count > 2 && (v === prevAbove || v === prevLeft)) {
      v = (v + 1) % count;
    }
  }
  variantByCell.set(`${c},${r}`, v);
  return v;
}

// ============================================================================
// GPU SHADERS (Three.js r187 / WebGL2 GLSL ES 3.00)
// ============================================================================

export interface FoliageWindUniforms {
  uTime: { value: number };
  uWindStrength: { value: number };
  uWindFreq: { value: number };
}

const FOLIAGE_WIND_VERT_PARS = /* glsl */ `
#include <common>
uniform float uTime;
uniform float uWindStrength;
uniform float uWindFreq;
`;

const FOLIAGE_WIND_VERT_BODY = /* glsl */ `
#include <begin_vertex>
vec2 defconWindWorldXZ = modelMatrix[3].xz;
#ifdef USE_INSTANCING
  defconWindWorldXZ += instanceMatrix[3].xz;
#endif
float defconWindPhase = defconWindWorldXZ.x * 0.27 + defconWindWorldXZ.y * 0.31 + position.y * 0.85;
float defconWindLift = clamp( ( transformed.y - 0.14 ) * 0.58, 0.0, 1.4 );
float defconWindWeight = defconWindLift * defconWindLift * uWindStrength;
float defconSwayX = sin( uTime * uWindFreq + defconWindPhase )
                  + 0.32 * sin( uTime * uWindFreq * 1.93 + defconWindPhase * 1.65 );
float defconSwayZ = cos( uTime * uWindFreq * 0.84 + defconWindPhase * 1.28 );
transformed.x += defconSwayX * defconWindWeight;
transformed.z += defconSwayZ * defconWindWeight * 0.72;
`;

function createFoliageWindMaterial(opts: {
  windStrength: number;
  windFreq: number;
  roughness?: number;
  envMapIntensity?: number;
}): { material: THREE.MeshStandardMaterial; uniforms: FoliageWindUniforms } {
  const uniforms: FoliageWindUniforms = {
    uTime: { value: 0 },
    uWindStrength: { value: opts.windStrength },
    uWindFreq: { value: opts.windFreq }
  };

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: opts.roughness ?? 0.86,
    metalness: 0.0,
    envMapIntensity: opts.envMapIntensity ?? 0.65,
    vertexColors: true,
    flatShading: true
  });

  material.customProgramCacheKey = () => 'defcon_foliage_wind_v1';
  material.userData.defconWindUniforms = uniforms;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uWindStrength = uniforms.uWindStrength;
    shader.uniforms.uWindFreq = uniforms.uWindFreq;

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', FOLIAGE_WIND_VERT_PARS)
      .replace('#include <begin_vertex>', FOLIAGE_WIND_VERT_BODY);
  };
  material.needsUpdate = true;

  return { material, uniforms };
}

// Lava flow shader (<= 0.75 Hz slow geological crust + magma fissures)
const LAVA_VERT_PARS = /* glsl */ `
#include <common>
varying vec3 vDefconLavaWorldPos;
varying vec2 vDefconLavaUv;
`;

const LAVA_VERT_BODY = /* glsl */ `
#include <worldpos_vertex>
vec4 defconLavaWp = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
  defconLavaWp = batchingMatrix * defconLavaWp;
#endif
#ifdef USE_INSTANCING
  defconLavaWp = instanceMatrix * defconLavaWp;
#endif
defconLavaWp = modelMatrix * defconLavaWp;
vDefconLavaWorldPos = defconLavaWp.xyz;
vDefconLavaUv = uv;
`;

const LAVA_FRAG_PARS = /* glsl */ `
#include <common>
uniform float uTime;
varying vec3 vDefconLavaWorldPos;
varying vec2 vDefconLavaUv;

float defconLavaHash( vec2 p ) {
  vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
  p3 += dot( p3, p3.yzx + 33.33 );
  return fract( ( p3.x + p3.y ) * p3.z );
}

float defconLavaNoise( vec2 p ) {
  vec2 i = floor( p );
  vec2 f = fract( p );
  vec2 u = f * f * ( 3.0 - 2.0 * f );
  float a = defconLavaHash( i );
  float b = defconLavaHash( i + vec2( 1.0, 0.0 ) );
  float c = defconLavaHash( i + vec2( 0.0, 1.0 ) );
  float d = defconLavaHash( i + vec2( 1.0, 1.0 ) );
  return mix( mix( a, b, u.x ), mix( c, d, u.x ), u.y );
}

float defconLavaFbm( vec2 p ) {
  float sum = 0.0;
  float amp = 0.5;
  for ( int i = 0; i < 3; i++ ) {
    sum += amp * defconLavaNoise( p );
    p = p * 2.07 + vec2( 13.7, 7.3 );
    amp *= 0.5;
  }
  return sum;
}
`;

const LAVA_FRAG_COLOR = /* glsl */ `
#include <color_fragment>
// Slow geological drift strictly <= 0.75 Hz (pulse ~0.24 Hz)
float defconLavaSlow = uTime * 0.22;
vec2 defconLavaP = vDefconLavaWorldPos.xz * 0.62;
vec2 defconLavaWarp = vec2(
  defconLavaFbm( defconLavaP + vec2( defconLavaSlow * 0.35, -defconLavaSlow * 0.22 ) ),
  defconLavaFbm( defconLavaP + vec2( 5.2 - defconLavaSlow * 0.25, 1.3 + defconLavaSlow * 0.30 ) )
);
float defconLavaField = defconLavaFbm( defconLavaP * 1.45 + defconLavaWarp * 1.35 );
// Crisp dark basalt plates (~82-86% cooled obsidian crust) cut by narrow glowing magma fissures
float defconCrackRaw = clamp( 1.0 - abs( ( defconLavaField - 0.5 ) * 3.1 ), 0.0, 1.0 );
float defconEdgeDist = min( min( vDefconLavaUv.x, 1.0 - vDefconLavaUv.x ), min( vDefconLavaUv.y, 1.0 - vDefconLavaUv.y ) );
float defconInnerMask = smoothstep( 0.07, 0.27, defconEdgeDist );
float defconFissure = smoothstep( 0.78, 0.95, defconCrackRaw ) * defconInnerMask;
float defconHotCore = smoothstep( 0.90, 0.99, defconCrackRaw ) * defconInnerMask;
float defconPulse = 0.85 + 0.15 * sin( uTime * 1.45 + defconLavaWarp.x * 5.2 );

vec3 defconCrustDark = vec3( 0.014, 0.011, 0.012 );
vec3 defconCrustChar = vec3( 0.045, 0.022, 0.017 );
vec3 defconLavaBase = mix( defconCrustDark, defconCrustChar, smoothstep( 0.52, 0.84, defconCrackRaw ) );
diffuseColor.rgb = mix( defconLavaBase, vec3( 0.20, 0.045, 0.012 ), defconFissure * 0.85 );
`;

const LAVA_FRAG_ROUGHNESS = /* glsl */ `
#include <roughnessmap_fragment>
roughnessFactor = mix( 0.94, 0.42, defconFissure );
`;

const LAVA_FRAG_EMISSIVE = /* glsl */ `
#include <emissivemap_fragment>
vec3 defconMagmaOrange = vec3( 0.92, 0.19, 0.018 );
vec3 defconMagmaCore = vec3( 1.42, 0.52, 0.07 );
vec3 defconLavaGlow = mix( defconMagmaOrange, defconMagmaCore, defconHotCore ) * defconFissure * defconPulse * 1.05;
totalEmissiveRadiance += defconLavaGlow;
`;

function createLavaFlowMaterial(): { material: THREE.MeshStandardMaterial; uTime: { value: number } } {
  const uTime = { value: 0 };
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0.04,
    envMapIntensity: 0.45
  });
  material.customProgramCacheKey = () => 'defcon_lava_flow_v1';
  material.userData.defconTimeUniform = uTime;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', LAVA_VERT_PARS)
      .replace('#include <worldpos_vertex>', LAVA_VERT_BODY);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', LAVA_FRAG_PARS)
      .replace('#include <color_fragment>', LAVA_FRAG_COLOR)
      .replace('#include <roughnessmap_fragment>', LAVA_FRAG_ROUGHNESS)
      .replace('#include <emissivemap_fragment>', LAVA_FRAG_EMISSIVE);
  };
  material.needsUpdate = true;
  return { material, uTime };
}

// Toxic viscous pool shader (<= 0.8 Hz slow bubbling rings, emissive <= 5% area)
const TOXIC_VERT_PARS = /* glsl */ `
#include <common>
varying vec3 vDefconToxicWorldPos;
varying vec2 vDefconToxicUv;
`;

const TOXIC_VERT_BODY = /* glsl */ `
#include <worldpos_vertex>
vec4 defconToxWp = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
  defconToxWp = batchingMatrix * defconToxWp;
#endif
#ifdef USE_INSTANCING
  defconToxWp = instanceMatrix * defconToxWp;
#endif
defconToxWp = modelMatrix * defconToxWp;
vDefconToxicWorldPos = defconToxWp.xyz;
vDefconToxicUv = uv;
`;

const TOXIC_FRAG_PARS = /* glsl */ `
#include <common>
uniform float uTime;
varying vec3 vDefconToxicWorldPos;
varying vec2 vDefconToxicUv;

float defconToxHash( vec2 p ) {
  vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
  p3 += dot( p3, p3.yzx + 33.33 );
  return fract( ( p3.x + p3.y ) * p3.z );
}

float defconToxNoise( vec2 p ) {
  vec2 i = floor( p );
  vec2 f = fract( p );
  vec2 u = f * f * ( 3.0 - 2.0 * f );
  float a = defconToxHash( i );
  float b = defconToxHash( i + vec2( 1.0, 0.0 ) );
  float c = defconToxHash( i + vec2( 0.0, 1.0 ) );
  float d = defconToxHash( i + vec2( 1.0, 1.0 ) );
  return mix( mix( a, b, u.x ), mix( c, d, u.x ), u.y );
}
`;

const TOXIC_FRAG_COLOR = /* glsl */ `
#include <color_fragment>
// Viscous mire swirl & slow concentric bubble rings (<= 0.8 Hz, ~0.35 Hz cycle)
vec2 defconToxP = vDefconToxicWorldPos.xz * 0.85;
float defconSwirlA = defconToxNoise( defconToxP + vec2( uTime * 0.14, -uTime * 0.11 ) );
float defconSwirlB = defconToxNoise( defconToxP * 2.1 + vec2( -uTime * 0.16, uTime * 0.13 ) );

// Cellular bubble sites (each cell spawns 1 slow-expanding thin ring + pop highlight)
vec2 defconCellId = floor( defconToxP * 1.15 );
vec2 defconCellUv = fract( defconToxP * 1.15 );
float defconSiteRnd = defconToxHash( defconCellId );
vec2 defconSiteCenter = vec2( 0.25 + 0.5 * defconSiteRnd, 0.25 + 0.5 * defconToxHash( defconCellId + 17.3 ) );
float defconSiteDist = length( defconCellUv - defconSiteCenter );
float defconCycle = fract( uTime * 0.34 + defconSiteRnd );
float defconRingR = defconCycle * 0.38;
float defconRingFade = smoothstep( 0.0, 0.14, defconCycle ) * ( 1.0 - smoothstep( 0.55, 1.0, defconCycle ) );
float defconRingBand = exp( -pow( ( defconSiteDist - defconRingR ) * 26.0, 2.0 ) ) * defconRingFade;
float defconBubbleDot = smoothstep( 0.075, 0.015, defconSiteDist ) * smoothstep( 0.0, 0.10, defconCycle ) * ( 1.0 - smoothstep( 0.22, 0.34, defconCycle ) );

float defconToxEdge = min( min( vDefconToxicUv.x, 1.0 - vDefconToxicUv.x ), min( vDefconToxicUv.y, 1.0 - vDefconToxicUv.y ) );
float defconToxInner = smoothstep( 0.02, 0.18, defconToxEdge );
float defconToxAccent = clamp( ( defconRingBand * 0.85 + defconBubbleDot ) * defconToxInner, 0.0, 1.0 );

vec3 defconSludgeDeep = vec3( 0.022, 0.044, 0.024 );
vec3 defconSludgeMid = vec3( 0.052, 0.105, 0.036 );
vec3 defconSludgeRim = vec3( 0.11, 0.21, 0.055 );
vec3 defconPoolCol = mix( defconSludgeDeep, defconSludgeMid, clamp( defconSwirlA * 0.65 + defconSwirlB * 0.35, 0.0, 1.0 ) );
defconPoolCol = mix( defconPoolCol, defconSludgeRim, defconToxAccent * 0.72 );
diffuseColor.rgb = defconPoolCol;
`;

const TOXIC_FRAG_ROUGHNESS = /* glsl */ `
#include <roughnessmap_fragment>
roughnessFactor = mix( 0.30, 0.16, defconToxAccent );
`;

const TOXIC_FRAG_EMISSIVE = /* glsl */ `
#include <emissivemap_fragment>
// Strictly localized bright lime crests keeping emissive footprint <= 5% of pool area
float defconToxGlowMask = smoothstep( 0.45, 0.92, defconToxAccent );
totalEmissiveRadiance += vec3( 0.38, 0.78, 0.08 ) * defconToxGlowMask * 1.1;
`;

function createToxicPoolMaterial(): { material: THREE.MeshStandardMaterial; uTime: { value: number } } {
  const uTime = { value: 0 };
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.28,
    metalness: 0.04,
    envMapIntensity: 0.72
  });
  material.customProgramCacheKey = () => 'defcon_toxic_pool_v1';
  material.userData.defconTimeUniform = uTime;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', TOXIC_VERT_PARS)
      .replace('#include <worldpos_vertex>', TOXIC_VERT_BODY);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', TOXIC_FRAG_PARS)
      .replace('#include <color_fragment>', TOXIC_FRAG_COLOR)
      .replace('#include <roughnessmap_fragment>', TOXIC_FRAG_ROUGHNESS)
      .replace('#include <emissivemap_fragment>', TOXIC_FRAG_EMISSIVE);
  };
  material.needsUpdate = true;
  return { material, uTime };
}

// ============================================================================
// PROCEDURAL TEXTURES FOR SPECIAL ENVIRONMENTAL TILES (Tracked & Disposed)
// ============================================================================

function createRestrictedHazardTexture(): THREE.Texture {
  const S = 256;
  if (hasCanvasDocument()) {
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Gunmetal steel plate background
      ctx.fillStyle = '#2d343e';
      ctx.fillRect(0, 0, S, S);

      // Subtle brushed metallic grain
      const rng = createSeededRng(hashSeed('restricted_hazard_tex'));
      for (let i = 0; i < 900; i++) {
        ctx.fillStyle = rng() > 0.5 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
        ctx.fillRect(rng() * S, rng() * S, 8 + rng() * 16, 1.5);
      }

      // Bold 45-degree safety-orange + dark-gunmetal stripes (colorblind-safe pattern + high contrast)
      ctx.save();
      const pad = 20;
      ctx.beginPath();
      ctx.rect(pad, pad, S - pad * 2, S - pad * 2);
      ctx.clip();

      ctx.fillStyle = '#262c34';
      ctx.fillRect(pad, pad, S - pad * 2, S - pad * 2);

      ctx.fillStyle = '#e06319';
      const stripeW = 24;
      const period = 52;
      for (let x = -S; x < S * 2; x += period) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + stripeW, 0);
        ctx.lineTo(x + stripeW - S, S);
        ctx.lineTo(x - S, S);
        ctx.closePath();
        ctx.fill();
      }

      // Center inner gunmetal cross-hatch pad so stripes frame cleanly
      ctx.strokeStyle = '#1b2027';
      ctx.lineWidth = 4;
      ctx.strokeRect(pad + 2, pad + 2, S - pad * 2 - 4, S - pad * 2 - 4);
      ctx.restore();

      // Outer chamfered steel frame + corner rivets
      ctx.strokeStyle = '#475261';
      ctx.lineWidth = 10;
      ctx.strokeRect(8, 8, S - 16, S - 16);

      ctx.fillStyle = '#191e25';
      for (const rx of [16, S - 16]) {
        for (const ry of [16, S - 16]) {
          ctx.beginPath();
          ctx.arc(rx, ry, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = 4;
      tex.needsUpdate = true;
      return tex;
    }
  }

  // Headless DataTexture fallback with identical diagonal hazard stripes
  const data = new Uint8Array(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const border = x < 20 || x >= S - 20 || y < 20 || y >= S - 20;
      const stripe = ((x + y) % 52) < 24;
      const o = (y * S + x) * 4;
      if (border) {
        data[o] = 68;
        data[o + 1] = 78;
        data[o + 2] = 92;
      } else if (stripe) {
        data[o] = 224;
        data[o + 1] = 99;
        data[o + 2] = 25;
      } else {
        data[o] = 38;
        data[o + 1] = 44;
        data[o + 2] = 52;
      }
      data[o + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, S, S, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

function createCrackedIceTextures(): { map: THREE.DataTexture; normalMap: THREE.DataTexture } {
  const S = 256;
  const height = new Float32Array(S * S);
  const albedo = new Uint8Array(S * S * 4);
  const rng = createSeededRng(hashSeed('cracked_ice_slab_v1'));

  // Base glacial crystalline undulations
  for (let y = 0; y < S; y++) {
    const v = y / S;
    for (let x = 0; x < S; x++) {
      const u = x / S;
      const wave =
        0.5 +
        0.16 * Math.sin(u * Math.PI * 4.0 + v * Math.PI * 2.0) +
        0.10 * Math.cos(u * Math.PI * 8.0 - v * Math.PI * 6.0) +
        0.05 * Math.sin((u + v) * Math.PI * 14.0);
      height[y * S + x] = clamp01(wave);
    }
  }

  // Deterministic fractured Voronoi-style polygonal crack segments
  const carveCrack = (x0: number, y0: number, x1: number, y1: number, depth: number, radius: number) => {
    const steps = Math.max(8, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 1.4));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const px = x0 + (x1 - x0) * t;
      const py = y0 + (y1 - y0) * t;
      const rInt = Math.ceil(radius);
      for (let dy = -rInt; dy <= rInt; dy++) {
        for (let dx = -rInt; dx <= rInt; dx++) {
          const d = Math.hypot(dx, dy);
          if (d > radius) continue;
          const ix = ((Math.round(px) + dx) % S + S) % S;
          const iy = ((Math.round(py) + dy) % S + S) % S;
          const falloff = 1.0 - d / radius;
          const idx = iy * S + ix;
          height[idx] = Math.max(0.0, height[idx] - depth * falloff * falloff);
        }
      }
    }
  };

  for (let c = 0; c < 18; c++) {
    let cx = rng.range(18, S - 18);
    let cy = rng.range(18, S - 18);
    let ang = rng.range(0, Math.PI * 2);
    const segs = rng.int(4, 7);
    for (let s = 0; s < segs; s++) {
      const len = rng.range(20, 48);
      const nx = cx + Math.cos(ang) * len;
      const ny = cy + Math.sin(ang) * len;
      carveCrack(cx, cy, nx, ny, rng.range(0.35, 0.52), rng.range(1.6, 2.8));
      if (rng() > 0.52) {
        const bAng = ang + (rng() > 0.5 ? 1 : -1) * rng.range(0.45, 1.05);
        const bLen = len * rng.range(0.45, 0.72);
        carveCrack(nx, ny, nx + Math.cos(bAng) * bLen, ny + Math.sin(bAng) * bLen, 0.28, 1.7);
      }
      cx = nx;
      cy = ny;
      ang += rng.range(-0.62, 0.62);
    }
  }

  // Contained glacial blue palette centered on #78b4e4 (zero white-out!)
  for (let i = 0; i < S * S; i++) {
    const h = height[i];
    const crackFactor = clamp01((0.36 - h) / 0.34);
    const facetTint = (h - 0.5) * 28;
    // Base #78b4e4 -> (120, 180, 228); cracks shift slightly frosty-bright #b0d6f2 without hitting 255
    const r = Math.round(clamp01((108 + facetTint + crackFactor * 64) / 255) * 255);
    const g = Math.round(clamp01((168 + facetTint * 0.9 + crackFactor * 48) / 255) * 255);
    const b = Math.round(clamp01((218 + facetTint * 0.65 + crackFactor * 24) / 255) * 255);
    const o = i * 4;
    albedo[o] = r;
    albedo[o + 1] = g;
    albedo[o + 2] = b;
    albedo[o + 3] = 255;
  }

  const normalBytes = computeSobelNormals(height, S, S, 3.6, { wrap: true, inputMax: 1.0 });

  const map = new THREE.DataTexture(albedo, S, S, THREE.RGBAFormat);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.needsUpdate = true;

  const normalMap = new THREE.DataTexture(new Uint8Array(normalBytes), S, S, THREE.RGBAFormat);
  normalMap.colorSpace = THREE.NoColorSpace;
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.needsUpdate = true;

  return { map, normalMap };
}

function createSoftFogTexture(): THREE.Texture {
  const S = 128;
  if (hasCanvasDocument()) {
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, S, S);
      // Soft overlapping radial mist puffs centered well inside borders so quad edges never appear
      const puffs: Array<[number, number, number, number]> = [
        [0.50, 0.50, 0.39, 0.56],
        [0.40, 0.45, 0.28, 0.36],
        [0.60, 0.47, 0.27, 0.35],
        [0.47, 0.59, 0.26, 0.32],
        [0.55, 0.39, 0.25, 0.30]
      ];
      for (const [ux, uy, ur, alpha] of puffs) {
        const cx = ux * S;
        const cy = uy * S;
        const rad = ur * S;
        const g = ctx.createRadialGradient(cx, cy, rad * 0.05, cx, cy, rad);
        g.addColorStop(0.0, `rgba(218, 232, 224, ${alpha})`);
        g.addColorStop(0.55, `rgba(192, 212, 200, ${alpha * 0.48})`);
        g.addColorStop(1.0, 'rgba(180, 202, 190, 0.0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, S, S);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
      return tex;
    }
  }

  const data = new Uint8Array(S * S * 4);
  const half = (S - 1) * 0.5;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (x - half) / half;
      const dy = (y - half) / half;
      const dist = Math.min(1, Math.hypot(dx, dy));
      const falloff = 1.0 - smoothstep(0.08, 0.96, dist);
      const wisp = 0.85 + 0.15 * Math.sin(dx * 5.0 + dy * 4.0);
      const o = (y * S + x) * 4;
      data[o] = 205;
      data[o + 1] = 222;
      data[o + 2] = 212;
      data[o + 3] = Math.round(clamp01(falloff * falloff * wisp) * 230);
    }
  }
  const tex = new THREE.DataTexture(data, S, S, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

// ============================================================================
// SHARED ANCHOR & TALUS GEOMETRY BUILDERS
// ============================================================================

function buildSkirtApronGeometry(
  seed: number,
  outerHex: number,
  innerHex: number,
  rTop = 1.08,
  rBot = 1.98,
  h = 0.24
): THREE.BufferGeometry {
  const base = getChamferedCylinderGeo(rTop, rBot, h, 10, 0.055);
  const sculpted = perturbRadialGeometry(base, seed, 0.14, 0, false);
  _tmpColorA.setHex(outerHex);
  _tmpColorB.setHex(innerHex);
  bakeVertexColors(sculpted, (x, y, z, _nx, _ny, _nz, out) => {
    const r = Math.hypot(x, z);
    const tR = clamp01(1.0 - (r - rTop * 0.7) / (rBot - rTop * 0.5));
    const tY = clamp01((y + h * 0.5) / h);
    out.copy(_tmpColorA).lerp(_tmpColorB, clamp01(tR * 0.65 + tY * 0.35));
  });
  applyVerticalAOToGeometry(sculpted, -h * 0.5, h * 0.5, 0.45);
  return sculpted;
}

function buildTalusBoulderGeometry(
  seed: number,
  wallHex: number,
  topHex: number,
  topThreshold = 0.55
): THREE.BufferGeometry {
  const base = getChamferedCylinderGeo(0.34, 0.55, 0.50, 6, 0.075);
  const sculpted = perturbRadialGeometry(base, seed, 0.22, 0.25, true);
  const tilted = cloneTransformed(sculpted, 0, 0, 0, 0.08, 0, -0.06);
  sculpted.dispose();
  _tmpColorA.setHex(wallHex);
  _tmpColorB.setHex(topHex);
  bakeVertexColors(tilted, (_x, _y, _z, _nx, ny, _nz, out) => {
    const cap = smoothstep(topThreshold - 0.12, topThreshold + 0.18, ny);
    out.copy(_tmpColorA).lerp(_tmpColorB, cap);
  });
  applyVerticalAOToGeometry(tilted, 0.0, 0.52, 0.48);
  return tilted;
}

// ============================================================================
// BIOME 1: ARCTIC (Granite Crags + Snow Caps + Skirts + Talus + Snowy Pines)
// ============================================================================

function buildArcticCragVariant(variant: 0 | 1 | 2): THREE.BufferGeometry {
  interface CragTier {
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
    tiltX?: number;
    tiltZ?: number;
  }

  let tiers: CragTier[];
  let maxH: number;

  if (variant === 0) {
    // Broad sculpted glacial granite shelf
    tiers = [
      { rTop: 1.38, rBot: 1.62, h: 0.48, yBase: 0.0, ox: 0.0, oz: 0.0, segs: 7, seed: 3.1, amp: 0.18, sx: 1.08, sz: 0.94 },
      { rTop: 1.06, rBot: 1.32, h: 0.54, yBase: 0.42, ox: -0.08, oz: 0.06, segs: 7, seed: 5.7, amp: 0.20, sx: 1.04, sz: 0.96 },
      { rTop: 0.58, rBot: 0.92, h: 0.52, yBase: 0.88, ox: 0.14, oz: -0.08, segs: 6, seed: 8.3, amp: 0.21, sx: 0.94, sz: 1.02 }
    ];
    maxH = 1.42;
  } else if (variant === 1) {
    // Jagged asymmetric granite peak
    tiers = [
      { rTop: 1.24, rBot: 1.50, h: 0.44, yBase: 0.0, ox: 0.0, oz: 0.0, segs: 6, seed: 11.4, amp: 0.20, sx: 0.98, sz: 1.05 },
      { rTop: 0.84, rBot: 1.14, h: 0.62, yBase: 0.38, ox: 0.10, oz: -0.06, segs: 6, seed: 14.2, amp: 0.22, sx: 0.92, sz: 0.96, tiltZ: -0.06 },
      { rTop: 0.26, rBot: 0.72, h: 0.76, yBase: 0.92, ox: 0.18, oz: -0.10, segs: 6, seed: 17.8, amp: 0.19, sx: 0.86, sz: 0.90, tiltZ: -0.09 }
    ];
    maxH = 1.70;
  } else {
    // Split twin-ridge glacier outcrop
    tiers = [
      { rTop: 1.26, rBot: 1.52, h: 0.44, yBase: 0.0, ox: 0.0, oz: 0.0, segs: 7, seed: 21.1, amp: 0.16, sx: 1.22, sz: 0.82 },
      { rTop: 0.58, rBot: 0.86, h: 0.78, yBase: 0.36, ox: -0.44, oz: 0.08, segs: 6, seed: 23.9, amp: 0.19, sx: 0.96, sz: 0.84, tiltZ: 0.07 },
      { rTop: 0.42, rBot: 0.76, h: 0.94, yBase: 0.36, ox: 0.42, oz: -0.10, segs: 6, seed: 27.4, amp: 0.20, sx: 0.90, sz: 0.82, tiltZ: -0.08 }
    ];
    maxH = 1.32;
  }

  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    const base = getChamferedCylinderGeo(t.rTop, t.rBot, t.h, t.segs, Math.min(0.055, t.h * 0.16));
    const sculpted = perturbRadialGeometry(base, t.seed, t.amp, 0, i === 0);
    const positioned = cloneTransformed(
      sculpted,
      t.ox,
      t.yBase + t.h * 0.5,
      t.oz,
      t.tiltX ?? 0,
      i * 0.45 + variant * 0.65,
      t.tiltZ ?? 0,
      t.sx,
      1,
      t.sz
    );
    sculpted.dispose();
    parts.push(positioned);
  }

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: false, disposeInputs: true });
  merged.computeVertexNormals();

  // Dark granite walls (#475569 / #364354) + wind-packed snow caps (#cfdbe7, strictly no white-out!)
  _tmpColorA.setHex(0x3a4758);
  _tmpColorB.setHex(0x475569);
  _tmpColorC.setHex(0xcfdbe7);
  bakeVertexColors(merged, (x, y, z, _nx, ny, _nz, out) => {
    const wallGrad = smoothstep(0.0, maxH * 0.75, y);
    out.copy(_tmpColorA).lerp(_tmpColorB, wallGrad);
    const snowBias = 0.06 * Math.sin(x * 3.1 + z * 2.7);
    const snowCap = smoothstep(0.46 + snowBias, 0.72 + snowBias, ny) * smoothstep(0.18, 0.55, y);
    out.lerp(_tmpColorC, snowCap);
  });

  applyVerticalAOToGeometry(merged, 0.0, maxH, 0.54);
  return merged;
}

/**
 * Snowy Arctic pine: rigid dark bark trunk + 2-tier snow-dusted spruce conical canopy.
 * Trunk sits in y <= 0.55; wind shader lifts smoothly above y > 0.40 so roots stay planted.
 */
function buildArcticSnowyPineGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Flared dark-bark trunk
  const trunk = cloneTransformed(getChamferedCylinderGeo(0.075, 0.14, 0.62, 6, 0.015), 0, 0.31, 0);
  setUniformVertexColor(trunk, 0x4b382a);
  parts.push(trunk);

  // Lower spruce bough tier (dark evergreen underside + #cfdbe7 snow upper faces)
  const tier1Raw = new THREE.ConeGeometry(0.62, 0.92, 7, 2);
  const tier1 = perturbRadialGeometry(tier1Raw, 4.1, 0.14, 0.88, false);
  tier1Raw.dispose();
  _tmpColorA.setHex(0x1f3d30);
  _tmpColorB.setHex(0x2c5240);
  _tmpColorC.setHex(0xcfdbe7);
  bakeVertexColors(tier1, (x, y, z, _nx, ny, _nz, out) => {
    out.copy(_tmpColorA).lerp(_tmpColorB, smoothstep(0.45, 1.32, y));
    const snowMask = smoothstep(0.32, 0.60, ny) * smoothstep(0.58, 1.15, y + 0.08 * Math.sin(x * 5 + z * 5));
    out.lerp(_tmpColorC, snowMask * 0.88);
  });
  parts.push(tier1);

  // Upper spruce crown tier (heavier snow mantle #cfdbe7)
  const tier2Raw = new THREE.ConeGeometry(0.44, 0.84, 7, 2);
  const tier2 = perturbRadialGeometry(tier2Raw, 9.7, 0.12, 1.48, false);
  tier2Raw.dispose();
  bakeVertexColors(tier2, (x, y, z, _nx, ny, _nz, out) => {
    out.copy(_tmpColorA).lerp(_tmpColorB, smoothstep(1.06, 1.88, y));
    const snowMask = smoothstep(0.24, 0.56, ny) * smoothstep(1.16, 1.72, y + 0.06 * Math.cos(x * 6 - z * 4));
    out.lerp(_tmpColorC, snowMask * 0.94);
  });
  parts.push(tier2);

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: true, disposeInputs: true });
  applyVerticalAOToGeometry(merged, 0.0, 1.92, 0.58);
  return merged;
}

// ============================================================================
// BIOME 2: INDUSTRIAL (Modular Ruins — Factory Blocks, Silos, I-Beams, Jersey)
// ============================================================================

function buildIndustrialFactoryVariant(variant: 0 | 1): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  if (variant === 0) {
    // Variant 0: Chamfered Turbine Hall with buttress ribs, recessed dark window bays, roof vent
    const mainBody = cloneTransformed(getRoundedBoxGeo(2.04, 1.24, 1.66, 0.055, 2), -0.08, 0.62, 0.04);
    setUniformVertexColor(mainBody, 0x5c646e);
    parts.push(mainBody);

    // Roof concrete parapet trim + dark tar roof deck
    const roofDeck = cloneTransformed(getRoundedBoxGeo(1.88, 0.14, 1.48, 0.03, 1), -0.08, 1.27, 0.04);
    setUniformVertexColor(roofDeck, 0x3b414a);
    parts.push(roofDeck);

    // Sawtooth skylight / louver housing on roof
    const louver = cloneTransformed(getRoundedBoxGeo(1.12, 0.34, 0.58, 0.035, 1), -0.22, 1.44, -0.18, 0.12, 0, 0);
    setUniformVertexColor(louver, 0x4f5761);
    parts.push(louver);

    // 3 structural concrete buttress ribs along front & back walls
    const ribBase = getRoundedBoxGeo(0.16, 1.26, 1.78, 0.025, 1);
    for (const rx of [-0.76, -0.08, 0.60]) {
      const rib = cloneTransformed(ribBase, rx, 0.63, 0.04);
      setUniformVertexColor(rib, 0x6f7782);
      parts.push(rib);
    }

    // Recessed dark industrial window frames (flush-inset dark glass + rusted sills)
    const winBase = getRoundedBoxGeo(0.44, 0.36, 1.70, 0.015, 1);
    for (const wx of [-0.42, 0.26]) {
      const win = cloneTransformed(winBase, wx, 0.78, 0.04);
      setUniformVertexColor(win, 0x1d232b);
      parts.push(win);
    }

    // Damaged concrete footing plinth
    const footing = cloneTransformed(getRoundedBoxGeo(2.24, 0.22, 1.88, 0.04, 2), -0.08, 0.11, 0.04);
    setUniformVertexColor(footing, 0x454c54);
    parts.push(footing);
  } else {
    // Variant 1: Stepped Reinforced Control Bunker + exhaust housing + blast slits
    const lowerHull = cloneTransformed(getRoundedBoxGeo(2.14, 0.88, 1.78, 0.06, 2), 0.0, 0.44, 0.0);
    setUniformVertexColor(lowerHull, 0x575f69);
    parts.push(lowerHull);

    const upperDeck = cloneTransformed(getRoundedBoxGeo(1.36, 0.68, 1.22, 0.05, 2), -0.24, 1.12, -0.12);
    setUniformVertexColor(upperDeck, 0x67707a);
    parts.push(upperDeck);

    // Armored blast-slit recess band
    const slit = cloneTransformed(getRoundedBoxGeo(1.40, 0.16, 1.26, 0.015, 1), -0.24, 1.18, -0.12);
    setUniformVertexColor(slit, 0x1b2026);
    parts.push(slit);

    // Weathered rusted HVAC unit on lower terrace
    const hvac = cloneTransformed(getRoundedBoxGeo(0.56, 0.42, 0.64, 0.035, 1), 0.64, 1.06, 0.28);
    setUniformVertexColor(hvac, 0x6f4a36);
    parts.push(hvac);

    // Corner structural pilasters
    const pilBase = getRoundedBoxGeo(0.24, 0.94, 0.24, 0.03, 1);
    for (const [px, pz] of [
      [-0.96, -0.78],
      [0.96, -0.78],
      [-0.96, 0.78],
      [0.96, 0.78]
    ]) {
      const pil = cloneTransformed(pilBase, px, 0.47, pz);
      setUniformVertexColor(pil, 0x737b85);
      parts.push(pil);
    }
  }

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: true, disposeInputs: true });
  applyVerticalAOToGeometry(merged, 0.0, 1.62, 0.46);
  return merged;
}

function buildIndustrialSiloGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Main chamfered tank body
  const body = cloneTransformed(getChamferedCylinderGeo(0.56, 0.60, 1.78, 14, 0.045), 0, 0.89, 0);
  setUniformVertexColor(body, 0x727b86);
  parts.push(body);

  // Conical-chamfered silo cap + central vent stack
  const cap = cloneTransformed(getChamferedCylinderGeo(0.32, 0.58, 0.28, 14, 0.035), 0, 1.88, 0);
  setUniformVertexColor(cap, 0x5c646e);
  parts.push(cap);

  const vent = cloneTransformed(getChamferedCylinderGeo(0.10, 0.12, 0.34, 8, 0.015), 0.14, 2.08, -0.08);
  setUniformVertexColor(vent, 0x7a4b34);
  parts.push(vent);

  // Two structural catwalk / stiffening flange rings
  const ringGeo = getChamferedCylinderGeo(0.67, 0.67, 0.075, 14, 0.015);
  const ringLow = cloneTransformed(ringGeo, 0, 0.68, 0);
  setUniformVertexColor(ringLow, 0x4b535d);
  parts.push(ringLow);

  const ringHigh = cloneTransformed(ringGeo, 0, 1.54, 0);
  setUniformVertexColor(ringHigh, 0x7d4c33);
  parts.push(ringHigh);

  // Concrete collar footing
  const baseRing = cloneTransformed(getChamferedCylinderGeo(0.68, 0.74, 0.22, 12, 0.03), 0, 0.11, 0);
  setUniformVertexColor(baseRing, 0x444b53);
  parts.push(baseRing);

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: true, disposeInputs: true });
  applyVerticalAOToGeometry(merged, 0.0, 2.25, 0.48);
  return merged;
}

function buildIndustrialIBeamGeometry(): THREE.BufferGeometry {
  const h = 2.05;
  const flangeGeo = getRoundedBoxGeo(0.24, h, 0.045, 0.008, 1);
  const webGeo = getRoundedBoxGeo(0.045, h, 0.18, 0.006, 1);
  const parts = [
    cloneTransformed(flangeGeo, 0, h * 0.5, 0.095),
    cloneTransformed(flangeGeo, 0, h * 0.5, -0.095),
    cloneTransformed(webGeo, 0, h * 0.5, 0)
  ];
  for (const p of parts) setUniformVertexColor(p, 0x6f432e);
  const merged = mergeStaticGeometries(parts, { preserveVertexColors: true, disposeInputs: true });
  applyVerticalAOToGeometry(merged, 0.0, h, 0.48);
  return merged;
}

function buildJerseyBarrierGeometry(length = 1.12, height = 0.46): THREE.BufferGeometry {
  // Authentic stepped trapezoidal Jersey concrete barrier profile
  const foot = cloneTransformed(getRoundedBoxGeo(length, height * 0.34, 0.38, 0.025, 1), 0, height * 0.17, 0);
  setUniformVertexColor(foot, 0x50565e);

  const mid = cloneTransformed(getRoundedBoxGeo(length * 0.98, height * 0.36, 0.25, 0.025, 1), 0, height * 0.48, 0);
  setUniformVertexColor(mid, 0x68707a);

  const crest = cloneTransformed(getRoundedBoxGeo(length * 0.96, height * 0.34, 0.15, 0.022, 1), 0, height * 0.80, 0);
  setUniformVertexColor(crest, 0x767f8a);

  // High-visibility safety-orange top shoulder tabs (colorblind-friendly shape + contrast)
  const capL = cloneTransformed(getRoundedBoxGeo(length * 0.20, 0.05, 0.16, 0.01, 1), -length * 0.32, height * 0.95, 0);
  setUniformVertexColor(capL, 0xd96b1f);
  const capR = cloneTransformed(getRoundedBoxGeo(length * 0.20, 0.05, 0.16, 0.01, 1), length * 0.32, height * 0.95, 0);
  setUniformVertexColor(capR, 0xd96b1f);

  const merged = mergeStaticGeometries([foot, mid, crest, capL, capR], {
    preserveVertexColors: true,
    disposeInputs: true
  });
  applyVerticalAOToGeometry(merged, 0.0, height, 0.50);
  return merged;
}

// ============================================================================
// BIOME 3: FOREST (Mossy Stratified Rocks + Earth Skirts + Multi-Tier Trees)
// ============================================================================

function buildForestMossyRockVariant(variant: 0 | 1): THREE.BufferGeometry {
  const tiers =
    variant === 0
      ? [
          { rTop: 1.24, rBot: 1.50, h: 0.44, y: 0.22, ox: 0, oz: 0, segs: 8, seed: 2.3, amp: 0.16, sx: 1.08, sz: 0.92 },
          { rTop: 0.88, rBot: 1.14, h: 0.42, y: 0.60, ox: -0.08, oz: 0.06, segs: 7, seed: 5.1, amp: 0.18, sx: 1.02, sz: 0.96 },
          { rTop: 0.48, rBot: 0.74, h: 0.32, y: 0.92, ox: 0.10, oz: -0.06, segs: 6, seed: 7.9, amp: 0.16, sx: 0.95, sz: 1.04 }
        ]
      : [
          { rTop: 1.14, rBot: 1.38, h: 0.46, y: 0.23, ox: 0, oz: 0, segs: 7, seed: 10.4, amp: 0.18, sx: 0.94, sz: 1.12 },
          { rTop: 0.76, rBot: 1.02, h: 0.50, y: 0.66, ox: 0.12, oz: -0.08, segs: 7, seed: 13.8, amp: 0.19, sx: 0.92, sz: 1.04 },
          { rTop: 0.36, rBot: 0.62, h: 0.42, y: 1.06, ox: 0.18, oz: -0.10, segs: 6, seed: 16.5, amp: 0.17, sx: 0.88, sz: 0.94 }
        ];

  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    const base = getChamferedCylinderGeo(t.rTop, t.rBot, t.h, t.segs, 0.055);
    const sculpted = perturbRadialGeometry(base, t.seed, t.amp, 0, i === 0);
    const placed = cloneTransformed(sculpted, t.ox, t.y, t.oz, 0, i * 0.5 + variant * 0.7, 0, t.sx, 1, t.sz);
    sculpted.dispose();
    parts.push(placed);
  }

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: false, disposeInputs: true });
  merged.computeVertexNormals();

  _tmpColorA.setHex(0x4b535a);
  _tmpColorB.setHex(0x666f76);
  _tmpColorC.setHex(0x3f6b33);
  bakeVertexColors(merged, (x, y, z, _nx, ny, _nz, out) => {
    out.copy(_tmpColorA).lerp(_tmpColorB, smoothstep(0.0, 0.9, y));
    const mossMask = smoothstep(0.45, 0.74, ny) * smoothstep(0.14, 0.45, y + 0.08 * Math.sin(x * 3.5 + z * 3.1));
    out.lerp(_tmpColorC, mossMask * 0.90);
  });

  applyVerticalAOToGeometry(merged, 0.0, variant === 0 ? 1.12 : 1.32, 0.50);
  return merged;
}

function buildForestTrunkGeometry(): THREE.BufferGeometry {
  const flare = cloneTransformed(getChamferedCylinderGeo(0.12, 0.21, 0.28, 7, 0.025), 0, 0.14, 0);
  const stem = cloneTransformed(getChamferedCylinderGeo(0.08, 0.125, 0.74, 7, 0.015), 0.02, 0.60, -0.01, 0.04, 0, -0.03);
  setUniformVertexColor(flare, 0x3e2d1e);
  setUniformVertexColor(stem, 0x523b27);
  const merged = mergeStaticGeometries([flare, stem], { preserveVertexColors: true, disposeInputs: true });
  applyVerticalAOToGeometry(merged, 0.0, 0.98, 0.48);
  return merged;
}

/**
 * Multi-layered tactical forest canopy (3 perturbed organic bough tiers, zero spheres).
 */
function buildForestCanopyGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const tierSpecs = [
    { r: 0.76, h: 0.86, y: 1.12, ox: 0.0, oz: 0.0, seed: 3.3, amp: 0.18 },
    { r: 0.60, h: 0.78, y: 1.60, ox: 0.04, oz: -0.03, seed: 6.7, amp: 0.17 },
    { r: 0.40, h: 0.66, y: 2.04, ox: -0.02, oz: 0.02, seed: 10.1, amp: 0.15 }
  ];

  for (let i = 0; i < tierSpecs.length; i++) {
    const s = tierSpecs[i];
    const raw = new THREE.ConeGeometry(s.r, s.h, 7, 2);
    const sculpted = perturbRadialGeometry(raw, s.seed, s.amp, 0, false);
    raw.dispose();
    const placed = cloneTransformed(sculpted, s.ox, s.y, s.oz, 0, i * 0.55, 0);
    sculpted.dispose();
    parts.push(placed);
  }

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: false, disposeInputs: true });
  merged.computeVertexNormals();

  _tmpColorA.setHex(0x214a26);
  _tmpColorB.setHex(0x3b7634);
  _tmpColorC.setHex(0x5b9642);
  bakeVertexColors(merged, (_x, y, _z, _nx, ny, _nz, out) => {
    const hT = smoothstep(0.68, 2.32, y);
    out.copy(_tmpColorA).lerp(_tmpColorB, hT);
    out.lerp(_tmpColorC, smoothstep(0.28, 0.78, ny) * hT * 0.65);
  });

  applyVerticalAOToGeometry(merged, 0.68, 2.38, 0.56);
  return merged;
}

// ============================================================================
// BIOME 4: CANYON (Terracotta Stratified Mesas/Hoodoos + Talus + Dry Scrub)
// ============================================================================

function buildCanyonMesaVariant(variant: 0 | 1 | 2): THREE.BufferGeometry {
  interface CanyonTier {
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

  let tiers: CanyonTier[];
  let maxH: number;

  if (variant === 0) {
    // Broad flat-topped stepped terracotta butte
    tiers = [
      { rTop: 1.46, rBot: 1.66, h: 0.44, yBase: 0.0, ox: 0, oz: 0, segs: 8, seed: 2.1, amp: 0.14, sx: 1.08, sz: 0.92 },
      { rTop: 1.18, rBot: 1.38, h: 0.48, yBase: 0.38, ox: -0.05, oz: 0.04, segs: 8, seed: 4.5, amp: 0.15, sx: 1.06, sz: 0.94 },
      { rTop: 0.92, rBot: 1.04, h: 0.42, yBase: 0.80, ox: 0.08, oz: -0.05, segs: 7, seed: 6.9, amp: 0.14, sx: 1.02, sz: 0.98 }
    ];
    maxH = 1.24;
  } else if (variant === 1) {
    // Undercut wind-carved terracotta hoodoo tower
    tiers = [
      { rTop: 1.22, rBot: 1.48, h: 0.42, yBase: 0.0, ox: 0, oz: 0, segs: 7, seed: 9.2, amp: 0.17, sx: 0.96, sz: 1.04 },
      { rTop: 0.72, rBot: 0.98, h: 0.56, yBase: 0.36, ox: 0.08, oz: -0.05, segs: 7, seed: 11.7, amp: 0.18, sx: 0.92, sz: 0.96 },
      { rTop: 0.88, rBot: 0.66, h: 0.34, yBase: 0.88, ox: 0.10, oz: -0.06, segs: 7, seed: 14.3, amp: 0.15, sx: 0.98, sz: 0.95 },
      { rTop: 0.62, rBot: 0.82, h: 0.36, yBase: 1.18, ox: 0.12, oz: -0.08, segs: 6, seed: 16.9, amp: 0.14, sx: 0.94, sz: 0.92 }
    ];
    maxH = 1.56;
  } else {
    // Elongated stratified canyon fin
    tiers = [
      { rTop: 1.30, rBot: 1.50, h: 0.44, yBase: 0.0, ox: 0, oz: 0, segs: 8, seed: 19.4, amp: 0.13, sx: 1.26, sz: 0.76 },
      { rTop: 1.06, rBot: 1.22, h: 0.48, yBase: 0.38, ox: -0.10, oz: 0.02, segs: 7, seed: 21.8, amp: 0.15, sx: 1.30, sz: 0.72 },
      { rTop: 0.78, rBot: 0.96, h: 0.44, yBase: 0.80, ox: -0.16, oz: 0.04, segs: 6, seed: 24.3, amp: 0.14, sx: 1.32, sz: 0.66 }
    ];
    maxH = 1.26;
  }

  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    const base = getChamferedCylinderGeo(t.rTop, t.rBot, t.h, t.segs, Math.min(0.055, t.h * 0.18));
    const sculpted = perturbRadialGeometry(base, t.seed, t.amp, 0, i === 0);
    const placed = cloneTransformed(sculpted, t.ox, t.yBase + t.h * 0.5, t.oz, 0, i * 0.34 + variant * 0.5, 0, t.sx, 1, t.sz);
    sculpted.dispose();
    parts.push(placed);
  }

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: false, disposeInputs: true });
  merged.computeVertexNormals();

  // Horizontal stratified sandstone bands (#6b3222 deep iron-red / #9a4d32 terracotta / #c27044 ochre ledge)
  _tmpColorA.setHex(0x6b3222);
  _tmpColorB.setHex(0x9a4d32);
  _tmpColorC.setHex(0xc27044);
  bakeVertexColors(merged, (x, y, z, _nx, ny, _nz, out) => {
    const strataWave = 0.5 + 0.5 * Math.sin(y * 12.5 + 0.18 * Math.sin(x * 1.4 + z * 1.2));
    if (strataWave < 0.45) {
      out.copy(_tmpColorA).lerp(_tmpColorB, strataWave / 0.45);
    } else {
      out.copy(_tmpColorB).lerp(_tmpColorC, (strataWave - 0.45) / 0.55);
    }
    // Sunlit dusty ochre cap on flat mesa tops
    out.lerp(_tmpColorC, smoothstep(0.60, 0.88, ny) * 0.55);
  });

  applyVerticalAOToGeometry(merged, 0.0, maxH, 0.52);
  return merged;
}

function buildDryScrubGeometry(seedKey: string, baseHex: number, tipHex: number): THREE.BufferGeometry {
  const rng = createSeededRng(hashSeed(seedKey));
  const parts: THREE.BufferGeometry[] = [];
  const twigBase = new THREE.ConeGeometry(0.13, 0.48, 5);

  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2 + rng.range(-0.24, 0.24);
    const tilt = rng.range(0.30, 0.64);
    const hScale = rng.range(0.75, 1.22);
    const rScale = rng.range(0.84, 1.24);
    const dist = rng.range(0.05, 0.14);
    const frond = cloneTransformed(
      twigBase,
      Math.cos(ang) * dist,
      0.17 * hScale,
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
  _tmpColorA.setHex(baseHex);
  _tmpColorB.setHex(tipHex);
  bakeVertexColors(merged, (_x, y, _z, _nx, _ny, _nz, out) => {
    out.copy(_tmpColorA).lerp(_tmpColorB, smoothstep(0.02, 0.42, y));
  });
  applyVerticalAOToGeometry(merged, 0.0, 0.45, 0.44);
  return merged;
}

// ============================================================================
// BIOME 5: SWAMP (Mossy Mud Mounds + Gnarled Trees + Drooping Canopies + Reeds)
// ============================================================================

function buildSwampMoundVariant(variant: 0 | 1): THREE.BufferGeometry {
  const tiers =
    variant === 0
      ? [
          { rTop: 1.34, rBot: 1.66, h: 0.36, y: 0.18, ox: 0, oz: 0, segs: 8, seed: 4.2, amp: 0.19, sx: 1.12, sz: 0.92 },
          { rTop: 0.92, rBot: 1.22, h: 0.36, y: 0.48, ox: -0.10, oz: 0.06, segs: 7, seed: 7.4, amp: 0.21, sx: 1.04, sz: 0.96 }
        ]
      : [
          { rTop: 1.22, rBot: 1.54, h: 0.40, y: 0.20, ox: 0, oz: 0, segs: 7, seed: 12.1, amp: 0.20, sx: 0.94, sz: 1.10 },
          { rTop: 0.78, rBot: 1.06, h: 0.44, y: 0.56, ox: 0.14, oz: -0.08, segs: 7, seed: 15.8, amp: 0.22, sx: 0.92, sz: 1.02 },
          { rTop: 0.42, rBot: 0.68, h: 0.32, y: 0.88, ox: 0.18, oz: -0.12, segs: 6, seed: 18.6, amp: 0.18, sx: 0.90, sz: 0.92 }
        ];

  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    const base = getChamferedCylinderGeo(t.rTop, t.rBot, t.h, t.segs, 0.06);
    const sculpted = perturbRadialGeometry(base, t.seed, t.amp, 0, i === 0);
    const placed = cloneTransformed(sculpted, t.ox, t.y, t.oz, 0, i * 0.6 + variant * 0.8, 0, t.sx, 1, t.sz);
    sculpted.dispose();
    parts.push(placed);
  }

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: false, disposeInputs: true });
  merged.computeVertexNormals();

  _tmpColorA.setHex(0x28322b);
  _tmpColorB.setHex(0x3d4a40);
  _tmpColorC.setHex(0x426c38);
  bakeVertexColors(merged, (x, y, z, _nx, ny, _nz, out) => {
    out.copy(_tmpColorA).lerp(_tmpColorB, smoothstep(0.0, 0.7, y));
    const mossMask = smoothstep(0.42, 0.72, ny) * smoothstep(0.12, 0.42, y + 0.08 * Math.cos(x * 3.8 - z * 2.9));
    out.lerp(_tmpColorC, mossMask * 0.92);
  });
  applyVerticalAOToGeometry(merged, 0.0, variant === 0 ? 0.72 : 1.08, 0.44);
  return merged;
}

function buildSwampGnarledTrunkGeometry(): THREE.BufferGeometry {
  // Flared cypress knees + crooked leaning lower trunk + forked upper bough
  const parts: THREE.BufferGeometry[] = [
    cloneTransformed(getChamferedCylinderGeo(0.14, 0.26, 0.34, 7, 0.03), 0.0, 0.17, 0.0),
    cloneTransformed(getChamferedCylinderGeo(0.095, 0.145, 0.66, 7, 0.018), 0.08, 0.56, 0.03, 0.06, 0, -0.24),
    cloneTransformed(getChamferedCylinderGeo(0.065, 0.098, 0.56, 6, 0.015), 0.22, 1.02, -0.02, -0.10, 0, -0.16),
    cloneTransformed(getChamferedCylinderGeo(0.05, 0.078, 0.44, 6, 0.012), -0.04, 0.94, 0.10, 0.18, 0, 0.34)
  ];
  for (const p of parts) setUniformVertexColor(p, 0x3b3124);
  const merged = mergeStaticGeometries(parts, { preserveVertexColors: true, disposeInputs: true });
  applyVerticalAOToGeometry(merged, 0.0, 1.32, 0.45);
  return merged;
}

function buildSwampWeepingCanopyGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Broad drooping crown dome (faceted umbrella, not a sphere)
  const capRaw = getChamferedCylinderGeo(0.32, 0.86, 0.52, 8, 0.08);
  const cap = perturbRadialGeometry(capRaw, 6.4, 0.18, 1.34, false);
  const capPlaced = cloneTransformed(cap, 0.18, 0, 0.02, 0.05, 0, -0.08);
  cap.dispose();
  parts.push(capPlaced);

  // Secondary offset side crown
  const sideRaw = getChamferedCylinderGeo(0.24, 0.58, 0.42, 7, 0.06);
  const side = perturbRadialGeometry(sideRaw, 11.2, 0.16, 1.14, false);
  const sidePlaced = cloneTransformed(side, -0.14, 0, 0.16, -0.04, 0.4, 0.12);
  side.dispose();
  parts.push(sidePlaced);

  // Hanging moss drapes around rim (inverted tapered curtains)
  const drapeBase = new THREE.ConeGeometry(0.14, 0.62, 5);
  drapeBase.rotateX(Math.PI);
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2 + 0.25;
    const rad = 0.56 + (i % 2) * 0.14;
    const drape = cloneTransformed(
      drapeBase,
      0.14 + Math.cos(ang) * rad,
      0.94 + (i % 3) * 0.05,
      0.04 + Math.sin(ang) * rad,
      0.04 * Math.sin(ang),
      ang,
      -0.04 * Math.cos(ang),
      0.85,
      0.85 + (i % 2) * 0.35,
      0.85
    );
    parts.push(drape);
  }
  drapeBase.dispose();

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: false, disposeInputs: true });
  merged.computeVertexNormals();

  _tmpColorA.setHex(0x23422b);
  _tmpColorB.setHex(0x3d663a);
  _tmpColorC.setHex(0x5d8645);
  bakeVertexColors(merged, (_x, y, _z, _nx, ny, _nz, out) => {
    const hT = smoothstep(0.62, 1.62, y);
    out.copy(_tmpColorA).lerp(_tmpColorB, hT);
    out.lerp(_tmpColorC, smoothstep(0.30, 0.78, ny) * hT * 0.65);
  });
  applyVerticalAOToGeometry(merged, 0.60, 1.65, 0.54);
  return merged;
}

function buildSwampPilingsAndReedsGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const rng = createSeededRng(hashSeed('swamp_pilings_reeds'));

  // 2 weathered timber bog pilings tilted slightly
  const postA = cloneTransformed(getChamferedCylinderGeo(0.085, 0.10, 0.78, 7, 0.015), -0.14, 0.38, 0.04, 0.06, 0, -0.09);
  setUniformVertexColor(postA, 0x453729);
  parts.push(postA);

  const postB = cloneTransformed(getChamferedCylinderGeo(0.075, 0.09, 0.56, 7, 0.015), 0.12, 0.27, -0.08, -0.08, 0.3, 0.07);
  setUniformVertexColor(postB, 0x3a2e22);
  parts.push(postB);

  // Splayed swamp reed / cattail blades
  const reedBase = new THREE.ConeGeometry(0.042, 0.68, 4);
  for (let i = 0; i < 7; i++) {
    const ang = (i / 7) * Math.PI * 2 + rng.range(-0.2, 0.2);
    const r = rng.range(0.08, 0.24);
    const hS = rng.range(0.75, 1.22);
    const reed = cloneTransformed(
      reedBase,
      Math.cos(ang) * r,
      0.30 * hS,
      Math.sin(ang) * r,
      Math.sin(ang) * rng.range(0.12, 0.32),
      ang,
      -Math.cos(ang) * rng.range(0.12, 0.32),
      1,
      hS,
      1
    );
    setUniformVertexColor(reed, i % 2 === 0 ? 0x4b6e34 : 0x62803a);
    parts.push(reed);
  }
  reedBase.dispose();

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: true, disposeInputs: true });
  applyVerticalAOToGeometry(merged, 0.0, 0.85, 0.45);
  return merged;
}

// ============================================================================
// BIOME 6: VOLCANIC (Hexagonal Basalt Column Clusters + Scoria + Ash Skirts)
// ============================================================================

function buildVolcanicBasaltVariant(variant: 0 | 1 | 2): THREE.BufferGeometry {
  interface PillarSpec {
    ox: number;
    oz: number;
    r: number;
    h: number;
    rx?: number;
    rz?: number;
  }

  let pillars: PillarSpec[];
  let maxH: number;

  if (variant === 0) {
    // Stepped hexagonal organ-pipe basalt cluster
    pillars = [
      { ox: 0.0, oz: 0.0, r: 0.46, h: 1.66 },
      { ox: 0.64, oz: 0.16, r: 0.40, h: 1.24, rz: -0.04 },
      { ox: -0.60, oz: 0.24, r: 0.42, h: 1.36, rz: 0.05 },
      { ox: 0.16, oz: -0.64, r: 0.38, h: 1.12, rx: -0.05 },
      { ox: -0.44, oz: -0.54, r: 0.36, h: 0.88 },
      { ox: 0.42, oz: 0.66, r: 0.35, h: 0.78 },
      { ox: -0.18, oz: 0.70, r: 0.34, h: 0.92 }
    ];
    maxH = 1.68;
  } else if (variant === 1) {
    // Tall angled obsidian/basalt jagged spire cluster
    pillars = [
      { ox: 0.06, oz: -0.04, r: 0.44, h: 1.98, rx: 0.05, rz: -0.08 },
      { ox: -0.52, oz: 0.12, r: 0.38, h: 1.44, rx: -0.04, rz: 0.11 },
      { ox: 0.56, oz: 0.22, r: 0.36, h: 1.16, rx: 0.08, rz: -0.12 },
      { ox: -0.12, oz: -0.62, r: 0.34, h: 1.28, rx: -0.10, rz: 0.03 },
      { ox: 0.32, oz: -0.48, r: 0.32, h: 0.84, rx: -0.06, rz: -0.06 },
      { ox: -0.34, oz: 0.62, r: 0.35, h: 0.74, rx: 0.08, rz: 0.05 }
    ];
    maxH = 2.02;
  } else {
    // Wide terraced hexagonal ridge
    pillars = [
      { ox: -0.72, oz: 0.06, r: 0.38, h: 1.14 },
      { ox: -0.22, oz: -0.12, r: 0.44, h: 1.48 },
      { ox: 0.32, oz: 0.04, r: 0.42, h: 1.32 },
      { ox: 0.78, oz: -0.08, r: 0.36, h: 0.96 },
      { ox: -0.44, oz: 0.48, r: 0.34, h: 0.82 },
      { ox: 0.12, oz: 0.50, r: 0.36, h: 0.76 },
      { ox: 0.48, oz: -0.50, r: 0.34, h: 0.88 },
      { ox: -0.16, oz: -0.56, r: 0.35, h: 0.98 }
    ];
    maxH = 1.50;
  }

  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < pillars.length; i++) {
    const p = pillars[i];
    const hexPrism = getChamferedCylinderGeo(p.r * 0.94, p.r * 1.04, p.h, 6, 0.032);
    const placed = cloneTransformed(hexPrism, p.ox, p.h * 0.5, p.oz, p.rx ?? 0, (i % 3) * (Math.PI / 6), p.rz ?? 0);
    parts.push(placed);
  }

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: false, disposeInputs: true });
  merged.computeVertexNormals();

  // Dark charcoal basalt (#282224) with subtle warm geothermal base (#4a251d) and slightly lighter weathered bevel tops (#3a3336)
  // Preserves >= 3:1 figure-ground contrast with enemies!
  _tmpColorA.setHex(0x4a251d);
  _tmpColorB.setHex(0x282224);
  _tmpColorC.setHex(0x3f373a);
  bakeVertexColors(merged, (_x, y, _z, _nx, ny, _nz, out) => {
    const baseHeat = 1.0 - smoothstep(0.0, 0.42, y);
    out.copy(_tmpColorB).lerp(_tmpColorA, baseHeat * 0.82);
    out.lerp(_tmpColorC, smoothstep(0.65, 0.92, ny) * 0.55);
  });

  applyVerticalAOToGeometry(merged, 0.0, maxH, 0.58);
  return merged;
}

// ============================================================================
// SPECIAL ENVIRONMENTAL TILE GEOMETRIES
// ============================================================================

function buildRestrictedDeckSlabGeometry(): THREE.BufferGeometry {
  const w = CELL_WORLD * 0.90;
  const h = 0.10;
  const mainSlab = cloneTransformed(getRoundedBoxGeo(w, h, w, 0.028, 2), 0, h * 0.5, 0);

  // Corner beveled tie-down anchor cleats (tactile 3D silhouette cue for colorblind readability)
  const cleatGeo = getRoundedBoxGeo(0.26, 0.06, 0.26, 0.015, 1);
  const off = w * 0.5 - 0.22;
  const parts: THREE.BufferGeometry[] = [
    mainSlab,
    cloneTransformed(cleatGeo, -off, h + 0.02, -off),
    cloneTransformed(cleatGeo, off, h + 0.02, -off),
    cloneTransformed(cleatGeo, -off, h + 0.02, off),
    cloneTransformed(cleatGeo, off, h + 0.02, off)
  ];

  // Note: preserve UV of mainSlab so the diagonal hazard stripe maps crisply across the slab top
  return mergeStaticGeometries(parts, { preserveVertexColors: false, disposeInputs: true });
}

function buildLavaBasaltRimGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const halfSpan = CELL_WORLD * 0.415; // outer ~3.82, inner opening ~2.82
  const barLen = CELL_WORLD * 0.86;
  const barThick = 0.46;
  const barH = 0.22;

  const sideBar = getRoundedBoxGeo(barLen, barH, barThick, 0.06, 2);
  const perpBar = getRoundedBoxGeo(barThick, barH, barLen - barThick * 0.8, 0.06, 2);

  parts.push(
    cloneTransformed(sideBar, 0, barH * 0.5, -halfSpan),
    cloneTransformed(sideBar, 0, barH * 0.5, halfSpan),
    cloneTransformed(perpBar, -halfSpan, barH * 0.5, 0),
    cloneTransformed(perpBar, halfSpan, barH * 0.5, 0)
  );

  // Corner jagged basalt rocks breaking up straight square lines
  const rng = createSeededRng(hashSeed('lava_rim_rocks'));
  const cragBase = getChamferedCylinderGeo(0.22, 0.36, 0.34, 6, 0.05);
  const corners: Array<[number, number]> = [
    [-halfSpan, -halfSpan],
    [halfSpan, -halfSpan],
    [-halfSpan, halfSpan],
    [halfSpan, halfSpan],
    [0, -halfSpan],
    [halfSpan, 0]
  ];
  for (let i = 0; i < corners.length; i++) {
    const [cx, cz] = corners[i];
    const rock = perturbRadialGeometry(cragBase, 2.5 + i * 3.1, 0.18, 0, true);
    const placed = cloneTransformed(
      rock,
      cx + rng.range(-0.08, 0.08),
      0.16,
      cz + rng.range(-0.08, 0.08),
      rng.range(-0.1, 0.1),
      rng.range(0, Math.PI * 2),
      rng.range(-0.1, 0.1),
      rng.range(0.85, 1.18),
      rng.range(0.75, 1.15),
      rng.range(0.85, 1.18)
    );
    rock.dispose();
    parts.push(placed);
  }

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: false, disposeInputs: true });
  merged.computeVertexNormals();

  // Dark basalt exterior (#282224) + warm radiant edge facing the inner caldera (#57291c)
  _tmpColorA.setHex(0x282224);
  _tmpColorB.setHex(0x57291c);
  bakeVertexColors(merged, (x, y, z, _nx, _ny, _nz, out) => {
    const innerProximity = 1.0 - smoothstep(1.30, 1.72, Math.max(Math.abs(x), Math.abs(z)));
    const lowHeat = 1.0 - smoothstep(0.05, 0.24, y);
    out.copy(_tmpColorA).lerp(_tmpColorB, innerProximity * lowHeat * 0.85);
  });
  applyVerticalAOToGeometry(merged, 0.0, 0.36, 0.50);
  return merged;
}

function buildToxicCorrodedRimGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const halfSpan = CELL_WORLD * 0.415;
  const barLen = CELL_WORLD * 0.84;
  const barThick = 0.38;
  const barH = 0.15;

  const sideBar = getRoundedBoxGeo(barLen, barH, barThick, 0.045, 2);
  const perpBar = getRoundedBoxGeo(barThick, barH, barLen - barThick * 0.8, 0.045, 2);
  parts.push(
    cloneTransformed(sideBar, 0, barH * 0.5, -halfSpan),
    cloneTransformed(sideBar, 0, barH * 0.5, halfSpan),
    cloneTransformed(perpBar, -halfSpan, barH * 0.5, 0),
    cloneTransformed(perpBar, halfSpan, barH * 0.5, 0)
  );

  // Corroded concrete/mud lumps along rim corners
  const lumpBase = getChamferedCylinderGeo(0.20, 0.30, 0.20, 6, 0.04);
  const spots: Array<[number, number]> = [
    [-halfSpan, -halfSpan],
    [halfSpan, -halfSpan],
    [-halfSpan, halfSpan],
    [halfSpan, halfSpan]
  ];
  for (let i = 0; i < spots.length; i++) {
    const [sx, sz] = spots[i];
    const lump = perturbRadialGeometry(lumpBase, 5.1 + i * 2.7, 0.20, 0, true);
    const placed = cloneTransformed(lump, sx, 0.10, sz, 0, i * 1.2, 0, 1.05, 0.9, 1.05);
    lump.dispose();
    parts.push(placed);
  }

  const merged = mergeStaticGeometries(parts, { preserveVertexColors: false, disposeInputs: true });
  merged.computeVertexNormals();

  // Corroded bog stone (#333d34) with faint mossy-acid rim staining (#4b6830)
  _tmpColorA.setHex(0x313b33);
  _tmpColorB.setHex(0x4c6b32);
  bakeVertexColors(merged, (x, y, z, _nx, ny, _nz, out) => {
    const innerEdge = 1.0 - smoothstep(1.32, 1.72, Math.max(Math.abs(x), Math.abs(z)));
    const stain = clamp01(innerEdge * 0.65 + smoothstep(0.55, 0.85, ny) * 0.35 * (1.0 - smoothstep(0.08, 0.22, y)));
    out.copy(_tmpColorA).lerp(_tmpColorB, stain * 0.72);
  });
  applyVerticalAOToGeometry(merged, 0.0, 0.24, 0.48);
  return merged;
}

// ============================================================================
// PREWARM CACHE (InstancedMesh extends THREE.Mesh -> exact USE_INSTANCING compile!)
// ============================================================================

let cachedWarmMeshes: THREE.Mesh[] | null = null;
let cachedWarmGeos: THREE.BufferGeometry[] = [];
let cachedWarmMats: THREE.Material[] = [];

/**
 * Returns module-cached 1x1 InstancedMesh instances (subclasses of THREE.Mesh)
 * wired with `defcon_foliage_wind_v1`, `defcon_lava_flow_v1`, and `defcon_toxic_pool_v1`
 * for zero-stall boot shader prewarming under KHR_parallel_shader_compile.
 */
export function createBiomePropsWarmMeshes(): THREE.Mesh[] {
  if (cachedWarmMeshes) return cachedWarmMeshes;

  const identity = new THREE.Matrix4();
  const white = new THREE.Color(0xffffff);

  // 1. Foliage wind warm mesh (with vertexColors + instanceColor matching gameplay)
  const foliageGeo = new THREE.PlaneGeometry(1, 1);
  setUniformVertexColor(foliageGeo, 0xffffff);
  const { material: foliageMat } = createFoliageWindMaterial({ windStrength: 0.06, windFreq: 1.35 });
  const foliageInst = new THREE.InstancedMesh(foliageGeo, foliageMat, 1);
  foliageInst.name = 'BiomePropsWarm_FoliageWind';
  foliageInst.frustumCulled = false;
  foliageInst.setMatrixAt(0, identity);
  foliageInst.setColorAt(0, white);
  foliageInst.instanceMatrix.needsUpdate = true;
  if (foliageInst.instanceColor) foliageInst.instanceColor.needsUpdate = true;

  // 2. Lava flow warm mesh
  const lavaGeo = new THREE.PlaneGeometry(1, 1);
  lavaGeo.rotateX(-Math.PI / 2);
  const { material: lavaMat } = createLavaFlowMaterial();
  const lavaInst = new THREE.InstancedMesh(lavaGeo, lavaMat, 1);
  lavaInst.name = 'BiomePropsWarm_LavaFlow';
  lavaInst.frustumCulled = false;
  lavaInst.setMatrixAt(0, identity);
  lavaInst.instanceMatrix.needsUpdate = true;

  // 3. Toxic pool warm mesh
  const toxicGeo = new THREE.PlaneGeometry(1, 1);
  toxicGeo.rotateX(-Math.PI / 2);
  const { material: toxicMat } = createToxicPoolMaterial();
  const toxicInst = new THREE.InstancedMesh(toxicGeo, toxicMat, 1);
  toxicInst.name = 'BiomePropsWarm_ToxicPool';
  toxicInst.frustumCulled = false;
  toxicInst.setMatrixAt(0, identity);
  toxicInst.instanceMatrix.needsUpdate = true;

  cachedWarmGeos = [foliageGeo, lavaGeo, toxicGeo];
  cachedWarmMats = [foliageMat, lavaMat, toxicMat];
  cachedWarmMeshes = [foliageInst, lavaInst, toxicInst];
  return cachedWarmMeshes;
}

/**
 * Disposes module-cached warm meshes (for clean app shutdown or unit tests).
 */
export function disposeBiomePropsWarmCache(): void {
  if (cachedWarmMeshes) {
    for (const mesh of cachedWarmMeshes) {
      if (mesh instanceof THREE.InstancedMesh) {
        mesh.dispose();
      }
    }
    cachedWarmMeshes = null;
  }
  for (const g of cachedWarmGeos) g.dispose();
  for (const m of cachedWarmMats) m.dispose();
  cachedWarmGeos = [];
  cachedWarmMats = [];
}

// ============================================================================
// MAIN FACTORY: createBiomeProps3D(params)
// ============================================================================

export function createBiomeProps3D(params: BiomePropsParams): BiomePropsHandles {
  const { baseTerrain, biome, stageFeatures = {} } = params;
  const getReliefY = params.getMicroReliefY ?? (() => 0);

  const group = new THREE.Group();
  group.name = `BiomeProps3D_${biome}`;

  const disposableGeos: THREE.BufferGeometry[] = [];
  const disposableMats: THREE.Material[] = [];
  const disposableTextures: THREE.Texture[] = [];
  const disposableInstances: THREE.InstancedMesh[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    disposableGeos.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    disposableMats.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    disposableTextures.push(t);
    return t;
  };
  const trackInst = <T extends THREE.InstancedMesh>(inst: T): T => {
    disposableInstances.push(inst);
    return inst;
  };

  // Fallback materials only if caller omitted them (caller-provided materials are NOT disposed here!)
  const steelMat =
    params.steelMat ??
    trackMat(new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.36, metalness: 0.82 }));
  const warmLampMat =
    params.warmLampMat ??
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfacc15,
        emissiveIntensity: 1.6
      })
    );

  // Active shader time uniforms & fog handles for zero-alloc update()
  const activeTimeUniforms: Array<{ value: number }> = [];
  let fogLowMesh: THREE.InstancedMesh | null = null;
  let fogHighMesh: THREE.InstancedMesh | null = null;
  let fogLowMat: THREE.MeshBasicMaterial | null = null;
  let fogHighMat: THREE.MeshBasicMaterial | null = null;

  const dummy = new THREE.Object3D();
  const instColor = new THREE.Color();

  // Helper to commit a bucketed InstancedMesh cleanly
  const createBucketedInst = (
    name: string,
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    items: Array<{ matrix: THREE.Matrix4; hex?: number }>,
    castShadow: boolean,
    receiveShadow: boolean
  ): THREE.InstancedMesh | null => {
    if (items.length === 0) return null;
    const inst = trackInst(new THREE.InstancedMesh(geo, mat, items.length));
    inst.name = name;
    inst.frustumCulled = false;
    inst.castShadow = castShadow;
    inst.receiveShadow = receiveShadow;
    let colored = false;
    for (let i = 0; i < items.length; i++) {
      inst.setMatrixAt(i, items[i].matrix);
      const hex = items[i].hex;
      if (hex !== undefined) {
        instColor.setHex(hex);
        inst.setColorAt(i, instColor);
        colored = true;
      }
    }
    inst.instanceMatrix.needsUpdate = true;
    if (colored && inst.instanceColor) inst.instanceColor.needsUpdate = true;
    group.add(inst);
    return inst;
  };

  // ==========================================================================
  // 1. CELL.ROCK PROPS FOR THE 6 NON-DESERT BIOMES (<= 6 InstancedMesh calls)
  // ==========================================================================
  if (biome !== 'desert') {
    const rockCoords: Array<{ c: number; r: number }> = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      const rowArr = baseTerrain[r];
      if (!rowArr) continue;
      for (let c = 0; c < GRID_COLS; c++) {
        if (rowArr[c] === CELL.ROCK) rockCoords.push({ c, r });
      }
    }

    const nRocks = rockCoords.length;

    if (nRocks > 0 && biome === 'arctic') {
      // ARCTIC: 3 Granite Crags (dark #475569 walls + #cfdbe7 snow top) + Skirts + Talus + Snowy Pines (6 calls)
      const cragGeos: [THREE.BufferGeometry, THREE.BufferGeometry, THREE.BufferGeometry] = [
        trackGeo(buildArcticCragVariant(0)),
        trackGeo(buildArcticCragVariant(1)),
        trackGeo(buildArcticCragVariant(2))
      ];
      const skirtGeo = trackGeo(buildSkirtApronGeometry(4.3, 0x5c6d7e, 0xc3d2e0, 1.06, 2.02, 0.24));
      const talusGeo = trackGeo(buildTalusBoulderGeometry(6.9, 0x475569, 0xcfdbe7, 0.52));
      const pineGeo = trackGeo(buildArcticSnowyPineGeometry());

      const graniteMat = trackMat(
        makeSafePBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.78,
          metalness: 0.03,
          bumpScale: 0.06,
          envMapIntensity: 0.72,
          vertexColors: true,
          flatShading: true
        })
      );
      const skirtMat = trackMat(
        makeSafePBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.86,
          metalness: 0.02,
          bumpScale: 0.04,
          envMapIntensity: 0.62,
          vertexColors: true
        })
      );
      const { material: pineMat, uniforms: pineWind } = createFoliageWindMaterial({
        windStrength: 0.045,
        windFreq: 1.15,
        roughness: 0.85,
        envMapIntensity: 0.68
      });
      trackMat(pineMat);
      activeTimeUniforms.push(pineWind.uTime);

      const cragBuckets: Array<Array<{ matrix: THREE.Matrix4; hex: number }>> = [[], [], []];
      const skirtItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const talusItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const pineItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const variantByCell = new Map<string, number>();

      const cragTints = [0xf4f8fc, 0xe8eff6, 0xfafcff, 0xdfe9f2];
      const pineTints = [0xf6fafd, 0xebf2f8, 0xe4eef6];

      for (let i = 0; i < nRocks; i++) {
        const { c, r } = rockCoords[i];
        const rng = createSeededRng(hashSeed('arctic_rock_cell', c, r));
        const { x, z } = cellToWorldCenter(c, r);
        const mx = x + rng.range(-0.20, 0.20);
        const mz = z + rng.range(-0.20, 0.20);
        const reliefY = getReliefY(mx, mz);

        const variant = selectNonAdjacentVariant(c, r, 'arctic_crag_var', 3, variantByCell);
        dummy.position.set(mx, Math.max(0, reliefY - 0.05), mz);
        dummy.rotation.set(rng.range(-0.04, 0.04), rng.range(0, Math.PI * 2), rng.range(-0.04, 0.04));
        dummy.scale.set(rng.range(0.86, 1.14), rng.range(0.84, 1.22), rng.range(0.86, 1.12));
        dummy.updateMatrix();
        cragBuckets[variant].push({
          matrix: dummy.matrix.clone(),
          hex: cragTints[rng.int(0, cragTints.length - 1)]
        });

        dummy.position.set(mx, Math.max(-0.02, reliefY * 0.45 - 0.03), mz);
        dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
        dummy.scale.set(rng.range(0.96, 1.14), rng.range(0.85, 1.10), rng.range(0.96, 1.14));
        dummy.updateMatrix();
        skirtItems.push({ matrix: dummy.matrix.clone(), hex: cragTints[rng.int(0, cragTints.length - 1)] });

        // 3 Glacial talus boulders around perimeter
        for (let b = 0; b < 3; b++) {
          const ang = (b / 3) * Math.PI * 2 + rng.range(-0.42, 0.42);
          const rad = rng.range(0.96, 1.44);
          const bx = x + Math.cos(ang) * rad;
          const bz = z + Math.sin(ang) * rad;
          const by = getReliefY(bx, bz);
          dummy.position.set(bx, Math.max(-0.03, by - 0.04), bz);
          dummy.rotation.set(rng.range(-0.14, 0.14), rng.range(0, Math.PI * 2), rng.range(-0.14, 0.14));
          dummy.scale.set(rng.range(0.72, 1.22), rng.range(0.65, 1.12), rng.range(0.72, 1.20));
          dummy.updateMatrix();
          talusItems.push({ matrix: dummy.matrix.clone(), hex: cragTints[rng.int(0, cragTints.length - 1)] });
        }

        // 2 Snow-laden pines anchored on leeward flanks
        for (let t = 0; t < 2; t++) {
          const ta = t * Math.PI + rng.range(-0.65, 0.65) + 0.35;
          const tr = rng.range(1.16, 1.56);
          const tx = x + Math.cos(ta) * tr;
          const tz = z + Math.sin(ta) * tr;
          const ty = getReliefY(tx, tz);
          dummy.position.set(tx, Math.max(-0.02, ty - 0.03), tz);
          dummy.rotation.set(rng.range(-0.04, 0.04), rng.range(0, Math.PI * 2), rng.range(-0.04, 0.04));
          const s = rng.range(0.82, 1.18);
          dummy.scale.set(s, s * rng.range(0.90, 1.16), s);
          dummy.updateMatrix();
          pineItems.push({ matrix: dummy.matrix.clone(), hex: pineTints[rng.int(0, pineTints.length - 1)] });
        }
      }

      for (let v = 0; v < 3; v++) {
        createBucketedInst(`ArcticGraniteCrags_v${v}`, cragGeos[v], graniteMat, cragBuckets[v], true, true);
      }
      createBucketedInst('ArcticGravelSkirts', skirtGeo, skirtMat, skirtItems, false, true);
      createBucketedInst('ArcticTalusBoulders', talusGeo, graniteMat, talusItems, true, true);
      createBucketedInst('ArcticSnowyPines', pineGeo, pineMat, pineItems, true, true);
    } else if (nRocks > 0 && biome === 'industrial') {
      // INDUSTRIAL: 2 Factory Ruin Variants + Silos + Twisted I-Beams + Concrete Skirts + Jersey Barriers (6 calls)
      const factoryGeos: [THREE.BufferGeometry, THREE.BufferGeometry] = [
        trackGeo(buildIndustrialFactoryVariant(0)),
        trackGeo(buildIndustrialFactoryVariant(1))
      ];
      const siloGeo = trackGeo(buildIndustrialSiloGeometry());
      const girderGeo = trackGeo(buildIndustrialIBeamGeometry());
      const skirtGeo = trackGeo(buildSkirtApronGeometry(8.8, 0x3b414a, 0x525a64, 1.24, 1.92, 0.16));
      const jerseyGeo = trackGeo(buildJerseyBarrierGeometry(1.14, 0.44));

      const concreteRuinMat = trackMat(
        makeSafePBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.86,
          metalness: 0.06,
          bumpScale: 0.055,
          envMapIntensity: 0.72,
          vertexColors: true
        })
      );
      const siloMat = trackMat(
        makeSafePBRMaterial('natoArmorPlate', {
          color: 0xffffff,
          roughness: 0.56,
          metalness: 0.42,
          bumpScale: 0.04,
          envMapIntensity: 0.92,
          vertexColors: true
        })
      );
      const girderMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.52,
          metalness: 0.62,
          envMapIntensity: 0.95,
          vertexColors: true
        })
      );

      const factoryBuckets: Array<Array<{ matrix: THREE.Matrix4; hex: number }>> = [[], []];
      const siloItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const girderItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const skirtItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const jerseyItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const variantByCell = new Map<string, number>();

      const wallTints = [0xf2f4f7, 0xe2e6eb, 0xd8dde3, 0xebe6e0];
      const steelTints = [0xf4f6f8, 0xe6e0da, 0xd9dfe6];

      for (let i = 0; i < nRocks; i++) {
        const { c, r } = rockCoords[i];
        const rng = createSeededRng(hashSeed('industrial_rock_cell', c, r));
        const { x, z } = cellToWorldCenter(c, r);
        const reliefY = getReliefY(x, z);
        const baseY = Math.max(0, reliefY - 0.03);

        // Snap factory blocks to crisp 90° + subtle ruin jitter so silhouettes feel architectural
        const quarterTurn = rng.int(0, 3) * (Math.PI * 0.5) + rng.range(-0.10, 0.10);
        const variant = selectNonAdjacentVariant(c, r, 'ind_factory_var', 2, variantByCell);

        dummy.position.set(x + rng.range(-0.14, 0.14), baseY, z + rng.range(-0.14, 0.14));
        dummy.rotation.set(0, quarterTurn, 0);
        dummy.scale.set(rng.range(0.88, 1.04), rng.range(0.88, 1.14), rng.range(0.88, 1.04));
        dummy.updateMatrix();
        factoryBuckets[variant].push({
          matrix: dummy.matrix.clone(),
          hex: wallTints[rng.int(0, wallTints.length - 1)]
        });

        // Cracked concrete rubble foundation pad
        dummy.position.set(x, Math.max(-0.02, reliefY * 0.45 - 0.02), z);
        dummy.rotation.set(0, quarterTurn, 0);
        dummy.scale.set(rng.range(0.95, 1.05), 1, rng.range(0.95, 1.05));
        dummy.updateMatrix();
        skirtItems.push({ matrix: dummy.matrix.clone(), hex: wallTints[rng.int(0, wallTints.length - 1)] });

        // Cylindrical chamfered silo on ~75% of cells, tightly bounded inside cell footprint
        if (rng() < 0.78) {
          const sAng = quarterTurn + Math.PI * 0.25;
          const sx = x + Math.cos(sAng) * 0.96;
          const sz = z + Math.sin(sAng) * 0.96;
          dummy.position.set(sx, Math.max(0, getReliefY(sx, sz) - 0.02), sz);
          dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
          const sc = rng.range(0.86, 1.06);
          dummy.scale.set(sc, sc * rng.range(0.90, 1.15), sc);
          dummy.updateMatrix();
          siloItems.push({ matrix: dummy.matrix.clone(), hex: steelTints[rng.int(0, steelTints.length - 1)] });
        }

        // 1–2 twisted structural I-beams jutting from the wreckage
        const nGirders = rng() < 0.55 ? 2 : 1;
        for (let g = 0; g < nGirders; g++) {
          const ga = quarterTurn + Math.PI * (0.9 + g * 0.55) + rng.range(-0.22, 0.22);
          const gx = x + Math.cos(ga) * rng.range(0.72, 1.08);
          const gz = z + Math.sin(ga) * rng.range(0.72, 1.08);
          dummy.position.set(gx, Math.max(0, getReliefY(gx, gz) - 0.05), gz);
          dummy.rotation.set(rng.range(-0.34, 0.34), rng.range(0, Math.PI * 2), rng.range(-0.32, 0.32));
          dummy.scale.set(1, rng.range(0.80, 1.12), 1);
          dummy.updateMatrix();
          girderItems.push({ matrix: dummy.matrix.clone(), hex: steelTints[rng.int(0, steelTints.length - 1)] });
        }

        // Jersey barricade along perimeter edge
        const ja = quarterTurn + Math.PI * 1.5;
        const jx = x + Math.cos(ja) * 1.38;
        const jz = z + Math.sin(ja) * 1.38;
        dummy.position.set(jx, Math.max(0, getReliefY(jx, jz) - 0.02), jz);
        dummy.rotation.set(0, ja + Math.PI * 0.5 + rng.range(-0.14, 0.14), 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        jerseyItems.push({ matrix: dummy.matrix.clone(), hex: wallTints[rng.int(0, wallTints.length - 1)] });
      }

      createBucketedInst('IndustrialFactoryBlock_v0', factoryGeos[0], concreteRuinMat, factoryBuckets[0], true, true);
      createBucketedInst('IndustrialFactoryBlock_v1', factoryGeos[1], concreteRuinMat, factoryBuckets[1], true, true);
      createBucketedInst('IndustrialSilos', siloGeo, siloMat, siloItems, true, true);
      createBucketedInst('IndustrialIBeamGirders', girderGeo, girderMat, girderItems, true, true);
      createBucketedInst('IndustrialConcreteSkirts', skirtGeo, concreteRuinMat, skirtItems, false, true);
      createBucketedInst('IndustrialJerseyBarriers', jerseyGeo, concreteRuinMat, jerseyItems, true, true);
    } else if (nRocks > 0 && biome === 'forest') {
      // FOREST: 2 Mossy Rock Variants + Earth Skirts + Tree Trunks + Layered Canopies w/ GPU Wind (5 calls)
      const rockGeos: [THREE.BufferGeometry, THREE.BufferGeometry] = [
        trackGeo(buildForestMossyRockVariant(0)),
        trackGeo(buildForestMossyRockVariant(1))
      ];
      const skirtGeo = trackGeo(buildSkirtApronGeometry(5.5, 0x3b4a2e, 0x4b3f2e, 1.12, 2.02, 0.22));
      const trunkGeo = trackGeo(buildForestTrunkGeometry());
      const canopyGeo = trackGeo(buildForestCanopyGeometry());

      const mossyRockMat = trackMat(
        makeSafePBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.88,
          metalness: 0.02,
          bumpScale: 0.06,
          envMapIntensity: 0.62,
          vertexColors: true,
          flatShading: true
        })
      );
      const skirtMat = trackMat(
        makeSafePBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.94,
          metalness: 0.01,
          bumpScale: 0.045,
          envMapIntensity: 0.52,
          vertexColors: true
        })
      );
      const trunkMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.92,
          metalness: 0.0,
          vertexColors: true,
          flatShading: true
        })
      );
      const { material: canopyMat, uniforms: canopyWind } = createFoliageWindMaterial({
        windStrength: 0.075,
        windFreq: 1.42,
        roughness: 0.85,
        envMapIntensity: 0.62
      });
      trackMat(canopyMat);
      activeTimeUniforms.push(canopyWind.uTime);

      const rockBuckets: Array<Array<{ matrix: THREE.Matrix4; hex: number }>> = [[], []];
      const skirtItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const trunkItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const canopyItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const variantByCell = new Map<string, number>();

      const rockTints = [0xf2f6ef, 0xe5ece1, 0xebeee8];
      const foliageTints = [0xf4faee, 0xdff0d5, 0xebf6d8, 0xd2e7cc];
      const barkTints = [0xf5efe8, 0xe4d9cc, 0xd8ccbe];

      for (let i = 0; i < nRocks; i++) {
        const { c, r } = rockCoords[i];
        const rng = createSeededRng(hashSeed('forest_rock_cell', c, r));
        const { x, z } = cellToWorldCenter(c, r);
        const mx = x + rng.range(-0.18, 0.18);
        const mz = z + rng.range(-0.18, 0.18);
        const reliefY = getReliefY(mx, mz);

        const variant = selectNonAdjacentVariant(c, r, 'forest_rock_var', 2, variantByCell);
        dummy.position.set(mx, Math.max(0, reliefY - 0.04), mz);
        dummy.rotation.set(rng.range(-0.04, 0.04), rng.range(0, Math.PI * 2), rng.range(-0.04, 0.04));
        dummy.scale.set(rng.range(0.82, 1.08), rng.range(0.78, 1.12), rng.range(0.82, 1.08));
        dummy.updateMatrix();
        rockBuckets[variant].push({
          matrix: dummy.matrix.clone(),
          hex: rockTints[rng.int(0, rockTints.length - 1)]
        });

        dummy.position.set(mx, Math.max(-0.02, reliefY * 0.45 - 0.03), mz);
        dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
        dummy.scale.set(rng.range(0.96, 1.14), rng.range(0.85, 1.1), rng.range(0.96, 1.14));
        dummy.updateMatrix();
        skirtItems.push({ matrix: dummy.matrix.clone(), hex: rockTints[rng.int(0, rockTints.length - 1)] });

        // 3 tactical multi-layered forest trees clustering around the mossy outcrop
        for (let t = 0; t < 3; t++) {
          const ta = (t / 3) * Math.PI * 2 + rng.range(-0.42, 0.42);
          const tr = rng.range(0.88, 1.48);
          const tx = x + Math.cos(ta) * tr;
          const tz = z + Math.sin(ta) * tr;
          const ty = getReliefY(tx, tz);
          const sXZ = rng.range(0.80, 1.18);
          const sY = rng.range(0.82, 1.24);
          const rotY = rng.range(0, Math.PI * 2);

          dummy.position.set(tx, Math.max(-0.02, ty - 0.03), tz);
          dummy.rotation.set(0, rotY, 0);
          dummy.scale.set(sXZ, sY, sXZ);
          dummy.updateMatrix();
          const m = dummy.matrix.clone();

          trunkItems.push({ matrix: m, hex: barkTints[rng.int(0, barkTints.length - 1)] });
          canopyItems.push({ matrix: m, hex: foliageTints[rng.int(0, foliageTints.length - 1)] });
        }
      }

      createBucketedInst('ForestMossyRocks_v0', rockGeos[0], mossyRockMat, rockBuckets[0], true, true);
      createBucketedInst('ForestMossyRocks_v1', rockGeos[1], mossyRockMat, rockBuckets[1], true, true);
      createBucketedInst('ForestEarthSkirts', skirtGeo, skirtMat, skirtItems, false, true);
      createBucketedInst('ForestTreeTrunks', trunkGeo, trunkMat, trunkItems, true, true);
      createBucketedInst('ForestTreeCanopies', canopyGeo, canopyMat, canopyItems, true, true);
    } else if (nRocks > 0 && biome === 'canyon') {
      // CANYON: 3 Terracotta Mesa/Hoodoo Variants + Sandstone Skirts + Talus + Dry Scrub (6 calls)
      const mesaGeos: [THREE.BufferGeometry, THREE.BufferGeometry, THREE.BufferGeometry] = [
        trackGeo(buildCanyonMesaVariant(0)),
        trackGeo(buildCanyonMesaVariant(1)),
        trackGeo(buildCanyonMesaVariant(2))
      ];
      const skirtGeo = trackGeo(buildSkirtApronGeometry(7.2, 0x5c2e1f, 0x87442b, 1.06, 2.02, 0.24));
      const talusGeo = trackGeo(buildTalusBoulderGeometry(9.4, 0x8c442c, 0xc27044, 0.58));
      const scrubGeo = trackGeo(buildDryScrubGeometry('canyon_dry_scrub', 0x584d2c, 0x85753d));

      const sandstoneMat = trackMat(
        makeSafePBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.90,
          metalness: 0.02,
          bumpScale: 0.07,
          envMapIntensity: 0.62,
          vertexColors: true,
          flatShading: true
        })
      );
      const skirtMat = trackMat(
        makeSafePBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.95,
          metalness: 0.01,
          bumpScale: 0.05,
          envMapIntensity: 0.55,
          vertexColors: true
        })
      );
      const scrubMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.92,
          metalness: 0.0,
          vertexColors: true,
          flatShading: true
        })
      );

      const mesaBuckets: Array<Array<{ matrix: THREE.Matrix4; hex: number }>> = [[], [], []];
      const skirtItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const talusItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const scrubItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const variantByCell = new Map<string, number>();

      const mesaTints = [0xffffff, 0xf6ece4, 0xefe0d6, 0xfaeae0];
      const scrubTints = [0xf4f0dc, 0xe2dbbe, 0xebe4cc];

      for (let i = 0; i < nRocks; i++) {
        const { c, r } = rockCoords[i];
        const rng = createSeededRng(hashSeed('canyon_rock_cell', c, r));
        const { x, z } = cellToWorldCenter(c, r);
        const mx = x + rng.range(-0.20, 0.20);
        const mz = z + rng.range(-0.20, 0.20);
        const reliefY = getReliefY(mx, mz);

        const variant = selectNonAdjacentVariant(c, r, 'canyon_mesa_var', 3, variantByCell);
        dummy.position.set(mx, Math.max(0, reliefY - 0.05), mz);
        dummy.rotation.set(rng.range(-0.04, 0.04), rng.range(0, Math.PI * 2), rng.range(-0.04, 0.04));
        dummy.scale.set(rng.range(0.86, 1.15), rng.range(0.84, 1.24), rng.range(0.86, 1.14));
        dummy.updateMatrix();
        mesaBuckets[variant].push({
          matrix: dummy.matrix.clone(),
          hex: mesaTints[rng.int(0, mesaTints.length - 1)]
        });

        dummy.position.set(mx, Math.max(-0.02, reliefY * 0.45 - 0.03), mz);
        dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
        dummy.scale.set(rng.range(0.98, 1.15), rng.range(0.85, 1.10), rng.range(0.96, 1.14));
        dummy.updateMatrix();
        skirtItems.push({ matrix: dummy.matrix.clone(), hex: mesaTints[rng.int(0, mesaTints.length - 1)] });

        for (let b = 0; b < 3; b++) {
          const ang = (b / 3) * Math.PI * 2 + rng.range(-0.45, 0.45);
          const rad = rng.range(0.95, 1.44);
          const bx = x + Math.cos(ang) * rad;
          const bz = z + Math.sin(ang) * rad;
          dummy.position.set(bx, Math.max(-0.03, getReliefY(bx, bz) - 0.04), bz);
          dummy.rotation.set(rng.range(-0.14, 0.14), rng.range(0, Math.PI * 2), rng.range(-0.14, 0.14));
          dummy.scale.set(rng.range(0.74, 1.24), rng.range(0.66, 1.16), rng.range(0.74, 1.22));
          dummy.updateMatrix();
          talusItems.push({ matrix: dummy.matrix.clone(), hex: mesaTints[rng.int(0, mesaTints.length - 1)] });
        }

        for (let s = 0; s < 2; s++) {
          const ang = s * Math.PI + rng.range(-0.62, 0.62) + 0.4;
          const rad = rng.range(1.18, 1.60);
          const sx = x + Math.cos(ang) * rad;
          const sz = z + Math.sin(ang) * rad;
          dummy.position.set(sx, Math.max(0, getReliefY(sx, sz) - 0.02), sz);
          dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
          dummy.scale.setScalar(rng.range(0.85, 1.32));
          dummy.updateMatrix();
          scrubItems.push({ matrix: dummy.matrix.clone(), hex: scrubTints[rng.int(0, scrubTints.length - 1)] });
        }
      }

      for (let v = 0; v < 3; v++) {
        createBucketedInst(`CanyonTerracottaMesas_v${v}`, mesaGeos[v], sandstoneMat, mesaBuckets[v], true, true);
      }
      createBucketedInst('CanyonSandstoneSkirts', skirtGeo, skirtMat, skirtItems, false, true);
      createBucketedInst('CanyonTalusPebbles', talusGeo, sandstoneMat, talusItems, true, true);
      createBucketedInst('CanyonDryScrub', scrubGeo, scrubMat, scrubItems, true, true);
    } else if (nRocks > 0 && biome === 'swamp') {
      // SWAMP: 2 Mossy Mud Mounds + Bog Skirts + Gnarled Trunks + Weeping Canopies (GPU Wind) + Pilings/Reeds (6 calls)
      const moundGeos: [THREE.BufferGeometry, THREE.BufferGeometry] = [
        trackGeo(buildSwampMoundVariant(0)),
        trackGeo(buildSwampMoundVariant(1))
      ];
      const skirtGeo = trackGeo(buildSkirtApronGeometry(11.6, 0x1e2820, 0x2f3f31, 1.14, 2.04, 0.18));
      const trunkGeo = trackGeo(buildSwampGnarledTrunkGeometry());
      const canopyGeo = trackGeo(buildSwampWeepingCanopyGeometry());
      const reedGeo = trackGeo(buildSwampPilingsAndReedsGeometry());

      const moundMat = trackMat(
        makeSafePBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.66,
          metalness: 0.03,
          bumpScale: 0.06,
          envMapIntensity: 0.72,
          vertexColors: true,
          flatShading: true
        })
      );
      const skirtMat = trackMat(
        makeSafePBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.48,
          metalness: 0.04,
          bumpScale: 0.04,
          envMapIntensity: 0.78,
          vertexColors: true
        })
      );
      const barkMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.86,
          metalness: 0.02,
          vertexColors: true,
          flatShading: true
        })
      );
      const { material: weepingMat, uniforms: swampWind } = createFoliageWindMaterial({
        windStrength: 0.052,
        windFreq: 0.92,
        roughness: 0.84,
        envMapIntensity: 0.60
      });
      trackMat(weepingMat);
      activeTimeUniforms.push(swampWind.uTime);

      const moundBuckets: Array<Array<{ matrix: THREE.Matrix4; hex: number }>> = [[], []];
      const skirtItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const trunkItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const canopyItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const reedItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const variantByCell = new Map<string, number>();

      const bogTints = [0xf2f7f0, 0xe1ebe0, 0xd8e4d8];
      const canopyTints = [0xeef6e8, 0xdcebd2, 0xd0e2cc];

      for (let i = 0; i < nRocks; i++) {
        const { c, r } = rockCoords[i];
        const rng = createSeededRng(hashSeed('swamp_rock_cell', c, r));
        const { x, z } = cellToWorldCenter(c, r);
        const mx = x + rng.range(-0.18, 0.18);
        const mz = z + rng.range(-0.18, 0.18);
        const reliefY = getReliefY(mx, mz);

        const variant = selectNonAdjacentVariant(c, r, 'swamp_mound_var', 2, variantByCell);
        dummy.position.set(mx, Math.max(0, reliefY - 0.04), mz);
        dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
        dummy.scale.set(rng.range(0.88, 1.14), rng.range(0.82, 1.18), rng.range(0.88, 1.14));
        dummy.updateMatrix();
        moundBuckets[variant].push({
          matrix: dummy.matrix.clone(),
          hex: bogTints[rng.int(0, bogTints.length - 1)]
        });

        dummy.position.set(mx, Math.max(-0.02, reliefY * 0.45 - 0.03), mz);
        dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
        dummy.scale.set(rng.range(0.98, 1.16), 1, rng.range(0.98, 1.16));
        dummy.updateMatrix();
        skirtItems.push({ matrix: dummy.matrix.clone(), hex: bogTints[rng.int(0, bogTints.length - 1)] });

        // 2 gnarled cypress/willow trees
        for (let t = 0; t < 2; t++) {
          const ta = t * Math.PI + rng.range(-0.55, 0.55) + 0.3;
          const tr = rng.range(0.82, 1.34);
          const tx = x + Math.cos(ta) * tr;
          const tz = z + Math.sin(ta) * tr;
          const ty = getReliefY(tx, tz);
          const s = rng.range(0.84, 1.18);
          dummy.position.set(tx, Math.max(-0.02, ty - 0.03), tz);
          dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
          dummy.scale.set(s, s * rng.range(0.90, 1.16), s);
          dummy.updateMatrix();
          const m = dummy.matrix.clone();
          trunkItems.push({ matrix: m, hex: bogTints[rng.int(0, bogTints.length - 1)] });
          canopyItems.push({ matrix: m, hex: canopyTints[rng.int(0, canopyTints.length - 1)] });
        }

        // 2 submerged piling & reed clusters
        for (let p = 0; p < 2; p++) {
          const pa = p * Math.PI + Math.PI * 0.5 + rng.range(-0.5, 0.5);
          const pr = rng.range(1.18, 1.58);
          const px = x + Math.cos(pa) * pr;
          const pz = z + Math.sin(pa) * pr;
          dummy.position.set(px, Math.max(-0.02, getReliefY(px, pz) - 0.03), pz);
          dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
          dummy.scale.setScalar(rng.range(0.88, 1.24));
          dummy.updateMatrix();
          reedItems.push({ matrix: dummy.matrix.clone(), hex: bogTints[rng.int(0, bogTints.length - 1)] });
        }
      }

      createBucketedInst('SwampMudRockMounds_v0', moundGeos[0], moundMat, moundBuckets[0], true, true);
      createBucketedInst('SwampMudRockMounds_v1', moundGeos[1], moundMat, moundBuckets[1], true, true);
      createBucketedInst('SwampBogSkirts', skirtGeo, skirtMat, skirtItems, false, true);
      createBucketedInst('SwampGnarledTrunks', trunkGeo, barkMat, trunkItems, true, true);
      createBucketedInst('SwampWeepingCanopies', canopyGeo, weepingMat, canopyItems, true, true);
      createBucketedInst('SwampPilingsAndReeds', reedGeo, barkMat, reedItems, true, true);
    } else if (nRocks > 0 && biome === 'volcanic') {
      // VOLCANIC: 3 Hexagonal Basalt Column Clusters + Ash Skirts + Scoria Blocks (5 calls)
      const basaltGeos: [THREE.BufferGeometry, THREE.BufferGeometry, THREE.BufferGeometry] = [
        trackGeo(buildVolcanicBasaltVariant(0)),
        trackGeo(buildVolcanicBasaltVariant(1)),
        trackGeo(buildVolcanicBasaltVariant(2))
      ];
      const skirtGeo = trackGeo(buildSkirtApronGeometry(14.3, 0x261f20, 0x3f2620, 1.12, 2.02, 0.22));
      const scoriaGeo = trackGeo(buildTalusBoulderGeometry(16.7, 0x3b2420, 0x2c2528, 0.45));

      const basaltMat = trackMat(
        makeSafePBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.80,
          metalness: 0.05,
          bumpScale: 0.065,
          envMapIntensity: 0.68,
          vertexColors: true,
          flatShading: true
        })
      );
      const ashSkirtMat = trackMat(
        makeSafePBRMaterial('concreteBunker', {
          color: 0xffffff,
          roughness: 0.94,
          metalness: 0.02,
          bumpScale: 0.05,
          envMapIntensity: 0.48,
          vertexColors: true
        })
      );

      const basaltBuckets: Array<Array<{ matrix: THREE.Matrix4; hex: number }>> = [[], [], []];
      const skirtItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const scoriaItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
      const variantByCell = new Map<string, number>();

      const basaltTints = [0xffffff, 0xf2ecea, 0xe8e2e4];

      for (let i = 0; i < nRocks; i++) {
        const { c, r } = rockCoords[i];
        const rng = createSeededRng(hashSeed('volcanic_rock_cell', c, r));
        const { x, z } = cellToWorldCenter(c, r);
        const mx = x + rng.range(-0.18, 0.18);
        const mz = z + rng.range(-0.18, 0.18);
        const reliefY = getReliefY(mx, mz);

        const variant = selectNonAdjacentVariant(c, r, 'volcanic_basalt_var', 3, variantByCell);
        dummy.position.set(mx, Math.max(0, reliefY - 0.05), mz);
        dummy.rotation.set(rng.range(-0.03, 0.03), rng.range(0, Math.PI * 2), rng.range(-0.03, 0.03));
        dummy.scale.set(rng.range(0.88, 1.14), rng.range(0.84, 1.24), rng.range(0.88, 1.14));
        dummy.updateMatrix();
        basaltBuckets[variant].push({
          matrix: dummy.matrix.clone(),
          hex: basaltTints[rng.int(0, basaltTints.length - 1)]
        });

        dummy.position.set(mx, Math.max(-0.02, reliefY * 0.45 - 0.03), mz);
        dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
        dummy.scale.set(rng.range(0.98, 1.16), rng.range(0.85, 1.10), rng.range(0.98, 1.16));
        dummy.updateMatrix();
        skirtItems.push({ matrix: dummy.matrix.clone(), hex: basaltTints[rng.int(0, basaltTints.length - 1)] });

        for (let b = 0; b < 3; b++) {
          const ang = (b / 3) * Math.PI * 2 + rng.range(-0.44, 0.44);
          const rad = rng.range(0.96, 1.46);
          const bx = x + Math.cos(ang) * rad;
          const bz = z + Math.sin(ang) * rad;
          dummy.position.set(bx, Math.max(-0.03, getReliefY(bx, bz) - 0.04), bz);
          dummy.rotation.set(rng.range(-0.16, 0.16), rng.range(0, Math.PI * 2), rng.range(-0.16, 0.16));
          dummy.scale.set(rng.range(0.72, 1.24), rng.range(0.64, 1.14), rng.range(0.72, 1.22));
          dummy.updateMatrix();
          scoriaItems.push({ matrix: dummy.matrix.clone(), hex: basaltTints[rng.int(0, basaltTints.length - 1)] });
        }
      }

      for (let v = 0; v < 3; v++) {
        createBucketedInst(`VolcanicBasaltColumns_v${v}`, basaltGeos[v], basaltMat, basaltBuckets[v], true, true);
      }
      createBucketedInst('VolcanicAshSkirts', skirtGeo, ashSkirtMat, skirtItems, false, true);
      createBucketedInst('VolcanicScoriaBlocks', scoriaGeo, basaltMat, scoriaItems, true, true);
    }
  }

  // ==========================================================================
  // 2. ROAD TURN SHOULDER PROPS (InstancedMesh for the 6 non-desert biomes)
  // ==========================================================================
  if (biome !== 'desert') {
    const isRoad = (c: number, r: number): boolean =>
      c >= 0 && c < GRID_COLS && r >= 0 && r < GRID_ROWS && baseTerrain[r]?.[c] === CELL.ROAD;

    const useBarricades = biome === 'industrial' || biome === 'volcanic';
    const coverItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
    const drumItems: Array<{ matrix: THREE.Matrix4; hex: number }> = [];
    const poleItems: Array<{ matrix: THREE.Matrix4 }> = [];

    const coverPaletteByBiome: Record<Exclude<BiomePropsWorldBiome, 'desert'>, [number, number]> = {
      arctic: [0xc6d3df, 0xb0c0cf],
      industrial: [0xe6eaef, 0xd4dae2],
      forest: [0x99a37d, 0x7e8a66],
      canyon: [0xd9b38c, 0xc29872],
      swamp: [0x7e876a, 0x677057],
      volcanic: [0x6e6668, 0x574e51]
    };
    const drumPaletteByBiome: Record<Exclude<BiomePropsWorldBiome, 'desert'>, [number, number]> = {
      arctic: [0x3b6e8c, 0xb85233],
      industrial: [0xc2541d, 0x566474],
      forest: [0x586b43, 0xa84b31],
      canyon: [0xb4532a, 0x737d5c],
      swamp: [0x4b5e42, 0x8f6b24],
      volcanic: [0xb43b24, 0x4b484d]
    };

    const coverPal = coverPaletteByBiome[biome] ?? coverPaletteByBiome.forest;
    const drumPal = drumPaletteByBiome[biome] ?? drumPaletteByBiome.forest;

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (baseTerrain[r]?.[c] !== CELL.ROAD) continue;
        const up = isRoad(c, r - 1);
        const down = isRoad(c, r + 1);
        const left = isRoad(c - 1, r);
        const right = isRoad(c + 1, r);

        const isTurn = (up || down) && (left || right) && !(up && down) && !(left && right);
        if (!isTurn) continue;

        const { x, z } = cellToWorldCenter(c, r);
        const ox = left ? 1.56 : -1.56;
        const oz = up ? 1.56 : -1.56;
        const turnRng = createSeededRng(hashSeed('biome_turn_prop', biome, c, r));

        if (useBarricades) {
          dummy.position.set(x + ox * 0.86, 0.0, z + oz * 0.86);
          dummy.rotation.set(0, (ox * oz > 0 ? -1 : 1) * (Math.PI / 4) + turnRng.range(-0.08, 0.08), 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          coverItems.push({ matrix: dummy.matrix.clone(), hex: coverPal[(c + r) % 2] });
        } else {
          for (let b = 0; b < 3; b++) {
            dummy.position.set(
              x + ox * (1 - b * 0.14),
              0.11 + (b === 2 ? 0.18 : 0),
              z + oz * (1 - (2 - b) * 0.14)
            );
            dummy.rotation.set(0, (ox * oz > 0 ? -1 : 1) * (Math.PI / 4) + turnRng.range(-0.08, 0.08), 0);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            coverItems.push({ matrix: dummy.matrix.clone(), hex: coverPal[b % 2] });
          }
        }

        if ((c + r) % 2 === 0) {
          dummy.position.set(x + ox, 0, z + oz);
          dummy.rotation.set(0, Math.atan2(-ox, -oz), 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          poleItems.push({ matrix: dummy.matrix.clone() });
        } else {
          dummy.position.set(x + ox, 0.21, z + oz);
          dummy.rotation.set(0, turnRng.range(0, Math.PI * 2), 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          drumItems.push({ matrix: dummy.matrix.clone(), hex: drumPal[(c + r) % 3 === 0 ? 0 : 1] });
        }
      }
    }

    if (coverItems.length > 0) {
      if (useBarricades) {
        const barricadeGeo = trackGeo(buildJerseyBarrierGeometry(0.92, 0.36));
        const barricadeMat = trackMat(
          makeSafePBRMaterial('concreteBunker', {
            color: 0xffffff,
            roughness: 0.88,
            metalness: 0.04,
            bumpScale: 0.05,
            vertexColors: true
          })
        );
        createBucketedInst('TurnShoulderBarricades', barricadeGeo, barricadeMat, coverItems, true, true);
      } else {
        const bagBevelGeo = trackGeo(getRoundedBoxGeo(0.44, 0.22, 0.28, 0.055, 2).clone());
        applyVerticalAOToGeometry(bagBevelGeo, -0.11, 0.11, 0.48);
        const bagMat = trackMat(
          makeSafePBRMaterial('sandbagBurlap', {
            color: 0xffffff,
            roughness: 0.94,
            metalness: 0.0,
            bumpScale: 0.08,
            vertexColors: true
          })
        );
        createBucketedInst('TurnShoulderSandbags', bagBevelGeo, bagMat, coverItems, true, true);
      }
    }

    if (drumItems.length > 0) {
      const drumGeo = trackGeo(getChamferedCylinderGeo(0.15, 0.15, 0.42, 12, 0.025).clone());
      applyVerticalAOToGeometry(drumGeo, -0.21, 0.21, 0.52);
      const drumMat = trackMat(
        makeSafePBRMaterial('natoArmorPlate', {
          color: 0xffffff,
          roughness: 0.68,
          metalness: 0.08,
          bumpScale: 0.035,
          vertexColors: true
        })
      );
      createBucketedInst('TurnShoulderDrums', drumGeo, drumMat, drumItems, true, true);
    }

    if (poleItems.length > 0) {
      const poleParts = [
        cloneTransformed(getChamferedCylinderGeo(0.036, 0.052, 1.35, 8, 0.01), 0, 0.675, 0),
        cloneTransformed(getRoundedBoxGeo(0.055, 0.045, 0.34, 0.01, 1), 0, 1.34, 0.14)
      ];
      const mergedPoleGeo = trackGeo(mergeStaticGeometries(poleParts, { disposeInputs: true }));
      createBucketedInst('TurnShoulderLightPoles', mergedPoleGeo, steelMat, poleItems, true, false);

      const lampGeo = trackGeo(cloneTransformed(getRoundedBoxGeo(0.13, 0.055, 0.15, 0.012, 1), 0, 1.31, 0.26));
      const lampInst = createBucketedInst('TurnShoulderPoleLamps', lampGeo, warmLampMat, poleItems, false, false);
      if (lampInst) lampInst.userData.noShadow = true;
    }
  }

  // ==========================================================================
  // 3. SPECIAL ENVIRONMENTAL SURFACES (InstancedMesh + Custom Shaders)
  // ==========================================================================
  const validCells = (cells: Array<[number, number]> | undefined): Array<[number, number]> => {
    if (!cells || cells.length === 0) return [];
    const out: Array<[number, number]> = [];
    for (let i = 0; i < cells.length; i++) {
      const [c, r] = cells[i];
      if (c >= 0 && c < GRID_COLS && r >= 0 && r < GRID_ROWS) out.push([c, r]);
    }
    return out;
  };

  // 3a. restrictedCells (4-2, 4-3): Chamfered metallic deck slab + safety-orange/gunmetal diagonal stripes
  const restrictedList = validCells(stageFeatures.restrictedCells);
  if (restrictedList.length > 0) {
    const slabGeo = trackGeo(buildRestrictedDeckSlabGeometry());
    const hazardTex = trackTex(createRestrictedHazardTexture());
    const slabMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: hazardTex,
        roughness: 0.52,
        metalness: 0.42,
        envMapIntensity: 0.92
      })
    );
    const inst = trackInst(new THREE.InstancedMesh(slabGeo, slabMat, restrictedList.length));
    inst.name = 'SpecialRestrictedSlabs';
    inst.frustumCulled = false;
    inst.castShadow = false;
    inst.receiveShadow = true;
    for (let i = 0; i < restrictedList.length; i++) {
      const { x, z } = cellToWorldCenter(restrictedList[i][0], restrictedList[i][1]);
      dummy.position.set(x, 0.005, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    group.add(inst);
  }

  // 3b. iceCells (4-3): Chamfered cracked glacial ice sheet (roughness 0.16, metalness 0.04, #78b4e4, NO transmission)
  const iceList = validCells(stageFeatures.iceCells);
  if (iceList.length > 0) {
    const iceGeo = trackGeo(getRoundedBoxGeo(CELL_WORLD * 0.93, 0.068, CELL_WORLD * 0.93, 0.025, 2).clone());
    const { map: iceMap, normalMap: iceNorm } = createCrackedIceTextures();
    trackTex(iceMap);
    trackTex(iceNorm);
    const iceMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: iceMap,
        normalMap: iceNorm,
        normalScale: new THREE.Vector2(1.15, 1.15),
        roughness: 0.16,
        metalness: 0.04,
        envMapIntensity: 0.85
      })
    );
    const inst = trackInst(new THREE.InstancedMesh(iceGeo, iceMat, iceList.length));
    inst.name = 'SpecialIceSheets';
    inst.frustumCulled = false;
    inst.castShadow = false;
    inst.receiveShadow = true;
    for (let i = 0; i < iceList.length; i++) {
      const [c, r] = iceList[i];
      const { x, z } = cellToWorldCenter(c, r);
      const qRot = (hashSeed('ice_rot', c, r) % 4) * (Math.PI * 0.5);
      dummy.position.set(x, 0.034, z);
      dummy.rotation.set(0, qRot, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    group.add(inst);
  }

  // 3c. lavaCells (4-5): Raised basalt rim + animated inner magma bed ('defcon_lava_flow_v1', <= 0.75 Hz)
  const lavaList = validCells(stageFeatures.lavaCells);
  if (lavaList.length > 0) {
    const rimGeo = trackGeo(buildLavaBasaltRimGeometry());
    const rimMat = trackMat(
      makeSafePBRMaterial('concreteBunker', {
        color: 0xffffff,
        roughness: 0.84,
        metalness: 0.04,
        bumpScale: 0.06,
        envMapIntensity: 0.58,
        vertexColors: true,
        flatShading: true
      })
    );
    const bedGeo = trackGeo(new THREE.PlaneGeometry(CELL_WORLD * 0.80, CELL_WORLD * 0.80));
    bedGeo.rotateX(-Math.PI / 2);
    const { material: lavaMat, uTime: lavaTime } = createLavaFlowMaterial();
    trackMat(lavaMat);
    activeTimeUniforms.push(lavaTime);

    const rimInst = trackInst(new THREE.InstancedMesh(rimGeo, rimMat, lavaList.length));
    rimInst.name = 'SpecialLavaBasaltRims';
    rimInst.frustumCulled = false;
    rimInst.castShadow = true;
    rimInst.receiveShadow = true;

    const bedInst = trackInst(new THREE.InstancedMesh(bedGeo, lavaMat, lavaList.length));
    bedInst.name = 'SpecialLavaMoltenBeds';
    bedInst.frustumCulled = false;
    bedInst.castShadow = false;
    bedInst.receiveShadow = false;
    bedInst.userData.noShadow = true;

    for (let i = 0; i < lavaList.length; i++) {
      const [c, r] = lavaList[i];
      const { x, z } = cellToWorldCenter(c, r);
      const qRot = (hashSeed('lava_rot', c, r) % 4) * (Math.PI * 0.5);
      dummy.position.set(x, 0.0, z);
      dummy.rotation.set(0, qRot, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      rimInst.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, 0.085, z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      bedInst.setMatrixAt(i, dummy.matrix);
    }
    rimInst.instanceMatrix.needsUpdate = true;
    bedInst.instanceMatrix.needsUpdate = true;
    group.add(rimInst, bedInst);
  }

  // 3d. toxicCells (4-4): Corroded chamfered curb + viscous acid bog ('defcon_toxic_pool_v1', <= 0.8 Hz, emissive <= 5%)
  const toxicList = validCells(stageFeatures.toxicCells);
  if (toxicList.length > 0) {
    const rimGeo = trackGeo(buildToxicCorrodedRimGeometry());
    const rimMat = trackMat(
      makeSafePBRMaterial('concreteBunker', {
        color: 0xffffff,
        roughness: 0.82,
        metalness: 0.03,
        bumpScale: 0.055,
        envMapIntensity: 0.62,
        vertexColors: true,
        flatShading: true
      })
    );
    const poolGeo = trackGeo(new THREE.PlaneGeometry(CELL_WORLD * 0.80, CELL_WORLD * 0.80));
    poolGeo.rotateX(-Math.PI / 2);
    const { material: toxicMat, uTime: toxicTime } = createToxicPoolMaterial();
    trackMat(toxicMat);
    activeTimeUniforms.push(toxicTime);

    const rimInst = trackInst(new THREE.InstancedMesh(rimGeo, rimMat, toxicList.length));
    rimInst.name = 'SpecialToxicCorrodedRims';
    rimInst.frustumCulled = false;
    rimInst.castShadow = true;
    rimInst.receiveShadow = true;

    const poolInst = trackInst(new THREE.InstancedMesh(poolGeo, toxicMat, toxicList.length));
    poolInst.name = 'SpecialToxicViscousPools';
    poolInst.frustumCulled = false;
    poolInst.castShadow = false;
    poolInst.receiveShadow = true;

    for (let i = 0; i < toxicList.length; i++) {
      const [c, r] = toxicList[i];
      const { x, z } = cellToWorldCenter(c, r);
      const qRot = (hashSeed('toxic_rot', c, r) % 4) * (Math.PI * 0.5);
      dummy.position.set(x, 0.0, z);
      dummy.rotation.set(0, qRot, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      rimInst.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, 0.062, z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      poolInst.setMatrixAt(i, dummy.matrix);
    }
    rimInst.instanceMatrix.needsUpdate = true;
    poolInst.instanceMatrix.needsUpdate = true;
    group.add(rimInst, poolInst);
  }

  // 3e. fogCells (4-4): 2 translucent mist layers (y = 0.14 & y = 0.42), opposite drift in update() w/ 0 allocs
  const fogList = validCells(stageFeatures.fogCells);
  if (fogList.length > 0) {
    const fogTex = trackTex(createSoftFogTexture());
    const fogPlaneGeo = trackGeo(new THREE.PlaneGeometry(CELL_WORLD * 1.48, CELL_WORLD * 1.48));
    fogPlaneGeo.rotateX(-Math.PI / 2);

    fogLowMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xa4bbb0,
        map: fogTex,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    fogHighMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xc2d8cc,
        map: fogTex,
        transparent: true,
        opacity: 0.20,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );

    fogLowMesh = trackInst(new THREE.InstancedMesh(fogPlaneGeo, fogLowMat, fogList.length));
    fogLowMesh.name = 'SpecialFogLayerLow';
    fogLowMesh.frustumCulled = false;
    fogLowMesh.castShadow = false;
    fogLowMesh.receiveShadow = false;
    fogLowMesh.renderOrder = 2;
    fogLowMesh.userData.noShadow = true;

    fogHighMesh = trackInst(new THREE.InstancedMesh(fogPlaneGeo, fogHighMat, fogList.length));
    fogHighMesh.name = 'SpecialFogLayerHigh';
    fogHighMesh.frustumCulled = false;
    fogHighMesh.castShadow = false;
    fogHighMesh.receiveShadow = false;
    fogHighMesh.renderOrder = 3;
    fogHighMesh.userData.noShadow = true;

    for (let i = 0; i < fogList.length; i++) {
      const [c, r] = fogList[i];
      const rng = createSeededRng(hashSeed('fog_cell', c, r));
      const { x, z } = cellToWorldCenter(c, r);

      dummy.position.set(x + rng.range(-0.18, 0.18), 0.14, z + rng.range(-0.18, 0.18));
      dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
      const sLow = rng.range(0.92, 1.12);
      dummy.scale.set(sLow, 1, sLow);
      dummy.updateMatrix();
      fogLowMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x + rng.range(-0.24, 0.24), 0.42, z + rng.range(-0.24, 0.24));
      dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
      const sHigh = rng.range(0.96, 1.18);
      dummy.scale.set(sHigh, 1, sHigh);
      dummy.updateMatrix();
      fogHighMesh.setMatrixAt(i, dummy.matrix);
    }
    fogLowMesh.instanceMatrix.needsUpdate = true;
    fogHighMesh.instanceMatrix.needsUpdate = true;
    group.add(fogLowMesh, fogHighMesh);
  }

  let disposed = false;

  return {
    group,
    update: (elapsed: number, _dt: number) => {
      void _dt;
      if (disposed) return;

      // Zero-allocation scalar uniform updates for foliage wind, lava flow, and toxic pools
      for (let i = 0; i < activeTimeUniforms.length; i++) {
        activeTimeUniforms[i].value = elapsed;
      }

      // Zero-allocation slow opposite drift on the 2 translucent swamp fog layers
      if (fogLowMesh && fogHighMesh && fogLowMat && fogHighMat) {
        fogLowMesh.position.x = Math.sin(elapsed * 0.34) * 0.34;
        fogLowMesh.position.z = Math.cos(elapsed * 0.26) * 0.26;
        fogHighMesh.position.x = -Math.sin(elapsed * 0.28 + 1.35) * 0.46;
        fogHighMesh.position.z = -Math.cos(elapsed * 0.22 + 0.85) * 0.32;
        fogLowMat.opacity = 0.27 + Math.sin(elapsed * 0.9) * 0.03;
        fogHighMat.opacity = 0.19 + Math.cos(elapsed * 0.75 + 0.6) * 0.025;
      }
    },
    dispose: () => {
      if (disposed) return;
      disposed = true;
      for (let i = 0; i < disposableInstances.length; i++) disposableInstances[i].dispose();
      for (let i = 0; i < disposableTextures.length; i++) disposableTextures[i].dispose();
      for (let i = 0; i < disposableGeos.length; i++) disposableGeos[i].dispose();
      for (let i = 0; i < disposableMats.length; i++) disposableMats[i].dispose();
      disposableInstances.length = 0;
      disposableTextures.length = 0;
      disposableGeos.length = 0;
      disposableMats.length = 0;
      activeTimeUniforms.length = 0;
      fogLowMesh = null;
      fogHighMesh = null;
      fogLowMat = null;
      fogHighMat = null;
      group.clear();
    }
  };
}
