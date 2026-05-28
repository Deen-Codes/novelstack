import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiSend } from '@/lib/api';
import { signOut } from '@/lib/auth';

// Settings — the practical drawer pulled out of the profile sheet. Keeps
// the sheet itself a single-glance preview, while the heavier "manage my
// account" actions live one push away from the avatar tap.
export default function SettingsScreen() {
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    if (busy) return;
    setBusy(true);
    await signOut();
    router.replace('/(tabs)');
  }

  function confirmDeleteAccount() {
    Alert.alert(
      'Delete your account?',
      'This permanently deletes your account, your stories and all your data. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete account', style: 'destructive', onPress: deleteAccountNow },
      ],
    );
  }

  async function deleteAccountNow() {
    if (busy) return;
    setBusy(true);
    try {
      await apiSend('/api/me', 'DELETE');
    } catch (e) {
      Alert.alert('Could not delete', e instanceof Error ? e.message : 'Try again.');
      setBusy(false);
      return;
    }
    await signOut();
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.head}>
        <Pressable
          style={styles.back}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.menu}>
          <Row
            icon="person-outline"
            label="Edit profile"
            sub="Name, username, photo, bio, date of birth"
            onPress={() => router.push('/profile')}
          />
          <View style={styles.divider} />
          <Row
            icon="sparkles-outline"
            label="NovelStack+ subscription"
            sub="Manage your membership"
            onPress={() => router.push('/plus')}
          />
          <View style={styles.divider} />
          <Row
            icon="ban-outline"
            label="Blocked users"
            sub="People you've hidden from NovelStack"
            onPress={() => router.push('/blocked')}
          />
        </View>

        <Pressable style={styles.signOut} onPress={handleSignOut} disabled={busy}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>

        <Pressable
          style={styles.deleteAccount}
          onPress={confirmDeleteAccount}
          disabled={busy}
          hitSlop={6}
        >
          <Text style={styles.deleteAccountText}>Delete account</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  sub,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={18} color={colors.inkMuted} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },

  menu: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14 },
  divider: { height: 1, backgroundColor: '#2A231F' },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cardHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 14.5, fontWeight: '500', color: colors.ink },
  sub: { fontSize: 12, color: colors.inkMuted, marginTop: 2 },

  signOut: {
    marginTop: spacing.lg,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
  },
  signOutText: { fontSize: 14, color: colors.inkMuted, fontWeight: '500' },

  deleteAccount: { marginTop: spacing.md, alignItems: 'center', paddingVertical: 8 },
  deleteAccountText: { fontSize: 13, color: '#D9656F', fontWeight: '500' },
});
