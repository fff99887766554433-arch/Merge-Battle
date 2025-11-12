import { motion } from "framer-motion";
import { cn } from "./ui/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
}

const sizeStyles = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
};

const variantStyles = {
  solid: "bg-white/10 hover:bg-white/20 backdrop-blur-sm",
  outline: "border-2 border-[#00FFFF]/50 hover:border-[#00FFFF] hover:bg-[#00FFFF]/10",
  ghost: "hover:bg-white/10",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = "md", variant = "solid", className, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        disabled={disabled}
        className={cn(
          "flex items-center justify-center rounded-full transition-all duration-200",
          "text-white disabled:opacity-40 disabled:cursor-not-allowed",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {icon}
      </motion.button>
    );
  }
);

IconButton.displayName = "IconButton";
