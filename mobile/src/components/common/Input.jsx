import { View, Text, TextInput } from 'react-native';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  error,
}) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-slate-300 mb-2 text-sm font-medium">
          {label}
        </Text>
      )}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        className={`bg-dark-card text-white px-4 py-4 rounded-xl border ${
          error ? 'border-danger' : 'border-dark-border'
        }`}
      />

      {error && (
        <Text className="text-danger text-xs mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}