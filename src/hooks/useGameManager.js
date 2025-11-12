// src/hooks/useGameManager.js
// React hook-обёртка вокруг GameManager для удобной интеграции с React / React Native.
// Пример использования:
// const { state, buyFromShop, moveBenchToTeam, nextTurn } = useGameManager();

import { useEffect, useMemo, useState, useRef } from 'react';
import GameManager from '../game/GameManager';

export default function useGameManager(opts = {}) {
  const managerRef = useRef(null);
  if (managerRef.current == null) {
    managerRef.current = new GameManager(opts);
  }
  const manager = managerRef.current;

  const [stateSnapshot, setStateSnapshot] = useState(manager.getState());

  useEffect(() => {
    const unsub = manager.on('stateUpdate', (s) => {
      setStateSnapshot(s);
    });
    const unsubBattle = manager.on('battleResult', () => {
      // stateUpdate тоже придёт, но мы можем дополнительно реагировать
    });
    // инициализация
    setStateSnapshot(manager.getState());
    return () => {
      unsub();
      unsubBattle();
      // не удаляем managerRef, чтобы сохранить матч, если хук размонтируется/смонтируется
    };
  }, [manager]);

  const api = useMemo(() => ({
    manager,
    getState: () => manager.getState(),
    buyFromShop: (index) => manager.buyFromShop(index),
    sellBench: (index) => manager.sellBench(index),
    moveBenchToTeam: (benchIndex, teamIndex) => manager.moveBenchToTeam(benchIndex, teamIndex),
    moveTeamToBench: (teamIndex, benchIndex) => manager.moveTeamToBench(teamIndex, benchIndex),
    tryMergeBench: (a, b) => manager.tryMergeBench(a, b),
    swapBench: (a, b) => manager.swapBench(a, b),
    nextTurn: (options) => manager.nextTurn(options),
    reset: () => manager.resetForNewMatch(),
    on: (event, cb) => manager.on(event, cb),
    off: (event, cb) => manager.off(event, cb),
  }), [manager]);

  return { state: stateSnapshot, ...api };
}