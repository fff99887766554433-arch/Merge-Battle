// Merge Battle/economy.ts — простая реализация на localStorage для разработки
export type PlayerData = {
  id?: string;
  coins: number;
  boosters?: number;
  extraMoves?: number;
  diamonds?: number;
};

const STORAGE_KEY = 'merge_battle_player';

export function getPlayerData(): PlayerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { coins: 1500 };
    return JSON.parse(raw) as PlayerData;
  } catch (e) {
    console.warn('economy.getPlayerData parse error', e);
    return { coins: 1500 };
  }
}

export function updatePlayerData(updater: Partial<PlayerData> | ((p: PlayerData)=>PlayerData)) {
  const cur = getPlayerData();
  const next = typeof updater === 'function' ? updater(cur) : { ...cur, ...updater };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
