# Space-Themed Singularity Tracker Design Guidelines

## Design Approach
**Cyberpunk Dashboard** - Drawing from Blade Runner interfaces, Cyberpunk 2077 UI, and modern tech dashboards (Vercel, Linear) while maintaining data clarity and futuristic aesthetics in both light and dark modes.

## Typography System
- **Headers**: Orbitron (700 weight) - Sizes: text-4xl, text-3xl, text-2xl, text-xl
- **Data/Metrics**: JetBrains Mono (500, 700) - Sizes: text-lg, text-base, text-sm
- **Body/UI**: Inter (400, 500, 600) - Sizes: text-base, text-sm, text-xs
- **Micro-labels**: Inter (500) - Size: text-xs, uppercase tracking-wider

## Layout & Spacing System
**Core spacing units**: 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6 to p-8
- Section gaps: gap-6 to gap-8
- Card spacing: space-y-6
- Grid gaps: gap-4 for dense data, gap-6 for features

**Layout Structure**:
- Sidebar navigation: w-64 fixed left
- Main content: Full viewport height with overflow scroll
- Dashboard grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Chart containers: Minimum h-80, responsive to content

## Component Library

### Navigation & Structure
**Sidebar Navigation** (w-64, fixed):
- Logo/branding at top (h-16)
- Primary nav items with icons (h-12 each)
- Status indicators (live counters, sync status)
- User profile at bottom
- Subtle scan-line animation overlay (2px horizontal lines, opacity-5, slow animation)

**Top Bar** (h-16, sticky):
- Theme toggle (dark/light mode switch)
- Real-time status badges
- Notification center
- Search bar with icon
- Quick actions menu

### Dashboard Components

**Countdown Timer Card**:
- Large numerical display (text-6xl JetBrains Mono)
- Unit labels below numbers (text-xs uppercase)
- Progress ring visualization around timer
- Card size: col-span-1 lg:col-span-2, aspect-video
- Glitch effect on numbers (subtle CSS animation)

**Chart Containers** (h-96):
- Title bar with time range selector
- Legend with interactive toggles
- Grid background (subtle dotted pattern)
- Data point tooltips on hover
- Export/fullscreen icons top-right

**News Feed** (col-span-1):
- Scrollable container (max-h-screen)
- Article cards with:
  - Timestamp (text-xs, JetBrains Mono)
  - Headline (text-base Inter, font-semibold)
  - Source badge
  - Thumbnail image (aspect-video, 60px height)
- Dividers between items (1px, opacity-10)

**ML Prediction Cards**:
- Confidence meter (horizontal bar, h-2)
- Prediction text (text-lg JetBrains Mono)
- Accuracy percentage (text-sm, opacity-70)
- Last updated timestamp
- Animated pulse on new predictions

### Data Display Elements

**Metric Tiles** (grid layout):
- Primary value (text-3xl JetBrains Mono, font-bold)
- Label (text-sm Inter, uppercase)
- Trend indicator (arrow + percentage)
- Sparkline chart (h-12, width full)
- Size: p-6, min-h-32

**Status Indicators**:
- Pill badges (px-3 py-1, rounded-full, text-xs uppercase)
- Icon + text combinations
- Pulsing dot for "live" status
- Hex-grid pattern backgrounds on active states

**Tables/Lists**:
- Monospaced data columns (JetBrains Mono)
- Striped rows (opacity-5 alternating)
- Fixed header on scroll
- Sortable column headers
- Row hover: subtle backdrop blur + border highlight

### Interactive Elements

**Buttons**:
- Primary: px-6 py-3, rounded-lg, font-semibold
- Secondary: px-4 py-2, rounded-md, border-2
- Icon buttons: w-10 h-10, rounded-md
- Backdrop blur on glass-morphism buttons: backdrop-blur-md
- Scan-line animation on primary CTAs

**Form Inputs**:
- Text fields: h-12, px-4, rounded-lg, border-2
- Focus state: border width increase + glow effect
- Monospace for numerical/code inputs (JetBrains Mono)
- Labels: text-sm, font-medium, mb-2

**Toggles/Switches**:
- Theme toggle: Moon/sun icons, w-12 h-6
- Data toggles: Segmented control style
- Animated transitions (duration-300)

## Dual Theme Guidelines

**Light Mode Cyberpunk Aesthetic**:
- High contrast typography (near-black text)
- Frosted glass cards (backdrop-blur-lg, opacity-90)
- Holographic gradient borders (iridescent sheens)
- Chrome/metallic accents on interactive elements
- Subtle grid patterns in backgrounds
- Sharp shadows (shadow-lg, shadow-xl)

**Dark Mode**:
- Deep space backgrounds
- Neon glow effects on active elements
- Scan-line overlays (moving horizontal lines)
- CRT screen curvature on large displays (subtle)
- Light text with strong contrast

**Consistent Across Both**:
- Angular geometric shapes (hexagons, octagons)
- Glitch effects on transitions (minimal, tasteful)
- Monospace numbers and data
- Sharp, technical UI patterns
- Grid-based underlays

## Images

**Hero Section** (if landing page exists):
- Large space panorama: Nebula, galaxy, or singularity visualization
- Dimensions: Full viewport width, h-screen or h-96
- Overlay: Gradient fade to background (50% opacity)
- CTA buttons: backdrop-blur-xl with semi-transparent backgrounds
- Placement: Above dashboard content

**Dashboard Thumbnails**:
- News feed images: aspect-video, 60x34px
- Chart backgrounds: Subtle starfield patterns (tiled, opacity-5)
- Empty states: Isometric tech illustrations

**Icon System**:
- Use Heroicons for standard UI
- Custom geometric icons for space/tech concepts
- Consistent 24x24px sizing
- Stroke-width: 2px

## Special Effects

**Animations** (use sparingly):
- Scan-line sweep on card load (once, 1s duration)
- Number increment on metric updates
- Pulse on live data points
- Smooth chart transitions (ease-in-out, 500ms)

**Micro-interactions**:
- Button hover: Scale 1.02 + glow intensify
- Card hover: Lift (translateY -2px) + border glow
- Toggle switches: Smooth slide with spring animation

## Layout Patterns

**Dashboard Grid**:
```
[Timer Card - 2 cols wide] [News Feed]
[Chart 1] [Chart 2] [News Feed continues]
[Metric] [Metric] [Metric]
[Prediction Cards - 3 cols wide]
```

**Responsive Breakpoints**:
- Mobile: Single column, sidebar collapses to bottom nav
- Tablet: 2-column grid, sidebar drawer
- Desktop: Full 3-column grid with fixed sidebar

This comprehensive system maintains cyberpunk tech aesthetics while ensuring data clarity and professional dashboard functionality across both light and dark themes.