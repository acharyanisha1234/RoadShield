import { View, Text } from 'react-native';
import { severityConfig } from '../../theme/colors';

export default function SeverityBadge({ severity = 'medium', size = 'md' }) {
  const s = severityConfig[severity] || severityConfig.medium;

  const sizes = {
    sm: { padding: 'px-2 py-0.5', text: 'text-2xs' },
    md: { padding: 'px-2.5 py-1', text: 'text-xs' },
  };

  const sz = sizes[size] || sizes.md;

  return (
    <View
      className={`rounded-full ${sz.padding}`}
      style={{ backgroundColor: s.bg }}
    >
      <Text
        className={`font-bold tracking-wider ${sz.text}`}
        style={{ color: s.color }}
      >
        {s.label.toUpperCase()}
      </Text>
    </View>
  );
}