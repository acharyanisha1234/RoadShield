import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const ACCENTS = {
  brand: { color: colors.brand, bg: 'rgba(255, 59, 59, 0.15)' },
  success: { color: colors.success, bg: 'rgba(0, 210, 106, 0.15)' },
  warning: { color: colors.warning, bg: 'rgba(255, 184, 0, 0.15)' },
  info: { color: colors.info, bg: 'rgba(59, 130, 246, 0.15)' },
};

export default function StatCard({
  icon,
  label,
  value,
  unit,
  subtext,
  accent = 'brand',
  className = '',
}) {
  const a = ACCENTS[accent] || ACCENTS.brand;

  return (
    <View className={`bg-bg-card rounded-2xl p-4 border border-bg-border ${className}`}>
      <View className="flex-row items-center justify-between mb-3">
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: a.bg }}
        >
          <Ionicons name={icon} size={16} color={a.color} />
        </View>
        <Text className="text-content-muted text-2xs font-bold tracking-widest">
          {label}
        </Text>
      </View>

      <View className="flex-row items-baseline">
        <Text className="text-content text-2xl font-bold">{value}</Text>
        {unit && (
          <Text className="text-content-secondary text-sm ml-1">{unit}</Text>
        )}
      </View>
      {subtext && (
        <Text className="text-content-muted text-xs mt-1.5">{subtext}</Text>
      )}
    </View>
  );
}