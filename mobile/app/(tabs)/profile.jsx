import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/theme/colors';
import { getInitials } from '../../src/utils/formatters';
import Button from '../../src/components/common/Button';

const MENU_ITEMS = [
  { key: 'reports', label: 'My Reports', icon: 'document-text-outline' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline' },
  { key: 'help', label: 'Help & Support', icon: 'help-circle-outline' },
  { key: 'privacy', label: 'Privacy Policy', icon: 'shield-outline' },
  { key: 'about', label: 'About RoadShield', icon: 'information-circle-outline' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleMenuPress = (key) => {
    console.log('Menu:', key);
  };

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 pt-16">
        <Text className="text-content text-3xl font-bold">Profile</Text>
        <Text className="text-content-secondary mt-1 text-sm">
          Manage your account settings
        </Text>

        <View className="bg-bg-card rounded-2xl p-5 mt-6 border border-bg-border flex-row items-center">
          <View className="w-16 h-16 rounded-2xl bg-brand items-center justify-center">
            <Text className="text-white text-2xl font-bold">
              {getInitials(user?.name)}
            </Text>
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-content font-bold text-lg">
              {user?.name || 'User'}
            </Text>
            <Text className="text-content-secondary text-sm">
              {user?.email}
            </Text>
            <View className="bg-brand/15 self-start px-2.5 py-1 rounded-full mt-2">
              <Text className="text-brand text-2xs font-bold tracking-wider">
                {(user?.role || 'user').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-content-muted text-2xs font-bold tracking-widest mb-3">
            ACCOUNT
          </Text>

          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => handleMenuPress(item.key)}
              activeOpacity={0.85}
              className="bg-bg-card rounded-2xl p-4 mb-2 border border-bg-border flex-row items-center"
            >
              <View className="w-10 h-10 rounded-xl bg-bg-elevated items-center justify-center mr-3">
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <Text className="text-content flex-1 font-medium">
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-6">
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            icon="log-out-outline"
          />
        </View>

        <Text className="text-content-dim text-xs text-center mt-6">
          RoadShield v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}