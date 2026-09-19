import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

/**
 * Floating button to recenter map on user's location
 */
export default function MapCenterButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="absolute right-4 top-32 w-11 h-11 rounded-full bg-bg-card border border-bg-border items-center justify-center"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Ionicons name="navigate-circle" size={24} color={colors.brand} />
    </TouchableOpacity>
  );
}