import { motion } from "framer-motion";
import { GameBackground } from "./tileBlockData";

interface BackgroundPreviewProps {
  background: GameBackground;
  owned?: boolean;
  showPrice?: boolean;
  onClick?: () => void;
}

export function BackgroundPreview({ background, owned, showPrice = true, onClick }: BackgroundPreviewProps) {
  return (
    <motion.button
      whileHover={{ scale: owned ? 1 : 1.05 }}
      whileTap={{ scale: owned ? 1 : 0.95 }}
      onClick={onClick}
      disabled={owned}
      className={`
        relative w-full p-4 rounded-2xl border-2 transition-all
        bg-gradient-to-br from-white/5 to-white/10
        border-white/20
        ${!owned && "hover:border-white/40 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]"}
        ${owned && "opacity-60 cursor-not-allowed"}
      `}
    >
      {/* Owned Badge */}
      {owned && (
        <div className="absolute top-2 right-2 bg-[#00FF99] text-[#0B0F19] px-2 py-1 rounded-full text-xs font-bold z-10">
          OWNED
        </div>
      )}
      
      {/* Preview Icon */}
      <div className="text-4xl mb-3">{background.preview}</div>
      
      {/* Background Name */}
      <h3 className="font-bold text-sm mb-1">{background.name}</h3>
      <p className="text-xs text-[#B8B8B8] mb-3 min-h-[32px]">{background.description}</p>
      
      {/* Background Preview */}
      <div className="relative mb-3 rounded-lg overflow-hidden h-24">
        <div className={`absolute inset-0 ${background.bgClass}`} />
        <div className={`
          absolute inset-0 flex items-center justify-center
          ${background.boardBg} backdrop-blur-sm
          m-2 rounded-lg
        `}>
          <div 
            className="w-12 h-12 rounded-lg border-2 opacity-50"
            style={{ borderColor: background.glowColor }}
          />
        </div>
      </div>
      
      {/* Price */}
      {showPrice && background.price > 0 && (
        <div className="flex items-center justify-center gap-1 bg-black/30 rounded-full px-3 py-1">
          <span className="text-[#FFD700] text-lg">💰</span>
          <span className="font-bold text-sm">{background.price}</span>
        </div>
      )}
      
      {background.price === 0 && (
        <div className="text-[#00FF99] text-xs font-bold">FREE</div>
      )}
    </motion.button>
  );
}
