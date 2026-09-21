import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../src/context/AuthContext';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';
import AuthHeader from '../../src/components/auth/AuthHeader';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      Toast.show({ type: 'success', text1: 'Welcome back' });
      router.replace('/(tabs)');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-bg"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center py-12">
          <AuthHeader title="RoadShield" subtitle="Road safety for everyone" />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            icon="mail-outline"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            icon="log-in-outline"
            size="lg"
            className="mt-2"
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            className="mt-6 py-2"
            activeOpacity={0.7}
          >
            <Text className="text-content-secondary text-center text-sm">
              Don't have an account?{' '}
              <Text className="text-brand font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}