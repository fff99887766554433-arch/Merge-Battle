// src/game/MergeSystem.js
// Правила слияния и реализация mergeUnits.

import { createBaseUnit } from './UnitFactory';
import Unit from './Unit';

export function canMerge(unitA, unitB) {
  if (!unitA || !unitB) return false;
  // если получили сериализованные объекты — восстановим минимально
  const a = (typeof unitA.clone === 'function') ? unitA : Unit.from(unitA);
  const b = (typeof unitB.clone === 'function') ? unitB : Unit.from(unitB);

  if (a.isDead || b.isDead) return false;
  if (a.mergeTag !== b.mergeTag) return false;
  if (a.tier !== b.tier) return false;
  // правило: максимальный уровень слияния, например 10 (можно менять)
  const MAX_TIER = 10;
  if (a.tier >= MAX_TIER) return false;
  return true;
}

export function mergeUnits(unitA, unitB, options = {}) {
  if (!canMerge(unitA, unitB)) {
    throw new Error('Units cannot be merged');
  }
  const a = (typeof unitA.clone === 'function') ? unitA.clone() : Unit.from(unitA);
  const b = (typeof unitB.clone === 'function') ? unitB.clone() : Unit.from(unitB);

  const nextTier = a.tier + 1;

  // Попытка создать через фабрику; если не доступно — увеличиваем статы вручную.
  let merged;
  try {
    merged = createBaseUnit(a.mergeTag, nextTier);
  } catch (e) {
    merged = a.clone();
    merged.tier = nextTier;
    merged.attack = Math.max(1, Math.round((a.attack + b.attack) * (options.attackScale || 0.8)));
    merged.maxHealth = Math.max(1, Math.round((a.maxHealth + b.maxHealth) * (options.healthScale || 0.9)));
    merged.health = merged.maxHealth;
    merged.speed = Math.max(0.2, +(Math.max(a.speed, b.speed) * (options.speedScale || 1.02)).toFixed(2));
  }

  // Добавим небольшое сохранение опыта/имён (можно расширить)
  merged.xp = (a.xp || 0) + (b.xp || 0);
  merged.name = merged.name || a.name;
  // Сгенерируем новый id
  merged.id = null;
  merged = Unit.from(merged.serialize ? merged.serialize() : merged);
  // Полное восстановление здоровья после слияния
  merged.reviveToFull && merged.reviveToFull();

  return merged;
}

export default {
  canMerge,
  mergeUnits,
};
