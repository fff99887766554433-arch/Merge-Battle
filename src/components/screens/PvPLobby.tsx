import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NeonButton } from "../NeonButton";
import { IconButton } from "../IconButton";
import { Avatar } from "../ui/avatar";
import { ArrowLeft, MessageCircle, Swords } from "lucide-react";

interface PvPLobbyProps {
  onNavigate: (screen: string) => void;
  gridSize?: 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export function PvPLobby({ onNavigate, gridSize = 4 }: PvPLobbyProps) {
  const [isReady, setIsReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [matchTimer, setMatchTimer] = useState(10);
  const [searching, setSearching] = useState(true);
  
  // Simulate finding opponent
  useEffect(() => {
    if (searching) {
      const timer = setTimeout(() => {
        setSearching(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [searching]);
  
  // Simulate opponent ready state
  useEffect(() => {
    if (!searching && isReady) {
      const timer = setTimeout(() => {
        setOpponentReady(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [searching, isReady]);
  
  // Match countdown
  useEffect(() => {
    if (isReady && opponentReady && matchTimer > 0) {
      const timer = setInterval(() => {
        setMatchTimer((prev) => {
          if (prev <= 1) {
            // Start game
            setTimeout(() => onNavigate("game"), 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isReady, opponentReady, matchTimer, onNavigate]);
  
  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <IconButton
          icon={<ArrowLeft size={24} />}
          onClick={() => onNavigate("menu")}
        />
        <div className="text-center">
          <h2 className="text-xl text-[#00FFFF]">PvP Lobby</h2>
          <p className="text-xs text-[#B8B8B8]">{gridSize}×{gridSize} Grid</p>
        </div>
        <div className="w-12" /> {/* Spacer */}
      </div>
      
      {/* Searching State */}
      {searching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Swords size={64} className="text-[#00FFFF]" />
          </motion.div>
          <p className="mt-6 text-xl text-[#B8B8B8]">Finding opponent...</p>
          <div className="flex gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full bg-[#00FFFF]"
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Battle Preview */}
      {!searching && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col"
        >
          {/* Match Starting Countdown */}
          {isReady && opponentReady && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
            >
              <motion.div
                key={matchTimer}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="text-9xl font-bold text-[#00FFFF] text-glow-cyan"
              >
                {matchTimer}
              </motion.div>
            </motion.div>
          )}
          
          {/* Players */}
          <div className="flex-1 flex flex-col justify-around py-12">
            {/* You */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-4 px-8"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#00FF99] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                  <span className="text-3xl">👤</span>
                </div>
                {isReady && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#00FF99] flex items-center justify-center"
                  >
                    <span className="text-lg">✓</span>
                  </motion.div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold">You</h3>
                <p className="text-sm text-[#B8B8B8]">Level 42 • 2048 Master</p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-[#FFD700]">1,250</div>
                <div className="text-xs text-[#B8B8B8]">Rating</div>
              </div>
            </motion.div>
            
            {/* VS Divider */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                textShadow: [
                  "0 0 20px rgba(255,0,255,0.6)",
                  "0 0 40px rgba(255,0,255,0.9)",
                  "0 0 20px rgba(255,0,255,0.6)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-center text-6xl font-bold text-[#FF00FF]"
            >
              VS
            </motion.div>
            
            {/* Opponent */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-4 px-8"
            >
              <div className="text-left">
                <div className="text-2xl font-bold text-[#FFD700]">1,312</div>
                <div className="text-xs text-[#B8B8B8]">Rating</div>
              </div>
              
              <div className="flex-1 text-right">
                <h3 className="text-xl font-bold">CyberNinja</h3>
                <p className="text-sm text-[#B8B8B8]">Level 45 • Neon Knight</p>
              </div>
              
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#A100FF] flex items-center justify-center shadow-[0_0_30px_rgba(255,0,255,0.5)]">
                  <span className="text-3xl">🤖</span>
                </div>
                {opponentReady && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-[#00FF99] flex items-center justify-center"
                  >
                    <span className="text-lg">✓</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Board Preview */}
          <div className="flex gap-4 px-8 mb-8">
            <div className="flex-1 aspect-square bg-[#1A1A1A]/60 rounded-2xl border border-[#00FFFF]/30 flex items-center justify-center">
              <p className="text-sm text-[#B8B8B8]">Your Board</p>
            </div>
            <div className="flex-1 aspect-square bg-[#1A1A1A]/60 rounded-2xl border border-[#FF00FF]/30 flex items-center justify-center">
              <p className="text-sm text-[#B8B8B8]">Opponent Board</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="px-8 pb-4 space-y-3">
            <NeonButton
              onClick={() => setIsReady(!isReady)}
              disabled={opponentReady}
              className="w-full"
            >
              {isReady ? "READY!" : "READY UP"}
            </NeonButton>
            
            <div className="flex gap-3">
              <IconButton
                icon={<MessageCircle size={20} />}
                className="flex-1"
                variant="outline"
              />
              <NeonButton
                variant="ghost"
                onClick={() => onNavigate("menu")}
                className="flex-1"
              >
                Leave
              </NeonButton>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
