import { View, Text } from 'react-native';

export default function StatCard({
  icon,
  label,
  value,
  unit,
  subtext,
  accent = 'brand',
  className = '',
}) {
  const accentColors = {
    brand: { color: '#FF3B3B', bg: 'rgba(255, 59, 59, 0.15)' },
    success: { color: '#00D26A', bg: 'rgba(0, 210, 106, 0.15)' },
    warning: { color: '#FFB800', bg: 'rgba(255, 184, 0, 0.15)' },
    info: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
  };

  const c = accentColors[accent] || accentColors.brand;

  return (
    <View
      className={`bg-bg-card rounded-2xl p-4 border border-bg-border ${className}`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: c.bg }}
        >
          <Text className="text-base">{icon}</Text>
        </View>
        <Text className="text-content-muted text-2xs font-semibold tracking-wider">
          {label}
        </Text>
      </View>

      <View className="flex-row items-baseline">
        <Text className="text-content text-3xl font-bold">{value}</Text>
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