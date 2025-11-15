# 🎨 CineMatch Animation Reference Guide

## Quick Animation Index

### Page Load
| Element | Animation | Duration | Delay | Effect |
|---------|-----------|----------|-------|--------|
| App | pageLoad (fade) | 0.6s | 0s | Smooth entry |
| Logo | slide-in-left | 0.8s | 0s | Left to right |
| Logo Icon | bounce + pulse-glow | 2s + 3s | 0s | Bouncing + glowing |
| Theme Button | slide-in-right | 0.8s | 0.1s | Right to left |
| Hero Title Word 1 | slide-in-left | 0.8s | 0.1s | Left entry |
| Hero Title Word 2 | scale-in | 0.8s | 0.3s | Bounce scale |
| Hero Title Word 3 | slide-in-right | 0.8s | 0.5s | Right entry |
| Highlighted Word | gradient-shift | 3s | 0.3s | Continuous |
| Underline | slideInUnderline | 0.8s | 0.3s | Center expand |
| Subtitle | fadeInUp | 0.8s | 0.6s | Fade + up |
| Search Input | scale-in | 0.6s | 0.3s | Grow effect |
| Search Button | scale-in | 0.6s | 0.4s | Grow effect |
| Chips (each) | bounce-in | 0.6s | 0.5-0.9s | Staggered |
| Footer | slideInUp | 0.8s | 0.6s | Up entry |
| Footer Line | slideInLeft | 1s | 0.8s | Left to right |

---

### Interactive States

#### Logo
```css
Hover: scale(1.08) + drop-shadow glow
```

#### Theme Button
```css
Hover: scale(1.15) rotate(25deg) + glow
Active: scale(0.95)
Shine: Gradient sweep left to right
```

#### Search Input
```css
Focus: 
  - Border: primary color
  - Background: more opaque
  - Box-shadow: 4px glow + inset glow
  - Transform: translateY(-2px)
  - Shine: Gradient sweep
```

#### Clear Button
```css
Hover: scale(1.2) rotate(90deg) + error color + glow
```

#### Primary Button
```css
Hover:
  - Ripple: Circular expansion (0-300px)
  - Transform: translateY(-3px) scale(1.02)
  - Shadow: Enhanced to 30px
  - Gradient: Position shift
Active: scale(0.98)
Loading: Icon spin + button pulse-glow
```

#### Chips
```css
Hover: translateY(-3px) scale(1.05) + glow
Active: gradient-shift animation + scale(1.08)
Shine: Gradient sweep
```

#### Result Cards
```css
Hover:
  - Transform: translateY(-6px) scale(1.02)
  - Border: primary color
  - Shadow: 40px blur
  - Overlay: Gradient fade in
  - Light: Radial effect
```

#### Ring Progress
```css
Entrance: rotate-in + glow
Continuous: pulse-glow animation
```

#### Toast
```css
Show: slideInUp animation
Hide: slideOutDown animation
```

---

## Keyframe Animations Reference

### fadeInUp
```css
from: opacity 0, translateY(40px)
to: opacity 1, translateY(0)
```

### slide-in-left
```css
from: opacity 0, translateX(-60px)
to: opacity 1, translateX(0)
```

### slide-in-right
```css
from: opacity 0, translateX(60px)
to: opacity 1, translateX(0)
```

### scale-in
```css
from: opacity 0, scale(0.95)
to: opacity 1, scale(1)
```

### rotate-in
```css
from: opacity 0, rotate(-10deg) scale(0.9)
to: opacity 1, rotate(0) scale(1)
```

### bounce-in
```css
0%: opacity 0, translateY(30px) scale(0.9)
50%: opacity 1, translateY(-5px) scale(1.02)
100%: opacity 1, translateY(0) scale(1)
```

### pulse-glow
```css
0%, 100%: box-shadow 0 0 20px rgba(99, 102, 241, 0.3)
50%: box-shadow 0 0 40px rgba(99, 102, 241, 0.6)
```

### gradient-shift
```css
0%: background-position 0% 50%
50%: background-position 100% 50%
100%: background-position 0% 50%
```

### shimmer
```css
0%: background-position 200% 0
100%: background-position -200% 0
```

### spin
```css
from: rotate(0deg)
to: rotate(360deg)
```

### bounce
```css
0%, 100%: translateY(0) rotateZ(0deg)
25%: translateY(-6px) rotateZ(5deg)
50%: translateY(0) rotateZ(0deg)
75%: translateY(-3px) rotateZ(-5deg)
```

### slideInUnderline
```css
from: width 0, left 50%
to: width 100%, left 0
```

### slideInUp
```css
from: opacity 0, translateY(100px) scale(0.8)
to: opacity 1, translateY(0) scale(1)
```

