import { View, TouchableOpacity } from 'react-native';

export default function Card({
  children,
  onPress,
  className = '',
  elevated = false,
  variant = 'default',
}) {
  const variants = {
    default: 'bg-bg-elevated border border-bg-border',
    high: 'bg-bg-high border border-bg-border',
    brand: 'bg-brand/10 border border-brand/30',
  };

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.9}
      className={`rounded-2xl ${variants[variant]} ${className}`}
      style={
        elevated
          ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }
          : undefined
      }
    >
      {children}
    </Wrapper>
  );
}