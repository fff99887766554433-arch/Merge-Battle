import { useState } from "react";
import { motion } from "framer-motion";
import { IconButton } from "../IconButton";
import { NeonButton } from "../NeonButton";
import { CoinBadge } from "../CoinBadge";
import { 
  ArrowLeft, 
  Trophy, 
  Zap, 
  Target, 
  Clock, 
  Star,
  CheckCircle2,
  Lock
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  goal: number;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  icon: React.ReactNode;
  completed: boolean;
  locked?: boolean;
}

interface ChallengesProps {
  onNavigate: (screen: string) => void;
  coins: number;
  onCoinsChange: (coins: number) => void;
}

export function Challenges({ onNavigate, coins, onCoinsChange }: ChallengesProps) {
  const [challenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Quick Starter",
      description: "Complete 5 games today",
      progress: 3,
      goal: 5,
      reward: 100,
      difficulty: "easy",
      icon: <Zap size={24} />,
      completed: false,
    },
    {
      id: "2",
      title: "Merge Master",
      description: "Make 100 merges in a single game",
      progress: 67,
      goal: 100,
      reward: 200,
      difficulty: "medium",
      icon: <Target size={24} />,
      completed: false,
    },
    {
      id: "3",
      title: "Speed Demon",
      description: "Win a game in under 3 minutes",
      progress: 0,
      goal: 1,
      reward: 300,
      difficulty: "hard",
      icon: <Clock size={24} />,
      completed: false,
    },
    {
      id: "4",
      title: "High Scorer",
      description: "Score 10,000+ points",
      progress: 1,
      goal: 1,
      reward: 150,
      difficulty: "easy",
      icon: <Star size={24} />,
      completed: true,
    },
    {
      id: "5",
      title: "Combo Champion",
      description: "Make 10 consecutive merges",
      progress: 6,
      goal: 10,
      reward: 250,
      difficulty: "medium",
      icon: <Zap size={24} />,
      completed: false,
    },
    {
      id: "6",
      title: "Ultimate Champion",
      description: "Reach 4096 tile",
      progress: 0,
      goal: 1,
      reward: 500,
      difficulty: "hard",
      icon: <Trophy size={24} />,
      completed: false,
      locked: true,
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "easy") return { bg: "from-[#00FF99]/20 to-[#00FFFF]/20", border: "border-[#00FF99]/50", text: "text-[#00FF99]" };
    if (difficulty === "medium") return { bg: "from-[#FFD700]/20 to-[#FF6A00]/20", border: "border-[#FFD700]/50", text: "text-[#FFD700]" };
    return { bg: "from-[#FF00FF]/20 to-[#A100FF]/20", border: "border-[#FF00FF]/50", text: "text-[#FF00FF]" };
  };

  const handleClaim = (challenge: Challenge) => {
    if (challenge.completed && !challenge.locked) {
      onCoinsChange(coins + challenge.reward);
    }
  };

  const activeChallenges = challenges.filter(c => !c.completed && !c.locked);
  const completedChallenges = challenges.filter(c => c.completed);
  const lockedChallenges = challenges.filter(c => c.locked);

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <IconButton
          icon={<ArrowLeft size={24} />}
          onClick={() => onNavigate("menu")}
        />
        <h2 className="text-2xl font-bold text-[#00FFFF] text-glow-cyan">CHALLENGES</h2>
        <CoinBadge amount={coins} />
      </div>

      {/* Daily Timer */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-r from-[#00FFFF]/20 to-[#A100FF]/20 rounded-2xl p-4 mb-6 border-2 border-[#00FFFF]/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#00FF99] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)]">
              <Clock size={24} className="text-black" />
            </div>
            <div>
              <p className="text-sm text-[#B8B8B8]">Challenges Reset In</p>
              <p className="font-bold text-lg">18:42:15</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#B8B8B8]">Completed</p>
            <p className="font-bold text-lg text-[#00FF99]">
              {completedChallenges.length}/{challenges.filter(c => !c.locked).length}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Zap size={20} className="text-[#FFD700]" />
            Active Challenges
          </h3>
          <div className="space-y-3">
            {activeChallenges.map((challenge, index) => {
              const colors = getDifficultyColor(challenge.difficulty);
              const progress = (challenge.progress / challenge.goal) * 100;

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    bg-gradient-to-br ${colors.bg} rounded-2xl p-4 border-2 ${colors.border}
                  `}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-xl bg-black/30 ${colors.text}`}>
                      {challenge.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold">{challenge.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full bg-black/30 ${colors.text}`}>
                          {challenge.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-[#B8B8B8]">{challenge.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-[#B8B8B8] mb-1">
                      <span>Progress</span>
                      <span>{challenge.progress}/{challenge.goal}</span>
                    </div>
                    <div className="relative h-2 bg-black/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${colors.bg.replace('/20', '')} rounded-full`}
                      />
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      <span className="font-bold text-[#FFD700]">{challenge.reward}</span>
                    </div>
                    {progress >= 100 && (
                      <NeonButton
                        size="sm"
                        onClick={() => handleClaim(challenge)}
                      >
                        Claim
                      </NeonButton>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-[#00FF99]" />
            Completed
          </h3>
          <div className="space-y-2">
            {completedChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#00FF99]/10 rounded-2xl p-4 border-2 border-[#00FF99]/30 opacity-60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00FF99] flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-black" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{challenge.title}</h4>
                    <p className="text-xs text-[#B8B8B8]">Claimed +{challenge.reward} coins</p>
                  </div>
                  <span className="text-2xl">✓</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Challenges */}
      {lockedChallenges.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Lock size={20} className="text-[#B8B8B8]" />
            Locked
          </h3>
          <div className="space-y-2">
            {lockedChallenges.map((challenge, index) => {
              const colors = getDifficultyColor(challenge.difficulty);

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-2xl p-4 border-2 border-white/10 opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Lock size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{challenge.title}</h4>
                      <p className="text-xs text-[#B8B8B8]">Complete previous challenges to unlock</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">💰</span>
                      <span className="text-sm font-bold">{challenge.reward}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
