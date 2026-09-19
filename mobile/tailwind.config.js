/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EF4444',
          dark: '#B91C1C',
          light: '#FCA5A5',
        },
        dark: {
          DEFAULT: '#0B1120',
          card: '#111C2E',
          border: '#243247',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
    },
  },

  plugins: [],
};