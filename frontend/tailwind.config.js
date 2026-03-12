/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
        colors: {
          ers: {
            bg: '#faf8f5',
            surface: '#f5f2ed',
            elevated: '#ffffff',
            subtle: '#efebe6',
            ink: '#1c1917',
            inkSecondary: '#57534e',
            inkTertiary: '#78716c',
          },
          emergency: {
            50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
            400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
            800: '#991b1b', 900: '#7f1d1d',
          },
          accent: {
            amber: '#d97706', teal: '#0d9488', green: '#059669', slate: '#475569',
          },
          tracking: { DEFAULT: '#0d9488', muted: '#ccfbf1' },
          success: { DEFAULT: '#059669', muted: '#d1fae5' },
          warning: { DEFAULT: '#d97706', muted: '#fef3c7' },
          critical: { DEFAULT: '#dc2626', muted: '#fee2e2' },
        },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      // Typography scale: heading (display font) + body + caption + button
      fontSize: {
        hero: ['clamp(2.5rem, 5vw + 1.5rem, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        display: ['clamp(2rem, 4vw + 1rem, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h1: ['1.75rem', { lineHeight: '1.25' }],
        h2: ['1.5rem', { lineHeight: '1.3' }],
        h3: ['1.25rem', { lineHeight: '1.35' }],
        h4: ['1.125rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        caption: ['0.75rem', { lineHeight: '1.4' }],
        btn: ['0.875rem', { lineHeight: '1.25' }],
      },
      fontWeight: {
        display: '600',
        body: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      // Unified border radius (single scale)
      borderRadius: {
        none: '0',
        sm: '0.375rem',   // 6px
        md: '0.5rem',     // 8px
        lg: '0.75rem',    // 12px
        xl: '1rem',       // 16px
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem',  // 24px
        full: '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      transitionDuration: { 150: '150ms', 200: '200ms', 250: '250ms', 350: '350ms' },
      transitionTimingFunction: {
        'ers': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ers-out': 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
      zIndex: { dropdown: 10, sticky: 20, overlay: 30, modal: 40, toast: 50 },
      boxShadow: {
        'ers-sm': '0 1px 2px rgba(28, 25, 23, 0.06)',
        'ers-md': '0 4px 12px rgba(28, 25, 23, 0.08)',
        'ers-lg': '0 8px 24px rgba(28, 25, 23, 0.1)',
        'ers-card': '0 2px 8px rgba(28, 25, 23, 0.06), 0 0 0 1px rgba(28, 25, 23, 0.04)',
        'ers-card-hover': '0 8px 24px rgba(28, 25, 23, 0.1), 0 0 0 1px rgba(28, 25, 23, 0.06)',
        'ers-glow': '0 0 32px -8px rgba(220, 38, 38, 0.25)',
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
