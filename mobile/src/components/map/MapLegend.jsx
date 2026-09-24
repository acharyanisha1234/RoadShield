import { View, Text } from 'react-native';
import { severityConfig } from '../../theme/colors';

export default function MapLegend() {
  return (
    <View className="bg-bg-card/95 rounded-2xl p-3 border border-bg-border">
      <Text className="text-content-muted text-2xs font-bold tracking-widest mb-2">
        LEGEND
      </Text>
      {Object.entries(severityConfig).map(([key, value]) => (
        <View key={key} className="flex-row items-center mb-1.5">
          <View
            className="w-2.5 h-2.5 rounded-full mr-2"
            style={{ backgroundColor: value.color }}
          />
          <Text className="text-content-secondary text-xs">{value.label}</Text>
        </View>
      ))}
    </View>
  );
}