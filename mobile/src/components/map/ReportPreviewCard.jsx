import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, severityConfig } from '../../theme/colors';
import { INCIDENT_TYPES } from '../../constants/reportConstants';
import { formatRelativeTime } from '../../utils/formatters';

export default function ReportPreviewCard({ report, onPress }) {
  const severity = severityConfig[report.severity] || severityConfig.medium;
  const type =
    INCIDENT_TYPES.find((t) => t.key === report.type) || INCIDENT_TYPES[4];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-bg-card rounded-2xl p-3.5 border border-bg-border mb-2 flex-row items-center"
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: `${type.color}20` }}
      >
        <Ionicons name={type.icon} size={20} color={type.color} />
      </View>

      <View className="flex-1">
        <Text className="text-content font-semibold text-sm" numberOfLines={1}>
          {report.title}
        </Text>
        <View className="flex-row items-center mt-1">
          <View
            className="w-1.5 h-1.5 rounded-full mr-1.5"
            style={{ backgroundColor: severity.color }}
          />
          <Text className="text-content-muted text-2xs">
            {formatRelativeTime(report.createdAt)}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}