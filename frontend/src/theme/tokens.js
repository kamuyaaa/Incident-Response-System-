/**
 * Kenya Emergency Response — design system tokens
 * Single source of truth: typography, radius, spacing, surfaces, buttons, motion, z-index.
 */

// ——— Typography ———
// Display: Sora (headings, hero). Body: Plus Jakarta Sans (UI, body copy).
export const typography = {
  fontFamily: {
    display: '"Sora", system-ui, sans-serif',
    body: '"Plus Jakarta Sans", system-ui, sans-serif',
  },
  heading: {
    hero: { fontSize: 'clamp(2.5rem, 5vw + 1.5rem, 4rem)', lineHeight: '1.1', letterSpacing: '-0.02em' },
    display: { fontSize: 'clamp(2rem, 4vw + 1rem, 3rem)', lineHeight: '1.15', letterSpacing: '-0.02em' },
    h1: { fontSize: '1.75rem', lineHeight: '1.25' },
    h2: { fontSize: '1.5rem', lineHeight: '1.3' },
    h3: { fontSize: '1.25rem', lineHeight: '1.35' },
    h4: { fontSize: '1.125rem', lineHeight: '1.4' },
  },
  body: {
    lg: { fontSize: '1.125rem', lineHeight: '1.6' },
    base: { fontSize: '1rem', lineHeight: '1.6' },
    sm: { fontSize: '0.875rem', lineHeight: '1.5' },
  },
  caption: { fontSize: '0.75rem', lineHeight: '1.4' },
  button: { fontSize: '0.875rem', lineHeight: '1.25', fontWeight: '500' },
  label: { fontSize: '0.875rem', lineHeight: '1.4', fontWeight: '500' },
};

// ——— Border radius (unified scale) ———
export const radius = {
  none: '0',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.25rem',
  full: '9999px',
};

// ——— Spacing (4px base) ———
export const spacing = {
  0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem', 5: '1.25rem', 6: '1.5rem',
  8: '2rem', 10: '2.5rem', 12: '3rem', 16: '4rem', 20: '5rem', 24: '6rem',
};
export const space = {
  pageX: '1rem', pageY: '1.5rem', section: '5rem',
  stackXs: '0.5rem', stackSm: '0.75rem', stackMd: '1rem', stackLg: '1.5rem', stackXl: '2rem',
};

// ——— Colors ———
export const colors = {
  bg: { page: '#faf8f5', surface: '#f5f2ed', elevated: '#ffffff', subtle: '#efebe6', overlay: 'rgba(28,25,23,0.4)' },
  text: { primary: '#1c1917', secondary: '#57534e', tertiary: '#78716c', inverse: '#faf8f5' },
  emergency: { DEFAULT: '#dc2626', hover: '#b91c1c', muted: '#fef2f2' },
  accent: { amber: '#d97706', teal: '#0d9488', green: '#059669', slate: '#475569' },
  // Semantic: tracking (teal), success (green), warning (amber), critical (red)
  tracking: { DEFAULT: '#0d9488', muted: '#ccfbf1' },
  success: { DEFAULT: '#059669', muted: '#d1fae5' },
  warning: { DEFAULT: '#d97706', muted: '#fef3c7' },
  critical: { DEFAULT: '#dc2626', muted: '#fee2e2' },
};

// ——— Surfaces ———
export const surfaces = {
  card: {
    bg: colors.bg.elevated,
    border: '1px solid rgba(28,25,23,0.08)',
    radius: radius.xl,
    shadow: '0 2px 8px rgba(28, 25, 23, 0.06), 0 0 0 1px rgba(28, 25, 23, 0.04)',
  },
  cardHover: { shadow: '0 8px 24px rgba(28, 25, 23, 0.1), 0 0 0 1px rgba(28, 25, 23, 0.06)' },
  panel: { bg: colors.bg.surface, border: `1px solid ${colors.bg.subtle}`, radius: radius.xl },
  subtle: { bg: 'rgba(239, 235, 230, 0.6)', border: `1px solid ${colors.bg.subtle}`, radius: radius.lg },
  overlay: { bg: colors.bg.overlay },
};

// ——— Button variants (unified) ———
export const buttonVariants = {
  primary: {
    bg: '#dc2626',
    bgHover: '#b91c1c',
    text: '#ffffff',
    shadow: '0 2px 8px rgba(28, 25, 23, 0.06), 0 0 0 1px rgba(28, 25, 23, 0.04)',
    shadowHover: '0 0 32px -8px rgba(220, 38, 38, 0.25)',
  },
  secondary: {
    bg: colors.bg.surface,
    border: `1px solid ${colors.bg.subtle}`,
    text: colors.text.primary,
    bgHover: colors.bg.subtle,
  },
  outline: {
    bg: 'transparent',
    border: `2px solid ${colors.bg.subtle}`,
    text: colors.text.primary,
    borderHover: colors.text.secondary,
    bgHover: 'rgba(239, 235, 230, 0.5)',
  },
  ghost: {
    bg: 'transparent',
    text: colors.text.secondary,
    bgHover: 'rgba(239, 235, 230, 0.8)',
    textHover: colors.text.primary,
  },
  danger: {
    bg: '#b91c1c',
    bgHover: '#991b1b',
    text: '#ffffff',
  },
};

// ——— Shadows ———
export const shadow = {
  sm: '0 1px 2px rgba(28, 25, 23, 0.06)',
  md: '0 4px 12px rgba(28, 25, 23, 0.08)',
  lg: '0 8px 24px rgba(28, 25, 23, 0.1)',
  card: surfaces.card.shadow,
  cardHover: surfaces.cardHover.shadow,
  glow: '0 0 32px -8px rgba(220, 38, 38, 0.25)',
};

// ——— Motion (single language for GSAP + Framer) ———
export const motion = {
  duration: { fast: 0.15, normal: 0.25, slow: 0.35 },
  ease: [0.25, 0.46, 0.45, 0.94],
  easeOut: [0.33, 1, 0.68, 1],
};

// ——— Z-index layering ———
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
};
