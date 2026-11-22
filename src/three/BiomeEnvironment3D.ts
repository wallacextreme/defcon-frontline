import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type BiomeId = 'desert' | 'arctic' | 'industrial' | 'forest' | 'canyon' | 'swamp' | 'volcanic';

export interface BiomeLightingSpec {
  biome: BiomeId;
  // Exact color identities preserved from src/data/worlds.js
  skyColor: number;
  fogColor: number;
  fogDensity: number;
  sunColor: number;
  sunIntensity: number;
  sunPosition: readonly [number, number, number];
  rimColor: number;
  rimIntensity: number;
  rimPosition: readonly [number, number, number];
  hemiSkyColor: number;
  hemiGroundColor: number;
  hemiIntensity: number;
  envIntensity: number;
  exposure: number;
  // Sky dome gradient colors (zenith -> horizon -> lower ground tint)
  skyZenithColor: number;
  skyHorizonColor: number;
  skyGroundColor: number;
  // Procedural outdoor PMREM environment parameters
  envSkyColor: number;
  envHorizonColor: number;
  envGroundColor: number;
  envSunDiscColor: number;
  envSunDiscIntensity: number;
}

export interface BiomeEnvironmentOptions {
  iblMode?: 'biome' | 'room';
  envEnabled?: boolean;
  skyColorOverride?: number;
  fogColorOverride?: number;
  sunColorOverride?: number;
  rimColorOverride?: number;
}

export interface BiomeEnvironmentHandle {
  biome: BiomeId;
  iblMode: 'biome' | 'room';
  envRT: THREE.WebGLRenderTarget | null;
  envMap: THREE.Texture | null;
  skyDome: THREE.Mesh;
  lighting: BiomeLightingSpec;
  dispose(): void;
}

