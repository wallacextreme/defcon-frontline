import * as THREE from 'three';
import { createNormalTextureFromHeightCanvas } from './SurfaceShaderKit.ts';

export interface PBRTextureSet {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
}

let cachedTextures: Record<string, PBRTextureSet> | null = null;
let cachedAnisotropy = 4;

function makeCanvas(size = 512): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  return [c, c.getContext('2d')!];
}

function makeRng(seedStart: number) {
  let s = seedStart;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function finalizeTexture(canvas: HTMLCanvasElement, isAlbedo: boolean, anisotropy: number): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  if (isAlbedo) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.anisotropy = Math.max(1, anisotropy);
  tex.needsUpdate = true;
  return tex;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function periodicNoise2D(u: number, v: number, freq: number, seed: number): number {
  const f = Math.max(1, Math.round(freq));
  const x = (((u % 1) + 1) % 1) * f;
  const y = (((v % 1) + 1) % 1) * f;
  const x0 = Math.floor(x) % f;
  const y0 = Math.floor(y) % f;
  const x1 = (x0 + 1) % f;
  const y1 = (y0 + 1) % f;
  const fx = x - Math.floor(x);
  const fy = y - Math.floor(y);
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);

  const hash = (ix: number, iy: number): number => {
    let h = (ix * 374761393 + iy * 668265263 + seed * 1442695041) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };

  const n00 = hash(x0, y0);
  const n10 = hash(x1, y0);
  const n01 = hash(x0, y1);
  const n11 = hash(x1, y1);
  const nx0 = n00 + (n10 - n00) * sx;
  const nx1 = n01 + (n11 - n01) * sx;
  return nx0 + (nx1 - nx0) * sy;
}

