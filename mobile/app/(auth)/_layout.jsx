import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

function TabItem({ emoji, focused }) {
  return (
    <View className="items-center justify-center">
      <View
        className={`w-10 h-10 rounded-2xl items-center justify-center ${
          focused ? 'bg-brand/15' : ''
        }`}
      >
        <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>
          {emoji}
        </Text>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F1421',
          borderTopColor: '#232B3D',
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: '#FF3B3B',
        tabBarInactiveTintColor: '#475569',
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
          tabBarIcon: ({ focused }) => <TabItem emoji="🗺️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'REPORT',
          tabBarIcon: ({ focused }) => <TabItem emoji="🚨" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'ALERTS',
          tabBarIcon: ({ focused }) => <TabItem emoji="🔔" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ focused }) => <TabItem emoji="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}