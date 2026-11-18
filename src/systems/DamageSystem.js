/**
 * Centralized Damage Type, Armor, Energy Shield, Resistance & Vulnerability System.
 * Preserves legacy damage type aliases while supporting all 9 canonical categories.
 */

export const DAMAGE_TYPES = [
  'physical',
  'explosive',
  'fire',
  'ice',
  'electric',
  'poison',
  'energy',
  'piercing',
  'emp'
];

export const DAMAGE_TYPE_META = {
  physical: { id: 'physical', label: 'Físico', short: 'FÍS', color: '#eab308' },
  explosive: { id: 'explosive', label: 'Explosivo', short: 'EXP', color: '#f97316' },
  fire: { id: 'fire', label: 'Fogo', short: 'FOG', color: '#ef4444' },
  ice: { id: 'ice', label: 'Gelo', short: 'GEL', color: '#38bdf8' },
  electric: { id: 'electric', label: 'Elétrico', short: 'ELÉ', color: '#60a5fa' },
  poison: { id: 'poison', label: 'Veneno', short: 'VEN', color: '#84cc16' },
  energy: { id: 'energy', label: 'Energia', short: 'ENE', color: '#22d3ee' },
  piercing: { id: 'piercing', label: 'Perfuração', short: 'PER', color: '#fb923c' },
  emp: { id: 'emp', label: 'EMP', short: 'EMP', color: '#c084fc' }
};

const DAMAGE_TYPE_ALIASES = {
  physical: 'physical',
  kinetic: 'physical',
  aa: 'physical',
  explosive: 'explosive',
  he: 'explosive',
  he_rocket: 'explosive',
  fire: 'fire',
  thermobaric: 'fire',
  ice: 'ice',
  cryo: 'ice',
  electric: 'electric',
  tesla: 'electric',
  poison: 'poison',
  toxic: 'poison',
  acid: 'poison',
  energy: 'energy',
  laser: 'energy',
  plasma: 'energy',
  piercing: 'piercing',
  apds: 'piercing',
  heat: 'piercing',
  aa_missile: 'piercing',
  emp: 'emp',
  ew: 'emp'
};

export function normalizeDamageType(damageType) {
  if (typeof damageType !== 'string') return 'physical';
  return DAMAGE_TYPE_ALIASES[damageType.toLowerCase()] || 'physical';
}

export function getDamageTypeMeta(damageType) {
  const canonical = normalizeDamageType(damageType);
  return DAMAGE_TYPE_META[canonical] || DAMAGE_TYPE_META.physical;
}

const SHIELD_TYPE_MULTS = {
  electric: 1.75,
  emp: 2.0,
  energy: 1.25,
  physical: 0.65,
  piercing: 0.85,
  explosive: 0.9,
  fire: 0.85,
  ice: 0.9,
  poison: 0.45
};

const MIN_TOTAL_MULT = 0.15;
const MAX_TOTAL_MULT = 3.2;

/**
 * Resolves damage against an enemy considering APS, burrowed state, frontal shield,
 * energy shield, armor class + corrosion, ERA, resistances, crits, and EW/thermal amps.
 */