### slideOutDown
```css
from: opacity 1, translateY(0) scale(1)
to: opacity 0, translateY(100px) scale(0.8)
```

### pageLoad
```css
from: opacity 0
to: opacity 1
```

---

## Timing Functions

| Function | Use Case | Easing |
|----------|----------|--------|
| ease-out | Entrances | Starts fast, ends slow |
| ease-in | Exits | Starts slow, ends fast |
| cubic-bezier(0.34, 1.56, 0.64, 1) | Bounce effects | Overshoot for bounce |
| linear | Continuous | Constant speed |
| cubic-bezier(0.4, 0, 0.2, 1) | Standard | Smooth, natural |

---

## Stagger Delay Patterns

### Chips (5 elements)
```
Chip 1: 0.5s
Chip 2: 0.6s
Chip 3: 0.7s
Chip 4: 0.8s
Chip 5: 0.9s
Increment: 0.1s
```

### Result Cards (6+ elements)
```
Card 1: 0.1s
Card 2: 0.15s
Card 3: 0.2s
Card 4: 0.25s
Card 5: 0.3s
Card 6: 0.35s
Card 7+: 0.4s
Increment: 0.05s
```

### Hero Title Words
```
Word 1: 0.1s
Word 2: 0.3s
Word 3: 0.5s
Increment: 0.2s
```

---

## Color Animations

### Gradient Shift
- **Primary**: #6366f1 → #4f46e5
- **Secondary**: #ec4899
- **Accent**: #f59e0b
- **Animation**: 3s continuous loop

### Glow Colors
- **Primary Glow**: rgba(99, 102, 241, 0.3-0.6)
- **Success Glow**: rgba(16, 185, 129, 0.1-0.4)
- **Error Glow**: rgba(239, 68, 68, 0.1-0.4)

---

## Performance Optimizations

### GPU-Accelerated Properties
- ✅ transform (translate, scale, rotate)
- ✅ opacity
- ✅ filter (blur, drop-shadow)
- ✅ backdrop-filter

### Avoided (CPU-intensive)
- ❌ width/height changes
- ❌ top/left/right/bottom changes
- ❌ box-shadow (except glow effects)
- ❌ color changes (use opacity instead)

---

## Browser Compatibility

### Full Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Support
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

### Fallbacks
- Backdrop filter: Solid background fallback
- Gradients: Solid color fallback
- Transforms: Static positioning fallback

---

## Animation Triggers

### On Page Load
- Logo, theme button, hero title, search input, chips, footer

### On Hover
- Logo, theme button, search input, clear button, primary button, chips, result cards, toast

### On Focus
- Search input (glow effect)

### On Active/Click
- Primary button (ripple + scale)
- Chips (gradient animation)
- Result cards (hover state)

### On Search
- Results cards (staggered bounce-in)
- Skeleton loaders (shimmer animation)

### On Toast Show/Hide
- Slide in from bottom
- Slide out to bottom

---

## Customization Guide

### Change Animation Speed
```css
/* Slow down all animations by 20% */
:root {
  --transition: all 0.36s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Change Primary Color
```css
:root {
  --primary: #your-color;
  --primary-dark: #darker-shade;
  --primary-light: #lighter-shade;
}
```

### Disable Animations
```css
/* Add to CSS */
* {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
```

### Reduce Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Testing Animations

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Rendering tab
3. Check "Paint flashing" to see repaints
4. Check "Rendering stats" for FPS

### Performance Metrics
- **Target**: 60fps (16.67ms per frame)
- **Acceptable**: 50fps+ (20ms per frame)
- **Minimum**: 30fps (33ms per frame)

### Animation Debugging
```javascript
// In console to slow down animations
document.documentElement.style.animationPlayState = 'paused';
// Or
document.documentElement.style.animationDuration = '5s';
```

---

## Best Practices Applied

✅ **Stagger delays** for cascading effects
✅ **GPU acceleration** for performance
✅ **Semantic timing** (entrance < 0.8s, hover < 0.3s)
✅ **Consistent easing** across similar animations
✅ **Color-coded feedback** (success/error/info)
✅ **Micro-interactions** for engagement
✅ **Accessibility** (no motion overload)
✅ **Mobile optimization** (touch-friendly)

---

## Quick Copy-Paste Animations

### Add Bounce-In to Element
```css
.your-element {
  animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Add Glow Effect
```css
.your-element {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  animation: pulse-glow 2s infinite;
}
```

### Add Shine Effect
```css
.your-element {
  position: relative;
  overflow: hidden;
}

.your-element::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.your-element:hover::before {
  left: 100%;
}
```

---

**Last Updated**: November 15, 2025
**Version**: 1.0
**Status**: Complete ✅