function buildArmorSet(
  baseHex: string,
  _panelDarkHex: string,
  edgeWearHex: string,
  seed: number,
  anisotropy: number,
  camoPalette?: [string, string, string]
): PBRTextureSet {
  const S = 512;
  const rand = makeRng(seed);
  const [cMap, ctx] = makeCanvas(S);
  const [cBump, bctx] = makeCanvas(S);
  const [cRough, rctx] = makeCanvas(S);

  // Tileable organic FBM CARC paint base (zero grid squares, zero circular blotches)
  const [br, bg, bb] = hexToRgb(baseHex);
  const gridN = 64;
  const fbmGrid = new Float32Array(gridN * gridN);
  for (let gy = 0; gy < gridN; gy++) {
    const v = gy / gridN;
    for (let gx = 0; gx < gridN; gx++) {
      const u = gx / gridN;
      fbmGrid[gy * gridN + gx] =
        periodicNoise2D(u, v, 3, seed + 11) * 0.55 +
        periodicNoise2D(u, v, 6, seed + 37) * 0.3 +
        periodicNoise2D(u, v, 12, seed + 73) * 0.15;
    }
  }

  const mapImg = ctx.createImageData(S, S);
  const roughImg = rctx.createImageData(S, S);
  const scaleToGrid = gridN / S;
  for (let y = 0; y < S; y++) {
    const gyf = y * scaleToGrid;
    const gy0 = Math.floor(gyf) % gridN;
    const gy1 = (gy0 + 1) % gridN;
    const ty = gyf - Math.floor(gyf);
    for (let x = 0; x < S; x++) {
      const gxf = x * scaleToGrid;
      const gx0 = Math.floor(gxf) % gridN;
      const gx1 = (gx0 + 1) % gridN;
      const tx = gxf - Math.floor(gxf);
      const a0 = fbmGrid[gy0 * gridN + gx0];
      const a1 = fbmGrid[gy0 * gridN + gx1];
      const b0 = fbmGrid[gy1 * gridN + gx0];
      const b1 = fbmGrid[gy1 * gridN + gx1];
      const fbm = (a0 + (a1 - a0) * tx) * (1 - ty) + (b0 + (b1 - b0) * tx) * ty;
      const delta = fbm - 0.5;
      const o = (y * S + x) * 4;
      mapImg.data[o] = Math.max(0, Math.min(255, Math.round(br + delta * 36)));
      mapImg.data[o + 1] = Math.max(0, Math.min(255, Math.round(bg + delta * 34)));
      mapImg.data[o + 2] = Math.max(0, Math.min(255, Math.round(bb + delta * 30)));
      mapImg.data[o + 3] = 255;

      const rVal = Math.max(152, Math.min(228, Math.round(190 - delta * 44)));
      roughImg.data[o] = rVal;
      roughImg.data[o + 1] = rVal;
      roughImg.data[o + 2] = rVal;
      roughImg.data[o + 3] = 255;
    }
  }
  ctx.putImageData(mapImg, 0, 0);
  rctx.putImageData(roughImg, 0, 0);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, S, S);

  // Optional 3-tone OPFOR military camo organic blotches
  if (camoPalette) {
    for (let i = 0; i < 20; i++) {
      const cx = rand() * S;
      const cy = rand() * S;
      const rx = 42 + rand() * 82;
      const ry = 26 + rand() * 58;
      ctx.fillStyle = camoPalette[i % camoPalette.length];
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rand() * Math.PI);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Directional brushed micro-grain (subtle albedo, crisp normal micro-texture)
  for (let i = 0; i < 3600; i++) {
    const x = rand() * S;
    const y = rand() * S;
    const w = 3 + rand() * 11;
    const h = 1 + rand() * 1.4;
    const dark = rand() > 0.5;
    ctx.fillStyle = dark ? 'rgba(0,0,0,0.032)' : 'rgba(255,255,255,0.024)';
    ctx.fillRect(x, y, w, h);
    bctx.fillStyle = dark ? 'rgba(110,110,110,0.2)' : 'rgba(146,146,146,0.2)';
    bctx.fillRect(x, y, w, h);
  }

  // Fine random scratches (stronger in normal/roughness, faint in albedo)
  const [wr, wg, wb] = hexToRgb(edgeWearHex);
  const faintScratch = `rgba(${wr},${wg},${wb},0.22)`;
  for (let i = 0; i < 22; i++) {
    const sx = rand() * S;
    const sy = rand() * S;
    const ang = rand() * Math.PI * 2;
    const len = 10 + rand() * 28;
    ctx.strokeStyle = faintScratch;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
    ctx.stroke();

    bctx.strokeStyle = '#525252';
    bctx.lineWidth = 1.4;
    bctx.beginPath();
    bctx.moveTo(sx, sy);
    bctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
    bctx.stroke();

    rctx.strokeStyle = '#6e6e6e';
    rctx.lineWidth = 1.8;
    rctx.beginPath();
    rctx.moveTo(sx, sy);
    rctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
    rctx.stroke();
  }

  return {
    map: finalizeTexture(cMap, true, anisotropy),
    bumpMap: finalizeTexture(cBump, false, anisotropy),
    normalMap: createNormalTextureFromHeightCanvas(cBump, 1.55, 1, 1, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy)
  };
}

function buildSandbagBurlap(anisotropy: number): PBRTextureSet {
  const S = 512;
  const rand = makeRng(2026);
  const [cMap, ctx] = makeCanvas(S);
  const [cBump, bctx] = makeCanvas(S);
  const [cRough, rctx] = makeCanvas(S);

  ctx.fillStyle = '#b49d70';
  ctx.fillRect(0, 0, S, S);
  bctx.fillStyle = '#707070';
  bctx.fillRect(0, 0, S, S);
  rctx.fillStyle = '#ebebeb'; // matte coarse fabric
  rctx.fillRect(0, 0, S, S);

  // Interlaced burlap / raffia weave
  const step = 8;
  for (let y = 0; y < S; y += step) {
    for (let x = 0; x < S; x += step) {
      const checker = ((x / step + y / step) | 0) % 2 === 0;
      const jitter = (rand() - 0.5) * 18;
      const tone = checker ? 180 + jitter : 145 + jitter;
      ctx.fillStyle = `rgb(${Math.round(tone)}, ${Math.round(tone * 0.85)}, ${Math.round(tone * 0.6)})`;
      ctx.fillRect(x, y, step - 1, step - 1);

      const bVal = checker ? 215 + jitter : 95 + jitter;
      const bClamp = Math.max(20, Math.min(250, Math.round(bVal)));
      bctx.fillStyle = `rgb(${bClamp},${bClamp},${bClamp})`;
      bctx.fillRect(x + 1, y + 1, step - 2, step - 2);
    }
  }

  // Double stitched seams
  for (const seamY of [64, 448]) {
    ctx.strokeStyle = '#6f5c3e';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 6]);
    ctx.beginPath();
    ctx.moveTo(0, seamY);
    ctx.lineTo(S, seamY);
    ctx.stroke();
    ctx.setLineDash([]);

    bctx.strokeStyle = '#252525';
    bctx.lineWidth = 4;
    bctx.beginPath();
    bctx.moveTo(0, seamY);
    bctx.lineTo(S, seamY);
    bctx.stroke();
  }

  // Dust & dirt darkening patches
  for (let i = 0; i < 20; i++) {
    const dx = rand() * S;
    const dy = rand() * S;
    const r = 24 + rand() * 54;
    const g = ctx.createRadialGradient(dx, dy, 4, dx, dy, r);
    g.addColorStop(0, 'rgba(65, 52, 34, 0.26)');
    g.addColorStop(1, 'rgba(65, 52, 34, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(dx - r, dy - r, r * 2, r * 2);
  }

  return {
    map: finalizeTexture(cMap, true, anisotropy),
    bumpMap: finalizeTexture(cBump, false, anisotropy),
    normalMap: createNormalTextureFromHeightCanvas(cBump, 2.4, 1, 1, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy)
  };
}

