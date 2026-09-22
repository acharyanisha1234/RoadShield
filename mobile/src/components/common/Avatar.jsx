import { View, Text, Image } from 'react-native';
import { getInitials } from '../../utils/formatters';

export default function Avatar({ name, imageUrl, size = 48, className = '' }) {
  const sizeStyle = {
    width: size,
    height: size,
    borderRadius: size / 3,
  };

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={sizeStyle}
        className={className}
      />
    );
  }

  return (
    <View
      style={sizeStyle}
      className={`bg-brand items-center justify-center ${className}`}
    >
      <Text className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
        {getInitials(name)}
      </Text>
    </View>
  );
}