// src/game/GameManager.js
// Менеджер игры: управление фазами, магазин, бэнч/команда, merge, симуляция боя, события.

import EventEmitter from '../utils/EventEmitter';
import { createBaseUnit, availableTypes } from './UnitFactory';
import { canMerge, mergeUnits } from './MergeSystem';
import BattleSimulator from './BattleSimulator';
import Unit from './Unit';

class GameManager {
  constructor({ initialCoins = 50, teamSlots = 6, benchSize = 8, shopSize = 5 } = {}) {
    this.emitter = new EventEmitter();
    this.coins = initialCoins;
    this.teamSlots = teamSlots;
    this.benchSize = benchSize;
    this.shopSize = shopSize;

    this.state = {
      phase: 'prepare', // prepare -> battle -> reward
      turn: 1,
      bench: new Array(this.benchSize).fill(null),
      team: new Array(this.teamSlots).fill(null),
      shop: [],
      lastBattleResult: null,
    };

    this.generateShop();
    this.emitState();
  }

  // События: 'stateUpdate', 'battleResult', 'merge', 'shopUpdate'
  on(event, cb) {
    return this.emitter.on(event, cb);
  }
  off(event, cb) {
    return this.emitter.off(event, cb);
  }

  emitState() {
    this.emitter.emit('stateUpdate', this.getState());
  }

  getState() {
    // Отдаём сериализуемый snapshot, чтобы UI мог рендерить
    const snapshot = {
      phase: this.state.phase,
      turn: this.state.turn,
      bench: this.state.bench.map((u) => (u ? (u.serialize ? u.serialize() : u) : null)),
      team: this.state.team.map((u) => (u ? (u.serialize ? u.serialize() : u) : null)),
      shop: this.state.shop.map((s) => ({ price: s.price, unit: (s.unit && s.unit.serialize) ? s.unit.serialize() : s.unit })),
      lastBattleResult: this.state.lastBattleResult,
      coins: this.coins,
    };
    return snapshot;
  }

  // SHOP
  generateShop() {
    const types = availableTypes();
    this.state.shop = [];
    for (let i = 0; i < this.shopSize; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const tier = 1;
      const unit = createBaseUnit(type, tier);
      const price = 5 + unit.tier * 3 + Math.floor(Math.random() * 3);
      this.state.shop.push({ unit, price });
    }
    this.emitter.emit('shopUpdate', this.state.shop.map((s) => ({ price: s.price, unit: s.unit.serialize() })));
    this.emitState();
  }

  buyFromShop(index) {
    const entry = this.state.shop[index];
    if (!entry) return { ok: false, reason: 'no_entry' };
    if (this.coins < entry.price) return { ok: false, reason: 'no_coins' };
    const freeBench = this.state.bench.findIndex((s) => s == null);
    if (freeBench === -1) return { ok: false, reason: 'no_bench_space' };
    this.coins -= entry.price;
    // Кладём единицу (object Unit) в бэнч
    this.state.bench[freeBench] = entry.unit;
    this.generateShop();
    this.emitState();
    return { ok: true, index: freeBench };
  }

  sellBench(benchIndex) {
    const unit = this.state.bench[benchIndex];
    if (!unit) return { ok: false, reason: 'empty' };
    const refund = Math.max(1, Math.round((unit.tier || 1) * (unit.tier || 1) * 2));
    this.coins += refund;
    this.state.bench[benchIndex] = null;
    this.emitState();
    return { ok: true, refund };
  }

  moveBenchToTeam(benchIndex, teamIndex) {
    if (teamIndex < 0 || teamIndex >= this.teamSlots) return { ok: false, reason: 'bad_team_index' };
    if (benchIndex < 0 || benchIndex >= this.benchSize) return { ok: false, reason: 'bad_bench_index' };
    if (!this.state.bench[benchIndex]) return { ok: false, reason: 'no_unit' };
    if (this.state.team[teamIndex]) return { ok: false, reason: 'team_slot_taken' };
    this.state.team[teamIndex] = this.state.bench[benchIndex];
    this.state.bench[benchIndex] = null;
    this.emitState();
    return { ok: true };
  }

