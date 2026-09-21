import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { colors } from '../src/theme/colors';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(user ? '/(tabs)' : '/(auth)/login');
    }
  }, [user, loading]);

  return (
    <View className="flex-1 bg-bg items-center justify-center">
      <View className="w-24 h-24 rounded-3xl bg-brand items-center justify-center mb-6">
        <Ionicons name="shield-checkmark" size={48} color="#FFFFFF" />
      </View>
      <Text className="text-content text-2xl font-bold mb-2">RoadShield</Text>
      <Text className="text-content-secondary text-sm mb-6">
        Road safety for everyone
      </Text>
      <ActivityIndicator color={colors.brand} size="large" />
    </View>
  );
}