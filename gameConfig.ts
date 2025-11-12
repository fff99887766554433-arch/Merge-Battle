/**
 * Глобальные настройки игры Merge Battle.
 * Все параметры централизованы для удобства поддержки и масштабирования.
 * Изменения на этом этапе снабжены подробными комментариями.
 */

export interface BoardSettings {
  size: number; // Размер поля N x N
  minBlock: number;
  maxBlock: number;
  winBlockRange: [number, number];
}

export interface DailyRewardSettings {
  enabled: boolean;
  minCoins: number;
  maxCoins: number;
  cooldownHours: number; // Через сколько часов возможно повторное получение
}

export interface ShopSettings {
  initialCoins: number;
  itemPrices: { [item: string]: number }; // Цены на предметы
  donationAmounts: number[]; // Возможные суммы доната
}

export interface SoundSettings {
  enabled: boolean;
  mergeBlock: string; // Merge SFX
  bgMusic: string; // Background theme
  click: string; // Button click SFX
  win: string; // Win SFX
  error: string; // Error SFX
}

export interface PvPSettings {
  enabled: boolean;
  onlineServerURL: string; // URL сервера для PvP
  winCondition: "reachBlock";
  randomTargetBlock: boolean; // true → цель генерируется случайно по диапазону поля
}

const boardPresets: BoardSettings[] = [
  // 4x4
  { size: 4, minBlock: 256, maxBlock: 2048, winBlockRange: [256, 2048] },
  // 5x5
  { size: 5, minBlock: 1024, maxBlock: 8192, winBlockRange: [1024, 8192] },
  // 6x6
  { size: 6, minBlock: 2048, maxBlock: 16384, winBlockRange: [2048, 16384] },
  // ... до 10x10
  { size: 10, minBlock: 32768, maxBlock: 1048576, winBlockRange: [32768, 1048576] }
];

const dailyReward: DailyRewardSettings = {
  enabled: true,
  minCoins: 50,
  maxCoins: 300,
  cooldownHours: 24 // раз в сутки
};

const shop: ShopSettings = {
  initialCoins: 500,
  itemPrices: {
    booster: 200,
    extraMove: 350,
    theme: 1000,
    diamond: 2500
  },
  donationAmounts: [99, 249, 499, 999, 1999]
};

const sound: SoundSettings = {
  enabled: true,
  mergeBlock: "sounds/merge.mp3",
  bgMusic: "sounds/bgmusic.mp3",
  click: "sounds/click.mp3",
  win: "sounds/win.mp3",
  error: "sounds/error.mp3"
};

const pvp: PvPSettings = {
  enabled: true,
  onlineServerURL: "https://mergebattle-pvp-server.example.com",
  winCondition: "reachBlock",
  randomTargetBlock: true
};

export const gameConfig = {
  boardPresets,
  dailyReward,
  shop,
  sound,
  pvp
} as const;