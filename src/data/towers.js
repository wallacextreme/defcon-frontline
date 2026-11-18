/**
 * Complete 20+ Tactical Towers Catalog with:
 * - Basic level (Lv1)
 * - 3 Common Upgrade Levels (Lv2, Lv3, Lv4)
 * - 2 Mutually Exclusive Specializations (Branch A / Branch B at Lv5)
 * - Specialization Mastery Upgrade (Lv6)
 * Preserves legacy tower IDs (hesco, bushmaster, javelin) for full backwards compatibility.
 */

export const TARGET_PRIORITIES = [
  { id: 'first', label: 'FIRST', short: '1ST', desc: 'Alvo mais próximo da FOB' },
  { id: 'last', label: 'LAST', short: 'LST', desc: 'Alvo mais distante da FOB' },
  { id: 'strongest', label: 'STRONGEST', short: 'STR', desc: 'Maior HP atual' },
  { id: 'weakest', label: 'WEAKEST', short: 'WEK', desc: 'Menor HP atual' },
  { id: 'air_first', label: 'AIR PRIO', short: 'AIR', desc: 'Prioriza unidades aéreas' }
];

export const AIR_SUPPORT_DEFINITIONS = {
  a10: {
    id: 'a10',
    hotkey: 'Q',
    name: 'A-10 WARTHOG',
    cost: 200,
    cooldown: 45,
    unlockCostWB: 0,
    desc: 'GAU-8 30mm Strafe (Arraste/R roda ângulo)'
  },
  hellfire: {
    id: 'hellfire',
    hotkey: 'E',
    name: 'AGM-114 HELLFIRE',
    cost: 150,
    cooldown: 30,
    unlockCostWB: 0,
    desc: 'Ataque cirúrgico antitanque no cursor'
  },
  b52: {
    id: 'b52',
    hotkey: 'B',
    name: 'B-52 CARPET BOMB',
    cost: 350,
    cooldown: 60,
    unlockCostWB: 300,
    desc: 'Bombardeio estratégico em tapete + fogo termobárico'
  }
};

export const MANDATORY_TOWER_IDS = [
  'ballista',
  'm2_bunker',
  'abrams_pit',
  'howitzer',
  'sniper_tower',
  'cryo_tower',
  'tesla_tower',
  'toxic_tower',
  'flamethrower',
  'helios_laser',
  'railgun',
  'patriot',
  'phalanx',
  'harpoon_tower',
  'tos1_mlrs',
  'minefield',
  'ew_crew',
  'eng_workshop',
  'iron_dome',
  'energy_extractor'
];

export const TOWER_CATEGORIES = [
  { id: 'all', label: 'TODAS (23)' },
  { id: 'precision', label: 'PRECISÃO' },
  { id: 'area', label: 'ÁREA / CERCO' },
  { id: 'elemental', label: 'ELEMENTAL / AA' },
  { id: 'support', label: 'SUPORTE / ECON' }
];

