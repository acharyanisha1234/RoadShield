export const colors = {
  bg: '#0B0F1A',
  bgCard: '#141A28',
  bgElevated: '#1C2333',
  bgInput: '#1A2130',
  border: '#232B3D',
  divider: '#1A2130',

  brand: '#FF3B3B',
  brandDark: '#D92D2D',
  brandLight: '#FF6B6B',

  success: '#00D26A',
  warning: '#FFB800',
  danger: '#FF3B3B',
  info: '#3B82F6',

  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDim: '#475569',
};

export const severityConfig = {
  low: {
    label: 'Low',
    color: colors.success,
    bg: 'rgba(0, 210, 106, 0.15)',
  },
  medium: {
    label: 'Medium',
    color: colors.warning,
    bg: 'rgba(255, 184, 0, 0.15)',
  },
  high: {
    label: 'High',
    color: colors.danger,
    bg: 'rgba(255, 59, 59, 0.15)',
  },
};

export const typeConfig = {
  accident: { label: 'Accident', icon: 'car-sport', color: '#FF3B3B' },
  pothole: { label: 'Pothole', icon: 'ellipse', color: '#FFB800' },
  roadwork: { label: 'Roadwork', icon: 'construct', color: '#FF8C42' },
  flood: { label: 'Flood', icon: 'water', color: '#3B82F6' },
  other: { label: 'Other', icon: 'warning', color: '#94A3B8' },
};