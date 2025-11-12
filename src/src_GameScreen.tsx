import React, { useState, useEffect } from "react";
import { playSound, startBackgroundMusic, stopBackgroundMusic } from "../audioManager";
import { gameConfig } from "../gameConfig";
import { claimDailyReward, isDailyRewardAvailable } from "../dailyReward";
import { buyShopItem, donateAndBuyCoins } from "../shop";

export default function GameScreen({ mode, boardSize, playerName }) {
  const [maxBlock, setMaxBlock] = useState(gameConfig.boardPresets[boardSize-4].minBlock);
  const [coins, setCoins] = useState(gameConfig.shop.initialCoins);
  const [dailyAvailable, setDailyAvailable] = useState(isDailyRewardAvailable());
  const [shopError, setShopError] = useState("");
  const [status, setStatus] = useState("playing");

  useEffect(() => {
    startBackgroundMusic();
    return () => stopBackgroundMusic();
  }, []);

  const onClaimDaily = () => {
    if (isDailyRewardAvailable()) {
      const reward = claimDailyReward();
      if (reward) {
        setCoins(coins + reward);
        setDailyAvailable(false);
        playSound("win");
        setStatus(`Получено +${reward} монет!`);
      }
    }
  };
  const onShopBuy = (item) => {
    if (buyShopItem(item)) {
      setShopError("");
      playSound("click");
      setStatus(`Куплено: ${item}`);
    } else {
      setShopError("Недостаточно монет!");
      playSound("error");
    }
  };
  const onDonate = (amount) => {
    donateAndBuyCoins(amount);
    setCoins(coins + amount);
    playSound("click");
    setStatus(`Донат: +${amount} монет`);
  };
  const onMakeMove = (newBlock) => {
    setMaxBlock(Math.max(maxBlock, newBlock));
    playSound("mergeBlock");
    if (newBlock >= gameConfig.boardPresets[boardSize-4].maxBlock) {
      setStatus("Победа!");
      playSound("win");
    }
  };
  return (
    <div className="game-root" style={{ position: "relative" }}>
      <div className="ui-status">{status}</div>
      <div className="ui-coins">
        <span>Монет: {coins}</span>
        <button onClick={onClaimDaily} disabled={!dailyAvailable}>Ежедневная награда</button>
      </div>
      <div className="ui-shop">
        {Object.entries(gameConfig.shop.itemPrices).map(([item, price]) =>
          <button key={item} onClick={() => onShopBuy(item)}>
            {item} — {price} монет
          </button>
        )}
        <span style={{ color: "red" }}>{shopError}</span>
      </div>
      <div className="ui-donate">
        {gameConfig.shop.donationAmounts.map(amt =>
          <button key={amt} onClick={() => onDonate(amt)}>
            Донат +{amt}
          </button>
        )}
      </div>
      <div className="board">
        <button onClick={() => onMakeMove(maxBlock * 2)}>Слить блоки</button>
      </div>
    </div>
  );
}