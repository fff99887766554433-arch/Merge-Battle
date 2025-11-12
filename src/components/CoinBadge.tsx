import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { cn } from "./ui/utils";

interface CoinBadgeProps {
  amount: number;
  showAnimation?: boolean;
  className?: string;
}

export function CoinBadge({ amount, showAnimation, className }: CoinBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FF6A00] px-4 py-2 rounded-full",
        "shadow-[0_0_20px_rgba(255,215,0,0.4)]",
        className
      )}
    >
      <Coins size={18} className="text-[#0B0F19]" />
      <motion.span
        key={amount}
        initial={showAnimation ? { scale: 1.3, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        className="font-bold text-[#0B0F19]"
      >
        {amount.toLocaleString()}
      </motion.span>
    </motion.div>
  );
}
