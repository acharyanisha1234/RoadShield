export const colors = {
  bg: '#0A0E1A',
  bgElevated: '#151A2E',
  bgHigh: '#1E2440',
  border: '#252B45',

  brand: '#FF4757',
  brandDark: '#C0392B',
  brandLight: '#FF6B7A',

  success: '#2ED573',
  warning: '#FFA502',
  danger: '#FF4757',
  info: '#3B82F6',

  textPrimary: '#FFFFFF',
  textSecondary: '#8B92B0',
  textMuted: '#5A6183',
  textDim: '#3D4459',
};

export const severityConfig = {
  low: {
    label: 'Low',
    color: colors.success,
    bg: 'rgba(46, 213, 115, 0.15)',
    icon: '🟢',
  },
  medium: {
    label: 'Medium',
    color: colors.warning,
    bg: 'rgba(255, 165, 2, 0.15)',
    icon: '🟡',
  },
  high: {
    label: 'High',
    color: colors.danger,
    bg: 'rgba(255, 71, 87, 0.15)',
    icon: '🔴',
  },
};

export const typeConfig = {
  accident: { label: 'Accident', icon: '🚗', color: '#FF4757' },
  pothole: { label: 'Pothole', icon: '🕳️', color: '#FFA502' },
  roadwork: { label: 'Roadwork', icon: '🚧', color: '#FF8C00' },
  flood: { label: 'Flood', icon: '🌊', color: '#3B82F6' },
  other: { label: 'Other', icon: '⚠️', color: '#8B92B0' },
};