import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameTile } from "../GameTile";
import { TopBar } from "../TopBar";
import { IconButton } from "../IconButton";
import { NeonButton } from "../NeonButton";
import { NeonModal } from "../NeonModal";
import { TileBlock, GameBackground } from "../tileBlockData";
import { ArrowLeft, RotateCcw, Lightbulb, Pause, Trophy, Share2, Home } from "lucide-react";

interface GameScreenProps {
  onNavigate: (screen: string) => void;
  gridSize?: 4 | 5 | 6 | 7 | 8 | 9 | 10;
  targetTile?: number;
  timedMode?: boolean;
  tileBlock?: TileBlock;
  background?: GameBackground;
}

type GridType = (number | null)[][];

export function GameScreen({ onNavigate, gridSize = 4, targetTile = 2048, timedMode = false, tileBlock, background }: GameScreenProps) {
  const [grid, setGrid] = useState<GridType>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [showLose, setShowLose] = useState(false);
  const [mergingTiles, setMergingTiles] = useState<Set<string>>(new Set());
  
  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid: GridType = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(null));
    
    // Add two starting tiles
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    
    setGrid(newGrid);
    setScore(0);
    setTimer(180);
    setShowWin(false);
    setShowLose(false);
  }, [gridSize]);
  
  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);
  
  // Timer countdown
  useEffect(() => {
    if (!timedMode || isPaused || showWin || showLose) return;
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setShowLose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timedMode, isPaused, showWin, showLose]);
  
  // Add random tile (2 or 4)
  function addRandomTile(currentGrid: GridType) {
    const emptyCells: [number, number][] = [];
    currentGrid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === null) emptyCells.push([i, j]);
      });
    });
    
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }
  
  // Handle swipe/move
  const handleMove = (direction: "up" | "down" | "left" | "right") => {
    if (isPaused || showWin || showLose) return;
    
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridType;
    let moved = false;
    let scoreGained = 0;
    const newMergingTiles = new Set<string>();
    
    // Simplified move logic (rotate grid, merge, rotate back)
    const rotatedGrid = rotateGrid(newGrid, direction);
    
    // Merge left
    for (let i = 0; i < gridSize; i++) {
      const row = rotatedGrid[i].filter((cell) => cell !== null);
      const newRow: (number | null)[] = [];
      
      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          const mergedValue = (row[j]! * 2);
          newRow.push(mergedValue);
          scoreGained += mergedValue;
          newMergingTiles.add(`${i}-${newRow.length - 1}`);
          j++; // Skip next tile
          moved = true;
          
          if (mergedValue >= targetTile) {
            setTimeout(() => setShowWin(true), 500);
          }
        } else {
          newRow.push(row[j]!);
        }
      }
      
      while (newRow.length < gridSize) {
        newRow.push(null);
      }
      
      rotatedGrid[i] = newRow;
      
      if (JSON.stringify(rotatedGrid[i]) !== JSON.stringify(grid[i])) {
        moved = true;
      }
    }
    
    const finalGrid = rotateGrid(rotatedGrid, direction, true);
    
    if (moved) {
      addRandomTile(finalGrid);
      setGrid(finalGrid);
      setScore(score + scoreGained);
      setMergingTiles(newMergingTiles);
      
      setTimeout(() => setMergingTiles(new Set()), 300);
    }
  };
  
  // Rotate grid helper
  function rotateGrid(g: GridType, direction: string, reverse = false): GridType {
    let result = g;
    
    if (direction === "up") {
      result = transpose(g);
    } else if (direction === "down") {
      result = transpose(g).map((row) => row.reverse());
    } else if (direction === "right") {
      result = g.map((row) => [...row].reverse());
    }
    
    return result;
  }
  
  function transpose(g: GridType): GridType {
    return g[0].map((_, colIndex) => g.map((row) => row[colIndex]));
  }
  
  // Touch/swipe handlers
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const deltaX = e.changedTouches[0].clientX - touchStart.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.y;
    const threshold = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      handleMove(deltaX > 0 ? "right" : "left");
    } else if (Math.abs(deltaY) > threshold) {
      handleMove(deltaY > 0 ? "down" : "up");
    }
    
    setTouchStart(null);
  };
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const direction = e.key.replace("Arrow", "").toLowerCase() as "up" | "down" | "left" | "right";
        handleMove(direction);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });
  
  const bgClass = background?.bgClass || "bg-gradient-to-br from-[#0B0F19] to-[#1A1A1A]";
  const boardBg = background?.boardBg || "bg-[#1A1A1A]/80";
  const glowColor = background?.glowColor || "#00FFFF";

  return (
    <div className={`min-h-screen flex flex-col p-4 ${bgClass}`}>
      {/* Top Bar */}
      <TopBar
        score={score}
        targetTile={targetTile}
        timer={timedMode ? timer : undefined}
      />
      
      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="relative">
          {/* Board Border with Glow */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 30px rgba(0, 255, 255, 0.3)",
                "0 0 50px rgba(161, 0, 255, 0.5)",
                "0 0 30px rgba(0, 255, 255, 0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl border-2 border-[#00FFFF]/50 -m-2"
          />
          
          {/* Grid */}
          <div
            className={`relative ${boardBg} backdrop-blur-sm p-3 rounded-3xl`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gap: gridSize <= 6 ? "12px" : gridSize <= 8 ? "10px" : "8px",
              width: `min(90vw, ${gridSize * (gridSize <= 6 ? 80 : gridSize <= 8 ? 70 : 60)}px)`,
              aspectRatio: "1",
            }}
          >
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <div key={`${i}-${j}`} className="relative">
                  {/* Empty tile background */}
                  <div className="absolute inset-0 bg-white/5 rounded-[var(--radius-tile)]" />
                  
                  {/* Tile */}
                  <AnimatePresence>
                    {cell !== null && (
                      <GameTile
                        value={cell}
                        isMerging={mergingTiles.has(`${i}-${j}`)}
                        isNew={false}
                        tileBlock={tileBlock}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-4 pb-4">
        <IconButton
          icon={<ArrowLeft size={24} />}
          onClick={() => onNavigate("menu")}
          size="lg"
        />
        
        <div className="flex gap-3">
          <IconButton
            icon={<RotateCcw size={20} />}
            onClick={initializeGrid}
            variant="outline"
          />
          <IconButton
            icon={<Lightbulb size={20} />}
            onClick={() => {}}
            variant="outline"
          />
        </div>
        
        <IconButton
          icon={<Pause size={24} />}
          onClick={() => setIsPaused(true)}
          size="lg"
        />
      </div>
      
      {/* Pause Modal */}
      <NeonModal
        isOpen={isPaused}
        onClose={() => setIsPaused(false)}
        title="PAUSED"
      >
        <div className="space-y-3">
          <NeonButton onClick={() => setIsPaused(false)} className="w-full">
            Resume
          </NeonButton>
          <NeonButton variant="secondary" onClick={initializeGrid} className="w-full">
            Restart
          </NeonButton>
          <NeonButton variant="ghost" onClick={() => onNavigate("menu")} className="w-full">
            Main Menu
          </NeonButton>
        </div>
      </NeonModal>
      
      {/* Win Modal */}
      <NeonModal
        isOpen={showWin}
        onClose={() => setShowWin(false)}
        glowColor="magenta"
        showClose={false}
      >
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6A00] shadow-[0_0_40px_rgba(255,215,0,0.6)]"
          >
            <Trophy size={48} className="text-[#0B0F19]" />
          </motion.div>
          
          <div>
            <h2 className="text-4xl font-bold text-glow-magenta mb-2">VICTORY!</h2>
            <p className="text-[#B8B8B8]">You reached {targetTile}!</p>
            <div className="text-3xl font-bold text-[#00FFFF] mt-4">
              {score.toLocaleString()} pts
            </div>
          </div>
          
          <div className="space-y-2">
            <NeonButton className="w-full flex items-center justify-center gap-2">
              <Share2 size={20} />
              Share
            </NeonButton>
            <NeonButton variant="secondary" onClick={initializeGrid} className="w-full">
              Play Again
            </NeonButton>
            <NeonButton variant="ghost" onClick={() => onNavigate("menu")} className="w-full flex items-center justify-center gap-2">
              <Home size={20} />
              Menu
            </NeonButton>
          </div>
        </div>
      </NeonModal>
      
      {/* Lose Modal */}
      <NeonModal
        isOpen={showLose}
        onClose={() => setShowLose(false)}
        glowColor="orange"
        showClose={false}
      >
        <div className="text-center space-y-6">
          <div className="text-6xl">😔</div>
          
          <div>
            <h2 className="text-4xl font-bold text-[#FF6A00] mb-2">TIME'S UP!</h2>
            <p className="text-[#B8B8B8]">You scored</p>
            <div className="text-3xl font-bold text-[#00FFFF] mt-2">
              {score.toLocaleString()} pts
            </div>
          </div>
          
          <div className="space-y-2">
            <NeonButton onClick={initializeGrid} className="w-full">
              Try Again
            </NeonButton>
            <NeonButton variant="ghost" onClick={() => onNavigate("menu")} className="w-full">
              Main Menu
            </NeonButton>
          </div>
        </div>
      </NeonModal>
    </div>
  );
}
