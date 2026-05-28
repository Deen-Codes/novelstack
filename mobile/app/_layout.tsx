import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import { colors } from '@/theme/tokens';
import { registerForPush } from '@/lib/push';
import { configurePurchases } from '@/lib/iap';
import { initAds } from '@/lib/ads';

export default function RootLayout() {
  // Bricolage Grotesque — the display typeface for logo, headings and titles.
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });
  // Set up push + in-app purchases on launch. Both are no-ops when signed
  // out, on a simulator, or before their account keys are configured.
  useEffect(() => {
    configurePurchases();
    registerForPush();
    initAds();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.paper },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="read/[id]" />
        <Stack.Screen name="story/[id]" />
        <Stack.Screen name="write/[storyId]" />
        <Stack.Screen name="write/chapter/[id]" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="auth-callback" />
        <Stack.Screen name="plus" />
        <Stack.Screen name="watch-ad" />
        <Stack.Screen name="following" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="post/[id]" />
        <Stack.Screen name="compose" options={{ presentation: 'modal' }} />
        <Stack.Screen name="u/[username]" />
        <Stack.Screen name="blocked" />
      </Stack>
    </>
  );
}
