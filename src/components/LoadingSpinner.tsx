import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "cyan" | "purple" | "gold";
}

export function LoadingSpinner({ size = "md", color = "cyan" }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 24,
    md: 48,
    lg: 72,
  };

  const colorMap = {
    cyan: "#00FFFF",
    purple: "#A100FF",
    gold: "#FFD700",
  };

  const spinnerSize = sizeMap[size];
  const spinnerColor = colorMap[color];

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative"
        style={{ width: spinnerSize, height: spinnerSize }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: spinnerColor,
            borderRightColor: spinnerColor,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent"
          style={{
            borderBottomColor: `${spinnerColor}80`,
            borderLeftColor: `${spinnerColor}80`,
          }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Center Dot */}
        <motion.div
          className="absolute inset-0 m-auto rounded-full"
          style={{
            width: spinnerSize / 4,
            height: spinnerSize / 4,
            backgroundColor: spinnerColor,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Glow Effect */}
        <div
          className="absolute inset-0 rounded-full blur-md"
          style={{
            backgroundColor: spinnerColor,
            opacity: 0.2,
          }}
        />
      </motion.div>
    </div>
  );
}

interface FullPageLoaderProps {
  message?: string;
}

export function FullPageLoader({ message = "Loading..." }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0B0F19] to-[#1A1A1A] flex flex-col items-center justify-center z-50">
      <LoadingSpinner size="lg" color="cyan" />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-[#B8B8B8]"
      >
        {message}
      </motion.p>

      {/* Animated Dots */}
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[#00FFFF]"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
