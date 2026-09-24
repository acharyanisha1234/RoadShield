import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

function StatItem({ icon, label, value, color }) {
  return (
    <View className="flex-1 items-center">
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mb-2"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-content text-xl font-bold">{value}</Text>
      <Text className="text-content-muted text-2xs font-bold tracking-widest mt-1">
        {label}
      </Text>
    </View>
  );
}

export default function ReportStats({ high = 0, medium = 0, low = 0 }) {
  return (
    <View className="bg-bg-card rounded-2xl p-4 border border-bg-border flex-row">
      <StatItem
        icon="alert-circle"
        label="HIGH"
        value={high}
        color={colors.danger}
      />
      <View className="w-px my-2" style={{ backgroundColor: colors.border }} />
      <StatItem
        icon="warning"
        label="MEDIUM"
        value={medium}
        color={colors.warning}
      />
      <View className="w-px my-2" style={{ backgroundColor: colors.border }} />
      <StatItem
        icon="checkmark-circle"
        label="LOW"
        value={low}
        color={colors.success}
      />
    </View>
  );
}