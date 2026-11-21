# DEFCON: Frontline — Plano Mestre de Overhaul Visual AAA 3D (Logbook Vivo)

> **Projeto:** DEFCON: Frontline (`defcon-frontline`) — Tower Defense Militar 3D em Three.js r187 + Vite 7  
> **Documento:** `docs/designs/VISUAL_OVERHAUL.md` (Logbook Persistente — Fonte de Verdade das Fases 0 a 6)  
> **Data da Auditoria Fase 0:** 2026-11-21 | **Commit Base (`HEAD`):** `0c3ff67` (`main...origin/main`)  
> **Estado Atual:** 🟡 **FASE 0 CONCLUÍDA — AGUARDANDO APROVAÇÃO NO GATE G0**  
> **Restrição de Escopo na Fase 0:** Nenhum arquivo de código-fonte do projeto foi modificado ou criado; apenas este documento foi adicionado.

---

## 1. Resumo Executivo & Contexto de Retomada (Nova Conversa)

Este documento funciona simultaneamente como **pacote de decisão do GATE G0** e como **logbook vivo** que será atualizado ao final de cada fase (Fases 1 a 6), permitindo retomar o trabalho em qualquer nova sessão sem perder contexto nem reauditar o repositório.

### Estado Atual do Projeto
- **Fase 0 (Auditoria & Plano):** **100% concluída** com auditoria estática de código/APIs Three.js r187, execução de `npm test` (`15/15 PASS`) e `npm run build` (`PASS`), além de captura real em Chrome/WebGL2 (ANGLE D3D11, Intel UHD Graphics 630) em Desktop (`1440×900`) e Mobile Portrait (`390×844`).
- **Principais achados críticos do baseline:**
  1. **White-out catastrófico no bioma Ártico (`2-1` e `4-3`):** `55,3%` da tela inteira (`>85%` do tabuleiro) estoura em branco (`>=245/255`), apagando estradas, rochas e `iceCells`, devido à soma de albedo alto de neve (`#dce7f3`) + `sunLight(2.55)` + `IBL(1.15)` + `exposure(1.08)` + `UnrealBloomPass(threshold=0.82)`.
  2. **Zero Anti-Aliasing efetivo:** `EffectComposer` usa `WebGLRenderTarget` com `samples = 0` e sem SMAA/FXAA, ignorando `antialias: true` do canvas (confirmado no zoom 400% NEAREST).
  3. **Explosão de draw calls:** apenas **4 torres** somaram `+206` draw calls (`~51,5` calls/torre contando shadow + main pass), e `4-3` vazio já começa com `501` calls (`0` usos de `InstancedMesh`).
  4. **Terreno plano com "bolotas" e freeze de troca de fase:** 520 círculos `ctx.arc()` pintados em 3 `CanvasTexture` `2240×1280` (`~43,75 MiB` VRAM com mipmaps) provocam congelamento síncrono de `341–444 ms` a cada troca de fase e padrão artificial de bolinhas em baixa resolução (`20 px/u`).
  5. **Mobile Portrait `390×844` degradado:** ~`19,9 FPS` (`50,3 ms` p50), tabuleiro cortado lateralmente (Spawns e FOB fora da tela) e overflow no topo do HUD.
  6. **Bugs/divergências estruturais descobertas:** `ownerRingMesh` em `y = 0.06` clipa sob a laje das torres (`y = 0.14–0.24`); `radarPivots` não gira em `patriot`/`javelin`/`minefield`; `specialization` não é passada aos builders de torre; `src/three/Effects3D.ts` possui alterações pré-existentes no working tree que **não devem ser tocadas/revertidas**.
- **Próximo passo após aprovação do GATE G0:** Iniciar **Fase 1 (Infraestrutura Visual, Lighting/IBL, AA, Tone Mapping, Quality Presets & Visual Gallery `?gallery=1`)** e submeter ao **GATE G1**.

---

## 2. Reconfirmação dos Fatos da Arquitetura (`✔`/`✖` + `arquivo:linha` + Divergências)

Auditoria verificada diretamente nos arquivos do repositório (zero suposições):

| Item Verificado | Status | Evidência (`arquivo:linha`) & Divergências Flagadas |
|---|:---:|---|
| Stack: Vite 7 + Three.js `^0.187.0` + PeerJS | ✔ | `package.json:13-18` (`three: ^0.187.0` [0.187.0], `@types/three: ^0.187.0` [0.187.0], `vite: ^7.3.1` [7.3.8], `peerjs: ^1.5.5`); `vite.config.js:3-13` (`base: './'`, `port: 5173`, `target: 'es2022'`). PeerJS via dynamic `import('peerjs')` em `src/systems/MultiplayerManager.ts:1119` (`allowPeerJs` em `L849,1093,1112`; `src/ui/HudController.js:308,344`). |
| TypeScript apenas em `src/three/*.ts` e JS no resto | **✖ DIVERGÊNCIA** | Existem **7** arquivos `.ts` (não 5): `src/three/Battlefield3D.ts` (`258,8 kB` / 7.253L), `src/three/MilitaryModels3D.ts` (`135,8 kB` / 4.072L), `src/three/TerrainDiorama3D.ts` (`37,7 kB` / 1.101L), `src/three/ProceduralPBRTextures.ts` (`18,8 kB` / 640L), `src/three/Effects3D.ts` (`13,2 kB` / 452L) **+** `src/systems/MultiplayerManager.ts` (`58,4 kB` / 1.796L) e `src/systems/SaveManager.ts` (`23,3 kB` / 737L). Restante: 11 `.js` em `src/` + `src/styles/tactical.css` (`52,5 kB`). |
| Ausência de `tsconfig.json` | ✔ | Confirmado: sem `tsconfig.json` na raiz (Vite/esbuild faz transpilação sem `tsc`). |
| Service Worker `public/sw.js` (`v6`, network-first) | ✔ | `public/sw.js:1` `CACHE_NAME = 'defcon-frontline-pwa-v6'`; estratégia network-first em `public/sw.js:33-64` (`cache: 'no-store'` em `navigate` `L42`, fallback cache `L54-62`). |
| `npm test` (3 suítes: `balance`, `expansion`, `multiplayer`) | ✔ | `package.json:10` (`node --test tests/*.test.mjs`): **15/15 PASS** em `1.315,09 ms` (`balance.test.mjs` 2/2, `expansion.test.mjs` 5/5, `multiplayer.test.mjs` 8/8). |
| `npm run build` (baseline) | ✔ | Vite `7.3.8` (67 módulos) **PASS** em `13,18 s`: `dist/index.html` `26,12 kB` (`6,94 kB` gz), `index-*.css` `40,41 kB` (`8,06 kB` gz), `bundler-*.js` `117,15 kB` (`31,65 kB` gz), `index-*.js` `1.107,54 kB` (`292,09 kB` gz; aviso >500 kB já existe no baseline). |
| `docs/designs/ARCHITECTURE.md` & `graphify-out/GRAPH_REPORT.md` | ✔ | `ARCHITECTURE.md` (48L, untracked) e `GRAPH_REPORT.md` (134L, 617 nós, 1.985 arestas, 18 comunidades, 0 ciclos, commit `0c3ff671` == `HEAD` `0c3ff67`). |
| `git status` pré-existente | **✖ ALERTA** | Working tree já continha alterações pré-existentes antes da Fase 0: `M src/three/Effects3D.ts` (+16L: `scratchVec`, `getScratchVector()`, `getPoolStats()` em `L90`, `L438-451`), `?? README.md`, `?? docs/designs/ARCHITECTURE.md`. **REGRA:** não reverter nem editar `Effects3D.ts`. |
| `WebGLRenderer`, DPR, ShadowMap, ToneMapping | ✔ | `src/three/Battlefield3D.ts:635-642`: `{ antialias: true, powerPreference: 'high-performance' }`, `setPixelRatio(Math.min(dpr, 1.5))`, `shadowMap.enabled = true`, `shadowMap.type = THREE.PCFShadowMap` (já seguro para r187), `toneMapping = ACESFilmicToneMapping`, `toneMappingExposure = 1.08`, `outputColorSpace = SRGBColorSpace`. |
| `EffectComposer` & Anti-Aliasing | ✔ **(sem AA)** | `src/three/Battlefield3D.ts:703-707`: `new EffectComposer(renderer)` → `RenderPass` → `UnrealBloomPass(Vector2(w,h), 0.45, 0.35, 0.82)` → `OutputPass`. Sem 2º arg, `EffectComposer.js:69` cria RT com **`samples = 0`**; sem `SMAAPass` nem `FXAA`. O `antialias: true` do canvas não atua! |
| IBL (`PMREMGenerator` + `RoomEnvironment`) | ✔ (+2 notas) | `src/three/Battlefield3D.ts:647-651`: `PMREMGenerator` → `compileEquirectangularShader()` (ocioso para `fromScene`) → `fromScene(new RoomEnvironment(), 0.04).texture`, `environmentIntensity = 1.15`, `pmrem.dispose()`. **Notas:** `RoomEnvironment` não recebe `.dispose()` e o `WebGLCubeRenderTarget` retornado não é guardado para futuro `dispose()`. |
| Iluminação (Hemi, Sun, Rim, Flash Pool) | ✔ (+nota bioma) | `src/three/Battlefield3D.ts:653-681`: `HemisphereLight(0x8bb2d6, 0x5c4a36, 0.9)` (`L653` — **não salvo em propriedade da classe, nunca muda entre biomas**); Sun `DirectionalLight(0xffe9c2, 2.55)` em `(45, 68, 38)`, `mapSize(2048, 2048)`, frustum `[-66,66]×[-48,48]`, `near: 10, far: 200`, `bias: -0.0004`, `normalBias: 0.02` (`L656-668`); Rim `DirectionalLight(0x60a5fa, 0.85)` em `(-48, 32, -40)` (`L670-672`); Pool fixo de **2** `PointLight(0xffb74d, 0, 14, 2)` sem sombra (`L675-681, 722-730`). |
| `FogExp2` & Background plano | ✔ | Boot: `background = 0x161411`, `FogExp2(0x1b1712, 0.0038)` (`Battlefield3D.ts:629-630`). Troca de fase (`L2308-2315`): atualiza `background = skyColor`, `FogExp2(fogColor, fogCells?.length ? 0.0046 : 0.0038)` (**apenas `4-4` usa `0.0046`**; 19 fases usam `0.0038`), `sunLight.color` e `rimLight.color` (não altera intensidade/posição solar nem `HemisphereLight`). |
| Câmera & `OrbitControls` | ✔ | `Battlefield3D.ts:632-633,683-701,732-757`: `PerspectiveCamera(42, aspect, 0.5, 520)`, posição `(0, 62, 74)` (portrait `(0, 78, 92)`), FOV responsivo `42` (`>=1.35`), `48` (`1.0-1.35`), `42..68` (`<1.0`). `OrbitControls`: `minDistance=24`, `maxDistance=210`, `minPolarAngle=0.14π` (`25.2°`), `maxPolarAngle=0.43π` (`77.4°`), `dampingFactor=0.08`, `screenSpacePanning=false`. |
| Grid 28×16, `CELL_WORLD=4.0`, `112×64`, `CELL` | ✔ | `src/systems/Pathfinder.js:3-16`: `GRID_COLS=28`, `GRID_ROWS=16`, `TILE_SIZE=64`, `CELL = { FREE:0, ROAD:1, ROCK:2, SPAWN:3, FOB:4, TOWER:5, BARRIER:6, RESTRICTED:7 }`. `TerrainDiorama3D.ts:11-14,32-65`: `CELL_WORLD=4.0`, `WORLD_SCALE=0.0625`, `BOARD_W=112`, `BOARD_D=64` + 7 helpers de conversão. |
| `MilitaryModels3D.ts`: `TowerRig3D` & 23 `defId`s | ✔ (+2 diverg.) | `TowerRig3D` (`L572-584`, **11 campos**): `root`, `turretPivot?`, `barrelPivot?`, `gatlingPivot?`, `radarPivots?`, `ewRings?`, `missileCaps?`, `muzzlePoint?`, `muzzleFlashMesh?`, `laserBeam?`, `aesaPanel?`. **Divergências:** (a) `laserBeam` é campo morto (`helios_laser` cria `tower.laserBeams` em `Battlefield3D.ts:5534-5538`); (b) `aesaPanel` só é setado em `buildPatriot` (`L1526`) e nunca lido em runtime; (c) comentário obsoleto `L704` cita `"12 weapons"`. **23 `defId`s** (`src/data/towers.js` + `L612-662`): `precision`(5), `area`(5), `elemental`(7), `support`(6). |
| `vLevel`, anéis `5A`/`6B` & `hesco` | ✔ (+divergência) | `MilitaryModels3D.ts:610`: `vLevel = level <= 1 ? 1 : level <= 3 ? 2 : 3`. **Divergência:** `specialization` **não é passada** aos `build*` (`L618-661`); diferenciação 5A/6B limita-se a `specRing` (`Torus(1.78, 0.055)` `y=0.24`, `L665-679`) e `crownRing` (`level >= 6 && spec`, `Torus(1.92, 0.045)` `y=0.34`, `L681-690`). `hesco` possui apenas 1 nível e `specializations: null` em `towers.js` (`L612-616` retorna cedo; `L742` `level >= 2 ? 2 : 1` é dead code). |
| Primitivas geométricas (`MilitaryModels3D.ts`) | ✔ | Contagens exatas (excl. definições): **`addBox`: 286** (143 torres / 143 inimigos+aéreo); **`addCyl`: 199** (123 torres / 73 inimigos / 3 rodas); `createSideExtrudeGeo` (`L371`): **22**; `createPlanExtrudeGeo` (`L401`): **6**; `createLatheAlongZGeo` (`L430`): **20**; `createLatheYGeo` (`L441`): **2**; `TubeGeometry`: **1**; `RoundedBoxGeometry`: **0**; `EdgesGeometry`: **0**. `getGeo` (`L71-77`), `getMats` (`L79-307`, 32 materiais). |
| `ProceduralPBRTextures.ts` & `metalness` de tintas | ✔ **(PBR errado)** | **9 famílias** (`L584-598`), **512×512** (`L12`), **3 mapas**: `map` (sRGB), `bumpMap`, `roughnessMap` (`27` texturas = `27 MiB` bruto / **`36 MiB` com mips**; `.clone()` em `L619-621` compartilha `Texture.source`). **Ausentes:** `normalMap`, `aoMap`, `metalnessMap`, `emissiveMap`. **`metalness` incorreto em tintas foscas CARC (`MilitaryModels3D.ts`):** `olive` **0.24** (`L86`), `oliveDark` **0.28** (`L94`), `desertArmor` **0.16** (`L102`), `rusCamo` **0.24** (`L157`), `rusDark` **0.28** (`L165`), `navalWhite` **0.30** (`L193`), `blackShark` **0.55** (`L173`), `navalGray` **0.62** (`L199`); default `createPBRMaterial` **0.25** (`ProceduralPBRTextures.ts:636`). |
| Contratos de animação, Ghost, Prewarm & `ownerRingMesh` | **✖ 2 BUGS** | Contratos ativos em `Battlefield3D.ts`: `turretPivot.rotation.y` (`L1855,2019,2690,2952,4022,5470`), `barrelPivot.position.z = _baseZ - recoil` (`L4232-4236`), `gatlingPivot.rotation.z += dt*28` (`L5461-5463`), `ewRings` (`L4024-4029`), `missileCaps` (`L5443-5446`), `muzzlePoint` (`L5473-5475,5628-5631`), `muzzleFlashMesh` (`L1852,4222-4229,5418`), `userData.noShadow` (`MilitaryModels3D.ts:317,3936`). **Bug 1:** `radarPivots` (`L3742-3746,4016-4020`) só gira para `ew_crew`, `iron_dome`, `eng_workshop`, `energy_extractor` e `cryo_tower` — deixando `patriot`, `javelin` e `minefield` estáticos. **Bug 2 (Clipping):** `ownerRingMesh` (`RingGeometry(1.42, 1.62, 28)` `L519`) está em **`y = 0.06`** (`L2614`), sendo enterrado sob bases de torres (`raio 1.62–1.80u`, `y = 0.14–0.24u`). `createGhostTower3D` (`L3908-3955`) clona cada mesh visível em `wireframe: true` escala `1.01` (dobra draw calls/tris). `prewarmAllMilitaryModels` (`L3961-4072`) aquece 23 ghosts + 133 rigs + 38 inimigos + A10/B52 + 4 mísseis e roda `renderer.compile` (`L4068`). |
| `TerrainDiorama3D.ts` & `src/data/worlds.js` | ✔ (+diverg./VRAM) | `createBattlefieldDiorama3D` (`L567-573` → `{group, groundPlane, update, dispose}` `L67-72`). `PlaneGeometry(112, 64)` (`L591`, 1×1 seg) com 3 `CanvasTexture` `2240×1280` (`L223-241,529-536`; `20 px/u`). **VRAM exata:** `2240×1280×4B = 10,94 MiB/mapa` → `32,81 MiB` bruto / **`43,75 MiB` com mipmaps WebGL2** (`Texture.js:257`) + `0,77 MiB` réguas (`1792×48`, `64×1024`). `L262-276` pinta 520 círculos `ctx.arc()` ("bolotas"); `L256` usa seed `7890` igual para os 5 biomas não-desert/arctic. `groundPlane` é alvo de raycast (`Battlefield3D.ts:1024`). Plinto + réguas (`L608-663`, `EdgesGeometry` `L633`). **7 `BIOME_THEMES`** (`L92-212`). **`worlds.js:2`** comentário obsoleto diz `"3 Worlds"`, mas existem **4 Mundos / 20 Fases** (`L272-1538`): **divergência:** `2-1` tem `0 iceCells`; quem possui `22 iceCells` + `12 restrictedCells` é **`4-3`**. Células especiais (`L855-883`) são quads `MeshBasicMaterial` planos (`y=0.04..0.16`). **0 `InstancedMesh`** em props; ruínas industriais alocam novas geometrias por célula (`L771,778`). |
| Determinismo visual (`Math.random()`) | ✔ | `MilitaryModels3D.ts`: **0**; `TerrainDiorama3D.ts`: **0** (LCG `L256-260`); `ProceduralPBRTextures.ts`: **0** (`makeRng` `L19-25`); `Effects3D.ts`: **28** (partículas runtime); `Battlefield3D.ts`: **34** (simulação/jitter runtime). |

