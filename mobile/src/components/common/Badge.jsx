import { View, Text } from 'react-native';
import { colors } from '../../theme/colors';

export default function Badge({
  label,
  color = colors.brand,
  size = 'md',
  filled = true,
}) {
  const sizes = {
    sm: { padding: 'px-2 py-0.5', text: 'text-2xs' },
    md: { padding: 'px-2.5 py-1', text: 'text-xs' },
    lg: { padding: 'px-3 py-1.5', text: 'text-sm' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <View
      className={`rounded-full ${s.padding}`}
      style={{
        backgroundColor: filled ? `${color}20` : 'transparent',
        borderWidth: filled ? 0 : 1,
        borderColor: color,
      }}
    >
      <Text
        className={`font-bold tracking-wider ${s.text}`}
        style={{ color }}
      >
        {label}
      </Text>
    </View>
  );
}