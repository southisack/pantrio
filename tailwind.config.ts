import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm near-black — borders, shadows, body text
        black: '#1C1410',
        // Deep crimson — primary action, logo, key highlights
        red: {
          600: '#A51C30',
          700: '#7D1524',
        },
        // Warm golden mustard — chips, accents
        amber: {
          400: '#D4A843',
        },
        // Herb olive — section badges, secondary accents
        olive: {
          700: '#5C6B3A',
        },
        // Neutrals — backgrounds, surfaces, muted text
        zinc: {
          50:  '#F7F3EC',  // warm cream background
          100: '#EDE8DE',  // matched ingredient bg
          200: '#DDD8CE',
          300: '#C8C2B5',  // placeholder text
          400: '#9E9488',  // muted/strikethrough text
          950: '#1C1410',  // warm near-black
        },
      },
      fontFamily: {
        // Body and UI text
        sans: ['var(--font-sans)', 'sans-serif'],
        // Headlines and display type
        display: ['var(--font-display)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        sm:  '0px',
        md:  '0px',
        lg:  '0px',
        xl:  '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
