import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Header({
  title,
  subtitle,
  showBack = false,
  rightAction,
}) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between mb-6">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-bg-elevated items-center justify-center mr-3 border border-bg-border"
          >
            <Text className="text-text-primary text-lg">←</Text>
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text className="text-text-primary text-3xl font-bold">{title}</Text>
          {subtitle && (
            <Text className="text-text-secondary text-sm mt-1">{subtitle}</Text>
          )}
        </View>
      </View>
      {rightAction}
    </View>
  );
}