import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, severityConfig } from '../../theme/colors';
import { INCIDENT_TYPES } from '../../constants/reportConstants';
import { formatRelativeTime, formatCoordinates } from '../../utils/formatters';

export default function ReportCard({ report, onPress }) {
  const severity = severityConfig[report.severity] || severityConfig.medium;
  const type =
    INCIDENT_TYPES.find((t) => t.key === report.type) || INCIDENT_TYPES[4];
  const coords = report.location?.coordinates;
  const hasAI = report.aiAnalysis?.analyzed;

  return (
    <TouchableOpacity
      onPress={() => onPress?.(report)}
      activeOpacity={0.85}
      className="bg-bg-card rounded-2xl mb-3 border border-bg-border overflow-hidden"
    >
      <View className="flex-row">
        {report.images?.[0]?.url ? (
          <View className="w-24 h-24 relative">
            <Image
              source={{ uri: report.images[0].url }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {hasAI && (
              <View className="absolute top-1.5 left-1.5 bg-bg/90 rounded-md px-1.5 py-0.5 flex-row items-center">
                <Ionicons
                  name="hardware-chip"
                  size={10}
                  color={colors.brand}
                />
                <Text className="text-brand text-2xs font-bold ml-1">AI</Text>
              </View>
            )}
          </View>
        ) : (
          <View
            className="w-24 h-24 items-center justify-center"
            style={{ backgroundColor: `${type.color}20` }}
          >
            <Ionicons name={type.icon} size={32} color={type.color} />
          </View>
        )}

        <View className="flex-1 p-3.5 justify-between">
          <View>
            <View className="flex-row items-start justify-between mb-1">
              <Text
                className="text-content font-bold text-base flex-1 mr-2"
                numberOfLines={1}
              >
                {report.title}
              </Text>
              <View
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: severity.bg }}
              >
                <Text
                  className="text-2xs font-bold tracking-wider"
                  style={{ color: severity.color }}
                >
                  {severity.label.toUpperCase()}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Ionicons
                name="location-outline"
                size={12}
                color={colors.textMuted}
              />
              <Text
                className="text-content-muted text-xs ml-1 flex-1"
                numberOfLines={1}
              >
                {report.address || formatCoordinates(coords, 3)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-content-dim text-2xs font-semibold">
                {formatRelativeTime(report.createdAt).toUpperCase()}
              </Text>
              {hasAI && report.aiAnalysis?.confidence !== undefined && (
                <View className="bg-brand/10 rounded-md px-1.5 py-0.5">
                  <Text className="text-brand text-2xs font-bold">
                    {Math.round(report.aiAnalysis.confidence * 100)}%
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center">
                <Ionicons name="arrow-up" size={12} color={colors.textMuted} />
                <Text className="text-content-muted text-xs ml-1 font-semibold">
                  {report.upvotes || 0}
                </Text>
              </View>
              <View
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor:
                    report.status === 'verified'
                      ? colors.success
                      : report.status === 'pending'
                      ? colors.warning
                      : colors.textDim,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}