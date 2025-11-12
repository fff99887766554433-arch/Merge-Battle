import { gameConfig } from "./gameConfig";
import { getPlayerData, updatePlayerData } from "./economy";

/**
 * buyShopItem теперь:
 * - Проверяет стоимость
 * - Отнимает монеты
 * - Добавляет itemId в purchasedItems
 * - Не применяет автоматом (apply/ equip отдельной функцией)
 */
export function buyShopItem(itemName: keyof typeof gameConfig.shop.itemPrices) {
  const player = getPlayerData();
  const price = (gameConfig as any).shop.itemPrices[itemName];
  if (player.coins < price) {
    playSound((gameConfig as any).sound.error);
    return { success: false, reason: "not_enough" };
  }
  player.coins -= price;
  player.purchasedItems = (player.purchasedItems ?? []).concat(itemName as string);
  updatePlayerData(player);
  playSound((gameConfig as any).sound.click);
  return { success: true, itemName };
}

export function equipItem(itemId: string, slot = "default") {
  const player = getPlayerData();
  if (!player.purchasedItems || !player.purchasedItems.includes(itemId)) return false;
  player.equippedItems = player.equippedItems ?? {};
  player.equippedItems[slot] = itemId;
  updatePlayerData(player);
  playSound((gameConfig as any).sound.click);
  return true;
}

export function donateAndBuyCoins(amount: number) {
  const player = getPlayerData();
  if (!((gameConfig as any).shop.donationAmounts ?? []).includes(amount)) return { success: false };
  player.coins += amount;
  updatePlayerData(player);
  playSound((gameConfig as any).sound.click);
  return { success: true };
}

function playSound(src: string) {
  try {
    if ((gameConfig as any).sound.enabled && src) {
      const a = new Audio(src);
      a.play();
    }
  } catch {}
}