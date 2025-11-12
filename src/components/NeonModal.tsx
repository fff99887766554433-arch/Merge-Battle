import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./ui/utils";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

interface NeonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showClose?: boolean;
  glowColor?: "cyan" | "magenta" | "purple";
  className?: string;
}

const glowStyles = {
  cyan: "shadow-[0_0_40px_rgba(0,255,255,0.3)] border-[#00FFFF]",
  magenta: "shadow-[0_0_40px_rgba(255,0,255,0.3)] border-[#FF00FF]",
  purple: "shadow-[0_0_40px_rgba(161,0,255,0.3)] border-[#A100FF]",
};

export function NeonModal({
  isOpen,
  onClose,
  title,
  children,
  showClose = true,
  glowColor = "cyan",
  className,
}: NeonModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "relative w-full max-w-md bg-gradient-to-br from-[#1A1A1A] to-[#0B0F19]",
                "rounded-[var(--radius-modal)] border-2 p-6 pointer-events-auto",
                glowStyles[glowColor],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              {showClose && (
                <div className="absolute top-4 right-4">
                  <IconButton
                    icon={<X size={20} />}
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                  />
                </div>
              )}
              
              {/* Title */}
              {title && (
                <h2 className="text-center mb-6 text-glow-cyan">
                  {title}
                </h2>
              )}
              
              {/* Content */}
              <div className="space-y-4">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
