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
        // Background layers (deep → elevated)
        bg: {
          DEFAULT: '#0B0F1A',       // Deepest — screen bg
          card: '#141A28',           // Card bg
          elevated: '#1C2333',       // Elevated card
          input: '#1A2130',          // Input bg
          border: '#232B3D',         // Subtle border
          divider: '#1A2130',        // Divider
        },
        // Brand — Red (RoadShield)
        brand: {
          DEFAULT: '#FF3B3B',
          dark: '#D92D2D',
          light: '#FF6B6B',
          glow: 'rgba(255, 59, 59, 0.25)',
        },
        // Status
        success: {
          DEFAULT: '#00D26A',
          bg: 'rgba(0, 210, 106, 0.15)',
        },
        warning: {
          DEFAULT: '#FFB800',
          bg: 'rgba(255, 184, 0, 0.15)',
        },
        danger: {
          DEFAULT: '#FF3B3B',
          bg: 'rgba(255, 59, 59, 0.15)',
        },
        info: {
          DEFAULT: '#3B82F6',
          bg: 'rgba(59, 130, 246, 0.15)',
        },
        // Text
        content: {
          DEFAULT: '#FFFFFF',        // Primary text
          secondary: '#94A3B8',      // Secondary
          muted: '#64748B',          // Muted
          dim: '#475569',            // Very muted
        },
      },
      fontSize: {
        '2xs': '10px',
      },
    },
  },
  plugins: [],
};