export const TOWER_DEFINITIONS = {
  // 01. Balestra de Precisão
  ballista: {
    id: 'ballista',
    catalogNum: 1,
    category: 'precision',
    hotkey: '1',
    name: 'Balestra de Precisão',
    shortName: 'BALESTRA',
    role: 'PRECISÃO FÍSICA',
    roleColor: '#eab308',
    cost: 80,
    unlockCostWB: 0,
    maxHp: 460,
    domain: 'both',
    defaultPriority: 'first',
    projectileSpeed: 980,
    turnRate: 9.0,
    summary: 'Disparo físico preciso de baixo custo contra alvo único terrestre ou aéreo.',
    levels: [
      {
        level: 1,
        name: 'Balestra Tática M1',
        range: 215,
        minRange: 0,
        fireRate: 1.35,
        damage: 42,
        damageType: 'physical',
        armorPierce: 0.15,
        splashRadius: 0,
        notes: '1.35 tiros/s | 42 Dano Físico | Perfuração 15%.'
      },
      {
        level: 2,
        upgradeCost: 65,
        name: 'Balestra Composta Reforçada',
        range: 235,
        minRange: 0,
        fireRate: 1.55,
        damage: 58,
        damageType: 'physical',
        armorPierce: 0.25,
        splashRadius: 0,
        notes: '1.55 tiros/s | 58 Dano Físico | Perfuração 25%.'
      },
      {
        level: 3,
        upgradeCost: 110,
        name: 'Balestra de Repetição Hidráulica',
        range: 255,
        minRange: 0,
        fireRate: 1.85,
        damage: 78,
        damageType: 'physical',
        armorPierce: 0.35,
        splashRadius: 0,
        notes: '1.85 tiros/s | 78 Dano Físico | Perfuração 35%.'
      },
      {
        level: 4,
        upgradeCost: 165,
        name: 'Balestra Pesada de Cerco',
        range: 275,
        minRange: 0,
        fireRate: 2.1,
        damage: 102,
        damageType: 'physical',
        armorPierce: 0.45,
        splashRadius: 0,
        notes: '2.1 tiros/s | 102 Dano | Pronta para especialização.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Perfuração de Armadura',
        cost: 240,
        pros: 'Ignora 85% da blindagem pesada e causa +55% em alvos blindados.',
        cons: 'Cadência reduzida para disparos mais pesados contra enxames.',
        notes: 'Virotes de tungstênio (85% perfuração) contra blindados.',
        stats: {
          range: 300,
          minRange: 0,
          fireRate: 1.7,
          damage: 215,
          damageType: 'piercing',
          armorPierce: 0.85,
          heavyMultiplier: 1.55,
          splashRadius: 0
        },
        tier2: {
          name: 'Virotes de Urânio Empobrecido',
          upgradeCost: 340,
          notes: '95% perfuração + crítico 25% contra alvos blindados.',
          stats: {
            range: 320,
            minRange: 0,
            fireRate: 1.9,
            damage: 295,
            damageType: 'piercing',
            armorPierce: 0.95,
            heavyMultiplier: 1.7,
            critChance: 0.25,
            splashRadius: 0
          }
        }
      },
      B: {
        id: 'B',
        name: 'Disparos Múltiplos',
        cost: 240,
        pros: 'Dispara 3 virotes simultâneos atingindo até 3 alvos próximos.',
        cons: 'Menor penetração individual contra tanques superpesados.',
        notes: 'Salva tripla de virotes contra grupos rápidos.',
        stats: {
          range: 280,
          minRange: 0,
          fireRate: 2.35,
          damage: 98,
          damageType: 'physical',
          armorPierce: 0.35,
          multiTargets: 3,
          splashRadius: 0
        },
        tier2: {
          name: 'Bateria Quádrupla de Virotes',
          upgradeCost: 340,
          notes: '4 virotes por salva em alta cadência (2.75/s).',
          stats: {
            range: 295,
            minRange: 0,
            fireRate: 2.75,
            damage: 122,
            damageType: 'physical',
            armorPierce: 0.4,
            multiTargets: 4,
            splashRadius: 0
          }
        }
      }
    }
  },

  // 02. Metralhadora
  m2_bunker: {
    id: 'm2_bunker',
    catalogNum: 2,
    category: 'precision',
    hotkey: '2',
    name: 'Metralhadora',
    shortName: 'METRALH.',
    role: 'CADÊNCIA / GRUPOS',
    roleColor: '#facc15',
    cost: 100,
    unlockCostWB: 0,
    maxHp: 480,
    domain: 'both',
    defaultPriority: 'first',
    projectileSpeed: 1020,
    turnRate: 10.5,
    summary: 'Disparos rápidos contra grupos de infantaria, corredores e drones leves.',
    levels: [
      {
        level: 1,
        name: 'M2 Browning .50 Cal',
        range: 190,
        minRange: 0,
        fireRate: 7.5,
        damage: 12,
        damageType: 'kinetic',
        armorPierce: 0.05,
        splashRadius: 0,
        notes: '7.5 tiros/s | Dano 12 Físico.'
      },
      {
        level: 2,
        upgradeCost: 85,
        name: 'Cano Duplo Refrigerado',
        range: 205,
        minRange: 0,
        fireRate: 11,
        damage: 13,
        damageType: 'kinetic',
        armorPierce: 0.12,
        splashRadius: 0,
        notes: '11 tiros/s | Supressão contínua.'
      },
      {
        level: 3,
        upgradeCost: 135,
        name: 'M134 Minigun 7.62mm',
        range: 220,
        minRange: 0,
        fireRate: 15,
        damage: 15,
        damageType: 'kinetic',
        armorPierce: 0.2,
        splashRadius: 0,
        notes: '15 tiros/s | Cortina rotativa de 6 canos.'
      },
      {
        level: 4,
        upgradeCost: 195,
        name: 'CROWS II Estabilizada',
        range: 240,
        minRange: 0,
        fireRate: 17,
        damage: 19,
        damageType: 'kinetic',
        armorPierce: 0.3,
        laserSight: true,
        splashRadius: 0,
        notes: 'Mira laser + 17 tiros/s.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Fogo Supressivo',
        cost: 270,
        pros: 'Cadência extrema (24 tiros/s) + micro-lentidão de supressão (25%) e dano em micro-área.',
        cons: 'Baixa penetração contra blindagem pesada.',
        notes: '24 tiros/s + lentidão de supressão 25% contra grupos.',
        stats: {
          range: 255,
          minRange: 0,
          fireRate: 24,
          damage: 21,
          damageType: 'physical',
          armorPierce: 0.25,
          slowFactor: 0.25,
          slowDuration: 1.2,
          splashRadius: 22,
          laserSight: true
        },
        tier2: {
          name: 'Tormenta Vulcan GAU-19',
          upgradeCost: 390,
          notes: '28 tiros/s + 35% lentidão de supressão e estilhaços.',
          stats: {
            range: 270,
            minRange: 0,
            fireRate: 28,
            damage: 27,
            damageType: 'physical',
            armorPierce: 0.32,
            slowFactor: 0.35,
            slowDuration: 1.5,
            splashRadius: 28,
            laserSight: true
          }
        }
      },
      B: {
        id: 'B',
        name: 'Munição Perfurante',
        cost: 270,
        pros: 'Projéteis AP de tungstênio com 75% de perfuração e chance crítica.',
        cons: 'Cadência reduzida para manter estabilidade dos projéteis AP.',
        notes: '12 tiros/s | 75% perfuração + 20% crítico.',
        stats: {
          range: 265,
          minRange: 0,
          fireRate: 12,
          damage: 44,
          damageType: 'piercing',
          armorPierce: 0.75,
          critChance: 0.2,
          splashRadius: 0,
          laserSight: true
        },
        tier2: {
          name: 'Canhão Rotativo APFSDS',
          upgradeCost: 390,
          notes: '14 tiros/s | 88% perfuração + 30% crítico.',
          stats: {
            range: 285,
            minRange: 0,
            fireRate: 14,
            damage: 58,
            damageType: 'piercing',
            armorPierce: 0.88,
            critChance: 0.3,
            splashRadius: 0,
            laserSight: true
          }
        }
      }
    }
  },

  // 03. Canhão Pesado
  abrams_pit: {
    id: 'abrams_pit',
    catalogNum: 3,
    category: 'area',
    hotkey: '3',
    name: 'Canhão Pesado',
    shortName: 'CANHÃO',
    role: 'EXPLOSIVO ÁREA',
    roleColor: '#84cc16',
    cost: 290,
    unlockCostWB: 0,
    maxHp: 1850,
    isTauntTank: true,
    domain: 'ground',
    defaultPriority: 'strongest',
    projectileSpeed: 900,
    turnRate: 6.2,
    summary: 'Canhão blindado de alto HP (1850+) com explosões em área que atrai fogo inimigo.',
    levels: [
      {
        level: 1,
        name: 'Casamata Canhão 105mm',
        range: 275,
        minRange: 0,
        fireRate: 0.65,
        damage: 185,
        damageType: 'explosive',
        armorIgnore: 0.45,
        splashRadius: 68,
        maxHp: 1850,
        notes: 'Explosão 68px | Atrai ataques inimigos | 1850 HP.'
      },
      {
        level: 2,
        upgradeCost: 195,
        name: 'Abrams 120mm L/55',
        range: 300,
        minRange: 0,
        fireRate: 0.74,
        damage: 255,
        damageType: 'explosive',
        armorIgnore: 0.55,
        splashRadius: 78,
        maxHp: 2350,
        trophyCooldown: 5.0,
        notes: '2350 HP | Trophy APS (bloqueia 1 tiro/5s) | 78px área.'
      },
      {
        level: 3,
        upgradeCost: 285,
        name: 'Chobham Reforçado 125mm',
        range: 325,
        minRange: 0,
        fireRate: 0.82,
        damage: 335,
        damageType: 'explosive',
        armorIgnore: 0.65,
        splashRadius: 88,
        maxHp: 2900,
        trophyCooldown: 4.0,
        notes: '2900 HP | Explosão 88px | Trophy APS 4s.'
      },
      {
        level: 4,
        upgradeCost: 390,
        name: 'Torre Experimental 140mm',
        range: 350,
        minRange: 0,
        fireRate: 0.9,
        damage: 430,
        damageType: 'explosive',
        armorIgnore: 0.72,
        splashRadius: 96,
        maxHp: 3500,
        trophyCooldown: 3.2,
        notes: '3500 HP | 430 Dano Explosivo em 96px.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Fragmentação',
        cost: 460,
        pros: 'Raio explosivo massivo (145px) com estilhaços secundários que limpam hordas.',
        cons: 'Dano concentrado menor contra chefes únicos.',
        notes: 'Raio 145px + estilhaços em múltiplos alvos.',
        stats: {
          range: 375,
          minRange: 0,
          fireRate: 1.05,
          damage: 470,
          damageType: 'explosive',
          armorIgnore: 0.65,
          splashRadius: 145,
          shrapnelCount: 4,
          maxHp: 3800,
          trophyCooldown: 2.8
        },
        tier2: {
          name: 'Obus Cluster M830A1',
          upgradeCost: 620,
          notes: 'Raio 170px + atordoamento breve em impactos diretos.',
          stats: {
            range: 395,
            minRange: 0,
            fireRate: 1.18,
            damage: 590,
            damageType: 'explosive',
            armorIgnore: 0.72,
            splashRadius: 170,
            shrapnelCount: 6,
            stunDuration: 0.45,
            maxHp: 4200,
            trophyCooldown: 2.4
          }
        }
      },
      B: {
        id: 'B',
        name: 'Explosivos de Alto Impacto',
        cost: 460,
        pros: 'Dano altíssimo (860+) com +75% contra blindagem pesada e quebra de ERA.',
        cons: 'Área de explosão reduzida (72px) e menor cadência.',
        notes: 'Perfura 95% de blindagem + 1.75x em pesados.',
        stats: {
          range: 385,
          minRange: 0,
          fireRate: 0.78,
          damage: 860,
          damageType: 'piercing',
          armorIgnore: 0.95,
          heavyMultiplier: 1.75,
          tandemHeat: true,
          splashRadius: 72,
          maxHp: 4100,
          trophyCooldown: 2.6
        },
        tier2: {
          name: 'Munição Termocinética STAFF',
          upgradeCost: 620,
          notes: '1150 Dano APDS-HE | 2.0x contra blindados e chefes.',
          stats: {
            range: 410,
            minRange: 0,
            fireRate: 0.85,
            damage: 1150,
            damageType: 'piercing',
            armorIgnore: 0.98,
            heavyMultiplier: 2.0,
            tandemHeat: true,
            splashRadius: 84,
            maxHp: 4600,
            trophyCooldown: 2.2
          }
        }
      }
    }
  },

  // 04. Morteiro
  howitzer: {
    id: 'howitzer',
    catalogNum: 4,
    category: 'area',
    hotkey: '4',
    name: 'Morteiro',
    shortName: 'MORTEIRO',
    role: 'INDIRETO / LONGO',
    roleColor: '#fb923c',
    cost: 260,
    unlockCostWB: 0,
    maxHp: 560,
    domain: 'ground',
    defaultPriority: 'first',
    projectileSpeed: 390,
    turnRate: 4.0,
    summary: 'Ataques indiretos de longo alcance em área (alcance mínimo morto: 105px).',
    levels: [
      {
        level: 1,
        name: 'Morteiro Pesado 120mm',
        range: 490,
        minRange: 105,
        fireRate: 0.34,
        damage: 195,
        damageType: 'he',
        splashRadius: 88,
        scatter: 18,
        salvoCount: 1,
        notes: 'Alcance 490m | Área 88px | Fogo indireto.'
      },
      {
        level: 2,
        upgradeCost: 185,
        name: 'M777 Howitzer 155mm',
        range: 530,
        minRange: 105,
        fireRate: 0.38,
        damage: 265,
        damageType: 'he',
        splashRadius: 104,
        scatter: 12,
        salvoCount: 1,
        notes: 'Alcance 530m | Área 104px | Maior precisão.'
      },
      {
        level: 3,
        upgradeCost: 270,
        name: 'M982 Excalibur GPS',
        range: 570,
        minRange: 105,
        fireRate: 0.42,
        damage: 345,
        damageType: 'he',
        splashRadius: 118,
        scatter: 4,
        salvoCount: 1,
        notes: 'Guiado por GPS | Área 118px.'
      },
      {
        level: 4,
        upgradeCost: 360,
        name: 'Artilharia Dupla Automática',
        range: 610,
        minRange: 100,
        fireRate: 0.45,
        damage: 280,
        damageType: 'he',
        splashRadius: 124,
        scatter: 10,
        salvoCount: 2,
        notes: 'Dispara 2 obuses por ciclo em 610m.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Munição Incendiária',
        cost: 440,
        pros: 'Cria zonas persistentes de fogo no solo (5s) que queimam inimigos e derretem gelo/ERA.',
        cons: 'Impacto inicial menor que as bombas de fragmentação.',
        notes: 'Zonas de fogo 5s (95 DPS) + dano térmico em área.',
        stats: {
          range: 640,
          minRange: 95,
          fireRate: 0.44,
          damage: 285,
          damageType: 'fire',
          splashRadius: 135,
          scatter: 12,
          salvoCount: 2,
          burnDps: 95,
          burnDuration: 5.0
        },
        tier2: {
          name: 'Napalm Termobárico MK-77',
          upgradeCost: 590,
          notes: 'Salva de 3 projéteis incendiários + fogo de 135 DPS por 6s.',
          stats: {
            range: 670,
            minRange: 95,
            fireRate: 0.48,
            damage: 335,
            damageType: 'fire',
            splashRadius: 150,
            scatter: 14,
            salvoCount: 3,
            burnDps: 135,
            burnDuration: 6.0
          }
        }
      },
      B: {
        id: 'B',
        name: 'Bombas de Fragmentação',
        cost: 440,
        pros: 'Salvas de 4 submunições com explosões múltiplas em grande raio (155px).',
        cons: 'Dispersão maior entre os projéteis da salva.',
        notes: 'Salva de 4 obuses fragmentados em área ampla.',
        stats: {
          range: 650,
          minRange: 95,
          fireRate: 0.46,
          damage: 265,
          damageType: 'explosive',
          splashRadius: 145,
          scatter: 32,
          salvoCount: 4
        },
        tier2: {
          name: 'Tempestade DPICM-6',
          upgradeCost: 590,
          notes: '6 projéteis por salva com estilhaços perfurantes.',
          stats: {
            range: 690,
            minRange: 95,
            fireRate: 0.5,
            damage: 295,
            damageType: 'explosive',
            armorPierce: 0.35,
            splashRadius: 158,
            scatter: 36,
            salvoCount: 6
          }
        }
      }
    }
  },

  // 05. Torre de Franco-atirador
  sniper_tower: {
    id: 'sniper_tower',
    catalogNum: 5,
    category: 'precision',
    hotkey: '5',
    name: 'Torre de Franco-atirador',
    shortName: 'SNIPER',
    role: 'ALCANCE EXTREMO',
    roleColor: '#38bdf8',
    cost: 210,
    unlockCostWB: 0,
    maxHp: 420,
    domain: 'both',
    defaultPriority: 'strongest',
    projectileSpeed: 1750,
    turnRate: 12.0,
    summary: 'Alcance extremo no mapa e alto dano de precisão contra alvos prioritários.',
    levels: [
      {
        level: 1,
        name: 'Ninho de Atirador .50 BMG',
        range: 460,
        minRange: 0,
        fireRate: 0.55,
        damage: 195,
        damageType: 'piercing',
        armorPierce: 0.55,
        critChance: 0.15,
        laserSight: true,
        splashRadius: 0,
        notes: 'Alcance 460m | 195 Dano Perf. | 15% Crítico.'
      },
      {
        level: 2,
        upgradeCost: 160,
        name: 'Rifle Antimaterial Barrett M107',
        range: 530,
        minRange: 0,
        fireRate: 0.62,
        damage: 280,
        damageType: 'piercing',
        armorPierce: 0.65,
        critChance: 0.2,
        laserSight: true,
        splashRadius: 0,
        notes: 'Alcance 530m | 280 Dano | 65% Perfuração.'
      },
      {
        level: 3,
        upgradeCost: 245,
        name: 'Óptica Térmica Balística',
        range: 610,
        minRange: 0,
        fireRate: 0.68,
        damage: 380,
        damageType: 'piercing',
        armorPierce: 0.75,
        critChance: 0.25,
        laserSight: true,
        splashRadius: 0,
        notes: 'Alcance 610m | 380 Dano | 25% Crítico.'
      },
      {
        level: 4,
        upgradeCost: 340,
        name: 'Estação Sniper Autônoma',
        range: 690,
        minRange: 0,
        fireRate: 0.75,
        damage: 510,
        damageType: 'piercing',
        armorPierce: 0.85,
        critChance: 0.3,
        laserSight: true,
        splashRadius: 0,
        notes: 'Alcance 690m | 510 Dano | 30% Crítico.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Dano Crítico',
        cost: 420,
        pros: '60% de chance crítica com multiplicador 2.4x para abater chefes e especiais em poucos tiros.',
        cons: 'Atinge apenas um alvo por disparo.',
        notes: '60% Crítico (2.4x) | 840 Dano base | Alcance 780m.',
        stats: {
          range: 780,
          minRange: 0,
          fireRate: 0.8,
          damage: 840,
          damageType: 'piercing',
          armorPierce: 0.92,
          critChance: 0.6,
          critMultiplier: 2.4,
          laserSight: true,
          splashRadius: 0
        },
        tier2: {
          name: 'Calibre .50 Sabot Letal',
          upgradeCost: 560,
          notes: '75% Crítico (2.6x) | 1150 Dano | Alcance global 860m.',
          stats: {
            range: 860,
            minRange: 0,
            fireRate: 0.88,
            damage: 1150,
            damageType: 'piercing',
            armorPierce: 0.96,
            critChance: 0.75,
            critMultiplier: 2.6,
            laserSight: true,
            splashRadius: 0
          }
        }
      },
      B: {
        id: 'B',
        name: 'Perfuração de Vários Inimigos',
        cost: 420,
        pros: 'Projétil hiperveloz atravessa até 4 inimigos alinhados na trajetória.',
        cons: 'Dano em alvo único inferior ao caminho de Dano Crítico.',
        notes: 'Atravessa até 4 inimigos em linha | Alcance 760m.',
        stats: {
          range: 760,
          minRange: 0,
          fireRate: 0.88,
          damage: 660,
          damageType: 'piercing',
          armorPierce: 0.9,
          critChance: 0.25,
          pierceCount: 4,
          laserSight: true,
          splashRadius: 0
        },
        tier2: {
          name: 'Perfuração Hipersônica 6x',
          upgradeCost: 560,
          notes: 'Atravessa até 6 inimigos alinhados com 880 de dano.',
          stats: {
            range: 830,
            minRange: 0,
            fireRate: 0.95,
            damage: 880,
            damageType: 'piercing',
            armorPierce: 0.95,
            critChance: 0.3,
            pierceCount: 6,
            laserSight: true,
            splashRadius: 0
          }
        }
      }
    }
  },

  // 06. Torre Criogênica
  cryo_tower: {
    id: 'cryo_tower',
    catalogNum: 6,
    category: 'elemental',
    hotkey: '6',
    name: 'Torre Criogênica',
    shortName: 'CRIO',
    role: 'LENTIDÃO / GELO',
    roleColor: '#67e8f9',
    cost: 145,
    unlockCostWB: 0,
    maxHp: 520,
    domain: 'both',
    defaultPriority: 'first',
    projectileSpeed: 760,
    turnRate: 9.0,
    summary: 'Dispara rajadas criogênicas que desaceleram inimigos e extinguem fogo aliado.',
    levels: [
      {
        level: 1,
        name: 'Emissor Criogênico MK-1',
        range: 205,
        minRange: 0,
        fireRate: 1.5,
        damage: 24,
        damageType: 'ice',
        slowFactor: 0.32,
        slowDuration: 2.6,
        splashRadius: 56,
        notes: 'Slow 32% por 2.6s | Dano Gelo 24 em área.'
      },
      {
        level: 2,
        upgradeCost: 110,
        name: 'Câmara de Nitrogênio Líquido',
        range: 225,
        minRange: 0,
        fireRate: 1.7,
        damage: 34,
        damageType: 'ice',
        slowFactor: 0.4,
        slowDuration: 3.0,
        splashRadius: 68,
        notes: 'Slow 40% por 3.0s | Área 68px.'
      },
      {
        level: 3,
        upgradeCost: 165,
        name: 'Difusor Sub-Zero',
        range: 245,
        minRange: 0,
        fireRate: 1.9,
        damage: 46,
        damageType: 'ice',
        slowFactor: 0.48,
        slowDuration: 3.4,
        splashRadius: 80,
        notes: 'Slow 48% por 3.4s | +46 Dano Gelo.'
      },
      {
        level: 4,
        upgradeCost: 230,
        name: 'Criostato Tático Avançado',
        range: 265,
        minRange: 0,
        fireRate: 2.1,
        damage: 62,
        damageType: 'ice',
        slowFactor: 0.54,
        slowDuration: 3.8,
        splashRadius: 92,
        notes: 'Slow 54% | Pronta para especialização glacial.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Congelamento Prolongado',
        cost: 300,
        pros: 'Congela e imobiliza completamente inimigos por 1.8s além da lentidão extrema (65%).',
        cons: 'Área de impacto mais concentrada (75px).',
        notes: 'Congela alvos (1.8s stun) + 65% slow.',
        stats: {
          range: 275,
          minRange: 0,
          fireRate: 1.65,
          damage: 115,
          damageType: 'ice',
          slowFactor: 0.65,
          slowDuration: 4.5,
          freezeDuration: 1.8,
          splashRadius: 75
        },
        tier2: {
          name: 'Zero Absoluto Criogênico',
          upgradeCost: 420,
          notes: 'Congelamento de 2.4s + fragilidade térmica (+25% dano).',
          stats: {
            range: 295,
            minRange: 0,
            fireRate: 1.85,
            damage: 165,
            damageType: 'ice',
            slowFactor: 0.72,
            slowDuration: 5.0,
            freezeDuration: 2.4,
            thermalVuln: 0.25,
            splashRadius: 88
          }
        }
      },
      B: {
        id: 'B',
        name: 'Campo de Lentidão',
        cost: 300,
        pros: 'Gera campo contínuo 360° que reduz a velocidade de todos os inimigos ao redor em 55%.',
        cons: 'Não paralisa totalmente alvos individuais.',
        notes: 'Aura glacial 360° permanente (Slow 55% + DPS gelo).',
        stats: {
          range: 290,
          minRange: 0,
          fireRate: 0,
          isCryoAura: true,
          damage: 58,
          damageType: 'ice',
          slowFactor: 0.55,
          slowDuration: 1.5,
          splashRadius: 290
        },
        tier2: {
          name: 'Tempestade Ártica Perpétua',
          upgradeCost: 420,
          notes: 'Aura 330px com 66% de lentidão contínua e 95 DPS gelo.',
          stats: {
            range: 330,
            minRange: 0,
            fireRate: 0,
            isCryoAura: true,
            damage: 95,
            damageType: 'ice',
            slowFactor: 0.66,
            slowDuration: 2.0,
            splashRadius: 330
          }
        }
      }
    }
  },

  // 07. Torre Tesla
  tesla_tower: {
    id: 'tesla_tower',
    catalogNum: 7,
    category: 'elemental',
    hotkey: '7',
    name: 'Torre Tesla',
    shortName: 'TESLA',
    role: 'ARCO ELÉTRICO',
    roleColor: '#60a5fa',
    cost: 245,
    unlockCostWB: 0,
    maxHp: 560,
    domain: 'both',
    defaultPriority: 'strongest',
    projectileSpeed: 2000,
    turnRate: 14.0,
    summary: 'Dispara arcos elétricos encadeados devastadores contra escudos energéticos.',
    levels: [
      {
        level: 1,
        name: 'Bobina Tesla MK-I',
        range: 225,
        minRange: 0,
        fireRate: 1.2,
        damage: 65,
        damageType: 'electric',
        chainCount: 3,
        chainRange: 130,
        splashRadius: 0,
        notes: 'Salta entre 3 inimigos | +75% contra escudos.'
      },
      {
        level: 2,
        upgradeCost: 175,
        name: 'Bobina de Alta Tensão',
        range: 245,
        minRange: 0,
        fireRate: 1.35,
        damage: 92,
        damageType: 'electric',
        chainCount: 4,
        chainRange: 145,
        splashRadius: 0,
        notes: 'Salta entre 4 inimigos | 92 Dano Elétrico.'
      },
      {
        level: 3,
        upgradeCost: 255,
        name: 'Capacitor de Arco Voltaico',
        range: 265,
        minRange: 0,
        fireRate: 1.5,
        damage: 124,
        damageType: 'electric',
        chainCount: 5,
        chainRange: 160,
        splashRadius: 0,
        notes: '5 alvos encadeados | 124 Dano Elétrico.'
      },
      {
        level: 4,
        upgradeCost: 345,
        name: 'Torre de Relâmpagos Nv.4',
        range: 285,
        minRange: 0,
        fireRate: 1.65,
        damage: 165,
        damageType: 'electric',
        chainCount: 6,
        chainRange: 175,
        splashRadius: 0,
        notes: '6 alvos encadeados | Destrói escudos rapidamente.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Raios Encadeados',
        cost: 410,
        pros: 'Encadeamento massivo entre até 10 inimigos com baixa perda de dano por salto.',
        cons: 'Menor impacto individual contra um único chefe isolado.',
        notes: 'Salta para até 10 alvos (92% retenção por salto).',
        stats: {
          range: 315,
          minRange: 0,
          fireRate: 1.85,
          damage: 215,
          damageType: 'electric',
          chainCount: 10,
          chainRange: 210,
          chainDecay: 0.92,
          splashRadius: 0
        },
        tier2: {
          name: 'Tempestade Voltaica 14x',
          upgradeCost: 560,
          notes: '14 alvos em cadeia + 285 Dano Elétrico.',
          stats: {
            range: 340,
            minRange: 0,
            fireRate: 2.05,
            damage: 285,
            damageType: 'electric',
            chainCount: 14,
            chainRange: 230,
            chainDecay: 0.95,
            splashRadius: 0
          }
        }
      },
      B: {
        id: 'B',
        name: 'Sobrecarga Elétrica',
        cost: 410,
        pros: 'Descarga concentrada de altíssimo dano + paralisia elétrica (0.75s stun) e quebra de escudo.',
        cons: 'Atinge apenas até 3 alvos próximos.',
        notes: '390 Dano Elétrico + 0.75s Stun em até 3 alvos.',
        stats: {
          range: 300,
          minRange: 0,
          fireRate: 1.45,
          damage: 390,
          damageType: 'electric',
          chainCount: 3,
          chainRange: 150,
          chainDecay: 0.85,
          stunDuration: 0.75,
          splashRadius: 0
        },
        tier2: {
          name: 'Pulso Megavolt EMP',
          upgradeCost: 560,
          notes: '540 Dano + 1.05s Stun + desabilita defesas ativas.',
          stats: {
            range: 320,
            minRange: 0,
            fireRate: 1.6,
            damage: 540,
            damageType: 'electric',
            chainCount: 4,
            chainRange: 165,
            chainDecay: 0.88,
            stunDuration: 1.05,
            splashRadius: 0
          }
        }
      }
    }
  },

  // 08. Torre Tóxica
  toxic_tower: {
    id: 'toxic_tower',
    catalogNum: 8,
    category: 'elemental',
    hotkey: '8',
    name: 'Torre Tóxica',
    shortName: 'TÓXICA',
    role: 'VENENO / CORROSÃO',
    roleColor: '#84cc16',
    cost: 160,
    unlockCostWB: 0,
    maxHp: 500,
    domain: 'ground',
    defaultPriority: 'strongest',
    projectileSpeed: 680,
    turnRate: 8.0,
    summary: 'Dispara cápsulas químicas que envenenam continuamente e corroem blindagem.',
    levels: [
      {
        level: 1,
        name: 'Nebulizador Químico M1',
        range: 225,
        minRange: 0,
        fireRate: 1.1,
        damage: 25,
        damageType: 'poison',
        poisonDps: 28,
        poisonDuration: 4.5,
        splashRadius: 55,
        notes: 'Veneno 28 DPS por 4.5s (ignora escudos).'
      },
      {
        level: 2,
        upgradeCost: 120,
        name: 'Dispersor Neurotóxico',
        range: 245,
        minRange: 0,
        fireRate: 1.25,
        damage: 36,
        damageType: 'poison',
        poisonDps: 42,
        poisonDuration: 5.0,
        splashRadius: 68,
        notes: 'Veneno 42 DPS por 5s | Área 68px.'
      },
      {
        level: 3,
        upgradeCost: 175,
        name: 'Reator Ácido Pressurizado',
        range: 265,
        minRange: 0,
        fireRate: 1.4,
        damage: 50,
        damageType: 'poison',
        poisonDps: 60,
        poisonDuration: 5.5,
        corrosionAmount: 0.18,
        splashRadius: 80,
        notes: 'Veneno 60 DPS + Corrosão (-18% blindagem).'
      },
      {
        level: 4,
        upgradeCost: 245,
        name: 'Bateria Química Avançada',
        range: 285,
        minRange: 0,
        fireRate: 1.55,
        damage: 68,
        damageType: 'poison',
        poisonDps: 84,
        poisonDuration: 6.0,
        corrosionAmount: 0.25,
        splashRadius: 92,
        notes: 'Veneno 84 DPS + Corrosão (-25% blindagem).'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Contaminação em Área',
        cost: 320,
        pros: 'Cria poças tóxicas persistentes no solo (6s) que infectam grupos inteiros e reduzem cura inimiga.',
        cons: 'Menos focada na quebra de blindagem pesada.',
        notes: 'Poças tóxicas 6s + 135 DPS veneno em 125px.',
        stats: {
          range: 310,
          minRange: 0,
          fireRate: 1.5,
          damage: 95,
          damageType: 'poison',
          poisonDps: 135,
          poisonDuration: 6.5,
          corrosionAmount: 0.25,
          createsToxicZone: true,
          burnDps: 90,
          burnDuration: 5.5,
          splashRadius: 125
        },
        tier2: {
          name: 'Nuvem Pestilenta Letal',
          upgradeCost: 440,
          notes: 'Poças 7s (130 DPS) + veneno 185 DPS + 20% slow.',
          stats: {
            range: 335,
            minRange: 0,
            fireRate: 1.7,
            damage: 130,
            damageType: 'poison',
            poisonDps: 185,
            poisonDuration: 7.5,
            corrosionAmount: 0.3,
            createsToxicZone: true,
            burnDps: 130,
            burnDuration: 6.5,
            slowFactor: 0.2,
            slowDuration: 2.5,
            splashRadius: 145
          }
        }
      },
      B: {
        id: 'B',
        name: 'Corrosão de Blindagem',
        cost: 320,
        pros: 'Ácido molecular reduz a blindagem e resistências do alvo em até 65% por 8s.',
        cons: 'Área de impacto menor (68px).',
        notes: 'Corrói 65% da blindagem + 165 DPS ácido.',
        stats: {
          range: 315,
          minRange: 0,
          fireRate: 1.75,
          damage: 140,
          damageType: 'poison',
          poisonDps: 165,
          poisonDuration: 7.0,
          corrosionAmount: 0.65,
          splashRadius: 68
        },
        tier2: {
          name: 'Ácido Dissolvente Molecular',
          upgradeCost: 440,
          notes: 'Corrói 80% da blindagem + amplifica todo dano em +25%.',
          stats: {
            range: 340,
            minRange: 0,
            fireRate: 1.95,
            damage: 195,
            damageType: 'poison',
            poisonDps: 230,
            poisonDuration: 8.0,
            corrosionAmount: 0.8,
            thermalVuln: 0.25,
            splashRadius: 76
          }
        }
      }
    }
  },

  // 09. Lança-chamas
  flamethrower: {
    id: 'flamethrower',
    catalogNum: 9,
    category: 'elemental',
    hotkey: '9',
    name: 'Lança-chamas',
    shortName: 'CHAMAS',
    role: 'CONE / QUEIMADURA',
    roleColor: '#f97316',
    cost: 175,
    unlockCostWB: 0,
    maxHp: 620,
    domain: 'ground',
    defaultPriority: 'first',
    projectileSpeed: 720,
    turnRate: 9.0,
    summary: 'Jato de chamas em cone que incinera grupos, derrete ERA e revela furtivos próximos.',
    levels: [
      {
        level: 1,
        name: 'Projetor de Chamas M2',
        range: 165,
        minRange: 0,
        fireRate: 4.5,
        damage: 24,
        damageType: 'fire',
        coneAngle: 0.72,
        burnDps: 32,
        burnDuration: 3.5,
        splashRadius: 52,
        notes: 'Cone frontal | 24 Dano + 32 DPS queimadura.'
      },
      {
        level: 2,
        upgradeCost: 130,
        name: 'Lança-Chamas Pressurizado',
        range: 180,
        minRange: 0,
        fireRate: 5.0,
        damage: 33,
        damageType: 'fire',
        coneAngle: 0.8,
        burnDps: 45,
        burnDuration: 4.0,
        splashRadius: 62,
        notes: 'Cone ampliado | 45 DPS queimadura.'
      },
      {
        level: 3,
        upgradeCost: 190,
        name: 'Canhão Termobárico Curto',
        range: 195,
        minRange: 0,
        fireRate: 5.5,
        damage: 44,
        damageType: 'fire',
        coneAngle: 0.88,
        burnDps: 62,
        burnDuration: 4.5,
        splashRadius: 72,
        notes: 'Derrete ERA + revela furtivos atingidos.'
      },
      {
        level: 4,
        upgradeCost: 265,
        name: 'Fornalha Dupla de Napalm',
        range: 210,
        minRange: 0,
        fireRate: 6.0,
        damage: 58,
        damageType: 'fire',
        coneAngle: 0.95,
        burnDps: 84,
        burnDuration: 5.0,
        splashRadius: 82,
        notes: 'Alta saturação térmica | 84 DPS queimadura.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Chamas Intensificadas',
        cost: 330,
        pros: 'Fogo azul de altíssima temperatura (+110% dano direto e penetração térmica contra blindados).',
        cons: 'Alcance permanece curto (225px).',
        notes: 'Chama azul 115 Dano/tick + 135 DPS queimadura.',
        stats: {
          range: 225,
          minRange: 0,
          fireRate: 6.5,
          damage: 115,
          damageType: 'fire',
          coneAngle: 1.0,
          burnDps: 135,
          burnDuration: 5.5,
          thermalVuln: 0.25,
          splashRadius: 86
        },
        tier2: {
          name: 'Incinerador Plasma-Térmico',
          upgradeCost: 460,
          notes: '160 Dano/tick + 185 DPS + +35% vulnerabilidade térmica.',
          stats: {
            range: 240,
            minRange: 0,
            fireRate: 7.2,
            damage: 160,
            damageType: 'fire',
            coneAngle: 1.05,
            burnDps: 185,
            burnDuration: 6.0,
            thermalVuln: 0.35,
            splashRadius: 92
          }
        }
      },
      B: {
        id: 'B',
        name: 'Combustível Aderente',
        cost: 330,
        pros: 'Alcance estendido (260px), cone amplo e poças aderentes no chão que desaceleram em 30%.',
        cons: 'Dano direto por jato menor que Chamas Intensificadas.',
        notes: 'Cone amplo 260m + poças de napalm + 30% slow.',
        stats: {
          range: 260,
          minRange: 0,
          fireRate: 5.5,
          damage: 78,
          damageType: 'fire',
          coneAngle: 1.25,
          burnDps: 120,
          burnDuration: 6.5,
          slowFactor: 0.3,
          slowDuration: 2.5,
          createsFireZone: true,
          splashRadius: 95
        },
        tier2: {
          name: 'Mar de Napalm Adesivo',
          upgradeCost: 460,
          notes: 'Alcance 285m + 165 DPS contínuo + 40% lentidão.',
          stats: {
            range: 285,
            minRange: 0,
            fireRate: 6.0,
            damage: 105,
            damageType: 'fire',
            coneAngle: 1.35,
            burnDps: 165,
            burnDuration: 7.5,
            slowFactor: 0.4,
            slowDuration: 3.0,
            createsFireZone: true,
            splashRadius: 110
          }
        }
      }
    }
  },

  // 10. Emissor Laser
  helios_laser: {
    id: 'helios_laser',
    catalogNum: 10,
    category: 'elemental',
    hotkey: '0',
    name: 'Emissor Laser',
    shortName: 'LASER',
    role: 'ENERGIA CONTÍNUA',
    roleColor: '#38bdf8',
    cost: 420,
    unlockCostWB: 0,
    maxHp: 740,
    isContinuousLaser: true,
    domain: 'both',
    defaultPriority: 'strongest',
    projectileSpeed: 2000,
    turnRate: 11.0,
    summary: 'Feixe de energia contínua que ignora APS/ERA e amplifica dano no mesmo alvo.',
    levels: [
      {
        level: 1,
        name: 'AN/SEQ-3 HELIOS 100kW',
        range: 330,
        minRange: 0,
        fireRate: 10,
        damage: 145,
        damageType: 'laser',
        splashRadius: 0,
        beamTargets: 1,
        maxRampBonus: 1.5,
        rampRate: 0.4,
        thermalVuln: 0,
        notes: '145 DPS contínuo (rampa até +150%) | Ignora APS/ERA.'
      },
      {
        level: 2,
        upgradeCost: 290,
        name: 'Feixe Alta Frequência 250kW',
        range: 360,
        minRange: 0,
        fireRate: 10,
        damage: 210,
        damageType: 'laser',
        splashRadius: 0,
        beamTargets: 1,
        maxRampBonus: 1.8,
        rampRate: 0.48,
        thermalVuln: 0.15,
        notes: '210 DPS base | +15% vulnerabilidade térmica.'
      },
      {
        level: 3,
        upgradeCost: 410,
        name: 'Iron Beam 450kW',
        range: 390,
        minRange: 0,
        fireRate: 10,
        damage: 285,
        damageType: 'laser',
        splashRadius: 0,
        beamTargets: 1,
        maxRampBonus: 2.0,
        rampRate: 0.55,
        thermalVuln: 0.25,
        notes: '285 DPS base (até 855 DPS) | +25% vuln. térmica.'
      },
      {
        level: 4,
        upgradeCost: 540,
        name: 'Emissor Prismático Avançado',
        range: 420,
        minRange: 0,
        fireRate: 10,
        damage: 365,
        damageType: 'laser',
        splashRadius: 0,
        beamTargets: 1,
        maxRampBonus: 2.2,
        rampRate: 0.65,
        thermalVuln: 0.35,
        notes: '365 DPS base (até 1168 DPS) | Pronto para especializar.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Concentração de Energia',
        cost: 620,
        pros: 'Rampa extrema de até +350% de dano em alvo único — derrete Chefes e Titãs.',
        cons: 'Mantém apenas 1 feixe por vez; lento contra grandes enxames.',
        notes: '1 feixe até +350% DPS (2340 DPS máximo!) + +45% vuln.',
        stats: {
          range: 455,
          minRange: 0,
          fireRate: 10,
          damage: 520,
          damageType: 'laser',
          beamTargets: 1,
          maxRampBonus: 3.5,
          rampRate: 0.9,
          thermalVuln: 0.45,
          splashRadius: 0
        },
        tier2: {
          name: 'Feixe Hiperfocado Ômega',
          upgradeCost: 820,
          notes: '690 DPS base até +420% (3588 DPS focado!).',
          stats: {
            range: 485,
            minRange: 0,
            fireRate: 10,
            damage: 690,
            damageType: 'laser',
            beamTargets: 1,
            maxRampBonus: 4.2,
            rampRate: 1.1,
            thermalVuln: 0.55,
            splashRadius: 0
          }
        }
      },
      B: {
        id: 'B',
        name: 'Feixe Dividido',
        cost: 620,
        pros: 'Dispara 3 feixes simultâneos em alvos diferentes (4 no nível máximo).',
        cons: 'Rampa máxima reduzida (+150%) em comparação à Concentração.',
        notes: '3 feixes simultâneos (360 DPS cada) + arco térmico.',
        stats: {
          range: 440,
          minRange: 0,
          fireRate: 10,
          damage: 360,
          damageType: 'laser',
          beamTargets: 3,
          maxRampBonus: 1.5,
          rampRate: 0.55,
          thermalVuln: 0.3,
          splashRadius: 0
        },
        tier2: {
          name: 'Matriz Quádrupla Iron Beam',
          upgradeCost: 820,
          notes: '4 feixes simultâneos (450 DPS cada) cobrindo terra e ar.',
          stats: {
            range: 470,
            minRange: 0,
            fireRate: 10,
            damage: 450,
            damageType: 'laser',
            beamTargets: 4,
            maxRampBonus: 1.75,
            rampRate: 0.65,
            thermalVuln: 0.35,
            splashRadius: 0
          }
        }
      }
    }
  },

  // 11. Canhão Railgun
  railgun: {
    id: 'railgun',
    catalogNum: 11,
    category: 'precision',
    hotkey: '-',
    name: 'Canhão Railgun',
    shortName: 'RAILGUN',
    role: 'PERFURAÇÃO LINEAR',
    roleColor: '#22d3ee',
    cost: 440,
    unlockCostWB: 0,
    maxHp: 680,
    domain: 'both',
    defaultPriority: 'strongest',
    projectileSpeed: 2400,
    turnRate: 7.5,
    summary: 'Disparo eletromagnético que atravessa múltiplos alvos em linha e perfura blindagem.',
    levels: [
      {
        level: 1,
        name: 'Railgun Eletromagnético M1',
        range: 420,
        minRange: 0,
        fireRate: 0.48,
        damage: 280,
        damageType: 'piercing',
        armorIgnore: 0.85,
        pierceCount: 3,
        splashRadius: 0,
        notes: 'Atravessa 3 alvos em linha | Ignora 85% blindagem.'
      },
      {
        level: 2,
        upgradeCost: 310,
        name: 'Trilhos Supercondutores 32MJ',
        range: 460,
        minRange: 0,
        fireRate: 0.54,
        damage: 390,
        damageType: 'piercing',
        armorIgnore: 0.9,
        pierceCount: 4,
        splashRadius: 0,
        notes: 'Atravessa 4 alvos | 390 Dano | Ignora 90% blindagem.'
      },
      {
        level: 3,
        upgradeCost: 430,
        name: 'Canhão Maglev Mach 7',
        range: 500,
        minRange: 0,
        fireRate: 0.6,
        damage: 520,
        damageType: 'piercing',
        armorIgnore: 0.94,
        pierceCount: 5,
        splashRadius: 0,
        notes: 'Atravessa 5 alvos | 520 Dano | Ignora 94% blindagem.'
      },
      {
        level: 4,
        upgradeCost: 560,
        name: 'Acelerador Linear Blitzer',
        range: 540,
        minRange: 0,
        fireRate: 0.66,
        damage: 680,
        damageType: 'piercing',
        armorIgnore: 0.96,
        pierceCount: 6,
        splashRadius: 0,
        notes: 'Atravessa 6 alvos | 680 Dano hipersônico.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Perfuração Extrema',
        cost: 640,
        pros: 'Atravessa até 10 inimigos no corredor inteiro com 1150 de dano e +40% em blindados.',
        cons: 'Intervalo de recarga dos capacitores maior (0.62 tiros/s).',
        notes: '1150 Dano linear atravessando até 10 alvos.',
        stats: {
          range: 620,
          minRange: 0,
          fireRate: 0.62,
          damage: 1150,
          damageType: 'piercing',
          armorIgnore: 1.0,
          heavyMultiplier: 1.4,
          pierceCount: 10,
          splashRadius: 0
        },
        tier2: {
          name: 'Canhão Hipersônico 64MJ',
          upgradeCost: 840,
          notes: '1550 Dano linear (12 alvos) + 1.6x contra pesados.',
          stats: {
            range: 680,
            minRange: 0,
            fireRate: 0.7,
            damage: 1550,
            damageType: 'piercing',
            armorIgnore: 1.0,
            heavyMultiplier: 1.6,
            pierceCount: 12,
            splashRadius: 0
          }
        }
      },
      B: {
        id: 'B',
        name: 'Quebra de Blindagem',
        cost: 640,
        pros: 'Estilhaça armadura/ERA e reduz blindagem e resistência dos atingidos em 60% + onda EMP leve.',
        cons: 'Atravessa menos alvos (5) que a Perfuração Extrema.',
        notes: 'Quebra ERA e reduz 60% da armadura dos atingidos.',
        stats: {
          range: 580,
          minRange: 0,
          fireRate: 0.78,
          damage: 860,
          damageType: 'piercing',
          armorIgnore: 0.98,
          tandemHeat: true,
          corrosionAmount: 0.6,
          pierceCount: 5,
          splashRadius: 38
        },
        tier2: {
          name: 'Ruptura Sabot Magnetizada',
          upgradeCost: 840,
          notes: 'Quebra 75% da armadura + atordoa mecanizados por 0.6s.',
          stats: {
            range: 620,
            minRange: 0,
            fireRate: 0.86,
            damage: 1120,
            damageType: 'piercing',
            armorIgnore: 1.0,
            tandemHeat: true,
            corrosionAmount: 0.75,
            stunDuration: 0.6,
            pierceCount: 6,
            splashRadius: 46
          }
        }
      }
    }
  },

  // 12. Lançador de Mísseis AA
  patriot: {
    id: 'patriot',
    catalogNum: 12,
    category: 'elemental',
    hotkey: '=',
    name: 'Lançador de Mísseis AA',
    shortName: 'MÍSSEIS AA',
    role: 'ANTIAÉREO SAM',
    roleColor: '#22d3ee',
    cost: 320,
    unlockCostWB: 0,
    maxHp: 700,
    domain: 'air',
    defaultPriority: 'strongest',
    projectileSpeed: 680,
    turnRate: 9.5,
    summary: 'Especialista em inimigos voadores com longo alcance. Nv2+ integra radar AESA global.',
    levels: [
      {
        level: 1,
        name: 'MIM-104 Patriot PAC-3',
        range: 540,
        minRange: 0,
        fireRate: 0.55,
        damage: 340,
        damageType: 'aa_missile',
        multiTargets: 1,
        globalStealthReveal: false,
        splashRadius: 34,
        notes: 'Alcance 540m | 340 Dano AA | Exclusivo aéreo.'
      },
      {
        level: 2,
        upgradeCost: 220,
        name: 'Radar AN/MPQ-65 AESA',
        range: 600,
        minRange: 0,
        fireRate: 0.62,
        damage: 440,
        damageType: 'aa_missile',
        multiTargets: 1,
        globalStealthReveal: true,
        splashRadius: 40,
        notes: 'AESA Global: Revela Stealth aéreos em todo o mapa!'
      },
      {
        level: 3,
        upgradeCost: 320,
        name: 'Lançador Duplo PAC-3 MSE',
        range: 650,
        minRange: 0,
        fireRate: 0.7,
        damage: 480,
        damageType: 'aa_missile',
        multiTargets: 2,
        globalStealthReveal: true,
        splashRadius: 44,
        notes: '2 mísseis simultâneos contra alvos aéreos.'
      },
      {
        level: 4,
        upgradeCost: 430,
        name: 'Quad-Pack Estratégico',
        range: 700,
        minRange: 0,
        fireRate: 0.76,
        damage: 530,
        damageType: 'aa_missile',
        multiTargets: 3,
        globalStealthReveal: true,
        splashRadius: 48,
        notes: '3 mísseis simultâneos em 700m.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Mísseis Interceptadores',
        cost: 490,
        pros: 'Ogivas cinéticas de precisão (1150 dano) que atravessam APS aéreo e abatem chefes voadores.',
        cons: 'Dispara 2 mísseis focados por salva.',
        notes: 'Ignora APS + 1150 Dano AA contra aeronaves pesadas.',
        stats: {
          range: 780,
          minRange: 0,
          fireRate: 0.85,
          damage: 1150,
          damageType: 'aa_missile',
          multiTargets: 2,
          globalStealthReveal: true,
          allowApsBypass: true,
          splashRadius: 44
        },
        tier2: {
          name: 'THAAD Exo-Atmosférico',
          upgradeCost: 650,
          notes: '1550 Dano AA anti-chefe + ignora APS + alcance 850m.',
          stats: {
            range: 850,
            minRange: 0,
            fireRate: 0.95,
            damage: 1550,
            damageType: 'aa_missile',
            multiTargets: 2,
            globalStealthReveal: true,
            allowApsBypass: true,
            splashRadius: 50
          }
        }
      },
      B: {
        id: 'B',
        name: 'Enxame de Mísseis',
        cost: 490,
        pros: 'Dispara 6 mísseis simultâneos para limpar esquadrões inteiros de drones.',
        cons: 'Dano menor por míssil individual contra chefes blindados.',
        notes: 'Salva de 6 mísseis AA (420 dano cada) com área.',
        stats: {
          range: 740,
          minRange: 0,
          fireRate: 0.88,
          damage: 420,
          damageType: 'aa_missile',
          multiTargets: 6,
          globalStealthReveal: true,
          splashRadius: 64
        },
        tier2: {
          name: 'Colmeia SAM 8-Cell',
          upgradeCost: 650,
          notes: '8 mísseis simultâneos em 800m com explosão ampliada.',
          stats: {
            range: 800,
            minRange: 0,
            fireRate: 1.0,
            damage: 510,
            damageType: 'aa_missile',
            multiTargets: 8,
            globalStealthReveal: true,
            splashRadius: 76
          }
        }
      }
    }
  },

  // 13. Canhão Antiaéreo Flak
  phalanx: {
    id: 'phalanx',
    catalogNum: 13,
    category: 'elemental',
    hotkey: 'z',
    name: 'Canhão Antiaéreo Flak',
    shortName: 'FLAK AA',
    role: 'EXPLOSÃO AÉREA',
    roleColor: '#38bdf8',
    cost: 215,
    unlockCostWB: 0,
    maxHp: 640,
    domain: 'both',
    defaultPriority: 'air_first',
    projectileSpeed: 1120,
    turnRate: 14.0,
    summary: 'Dispara rajadas rápidas com munição flak que explode contra unidades aéreas.',
    levels: [
      {
        level: 1,
        name: 'Flak 35mm Oerlikon / CIWS',
        range: 270,
        minRange: 0,
        fireRate: 6.5,
        damage: 34,
        damageType: 'aa',
        critChance: 0.1,
        splashRadius: 48,
        notes: '6.5 tiros/s | Explosão aérea 48px.'
      },
      {
        level: 2,
        upgradeCost: 155,
        name: 'Gepard Duplo 35mm',
        range: 300,
        minRange: 0,
        fireRate: 8.5,
        damage: 42,
        damageType: 'aa',
        critChance: 0.18,
        splashRadius: 58,
        notes: '8.5 tiros/s | Explosão 58px | 18% crítico.'
      },
      {
        level: 3,
        upgradeCost: 225,
        name: 'Radar Ku-Band AHEAD',
        range: 335,
        minRange: 0,
        fireRate: 11,
        damage: 50,
        damageType: 'aa',
        critChance: 0.25,
        splashRadius: 68,
        notes: '11 tiros/s | 68px área | +50% em aéreos.'
      },
      {
        level: 4,
        upgradeCost: 310,
        name: 'Centurion C-RAM HEIT-SD',
        range: 365,
        minRange: 0,
        fireRate: 13,
        damage: 60,
        damageType: 'aa',
        critChance: 0.3,
        splashRadius: 78,
        notes: '13 tiros/s | Estilhaços HEIT-SD de 78px.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Explosão Aérea Ampliada',
        cost: 370,
        pros: 'Raio de detonação gigante (135px) que destrói nuvens inteiras de drones de uma vez.',
        cons: 'Cadência reduzida para munição pesada de 57mm.',
        notes: 'Canhão 57mm Flak: 135px explosão aérea + estilhaços.',
        stats: {
          range: 410,
          minRange: 0,
          fireRate: 6.0,
          damage: 165,
          damageType: 'explosive',
          critChance: 0.25,
          splashRadius: 135
        },
        tier2: {
          name: 'Flak Pesado 76mm Skyshield',
          upgradeCost: 510,
          notes: 'Raio 165px | 235 Dano explosivo aéreo.',
          stats: {
            range: 445,
            minRange: 0,
            fireRate: 7.0,
            damage: 235,
            damageType: 'explosive',
            critChance: 0.32,
            splashRadius: 165
          }
        }
      },
      B: {
        id: 'B',
        name: 'Munição de Proximidade',
        cost: 370,
        pros: 'Cadência altíssima (22 tiros/s) com espoleta de proximidade e 50% de crítico contra aeronaves.',
        cons: 'Raio de explosão menor (68px).',
        notes: '22 tiros/s + 50% crítico com espoleta inteligente.',
        stats: {
          range: 400,
          minRange: 0,
          fireRate: 22,
          damage: 58,
          damageType: 'aa',
          critChance: 0.5,
          splashRadius: 68
        },
        tier2: {
          name: 'Mantis Skyranger 30mm',
          upgradeCost: 510,
          notes: '26 tiros/s | 60% crítico | Perfuração 35%.',
          stats: {
            range: 430,
            minRange: 0,
            fireRate: 26,
            damage: 76,
            damageType: 'aa',
            armorPierce: 0.35,
            critChance: 0.6,
            splashRadius: 76
          }
        }
      }
    }
  },

  // 14. Torre de Arpões
  harpoon_tower: {
    id: 'harpoon_tower',
    catalogNum: 14,
    category: 'support',
    hotkey: 'x',
    name: 'Torre de Arpões',
    shortName: 'ARPÕES',
    role: 'IMOBILIZAÇÃO',
    roleColor: '#14b8a6',
    cost: 165,
    unlockCostWB: 0,
    maxHp: 560,
    domain: 'both',
    defaultPriority: 'first',
    projectileSpeed: 960,
    turnRate: 10.0,
    summary: 'Dispara arpões magnéticos que imobilizam alvos rápidos e aéreos no lugar.',
    levels: [
      {
        level: 1,
        name: 'Lançador de Arpões Tático',
        range: 250,
        minRange: 0,
        fireRate: 0.75,
        damage: 55,
        damageType: 'piercing',
        rootDuration: 1.5,
        slowFactor: 0.35,
        slowDuration: 2.5,
        splashRadius: 0,
        notes: 'Imobiliza alvo por 1.5s + 35% slow após soltar.'
      },
      {
        level: 2,
        upgradeCost: 125,
        name: 'Arpões Pneumáticos Duplos',
        range: 275,
        minRange: 0,
        fireRate: 0.88,
        damage: 80,
        damageType: 'piercing',
        rootDuration: 1.85,
        slowFactor: 0.4,
        slowDuration: 3.0,
        splashRadius: 0,
        notes: 'Imobiliza 1.85s | Puxa atenção de rápidos.'
      },
      {
        level: 3,
        upgradeCost: 185,
        name: 'Âncora Magnética Pesada',
        range: 300,
        minRange: 0,
        fireRate: 1.0,
        damage: 112,
        damageType: 'piercing',
        armorPierce: 0.4,
        rootDuration: 2.2,
        slowFactor: 0.45,
        slowDuration: 3.5,
        splashRadius: 0,
        notes: 'Imobiliza 2.2s | Perfura 40% blindagem.'
      },
      {
        level: 4,
        upgradeCost: 260,
        name: 'Guinchos de Contenção Nv.4',
        range: 325,
        minRange: 0,
        fireRate: 1.12,
        damage: 148,
        damageType: 'piercing',
        armorPierce: 0.5,
        rootDuration: 2.5,
        slowFactor: 0.5,
        slowDuration: 4.0,
        splashRadius: 0,
        notes: 'Imobiliza 2.5s | Pronta para especialização.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Imobilização Prolongada',
        cost: 330,
        pros: 'Trava alvos de alto valor por até 4.0s e reduz sua defesa (+25% dano recebido).',
        cons: 'Foca em um único alvo prioritário por disparo.',
        notes: 'Prende por 4.0s + marca +25% vulnerabilidade.',
        stats: {
          range: 370,
          minRange: 0,
          fireRate: 1.15,
          damage: 280,
          damageType: 'piercing',
          armorPierce: 0.75,
          rootDuration: 4.0,
          slowFactor: 0.6,
          slowDuration: 4.5,
          markedAmp: 0.25,
          splashRadius: 0
        },
        tier2: {
          name: 'Grilhão Titânico de Aço',
          upgradeCost: 450,
          notes: 'Prende por 5.0s + 390 Dano + +35% vulnerabilidade.',
          stats: {
            range: 405,
            minRange: 0,
            fireRate: 1.25,
            damage: 390,
            damageType: 'piercing',
            armorPierce: 0.85,
            rootDuration: 5.0,
            slowFactor: 0.65,
            slowDuration: 5.0,
            markedAmp: 0.35,
            splashRadius: 0
          }
        }
      },
      B: {
        id: 'B',
        name: 'Controle de Grupos',
        cost: 330,
        pros: 'Dispara redes de 3 arpões simultâneos prendendo grupos e puxando inimigos para trás.',
        cons: 'Imobilização individual mais curta (2.2s).',
        notes: 'Prende até 3 inimigos por disparo em área.',
        stats: {
          range: 350,
          minRange: 0,
          fireRate: 1.3,
          damage: 165,
          damageType: 'piercing',
          armorPierce: 0.45,
          multiTargets: 3,
          rootDuration: 2.2,
          slowFactor: 0.55,
          slowDuration: 4.0,
          splashRadius: 48
        },
        tier2: {
          name: 'Rede Magnética Quíntupla',
          upgradeCost: 450,
          notes: 'Prende até 5 inimigos por disparo + 55% slow.',
          stats: {
            range: 380,
            minRange: 0,
            fireRate: 1.45,
            damage: 215,
            damageType: 'piercing',
            armorPierce: 0.55,
            multiTargets: 5,
            rootDuration: 2.6,
            slowFactor: 0.62,
            slowDuration: 4.5,
            splashRadius: 62
          }
        }
      }
    }
  },

  // 15. Bateria de Foguetes
  tos1_mlrs: {
    id: 'tos1_mlrs',
    catalogNum: 15,
    category: 'area',
    hotkey: 'c',
    name: 'Bateria de Foguetes',
    shortName: 'FOGUETES',
    role: 'BOMBARDEIO ÁREA',
    roleColor: '#f97316',
    cost: 460,
    unlockCostWB: 0,
    maxHp: 720,
    createsFireZone: true,
    domain: 'ground',
    defaultPriority: 'first',
    projectileSpeed: 430,
    turnRate: 4.8,
    summary: 'Bombardeia grandes grupos com salvas de foguetes múltiplos e pressão explosiva.',
    levels: [
      {
        level: 1,
        name: 'Lançador MLRS 4 Tubos',
        range: 460,
        minRange: 80,
        fireRate: 0.28,
        damage: 120,
        damageType: 'explosive',
        splashRadius: 86,
        scatter: 26,
        salvoCount: 4,
        notes: 'Salva de 4 foguetes | Área 86px.'
      },
      {
        level: 2,
        upgradeCost: 310,
        name: 'TOS-1A Solntsepek 6 Tubos',
        range: 500,
        minRange: 80,
        fireRate: 0.3,
        damage: 148,
        damageType: 'thermobaric',
        splashRadius: 96,
        scatter: 24,
        salvoCount: 6,
        burnDps: 55,
        burnDuration: 3.5,
        notes: '6 foguetes termobáricos + fogo 3.5s.'
      },
      {
        level: 3,
        upgradeCost: 430,
        name: 'M270A2 Precisão 8 Tubos',
        range: 540,
        minRange: 80,
        fireRate: 0.32,
        damage: 175,
        damageType: 'thermobaric',
        splashRadius: 108,
        scatter: 20,
        salvoCount: 8,
        burnDps: 75,
        burnDuration: 4.0,
        notes: '8 foguetes + fogo 4.0s (75 DPS).'
      },
      {
        level: 4,
        upgradeCost: 560,
        name: 'Bateria Dupla HIMARS 10x',
        range: 580,
        minRange: 80,
        fireRate: 0.34,
        damage: 205,
        damageType: 'thermobaric',
        splashRadius: 116,
        scatter: 18,
        salvoCount: 10,
        burnDps: 95,
        burnDuration: 4.5,
        notes: '10 foguetes por salva | Raio 116px.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Bombardeio de Saturação',
        cost: 640,
        pros: 'Dispara 16 foguetes cobrindo toda a zona inimiga com fogo contínuo.',
        cons: 'Dispersão ampla; menos preciso em alvos solitários.',
        notes: '16 foguetes por salva + zonas de fogo de 130 DPS.',
        stats: {
          range: 640,
          minRange: 80,
          fireRate: 0.35,
          damage: 225,
          damageType: 'thermobaric',
          splashRadius: 132,
          scatter: 42,
          salvoCount: 16,
          burnDps: 130,
          burnDuration: 5.5
        },
        tier2: {
          name: 'Chuva de Fogo Apocalipse 20x',
          upgradeCost: 840,
          notes: '20 foguetes por salva + fogo persistente 170 DPS.',
          stats: {
            range: 680,
            minRange: 80,
            fireRate: 0.38,
            damage: 270,
            damageType: 'thermobaric',
            splashRadius: 145,
            scatter: 46,
            salvoCount: 20,
            burnDps: 170,
            burnDuration: 6.5
          }
        }
      },
      B: {
        id: 'B',
        name: 'Ogivas de Cerco',
        cost: 640,
        pros: '8 foguetes guiados pesados com +65% contra blindagem pesada e sem dispersão aleatória.',
        cons: 'Quantidade menor de foguetes que o Bombardeio de Saturação.',
        notes: '8 foguetes guiados (460 dano + quebra de ERA).',
        stats: {
          range: 650,
          minRange: 70,
          fireRate: 0.38,
          damage: 460,
          damageType: 'heat',
          heavyMultiplier: 1.65,
          tandemHeat: true,
          splashRadius: 102,
          scatter: 6,
          salvoCount: 8,
          burnDps: 80,
          burnDuration: 4.0
        },
        tier2: {
          name: 'Mísseis ATACMS de Cerco',
          upgradeCost: 840,
          notes: '10 foguetes guiados de 610 dano + 1.85x em pesados.',
          stats: {
            range: 700,
            minRange: 70,
            fireRate: 0.42,
            damage: 610,
            damageType: 'heat',
            heavyMultiplier: 1.85,
            tandemHeat: true,
            splashRadius: 112,
            scatter: 4,
            salvoCount: 10,
            burnDps: 110,
            burnDuration: 4.5
          }
        }
      }
    }
  },

  // 16. Campo Minado
  minefield: {
    id: 'minefield',
    catalogNum: 16,
    category: 'area',
    hotkey: 'v',
    name: 'Campo Minado',
    shortName: 'MINAS',
    role: 'ARMADILHA / PROX.',
    roleColor: '#ef4444',
    cost: 95,
    unlockCostWB: 0,
    maxHp: 500,
    isMineLayer: true,
    domain: 'ground',
    defaultPriority: 'first',
    turnRate: 0,
    summary: 'Instala minas de proximidade na rota terrestre; eficaz contra escavadores e enxames.',
    levels: [
      {
        level: 1,
        name: 'Dispersor de Minas M15',
        range: 175,
        minRange: 0,
        fireRate: 0.32,
        damage: 145,
        damageType: 'explosive',
        maxMines: 4,
        splashRadius: 72,
        notes: 'Até 4 minas na pista | 145 Dano Explosivo.'
      },
      {
        level: 2,
        upgradeCost: 80,
        name: 'Minas Antitanque M21',
        range: 195,
        minRange: 0,
        fireRate: 0.42,
        damage: 210,
        damageType: 'explosive',
        maxMines: 6,
        splashRadius: 82,
        notes: 'Até 6 minas | 210 Dano | Força emersão de escavadores.'
      },
      {
        level: 3,
        upgradeCost: 130,
        name: 'Sistema Automático Volcano',
        range: 215,
        minRange: 0,
        fireRate: 0.55,
        damage: 285,
        damageType: 'explosive',
        maxMines: 8,
        splashRadius: 94,
        notes: 'Até 8 minas | Recarga rápida (0.55/s).'
      },
      {
        level: 4,
        upgradeCost: 190,
        name: 'Campo Minado Inteligente Nv.4',
        range: 240,
        minRange: 0,
        fireRate: 0.68,
        damage: 375,
        damageType: 'explosive',
        maxMines: 10,
        splashRadius: 105,
        notes: 'Até 10 minas | 375 Dano em 105px.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Minas Explosivas',
        cost: 260,
        pros: 'Minas termobáricas de altíssimo poder destrutivo (720 dano em 140px) e fogo residual.',
        cons: 'Menos controle eletrônico que as Minas Eletromagnéticas.',
        notes: '12 Minas Pesadas (720 Dano + fogo no solo).',
        stats: {
          range: 265,
          minRange: 0,
          fireRate: 0.78,
          damage: 720,
          damageType: 'explosive',
          maxMines: 12,
          splashRadius: 140,
          burnDps: 85,
          burnDuration: 4.0
        },
        tier2: {
          name: 'Minas Sísmicas de Demolição',
          upgradeCost: 370,
          notes: '15 Minas (960 Dano) + +40% contra blindados.',
          stats: {
            range: 290,
            minRange: 0,
            fireRate: 0.92,
            damage: 960,
            damageType: 'explosive',
            heavyMultiplier: 1.4,
            maxMines: 15,
            splashRadius: 158,
            burnDps: 115,
            burnDuration: 4.5
          }
        }
      },
      B: {
        id: 'B',
        name: 'Minas Eletromagnéticas',
        cost: 260,
        pros: 'Detonam com pulso EMP que paralisa mecanizados/especiais por 2.5s e destrói escudos.',
        cons: 'Dano explosivo bruto menor que as Minas Explosivas.',
        notes: '12 Minas EMP (2.5s stun + 2x dano em escudos).',
        stats: {
          range: 265,
          minRange: 0,
          fireRate: 0.82,
          damage: 420,
          damageType: 'emp',
          maxMines: 12,
          stunDuration: 2.5,
          slowFactor: 0.45,
          slowDuration: 4.0,
          splashRadius: 145
        },
        tier2: {
          name: 'Malha EMP Estática',
          upgradeCost: 370,
          notes: '16 Minas EMP (3.2s stun + amplifica dano +30%).',
          stats: {
            range: 295,
            minRange: 0,
            fireRate: 0.98,
            damage: 560,
            damageType: 'emp',
            maxMines: 16,
            stunDuration: 3.2,
            slowFactor: 0.55,
            slowDuration: 5.0,
            markedAmp: 0.3,
            splashRadius: 165
          }
        }
      }
    }
  },

  // 17. Radar Tático
  ew_crew: {
    id: 'ew_crew',
    catalogNum: 17,
    category: 'support',
    hotkey: 'f',
    name: 'Radar Tático',
    shortName: 'RADAR',
    role: 'DETECÇÃO / MIRA',
    roleColor: '#a855f7',
    cost: 195,
    unlockCostWB: 0,
    maxHp: 580,
    domain: 'both',
    isSupportAura: true,
    defaultPriority: 'first',
    turnRate: 5.0,
    summary: 'Revela furtivos/escavadores, anula neblina, desacelera hostis e amplifica dano.',
    levels: [
      {
        level: 1,
        name: 'Estação AN/VLQ-12 CREW',
        range: 230,
        minRange: 0,
        fireRate: 0,
        damage: 0,
        damageType: 'ew',
        slowFactor: 0.28,
        damageAmp: 0.2,
        disablesActiveDefense: true,
        allyRangeBuff: 0.08,
        allyFireRateBuff: 0.08,
        empInterval: 0,
        notes: 'Revela Furtivos/Escavadores | +20% Dano | +8% Mira aliada.'
      },
      {
        level: 2,
        upgradeCost: 150,
        name: 'Jammer Direcional EW',
        range: 265,
        minRange: 0,
        fireRate: 0,
        damage: 0,
        damageType: 'ew',
        slowFactor: 0.36,
        damageAmp: 0.28,
        disablesActiveDefense: true,
        allyRangeBuff: 0.14,
        allyFireRateBuff: 0.12,
        empInterval: 0,
        notes: 'Desativa ERA/APS | +28% Dano | +14% Alcance aliado.'
      },
      {
        level: 3,
        upgradeCost: 225,
        name: 'Radar Multi-Espectro AESA',
        range: 300,
        minRange: 0,
        fireRate: 0,
        damage: 35,
        damageType: 'emp',
        slowFactor: 0.42,
        damageAmp: 0.34,
        disablesActiveDefense: true,
        allyRangeBuff: 0.18,
        allyFireRateBuff: 0.16,
        empInterval: 9.0,
        empStunDuration: 1.4,
        notes: 'Pulso EMP 9s | +34% Dano | +18% Alcance aliado.'
      },
      {
        level: 4,
        upgradeCost: 310,
        name: 'Centro C4ISR de Batalha',
        range: 335,
        minRange: 0,
        fireRate: 0,
        damage: 55,
        damageType: 'emp',
        slowFactor: 0.46,
        damageAmp: 0.4,
        disablesActiveDefense: true,
        allyRangeBuff: 0.22,
        allyFireRateBuff: 0.2,
        empInterval: 8.0,
        empStunDuration: 1.7,
        notes: 'Alcance 335m | +40% Dano | +22% Alcance aliado.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Detecção Avançada',
        cost: 370,
        pros: 'Revela furtivos e escavadores em TODO o mapa (AESA Global) e aumenta alcance aliado em +32%.',
        cons: 'Pulso EMP ofensivo moderado.',
        notes: 'Detecção Global de Furtivos + +32% Alcance e +28% Cadência aliada.',
        stats: {
          range: 385,
          minRange: 0,
          fireRate: 0,
          damage: 70,
          damageType: 'emp',
          slowFactor: 0.48,
          damageAmp: 0.42,
          disablesActiveDefense: true,
          globalStealthReveal: true,
          allyRangeBuff: 0.32,
          allyFireRateBuff: 0.28,
          empInterval: 7.5,
          empStunDuration: 1.8
        },
        tier2: {
          name: 'Satélite Orbital AWACS',
          upgradeCost: 510,
          notes: 'Detecção global + +40% Alcance e +35% Cadência para torres próximas.',
          stats: {
            range: 430,
            minRange: 0,
            fireRate: 0,
            damage: 95,
            damageType: 'emp',
            slowFactor: 0.54,
            damageAmp: 0.48,
            disablesActiveDefense: true,
            globalStealthReveal: true,
            allyRangeBuff: 0.4,
            allyFireRateBuff: 0.35,
            empInterval: 6.5,
            empStunDuration: 2.0
          }
        }
      },
      B: {
        id: 'B',
        name: 'Designação de Alvos',
        cost: 370,
        pros: 'Marca inimigos no raio para sofrerem +65% de dano e +25% chance crítica das torres.',
        cons: 'Detecção permanece local no raio do radar (360px).',
        notes: '+65% Dano recebido pelos inimigos + +25% Crítico aliado.',
        stats: {
          range: 360,
          minRange: 0,
          fireRate: 0,
          damage: 110,
          damageType: 'emp',
          slowFactor: 0.52,
          damageAmp: 0.65,
          allyCritBonus: 0.25,
          disablesActiveDefense: true,
          allyRangeBuff: 0.2,
          allyFireRateBuff: 0.22,
          empInterval: 6.5,
          empStunDuration: 2.1
        },
        tier2: {
          name: 'Laser Designador de Precisão',
          upgradeCost: 510,
          notes: '+85% Dano recebido + +35% Crítico + EMP a cada 5.5s.',
          stats: {
            range: 395,
            minRange: 0,
            fireRate: 0,
            damage: 155,
            damageType: 'emp',
            slowFactor: 0.58,
            damageAmp: 0.85,
            allyCritBonus: 0.35,
            disablesActiveDefense: true,
            allyRangeBuff: 0.24,
            allyFireRateBuff: 0.26,
            empInterval: 5.5,
            empStunDuration: 2.4
          }
        }
      }
    }
  },

  // 18. Oficina de Engenharia
  eng_workshop: {
    id: 'eng_workshop',
    catalogNum: 18,
    category: 'support',
    hotkey: 'g',
    name: 'Oficina de Engenharia',
    shortName: 'OFICINA',
    role: 'REPARAÇÃO / RECUP.',
    roleColor: '#38bdf8',
    cost: 210,
    unlockCostWB: 0,
    maxHp: 950,
    isEngineeringWorkshop: true,
    isSupportAura: true,
    domain: 'none',
    defaultPriority: 'first',
    turnRate: 3.0,
    summary: 'Repara estruturas danificadas automaticamente, remove efeitos negativos e reduz custo de reparo.',
    levels: [
      {
        level: 1,
        name: 'Oficina de Campo M88',
        range: 245,
        minRange: 0,
        fireRate: 0,
        damage: 0,
        damageType: 'none',
        healPerSec: 32,
        cleansesDebuffs: true,
        repairCostDiscount: 0.25,
        notes: 'Repara +32 HP/s | Limpa fogo/ácido/gelo | -25% custo reparo.'
      },
      {
        level: 2,
        upgradeCost: 155,
        name: 'Baía de Manutenção Blindada',
        range: 280,
        minRange: 0,
        fireRate: 0,
        damage: 0,
        damageType: 'none',
        healPerSec: 48,
        cleansesDebuffs: true,
        repairCostDiscount: 0.35,
        notes: 'Repara +48 HP/s em 280m | -35% custo reparo.'
      },
      {
        level: 3,
        upgradeCost: 230,
        name: 'Drones de Soldagem Tática',
        range: 315,
        minRange: 0,
        fireRate: 0,
        damage: 0,
        damageType: 'none',
        healPerSec: 68,
        cleansesDebuffs: true,
        allyHpBonus: 0.15,
        repairCostDiscount: 0.45,
        notes: 'Repara +68 HP/s | +15% HP Máx aliado | Imune EMP.'
      },
      {
        level: 4,
        upgradeCost: 320,
        name: 'Centro de Engenharia Avançada',
        range: 350,
        minRange: 0,
        fireRate: 0,
        damage: 0,
        damageType: 'none',
        healPerSec: 92,
        cleansesDebuffs: true,
        allyHpBonus: 0.25,
        repairCostDiscount: 0.55,
        notes: 'Repara +92 HP/s | +25% HP Máx nas estruturas próximas.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Reparação Acelerada',
        cost: 360,
        pros: 'Taxa de reparo altíssima (+175 HP/s) e acelera recarga de habilidade/cadência das torres em +15%.',
        cons: 'Não reconstrói ruínas automaticamente.',
        notes: '+175 HP/s de reparo + limpa EMP + +15% cadência aliada.',
        stats: {
          range: 400,
          minRange: 0,
          fireRate: 0,
          damage: 0,
          damageType: 'none',
          healPerSec: 175,
          cleansesDebuffs: true,
          allyHpBonus: 0.25,
          allyFireRateBuff: 0.15,
          repairCostDiscount: 0.65
        },
        tier2: {
          name: 'Nanorreparo Industrial Turbo',
          upgradeCost: 490,
          notes: '+240 HP/s | +22% cadência aliada | 440m raio.',
          stats: {
            range: 440,
            minRange: 0,
            fireRate: 0,
            damage: 0,
            damageType: 'none',
            healPerSec: 240,
            cleansesDebuffs: true,
            allyHpBonus: 0.3,
            allyFireRateBuff: 0.22,
            repairCostDiscount: 0.75
          }
        }
      },
      B: {
        id: 'B',
        name: 'Reparação Reforçada',
        cost: 360,
        pros: 'Concede +50% HP máximo estrutural, -25% dano recebido e reconstrói ruínas destruídas no raio.',
        cons: 'Velocidade de cura por segundo menor (+115 HP/s).',
        notes: 'Reconstrói ruínas grátis + +50% HP Máx + -25% dano.',
        stats: {
          range: 390,
          minRange: 0,
          fireRate: 0,
          damage: 0,
          damageType: 'none',
          healPerSec: 115,
          cleansesDebuffs: true,
          allyHpBonus: 0.5,
          towerShieldReduction: 0.25,
          autoRebuildRuins: true,
          rebuildCooldown: 12.0,
          repairCostDiscount: 0.6
        },
        tier2: {
          name: 'Bastião de Engenharia Imortal',
          upgradeCost: 490,
          notes: 'Reconstrói ruínas a cada 7s + +65% HP Máx + -35% dano.',
          stats: {
            range: 430,
            minRange: 0,
            fireRate: 0,
            damage: 0,
            damageType: 'none',
            healPerSec: 150,
            cleansesDebuffs: true,
            allyHpBonus: 0.65,
            towerShieldReduction: 0.35,
            autoRebuildRuins: true,
            rebuildCooldown: 7.0,
            repairCostDiscount: 0.75
          }
        }
      }
    }
  },

  // 19. Gerador de Escudos
  iron_dome: {
    id: 'iron_dome',
    catalogNum: 19,
    category: 'support',
    hotkey: 'h',
    name: 'Gerador de Escudos',
    shortName: 'ESCUDOS',
    role: 'PROTEÇÃO / INTERCEPT.',
    roleColor: '#2dd4bf',
    cost: 310,
    unlockCostWB: 0,
    maxHp: 920,
    isIronDome: true,
    domain: 'both',
    defaultPriority: 'air_first',
    projectileSpeed: 820,
    turnRate: 12.0,
    summary: 'Projeta escudos energéticos em torres próximas, bloqueia EMP e intercepta projéteis hostis.',
    levels: [
      {
        level: 1,
        name: 'Gerador de Escudo Tamir M1',
        range: 255,
        minRange: 0,
        fireRate: 1.2,
        damage: 95,
        damageType: 'aa_missile',
        splashRadius: 24,
        interceptCooldown: 2.0,
        healPerSec: 18,
        shieldCapacity: 280,
        shieldRegenPerSec: 28,
        towerShieldReduction: 0.15,
        notes: 'Escudo +280 HP em torres | Intercepta tiros inimigos (2s).'
      },
      {
        level: 2,
        upgradeCost: 225,
        name: 'Domo Eletrostático EL/M',
        range: 290,
        minRange: 0,
        fireRate: 1.5,
        damage: 135,
        damageType: 'aa_missile',
        splashRadius: 28,
        interceptCooldown: 1.35,
        healPerSec: 28,
        shieldCapacity: 420,
        shieldRegenPerSec: 42,
        towerShieldReduction: 0.22,
        notes: 'Escudo +420 HP | Bloqueia EMP | Intercepta 1.35s.'
      },
      {
        level: 3,
        upgradeCost: 320,
        name: 'Escudo Defletor Aegis',
        range: 325,
        minRange: 0,
        fireRate: 1.85,
        damage: 175,
        damageType: 'aa_missile',
        splashRadius: 32,
        interceptCooldown: 0.9,
        healPerSec: 38,
        shieldCapacity: 600,
        shieldRegenPerSec: 58,
        towerShieldReduction: 0.28,
        notes: 'Escudo +600 HP | -28% dano | Intercepta 0.9s.'
      },
      {
        level: 4,
        upgradeCost: 425,
        name: 'Cúpula Defensiva Nv.4',
        range: 360,
        minRange: 0,
        fireRate: 2.2,
        damage: 220,
        damageType: 'aa_missile',
        splashRadius: 36,
        interceptCooldown: 0.65,
        healPerSec: 48,
        shieldCapacity: 820,
        shieldRegenPerSec: 75,
        towerShieldReduction: 0.34,
        notes: 'Escudo +820 HP | Intercepta a cada 0.65s.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Escudo de Alta Capacidade',
        cost: 480,
        pros: 'Concede escudos massivos de 1600 HP às estruturas e reduz todo dano recebido em 50%.',
        cons: 'Regeneração do escudo por segundo é moderada (+85/s).',
        notes: 'Escudo 1600 HP + -50% dano nas estruturas no raio.',
        stats: {
          range: 410,
          minRange: 0,
          fireRate: 2.5,
          damage: 275,
          damageType: 'aa_missile',
          splashRadius: 40,
          interceptCooldown: 0.45,
          healPerSec: 55,
          shieldCapacity: 1600,
          shieldRegenPerSec: 85,
          towerShieldReduction: 0.5
        },
        tier2: {
          name: 'Fortaleza de Plasma Aegis II',
          upgradeCost: 630,
          notes: 'Escudo 2300 HP + -60% dano estrutural + interceptação 0.3s.',
          stats: {
            range: 450,
            minRange: 0,
            fireRate: 2.9,
            damage: 340,
            damageType: 'aa_missile',
            splashRadius: 46,
            interceptCooldown: 0.3,
            healPerSec: 70,
            shieldCapacity: 2300,
            shieldRegenPerSec: 115,
            towerShieldReduction: 0.6
          }
        }
      },
      B: {
        id: 'B',
        name: 'Regeneração Ampliada',
        cost: 480,
        pros: 'Regenera +210/s de escudo e +95/s de vida em todas as torres no raio ampliado.',
        cons: 'Capacidade máxima do escudo menor (950 HP).',
        notes: 'Regeneração massiva (+210 escudo/s + +95 HP/s) em 430m.',
        stats: {
          range: 430,
          minRange: 0,
          fireRate: 2.6,
          damage: 255,
          damageType: 'aa_missile',
          splashRadius: 40,
          interceptCooldown: 0.5,
          healPerSec: 95,
          shieldCapacity: 950,
          shieldRegenPerSec: 210,
          towerShieldReduction: 0.35
        },
        tier2: {
          name: 'Matriz Regenerativa Quântica',
          upgradeCost: 630,
          notes: '+310 Escudo/s + +135 HP/s + raio de 480m.',
          stats: {
            range: 480,
            minRange: 0,
            fireRate: 3.0,
            damage: 320,
            damageType: 'aa_missile',
            splashRadius: 46,
            interceptCooldown: 0.35,
            healPerSec: 135,
            shieldCapacity: 1200,
            shieldRegenPerSec: 310,
            towerShieldReduction: 0.42
          }
        }
      }
    }
  },

  // 20. Extrator de Energia
  energy_extractor: {
    id: 'energy_extractor',
    catalogNum: 20,
    category: 'support',
    hotkey: 'j',
    name: 'Extrator de Energia',
    shortName: 'EXTRATOR',
    role: 'ECONOMIA / REC.',
    roleColor: '#facc15',
    cost: 165,
    unlockCostWB: 0,
    maxHp: 540,
    isEconomyTower: true,
    isSupportAura: true,
    domain: 'none',
    defaultPriority: 'first',
    turnRate: 2.5,
    summary: 'Gera recursos ($) continuamente em combate e ao final das ondas (sem abuso infinito).',
    levels: [
      {
        level: 1,
        name: 'Extrator Geotérmico M1',
        range: 195,
        minRange: 0,
        fireRate: 0,
        damage: 0,
        damageType: 'none',
        incomePerSec: 4.5,
        waveClearIncome: 55,
        notes: '+$4.5/s durante ondas | +$55 ao fim da onda.'
      },
      {
        level: 2,
        upgradeCost: 145,
        name: 'Refinaria Modular Avançada',
        range: 215,
        minRange: 0,
        fireRate: 0,
        damage: 0,
        damageType: 'none',
        incomePerSec: 7.5,
        waveClearIncome: 90,
        notes: '+$7.5/s durante ondas | +$90 ao fim da onda.'
      },
      {
        level: 3,
        upgradeCost: 225,
        name: 'Reator de Fusão Compacto',
        range: 235,
        minRange: 0,
        fireRate: 0,
        damage: 0,
        damageType: 'none',
        incomePerSec: 11.5,
        waveClearIncome: 135,
        notes: '+$11.5/s | +$135 por onda | Bônus de energia.'
      },
      {
        level: 4,
        upgradeCost: 315,
        name: 'Complexo Energético Nv.4',
        range: 260,
        minRange: 0,
        fireRate: 0,
        damage: 0,
        damageType: 'none',
        incomePerSec: 16,
        waveClearIncome: 190,
        notes: '+$16/s | +$190 por onda | Pronto para especializar.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Maior Produção',
        cost: 380,
        pros: 'Produção passiva garantida de +$26/s e +$290 por conclusão de onda, independente de abates.',
        cons: 'Não concede bônus direto às torres combatentes próximas.',
        notes: '+$26/s em combate + +$290 por onda.',
        stats: {
          range: 260,
          minRange: 0,
          fireRate: 0,
          damage: 0,
          damageType: 'none',
          incomePerSec: 26,
          waveClearIncome: 290
        },
        tier2: {
          name: 'Usina de Fissão Industrial',
          upgradeCost: 520,
          notes: '+$36/s em combate + +$400 por onda.',
          stats: {
            range: 280,
            minRange: 0,
            fireRate: 0,
            damage: 0,
            damageType: 'none',
            incomePerSec: 36,
            waveClearIncome: 400
          }
        }
      },
      B: {
        id: 'B',
        name: 'Bônus Econômico por Desempenho',
        cost: 380,
        pros: 'Concede +35% de recompensa em $ por abates no raio e +18% de cadência às torres próximas.',
        cons: 'Renda passiva fixa menor (+$14/s) se posicionado longe do combate.',
        notes: '+35% ouro por abate no raio + +18% cadência aliada.',
        stats: {
          range: 310,
          minRange: 0,
          fireRate: 0,
          damage: 0,
          damageType: 'none',
          incomePerSec: 14,
          waveClearIncome: 160,
          killBountyBonus: 0.35,
          allyFireRateBuff: 0.18
        },
        tier2: {
          name: 'Sincronizador Logístico Tático',
          upgradeCost: 520,
          notes: '+50% ouro por abate no raio + +25% cadência aliada.',
          stats: {
            range: 345,
            minRange: 0,
            fireRate: 0,
            damage: 0,
            damageType: 'none',
            incomePerSec: 18,
            waveClearIncome: 210,
            killBountyBonus: 0.5,
            allyFireRateBuff: 0.25
          }
        }
      }
    }
  },

  // ===========================================================================
  // PRESERVED LEGACY STRUCTURES (100% BACKWARDS COMPATIBLE)
  // ===========================================================================
  bushmaster: {
    id: 'bushmaster',
    category: 'precision',
    hotkey: 'k',
    name: 'M242 Bushmaster 25mm',
    shortName: '25MM AP',
    role: 'APDS / IFV',
    roleColor: '#f97316',
    cost: 225,
    unlockCostWB: 0,
    maxHp: 620,
    domain: 'both',
    defaultPriority: 'strongest',
    projectileSpeed: 880,
    turnRate: 7.0,
    summary: 'Canhão automático APDS. Destrói IFVs/APCs e perfura blindagem.',
    levels: [
      {
        level: 1,
        name: 'M242 Bushmaster 25mm',
        range: 240,
        minRange: 0,
        fireRate: 2.5,
        damage: 58,
        damageType: 'apds',
        armorIgnore: 0.5,
        splashRadius: 0,
        notes: '2.5 tiros/s | Dano 58 APDS | Ignora 50% da armadura.'
      },
      {
        level: 2,
        upgradeCost: 195,
        name: 'M919 Sabot DU',
        range: 260,
        minRange: 0,
        fireRate: 2.8,
        damage: 84,
        damageType: 'apds',
        armorIgnore: 0.78,
        splashRadius: 0,
        notes: 'Munição Sabot DU | Ignora 78% da blindagem.'
      },
      {
        level: 3,
        upgradeCost: 295,
        name: 'Bofors 40mm L/70',
        range: 285,
        minRange: 0,
        fireRate: 3.2,
        damage: 118,
        damageType: 'apds',
        armorIgnore: 0.85,
        splashRadius: 42,
        notes: 'Canhão 40mm | Micro-área explosiva.'
      },
      {
        level: 4,
        upgradeCost: 390,
        name: 'Autocannon 50mm CTA',
        range: 310,
        minRange: 0,
        fireRate: 3.5,
        damage: 155,
        damageType: 'apds',
        armorIgnore: 0.9,
        splashRadius: 48,
        notes: 'Canhão telescópico 50mm | Pronto para especialização.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Sabot Antiblindagem',
        cost: 440,
        pros: 'Ignora 98% da blindagem pesada com bônus +45% em veículos pesados.',
        cons: 'Sem dano em área.',
        notes: '98% ignora blindagem + 1.45x em pesados.',
        stats: {
          range: 345,
          minRange: 0,
          fireRate: 3.8,
          damage: 245,
          damageType: 'apds',
          armorIgnore: 0.98,
          heavyMultiplier: 1.45,
          splashRadius: 0
        },
        tier2: {
          name: 'Sabot DU Mark II',
          upgradeCost: 580,
          notes: '330 Dano APDS + 1.65x em pesados.',
          stats: {
            range: 365,
            minRange: 0,
            fireRate: 4.1,
            damage: 330,
            damageType: 'apds',
            armorIgnore: 1.0,
            heavyMultiplier: 1.65,
            splashRadius: 0
          }
        }
      },
      B: {
        id: 'B',
        name: 'Munição HEIT Fragmentada',
        cost: 440,
        pros: 'Cadência elevada (5.2/s) com explosões de 72px contra grupos mistos.',
        cons: 'Penetração de armadura menor (65%).',
        notes: '5.2 tiros/s com área explosiva de 72px.',
        stats: {
          range: 330,
          minRange: 0,
          fireRate: 5.2,
          damage: 155,
          damageType: 'explosive',
          armorIgnore: 0.65,
          splashRadius: 72
        },
        tier2: {
          name: 'Torre Dupla 40mm HEIT',
          upgradeCost: 580,
          notes: '6.2 tiros/s | 88px explosão.',
          stats: {
            range: 350,
            minRange: 0,
            fireRate: 6.2,
            damage: 205,
            damageType: 'explosive',
            armorIgnore: 0.72,
            splashRadius: 88
          }
        }
      }
    }
  },

  javelin: {
    id: 'javelin',
    category: 'area',
    hotkey: 'l',
    name: 'TOW / FGM-148 Javelin',
    shortName: 'JAVELIN',
    role: 'ATGM / MBT',
    roleColor: '#ef4444',
    cost: 340,
    unlockCostWB: 180,
    maxHp: 540,
    domain: 'ground',
    defaultPriority: 'strongest',
    projectileSpeed: 440,
    turnRate: 5.8,
    summary: 'Bateria caça-tanques Top-Attack. 200% de dano contra Blindagem Pesada.',
    levels: [
      {
        level: 1,
        name: 'BGM-71 TOW / Javelin',
        range: 340,
        minRange: 0,
        fireRate: 0.42,
        damage: 320,
        damageType: 'heat',
        heavyMultiplier: 2.0,
        tandemHeat: false,
        salvoCount: 1,
        splashRadius: 30,
        notes: '320 HEAT (200% em Blindagem Pesada).'
      },
      {
        level: 2,
        upgradeCost: 260,
        name: 'Ogiva Tandem HEAT',
        range: 370,
        minRange: 0,
        fireRate: 0.48,
        damage: 425,
        damageType: 'heat',
        heavyMultiplier: 2.15,
        tandemHeat: true,
        salvoCount: 1,
        splashRadius: 36,
        notes: 'Rompe ERA instantaneamente.'
      },
      {
        level: 3,
        upgradeCost: 390,
        name: 'Dual Javelin Block I',
        range: 400,
        minRange: 0,
        fireRate: 0.52,
        damage: 440,
        damageType: 'heat',
        heavyMultiplier: 2.25,
        tandemHeat: true,
        salvoCount: 2,
        splashRadius: 40,
        notes: 'Dispara 2 mísseis simultâneos.'
      },
      {
        level: 4,
        upgradeCost: 520,
        name: 'Bateria Quad ATGM',
        range: 430,
        minRange: 0,
        fireRate: 0.58,
        damage: 510,
        damageType: 'heat',
        heavyMultiplier: 2.35,
        tandemHeat: true,
        salvoCount: 2,
        splashRadius: 46,
        notes: '2 mísseis de 510 HEAT.'
      }
    ],
    specializations: {
      A: {
        id: 'A',
        name: 'Ogiva Top-Attack Pesada',
        cost: 590,
        pros: 'Dobra o dano contra blindagem pesada (2.8x) e ignora cobertura frontal.',
        cons: 'Dispara 2 mísseis focados.',
        notes: '2.8x em pesados | 780 HEAT base.',
        stats: {
          range: 470,
          minRange: 0,
          fireRate: 0.62,
          damage: 780,
          damageType: 'heat',
          heavyMultiplier: 2.8,
          tandemHeat: true,
          salvoCount: 2,
          splashRadius: 48
        },
        tier2: {
          name: 'Brimstone Tandem II',
          upgradeCost: 780,
          notes: '1040 HEAT (3.0x em blindados).',
          stats: {
            range: 510,
            minRange: 0,
            fireRate: 0.68,
            damage: 1040,
            damageType: 'heat',
            heavyMultiplier: 3.0,
            tandemHeat: true,
            salvoCount: 2,
            splashRadius: 54
          }
        }
      },
      B: {
        id: 'B',
        name: 'Salva Quádrupla ATGM',
        cost: 590,
        pros: 'Dispara 4 mísseis por ciclo atingindo vários veículos simultaneamente.',
        cons: 'Menor multiplicador individual contra chefes.',
        notes: '4 mísseis simultâneos por salva.',
        stats: {
          range: 455,
          minRange: 0,
          fireRate: 0.62,
          damage: 490,
          damageType: 'heat',
          heavyMultiplier: 2.2,
          tandemHeat: true,
          salvoCount: 4,
          splashRadius: 52
        },
        tier2: {
          name: 'Salva Hexa Brimstone',
          upgradeCost: 780,
          notes: '6 mísseis guiados simultâneos.',
          stats: {
            range: 490,
            minRange: 0,
            fireRate: 0.68,
            damage: 560,
            damageType: 'heat',
            heavyMultiplier: 2.3,
            tandemHeat: true,
            salvoCount: 6,
            splashRadius: 58
          }
        }
      }
    }
  },

  hesco: {
    id: 'hesco',
    category: 'support',
    hotkey: 'm',
    name: 'Hesco Bastion',
    shortName: 'HESCO',
    role: 'MAZE',
    roleColor: '#94a3b8',
    cost: 25,
    unlockCostWB: 0,
    maxHp: 950,
    isBarrier: true,
    domain: 'none',
    defaultPriority: 'first',
    summary: 'Barreira modular de solo (950 HP). Redireciona colunas terrestres pelo grid.',
    levels: [
      {
        level: 1,
        name: 'Barreira Hesco',
        range: 0,
        minRange: 0,
        fireRate: 0,
        damage: 0,
        damageType: 'none',
        splashRadius: 0,
        notes: 'Bloqueia rota terrestre (validação A* anti-fechamento). 950 HP.'
      }
    ]
  }
};