export const BIOME_LIGHTING_SPECS: Readonly<Record<BiomeId, Readonly<BiomeLightingSpec>>> = Object.freeze({
  desert: Object.freeze({
    biome: 'desert',
    skyColor: 0x161411,
    fogColor: 0x1b1712,
    fogDensity: 0.0038,
    sunColor: 0xffe9c2,
    sunIntensity: 2.5,
    sunPosition: Object.freeze([46, 66, 38] as const),
    rimColor: 0x38bdf8,
    rimIntensity: 0.78,
    rimPosition: Object.freeze([-48, 32, -40] as const),
    hemiSkyColor: 0xa4c6e4,
    hemiGroundColor: 0x735d42,
    hemiIntensity: 0.86,
    envIntensity: 0.94,
    exposure: 1.04,
    skyZenithColor: 0x141210,
    skyHorizonColor: 0x2f271e,
    skyGroundColor: 0x13100d,
    envSkyColor: 0x90bbe0,
    envHorizonColor: 0xdec8a4,
    envGroundColor: 0x614e36,
    envSunDiscColor: 0xfff1d0,
    envSunDiscIntensity: 5.5
  }),
  arctic: Object.freeze({
    // Carefully constrained sun/IBL/exposure + cool slate shadows so snow never blows out to white (>=245).
    biome: 'arctic',
    skyColor: 0x0b1622,
    fogColor: 0x0f1e2e,
    fogDensity: 0.0038,
    sunColor: 0xdbeafe,
    sunIntensity: 1.72,
    sunPosition: Object.freeze([56, 44, 38] as const),
    rimColor: 0x67e8f9,
    rimIntensity: 0.56,
    rimPosition: Object.freeze([-50, 30, -38] as const),
    hemiSkyColor: 0x89a8c8,
    hemiGroundColor: 0x2c4159,
    hemiIntensity: 0.62,
    envIntensity: 0.66,
    exposure: 0.93,
    skyZenithColor: 0x09131f,
    skyHorizonColor: 0x172d44,
    skyGroundColor: 0x0a131e,
    envSkyColor: 0x7ba1c7,
    envHorizonColor: 0xa4bcd2,
    envGroundColor: 0x2d435a,
    envSunDiscColor: 0xe6f0ff,
    envSunDiscIntensity: 3.0
  }),
  industrial: Object.freeze({
    // Lifted key/hemi/IBL/exposure so dark concrete & ruins read clearly under AgX (target meanLuma ~75-90).
    biome: 'industrial',
    skyColor: 0x0c1016,
    fogColor: 0x10151e,
    fogDensity: 0.0038,
    sunColor: 0xfde68a,
    sunIntensity: 2.85,
    sunPosition: Object.freeze([46, 58, 36] as const),
    rimColor: 0xf97316,
    rimIntensity: 1.1,
    rimPosition: Object.freeze([-48, 28, -42] as const),
    hemiSkyColor: 0x9fb5cc,
    hemiGroundColor: 0x524c48,
    hemiIntensity: 1.15,
    envIntensity: 1.15,
    exposure: 1.14,
    skyZenithColor: 0x0d121a,
    skyHorizonColor: 0x263040,
    skyGroundColor: 0x0c1016,
    envSkyColor: 0x9ab0c9,
    envHorizonColor: 0xd4be9c,
    envGroundColor: 0x4b505c,
    envSunDiscColor: 0xffd98a,
    envSunDiscIntensity: 6.0
  }),
  forest: Object.freeze({
    biome: 'forest',
    skyColor: 0x101f17,
    fogColor: 0x15271e,
    fogDensity: 0.0038,
    sunColor: 0xfef3c7,
    sunIntensity: 2.65,
    sunPosition: Object.freeze([44, 64, 38] as const),
    rimColor: 0x4ade80,
    rimIntensity: 0.85,
    rimPosition: Object.freeze([-48, 34, -38] as const),
    hemiSkyColor: 0xaad4ec,
    hemiGroundColor: 0x4a6342,
    hemiIntensity: 1.05,
    envIntensity: 1.02,
    exposure: 1.08,
    skyZenithColor: 0x102018,
    skyHorizonColor: 0x244031,
    skyGroundColor: 0x0d1812,
    envSkyColor: 0x98c8e0,
    envHorizonColor: 0xbdd4b6,
    envGroundColor: 0x3b5434,
    envSunDiscColor: 0xfff5d6,
    envSunDiscIntensity: 5.2
  }),
  canyon: Object.freeze({
    biome: 'canyon',
    skyColor: 0x1a120e,
    fogColor: 0x221712,
    fogDensity: 0.0038,
    sunColor: 0xfdba74,
    sunIntensity: 2.65,
    sunPosition: Object.freeze([52, 50, 34] as const),
    rimColor: 0xf97316,
    rimIntensity: 0.96,
    rimPosition: Object.freeze([-50, 28, -40] as const),
    hemiSkyColor: 0xb89c8c,
    hemiGroundColor: 0x73422e,
    hemiIntensity: 0.96,
    envIntensity: 0.98,
    exposure: 1.08,
    skyZenithColor: 0x1a120e,
    skyHorizonColor: 0x422a1e,
    skyGroundColor: 0x160f0b,
    envSkyColor: 0x948499,
    envHorizonColor: 0xe09b6c,
    envGroundColor: 0x6b3824,
    envSunDiscColor: 0xffc684,
    envSunDiscIntensity: 5.8
  }),
  swamp: Object.freeze({
    biome: 'swamp',
    skyColor: 0x0d1512,
    fogColor: 0x14201b,
    fogDensity: 0.0046,
    sunColor: 0xd9f99d,
    sunIntensity: 2.65,
    sunPosition: Object.freeze([46, 56, 36] as const),
    rimColor: 0xa3e635,
    rimIntensity: 0.98,
    rimPosition: Object.freeze([-46, 30, -40] as const),
    hemiSkyColor: 0x9ec4ac,
    hemiGroundColor: 0x3b5242,
    hemiIntensity: 1.2,
    envIntensity: 1.12,
    exposure: 1.14,
    skyZenithColor: 0x0e1814,
    skyHorizonColor: 0x22382e,
    skyGroundColor: 0x0b130f,
    envSkyColor: 0x8db09e,
    envHorizonColor: 0xb2ccb0,
    envGroundColor: 0x334a3a,
    envSunDiscColor: 0xe8f8bc,
    envSunDiscIntensity: 4.5
  }),
  volcanic: Object.freeze({
    // Lifted basalt key/magma bounce/rim/exposure under AgX so volcanic rocks & roads stay readable (~48-62 luma).
    biome: 'volcanic',
    skyColor: 0x190b08,
    fogColor: 0x240f0b,
    fogDensity: 0.0038,
    sunColor: 0xfca5a5,
    sunIntensity: 3.05,
    sunPosition: Object.freeze([48, 56, 36] as const),
    rimColor: 0xef4444,
    rimIntensity: 1.35,
    rimPosition: Object.freeze([-48, 26, -42] as const),
    hemiSkyColor: 0xb8969c,
    hemiGroundColor: 0x9e3824,
    hemiIntensity: 1.45,
    envIntensity: 1.25,
    exposure: 1.18,
    skyZenithColor: 0x1f0d0a,
    skyHorizonColor: 0x4c1f16,
    skyGroundColor: 0x240c08,
    envSkyColor: 0x9c8288,
    envHorizonColor: 0xe67a5c,
    envGroundColor: 0x9c321c,
    envSunDiscColor: 0xffb89c,
    envSunDiscIntensity: 6.2
  })
});

