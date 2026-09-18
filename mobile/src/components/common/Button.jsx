import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

export default function Button({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  className = '',
}) {
  const variants = {
    primary: 'bg-primary active:bg-primary-dark',
    outline: 'bg-transparent border border-primary',
    ghost: 'bg-dark-card',
  };

  const textVariants = {
    primary: 'text-white',
    outline: 'text-primary',
    ghost: 'text-white',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`py-4 rounded-xl items-center justify-center ${variants[variant]} ${
        loading ? 'opacity-60' : ''
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#EF4444' : '#fff'}
        />
      ) : (
        <Text className={`font-bold text-base ${textVariants[variant]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}