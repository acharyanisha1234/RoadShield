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
    bg: colors.success + '20',
  },
  medium: {
    label: 'Medium',
    color: colors.warning,
    bg: colors.warning + '20',
  },
  high: {
    label: 'High',
    color: colors.danger,
    bg: colors.danger + '20',
  },
};

export const typeConfig = {
  accident: { label: 'Accident', icon: '🚗', color: '#FF3B3B' },
  pothole: { label: 'Pothole', icon: '🕳️', color: '#FFB800' },
  roadwork: { label: 'Roadwork', icon: '🚧', color: '#FF8C42' },
  flood: { label: 'Flood', icon: '🌊', color: '#3B82F6' },
  other: { label: 'Other', icon: '⚠️', color: '#94A3B8' },
};