---

## 3. Auditoria Visual & Métricas Reais de Baseline

### 3.1 Ambiente de Medição & Saúde do Console
- **Browser/GPU:** Chrome headless via Playwright, WebGL2 ANGLE D3D11 (`Intel(R) UHD Graphics 630`, `isWebGL2: true`, `maxSamples: 16`).
- **Viewports testados:**
  - Desktop `1440×900` (`dpr: 1`, `rendererPixelRatio: 1`, canvas `1080×663` / backbuffer `1080×663`).
  - Mobile Portrait `390×844` (`dpr: 2`, `rendererPixelRatio: 1.5`, canvas `390×618` / backbuffer `585×927`).
- **Console Health:** **0 errors**, **0 warnings**, **0 pageErrors** em desktop e mobile.
- **Armadilha de telemetria (`renderer.info.autoReset`):** ler `renderer.info.render` após `composer.render()` sem `autoReset = false` retorna apenas `{ calls: 1, triangles: 1 }` (o quad do `OutputPass`). As métricas abaixo registram separadamente **Scene Calls** (RenderPass + ShadowPass) e **Full Calls** (todos os passes do `EffectComposer`).
- **Tempos de carga medidos:**
  - **Boot até cena pronta + 10 frames:** `5.007,4 ms`.
  - **Troca de fase (`loadStage` + 1 render síncrono):** `1-1→2-1: 401,6 ms` | `2-1→3-1: 443,8 ms` | `3-1→4-5: 409,3 ms` | `4-5→1-1: 364,3 ms` | `→4-3: 341,2 ms` (**freeze síncrono de ~340–444 ms** causado pela regeneração CPU dos 3 canvases `2240×1280`).
- **VRAM estimada de texturas procedurais no baseline:**
  - Terreno (`3 × 2240×1280` RGBA com mipmaps): **`43,75 MiB`** (+ `0,77 MiB` réguas A..AB / 01..16 = **`44,52 MiB`**).
  - Texturas PBR de modelos (`9 famílias × 3 mapas × 512×512` com mipmaps): **`36,00 MiB`**.
  - Total só de texturas procedurais: **`~80,5 MiB`** (antes de shadow map `2048×2048`, render targets `HalfFloat` do `EffectComposer`/`UnrealBloomPass` e PMREM cube map).

### 3.2 Tabela de Métricas Baseline (`renderer.info` & Frame Time)

| Cenário (Viewport / DPR) | Torres | Scene Calls | Full Calls | Tris (Scene) | Lines | Geos / Texs | Programs | Frame p50 / Mean / p95 / Max (ms) | Mean Luma / ≥245 White |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| `1-1` Desert vazio (`1440×900`, dpr 1) | 0 | 295 | 309 | 8.184 | 75 | 38 / 37 | 36 | `16.8 / 20.6 / 33.8 / 34.0` (~59,5 FPS) | — |
| `1-1` Desert C1 (`howitzer,patriot,tesla,m2`) | 4 | **501** | **515** | **18.032** | 75 | 80 / 40 | 37 | **`16.8 / 22.3 / 33.8 / 49.3`** (120f) | `136.6 / 0.0%` |
| `1-1` Closeup C5 (`dist 24.08u`) | 4 | 387 | 401 | 14.928 | 75 | 80 / 40 | 37 | `16.7 / 19.2 / 33.7 / 33.9` (60f) | `188.5 / 0.1%` |
| `2-1` Arctic C1 (`0 iceCells`) | 0 | 412 | 426 | 8.920 | 73 | 83 / 40 | 33 | `16.9 / 21.2 / 33.5 / 33.6` (60f) | **`227.8 / 55.3%`** (`11.9%` ≥253) |
| `3-1` Industrial C1 | 0 | 221 | 235 | 4.552 | 75 | 100 / 40 | 33 | `16.8 / 20.9 / 33.8 / 50.2` (60f) | `92.4 / 0.0%` |
| `4-5` Volcanic C1 (`10 lavaCells`) | 0 | 290 | 304 | 6.932 | 105 | 82 / 40 | 33 | **`16.8 / 20.6 / 33.6 / 50.0`** (120f) | `64.1 / 0.0%` |
| `4-3` Arctic+Ice C1 (`22 iceCells`) | 0 | **501** | **515** | 9.624 | 75 | 84 / 40 | 33 | `16.9 / 22.5 / 34.3 / 34.8` (40f) | **`227.2 / 55.1%`** (`9.1%` ≥253) |
| `1-1` Portrait (`390×844`, dpr 2→1.5, FOV 68) | 4 | 472 | 486 | 17.396 | 75 | 75 / 40 | 37 | **`50.3 / 53.4 / 67.1 / 83.8`** (~19,9 FPS) | — |

> **Veredito Conclusivo do Zoom 400% de Anti-Aliasing:** Em `f0_1-1_aa_zoom400_baseline.png` (crop 400% NEAREST `330×190 → 1320×760` extraído de `f0_1-1_closeup_c5_baseline.png`) combinado com `composer.renderTarget1.samples === 0`, fica provado **0% de AA efetivo**: há serrilhado binário severo em toda aresta diagonal (cano/boca do `howitzer`, tubos do `patriot`, contorno da base, linha vermelha de rota e bordas do asfalto). **MSAA em `WebGLRenderTarget({ samples: 4 })` (ou `SMAAPass()` em fallback) é obrigatório na Fase 1.**

### 3.3 Inventário de Screenshots Baseline & Pior Defeito Visível

