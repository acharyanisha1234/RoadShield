/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

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
          DEFAULT: '#0F172A',
          card: '#1E293B',
          border: '#334155',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
    },
  },

  plugins: [],
};