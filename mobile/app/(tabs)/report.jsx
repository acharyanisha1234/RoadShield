import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import CameraCapture from '../../src/components/report/CameraCapture';
import Button from '../../src/components/common/Button';
import { reportService } from '../../src/services/reportService';

const TYPES = [
  { key: 'accident', label: 'Accident', icon: '🚗' },
  { key: 'pothole', label: 'Pothole', icon: '🕳️' },
  { key: 'roadwork', label: 'Roadwork', icon: '🚧' },
  { key: 'flood', label: 'Flood', icon: '🌊' },
  { key: 'other', label: 'Other', icon: '⚠️' },
];

const SEVERITIES = [
  { key: 'low', label: 'Low', color: 'bg-success' },
  { key: 'medium', label: 'Medium', color: 'bg-warning' },
  { key: 'high', label: 'High', color: 'bg-danger' },
];

export default function ReportScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('accident');
  const [severity, setSeverity] = useState('medium');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Location permission denied' });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc.coords);
    })();
  }, []);

  const refreshLocation = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const submit = async () => {
    if (!title.trim()) {
      Toast.show({ type: 'error', text1: 'Title required' });
      return;
    }
    if (!location) {
      Toast.show({ type: 'error', text1: 'Location not available' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', type);
      formData.append('severity', severity);
      formData.append('latitude', String(location.latitude));
      formData.append('longitude', String(location.longitude));

      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: `report-${Date.now()}.jpg`,
          type: 'image/jpeg',
        });
      }

      await reportService.create(formData);

      Toast.show({ type: 'success', text1: '✅ Report submitted!' });
      setTitle('');
      setDescription('');
      setImage(null);
      setType('accident');
      setSeverity('medium');
      router.push('/(tabs)');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Submission failed',
        text2: err.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-dark"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 pt-16">
          <Text className="text-white text-3xl font-bold">🚨 Report Incident</Text>
          <Text className="text-slate-400 mt-1">Help others by reporting road issues</Text>

          {/* Camera */}
          <View className="mt-6">
            <CameraCapture image={image} setImage={setImage} />
          </View>

          {/* Location */}
          <TouchableOpacity
            onPress={refreshLocation}
            className="mt-4 bg-dark-card rounded-xl p-4 flex-row items-center border border-dark-border"
          >
            <Text className="text-2xl mr-3">📍</Text>
            <View className="flex-1">
              <Text className="text-slate-400 text-xs">Location (tap to refresh)</Text>
              <Text className="text-white font-mono text-sm mt-1">
                {location
                  ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                  : 'Getting location...'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Type */}
          <Text className="text-white font-semibold mt-6 mb-3">Incident Type</Text>
          <View className="flex-row flex-wrap gap-2">
            {TYPES.map((t) => (
              <TouchableOpacity
                key={t.key}
                onPress={() => setType(t.key)}
                className={`px-4 py-2 rounded-xl border ${
                  type === t.key
                    ? 'bg-primary border-primary'
                    : 'bg-dark-card border-dark-border'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    type === t.key ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {t.icon} {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Severity */}
          <Text className="text-white font-semibold mt-6 mb-3">Severity</Text>
          <View className="flex-row gap-3">
            {SEVERITIES.map((s) => (
              <TouchableOpacity
                key={s.key}
                onPress={() => setSeverity(s.key)}
                className={`flex-1 py-3 rounded-xl items-center border-2 ${
                  severity === s.key
                    ? `${s.color} border-transparent`
                    : 'bg-dark-card border-dark-border'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    severity === s.key ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Title */}
          <Text className="text-white font-semibold mt-6 mb-2">Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Accident near Kalanki"
            placeholderTextColor="#64748B"
            maxLength={120}
            className="bg-dark-card text-white px-4 py-4 rounded-xl border border-dark-border"
          />

          {/* Description */}
          <Text className="text-white font-semibold mt-4 mb-2">Description (optional)</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what happened..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={4}
            maxLength={1000}
            textAlignVertical="top"
            className="bg-dark-card text-white px-4 py-4 rounded-xl border border-dark-border min-h-[100px]"
          />

          {/* Submit */}
          <View className="mt-8">
            <Button title="Submit Report" onPress={submit} loading={loading} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}