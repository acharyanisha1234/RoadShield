import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

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

  const borderColor = error
    ? colors.danger
    : focused
    ? colors.brand
    : colors.border;

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-content-secondary mb-2 text-2xs font-bold tracking-widest">
          {label.toUpperCase()}
        </Text>
      )}

      <View
        className={`flex-row items-center bg-bg-input rounded-2xl border px-4 ${
          multiline ? 'py-3 items-start' : 'h-14'
        }`}
        style={{
          borderColor,
          ...(focused && {
            shadowColor: colors.brand,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }),
        }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? colors.brand : colors.textMuted}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textDim}
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
        <View className="flex-row items-center mt-1.5 ml-1">
          <Ionicons name="alert-circle" size={12} color={colors.danger} />
          <Text className="text-danger text-xs ml-1">{error}</Text>
        </View>
      )}
    </View>
  );
}