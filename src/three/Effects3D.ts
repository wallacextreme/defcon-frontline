import * as THREE from 'three';
import { ObjectPool } from '../core/ObjectPool.js';

interface Particle3D {
  mesh: THREE.Mesh;
  kind: 'smoke' | 'fire' | 'spark' | 'debris' | 'shockwave';
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rxVel: number;
  ryVel: number;
  rzVel: number;
  gravity: number;
  bounce: number;
  life: number;
  maxLife: number;
  startScale: number;
  endScale: number;
  startOpacity: number;
  drag: number;
  onRelease: () => void;
}

interface Crater3D {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
  onRelease: () => void;
}

const SHOCKWAVE_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SHOCKWAVE_FRAG = `
  uniform vec3 uColor;
  uniform float uProgress;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float d = length(p);
    float ringCenter = mix(0.15, 0.92, uProgress);
    float ringWidth = mix(0.22, 0.08, uProgress);
    float band = 1.0 - smoothstep(0.0, ringWidth, abs(d - ringCenter));
    float outerCut = 1.0 - smoothstep(0.95, 1.0, d);
    float alpha = band * outerCut * uOpacity * (1.0 - uProgress);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor * 1.6, alpha);
  }
`;

function createCraterTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
  g.addColorStop(0, 'rgba(12, 10, 8, 0.92)');
  g.addColorStop(0.45, 'rgba(28, 24, 20, 0.72)');
  g.addColorStop(0.75, 'rgba(55, 48, 38, 0.35)');
  g.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Pooled 3D particle, shockwave shader, physical debris, smoke, and crater system.
 */
export class Effects3D {
  scene: THREE.Scene;
  particlePool: ObjectPool;
  craterPool: ObjectPool;

  private sphereGeo = new THREE.SphereGeometry(0.45, 8, 6);
  private debrisGeo = new THREE.BoxGeometry(0.22, 0.14, 0.32);
  private planeGeo = new THREE.PlaneGeometry(2, 2);
  private craterGeo = new THREE.PlaneGeometry(2.6, 2.6);
  private craterTex = createCraterTexture();

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.particlePool = new ObjectPool(
      () => {
        const mat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 1,
          depthWrite: false
        });
        const mesh = new THREE.Mesh(this.sphereGeo, mat);
        mesh.visible = false;
        this.scene.add(mesh);

