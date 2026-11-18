/**
 * 3 Worlds x 5 Stages Campaign Configuration on a 28x16 tactical grid.
 * Grid columns: 0..27, rows: 0..15.
 */

function buildRoadFromWaypoints(paths) {
  const seen = new Set();
  const cells = [];

  const pushCell = (c, r) => {
    const k = `${c},${r}`;
    if (!seen.has(k)) {
      seen.add(k);
      cells.push([c, r]);
    }
  };

  for (const pts of paths) {
    for (let i = 0; i < pts.length - 1; i++) {
      let [c, r] = pts[i];
      const [tc, tr] = pts[i + 1];
      pushCell(c, r);
      while (c !== tc) {
        c += c < tc ? 1 : -1;
        pushCell(c, r);
      }
      while (r !== tr) {
        r += r < tr ? 1 : -1;
        pushCell(c, r);
      }
    }
  }
  return cells;
}

function buildStageWaves(worldId, stageId, subBossType, stageBossType, isFinalStage = false) {
  const hpMult = 1 + (worldId - 1) * 0.35 + (stageId - 1) * 0.1;

  if (!isFinalStage) {
    const bossTitleMap = {
      boss_koalitsiya: '2S35 Koalitsiya-SV 152mm Duplo',
      boss_terminator: 'BMPT-72 Terminator II Comando',
      boss_tu160: 'Tupolev Tu-160 "White Swan"',
      boss_armata: 'T-14 Armata + Pulso EMP'
    };
    const subTitleMap = {
      subboss_tos1: 'TOS-1A Buratino Termobárico',
      subboss_pantsir: 'Pantsir-S1M Blindado Antitorre',
      subboss_ka50: 'Ka-50 "Black Shark" Ace Gunship'
    };

    return [
      {
        wave: 1,
        title: 'Vanguarda de Reconhecimento',
        brief: 'Batedores Spetsnaz abrem a ofensiva. Posicione M2 .50 Cal e barreiras Hesco.',
        groups: [{ type: 'infantry', count: 10 + worldId * 2, interval: 0.65, delay: 0.3 }]
      },
      {
        wave: 2,
        title: 'Flanqueadores Motorizados',
        brief: 'Infantaria apoiada por veículos GAZ Tigr IMV rápidos.',
        groups: [
          { type: 'infantry', count: 10, interval: 0.55, delay: 0.2 },
          { type: 'imv', count: 4 + stageId, interval: 1.15, delay: 3.5 }
        ]
      },
      {
        wave: 3,
        title: 'Coluna Mecanizada & Drones',
        brief: 'Primeiros BTR-82A IFVs com enxame de drones Shahed-136.',
        groups: [
          { type: 'ifv', count: 2 + worldId, interval: 2.2, delay: 0.2 },
          { type: 'drone_swarm', count: 7 + stageId * 2, interval: 0.55, delay: 2.8 }
        ]
      },
      {
        wave: 4,
        title: 'Ponta de Lança Blindada',
        brief: 'Tanques T-90M com ERA escoltados por veículos leves.',
        groups: [
          { type: 'imv', count: 8, interval: 0.85, delay: 0.2 },
          { type: 'mbt', count: 2 + worldId, interval: 3.5, delay: 2.0 },
          { type: 'ifv', count: 3, interval: 1.9, delay: 3.0 }
        ]
      },
      {
        wave: 5,
        title: `SUB-CHEFE: ${subTitleMap[subBossType]}`,
        brief: `ALERTA DE SUB-CHEFE! ${subTitleMap[subBossType]} ataca suas torres ativamente. Repare [R] ou use Iron Dome/Abrams!`,
        groups: [
          { type: 'infantry', count: 12, interval: 0.45, delay: 0.2 },
          { type: 'ifv', count: 3, interval: 1.8, delay: 1.8 },
          { type: subBossType, count: 1, interval: 1.0, delay: 4.5 },
          { type: 'drone_swarm', count: 8, interval: 0.5, delay: 6.0 }
        ]
      },
      {
        wave: 6,
        title: 'Ataque Aéreo Combinado',
        brief: 'Helicópteros Havoc e enxames Shahed testam sua defesa antiaérea.',
        groups: [
          { type: 'drone_swarm', count: 12 + worldId * 2, interval: 0.4, delay: 0.2 },
          { type: 'heli', count: 2 + worldId, interval: 2.4, delay: 2.0 },
          { type: 'mbt', count: 2, interval: 3.2, delay: 3.5 }
        ]
      },
      {
        wave: 7,
        title: 'Incursão Furtiva',
        brief: 'Caças Stealth Su-57 entram no radar! Exigem Patriot Nv2 (AESA) ou Torre EW.',
        groups: [
          { type: 'mbt', count: 3 + worldId, interval: 2.8, delay: 0.2 },
          { type: 'stealth', count: 2 + Math.floor(stageId / 2), interval: 3.2, delay: 3.0 },
          { type: 'ifv', count: 5, interval: 1.4, delay: 1.5 }
        ]
      },
      {
        wave: 8,
        title: 'Tempestade Multi-Domínio',
        brief: 'Saturação simultânea terrestre e aérea com blindados pesados.',
        groups: [
          { type: 'ifv', count: 6, interval: 1.2, delay: 0.2 },
          { type: 'mbt', count: 4 + worldId, interval: 2.2, delay: 1.8 },
          { type: 'heli', count: 4, interval: 1.9, delay: 2.8 },
          { type: 'drone_swarm', count: 14, interval: 0.35, delay: 4.5 }
        ]
      },
      {
        wave: 9,
        title: 'Guarda Avançada do Chefe',
        brief: 'Unidades blindadas e furtivas preparam o avanço do Chefe de Fase.',
        groups: [
          { type: 'mbt', count: 5 + worldId, interval: 2.0, delay: 0.2 },
          { type: 'stealth', count: 4, interval: 2.2, delay: 2.0 },
          { type: 'heli', count: 4, interval: 1.8, delay: 3.2 },
          { type: 'infantry', count: 18, interval: 0.32, delay: 1.0 }
        ]
      },
      {
        wave: 10,
        title: `CHEFE DE FASE: ${bossTitleMap[stageBossType]}`,
        brief: `ALERTA DE COMANDO! ${bossTitleMap[stageBossType]} dispara contra suas defesas. Use Iron Dome, Abrams e Suporte Aéreo!`,
        groups: [
          { type: 'mbt', count: 3 + worldId, interval: 2.5, delay: 0.2 },
          { type: 'drone_swarm', count: 14, interval: 0.35, delay: 1.5 },
          { type: stageBossType, count: 1, interval: 1.0, delay: 4.5 },
          { type: 'stealth', count: 3, interval: 2.4, delay: 6.5 }
        ]
      }
    ].map((w) => ({ ...w, hpMult }));
  }

  // Stage 5: Fortress Boss Stage with all 3 Sub-Bosses + World Mega Boss
  const megaTitles = {
    megaboss_scud_convoy: 'MAZ-7917 Topol/Iskander-M + Fortaleza',
    megaboss_object279: 'Object 279 "Kotin" Nuclear Tank',
    megaboss_kirov_airship: 'Fortaleza Aérea "Kirov Command Carrier"'
  };
  const megaType =
    worldId === 1
      ? 'megaboss_scud_convoy'
      : worldId === 2
        ? 'megaboss_object279'
        : 'megaboss_kirov_airship';

  return [
    {
      wave: 1,
      title: 'Cerco à Fortaleza — Vanguarda',
      brief: 'Comboio mecanizado de abertura em alta pressão.',
      groups: [
        { type: 'infantry', count: 16, interval: 0.4, delay: 0.2 },
        { type: 'imv', count: 8, interval: 0.8, delay: 1.8 }
      ]
    },
    {
      wave: 2,
      title: 'Ataque Mecanizado & Drones',
      brief: 'BTR-82A IFVs apoiados por enxame de Shahed-136.',
      groups: [
        { type: 'ifv', count: 6, interval: 1.5, delay: 0.2 },
        { type: 'drone_swarm', count: 14, interval: 0.4, delay: 1.5 }
      ]
    },
    {
      wave: 3,
      title: 'Divisão de Tanques Proryv',
      brief: 'Tanques pesados T-90M + ERA avançam em formação cerrada.',
      groups: [
        { type: 'mbt', count: 5 + worldId, interval: 2.1, delay: 0.2 },
        { type: 'heli', count: 4, interval: 2.0, delay: 2.5 }
      ]
    },
    {
      wave: 4,
      title: 'ESCOLTA ELITE 1: TOS-1A BURATINO',
      brief: 'Sub-Chefe TOS-1A Buratino dispara foguetes termobáricos contra suas torres!',
      groups: [
        { type: 'mbt', count: 3, interval: 2.4, delay: 0.2 },
        { type: 'subboss_tos1', count: 1, interval: 1.0, delay: 3.0 },
        { type: 'ifv', count: 5, interval: 1.4, delay: 4.0 }
      ]
    },
    {
      wave: 5,
      title: 'Tempestade Stealth & Havoc',
      brief: 'Incursão aérea mista de Su-57 furtivos e helicópteros blindados.',
      groups: [
        { type: 'stealth', count: 5, interval: 1.9, delay: 0.2 },
        { type: 'heli', count: 5, interval: 1.6, delay: 1.5 },
        { type: 'drone_swarm', count: 18, interval: 0.3, delay: 2.5 }
      ]
    },
    {
      wave: 6,
      title: 'ESCOLTA ELITE 2: PANTSIR-S1M',
      brief: 'Sub-Chefe Pantsir-S1M avança com APS ativo e canhões 30mm antitorre!',
      groups: [
        { type: 'subboss_pantsir', count: 1, interval: 1.0, delay: 2.0 },
        { type: 'mbt', count: 5, interval: 1.9, delay: 0.2 },
        { type: 'drone_swarm', count: 16, interval: 0.32, delay: 3.5 }
      ]
    },
    {
      wave: 7,
      title: 'Saturação de Armadura Pesada',
      brief: 'Coluna massiva de T-90M, IFVs e caças furtivos.',
      groups: [
        { type: 'mbt', count: 6 + worldId, interval: 1.7, delay: 0.2 },
        { type: 'ifv', count: 7, interval: 1.2, delay: 1.0 },
        { type: 'stealth', count: 4, interval: 2.0, delay: 3.0 }
      ]
    },
    {
      wave: 8,
      title: 'ESCOLTA ELITE 3: KA-50 BLACK SHARK',
      brief: 'Sub-Chefe Aéreo Ka-50 ataca suas baterias antiaéreas com mísseis Vikhr!',
      groups: [
        { type: 'subboss_ka50', count: 1, interval: 1.0, delay: 2.0 },
        { type: 'heli', count: 5, interval: 1.6, delay: 0.5 },
        { type: 'mbt', count: 5, interval: 2.0, delay: 2.5 },
        { type: 'stealth', count: 4, interval: 2.0, delay: 4.0 }
      ]
    },
    {
      wave: 9,
      title: 'Prelúdio do Juízo Final',
      brief: 'Última barragem antes do Chefe Supremo. Repare suas torres e carregue suportes!',
      groups: [
        { type: 'mbt', count: 7, interval: 1.6, delay: 0.2 },
        { type: 'drone_swarm', count: 22, interval: 0.26, delay: 1.0 },
        { type: 'stealth', count: 5, interval: 1.8, delay: 2.5 },
        { type: 'heli', count: 5, interval: 1.5, delay: 3.5 }
      ]
    },
    {
      wave: 10,
      title: `CHEFE SUPREMO: ${megaTitles[megaType]}`,
      brief: `DEFCON 1! ${megaTitles[megaType]} escoltado por Sub-Chefes de elite! Proteja seu perímetro a todo custo!`,
      groups: [
        { type: 'subboss_tos1', count: 1, interval: 1.0, delay: 1.0 },
        { type: 'subboss_pantsir', count: 1, interval: 1.0, delay: 3.5 },
        { type: megaType, count: 1, interval: 1.0, delay: 5.5 },
        { type: 'subboss_ka50', count: 1, interval: 1.0, delay: 8.0 },
        { type: 'mbt', count: 4, interval: 2.2, delay: 2.0 }
      ]
    }
  ].map((w) => ({ ...w, hpMult }));
}

