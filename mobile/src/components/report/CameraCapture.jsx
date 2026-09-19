import { TouchableOpacity, Image, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

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

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.6,
            allowsEditing: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.6,
            allowsEditing: true,
          });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => pick(true)}
        className="bg-dark-card border-2 border-dashed border-dark-border rounded-2xl h-56 justify-center items-center overflow-hidden"
      >
        {image ? (
          <Image source={{ uri: image.uri }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="items-center">
            <Text className="text-5xl mb-2">📷</Text>
            <Text className="text-slate-400 font-medium">Tap to capture</Text>
            <Text className="text-slate-500 text-xs mt-1">Accident / road damage</Text>
          </View>
        )}
      </TouchableOpacity>

      <View className="flex-row mt-3">
        <TouchableOpacity
          onPress={() => pick(true)}
          className="flex-1 bg-dark-card py-3 rounded-xl items-center mr-2 border border-dark-border"
        >
          <Text className="text-white text-sm"> Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => pick(false)}
          className="flex-1 bg-dark-card py-3 rounded-xl items-center border border-dark-border"
        >
          <Text className="text-white text-sm">Gallery</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <TouchableOpacity
          onPress={() => setImage(null)}
          className="mt-2 items-center"
        >
          <Text className="text-danger text-sm">Remove photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}