import { motion } from "framer-motion";
import { allTileValues } from "./tileBlockData";
import { GameTile } from "./GameTile";
import { TileBlock } from "./tileBlockData";

interface TileRangeDisplayProps {
  tileBlock?: TileBlock;
  maxDisplay?: number;
}

export function TileRangeDisplay({ tileBlock, maxDisplay = 36 }: TileRangeDisplayProps) {
  // Display a subset of all possible tile values
  const displayValues = allTileValues.slice(0, maxDisplay);
  
  const formatValue = (val: number): string => {
    if (val >= 1e30) {
      return val.toExponential(2);
    } else if (val >= 1e24) {
      return (val / 1e24).toFixed(1) + "Y";
    } else if (val >= 1e21) {
      return (val / 1e21).toFixed(1) + "Z";
    } else if (val >= 1e18) {
      return (val / 1e18).toFixed(1) + "E";
    } else if (val >= 1e15) {
      return (val / 1e15).toFixed(1) + "P";
    } else if (val >= 1e12) {
      return (val / 1e12).toFixed(1) + "T";
    } else if (val >= 1e9) {
      return (val / 1e9).toFixed(1) + "B";
    } else if (val >= 1e6) {
      return (val / 1e6).toFixed(1) + "M";
    } else if (val >= 1e3) {
      return (val / 1e3).toFixed(1) + "K";
    }
    return val.toString();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#00FFFF]">
          Complete Tile Range
        </h2>
        <p className="text-[#B8B8B8]">
          From 2 to 2^100 (≈ 1.27e30) • {allTileValues.length} unique values
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
        {displayValues.map((value, index) => (
          <motion.div
            key={value}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.02 }}
            className="space-y-1"
          >
            <div className="aspect-square">
              <GameTile value={value} tileBlock={tileBlock} />
            </div>
            <div className="text-center">
              <p className="text-xs text-white font-bold truncate">
                {formatValue(value)}
              </p>
              <p className="text-[10px] text-[#6B6B6B] truncate">
                2^{Math.log2(value)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {maxDisplay < allTileValues.length && (
        <div className="text-center text-sm text-[#B8B8B8]">
          <p>
            Showing {maxDisplay} of {allTileValues.length} tile values
          </p>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Maximum value: {allTileValues[allTileValues.length - 1].toExponential(2)}
          </p>
        </div>
      )}
    </div>
  );
}
