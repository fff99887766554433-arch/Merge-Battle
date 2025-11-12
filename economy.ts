export type PlayerData = {
  id?: string;
  displayName?: string;
  avatarUrl?: string;
  coins: number;
  boosters?: number;
  extraMoves?: number;
  diamonds?: number;
  purchasedItems?: string[]; // ids
  equippedItems?: { [slot: string]: string }; // slot -> itemId
  stats?: {
    gamesPlayed?: number;
    bestScore?: number;
    merges?: number;
  };
};

const STORAGE_KEY = "merge_battle_player";

export function getPlayerData(): PlayerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { coins: 1500, displayName: "Player", purchasedItems: [], equippedItems: {}, stats: {} };
    return JSON.parse(raw) as PlayerData;
  } catch (e) {
    console.warn("economy.getPlayerData parse error", e);
    return { coins: 1500, displayName: "Player", purchasedItems: [], equippedItems: {}, stats: {} };
  }
}

export function updatePlayerData(updater: Partial<PlayerData> | ((p: PlayerData) => PlayerData)) {
  const cur = getPlayerData();
  const next = typeof updater === "function" ? updater(cur) : { ...cur, ...updater };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}