import { gameConfig } from "./gameConfig";
import { getPlayerData, updatePlayerData } from "./economy";

export function buyShopItem(itemName: keyof typeof gameConfig.shop.itemPrices): boolean {
  const player = getPlayerData();
  const price = gameConfig.shop.itemPrices[itemName];
  if (player.coins < price) {
    playSound(gameConfig.sound.error);
    return false;
  }
  player.coins -= price;
  switch (itemName) {
    case "booster":
      player.boosters = (player.boosters ?? 0) + 1;
      useBooster(player);
      break;
    case "extraMove":
      player.extraMoves = (player.extraMoves ?? 0) + 1;
      useExtraMove(player);
      break;
    case "theme":
      unlockTheme(player, "new_theme");
      break;
    case "diamond":
      player.diamonds = (player.diamonds ?? 0) + 1;
      break;
    default:
      break;
  }
  updatePlayerData(player);
  playSound(gameConfig.sound.click);
  return true;
}
export function donateAndBuyCoins(amount: number): boolean {
  const player = getPlayerData();
  if (!gameConfig.shop.donationAmounts.includes(amount)) return false;
  player.coins += amount;
  updatePlayerData(player);
  playSound(gameConfig.sound.click);
  return true;
}
function useBooster(player: any) {
  playSound(gameConfig.sound.mergeBlock);
}
function useExtraMove(player: any) {
  playSound(gameConfig.sound.mergeBlock);
}
function unlockTheme(player: any, themeId: string) {
  playSound(gameConfig.sound.click);
}
function playSound(src: string) {
  if (gameConfig.sound.enabled && src) {
    const audio = new Audio(src);
    audio.play();
  }
}