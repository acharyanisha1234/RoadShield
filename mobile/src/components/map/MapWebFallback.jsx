import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, severityConfig } from '../../theme/colors';

/**
 * Report list item for web fallback
 */
function ReportItem({ report, onPress }) {
  const severity = severityConfig[report.severity] || severityConfig.medium;
  const coords = report.location?.coordinates;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-bg-elevated rounded-xl p-3 mb-2 border border-bg-border flex-row items-center"
    >
      <View
        className="w-1 h-10 rounded-full mr-3"
        style={{ backgroundColor: severity.color }}
      />
      <View className="flex-1">
        <Text className="text-content font-semibold text-sm" numberOfLines={1}>
          {report.title}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons
            name="location-outline"
            size={12}
            color={colors.textMuted}
          />
          <Text className="text-content-muted text-xs ml-1" numberOfLines={1}>
            {report.address ||
              (coords
                ? `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`
                : 'Location unavailable')}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

/**
 * Web fallback UI when react-native-maps is not available
 */
export default function MapWebFallback({ reports, onReportPress }) {
  return (
    <View className="flex-1 bg-bg-card items-center justify-center px-6">
      <View className="w-20 h-20 rounded-2xl bg-brand/10 items-center justify-center mb-5">
        <Ionicons name="map-outline" size={40} color={colors.brand} />
      </View>

      <Text className="text-content font-bold text-xl mb-2 text-center">
        Interactive Map
      </Text>

      <Text className="text-content-muted text-sm text-center leading-6 max-w-xs">
        The live map is optimized for mobile devices. Open RoadShield on your
        phone to view real-time incident locations.
      </Text>

      {reports.length > 0 && (
        <View className="mt-8 w-full max-w-md">
          <Text className="text-content-secondary text-xs font-bold tracking-widest mb-3">
            RECENT REPORTS ({reports.length})
          </Text>
          <ScrollView showsVerticalScrollIndicator={false} className="max-h-64">
            {reports.slice(0, 5).map((report) => (
              <ReportItem
                key={report._id}
                report={report}
                onPress={() => onReportPress(report)}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}