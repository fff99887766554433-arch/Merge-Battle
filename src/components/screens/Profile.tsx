import { useState } from "react";
import { motion } from "framer-motion";
import { IconButton } from "../IconButton";
import { NeonButton } from "../NeonButton";
import { NeonModal } from "../NeonModal";
import { ThemePreview } from "../ThemePreview";
import { TileBlockPreview } from "../TileBlockPreview";
import { BackgroundPreview } from "../BackgroundPreview";
import { availableThemes } from "../themeData";
import { availableTileBlocks, availableBackgrounds } from "../tileBlockData";
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  Award,
  Edit2,
  Camera,
  Palette,
  User,
  Box,
  Image
} from "lucide-react";
import { Input } from "../ui/input";

interface ProfileProps {
  onNavigate: (screen: string) => void;
  activeTheme?: string;
  onThemeChange?: (themeId: string) => void;
  ownedThemes?: string[];
  activeTileBlock?: string;
  onTileBlockChange?: (blockId: string) => void;
  ownedTileBlocks?: string[];
  activeBackground?: string;
  onBackgroundChange?: (backgroundId: string) => void;
  ownedBackgrounds?: string[];
}

const achievements = [
  { id: 1, name: "First Merge", description: "Merge your first tiles", icon: "🎯", unlocked: true },
  { id: 2, name: "128 Club", description: "Reach 128 tile", icon: "💎", unlocked: true },
  { id: 3, name: "Speed Demon", description: "Win in under 2 minutes", icon: "⚡", unlocked: true },
  { id: 4, name: "2048 Master", description: "Reach 2048 tile", icon: "👑", unlocked: false },
  { id: 5, name: "Combo King", description: "Make 5 merges in a row", icon: "🔥", unlocked: true },
  { id: 6, name: "Perfectionist", description: "Win without undo", icon: "✨", unlocked: false },
];

const stats = [
  { label: "Games Played", value: "127", icon: <Trophy size={20} /> },
  { label: "Win Rate", value: "68%", icon: <Target size={20} /> },
  { label: "Best Score", value: "42,300", icon: <Star size={20} /> },
  { label: "Win Streak", value: "8", icon: <TrendingUp size={20} /> },
];

const avatarEmojis = ["👤", "😎", "🎮", "🚀", "⚡", "🔥", "💎", "👑", "🎯", "🌟"];

