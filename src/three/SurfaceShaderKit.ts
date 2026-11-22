import * as THREE from 'three';

/**
 * Canonical global wear-shader variant keys (kept <= 3 to prevent WebGL program bloat).
 */
export const MILITARY_WEAR_VARIANTS = Object.freeze({
  ARMOR: 'armor',
  STEEL: 'steel',
  CONCRETE: 'concrete'
} as const);

export type MilitaryWearVariant = (typeof MILITARY_WEAR_VARIANTS)[keyof typeof MILITARY_WEAR_VARIANTS];

export interface SobelNormalOptions {
  stride?: number;
  channelOffset?: number;
  wrap?: boolean;
  inputMax?: number;
}

/**
 * Pure 3x3 Sobel filter converting a 2D height field into RGBA OpenGL tangent-space normals.
 * - Flat surface -> (128, 128, 255, 255)
 * - Rising height toward +X tilts normal toward -X (R < 128)
 * - Rising height toward +Y (down in canvas = -V in GLSL) tilts normal toward +V (G > 128)
 * Fully deterministic and testable in headless Node.
 */
export function computeSobelNormals(
  heightData: ArrayLike<number>,
  width: number,
  height: number,
  strength = 2.0,
  opts?: SobelNormalOptions
): Uint8ClampedArray {
  const w = Math.max(1, Math.floor(width));
  const h = Math.max(1, Math.floor(height));
  const stride = Math.max(1, Math.floor(opts?.stride ?? 1));
  const channelOffset = Math.max(0, Math.floor(opts?.channelOffset ?? 0));
  const wrap = opts?.wrap !== false;

  const isFloat = heightData instanceof Float32Array || heightData instanceof Float64Array;
  const invMax = opts?.inputMax ? 1 / opts.inputMax : isFloat ? 1.0 : 1 / 255;
  const scale = strength * 0.25;

  const out = new Uint8ClampedArray(w * h * 4);

  const sample = (x: number, y: number): number => {
    let sx = x;
    let sy = y;
    if (wrap) {
      sx = ((x % w) + w) % w;
      sy = ((y % h) + h) % h;
    } else {
      sx = x < 0 ? 0 : x >= w ? w - 1 : x;
      sy = y < 0 ? 0 : y >= h ? h - 1 : y;
    }
    const idx = (sy * w + sx) * stride + channelOffset;
    return (heightData[idx] ?? 0) * invMax;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const tl = sample(x - 1, y - 1);
      const t = sample(x, y - 1);
      const tr = sample(x + 1, y - 1);
      const l = sample(x - 1, y);
      const r = sample(x + 1, y);
      const bl = sample(x - 1, y + 1);
      const b = sample(x, y + 1);
      const br = sample(x + 1, y + 1);

      const gx = tr + 2 * r + br - (tl + 2 * l + bl);
      const gy = bl + 2 * b + br - (tl + 2 * t + tr);

      const nx = -gx * scale;
      const ny = gy * scale;
      const nz = 1.0;
      const invLen = 1.0 / Math.hypot(nx, ny, nz);

      const o = (y * w + x) * 4;
      out[o] = Math.round((nx * invLen * 0.5 + 0.5) * 255);
      out[o + 1] = Math.round((ny * invLen * 0.5 + 0.5) * 255);
      out[o + 2] = Math.round((nz * invLen * 0.5 + 0.5) * 255);
      out[o + 3] = 255;
    }
  }

  return out;
}

/**
 * Generates a tileable tangent-space normal map HTMLCanvasElement from a grayscale height canvas.
 */
export function generateSobelNormalCanvas(
  heightCanvas: HTMLCanvasElement,
  strength = 2.0
): HTMLCanvasElement {
  const w = heightCanvas.width;
  const h = heightCanvas.height;
  const srcCtx = heightCanvas.getContext('2d');
  if (!srcCtx) {
    throw new Error('SurfaceShaderKit.generateSobelNormalCanvas: unable to read 2D context');
  }

  const srcImage = srcCtx.getImageData(0, 0, w, h);
  const normals = computeSobelNormals(srcImage.data, w, h, strength, {
    stride: 4,
    channelOffset: 0,
    wrap: true,
    inputMax: 255
  });

  const outCanvas = document.createElement('canvas');
  outCanvas.width = w;
  outCanvas.height = h;
  const outCtx = outCanvas.getContext('2d');
  if (!outCtx) {
    throw new Error('SurfaceShaderKit.generateSobelNormalCanvas: unable to create output 2D context');
  }

  const outImage = outCtx.createImageData(w, h);
  outImage.data.set(normals);
  outCtx.putImageData(outImage, 0, 0);
  return outCanvas;
}

