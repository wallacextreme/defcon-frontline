import * as THREE from 'three';

export interface PBRTextureSet {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
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

function buildArmorSet(
  baseHex: string,
  panelDarkHex: string,
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

  // Base fill
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, S, S);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, S, S);
  rctx.fillStyle = '#b8b8b8'; // ~0.72 matte CARC paint roughness
  rctx.fillRect(0, 0, S, S);

  // Optional 3-tone OPFOR military camo blobs
  if (camoPalette) {
    for (let i = 0; i < 24; i++) {
      const cx = rand() * S;
      const cy = rand() * S;
      const rx = 45 + rand() * 85;
      const ry = 30 + rand() * 65;
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

  // Micro surface grain & brushed steel variation
  for (let i = 0; i < 4200; i++) {
    const x = rand() * S;
    const y = rand() * S;
    const w = 1 + rand() * 4;
    const h = 1 + rand() * 2;
    const dark = rand() > 0.5;
    ctx.fillStyle = dark ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
    ctx.fillRect(x, y, w, h);
    bctx.fillStyle = dark ? 'rgba(105,105,105,0.22)' : 'rgba(150,150,150,0.22)';
    bctx.fillRect(x, y, w, h);
  }

  // Oil / soot grime streaks
  for (let i = 0; i < 16; i++) {
    const gx = rand() * S;
    const gy = rand() * S;
    const rad = 18 + rand() * 52;
    const grad = ctx.createRadialGradient(gx, gy, 2, gx, gy, rad);
    grad.addColorStop(0, 'rgba(18, 16, 14, 0.28)');
    grad.addColorStop(1, 'rgba(18, 16, 14, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(gx - rad, gy - rad, rad * 2, rad * 2);

    rctx.fillStyle = 'rgba(65, 65, 65, 0.28)'; // oil slick slightly glossier
    rctx.beginPath();
    rctx.arc(gx, gy, rad * 0.6, 0, Math.PI * 2);
    rctx.fill();
  }

  // Armor plate grid seams (2x2 plates) + metallic edge chipping + corner rivets
  const step = 256;
  for (let py = 0; py < S; py += step) {
    for (let px = 0; px < S; px += step) {
      // Recessed weld seam
      ctx.strokeStyle = panelDarkHex;
      ctx.lineWidth = 4;
      ctx.strokeRect(px + 2, py + 2, step - 4, step - 4);

      bctx.strokeStyle = '#2c2c2c';
      bctx.lineWidth = 5;
      bctx.strokeRect(px + 2, py + 2, step - 4, step - 4);

      // Metallic edge wear highlight along panel bevel
      ctx.strokeStyle = edgeWearHex;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px + 6, py + 6, step - 12, step - 12);

      rctx.strokeStyle = '#555555'; // shiny exposed steel along chipped edges
      rctx.lineWidth = 3;
      rctx.strokeRect(px + 5, py + 5, step - 10, step - 10);

      // Corner & mid-seam steel rivets
      const rivetOffsets = [
        [14, 14],
        [step - 14, 14],
        [14, step - 14],
        [step - 14, step - 14],
        [step * 0.5, 14],
        [step * 0.5, step - 14],
        [14, step * 0.5],
        [step - 14, step * 0.5]
      ];
      for (const [rx, ry] of rivetOffsets) {
        const cx = px + rx;
        const cy = py + ry;
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.arc(cx + 1, cy + 1, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = edgeWearHex;
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        bctx.fillStyle = '#ededed';
        bctx.beginPath();
        bctx.arc(cx, cy, 4.2, 0, Math.PI * 2);
        bctx.fill();

        rctx.fillStyle = '#404040';
        rctx.beginPath();
        rctx.arc(cx, cy, 4.2, 0, Math.PI * 2);
        rctx.fill();
      }
    }
  }

  // Subtle combat scratches
  for (let i = 0; i < 18; i++) {
    const sx = rand() * S;
    const sy = rand() * S;
    const ang = rand() * Math.PI * 2;
    const len = 14 + rand() * 34;
    ctx.strokeStyle = edgeWearHex;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
    ctx.stroke();

    bctx.strokeStyle = '#454545';
    bctx.lineWidth = 1.5;
    bctx.beginPath();
    bctx.moveTo(sx, sy);
    bctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
    bctx.stroke();

    rctx.strokeStyle = '#383838';
    rctx.lineWidth = 2;
    rctx.beginPath();
    rctx.moveTo(sx, sy);
    rctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
    rctx.stroke();
  }

  return {
    map: finalizeTexture(cMap, true, anisotropy),
    bumpMap: finalizeTexture(cBump, false, anisotropy),
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
        { target: ctx, fill: '#7e8896', w: 18, h: 6 },
        { target: bctx, fill: '#f0f0f0', w: 19, h: 7 },
        { target: rctx, fill: '#353535', w: 18, h: 6 }
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
    roughnessMap: finalizeTexture(cRough, false, anisotropy)
  };
}

/**
 * Generates and caches all procedural 512x512 PBR texture sets (map, bumpMap, roughnessMap).
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

/**
 * Helper to create a MeshStandardMaterial wired to a cached PBR texture set.
 */
export function createPBRMaterial(
  key: string,
  overrides: THREE.MeshStandardMaterialParameters & { repeat?: [number, number] } = {}
): THREE.MeshStandardMaterial {
  const sets = getPBRTextures();
  const set = sets[key] || sets.natoArmorPlate;
  const { repeat, ...matParams } = overrides;

  let map = set.map;
  let bumpMap = set.bumpMap;
  let roughnessMap = set.roughnessMap;

  if (repeat) {
    map = set.map.clone();
    bumpMap = set.bumpMap.clone();
    roughnessMap = set.roughnessMap.clone();
    map.repeat.set(repeat[0], repeat[1]);
    bumpMap.repeat.set(repeat[0], repeat[1]);
    roughnessMap.repeat.set(repeat[0], repeat[1]);
    map.needsUpdate = true;
    bumpMap.needsUpdate = true;
    roughnessMap.needsUpdate = true;
  }

  return new THREE.MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: matParams.bumpScale ?? 0.04,
    roughnessMap,
    roughness: matParams.roughness ?? 0.72,
    metalness: matParams.metalness ?? 0.25,
    envMapIntensity: matParams.envMapIntensity ?? 1.15,
    ...matParams
  });
}
