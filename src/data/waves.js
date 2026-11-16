/**
 * 15 structured military waves progressing from light infantry reconnaissance
 * through mechanized IFVs, loitering drone swarms, heavy MBTs with ERA,
 * attack helicopters, stealth strike aircraft, and BMPT Terminator bosses.
 */
export const WAVES = [
  {
    wave: 1,
    title: 'Vanguarda de Reconhecimento',
    brief: 'Esquadrões Spetsnaz em marcha rápida. Use M2 .50 Cal e comece o labirinto Hesco.',
    groups: [
      { type: 'infantry', count: 10, interval: 0.72, delay: 0.3 }
    ]
  },
  {
    wave: 2,
    title: 'Flanqueadores Motorizados',
    brief: 'Infantaria apoiada por veículos GAZ Tigr IMV de alta velocidade.',
    groups: [
      { type: 'infantry', count: 8, interval: 0.65, delay: 0.2 },
      { type: 'imv', count: 4, interval: 1.25, delay: 4.2 }
    ]
  },
  {
    wave: 3,
    title: 'Coluna Mecanizada Leve',
    brief: 'Primeiros BTR-82A IFVs (blindagem média; desembarcam 3 fuzileiros ao destruir).',
    groups: [
      { type: 'imv', count: 6, interval: 1.0, delay: 0.2 },
      { type: 'ifv', count: 2, interval: 2.8, delay: 3.5 }
    ]
  },
  {
    wave: 4,
    title: 'Enxame Loitering Munition',
    brief: 'ALERTA AÉREO: Drones kamikaze Shahed-136 ignoram seu labirinto! Prepare Phalanx CIWS.',
    groups: [
      { type: 'infantry', count: 10, interval: 0.55, delay: 0.2 },
      { type: 'drone_swarm', count: 8, interval: 0.6, delay: 2.0 }
    ]
  },
  {
    wave: 5,
    title: 'Assalto Blindado Combinado',
    brief: 'Múltiplos IFVs apoiados por flanqueadores IMV e drones.',
    groups: [
      { type: 'ifv', count: 5, interval: 2.0, delay: 0.2 },
      { type: 'imv', count: 6, interval: 0.9, delay: 2.5 },
      { type: 'drone_swarm', count: 8, interval: 0.55, delay: 5.0 }
    ]
  },
  {
    wave: 6,
    title: 'Ponta de Lança Pesada',
    brief: 'ALERTA MBT: Tanques T-90M com blindagem pesada + ERA. Use Javelin, Bushmaster ou HIMARS!',
    groups: [
      { type: 'infantry', count: 12, interval: 0.45, delay: 0.2 },
      { type: 'mbt', count: 2, interval: 4.2, delay: 3.0 }
    ]
  },
  {
    wave: 7,
    title: 'Suporte Aéreo de Ataque',
    brief: 'Helicópteros blindados Mil Mi-28 Havoc + enxame de drones Shahed.',
    groups: [
      { type: 'drone_swarm', count: 12, interval: 0.45, delay: 0.2 },
      { type: 'heli', count: 3, interval: 2.8, delay: 2.0 },
      { type: 'ifv', count: 4, interval: 1.8, delay: 3.0 }
    ]
  },
  {
    wave: 8,
    title: 'Incursão Furtiva',
    brief: 'ALERTA STEALTH: Su-57 Felon invisível a radares comuns! Use Patriot Nv2 (AESA) ou Torre EW.',
    groups: [
      { type: 'mbt', count: 3, interval: 3.4, delay: 0.2 },
      { type: 'stealth', count: 2, interval: 3.8, delay: 4.0 },
      { type: 'imv', count: 8, interval: 0.75, delay: 1.5 }
    ]
  },
  {
    wave: 9,
    title: 'Tempestade de Aço',
    brief: 'Pressão total terrestre e aérea com IFVs, MBTs e helicópteros pesados.',
    groups: [
      { type: 'ifv', count: 6, interval: 1.5, delay: 0.2 },
      { type: 'mbt', count: 4, interval: 2.8, delay: 2.0 },
      { type: 'heli', count: 4, interval: 2.2, delay: 3.5 },
      { type: 'drone_swarm', count: 14, interval: 0.38, delay: 6.0 }
    ]
  },
  {
    wave: 10,
    title: 'DEFCON 2: BOSS BMPT TERMINATOR',
    brief: 'COLUNA DE COMANDO BMPT + APS Arena (intercepta mísseis a cada 4s). Neutralize com Torre EW ou saturação!',
    groups: [
      { type: 'infantry', count: 14, interval: 0.4, delay: 0.2 },
      { type: 'mbt', count: 3, interval: 3.2, delay: 2.0 },
      { type: 'boss', count: 1, interval: 1.0, delay: 6.5 },
      { type: 'heli', count: 3, interval: 2.5, delay: 7.5 }
    ]
  },
  {
    wave: 11,
    title: 'Saturação de Drones & Stealth',
    brief: 'Enxame massivo de Shahed-136 escoltando aeronaves furtivas Su-57.',
    groups: [
      { type: 'drone_swarm', count: 22, interval: 0.32, delay: 0.2 },
      { type: 'stealth', count: 4, interval: 2.5, delay: 3.0 },
      { type: 'ifv', count: 6, interval: 1.4, delay: 2.0 }
    ]
  },
  {
    wave: 12,
    title: 'Divisão Blindada Proryv',
    brief: 'Coluna densa de tanques T-90M / Abrams escoltados por BMP-3.',
    groups: [
      { type: 'mbt', count: 6, interval: 2.3, delay: 0.2 },
      { type: 'ifv', count: 7, interval: 1.3, delay: 1.5 },
      { type: 'imv', count: 10, interval: 0.6, delay: 5.0 }
    ]
  },
  {
    wave: 13,
    title: 'Supremacia Aérea Hostil',
    brief: 'Formação combinada de helicópteros Havoc, caças Stealth e drones kamikaze.',
    groups: [
      { type: 'heli', count: 6, interval: 1.7, delay: 0.2 },
      { type: 'stealth', count: 5, interval: 2.2, delay: 2.5 },
      { type: 'drone_swarm', count: 20, interval: 0.3, delay: 4.0 },
      { type: 'mbt', count: 4, interval: 2.5, delay: 3.0 }
    ]
  },
  {
    wave: 14,
    title: 'Ofensiva Total Multi-Domínio',
    brief: 'Todas as forças mecanizadas, blindadas e aéreas avançam simultaneamente.',
    groups: [
      { type: 'infantry', count: 20, interval: 0.32, delay: 0.2 },
      { type: 'ifv', count: 8, interval: 1.1, delay: 1.0 },
      { type: 'mbt', count: 7, interval: 2.0, delay: 3.0 },
      { type: 'heli', count: 6, interval: 1.6, delay: 3.5 },
      { type: 'stealth', count: 5, interval: 2.0, delay: 5.5 }
    ]
  },
  {
    wave: 15,
    title: 'DEFCON 1: OPERAÇÃO JUÍZO FINAL',
    brief: 'DUPLO BOSS BMPT Terminator + Comando Móvel, escoltado por MBTs e ataques Stealth!',
    groups: [
      { type: 'drone_swarm', count: 24, interval: 0.28, delay: 0.2 },
      { type: 'mbt', count: 6, interval: 2.0, delay: 1.5 },
      { type: 'boss', count: 2, interval: 7.0, delay: 4.5 },
      { type: 'stealth', count: 6, interval: 1.8, delay: 6.0 },
      { type: 'heli', count: 6, interval: 1.5, delay: 8.0 }
    ]
  }
];
