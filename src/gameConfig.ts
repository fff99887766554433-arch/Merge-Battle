// gameConfig.ts
export const gameConfig = {
  sound: {
    enabled: true,
    bgMusic: "/audio/bgMain.mp3",
    buttonClick: "/audio/buttonClick.mp3",
    tileMerge: "/audio/tileMerge.mp3",
    coin: "/audio/coin.mp3",
    silentUnlock: "/audio/buttonClick.mp3"
  },

  shop: {
    items: [
      { id: 1, name: "Booster x2", price: 500, type: "booster" },
      { id: 2, name: "Theme Dark", price: 1200, type: "theme" },
    ],
  },

  leaderboard: {
    localKey: "merge_battle_leaderboard",
  },

  // Пример API — можно заменить, если появится сервер
  pvp: {
    onlineServerURL: "",
  },
};
