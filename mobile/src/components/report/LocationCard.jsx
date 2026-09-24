import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function LocationCard({ location, onRefresh }) {
  return (
    <TouchableOpacity
      onPress={onRefresh}
      activeOpacity={0.85}
      className="bg-bg-card rounded-2xl p-4 border border-bg-border flex-row items-center"
    >
      <View className="w-11 h-11 rounded-xl bg-brand/15 items-center justify-center mr-3">
        <Ionicons name="location" size={22} color={colors.brand} />
      </View>

      <View className="flex-1">
        <Text className="text-content-muted text-2xs font-bold tracking-widest">
          CURRENT LOCATION
        </Text>
        <Text className="text-content font-mono text-sm mt-1">
          {location
            ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
            : 'Getting location...'}
        </Text>
      </View>

      {onRefresh && (
        <Ionicons name="refresh" size={18} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}