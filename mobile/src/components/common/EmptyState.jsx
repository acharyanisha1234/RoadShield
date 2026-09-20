import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function EmptyState({
  icon = 'information-circle-outline',
  title,
  subtitle,
}) {
  return (
    <View className="items-center justify-center py-16 px-8">
      <View className="w-20 h-20 rounded-2xl bg-bg-elevated items-center justify-center mb-4 border border-bg-border">
        <Ionicons name={icon} size={36} color={colors.textMuted} />
      </View>
      <Text className="text-content font-bold text-base text-center">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-content-muted text-sm mt-1.5 text-center leading-5">
          {subtitle}
        </Text>
      )}
    </View>
  );
}