export const WORLDS = [
  {
    worldId: 1,
    name: 'Mundo 1: Operação Tempestade do Deserto',
    region: 'Oriente Médio',
    biome: 'desert',
    description: 'Terreno árido, dunas douradas, cânions rochosos e rodovias desérticas estratégicas.',
    skyColor: 0x161411,
    fogColor: 0x1b1712,
    sunColor: 0xffe9c2,
    rimColor: 0x38bdf8,
    stages: [
      {
        worldId: 1,
        stageId: 1,
        id: '1-1',
        title: 'Desfiladeiro de Basra',
        subtitle: 'Corredor duplo no deserto | Sub-Chefe: TOS-1A | Chefe: 2S35 Koalitsiya',
        startingBudget: 750,
        clearBonusWB: 60,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 3, id: 'ALPHA' },
          { col: 0, row: 12, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 3], [7, 3], [7, 6], [14, 6], [14, 7], [27, 7]],
          [[0, 12], [6, 12], [6, 10], [14, 10], [14, 7]]
        ]),
        rockCells: [
          [4, 7], [4, 8],
          [10, 2], [10, 3],
          [11, 12], [11, 13],
          [17, 3], [17, 4],
          [19, 11], [19, 12],
          [23, 3], [23, 4],
          [23, 11], [23, 12]
        ],
        waves: buildStageWaves(1, 1, 'subboss_tos1', 'boss_koalitsiya', false)
      },
      {
        worldId: 1,
        stageId: 2,
        id: '1-2',
        title: 'Refinaria Al-Faw',
        subtitle: 'Rotas em zigue-zague | Sub-Chefe: Pantsir-S1M | Chefe: BMPT-72 Terminator',
        startingBudget: 820,
        clearBonusWB: 80,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 2, id: 'ALPHA' },
          { col: 0, row: 13, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 8 },
        roadCells: buildRoadFromWaypoints([
          [[0, 2], [5, 2], [5, 6], [11, 6], [11, 3], [18, 3], [18, 8], [27, 8]],
          [[0, 13], [8, 13], [8, 10], [16, 10], [16, 13], [22, 13], [22, 8], [27, 8]]
        ]),
        rockCells: [
          [3, 7], [3, 8],
          [8, 2], [8, 3],
          [13, 7], [13, 8],
          [14, 13], [14, 14],
          [20, 4], [20, 5],
          [24, 3], [24, 4],
          [25, 12], [25, 13]
        ],
        waves: buildStageWaves(1, 2, 'subboss_pantsir', 'boss_terminator', false)
      },
      {
        worldId: 1,
        stageId: 3,
        id: '1-3',
        title: 'Vale do Eufrates',
        subtitle: 'Três eixos de aproximação | Sub-Chefe: Ka-50 | Chefe: Tu-160 White Swan',
        startingBudget: 880,
        clearBonusWB: 100,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 2, id: 'ALPHA' },
          { col: 0, row: 8, id: 'BRAVO' },
          { col: 0, row: 13, id: 'CHARLIE' }
        ],
        fobPoint: { col: 27, row: 8 },
        roadCells: buildRoadFromWaypoints([
          [[0, 2], [9, 2], [9, 5], [17, 5], [17, 8], [27, 8]],
          [[0, 8], [13, 8], [17, 8]],
          [[0, 13], [10, 13], [10, 11], [19, 11], [19, 8]]
        ]),
        rockCells: [
          [5, 4], [5, 5],
          [6, 10], [6, 11],
          [13, 2], [13, 3],
          [14, 13], [14, 14],
          [21, 3], [21, 4],
          [22, 12], [22, 13]
        ],
        waves: buildStageWaves(1, 3, 'subboss_ka50', 'boss_tu160', false)
      },
      {
        worldId: 1,
        stageId: 4,
        id: '1-4',
        title: 'Cidadela de Palmira',
        subtitle: 'Gargalo de cânions | Sub-Chefe: TOS-1A | Chefe: T-14 Armata EMP',
        startingBudget: 950,
        clearBonusWB: 120,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 4, id: 'ALPHA' },
          { col: 0, row: 11, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 4], [7, 4], [7, 7], [15, 7], [15, 4], [21, 4], [21, 7], [27, 7]],
          [[0, 11], [7, 11], [7, 7], [15, 7], [15, 11], [21, 11], [21, 7]]
        ]),
        rockCells: [
          [3, 1], [4, 1],
          [3, 14], [4, 14],
          [11, 2], [11, 3],
          [11, 12], [11, 13],
          [18, 7], [18, 8],
          [24, 2], [24, 3],
          [24, 12], [24, 13]
        ],
        waves: buildStageWaves(1, 4, 'subboss_tos1', 'boss_armata', false)
      },
      {
        worldId: 1,
        stageId: 5,
        id: '1-5',
        title: 'FORTALEZA FINAL: BASTIÃO SCUD',
        subtitle: 'FASE CHEFE SUPREMO | Escolta: TOS-1A, Pantsir, Ka-50 | Mega Boss: MAZ-7917 Topol-M',
        startingBudget: 1150,
        clearBonusWB: 240,
        isBossStage: true,
        spawnPoints: [
          { col: 0, row: 3, id: 'ALPHA' },
          { col: 0, row: 12, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 3], [6, 3], [6, 5], [12, 5], [12, 2], [19, 2], [19, 7], [27, 7]],
          [[0, 12], [6, 12], [6, 10], [12, 10], [12, 13], [19, 13], [19, 7]]
        ]),
        rockCells: [
          [3, 7], [3, 8],
          [9, 7], [9, 8],
          [15, 6], [15, 9],
          [22, 3], [22, 4],
          [22, 11], [22, 12],
          [24, 10]
        ],
        waves: buildStageWaves(1, 5, 'subboss_tos1', 'megaboss_scud_convoy', true)
      }
    ]
  },

  {
    worldId: 2,
    name: 'Mundo 2: Fronteira Ártica Siberiana',
    region: 'Ártico',
    biome: 'arctic',
    description: 'Neve profunda, gelo rachado, pinheiros nevados e iluminação polar glacial.',
    skyColor: 0x0b1622,
    fogColor: 0x0f1e2e,
    sunColor: 0xdbeafe,
    rimColor: 0x67e8f9,
    stages: [
      {
        worldId: 2,
        stageId: 1,
        id: '2-1',
        title: 'Estação Polar Murmansk',
        subtitle: 'Gelo costeiro | Sub-Chefe: Pantsir-S1M | Chefe: 2S35 Koalitsiya',
        startingBudget: 850,
        clearBonusWB: 90,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 4, id: 'ALPHA' },
          { col: 0, row: 11, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 8 },
        roadCells: buildRoadFromWaypoints([
          [[0, 4], [8, 4], [8, 2], [16, 2], [16, 8], [27, 8]],
          [[0, 11], [9, 11], [9, 13], [19, 13], [19, 8]]
        ]),
        rockCells: [
          [4, 7], [4, 8],
          [12, 6], [12, 7],
          [13, 10], [13, 11],
          [21, 3], [21, 4],
          [23, 11], [23, 12]
        ],
        waves: buildStageWaves(2, 1, 'subboss_pantsir', 'boss_koalitsiya', false)
      },
      {
        worldId: 2,
        stageId: 2,
        id: '2-2',
        title: 'Passo da Tundra Congelada',
        subtitle: 'Cruzamento duplo | Sub-Chefe: Ka-50 | Chefe: BMPT-72 Terminator',
        startingBudget: 920,
        clearBonusWB: 110,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 2, id: 'ALPHA' },
          { col: 0, row: 13, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 2], [6, 2], [6, 9], [14, 9], [14, 4], [22, 4], [22, 7], [27, 7]],
          [[0, 13], [9, 13], [9, 6], [18, 6], [18, 12], [24, 12], [24, 7]]
        ]),
        rockCells: [
          [3, 6], [3, 7],
          [11, 2], [11, 3],
          [11, 13], [11, 14],
          [17, 2], [17, 3],
          [20, 9], [20, 10],
          [25, 2], [25, 3]
        ],
        waves: buildStageWaves(2, 2, 'subboss_ka50', 'boss_terminator', false)
      },
      {
        worldId: 2,
        stageId: 3,
        id: '2-3',
        title: 'Base Submarina Severodvinsk',
        subtitle: 'Três frentes glaciais | Sub-Chefe: TOS-1A | Chefe: Tu-160 White Swan',
        startingBudget: 980,
        clearBonusWB: 130,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 2, id: 'ALPHA' },
          { col: 0, row: 7, id: 'BRAVO' },
          { col: 0, row: 13, id: 'CHARLIE' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 2], [7, 2], [7, 5], [16, 5], [16, 7], [27, 7]],
          [[0, 7], [11, 7], [11, 9], [21, 9], [21, 7]],
          [[0, 13], [8, 13], [8, 11], [21, 11], [21, 7]]
        ]),
        rockCells: [
          [4, 4], [4, 10],
          [12, 2], [12, 3],
          [14, 13], [14, 14],
          [19, 3], [19, 4],
          [24, 3], [24, 11]
        ],
        waves: buildStageWaves(2, 3, 'subboss_tos1', 'boss_tu160', false)
      },
      {
        worldId: 2,
        stageId: 4,
        id: '2-4',
        title: 'Geleira Novaya Zemlya',
        subtitle: 'Anel central | Sub-Chefe: Pantsir-S1M | Chefe: T-14 Armata EMP',
        startingBudget: 1050,
        clearBonusWB: 155,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 3, id: 'ALPHA' },
          { col: 0, row: 12, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 8 },
        roadCells: buildRoadFromWaypoints([
          [[0, 3], [5, 3], [5, 8], [13, 8], [13, 3], [20, 3], [20, 8], [27, 8]],
          [[0, 12], [5, 12], [5, 8], [13, 8], [13, 13], [20, 13], [20, 8]]
        ]),
        rockCells: [
          [9, 5], [9, 10],
          [16, 6], [16, 10],
          [23, 3], [23, 12],
          [2, 7], [2, 8]
        ],
        waves: buildStageWaves(2, 4, 'subboss_pantsir', 'boss_armata', false)
      },
      {
        worldId: 2,
        stageId: 5,
        id: '2-5',
        title: 'FORTALEZA FINAL: BUNKER KOTIN',
        subtitle: 'FASE CHEFE SUPREMO | Escolta: TOS-1A, Pantsir, Ka-50 | Mega Boss: Object 279 Nuclear',
        startingBudget: 1250,
        clearBonusWB: 300,
        isBossStage: true,
        spawnPoints: [
          { col: 0, row: 2, id: 'ALPHA' },
          { col: 0, row: 13, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 2], [7, 2], [7, 6], [14, 6], [14, 3], [21, 3], [21, 7], [27, 7]],
          [[0, 13], [7, 13], [7, 9], [14, 9], [14, 12], [21, 12], [21, 7]]
        ]),
        rockCells: [
          [3, 7], [3, 8],
          [10, 2], [10, 13],
          [17, 7], [17, 8],
          [24, 3], [24, 4],
          [24, 11], [24, 12]
        ],
        waves: buildStageWaves(2, 5, 'subboss_pantsir', 'megaboss_object279', true)
      }
    ]
  },

  {
    worldId: 3,
    name: 'Mundo 3: Bastilha Industrial',
    region: 'Leste Europeu',
    biome: 'industrial',
    description: 'Concreto urbano, ruínas siderúrgicas, trilhos ferroviários e asfalto escuro.',
    skyColor: 0x0c1016,
    fogColor: 0x10151e,
    sunColor: 0xfde68a,
    rimColor: 0xf97316,
    stages: [
      {
        worldId: 3,
        stageId: 1,
        id: '3-1',
        title: 'Pátio Ferroviário Donbas',
        subtitle: 'Linhas paralelas | Sub-Chefe: Ka-50 | Chefe: 2S35 Koalitsiya',
        startingBudget: 950,
        clearBonusWB: 125,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 3, id: 'ALPHA' },
          { col: 0, row: 12, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 8 },
        roadCells: buildRoadFromWaypoints([
          [[0, 3], [10, 3], [10, 6], [18, 6], [18, 8], [27, 8]],
          [[0, 12], [10, 12], [10, 10], [18, 10], [18, 8]]
        ]),
        rockCells: [
          [5, 6], [5, 7], [5, 8],
          [14, 2], [14, 3],
          [14, 12], [14, 13],
          [22, 4], [22, 5],
          [22, 11], [22, 12]
        ],
        waves: buildStageWaves(3, 1, 'subboss_ka50', 'boss_koalitsiya', false)
      },
      {
        worldId: 3,
        stageId: 2,
        id: '3-2',
        title: 'Siderúrgica Azovstal',
        subtitle: 'Labirinto de concreto | Sub-Chefe: TOS-1A | Chefe: BMPT-72 Terminator',
        startingBudget: 1020,
        clearBonusWB: 150,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 2, id: 'ALPHA' },
          { col: 0, row: 13, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 2], [5, 2], [5, 7], [12, 7], [12, 3], [19, 3], [19, 7], [27, 7]],
          [[0, 13], [8, 13], [8, 10], [15, 10], [15, 13], [23, 13], [23, 7]]
        ]),
        rockCells: [
          [2, 7], [2, 8],
          [8, 3], [8, 4],
          [15, 6], [15, 7],
          [18, 10], [18, 11],
          [25, 3], [25, 11]
        ],
        waves: buildStageWaves(3, 2, 'subboss_tos1', 'boss_terminator', false)
      },
      {
        worldId: 3,
        stageId: 3,
        id: '3-3',
        title: 'Aeródromo Militar Engels',
        subtitle: 'Três pistas de assalto | Sub-Chefe: Pantsir-S1M | Chefe: Tu-160 White Swan',
        startingBudget: 1100,
        clearBonusWB: 175,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 2, id: 'ALPHA' },
          { col: 0, row: 8, id: 'BRAVO' },
          { col: 0, row: 13, id: 'CHARLIE' }
        ],
        fobPoint: { col: 27, row: 8 },
        roadCells: buildRoadFromWaypoints([
          [[0, 2], [9, 2], [9, 5], [19, 5], [19, 8], [27, 8]],
          [[0, 8], [15, 8], [19, 8]],
          [[0, 13], [9, 13], [9, 11], [19, 11], [19, 8]]
        ]),
        rockCells: [
          [4, 5], [4, 10],
          [13, 2], [13, 3],
          [13, 13], [13, 14],
          [23, 4], [23, 12]
        ],
        waves: buildStageWaves(3, 3, 'subboss_pantsir', 'boss_tu160', false)
      },
      {
        worldId: 3,
        stageId: 4,
        id: '3-4',
        title: 'Complexo Nuclear Kursk',
        subtitle: 'Setores fortificados | Sub-Chefe: Ka-50 | Chefe: T-14 Armata EMP',
        startingBudget: 1180,
        clearBonusWB: 210,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 4, id: 'ALPHA' },
          { col: 0, row: 11, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 4], [6, 4], [6, 7], [13, 7], [13, 4], [21, 4], [21, 7], [27, 7]],
          [[0, 11], [6, 11], [6, 7], [13, 7], [13, 11], [21, 11], [21, 7]]
        ]),
        rockCells: [
          [3, 1], [3, 14],
          [9, 2], [9, 13],
          [17, 7], [17, 8],
          [24, 3], [24, 12]
        ],
        waves: buildStageWaves(3, 4, 'subboss_ka50', 'boss_armata', false)
      },
      {
        worldId: 3,
        stageId: 5,
        id: '3-5',
        title: 'FORTALEZA FINAL: CIDADELA KIROV',
        subtitle: 'CHEFE SUPREMO FINAL | Escolta: TOS-1A, Pantsir, Ka-50 | Mega Boss: Fortaleza Aérea Kirov',
        startingBudget: 1350,
        clearBonusWB: 400,
        isBossStage: true,
        spawnPoints: [
          { col: 0, row: 2, id: 'ALPHA' },
          { col: 0, row: 8, id: 'BRAVO' },
          { col: 0, row: 13, id: 'CHARLIE' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 2], [7, 2], [7, 5], [14, 5], [14, 7], [27, 7]],
          [[0, 8], [7, 8], [7, 7], [14, 7]],
          [[0, 13], [7, 13], [7, 10], [14, 10], [14, 7]]
        ]),
        rockCells: [
          [10, 2], [10, 13],
          [18, 3], [18, 4],
          [18, 11], [18, 12],
          [23, 3], [23, 12]
        ],
        waves: buildStageWaves(3, 5, 'subboss_ka50', 'megaboss_kirov_airship', true)
      }
    ]
  },

  // ===========================================================================
  // WORLD 4: EXPANSÃO DEFINITIVA — 5 NOVOS MAPAS TÁTICOS
  // ===========================================================================
  {
    worldId: 4,
    name: 'Mundo 4: Operação Fronteira Global (Expansão)',
    region: '5 Teatros Estratégicos',
    biome: 'forest',
    description: 'Cinco teatros de guerra inéditos com mecânicas ambientais, 20 torres especializadas e 20 inimigos armados.',
    skyColor: 0x0e1a14,
    fogColor: 0x13221a,
    sunColor: 0xfef3c7,
    rimColor: 0x4ade80,
    stages: [
      // MAPA 1 — VALE DAS FRONTEIRAS
      {
        worldId: 4,
        stageId: 1,
        id: '4-1',
        title: 'Vale das Fronteiras',
        subtitle: 'Dificuldade: Fácil | Floresta e planícies com 2 estrangulamentos estratégicos',
        difficulty: 'Fácil',
        biome: 'forest',
        skyColor: 0x101f17,
        fogColor: 0x15271e,
        sunColor: 0xfef3c7,
        rimColor: 0x4ade80,
        startingBudget: 680,
        clearBonusWB: 120,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 7, id: 'ALPHA' },
          { col: 0, row: 8, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 7], [7, 7], [7, 4], [14, 4], [14, 7], [21, 7], [21, 10], [25, 10], [25, 7], [27, 7]],
          [[0, 8], [7, 8], [7, 11], [14, 11], [14, 7]]
        ]),
        // Two natural mountain chokepoints around col 14 and col 21
        rockCells: [
          [4, 2], [4, 3], [5, 2],
          [4, 12], [4, 13], [5, 13],
          [13, 1], [13, 2], [14, 1], [14, 2],
          [13, 13], [13, 14], [14, 13], [14, 14],
          [16, 5], [16, 6], [16, 9], [16, 10],
          [20, 4], [20, 5], [22, 4], [22, 5],
          [24, 12], [24, 13]
        ],
        waves: [
          {
            wave: 1,
            title: 'Patrulha da Fronteira',
            brief: 'Recrutas iniciam a incursão pelo vale. Construa Balestras ou Metralhadoras nos estrangulamentos.',
            hpMult: 1.0,
            groups: [
              { type: 'recruta', count: 9, interval: 0.78, delay: 0.4 }
            ]
          },
          {
            wave: 2,
            title: 'Batedores & Corredores',
            brief: 'Corredores rápidos tentam romper a linha. Combine Metralhadora e Torre Criogênica.',
            hpMult: 1.0,
            groups: [
              { type: 'recruta', count: 8, interval: 0.68, delay: 0.2 },
              { type: 'corredor', count: 5, interval: 0.72, delay: 3.0 }
            ]
          },
          {
            wave: 3,
            title: 'Escudos & Flanco Rápido',
            brief: 'Batedores de Plasma (escudo energético) e Escudeiros entram em cena.',
            hpMult: 1.02,
            groups: [
              { type: 'batedor_plasma', count: 5, interval: 1.0, delay: 0.3 },
              { type: 'escudeiro', count: 2, interval: 2.2, delay: 2.5 },
              { type: 'corredor', count: 6, interval: 0.65, delay: 5.5 }
            ]
          },
          {
            wave: 4,
            title: 'Reconhecimento Aéreo',
            brief: 'ALERTA AÉREO: Drones de Reconhecimento sobrevoam a floresta. Posicione Flak AA ou Mísseis AA!',
            hpMult: 1.04,
            groups: [
              { type: 'recruta', count: 10, interval: 0.55, delay: 0.2 },
              { type: 'drone_recon', count: 6, interval: 0.85, delay: 2.2 }
            ]
          },
          {
            wave: 5,
            title: 'Comboio de Suporte Médico',
            brief: 'Médicos de Combate curam aliados feridos! Foque fogo com Franco-atirador ou área.',
            hpMult: 1.06,
            groups: [
              { type: 'escudeiro', count: 4, interval: 1.8, delay: 0.2 },
              { type: 'medico_combate', count: 3, interval: 2.4, delay: 1.4 },
              { type: 'batedor_plasma', count: 6, interval: 0.8, delay: 3.0 }
            ]
          },
          {
            wave: 6,
            title: 'Primeira Força Pesada',
            brief: 'Brutamontes blindado avança ao lado de drones de reconhecimento.',
            hpMult: 1.08,
            groups: [
              { type: 'brutamontes', count: 2, interval: 4.0, delay: 0.3 },
              { type: 'recruta', count: 10, interval: 0.5, delay: 1.5 },
              { type: 'drone_recon', count: 7, interval: 0.75, delay: 3.5 }
            ]
          },
          {
            wave: 7,
            title: 'Bombardeio de Fronteira',
            brief: 'Artilheiros e Drones Bombardeiros atacam suas estruturas à distância. Use Oficina ou Gerador de Escudos!',
            hpMult: 1.1,
            groups: [
              { type: 'artilheiro', count: 3, interval: 2.6, delay: 0.2 },
              { type: 'drone_bombardeiro', count: 3, interval: 2.5, delay: 2.0 },
              { type: 'corredor', count: 10, interval: 0.45, delay: 4.5 }
            ]
          },
          {
            wave: 8,
            title: 'Vanguarda Blindada Combinada',
            brief: 'Escudeiros, Médicos e Brutamontes marcham em formação fechada.',
            hpMult: 1.12,
            groups: [
              { type: 'escudeiro', count: 5, interval: 1.5, delay: 0.2 },
              { type: 'medico_combate', count: 3, interval: 2.2, delay: 1.2 },
              { type: 'brutamontes', count: 3, interval: 3.4, delay: 2.8 },
              { type: 'drone_recon', count: 8, interval: 0.6, delay: 5.0 }
            ]
          },
          {
            wave: 9,
            title: 'MINICHEFE: Escolta Blindada',
            brief: 'Sub-Chefe TOS-1A Buratino apoia uma ofensiva mista antes do comando final.',
            hpMult: 1.14,
            groups: [
              { type: 'batedor_plasma', count: 8, interval: 0.7, delay: 0.2 },
              { type: 'subboss_tos1', count: 1, interval: 1.0, delay: 3.0 },
              { type: 'drone_bombardeiro', count: 4, interval: 2.0, delay: 4.5 }
            ]
          },
          {
            wave: 10,
            title: 'CONFRONTO FINAL: Comandante Koalitsiya',
            brief: 'Chefe 2S35 Koalitsiya-SV escoltado por Brutamontes, Médicos e Drones Bombardeiros!',
            hpMult: 1.16,
            groups: [
              { type: 'escudeiro', count: 4, interval: 1.6, delay: 0.2 },
              { type: 'brutamontes', count: 3, interval: 3.2, delay: 1.5 },
              { type: 'medico_combate', count: 3, interval: 2.4, delay: 2.2 },
              { type: 'boss_koalitsiya', count: 1, interval: 1.0, delay: 4.5 },
              { type: 'drone_bombardeiro', count: 4, interval: 2.0, delay: 6.0 }
            ]
          }
        ]
      },

      // MAPA 2 — DESFILADEIRO DE FERRO
      {
        worldId: 4,
        stageId: 2,
        id: '4-2',
        title: 'Desfiladeiro de Ferro',
        subtitle: 'Dificuldade: Fácil a Intermediária | Cânions, pontes convergentes e colunas de cerco',
        difficulty: 'Fácil a Intermediária',
        biome: 'canyon',
        skyColor: 0x1a120e,
        fogColor: 0x221712,
        sunColor: 0xfdba74,
        rimColor: 0xf97316,
        startingBudget: 780,
        clearBonusWB: 160,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 2, id: 'ALPHA' },
          { col: 0, row: 13, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 2], [9, 2], [9, 7], [17, 7], [17, 3], [23, 3], [23, 7], [27, 7]],
          [[0, 13], [9, 13], [9, 7]],
          [[17, 7], [17, 12], [23, 12], [23, 7]]
        ]),
        rockCells: [
          [4, 5], [4, 6], [4, 9], [4, 10],
          [12, 2], [13, 2], [12, 13], [13, 13],
          [19, 7], [20, 7], [20, 8],
          [25, 2], [25, 13]
        ],
        // Bridge / industrial chasm tiles where building is restricted
        restrictedCells: [
          [7, 5], [7, 6], [7, 9], [7, 10],
          [11, 5], [11, 6], [11, 9], [11, 10],
          [15, 4], [15, 5], [15, 10], [15, 11],
          [21, 5], [21, 10]
        ],
        waves: [
          {
            wave: 1,
            title: 'Infiltração no Cânion',
            brief: 'Recrutas e Batedores de Plasma marcham pelas duas entradas rumo à ponte central.',
            hpMult: 1.05,
            groups: [
              { type: 'recruta', count: 10, interval: 0.65, delay: 0.2 },
              { type: 'batedor_plasma', count: 4, interval: 1.1, delay: 3.5 }
            ]
          },
          {
            wave: 2,
            title: 'Muralha de Escudos',
            brief: 'Escudeiros protegem corredores. Use Canhão Pesado, Morteiro ou Torre Tesla nas curvas!',
            hpMult: 1.08,
            groups: [
              { type: 'escudeiro', count: 4, interval: 1.8, delay: 0.2 },
              { type: 'corredor', count: 8, interval: 0.55, delay: 2.0 }
            ]
          },
          {
            wave: 3,
            title: 'Olhos no Cânion',
            brief: 'Drones de Reconhecimento + Atiradores de Elite que miram suas torres de longo alcance!',
            hpMult: 1.1,
            groups: [
              { type: 'atirador_elite', count: 3, interval: 2.4, delay: 0.4 },
              { type: 'drone_recon', count: 8, interval: 0.7, delay: 2.0 },
              { type: 'recruta', count: 10, interval: 0.5, delay: 3.0 }
            ]
          },
          {
            wave: 4,
            title: 'Bateria de Cerco',
            brief: 'Artilheiros e Emissores de Escudo avançam pelos corredores longos.',
            hpMult: 1.12,
            groups: [
              { type: 'emissor_escudo', count: 2, interval: 3.2, delay: 0.3 },
              { type: 'artilheiro', count: 4, interval: 2.1, delay: 1.5 },
              { type: 'escudeiro', count: 5, interval: 1.5, delay: 3.0 }
            ]
          },
          {
            wave: 5,
            title: 'Esquadrão Demolidor',
            brief: 'ALERTA: Demolidores com RPG priorizam suas torres de maior valor! Proteja com Gerador de Escudos.',
            hpMult: 1.15,
            groups: [
              { type: 'demolidor', count: 4, interval: 2.2, delay: 0.3 },
              { type: 'brutamontes', count: 2, interval: 3.8, delay: 2.5 },
              { type: 'medico_combate', count: 3, interval: 2.0, delay: 3.5 }
            ]
          },
          {
            wave: 6,
            title: 'Superioridade Aérea',
            brief: 'Drones Bombardeiros e Drones de Reconhecimento atacam as pontes.',
            hpMult: 1.18,
            groups: [
              { type: 'drone_recon', count: 10, interval: 0.5, delay: 0.2 },
              { type: 'drone_bombardeiro', count: 5, interval: 1.8, delay: 2.0 },
              { type: 'atirador_elite', count: 3, interval: 2.2, delay: 4.0 }
            ]
          },
          {
            wave: 7,
            title: 'Escavadores Industriais',
            brief: 'Escavadores Subterrâneos avançam sob o solo! Use Campo Minado, Radar ou Explosivos.',
            hpMult: 1.2,
            groups: [
              { type: 'escavador', count: 4, interval: 2.4, delay: 0.3 },
              { type: 'brutamontes', count: 3, interval: 3.0, delay: 2.0 },
              { type: 'batedor_plasma', count: 8, interval: 0.7, delay: 3.5 }
            ]
          },
          {
            wave: 8,
            title: 'Força Tarefa Blindada',
            brief: 'Emissores de Escudo blindam Brutamontes e Demolidores na ponte.',
            hpMult: 1.22,
            groups: [
              { type: 'emissor_escudo', count: 3, interval: 2.6, delay: 0.2 },
              { type: 'brutamontes', count: 4, interval: 2.6, delay: 1.5 },
              { type: 'demolidor', count: 4, interval: 2.0, delay: 3.0 },
              { type: 'artilheiro', count: 4, interval: 2.0, delay: 4.5 }
            ]
          },
          {
            wave: 9,
            title: 'MINICHEFE: Coluna Pantsir-S1M',
            brief: 'Sub-Chefe Pantsir-S1M + APS acompanhado por Sabotadores EMP e Atiradores de Elite.',
            hpMult: 1.25,
            groups: [
              { type: 'sabotador_emp', count: 3, interval: 2.4, delay: 0.2 },
              { type: 'subboss_pantsir', count: 1, interval: 1.0, delay: 3.0 },
              { type: 'atirador_elite', count: 4, interval: 1.9, delay: 4.0 },
              { type: 'drone_bombardeiro', count: 4, interval: 1.8, delay: 5.5 }
            ]
          },
          {
            wave: 10,
            title: 'CONFRONTO FINAL: BMPT-72 Terminator II',
            brief: 'Chefe Terminator II com APS Arena escoltado por Demolidores, Emissores de Escudo e Brutamontes!',
            hpMult: 1.28,
            groups: [
              { type: 'emissor_escudo', count: 3, interval: 2.6, delay: 0.2 },
              { type: 'brutamontes', count: 4, interval: 2.8, delay: 1.5 },
              { type: 'boss_terminator', count: 1, interval: 1.0, delay: 4.5 },
              { type: 'demolidor', count: 4, interval: 2.0, delay: 6.0 },
              { type: 'drone_bombardeiro', count: 5, interval: 1.6, delay: 7.0 }
            ]
          }
        ]
      },

      // MAPA 3 — PORTO CONGELADO
      {
        worldId: 4,
        stageId: 3,
        id: '4-3',
        title: 'Porto Congelado',
        subtitle: 'Dificuldade: Intermediária | Gelo escorregadio (+25% vel.), unidades aéreas e Criomantes',
        difficulty: 'Intermediária',
        biome: 'arctic',
        skyColor: 0x0b1622,
        fogColor: 0x0f1e2e,
        sunColor: 0xdbeafe,
        rimColor: 0x67e8f9,
        startingBudget: 860,
        clearBonusWB: 200,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 3, id: 'ALPHA' },
          { col: 0, row: 12, id: 'BRAVO' }
        ],
        fobPoint: { col: 27, row: 8 },
        roadCells: buildRoadFromWaypoints([
          [[0, 3], [5, 3], [5, 8], [10, 8], [10, 2], [16, 2], [16, 11], [22, 11], [22, 8], [27, 8]],
          [[0, 12], [5, 12], [5, 8]],
          [[10, 8], [10, 13], [16, 13], [16, 11]]
        ]),
        rockCells: [
          [2, 7], [2, 8],
          [8, 5], [8, 10],
          [13, 6], [13, 7],
          [19, 3], [19, 4], [19, 13],
          [24, 3], [24, 12]
        ],
        // Ice-slick road segments (+25% ground speed)
        iceCells: [
          [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9], [5, 10],
          [10, 3], [10, 4], [10, 5], [10, 6], [10, 7],
          [16, 4], [16, 5], [16, 6], [16, 7], [16, 8], [16, 9], [16, 10],
          [22, 8], [22, 9], [22, 10]
        ],
        // Frozen dock water tiles where building is restricted
        restrictedCells: [
          [7, 2], [8, 2], [7, 13], [8, 13],
          [13, 1], [14, 1], [13, 14], [14, 14],
          [20, 7], [20, 8], [25, 5], [25, 11]
        ],
        waves: [
          {
            wave: 1,
            title: 'Incursão Polar',
            brief: 'O gelo acelera unidades terrestres em +25%. Use Lança-chamas, Arpões e Metralhadoras.',
            hpMult: 1.15,
            groups: [
              { type: 'recruta', count: 10, interval: 0.6, delay: 0.2 },
              { type: 'corredor', count: 8, interval: 0.55, delay: 2.5 }
            ]
          },
          {
            wave: 2,
            title: 'Vanguarda Criogênica',
            brief: 'ALERTA: Criomantes resistem a gelo e desaceleram a cadência das suas torres! Use Fogo e Eletricidade.',
            hpMult: 1.18,
            groups: [
              { type: 'criomante', count: 4, interval: 2.0, delay: 0.3 },
              { type: 'batedor_plasma', count: 8, interval: 0.8, delay: 2.2 }
            ]
          },
          {
            wave: 3,
            title: 'Enxame sobre o Porto',
            brief: 'Drones de Reconhecimento e Corredores sobre o gelo.',
            hpMult: 1.2,
            groups: [
              { type: 'drone_recon', count: 10, interval: 0.55, delay: 0.2 },
              { type: 'corredor', count: 12, interval: 0.42, delay: 2.0 },
              { type: 'escudeiro', count: 4, interval: 1.8, delay: 4.0 }
            ]
          },
          {
            wave: 4,
            title: 'Chuva de Bombas Ártica',
            brief: 'Drones Bombardeiros e Criomantes miram suas baterias centrais.',
            hpMult: 1.22,
            groups: [
              { type: 'drone_bombardeiro', count: 6, interval: 1.6, delay: 0.2 },
              { type: 'criomante', count: 5, interval: 1.8, delay: 1.8 },
              { type: 'emissor_escudo', count: 3, interval: 2.6, delay: 3.5 }
            ]
          },
          {
            wave: 5,
            title: 'Sabotagem no Gelo',
            brief: 'Sabotadores EMP e Atiradores de Elite avançam em cobertura.',
            hpMult: 1.25,
            groups: [
              { type: 'sabotador_emp', count: 4, interval: 2.0, delay: 0.3 },
              { type: 'atirador_elite', count: 4, interval: 2.0, delay: 1.8 },
              { type: 'drone_recon', count: 10, interval: 0.5, delay: 4.0 }
            ]
          },
          {
            wave: 6,
            title: 'Assalto Blindado Glacial',
            brief: 'Brutamontes + Escudeiros + Médicos avançando rápido pelas pistas de gelo.',
            hpMult: 1.28,
            groups: [
              { type: 'brutamontes', count: 4, interval: 2.8, delay: 0.2 },
              { type: 'escudeiro', count: 6, interval: 1.4, delay: 1.2 },
              { type: 'medico_combate', count: 4, interval: 2.0, delay: 2.5 }
            ]
          },
          {
            wave: 7,
            title: 'Tempestade Aérea & Escavadores',
            brief: 'Escavadores Subterrâneos por baixo e Bombardeiros por cima!',
            hpMult: 1.3,
            groups: [
              { type: 'escavador', count: 5, interval: 2.0, delay: 0.2 },
              { type: 'drone_bombardeiro', count: 7, interval: 1.4, delay: 1.5 },
              { type: 'criomante', count: 5, interval: 1.8, delay: 3.5 }
            ]
          },
          {
            wave: 8,
            title: 'Frente Combinada Polar',
            brief: 'Emissores de Escudo protegem Demolidores, Criomantes e Enxames.',
            hpMult: 1.32,
            groups: [
              { type: 'emissor_escudo', count: 4, interval: 2.2, delay: 0.2 },
              { type: 'demolidor', count: 5, interval: 1.8, delay: 1.2 },
              { type: 'criomante', count: 5, interval: 1.7, delay: 2.5 },
              { type: 'drone_recon', count: 12, interval: 0.4, delay: 4.0 }
            ]
          },
          {
            wave: 9,
            title: 'MINICHEFE: Ka-50 Black Shark',
            brief: 'Sub-Chefe Aéreo Ka-50 + esquadrão de drones e Criomantes.',
            hpMult: 1.35,
            groups: [
              { type: 'subboss_ka50', count: 1, interval: 1.0, delay: 0.5 },
              { type: 'drone_bombardeiro', count: 6, interval: 1.4, delay: 1.5 },
              { type: 'criomante', count: 5, interval: 1.7, delay: 2.5 },
              { type: 'sabotador_emp', count: 4, interval: 2.0, delay: 4.5 }
            ]
          },
          {
            wave: 10,
            title: 'CONFRONTO FINAL: Tupolev Tu-160 White Swan',
            brief: 'Bombardeiro estratégico Tu-160 apoiado por Criomantes, Escudos e Drones Bombardeiros!',
            hpMult: 1.38,
            groups: [
              { type: 'emissor_escudo', count: 4, interval: 2.2, delay: 0.2 },
              { type: 'criomante', count: 6, interval: 1.6, delay: 1.2 },
              { type: 'boss_tu160', count: 1, interval: 1.0, delay: 4.0 },
              { type: 'drone_bombardeiro', count: 8, interval: 1.2, delay: 5.5 },
              { type: 'brutamontes', count: 3, interval: 2.8, delay: 6.5 }
            ]
          }
        ]
      },

      // MAPA 4 — PÂNTANO DAS RUÍNAS
      {
        worldId: 4,
        stageId: 4,
        id: '4-4',
        title: 'Pântano das Ruínas',
        subtitle: 'Dificuldade: Intermediária | Bifurcações, neblina (-25% alcance sem Radar), furtivos e veneno',
        difficulty: 'Intermediária',
        biome: 'swamp',
        skyColor: 0x0d1512,
        fogColor: 0x14201b,
        sunColor: 0xd9f99d,
        rimColor: 0xa3e635,
        startingBudget: 940,
        clearBonusWB: 240,
        isBossStage: false,
        spawnPoints: [
          { col: 0, row: 2, id: 'ALPHA' },
          { col: 0, row: 7, id: 'BRAVO' },
          { col: 0, row: 13, id: 'CHARLIE' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 2], [8, 2], [8, 5], [16, 5], [16, 2], [22, 2], [22, 7], [27, 7]],
          [[0, 7], [11, 7], [11, 10], [19, 10], [19, 7], [22, 7]],
          [[0, 13], [8, 13], [8, 10], [11, 10]],
          [[16, 5], [16, 7], [19, 7]]
        ]),
        rockCells: [
          [4, 4], [4, 10],
          [13, 2], [13, 3], [13, 13], [13, 14],
          [18, 13], [19, 13],
          [24, 3], [24, 11]
        ],
        // Low-visibility swamp mist sectors (-25% tower range unless covered by Radar Tático)
        fogCells: [
          [5, 1], [6, 1], [5, 2], [6, 2], [5, 3], [6, 3],
          [9, 5], [10, 5], [9, 6], [10, 6], [9, 7], [10, 7], [9, 8], [10, 8],
          [14, 6], [15, 6], [14, 7], [15, 7], [14, 8], [15, 8],
          [19, 4], [20, 4], [19, 5], [20, 5], [19, 9], [20, 9]
        ],
        // Toxic bog tiles that heal corrosive units slowly
        toxicCells: [
          [8, 3], [8, 4], [8, 11], [8, 12],
          [11, 8], [11, 9], [16, 6], [19, 8]
        ],
        waves: [
          {
            wave: 1,
            title: 'Praga do Pântano',
            brief: 'Enxames Corrosivos e Recrutas avançam por 3 trilhas! Use Lança-chamas ou Metralhadora.',
            hpMult: 1.2,
            groups: [
              { type: 'enxame_corrosivo', count: 14, interval: 0.42, delay: 0.2 },
              { type: 'recruta', count: 10, interval: 0.55, delay: 3.0 }
            ]
          },
          {
            wave: 2,
            title: 'Sombras na Neblina',
            brief: 'ALERTA FURTIVO: Caçadores Furtivos se camuflam na neblina! Posicione Radar Tático urgentemente!',
            hpMult: 1.22,
            groups: [
              { type: 'cacador_furtivo', count: 6, interval: 1.5, delay: 0.3 },
              { type: 'enxame_corrosivo', count: 14, interval: 0.38, delay: 2.5 }
            ]
          },
          {
            wave: 3,
            title: 'Maré Ácida',
            brief: 'Corrosivos lançam ácido contínuo em suas torres. Oficina de Engenharia neutraliza a corrosão!',
            hpMult: 1.25,
            groups: [
              { type: 'corrosivo', count: 5, interval: 1.9, delay: 0.2 },
              { type: 'medico_combate', count: 4, interval: 2.0, delay: 1.5 },
              { type: 'enxame_corrosivo', count: 16, interval: 0.35, delay: 3.5 }
            ]
          },
          {
            wave: 4,
            title: 'Emboscada de Precisão',
            brief: 'Atiradores de Elite e Caçadores Furtivos visam seus Radares e Suportes.',
            hpMult: 1.28,
            groups: [
              { type: 'atirador_elite', count: 5, interval: 1.9, delay: 0.3 },
              { type: 'cacador_furtivo', count: 7, interval: 1.3, delay: 1.8 },
              { type: 'drone_recon', count: 8, interval: 0.7, delay: 3.8 }
            ]
          },
          {
            wave: 5,
            title: 'Comboio Tóxico Blindado',
            brief: 'Corrosivos e Brutamontes protegidos por Emissores de Escudo.',
            hpMult: 1.3,
            groups: [
              { type: 'emissor_escudo', count: 3, interval: 2.4, delay: 0.2 },
              { type: 'corrosivo', count: 6, interval: 1.7, delay: 1.2 },
              { type: 'brutamontes', count: 4, interval: 2.8, delay: 2.5 }
            ]
          },
          {
            wave: 6,
            title: 'Túneis do Pântano',
            brief: 'Escavadores Subterrâneos e Enxames Corrosivos atacam por rotas múltiplas.',
            hpMult: 1.33,
            groups: [
              { type: 'escavador', count: 6, interval: 1.8, delay: 0.2 },
              { type: 'enxame_corrosivo', count: 22, interval: 0.28, delay: 1.5 },
              { type: 'drone_bombardeiro', count: 5, interval: 1.7, delay: 3.5 }
            ]
          },
          {
            wave: 7,
            title: 'Infiltração Eletrônica',
            brief: 'Sabotadores EMP tentam desligar seus Radares enquanto Furtivos avançam!',
            hpMult: 1.36,
            groups: [
              { type: 'sabotador_emp', count: 5, interval: 1.8, delay: 0.2 },
              { type: 'cacador_furtivo', count: 8, interval: 1.2, delay: 1.5 },
              { type: 'artilheiro', count: 5, interval: 1.8, delay: 3.0 }
            ]
          },
          {
            wave: 8,
            title: 'Maré Pestilenta',
            brief: 'Todos os especialistas de veneno, cura e cerco em pressão sincronizada.',
            hpMult: 1.38,
            groups: [
              { type: 'corrosivo', count: 7, interval: 1.5, delay: 0.2 },
              { type: 'medico_combate', count: 5, interval: 1.8, delay: 1.2 },
              { type: 'demolidor', count: 5, interval: 1.7, delay: 2.4 },
              { type: 'cacador_furtivo', count: 8, interval: 1.1, delay: 4.0 }
            ]
          },
          {
            wave: 9,
            title: 'MINICHEFE: Escolta Tóxica & Ka-50',
            brief: 'Sub-Chefe Ka-50 e TOS-1A escoltados por Corrosivos e Furtivos.',
            hpMult: 1.42,
            groups: [
              { type: 'subboss_ka50', count: 1, interval: 1.0, delay: 0.5 },
              { type: 'corrosivo', count: 6, interval: 1.5, delay: 1.5 },
              { type: 'cacador_furtivo', count: 8, interval: 1.1, delay: 2.5 },
              { type: 'subboss_tos1', count: 1, interval: 1.0, delay: 4.5 }
            ]
          },
          {
            wave: 10,
            title: 'CONFRONTO FINAL: T-14 Armata EMP',
            brief: 'Chefe T-14 Armata com pulso EMP e Afganit APS liderando Furtivos e Corrosivos!',
            hpMult: 1.45,
            groups: [
              { type: 'sabotador_emp', count: 5, interval: 1.8, delay: 0.2 },
              { type: 'corrosivo', count: 6, interval: 1.6, delay: 1.4 },
              { type: 'boss_armata', count: 1, interval: 1.0, delay: 4.0 },
              { type: 'cacador_furtivo', count: 8, interval: 1.2, delay: 5.5 },
              { type: 'drone_bombardeiro', count: 6, interval: 1.5, delay: 6.5 }
            ]
          }
        ]
      },

      // MAPA 5 — COMPLEXO VULCÂNICO
      {
        worldId: 4,
        stageId: 5,
        id: '4-5',
        title: 'Complexo Vulcânico',
        subtitle: 'Dificuldade: Intermediária a Desafiadora | Fendas de lava, cerco pesado e Chefe Titã de Cerco',
        difficulty: 'Intermediária a Desafiadora',
        biome: 'volcanic',
        skyColor: 0x190b08,
        fogColor: 0x240f0b,
        sunColor: 0xfca5a5,
        rimColor: 0xef4444,
        startingBudget: 1120,
        clearBonusWB: 400,
        isBossStage: true,
        spawnPoints: [
          { col: 0, row: 2, id: 'ALPHA' },
          { col: 0, row: 8, id: 'BRAVO' },
          { col: 0, row: 13, id: 'CHARLIE' }
        ],
        fobPoint: { col: 27, row: 7 },
        roadCells: buildRoadFromWaypoints([
          [[0, 2], [6, 2], [6, 5], [13, 5], [13, 2], [20, 2], [20, 7], [27, 7]],
          [[0, 8], [13, 8], [13, 5]],
          [[0, 13], [6, 13], [6, 10], [13, 10], [13, 13], [20, 13], [20, 7]],
          [[13, 8], [20, 7]]
        ]),
        rockCells: [
          [3, 5], [3, 10],
          [9, 2], [9, 13],
          [16, 4], [16, 11],
          [23, 3], [23, 12]
        ],
        // Dangerous molten fissures that damage unprotected nearby towers unless shielded/repaired, and empower Pyromancers
        lavaCells: [
          [8, 6], [8, 9],
          [11, 3], [11, 12],
          [15, 6], [15, 9],
          [18, 4], [18, 11],
          [22, 5], [22, 10]
        ],
        waves: [
          {
            wave: 1,
            title: 'Vanguarda da Caldeira',
            brief: 'Atenção às fendas de lava! Recrutas, Corredores e Piromantes iniciam o assalto.',
            hpMult: 1.25,
            groups: [
              { type: 'recruta', count: 12, interval: 0.5, delay: 0.2 },
              { type: 'corredor', count: 10, interval: 0.45, delay: 2.0 },
              { type: 'piromante', count: 3, interval: 2.2, delay: 4.0 }
            ]
          },
          {
            wave: 2,
            title: 'Legião Térmica & Escudos',
            brief: 'Piromantes resistem a fogo! Use Torre Criogênica, Railgun ou Balestra perfurante.',
            hpMult: 1.28,
            groups: [
              { type: 'piromante', count: 6, interval: 1.7, delay: 0.2 },
              { type: 'escudeiro', count: 6, interval: 1.5, delay: 1.5 },
              { type: 'batedor_plasma', count: 8, interval: 0.7, delay: 3.5 }
            ]
          },
          {
            wave: 3,
            title: 'Brocas & Ácido',
            brief: 'Escavadores Subterrâneos e Enxames Corrosivos atacam pelas 3 entradas.',
            hpMult: 1.32,
            groups: [
              { type: 'escavador', count: 6, interval: 1.8, delay: 0.2 },
              { type: 'enxame_corrosivo', count: 22, interval: 0.28, delay: 1.5 },
              { type: 'corrosivo', count: 4, interval: 2.0, delay: 3.5 }
            ]
          },
          {
            wave: 4,
            title: 'Assalto Aéreo Vulcânico',
            brief: 'Drones de Reconhecimento e Drones Bombardeiros em grande formação.',
            hpMult: 1.35,
            groups: [
              { type: 'drone_recon', count: 14, interval: 0.42, delay: 0.2 },
              { type: 'drone_bombardeiro', count: 7, interval: 1.4, delay: 1.8 },
              { type: 'atirador_elite', count: 5, interval: 1.8, delay: 3.5 }
            ]
          },
          {
            wave: 5,
            title: 'Coluna de Cerco Pesada',
            brief: 'Brutamontes, Demolidores e Artilheiros protegidos por Emissores de Escudo e Médicos.',
            hpMult: 1.38,
            groups: [
              { type: 'emissor_escudo', count: 4, interval: 2.2, delay: 0.2 },
              { type: 'brutamontes', count: 5, interval: 2.4, delay: 1.2 },
              { type: 'demolidor', count: 5, interval: 1.7, delay: 2.4 },
              { type: 'medico_combate', count: 4, interval: 2.0, delay: 3.0 }
            ]
          },
          {
            wave: 6,
            title: 'Guerra Eletrônica & Furtiva',
            brief: 'Sabotadores EMP e Caçadores Furtivos miram sua rede de energia e radares!',
            hpMult: 1.42,
            groups: [
              { type: 'sabotador_emp', count: 6, interval: 1.6, delay: 0.2 },
              { type: 'cacador_furtivo', count: 9, interval: 1.1, delay: 1.5 },
              { type: 'criomante', count: 5, interval: 1.8, delay: 3.0 }
            ]
          },
          {
            wave: 7,
            title: 'Elementais em Saturação',
            brief: 'Piromantes, Criomantes e Corrosivos combinam ataques térmicos, congelantes e ácidos.',
            hpMult: 1.45,
            groups: [
              { type: 'piromante', count: 7, interval: 1.4, delay: 0.2 },
              { type: 'criomante', count: 6, interval: 1.5, delay: 1.4 },
              { type: 'corrosivo', count: 6, interval: 1.6, delay: 2.8 },
              { type: 'artilheiro', count: 5, interval: 1.8, delay: 4.5 }
            ]
          },
          {
            wave: 8,
            title: 'Divisão de Demolição',
            brief: 'Escavadores, Demolidores e Brutamontes avançam em massa com cobertura aérea.',
            hpMult: 1.48,
            groups: [
              { type: 'brutamontes', count: 6, interval: 2.1, delay: 0.2 },
              { type: 'demolidor', count: 6, interval: 1.5, delay: 1.2 },
              { type: 'escavador', count: 6, interval: 1.7, delay: 2.5 },
              { type: 'drone_bombardeiro', count: 8, interval: 1.2, delay: 4.0 }
            ]
          },
          {
            wave: 9,
            title: 'MINICHEFE: Guarda Imperial do Titã',
            brief: 'Sub-Chefes TOS-1A e Pantsir preparam o campo de batalha para o Titã de Cerco!',
            hpMult: 1.52,
            groups: [
              { type: 'subboss_tos1', count: 1, interval: 1.0, delay: 0.4 },
              { type: 'subboss_pantsir', count: 1, interval: 1.0, delay: 3.0 },
              { type: 'emissor_escudo', count: 4, interval: 2.2, delay: 1.5 },
              { type: 'piromante', count: 6, interval: 1.4, delay: 4.0 },
              { type: 'sabotador_emp', count: 5, interval: 1.7, delay: 5.5 }
            ]
          },
          {
            wave: 10,
            title: 'CHEFE FINAL DA EXPANSÃO: TITÃ DE CERCO',
            brief: 'DEFCON 1! Titã de Cerco (Escudo + APS + Onda de Choque) com escolta completa! Use Railgun, Laser, Tesla e Oficina!',
            hpMult: 1.55,
            groups: [
              { type: 'emissor_escudo', count: 4, interval: 2.4, delay: 0.2 },
              { type: 'medico_combate', count: 4, interval: 2.2, delay: 1.0 },
              { type: 'tita_cerco', count: 1, interval: 1.0, delay: 3.5 },
              { type: 'piromante', count: 6, interval: 1.5, delay: 5.5 },
              { type: 'drone_bombardeiro', count: 6, interval: 1.5, delay: 7.0 }
            ]
          }
        ]
      }
    ]
  }
];

export function getWorldConfig(worldId) {
  return WORLDS.find((w) => w.worldId === worldId) || WORLDS[0];
}

export function getStageConfig(worldId, stageId) {
  const world = getWorldConfig(worldId);
  return world.stages.find((s) => s.stageId === stageId) || world.stages[0];
}

