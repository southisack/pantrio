import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Black — borders, shadows, primary text
        black: '#000000',
        // Olive — primary accent, badges, buttons
        red: {
          600: '#000000',
          700: '#000000',
        },
        // Olive secondary
        olive: {
          700: '#000000',
        },
        // Yellows and neutrals
        zinc: {
          50:  '#FFEA59',  // yellow — page background
          100: '#FFF9B0',  // lighter yellow — matched ingredient bg
          200: '#FFF280',
          300: '#333333',  // muted placeholder text
          400: '#666666',  // muted / strikethrough text
          950: '#000000',  // body text
        },
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
