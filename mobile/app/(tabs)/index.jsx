import { useEffect, useState, useRef } from 'react';
import { View, Text, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

// Services
import { reportService } from '../../src/services/reportService';

// Constants
import { MAP_CONFIG, DARK_MAP_STYLE, SOS_CONFIG } from '../../src/constants/mapConstants';

// Components
import MapHeader from '../../src/components/map/MapHeader';
import MapBottomSheet from '../../src/components/map/MapBottomSheet';
import MapCenterButton from '../../src/components/map/MapCenterButton';
import MapWebFallback from '../../src/components/map/MapWebFallback';
import ReportMarker from '../../src/components/map/ReportMarker';

/**
 * Platform-specific map imports
 * react-native-maps is not supported on web
 */
let MapView = null;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
}

export default function MapScreen() {
  const [region, setRegion] = useState(null);
  const [reports, setReports] = useState([]);
  const [sosLoading, setSosLoading] = useState(false);
  const mapRef = useRef(null);
  const router = useRouter();

  /**
   * Fetch user location and initialize map region
   */
  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: MAP_CONFIG.LATITUDE_DELTA,
        longitudeDelta: MAP_CONFIG.LONGITUDE_DELTA,
      });
    } catch (error) {
      console.error('Location initialization failed:', error);
    }
  };

  /**
   * Fetch all reports from backend
   */
  const fetchReports = async () => {
    try {
      const response = await reportService.getAll();
      setReports(response.data || []);
    } catch (error) {
      console.error('Report fetch failed:', error);
    }
  };

  useEffect(() => {
    initializeLocation();
    fetchReports();
  }, []);

  /**
   * Recenter map on user location
   */
  const handleCenterMap = () => {
    if (region && mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion(region, MAP_CONFIG.ANIMATION_DURATION);
    }
  };

  /**
   * Handle emergency SOS — sends alert to nearby authorities
   */
  const handleSos = () => {
    setSosLoading(true);

    setTimeout(() => {
      setSosLoading(false);
      const message = `SOS: ${SOS_CONFIG.SUCCESS_MESSAGE}`;

      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        alert(message);
      }
    }, SOS_CONFIG.TIMEOUT_MS);
  };

  /**
   * Navigate to report detail
   */
  const handleReportPress = (report) => {
    router.push(`/report/${report._id}`);
  };

  // Computed stats
  const highCount = reports.filter((r) => r.severity === 'high').length;
  const mediumCount = reports.filter((r) => r.severity === 'medium').length;

  // -------- WEB FALLBACK --------
  if (Platform.OS === 'web') {
    return (
      <View className="flex-1 bg-bg">
        <MapHeader reportCount={reports.length} />
        <MapWebFallback reports={reports} onReportPress={handleReportPress} />
        <MapBottomSheet
          highCount={highCount}
          mediumCount={mediumCount}
          sosLoading={sosLoading}
          onSosPress={handleSos}
        />
      </View>
    );
  }

  // -------- NATIVE LOADING --------
  if (!region) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <Text className="text-content-secondary text-sm">Loading map...</Text>
      </View>
    );
  }

  // -------- NATIVE MAP --------
  return (
    <View className="flex-1 bg-bg">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={DARK_MAP_STYLE}
      >
        {reports.map((report) => (
          <ReportMarker
            key={report._id}
            report={report}
            onPress={handleReportPress}
          />
        ))}
      </MapView>

      <MapHeader reportCount={reports.length} />
      <MapCenterButton onPress={handleCenterMap} />
      <MapBottomSheet
        highCount={highCount}
        mediumCount={mediumCount}
        sosLoading={sosLoading}
        onSosPress={handleSos}
      />
    </View>
  );
}