export function getBiomeLightingSpec(biome: string): BiomeLightingSpec {
  const key = biome as BiomeId;
  const spec = BIOME_LIGHTING_SPECS[key] ?? BIOME_LIGHTING_SPECS.desert;
  return {
    ...spec,
    sunPosition: [spec.sunPosition[0], spec.sunPosition[1], spec.sunPosition[2]],
    rimPosition: [spec.rimPosition[0], spec.rimPosition[1], spec.rimPosition[2]]
  };
}

const SKY_DOME_VERTEX_SHADER = /* glsl */ `
varying vec3 vSkyDir;
void main() {
  vSkyDir = normalize( position );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const SKY_DOME_FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uZenithColor;
uniform vec3 uHorizonColor;
uniform vec3 uGroundColor;
uniform vec3 uSunDir;
uniform vec3 uSunGlowColor;

varying vec3 vSkyDir;

void main() {
  vec3 dir = normalize( vSkyDir );
  float h = dir.y;

  vec3 col;
  if ( h >= 0.0 ) {
    float t = pow( clamp( h, 0.0, 1.0 ), 0.55 );
    col = mix( uHorizonColor, uZenithColor, t );
  } else {
    float t = pow( clamp( -h, 0.0, 1.0 ), 0.65 );
    col = mix( uHorizonColor, uGroundColor, t );
  }

  // Subtle horizon atmospheric scatter in the sun azimuth without blooming into diffuse terrain.
  float sunAlign = max( dot( dir, normalize( uSunDir ) ), 0.0 );
  float horizonBand = exp( -abs( h ) * 5.0 );
  col += uSunGlowColor * pow( sunAlign, 8.0 ) * horizonBand * 0.16;

  gl_FragColor = vec4( col, 1.0 );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

const PMREM_ENV_VERTEX_SHADER = /* glsl */ `
varying vec3 vEnvDir;
void main() {
  vEnvDir = normalize( position );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const PMREM_ENV_FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uEnvSkyColor;
uniform vec3 uEnvHorizonColor;
uniform vec3 uEnvGroundColor;
uniform vec3 uEnvSunDir;
uniform vec3 uEnvSunColor;
uniform float uEnvSunIntensity;
uniform vec3 uEnvRimDir;
uniform vec3 uEnvRimColor;

varying vec3 vEnvDir;

void main() {
  vec3 dir = normalize( vEnvDir );
  float h = dir.y;

  vec3 col;
  if ( h >= 0.0 ) {
    float t = pow( clamp( h, 0.0, 1.0 ), 0.58 );
    col = mix( uEnvHorizonColor, uEnvSkyColor, t );
  } else {
    float t = pow( clamp( -h, 0.0, 1.0 ), 0.45 );
    col = mix( uEnvHorizonColor * 0.65, uEnvGroundColor, t );
  }

  // Directional soft sun disc + broad atmospheric scatter for crisp specular bevel highlights.
  float sunDot = max( dot( dir, normalize( uEnvSunDir ) ), 0.0 );
  col += uEnvSunColor * ( pow( sunDot, 96.0 ) * uEnvSunIntensity + pow( sunDot, 6.0 ) * 0.22 );

  // Cool/warm tactical opposite rim bounce.
  float rimDot = max( dot( dir, normalize( uEnvRimDir ) ), 0.0 );
  col += uEnvRimColor * pow( rimDot, 4.0 ) * 0.16;

  // Output raw linear HDR radiance for PMREMGenerator.
  gl_FragColor = vec4( col, 1.0 );
}
`;

export function createBiomeSkyDome(spec: BiomeLightingSpec): THREE.Mesh {
  const geo = new THREE.SphereGeometry(340, 24, 14);
  const sunDir = new THREE.Vector3(spec.sunPosition[0], spec.sunPosition[1], spec.sunPosition[2]).normalize();

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uZenithColor: { value: new THREE.Color(spec.skyZenithColor) },
      uHorizonColor: { value: new THREE.Color(spec.skyHorizonColor) },
      uGroundColor: { value: new THREE.Color(spec.skyGroundColor) },
      uSunDir: { value: sunDir },
      uSunGlowColor: { value: new THREE.Color(spec.sunColor) }
    },
    vertexShader: SKY_DOME_VERTEX_SHADER,
    fragmentShader: SKY_DOME_FRAGMENT_SHADER,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false
  });

  const skyDome = new THREE.Mesh(geo, mat);
  skyDome.name = `BiomeSkyDome_${spec.biome}`;
  skyDome.frustumCulled = false;
  skyDome.renderOrder = -1000;
  skyDome.castShadow = false;
  skyDome.receiveShadow = false;
  skyDome.userData.noShadow = true;
  return skyDome;
}

interface CachedOutdoorEnvRig {
  scene: THREE.Scene;
  geometry: THREE.SphereGeometry;
  material: THREE.ShaderMaterial;
  uniforms: {
    uEnvSkyColor: { value: THREE.Color };
    uEnvHorizonColor: { value: THREE.Color };
    uEnvGroundColor: { value: THREE.Color };
    uEnvSunDir: { value: THREE.Vector3 };
    uEnvSunColor: { value: THREE.Color };
    uEnvSunIntensity: { value: number };
    uEnvRimDir: { value: THREE.Vector3 };
    uEnvRimColor: { value: THREE.Color };
  };
}

// Reused module-level PMREM helpers prevent Chrome KHR_parallel_shader_compile
// `GL_INVALID_VALUE: glGetProgramiv: Program object expected.` warnings caused by
// immediately disposing freshly-compiled ephemeral materials/PMREMGenerator right after fromScene().
let cachedOutdoorEnvRig: CachedOutdoorEnvRig | null = null;
let cachedRoomEnvScene: RoomEnvironment | null = null;
const cachedPmremByRenderer = new WeakMap<THREE.WebGLRenderer, THREE.PMREMGenerator>();

function getReusableOutdoorEnvScene(spec: BiomeLightingSpec): THREE.Scene {
  if (!cachedOutdoorEnvRig) {
    const scene = new THREE.Scene();
    scene.name = 'OutdoorEnvScene_Shared';

    const geometry = new THREE.SphereGeometry(20, 24, 16);
    const uniforms = {
      uEnvSkyColor: { value: new THREE.Color(spec.envSkyColor) },
      uEnvHorizonColor: { value: new THREE.Color(spec.envHorizonColor) },
      uEnvGroundColor: { value: new THREE.Color(spec.envGroundColor) },
      uEnvSunDir: { value: new THREE.Vector3(spec.sunPosition[0], spec.sunPosition[1], spec.sunPosition[2]).normalize() },
      uEnvSunColor: { value: new THREE.Color(spec.envSunDiscColor) },
      uEnvSunIntensity: { value: spec.envSunDiscIntensity },
      uEnvRimDir: { value: new THREE.Vector3(spec.rimPosition[0], spec.rimPosition[1], spec.rimPosition[2]).normalize() },
      uEnvRimColor: { value: new THREE.Color(spec.rimColor) }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: PMREM_ENV_VERTEX_SHADER,
      fragmentShader: PMREM_ENV_FRAGMENT_SHADER,
      side: THREE.BackSide,
      depthWrite: false,
      toneMapped: false
    });

    scene.add(new THREE.Mesh(geometry, material));
    cachedOutdoorEnvRig = { scene, geometry, material, uniforms };
  } else {
    const u = cachedOutdoorEnvRig.uniforms;
    u.uEnvSkyColor.value.setHex(spec.envSkyColor);
    u.uEnvHorizonColor.value.setHex(spec.envHorizonColor);
    u.uEnvGroundColor.value.setHex(spec.envGroundColor);
    u.uEnvSunDir.value.set(spec.sunPosition[0], spec.sunPosition[1], spec.sunPosition[2]).normalize();
    u.uEnvSunColor.value.setHex(spec.envSunDiscColor);
    u.uEnvSunIntensity.value = spec.envSunDiscIntensity;
    u.uEnvRimDir.value.set(spec.rimPosition[0], spec.rimPosition[1], spec.rimPosition[2]).normalize();
    u.uEnvRimColor.value.setHex(spec.rimColor);
  }

  return cachedOutdoorEnvRig.scene;
}

function getReusableRoomEnvScene(): RoomEnvironment {
  if (!cachedRoomEnvScene) {
    cachedRoomEnvScene = new RoomEnvironment();
  }
  return cachedRoomEnvScene;
}

function getReusablePmremGenerator(renderer: THREE.WebGLRenderer): THREE.PMREMGenerator {
  let pmrem = cachedPmremByRenderer.get(renderer);
  if (!pmrem) {
    pmrem = new THREE.PMREMGenerator(renderer);
    cachedPmremByRenderer.set(renderer, pmrem);
  }
  return pmrem;
}

/**
 * Releases module-level reusable PMREM helper scenes (call only on full application teardown).
 */
export function disposeBiomeEnvironmentCaches(renderer?: THREE.WebGLRenderer | null): void {
  if (cachedOutdoorEnvRig) {
    cachedOutdoorEnvRig.geometry.dispose();
    cachedOutdoorEnvRig.material.dispose();
    cachedOutdoorEnvRig = null;
  }
  if (cachedRoomEnvScene) {
    cachedRoomEnvScene.dispose();
    cachedRoomEnvScene = null;
  }
  if (renderer) {
    const pmrem = cachedPmremByRenderer.get(renderer);
    if (pmrem) {
      pmrem.dispose();
      cachedPmremByRenderer.delete(renderer);
    }
  }
}

export function createBiomeEnvironment(
  renderer: THREE.WebGLRenderer | null,
  biome: BiomeId | string,
  opts?: BiomeEnvironmentOptions
): BiomeEnvironmentHandle {
  const spec = getBiomeLightingSpec(biome);
  if (typeof opts?.skyColorOverride === 'number') {
    spec.skyColor = opts.skyColorOverride;
    spec.skyZenithColor = opts.skyColorOverride;
  }
  if (typeof opts?.fogColorOverride === 'number') {
    spec.fogColor = opts.fogColorOverride;
  }
  if (typeof opts?.sunColorOverride === 'number') {
    spec.sunColor = opts.sunColorOverride;
  }
  if (typeof opts?.rimColorOverride === 'number') {
    spec.rimColor = opts.rimColorOverride;
  }

  const iblMode: 'biome' | 'room' = opts?.iblMode === 'room' ? 'room' : 'biome';
  const envEnabled = opts?.envEnabled !== false;

  const skyDome = createBiomeSkyDome(spec);
  let envRT: THREE.WebGLRenderTarget | null = null;
  let envMap: THREE.Texture | null = null;

  if (envEnabled && renderer) {
    const pmrem = getReusablePmremGenerator(renderer);
    if (iblMode === 'room') {
      envRT = pmrem.fromScene(getReusableRoomEnvScene(), 0.04);
    } else {
      envRT = pmrem.fromScene(getReusableOutdoorEnvScene(spec), 0.03);
    }
    envMap = envRT.texture;
  }

  let disposed = false;

  return {
    biome: spec.biome,
    iblMode,
    envRT,
    envMap,
    skyDome,
    lighting: spec,
    dispose() {
      if (disposed) return;
      disposed = true;
      if (envRT) {
        envRT.dispose();
        envRT = null;
        envMap = null;
      }
      if (skyDome.parent) {
        skyDome.parent.remove(skyDome);
      }
      skyDome.geometry.dispose();
      if (Array.isArray(skyDome.material)) {
        for (const m of skyDome.material) m.dispose();
      } else {
        skyDome.material.dispose();
      }
    }
  };
}
