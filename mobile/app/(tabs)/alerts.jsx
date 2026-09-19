import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import ReportCard from '../../src/components/report/ReportCard';
import { useReports } from '../../src/hooks/useReports';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

export default function AlertsScreen() {
  const { reports, loading, fetchReports } = useReports();
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  const load = useCallback(() => {
    const params = filter === 'all' ? {} : { severity: filter };
    fetchReports(params);
  }, [filter, fetchReports]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View className="flex-1 bg-dark">
      <View className="px-6 pt-16 pb-4">
        <Text className="text-white text-3xl font-bold">🔔 Alerts</Text>
        <Text className="text-slate-400 mt-1">Nearby road incidents</Text>

        <View className="flex-row gap-2 mt-4">
          {FILTERS.map((f) => (
            <View key={f.key} className="mr-2">
              <Text
                onPress={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === f.key
                    ? 'bg-primary text-white'
                    : 'bg-dark-card text-slate-400'
                }`}
              >
                {f.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {loading && reports.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#EF4444" size="large" />
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <ReportCard
              report={item}
              onPress={() => router.push(`/report/${item._id}`)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={load}
              tintColor="#EF4444"
            />
          }
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Text className="text-5xl mb-3">🎉</Text>
              <Text className="text-white font-semibold">No reports</Text>
              <Text className="text-slate-500 text-sm mt-1">
                Everything looks clear
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}