Diretório canônico dos artefatos de baseline: `C:\Users\Usu\.gemini\antigravity\brain\0524a177-dfd5-45e2-a2ed-8409e10f4018\`

| Screenshot Baseline (Link Clicável) | Cena / Câmera | Pior Defeito Visível Observado |
|---|---|---|
| [f0_1-1_desert_c1_baseline.png](file:///C:/Users/Usu/.gemini/antigravity/brain/0524a177-dfd5-45e2-a2ed-8409e10f4018/f0_1-1_desert_c1_baseline.png) | `1-1` Deserto, 3/4 C1, 4 torres (`1440×900`) | Terreno dominado por grandes manchas circulares artificiais ("bolotas" procedurais `ctx.arc`) sobre plano completamente raso, com bloom excessivo na Torre Tesla e serrilhado nas diagonais. |
| [f0_1-1_closeup_c5_baseline.png](file:///C:/Users/Usu/.gemini/antigravity/brain/0524a177-dfd5-45e2-a2ed-8409e10f4018/f0_1-1_closeup_c5_baseline.png) | `1-1` Deserto, Close-up C5 ~24u, 4 torres | `UnrealBloomPass` (`threshold=0.82`) cria um véu branco ofuscante na Torre Tesla e na areia clara adjacente (quadrante inferior esquerdo); torres exibem caixas/cilindros sem chanfro, zero sombra de contato e aparência plástica na base do `patriot`. |
| [f0_1-1_aa_zoom400_baseline.png](file:///C:/Users/Usu/.gemini/antigravity/brain/0524a177-dfd5-45e2-a2ed-8409e10f4018/f0_1-1_aa_zoom400_baseline.png) | Crop 400% NEAREST (`howitzer`, `patriot`, estrada) | Serrilhado binário extremo (**0% AA**) no cano do `howitzer`, tubos diagonais do `patriot`, linha vermelha de rota e bordas da plataforma, agravado por texels borrados (`20 px/u`) no solo e zero oclusão de contato sob sacos de areia. |
| [f0_2-1_arctic_c1_baseline.png](file:///C:/Users/Usu/.gemini/antigravity/brain/0524a177-dfd5-45e2-a2ed-8409e10f4018/f0_2-1_arctic_c1_baseline.png) | `2-1` Ártico, 3/4 C1 (`1440×900`) | **Estouro catastrófico de exposição e bloom (`55,3%` da tela ≥245/255)**: praticamente 100% do tabuleiro vira um clarão branco onde estradas, rochas, spawns e área construível somem. |
| [f0_4-3_arctic_ice_c1_baseline.png](file:///C:/Users/Usu/.gemini/antigravity/brain/0524a177-dfd5-45e2-a2ed-8409e10f4018/f0_4-3_arctic_ice_c1_baseline.png) | `4-3` Porto Congelado (`22 iceCells`), 3/4 C1 | Mesmo white-out total (`55,1%` ≥245/255): as 22 células de gelo escorregadio (+25% vel.) e 12 células restritas tornam-se completamente ilegíveis sob o bloom branco. |
| [f0_3-1_industrial_c1_baseline.png](file:///C:/Users/Usu/.gemini/antigravity/brain/0524a177-dfd5-45e2-a2ed-8409e10f4018/f0_3-1_industrial_c1_baseline.png) | `3-1` Industrial, 3/4 C1 (`1440×900`) | Chão de concreto coberto por "bolotas" cinza-escuras repetitivas (aspecto de papel de parede), baixo contraste entre solo/asfalto e ruínas idênticas reduzidas a "cubo + cilindro" escuros. |
| [f0_4-5_volcanic_c1_baseline.png](file:///C:/Users/Usu/.gemini/antigravity/brain/0524a177-dfd5-45e2-a2ed-8409e10f4018/f0_4-5_volcanic_c1_baseline.png) | `4-5` Vulcânico (`10 lavaCells`), 3/4 C1 | As 10 `lavaCells` são quadrados vermelhos planos `MeshBasicMaterial` sem fissura, crosta ou relevo sobre o padrão de "bolotas" marrons, e o cone aditivo do holofote da FOB vaza para fora da borda direita do tabuleiro. |
| [f0_1-1_portrait_baseline.png](file:///C:/Users/Usu/.gemini/antigravity/brain/0524a177-dfd5-45e2-a2ed-8409e10f4018/f0_1-1_portrait_baseline.png) | `1-1` Deserto, Mobile Portrait (`390×844`) | Tabuleiro cortado nas laterais (Spawns e FOB fora da tela) com ~40% de vazio cinza acima/abaixo, topbar cortando texto/botões à direita (`TORRES`, `MAPA DE MUN...`) e queda para **~19,9 FPS** (`50,3 ms` p50). |

---

## 4. Top 15 Problemas Visuais por Impacto

Ordenados por impacto real no jogador: **Legibilidade Tática → Forma/Silhueta/PBR → AA/Luz/Sombra → Terreno/Bioma → Performance/Escalabilidade**.

1. **[P0 — Legibilidade] White-out total no bioma Ártico (`2-1`..`2-5` e `4-3`):** neve sRGB `#dce7f3` + `sunLight(2.55)` + `IBL(1.15)` + `exposure(1.08)` dispara `UnrealBloomPass(0.82)` no tabuleiro inteiro (`55,3%` da tela ≥245/255), inutilizando a leitura tática.
2. **[P0 — Legibilidade] Bloom contaminando terreno claro e detalhes não-emissivos (`1-1`):** `threshold = 0.82` faz areia iluminada e tampas brancas do `patriot` sangrarem em névoa branca ao redor da Torre Tesla, reduzindo contraste local.
3. **[P0 — Legibilidade] Células ambientais especiais como quads planos artificiais (`TerrainDiorama3D.ts:855-883`):** `lavaCells` viram quadrados vermelhos planos, `iceCells` desaparecem no branco, `toxicCells`/`fogCells`/`restrictedCells` carecem de linguagem de perigo clara e acessível.
4. **[P0 — Legibilidade/Mobile] Enquadramento quebrado e gargalo em Mobile Portrait (`390×844`):** Spawns e FOB ficam cortados fora do viewport, sobram ~40% de fundo morto e o frame time salta para `50,3 ms` p50 (`83,8 ms` max).
5. **[P1 — Legibilidade/Bug] `ownerRingMesh` enterrado sob a base das torres + diferenciação fraca de `5A`/`6B`:** `ownerRingMesh` em `y = 0.06` (`Battlefield3D.ts:2614`) clipa dentro de bases com `y = 0.14–0.24`; especializações `5A`/`6B` só mudam 2 anéis finos no chão sem reflexo na silhueta da arma.
6. **[P1 — Forma/Silhueta] Geometria primitiva sem chanfros/bevels e torres sub-detalhadas:** `286 addBox` e `199 addCyl` com `0 RoundedBoxGeometry`; `tesla_tower` usa apenas 3 cilindros; arestas perfeitamente retas não captam rim/specular, dando aspecto de bloco de protótipo.
7. **[P1 — Material/PBR] Materiais PBR fisicamente incorretos e sem mapas de micro-superfície:** tintas foscas CARC com `metalness: 0.16–0.30` (e `0.55–0.62` em `blackShark`/`navalGray`) parecem plástico/metal engordurado; faltam `normalMap`, `aoMap`, `metalnessMap`, edge wear e sujeira de base.
8. **[P1 — AA] Zero Anti-Aliasing efetivo no `EffectComposer`:** backbuffer offscreen com `samples = 0` e sem SMAA gera serrilhado binário severo em todos os canos, contornos e linhas táticas (confirmado em 400%).
9. **[P1 — Luz/Sombra/AO] Ausência de Oclusão Ambiental (AO) e sombras de contato:** torres, sacos de areia e rochas parecem flutuar sobre o terreno; frustum solar único (`132×96u` em 2048px) entrega baixa densidade de texel de sombra (`~15,5 px/u`).
10. **[P1 — Luz/IBL/Atmosfera] IBL de sala fechada (`RoomEnvironment`) + `HemisphereLight` congelado + fundo sólido morto:** todos os 7 biomas compartilham reflexos de estúdio interno e a mesma luz hemisférica azul/marrom contra um vazio plano de cor única.
11. **[P2 — Terreno] Terreno 100% raso com padrão de "bolotas" (`520 ctx.arc()`) e baixa densidade de texel (`20 px/u`):** manchas circulares artificiais dominam `1-1`, `3-1` e `4-5`; 5 biomas dividem a mesma seed `7890` (`TerrainDiorama3D.ts:256`).
12. **[P2 — Props/Diorama] Props estáticos genéricos sem enraizamento nem movimento:** rochas dodecaedro idênticas, ruínas industriais "caixa+cilindro", árvores de 3 cones rígidos sem brisa e cone aditivo do holofote da FOB vazando fora do tabuleiro.
13. **[P2 — Estruturas Herói] Spawn Helipads e FOB HQ sem hierarquia de marco focal:** estruturas-chave que definem a leitura imediata de "origem → objetivo" têm silhueta tímida e pouca integração ao diorama.
14. **[P2 — Performance] Explosão de draw calls em torres e props:** `~51,5` calls/torre e `0` `InstancedMesh` em props (`4-3` vazio = `501` calls) levam mapas com 30 torres para >1.800 draw calls, inviabilizando 60 FPS consistentes.
15. **[P2 — Performance/VRAM] Freeze de `341–444 ms` na troca de fase + `43,75 MiB` VRAM só no terreno + ghost duplicado:** regeneração síncrona de 3 canvases `2240×1280` trava a UI a cada mudança de fase, e `createGhostTower3D` dobra draw calls/tris com `wireframe: true`.

---

## 5. Art Bible — Rascunho Diretor (A Travar no GATE G2)

### 5.1 Os 4 Pilares Visuais
1. **Leitura em 1 Segundo (*Tactical Clarity First*):** A qualquer distância de combate (`65–140u`), o jogador distingue instantaneamente (a) estrada vs área construível vs obstáculo vs célula especial, (b) origem (Spawns) → destino (FOB), (c) categoria/tier de cada torre e (d) inimigos terrestres vs aéreos vs chefes. Nenhum efeito artístico pode comprometer silhueta ou contraste tático.
2. **Miniatura Militar Premium (*Die-Cast Tabletop Precision*):** Torres, veículos e marcos têm proporção ligeiramente estilizada/robusta (*heroic scale* para leitura de topo), chanfros sutis que captam luz de recorte, rebites/linhas de painel legíveis no close-up (`24u`) e acabamento tátil de aço pintado CARC fosco, aço escovado, borracha, concreto e juta — como uma maquete militar de colecionador sobre mesa de comando C4ISR.
3. **Mesa Tática Viva (*Living C4ISR Diorama*):** O tabuleiro repousa sobre um plinto tático de sala de operações iluminado por céu/atmosfera coerente com cada teatro de guerra (IBL por bioma, cúpula atmosférica sutil, neblina integrada), com micro-vida discreta (vento suave na vegetação, radares girando, cintilação térmica contida em lava/emissivos, beacons nos spawns/FOB).
4. **Coerência > Detalhe Isolado (*Systemic Cohesion*):** Paleta disciplinada, densidade de texel controlada (`≤ 2×`), regras PBR fisicamente plausíveis e linguagem de forma compartilhada entre as 23 torres e os 7 biomas. Um asset bonito isolado que quebra a escala ou o valor do conjunto é rejeitado.

### 5.2 Linguagem de Forma por Categoria (23 Torres)

| Categoria (`towers.js`) | Torres (`defId`) | Silhueta & Proporção | Assinatura Visual / Materiais |
|---|---|---|---|
| **Precisão (5)** | `ballista`, `m2_bunker`, `sniper_tower`, `railgun`, `bushmaster` | **Esguia, direcional, alto contraste de cano/trilho.** Base compacta, torre ágil, canos longos com freio de boca/trilhos paralelos e módulo óptico/mira lateral destacado. | Aço fosfatizado escuro + tinta oliva/areia fosca + lente óptica ciano/âmbar contida; `railgun` adiciona capacitores lineares e trilho de cobre/tungstênio. |
| **Área / Cerco (5)** | `abrams_pit`, `howitzer`, `tos1_mlrs`, `minefield`, `javelin` | **Larga, baixa, pesada e ancorada ao solo.** Blindagem chanfrada inclinada, patas/estabilizadores cravados na laje, casamatas robustas, tubos/pods espessos que comunicam recuo e explosão. | Placas compostas com linhas de solda, sacos de areia/concreto na base, faixas de advertência táticas (preto/âmbar desgastado) e fuligem na boca. |
| **Elemental Experimental (5)** | `cryo_tower`, `tesla_tower`, `toxic_tower`, `flamethrower`, `helios_laser` | **Engenharia tática industrial-científica (NÃO magia/fantasia).** Tanques criogênicos/químicos/combustível pressurizados com válvulas, tubulações blindadas, isoladores cerâmicos + bobinas de cobre (`tesla_tower`), espelho parabólico + aletas dissipadoras (`helios_laser`). | Chassi militar cinza-aço/oliva + código de cor contido (≤5% área emissiva): gelo `#67e8f9`, arco `#60a5fa`, ácido `#84cc16`, térmico `#f97316`, laser `#38bdf8`. |
| **Elemental Convencional / AA (2)** | `patriot`, `phalanx` | **Hardware antiaéreo NATO autêntico com ângulo ascendente explícito.** `patriot`: canisters prismáticos elevados em `35–45°` + painel radar AESA inclinado; `phalanx`: cúpula branca/cinza naval icônica sobre tambor rotativo multi-cano. | `patriot`: oliva/areia CARC fosco + tampas de canister numeradas + face AESA grafite; `phalanx`: `navalWhite` dielétrico acetinado (não metálico!) + tambor de aço escuro. |
| **Suporte / Economia (6)** | `harpoon_tower`, `ew_crew`, `eng_workshop`, `iron_dome`, `energy_extractor`, `hesco` | **Estruturas utilitárias/arquitetônicas abertas (sem cano ofensivo dominante).** Antenas parabólicas/treliças (`ew_crew`), pórtico/braço guindaste (`eng_workshop`), bateria vertical + cúpula de sensores (`iron_dome`), torre de turbina/coletores (`energy_extractor`), arpão com guincho/cabo (`harpoon_tower`), muro modular de gabiões trançados (`hesco`). | Acentos utilitários frios/táticos (`#a855f7`, `#2dd4bf`, `#38bdf8`, `#facc15`) em displays/anéis discretos; `hesco` em tela galvanizada + lona/areia opaca. |

