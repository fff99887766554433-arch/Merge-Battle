import { motion } from "framer-motion";
import { TileBlock } from "./tileBlockData";

interface TileBlockPreviewProps {
  block: TileBlock;
  owned?: boolean;
  showPrice?: boolean;
  onClick?: () => void;
}

export function TileBlockPreview({ block, owned, showPrice = true, onClick }: TileBlockPreviewProps) {
  // Show a diverse range of tile values including very large ones
  const previewValues = [2, 16, 512, 131072];
  
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
      <div className="text-4xl mb-3">{block.preview}</div>
      
      {/* Block Name */}
      <h3 className="font-bold text-sm mb-1">{block.name}</h3>
      <p className="text-xs text-[#B8B8B8] mb-3 min-h-[32px]">{block.description}</p>
      
      {/* Tile Preview Grid */}
      <div className="grid grid-cols-4 gap-1 mb-3">
        {previewValues.map((value) => {
          const style = block.colors[value] || block.colors[2];
          const displayValue = 
            value >= 1e6 ? (value / 1e6).toFixed(0) + "M" : 
            value >= 1e3 ? (value / 1e3).toFixed(0) + "K" : 
            value;
          return (
            <div
              key={value}
              className={`
                aspect-square rounded-md flex items-center justify-center
                ${style.bg} ${style.text} text-[10px] font-bold
              `}
            >
              {displayValue}
            </div>
          );
        })}
      </div>
      
      {/* Price */}
      {showPrice && block.price > 0 && (
        <div className="flex items-center justify-center gap-1 bg-black/30 rounded-full px-3 py-1">
          <span className="text-[#FFD700] text-lg">💰</span>
          <span className="font-bold text-sm">{block.price}</span>
        </div>
      )}
      
      {block.price === 0 && (
        <div className="text-[#00FF99] text-xs font-bold">FREE</div>
      )}
    </motion.button>
  );
}
