# Design System — Kenya Emergency Response

Single source of truth for a cohesive, premium frontend. All pages, components, and interactions should use these tokens and patterns.

---

## 1. Design system overview

- **Tokens:** `src/theme/tokens.js` — typography, radius, spacing, colors, surfaces, buttons, shadows, motion, z-index.
- **Motion:** `src/theme/motion.js` — page transition, reveal, stagger, tap/hover (Framer Motion & GSAP-friendly).
- **Tailwind:** `tailwind.config.js` extends theme from tokens (colors, fontFamily, fontSize, borderRadius, boxShadow, transitionDuration, transitionTimingFunction, zIndex).
- **Global CSS:** `src/styles/index.css` — CSS variables, typography utilities (`.text-hero`, `.text-h1`–`.text-h4`, `.text-body`, `.text-body-sm`, `.text-caption`, `.text-btn`, `.text-label`), surface classes (`.surface-card`, `.surface-panel`, `.surface-subtle`), `.ers-input`, `.page-title`, `.page-subtitle`.

---

## 2. Typography

- **Display/headings:** Sora (`font-display`) — hero, h1–h4.
- **Body/UI:** Plus Jakarta Sans (`font-sans`) — body, labels, buttons, captions.
- **Scale:** hero, display, h1 (1.75rem), h2 (1.5rem), h3 (1.25rem), h4 (1.125rem), body-lg, body, body-sm, caption, btn.
- **Usage:** Prefer utility classes `.text-h1`, `.text-body-sm`, etc. over raw `text-sm`/`text-lg` for consistency.

---

## 3. Color & surfaces

- **Backgrounds:** `ers-bg` (page), `ers-surface`, `ers-elevated`, `ers-subtle`.
- **Text:** `ers-ink`, `ers-inkSecondary`, `ers-inkTertiary`.
- **Semantic:** `emergency` (red), `tracking` (teal), `success` (green), `warning` (amber), `critical` (red).
- **Surfaces:** `.surface-card`, `.surface-card-hover`, `.surface-panel`, `.surface-subtle`; cards use `rounded-xl` and design-system shadows.

---

## 4. Layout

- **Page container:** `max-w-6xl mx-auto px-4 sm:px-6` (py-6 sm:py-8 for main content).
- **PageLayout:** Sticky header with `.page-title` / `.page-subtitle`, main with `gap-6`.
- **Section spacing:** Use `space-y-6` or `gap-6` between sections; large sections use `py-20 sm:py-24` on landing.

---

## 5. Motion

- **Page transition:** From `theme/motion.js` — opacity + y, duration 0.25, ease `[0.25, 0.46, 0.45, 0.94]`.
- **Reveal/stagger:** Use `revealTransition`, `staggerContainer`, `staggerItem` for lists and sections.
- **Buttons/cards:** Restrained `whileTap`/`whileHover`; duration 0.15 for micro-interactions.
- **3D:** Hero entrance via GSAP (position/scale); subtle float/rotation in `useFrame` only where it adds value.

---

## 6. Z-index

- `z-dropdown` (10), `z-sticky` (20), `z-overlay` (30), `z-modal` (40), `z-toast` (50). Header uses `z-sticky`; mobile overlay `z-overlay`, drawer `z-modal`.

---

## 7. Components

- **Button:** Variants primary, secondary, outline, ghost, danger (emergency-700), amber, teal; sizes md/sm; `text-btn`, `rounded-lg`/`rounded-md`.
- **Card:** Use `surface-card` or `surface-card-hover` (via `<Card>` when applicable).
- **Input:** `.ers-input`, `.ers-input-touch` for min-height.
- **EmptyState:** Icon + title (`.text-h3`) + description (`.text-body-sm`) + action.
- **SectionHeader:** Eyebrow (caption) + title (h2) for dashboard/feature sections.

---

## 8. Map & data

- Map containers: `rounded-xl`, `border-ers-subtle`, design-system shadows.
- Leaflet popups: `rounded-lg`, `border-ers-subtle`, `text-ers-ink`, `shadow-ers-md`.
- Legends and badges: Use `.text-caption`, status/priority colors from design system (emergency, teal, amber, success).
- Links in data views: `text-teal-600 hover:text-teal-700` (tracking) instead of ad-hoc cyan.

---

## 9. 3D and motion unified

- **Motion:** One language in `theme/motion.js`: `pageTransition` (Framer) used in App and PageLayout; `revealTransition`, `staggerContainer`, `staggerItem`, `tapScale`, `hoverTransition` for sections and buttons. Durations 0.15 / 0.25 / 0.35 from tokens.
- **3D:** Hero and section 3D use the same `assets/3d` tokens (colors3d, materials). Hero entrance via GSAP (position + scale); subtle float/rotation in `useFrame` only. No extra decorative 3D; command center, feature pin, and tracking scene are the only 3D areas.

---

## 10. Pages most heavily refactored

- **AdminDashboard:** Section titles (text-h3/h4), links (cyan → teal), alert/activity badge (amber-500/20 → amber-100/amber-600), surface-card duplicate border removed, map section z and title.
- **Alerts:** input-field → ers-input, link and icon to design system colors.
- **Activity:** input-field → ers-input.
- **ResponderDashboard:** Cyan stat/icon → teal (tracking).
- **IncidentDetail:** MapPin icon cyan → teal.
- **Header:** z-index to z-sticky, z-overlay, z-modal.
- **PageLayout:** Motion from theme; header z-sticky.
- **Button:** danger/amber/teal from design system.
- **EmptyState:** Motion from theme revealTransition.

---

## 11. Overall coherence

- One typographic scale (Sora + Plus Jakarta Sans) applied via utilities and Tailwind.
- One palette: ers-* backgrounds/text, emergency, tracking, success, warning, critical.
- One surface system: surface-card, surface-panel, surface-subtle; radius xl for cards.
- One layout DNA: max-w-6xl, px-4 sm:px-6, py-6 sm:py-8, gap-6.
- One motion language: theme/motion.js used in App, PageLayout, EmptyState; GSAP for hero only.
- One z-index scale: dropdown/sticky/overlay/modal/toast.
- Links and accents: teal (tracking) for data/incident links; emergency for primary CTAs; amber for alerts/warning.
- No AI or Cursor attribution anywhere.

---

## 12. Files touched
