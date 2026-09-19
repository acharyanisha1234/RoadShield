import { View, Text, TouchableOpacity, Image } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import SeverityBadge from './SeverityBadge';

const typeLabels = {
  accident: 'Accident',
  pothole: 'Pothole',
  roadwork: 'Roadwork',
  flood: 'Flood',
  other: 'Other',
};

export default function ReportCard({ report, onPress }) {
  const created = report.createdAt
    ? formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })
    : 'Just now';

  return (
    <TouchableOpacity
      onPress={() => onPress?.(report)}
      className="bg-dark-card rounded-2xl mb-3 border border-dark-border overflow-hidden active:opacity-90"
    >
      {report.images?.[0]?.url && (
        <Image
          source={{ uri: report.images[0].url }}
          className="w-full h-40"
          resizeMode="cover"
        />
      )}

      <View className="p-4">
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 mr-3">
            <Text className="text-slate-400 text-xs font-medium mb-1 uppercase">
              {typeLabels[report.type] || 'Other'}
            </Text>

            <Text
              className="text-white font-bold text-base"
              numberOfLines={1}
            >
              {report.title}
            </Text>
          </View>

          <SeverityBadge severity={report.severity} />
        </View>

        {report.description ? (
          <Text
            className="text-slate-400 text-sm mb-3"
            numberOfLines={2}
          >
            {report.description}
          </Text>
        ) : null}

        <View className="flex-row items-center justify-between">
          <Text
            className="text-slate-500 text-xs flex-1 mr-3"
            numberOfLines={1}
          >
            {report.address || 'Unknown location'}
          </Text>

          <Text className="text-slate-500 text-xs">
            {created}
          </Text>
        </View>

        <View className="flex-row items-center mt-3 pt-3 border-t border-dark-border">
          <Text className="text-slate-500 text-xs mr-4">
            {report.upvotes || 0} Upvotes
          </Text>

          <Text
            className="text-slate-500 text-xs flex-1"
            numberOfLines={1}
          >
            {report.user?.name || 'Anonymous'}
          </Text>

          <Text className="text-slate-500 text-xs capitalize">
            {report.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}