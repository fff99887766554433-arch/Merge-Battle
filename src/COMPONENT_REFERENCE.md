# Merge Battle - Component Reference Guide

Quick reference for all components and their usage.

---

## 🎮 Game Components

### GameTile
```tsx
import { GameTile } from "./components/GameTile";

<GameTile
  value={2048}
  isSelected={false}
  isMerging={false}
  isNew={true}
  onClick={() => console.log("Tile clicked")}
/>
```

**Tile Values & Colors:**
| Value | Color |
|-------|-------|
| 2 | Cyan (#00FFFF) |
| 4 | Lime (#00FF99) |
| 8 | Yellow (#FFD700) |
| 16 | Orange (#FF6A00) |
| 32 | Magenta (#FF00FF) |
| 64 | Purple (#A100FF) |
| 128+ | Gradients |

---

### TopBar
```tsx
import { TopBar } from "./components/TopBar";

<TopBar
  score={42300}
  targetTile={2048}
  timer={180}  // Optional, for timed modes
/>
```

---

## 🎨 UI Components

### NeonButton
```tsx
import { NeonButton } from "./components/NeonButton";

// Primary (glowing cyan gradient)
<NeonButton variant="primary" onClick={...}>
  PLAY
</NeonButton>

// Secondary (outlined)
<NeonButton variant="secondary" onClick={...}>
  SETTINGS
</NeonButton>

// Ghost (minimal)
<NeonButton variant="ghost" onClick={...}>
  Cancel
</NeonButton>
```

---

### IconButton
```tsx
import { IconButton } from "./components/IconButton";
import { Settings } from "lucide-react";

<IconButton
  icon={<Settings size={24} />}
  size="md"  // sm | md | lg
  variant="solid"  // solid | outline | ghost
  onClick={...}
/>
```

---

### NeonModal
```tsx
import { NeonModal } from "./components/NeonModal";
import { NeonButton } from "./components/NeonButton";

<NeonModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Game Paused"
  glowColor="cyan"  // cyan | magenta | purple
  showClose={true}
>
  <NeonButton onClick={...}>Resume</NeonButton>
  <NeonButton variant="ghost" onClick={...}>Quit</NeonButton>
</NeonModal>
```

---

### CoinBadge
```tsx
import { CoinBadge } from "./components/CoinBadge";

<CoinBadge
  amount={1500}
  showAnimation={true}  // Plays scale animation
/>
```

---

## 📱 Screen Components

### SplashScreen
```tsx
import { SplashScreen } from "./components/screens/SplashScreen";

<SplashScreen onComplete={() => setScreen("menu")} />
```
Auto-advances after 2.5 seconds.

---

### MainMenu
```tsx
import { MainMenu } from "./components/screens/MainMenu";

<MainMenu
  onNavigate={(screen) => setCurrentScreen(screen)}
  coins={1500}
/>
```

**Navigation options:**
- `"game"` - Start game
- `"pvp"` - PvP lobby
- `"leaderboard"` - Leaderboard
- `"shop"` - Shop
- `"settings"` - Settings
- `"profile"` - Profile

---

### GameScreen
```tsx
import { GameScreen } from "./components/screens/GameScreen";

<GameScreen
  onNavigate={(screen) => setCurrentScreen(screen)}
  gridSize={4}  // 4 | 5 | 6 | 8 | 10
  targetTile={2048}
  timedMode={false}
/>
```

**Features:**
- Swipe to merge tiles
- Auto-detects keyboard arrow keys
- Win/Lose modals
- Pause functionality
- Undo/Restart/Hint buttons

---

### PvPLobby
```tsx
import { PvPLobby } from "./components/screens/PvPLobby";

<PvPLobby onNavigate={(screen) => setCurrentScreen(screen)} />
```

**Flow:**
1. Searching animation (2s)
2. Opponent found
3. Ready up
4. 10s countdown
5. Game starts

---

### Leaderboard
```tsx
import { Leaderboard } from "./components/screens/Leaderboard";

<Leaderboard onNavigate={(screen) => setCurrentScreen(screen)} />
```

**Features:**
- 3 tabs: Global, Friends, Weekly
- Top 3 special badges
- User row highlighted
- Mock data included

---

### Shop
```tsx
import { Shop } from "./components/screens/Shop";

<Shop
  onNavigate={(screen) => setCurrentScreen(screen)}
  coins={1500}
  onCoinsChange={(newAmount) => setCoins(newAmount)}
/>
```

**Item Types:**
- `skin` - Visual themes
- `powerup` - Gameplay boosts
- `bundle` - Combined packs

---

### Settings
```tsx
import { Settings } from "./components/screens/Settings";

<Settings onNavigate={(screen) => setCurrentScreen(screen)} />
```

**Controls:**
- Sound volume slider
- Music volume slider
- Notifications toggle
- Theme toggle (Neon/Classic)

---

### Profile
```tsx
import { Profile } from "./components/screens/Profile";

<Profile onNavigate={(screen) => setCurrentScreen(screen)} />
```

**Features:**
- Player stats
- XP progress bar
- Achievement grid
- Level display

---

### Onboarding
```tsx
import { Onboarding } from "./components/screens/Onboarding";

<Onboarding onComplete={() => setScreen("menu")} />
```

**3 Slides:**
1. Welcome
2. Merge mechanics
3. Compete & Win

---

## 🎨 CSS Utility Classes

### Glow Effects
```css
.glow-cyan           /* Standard cyan glow */
.glow-magenta        /* Standard magenta glow */
.glow-purple         /* Standard purple glow */
.glow-orange         /* Standard orange glow */
.glow-lime           /* Standard lime glow */
.glow-yellow         /* Standard yellow glow */

.glow-intense-cyan   /* Intense cyan (high-value tiles) */
.glow-intense-magenta
.glow-intense-purple

.text-glow-cyan      /* Text shadow glow */
.text-glow-magenta
.text-glow-purple
```

### Usage Example
```tsx
<div className="bg-[#00FFFF] glow-cyan">
  Glowing element
</div>

<h1 className="text-[#00FFFF] text-glow-cyan">
  Glowing Text
</h1>
```

---

## 🎬 Animation Examples

### Motion (Framer Motion)

**Scale on tap:**
```tsx
import { motion } from "motion/react";

<motion.button
  whileTap={{ scale: 0.95 }}
>
  Button
</motion.button>
```

**Entry animation:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

**Continuous pulse:**
```tsx
<motion.div
  animate={{
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
  }}
>
  Pulsing element
</motion.div>
```

---

## 🎯 Common Patterns

### Screen Transition
```tsx
import { motion, AnimatePresence } from "motion/react";

<AnimatePresence mode="wait">
  <motion.div
    key={currentScreen}
    initial={{ x: "100%", opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: "-100%", opacity: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  >
    {/* Screen content */}
  </motion.div>
</AnimatePresence>
```

---

### Gradient Text
```tsx
<h1 className="bg-gradient-to-r from-[#00FFFF] via-[#A100FF] to-[#FF00FF] bg-clip-text text-transparent">
  Neon Text
</h1>
```

---

### Neon Card
```tsx
<div className="
  bg-gradient-to-br from-[#00FFFF]/20 to-[#A100FF]/20
  border-2 border-[#00FFFF]/50
  rounded-2xl p-6
  shadow-[0_0_30px_rgba(0,255,255,0.3)]
">
  Card content
</div>
```

---

### Floating Orb (Background)
```tsx
<motion.div
  animate={{
    x: [0, 100, 0],
    y: [0, -100, 0],
    scale: [1, 1.2, 1],
    opacity: [0.1, 0.2, 0.1],
  }}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute w-64 h-64 rounded-full bg-[#00FFFF] blur-[100px]"
/>
```

---

## 📦 ShadCN Components Used

These are pre-installed and available:

```tsx
import { Switch } from "./components/ui/switch";
import { Slider } from "./components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Label } from "./components/ui/label";
import { Avatar } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import { Card } from "./components/ui/card";
import { Dialog } from "./components/ui/dialog";
```

---

## 🎨 Color Reference (Quick)

```css
/* Backgrounds */
#0B0F19  /* Primary dark */
#1A1A1A  /* Secondary dark */

/* Neon Accents */
#00FFFF  /* Cyan */
#FF00FF  /* Magenta */
#A100FF  /* Purple */
#FF6A00  /* Orange */
#00FF99  /* Lime */
#FFD700  /* Yellow/Gold */

/* Text */
#FFFFFF  /* Primary */
#B8B8B8  /* Secondary */
#6B6B6B  /* Muted */
```

---

## 🔧 Customization Examples

### Custom Grid Size
```tsx
<GameScreen gridSize={6} targetTile={4096} />
```

### Custom Modal Color
```tsx
<NeonModal glowColor="magenta" title="Victory!">
  Content
</NeonModal>
```

### Custom Button Colors
```tsx
<NeonButton
  className="bg-gradient-to-r from-[#FF00FF] to-[#A100FF]"
>
  Custom Gradient
</NeonButton>
```

---

## 🎯 Integration with App.tsx

```tsx
import { useState } from "react";
import { MainMenu } from "./components/screens/MainMenu";
import { GameScreen } from "./components/screens/GameScreen";

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [coins, setCoins] = useState(1500);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] to-[#1A1A1A]">
      {screen === "menu" && (
        <MainMenu onNavigate={setScreen} coins={coins} />
      )}
      {screen === "game" && (
        <GameScreen onNavigate={setScreen} />
      )}
    </div>
  );
}
```

---

## 📱 Icons Available (Lucide React)

Common icons used throughout:
```tsx
import {
  Play, Swords, Trophy, ShoppingBag, Settings, User,
  Home, ArrowLeft, RotateCcw, Lightbulb, Pause,
  Volume2, VolumeX, Music, Bell, Palette,
  Share2, MessageCircle, Target, TrendingUp, Award,
  Star, Coins, Sparkles, Zap, ChevronRight, ChevronLeft,
  Clock, X
} from "lucide-react";
```

---

## 🚀 Quick Start Template

```tsx
import { useState } from "react";
import { NeonButton } from "./components/NeonButton";
import { IconButton } from "./components/IconButton";
import { Settings } from "lucide-react";

function MyScreen() {
  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#00FFFF] text-glow-cyan">
          My Screen
        </h1>
        <IconButton icon={<Settings size={24} />} />
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        <NeonButton variant="primary">
          Primary Action
        </NeonButton>
      </div>
    </div>
  );
}
```

---

## 📚 Additional Resources

- **Full Design System:** `/DESIGN_SYSTEM.md`
- **Styles:** `/styles/globals.css`
- **Components:** `/components/`
- **Screens:** `/components/screens/`

---

**Last Updated:** October 22, 2025  
**Version:** 1.0.0
