import { useState } from "react";
import { motion } from "framer-motion";
import { IconButton } from "../IconButton";
import { ArrowLeft, TrendingUp, Trophy, Target, Zap, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StatisticsProps {
  onNavigate: (screen: string) => void;
}

const weeklyScores = [
  { day: "Mon", score: 1200 },
  { day: "Tue", score: 1800 },
  { day: "Wed", score: 1500 },
  { day: "Thu", score: 2200 },
  { day: "Fri", score: 2800 },
  { day: "Sat", score: 3200 },
  { day: "Sun", score: 2600 },
];

const gameHistory = [
  { date: "Week 1", wins: 12, losses: 5 },
  { date: "Week 2", wins: 18, losses: 7 },
  { date: "Week 3", wins: 15, losses: 4 },
  { date: "Week 4", wins: 22, losses: 6 },
];

const tileProgress = [
  { tile: "128", count: 45 },
  { tile: "256", count: 32 },
  { tile: "512", count: 18 },
  { tile: "1024", count: 8 },
  { tile: "2048", count: 2 },
];

export function Statistics({ onNavigate }: StatisticsProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("week");

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <IconButton
          icon={<ArrowLeft size={24} />}
          onClick={() => onNavigate("profile")}
        />
        <h2 className="text-2xl font-bold text-[#00FFFF] text-glow-cyan">STATISTICS</h2>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 mb-6">
        {(["week", "month", "all"] as const).map((period) => (
          <button
            key={period}
            onClick={() => setTimeframe(period)}
            className={`
              flex-1 py-2 px-4 rounded-xl transition-all capitalize
              ${timeframe === period
                ? "bg-gradient-to-r from-[#00FFFF] to-[#00FF99] text-black shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                : "bg-white/5 hover:bg-white/10"
              }
            `}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-[#00FFFF]/20 to-[#00FF99]/20 rounded-2xl p-4 border-2 border-[#00FFFF]/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} className="text-[#FFD700]" />
            <span className="text-sm text-[#B8B8B8]">Total Wins</span>
          </div>
          <p className="text-3xl font-bold">127</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-[#A100FF]/20 to-[#FF00FF]/20 rounded-2xl p-4 border-2 border-[#A100FF]/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target size={20} className="text-[#FF00FF]" />
            <span className="text-sm text-[#B8B8B8]">Win Rate</span>
          </div>
          <p className="text-3xl font-bold">68%</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#FFD700]/20 to-[#FF6A00]/20 rounded-2xl p-4 border-2 border-[#FFD700]/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-[#00FF99]" />
            <span className="text-sm text-[#B8B8B8]">Best Streak</span>
          </div>
          <p className="text-3xl font-bold">12</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-[#FF00FF]/20 to-[#A100FF]/20 rounded-2xl p-4 border-2 border-[#FF00FF]/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="text-[#FFD700]" />
            <span className="text-sm text-[#B8B8B8]">Avg Score</span>
          </div>
          <p className="text-3xl font-bold">2.4k</p>
        </motion.div>
      </div>

      {/* Weekly Score Trend */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-[#00FFFF]" />
          <h3 className="font-bold">Score Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyScores}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="#B8B8B8" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#B8B8B8" 
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid rgba(0,255,255,0.3)',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#00FFFF" 
              strokeWidth={3}
              dot={{ fill: '#00FFFF', r: 4 }}
              activeDot={{ r: 6, fill: '#00FF99' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Win/Loss Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={20} className="text-[#FFD700]" />
          <h3 className="font-bold">Win/Loss History</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={gameHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#B8B8B8" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#B8B8B8" 
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid rgba(0,255,255,0.3)',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Bar dataKey="wins" fill="#00FF99" radius={[8, 8, 0, 0]} />
            <Bar dataKey="losses" fill="#FF6A00" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00FF99]" />
            <span className="text-xs text-[#B8B8B8]">Wins</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF6A00]" />
            <span className="text-xs text-[#B8B8B8]">Losses</span>
          </div>
        </div>
      </motion.div>

      {/* Tile Achievement Progress */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} className="text-[#A100FF]" />
          <h3 className="font-bold">Highest Tiles Reached</h3>
        </div>
        <div className="space-y-3">
          {tileProgress.map((item, index) => {
            const maxCount = Math.max(...tileProgress.map(t => t.count));
            const width = (item.count / maxCount) * 100;
            
            return (
              <div key={item.tile}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold">{item.tile}</span>
                  <span className="text-[#B8B8B8]">{item.count} times</span>
                </div>
                <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#00FFFF] to-[#A100FF] rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Play Time Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-[#FFD700]/10 to-[#FF6A00]/10 rounded-2xl p-4 border border-[#FFD700]/30 mb-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={20} className="text-[#FFD700]" />
          <h3 className="font-bold">Play Time</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-[#00FFFF]">42h</p>
            <p className="text-xs text-[#B8B8B8]">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#00FF99]">6h</p>
            <p className="text-xs text-[#B8B8B8]">This Week</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#FFD700]">12m</p>
            <p className="text-xs text-[#B8B8B8]">Avg Game</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
