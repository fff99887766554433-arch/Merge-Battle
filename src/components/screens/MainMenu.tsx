import { motion } from "framer-motion";
import { NeonButton } from "../NeonButton";
import { IconButton } from "../IconButton";
import { CoinBadge } from "../CoinBadge";
import { Play, Swords, Trophy, ShoppingBag, Settings, User, Target, Gift, HelpCircle } from "lucide-react";

interface MainMenuProps {
  onNavigate: (screen: string) => void;
  coins: number;
  onDailyRewardClick?: () => void;
  onTutorialClick?: () => void;
}

export function MainMenu({ onNavigate, coins, onDailyRewardClick, onTutorialClick }: MainMenuProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <IconButton
          icon={<User size={24} />}
          onClick={() => onNavigate("profile")}
        />
        <CoinBadge amount={coins} />
        <IconButton
          icon={<Settings size={24} />}
          onClick={() => onNavigate("settings")}
        />
      </div>
      
      {/* Daily Reward & Challenges Banner */}
      <div className="px-4 flex gap-3 mb-4">
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDailyRewardClick}
          className="flex-1 bg-gradient-to-r from-[#FFD700]/20 to-[#FF6A00]/20 border-2 border-[#FFD700]/50 rounded-2xl p-3 flex items-center gap-3 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6A00] flex items-center justify-center">
            <Gift size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs text-[#B8B8B8]">Daily Reward</p>
            <p className="font-bold text-sm">Claim Now!</p>
          </div>
        </motion.button>
        
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate("challenges")}
          className="flex-1 bg-gradient-to-r from-[#00FFFF]/20 to-[#00FF99]/20 border-2 border-[#00FFFF]/50 rounded-2xl p-3 flex items-center gap-3 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#00FF99] flex items-center justify-center">
            <Target size={20} className="text-black" />
          </div>
          <div className="text-left">
            <p className="text-xs text-[#B8B8B8]">Challenges</p>
            <p className="font-bold text-sm">3/5 Active</p>
          </div>
        </motion.button>
      </div>
      
      {/* Logo */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mt-12 mb-8"
      >
        <motion.h1
          className="text-5xl font-bold mb-2"
          animate={{
            textShadow: [
              "0 0 20px rgba(0,255,255,0.5)",
              "0 0 40px rgba(0,255,255,0.8)",
              "0 0 20px rgba(0,255,255,0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="bg-gradient-to-r from-[#00FFFF] via-[#A100FF] to-[#FF00FF] bg-clip-text text-transparent">
            MERGE BATTLE
          </span>
        </motion.h1>
        <p className="text-[#B8B8B8]">Neon Glow Edition</p>
      </motion.div>
      
      {/* Main Menu Buttons */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-4 pb-20">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm"
        >
          <NeonButton
            onClick={() => onNavigate("game")}
            className="w-full flex items-center justify-center gap-3"
          >
            <Play size={24} fill="currentColor" />
            <span className="text-xl">PLAY</span>
          </NeonButton>
        </motion.div>
        
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm"
        >
          <NeonButton
            variant="secondary"
            onClick={() => onNavigate("pvp")}
            className="w-full flex items-center justify-center gap-3"
          >
            <Swords size={24} />
            <span className="text-xl">PVP BATTLE</span>
          </NeonButton>
        </motion.div>
        
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-sm"
        >
          <NeonButton
            variant="ghost"
            onClick={() => onNavigate("leaderboard")}
            className="w-full flex items-center justify-center gap-3"
          >
            <Trophy size={24} />
            <span className="text-xl">LEADERBOARD</span>
          </NeonButton>
        </motion.div>
        
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-sm"
        >
          <NeonButton
            variant="ghost"
            onClick={() => onNavigate("shop")}
            className="w-full flex items-center justify-center gap-3"
          >
            <ShoppingBag size={24} />
            <span className="text-xl">SHOP</span>
          </NeonButton>
        </motion.div>
      </div>
      
      {/* Footer */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="pb-8"
      >
        {/* Tutorial Button */}
        {onTutorialClick && (
          <button
            onClick={onTutorialClick}
            className="mx-auto mb-4 flex items-center gap-2 text-[#00FFFF] hover:text-[#00FF99] transition-colors"
          >
            <HelpCircle size={18} />
            <span className="text-sm">How to Play</span>
          </button>
        )}
        
        <p className="text-center text-sm text-[#6B6B6B]">
          Version 1.0.0 • © 2025 Merge Battle
        </p>
      </motion.div>
    </div>
  );
}
