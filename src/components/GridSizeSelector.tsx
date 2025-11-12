import { motion } from "framer-motion";
import { NeonModal } from "./NeonModal";
import { NeonButton } from "./NeonButton";

interface GridSizeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (size: 4 | 5 | 6 | 7 | 8 | 9 | 10) => void;
}

const gridSizes = [
  { size: 4, label: "4×4", difficulty: "Easy", color: "from-[#00FF99] to-[#00FFFF]" },
  { size: 5, label: "5×5", difficulty: "Normal", color: "from-[#FFD700] to-[#FFA500]" },
  { size: 6, label: "6×6", difficulty: "Medium", color: "from-[#FF6A00] to-[#FF4500]" },
  { size: 7, label: "7×7", difficulty: "Hard", color: "from-[#FF00FF] to-[#A100FF]" },
  { size: 8, label: "8×8", difficulty: "Expert", color: "from-[#A100FF] to-[#8B008B]" },
  { size: 9, label: "9×9", difficulty: "Master", color: "from-[#8B008B] to-[#4B0082]" },
  { size: 10, label: "10×10", difficulty: "Legend", color: "from-[#FF0000] to-[#8B0000]" },
] as const;

export function GridSizeSelector({ isOpen, onClose, onSelect }: GridSizeSelectorProps) {
  return (
    <NeonModal
      isOpen={isOpen}
      onClose={onClose}
      title="SELECT GRID SIZE"
      glowColor="cyan"
    >
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {gridSizes.map((grid, index) => (
          <motion.button
            key={grid.size}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onSelect(grid.size);
              onClose();
            }}
            className={`
              w-full p-4 rounded-2xl border-2 transition-all
              bg-gradient-to-r ${grid.color} bg-opacity-20
              border-white/20 hover:border-white/40
              flex items-center justify-between
              shadow-[0_0_20px_rgba(0,255,255,0.1)]
              hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]
            `}
          >
            <div className="flex items-center gap-4">
              {/* Grid Preview */}
              <div className="w-12 h-12 rounded-lg bg-black/30 p-1">
                <div 
                  className="w-full h-full grid gap-0.5"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(grid.size, 4)}, 1fr)`,
                    gridTemplateRows: `repeat(${Math.min(grid.size, 4)}, 1fr)`,
                  }}
                >
                  {Array.from({ length: Math.min(grid.size * grid.size, 16) }).map((_, i) => (
                    <div key={i} className="bg-white/20 rounded-sm" />
                  ))}
                </div>
              </div>
              
              {/* Info */}
              <div className="text-left">
                <h3 className="font-bold text-lg">{grid.label}</h3>
                <p className="text-sm text-white/70">{grid.difficulty}</p>
              </div>
            </div>
            
            {/* Badge */}
            <div className={`
              px-3 py-1 rounded-full text-xs font-bold
              bg-gradient-to-r ${grid.color} text-white
            `}>
              {grid.size}×{grid.size}
            </div>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-sm text-[#B8B8B8] text-center">
          Larger grids = More challenging gameplay! 🎯
        </p>
      </div>
    </NeonModal>
  );
}