### 5.3 Hierarquia de Detalhe em 3 Distâncias & Densidade de Texel

| Distância de Câmera | Faixa (`OrbitControls`) | O que DEVE ler nesta distância | O que pode fundir/suavizar |
|---|---|---|---|
| **Nível 1 — Macro (Estratégico)** | `140–210u` | Fluxo das rotas, Spawns, FOB, zonas especiais (`ice`/`lava`/`toxic`/`fog`/`restricted`), distinção entre as 5 linguagens de torre, inimigos em contraste ≥ 3:1 sobre o solo. | Rebites, micro-riscos, decalques numéricos pequenos, grão fino do solo. |
| **Nível 2 — Meso (Combate Padrão)** | `65–110u` (ref. `90u`) | Chanfros pegando luz, separação base/torre/arma, evolução `nv1` → `nv2-3` → `nv4+` → `5A`/`6B`, sombras de contato, textura de estrada vs acostamento vs solo, animação de radares/recuo/gatling. | Micro-trama de juta, desgaste fino de aresta em peças < `0.15u`. |
| **Nível 3 — Micro (Inspeção Close-up)** | `24–45u` (ref. `24u`) | `normalMap` nítido (painéis, soldas, rebites, concreto poroso, asfalto granulado), variação de `roughness` (tinta fosca vs aço escovado vs poeira na base), decalques táticos, bordas chanfradas limpas sem serrilhado. | N/A — este é o teste de qualidade de "miniatura de colecionador". |

**Densidade Alvo de Texel (regra de coerência: razão máx. `≤ 2,0×`):**
- **Terreno (camada detail tiled):** **`64 px/u`** (`512×512` repetida a cada `8u` = 2×2 células), modulada por splatmap macro (`512×292`, apenas pesos de mistura/estrada/sujeira — não carrega detalhe de alta frequência).
- **Props de bioma (rochas, ruínas, árvores, FOB, Spawn):** **`64–96 px/u`**.
- **Torres militares (footprint `~3.2u`, altura `2.5–4.5u`):** **`85–128 px/u`** (texturas PBR `512×512` mapeadas em `4–6u` ou trim sheet `1024×1024` em `8–10u`).
- **Razão efetiva:** `128 / 64 = 2,0×` (elimina o salto atual de `~7×` entre terreno `20 px/u` e peças pequenas das torres).

### 5.4 Valor, Cor, PBR, Emissivos & Acessibilidade
- **Calibração PBR (Regra de Ferro):**
  - **Dielétricos (tintas CARC, areia, neve, concreto, sacos, madeira):** `metalness = 0.00–0.04`, albedo linear limitado a `[0.03, 0.78]` (sRGB `#262626` até `#d9d9d9` — **neve nunca acima de `#cfdce8` em difuso**, roughness `0.78–0.92`, impedindo white-out!).
  - **Tintas militares CARC:** `olive`, `oliveDark`, `desertArmor`, `rusCamo`, `rusDark` baixam de `metalness 0.16–0.28` → **`0.02–0.05`**, `roughness 0.68–0.84`; `navalWhite` baixa de `0.30` → **`0.04`**, `roughness 0.42–0.52` (esmalte marítimo acetinado).
  - **Metais puros (aço de cano, trilhos, engrenagens, cobre, blindagem exposta nas arestas):** `metalness = 0.85–0.96`, `roughness = 0.24–0.44` (com `metalnessMap` para separar tinta de metal raspado).
- **Separação de Valores & Contraste (Teste Grayscale):**
  - Terreno jogável mantido em luminância relativa **22%–55% L*** (Ártico: **58%–70% L*** com sombras azul-ardósia **38%–48% L*** e estradas escuras **18%–26% L***).
  - Contraste **Inimigos vs Terreno ≥ 3:1** em luminância (validado em grayscale nos 7 biomas; em biomas escuros como `volcanic`/`industrial`/`swamp`, inimigos recebem rim light e detalhes de topo mais claros; em `arctic`, chassi escuro + marcas de alto contraste).
- **Orçamento Emissivo & Fotossensibilidade:**
  - Área emissiva **≤ 5%** da área projetada de cada torre/estrutura (exceto durante flash momentâneo de disparo).
  - Bloom disparado apenas por emissivos HDR (`> 1.0` linear, com `UnrealBloomPass` threshold **`1.10–1.20`**), garantindo **0% de bloom em superfícies difusas**.
  - **Zero efeitos estroboscópicos > 3 Hz** (conformidade WCAG 2.2 SC 2.3.1); animações de pulso (beacons, `ewRings`, lava, energia) em `0.4–1.8 Hz` com curva senoidal suave.
- **Acessibilidade (Deuteranopia / Protanopia):**
  - Nunca depender exclusivamente de verde vs vermelho. Preview de construção combina cor segura (**ciano `#38bdf8`** válido vs **laranja-vermelho `#f97316`/`#ef4444`** inválido) + **padrão visual distinto** (borda sólida + ícone de check/grid iluminado vs borda tracejada/X diagonal).
  - Células especiais diferenciam-se por **geometria + textura + cor** (gelo cristalino especular, fissuras de magma em relevo, poças tóxicas borbulhantes com borda de aviso, névoa volumétrica em camadas, faixas zebradas de restrição).

### 5.5 Identidade dos 7 Biomas (Preservando Cores de `src/data/worlds.js`)

| Bioma | Fases | Cores Preservadas (`worlds.js`) | Iluminação & IBL Alvo | Solo & Estradas (Detail + Splat) | Props Icônicos & Mecânica |
|---|---|---|---|---|---|
| **`desert`** | `1-1`..`1-5` | `sky:#161411` `fog:#1b1712` `sun:#ffe9c2` `rim:#38bdf8` | Sol quente alto-médio (`42°`), IBL céu árido dourado/azul claro + solo ocre; `hemi` quente/areia. | Areia compactada com ripples direcionais + cascalho nos bordos (`L* 44–54%`); asfalto empoeirado com linhas âmbar gastas. | Mesas rochosas estratificadas (não dodecaedros), arbustos secos, sacos de areia, tambores, barris de combustível. |
| **`arctic`** | `2-1`..`2-5`, `4-3` | `sky:#0b1622` `fog:#0f1e2e` `sun:#dbeafe` `rim:#67e8f9` | Sol polar mais baixo (`32°`), intensidade calibrada (`~1.85` em vez de `2.55`!), IBL céu ártico azul-pálido + sombras azul-ardósia; **zero white-out**. | Neve compacta azulada (`#b8cadc`–`#ccdbe8`, `rough 0.85`), trilha limpa em asfalto escuro molhado + neve acumulada nas bermas. | Blocos de rocha granítica escura com neve no topo, pinheiros nevados (instanced), gelo translúcido rachado em **`4-3` (`22 iceCells`)** + cais restrito (`12 restrictedCells`). |
| **`industrial`** | `3-1`..`3-5` | `sky:#0c1016` `fog:#10151e` `sun:#fde68a` `rim:#f97316` | Luz oblíqua de fim de tarde industrial (`35°`), IBL nublado metálico + reflexo âmbar de fornalha ao longe. | Lajes de concreto com juntas de dilatação, manchas de óleo/ferrugem sutis; asfalto escuro + trilhos/faixas laranja. | Ruínas modulares reais (pilares de concreto, vigas I, containers/silos, barricadas jersey — instanced), sem "bolotas". |
| **`forest`** | `4-1` | `sky:#101f17` `fog:#15271e` `sun:#fef3c7` `rim:#4ade80` | Luz solar filtrada morna (`44°`), IBL copa verde + céu claro, sombras frias esverdeadas. | Gramado tático/terra batida com musgo e trilhas de lama nas bermas; estrada de cascalho/terra compactada bem legível. | Rochas musgosas, pinheiros/árvores em camadas com vento GPU suave, cercas/estacas militares. |
| **`canyon`** | `4-2` | `sky:#1a120e` `fog:#221712` `sun:#fdba74` `rim:#f97316` | Luz crepuscular quente (`30°`) criando sombras longas e dramáticas; IBL terracota + céu âmbar-escuro. | Solo arenito avermelhado com estratos e cascalho; pontes/estradas de aço-asfalto com contraste alto. | Paredões/rochas em degraus de terracota, estruturas de ponte/desfiladeiro marcando **`14 restrictedCells`** com faixas de segurança. |
| **`swamp`** | `4-4` | `sky:#0d1512` `fog:#14201b` `sun:#d9f99d` `rim:#a3e635` | Luz difusa úmida (`36°`), `FogExp2(0.0046)`, IBL esverdeado nebuloso de baixa saturação. | Lama úmida com variação de `roughness` (poças refletivas vs barro fosco); estrada de concreto rachado/passarela elevada. | Árvores retorcidas/ruínas submersas, **`26 fogCells`** em camadas translúcidas animadas, **`8 toxicCells`** com borda corroída e brilho ácido contido. |
| **`volcanic`** | `4-5` | `sky:#190b08` `fog:#240f0b` `sun:#fca5a5` `rim:#ef4444` | Luz dramática avermelhada (`32°`), IBL cinza-basalto + glow inferior de magma (`groundColor` quente). | Basalto escuro poroso com cinza vulcânica (`L* 22–32%` para manter contraste com inimigos); estrada reforçada com borda metálica clara. | Espiras basálticas prismáticas, **`10 lavaCells`** com crosta negra fraturada + shader de magma emissivo animado (fluxo lento ≤ 1 Hz). |

---

## 6. Plano Técnico por Item (Fases 1 a 6) & APIs Three.js r187 Verificadas

### 6.1 Matriz de Arquitetura Técnica por Sistema