function buildTankTracks(anisotropy: number): PBRTextureSet {
  const S = 512;
  const rand = makeRng(3141);
  const [cMap, ctx] = makeCanvas(S);
  const [cBump, bctx] = makeCanvas(S);
  const [cRough, rctx] = makeCanvas(S);

  ctx.fillStyle = '#1b1d20';
  ctx.fillRect(0, 0, S, S);
  bctx.fillStyle = '#252525';
  bctx.fillRect(0, 0, S, S);
  rctx.fillStyle = '#c0c0c0';
  rctx.fillRect(0, 0, S, S);

  const linkH = 32;
  for (let y = 0; y < S; y += linkH) {
    // Raised steel grouser cleats
    ctx.fillStyle = '#333840';
    ctx.fillRect(18, y + 4, S - 36, linkH - 10);
    ctx.fillStyle = '#5a626e'; // polished worn top rib
    ctx.fillRect(28, y + 10, S - 56, 7);

    // Center guide horn slot
    ctx.fillStyle = '#101214';
    ctx.fillRect(S * 0.5 - 24, y + 2, 48, linkH - 4);

    // Track pin end connectors
    ctx.fillStyle = '#4b525c';
    ctx.fillRect(4, y + 6, 14, linkH - 12);
    ctx.fillRect(S - 18, y + 6, 14, linkH - 12);

    bctx.fillStyle = '#a8a8a8';
    bctx.fillRect(18, y + 4, S - 36, linkH - 10);
    bctx.fillStyle = '#f2f2f2';
    bctx.fillRect(28, y + 10, S - 56, 7);
    bctx.fillStyle = '#141414';
    bctx.fillRect(S * 0.5 - 24, y + 2, 48, linkH - 4);

    rctx.fillStyle = '#505050';
    rctx.fillRect(28, y + 10, S - 56, 7);
  }

  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(90, 75, 55, 0.14)' : 'rgba(0,0,0,0.16)';
    ctx.fillRect(rand() * S, rand() * S, 3, 2);
  }

  return {
    map: finalizeTexture(cMap, true, anisotropy),
    bumpMap: finalizeTexture(cBump, false, anisotropy),
    normalMap: createNormalTextureFromHeightCanvas(cBump, 2.6, 1, 1, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy)
  };
}

