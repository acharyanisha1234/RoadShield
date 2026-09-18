import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, loading]);

  return (
    <View className="flex-1 bg-dark justify-center items-center">
      <Text className="text-6xl mb-4">🛡️</Text>
      <Text className="text-white text-2xl font-bold">RoadShield</Text>
      <ActivityIndicator color="#EF4444" size="large" className="mt-6" />
    </View>
  );
}