| # | Sistema | Fase | Técnica Proposta | Custo Estimado | Risco Principal | Alternativa / Fallback | APIs r187 Verificadas |
|---|---|:---:|---|---|---|---|---|
| 1 | **Visual Gallery (`?gallery=1`) + Overlay de Métricas (`?perf=1`) + Captura Determinística** | F1 | Ferramentas **estritamente dev-only** condicionadas a `import.meta.env.DEV` + `import()` dinâmico (zero vazamento no bundle de produção — verificado fora de `dist/` via `grep`). Gallery (`?gallery=1`) monta palco isolado com todas as 23 torres (`nv1/2-3/4+/5A/6B/ghost`), turntable, troca de bioma/IBL, câmeras fixas (C1..C5), grayscale/wireframe; Overlay (`?perf=1`) exibe `renderer.info` (com `autoReset=false` somando Scene + Composer + p50/p95 + programs). | `0 B` no bundle de produção (`dist/`); `0` custo no gameplay normal. | Divergir da iluminação real do `Battlefield3D` ou vazar código dev para `dist/`. Mitigação: reutilizar o MESMO pipeline de luz/IBL/composer da produção + verificação automática por `grep` em `dist/`. | Comandos via `window.__DEFCON_DEV__` ainda sob `import.meta.env.DEV`. | `WebGLRenderer.info`, `OutputPass` |
| 2 | **Presets `GraphicsQuality` (Low / Medium / High / Ultra) + Auto-detecção** | F1 | Módulo `src/three/GraphicsQuality.ts` persistido em `localStorage` na chave **`defcon.graphicsQuality`** (**sem tocar no `SaveManager`**). Inclui detecção automática de hardware/viewport, **amostragem inicial de frame time com rebaixamento automático** se sustentar queda, e override via `?quality=low\|medium\|high\|ultra`. **Proposta de UI de qualidade no HUD fica fora do escopo até a Fase 5.** | Reduz frame time mobile de `50,3 ms` para `≤ 25 ms` (meta `Low`: `≤ 16,6 ms`). | Mudança de preset em runtime vazar render targets antigos ou rebaixamento precoce durante spike de boot. Mitigação: `dispose()` explícito de composer/RTs e janela de amostragem após estabilização inicial. | Override manual via query string `?quality=` + `localStorage['defcon.graphicsQuality']`. | `WebGLRenderer.setPixelRatio`, `EffectComposer.reset` |
| 3 | **Anti-Aliasing: MSAA vs `SMAAPass`** | F1 | **Primário (High/Ultra e Medium em WebGL2):** passar `new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4, storeMultisampledColorBuffer: false })` como 2º arg do `EffectComposer` (`samples: 2` no Medium). **Low:** render direto sem `EffectComposer` usando MSAA nativo do canvas (`antialias: true`). **Fallback:** `new SMAAPass()` (0 args!) se `renderer.capabilities.maxSamples < 2` ou erro de driver. | MSAA 4× em `1080×663` c/ `storeMultisampledColorBuffer: false`: `~0,8–1,8 ms`, `0` draw calls extras; `SMAAPass`: `~1,5–2,2 ms` + 3 passes + 2 RTs `HalfFloat`. | `SMAAPass` em r187 opera em linear-sRGB e **precisa vir ANTES de `OutputPass`**; `samples > maxSamples` falha se não clampado. | `SMAAPass()` antes de `OutputPass` (se MSAA falhar em algum driver ANGLE/WebGL2). | `WebGLRenderTarget` (`RenderTarget.js:37-41`), `EffectComposer.js:69`, `SMAAPass.js:14-15,25-82` |
| 4 | **Tone Mapping (`ACESFilmic` vs `AgX` vs `Neutral`)** | F1 | Migrar padrão para **`THREE.AgXToneMapping`** (`exposure ~0.95–1.02`, calibrado por bioma). `AgX` dessatura suavemente highlights extremos sem deslocar matiz (evita amarelamento do laranja/vermelho em fogo/lava e mantém legibilidade no ártico). Gallery permitirá toggle A/B entre `AgX`, `ACESFilmic` e `Neutral` para validação no GATE G1. | **0 ms** (custo equivalente ao ACES no `OutputPass`). | Alterar resposta de cor em todos os biomas simultaneamente. Mitigação: calibrar albedo + `sunLight.intensity` + `exposure` em conjunto por bioma. | `NeutralToneMapping` (fidelidade máxima de cores PBR) ou `ACESFilmicToneMapping` com exposure reduzida. | `AgXToneMapping` (`constants.js:473`, `OutputPass.js:8,110`), `NeutralToneMapping` (`constants.js:483`, `OutputPass.js:10,111`) |
| 5 | **IBL Externo Procedural por Bioma (`PMREMGenerator`) + Cúpula Atmosférica** | F1 | Substituir `RoomEnvironment` por gerador procedural de ambiente externo `createBiomeEnvironment(renderer, biome)` (mini-cena com cúpula gradiente céu/horizonte/chão + disco solar suave + bounce do bioma) compilada via `PMREMGenerator.fromScene(envScene, 0.03)`. Guardar referência do `WebGLCubeRenderTarget` e chamar `oldEnvRT.dispose()` + `envScene` dispose a cada troca de bioma. Adicionar `HemisphereLight` como propriedade atualizada por bioma e skydome de horizonte suave ao redor da mesa tática. | Build do PMREM na troca de fase: `~4–8 ms` (cacheável por bioma se desejado: 7 biomas = `~6 MiB` ou 1 ativo = `~0,9 MiB`); `0 ms`/frame em runtime. | **Vazamento de VRAM na r187:** `pmrem.dispose()` NÃO descarta o `WebGLCubeRenderTarget` retornado (`PMREMGenerator.js:211-226`)! Exige `.dispose()` explícito. | Cache de 1 PMREM ativo destruído na troca de bioma; em `Low`, reduzir resolução/usar apenas `HemisphereLight` + sun/rim. | `PMREMGenerator.js:92-149,199-226,472-480` |
| 6 | **Sombras (`PCFShadowMap`) + Oclusão Ambiental (Baked + `GTAOPass` Ultra)** | F1 | Manter `THREE.PCFShadowMap` (r187 nativo, **nunca `PCFSoftShadowMap`**). Calibrar `sunLight` por bioma (posição/elevação + intensidade realista: ex. `1.85` no `arctic`, `2.2` no `desert`), ajustar frustum justo ao tabuleiro `[-62,62]×[-42,42]`, `mapSize` por preset (`1024`/`1536`/`2048`). Adicionar **contact shadow decal** (quad radial suave `y=0.025`, `depthWrite=false`, `noShadow=true`) sob todas as torres/props + `aoMap` procedural nas bases/terreno (todos presets). No preset **`Ultra`**, adicionar `GTAOPass` (half-res + PD denoiser). | Contact decal (instanced ou merged): `< 0,2 ms`, `1` draw call; `GTAOPass` (Ultra only): `~3–6 ms` (re-renderiza depth/normal). | `GTAOPass` é pesado em Intel UHD 630 e `GTAOPass.d.ts` omite 6º/7º args no construtor (usar `updateGtaoMaterial()`/`updatePdMaterial()`). | Manter `GTAOPass` estritamente em `Ultra` (desligado por padrão em `High`/`Medium`/`Low`); depender de contact shadow + AO procedural baked. | `PCFShadowMap` (`constants.js:65`, `WebGLShadowMap.js:89`), `GTAOPass.js:43,56,506-525` (`GTAOPass.d.ts:15,49-91`) |
| 7 | **Bloom HDR Seletivo (`UnrealBloomPass`)** | F1 | Elevar `threshold` de `0.82` → **`1.12–1.20`**, reduzir `strength` de `0.45` → **`0.24–0.32`**, `radius: 0.35–0.45`. Apenas materiais com `emissiveIntensity > 1.2` (com `toneMapped: false` apenas onde necessário ou cor linear > `1.15`) ativam bloom; superfícies difusas (neve, areia, concreto) ficam sempre `< 0.95` linear → **0% vazamento de bloom no chão**. Desligado no `Low`. | Já pago no baseline (`~1,2–2,0 ms`); `0` aumento em High/Medium, economia de `~2 ms` no Low. | Emissivos existentes (muzzle flash, Tesla, Laser, projéteis) ficarem fracos após subir threshold. Mitigação: subir `emissiveIntensity` seletivamente nesses materiais (respeitando ≤5% de área). | Manter `threshold = 1.05` + `strength = 0.25` caso algum VFX perca brilho excessivamente. | `UnrealBloomPass.js:36,46,105-120` |
| 8 | **Geometria Biselada + `mergeGeometries` + Trim Sheet/Vertex Color + Ghost `EdgesGeometry`** | F2–F3 | Criar biblioteca `src/three/MilitaryGeometryKit.ts` com primitivas chanfradas (`RoundedBoxGeometry`, perfis `ExtrudeGeometry` com `bevelEnabled: true`, canos `LatheGeometry` com freio de boca e collars). Agrupar geometrias estáticas por **subconjunto de animação** (`staticBase`, `turretStatic`, `barrelStatic`, `gatlingStatic`) usando **`BufferGeometryUtils.mergeGeometries`** (normalizando tudo para non-indexed + mesmos atributos `position/normal/uv/color`). **Decisão de material:** **1 mesh mesclado por material compartilhado dentro de cada pivot** (tinta chassi, aço escuro, emissivo, areia/concreto) — reduz `~51,5` calls/torre para **`3–6` calls/torre (main)** mantendo PBR completo sem atlas complexo; usar vertex color para AO de cavidade/base nas peças mescladas! No `createGhostTower3D`, trocar `wireframe: true` por material holográfico translúcido + **`EdgesGeometry(geo, 24)`** (mesclando arestas em 1 `LineSegments` por torre). | **Redução de ~80% nos draw calls por torre** (`501 → ~120` calls em 1-1 com 4 torres; estresse 40 torres `< 480` calls!); +30–60% tris por chanfros (ainda muito abaixo do teto de GPU). | `mergeGeometries` retorna `null` se misturar indexed/non-indexed ou atributos diferentes (`BufferGeometryUtils.js:181-214`). Mitigação: função helper `normalizeForMerge(geo)` + teste unitário automatizado validando todas as 23 torres! | Trim sheet único `1024×1024` (reduziria para 1–2 calls/torre, mas exige UV authoring manual muito mais frágil em geometria procedural; só usar para decalques/props). | `RoundedBoxGeometry.js:54,65`, `BufferGeometryUtils.js:156-240`, `EdgesGeometry.js:26,35` |
| 9 | **Pipeline PBR Procedural (`normalMap` Sobel + `aoMap` + `metalnessMap` + `onBeforeCompile` desgaste + Atlas Decalques)** | F2–F3 | Evoluir `ProceduralPBRTextures.ts` para gerar `normalMap` (filtro Sobel 3×3 sobre o heightmap existente, espaço linear!), `roughnessMap`, `metalnessMap` (separa tinta dielétrica de rebites/riscos metálicos) e `aoMap` em `512×512` (mantendo PRNG determinístico). Injetar shader leve via **`Material.onBeforeCompile`** com **`customProgramCacheKey()` determinístico** nos materiais de torre para: (a) gradiente de sujeira/poeira próximo ao chão (`worldPos.y < 0.7`), (b) realce sutil de desgaste metálico em arestas/topo, (c) micro-variação por instância. Criar 1 atlas de decalques militares `512×512` (chevron, faixas hazard, grades de ventilação, insígnias 5A/6B). | VRAM PBR: `~42–48 MiB` (substitui `bumpMap` por `normalMap`, compartilha `Texture.source` via `.clone()`, compacta `ao/rough/metal` em canais R/G/B de 1 única textura ORM quando possível — economizando 66% de VRAM!). GPU: `< 0,3 ms`. | Sem `customProgramCacheKey()` correto ocorre colisão de shader ou explosão de programas WebGL (`programs` > 60). Mitigação: máximo de 3–4 chaves de shader globais; monitorar `renderer.info.programs.length` na Gallery. | Manter mapas ORM padrão sem `onBeforeCompile` no preset `Low` (e aplicar AO/sujeira apenas via vertex colors). | `Material.js:533,544-548`, `WebGLPrograms.js:395,445` |
| 10 | **Terreno Macro + Detail Splatting + Micro-relevo + Proxy `groundPlane` Raycast** | F2 & F4 | Substituir os 3 canvases `2240×1280` (`43,75 MiB`, freeze `400 ms`) por: **(a) Splatmap RGBA `512×292`** gerado em `< 15 ms` (R=estrada, G=acostamento/cascalho, B=variação orgânica FBM sem "bolotas", A=AO de bordas/rochas/estradas); **(b) Texturas detail tileable `512×512` (`64 px/u`, repetidas `14×8`)** com `map` + `normalMap` + `ORM` por bioma (solo A, solo B, asfalto/estrada) misturadas em fragment shader via `onBeforeCompile` (com anti-tiling hash/rotação leve); **(c) Malha subdividida** (`56×32` segs) com micro-relevo fora das células `FREE`/`ROAD` (altura `y=0` estrito nas células construíveis e estradas para zero flutuação de torres/unidades!); **(d) Manter `groundPlane` (`PlaneGeometry(112,64)`) plano e invisível (`visible = false`) na cena** como proxy exato de raycast (`Battlefield3D.ts:1024`). | **VRAM terreno cai de `43,75 MiB` → `~10–12 MiB` (-73%!)**; **troca de fase cai de `~400 ms` → `< 90 ms` (-78%!)**; nitidez sobe de `20 px/u` → **`64 px/u` (+3,2×)**. | Splatting shader aumentar custo de fragmento em mobile. Mitigação: máximo 3 texture fetches de albedo + 2 de normal no fragmento (High/Medium) e 2 fetches sem normal detail no Low. Confirmado na r187 que `Raycaster` acerta `visible = false`! | Canvas reduzido `1024×585` + `detailMap` simples (fallback se algum dispositivo apresentar bug no `onBeforeCompile`). | `Raycaster.js:246`, `Mesh.js:252`, `Material.js:533,544-548` |
| 11 | **Props de Bioma em `InstancedMesh` + Vento GPU** | F2 & F4 | Converter 100% dos props repetidos (`TerrainDiorama3D.ts`: rochas, ruínas modulares, troncos/copas de árvores, arbustos, espiras vulcânicas, sacos de areia de curvas, tambores, caixas, postes) para `THREE.InstancedMesh` (1 draw call por tipo de prop, `instanceColor` para variação sutil de tom, seeds únicas por bioma!). Corrigir vazamento de geometria das ruínas industriais (`L771,778`). Aplicar deslocamento de vértice senoidal determinístico (`uTime`, fase por `instanceMatrix` world pos) nas copas/arbustos para brisa suave. Adicionar saia/colar de cascalho/AO sob cada rocha/ruína para enraizamento. | **Reduz draw calls do cenário vazio em `4-3` de `501` → `< 95` calls (-81%!)**; vento GPU custo `< 0,1 ms`. | `frustumCulled` em `InstancedMesh` usa bounding sphere da geometria base (pode sumir quando câmera dá zoom perto das bordas!). Mitigação: `mesh.frustumCulled = false` ou `computeBoundingSphere()` abrangendo o tabuleiro `112×64`. | Props estáticos mesclados por material (`mergeGeometries`) sem animação de vento no `Low`. | `InstancedMesh`, `BufferGeometryUtils.mergeGeometries` |
| 12 | **Superfícies Ambientais Especiais (`ice`, `lava`, `toxic`, `fog`, `restricted`)** | F4 | Substituir quads `MeshBasicMaterial` (`TerrainDiorama3D.ts:855-883`) por: **`iceCells`**: placa biselada com `MeshPhysicalMaterial` (ou `Standard` c/ baixa roughness `0.15` + normal de trincas + cor azul-gelo controlada sem bloom); **`lavaCells`**: borda de rocha basáltica em relevo + shader de magma com crosta escura fraturada e fluxo lento emissivo (`≤ 0.8 Hz`); **`toxicCells`**: bacia rasa + líquido viscoso animado com anéis/bolhas suaves + marcas de aviso; **`fogCells`**: 2 camadas de neblina translúcida suave com drift lento (`depthWrite: false`); **`restrictedCells`**: deck metálico/cais/ponte com faixas diagonais de segurança (acessível a daltônicos). | `1` `InstancedMesh` por tipo de célula especial (`+1` a `+3` draw calls total no mapa); `< 0,4 ms`. | `MeshPhysicalMaterial` (`transmission`) custa um render pass extra completo! **PROIBIDO usar `transmission`** — usar especular + Fresnel falso no `MeshStandardMaterial` ou `onBeforeCompile`. | Versão sem animação de shader (textura estática de alta qualidade) no preset `Low`. | `MeshStandardMaterial`, `InstancedMesh`, `Material.onBeforeCompile` |
| 13 | **Estruturas Herói (Spawns, FOB HQ, Plinto C4ISR) + Mobile Portrait & QA** | F4–F6 | Redesenhar **Spawn Helipads** (plataforma de concreto chanfrada, marcas H/ALPHA/BRAVO/CHARLIE, barreiras, beacons pulsantes ≤ 1.2 Hz, postes táticos) e **FOB HQ** (bunker de comando multi-nível com radar giratório, antenas, sacos/Hesco perimetrais, iluminação tática **contida dentro do tabuleiro** — removendo o cone que vaza à direita!). Enriquecer o plinto C4ISR com chanfros metálicos e moldura discreta. Em Mobile Portrait (`390×844`), calibrar distância/FOV/enquadramento em `Battlefield3D.ts:732-757` para mostrar 100% do tabuleiro de Spawn a FOB sem corte lateral. | `~6–10` draw calls para FOB + Spawns (mesclados por material); impacto `< 0,3 ms`. | Alterar colisão/posição visual da FOB ou spawns desalinhando waypoints. Mitigação: preservar exatamente `cellToWorldCenter(col, row)` e footprints de 1 célula. | Manter proporção compacta da FOB caso alguma fase tenha torre construível imediatamente adjacente. | `EdgesGeometry`, `BufferGeometryUtils.mergeGeometries` |

