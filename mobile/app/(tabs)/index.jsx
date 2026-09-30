import { useEffect, useState, useRef } from 'react';
import { View, Text, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { reportService } from '../../src/services/reportService';
import { MAP_CONFIG, DARK_MAP_STYLE, SOS_CONFIG } from '../../src/constants/mapConstants';
import { useSocket } from '../../src/hooks/useSocket';

import MapHeader from '../../src/components/map/MapHeader';
import MapBottomSheet from '../../src/components/map/MapBottomSheet';
import MapCenterButton from '../../src/components/map/MapCenterButton';
import MapWebFallback from '../../src/components/map/MapWebFallback';

// Conditional import — react-native-maps is native-only
let MapView = null;
let ReportMarker = null;

if (Platform.OS !== 'web') {
  try {
    MapView = require('react-native-maps').default;
    ReportMarker = require('../../src/components/map/ReportMarker').default;
  } catch (error) {
    console.warn('[MapScreen] react-native-maps unavailable:', error.message);
    MapView = null;
    ReportMarker = null;
  }
}

export default function MapScreen() {
  const [region, setRegion] = useState(null);
  const [reports, setReports] = useState([]);
  const [sosLoading, setSosLoading] = useState(false);
  const mapRef = useRef(null);
  const router = useRouter();

  const {
    onNewReport,
    onReportUpdate,
    onSosAlert,
    updateLocation,
    triggerSos,
  } = useSocket();

  // -------- LOCATION --------
  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('[MapScreen] Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: MAP_CONFIG.LATITUDE_DELTA,
        longitudeDelta: MAP_CONFIG.LONGITUDE_DELTA,
      };
      setRegion(newRegion);
      updateLocation(newRegion.latitude, newRegion.longitude);
    } catch (error) {
      console.error('[MapScreen] Location error:', error);
    }
  };

  // -------- FETCH REPORTS --------
  const fetchReports = async () => {
    try {
      const response = await reportService.getAll();
      setReports(response.data || []);
    } catch (error) {
      console.error('[MapScreen] Reports error:', error);
    }
  };

  useEffect(() => {
    initializeLocation();
    fetchReports();
  }, []);

  // -------- REAL-TIME: NEW REPORT --------
  useEffect(() => {
    const cleanup = onNewReport(({ report }) => {
      setReports((prev) => {
        const exists = prev.find((r) => r._id === report._id);
        if (exists) return prev;
        return [report, ...prev];
      });

      Toast.show({
        type: 'info',
        text1: 'New incident reported',
        text2: report.title,
      });
    });

    return cleanup;
  }, [onNewReport]);

  // -------- REAL-TIME: REPORT UPDATE --------
  useEffect(() => {
    const cleanup = onReportUpdate(({ report }) => {
      setReports((prev) =>
        prev.map((r) => (r._id === report._id ? report : r))
      );
    });

    return cleanup;
  }, [onReportUpdate]);

  // -------- REAL-TIME: SOS ALERT --------
  useEffect(() => {
    const cleanup = onSosAlert((data) => {
      Toast.show({
        type: 'error',
        text1: 'SOS Alert',
        text2: `${data.userName} needs help nearby`,
        visibilityTime: 5000,
      });
    });

    return cleanup;
  }, [onSosAlert]);

  // -------- HANDLERS --------
  const handleCenterMap = () => {
    if (region && mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion(region, MAP_CONFIG.ANIMATION_DURATION);
    }
  };

  const handleSos = () => {
    setSosLoading(true);

    const send = () => {
      if (region) {
        triggerSos(region.latitude, region.longitude);
      }

      setSosLoading(false);
      const message = `SOS: ${SOS_CONFIG.SUCCESS_MESSAGE}`;

      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') window.alert(message);
      } else {
        alert(message);
      }
    };

    setTimeout(send, SOS_CONFIG.TIMEOUT_MS);
  };

  const handleReportPress = (report) => {
    router.push(`/report/${report._id}`);
  };

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
  if (!region || !MapView) {
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
        {ReportMarker &&
          reports.map((report) => (
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