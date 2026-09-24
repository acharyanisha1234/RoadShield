import { Marker } from 'react-native-maps';
import { severityConfig } from '../../theme/colors';

export default function ReportMarker({ report, onPress }) {
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