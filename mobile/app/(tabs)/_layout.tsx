import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/tokens';

// Five tabs with Home dead-centre: Library · Search · Home · Community · Write.
// Home (index) stays the default route the app opens on. Profile is reached
// from the top-bar avatar, so it stays off the tab bar (href: null).
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
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <Ionicons name="library-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="write"
        options={{
          title: 'Write',
          tabBarIcon: ({ color }) => <Ionicons name="pencil-outline" size={26} color={color} />,
        }}
      />
      {/* Reached from the top-bar avatar — navigable, but not in the tab bar. */}
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
