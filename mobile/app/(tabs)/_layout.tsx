import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/tokens';

// Tab bar icon that fades + lifts in once on app open, with a per-position
// delay so the five icons wave into place in sequence. After the entrance
// the icon also scales up when its tab is selected and eases back down
// when deselected — adds a beat of life to nav switching.
function WaveIcon({
  name,
  color,
  order,
  focused,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  order: number;
  focused: boolean;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(10)).current;
  // 1 = inactive resting size, 1.18 = focused bump. Spring gives it a touch
  // of bounce on selection and the same physics rides it back down.
  const scale = useRef(new Animated.Value(focused ? 1.18 : 1)).current;

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

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.18 : 1,
      useNativeDriver: true,
      stiffness: 260,
      damping: 18,
      mass: 0.6,
    }).start();
  }, [focused, scale]);

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY: lift }, { scale }] }}
    >
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
          tabBarIcon: ({ color, focused }) => (
            <WaveIcon name="library-outline" color={color} order={0} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <WaveIcon name="search-outline" color={color} order={1} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <WaveIcon name="home-outline" color={color} order={2} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <WaveIcon name="people-outline" color={color} order={3} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="write"
        options={{
          title: 'Write',
          tabBarIcon: ({ color, focused }) => (
            <WaveIcon name="pencil-outline" color={color} order={4} focused={focused} />
          ),
        }}
      />
      {/* Reached from the top-bar avatar — navigable, but not in the tab bar. */}
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
