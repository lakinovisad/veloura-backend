/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#faf7ff',
          100: '#f3f0ff',
          200: '#e9e5ff',
          300: '#d9d2ff',
          400: '#bfb1ff',
          500: '#a189ff',
          600: '#8b5cf6',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#5b21b6',
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 1s ease-out forwards',
        'gradient-shift': 'gradient-shift 6s ease infinite',
      }
    },
  },
  plugins: [],
};