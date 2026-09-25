import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../src/context/AuthContext';
import { SocketProvider } from '../src/context/SocketContext';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SocketProvider>
        <StatusBar style="light" backgroundColor={colors.bg} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'slide_from_right',
          }}
        />
        <Toast />
      </SocketProvider>
    </AuthProvider>
  );
}