import { Platform } from 'react-native';
import { severityConfig } from '../../theme/colors';

// Native only — react-native-maps doesn't work on web
let Marker = null;
if (Platform.OS !== 'web') {
  Marker = require('react-native-maps').Marker;
}

export default function ReportMarker({ report, onPress }) {
  // Skip on web
  if (Platform.OS === 'web' || !Marker) return null;

  const coords = report.location?.coordinates;
  if (!coords || coords.length < 2) return null;

  const severity = severityConfig[report.severity] || severityConfig.medium;

  return (
    <Marker
      coordinate={{
        latitude: coords[1],
        longitude: coords[0],
      }}
      title={report.title}
      description={severity.label}
      pinColor={severity.color}
      onPress={() => onPress?.(report)}
    />
  );
}