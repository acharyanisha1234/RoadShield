import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AuthHeader({ title, subtitle }) {
  return (
    <View className="items-center mb-10">
      <View className="w-20 h-20 rounded-3xl bg-brand items-center justify-center mb-4">
        <Ionicons name="shield-checkmark" size={40} color="#FFFFFF" />
      </View>
      <Text className="text-content text-3xl font-bold">{title}</Text>
      {subtitle && (
        <Text className="text-content-secondary text-sm mt-2">{subtitle}</Text>
      )}
    </View>
  );
}