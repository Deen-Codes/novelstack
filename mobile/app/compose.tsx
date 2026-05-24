import { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGet, apiSend } from '@/lib/api';
import { Cover } from '@/components/Cover';
import type { Shelf, Story } from '@/lib/types';

const MAX = 500;

// Compose a community update — short text, optionally attaching one of your
// own books. Reached from the Community composer.
export default function Compose() {
  const [body, setBody] = useState('');
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [attached, setAttached] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    apiGet<Shelf>('/api/me/shelf')
      .then((s) => {
        if (!cancelled) setMyStories(s.writing ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function post() {
    if (busy || !body.trim()) return;
    setBusy(true);
    setError('');
    try {
      await apiSend('/api/posts', 'POST', { body: body.trim(), storyId: attached });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not post your update.');
      setBusy(false);
    }
  }

  const canPost = body.trim().length > 0 && !busy;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.head}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>New update</Text>
        <Pressable
          style={[styles.postBtn, !canPost && styles.postBtnOff]}
          onPress={post}
          disabled={!canPost}
        >
          <Text style={[styles.postBtnText, !canPost && styles.postBtnTextOff]}>
            {busy ? 'Posting…' : 'Post'}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Tell your readers what's new — a chapter dropping, a milestone, a thought…"
          placeholderTextColor={colors.inkFaint}
          multiline
          autoFocus
          maxLength={MAX}
          style={styles.input}
        />
        <Text style={styles.counter}>
          {body.length}/{MAX}
        </Text>
        {!!error && <Text style={styles.error}>{error}</Text>}

        {myStories.length > 0 && (
          <>
            <Text style={styles.label}>Attach a book (optional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.books}
            >
              {myStories.map((s) => {
                const on = attached === s.id;
                return (
                  <Pressable
                    key={s.id}
                    style={[styles.book, on && styles.bookOn]}
                    onPress={() => setAttached(on ? null : s.id)}
                  >
                    <Cover
                      coverUrl={s.coverUrl}
                      coverColor={s.coverColor}
                      title={s.title}
                      mature={s.isMature}
                      style={styles.bookCover}
                    />
                    <Text style={styles.bookTitle} numberOfLines={1}>
                      {s.title}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  cancel: { fontSize: 15, color: colors.inkMuted },
  title: { fontFamily: fonts.display, fontSize: 16, color: colors.ink },
  postBtn: {
    backgroundColor: '#F4ECDF',
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  postBtnOff: { backgroundColor: colors.card },
  postBtnText: { fontSize: 14, fontWeight: '700', color: '#15100E' },
  postBtnTextOff: { color: colors.inkFaint },

  scroll: { padding: spacing.lg },
  input: {
    fontSize: 17,
    color: colors.ink,
    lineHeight: 25,
    minHeight: 140,
    textAlignVertical: 'top',
  },
  counter: { fontSize: 12, color: colors.inkFaint, textAlign: 'right', marginTop: 6 },
  error: { fontSize: 13, color: colors.signal, marginTop: 10 },

  label: {
    fontSize: 11,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  books: { gap: 12, paddingBottom: 4 },
  book: {
    width: 92,
    borderRadius: 12,
    padding: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  bookOn: { borderColor: colors.signal, backgroundColor: colors.card },
  bookCover: { width: '100%', aspectRatio: 3 / 4, borderRadius: 8 },
  bookTitle: { fontSize: 11.5, color: colors.ink, marginTop: 6, fontWeight: '500' },
});
