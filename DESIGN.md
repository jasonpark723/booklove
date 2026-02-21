# BookLove Design System

> **Chosen Prototype:** [`prototype/v2-peach.html`](prototype/v2-peach.html)
> Open this file in a browser to see the live interactive prototype.

---

## Overview

BookLove is a Hinge-inspired app where users swipe through fictional book characters to discover new books. The design targets young adults (16-25) with a warm, romantic aesthetic that feels approachable and fun.

**Design Tone:** Warm Blush - Playful yet romantic, with bouncy animations and gradient accents.

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#F472B6` | Buttons, hearts, active states |
| Primary Warm | `#FB7185` | Gradient endpoints, hover states |
| Primary Light | `#FECDD3` | Tag backgrounds, soft accents |

### Background & Surface
| Name | Hex | Usage |
|------|-----|-------|
| Background | `#FFF5F5` | App background |
| Surface | `#FFFFFF` | Cards, modals, nav |
| Peach | `#FFEDD5` | Secondary accents, gradients |

### Text
| Name | Hex | Usage |
|------|-----|-------|
| Text | `#9D174D` | Primary text, headings |
| Text Muted | `#BE185D` | Secondary text, labels |
| Accent | `#DB2777` | Prompt labels, highlights |

### Semantic
| Name | Hex | Usage |
|------|-----|-------|
| Like | `#10B981` | Like action (if needed) |
| Pass | `#EF4444` | Pass action (if needed) |

---

## Typography

### Font Family
```css
font-family: 'Nunito', sans-serif;
```

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
```

### Font Weights
| Weight | Usage |
|--------|-------|
| 400 | Body text |
| 600 | Secondary headings, labels |
| 700 | Prompts, card text |
| 800 | Primary headings, names, titles |

### Font Sizes
| Element | Size | Weight |
|---------|------|--------|
| Character Name | 30px | 800 |
| Section Header | 26px | 800 |
| Book Title | 24px | 800 |
| Prompt Answer | 18px | 700 |
| Match Title | 36px | 800 |
| Match Subtitle | 17px | 600 |
| Body Text | 16px | 600 |
| Trait Tag | 14px | 700 |
| Labels | 12px | 700 |
| Nav Label | 10px | 700 |

---

## Spacing & Layout

### Border Radius
| Element | Radius |
|---------|--------|
| Cards | 20px |
| Buttons | 30px |
| Tags/Pills | 26px |
| Avatars | 50% (circle) |
| Heart buttons | 50% (circle) |

### Shadows
```css
/* Primary shadow */
box-shadow: 0 6px 24px rgba(244, 114, 182, 0.15);

/* Elevated (hover) */
box-shadow: 0 8px 28px rgba(244, 114, 182, 0.2);

/* Heart button */
box-shadow: 0 8px 24px rgba(244, 114, 182, 0.45);

/* Match images */
box-shadow: 0 16px 40px rgba(244, 114, 182, 0.3);
```

### Container
- Max width: `428px` (mobile-first)
- Padding: `16px` (screen content)
- Bottom padding: `80px` (for nav)

---

## Components

### Character Card
- Full-width image: `500px` height
- Gradient overlay on image bottom
- Heart button: `52px` circle, bottom-right positioned
- Soft shadow, 20px border radius

### Prompt Card
- Background: white
- Padding: `22px`
- Left border: `4px solid #FECDD3`
- Hover: border turns primary pink, slides right 4px
- Heart button: `36px` circle, top-right

### Trait Tags (Pills)
- Background: gradient `#FECDD3` to `#FFEDD5`
- Padding: `10px 18px`
- Border radius: `26px`
- Hover: scale 1.05

### Spice Indicator
- Uses chili emoji: 🌶️
- Active: full color
- Inactive: `grayscale(100%)`, `opacity: 0.2`
- Size: `22px`
- Includes subtle bounce animation on load

### Bottom Navigation
- 5 tabs: Home, Standouts, Likes, Matches, Profile
- Active color: `#F472B6`
- Inactive color: `#BE185D`
- Icon size: `24px`
- Hover: translateY(-3px)

### Chat List Item
- Avatar: `64px` circle with `3px` primary border
- Hover: translateX(8px), enhanced shadow
- "New" badge: gradient primary background

---

## Animations

### Easing
```css
/* Bouncy easing for playful interactions */
cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Match Screen Animations

**Heart Pulse:**
```css
@keyframes heartPulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.2); }
}
animation: heartPulse 0.8s ease-in-out infinite alternate;
```

**Bounce In (title):**
```css
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.5); }
  60% { transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}
```

**Fade Slide Up (content):**
```css
@keyframes fadeSlideUp {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

### Micro-interactions
- Heart buttons: `scale(1.12) rotate(-5deg)` on hover
- Prompt cards: `translateX(4px)` on hover
- Tags: `scale(1.05)` on hover
- Nav items: `translateY(-3px)` on hover
- Chat items: `translateX(8px)` on hover

---

## Icons

Using inline SVGs for flexibility. Key icons:

- **Heart** (like): Filled heart path
- **Home**: House icon
- **Star**: Standouts
- **Heart outline**: Likes tab
- **Chat bubble**: Matches
- **User**: Profile

Stroke width: `2px` for outlined icons

---

## Screens

1. **Swipe/Home** - Scrollable character profile with images, prompts, tags
2. **Match Modal** - Celebration screen with character + book reveal
3. **Matches List** - Chat-style vertical list of matches
4. **Passed (Bootycall)** - Same layout, muted styling for reconsidering

---

## Tailwind CSS Config (Reference)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F472B6',
          warm: '#FB7185',
          light: '#FECDD3',
        },
        background: '#FFF5F5',
        surface: '#FFFFFF',
        peach: '#FFEDD5',
        text: {
          DEFAULT: '#9D174D',
          muted: '#BE185D',
        },
        accent: '#DB2777',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'button': '30px',
        'tag': '26px',
      },
      boxShadow: {
        'card': '0 6px 24px rgba(244, 114, 182, 0.15)',
        'card-hover': '0 8px 28px rgba(244, 114, 182, 0.2)',
        'heart': '0 8px 24px rgba(244, 114, 182, 0.45)',
      },
    },
  },
}
```

---

## File Reference

| File | Description |
|------|-------------|
| `prototype/v2-peach.html` | **Primary design reference** - Open in browser |

---

## Changelog

| Date | Change |
|------|--------|
| 2024-02-20 | Selected v2-peach as primary design direction |
| 2024-02-20 | Created initial prototype variants (Blush, Spark, Noir, Chapter, Glow) |
| 2024-02-20 | Created v2 refinements (Rose, Peach, Blossom, Neutral, Blush Accent) |
