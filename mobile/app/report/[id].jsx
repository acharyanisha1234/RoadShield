import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { reportService } from '../../src/services/reportService';
import SeverityBadge from '../../src/components/report/SeverityBadge';
import ReportTimeline from '../../src/components/report/ReportTimeline';
import Button from '../../src/components/common/Button';
import { colors } from '../../src/theme/colors';
import { INCIDENT_TYPES, REPORT_STATUS } from '../../src/constants/reportConstants';
import { formatDateTime, formatCoordinates } from '../../src/utils/formatters';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const res = await reportService.getOne(id);
      setReport(res.data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to load report' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    setUpvoting(true);
    try {
      const res = await reportService.upvote(id);
      setReport(res.data);
      Toast.show({ type: 'success', text1: 'Report upvoted' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to upvote' });
    } finally {
      setUpvoting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator color={colors.brand} size="large" />
      </View>
    );
  }

  if (!report) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <Text className="text-content">Report not found</Text>
      </View>
    );
  }

  const type =
    INCIDENT_TYPES.find((t) => t.key === report.type) || INCIDENT_TYPES[4];
  const status = REPORT_STATUS[report.status] || REPORT_STATUS.pending;

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 pt-14 pb-4 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-xl bg-bg-card border border-bg-border items-center justify-center mr-3"
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text className="text-content font-bold text-lg flex-1">
          Report Details
        </Text>
        <View
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: `${status.color}20` }}
        >
          <Text
            className="text-2xs font-bold tracking-wider"
            style={{ color: status.color }}
          >
            {status.label.toUpperCase()}
          </Text>
        </View>
      </View>

      {report.images?.[0]?.url ? (
        <Image
          source={{ uri: report.images[0].url }}
          className="w-full h-64"
          resizeMode="cover"
        />
      ) : (
        <View
          className="w-full h-40 items-center justify-center"
          style={{ backgroundColor: `${type.color}15` }}
        >
          <Ionicons name={type.icon} size={64} color={type.color} />
        </View>
      )}

      <View className="px-5 pt-5">
        <View className="flex-row items-start justify-between mb-3">
          <Text className="text-content text-2xl font-bold flex-1 mr-3">
            {report.title}
          </Text>
          <SeverityBadge severity={report.severity} />
        </View>

        <View className="flex-row items-center flex-wrap gap-4 mb-4">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text className="text-content-muted text-xs ml-1.5">
              {formatDateTime(report.createdAt)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name={type.icon} size={14} color={colors.textMuted} />
            <Text className="text-content-muted text-xs ml-1.5">
              {type.label}
            </Text>
          </View>
        </View>

        <View className="bg-bg-card rounded-2xl p-4 border border-bg-border flex-row items-center mb-4">
          <View className="w-11 h-11 rounded-xl bg-brand/15 items-center justify-center mr-3">
            <Ionicons name="location" size={22} color={colors.brand} />
          </View>
          <View className="flex-1">
            <Text className="text-content-muted text-2xs font-bold tracking-widest">
              LOCATION
            </Text>
            <Text className="text-content font-medium text-sm mt-1">
              {report.address || formatCoordinates(report.location?.coordinates)}
            </Text>
          </View>
        </View>

        {report.description && (
          <View className="mb-4">
            <Text className="text-content-muted text-2xs font-bold tracking-widest mb-2">
              DESCRIPTION
            </Text>
            <View className="bg-bg-card rounded-2xl p-4 border border-bg-border">
              <Text className="text-content-secondary leading-6">
                {report.description}
              </Text>
            </View>
          </View>
        )}

        <View className="mb-4">
          <Text className="text-content-muted text-2xs font-bold tracking-widest mb-2">
            REPORTER
          </Text>
          <View className="bg-bg-card rounded-2xl p-4 border border-bg-border flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-bg-elevated items-center justify-center mr-3">
              <Ionicons name="person" size={20} color={colors.textSecondary} />
            </View>
            <Text className="text-content font-semibold">
              {report.user?.name || 'Anonymous'}
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-content-muted text-2xs font-bold tracking-widest mb-2">
            TIMELINE
          </Text>
          <ReportTimeline report={report} />
        </View>

        <View className="bg-bg-card rounded-2xl p-4 border border-bg-border flex-row items-center justify-between">
          <View>
            <Text className="text-content-muted text-2xs font-bold tracking-widest">
              UPVOTES
            </Text>
            <Text className="text-content text-2xl font-bold mt-1">
              {report.upvotes || 0}
            </Text>
          </View>
          <Button
            title="Upvote"
            onPress={handleUpvote}
            loading={upvoting}
            icon="arrow-up-circle"
            size="md"
            fullWidth={false}
            className="px-6"
          />
        </View>
      </View>
    </ScrollView>
  );
}