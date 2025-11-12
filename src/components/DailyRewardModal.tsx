import { motion } from "framer-motion";
import { NeonButton } from "./NeonButton";
import { Gift, X } from "lucide-react";

interface DailyReward {
  day: number;
  coins: number;
  bonus?: string;
  claimed: boolean;
}

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (coins: number) => void;
  currentDay: number;
}

const rewards: DailyReward[] = [
  { day: 1, coins: 100, claimed: false },
  { day: 2, coins: 150, claimed: false },
  { day: 3, coins: 200, claimed: false },
  { day: 4, coins: 250, claimed: false },
  { day: 5, coins: 300, bonus: "🎯", claimed: false },
  { day: 6, coins: 400, claimed: false },
  { day: 7, coins: 500, bonus: "💎", claimed: false },
];

export function DailyRewardModal({ 
  isOpen, 
  onClose, 
  onClaim, 
  currentDay 
}: DailyRewardModalProps) {
  if (!isOpen) return null;

  const todayReward = rewards.find(r => r.day === currentDay);

  const handleClaim = () => {
    if (todayReward) {
      onClaim(todayReward.coins);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-gradient-to-br from-[#0B0F19] to-[#1A1A1A] rounded-3xl border-2 border-[#FFD700]/50 shadow-[0_0_60px_rgba(255,215,0,0.3)] overflow-hidden"
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF6A00] rounded-full blur-[100px]" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6A00] mb-4 shadow-[0_0_30px_rgba(255,215,0,0.5)]"
            >
              <Gift size={40} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF6A00] bg-clip-text text-transparent">
              Daily Reward
            </h2>
            <p className="text-[#B8B8B8] text-sm mt-1">
              Day {currentDay} of 7
            </p>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {rewards.map((reward, index) => (
              <motion.div
                key={reward.day}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-1
                  ${reward.day === currentDay
                    ? "bg-gradient-to-br from-[#FFD700]/30 to-[#FF6A00]/30 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                    : reward.day < currentDay
                      ? "bg-[#00FF99]/10 border-[#00FF99]/30 opacity-50"
                      : "bg-white/5 border-white/10 opacity-50"
                  }
                `}
              >
                {reward.day < currentDay && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#00FF99] flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>
                )}
                {reward.day === currentDay && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-xl mb-0.5"
                    >
                      💰
                    </motion.div>
                    <div className="text-[10px] font-bold">{reward.coins}</div>
                  </>
                )}
                {reward.day > currentDay && (
                  <>
                    <div className="text-xl mb-0.5">
                      {reward.bonus || "💰"}
                    </div>
                    <div className="text-[10px]">{reward.coins}</div>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* Today's Reward Highlight */}
          {todayReward && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-[#FFD700]/20 to-[#FF6A00]/20 rounded-2xl p-6 mb-6 border-2 border-[#FFD700]/30"
            >
              <div className="text-center">
                <p className="text-[#B8B8B8] text-sm mb-2">Today's Reward</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl">💰</span>
                  <span className="text-3xl font-bold text-[#FFD700]">
                    {todayReward.coins}
                  </span>
                </div>
                {todayReward.bonus && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-2xl">{todayReward.bonus}</span>
                    <span className="text-sm text-[#00FF99]">Bonus Item!</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Claim Button */}
          <NeonButton onClick={handleClaim} className="w-full">
            <Gift size={20} className="mr-2" />
            Claim Reward
          </NeonButton>

          {/* Streak Info */}
          <p className="text-center text-xs text-[#B8B8B8] mt-4">
            Come back tomorrow for even better rewards! 🎁
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