### 6.2 Referência Rápida de APIs Three.js r187 Verificadas (`0.187.0`)

Todas as APIs abaixo foram auditadas diretamente em `node_modules/three` e `node_modules/@types/three`:

| API Three.js r187 | Implementação (`node_modules/three/...`) | Tipagem (`node_modules/@types/three/...`) | Armadilha / Regra Obrigatória na r187 |
|---|---|---|---|
| `PCFShadowMap` | `src/constants.js:65`; `src/renderers/webgl/WebGLShadowMap.js:89,261-266` | `src/constants.d.ts:29` | Padrão r187 já macio; hardware depth compare. |
| `PCFSoftShadowMap` | `src/constants.js:73-75`; `WebGLShadowMap.js:99-104` | `src/constants.d.ts:31-33` | **DEPRECIADO/REMOVIDO:** gera `console.warn` e cai em `PCFShadowMap`. **Não usar.** |
| `VSMShadowMap` | `src/constants.js:79-84`; `WebGLShadowMap.js:218-243,528` | `src/constants.d.ts:34` | Todos receivers viram casters (`L528`); sem suporte a `PointLight`; risco de light-bleeding. Não adotar. |
| `AgXToneMapping` / `NeutralToneMapping` / `ACESFilmicToneMapping` | `src/constants.js:455,473,483`; `examples/jsm/postprocessing/OutputPass.js:8-10,109-111` | `src/constants.d.ts:145-157` | Todos suportados nativamente pelo `OutputPass`, que recompila defines em troca dinâmica (`L97-116`). |
| `WebGLRenderTarget` (`samples`) | `src/renderers/WebGLRenderTarget.js:8-30`; `src/core/RenderTarget.js:37-41,226`; `EffectComposer.js:69` | `src/core/RenderTarget.d.ts:20,122` | `EffectComposer` sem 2º arg usa `samples = 0`. Usar `{ type: HalfFloatType, samples: 4, storeMultisampledColorBuffer: false }`. |
| `SMAAPass` | `examples/jsm/postprocessing/SMAAPass.js:14-15,25-82` | `examples/jsm/postprocessing/SMAAPass.d.ts:3-4` | **BREAKING r187:** `new SMAAPass()` recebe **0 argumentos**. Opera em linear-sRGB → **inserir ANTES de `OutputPass`**. |
| `GTAOPass` | `examples/jsm/postprocessing/GTAOPass.js:43,56,143-162,506-525` | `examples/jsm/postprocessing/GTAOPass.d.ts:15,49-91` | `.d.ts` omite 6º/7º args → configurar via `updateGtaoMaterial()` / `updatePdMaterial()`. Usar só em `Ultra`. |
| `UnrealBloomPass` | `examples/jsm/postprocessing/UnrealBloomPass.js:36,46,105-120` | `examples/jsm/postprocessing/UnrealBloomPass.d.ts:5,25` | 1 bright pass + 5 pares H/V `HalfFloatType`. |
| `OutputPass` | `examples/jsm/postprocessing/OutputPass.js:33,38,90-133` | `examples/jsm/postprocessing/OutputPass.d.ts:5,11` | Último pass obrigatório do `EffectComposer` para tone mapping + saída sRGB. |
| `RoundedBoxGeometry` | `examples/jsm/geometries/RoundedBoxGeometry.js:54,65` | `examples/jsm/geometries/RoundedBoxGeometry.d.ts:3-4` | `(w=1, h=1, d=1, segments=2, radius=0.1)`. |
| `mergeGeometries` | `examples/jsm/utils/BufferGeometryUtils.js:156-240` | `examples/jsm/utils/BufferGeometryUtils.d.ts:15` | Retorna `null` se houver mismatch de indexação (`L181-185`) ou atributos (`L190-214`). Normalizar tudo antes. |
| `PMREMGenerator` | `src/extras/PMREMGenerator.js:92-149,199-226,472-480` | `src/extras/PMREMGenerator.d.ts:37-95` | r187 retorna `WebGLCubeRenderTarget`; `pmrem.dispose()` **não** libera o RT (`L211-212`). Fazer `envRT.dispose()` manual. |
| `Raycaster` com `visible=false` | `src/core/Raycaster.js:200-266` (`L246`); `src/objects/Mesh.js:246-290` (`L252`) | `src/core/Raycaster.d.ts:185-211` | **Confirmado:** ignora `object.visible` (só checa `layers` e `material !== undefined`). Seguro p/ proxy invisível na cena. |
| `onBeforeCompile` + `customProgramCacheKey` | `src/materials/Material.js:533,544-548`; `src/renderers/webgl/WebGLPrograms.js:395,445` | `src/materials/Material.d.ts:605,615` | Default retorna `onBeforeCompile.toString()`; sobrescrever com chave determinística curta. |
| `EdgesGeometry` | `src/geometries/EdgesGeometry.js:26,35` | `src/geometries/EdgesGeometry.d.ts:18,24` | `(geo, thresholdAngle=1)`. Ideal para contorno limpo de ghost (`thresholdAngle: 22–30`). |

---

## 7. Metas de Performance Calibradas (`[CALIBRAR]`)

Calibradas a partir do baseline real medido em **Intel UHD Graphics 630** (`1440×900` dpr 1 e Mobile Portrait `390×844` dpr 2→1.5), mantendo todos os números sob etiqueta **`[CALIBRAR]`** até aprovação no **GATE G0**.

**Cenário padrão de estresse (Seção 7.2):** **40 torres mistas em tier máximo** nas fases **`4-5` (Complexo Vulcânico)** e **`1-1` (Desfiladeiro de Basra)**, avaliadas em **`1920×1080` (landscape)** e **`1080×1920` (portrait)** (além do comparativo direto no baseline `1440×900` e `390×844`).

### 7.1 Orçamento por Preset `GraphicsQuality` — `[CALIBRAR]` (Estresse: 40 Torres Mistas Tier Máximo em `4-5` e `1-1`)

| Métrica (`[CALIBRAR]`) | Baseline Real (`1-1` 4T / `4-3` 0T) | `Low` (Mobile/iGPU Fraca) | `Medium` (Mobile Default / Laptop) | `High` (Desktop Default) | `Ultra` (GPU Dedicada) |
|---|---|---|---|---|---|
| **DPR Cap** | `1.5` (fixo) | `1.0` | `1.25` | `1.5` | `2.0` (ou `1.75` >1440p) |
| **Pipeline Pós-Proc.** | Composer (MSAA 0 + Bloom 0.82) | **Render Direto** (sem Composer!) | Composer + MSAA `2×` + Bloom HDR | Composer + MSAA `4×` + Bloom HDR | Composer + MSAA `4×` + `GTAOPass` + Bloom HDR |
| **Anti-Aliasing** | **0% efetivo** | MSAA nativo canvas | WebGL2 RT `samples: 2` (fallback SMAA) | WebGL2 RT `samples: 4` (fallback SMAA) | WebGL2 RT `samples: 4` |
| **Shadow Map (`PCF`)** | `2048×2048` | `1024×1024` | `1536×1536` | `2048×2048` | `2048×2048` (ou `4096`) |
| **AO** | Nenhum | Contact Decal | Contact Decal + AO Vertex/Baked | Contact Decal + AO Baked/Shader | + `GTAOPass` (half-res PD) |
| **Scene Draw Calls (40T estresse)** | `501` c/ só 4T (~`2.300` em 40T!) | **≤ 320** | **≤ 400** | **≤ 480** | **≤ 540** |
| **Triângulos (40T estresse)** | `18k` (4T) | **≤ 90.000** | **≤ 150.000** | **≤ 220.000** | **≤ 320.000** |
| **WebGL Programs** | `33–37` | **≤ 35** | **≤ 45** | **≤ 50** | **≤ 58** |
| **Frame Time p50 / p95 (`1920×1080`)** | `16.8 / 33.8 ms` (`1440×900`) | `≤ 12 / 16.6 ms` | `≤ 16.6 / 20 ms` | `≤ 16.6 / 20 ms` | `≤ 16.6 / 22 ms` *(GPU ded.)* |
| **Frame Time p50 / p95 (`1080×1920` / `390×844` Mobile)** | **`50.3 / 67.1 ms` (~20 FPS)** | **`≤ 16.6 / 22 ms` (≥45–60 FPS)** | **`≤ 25 / 33.3 ms` (≥30–40 FPS)** | N/A (Desktop) | N/A (Desktop) |
| **VRAM Texturas Procedurais** | **`~80,5 MiB`** (`43,75` terreno) | **≤ 38 MiB** | **≤ 52 MiB** | **≤ 68 MiB** | **≤ 92 MiB** |

