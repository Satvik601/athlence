import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  // Mobile-first per brief §9 — 390px is the design canvas
  theme: {
    screens: {
      xs: '390px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    container: {
      center: true,
      padding: { DEFAULT: '20px', md: '40px', xl: '80px' },
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        chrome: 'var(--chrome)',
        'chrome-hi': 'var(--chrome-hi)',
        'chrome-lo': 'var(--chrome-lo)',
        signal: 'var(--signal)',
        'signal-hot': 'var(--signal-hot)',
        electric: 'var(--electric)',
        paper: 'var(--paper)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        'display-xl': ['clamp(56px, 11vw, 144px)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(40px, 7vw, 96px)', { lineHeight: '0.95', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(28px, 4.2vw, 56px)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'body-lg': ['clamp(18px, 1.4vw, 22px)', { lineHeight: '1.5' }],
        body: ['16px', { lineHeight: '1.5' }],
        caption: ['12px', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      spacing: {
        section: 'clamp(96px, 14vw, 200px)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'phrase-in': {
          from: { opacity: '0', transform: 'translateY(8px) skewY(-1deg)' },
          to: { opacity: '1', transform: 'translateY(0) skewY(0)' },
        },
        shimmer: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
        pulse: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'fade-up': 'fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'phrase-in': 'phrase-in 700ms cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 3s linear infinite',
        pulse: 'pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
