import { View, Text, TouchableOpacity } from 'react-native';

export default function SectionHeader({ title, action, onActionPress }) {
  return (
    <View className="flex-row items-center justify-between mb-3 mt-6">
      <Text className="text-content font-bold text-base">{title}</Text>
      {action && (
        <TouchableOpacity onPress={onActionPress}>
          <Text className="text-brand text-sm font-semibold">{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}