### 7.2 Metas por Torre & Regras Relativas (Invariantes — `[CALIBRAR]`)
- **Orçamento por Torre (pós-`mergeGeometries`):**
  - Draw calls no main pass: **`3–6` calls/torre** (`6–12` incluindo shadow pass) vs `~51,5` calls/torre no baseline (**economia de ~80%**). `hesco`: `≤ 2` calls.
  - Triângulos por torre: **`1.200–3.500` tris** (`nv1` → `nv6`; `hesco ≤ 600` tris).
  - Ghost preview: **`≤ 2` calls** (1 mesh translúcido + 1 `LineSegments` via `EdgesGeometry`), reduzindo draw calls do hover em >90%.
- **Regras Relativas ao Baseline Medido (Gates obrigatórios):**
  - **Boot time** (`baseline: 5.007 ms`): limite rígido `+20%` (**≤ 6.000 ms**); meta de engenharia: manter `≤ 4.800 ms` otimizando prewarm.
  - **Troca de fase** (`baseline: 341–444 ms`): limite rígido `+25%` (`≤ 555 ms`); meta real com splatting: **`≤ 120 ms`** (ganho >3×).
  - **Stall ao construir/fazer upgrade de torre:** **`≤ 50 ms`** (sem recompilação de shader no meio da partida).
  - **Alocações no render loop:** **`0` alocações/frame** (nenhum `new Vector3/Matrix4/Color/Texture/Geometry` em `update()`/`render()`).
  - **Teste de vazamento nas 20 fases em sequência (`1-1` → `4-5`):** após percorrer **todas as 20 fases consecutivamente**, `renderer.info.memory.geometries` e `.textures` devem retornar ao **baseline ±2%** e `renderer.info.programs.length` deve estabilizar sem crescimento contínuo (verificado via script Playwright).

---

## 8. Registro de Riscos & `[ASSUMPTION]`s

### 8.1 Riscos Técnicos & Mitigações

| ID | Severidade | Risco | Mitigação Planejada |
|---|:---:|---|---|
| **R1** | Alta | **Working tree pré-existente sujo (`src/three/Effects3D.ts`)**: alterações de `scratchVec`/`getPoolStats()` já existem localmente fora do overhaul. | Nunca editar nem reverter `Effects3D.ts` sem ordem expressa; usar `git diff` seletivo em cada fase. |
| **R2** | Alta | **Armadilhas Three.js r187** (`PCFSoftShadowMap` removido, `SMAAPass()` 0 args antes de `OutputPass`, `PMREMGenerator` não libera `WebGLCubeRenderTarget`, `mergeGeometries` retorna `null` em mismatch de atributos). | Checklist r187 em toda PR/Fase; helper `normalizeForMerge()` + teste automatizado para 23 torres × 6 estados; `dispose()` obrigatório de `envRT` em troca de fase. |
| **R3** | Alta | **Degradação em Mobile (`390×844` já está em ~20 FPS)** se adicionarmos shaders/MSAA pesados sem downgrade adaptativo. | Preset `Low`/`Medium` automático em mobile (sem `EffectComposer` no `Low`, `samples: 2` + `DPR ≤ 1.25` no `Medium`) + economia de `~80%` nos draw calls via `mergeGeometries` e `InstancedMesh`. |
| **R4** | Média | **Explosão de tempo de boot no `prewarmAllMilitaryModels`** ao adicionar `onBeforeCompile` e mais vértices nos 133 rigs de torres. | Manter ≤ 4 chaves `customProgramCacheKey` globais; aquecer materiais/programas sem instanciar cópias redundantes de geometrias já cacheadas em `getGeo()`. |
| **R5** | Média | **Raycast quebrar com terreno 3D subdividido ou proxy `visible = false`.** | Verificado em `Raycaster.js:246` e `Mesh.js:252`: `visible = false` continua intersectando desde que o proxy permaneça na cena com `material !== undefined`; manter células `FREE`/`ROAD` estritamente em `y = 0` e cobrir com teste Playwright de clique/construção. |
| **R6** | Média | **Clipping de `ownerRingMesh` (`y=0.06`) e `radarPivots` congelados em `patriot`/`javelin`/`minefield`.** | Incluir fix cirúrgico na Fase 2/3 (subir `ownerRingMesh` para envolver a borda da base `r = 1.82–1.94, y = 0.08` ou acima da laje, e estender loop de `radarPivots` para todas as torres que declarem o campo). |
| **R7** | Média | **VRAM em dispositivos mobile** (terreno atual sozinho consome `43,75 MiB`). | Substituição pelos mapas detail `512×512` + splatmap `512×292` reduz VRAM de terreno para `~10–12 MiB` e empacotamento ORM (R=AO, G=Roughness, B=Metalness) economiza 2/3 das texturas de dados. |
| **R8** | Baixa | **Inconsistência de `frustumCulled` em `InstancedMesh`** ao dar zoom próximo das bordas do mapa. | Definir bounding sphere cobrindo todo o tabuleiro ou `frustumCulled = false` nos `InstancedMesh` de props. |

### 8.2 `[ASSUMPTION]`s Explícitos
- **`[ASSUMPTION-1]` Escopo 3D vs HUD 2D:** O overhaul foca no pipeline 3D (`src/three/*`). O HUD C4ISR permanece intacto nas Fases 1–4 (`GraphicsQuality` usa apenas `localStorage['defcon.graphicsQuality']`, auto-detecção + amostragem inicial e `?quality=`); qualquer proposta de UI de qualidade no HUD ou ajuste pontual de CSS mobile fica reservada à **Fase 5** (mediante aprovação no G0).
- **`[ASSUMPTION-2]` Inimigos 3D:** As 38 unidades inimigas não entram em remodelagem completa neste ciclo, mas herdam automaticamente o novo lighting/IBL/MSAA/AgX e a calibração de `metalness` dos materiais compartilhados (`rusCamo`, `rusDark`, `blackShark`), sendo auditadas quanto ao contraste ≥ 3:1 em grayscale contra os 7 biomas.
- **`[ASSUMPTION-3]` Zero Assets Externos Pesados (100% Procedural Offline-First):** Para preservar o PWA leve (`public/sw.js` + Vite bundle autocontido) e 100% de determinismo, toda geometria e textura continuará procedural em código TypeScript (sem baixar `.glb`/`.hdr` de vários MBs).
- **`[ASSUMPTION-4]` Compatibilidade com Testes Existentes:** Os 15 testes em `tests/*.test.mjs` (`balance`, `expansion`, `multiplayer`) e os contratos de `TowerRig3D` / `DioramaHandles` / `EventBus` permanecem 100% verdes em todas as fases.

---

## 9. Proposta do Vertical Slice (Fase 2)

### 9.1 Auditoria de Cobertura de `TowerRig3D` nas 3 Torres Iniciais

Verificação direta em `src/three/MilitaryModels3D.ts:572-584` e `src/three/Battlefield3D.ts`:

| Campo `TowerRig3D` | `howitzer` (`L1300`) | `patriot` (`L1474`) | `tesla_tower` (`L2025`) | Uso em Runtime (`Battlefield3D.ts`) | Status no Slice `{howitzer, patriot, tesla_tower}` |
|---|:---:|:---:|:---:|---|---|
| `root` | ✔ | ✔ | ✔ | ✔ Posição/cena | Coberto |
| `turretPivot` | ✔ (nv1-3) | ✔ (nv1-3) | ✔ (nv1-3) | ✔ Rotação Y (`L5470,4022`) | Coberto |
| `barrelPivot` | ✔ (nv1-3) | ✖ | ✖ | ✔ Recuo Z (`L4232-4236`) | Coberto |
| `missileCaps` | ✔ (vLv3) | ✔ (4/8/12) | ✖ | ✔ Recarga/visibilidade (`L5443-5446`) | Coberto |
| `muzzlePoint` | ✔ | ✔ | ✔ | ✔ Origem de projétil (`L5475,5630`) | Coberto |
| `muzzleFlashMesh` | ✔ | ✔ | ✔ | ✔ Flash (`L4222-4229`) | Coberto |
| `radarPivots` | ✖ | ⚠️ só vLv3 *(parado!)* | ✖ | ✔ Só gira em suportes (`L4015-4020`) | **PARCIAL** (não valida rotação real!) |
| `aesaPanel` | ✖ | ✔ (vLv2-3) | ✖ | ✖ 0 leituras | Coberto (passivo) |
| **`gatlingPivot`** | **✖** | **✖** | **✖** | ✔ **Ativo (`L5461-5463`, spin `dt*28`)** | **NÃO COBERTO** (`phalanx`, `m2_bunker` vLv3) |
| **`ewRings`** | **✖** | **✖** | **✖** | ✔ **Ativo (`L4024-4029`, pulso + `noShadow`)** | **NÃO COBERTO** (`ew_crew`, `iron_dome`, `cryo_tower`, `eng_workshop`) |
| `laserBeam` | ✖ | ✖ | ✖ | ✖ Campo morto (0 builders, 0 leituras) | N/A (morto) |

### 9.2 Proposta Ajustada para a Fase 2 (Mapa `1-1` Deserto + Slice de Torres)
O conjunto inicial `{howitzer, patriot, tesla_tower}` deixa **2 contratos ativos de animação descobertos** (`gatlingPivot` e `ewRings`) e não testa `radarPivots` efetivamente girando nem a categoria `support`. Além disso, `tesla_tower` hoje possui apenas `3` cilindros simples.

- **Opção A — Recomendada (5 Torres Cobrindo 100% dos Campos Ativos + Todas as 4 Categorias):**
  1. **`howitzer`** (`area`) — valida `barrelPivot` (recuo), `missileCaps` (vLv3), chassis multi-peça, sacos/estabilizadores e 5A Incendiária vs 6B Fragmentação.
  2. **`patriot`** (`elemental`/AA) — valida `missileCaps` (4/8/12), `aesaPanel`, canisters chanfrados, pintura CARC fosca e fix de `radarPivots`.
  3. **`tesla_tower`** (`elemental` experimental) — valida reestruturação de torre minimalista (3 cilindros → torre industrial com isoladores cerâmicos e bobinas de cobre) + orçamento emissivo ≤ 5% + bloom HDR controlado.
  4. **`phalanx`** (`elemental`/AA naval) — valida **`gatlingPivot`** (rotação contínua em Z) + pintura **`navalWhite`** dielétrica acetinada + cúpula biselada.
  5. **`ew_crew`** (`support`) — valida **`ewRings`** (pulso + `noShadow`), **`radarPivots`** (rotação ativa em runtime) e silhueta utilitária não-ofensiva.
- **Opção B — Alternativa Compacta (3 Torres Estritas com 100% dos Campos Ativos):**
  - Substituir por **`{howitzer, phalanx, iron_dome}`** — cobre 9/9 campos ativos de `TowerRig3D` (`iron_dome` exercita `radarPivots` ativo + `ewRings` ativo + `missileCaps` + emissivo ciano; `phalanx` exercita `gatlingPivot`; `howitzer` exercita `barrelPivot`).
- **Cenário do Vertical Slice:** Fase **`1-1` (Desfiladeiro de Basra — `desert`)** com novo terreno macro+detail splatting (`64 px/u`), proxy `groundPlane` (`visible = false`), rochas estratificadas + props em `InstancedMesh`, Spawn/FOB piloto e iluminação/IBL/MSAA/AgX da Fase 1.
- **Entregável do GATE G2:** Capturas comparativas lado a lado (`baseline` vs `slice`) em C1, C5 (`24u`), zoom 400% AA e Gallery dos 6 estados (`nv1`, `nv2-3`, `nv4+`, `5A`, `6B`, `ghost`), travando a **Art Bible** definitiva antes da produção em escala (Fases 3 e 4).

---

## 10. Matriz de Cobertura Completa & Scorecard (100 Pontos)

Legenda de status: `⬜` Pendente | `🔄` Em andamento | `✅` Aprovado em revisão | `N/A` Não aplicável.

### 10.1 Cobertura das 23 Torres (`src/data/towers.js` + `src/three/MilitaryModels3D.ts`)

