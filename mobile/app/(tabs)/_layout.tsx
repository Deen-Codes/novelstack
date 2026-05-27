import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/tokens';

// Tab bar icon that fades + lifts in once on app open, with a per-position
// delay so the five icons wave into place in sequence. After the entrance
// it behaves like a normal icon — colour just follows the active tint.
function WaveIcon({
  name,
  color,
  order,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  order: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        delay: order * 70,
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration: 380,
        delay: order * 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, lift, order]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: lift }] }}>
      <Ionicons name={name} size={26} color={color} />
    </Animated.View>
  );
}

// Five tabs with Home dead-centre: Library · Search · Home · Community · Write.
// Home (index) stays the default route the app opens on. Profile is reached
// from the top-bar avatar, so it stays off the tab bar (href: null).
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.signal,
        tabBarInactiveTintColor: '#8A7F73',
        tabBarStyle: {
          backgroundColor: '#0C0A09',
          borderTopColor: colors.borderSoft,
          borderTopWidth: 1,
          height: 78,
          paddingTop: 14,
          paddingBottom: 30,
        },
        tabBarIconStyle: { marginTop: 0 },
      }}
    >
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => (
            <WaveIcon name="library-outline" color={color} order={0} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <WaveIcon name="search-outline" color={color} order={1} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <WaveIcon name="home-outline" color={color} order={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => (
            <WaveIcon name="people-outline" color={color} order={3} />
          ),
        }}
      />
      <Tabs.Screen
        name="write"
        options={{
          title: 'Write',
          tabBarIcon: ({ color }) => (
            <WaveIcon name="pencil-outline" color={color} order={4} />
          ),
        }}
      />
      {/* Reached from the top-bar avatar — navigable, but not in the tab bar. */}
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
