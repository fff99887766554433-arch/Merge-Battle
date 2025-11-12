// src/game/UnitFactory.js
// Фабрика базовых юнитов и утилиты масштабирования.

import Unit from './Unit';

const baseDefinitions = {
  soldier: { name: 'Soldier', attack: 3, health: 10, speed: 1.0, mergeTag: 'soldier' },
  sniper: { name: 'Sniper', attack: 5, health: 6, speed: 1.2, mergeTag: 'sniper' },
  tank: { name: 'Tank', attack: 7, health: 18, speed: 0.6, mergeTag: 'tank' },
  mage: { name: 'Mage', attack: 4, health: 8, speed: 1.1, mergeTag: 'mage' },
};

function scaleForTier(stat, tier) {
  // Простая формула: линейное масштабирование с уменьшением отдачи.
  if (tier <= 1) return stat;
  return Math.round(stat * (1 + 0.5 * (tier - 1)));
}

function speedForTier(baseSpeed, tier) {
  // небольшое увеличение скорости с ростом тира
  return Math.max(0.2, +(baseSpeed * (1 + 0.03 * (tier - 1))).toFixed(2));
}

export function createBaseUnit(typeId = 'soldier', tier = 1) {
  const def = baseDefinitions[typeId];
  if (!def) throw new Error(`Unknown unit type: ${typeId}`);
  const attack = scaleForTier(def.attack, tier);
  const health = scaleForTier(def.health, tier);
  const speed = speedForTier(def.speed, tier);
  return new Unit({
    name: def.name,
    tier,
    attack,
    health,
    speed,
    mergeTag: def.mergeTag,
  });
}

export function availableTypes() {
  return Object.keys(baseDefinitions);
}

export function registerType(typeId, def) {
  if (!typeId || !def) throw new Error('Invalid type registration');
  baseDefinitions[typeId] = def;
}

export default {
  createBaseUnit,
  availableTypes,
  registerType,
};