export const TOWER_BUILD_ORDER = [
  // 20 Mandatory Expansion Towers
  'ballista',
  'm2_bunker',
  'abrams_pit',
  'howitzer',
  'sniper_tower',
  'cryo_tower',
  'tesla_tower',
  'toxic_tower',
  'flamethrower',
  'helios_laser',
  'railgun',
  'patriot',
  'phalanx',
  'harpoon_tower',
  'tos1_mlrs',
  'minefield',
  'ew_crew',
  'eng_workshop',
  'iron_dome',
  'energy_extractor',
  // Legacy structures preserved
  'bushmaster',
  'javelin',
  'hesco'
];

/**
 * Resolves the active spec for any tower at level 1..6 with optional specialization ('A' | 'B').
 */
export function getTowerLevelSpec(towerDef, level = 1, specialization = null) {
  if (!towerDef) return null;
  const baseLevels = towerDef.levels || [];
  if (level <= baseLevels.length || !towerDef.specializations) {
    const idx = Math.max(0, Math.min(baseLevels.length - 1, level - 1));
    return {
      ...baseLevels[idx],
      level: idx + 1,
      specialization: null
    };
  }

  const branchKey = specialization === 'B' ? 'B' : 'A';
  const branch = towerDef.specializations[branchKey];
  if (!branch) {
    const last = baseLevels[baseLevels.length - 1];
    return { ...last, level: baseLevels.length, specialization: null };
  }

  const baseAnchor = baseLevels[baseLevels.length - 1] || {};
  if (level === baseLevels.length + 1 || !branch.tier2) {
    return {
      ...baseAnchor,
      ...branch.stats,
      level: baseLevels.length + 1,
      name: branch.name,
      notes: branch.notes,
      specialization: branchKey,
      pros: branch.pros,
      cons: branch.cons
    };
  }

  return {
    ...baseAnchor,
    ...branch.stats,
    ...branch.tier2.stats,
    level: baseLevels.length + 2,
    name: branch.tier2.name,
    notes: branch.tier2.notes,
    specialization: branchKey,
    pros: branch.pros,
    cons: branch.cons
  };
}

