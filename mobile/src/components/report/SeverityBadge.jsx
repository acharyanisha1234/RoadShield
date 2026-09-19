import { View, Text } from 'react-native';

const styles = {
  low: { bg: 'bg-success/20', text: 'text-success', dot: 'bg-success' },
  medium: { bg: 'bg-warning/20', text: 'text-warning', dot: 'bg-warning' },
  high: { bg: 'bg-danger/20', text: 'text-danger', dot: 'bg-danger' },
};

export default function SeverityBadge({ severity = 'medium' }) {
  const s = styles[severity] || styles.medium;
  return (
    <View className={`flex-row items-center px-2.5 py-1 rounded-full ${s.bg}`}>
      <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${s.dot}`} />
      <Text className={`text-xs font-bold uppercase ${s.text}`}>{severity}</Text>
    </View>
  );
}