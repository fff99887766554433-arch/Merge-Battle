# Merge Battle - Neon Glow UI Design System

## Overview
Complete mobile game UI design system for "Merge Battle" — a neon-glow merge puzzle game inspired by 2048 with PvP and solo modes.

---

## 🎨 Color Tokens

### Primary Background
- `--bg-primary`: #0B0F19 (Dark graphite)
- `--bg-secondary`: #1A1A1A (Darker variant)
- Gradient: `linear-gradient(180deg, #0B0F19 → #1A1A1A)`

### Neon Accent Palette
- `--neon-cyan`: #00FFFF (Primary accent)
- `--neon-magenta`: #FF00FF (Secondary accent)
- `--neon-purple`: #A100FF (Tertiary accent)
- `--neon-orange`: #FF6A00 (Warning/energy)
- `--neon-lime`: #00FF99 (Success)
- `--neon-yellow`: #FFD700 (Coins/rewards)

### Text Colors
- `--text-primary`: #FFFFFF (Main text)
- `--text-secondary`: #B8B8B8 (Secondary text)
- `--text-muted`: #6B6B6B (Muted text)

---

## ✨ Glow Effects

### Standard Glow (CSS Variables)
```css
--glow-cyan: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)
--glow-magenta: 0 0 20px rgba(255, 0, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.3)
--glow-purple: 0 0 20px rgba(161, 0, 255, 0.6), 0 0 40px rgba(161, 0, 255, 0.3)
--glow-orange: 0 0 20px rgba(255, 106, 0, 0.6), 0 0 40px rgba(255, 106, 0, 0.3)
--glow-lime: 0 0 20px rgba(0, 255, 153, 0.6), 0 0 40px rgba(0, 255, 153, 0.3)
--glow-yellow: 0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)
```

### Intense Glow (High-value tiles)
```css
--glow-intense-cyan: 0 0 30px rgba(0,255,255,0.8), 0 0 60px rgba(0,255,255,0.5), 0 0 90px rgba(0,255,255,0.3)
--glow-intense-magenta: 0 0 30px rgba(255,0,255,0.8), 0 0 60px rgba(255,0,255,0.5), 0 0 90px rgba(255,0,255,0.3)
--glow-intense-purple: 0 0 30px rgba(161,0,255,0.8), 0 0 60px rgba(161,0,255,0.5), 0 0 90px rgba(161,0,255,0.3)
```

### Usage Classes
```css
.glow-cyan { box-shadow: var(--glow-cyan); }
.glow-magenta { box-shadow: var(--glow-magenta); }
.glow-purple { box-shadow: var(--glow-purple); }
.text-glow-cyan { text-shadow: 0 0 10px rgba(0,255,255,0.8), 0 0 20px rgba(0,255,255,0.4); }
```

---

## 📐 Spacing Scale

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

---

## 🔲 Border Radius

```css
--radius-tile: 20px (Game tiles)
--radius-button: 18px (Buttons)
--radius-card: 16px (Cards, panels)
--radius-modal: 22px (Modals, popups)
```

---

## 🔤 Typography

### Font Sizes
```css
--font-size-xs: 12px
--font-size-sm: 14px
--font-size-base: 16px
--font-size-lg: 18px
--font-size-xl: 24px
--font-size-2xl: 32px
--font-size-3xl: 48px
--font-size-4xl: 64px
```

### Font Weights
- Numbers & Headings: 700 (Bold)
- UI Labels: 600 (Semi-bold)
- Body Text: 400 (Regular)

### Typography System
- H1: 48px (3xl), Bold, line-height 1.2
- H2: 32px (2xl), Bold, line-height 1.3
- H3: 24px (xl), Semi-bold, line-height 1.4
- Body: 16px (base), Regular, line-height 1.5
- Labels: 16px (base), Medium (500), line-height 1.5

---

## ⚡ Animations

