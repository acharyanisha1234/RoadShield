import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import CameraCapture from '../../src/components/report/CameraCapture';
import TypeChip from '../../src/components/report/TypeChip';
import SeveritySelector from '../../src/components/report/SeveritySelector';
import LocationCard from '../../src/components/report/LocationCard';
import Button from '../../src/components/common/Button';
import Input from '../../src/components/common/Input';
import SectionHeader from '../../src/components/common/SectionHeader';

import { reportService } from '../../src/services/reportService';
import { INCIDENT_TYPES, REPORT_LIMITS } from '../../src/constants/reportConstants';

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
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Location permission denied' });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc.coords);
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const handleRefreshLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      Toast.show({ type: 'success', text1: 'Location updated' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to get location' });
    }
  };

  const handleSubmit = async () => {
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

      Toast.show({ type: 'success', text1: 'Report submitted successfully' });

      setTitle('');
      setDescription('');
      setImage(null);
      setType('accident');
      setSeverity('medium');

      router.push('/(tabs)');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Submission failed',
        text2: error.response?.data?.message || error.message,
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
          <View className="mb-6">
            <Text className="text-content text-3xl font-bold">
              Report Incident
            </Text>
            <Text className="text-content-secondary mt-1 text-sm">
              Help others by reporting road issues
            </Text>
          </View>

          <CameraCapture image={image} setImage={setImage} />

          <View className="mt-4">
            <LocationCard location={location} onRefresh={handleRefreshLocation} />
          </View>

          <SectionHeader title="Incident Type" className="mt-6" />
          <View className="flex-row flex-wrap gap-2">
            {INCIDENT_TYPES.map((t) => (
              <TypeChip
                key={t.key}
                type={t}
                active={type === t.key}
                onPress={() => setType(t.key)}
              />
            ))}
          </View>

          <SectionHeader title="Severity Level" className="mt-6" />
          <SeveritySelector value={severity} onChange={setSeverity} />

          <SectionHeader title="Details" className="mt-6" />

          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Accident near Kalanki"
            maxLength={REPORT_LIMITS.TITLE_MAX}
            icon="create-outline"
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what happened..."
            multiline
            numberOfLines={4}
            maxLength={REPORT_LIMITS.DESCRIPTION_MAX}
            icon="chatbubble-outline"
          />

          <View className="mt-6">
            <Button
              title="Submit Report"
              onPress={handleSubmit}
              loading={loading}
              icon="checkmark-circle"
              size="lg"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}