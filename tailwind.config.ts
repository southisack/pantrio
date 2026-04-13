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