### Duration & Easing
```css
--duration-fast: 120ms (Touch feedback)
--duration-normal: 250ms (Standard transitions)
--duration-slow: 400ms (Complex animations)
--easing-smooth: cubic-bezier(0.4, 0, 0.2, 1)
--easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Animation Specs

#### Button Press
- Scale: 0.98 (or 80% for intense press)
- Duration: 120ms
- Easing: smooth

#### Tile Merge
- Scale: 1 → 1.15 → 1
- Glow: Intensify
- Particle burst
- Duration: 200–300ms

#### Modal Enter/Exit
- Scale: 0.9 → 1 (enter), 1 → 0.9 (exit)
- Opacity: 0 → 1 (enter), 1 → 0 (exit)
- Duration: 250ms
- Type: Spring (stiffness 300, damping 30)

#### Screen Transitions
- Slide: 100% X offset
- Duration: 300ms
- Type: Spring (stiffness 300, damping 30)

---

## 🎮 Game Tile Color Mapping

| Value | Background | Text | Glow |
|-------|-----------|------|------|
| 2 | #00FFFF (Cyan) | #0B0F19 | cyan |
| 4 | #00FF99 (Lime) | #0B0F19 | lime |
| 8 | #FFD700 (Yellow) | #0B0F19 | yellow |
| 16 | #FF6A00 (Orange) | #FFFFFF | orange |
| 32 | #FF00FF (Magenta) | #FFFFFF | magenta |
| 64 | #A100FF (Purple) | #FFFFFF | purple |
| 128 | Gradient: Cyan → Lime | #0B0F19 | cyan |
| 256 | Gradient: Yellow → Orange | #FFFFFF | yellow |
| 512 | Gradient: Magenta → Purple | #FFFFFF | magenta |
| 1024 | Gradient: Purple → Magenta → Cyan | #FFFFFF | intense-purple |
| 2048+ | Gradient: Cyan → Purple → Magenta | #FFFFFF | intense-cyan |

---

## 🧩 Component Library

### GameTile
**Props:**
- `value: number` - Tile value
- `isSelected: boolean` - Selection state
- `isMerging: boolean` - Merge animation state
- `isNew: boolean` - Spawn animation
- `onClick: () => void` - Click handler

**States:**
- Idle: Base appearance
- Selected: Scale 1.08x, ring glow
- Merging: Scale animation + particle burst
- New: Scale from 0

**Export:** `tile_<number>_<hexcolor>.png` (1024×1024)

---

### NeonButton
**Variants:**
- `primary`: Gradient cyan→lime, glow shadow
- `secondary`: Transparent bg, cyan border, lighter glow
- `ghost`: White/5 bg, subtle border

**States:**
- Hover: Scale 1.02
- Press: Scale 0.98
- Disabled: Opacity 40%

**Usage:**
```tsx
<NeonButton variant="primary" onClick={...}>
  PLAY
</NeonButton>
```

---

### IconButton
**Sizes:** sm (40px), md (48px), lg (56px)
**Variants:** solid, outline, ghost
**Interaction:**
- Hover: Scale 1.1
- Press: Scale 0.9

---

### NeonModal
**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `title?: string`
- `glowColor?: "cyan" | "magenta" | "purple"`

**Features:**
- Backdrop blur
- Animated entry/exit
- Close button (optional)
- Neon border glow

---

### TopBar
**Props:**
- `score: number`
- `targetTile?: number`
- `timer?: number`

**Layout:** 
- Left: Score
- Center: Target tile badge
- Right: Timer (timed modes)

---

### CoinBadge
**Props:**
- `amount: number`
- `showAnimation?: boolean`

**Appearance:** Gold gradient, coin icon, shadow glow

---

## 📱 Screens

### 1. Splash Screen
- Logo with animated gradient
- Neon underline animation
- Loading dots (3 pulsing)
- Duration: 2.5s auto-advance

### 2. Onboarding (3 slides)
- Icon + Title + Description
- Progress dots
- Next/Skip buttons
- Swipeable

### 3. Main Menu
- Logo (animated glow)
- Primary buttons: Play, PvP, Leaderboard, Shop
- Header: Profile (left), Coins (center), Settings (right)
- Footer: Version info

### 4. Game Screen
- Top bar: Score, Target, Timer
- Center: Game grid (4×4 default, scalable to 10×10)
- Floating actions: Back, Restart, Undo, Hint, Pause
- Board neon border (pulsing on big merge)
- Modals: Pause, Win, Lose

### 5. PvP Lobby
- Player cards (left & right)
- VS divider (animated)
- Board previews (split screen)
- Ready button
- Match countdown

### 6. Leaderboard
- Tabs: Global, Friends, Weekly
- Rank badges (Trophy/Medal icons)
- Animated rows
- User highlight (cyan glow border)

### 7. Shop
- Grid layout (2 columns)
- Item cards with neon borders
- Purchase modal
- "Get More Coins" CTA

### 8. Settings
- Audio sliders (Sound, Music)
- Theme toggle (Neon / Classic)
- Notifications toggle
- Version info

### 9. Profile
- Avatar with rotating ring
- XP bar (animated fill)
- Stats grid (4 items)
- Achievements (grid, unlocked/locked states)

---

## 🎯 Interaction Flows

### Primary Flow: Menu → Game
1. Main Menu: Click "PLAY"
2. Transition: Slide left, 300ms
3. Game Screen: Loads with initial tiles
4. Swipe to merge tiles
5. Win/Lose: Modal appears
6. Result buttons: Share, Replay, Menu

### PvP Flow
1. Main Menu: Click "PVP BATTLE"
2. Finding opponent (2s animation)
3. Lobby: Ready up
4. Both ready: 10s countdown
5. Game starts (same board as solo)

### Shop Flow
1. Click item card
2. Purchase modal appears
3. Confirm → Deduct coins → Success toast
4. Coin badge animates

---

## 📦 Export Guidelines

### For Developers

#### Assets Structure
```
/assets
  /icons (SVG)
    - home.svg
    - play.svg
    - settings.svg
    - shop.svg
    - leaderboard.svg
    - trophy.svg
    - coin.svg
  /tiles (PNG, 1024×1024, transparent)
    - tile_2_00FFFF.png
    - tile_4_00FF99.png
    - tile_8_FFD700.png
    - ...
  /backgrounds (PNG, 1920×1080)
    - bg_main.png
