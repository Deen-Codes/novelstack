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
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGetCached, apiSend, getSessionToken } from '@/lib/api';
import { GENRES, genreLabel } from '@/lib/genres';
import { Cover } from '@/components/Cover';
import { AmbientGlow } from '@/components/AmbientGlow';
import { SignInPitch } from '@/components/SignInPitch';
import type { Shelf, Story } from '@/lib/types';

export default function Write() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('romance');
  const [desc, setDesc] = useState('');
  const [mature, setMature] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const token = await getSessionToken();
    if (!token) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    try {
      const shelf = await apiGetCached<Shelf>('/api/me/shelf');
      setStories(shelf.writing);
      setSignedIn(true);
    } catch {
      setSignedIn(false);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  async function createStory() {
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      const story = await apiSend<Story>('/api/me/stories', 'POST', {
        title: title.trim(),
        description: desc.trim(),
        genre,
        isMature: mature,
      });
      setTitle('');
      setDesc('');
      setMature(false);
      setCreating(false);
      router.push(`/write/${story.id}`);
    } catch {
      // Leave the form open so the writer can retry.
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
          headline="Start writing on NovelStack"
          sub="Publish your stories chapter by chapter, build a following of readers, and earn from the reader pool."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AmbientGlow />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Write</Text>
        <Text style={styles.sub}>Your stories, drafts and chapters — all in one place.</Text>

        {!creating ? (
          <Pressable style={styles.newCard} onPress={() => setCreating(true)}>
            <View style={styles.newIcon}>
              <Ionicons name="add" size={24} color={colors.signal} />
            </View>
            <View style={styles.newText}>
              <Text style={styles.newTitle}>Start a new story</Text>
              <Text style={styles.newSub}>Set the basics, then write and publish chapters.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
          </Pressable>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>New story</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Story title"
              placeholderTextColor={colors.inkFaint}
              style={styles.input}
            />
            <View style={styles.chips}>
              {GENRES.map((g) => (
                <Pressable
                  key={g.value}
                  style={[styles.chip, genre === g.value && styles.chipActive]}
                  onPress={() => setGenre(g.value)}
                >
                  <Text style={[styles.chipText, genre === g.value && styles.chipTextActive]}>
                    {g.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Short description"
              placeholderTextColor={colors.inkFaint}
              multiline
              style={[styles.input, { height: 76, textAlignVertical: 'top' }]}
            />
            <Pressable style={styles.matureRow} onPress={() => setMature((m) => !m)}>
              <View style={[styles.checkbox, mature && styles.checkboxOn]}>
                {mature && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
              </View>
              <Text style={styles.matureText}>
                Mature (18+) — adult content. Readers confirm their age first.
              </Text>
            </Pressable>
            <View style={styles.formBtns}>
              <Pressable style={styles.ghostBtn} onPress={() => setCreating(false)}>
                <Text style={styles.ghostBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.createBtn, busy && { opacity: 0.6 }]}
                onPress={createStory}
                disabled={busy}
              >
                <Text style={styles.createBtnText}>{busy ? 'Creating…' : 'Create story'}</Text>
              </Pressable>
            </View>
          </View>
        )}

        <Text style={styles.section}>Your stories</Text>
        {stories.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="book-outline" size={22} color={colors.inkFaint} />
            <Text style={styles.empty}>
              No stories yet. Tap “Start a new story” to begin your first.
            </Text>
          </View>
        ) : (
          stories.map((s) => (
            <Pressable
              key={s.id}
              style={styles.storyCard}
              onPress={() => router.push(`/write/${s.id}`)}
            >
              <Cover
                coverUrl={s.coverUrl}
                coverColor={s.coverColor}
                title={s.title}
                mature={s.isMature}
                style={styles.storyCover}
              />
              <View style={styles.storyText}>
                <Text style={styles.storyTitle} numberOfLines={2}>
                  {s.title}
                </Text>
                <Text style={styles.storyGenre}>{genreLabel(s.genre)}</Text>
                <View
                  style={[styles.statusPill, s.status === 'draft' && styles.statusDraft]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      s.status === 'draft' && styles.statusTextDraft,
                    ]}
                  >
                    {s.status}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  h1: { fontFamily: fonts.displayXl, fontSize: 28, color: colors.ink, letterSpacing: -0.6 },
  sub: {
    fontSize: 14,
    color: colors.inkMuted,
    marginTop: spacing.sm,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },

  // New-story call to action.
  newCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
  },
  newIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newText: { flex: 1, minWidth: 0 },
  newTitle: { fontFamily: fonts.display, fontSize: 16, color: colors.ink },
  newSub: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2, lineHeight: 17 },

  // Create form.
  form: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  formTitle: { fontFamily: fonts.display, fontSize: 17, color: colors.ink },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 15,
    backgroundColor: colors.paper,
    color: colors.ink,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: colors.signal, borderColor: colors.signal },
  chipText: { fontSize: 12, color: colors.inkMuted, textTransform: 'capitalize' },
  chipTextActive: { color: '#FFFFFF' },
  matureRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.signal, borderColor: colors.signal },
  matureText: { fontSize: 12, color: colors.inkMuted, flex: 1, lineHeight: 17 },
  formBtns: { flexDirection: 'row', gap: spacing.sm },
  ghostBtn: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostBtnText: { color: colors.inkMuted, fontSize: 14, fontWeight: '600' },
  createBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#F4ECDF',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: { color: '#15100E', fontSize: 15, fontWeight: '700' },

  // Your stories.
  section: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  empty: { flex: 1, fontSize: 13, color: colors.inkMuted, lineHeight: 19 },
  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: 11,
    marginBottom: spacing.sm,
  },
  storyCover: { width: 50, height: 68, borderRadius: 7 },
  storyText: { flex: 1, minWidth: 0, gap: 5 },
  storyTitle: { fontFamily: fonts.display, fontSize: 15.5, color: colors.ink },
  storyGenre: { fontSize: 12, color: colors.inkFaint, textTransform: 'capitalize' },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.signalSoft,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusDraft: { backgroundColor: colors.cardHi },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.signal,
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  statusTextDraft: { color: colors.inkFaint },
});
