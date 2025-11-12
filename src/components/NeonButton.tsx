import { motion } from "framer-motion";
import { cn } from "./ui/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  glowColor?: "cyan" | "magenta" | "purple" | "orange" | "lime" | "yellow";
  children: React.ReactNode;
}

const variantStyles = {
  primary: {
    base: "bg-gradient-to-r from-[#00FFFF] to-[#00FF99] text-[#0B0F19]",
    hover: "hover:from-[#00FFFF] hover:to-[#00FFFF]",
    glow: "shadow-[0_0_20px_rgba(0,255,255,0.5)]",
  },
  secondary: {
    base: "bg-transparent border-2 border-[#00FFFF] text-[#00FFFF]",
    hover: "hover:bg-[#00FFFF]/10",
    glow: "shadow-[0_0_15px_rgba(0,255,255,0.3)]",
  },
  ghost: {
    base: "bg-white/5 text-white border border-white/20",
    hover: "hover:bg-white/10 hover:border-white/30",
    glow: "",
  },
};

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ variant = "primary", glowColor = "cyan", children, className, disabled, ...props }, ref) => {
    const styles = variantStyles[variant];
    
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={disabled}
        className={cn(
          "relative px-8 py-4 rounded-[var(--radius-button)] transition-all duration-200",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          styles.base,
          styles.hover,
          !disabled && styles.glow,
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

NeonButton.displayName = "NeonButton";
