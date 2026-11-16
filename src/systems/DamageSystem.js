/**
 * Resolves armored/anti-air/ERA/APS/EW/Laser/Thermobaric damage interactions for DEFCON: Frontline.
 */
export function resolveDamage(enemy, rawDamage, damageType, options = {}) {
  const {
    armorPierce = 0,
    armorIgnore = 0,
    heavyMultiplier = 1,
    tandemHeat = false,
    critChance = 0,
    isMissile = false,
    allowApsIntercept = true
  } = options;

  // Directed energy laser ignores APS/ERA completely
  const canBeInterceptedByAps =
    allowApsIntercept && isMissile && damageType !== 'laser';

  if (
    canBeInterceptedByAps &&
    enemy.hasAps &&
    enemy.apsCooldownTimer <= 0 &&
    !enemy.ewDisabled
  ) {
    enemy.apsCooldownTimer = enemy.apsMaxCooldown || 4.0;
    return {
      damage: 0,
      apsIntercepted: true,
      isRicochet: false,
      isCrit: false,
      eraBlocked: false
    };
  }

  let mult = 1.0;
  let isRicochet = false;
  let eraBlocked = false;
  let isCrit = false;

  const armor = enemy.armorClass; // 'light', 'medium', 'heavy', 'stealth'

  if (damageType === 'kinetic' || damageType === 'aa') {
    if (armor === 'medium') {
      const reduction = 0.35 * (1 - armorPierce);
      mult *= 1 - reduction;
    } else if (armor === 'heavy') {
      const reduction = 0.75 * (1 - armorPierce);
      mult *= 1 - reduction;
      if (armorPierce < 0.3) {
        isRicochet = true;
      }
    }
  } else if (damageType === 'apds') {
    if (armor === 'medium') {
      const reduction = 0.25 * (1 - armorIgnore);
      mult *= 1 - reduction;
    } else if (armor === 'heavy') {
      const reduction = 0.75 * (1 - armorIgnore);
      mult *= 1 - reduction;
      if (heavyMultiplier > 1) {
        mult *= heavyMultiplier;
      }
    }
  } else if (damageType === 'heat') {
    if (armor === 'heavy') {
      mult *= heavyMultiplier;
    } else if (armor === 'medium') {
      mult *= 1.35;
    }

    if (enemy.hasEra && enemy.eraIntact && !enemy.ewDisabled) {
      if (tandemHeat) {
        enemy.eraIntact = false;
      } else {
        mult *= 0.6;
        enemy.eraIntact = false;
        eraBlocked = true;
      }
    }
  } else if (damageType === 'thermobaric') {
    // Thermobaric overpressure melts ERA instantly and damages heavy & light armor
    if (enemy.hasEra && enemy.eraIntact) {
      enemy.eraIntact = false;
    }
    if (armor === 'heavy' || armor === 'light') {
      mult *= 1.35;
    } else if (armor === 'medium') {
      mult *= 1.25;
    }
  } else if (damageType === 'laser') {
    // Continuous directed-energy laser ignores ERA & APS and cuts heavy armor cleanly
    mult *= armor === 'heavy' ? 1.15 : 1.0;
  } else if (damageType === 'he' || damageType === 'he_rocket') {
    if (armor === 'light') {
      mult *= 1.15;
    } else if (armor === 'heavy') {
      mult *= damageType === 'he_rocket' ? 1.2 : 0.85;
    }
  } else if (damageType === 'aa_missile') {
    if (enemy.domain === 'air') {
      mult *= 1.15;
    }
  }

  // Critical precision hits (Phalanx Ku-Band / C-RAM)
  if (critChance > 0 && Math.random() < critChance) {
    mult *= 1.6;
    isCrit = true;
  }

  // Electronic Warfare & HELIOS thermal vulnerability amplification
  if (enemy.ewDamageAmp > 0) {
    mult *= 1 + enemy.ewDamageAmp;
  }
  if (enemy.thermalVuln > 0) {
    mult *= 1 + enemy.thermalVuln;
  }

  const finalDamage = Math.max(1, Math.round(rawDamage * mult));

  return {
    damage: finalDamage,
    apsIntercepted: false,
    isRicochet,
    isCrit,
    eraBlocked
  };
}
