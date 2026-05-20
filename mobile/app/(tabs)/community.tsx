import { Redirect } from 'expo-router';

// Community was merged into the Home feed (Q3 decision), mirroring the
// web app where /community redirects to the feed. This route is kept
// only so any old deep links / cached navigation still resolve.
export default function Community() {
  return <Redirect href="/(tabs)" />;
}
