import { View } from 'react-native';
import { colors } from '../../theme/colors';

export default function Divider({ className = '', vertical = false }) {
  if (vertical) {
    return (
      <View
        className={`w-px ${className}`}
        style={{ backgroundColor: colors.divider }}
      />
    );
  }
  return (
    <View
      className={`h-px w-full ${className}`}
      style={{ backgroundColor: colors.divider }}
    />
  );
}