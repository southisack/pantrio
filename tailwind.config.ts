import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand red — primary action, logo, key highlights
        red: {
          600: '#EB0000',
          700: '#BC0100',
        },
        // Accent yellow — chips, hover states, secondary containers
        amber: {
          300: '#FDBF2E',
          400: '#FFC130',
        },
        // Tertiary blue — badges, tags, accents
        blue: {
          500: '#3467FF',
          700: '#004BE4',
        },
        // Neutrals — backgrounds, surfaces, borders
        zinc: {
          50:  '#F9F9F9',
          100: '#EEEEEE',
          200: '#E2E2E2',
          300: '#DADADA',
          950: '#1B1B1B',
        },
        // Muted warm tone — secondary text, outlines
        stone: {
          400: '#946E68',
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
