import { View, TouchableOpacity } from 'react-native';

const VARIANTS = {
  default: 'bg-bg-card border border-bg-border',
  elevated: 'bg-bg-elevated border border-bg-border',
  brand: 'bg-brand/10 border border-brand/30',
  transparent: 'bg-transparent',
};

export default function Card({
  children,
  onPress,
  variant = 'default',
  padding = 'p-4',
  radius = 'rounded-2xl',
  className = '',
  shadow = false,
}) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      className={`${VARIANTS[variant]} ${padding} ${radius} ${className}`}
      style={
        shadow
          ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
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