| # | `defId` | Nome (`towers.js`) | Categoria | `nv1` | `nv2-3` | `nv4+` | `5A` | `6B` | `ghost` | Nota Revisor |
|---:|---|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| 01 | `ballista` | Balestra de Precisão | `precision` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 02 | `m2_bunker` | Metralhadora | `precision` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 03 | `abrams_pit` | Canhão Pesado | `area` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 04 | `howitzer` | Morteiro | `area` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | *(Slice F2)* |
| 05 | `sniper_tower` | Torre de Franco-atirador | `precision` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 06 | `cryo_tower` | Torre Criogênica | `elemental` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 07 | `tesla_tower` | Torre Tesla | `elemental` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | *(Slice F2)* |
| 08 | `toxic_tower` | Torre Tóxica | `elemental` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 09 | `flamethrower` | Lança-chamas | `elemental` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 10 | `helios_laser` | Emissor Laser | `elemental` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 11 | `railgun` | Canhão Railgun | `precision` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 12 | `patriot` | Lançador de Mísseis AA | `elemental` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | *(Slice F2)* |
| 13 | `phalanx` | Canhão Antiaéreo Flak | `elemental` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | *(Slice F2 Op. A/B)* |
| 14 | `harpoon_tower` | Torre de Arpões | `support` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 15 | `tos1_mlrs` | Bateria de Foguetes | `area` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 16 | `minefield` | Campo Minado | `area` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 17 | `ew_crew` | Radar Tático | `support` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | *(Slice F2 Op. A)* |
| 18 | `eng_workshop` | Oficina de Engenharia | `support` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 19 | `iron_dome` | Gerador de Escudos | `support` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | *(Slice F2 Op. B)* |
| 20 | `energy_extractor` | Extrator de Energia | `support` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 21 | `bushmaster` | M242 Bushmaster 25mm *(legada)* | `precision` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 22 | `javelin` | TOW / FGM-148 Javelin *(legada)* | `area` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 23 | `hesco` | Hesco Bastion *(legada)* | `support` | ⬜ | `N/A` | `N/A` | `N/A` | `N/A` | ⬜ | 1 nível (`isBarrier`) |

### 10.2 Cobertura dos 7 Biomas × 20 Fases (`src/data/worlds.js`)

| Fase | Título (`worlds.js`) | Bioma | Células Especiais | Baseline Capturado | Terreno + Splat | Props Instanced | Luz / IBL / Especiais | Revisão Final |
|---|---|---|---|:---:|:---:|:---:|:---:|:---:|
| `1-1` | Desfiladeiro de Basra | `desert` | — | ✅ (C1/C5/400%/Mob) | ⬜ | ⬜ | ⬜ | ⬜ |
| `1-2` | Refinaria Al-Faw | `desert` | — | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `1-3` | Vale do Eufrates | `desert` | 3 Spawns | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `1-4` | Cidadela de Palmira | `desert` | — | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `1-5` | Fortaleza Final: Bastião SCUD | `desert` | Boss Stage | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `2-1` | Estação Polar Murmansk | `arctic` | — *(0 iceCells)* | ✅ (C1 white-out) | ⬜ | ⬜ | ⬜ | ⬜ |
| `2-2` | Passo da Tundra Congelada | `arctic` | — | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `2-3` | Base Submarina Severodvinsk | `arctic` | 3 Spawns | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `2-4` | Geleira Novaya Zemlya | `arctic` | — | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `2-5` | Fortaleza Final: Bunker Kotin | `arctic` | Boss Stage | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `3-1` | Pátio Ferroviário Donbas | `industrial` | — | ✅ (C1) | ⬜ | ⬜ | ⬜ | ⬜ |
| `3-2` | Siderúrgica Azovstal | `industrial` | — | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `3-3` | Aeródromo Militar Engels | `industrial` | 3 Spawns | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `3-4` | Complexo Nuclear Kursk | `industrial` | — | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `3-5` | Fortaleza Final: Cidadela Kirov | `industrial` | Boss Stage, 3 Spawns | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `4-1` | Vale das Fronteiras | `forest` | — | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `4-2` | Desfiladeiro de Ferro | `canyon` | `14 restricted` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `4-3` | Porto Congelado | `arctic` | `22 ice`, `12 restricted` | ✅ (C1 white-out) | ⬜ | ⬜ | ⬜ | ⬜ |
| `4-4` | Pântano das Ruínas | `swamp` | `26 fog`, `8 toxic`, 3 Spawns | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `4-5` | Complexo Vulcânico | `volcanic` | `10 lava`, Boss, 3 Spawns | ✅ (C1) | ⬜ | ⬜ | ⬜ | ⬜ |

### 10.3 Scorecard de Referência (Seção 8.3 — 100 Pontos, Gates G1 a G6)

> **Critério de Aprovação AAA:** **≥ 90 / 100 pontos** e **nenhum critério individual abaixo de 80% do seu peso** (além de `0` defeitos P0 e 100% da matriz `✅`). As notas serão atribuídas exclusivamente pelo **revisor independente** a partir da Fase 1 (sem autoavaliação na Fase 0).

| Critério (Seção 8.3) | Peso | Piso Mínimo (80%) | O que é Avaliado | Baseline |
|---|---:|---:|---|---|
| **1. Silhueta e leitura em 1 s** | 15 pts | 12,0 pts | Distinção imediata de cada categoria/torre a `90–210u`, proporção clara e separação figura-fundo. | — *(avaliação pelo revisor independente na F1)* |
| **2. Forma (bisel, proporção, hierarquia 3 níveis)** | 10 pts | 8,0 pts | Chanfros/bevels captando especular, subconjuntos mecânicos coerentes e leitura Macro/Meso/Micro (`210u / 90u / 24u`). | — *(avaliação pelo revisor independente na F1)* |
| **3. Materiais PBR corretos e coerentes** | 10 pts | 8,0 pts | Dielétricos `metalness ≤ 0.05`, `normalMap` Sobel + ORM, desgaste/sujeira e densidade de texel ≤ `2×` (`64–128 px/u`). | — *(avaliação pelo revisor independente na F1)* |
| **4. Progressão de tier/especialização** | 10 pts | 8,0 pts | Evolução clara `nv1 → nv2-3 → nv4+ → 5A / 6B` + ghost limpo (`EdgesGeometry`) e `ownerRingMesh` sem clipping. | — *(avaliação pelo revisor independente na F1)* |
| **5. Luz, sombra e oclusão** | 10 pts | 8,0 pts | IBL externo por bioma, `AgX`, sombras `PCFShadowMap` sem acne/clipping, AO de contato ancorando bases e bloom 100% seletivo. | — *(avaliação pelo revisor independente na F1)* |
| **6. Terreno e composição do mapa** | 10 pts | 8,0 pts | Splatting + detail `64 px/u` (zero "bolotas"), micro-relevo natural, estradas/bermas nítidas, props enraizados e Spawn/FOB herói. | — *(avaliação pelo revisor independente na F1)* |
| **7. Identidade de bioma e atmosfera** | 10 pts | 8,0 pts | 7 biomas distintos preservando cores de `worlds.js`, zero white-out ártico, skydome/neblina coerentes e superfícies especiais convincentes. | — *(avaliação pelo revisor independente na F1)* |
| **8. Legibilidade tática** | 10 pts | 8,0 pts | Contraste inimigos vs terreno ≥ `3:1` em grayscale, células especiais inequívocas, acessibilidade daltônico-safe, emissivo ≤ 5%, zero strobe > 3 Hz. | — *(avaliação pelo revisor independente na F1)* |
| **9. Imagem limpa (AA, cintilação, z-fighting)** | 5 pts | 4,0 pts | MSAA/SMAA limpo no zoom 400%, zero z-fighting, zero shimmer de mipmap/aliasing em diagonais e linhas de rota. | — *(avaliação pelo revisor independente na F1)* |
| **10. Performance e estabilidade** | 10 pts | 8,0 pts | Metas da Seção 7 batidas (40T estresse `4-5`/`1-1`, `1920×1080` & `1080×1920`), 0 vazamentos nas 20 fases, 0 console errors, 15/15 testes verdes, `dist/` sem código dev. | — *(avaliação pelo revisor independente na F1)* |
| **TOTAL** | **100 pts** | **≥ 90,0 pts** | **AAA aprovado = ≥ 90/100 + nenhum critério < 80% + 0 P0** | — *(avaliação pelo revisor independente na F1)* |

---

## 11. Decisões, Pendências & Perguntas Abertas para o GATE G0

Antes de iniciar a **Fase 1**, precisamos da sua decisão objetiva nos **8 pontos** abaixo (as opções recomendadas estão marcadas):

1. **Composição do Vertical Slice da Fase 2 (cobertura de `TowerRig3D`):**
   - **(Recomendado — Opção A)** Expandir para **5 torres** (`howitzer`, `patriot`, `tesla_tower`, `phalanx`, `ew_crew`) + mapa `1-1` — cobre 100% dos campos ativos de `TowerRig3D` (incl. `gatlingPivot`, `ewRings` e `radarPivots` ativo) e todas as 4 categorias.
   - **Opção B:** Manter exatamente **3 torres** com 100% dos campos ativos trocando para `{howitzer, phalanx, iron_dome}`.
   - **Opção C:** Manter `{howitzer, patriot, tesla_tower}` e validar `gatlingPivot`/`ewRings` apenas na Fase 3.
2. **Diferenciação Geométrica nas Especializações `5A` vs `6B`:**
   - **(Recomendado)** Passar `specialization` aos builders de `MilitaryModels3D.ts` para que `5A` e `6B` tenham ao menos 1 módulo estrutural distinto na silhueta (além dos anéis de base refinados).
   - **Alternativa:** Manter mesma geometria de `nv4+` diferenciada apenas por decalques/acentos de cor e anéis.
3. **Inclusão dos 3 Bugs/Ajustes Descobertos na Auditoria:**
   - **(Recomendado)** Autorizar no escopo das Fases 1–5: (a) corrigir clipping do `ownerRingMesh` (`y=0.06`); (b) ativar rotação de `radarPivots` em `patriot`/`javelin`/`minefield`; (c) corrigir câmera em Mobile Portrait `390×844` para não cortar Spawns/FOB. *(Opcional na Fase 5: ajuste mínimo de CSS para evitar o corte dos botões na topbar em `390px`.)*
4. **Tone Mapping Padrão:**
   - **(Recomendado)** Adotar **`AgXToneMapping`** como alvo principal (e oferecer comparativo A/B com `ACESFilmic` e `Neutral` na Visual Gallery dev-only da Fase 1 para confirmação no GATE G1).
5. **Estratégia de Presets `GraphicsQuality` & `GTAOPass`:**
   - **(Recomendado)** Default **`High`** no Desktop (MSAA 4× + Bloom HDR + Contact/Baked AO) e **`Medium`** no Mobile (com `Low` sem `EffectComposer` para 60 FPS em GPUs fracas), persistido em `localStorage['defcon.graphicsQuality']` com amostragem inicial + rebaixamento automático e `?quality=`, deixando **`GTAOPass`** exclusivo do preset **`Ultra`** devido ao custo em Intel UHD 630.
6. **Alterações Pré-Existentes no Working Tree (`src/three/Effects3D.ts`):**
   - **(Recomendado)** Confirmar que `src/three/Effects3D.ts` (e os untracked `README.md`, `docs/designs/ARCHITECTURE.md`) devem permanecer intactos durante todo o overhaul.
7. **Lote Opcional da Fase 5 (Suporte Aéreo, Projéteis Aliados & UI de Qualidade):**
   - **(Recomendado)** Confirmar se a **Fase 5** deve incluir o lote opcional de polish visual do **suporte aéreo (`A-10`/`B-52`) + projéteis aliados** e a **proposta de UI de seleção de qualidade gráfica no HUD** (mantendo o HUD intocado nas Fases 1–4).
8. **Configuração TypeScript (`tsconfig.json`):**
   - **(Recomendado)** Confirmar manter o projeto **sem `tsconfig.json`** (seguindo o baseline de transpilação direta via Vite/esbuild) ou indicar se prefere adicionar um `tsconfig.json` `noEmit` em uma fase futura.

---

## 12. Registro Cronológico de Fases (Logbook)

- **2026-11-21 — Fase 0 (Auditoria, Baseline & Plano Mestre):** Concluída. `npm test` `15/15 PASS`; `npm run build` `PASS`; 8 screenshots baseline capturados e auditados (`1-1` C1/C5/400%/Mobile, `2-1`, `4-3`, `3-1`, `4-5`); APIs Three.js `0.187.0` verificadas com `arquivo:linha`; `docs/designs/VISUAL_OVERHAUL.md` publicado para **GATE G0**.
- *(Próximo registro: Fase 1 — Infraestrutura, Iluminação/IBL, AA, Tone Mapping, Quality Presets & Gallery → GATE G1).*
