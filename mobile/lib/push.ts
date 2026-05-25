// NovelStack — push notification registration.
// Asks for permission, gets the device's Expo push token, and registers it
// with the API so the server can deliver lock-screen notifications.
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { apiSend, getSessionToken } from './api';

// How a notification behaves while the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let registered = false;

// Registers this device for push. Safe to call repeatedly and on every app
// start. No-ops quietly when push isn't available yet — e.g. before `eas init`
// supplies a project id, on a simulator, or if the user declines permission.
export async function registerForPush(): Promise<void> {
  if (registered) return;
  try {
    // Only meaningful for a signed-in user — the token is stored against them.
    const session = await getSessionToken();
    if (!session) return;

    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== 'granted') {
      const asked = await Notifications.requestPermissionsAsync();
      status = asked.status;
    }
    if (status !== 'granted') return;

    const extra = Constants.expoConfig?.extra as
      | { eas?: { projectId?: string } }
      | undefined;
    const projectId = extra?.eas?.projectId;
    if (!projectId) return; // EAS project not set up yet.

    const tokenResult = await Notifications.getExpoPushTokenAsync({ projectId });
    if (!tokenResult?.data) return;

    await apiSend('/api/me/push-token', 'POST', {
      token: tokenResult.data,
      platform: Platform.OS,
    });
    registered = true;
  } catch {
    // Best-effort — push setup must never block app start or sign-in.
  }
}
