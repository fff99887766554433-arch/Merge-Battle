import { gameConfig } from "./gameConfig";
import { getPlayerData, updatePlayerData } from "./economy";
/**
 * Получение времени последней награды для игрока.
 */
function getLastRewardTimestamp(): number {
  return parseInt(localStorage.getItem("lastDailyReward") ?? "0");
}
function setLastRewardTimestamp(ts: number) {
  localStorage.setItem("lastDailyReward", String(ts));
}
export function isDailyRewardAvailable(): boolean {
  if (!gameConfig.dailyReward.enabled) return false;
  const lastTs = getLastRewardTimestamp();
  const now = Date.now();
  const diffHours = (now - lastTs) / 3600000;
  return diffHours >= gameConfig.dailyReward.cooldownHours;
}
export function claimDailyReward(): number | null {
  if (!isDailyRewardAvailable()) return null;
  const reward =
    Math.floor(
      Math.random() *
        (gameConfig.dailyReward.maxCoins -
          gameConfig.dailyReward.minCoins +
          1)
    ) + gameConfig.dailyReward.minCoins;
  const player = getPlayerData();
  player.coins += reward;
  updatePlayerData(player);
  setLastRewardTimestamp(Date.now());
  return reward;
}