/**
 * Returns upgrade options for a tower at a given level/specialization.
 * Returns either { kind: 'common', nextSpec } or { kind: 'specialize', branches: { A, B } } or null if max.
 */
export function getTowerUpgradeOptions(towerDef, level = 1, specialization = null) {
  if (!towerDef || towerDef.isBarrier) return null;
  const baseCount = (towerDef.levels || []).length;

  // Common levels 1 -> 2 -> 3 -> 4
  if (level < baseCount) {
    const nextSpec = towerDef.levels[level];
    return {
      kind: 'common',
      nextLevel: level + 1,
      name: nextSpec.name,
      cost: nextSpec.upgradeCost,
      notes: nextSpec.notes
    };
  }

  // Choice of specialization at end of common levels (Lv 4 -> Lv 5)
  if (level === baseCount && towerDef.specializations && !specialization) {
    return {
      kind: 'specialize',
      nextLevel: baseCount + 1,
      branches: towerDef.specializations
    };
  }

  // Specialization tier 2 mastery (Lv 5 -> Lv 6)
  if (level === baseCount + 1 && specialization && towerDef.specializations?.[specialization]?.tier2) {
    const t2 = towerDef.specializations[specialization].tier2;
    return {
      kind: 'common',
      nextLevel: baseCount + 2,
      name: t2.name,
      cost: t2.upgradeCost,
      notes: t2.notes,
      specialization
    };
  }

  return null;
}
