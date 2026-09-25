import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function RealtimeBadge({ connected = false, count = 0 }) {
  const statusColor = connected ? colors.success : colors.textDim;
  const statusText = connected ? 'LIVE' : 'OFFLINE';

  return (
    <View className="bg-bg-card rounded-xl px-3 py-2 border border-bg-border flex-row items-center">
      <View
        className="w-1.5 h-1.5 rounded-full mr-2"
        style={{ backgroundColor: statusColor }}
      />
      <Text
        className="text-2xs font-bold tracking-wider"
        style={{ color: statusColor }}
      >
        {statusText}
      </Text>
      {connected && count > 0 && (
        <>
          <View className="w-px h-3 bg-bg-border mx-2" />
          <Ionicons name="people" size={12} color={colors.textMuted} />
          <Text className="text-content-muted text-2xs font-bold ml-1">
            {count}
          </Text>
        </>
      )}
    </View>
  );
}