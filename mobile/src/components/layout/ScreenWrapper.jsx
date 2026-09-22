import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

export default function ScreenWrapper({
  children,
  scrollable = false,
  className = '',
  contentContainerStyle,
  keyboardAvoiding = false,
}) {
  const content = scrollable ? (
    <ScrollView
      className={`flex-1 ${className}`}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${className}`}>{children}</View>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-bg"
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}