function buildOffroadTire(anisotropy: number): PBRTextureSet {
  const S = 512;
  const [cMap, ctx] = makeCanvas(S);
  const [cBump, bctx] = makeCanvas(S);
  const [cRough, rctx] = makeCanvas(S);

  ctx.fillStyle = '#16181c';
  ctx.fillRect(0, 0, S, S);
  bctx.fillStyle = '#242424';
  bctx.fillRect(0, 0, S, S);
  rctx.fillStyle = '#dcdcdc';
  rctx.fillRect(0, 0, S, S);

  // Heavy military V-chevron lugs
  const step = 48;
  for (let y = -step; y < S + step; y += step) {
    // Left chevron lug
    ctx.fillStyle = '#252930';
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(S * 0.46, y + 26);
    ctx.lineTo(S * 0.46, y + 46);
    ctx.lineTo(20, y + 20);
    ctx.closePath();
    ctx.fill();

    // Right staggered chevron lug
    ctx.beginPath();
    ctx.moveTo(S - 20, y + step * 0.5);
    ctx.lineTo(S * 0.54, y + step * 0.5 + 26);
    ctx.lineTo(S * 0.54, y + step * 0.5 + 46);
    ctx.lineTo(S - 20, y + step * 0.5 + 20);
    ctx.closePath();
    ctx.fill();

    bctx.fillStyle = '#e6e6e6';
    bctx.beginPath();
    bctx.moveTo(20, y);
    bctx.lineTo(S * 0.46, y + 26);
    bctx.lineTo(S * 0.46, y + 46);
    bctx.lineTo(20, y + 20);
    bctx.closePath();
    bctx.fill();

    bctx.beginPath();
    bctx.moveTo(S - 20, y + step * 0.5);
    bctx.lineTo(S * 0.54, y + step * 0.5 + 26);
    bctx.lineTo(S * 0.54, y + step * 0.5 + 46);
    bctx.lineTo(S - 20, y + step * 0.5 + 20);
    bctx.closePath();
    bctx.fill();

    rctx.fillStyle = '#9a9a9a';
    rctx.fillRect(20, y, S - 40, 18);
  }

  // Mud/dust inside deep grooves
  ctx.fillStyle = 'rgba(110, 95, 70, 0.16)';
  ctx.fillRect(S * 0.46, 0, S * 0.08, S);

  return {
    map: finalizeTexture(cMap, true, anisotropy),
    bumpMap: finalizeTexture(cBump, false, anisotropy),
    normalMap: createNormalTextureFromHeightCanvas(cBump, 2.6, 1, 1, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy)
  };
}

function buildConcreteBunker(anisotropy: number): PBRTextureSet {
  const S = 512;
  const rand = makeRng(7711);
  const [cMap, ctx] = makeCanvas(S);
  const [cBump, bctx] = makeCanvas(S);
  const [cRough, rctx] = makeCanvas(S);

  ctx.fillStyle = '#6c7176';
  ctx.fillRect(0, 0, S, S);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, S, S);
  rctx.fillStyle = '#e5e5e5';
  rctx.fillRect(0, 0, S, S);

  // Aggregate pitting & formwork planks
  for (let y = 0; y < S; y += 128) {
    ctx.strokeStyle = 'rgba(30, 33, 36, 0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(S, y);
    ctx.stroke();

    bctx.strokeStyle = '#383838';
    bctx.lineWidth = 4;
    bctx.beginPath();
    bctx.moveTo(0, y);
    bctx.lineTo(S, y);
    bctx.stroke();

    // Formwork tie-rod holes
    for (let x = 64; x < S; x += 128) {
      ctx.fillStyle = '#3a3e42';
      ctx.beginPath();
      ctx.arc(x, y + 64, 5, 0, Math.PI * 2);
      ctx.fill();
      bctx.fillStyle = '#181818';
      bctx.beginPath();
      bctx.arc(x, y + 64, 6, 0, Math.PI * 2);
      bctx.fill();
    }
  }

  for (let i = 0; i < 6000; i++) {
    const x = rand() * S;
    const y = rand() * S;
    const dark = rand() > 0.48;
    ctx.fillStyle = dark ? 'rgba(25,25,25,0.12)' : 'rgba(220,220,215,0.1)';
    ctx.fillRect(x, y, 2.5, 2.5);
    bctx.fillStyle = dark ? 'rgba(80,80,80,0.28)' : 'rgba(175,175,175,0.25)';
    bctx.fillRect(x, y, 2, 2);
  }

  // Fine hairline concrete cracks
  for (let i = 0; i < 8; i++) {
    let cx = rand() * S;
    let cy = rand() * S;
    ctx.strokeStyle = 'rgba(25, 25, 28, 0.55)';
    ctx.lineWidth = 1.4;
    bctx.strokeStyle = '#202020';
    bctx.lineWidth = 2;
    ctx.beginPath();
    bctx.beginPath();
    ctx.moveTo(cx, cy);
    bctx.moveTo(cx, cy);
    for (let seg = 0; seg < 6; seg++) {
      cx += (rand() - 0.5) * 40;
      cy += (rand() - 0.5) * 40;
      ctx.lineTo(cx, cy);
      bctx.lineTo(cx, cy);
    }
    ctx.stroke();
    bctx.stroke();
  }

  // Worn yellow hazard stripe band along bottom border
  ctx.fillStyle = 'rgba(234, 179, 8, 0.72)';
  ctx.fillRect(0, S - 36, S, 24);
  for (let x = -32; x < S + 32; x += 44) {
    ctx.fillStyle = 'rgba(30, 34, 38, 0.85)';
    ctx.beginPath();
    ctx.moveTo(x, S - 36);
    ctx.lineTo(x + 20, S - 36);
    ctx.lineTo(x + 6, S - 12);
    ctx.lineTo(x - 14, S - 12);
    ctx.closePath();
    ctx.fill();
  }

  return {
    map: finalizeTexture(cMap, true, anisotropy),
    bumpMap: finalizeTexture(cBump, false, anisotropy),
    normalMap: createNormalTextureFromHeightCanvas(cBump, 2.1, 1, 1, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy)
  };
}