/**
 * Creates a linear-space (THREE.NoColorSpace) tileable normal CanvasTexture from a height canvas.
 */
export function createNormalTextureFromHeightCanvas(
  heightCanvas: HTMLCanvasElement,
  strength = 2.0,
  repeatX = 1,
  repeatY = 1,
  anisotropy = 4
): THREE.CanvasTexture {
  const normalCanvas = generateSobelNormalCanvas(heightCanvas, strength);
  const tex = new THREE.CanvasTexture(normalCanvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = Math.max(1, anisotropy);
  tex.needsUpdate = true;
  return tex;
}

export interface MilitaryWearShaderOptions {
  variantKey?: MilitaryWearVariant | string;
  dirtHeight?: number;
  dirtStrength?: number;
  dirtColor?: THREE.ColorRepresentation;
  edgeWearStrength?: number;
  macroVarStrength?: number;
}

export interface MilitaryWearUniforms {
  uDefconDirtHeight: { value: number };
  uDefconDirtStrength: { value: number };
  uDefconDirtColor: { value: THREE.Color };
  uDefconEdgeWearStrength: { value: number };
  uDefconMacroVarStrength: { value: number };
}

const WEAR_VERT_PARS = /* glsl */ `
#include <common>
varying vec3 vDefconWorldPos;
varying vec3 vDefconWorldNormal;
`;

const WEAR_VERT_BODY = /* glsl */ `
#include <worldpos_vertex>
vec4 defconWp = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
  defconWp = batchingMatrix * defconWp;
#endif
#ifdef USE_INSTANCING
  defconWp = instanceMatrix * defconWp;
#endif
defconWp = modelMatrix * defconWp;
vDefconWorldPos = defconWp.xyz;

vec3 defconWn = objectNormal;
#ifdef USE_BATCHING
  defconWn = mat3( batchingMatrix ) * defconWn;
#endif
#ifdef USE_INSTANCING
  defconWn = mat3( instanceMatrix ) * defconWn;
#endif
vDefconWorldNormal = normalize( mat3( modelMatrix ) * defconWn + vec3( 1e-6 ) );
`;

const WEAR_FRAG_PARS = /* glsl */ `
#include <common>
varying vec3 vDefconWorldPos;
varying vec3 vDefconWorldNormal;
uniform float uDefconDirtHeight;
uniform float uDefconDirtStrength;
uniform vec3 uDefconDirtColor;
uniform float uDefconEdgeWearStrength;
uniform float uDefconMacroVarStrength;

float defconHash31( vec3 p ) {
  vec3 q = fract( p * 0.1031 );
  q += dot( q, q.yzx + 33.33 );
  return fract( ( q.x + q.y ) * q.z );
}

float defconValueNoise3( vec3 p ) {
  vec3 i = floor( p );
  vec3 f = fract( p );
  f = f * f * ( 3.0 - 2.0 * f );
  float n000 = defconHash31( i + vec3( 0.0, 0.0, 0.0 ) );
  float n100 = defconHash31( i + vec3( 1.0, 0.0, 0.0 ) );
  float n010 = defconHash31( i + vec3( 0.0, 1.0, 0.0 ) );
  float n110 = defconHash31( i + vec3( 1.0, 1.0, 0.0 ) );
  float n001 = defconHash31( i + vec3( 0.0, 0.0, 1.0 ) );
  float n101 = defconHash31( i + vec3( 1.0, 0.0, 1.0 ) );
  float n011 = defconHash31( i + vec3( 0.0, 1.0, 1.0 ) );
  float n111 = defconHash31( i + vec3( 1.0, 1.0, 1.0 ) );
  float nx00 = mix( n000, n100, f.x );
  float nx10 = mix( n010, n110, f.x );
  float nx01 = mix( n001, n101, f.x );
  float nx11 = mix( n011, n111, f.x );
  float nxy0 = mix( nx00, nx10, f.y );
  float nxy1 = mix( nx01, nx11, f.y );
  return mix( nxy0, nxy1, f.z );
}
`;

const WEAR_FRAG_COLOR = /* glsl */ `
#include <color_fragment>
vec3 defconWN = normalize( vDefconWorldNormal );
float defconMacroN = defconValueNoise3( vDefconWorldPos * 0.45 );
float defconDetailN = defconValueNoise3( vDefconWorldPos * 3.1 );

// Subtle deterministic macro paint variation
float defconMacroMod = 1.0 + ( defconMacroN - 0.5 ) * 2.0 * uDefconMacroVarStrength;
diffuseColor.rgb *= defconMacroMod;

// Ground-proximity dirt/dust gradient (y < uDefconDirtHeight)
float defconSafeH = max( uDefconDirtHeight, 0.001 );
float defconDirtGrad = 1.0 - smoothstep( 0.0, defconSafeH, vDefconWorldPos.y + ( defconDetailN - 0.5 ) * 0.16 );
float defconDirtMask = clamp( defconDirtGrad * uDefconDirtStrength * ( 0.72 + 0.28 * defconDetailN ), 0.0, 0.85 );
diffuseColor.rgb = mix( diffuseColor.rgb, uDefconDirtColor, defconDirtMask );

// Subtle upward & bevel-edge metallic wear modulation
float defconUpFactor = smoothstep( 0.35, 0.92, defconWN.y );
float defconCurvProxy = clamp( length( fwidth( defconWN ) ) * 2.2, 0.0, 1.0 );
float defconWearMask = clamp( ( defconUpFactor * 0.45 + defconCurvProxy * 0.85 ) * defconDetailN * uDefconEdgeWearStrength, 0.0, 0.45 );
diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.52, 0.54, 0.56 ), defconWearMask * 0.42 );
`;

const WEAR_FRAG_ROUGHNESS = /* glsl */ `
#include <roughnessmap_fragment>
roughnessFactor = clamp( mix( roughnessFactor, 0.94, defconDirtMask * 0.75 ) - defconWearMask * 0.22, 0.14, 0.98 );
`;

const WEAR_FRAG_METALNESS = /* glsl */ `
#include <metalnessmap_fragment>
metalnessFactor = clamp( mix( metalnessFactor, 0.0, defconDirtMask * 0.85 ) + defconWearMask * 0.35, 0.0, 0.96 );
`;

function normalizeVariantKey(raw?: string): string {
  const cleaned = (raw ?? MILITARY_WEAR_VARIANTS.ARMOR)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');
  return cleaned || MILITARY_WEAR_VARIANTS.ARMOR;
}

/**
 * Patches a MeshStandardMaterial via `onBeforeCompile` + deterministic `customProgramCacheKey`
 * to add world-space base dirt, upward/edge metallic wear, and deterministic macro paint variation.
 * Verified against Three.js r187 ShaderLib.standard chunks and WebGL2 / GLSL ES 3.00.
 */
export function applyMilitaryWearShader(
  material: THREE.MeshStandardMaterial,
  opts?: MilitaryWearShaderOptions
): MilitaryWearUniforms {
  const variantKey = normalizeVariantKey(opts?.variantKey);
  const cacheKey = `defcon_wear_v1_${variantKey}`;

  const uniforms: MilitaryWearUniforms = {
    uDefconDirtHeight: { value: opts?.dirtHeight ?? 0.75 },
    uDefconDirtStrength: { value: opts?.dirtStrength ?? 0.38 },
    uDefconDirtColor: { value: new THREE.Color(opts?.dirtColor ?? 0x4a3f30) },
    uDefconEdgeWearStrength: { value: opts?.edgeWearStrength ?? 0.18 },
    uDefconMacroVarStrength: { value: opts?.macroVarStrength ?? 0.06 }
  };

  material.userData.defconWearVariant = variantKey;
  material.userData.defconWearUniforms = uniforms;
  material.customProgramCacheKey = () => cacheKey;

  const prevOnBeforeCompile = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    if (prevOnBeforeCompile && prevOnBeforeCompile !== THREE.Material.prototype.onBeforeCompile) {
      prevOnBeforeCompile.call(material, shader, renderer);
    }

    shader.uniforms.uDefconDirtHeight = uniforms.uDefconDirtHeight;
    shader.uniforms.uDefconDirtStrength = uniforms.uDefconDirtStrength;
    shader.uniforms.uDefconDirtColor = uniforms.uDefconDirtColor;
    shader.uniforms.uDefconEdgeWearStrength = uniforms.uDefconEdgeWearStrength;
    shader.uniforms.uDefconMacroVarStrength = uniforms.uDefconMacroVarStrength;

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', WEAR_VERT_PARS)
      .replace('#include <worldpos_vertex>', WEAR_VERT_BODY);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', WEAR_FRAG_PARS)
      .replace('#include <color_fragment>', WEAR_FRAG_COLOR)
      .replace('#include <roughnessmap_fragment>', WEAR_FRAG_ROUGHNESS)
      .replace('#include <metalnessmap_fragment>', WEAR_FRAG_METALNESS);
  };

  material.needsUpdate = true;
  return uniforms;
}

/**
 * Updates dirt color uniform in-place without triggering shader recompilation or allocating objects.
 */
export function updateMilitaryWearDirtColor(
  material: THREE.Material,
  color: THREE.ColorRepresentation
): boolean {
  const uniforms = material.userData?.defconWearUniforms as MilitaryWearUniforms | undefined;
  if (!uniforms) return false;
  uniforms.uDefconDirtColor.value.set(color);
  return true;
}
