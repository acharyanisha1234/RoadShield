import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';


export default function TypeChip({ type, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`flex-row items-center px-4 py-3 rounded-2xl border ${
        active ? 'bg-brand border-brand' : 'bg-bg-card border-bg-border'
      }`}
      style={
        active
          ? {
              shadowColor: colors.brand,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 10,
              elevation: 6,
            }
          : undefined
      }
    >
      <Ionicons
        name={type.icon}
        size={16}
        color={active ? '#FFFFFF' : colors.textSecondary}
        style={{ marginRight: 8 }}
      />
      <Text
        className={`text-sm font-semibold ${
          active ? 'text-white' : 'text-content-secondary'
        }`}
      >
        {type.label}
      </Text>
    </TouchableOpacity>
  );
}