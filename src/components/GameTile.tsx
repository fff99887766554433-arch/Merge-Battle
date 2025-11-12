import { motion } from "framer-motion";
import { cn } from "./ui/utils";
import { TileBlock } from "./tileBlockData";

interface GameTileProps {
  value: number;
  isSelected?: boolean;
  isMerging?: boolean;
  isNew?: boolean;
  onClick?: () => void;
  className?: string;
  tileBlock?: TileBlock;
}

const tileColors: Record<number, { bg: string; text: string; glow: string }> = {
  2: { bg: "bg-[#00FFFF]", text: "text-[#0B0F19]", glow: "glow-cyan" },
  4: { bg: "bg-[#00FF99]", text: "text-[#0B0F19]", glow: "glow-lime" },
  8: { bg: "bg-[#FFD700]", text: "text-[#0B0F19]", glow: "glow-yellow" },
  16: { bg: "bg-[#FF6A00]", text: "text-white", glow: "glow-orange" },
  32: { bg: "bg-[#FF00FF]", text: "text-white", glow: "glow-magenta" },
  64: { bg: "bg-[#A100FF]", text: "text-white", glow: "glow-purple" },
  128: { bg: "bg-gradient-to-br from-[#00FFFF] to-[#00FF99]", text: "text-[#0B0F19]", glow: "glow-cyan" },
  256: { bg: "bg-gradient-to-br from-[#FFD700] to-[#FF6A00]", text: "text-white", glow: "glow-yellow" },
  512: { bg: "bg-gradient-to-br from-[#FF00FF] to-[#A100FF]", text: "text-white", glow: "glow-magenta" },
  1024: { bg: "bg-gradient-to-br from-[#A100FF] via-[#FF00FF] to-[#00FFFF]", text: "text-white", glow: "glow-intense-purple" },
  2048: { bg: "bg-gradient-to-br from-[#FFD700] via-[#FF00FF] to-[#00FFFF]", text: "text-white", glow: "glow-intense-magenta" },
};

const getTileStyle = (value: number, customBlock?: TileBlock) => {
  // Use custom block colors if provided
  if (customBlock && customBlock.colors[value]) {
    return customBlock.colors[value];
  }
  
  // Fallback to default colors
  if (tileColors[value]) return tileColors[value];
  
  // For values beyond 2048
  if (customBlock) {
    // Use the highest value style from custom block
    const maxValue = Math.max(...Object.keys(customBlock.colors).map(Number));
    return customBlock.colors[maxValue] || tileColors[2048];
  }
  
  return { bg: "bg-gradient-to-br from-[#00FFFF] via-[#A100FF] to-[#FF00FF]", text: "text-white", glow: "glow-intense-cyan" };
};

export function GameTile({ value, isSelected, isMerging, isNew, onClick, className, tileBlock }: GameTileProps) {
  const style = getTileStyle(value, tileBlock);
  
  // Format large numbers in exponential notation
  const formatValue = (val: number): string => {
    if (val >= 1e15) {
      return val.toExponential(2);
    } else if (val >= 1e9) {
      return (val / 1e9).toFixed(1) + "B";
    } else if (val >= 1e6) {
      return (val / 1e6).toFixed(1) + "M";
    } else if (val >= 1e3) {
      return (val / 1e3).toFixed(1) + "K";
    }
    return val.toString();
  };
  
  const displayValue = formatValue(value);
  const isVeryLarge = value >= 1e15;
  const isLarge = value >= 1024;
  
  return (
    <motion.button
      onClick={onClick}
      initial={isNew ? { scale: 0, opacity: 0 } : false}
      animate={{
        scale: isSelected ? 1.08 : isMerging ? [1, 1.15, 1] : 1,
        opacity: 1,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={cn(
        "relative flex items-center justify-center rounded-[var(--radius-tile)] transition-all duration-200",
        "aspect-square w-full",
        style.bg,
        isSelected && "ring-4 ring-white/40",
        isMerging && style.glow,
        className
      )}
    >
      {/* Number */}
      <motion.span
        className={cn(
          "font-bold select-none",
          style.text,
        )}
        style={{
          fontSize: isVeryLarge 
            ? "clamp(0.875rem, 3vw, 1.5rem)" 
            : isLarge 
            ? "clamp(1.25rem, 4vw, 2rem)" 
            : "clamp(1.5rem, 5vw, 2.5rem)"
        }}
        animate={isMerging ? {
          scale: [1, 1.2, 1],
        } : {}}
      >
        {displayValue}
      </motion.span>
      
      {/* Glow overlay when merging */}
      {isMerging && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
          transition={{ duration: 0.4 }}
          className={cn(
            "absolute inset-0 rounded-[var(--radius-tile)]",
            style.bg,
            "opacity-50 blur-xl"
          )}
        />
      )}
    </motion.button>
  );
}
