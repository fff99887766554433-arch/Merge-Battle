import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SplashScreen } from "./components/screens/SplashScreen";
import { Onboarding } from "./components/screens/Onboarding";
import { MainMenu } from "./components/screens/MainMenu";
import { GameScreen } from "./components/screens/GameScreen";
import { PvPLobby } from "./components/screens/PvPLobby";
import { Leaderboard } from "./components/screens/Leaderboard";
import { Shop } from "./components/screens/Shop";
import { Settings } from "./components/screens/Settings";
import { Profile } from "./components/screens/Profile";
import { Challenges } from "./components/screens/Challenges";
import { Statistics } from "./components/screens/Statistics";
import { DailyRewardModal } from "./components/DailyRewardModal";
import { AchievementToast } from "./components/AchievementToast";
import { TutorialOverlay } from "./components/TutorialOverlay";
import { GridSizeSelector } from "./components/GridSizeSelector";
import { availableTileBlocks, availableBackgrounds } from "./components/tileBlockData";
import "./styles/globals.css";
import SoundToggle from "./components/SoundToggle";
import audioManager from "./audioManager";

function handleStartGame() {
  resumeAudioAfterUserGesture(); // Разблокирует звук
  // ...дальше логика перехода к игре
}

type Screen =
  | "splash"
  | "onboarding"
  | "menu"
  | "game"
  | "pvp"
  | "leaderboard"
  | "shop"
  | "settings"
  | "profile"
  | "challenges"
  | "statistics";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [coins, setCoins] = useState(1500);
  const [transitionDirection, setTransitionDirection] = useState<"left" | "right">("left");
  const [activeTheme, setActiveTheme] = useState("neon-cyber");
  const [ownedThemes, setOwnedThemes] = useState<string[]>(["neon-cyber"]);
  const [ownedTileBlocks, setOwnedTileBlocks] = useState<string[]>(["neon-classic"]);
  const [activeTileBlock, setActiveTileBlock] = useState("neon-classic");
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>(["default-dark"]);
  const [activeBackground, setActiveBackground] = useState("default-dark");
  const [selectedGridSize, setSelectedGridSize] = useState<4 | 5 | 6 | 7 | 8 | 9 | 10>(4);
  const [showGridSizeSelector, setShowGridSizeSelector] = useState(false);
  const [pendingScreen, setPendingScreen] = useState<"game" | "pvp" | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [dailyRewardDay, setDailyRewardDay] = useState(1);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [achievementToast, setAchievementToast] = useState<{
    icon: string;
    name: string;
    description: string;
  } | null>(null);

  // === Инициализация аудио при старте ===
  useEffect(() => {
    audioManager.preloadEffects([
      { name: "tileMerge", url: "/audio/tileMerge.mp3" },
      { name: "tileMove", url: "/audio/tileMove.mp3" },
      { name: "tileAppear", url: "/audio/tileAppear.mp3" },
      { name: "levelUp", url: "/audio/levelUp.mp3" },
      { name: "scorePoint", url: "/audio/scorePoint.mp3" },
      { name: "win", url: "/audio/win.mp3" },
      { name: "lose", url: "/audio/lose.mp3" },
      { name: "buttonClick", url: "/audio/buttonClick.mp3" },
      { name: "notification", url: "/audio/notification.mp3" },
      { name: "coin", url: "/audio/coin.mp3" },
      { name: "purchase", url: "/audio/purchase.mp3" },
    ]);

    audioManager.playMusic("/audio/bgMain.mp3", true);
  }, []);

  // Проверяем онбординг
  useEffect(() => {
    const seen = localStorage.getItem("hasSeenOnboarding");
    setHasSeenOnboarding(seen === "true");
  }, []);

  // Показ ежедневной награды
  useEffect(() => {
    if (currentScreen === "menu" && hasSeenOnboarding) {
      const timer = setTimeout(() => {
        const lastClaim = localStorage.getItem("lastDailyReward");
        const today = new Date().toDateString();
        if (lastClaim !== today) setShowDailyReward(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, hasSeenOnboarding]);

  // 🎁 Обработка награды дня
  const handleDailyRewardClaim = (rewardCoins: number) => {
    setCoins(coins + rewardCoins);
    localStorage.setItem("lastDailyReward", new Date().toDateString());
    audioManager.playEffect("coin");

    setAchievementToast({
      icon: "💰",
      name: "Daily Reward Claimed!",
      description: `You earned ${rewardCoins} coins`,
    });

    setTimeout(() => setAchievementToast(null), 4000);
    setDailyRewardDay((prev) => (prev >= 7 ? 1 : prev + 1));
  };

  // 🚀 Завершение онбординга
  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setHasSeenOnboarding(true);
    audioManager.playEffect("coin");
    setCurrentScreen("menu");
  };

  // Навигация между экранами
  const handleNavigate = (screen: Screen) => {
    const screenOrder: Screen[] = [
      "menu",
      "game",
      "pvp",
      "leaderboard",
      "shop",
      "settings",
      "profile",
      "challenges",
      "statistics",
    ];
    const currentIndex = screenOrder.indexOf(currentScreen);
    const nextIndex = screenOrder.indexOf(screen);

    if (currentIndex !== -1 && nextIndex !== -1) {
      setTransitionDirection(nextIndex > currentIndex ? "left" : "right");
    }
    setCurrentScreen(screen);
  };

  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "left" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      x: direction === "left" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0B0F19] to-[#1A1A1A]">
      <AnimatePresence mode="wait" custom={transitionDirection}>
        <motion.div
          key={currentScreen}
          custom={transitionDirection}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          {/* Экраны */}
          {currentScreen === "splash" && (
            <SplashScreen onComplete={() => setCurrentScreen(hasSeenOnboarding ? "menu" : "onboarding")} />
          )}
          {currentScreen === "onboarding" && <Onboarding onComplete={handleOnboardingComplete} />}
          {currentScreen === "menu" && (
            <MainMenu
              onNavigate={(screen) => {
                if (screen === "game" || screen === "pvp") {
                  setPendingScreen(screen);
                  setShowGridSizeSelector(true);
                } else handleNavigate(screen);
              }}
              coins={coins}
              onDailyRewardClick={() => setShowDailyReward(true)}
              onTutorialClick={() => setShowTutorial(true)}
            />
          )}
          {currentScreen === "game" && (
            <GameScreen
              onNavigate={(screen) => handleNavigate(screen)}
              gridSize={selectedGridSize}
              targetTile={2048}
              timedMode={false}
              tileBlock={availableTileBlocks.find((b) => b.id === activeTileBlock)}
              background={availableBackgrounds.find((b) => b.id === activeBackground)}
            />
          )}
          {currentScreen === "pvp" && (
            <PvPLobby onNavigate={(screen) => handleNavigate(screen)} gridSize={selectedGridSize} />
          )}
          {currentScreen === "leaderboard" && <Leaderboard onNavigate={(screen) => handleNavigate(screen)} />}
          {currentScreen === "shop" && (
            <Shop
              onNavigate={(screen) => handleNavigate(screen)}
              coins={coins}
              onCoinsChange={setCoins}
              ownedThemes={ownedThemes}
              onThemePurchase={(themeId) => {
                audioManager.playEffect("purchase");
                if (!ownedThemes.includes(themeId)) setOwnedThemes([...ownedThemes, themeId]);
              }}
              ownedTileBlocks={ownedTileBlocks}
              onTileBlockPurchase={(blockId) => {
                audioManager.playEffect("purchase");
                if (!ownedTileBlocks.includes(blockId)) {
                  setOwnedTileBlocks([...ownedTileBlocks, blockId]);
                  setActiveTileBlock(blockId);
                }
              }}
              ownedBackgrounds={ownedBackgrounds}
              onBackgroundPurchase={(backgroundId) => {
                audioManager.playEffect("purchase");
                if (!ownedBackgrounds.includes(backgroundId)) {
                  setOwnedBackgrounds([...ownedBackgrounds, backgroundId]);
                  setActiveBackground(backgroundId);
                }
              }}
            />
          )}
          {currentScreen === "settings" && <Settings onNavigate={(screen) => handleNavigate(screen)} />}
          {currentScreen === "profile" && (
            <Profile
              onNavigate={(screen) => handleNavigate(screen)}
              activeTheme={activeTheme}
              onThemeChange={setActiveTheme}
              ownedThemes={ownedThemes}
              activeTileBlock={activeTileBlock}
              onTileBlockChange={setActiveTileBlock}
              ownedTileBlocks={ownedTileBlocks}
              activeBackground={activeBackground}
              onBackgroundChange={setActiveBackground}
              ownedBackgrounds={ownedBackgrounds}
            />
          )}
          {currentScreen === "challenges" && (
            <Challenges onNavigate={(screen) => handleNavigate(screen)} coins={coins} onCoinsChange={setCoins} />
          )}
          {currentScreen === "statistics" && <Statistics onNavigate={(screen) => handleNavigate(screen)} />}
        </motion.div>
      </AnimatePresence>

      {/* Модальные окна */}
      <DailyRewardModal
        isOpen={showDailyReward}
        onClose={() => setShowDailyReward(false)}
        onClaim={handleDailyRewardClaim}
        currentDay={dailyRewardDay}
      />

      <AchievementToast achievement={achievementToast} onClose={() => setAchievementToast(null)} />

      <TutorialOverlay
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={() => {
          localStorage.setItem("hasCompletedTutorial", "true");
          setShowTutorial(false);
        }}
      />

      <GridSizeSelector
        isOpen={showGridSizeSelector}
        onClose={() => {
          setShowGridSizeSelector(false);
          setPendingScreen(null);
        }}
        onSelect={(size) => {
          setSelectedGridSize(size);
          setShowGridSizeSelector(false);
          if (pendingScreen) {
            handleNavigate(pendingScreen);
            setPendingScreen(null);
          }
        }}
      />

      {/* Фоновая анимация */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#00FFFF] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#A100FF] blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-[#FF00FF] blur-[150px]"
        />
      </div>
    </div>
  );
}
