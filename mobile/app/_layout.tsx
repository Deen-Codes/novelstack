import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
// Default-cover variant fonts — one weight each, latin only.
// Loaded once on app start so the typographic covers render correctly
// on first paint. See components/DefaultCover.tsx.
import { InterTight_900Black } from '@expo-google-fonts/inter-tight';
import { Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import { Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { Sora_700Bold } from '@expo-google-fonts/sora';
import { Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import { IBMPlexMono_700Bold } from '@expo-google-fonts/ibm-plex-mono';
import { colors } from '@/theme/tokens';
import { registerForPush } from '@/lib/push';
import { configurePurchases } from '@/lib/iap';
import { initAds } from '@/lib/ads';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Display family — logo, headings, titles.
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    // Cover-variant fonts — used by DefaultCover.
    InterTight_900Black,
    Fraunces_700Bold,
    Manrope_800ExtraBold,
    Sora_700Bold,
    Outfit_800ExtraBold,
    SpaceGrotesk_700Bold,
    DMSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    IBMPlexMono_700Bold,
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