function buildTacticalAsphalt(anisotropy: number): PBRTextureSet {
  const S = 512;
  const rand = makeRng(9090);
  const [cMap, ctx] = makeCanvas(S);
  const [cBump, bctx] = makeCanvas(S);
  const [cRough, rctx] = makeCanvas(S);

  ctx.fillStyle = '#31363c';
  ctx.fillRect(0, 0, S, S);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, S, S);
  rctx.fillStyle = '#c8c8c8';
  rctx.fillRect(0, 0, S, S);

  for (let i = 0; i < 8500; i++) {
    const x = rand() * S;
    const y = rand() * S;
    const tone = rand() > 0.5 ? 'rgba(200,205,210,0.08)' : 'rgba(12,14,16,0.18)';
    ctx.fillStyle = tone;
    ctx.fillRect(x, y, 2, 2);
    bctx.fillStyle = rand() > 0.5 ? 'rgba(180,180,180,0.3)' : 'rgba(65,65,65,0.3)';
    bctx.fillRect(x, y, 2, 2);
  }

  // Burned rubber tire tracks
  for (const tx of [150, 362]) {
    ctx.fillStyle = 'rgba(14, 16, 18, 0.32)';
    ctx.fillRect(tx - 24, 0, 48, S);
    rctx.fillStyle = '#757575';
    rctx.fillRect(tx - 24, 0, 48, S);
  }

  // Worn dashed yellow road stripe
  ctx.fillStyle = 'rgba(234, 179, 8, 0.68)';
  for (let y = 16; y < S; y += 96) {
    ctx.fillRect(S * 0.5 - 6, y, 12, 52);
  }

  return {
    map: finalizeTexture(cMap, true, anisotropy),
    bumpMap: finalizeTexture(cBump, false, anisotropy),
    normalMap: createNormalTextureFromHeightCanvas(cBump, 1.8, 1, 1, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy)
  };
}

function buildDiamondSteelPlate(anisotropy: number): PBRTextureSet {
  const S = 512;
  const [cMap, ctx] = makeCanvas(S);
  const [cBump, bctx] = makeCanvas(S);
  const [cRough, rctx] = makeCanvas(S);

  ctx.fillStyle = '#4b535e';
  ctx.fillRect(0, 0, S, S);
  bctx.fillStyle = '#505050';
  bctx.fillRect(0, 0, S, S);
  rctx.fillStyle = '#8e8e8e';
  rctx.fillRect(0, 0, S, S);

  const cell = 32;
  for (let y = 0; y < S; y += cell) {
    for (let x = 0; x < S; x += cell) {
      const alt = (((x / cell) + (y / cell)) | 0) % 2 === 0;
      const cx = x + cell * 0.5;
      const cy = y + cell * 0.5;
      const ang = alt ? Math.PI / 4 : -Math.PI / 4;

      for (const draw of [
        { target: ctx, fill: '#66707c', w: 18, h: 6 },
        { target: bctx, fill: '#cccccc', w: 18, h: 6 },
        { target: rctx, fill: '#525252', w: 18, h: 6 }
      ]) {
        draw.target.save();
        draw.target.translate(cx, cy);
        draw.target.rotate(ang);
        draw.target.fillStyle = draw.fill;
        draw.target.fillRect(-draw.w * 0.5, -draw.h * 0.5, draw.w, draw.h);
        draw.target.restore();
      }
    }
  }

  return {
    map: finalizeTexture(cMap, true, anisotropy),
    bumpMap: finalizeTexture(cBump, false, anisotropy),
    normalMap: createNormalTextureFromHeightCanvas(cBump, 1.8, 1, 1, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy)
  };
}

