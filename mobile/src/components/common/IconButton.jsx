import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function IconButton({
  icon,
  onPress,
  size = 20,
  variant = 'default',
  className = '',
}) {
  const variants = {
    default: 'bg-bg-card border border-bg-border',
    ghost: 'bg-transparent',
    brand: 'bg-brand',
  };

  const iconColors = {
    default: colors.textPrimary,
    ghost: colors.textSecondary,
    brand: '#FFFFFF',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={`w-10 h-10 rounded-xl items-center justify-center ${variants[variant]} ${className}`}
    >
      <Ionicons name={icon} size={size} color={iconColors[variant]} />
    </TouchableOpacity>
  );
}