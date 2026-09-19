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
}) {
  const variants = {
    primary: 'bg-brand active:bg-brand-dark',
    outline: 'bg-transparent border-2 border-brand active:bg-brand/10',
    ghost: 'bg-bg-elevated active:bg-bg-high border border-bg-border',
    danger: 'bg-danger active:bg-red-700',
    success: 'bg-success active:bg-green-700',
  };

  const textVariants = {
    primary: 'text-white',
    outline: 'text-brand',
    ghost: 'text-text-primary',
    danger: 'text-white',
    success: 'text-white',
  };

  const sizes = {
    sm: 'py-2.5 px-4',
    md: 'py-4 px-6',
    lg: 'py-5 px-8',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.85}
      className={`rounded-2xl items-center justify-center flex-row ${variants[variant]} ${sizes[size]} ${
        loading || disabled ? 'opacity-50' : ''
      } ${className}`}
      style={
        variant === 'primary' && !loading && !disabled
          ? {
              shadowColor: '#FF4757',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            }
          : undefined
      }
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#FF4757' : '#fff'} />
      ) : (
        <View className="flex-row items-center">
          {icon && <Text className="text-lg mr-2">{icon}</Text>}
          <Text className={`font-bold ${textSizes[size]} ${textVariants[variant]}`}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}