/**
 * Generates and caches all procedural 512x512 PBR texture sets (map, bumpMap, normalMap, roughnessMap).
 */
export function getPBRTextures(maxAnisotropy = cachedAnisotropy): Record<string, PBRTextureSet> {
  if (cachedTextures) return cachedTextures;
  cachedAnisotropy = Math.max(1, maxAnisotropy);

  cachedTextures = {
    natoArmorPlate: buildArmorSet('#4b5320', '#2b3112', '#7e8562', 101, cachedAnisotropy),
    desertCarcPlate: buildArmorSet('#c2b280', '#7e704c', '#ded4b4', 202, cachedAnisotropy),
    opforCamoPlate: buildArmorSet('#3b4d3b', '#1b241b', '#6d796a', 303, cachedAnisotropy, [
      '#283628',
      '#4f5b3a',
      '#1e211e'
    ]),
    sandbagBurlap: buildSandbagBurlap(cachedAnisotropy),
    tankTracks: buildTankTracks(cachedAnisotropy),
    offroadTire: buildOffroadTire(cachedAnisotropy),
    concreteBunker: buildConcreteBunker(cachedAnisotropy),
    tacticalAsphalt: buildTacticalAsphalt(cachedAnisotropy),
    diamondSteelPlate: buildDiamondSteelPlate(cachedAnisotropy)
  };

  return cachedTextures;
}

const repeatedTextureSetCache = new Map<string, PBRTextureSet>();

function getRepeatedPBRTextureSet(key: string, baseSet: PBRTextureSet, repeat: [number, number]): PBRTextureSet {
  const cacheKey = `${key}:${repeat[0]}:${repeat[1]}`;
  const existing = repeatedTextureSetCache.get(cacheKey);
  if (existing) return existing;

  const map = baseSet.map.clone();
  const bumpMap = baseSet.bumpMap.clone();
  const normalMap = baseSet.normalMap.clone();
  const roughnessMap = baseSet.roughnessMap.clone();
  map.repeat.set(repeat[0], repeat[1]);
  bumpMap.repeat.set(repeat[0], repeat[1]);
  normalMap.repeat.set(repeat[0], repeat[1]);
  roughnessMap.repeat.set(repeat[0], repeat[1]);
  map.needsUpdate = true;
  bumpMap.needsUpdate = true;
  normalMap.needsUpdate = true;
  roughnessMap.needsUpdate = true;

  const clonedSet: PBRTextureSet = { map, bumpMap, normalMap, roughnessMap };
  repeatedTextureSetCache.set(cacheKey, clonedSet);
  return clonedSet;
}

/**
 * Helper to create a MeshStandardMaterial wired to a cached PBR texture set.
 */
export function createPBRMaterial(
  key: string,
  overrides: THREE.MeshStandardMaterialParameters & { repeat?: [number, number] } = {}
): THREE.MeshStandardMaterial {
  const sets = getPBRTextures();
  const resolvedKey = sets[key] ? key : 'natoArmorPlate';
  const baseSet = sets[resolvedKey];
  const { repeat, ...matParams } = overrides;
  const hasExplicitBump = matParams.bumpMap != null;

  const activeSet = repeat ? getRepeatedPBRTextureSet(resolvedKey, baseSet, repeat) : baseSet;
  const { map, bumpMap, normalMap, roughnessMap } = activeSet;

  const baseParams: THREE.MeshStandardMaterialParameters = {
    map,
    roughnessMap,
    roughness: matParams.roughness ?? 0.72,
    metalness: matParams.metalness ?? 0.04,
    envMapIntensity: matParams.envMapIntensity ?? 1.15
  };

  if (hasExplicitBump) {
    baseParams.bumpMap = bumpMap;
    baseParams.bumpScale = matParams.bumpScale ?? 0.04;
  } else {
    baseParams.normalMap = normalMap;
    baseParams.normalScale = matParams.normalScale ?? new THREE.Vector2(0.85, 0.85);
  }

  return new THREE.MeshStandardMaterial({
    ...baseParams,
    ...matParams
  });
}
