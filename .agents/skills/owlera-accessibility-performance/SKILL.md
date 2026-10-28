---
name: owlera-accessibility-performance
description: >-
  Audits and enforces accessibility (WCAG 2.1/2.2 AA), keyboard navigation, semantic HTML,
  color contrast, image optimization, Core Web Vitals, and reduced-motion preferences for OWLERA.
  Activate when auditing accessibility, optimizing performance, tuning Core Web Vitals, or testing UX responsiveness.
---

# OWLERA Accessibility & Performance Engineering

This skill defines the compliance standards, verification checklists, and performance benchmarks for the **OWLERA** luxury e-commerce web application.

---

## 1. Accessibility Standards (WCAG 2.1 / 2.2 AA)

### A. Semantic Structure & Landmark Roles
- **Document Structure:**
  - Exactly one `<h1>` per page.
  - Proper heading hierarchy (`h1` → `h2` → `h3`), never skipping levels for styling.
  - Semantic HTML5 landmarks: `<header role="banner">`, `<nav role="navigation">`, `<main id="main-content">`, `<footer role="contentinfo">`.
- **Skip Links:**
  - Provide a visible-on-focus skip link at the very top of `app/layout.tsx`:
    `<a href="#main-content" class="skip-to-content">Skip to main content</a>`.

### B. Keyboard Accessibility & Focus Trapping
- **Focus Indicators:**
  - Never suppress outline styles with `outline: none` without providing an accessible alternative.
  - Use `:focus-visible` with a distinct 2px gold focus ring: `outline: 2px solid var(--bronze-gold); outline-offset: 2px;`.
- **Modals, Drawers & Dropdowns:**
  - Cart drawer, mobile menu, search modal, and dialogs must trap focus while open.
  - Pressing `Escape` must immediately close any active overlay and return focus to the trigger element.
- **Interactive Elements:**
  - All clickable controls must be native `<button>` or `<a>` elements, or have `role="button"`, `tabIndex={0}`, and handle both `Enter` and `Space` keys.

### C. Color Contrast & Readability
- **Minimum Contrast Ratios (WCAG AA):**
  - Normal text (< 18pt or < 14pt bold): minimum **4.5:1** contrast ratio against its background.
  - Large text (≥ 18pt or ≥ 14pt bold): minimum **3.0:1** contrast ratio.
  - UI components and graphical objects: minimum **3.0:1** contrast ratio against adjacent colors.
- **OWLERA Palette Rules:**
  - Primary text `--deep-charcoal` (`#1E211E`) on `--warm-ivory` (`#F8F4EC`) provides **15.2:1** (Passes AAA).
  - Secondary text `--secondary-text` (`#77756F`) on `--warm-ivory` provides **4.6:1** (Passes AA).
  - Bronze gold `--bronze-gold` (`#AD8048`) must NOT be used for small body text on light backgrounds (3.4:1); reserve it for icons, borders, large accents, or darkened hover states (`#8F6A30` which hits **4.5:1**).

### D. Reduced-Motion Preferences
- **Motion Safety:**
  - Respect `@media (prefers-reduced-motion: reduce)`.
  - Disable continuous animations, marquee auto-scrolls, and the suspended logo pendulum sway:
    ```css
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
    ```

---

## 2. Performance & Core Web Vitals Optimization

### A. Core Web Vitals Targets
| Metric | Full Name | Target Benchmark |
| :--- | :--- | :--- |
| **LCP** | Largest Contentful Paint | **< 2.5 seconds** |
| **INP** | Interaction to Next Paint | **< 200 milliseconds** |
| **CLS** | Cumulative Layout Shift | **< 0.1** |
| **FCP** | First Contentful Paint | **< 1.8 seconds** |

### B. Image Optimization Guidelines
- **Next.js `<Image>` Component:**
  - Always provide explicit `width` and `height`, or use `fill` with `sizes` to reserve layout space and prevent CLS.
  - Above-the-fold hero images: add `priority` prop to preload LCP image candidates.
  - Below-the-fold product card images: use `loading="lazy"` with responsive `sizes` attribute (e.g. `(max-width: 768px) 50vw, 25vw`).
  - Serve modern WebP and AVIF formats via Next.js image optimization.
- **Alt Text:**
  - Every product image must have descriptive alt text describing the metal, stone, style, and framing (e.g., `alt="Celeste 18K Gold Plated Hoop Earrings worn with evening attire"`).
  - Decorative icons or ornaments must have `aria-hidden="true"`.

### C. Font & Asset Delivery
- **Font Display Strategy:**
  - Google Fonts (`Cormorant Garamond`, `Inter`) loaded with `display=swap`.
  - Include `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`.
- **Bundle Hygiene:**
  - Avoid heavy 3D rendering or physics engines in initial client bundle; dynamically import interactive canvas widgets via `next/dynamic` with `ssr: false`.

---

## 3. Verification Checklist

1. [ ] **Lighthouse Audit:** Run Chrome DevTools Lighthouse audit for Mobile & Desktop (Performance ≥ 90, Accessibility = 100).
2. [ ] **Keyboard Tab-Through:** Navigate through entire site (Header → Hero → Products → Cart → Footer) using only `Tab`, `Shift+Tab`, `Enter`, and `Space`.
3. [ ] **Screen Reader Test:** Verify VoiceOver (macOS/iOS) or NVDA (Windows) announces cart badge updates, dialog titles, and product prices clearly.
4. [ ] **Color Contrast Verification:** Check all buttons and text with WCAG contrast checker.
5. [ ] **Zero Layout Shift:** Ensure banners, navigation bar, and image cards have fixed aspect ratios or reserved min-heights.
