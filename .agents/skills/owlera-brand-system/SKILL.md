---
name: owlera-brand-system
description: >-
  Enforces the quiet luxury brand identity, color tokens, typography, visual hierarchy,
  monoline diamond owl emblem, and Indian lifestyle-marketplace art direction for OWLERA.
  Activate when designing, styling, creating components, or updating UI aesthetics for OWLERA.
---

# OWLERA Brand System & Visual Identity

This skill governs the brand identity, aesthetic standards, and design tokens for **OWLERA — Your Everyday Shine**, a premium Indian quiet-luxury jewellery, fashion accessories, and lifestyle storefront.

---

## 1. Core Brand Pillars & Philosophy

- **Quiet Luxury:** Understated, timeless elegance. Never ostentatious, cluttered, or neon. Every element breathes with generous whitespace and refined balance.
- **Craft & Heritage:** Honoring artisanal craftsmanship, fine jewellery detailing, and modern Indian lifestyle sensibilities.
- **Tactile Refinement:** Subtle gold hairline borders, soft cream and warm ivory surfaces, delicate shadows, and crisp typography.

---

## 2. Approved Color System

Always use the locked CSS custom properties defined in `app/globals.css`. Never introduce hardcoded ad-hoc hex values or generic Tailwind colors (e.g. `bg-blue-600`, `text-indigo-500`).

| Token Name | Hex Value | Semantic Usage |
| :--- | :--- | :--- |
| `--warm-ivory` | `#F8F4EC` | Primary background, clean canvas, modal surfaces |
| `--soft-cream` | `#F1E8DA` | Secondary background, subtle card containers |
| `--warm-cream` | `#F7F3E9` | Body background, editorial banner foundations |
| `--pure-white` | `#FFFFFF` | Product card surfaces, dropdown menus, contrast highlights |
| `--deep-charcoal` | `#1E211E` | Primary headings, body copy, announcement banner, dark CTAs |
| `--secondary-text` | `#77756F` | Metadata, breadcrumbs, captions, subtle microcopy |
| `--bronze-gold` | `#AD8048` | Primary brand accent, button hovers, icons, active borders |
| `--light-champagne`| `#D9C19C` | Subtle hairline rules, decorative dividers, pill tags |
| `--border-color` | `#E5DACE` | Default card borders, input borders, structural dividers |
| `--forest-green` | `#123D2E` / `#1E211E` | Accent jewel tones for luxury badges, eyes of emblem |

---

## 3. Typography Hierarchy

OWLERA pairs an editorial high-contrast serif for headings with a legible, balanced neo-grotesque sans-serif for UI and body text.

- **Headings & Display:** `Cormorant Garamond` (weights: 400 italic, 500, 600, 700)
  - Display Title: `clamp(2rem, 4vw, 3.5rem)`, letter-spacing: `-0.01em`, line-height: `1.15`
  - Section Headings (H2): `clamp(1.5rem, 2.5vw, 2.25rem)`, letter-spacing: `0.02em`, font-weight: `500`
  - Subheadings (H3): `1.25rem`, letter-spacing: `0.03em`, font-weight: `600`
- **Body & UI:** `Inter` (weights: 300, 400, 500, 600)
  - Body Text: `14px / 1.6`, color: `var(--primary-text)`
  - Subtext / Captions: `12px / 1.5`, color: `var(--secondary-text)`
  - Eyebrows & Badges: `11px`, uppercase, `letter-spacing: 0.12em`, font-weight: `600`

---

## 4. Brand Marks & Hallmark Rules

### Monoline Diamond Owl Emblem (`components/owl-emblem.tsx`)
The official trademark emblem of OWLERA integrates a wise owl silhouette into a faceted geometric diamond crest:
- **Geometry:** 100x100 SVG viewbox with 2.5px stroke width.
- **Colors:** Primary gold stroke `#C6A45B`, emerald green inner accents `#123D2E` (or `#1E211E`).
- **Preservation Rule:** Never replace this emblem with an off-the-shelf icon (Lucide owl, FontAwesome, or generic bird). Never distort the aspect ratio or strip the faceted eye geometry.

### Suspended Wordmark Pendant (`components/hanging-logo.tsx`)
- Architectural centerpiece hanging from top ceiling mount pins with fine gold link chains and horizontal balance bar.
- Used in the primary navigation header to provide unforgettable brand differentiation.

---

## 5. Art Direction & Imagery Standards

- **Framing:** High-fashion editorial angles, macro jewellery details showing textures, reflections, and clasp craftsmanship.
- **Aspect Ratio:** `4:5` (portrait) for product cards and collection lookbooks; `16:9` or `21:9` for cinematic hero banners.
- **Lighting:** Warm natural ambient lighting, soft shadows, avoiding sterile pure-white digital cutouts.
- **Indian Lifestyle Context:** Modest, sophisticated everyday wear to festive Indian evening occasions (weddings, gifting, celebrations).

---

## 6. Safety & Brand Integrity Rules

1. **NO Generic Colors:** Do not use Tailwind default palettes (sky, slate, emerald, violet) unless mapped to brand tokens.
2. **NO Loud Gradients:** Avoid 90s rainbow gradients, aggressive neon glows, or harsh drop shadows.
3. **NEVER Replace Brand Assets:** The Owl Emblem, Hanging Logo, and wordmark typography are locked assets.
4. **Preserve Quiet Luxury Tone:** Microcopy must remain polite, refined, and reassuring (e.g., "Complimentary Pan-India Insured Shipping", "Concierge Gifting Assistance").
