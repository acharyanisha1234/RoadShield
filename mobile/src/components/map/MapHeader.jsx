import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

/**
 * Floating header card displayed on top of the map
 */
export default function MapHeader({ reportCount = 0 }) {
  return (
    <View className="absolute top-14 left-4 right-4 z-10">
      <View className="bg-bg-card/95 rounded-2xl px-4 py-3 flex-row items-center border border-bg-border">
        <View className="w-10 h-10 rounded-xl bg-brand/15 items-center justify-center mr-3">
          <Ionicons name="shield-checkmark" size={22} color={colors.brand} />
        </View>

        <View className="flex-1">
          <Text className="text-content font-bold text-base">RoadShield</Text>
          <Text className="text-content-muted text-xs mt-0.5">
            {reportCount} active {reportCount === 1 ? 'report' : 'reports'} nearby
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-1.5 h-1.5 rounded-full bg-success mr-1.5" />
          <Text className="text-success text-2xs font-bold tracking-wider">
            LIVE
          </Text>
        </View>
      </View>
    </View>
  );
}