export function Profile({ 
  onNavigate, 
  activeTheme = "neon-cyber",
  onThemeChange,
  ownedThemes = ["neon-cyber"],
  activeTileBlock = "neon-classic",
  onTileBlockChange,
  ownedTileBlocks = ["neon-classic"],
  activeBackground = "default-dark",
  onBackgroundChange,
  ownedBackgrounds = ["default-dark"]
}: ProfileProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showTileBlockModal, setShowTileBlockModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [username, setUsername] = useState("Player");
  const [selectedAvatar, setSelectedAvatar] = useState("👤");
  const [tempUsername, setTempUsername] = useState(username);
  const [tempAvatar, setTempAvatar] = useState(selectedAvatar);
  
  // Filter themes based on ownership
  const themesData = availableThemes.map(theme => ({
    ...theme,
    owned: ownedThemes.includes(theme.id)
  }));
  
  const ownedThemesData = themesData.filter(t => t.owned);
  const activeThemeData = themesData.find(t => t.id === activeTheme);
  
  // Filter tile blocks
  const ownedTileBlocksData = availableTileBlocks.filter(b => ownedTileBlocks.includes(b.id));
  const activeTileBlockData = availableTileBlocks.find(b => b.id === activeTileBlock);
  
  // Filter backgrounds
  const ownedBackgroundsData = availableBackgrounds.filter(b => ownedBackgrounds.includes(b.id));
  const activeBackgroundData = availableBackgrounds.find(b => b.id === activeBackground);
  
  const handleSaveProfile = () => {
    setUsername(tempUsername);
    setSelectedAvatar(tempAvatar);
    setShowEditModal(false);
  };
  
  const handleThemeSelect = (themeId: string) => {
    if (onThemeChange && ownedThemes.includes(themeId)) {
      onThemeChange(themeId);
    }
  };
  
  const handleTileBlockSelect = (blockId: string) => {
    if (onTileBlockChange && ownedTileBlocks.includes(blockId)) {
      onTileBlockChange(blockId);
      setShowTileBlockModal(false);
    }
  };
  
  const handleBackgroundSelect = (backgroundId: string) => {
    if (onBackgroundChange && ownedBackgrounds.includes(backgroundId)) {
      onBackgroundChange(backgroundId);
      setShowBackgroundModal(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <IconButton
          icon={<ArrowLeft size={24} />}
          onClick={() => onNavigate("menu")}
        />
        <h2 className="text-2xl font-bold text-[#00FFFF] text-glow-cyan">PROFILE</h2>
        <div className="w-12" /> {/* Spacer */}
      </div>
      
      {/* Profile Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-[#00FFFF]/20 to-[#A100FF]/20 rounded-3xl p-6 border-2 border-[#00FFFF]/50 shadow-[0_0_30px_rgba(0,255,255,0.2)] mb-6"
      >
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowAvatarModal(true)}
              className="relative group"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#A100FF] flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                {selectedAvatar}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={24} className="text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border-2 border-dashed border-[#00FFFF]/30 rounded-full"
              />
            </button>
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold">{username}</h3>
              <button
                onClick={() => {
                  setTempUsername(username);
                  setShowEditModal(true);
                }}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Edit2 size={16} className="text-[#00FFFF]" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#B8B8B8] mb-2">
              <span className="px-2 py-1 bg-[#FFD700]/20 rounded-full text-[#FFD700] text-xs font-bold">
                Level 54
              </span>
              <span>2048 Master</span>
            </div>
            
            {/* XP Bar */}
            <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-[#00FFFF] to-[#00FF99] rounded-full shadow-[0_0_10px_rgba(0,255,255,0.5)]"
              />
            </div>
            <p className="text-xs text-[#B8B8B8] mt-1">3,250 / 5,000 XP</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className="text-center"
            >
              <div className="flex justify-center text-[#00FFFF] mb-1">
                {stat.icon}
              </div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-xs text-[#B8B8B8]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Active Customizations */}
      <div className="space-y-4 mb-6">
        {/* Active Theme */}
        {activeThemeData && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2">
                <Palette size={20} className="text-[#A100FF]" />
                <span>Active Theme</span>
              </h3>
              <button
                onClick={() => setShowThemeModal(true)}
                className="text-sm text-[#00FFFF] hover:text-[#00FF99] transition-colors"
              >
                Change
              </button>
            </div>
            <ThemePreview theme={activeThemeData} isActive={true} />
          </motion.div>
        )}

        {/* Active Tile Block */}
        {activeTileBlockData && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2">
                <Box size={20} className="text-[#00FFFF]" />
                <span>Active Tile Block</span>
              </h3>
              <button
                onClick={() => setShowTileBlockModal(true)}
                className="text-sm text-[#00FFFF] hover:text-[#00FF99] transition-colors"
              >
                Change
              </button>
            </div>
            <TileBlockPreview block={activeTileBlockData} owned={true} showPrice={false} />
          </motion.div>
        )}

        {/* Active Background */}
        {activeBackgroundData && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2">
                <Image size={20} className="text-[#FF00FF]" />
                <span>Active Background</span>
              </h3>
              <button
                onClick={() => setShowBackgroundModal(true)}
                className="text-sm text-[#00FFFF] hover:text-[#00FF99] transition-colors"
              >
                Change
              </button>
            </div>
            <BackgroundPreview background={activeBackgroundData} owned={true} showPrice={false} />
          </motion.div>
        )}
      </div>
      
      {/* Owned Themes Preview */}
      {ownedThemesData.length > 1 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-2">
              <Palette size={20} className="text-[#A100FF]" />
              <span>My Themes</span>
            </h3>
            <span className="text-sm text-[#B8B8B8]">
              {ownedThemesData.length} owned
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ownedThemesData.slice(0, 4).map((theme) => (
              <ThemePreview
                key={theme.id}
                theme={theme}
                isActive={theme.id === activeTheme}
                onClick={() => handleThemeSelect(theme.id)}
              />
            ))}
          </div>
          {ownedThemesData.length > 4 && (
            <button
              onClick={() => setShowThemeModal(true)}
              className="w-full mt-3 py-2 text-sm text-[#00FFFF] hover:text-[#00FF99] transition-colors"
            >
              View All Themes →
            </button>
          )}
        </motion.div>
      )}
      
      {/* Achievements */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2">
            <Award size={24} className="text-[#FFD700]" />
            <span>Achievements</span>
          </h3>
          <span className="text-sm text-[#B8B8B8]">
            {achievements.filter(a => a.unlocked).length} / {achievements.length}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`
                relative p-4 rounded-2xl border-2 transition-all
                ${achievement.unlocked 
                  ? "bg-gradient-to-br from-[#FFD700]/20 to-[#FF6A00]/20 border-[#FFD700]/50" 
                  : "bg-white/5 border-white/10 opacity-50"
                }
              `}
            >
              <div className="text-3xl mb-2 text-center">{achievement.icon}</div>
              <h4 className="text-sm font-bold text-center mb-1">{achievement.name}</h4>
              <p className="text-xs text-[#B8B8B8] text-center">{achievement.description}</p>
              
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#00FF99] flex items-center justify-center"
                >
                  <span className="text-xs">✓</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3 pb-4">
        <NeonButton 
          variant="secondary" 
          className="w-full"
          onClick={() => {
            setTempUsername(username);
            setShowEditModal(true);
          }}
        >
          <User size={18} className="mr-2" />
          Edit Profile
        </NeonButton>
        <NeonButton 
          variant="ghost" 
          className="w-full"
          onClick={() => onNavigate("statistics")}
        >
          <TrendingUp size={18} className="mr-2" />
          View Statistics
        </NeonButton>
        <NeonButton variant="ghost" className="w-full">
          Share Profile
        </NeonButton>
      </div>
      
      {/* Edit Profile Modal */}
      <NeonModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        glowColor="cyan"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#B8B8B8] mb-2">Username</label>
            <Input
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              placeholder="Enter username"
              className="bg-black/30 border-[#00FFFF]/30 text-white"
              maxLength={20}
            />
          </div>
          
          <div className="flex gap-2">
            <NeonButton
              onClick={handleSaveProfile}
              className="flex-1"
            >
              Save Changes
            </NeonButton>
            <NeonButton
              variant="ghost"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancel
            </NeonButton>
          </div>
        </div>
      </NeonModal>
      
      {/* Avatar Selection Modal */}
      <NeonModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Choose Avatar"
        glowColor="purple"
      >
        <div className="grid grid-cols-5 gap-3 mb-4">
          {avatarEmojis.map((emoji) => (
            <motion.button
              key={emoji}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSelectedAvatar(emoji);
                setShowAvatarModal(false);
              }}
              className={`
                w-full aspect-square rounded-xl text-3xl
                flex items-center justify-center
                transition-all
                ${selectedAvatar === emoji
                  ? "bg-gradient-to-br from-[#00FFFF] to-[#A100FF] shadow-[0_0_20px_rgba(0,255,255,0.5)]"
                  : "bg-white/10 hover:bg-white/20"
                }
              `}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </NeonModal>
      
      {/* Theme Switcher Modal */}
      <NeonModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        title="My Themes"
        glowColor="purple"
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {ownedThemesData.map((theme) => (
            <ThemePreview
              key={theme.id}
              theme={theme}
              isActive={theme.id === activeTheme}
              onClick={() => {
                handleThemeSelect(theme.id);
                setShowThemeModal(false);
              }}
            />
          ))}
          {ownedThemesData.length === 1 && (
            <div className="text-center py-6">
              <p className="text-[#B8B8B8] mb-4">
                Visit the Shop to unlock more themes!
              </p>
              <NeonButton
                onClick={() => {
                  setShowThemeModal(false);
                  onNavigate("shop");
                }}
              >
                Browse Themes
              </NeonButton>
            </div>
          )}
        </div>
      </NeonModal>

      {/* Tile Block Switcher Modal */}
      <NeonModal
        isOpen={showTileBlockModal}
        onClose={() => setShowTileBlockModal(false)}
        title="My Tile Blocks"
        glowColor="cyan"
      >
        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {ownedTileBlocksData.map((block) => (
            <TileBlockPreview
              key={block.id}
              block={block}
              owned={true}
              showPrice={false}
              onClick={() => handleTileBlockSelect(block.id)}
            />
          ))}
        </div>
        {ownedTileBlocksData.length === 1 && (
          <div className="text-center py-6 mt-4">
            <p className="text-[#B8B8B8] mb-4">
              Visit the Shop to unlock more tile blocks!
            </p>
            <NeonButton
              onClick={() => {
                setShowTileBlockModal(false);
                onNavigate("shop");
              }}
            >
              Browse Blocks
            </NeonButton>
          </div>
        )}
      </NeonModal>

      {/* Background Switcher Modal */}
      <NeonModal
        isOpen={showBackgroundModal}
        onClose={() => setShowBackgroundModal(false)}
        title="My Backgrounds"
        glowColor="magenta"
      >
        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {ownedBackgroundsData.map((background) => (
            <BackgroundPreview
              key={background.id}
              background={background}
              owned={true}
              showPrice={false}
              onClick={() => handleBackgroundSelect(background.id)}
            />
          ))}
        </div>
        {ownedBackgroundsData.length === 1 && (
          <div className="text-center py-6 mt-4">
            <p className="text-[#B8B8B8] mb-4">
              Visit the Shop to unlock more backgrounds!
            </p>
            <NeonButton
              onClick={() => {
                setShowBackgroundModal(false);
                onNavigate("shop");
              }}
            >
              Browse Backgrounds
            </NeonButton>
          </div>
        )}
      </NeonModal>
    </div>
  );
}