export function resolveDamage(enemy, rawDamage, damageType, options = {}) {
  const canonicalType = normalizeDamageType(damageType);

  if (!enemy || !Number.isFinite(rawDamage) || rawDamage <= 0) {
    return {
      damage: 0,
      shieldDamage: 0,
      apsIntercepted: false,
      isRicochet: false,
      isCrit: false,
      eraBlocked: false,
      frontalBlocked: false,
      canonicalType,
      effectiveness: 1
    };
  }

  const {
    armorPierce = 0,
    armorIgnore = 0,
    heavyMultiplier = 1,
    tandemHeat = false,
    critChance = 0,
    critMultiplier = 1.6,
    isMissile = false,
    allowApsIntercept = true,
    isSplash = false,
    isMine = false,
    ignoreFrontalShield = false,
    ignoreShield = false,
    rng = Math.random
  } = options;

  // Directed energy laser & EMP ignore APS completely
  const canBeInterceptedByAps =
    allowApsIntercept && isMissile && canonicalType !== 'energy' && canonicalType !== 'emp';

  if (
    canBeInterceptedByAps &&
    enemy.hasAps &&
    enemy.apsCooldownTimer <= 0 &&
    !enemy.ewDisabled
  ) {
    enemy.apsCooldownTimer = enemy.apsMaxCooldown || 4.0;
    return {
      damage: 0,
      shieldDamage: 0,
      apsIntercepted: true,
      isRicochet: false,
      isCrit: false,
      eraBlocked: false,
      frontalBlocked: false,
      canonicalType,
      effectiveness: 0
    };
  }

  let mult = 1.0;
  let isRicochet = false;
  let eraBlocked = false;
  let isCrit = false;
  let frontalBlocked = false;

  const pierceFactor = Math.max(0, Math.min(1, Math.max(armorPierce, armorIgnore)));
  const corrosionFactor = Math.max(0, Math.min(0.85, enemy.corrosionReduction || 0));
  const effectivePierce = Math.min(1, pierceFactor + corrosionFactor * (1 - pierceFactor));

  // 1. Burrowed underground state (e.g. Escavador Subterraneo)
  if (enemy.isBurrowed) {
    if (isMine || canonicalType === 'explosive' || canonicalType === 'emp') {
      mult *= 1.25;
    } else {
      mult *= 0.35;
    }
  }

  // 2. Frontal directional shield (e.g. Escudeiro)
  if (
    enemy.frontalShieldReduction > 0 &&
    !ignoreFrontalShield &&
    !isSplash &&
    !enemy.ewDisabled &&
    (canonicalType === 'physical' || canonicalType === 'piercing')
  ) {
    const red = Math.min(0.75, enemy.frontalShieldReduction * (1 - effectivePierce * 0.65));
    mult *= 1 - red;
    frontalBlocked = red >= 0.25;
  }

  // 3. Critical hit
  if (critChance > 0 && rng() < critChance) {
    mult *= Number.isFinite(critMultiplier) && critMultiplier > 1 ? critMultiplier : 1.6;
    isCrit = true;
  }

  // 4. Energy Shield Absorption (if active and not bypassed by poison/DOT)
  let shieldDamage = 0;
  let hpFraction = 1.0;
  if (!ignoreShield && enemy.shield > 0 && canonicalType !== 'poison') {
    const shieldTypeMult = SHIELD_TYPE_MULTS[canonicalType] ?? 1.0;
    const incomingToShield = rawDamage * mult * shieldTypeMult;
    if (incomingToShield > 0) {
      if (enemy.shield >= incomingToShield) {
        shieldDamage = Math.max(1, Math.round(incomingToShield));
        enemy.shield = Math.max(0, enemy.shield - incomingToShield);
        hpFraction = 0;
      } else {
        shieldDamage = Math.max(1, Math.round(enemy.shield));
        hpFraction = Math.max(0, 1 - enemy.shield / incomingToShield);
        enemy.shield = 0;
      }
    }
  }

  if (hpFraction <= 0) {
    return {
      damage: 0,
      shieldDamage,
      apsIntercepted: false,
      isRicochet: false,
      isCrit,
      eraBlocked: false,
      frontalBlocked,
      canonicalType,
      effectiveness: SHIELD_TYPE_MULTS[canonicalType] ?? 1.0
    };
  }

  // 5. Armor class & armor rating interaction
  const armor = enemy.armorClass || 'light';
  const rawLower = typeof damageType === 'string' ? damageType.toLowerCase() : 'physical';

  if (rawLower === 'kinetic' || rawLower === 'aa' || canonicalType === 'physical') {
    if (armor === 'medium') {
      mult *= 1 - 0.32 * (1 - effectivePierce);
    } else if (armor === 'heavy') {
      mult *= 1 - 0.7 * (1 - effectivePierce);
      if (effectivePierce < 0.3) isRicochet = true;
    }
  } else if (rawLower === 'apds' || rawLower === 'heat' || canonicalType === 'piercing') {
    if (armor === 'medium') {
      mult *= rawLower === 'heat' ? 1.25 : 1 - 0.2 * (1 - effectivePierce);
    } else if (armor === 'heavy') {
      if (rawLower === 'heat') {
        mult *= Math.max(1.2, heavyMultiplier);
      } else {
        mult *= 1 - 0.55 * (1 - effectivePierce);
        if (heavyMultiplier > 1) mult *= heavyMultiplier;
      }
    }
    if (rawLower === 'heat' && enemy.hasEra && enemy.eraIntact && !enemy.ewDisabled) {
      if (tandemHeat) {
        enemy.eraIntact = false;
      } else {
        mult *= 0.6;
        enemy.eraIntact = false;
        eraBlocked = true;
      }
    }
  } else if (canonicalType === 'fire') {
    if (enemy.hasEra && enemy.eraIntact) enemy.eraIntact = false;
    if (armor === 'light') mult *= 1.15;
    else if (armor === 'heavy' && rawLower === 'thermobaric') mult *= 1.3;
  } else if (canonicalType === 'energy') {
    if (armor === 'heavy') mult *= 1.15;
  } else if (canonicalType === 'explosive') {
    if (armor === 'light') mult *= 1.15;
    else if (armor === 'heavy') {
      mult *= rawLower === 'he_rocket' ? 1.15 : 0.85 * (1 + effectivePierce * 0.25);
    }
  } else if (canonicalType === 'poison') {
    // Poison bypasses heavy plating slightly over time, softened only by explicit resistance
    if (armor === 'heavy') mult *= 0.95;
  }

  if (rawLower === 'aa_missile' && enemy.domain === 'air') {
    mult *= 1.15;
  }

  // 6. Explicit enemy resistance/vulnerability table (applied ONCE per hit)
  let resistanceMult = 1.0;
  if (enemy.resistances && typeof enemy.resistances[canonicalType] === 'number') {
    const r = enemy.resistances[canonicalType];
    if (Number.isFinite(r) && r > 0) {
      resistanceMult = r;
    }
  }
  // Corrosion softens resistance slightly on armored units
  if (resistanceMult < 1.0 && corrosionFactor > 0) {
    resistanceMult = resistanceMult + (1.0 - resistanceMult) * Math.min(0.6, corrosionFactor);
  }
  mult *= resistanceMult;

  // 7. Electronic warfare, radar mark & thermal vulnerability amps
  const ewAmp = Number.isFinite(enemy.ewDamageAmp) && enemy.ewDamageAmp > 0 ? enemy.ewDamageAmp : 0;
  const thermalAmp = Number.isFinite(enemy.thermalVuln) && enemy.thermalVuln > 0 ? enemy.thermalVuln : 0;
  const markAmp = Number.isFinite(enemy.markedAmp) && enemy.markedAmp > 0 ? enemy.markedAmp : 0;
  if (ewAmp > 0) mult *= 1 + ewAmp;
  if (thermalAmp > 0) mult *= 1 + thermalAmp;
  if (markAmp > 0) mult *= 1 + markAmp;

  // 8. Clamp total multiplier to safe bounds
  const clampedMult = Math.max(MIN_TOTAL_MULT, Math.min(MAX_TOTAL_MULT, mult));
  const finalDamage = Math.max(1, Math.round(rawDamage * clampedMult * hpFraction));

  return {
    damage: Number.isFinite(finalDamage) ? finalDamage : 0,
    shieldDamage,
    apsIntercepted: false,
    isRicochet,
    isCrit,
    eraBlocked,
    frontalBlocked,
    canonicalType,
    effectiveness: resistanceMult
  };
}