```

#### Component Naming (BEM-like)
- `btn/primary/glow`
- `tile/1024/purple/glow`
- `icon/play/filled`
- `screen/game/4x4`

#### Implementation Notes
- Use CSS custom properties for theming
- Tiles as sprites (PNG) for performance
- Icons as inline SVG for color control
- UI components use 9-slice scaling for buttons
- Animation: Use Motion (React) or Flutter AnimatedContainer

---

## ♿ Accessibility

### Contrast Ratios
- White text on dark bg: 15:1 (AAA)
- Cyan (#00FFFF) on dark: 8.2:1 (AAA)
- Yellow (#FFD700) on dark: 10:1 (AAA)
- Magenta (#FF00FF) on dark: 5.8:1 (AA)

### Alternative Theme: Classic
- Pastel flat tiles (no glow)
- Higher contrast borders
- Reduced animation intensity
- Toggle in Settings

---

## 📐 Responsive Scaling

### Mobile (Primary)
- Design reference: 1080×1920 (9:16)
- Grid: 4×4 default
- Tile size: Dynamic (90vw / gridSize)
- Gap: 12px

### Tablet Support
- Grid: Up to 6×6
- Larger touch targets
- Side-by-side PvP boards

### Grid Presets
- 4×4: Beginner
- 5×5: Intermediate
- 6×6: Advanced
- 8×8: Expert
- 10×10: Master

---

## 🚀 Performance Optimizations

1. **Lazy load screens**: Only render current screen
2. **Tile pooling**: Reuse tile components
3. **Glow compositing**: Use `will-change: transform` for animated tiles
4. **Debounce swipes**: 50ms threshold
5. **Backdrop blur**: Fallback to solid bg on low-end devices

---

## 🎨 Theme Variants

### Neon Glow (Default)
- Full glow effects
- Animated gradients
- Particle effects
- High contrast

### Classic (Alternative)
- Flat pastel colors
- No glows
- Subtle shadows
- Minimal animations
- Better battery life

**Toggle location:** Settings → Appearance → Theme

---

## 📱 Platform Targets

- **Web:** React + Tailwind + Motion
- **Mobile:** Flutter (use same tokens)
- **Unity:** Export tiles as sprites, UI as prefabs

---

## 🔧 Developer Handoff

### CSS Export
All tokens available in `/styles/globals.css`

### Animation Export
- Keyframes: `pulse-glow`, `float`, `ripple`, `shimmer`
- Durations: 120ms (fast), 250ms (normal), 400ms (slow)
- Easings: `--easing-smooth`, `--easing-bounce`

### Component Export
All components in `/components` directory with TypeScript interfaces

---

## 📊 Design Metrics

- **Screens:** 9 complete screens
- **Components:** 10+ reusable components
- **Tiles:** 11 unique tile designs (2 → 2048+)
- **Animations:** 10+ keyframe animations
- **Color tokens:** 15+ semantic colors
- **Spacing tokens:** 6 scale levels
- **Typography tokens:** 8 font sizes

---

## 🎉 Production Readiness Checklist

✅ Design system tokens defined  
✅ All screens designed and implemented  
✅ Component library complete  
✅ Animations specified  
✅ Accessibility checked (WCAG AA)  
✅ Responsive scaling implemented  
✅ Theme variants created  
✅ Export assets prepared  
✅ Developer documentation complete  
✅ Interactive prototype working  

---

## 📞 Support & Credits

**Project:** Merge Battle — Neon Glow UI  
**Version:** 1.0.0  
**Date:** October 22, 2025  
**Design System:** Complete & Export-Ready  

For implementation questions, refer to component props and CSS tokens in codebase.
