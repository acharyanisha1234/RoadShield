/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Background layers
        bg: {
          DEFAULT: '#0A0E1A',      // Deep navy
          elevated: '#151A2E',      // Card
          high: '#1E2440',          // Higher elevation
          border: '#252B45',        // Subtle border
        },
        // Brand
        brand: {
          DEFAULT: '#FF4757',       // Vibrant red
          dark: '#C0392B',          // Deep red
          light: '#FF6B7A',         // Light red
          glow: 'rgba(255, 71, 87, 0.3)',
        },
        // Status
        success: '#2ED573',
        warning: '#FFA502',
        danger: '#FF4757',
        info: '#3B82F6',
        // Text
        text: {
          primary: '#FFFFFF',
          secondary: '#8B92B0',
          muted: '#5A6183',
          dim: '#3D4459',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};