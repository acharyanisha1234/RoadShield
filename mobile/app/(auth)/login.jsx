import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../src/context/AuthContext';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Fill in all fields' });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      Toast.show({ type: 'success', text1: 'Welcome back! 🛡️' });
      router.replace('/(tabs)');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: err.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-dark"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
        <View className="flex-1 justify-center">
          <View className="items-center mb-12">
            <Text className="text-6xl mb-2">🛡️</Text>
            <Text className="text-white text-3xl font-bold">RoadShield</Text>
            <Text className="text-slate-400 text-sm mt-1">
              Your Road Safety Companion
            </Text>
          </View>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <Button title="Login" onPress={handleLogin} loading={loading} className="mt-2" />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            className="mt-6"
          >
            <Text className="text-slate-400 text-center">
              Don't have an account?{' '}
              <Text className="text-primary font-semibold">Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}