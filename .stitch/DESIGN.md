# Azeka Consulting — Design System for Stitch Generation

## 1. Brand Identity

- **Company**: Azeka Consulting — Cabinet de conseil en Data Engineering & IA
- **Tagline**: "Ingenierie IA Europe-Afrique"
- **Tone**: Institutional, geometric, strategic — NOT playful startup aesthetic
- **Language**: French (all UI text must be in French)

## 2. Color Palette

### Backgrounds (Dark Mode)
| Token | Hex | Usage |
|-------|-----|-------|
| bg-primary | `#0A1E3F` | Main background (Bleu Nuit Spatial) |
| bg-secondary | `#071428` | Alternate sections |
| bg-tertiary | `#0F2A4F` | Elevated surfaces |
| bg-card | `rgba(255,255,255,0.04)` | Glass card backgrounds |

### Accent Colors
| Token | Hex | Usage |
|-------|-----|-------|
| accent-green | `#39C27D` | CTA buttons, success states, Vert Afrique |
| accent-blue | `#1C5CFF` | Circuits, tech effects, Bleu IA Electrique |
| accent-cyan | `#00D4FF` | Dynamic accents, links, Cyan IA |
| accent-violet | `#8C3DFF` | Northern foliage, secondary accents, Violet IA |
| accent-gold | `#F4C542` | Energy halo, premium highlights |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| text-primary | `#F2F4F7` | Main text (Blanc Institutionnel) |
| text-secondary | `#a8b8cc` | Body text, descriptions |
| text-muted | `#5a7090` | Labels, metadata |

### Signature Gradients
- **Primary**: `linear-gradient(135deg, #1C5CFF, #00D4FF, #8C3DFF)` — headings, badges
- **CTA button**: `linear-gradient(135deg, #00D4FF, #8C3DFF)` — primary buttons
- **Horizontal bar**: `linear-gradient(90deg, #00D4FF, #8C3DFF, #39C27D)` — decorative top borders
- **Full spectrum**: `linear-gradient(90deg, #00D4FF, #8C3DFF, #39C27D, #F4C542)` — footer top border

## 3. Typography

| Element | Font | Weight | Size | Notes |
|---------|------|--------|------|-------|
| Headings (h1-h4) | Montserrat | 700-800 | clamp(1.3rem–4rem) | Uppercase for brand name |
| Body text | Sora | 300-500 | 0.85-1.1rem | Line-height: 1.7 |
| Labels | Montserrat | 600 | 0.78-0.82rem | Uppercase, letter-spacing: 2-3px |
| Code | JetBrains Mono / Fira Code | 400 | 0.85rem | Monospace for code blocks |

**Brand name**: "AZEKA" in Montserrat Bold 800, letter-spacing 3px. "CONSULTING" in Montserrat Light 300, letter-spacing 4px, smaller size.

## 4. Component Patterns

### Glass Card
```css
background: rgba(255, 255, 255, 0.04);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 20px;
backdrop-filter: blur(20px);
/* Top edge gradient line */
border-top: 1px gradient (Cyan → Violet, subtle)
/* Hover: translateY(-4px), blue glow shadow */
```

### Primary Button (CTA)
```css
background: linear-gradient(135deg, #00D4FF, #8C3DFF);
color: #fff;
font-family: Montserrat, sans-serif;
font-weight: 600;
padding: 14px 32px;
border-radius: 20px;
box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
/* Hover: translateY(-2px), enhanced glow */
```

### Secondary Button
```css
background: rgba(0, 212, 255, 0.06);
border: 1.5px solid rgba(0, 212, 255, 0.35);
color: #F2F4F7;
backdrop-filter: blur(12px);
border-radius: 20px;
```

### Section Header
- Label: uppercase, green (#39C27D), with gradient dash before text
- Title: large heading with `gradient-text` on key words
- Subtitle: text-secondary, max-width 600px, centered

### Decorative Signature Bar
- 3px height gradient bar (Cyan → Violet → Green) at top of key elements (cards, footer, article header)

## 5. Layout & Spacing

| Token | Value |
|-------|-------|
| Container max-width | 1200px |
| Section padding | 120px vertical (80px tablet, 64px mobile) |
| Card padding | 32-40px |
| Border-radius sm | 8px |
| Border-radius md | 12px |
| Border-radius lg | 20px |
| Border-radius xl | 28px |

### Grid Patterns
- Services: 2-column grid, 32px gap
- Technologies: auto-fill minmax(140px, 1fr)
- Blog cards: 3-column grid (1 col on mobile)
- Contact: 2-column grid (info + form)

## 6. Design System Notes for Stitch Generation

**IMPORTANT — Include this block in every Stitch prompt:**

```
Visual Style:
- Dark mode with deep navy background (#0A1E3F)
- Glassmorphism cards with subtle white borders (4% opacity) and 20px blur
- Gradient accents: Cyan #00D4FF → Violet #8C3DFF → Green #39C27D
- 3px signature gradient bar at top of major elements
- Fonts: Montserrat (headings, bold), Sora (body, light)
- Professional, institutional, geometric — NOT playful or startup-like
- Generous spacing (120px between sections, 32px card padding)
- Border-radius: 20px for cards, 8px for small elements
- CTA buttons: Cyan→Violet gradient with glow shadow
- Hover effects: subtle translateY(-2-4px) with blue/cyan glow
- All text in French
```

## 7. Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| > 1024px | Desktop (default) |
| 768-1024px | Tablet (single column layouts, reduced padding) |
| < 768px | Mobile (hamburger nav, stacked grids) |
| < 480px | Small mobile (further simplification) |
