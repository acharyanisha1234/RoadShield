import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import CameraCapture from '../../src/components/report/CameraCapture';
import Button from '../../src/components/common/Button';
import Input from '../../src/components/common/Input';
import SectionHeader from '../../src/components/common/SectionHeader';
import { reportService } from '../../src/services/reportService';

const TYPES = [
  { key: 'accident', label: 'Accident', icon: '🚗' },
  { key: 'pothole', label: 'Pothole', icon: '🕳️' },
  { key: 'roadwork', label: 'Roadwork', icon: '🚧' },
  { key: 'flood', label: 'Flood', icon: '🌊' },
  { key: 'other', label: 'Other', icon: '⚠️' },
];

const SEVERITIES = [
  { key: 'low', label: 'Low', emoji: '🟢', color: '#00D26A' },
  { key: 'medium', label: 'Medium', emoji: '🟡', color: '#FFB800' },
  { key: 'high', label: 'High', emoji: '🔴', color: '#FF3B3B' },
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
      className="flex-1 bg-bg"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-16">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-content text-3xl font-bold">
              Report Incident
            </Text>
            <Text className="text-content-secondary mt-1 text-sm">
              Help others by reporting road issues
            </Text>
          </View>

          {/* Camera */}
          <CameraCapture image={image} setImage={setImage} />

          {/* Location Card — reference style */}
          <TouchableOpacity
            onPress={refreshLocation}
            activeOpacity={0.85}
            className="mt-4 bg-bg-card rounded-2xl p-4 flex-row items-center border border-bg-border"
          >
            <View className="w-11 h-11 rounded-full bg-brand/15 items-center justify-center mr-3">
              <Text className="text-xl">📍</Text>
            </View>
            <View className="flex-1">
              <Text className="text-content-muted text-2xs font-bold tracking-widest">
                CURRENT LOCATION
              </Text>
              <Text className="text-content font-mono text-sm mt-1">
                {location
                  ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                  : 'Getting location...'}
              </Text>
            </View>
            <Text className="text-content-muted text-lg">↻</Text>
          </TouchableOpacity>

          {/* Incident Type */}
          <SectionHeader title="Incident Type" />
          <View className="flex-row flex-wrap gap-2">
            {TYPES.map((t) => {
              const active = type === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => setType(t.key)}
                  activeOpacity={0.8}
                  className={`px-4 py-3 rounded-2xl border flex-row items-center ${
                    active
                      ? 'bg-brand border-brand'
                      : 'bg-bg-card border-bg-border'
                  }`}
                  style={
                    active
                      ? {
                          shadowColor: '#FF3B3B',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.35,
                          shadowRadius: 10,
                          elevation: 6,
                        }
                      : undefined
                  }
                >
                  <Text className="text-base mr-2">{t.icon}</Text>
                  <Text
                    className={`text-sm font-semibold ${
                      active ? 'text-white' : 'text-content-secondary'
                    }`}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Severity */}
          <SectionHeader title="Severity Level" />
          <View className="flex-row gap-3">
            {SEVERITIES.map((s) => {
              const active = severity === s.key;
              return (
                <TouchableOpacity
                  key={s.key}
                  onPress={() => setSeverity(s.key)}
                  activeOpacity={0.85}
                  className={`flex-1 py-4 rounded-2xl items-center justify-center border ${
                    active ? 'border-transparent' : 'bg-bg-card border-bg-border'
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: s.color,
                          shadowColor: s.color,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.4,
                          shadowRadius: 12,
                          elevation: 8,
                        }
                      : undefined
                  }
                >
                  <Text className="text-2xl mb-1">{s.emoji}</Text>
                  <Text
                    className={`text-xs font-bold tracking-wide ${
                      active ? 'text-white' : 'text-content-secondary'
                    }`}
                  >
                    {s.label.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Title */}
          <SectionHeader title="Details" />
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Accident near Kalanki"
            maxLength={120}
            icon="📝"
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what happened..."
            multiline
            numberOfLines={4}
            maxLength={1000}
            icon="💬"
          />

          {/* Submit */}
          <View className="mt-6">
            <Button
              title="Submit Report"
              onPress={submit}
              loading={loading}
              icon="🚀"
              size="lg"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}