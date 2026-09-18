import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../src/context/AuthContext';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';

export default function RegisterScreen() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Toast.show({ type: 'error', text1: 'Missing fields' });
      return;
    }

    setLoading(true);
    try {
      await register(form);
      Toast.show({ type: 'success', text1: 'Account created! 🎉' });
      router.replace('/(tabs)');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
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
        <View className="flex-1 justify-center py-10">
          <View className="items-center mb-10">
            <Text className="text-5xl mb-2">🛡️</Text>
            <Text className="text-white text-2xl font-bold">Create Account</Text>
            <Text className="text-slate-400 text-sm mt-1">
              Join RoadShield community
            </Text>
          </View>

          <Input
            label="Full Name"
            value={form.name}
            onChangeText={(v) => update('name', v)}
            placeholder="John Doe"
            autoCapitalize="words"
          />

          <Input
            label="Email"
            value={form.email}
            onChangeText={(v) => update('email', v)}
            placeholder="you@example.com"
            keyboardType="email-address"
          />

          <Input
            label="Phone (optional)"
            value={form.phone}
            onChangeText={(v) => update('phone', v)}
            placeholder="+977 98XXXXXXXX"
            keyboardType="phone-pad"
          />

          <Input
            label="Password"
            value={form.password}
            onChangeText={(v) => update('password', v)}
            placeholder="Min 6 characters"
            secureTextEntry
          />

          <Button title="Register" onPress={handleRegister} loading={loading} className="mt-2" />

          <TouchableOpacity onPress={() => router.back()} className="mt-6">
            <Text className="text-slate-400 text-center">
              Already have an account?{' '}
              <Text className="text-primary font-semibold">Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}