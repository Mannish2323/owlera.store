---
name: owlera-existing-site-redesign
description: >-
  Audits the existing OWLERA implementation before applying redesigns, refining visual hierarchy,
  product cards, navigation, mobile layouts, and conversion flow without breaking working features.
  Activate when refactoring, improving UI/UX, redesigning pages, or polishing interactions for OWLERA.
---

# OWLERA Existing Site Redesign & Visual Enhancement

This skill guides safe, high-impact redesign workflows for the live OWLERA storefront. It ensures every visual and interactive enhancement builds upon the existing codebase without breaking backend integrations, cart mechanics, or verified test assertions.

---

## 1. Step 0: Mandatory Pre-Redesign Audit

Before touching a single component or style rule:
1. **Identify the Target Route:** Locate the route under `app/` (e.g. `app/page.tsx`, `app/products/[slug]/page.tsx`, `app/checkout/page.tsx`).
2. **Review Dependencies:** Check what state providers and hooks it consumes (`useCart`, `useWishlist`, Supabase clients).
3. **Inspect Existing CSS Classes:** Check `app/globals.css` for active selector rules and custom utility classes before adding new ones.
4. **Run Pre-flight Checks:** Ensure current baseline tests pass (`node tests/master_acceptance.test.mjs`) so regressions can be immediately attributed.

---

## 2. Redesign Focus Areas & Enhancement Guidelines

### A. Visual Hierarchy & Editorial Elegance
- **Hero & Display Sections:**
  - Lead with high-impact serif titles (`Cormorant Garamond`) and generous whitespace.
  - Pair hero headlines with discreet uppercase tracking eyebrows (e.g. `CURATED AUTUMN COLLECTION`).
  - Introduce gold hairline accents (`border: 1px solid var(--border-color)`) and subtle champagne badges.
- **Collection & Bento Grids:**
  - Create asymmetrical rhythm in collection listings (e.g. 2-column editorial feature card interspersed with standard product cards).
  - Use `4:5` image aspect ratios with clean neutral background fills (`var(--warm-ivory)`).

### B. Product Cards & Grid Dynamics (`components/product-card.tsx`)
- **Hover Micro-Interactions:**
  - Smooth secondary lifestyle image reveal on hover with crossfade (`transition: opacity 0.3s ease`).
  - Subtle zoom effect on the image (`transform: scale(1.02)`), constrained by `overflow: hidden`.
  - Floating wishlist heart icon with tactile feedback and active fill (`fill: #AD8048`).
- **Pricing & Trust Indicators:**
  - Clear Indian Rupee pricing (`₹1,499`) with original strikethrough price if discounted.
  - Discreet stock status ("Only 2 left in stock" in subtle amber/gold) to drive ethical urgency.
  - Quick "Add to Bag" sliding CTA drawer or bottom bar.

### C. Navigation & Header Refinement (`components/header.tsx`, `components/hanging-logo.tsx`)
- **Desktop Navigation:**
  - Centered suspended wordmark pendant with balance chain anchors.
  - Symmetrical flanking category links (`Jewellery`, `Fashion`, `Lifestyle`, `Collections`).
  - Search, Wishlist badge count, and Cart badge count with smooth scale badge animations.
- **Mobile Navigation Ergonomics:**
  - Smooth slide-out navigation drawer with category groupings and direct WhatsApp Concierge link.
  - Sticky bottom action bar on product detail pages for primary conversion ("Add to Bag" + "WhatsApp Inquiry").

### D. Conversion Flow & Checkout Experience
- **Free Shipping Threshold Bar:**
  - Dynamic progress indicator towards Pan-India complimentary shipping (free at ₹999; ₹99 otherwise).
- **Coupon Code Experience:**
  - Seamless inline validation for verified coupons (`OWLFIRST10` for 10% off up to ₹500, `SHINE200` for ₹200 off ₹1,999+).
- **Postal PIN Validation:**
  - Integrated 6-digit Indian PIN check (`lib/pincode-validator.ts`) showing estimated delivery times (e.g., "Delivery in 3–5 business days to Hyderabad").

---

## 3. Redesign Execution Workflow

1. **Component Isolation:** Create focused modular subcomponents under `components/` if refactoring monolithic templates.
2. **Token Compliance:** Use exclusively `var(--...)` custom properties from `app/globals.css`.
3. **No Framework Drift:** Do not install Tailwind v3/v4 or external CSS frameworks that conflict with the existing Vanilla CSS token architecture.
4. **Mobile-First Responsiveness:** Verify 375px (iPhone SE), 390px (iPhone 14/15), 768px (iPad portrait), and 1440px (MacBook/Desktop).

---

## 4. Preservation & Safety Rules

- **NEVER Delete Working APIs:** Do not modify routes under `app/api/` unless explicitly requested.
- **NEVER Break Cart / Wishlist State:** Keep `useCart()` and `useWishlist()` hook signatures intact.
- **NEVER Hardcode URLs:** Always resolve dynamic routes via `/products/${slug}` and `/collections/${slug}`.
- **PRESERVE Route Coverage:** OWLERA has 35 production routes; never remove or rename pages without explicit instruction.
