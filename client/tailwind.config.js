/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#132039',
        navy: {
          DEFAULT: '#1B2A4A',
          50: '#EEF1F7',
          100: '#D6DCEB',
          200: '#AEB9D6',
          300: '#8695C0',
          400: '#5C6DA0',
          500: '#3B4C80',
          600: '#243660',
          700: '#1B2A4A',
          800: '#131F38',
          900: '#0C1526',
        },
        marigold: {
          DEFAULT: '#E8A33D',
          50: '#FDF4E4',
          100: '#FBE7C4',
          200: '#F6CE89',
          300: '#F1B65C',
          400: '#E8A33D',
          500: '#CB8724',
          600: '#A2691B',
        },
        teal: {
          DEFAULT: '#1F6F6B',
          50: '#E7F3F2',
          100: '#C6E2DF',
          400: '#2E8B85',
          500: '#1F6F6B',
          600: '#175753',
        },
        paper: '#F6F7FB',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
