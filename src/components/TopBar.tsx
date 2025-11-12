import { motion } from "framer-motion";
import { cn } from "./ui/utils";
import { Trophy, Clock } from "lucide-react";

interface TopBarProps {
  score: number;
  targetTile?: number;
  timer?: number;
  className?: string;
}

export function TopBar({ score, targetTile, timer, className }: TopBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  return (
    <div className={cn("flex items-center justify-between gap-4 p-4", className)}>
      {/* Score */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
      >
        <div className="text-xs text-[#B8B8B8] mb-1">Score</div>
        <motion.div
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold text-[#00FFFF] text-glow-cyan"
        >
          {score.toLocaleString()}
        </motion.div>
      </motion.div>
      
      {/* Target Tile */}
      {targetTile && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-gradient-to-br from-[#A100FF]/20 to-[#FF00FF]/20 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#A100FF]/50 glow-purple"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy size={16} className="text-[#FFD700]" />
            <div className="text-xs text-[#B8B8B8]">Goal</div>
          </div>
          <div className="text-2xl font-bold text-center text-[#FF00FF] text-glow-magenta">
            {targetTile}
          </div>
        </motion.div>
      )}
      
      {/* Timer */}
      {timer !== undefined && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock size={16} className="text-[#FFD700]" />
            <div className="text-xs text-[#B8B8B8]">Time</div>
          </div>
          <div className={cn(
            "text-2xl font-bold text-center",
            timer < 30 ? "text-[#FF6A00] text-glow-orange" : "text-white"
          )}>
            {formatTime(timer)}
          </div>
        </motion.div>
      )}
    </div>
  );
}
