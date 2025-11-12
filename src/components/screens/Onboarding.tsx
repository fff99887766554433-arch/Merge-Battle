import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "../NeonButton";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    title: "Welcome to Merge Battle!",
    description: "Swipe tiles to merge numbers and reach the target tile",
    icon: "🎮",
    color: "cyan",
  },
  {
    title: "Merge & Grow",
    description: "Combine same numbers to create bigger tiles. 2+2=4, 4+4=8, and so on!",
    icon: "✨",
    color: "magenta",
  },
  {
    title: "Compete & Win",
    description: "Challenge other players in PvP mode or climb the leaderboard",
    icon: "🏆",
    color: "purple",
  },
];

const colorGradients = {
  cyan: "from-[#00FFFF] to-[#00FF99]",
  magenta: "from-[#FF00FF] to-[#A100FF]",
  purple: "from-[#A100FF] to-[#FF00FF]",
};

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };
  
  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  const skip = () => {
    onComplete();
  };
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0B0F19] to-[#1A1A1A] flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={skip}
          className="text-[#B8B8B8] hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>
      
      {/* Slides */}
      <div className="flex-1 flex items-center justify-center px-8 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute text-center max-w-md"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`
                inline-flex items-center justify-center w-32 h-32 rounded-full text-6xl mb-8
                bg-gradient-to-br ${colorGradients[slides[currentSlide].color as keyof typeof colorGradients]}
                shadow-[0_0_60px_rgba(0,255,255,0.4)]
              `}
            >
              {slides[currentSlide].icon}
            </motion.div>
            
            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-4"
            >
              <span className={`bg-gradient-to-r ${colorGradients[slides[currentSlide].color as keyof typeof colorGradients]} bg-clip-text text-transparent`}>
                {slides[currentSlide].title}
              </span>
            </motion.h2>
            
            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-[#B8B8B8] leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`
              h-2 rounded-full transition-all
              ${index === currentSlide ? "w-8 bg-[#00FFFF]" : "w-2 bg-white/30"}
            `}
            animate={{
              boxShadow: index === currentSlide 
                ? "0 0 10px rgba(0, 255, 255, 0.8)" 
                : "none",
            }}
          />
        ))}
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 px-8 pb-8">
        <motion.button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
            ${currentSlide === 0 
              ? "opacity-30 cursor-not-allowed border-white/20" 
              : "border-[#00FFFF] hover:bg-[#00FFFF]/10"
            }
          `}
        >
          <ChevronLeft size={24} />
        </motion.button>
        
        <NeonButton
          onClick={nextSlide}
          className="flex-1 max-w-xs flex items-center justify-center gap-2"
        >
          <span>{currentSlide === slides.length - 1 ? "Get Started" : "Next"}</span>
          <ChevronRight size={20} />
        </NeonButton>
      </div>
    </div>
  );
}
