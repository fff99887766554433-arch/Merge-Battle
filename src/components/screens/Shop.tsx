import { useState } from "react";
import { motion } from "framer-motion";
import { IconButton } from "../IconButton";
import { NeonButton } from "../NeonButton";
import { NeonModal } from "../NeonModal";
import { CoinBadge } from "../CoinBadge";
import { ThemePreview } from "../ThemePreview";
import { TileBlockPreview } from "../TileBlockPreview";
import { BackgroundPreview } from "../BackgroundPreview";
import { availableThemes } from "../themeData";
import { availableTileBlocks, availableBackgrounds, TileBlock, GameBackground } from "../tileBlockData";
import { ArrowLeft, Sparkles, Palette, Zap, Package, Box, Image } from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  type: "theme" | "powerup" | "bundle";
  owned?: boolean;
  themeId?: string;
}

interface ShopProps {
  onNavigate: (screen: string) => void;
  coins: number;
  onCoinsChange: (coins: number) => void;
  ownedThemes?: string[];
  onThemePurchase?: (themeId: string) => void;
  ownedTileBlocks?: string[];
  onTileBlockPurchase?: (blockId: string) => void;
  ownedBackgrounds?: string[];
  onBackgroundPurchase?: (backgroundId: string) => void;
}

export function Shop({ 
  onNavigate, 
  coins, 
  onCoinsChange,
  ownedThemes = ["neon-cyber"],
  onThemePurchase,
  ownedTileBlocks = ["neon-classic"],
  onTileBlockPurchase,
  ownedBackgrounds = ["default-dark"],
  onBackgroundPurchase
}: ShopProps) {
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [selectedTileBlock, setSelectedTileBlock] = useState<TileBlock | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<GameBackground | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"themes" | "blocks" | "backgrounds" | "powerups" | "bundles">("themes");
  
  // Map themes to shop items
  const themeItems: ShopItem[] = availableThemes
    .filter(theme => theme.price)
    .map(theme => ({
      id: theme.id,
      name: theme.name,
      description: theme.description,
      price: theme.price!,
      icon: <Palette size={32} />,
      type: "theme" as const,
      owned: ownedThemes.includes(theme.id),
      themeId: theme.id
    }));
  
  const powerupItems: ShopItem[] = [
    {
      id: "undo-5",
      name: "Undo Power",
      description: "5 extra undo moves",
      price: 200,
      icon: <Zap size={32} />,
      type: "powerup",
    },
    {
      id: "hint-10",
      name: "Hint Pack",
      description: "10 hint tokens",
      price: 300,
      icon: <Sparkles size={32} />,
      type: "powerup",
    },
    {
      id: "shuffle",
      name: "Shuffle Tiles",
      description: "Reorganize the board",
      price: 400,
      icon: <Zap size={32} />,
      type: "powerup",
    },
    {
      id: "double-xp",
      name: "Double XP",
      description: "2x XP for 24 hours",
      price: 500,
      icon: <Sparkles size={32} />,
      type: "powerup",
    },
  ];
  
  const bundleItems: ShopItem[] = [
    {
      id: "starter-pack",
      name: "Starter Pack",
      description: "2 themes + 10 powerups",
      price: 1500,
      icon: <Package size={32} />,
      type: "bundle",
    },
    {
      id: "rainbow-pack",
      name: "Rainbow Pack",
      description: "All color themes unlocked",
      price: 2500,
      icon: <Palette size={32} />,
      type: "bundle",
    },
    {
      id: "pro-pack",
      name: "Pro Bundle",
      description: "All themes + 50 powerups",
      price: 5000,
      icon: <Sparkles size={32} />,
      type: "bundle",
    },
  ];
  
  const handlePurchase = (item: ShopItem) => {
    if (coins >= item.price) {
      onCoinsChange(coins - item.price);
      
      // Handle theme purchase
      if (item.type === "theme" && item.themeId && onThemePurchase) {
        onThemePurchase(item.themeId);
      }
      
      setSelectedItem(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleTileBlockPurchase = (block: TileBlock) => {
    if (coins >= block.price && onTileBlockPurchase) {
      onCoinsChange(coins - block.price);
      onTileBlockPurchase(block.id);
      setSelectedTileBlock(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleBackgroundPurchase = (background: GameBackground) => {
    if (coins >= background.price && onBackgroundPurchase) {
      onCoinsChange(coins - background.price);
      onBackgroundPurchase(background.id);
      setSelectedBackground(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };
  
  const getItemGradient = (type: string) => {
    if (type === "theme") return "from-[#A100FF]/20 to-[#FF00FF]/20";
    if (type === "powerup") return "from-[#00FFFF]/20 to-[#00FF99]/20";
    return "from-[#FFD700]/20 to-[#FF6A00]/20";
  };
  
  const getItemBorder = (type: string) => {
    if (type === "theme") return "border-[#A100FF]/50";
    if (type === "powerup") return "border-[#00FFFF]/50";
    return "border-[#FFD700]/50";
  };
  
  const getCurrentItems = () => {
    if (activeTab === "themes") return themeItems;
    if (activeTab === "powerups") return powerupItems;
    return bundleItems;
  };
  
  const themesWithOwnership = availableThemes.map(theme => ({
    ...theme,
    owned: ownedThemes.includes(theme.id)
  }));
  
  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <IconButton
          icon={<ArrowLeft size={24} />}
          onClick={() => onNavigate("menu")}
        />
        <h2 className="text-2xl font-bold text-[#00FFFF] text-glow-cyan">SHOP</h2>
        <CoinBadge amount={coins} />
      </div>
      
      {/* Success Toast */}
      {showSuccess && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#00FF99] to-[#00FFFF] px-6 py-3 rounded-full shadow-[0_0_30px_rgba(0,255,153,0.5)]"
        >
          <p className="text-[#0B0F19] font-bold">Purchase Successful! ✨</p>
        </motion.div>
      )}
      
      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("themes")}
          className={`
            flex-1 min-w-[100px] py-3 px-3 rounded-xl transition-all whitespace-nowrap
            ${activeTab === "themes"
              ? "bg-gradient-to-r from-[#A100FF] to-[#FF00FF] shadow-[0_0_20px_rgba(161,0,255,0.3)]"
              : "bg-white/5 hover:bg-white/10"
            }
          `}
        >
          <Palette size={16} className="inline mr-1" />
          <span className="text-sm">Themes</span>
        </button>
        <button
          onClick={() => setActiveTab("blocks")}
          className={`
            flex-1 min-w-[100px] py-3 px-3 rounded-xl transition-all whitespace-nowrap
            ${activeTab === "blocks"
              ? "bg-gradient-to-r from-[#00FFFF] to-[#00FF99] text-black shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              : "bg-white/5 hover:bg-white/10"
            }
          `}
        >
          <Box size={16} className="inline mr-1" />
          <span className="text-sm">Blocks</span>
        </button>
        <button
          onClick={() => setActiveTab("backgrounds")}
          className={`
            flex-1 min-w-[100px] py-3 px-3 rounded-xl transition-all whitespace-nowrap
            ${activeTab === "backgrounds"
              ? "bg-gradient-to-r from-[#FF00FF] to-[#A100FF] shadow-[0_0_20px_rgba(255,0,255,0.3)]"
              : "bg-white/5 hover:bg-white/10"
            }
          `}
        >
          <Image size={16} className="inline mr-1" />
          <span className="text-sm">Backgrounds</span>
        </button>
        <button
          onClick={() => setActiveTab("powerups")}
          className={`
            flex-1 min-w-[100px] py-3 px-3 rounded-xl transition-all whitespace-nowrap
            ${activeTab === "powerups"
              ? "bg-gradient-to-r from-[#FFD700] to-[#FF6A00] text-black shadow-[0_0_20px_rgba(255,215,0,0.3)]"
              : "bg-white/5 hover:bg-white/10"
            }
          `}
        >
          <Zap size={16} className="inline mr-1" />
          <span className="text-sm">Power-ups</span>
        </button>
        <button
          onClick={() => setActiveTab("bundles")}
          className={`
            flex-1 min-w-[100px] py-3 px-3 rounded-xl transition-all whitespace-nowrap
            ${activeTab === "bundles"
              ? "bg-gradient-to-r from-[#FF6A00] to-[#DC143C] text-white shadow-[0_0_20px_rgba(255,106,0,0.3)]"
              : "bg-white/5 hover:bg-white/10"
            }
          `}
        >
          <Package size={16} className="inline mr-1" />
          <span className="text-sm">Bundles</span>
        </button>
      </div>
      
      {/* Shop Grid - Themes */}
      {activeTab === "themes" && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {themesWithOwnership
            .filter(theme => theme.price)
            .map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <ThemePreview
                  theme={theme}
                  showPrice={true}
                  onClick={() => !theme.owned && setSelectedItem({
                    id: theme.id,
                    name: theme.name,
                    description: theme.description,
                    price: theme.price!,
                    icon: <Palette size={32} />,
                    type: "theme",
                    owned: theme.owned,
                    themeId: theme.id
                  })}
                />
              </motion.div>
            ))}
        </div>
      )}
      
      {/* Shop Grid - Tile Blocks */}
      {activeTab === "blocks" && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {availableTileBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <TileBlockPreview
                block={block}
                owned={ownedTileBlocks.includes(block.id)}
                showPrice={true}
                onClick={() => !ownedTileBlocks.includes(block.id) && setSelectedTileBlock(block)}
              />
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Shop Grid - Backgrounds */}
      {activeTab === "backgrounds" && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {availableBackgrounds.map((background, index) => (
            <motion.div
              key={background.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <BackgroundPreview
                background={background}
                owned={ownedBackgrounds.includes(background.id)}
                showPrice={true}
                onClick={() => !ownedBackgrounds.includes(background.id) && setSelectedBackground(background)}
              />
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Shop Grid - Powerups and Bundles */}
      {(activeTab === "powerups" || activeTab === "bundles") && (
        <div className="grid grid-cols-2 gap-4">
          {getCurrentItems().map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedItem(item)}
              disabled={item.owned}
              className={`
                relative p-6 rounded-2xl border-2 transition-all
                bg-gradient-to-br ${getItemGradient(item.type)}
                ${getItemBorder(item.type)}
                ${item.owned ? "opacity-50" : "hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]"}
                disabled:cursor-not-allowed
              `}
            >
              {/* Owned Badge */}
              {item.owned && (
                <div className="absolute top-2 right-2 bg-[#00FF99] text-[#0B0F19] px-2 py-1 rounded-full text-xs font-bold">
                  OWNED
                </div>
              )}
              
              {/* Icon */}
              <div className="flex justify-center mb-3 text-white">
                {item.icon}
              </div>
              
              {/* Name */}
              <h3 className="font-bold text-sm mb-1">{item.name}</h3>
              
              {/* Description */}
              <p className="text-xs text-[#B8B8B8] mb-3 min-h-[32px]">
                {item.description}
              </p>
              
              {/* Price */}
              <div className="flex items-center justify-center gap-1 bg-black/30 rounded-full px-3 py-1">
                <span className="text-[#FFD700] text-xl">💰</span>
                <span className="font-bold">{item.price}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
      
      {/* Get More Coins */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#FFD700]/20 to-[#FF6A00]/20 border-2 border-[#FFD700]/50"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6A00] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(255,215,0,0.5)]">
            💰
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Need More Coins?</h3>
            <p className="text-sm text-[#B8B8B8]">Watch ads or complete challenges</p>
          </div>
        </div>
        <NeonButton className="w-full">
          Get Coins
        </NeonButton>
      </motion.div>
      
      {/* Purchase Confirmation Modal - Regular Items */}
      <NeonModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        title="Purchase Item"
        glowColor="cyan"
      >
        {selectedItem && (
          <div className="space-y-4">
            {/* Theme Preview in Modal */}
            {selectedItem.type === "theme" && selectedItem.themeId && (
              <div className="mb-4">
                <ThemePreview
                  theme={themesWithOwnership.find(t => t.id === selectedItem.themeId)!}
                  showPrice={false}
                />
              </div>
            )}
            
            <div className="text-center">
              {selectedItem.type !== "theme" && (
                <div className="inline-flex justify-center mb-4 text-white">
                  {selectedItem.icon}
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{selectedItem.name}</h3>
              <p className="text-[#B8B8B8] mb-4">{selectedItem.description}</p>
              
              <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                <span className="text-[#FFD700]">💰</span>
                <span>{selectedItem.price}</span>
              </div>
              
              {coins < selectedItem.price && (
                <p className="text-[#FF6A00] text-sm mt-2">
                  Not enough coins! Need {selectedItem.price - coins} more.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <NeonButton
                onClick={() => handlePurchase(selectedItem)}
                disabled={coins < selectedItem.price}
                className="w-full"
              >
                Confirm Purchase
              </NeonButton>
              <NeonButton
                variant="ghost"
                onClick={() => setSelectedItem(null)}
                className="w-full"
              >
                Cancel
              </NeonButton>
            </div>
          </div>
        )}
      </NeonModal>

      {/* Purchase Confirmation Modal - Tile Blocks */}
      <NeonModal
        isOpen={selectedTileBlock !== null}
        onClose={() => setSelectedTileBlock(null)}
        title="Purchase Tile Block"
        glowColor="cyan"
      >
        {selectedTileBlock && (
          <div className="space-y-4">
            <TileBlockPreview
              block={selectedTileBlock}
              showPrice={false}
              owned={false}
            />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                <span className="text-[#FFD700]">💰</span>
                <span>{selectedTileBlock.price}</span>
              </div>
              
              {coins < selectedTileBlock.price && (
                <p className="text-[#FF6A00] text-sm mt-2">
                  Not enough coins! Need {selectedTileBlock.price - coins} more.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <NeonButton
                onClick={() => handleTileBlockPurchase(selectedTileBlock)}
                disabled={coins < selectedTileBlock.price}
                className="w-full"
              >
                Confirm Purchase
              </NeonButton>
              <NeonButton
                variant="ghost"
                onClick={() => setSelectedTileBlock(null)}
                className="w-full"
              >
                Cancel
              </NeonButton>
            </div>
          </div>
        )}
      </NeonModal>

      {/* Purchase Confirmation Modal - Backgrounds */}
      <NeonModal
        isOpen={selectedBackground !== null}
        onClose={() => setSelectedBackground(null)}
        title="Purchase Background"
        glowColor="magenta"
      >
        {selectedBackground && (
          <div className="space-y-4">
            <BackgroundPreview
              background={selectedBackground}
              showPrice={false}
              owned={false}
            />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                <span className="text-[#FFD700]">💰</span>
                <span>{selectedBackground.price}</span>
              </div>
              
              {coins < selectedBackground.price && (
                <p className="text-[#FF6A00] text-sm mt-2">
                  Not enough coins! Need {selectedBackground.price - coins} more.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <NeonButton
                onClick={() => handleBackgroundPurchase(selectedBackground)}
                disabled={coins < selectedBackground.price}
                className="w-full"
              >
                Confirm Purchase
              </NeonButton>
              <NeonButton
                variant="ghost"
                onClick={() => setSelectedBackground(null)}
                className="w-full"
              >
                Cancel
              </NeonButton>
            </div>
          </div>
        )}
      </NeonModal>
    </div>
  );
}
