import { Tabs } from 'expo-router';
import TabBarIcon from '../../src/components/layout/TabBarIcon';
import { colors } from '../../src/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F1421',
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'MAP',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="map" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'REPORT',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="add-circle" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'ALERTS',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="notifications" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="person" focused={focused} />
          )
        }}
      />
    </Tabs>
  );
}