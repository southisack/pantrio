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
        // v2 (/v2) palette
        cobalt: '#1848C8',        // v2 page background, photo rings
        'cobalt-deep': '#0F2F8F', // v2 quiet surfaces on cobalt
        ink: '#0A1640',           // v2 text on light surfaces
        tomato: '#FF4B27',        // v2 accent
        pink: '#FFB8D9',          // v2 accent
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
        // v2: heavy condensed grotesque for everything, italic serif for the words you pick
        'v2-display': ['var(--font-v2-display)', 'sans-serif'],
        'v2-serif': ['var(--font-v2-serif)', 'serif'],
      },
      fontSize: {
        hero: ['80px', { lineHeight: '1', letterSpacing: '-0.03em' }],
        menu: ['44px', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'card-title': ['32px', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        cta: ['21px', { letterSpacing: '0.01em' }],
        label: ['12px', { letterSpacing: '0.06em' }],
        'card-label': ['11px', { letterSpacing: '0.06em' }],
        index: '13px',
        // v2
        sentence: ['clamp(2.9rem, 8.4vw, 9.5rem)', { lineHeight: '1.04', letterSpacing: '-0.045em' }],
        poster: ['clamp(3rem, 7.4vw, 8.5rem)', { lineHeight: '0.9', letterSpacing: '-0.045em' }],
        step: ['clamp(1.9rem, 4.6vw, 5rem)', { lineHeight: '1.06', letterSpacing: '-0.03em' }],
        tally: ['clamp(2rem, 4.4vw, 4.5rem)', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
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
        // v2: em-based so the pick pills scale with the sentence
        'pill-x': '0.2em',
        'pill-y': '0.02em',
        'pill-gap': '0.07em',
        disc: '9.5rem',
      },
      width: {
        panel: '43.333%',
      },
      aspectRatio: {
        photo: '5 / 3',     // the shape recipe photos are generated in
      },
      minWidth: {
        panel: '540px',     // content width left of the padding is 436px; "you working" at 80px is 414px, so the title never needs a 4th line
      },
      maxWidth: {
        lede: '480px',      // shared by the hero title and the line under it; "working with?" at 80px is 473px wide
        recipe: '768px',    // width of the ingredient and step sections, headers included
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
        // v2
        'v2-roll': {
          from: { opacity: '0', transform: 'translateY(55%)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'v2-pop': {
          from: { opacity: '0', transform: 'translateY(36px) scale(0.94)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'v2-sheet': {
          from: { opacity: '0', transform: 'translateY(6%)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'v2-step': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // 47s = one set of 12 cards (2832px) at 60px per second
        marquee: 'marquee 47s linear infinite',
        'modal-in':  'modal-in 220ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'modal-out': 'modal-out 180ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in':   'fade-in 220ms ease-out forwards',
        'fade-out':  'fade-out 180ms ease-in forwards',
        // v2
        'v2-roll':  'v2-roll 300ms cubic-bezier(0.2, 0.9, 0.3, 1.25) both',
        'v2-pop':   'v2-pop 520ms cubic-bezier(0.2, 0.9, 0.3, 1) both',
        'v2-sheet': 'v2-sheet 380ms cubic-bezier(0.2, 0.9, 0.3, 1) both',
        'v2-step':  'v2-step 340ms cubic-bezier(0.2, 0.9, 0.3, 1) both',
        'v2-turn':  'spin 28s linear infinite',
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
        pill: '0.24em',   // v2 pick pills, scales with the sentence
        label: '2rem',    // v2 recipe cards and panels
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
