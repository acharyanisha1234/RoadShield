import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 bg-dark px-6 pt-16">
      <Text className="text-white text-3xl font-bold mb-6">👤 Profile</Text>

      <View className="bg-dark-card rounded-2xl p-5 border border-dark-border flex-row items-center">
        <View className="w-16 h-16 rounded-full bg-primary justify-center items-center">
          <Text className="text-white text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-white font-bold text-lg">{user?.name}</Text>
          <Text className="text-slate-400 text-sm">{user?.email}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-primary/10 border border-primary rounded-xl py-4 mt-6"
      >
        <Text className="text-primary text-center font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}