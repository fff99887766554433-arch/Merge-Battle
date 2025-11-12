import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface ThemeData {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  gradient: string;
  tileColors: string[];
  owned: boolean;
  price?: number;
}

interface ThemePreviewProps {
  theme: ThemeData;
  isActive?: boolean;
  onClick?: () => void;
  showPrice?: boolean;
}

export function ThemePreview({ 
  theme, 
  isActive = false, 
  onClick,
  showPrice = false 
}: ThemePreviewProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={!theme.owned && !onClick}
      className={`
        relative p-4 rounded-2xl border-2 transition-all text-left
        ${isActive 
          ? `bg-gradient-to-br ${theme.gradient} border-[${theme.primary}] shadow-[0_0_30px_${theme.primary}40]` 
          : theme.owned 
            ? `bg-gradient-to-br ${theme.gradient} border-white/20 hover:border-[${theme.primary}]/50` 
            : "bg-white/5 border-white/10 opacity-50"
        }
        ${!theme.owned && !onClick ? "cursor-not-allowed" : ""}
      `}
    >
      {/* Active Badge */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg`}
          style={{ backgroundColor: theme.primary }}
        >
          <Check size={16} className="text-black" />
        </motion.div>
      )}
      
      {/* Owned Badge */}
      {!isActive && theme.owned && (
        <div className="absolute top-2 right-2 bg-[#00FF99] text-[#0B0F19] px-2 py-1 rounded-full text-xs">
          OWNED
        </div>
      )}
      
      {/* Theme Name */}
      <h4 className="font-bold text-sm mb-1">{theme.name}</h4>
      <p className="text-xs text-[#B8B8B8] mb-3">{theme.description}</p>
      
      {/* Color Preview */}
      <div className="flex gap-1.5 mb-3">
        {theme.tileColors.slice(0, 4).map((color, idx) => (
          <div
            key={idx}
            className="w-8 h-8 rounded-lg shadow-md"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      
      {/* Price */}
      {showPrice && theme.price && !theme.owned && (
        <div className="flex items-center justify-center gap-1 bg-black/30 rounded-full px-3 py-1">
          <span className="text-[#FFD700] text-sm">💰</span>
          <span className="text-xs font-bold">{theme.price}</span>
        </div>
      )}
    </motion.button>
  );
}
