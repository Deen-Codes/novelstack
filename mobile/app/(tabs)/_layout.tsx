import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/tokens';

// Four tabs: Home · Library · Search · Community. Write and Profile are
// reached from the top bar, so they're hidden from the tab bar (href: null)
// while still being navigable routes.
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.signal,
        tabBarInactiveTintColor: '#8A7F73',
        tabBarStyle: {
          backgroundColor: '#0C0A09',
          borderTopColor: colors.borderSoft,
          borderTopWidth: 1,
          height: 94,
          paddingTop: 12,
          paddingBottom: 32,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: 3 },
        tabBarIconStyle: { marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={27} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <Ionicons name="library-outline" size={27} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={27} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={27} color={color} />,
        }}
      />
      {/* Reached from the top bar — navigable, but not shown in the tab bar. */}
      <Tabs.Screen name="write" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
