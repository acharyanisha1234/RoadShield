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
import { format } from 'date-fns';
import { reportService } from '../../src/services/reportService';
import SeverityBadge from '../../src/components/report/SeverityBadge';
import Toast from 'react-native-toast-message';

const typeIcons = {
  accident: '🚗',
  pothole: '🕳️',
  roadwork: '🚧',
  flood: '🌊',
  other: '⚠️',
};

export default function ReportDetail() {
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await reportService.getOne(id);
        setReport(res.data);
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Failed to load' });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleUpvote = async () => {
    setUpvoting(true);
    try {
      const res = await reportService.upvote(id);
      setReport(res.data);
      Toast.show({ type: 'success', text1: '👍 Upvoted' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to upvote' });
    } finally {
      setUpvoting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark justify-center items-center">
        <ActivityIndicator color="#EF4444" size="large" />
      </View>
    );
  }

  if (!report) {
    return (
      <View className="flex-1 bg-dark justify-center items-center">
        <Text className="text-white">Report not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-dark">
      <View className="pt-14 px-6 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-primary text-base">← Back</Text>
        </TouchableOpacity>

        {report.images?.[0]?.url && (
          <Image
            source={{ uri: report.images[0].url }}
            className="w-full h-60 rounded-2xl mb-4"
            resizeMode="cover"
          />
        )}

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-3xl">{typeIcons[report.type] || '⚠️'}</Text>
          <SeverityBadge severity={report.severity} />
        </View>

        <Text className="text-white text-2xl font-bold mb-2">{report.title}</Text>

        <Text className="text-slate-400 text-sm mb-4">
          📍 {report.address || 'Unknown location'} •{' '}
          {format(new Date(report.createdAt), 'PPp')}
        </Text>

        {report.description ? (
          <View className="bg-dark-card rounded-2xl p-4 border border-dark-border mb-4">
            <Text className="text-slate-300 leading-6">{report.description}</Text>
          </View>
        ) : null}

        <View className="bg-dark-card rounded-2xl p-4 border border-dark-border mb-4">
          <Text className="text-slate-400 text-xs mb-1">Reported by</Text>
          <Text className="text-white font-semibold">
            {report.user?.name || 'Anonymous'}
          </Text>
        </View>

        <View className="flex-row items-center justify-between bg-dark-card rounded-2xl p-4 border border-dark-border">
          <View>
            <Text className="text-slate-400 text-xs">Upvotes</Text>
            <Text className="text-white text-2xl font-bold">{report.upvotes || 0}</Text>
          </View>
          <TouchableOpacity
            onPress={handleUpvote}
            disabled={upvoting}
            className="bg-primary px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">
              {upvoting ? '...' : '👍 Upvote'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}