  moveTeamToBench(teamIndex, benchIndex) {
    if (teamIndex < 0 || teamIndex >= this.teamSlots) return { ok: false, reason: 'bad_team_index' };
    if (benchIndex < 0 || benchIndex >= this.benchSize) return { ok: false, reason: 'bad_bench_index' };
    if (!this.state.team[teamIndex]) return { ok: false, reason: 'no_unit' };
    if (this.state.bench[benchIndex]) return { ok: false, reason: 'bench_taken' };
    this.state.bench[benchIndex] = this.state.team[teamIndex];
    this.state.team[teamIndex] = null;
    this.emitState();
    return { ok: true };
  }

  // Merge на бэнче: индексы
  tryMergeBench(indexA, indexB) {
    if (indexA === indexB) return { ok: false, reason: 'same_index' };
    if (indexA < 0 || indexB < 0 || indexA >= this.benchSize || indexB >= this.benchSize) return { ok: false, reason: 'bad_index' };
    const a = this.state.bench[indexA];
    const b = this.state.bench[indexB];
    if (!a || !b) return { ok: false, reason: 'empty_slot' };
    if (!canMerge(a, b)) return { ok: false, reason: 'cannot_merge' };
    const merged = mergeUnits(a, b);
    // Кладём merged в indexA и очищаем indexB
    this.state.bench[indexA] = merged;
    this.state.bench[indexB] = null;
    this.emitter.emit('merge', { indexA, indexB, result: merged.serialize() });
    this.emitState();
    return { ok: true, result: merged.serialize() };
  }

  // Обновить бэнч слоты (например drag & drop внутри бэнча)
  swapBench(aIndex, bIndex) {
    if (aIndex === bIndex) return;
    if (aIndex < 0 || bIndex < 0 || aIndex >= this.benchSize || bIndex >= this.benchSize) return;
    const tmp = this.state.bench[aIndex];
    this.state.bench[aIndex] = this.state.bench[bIndex];
    this.state.bench[bIndex] = tmp;
    this.emitState();
  }

  // START BATTLE / NEXT TURN
  nextTurn(options = {}) {
    if (this.state.phase !== 'prepare') {
      return { ok: false, reason: 'not_in_prepare' };
    }
    // готовим массивы Unit (клонируем)
    const allies = this.state.team.filter(Boolean).map((u) => (typeof u.clone === 'function' ? u.clone() : Unit.from(u)));
    const enemies = this._generateEnemyTeam(this.state.turn);
    this.state.phase = 'battle';
    this.emitState();

    const result = BattleSimulator.simulateBattle(allies, enemies, options);
    this.state.lastBattleResult = result;

    // награды
    if (result.winner === 'allies') {
      this.coins += 10 + this.state.turn * 2;
    } else if (result.winner === 'draw') {
      this.coins += 5;
    } else {
      this.coins += 2;
    }

    this.state.phase = 'reward';
    this.state.turn += 1;
    // после боя: восстановление здоровья команды в зависимости от логики (здесь — полное восстановление)
    this.state.team = this.state.team.map((u) => (u ? (typeof u.clone === 'function' ? u.clone() : Unit.from(u)) : null));
    // обновить магазин
    this.generateShop();
    this.emitState();
    this.emitter.emit('battleResult', result);
    return { ok: true, result };
  }

  _generateEnemyTeam(turn) {
    const size = Math.min(this.teamSlots, 3 + Math.floor(turn / 2));
    const enemies = [];
    const types = availableTypes();
    for (let i = 0; i < size; i++) {
      const type = types[i % types.length];
      const tier = Math.min(8, 1 + Math.floor(turn / 3));
      enemies.push(createBaseUnit(type, tier));
    }
    return enemies;
  }

  resetForNewMatch() {
    this.coins = 50;
    this.state = {
      phase: 'prepare',
      turn: 1,
      bench: new Array(this.benchSize).fill(null),
      team: new Array(this.teamSlots).fill(null),
      shop: [],
      lastBattleResult: null,
    };
    this.generateShop();
    this.emitState();
  }
}

export default GameManager;