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
        yellow: '#FFEA59',   // page background, overlays
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
      },
      keyframes: {
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
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
