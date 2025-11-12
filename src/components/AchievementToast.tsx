import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";

interface Achievement {
  icon: string;
  name: string;
  description: string;
}

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed top-20 right-4 z-50 w-80"
        >
          <div className="bg-gradient-to-br from-[#FFD700]/95 to-[#FF6A00]/95 backdrop-blur-lg rounded-2xl p-4 border-2 border-[#FFD700] shadow-[0_0_40px_rgba(255,215,0,0.6)]">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center"
            >
              <X size={14} className="text-white" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-3">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex-shrink-0"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
                  {achievement.icon}
                </div>
              </motion.div>

              {/* Text */}
              <div className="flex-1 pt-1">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy size={16} className="text-white" />
                    <p className="text-xs font-bold text-white/90 uppercase tracking-wider">
                      Achievement Unlocked!
                    </p>
                  </div>
                  <h4 className="font-bold text-white mb-1">
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-white/80">
                    {achievement.description}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Sparkle Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    scale: 0, 
                    x: Math.random() * 100 - 50, 
                    y: Math.random() * 100 - 50,
                    opacity: 1
                  }}
                  animate={{ 
                    scale: [0, 1, 0],
                    y: [0, -50],
                    opacity: [1, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 0.5 + i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
