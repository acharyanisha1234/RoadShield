import { useState } from 'react';
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
  multiline = false,
  numberOfLines = 1,
  maxLength,
  icon,
  editable = true,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-content-secondary mb-2 text-xs font-bold tracking-widest">
          {label.toUpperCase()}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-bg-input rounded-2xl border px-4 ${
          error
            ? 'border-danger'
            : focused
            ? 'border-brand'
            : 'border-bg-border'
        } ${multiline ? 'py-3 items-start' : 'h-14'}`}
        style={
          focused
            ? {
                shadowColor: '#FF3B3B',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }
            : undefined
        }
      >
        {icon && <Text className="text-base mr-3">{icon}</Text>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#475569"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          textAlignVertical={multiline ? 'top' : 'center'}
          className={`flex-1 text-content text-base ${
            multiline ? 'min-h-[100px] pt-1' : ''
          }`}
        />
      </View>
      {error && (
        <Text className="text-danger text-xs mt-1.5 ml-1">⚠ {error}</Text>
      )}
    </View>
  );
}