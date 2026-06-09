/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0b0f',
          secondary: '#111318',
          tertiary: '#1a1d24',
          card: '#22262f',
        },
        accent: {
          DEFAULT: '#4f7cff',
          dark: '#3d63e0',
        },
        border: {
          DEFAULT: '#2a2e3a',
          focus: '#4f7cff',
        },
        text: {
          primary: '#e8eaf0',
          secondary: '#9098b0',
          muted: '#5a6278',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
