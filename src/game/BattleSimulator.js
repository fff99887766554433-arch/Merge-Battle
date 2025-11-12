// src/game/BattleSimulator.js
// Улучшенный симулятор боя: тик-ориентирован, поддерживает атаки, крит и приоритет.
// Возвращает детализированный результат.

import Unit from './Unit';

function pickTargetByLowestHealth(attacker, enemyUnits) {
  const alive = enemyUnits.filter((u) => !u.isDead);
  if (alive.length === 0) return null;
  let target = alive[0];
  for (let i = 1; i < alive.length; i++) {
    if (alive[i].health < target.health) target = alive[i];
  }
  return target;
}

function computeDamage(attacker, target, options = {}) {
  // Базовый урон — атака атакующего.
  let damage = attacker.attack;
  // шанс критического удара
  const critChance = options.critChance || 0.05;
  const critMultiplier = options.critMultiplier || 1.5;
  if (Math.random() < critChance) {
    damage = Math.round(damage * critMultiplier);
    return { damage, isCrit: true };
  }
  return { damage, isCrit: false };
}

export function simulateBattle(allyUnits = [], enemyUnits = [], options = {}) {
  // Клонируем юнитов в независимые объекты Unit
  const allies = allyUnits.map((u) => (typeof u.clone === 'function' ? u.clone() : Unit.from(u)));
  const enemies = enemyUnits.map((u) => (typeof u.clone === 'function' ? u.clone() : Unit.from(u)));
  const log = [];
  const maxTicks = options.maxTicks || 1000;
  let tick = 0;

  // Инициализация: флаги здоровья
  [...allies, ...enemies].forEach((u) => {
    u.isDead = false;
    if (u.maxHealth == null) u.maxHealth = u.health;
    if (u.health == null) u.health = u.maxHealth;
  });

  const isSideAlive = (side) => side.some((u) => !u.isDead);

  while (tick < maxTicks && isSideAlive(allies) && isSideAlive(enemies)) {
    tick++;
    // Список акторов — живые юниты обеих сторон
    const acting = [...allies.filter((u) => !u.isDead), ...enemies.filter((u) => !u.isDead)]
      .sort((a, b) => {
        if (b.speed !== a.speed) return b.speed - a.speed;
        // tie-breaker: higher attack first
        if (b.attack !== a.attack) return b.attack - a.attack;
        return Math.random() - 0.5;
      });

    for (const actor of acting) {
      if (actor.isDead) continue;
      const isAlly = allies.includes(actor);
      const opponents = isAlly ? enemies : allies;
      if (!isSideAlive(opponents)) break;
      const target = pickTargetByLowestHealth(actor, opponents);
      if (!target) continue;
      const { damage, isCrit } = computeDamage(actor, target, options);
      const applied = target.takeDamage(damage);
      log.push({
        tick,
        attackerId: actor.id,
        attackerName: actor.name,
        attackerTier: actor.tier,
        targetId: target.id,
        targetName: target.name,
        targetTier: target.tier,
        damage: applied,
        isCrit,
        targetRemaining: target.health,
        targetDead: target.isDead,
      });
    }
    // safety break
    if (!isSideAlive(allies) || !isSideAlive(enemies)) break;
  }

  const alliesAlive = allies.filter((u) => !u.isDead).map((u) => (u.serialize ? u.serialize() : u));
  const enemiesAlive = enemies.filter((u) => !u.isDead).map((u) => (u.serialize ? u.serialize() : u));

  let winner = 'draw';
  if (alliesAlive.length > 0 && enemiesAlive.length === 0) winner = 'allies';
  else if (enemiesAlive.length > 0 && alliesAlive.length === 0) winner = 'enemies';

  const result = {
    winner,
    allies: allies.map((u) => (u.serialize ? u.serialize() : u)),
    enemies: enemies.map((u) => (u.serialize ? u.serialize() : u)),
    alliesAlive,
    enemiesAlive,
    log,
    ticks: tick,
    optionsUsed: options,
  };

  return result;
}

export default {
  simulateBattle,
};
