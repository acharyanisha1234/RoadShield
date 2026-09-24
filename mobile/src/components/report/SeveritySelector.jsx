import { View, Text, TouchableOpacity } from 'react-native';
import { SEVERITY_LEVELS } from '../../constants/reportConstants';

export default function SeveritySelector({ value, onChange }) {
  return (
    <View className="flex-row gap-3">
      {SEVERITY_LEVELS.map((level) => {
        const active = value === level.key;
        return (
          <TouchableOpacity
            key={level.key}
            onPress={() => onChange(level.key)}
            activeOpacity={0.85}
            className={`flex-1 py-4 rounded-2xl items-center justify-center border ${
              active ? 'border-transparent' : 'bg-bg-card border-bg-border'
            }`}
            style={
              active
                ? {
                    backgroundColor: level.color,
                    shadowColor: level.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 8,
                  }
                : undefined
            }
          >
            <View
              className="w-3 h-3 rounded-full mb-2"
              style={{
                backgroundColor: active ? '#FFFFFF' : level.color,
              }}
            />
            <Text
              className={`text-xs font-bold tracking-wider ${
                active ? 'text-white' : 'text-content-secondary'
              }`}
            >
              {level.label.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}