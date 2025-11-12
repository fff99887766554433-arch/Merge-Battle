import { GameTile } from "./GameTile";
import { motion } from "framer-motion";

/**
 * Tile Showcase Component
 * 
 * Displays all tile variants for design reference and testing.
 * Can be used for:
 * - Design system documentation
 * - Visual regression testing
 * - Asset export reference
 */

export function TileShowcase() {
  // Show a selection of tile values across the entire range
  const tileValues = [
    2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 
    8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576,
    2097152, 4194304, 8388608, 16777216, 33554432, 67108864,
    134217728, 268435456, 536870912, 1073741824, 2147483648, 4294967296,
    8589934592, 17179869184, 34359738368, 68719476736
  ];
  
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#0B0F19] to-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-[#00FFFF] via-[#A100FF] to-[#FF00FF] bg-clip-text text-transparent">
            MERGE BATTLE
          </h1>
          <p className="text-[#B8B8B8]">Tile Design System Showcase</p>
        </motion.div>
        
        {/* Tile Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {tileValues.map((value, index) => (
            <motion.div
              key={value}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              {/* Tile */}
              <div className="aspect-square">
                <GameTile value={value} />
              </div>
              
              {/* Label */}
              <div className="text-center">
                <p className="text-sm text-white font-bold">
                  {value >= 1e15 ? value.toExponential(2) : 
                   value >= 1e9 ? (value / 1e9).toFixed(1) + "B" : 
                   value >= 1e6 ? (value / 1e6).toFixed(1) + "M" : 
                   value >= 1e3 ? (value / 1e3).toFixed(1) + "K" : 
                   value}
                </p>
                <p className="text-xs text-[#B8B8B8]">
                  {value < 128 ? "Base" : value < 512 ? "Gradient" : value < 1e6 ? "Premium" : "Ultra"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* States Showcase */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-white/5 rounded-3xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6 text-[#00FFFF]">Tile States</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Idle State */}
            <div className="space-y-2">
              <div className="aspect-square">
                <GameTile value={256} />
              </div>
              <p className="text-center text-sm text-white">Idle</p>
            </div>
            
            {/* Selected State */}
            <div className="space-y-2">
              <div className="aspect-square">
                <GameTile value={256} isSelected={true} />
              </div>
              <p className="text-center text-sm text-white">Selected</p>
            </div>
            
            {/* Merging State */}
            <div className="space-y-2">
              <div className="aspect-square">
                <GameTile value={256} isMerging={true} />
              </div>
              <p className="text-center text-sm text-white">Merging</p>
            </div>
            
            {/* New State */}
            <div className="space-y-2">
              <div className="aspect-square">
                <GameTile value={256} isNew={true} />
              </div>
              <p className="text-center text-sm text-white">New Spawn</p>
            </div>
          </div>
        </motion.div>
        
        {/* Color Reference */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 bg-white/5 rounded-3xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6 text-[#00FFFF]">Color Palette</h2>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: "Cyan", color: "#00FFFF", value: 2 },
              { name: "Lime", color: "#00FF99", value: 4 },
              { name: "Yellow", color: "#FFD700", value: 8 },
              { name: "Orange", color: "#FF6A00", value: 16 },
              { name: "Magenta", color: "#FF00FF", value: 32 },
              { name: "Purple", color: "#A100FF", value: 64 },
            ].map((item) => (
              <div key={item.name} className="text-center">
                <div
                  className="w-full aspect-square rounded-2xl mb-2 glow-cyan"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-xs font-bold text-white">{item.name}</p>
                <p className="text-xs text-[#B8B8B8]">{item.color}</p>
                <p className="text-xs text-[#6B6B6B]">Tile {item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Export Info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8 text-center text-sm text-[#B8B8B8] space-y-2"
        >
          <p>Export tiles as PNG (1024×1024, transparent background)</p>
          <p>Naming: tile_<value>_<hexcolor>.png</p>
          <p className="text-xs">Example: tile_2048_gradient.png</p>
        </motion.div>
      </div>
    </div>
  );
}