        const p: Particle3D = {
          mesh,
          kind: 'fire',
          x: 0,
          y: 0,
          z: 0,
          vx: 0,
          vy: 0,
          vz: 0,
          rxVel: 0,
          ryVel: 0,
          rzVel: 0,
          gravity: 0,
          bounce: 0,
          life: 0,
          maxLife: 1,
          startScale: 1,
          endScale: 0.1,
          startOpacity: 1,
          drag: 0.95,
          onRelease: () => {
            mesh.visible = false;
          }
        };
        return p;
      },
      260,
      950
    );

    this.craterPool = new ObjectPool(
      () => {
        const mat = new THREE.MeshBasicMaterial({
          map: this.craterTex,
          transparent: true,
          opacity: 0.8,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -1
        });
        const mesh = new THREE.Mesh(this.craterGeo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = 0.03;
        mesh.visible = false;
        this.scene.add(mesh);
        const c: Crater3D = {
          mesh,
          life: 0,
          maxLife: 14,
          onRelease: () => {
            mesh.visible = false;
          }
        };
        return c;
      },
      30,
      90
    );
  }

  private acquireStandard(kind: Particle3D['kind'], geo: THREE.BufferGeometry, color: number, additive: boolean): Particle3D {
    const p = this.particlePool.acquire() as Particle3D;
    p.kind = kind;
    p.mesh.geometry = geo;
    if (!(p.mesh.material instanceof THREE.MeshBasicMaterial)) {
      p.mesh.material.dispose();
      p.mesh.material = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false });
    }
    const mat = p.mesh.material as THREE.MeshBasicMaterial;
    mat.color.setHex(color);
    mat.blending = additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    mat.depthWrite = kind === 'debris';
    p.mesh.rotation.set(0, 0, 0);
    p.mesh.visible = true;
    return p;
  }

  spawnShockwave(x: number, y: number, z: number, maxRadiusWorld: number, color: number) {
    const p = this.particlePool.acquire() as Particle3D;
    p.kind = 'shockwave';
    p.mesh.geometry = this.planeGeo;
    if (!(p.mesh.material instanceof THREE.ShaderMaterial)) {
      p.mesh.material.dispose();
      p.mesh.material = new THREE.ShaderMaterial({
        vertexShader: SHOCKWAVE_VERT,
        fragmentShader: SHOCKWAVE_FRAG,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uProgress: { value: 0 },
          uOpacity: { value: 0.9 }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
    } else {
      p.mesh.material.uniforms.uColor.value.setHex(color);
      p.mesh.material.uniforms.uProgress.value = 0;
      p.mesh.material.uniforms.uOpacity.value = 0.9;
    }

    p.x = x;
    p.y = Math.max(0.08, y);
    p.z = z;
    p.vx = 0;
    p.vy = 0;
    p.vz = 0;
    p.gravity = 0;
    p.bounce = 0;
    p.rxVel = 0;
    p.ryVel = 0;
    p.rzVel = 0;
    p.drag = 1;
    p.life = 0.34;
    p.maxLife = 0.34;
    p.startScale = maxRadiusWorld * 0.95;
    p.endScale = maxRadiusWorld * 1.15;
    p.startOpacity = 0.9;
    p.mesh.rotation.set(-Math.PI / 2, 0, 0);
    p.mesh.position.set(p.x, p.y, p.z);
    p.mesh.scale.setScalar(p.startScale);
    p.mesh.visible = true;
  }

  spawnSparks(x: number, y: number, z: number, count: number, color: number) {
    for (let i = 0; i < count; i++) {
      const p = this.acquireStandard('spark', this.sphereGeo, color, true);
      const ang = Math.random() * Math.PI * 2;
      const spd = 4 + Math.random() * 9;
      p.x = x;
      p.y = y;
      p.z = z;
      p.vx = Math.cos(ang) * spd;
      p.vy = 2.5 + Math.random() * 5.5;
      p.vz = Math.sin(ang) * spd;
      p.gravity = -18;
      p.bounce = 0.3;
      p.drag = 0.94;
      p.life = 0.18 + Math.random() * 0.16;
      p.maxLife = p.life;
      p.startScale = 0.25 + Math.random() * 0.2;
      p.endScale = 0.03;
      p.startOpacity = 1;
      p.mesh.position.set(x, y, z);
    }
  }

  spawnSmokePuff(x: number, y: number, z: number, color = 0x333942, scale = 0.55) {
    const p = this.acquireStandard('smoke', this.sphereGeo, color, false);
    p.x = x + (Math.random() - 0.5) * 0.3;
    p.y = y + (Math.random() - 0.5) * 0.2;
    p.z = z + (Math.random() - 0.5) * 0.3;
    p.vx = (Math.random() - 0.5) * 1.2;
    p.vy = 1.6 + Math.random() * 2.2;
    p.vz = (Math.random() - 0.5) * 1.2;
    p.gravity = 0.4;
    p.bounce = 0;
    p.drag = 0.96;
    p.life = 0.6 + Math.random() * 0.35;
    p.maxLife = p.life;
    p.startScale = scale;
    p.endScale = scale * 2.6;
    p.startOpacity = 0.58;
    p.mesh.position.set(p.x, p.y, p.z);
  }

  spawnDebris(x: number, y: number, z: number, count: number, scale = 1.0) {
    for (let i = 0; i < count; i++) {
      const col = i % 2 === 0 ? 0x2a2d34 : 0x554d3d;
      const p = this.acquireStandard('debris', this.debrisGeo, col, false);
      const ang = Math.random() * Math.PI * 2;
      const spd = (3.5 + Math.random() * 8.5) * scale;
      p.x = x;
      p.y = Math.max(0.25, y);
      p.z = z;
      p.vx = Math.cos(ang) * spd;
      p.vy = (5.5 + Math.random() * 8.5) * Math.min(1.4, scale);
      p.vz = Math.sin(ang) * spd;
      p.rxVel = (Math.random() - 0.5) * 14;
      p.ryVel = (Math.random() - 0.5) * 14;
      p.rzVel = (Math.random() - 0.5) * 14;
      p.gravity = -24;
      p.bounce = 0.42;
      p.drag = 0.985;
      p.life = 0.9 + Math.random() * 0.6;
      p.maxLife = p.life;
      p.startScale = (0.7 + Math.random() * 0.7) * Math.min(1.5, scale);
      p.endScale = p.startScale * 0.55;
      p.startOpacity = 1;
      p.mesh.position.set(p.x, p.y, p.z);
    }
  }

  spawnExplosion(x: number, y: number, z: number, scale = 1.0, coreColor = 0xf97316, withDebris = true) {
    this.spawnShockwave(x, Math.max(0.08, y * 0.2), z, 2.8 * scale, coreColor);

    // Expanding 3D fireball core + white-hot flash
    const core = this.acquireStandard('fire', this.sphereGeo, 0xfef08a, true);
    core.x = x;
    core.y = Math.max(0.35, y);
    core.z = z;
    core.vx = 0;
    core.vy = 0.6;
    core.vz = 0;
    core.gravity = 0;
    core.drag = 1;
    core.life = 0.24;
    core.maxLife = 0.24;
    core.startScale = 0.6 * scale;
    core.endScale = 2.6 * scale;
    core.startOpacity = 0.95;
    core.mesh.position.set(core.x, core.y, core.z);

    // Secondary orange fireballs
    const fireCount = Math.min(10, Math.round(5 * scale));
    for (let i = 0; i < fireCount; i++) {
      const p = this.acquireStandard('fire', this.sphereGeo, i % 2 === 0 ? coreColor : 0xfacc15, true);
      const ang = Math.random() * Math.PI * 2;
      const spd = (1.5 + Math.random() * 4.5) * scale;
      p.x = x + Math.cos(ang) * 0.3;
      p.y = Math.max(0.3, y);
      p.z = z + Math.sin(ang) * 0.3;
      p.vx = Math.cos(ang) * spd;
      p.vy = 1.8 + Math.random() * 3.5;
      p.vz = Math.sin(ang) * spd;
      p.gravity = -4;
      p.bounce = 0;
      p.drag = 0.92;
      p.life = 0.26 + Math.random() * 0.2;
      p.maxLife = p.life;
      p.startScale = (0.8 + Math.random() * 0.6) * scale;
      p.endScale = 0.12;
      p.startOpacity = 0.92;
      p.mesh.position.set(p.x, p.y, p.z);
    }

    // Rising black smoke plume
    const smokeCount = Math.min(8, Math.round(3 + scale * 2.5));
    for (let i = 0; i < smokeCount; i++) {
      this.spawnSmokePuff(
        x + (Math.random() - 0.5) * scale,
        Math.max(0.4, y),
        z + (Math.random() - 0.5) * scale,
        i % 2 === 0 ? 0x22262c : 0x3b4048,
        0.75 * scale
      );
    }

    // Physical flying metallic debris
    if (withDebris) {
      this.spawnDebris(x, Math.max(0.3, y), z, Math.min(12, Math.round(5 * scale)), scale);
    }
  }

  spawnCrater(x: number, z: number, scale = 1.0) {
    const c = this.craterPool.acquire() as Crater3D;
    c.life = c.maxLife;
    c.mesh.position.set(x, 0.03, z);
    c.mesh.rotation.z = Math.random() * Math.PI * 2;
    c.mesh.scale.setScalar(Math.min(2.2, 0.85 * scale));
    (c.mesh.material as THREE.MeshBasicMaterial).opacity = 0.78;
    c.mesh.visible = true;
  }

  update(dt: number) {
    this.particlePool.forEachActive((obj) => {
      const p = obj as Particle3D;
      p.life -= dt;
      if (p.life <= 0) {
        this.particlePool.release(p);
        return;
      }

      const prog = 1 - p.life / p.maxLife;

      if (p.kind === 'shockwave') {
        const mat = p.mesh.material as THREE.ShaderMaterial;
        mat.uniforms.uProgress.value = prog;
        const sc = THREE.MathUtils.lerp(p.startScale, p.endScale, prog);
        p.mesh.scale.setScalar(sc);
        return;
      }

      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;

      if (p.y < 0.08 && p.vy < 0) {
        p.y = 0.08;
        if (p.bounce > 0) {
          p.vy = -p.vy * p.bounce;
          p.vx *= 0.7;
          p.vz *= 0.7;
        } else {
          p.vy = 0;
        }
      }

      const dragFactor = Math.pow(p.drag, dt * 60);
      p.vx *= dragFactor;
      p.vz *= dragFactor;

      if (p.kind === 'debris') {
        p.mesh.rotation.x += p.rxVel * dt;
        p.mesh.rotation.y += p.ryVel * dt;
        p.mesh.rotation.z += p.rzVel * dt;
      }

      p.mesh.position.set(p.x, p.y, p.z);
      p.mesh.scale.setScalar(THREE.MathUtils.lerp(p.startScale, p.endScale, prog));
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = p.startOpacity * (1 - prog);
    });

    this.craterPool.forEachActive((obj) => {
      const c = obj as Crater3D;
      c.life -= dt;
      if (c.life <= 0) {
        this.craterPool.release(c);
        return;
      }
      (c.mesh.material as THREE.MeshBasicMaterial).opacity = 0.72 * Math.min(1, c.life / 4);
    });
  }

  releaseAll() {
    this.particlePool.releaseAll();
    this.craterPool.releaseAll();
  }
}
