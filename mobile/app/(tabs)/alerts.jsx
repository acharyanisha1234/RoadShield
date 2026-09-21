import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ReportCard from '../../src/components/report/ReportCard';
import EmptyState from '../../src/components/common/EmptyState';
import { useReports } from '../../src/hooks/useReports';
import { colors } from '../../src/theme/colors';
import { ALERT_FILTERS } from '../../src/constants/reportConstants';

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
    <View className="flex-1 bg-bg">
      <View className="px-5 pt-16 pb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-content text-3xl font-bold">Alerts</Text>
            <Text className="text-content-secondary mt-1 text-sm">
              {reports.length} {reports.length === 1 ? 'report' : 'reports'} nearby
            </Text>
          </View>
          <View className="w-11 h-11 rounded-2xl bg-brand/15 items-center justify-center">
            <Ionicons name="notifications" size={22} color={colors.brand} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerStyle={{ gap: 8 }}
        >
          {ALERT_FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.8}
                className={`px-4 py-2.5 rounded-full border ${
                  active ? 'bg-brand border-brand' : 'bg-bg-card border-bg-border'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    active ? 'text-white' : 'text-content-secondary'
                  }`}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading && reports.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color={colors.brand} size="large" />
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
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
              tintColor={colors.brand}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="checkmark-done-circle-outline"
              title="All clear"
              subtitle="No reports nearby. Roads are looking good."
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}