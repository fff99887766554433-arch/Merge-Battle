import { useState } from "react";
import { motion } from "framer-motion";
import { IconButton } from "../IconButton";
import { ArrowLeft, Trophy, Medal, Award } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  avatar: string;
  level: number;
}

interface LeaderboardProps {
  onNavigate: (screen: string) => void;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "NeonMaster",
    score: 125400,
    avatar: "👑",
    level: 99,
  },
  {
    rank: 2,
    username: "CyberNinja",
    score: 98750,
    avatar: "🤖",
    level: 85,
  },
  {
    rank: 3,
    username: "GlowKing",
    score: 87320,
    avatar: "⚡",
    level: 78,
  },
  {
    rank: 4,
    username: "MergeQueen",
    score: 76890,
    avatar: "💎",
    level: 72,
  },
  {
    rank: 5,
    username: "TileWizard",
    score: 65430,
    avatar: "🧙",
    level: 68,
  },
  {
    rank: 6,
    username: "PuzzlePro",
    score: 58920,
    avatar: "🎮",
    level: 64,
  },
  {
    rank: 7,
    username: "NeonNinja",
    score: 52100,
    avatar: "🥷",
    level: 61,
  },
  {
    rank: 8,
    username: "GridGuru",
    score: 48750,
    avatar: "🎯",
    level: 58,
  },
  {
    rank: 9,
    username: "You",
    score: 42300,
    avatar: "👤",
    level: 54,
  },
  {
    rank: 10,
    username: "TileMaster",
    score: 38900,
    avatar: "🎪",
    level: 52,
  },
];

export function Leaderboard({ onNavigate }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState("global");

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return <Trophy className="text-[#FFD700]" size={24} />;
    if (rank === 2)
      return <Medal className="text-[#C0C0C0]" size={24} />;
    if (rank === 3)
      return <Medal className="text-[#CD7F32]" size={24} />;
    return <Award className="text-[#6B6B6B]" size={20} />;
  };

  const getRankGlow = (rank: number) => {
    if (rank === 1)
      return "shadow-[0_0_20px_rgba(255,215,0,0.4)]";
    if (rank === 2)
      return "shadow-[0_0_15px_rgba(192,192,192,0.3)]";
    if (rank === 3)
      return "shadow-[0_0_15px_rgba(205,127,50,0.3)]";
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <IconButton
          icon={<ArrowLeft size={24} />}
          onClick={() => onNavigate("menu")}
        />
        <h2 className="text-2xl font-bold text-[#00FFFF] text-glow-cyan">
          LEADERBOARD
        </h2>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="global"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/5 p-1">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-3">
          {mockLeaderboard.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`
                flex items-center gap-4 p-4 rounded-2xl border transition-all
                ${
                  entry.username === "You"
                    ? "bg-gradient-to-r from-[#00FFFF]/20 to-[#A100FF]/20 border-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                    : "bg-white/5 border-white/10"
                }
                ${getRankGlow(entry.rank)}
              `}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-12">
                {getRankBadge(entry.rank)}
              </div>

              {/* Avatar */}
              <div
                className={`
                w-14 h-14 rounded-full flex items-center justify-center text-2xl
                ${
                  entry.rank === 1
                    ? "bg-gradient-to-br from-[#FFD700] to-[#FF6A00]"
                    : entry.rank === 2
                      ? "bg-gradient-to-br from-[#C0C0C0] to-[#808080]"
                      : entry.rank === 3
                        ? "bg-gradient-to-br from-[#CD7F32] to-[#8B4513]"
                        : "bg-gradient-to-br from-[#00FFFF] to-[#A100FF]"
                }
              `}
              >
                {entry.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold truncate">
                    {entry.username}
                  </h3>
                  <span className="text-xs text-[#B8B8B8]">
                    Lv.{entry.level}
                  </span>
                </div>
                <div className="text-sm text-[#B8B8B8]">
                  #{entry.rank}
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div
                  className={`
                  text-xl font-bold
                  ${
                    entry.rank === 1
                      ? "text-[#FFD700]"
                      : entry.rank === 2
                        ? "text-[#C0C0C0]"
                        : entry.rank === 3
                          ? "text-[#CD7F32]"
                          : "text-[#00FFFF]"
                  }
                `}
                >
                  {entry.score.toLocaleString()}
                </div>
                <div className="text-xs text-[#B8B8B8]">
                  points
                </div>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="friends" className="space-y-3">
          <div className="text-center py-20 text-[#B8B8B8]">
            <p>Connect with friends to see their scores!</p>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-3">
          {mockLeaderboard.slice(0, 5).map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="text-2xl font-bold text-[#6B6B6B] w-8">
                {index + 1}
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#A100FF] flex items-center justify-center text-xl">
                {entry.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{entry.username}</h3>
                <p className="text-sm text-[#B8B8B8]">
                  This week
                </p>
              </div>
              <div className="text-xl font-bold text-[#00FFFF]">
                {Math.floor(entry.score * 0.6).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}