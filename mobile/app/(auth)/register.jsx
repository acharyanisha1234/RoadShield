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

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Toast.show({ type: 'error', text1: 'Please fill required fields' });
      return;
    }

    if (form.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password must be at least 6 characters',
      });
      return;
    }

    setLoading(true);
    try {
      await register(form);
      Toast.show({ type: 'success', text1: 'Account created successfully' });
      router.replace('/(tabs)');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
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
          <AuthHeader
            title="Create Account"
            subtitle="Join the RoadShield community"
          />

          <Input
            label="Full Name"
            value={form.name}
            onChangeText={(v) => update('name', v)}
            placeholder="John Doe"
            autoCapitalize="words"
            icon="person-outline"
          />

          <Input
            label="Email"
            value={form.email}
            onChangeText={(v) => update('email', v)}
            placeholder="you@example.com"
            keyboardType="email-address"
            icon="mail-outline"
          />

          <Input
            label="Phone (Optional)"
            value={form.phone}
            onChangeText={(v) => update('phone', v)}
            placeholder="+977 98XXXXXXXX"
            keyboardType="phone-pad"
            icon="call-outline"
          />

          <Input
            label="Password"
            value={form.password}
            onChangeText={(v) => update('password', v)}
            placeholder="Minimum 6 characters"
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            icon="checkmark-circle-outline"
            size="lg"
            className="mt-2"
          />

          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 py-2"
            activeOpacity={0.7}
          >
            <Text className="text-content-secondary text-center text-sm">
              Already have an account?{' '}
              <Text className="text-brand font-semibold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}