import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { formatDateTime } from '../../utils/formatters';

function TimelineItem({ icon, label, value, color, isLast }) {
  return (
    <View className="flex-row">
      <View className="items-center mr-3">
        <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name={icon} size={14} color={color} />
        </View>
        {!isLast && (
          <View
            className="w-px flex-1 my-1"
            style={{ backgroundColor: colors.border }}
          />
        )}
      </View>

      <View className="flex-1 pb-4">
        <Text className="text-content-muted text-2xs font-bold tracking-widest">
          {label}
        </Text>
        <Text className="text-content text-sm mt-1">{value}</Text>
      </View>
    </View>
  );
}

export default function ReportTimeline({ report }) {
  const items = [
    {
      icon: 'add-circle',
      label: 'REPORTED',
      value: formatDateTime(report.createdAt),
      color: colors.info,
    },
    {
      icon: 'shield-checkmark',
      label: 'STATUS',
      value: (report.status || 'pending').toUpperCase(),
      color: colors.warning,
    },
    {
      icon: 'location',
      label: 'LOCATION',
      value:
        report.address ||
        `${report.location?.coordinates?.[1]?.toFixed(4)}, ${report.location?.coordinates?.[0]?.toFixed(4)}`,
      color: colors.brand,
    },
  ];

  return (
    <View className="bg-bg-card rounded-2xl p-4 border border-bg-border">
      {items.map((item, index) => (
        <TimelineItem
          key={item.label}
          {...item}
          isLast={index === items.length - 1}
        />
      ))}
    </View>
  );
}