import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import { colors } from '@/theme/tokens';

export default function RootLayout() {
  // Bricolage Grotesque — the display typeface for logo, headings and titles.
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });
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
        <Stack.Screen name="signin" />
        <Stack.Screen name="auth-callback" />
        <Stack.Screen name="plus" />
        <Stack.Screen name="watch-ad" />
        <Stack.Screen name="following" />
      </Stack>
    </>
  );
}
