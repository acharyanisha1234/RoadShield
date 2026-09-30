/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class',                 
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0B0F1A',
          card: '#141A28',
          elevated: '#1C2333',
          input: '#1A2130',
          border: '#232B3D',
          divider: '#1A2130',
        },
        brand: {
          DEFAULT: '#FF3B3B',
          dark: '#D92D2D',
          light: '#FF6B6B',
        },
        success: '#00D26A',
        warning: '#FFB800',
        danger: '#FF3B3B',
        info: '#3B82F6',
        content: {
          DEFAULT: '#FFFFFF',
          secondary: '#94A3B8',
          muted: '#64748B',
          dim: '#475569',
        },
      },
      
      fontSize: {
        '2xs': '10px',
      },
    },
  },
  plugins: [],
};