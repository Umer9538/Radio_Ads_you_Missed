# Radio Ads You Missed - Design System

## Color Palette

### Primary Colors
- **Background Dark**: `#0a0f1e` - Main background
- **Background Card**: `#1a1f2e` - Card backgrounds
- **Background Lighter**: `#2a2f3e` - Hover states

### Accent Colors
- **Cyan**: `#00d4ff` - Primary accent (listeners)
- **Green**: `#00ff88` - Success, advertisers
- **Pink**: `#ff1b6b` - Call to action, stations
- **Orange**: `#ff6b00` - Warning, call to action
- **Purple**: `#8b5cf6` - Agencies, special features

### Text Colors
- **Text Primary**: `#ffffff` - Headings, important text
- **Text Secondary**: `#94a3b8` - Body text, descriptions
- **Text Muted**: `#64748b` - Meta information

### Gradients
- **CTA Gradient**: `linear-gradient(135deg, #ff1b6b 0%, #ff6b00 100%)`
- **Success Gradient**: `linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)`
- **Hero Title**: `linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)`

## Typography

### Font Family
- **Primary**: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Monospace**: 'JetBrains Mono', monospace (for code/meta)

### Font Sizes
- **Hero**: 64px / 4rem (font-bold)
- **H1**: 48px / 3rem (font-bold)
- **H2**: 36px / 2.25rem (font-bold)
- **H3**: 24px / 1.5rem (font-semibold)
- **Body Large**: 18px / 1.125rem
- **Body**: 16px / 1rem
- **Small**: 14px / 0.875rem
- **Tiny**: 12px / 0.75rem

## Spacing

### Scale (Tailwind based)
- **xs**: 4px (1)
- **sm**: 8px (2)
- **md**: 16px (4)
- **lg**: 24px (6)
- **xl**: 32px (8)
- **2xl**: 48px (12)
- **3xl**: 64px (16)

## Border Radius

- **Small**: 8px (rounded-lg)
- **Medium**: 12px (rounded-xl)
- **Large**: 16px (rounded-2xl)
- **Full**: 9999px (rounded-full)

## Components

### Buttons

#### Primary CTA (Gradient)
- Background: Pink-Orange gradient
- Text: White, bold
- Padding: 16px 32px
- Border Radius: Full
- Hover: Scale 1.05

#### Secondary (Cyan Border)
- Background: Transparent
- Border: 2px solid cyan
- Text: Cyan, semi-bold
- Padding: 16px 32px
- Border Radius: Full
- Hover: Background cyan/10

#### Success (Green)
- Background: Green
- Text: Dark, bold
- Padding: 16px 32px
- Border Radius: Full
- Hover: Scale 1.05

### Cards

#### Standard Card
- Background: `#1a1f2e`
- Border: 1px solid `#2a2f3e`
- Border Radius: 16px
- Padding: 24px
- Hover: Border color to accent color

#### Feature Card
- Background: `#1a1f2e`
- Border: 2px solid accent color
- Border Radius: 20px
- Padding: 32px
- Icon: Colored circle at top

### Badges

#### Voucher Badge
- Background: Green with opacity
- Text: Green
- Border: 1px solid green
- Border Radius: Full
- Padding: 4px 12px
- Font Size: 12px, semi-bold

#### Category Badge
- Background: Dark
- Text: White
- Border Radius: 6px
- Padding: 4px 8px
- Font Size: 12px

#### Filter Pill
- Background: Dark
- Text: White
- Border: 1px solid `#2a2f3e`
- Border Radius: Full
- Padding: 8px 16px
- Hover: Border cyan

### Ad Card Layout

```
┌─────────────────────────────────────────────────────┐
│  [Play] [Waveform]  Title                    ❤️     │
│                     Category  [Voucher Badge]       │
│                     Description                     │
│                     📻 Station  🕐 Time  📍 Location│
│                                      [View Details] │
└─────────────────────────────────────────────────────┘
```

### Navigation

- Height: 64px
- Background: `#0a0f1e` with blur
- Border Bottom: 1px solid `#1a1f2e`
- Logo: Icon + Text (white + cyan)
- Links: Gray, hover white
- Buttons: Sign In (cyan border), Get Started (cyan solid)

### Search Bar

- Background: `#1a1f2e`
- Border: 1px solid `#2a2f3e`
- Border Radius: 12px
- Padding: 16px 24px
- Icon: Cyan
- Text: White
- Placeholder: Gray
- Focus: Border cyan

## Icons

- **Size Standard**: 20px
- **Size Large**: 24px
- **Size Hero**: 48px
- **Style**: Outline/stroke
- **Library**: Feather Icons / React Icons

## Animations

### Hover Effects
- Scale: 1.02 - 1.05
- Duration: 200ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### Page Transitions
- Fade In: opacity 0 → 1
- Slide Up: translateY(20px) → 0
- Duration: 300ms
- Stagger: 100ms between elements

### Waveform Animation
- Bar heights: Random between 20-80%
- Animation: Smooth sine wave
- Colors: Cyan gradient
- Duration: 2s loop

## Layouts

### Max Width
- Content: 1200px (xl)
- Full Width Sections: 100%

### Grid Systems
- Features: 4 columns on desktop, 2 on tablet, 1 on mobile
- Ad Results: 1 column with full-width cards
- Stats: 4 columns

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Wide: > 1280px

## Shadows

- **Small**: 0 1px 3px rgba(0, 0, 0, 0.3)
- **Medium**: 0 4px 6px rgba(0, 0, 0, 0.3)
- **Large**: 0 10px 15px rgba(0, 0, 0, 0.4)
- **Colored**: 0 0 20px rgba(accent-color, 0.3)

## States

### Hover
- Buttons: Scale 1.05, brightness increase
- Cards: Border color change to accent
- Links: Color change to accent

### Active/Focus
- Buttons: Scale 0.95
- Inputs: Border color to accent, glow effect

### Disabled
- Opacity: 0.5
- Cursor: not-allowed
- No hover effects
