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
import { router, useFocusEffect } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
import { supabase } from '@/lib/supabase';

type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  is_verified: boolean;
};
type Story = { id: string; title: string; cover_color: string; firstChapter: string | null };

export default function ProfileScreen() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [subscriber, setSubscriber] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inline bio editor.
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    setSignedIn(true);

    const { data: p } = await supabase
      .from('users')
      .select('id, username, display_name, bio, is_verified')
      .eq('id', user.id)
      .single();
    const prof = p as Profile | null;
    setProfile(prof);
    if (prof) {
      setDisplayName(prof.display_name);
      setBio(prof.bio ?? '');
    }

    const { data: st } = await supabase
      .from('stories')
      .select('id, title, cover_color, chapters(id, number, published_at)')
      .eq('author_id', user.id)
      .neq('status', 'draft')
      .order('total_reads', { ascending: false });
    setStories(
      ((st ?? []) as any[]).map((s) => {
        const chs = (s.chapters ?? []).filter((c: any) => c.published_at).sort((a: any, b: any) => a.number - b.number);
        return {
          id: s.id,
          title: s.title,
          cover_color: s.cover_color ?? '#4F4AAA',
          firstChapter: chs[0]?.id ?? null,
        };
      })
    );

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('reader_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    setSubscriber(!!sub);

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  async function saveProfile() {
    if (!profile || busy) return;
    setBusy(true);
    await supabase
      .from('users')
      .update({ display_name: displayName.trim() || profile.display_name, bio: bio.trim() })
      .eq('id', profile.id);
    setBusy(false);
    setEditing(false);
    await load();
  }

  async function signOut() {
    await supabase.auth.signOut();
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
            <Text style={styles.avatarText}>
              {(profile?.display_name ?? '?').slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {profile?.display_name}
              {profile?.is_verified && <Text style={styles.tick}> ✓</Text>}
            </Text>
            <Text style={styles.handle}>@{profile?.username}</Text>
          </View>
        </View>

        {editing ? (
          <View style={styles.form}>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Display name"
              placeholderTextColor={colors.inkFaint}
              style={styles.input}
            />
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="A short bio"
              placeholderTextColor={colors.inkFaint}
              multiline
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            />
            <View style={styles.formBtns}>
              <Pressable style={styles.ghostBtn} onPress={() => setEditing(false)}>
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

        <View style={styles.plusCard}>
          <Text style={styles.plusTitle}>
            {subscriber ? 'NovelStack+ active' : 'NovelStack+'}
          </Text>
          <Text style={styles.plusBody}>
            {subscriber
              ? 'Ad-free reading and every chapter unlocked. Thank you for supporting writers.'
              : 'Ad-free reading, every chapter unlocked — $6.99/month. Manage billing on the web.'}
          </Text>
        </View>

        <Text style={styles.section}>Your published stories</Text>
        {stories.length === 0 ? (
          <Text style={styles.empty}>Nothing published yet. Head to the Write tab to start.</Text>
        ) : (
          <View style={styles.grid}>
            {stories.map((s) => (
              <Pressable
                key={s.id}
                style={styles.gridItem}
                onPress={() => router.push(`/story/${s.id}`)}
              >
                <View style={[styles.gridCover, { backgroundColor: s.cover_color }]} />
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
  h1: { fontSize: 28, fontWeight: '500', color: colors.ink, letterSpacing: -0.5 },
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
  },
  avatarText: { fontSize: 24, color: colors.signal, fontWeight: '500' },
  name: { fontSize: 22, fontWeight: '500', color: colors.ink },
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
