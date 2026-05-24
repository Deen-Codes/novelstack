import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/theme/tokens';

export default function RootLayout() {
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
      </Stack>
    </>
  );
}
