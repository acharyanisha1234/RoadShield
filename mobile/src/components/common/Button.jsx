import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const VARIANTS = {
  primary: {
    bg: 'bg-brand active:bg-brand-dark',
    text: 'text-white',
    iconColor: '#FFFFFF',
    shadow: true,
  },
  secondary: {
    bg: 'bg-bg-elevated active:bg-bg-card border border-bg-border',
    text: 'text-content',
    iconColor: colors.textPrimary,
  },
  outline: {
    bg: 'bg-transparent border-2 border-brand active:bg-brand/10',
    text: 'text-brand',
    iconColor: colors.brand,
  },
  ghost: {
    bg: 'bg-transparent active:bg-bg-card',
    text: 'text-content',
    iconColor: colors.textPrimary,
  },
  danger: {
    bg: 'bg-danger active:opacity-90',
    text: 'text-white',
    iconColor: '#FFFFFF',
  },
};

const SIZES = {
  sm: { padding: 'py-2.5 px-4 rounded-xl', text: 'text-sm', icon: 16 },
  md: { padding: 'py-3.5 px-5 rounded-2xl', text: 'text-base', icon: 18 },
  lg: { padding: 'py-4 px-6 rounded-2xl', text: 'text-base', icon: 20 },
};

export default function Button({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  fullWidth = true,
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const isDisabled = loading || disabled;

  const shadowStyle =
    v.shadow && !isDisabled
      ? {
          shadowColor: colors.brand,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 8,
        }
      : undefined;

  const renderIcon = () =>
    icon ? (
      <Ionicons
        name={icon}
        size={s.icon}
        color={v.iconColor}
        style={iconPosition === 'left' ? { marginRight: 8 } : { marginLeft: 8 }}
      />
    ) : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`flex-row items-center justify-center ${v.bg} ${s.padding} ${
        isDisabled ? 'opacity-50' : ''
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      style={shadowStyle}
    >
      {loading ? (
        <ActivityIndicator color={v.iconColor} />
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          <Text className={`font-bold tracking-wide ${s.text} ${v.text}`}>
            {title}
          </Text>
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </TouchableOpacity>
  );
}