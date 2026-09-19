import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

export default function Button({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled = false,
  fullWidth = true,
}) {
  const variants = {
    primary: 'bg-brand active:bg-brand-dark',
    secondary: 'bg-bg-elevated active:bg-bg-card border border-bg-border',
    outline: 'bg-transparent border-2 border-brand active:bg-brand/10',
    ghost: 'bg-transparent active:bg-bg-card',
    danger: 'bg-danger active:opacity-90',
    success: 'bg-success active:opacity-90',
  };

  const textVariants = {
    primary: 'text-white',
    secondary: 'text-content',
    outline: 'text-brand',
    ghost: 'text-content',
    danger: 'text-white',
    success: 'text-white',
  };

  const sizes = {
    sm: 'py-2.5 px-4 rounded-xl',
    md: 'py-3.5 px-5 rounded-2xl',
    lg: 'py-4 px-6 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-base',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.85}
      className={`items-center justify-center flex-row ${variants[variant]} ${sizes[size]} ${
        loading || disabled ? 'opacity-50' : ''
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      style={
        variant === 'primary' && !loading && !disabled
          ? {
              shadowColor: '#FF3B3B',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 8,
            }
          : undefined
      }
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View className="flex-row items-center">
          {icon && (
            <Text className={`mr-2 ${size === 'sm' ? 'text-base' : 'text-lg'}`}>
              {icon}
            </Text>
          )}
          <Text
            className={`font-bold tracking-wide ${textSizes[size]} ${textVariants[variant]}`}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}