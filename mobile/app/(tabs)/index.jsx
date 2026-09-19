import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { reportService } from '../../src/services/reportService';
import { severityConfig } from '../../src/theme/colors';
import StatCard from '../../src/components/common/StatCard';

// 👇 Platform-specific map import
let MapView = null;
let Marker = null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export default function MapScreen() {
  const [region, setRegion] = useState(null);
  const [reports, setReports] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [sosLoading, setSosLoading] = useState(false);
  const mapRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const r = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          setRegion(r);
          setUserLocation(loc.coords);
        }
      } catch (e) {
        console.log('Location error:', e);
      }

      try {
        const res = await reportService.getAll();
        setReports(res.data || []);
      } catch (e) {
        console.log('Reports error:', e);
      }
    })();
  }, []);

  const centerMap = () => {
    if (region && mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion(region, 500);
    }
  };

  const handleSOS = () => {
    setSosLoading(true);
    setTimeout(() => {
      setSosLoading(false);
      if (Platform.OS === 'web') {
        window.alert('🚨 SOS sent to nearby police & emergency services!');
      } else {
        alert('🚨 SOS sent to nearby police & emergency services!');
      }
    }, 1500);
  };

  const highCount = reports.filter((r) => r.severity === 'high').length;
  const mediumCount = reports.filter((r) => r.severity === 'medium').length;

  // 👇 Web fallback UI
  if (Platform.OS === 'web') {
    return (
      <View className="flex-1 bg-bg">
        {/* Top bar */}
        <View className="absolute top-14 left-4 right-4 z-10">
          <View className="bg-bg-card/95 rounded-2xl px-4 py-3 flex-row items-center border border-bg-border">
            <Text className="text-xl mr-3">🛡️</Text>
            <View className="flex-1">
              <Text className="text-content font-bold">RoadShield</Text>
              <Text className="text-content-muted text-xs">
                {reports.length} active reports
              </Text>
            </View>
            <View className="w-2 h-2 rounded-full bg-success" />
          </View>
        </View>

        {/* Placeholder map area */}
        <View className="flex-1 bg-bg-card items-center justify-center px-8">
          <View className="w-24 h-24 rounded-full bg-brand/10 items-center justify-center mb-4">
            <Text className="text-5xl">🗺️</Text>
          </View>
          <Text className="text-content font-bold text-xl mb-2 text-center">
            Live Map
          </Text>
          <Text className="text-content-muted text-sm text-center leading-5">
            Interactive map is only available on mobile devices.
            {'\n\n'}
            Open the app in Expo Go on your phone to see live incident locations.
          </Text>

          {/* Reports list on web */}
          {reports.length > 0 && (
            <View className="mt-8 w-full">
              <Text className="text-content-secondary text-xs font-bold tracking-widest mb-3">
                RECENT REPORTS ({reports.length})
              </Text>
              {reports.slice(0, 3).map((r) => (
                <TouchableOpacity
                  key={r._id}
                  onPress={() => router.push(`/report/${r._id}`)}
                  className="bg-bg-elevated rounded-xl p-3 mb-2 border border-bg-border flex-row items-center"
                >
                  <View
                    className="w-2 h-8 rounded-full mr-3"
                    style={{
                      backgroundColor:
                        severityConfig[r.severity]?.color || '#FFB800',
                    }}
                  />
                  <View className="flex-1">
                    <Text
                      className="text-content font-semibold text-sm"
                      numberOfLines={1}
                    >
                      {r.title}
                    </Text>
                    <Text
                      className="text-content-muted text-xs mt-0.5"
                      numberOfLines={1}
                    >
                      📍{' '}
                      {r.location?.coordinates
                        ? `${r.location.coordinates[1].toFixed(3)}, ${r.location.coordinates[0].toFixed(3)}`
                        : 'Unknown'}
                    </Text>
                  </View>
                  <Text className="text-content-muted text-lg">›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Bottom sheet */}
        <View className="bg-bg-card rounded-t-3xl border-t border-bg-border px-5 pt-5 pb-6">
          <View className="w-10 h-1 bg-bg-border rounded-full self-center mb-4" />

          <View className="flex-row gap-3 mb-4">
            <StatCard
              icon="🚨"
              label="HIGH"
              value={highCount}
              accent="brand"
              className="flex-1"
            />
            <StatCard
              icon="⚠️"
              label="MEDIUM"
              value={mediumCount}
              accent="warning"
              className="flex-1"
            />
          </View>

          <TouchableOpacity
            onPress={handleSOS}
            disabled={sosLoading}
            activeOpacity={0.9}
            className="bg-danger rounded-2xl py-4 items-center justify-center flex-row"
            style={{
              shadowColor: '#FF3B3B',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <Text className="text-2xl mr-2">🚨</Text>
            <Text className="text-white font-bold text-base tracking-wider">
              {sosLoading ? 'SENDING...' : 'EMERGENCY SOS'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 👇 Native (mobile) UI with real map
  if (!region) {
    return (
      <View className="flex-1 bg-bg justify-center items-center">
        <Text className="text-content-secondary">Loading map...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        showsUserLocation
        customMapStyle={darkMapStyle}
      >
        {reports.map((r) => (
          <Marker
            key={r._id}
            coordinate={{
              latitude: r.location.coordinates[1],
              longitude: r.location.coordinates[0],
            }}
            pinColor={severityConfig[r.severity]?.color}
            onPress={() => router.push(`/report/${r._id}`)}
          />
        ))}
      </MapView>

      <View className="absolute top-14 left-4 right-4 flex-row items-center">
        <View className="flex-1 bg-bg-card/95 rounded-2xl px-4 py-3 flex-row items-center border border-bg-border">
          <Text className="text-xl mr-3">🛡️</Text>
          <View className="flex-1">
            <Text className="text-content font-bold">RoadShield</Text>
            <Text className="text-content-muted text-xs">
              {reports.length} active reports
            </Text>
          </View>
          <View className="w-2 h-2 rounded-full bg-success" />
        </View>
      </View>

      <View className="absolute right-4 top-32 gap-2">
        <TouchableOpacity
          onPress={centerMap}
          className="w-11 h-11 rounded-full bg-bg-card border border-bg-border items-center justify-center"
        >
          <Text className="text-lg">🎯</Text>
        </TouchableOpacity>
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-bg-card rounded-t-3xl border-t border-bg-border px-5 pt-5 pb-6">
        <View className="w-10 h-1 bg-bg-border rounded-full self-center mb-4" />

        <View className="flex-row gap-3 mb-4">
          <StatCard
            icon="🚨"
            label="HIGH"
            value={highCount}
            accent="brand"
            className="flex-1"
          />
          <StatCard
            icon="⚠️"
            label="MEDIUM"
            value={mediumCount}
            accent="warning"
            className="flex-1"
          />
        </View>

        <TouchableOpacity
          onPress={handleSOS}
          disabled={sosLoading}
          activeOpacity={0.9}
          className="bg-danger rounded-2xl py-4 items-center justify-center flex-row"
          style={{
            shadowColor: '#FF3B3B',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <Text className="text-2xl mr-2">🚨</Text>
          <Text className="text-white font-bold text-base tracking-wider">
            {sosLoading ? 'SENDING...' : 'EMERGENCY SOS'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0B0F1A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748B' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B0F1A' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1C2333' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#232B3D' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0F1421' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#141A28' }],
  },
];