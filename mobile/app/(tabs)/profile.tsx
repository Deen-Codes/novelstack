import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiSend, apiUpload, getSessionToken } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { DobField } from '@/components/DobField';
import { AmbientGlow } from '@/components/AmbientGlow';
import { SignInPitch } from '@/components/SignInPitch';
import { Avatar } from '@/components/Avatar';
import type { User } from '@/lib/types';

// One screen, no modes: the photo, name and username are tap-to-edit, the bio
// and date of birth edit inline, and a single Save persists everything.
export default function ProfileScreen() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  // Which inline field is open for editing (name / username), if any.
  const [editField, setEditField] = useState<'name' | 'username' | null>(null);

  const load = useCallback(async () => {
    const token = await getSessionToken();
    if (!token) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    const user = await getCurrentUser();
    if (!user) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    setSignedIn(true);
    setProfile(user);
    setDisplayName(user.displayName);
    setUsername(user.username);
    setBio(user.bio ?? '');
    setDob(user.dateOfBirth ?? '');
    setAvatarUrl(user.avatarUrl ?? null);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setSaved(false);
      load();
    }, [load]),
  );

  async function pickAvatar() {
    if (avatarBusy) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError('Photo access is needed to set a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setAvatarBusy(true);
    setError('');
    try {
      const ext = (asset.uri.split('.').pop() || 'jpg').toLowerCase();
      const type =
        ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      const { coverUrl } = await apiUpload<{ coverUrl: string }>('/api/me/cover', {
        uri: asset.uri,
        name: `avatar.${ext}`,
        type,
      });
      setAvatarUrl(coverUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not upload photo.');
    }
    setAvatarBusy(false);
  }

  async function saveProfile() {
    if (!profile || busy) return;
    setBusy(true);
    setError('');
    setSaved(false);
    try {
      const updated = await apiSend<User>('/api/me/profile', 'PATCH', {
        displayName: displayName.trim() || profile.displayName,
        username: username.trim().toLowerCase(),
        bio: bio.trim(),
        ...(dob.trim() ? { dateOfBirth: dob.trim() } : {}),
        // Always send avatarUrl so `null` (Remove photo) is persisted, not
        // dropped. Treat empty string as null for safety.
        avatarUrl: avatarUrl || null,
      });
      setProfile(updated);
      setEditField(null);
      setSaved(true);
    } catch (e) {
      // The server rejects a taken username — surface it here.
      setError(e instanceof Error ? e.message : 'Could not save. Please try again.');
    }
    setBusy(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (signedIn === false) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <AmbientGlow />
        <SignInPitch
          headline="Your NovelStack account"
          sub="Sign in to manage your profile, your library and NovelStack+."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Photo — tap the avatar to upload, tap "Remove photo" below to
            clear back to a hash-picked default. */}
        <Pressable style={styles.avatarWrap} onPress={pickAvatar} disabled={avatarBusy}>
          <Avatar url={avatarUrl} seed={profile?.id ?? username} size={96} />
          <View style={styles.cameraBadge}>
            {avatarBusy ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="camera" size={15} color="#FFFFFF" />
            )}
          </View>
        </Pressable>
        {avatarUrl && (
          <Pressable
            style={styles.removePhoto}
            onPress={() => setAvatarUrl(null)}
            hitSlop={6}
          >
            <Text style={styles.removePhotoText}>Remove photo</Text>
          </Pressable>
        )}

        {/* Name + username — tap the pencil to edit each */}
        <View style={styles.field}>
          <View style={styles.fieldMain}>
            <Text style={styles.fieldLabel}>Name</Text>
            {editField === 'name' ? (
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Display name"
                placeholderTextColor={colors.inkFaint}
                autoFocus
                onBlur={() => setEditField(null)}
                style={styles.fieldInput}
              />
            ) : (
              <Text style={styles.fieldValue}>{displayName || '—'}</Text>
            )}
          </View>
          <Pressable
            style={styles.editBtn}
            hitSlop={8}
            onPress={() => setEditField(editField === 'name' ? null : 'name')}
          >
            <Ionicons name="pencil" size={15} color={colors.signal} />
          </Pressable>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldMain}>
            <Text style={styles.fieldLabel}>Username</Text>
            {editField === 'username' ? (
              <TextInput
                value={username}
                onChangeText={(t) =>
                  setUsername(t.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                }
                placeholder="username"
                placeholderTextColor={colors.inkFaint}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                onBlur={() => setEditField(null)}
                style={styles.fieldInput}
              />
            ) : (
              <Text style={styles.fieldValue}>@{username}</Text>
            )}
          </View>
          <Pressable
            style={styles.editBtn}
            hitSlop={8}
            onPress={() => setEditField(editField === 'username' ? null : 'username')}
          >
            <Ionicons name="pencil" size={15} color={colors.signal} />
          </Pressable>
        </View>
        {editField === 'username' && (
          <Text style={styles.hint}>
            3–24 letters, numbers or underscores. Must be unused.
          </Text>
        )}

        {/* Bio */}
        <Text style={styles.blockLabel}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="A short bio"
          placeholderTextColor={colors.inkFaint}
          multiline
          style={styles.bioInput}
        />

        {/* Date of birth */}
        <Text style={styles.blockLabel}>Date of birth</Text>
        <DobField value={dob || null} onChange={setDob} />
        <Text style={styles.hint}>
          Confirms your age — mature (18+) stories stay hidden until this is set.
        </Text>

        {!!error && <Text style={styles.error}>{error}</Text>}
        {saved && !error && <Text style={styles.savedNote}>Profile saved.</Text>}

        <Pressable
          style={[styles.saveBtn, busy && { opacity: 0.6 }]}
          onPress={saveProfile}
          disabled={busy}
        >
          <Text style={styles.saveBtnText}>{busy ? 'Saving…' : 'Save changes'}</Text>
        </Pressable>

        {/* Earnings, Blocked users, Sign out and Delete account all live in
            Settings now — reached from the profile bottom sheet → Settings —
            so they don't crowd the editing form. */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },

  avatarWrap: { alignSelf: 'center', marginTop: spacing.sm },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 96, height: 96 },
  avatarText: { fontSize: 38, color: colors.ink, fontWeight: '600' },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.signal,
    borderWidth: 3,
    borderColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tap to clear an uploaded photo and fall back to a default avatar.
  removePhoto: { alignSelf: 'center', paddingVertical: 8, marginTop: 4 },
  removePhotoText: { fontSize: 13, color: colors.signal, fontWeight: '600' },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  fieldMain: { flex: 1, minWidth: 0 },
  fieldLabel: {
    fontSize: 11,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  fieldValue: { fontSize: 17, color: colors.ink, fontWeight: '500' },
  fieldInput: { fontSize: 17, color: colors.ink, fontWeight: '500', padding: 0 },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  blockLabel: {
    fontSize: 11,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.lg,
    marginBottom: 8,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 15,
    minHeight: 78,
    textAlignVertical: 'top',
    backgroundColor: colors.card,
    color: colors.ink,
  },
  hint: { fontSize: 12, color: colors.inkFaint, marginTop: 7, lineHeight: 17 },
  error: { fontSize: 13, color: colors.signal, marginTop: spacing.md },
  savedNote: { fontSize: 13, color: '#7FB08A', marginTop: spacing.md },

  saveBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F4ECDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  saveBtnText: { color: '#15100E', fontSize: 15, fontWeight: '700' },

  plusCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  plusTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  plusIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusTitle: { fontFamily: fonts.display, fontSize: 15.5, color: colors.ink },
  plusPlan: { fontSize: 12.5, color: colors.inkMuted, marginTop: 1 },
  plusBtn: {
    marginTop: spacing.md,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.signal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  linkIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTitle: { fontFamily: fonts.display, fontSize: 15, color: colors.ink },
  linkSub: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2 },

  signOut: {
    marginTop: spacing.md,
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
