import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGet, apiSend, apiUpload, getSessionToken } from '@/lib/api';
import { getCurrentUser, signOut as clearSessionAuth } from '@/lib/auth';
import { Cover } from '@/components/Cover';
import { DobField } from '@/components/DobField';
import type { User, Shelf, Story } from '@/lib/types';

export default function ProfileScreen() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Inline bio editor.
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);

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

    // Published stories come from the shelf's `writing` list.
    try {
      const shelf = await apiGet<Shelf>('/api/me/shelf');
      setStories(shelf.writing.filter((s) => s.status !== 'draft'));
    } catch {
      setStories([]);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  // Picks a photo, uploads it to R2, and previews it. It persists when the
  // user taps Save (avatarUrl is included in the profile PATCH).
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
    try {
      const updated = await apiSend<User>('/api/me/profile', 'PATCH', {
        displayName: displayName.trim() || profile.displayName,
        username: username.trim().toLowerCase(),
        bio: bio.trim(),
        // Only write DOB when supplied — never clears a stored value.
        ...(dob.trim() ? { dateOfBirth: dob.trim() } : {}),
        ...(avatarUrl ? { avatarUrl } : {}),
      });
      setProfile(updated);
      setEditing(false);
      await load();
    } catch (e) {
      // Keep the editor open and show why (e.g. username taken).
      setError(e instanceof Error ? e.message : 'Could not save. Please try again.');
    }
    setBusy(false);
  }

  async function signOut() {
    await clearSessionAuth();
    setProfile(null);
    setSignedIn(false);
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
        <View style={styles.body}>
          <Text style={styles.h1}>Profile</Text>
          <Text style={styles.sub}>Sign in to manage your account, stories, and NovelStack+.</Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.push('/signin')}>
            <Text style={styles.primaryBtnText}>Sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.avatar}>
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarText}>
                {(profile?.displayName ?? '?').slice(0, 1).toUpperCase()}
              </Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {profile?.displayName}
              {profile?.isVerified && <Text style={styles.tick}> ✓</Text>}
            </Text>
            <Text style={styles.handle}>@{profile?.username}</Text>
          </View>
        </View>

        {editing ? (
          <View style={styles.form}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarLg}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatarLgImg} />
                ) : (
                  <Text style={styles.avatarText}>
                    {(displayName || '?').slice(0, 1).toUpperCase()}
                  </Text>
                )}
              </View>
              <Pressable
                style={[styles.photoBtn, avatarBusy && { opacity: 0.6 }]}
                onPress={pickAvatar}
                disabled={avatarBusy}
              >
                <Text style={styles.photoBtnText}>
                  {avatarBusy ? 'Uploading…' : avatarUrl ? 'Change photo' : 'Add photo'}
                </Text>
              </Pressable>
            </View>
            <View>
              <Text style={styles.fieldLabel}>Display name</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Display name"
                placeholderTextColor={colors.inkFaint}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={styles.fieldLabel}>Username</Text>
              <TextInput
                value={username}
                onChangeText={(t) => setUsername(t.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="username"
                placeholderTextColor={colors.inkFaint}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
              <Text style={styles.fieldHint}>
                Your @handle — 3–24 letters, numbers or underscores. Must be unused.
              </Text>
            </View>
            <View>
              <Text style={styles.fieldLabel}>Bio</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="A short bio"
                placeholderTextColor={colors.inkFaint}
                multiline
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              />
            </View>
            <View>
              <Text style={styles.fieldLabel}>Date of birth</Text>
              <DobField value={dob || null} onChange={setDob} />
              <Text style={styles.fieldHint}>
                Used to confirm your age — mature (18+) stories stay hidden until this is set.
              </Text>
            </View>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.formBtns}>
              <Pressable
                style={styles.ghostBtn}
                onPress={() => {
                  setEditing(false);
                  setError('');
                }}
              >
                <Text style={styles.ghostBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.primaryBtn, { flex: 1 }, busy && { opacity: 0.6 }]}
                onPress={saveProfile}
                disabled={busy}
              >
                <Text style={styles.primaryBtnText}>{busy ? 'Saving…' : 'Save'}</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            {!!profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}
            <Pressable style={styles.editLink} onPress={() => setEditing(true)}>
              <Text style={styles.editLinkText}>Edit profile</Text>
            </Pressable>
          </>
        )}

        <Pressable style={styles.plusCard} onPress={() => router.push('/plus')}>
          <Text style={styles.plusTitle}>NovelStack+</Text>
          <Text style={styles.plusBody}>
            Ad-free reading, every chapter unlocked, offline downloads — $6.99/month.
          </Text>
        </Pressable>

        <Text style={styles.section}>Your published stories</Text>
        {stories.length === 0 ? (
          <Text style={styles.empty}>Nothing published yet. Head to the Write tab to start.</Text>
        ) : (
          <View style={styles.grid}>
            {stories.map((s) => (
              <Pressable
                key={s.id}
                style={styles.gridItem}
                onPress={() => router.push(`/story/${s.slug}`)}
              >
                <Cover
                  coverUrl={s.coverUrl}
                  coverColor={s.coverColor}
                  style={styles.gridCover}
                />
                <Text style={styles.gridTitle}>{s.title}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable style={styles.signOut} onPress={signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  body: { padding: spacing.lg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  h1: { fontFamily: fonts.displayXl, fontSize: 28, color: colors.ink, letterSpacing: -0.6 },
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, lineHeight: 21 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.paperSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 60, height: 60 },
  avatarText: { fontSize: 24, color: colors.signal, fontWeight: '500' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarLg: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.paperSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarLgImg: { width: 72, height: 72 },
  photoBtn: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: colors.white,
  },
  photoBtnText: { fontSize: 13, fontWeight: '500', color: colors.ink },
  name: { fontFamily: fonts.display, fontSize: 22, color: colors.ink },
  tick: { fontSize: 15, color: colors.signal },
  handle: { fontSize: 13, color: colors.inkFaint, marginTop: 2 },
  bio: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.md, lineHeight: 21 },
  editLink: { marginTop: spacing.sm },
  editLinkText: { fontSize: 13, color: colors.signal, fontWeight: '500' },
  form: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: colors.white,
    color: colors.ink,
  },
  errorText: { fontSize: 13, color: colors.signal, lineHeight: 19 },
  fieldLabel: { fontSize: 13, color: colors.inkMuted, marginBottom: 6 },
  fieldHint: { fontSize: 12, color: colors.inkFaint, marginTop: 6, lineHeight: 17 },
  formBtns: { flexDirection: 'row', gap: spacing.sm },
  primaryBtn: {
    backgroundColor: colors.signal,
    paddingVertical: 12,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  primaryBtnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
  ghostBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  ghostBtnText: { color: colors.inkMuted, fontSize: 14, fontWeight: '500' },
  plusCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.paperSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  plusTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  plusBody: { fontSize: 13, color: colors.inkMuted, marginTop: 4, lineHeight: 19 },
  section: { fontSize: 16, fontWeight: '500', color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.md },
  empty: { fontSize: 13, color: colors.inkMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '47%' },
  gridCover: { width: '100%', aspectRatio: 3 / 4, borderRadius: radius.md },
  gridTitle: { fontSize: 13, fontWeight: '500', color: colors.ink, marginTop: 6 },
  signOut: {
    marginTop: spacing.xl,
    paddingVertical: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
  },
  signOutText: { fontSize: 14, color: colors.inkMuted, fontWeight: '500' },
});
