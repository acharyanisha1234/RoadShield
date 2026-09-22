import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  rightIcon,
  onRightPress,
}) {
  const router = useRouter();

  return (
    <View className="flex-row items-center mb-6">
      {showBack && (
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.75}
          className="w-10 h-10 rounded-xl bg-bg-card border border-bg-border items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      )}

      <View className="flex-1">
        <Text className="text-content text-3xl font-bold">{title}</Text>
        {subtitle && (
          <Text className="text-content-secondary text-sm mt-1">
            {subtitle}
          </Text>
        )}
      </View>

      {rightIcon && (
        <TouchableOpacity
          onPress={onRightPress}
          activeOpacity={0.75}
          className="w-10 h-10 rounded-xl bg-bg-card border border-bg-border items-center justify-center"
        >
          <Ionicons name={rightIcon} size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );
}