import { TouchableOpacity, Image, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { colors } from '../../theme/colors';
import { REPORT_LIMITS } from '../../constants/reportConstants';

export default function CameraCapture({ image, setImage }) {
  const pick = async (fromCamera = true) => {
    try {
      const permission = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Toast.show({ type: 'error', text1: 'Permission denied' });
        return;
      }

      const launcher = fromCamera
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;

      const result = await launcher({
        mediaTypes: ['images'],
        quality: REPORT_LIMITS.IMAGE_QUALITY,
        allowsEditing: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => pick(true)}
        activeOpacity={0.85}
        className="bg-bg-card border-2 border-dashed border-bg-border rounded-3xl h-52 justify-center items-center overflow-hidden"
      >
        {image ? (
          <Image
            source={{ uri: image.uri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="items-center">
            <View className="w-16 h-16 rounded-2xl bg-brand/10 items-center justify-center mb-3">
              <Ionicons name="camera" size={28} color={colors.brand} />
            </View>
            <Text className="text-content font-bold text-base">
              Tap to capture
            </Text>
            <Text className="text-content-muted text-xs mt-1">
              Accident or road damage photo
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View className="flex-row mt-3 gap-3">
        <TouchableOpacity
          onPress={() => pick(true)}
          activeOpacity={0.85}
          className="flex-1 bg-bg-elevated py-3.5 rounded-2xl border border-bg-border flex-row items-center justify-center"
        >
          <Ionicons name="camera-outline" size={18} color={colors.textPrimary} />
          <Text className="text-content text-sm font-semibold ml-2">
            Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => pick(false)}
          activeOpacity={0.85}
          className="flex-1 bg-bg-elevated py-3.5 rounded-2xl border border-bg-border flex-row items-center justify-center"
        >
          <Ionicons name="images-outline" size={18} color={colors.textPrimary} />
          <Text className="text-content text-sm font-semibold ml-2">
            Gallery
          </Text>
        </TouchableOpacity>
      </View>

      {image && (
        <TouchableOpacity
          onPress={() => setImage(null)}
          className="mt-3 flex-row items-center justify-center py-2"
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={16} color={colors.danger} />
          <Text className="text-danger text-sm font-semibold ml-1.5">
            Remove photo
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}