import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "./NeonButton";
import { X, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlightArea?: "top" | "center" | "bottom";
}

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Swipe to Move",
    description: "Swipe in any direction to move all tiles. Tiles with the same number will merge!",
    icon: (
      <div className="flex gap-2">
        <ArrowLeft size={20} />
        <ArrowRight size={20} />
        <ArrowUp size={20} />
        <ArrowDown size={20} />
      </div>
    ),
    highlightArea: "center",
  },
  {
    title: "Merge Tiles",
    description: "When two tiles with the same number touch, they merge into one with double the value.",
    icon: <span className="text-4xl">2️⃣ + 2️⃣ = 4️⃣</span>,
    highlightArea: "center",
  },
  {
    title: "Reach the Goal",
    description: "Keep merging to reach higher numbers. The goal is to create a 2048 tile!",
    icon: <span className="text-4xl">🎯</span>,
    highlightArea: "center",
  },
  {
    title: "Use Power-ups",
    description: "Stuck? Use power-ups like Undo and Hints to help you win. Buy them in the Shop!",
    icon: <span className="text-4xl">⚡</span>,
    highlightArea: "top",
  },
];

export function TutorialOverlay({ isOpen, onClose, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const currentTutorial = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
    >
      {/* Close/Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
      >
        <X size={20} />
      </button>

      {/* Tutorial Content */}
      <div className="h-full flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="max-w-md w-full"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#A100FF] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,255,0.5)]">
                {currentTutorial.icon}
              </div>
            </div>

            {/* Content */}
            <div className="bg-gradient-to-br from-[#0B0F19] to-[#1A1A1A] rounded-3xl p-6 border-2 border-[#00FFFF]/50 shadow-[0_0_40px_rgba(0,255,255,0.2)] mb-6">
              <h3 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-[#00FFFF] to-[#00FF99] bg-clip-text text-transparent">
                {currentTutorial.title}
              </h3>
              <p className="text-center text-[#B8B8B8] leading-relaxed">
                {currentTutorial.description}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`
                    h-2 rounded-full transition-all
                    ${index === currentStep ? "w-8 bg-[#00FFFF]" : "w-2 bg-white/30"}
                  `}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <NeonButton
                  variant="ghost"
                  onClick={handlePrev}
                  className="flex-1"
                >
                  Previous
                </NeonButton>
              )}
              <NeonButton
                onClick={handleNext}
                className="flex-1"
              >
                {isLastStep ? "Get Started!" : "Next"}
              </NeonButton>
            </div>

            {/* Step Counter */}
            <p className="text-center text-sm text-[#B8B8B8] mt-4">
              Step {currentStep + 1} of {tutorialSteps.length}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#00FFFF] blur-[100px] opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#A100FF] blur-[120px] opacity-20"
        />
      </div>
    </motion.div>
  );
}
