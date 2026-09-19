import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

/**
 * Stat pill component
 */
function StatPill({ icon, label, value, accentColor }) {
  return (
    <View className="flex-1 bg-bg-elevated rounded-2xl p-3.5 border border-bg-border">
      <View className="flex-row items-center mb-2">
        <Ionicons name={icon} size={16} color={accentColor} />
        <Text className="text-content-muted text-2xs font-bold tracking-widest ml-2">
          {label}
        </Text>
      </View>
      <Text className="text-content text-2xl font-bold">{value}</Text>
    </View>
  );
}

/**
 * Bottom sheet with stats and SOS button
 */
export default function MapBottomSheet({
  highCount,
  mediumCount,
  sosLoading,
  onSosPress,
}) {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-bg-card rounded-t-3xl border-t border-bg-border px-5 pt-4 pb-6">
      {/* Drag handle */}
      <View className="w-10 h-1 bg-bg-border rounded-full self-center mb-4" />

      {/* Stats row */}
      <View className="flex-row gap-3 mb-4">
        <StatPill
          icon="alert-circle"
          label="HIGH"
          value={highCount}
          accentColor={colors.danger}
        />
        <StatPill
          icon="warning"
          label="MEDIUM"
          value={mediumCount}
          accentColor={colors.warning}
        />
      </View>

      {/* SOS button */}
      <TouchableOpacity
        onPress={onSosPress}
        disabled={sosLoading}
        activeOpacity={0.9}
        className="bg-danger rounded-2xl py-4 flex-row items-center justify-center"
        style={{
          shadowColor: colors.danger,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 10,
        }}
      >
        {sosLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="alert-circle" size={22} color="#FFFFFF" />
            <Text className="text-white font-bold text-base tracking-widest ml-2">
              EMERGENCY SOS
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}