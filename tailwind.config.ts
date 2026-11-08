import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        yellow: '#FFE63B',   // page background, overlays
        teal: '#58C2B9',     // hero section background
        'teal-dark': '#2A7A72', // darker teal for depth / hover states
        coral: '#E8503A',    // warm accent — badges, highlights, ratings
        cream: '#FFF9EF',    // warm off-white — softer card backgrounds
        gray: '#666666',     // muted / strikethrough text
      },
      fontFamily: {
        // Body and UI text
        sans: ['var(--font-sans)', 'sans-serif'],
        // Headlines and display type
        display: ['var(--font-display)', 'serif'],
        // Links, buttons, inputs
        ui: ['var(--font-ui)', 'sans-serif'],
        // Small labels: section titles, recipe times, order status
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        hero: ['80px', { lineHeight: '1', letterSpacing: '-0.03em' }],
        menu: ['44px', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'card-title': ['32px', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        cta: ['21px', { letterSpacing: '0.01em' }],
        label: ['12px', { letterSpacing: '0.06em' }],
        'card-label': ['11px', { letterSpacing: '0.06em' }],
        index: '13px',
      },
      spacing: {
        'panel-bottom': '168px',    // clears the order card once it slides up
        'hero-gap': '26px',
        'menu-top': '54.5px',       // top of the 80px hero title's capitals (44px padding + 10.5px inside the line box)
        row: '18px',
        index: '30px',
        card: '220px',
        'card-tall': '210px',
        cta: '400px',
      },
      width: {
        panel: '43.333%',
      },
      minWidth: {
        panel: '540px',     // content width left of the padding is 436px; "you working" at 80px is 414px, so the title never needs a 4th line
      },
      maxWidth: {
        lede: '480px',      // shared by the hero title and the line under it; "working with?" at 80px is 473px wide
      },
      transitionTimingFunction: {
        pop: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'scale(0.95) translateY(12px)' },
          to:   { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'modal-out': {
          from: { opacity: '1', transform: 'scale(1) translateY(0)' },
          to:   { opacity: '0', transform: 'scale(0.95) translateY(12px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to:   { opacity: '0' },
        },
      },
      animation: {
        // 47s = one set of 12 cards (2832px) at 60px per second
        marquee: 'marquee 47s linear infinite',
        'modal-in':  'modal-in 220ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'modal-out': 'modal-out 180ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in':   'fade-in 220ms ease-out forwards',
        'fade-out':  'fade-out 180ms ease-in forwards',
      },
      borderRadius: {
        DEFAULT: '0px',
        sm:  '4px',
        md:  '8px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '20px',
        '3xl': '24px',
        row: '18px',
        card: '22px',
        order: '28px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
