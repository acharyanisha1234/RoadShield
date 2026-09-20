import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function TabBarIcon({ name, focused }) {
  return (
    <View
      className={`w-10 h-10 rounded-2xl items-center justify-center ${
        focused ? 'bg-brand/15' : ''
      }`}
    >
      <Ionicons
        name={name}
        size={22}
        color={focused ? colors.brand : colors.textDim}
      />
    </View>
  );
}