import { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  InputAccessoryView,
  Platform,
  StyleSheet,
  type NativeSyntheticEvent,
  type TextInputSelectionChangeEventData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGet, apiSend, apiUpload } from '@/lib/api';
import { MarkdownText } from '@/components/MarkdownText';
import type { Chapter, ChapterDetail } from '@/lib/types';

const ACCESSORY_ID = 'novelstack-editor-toolbar';

type Sel = { start: number; end: number };

// The immersive chapter editor. Pushed over the tab bar so it fills the
// screen — the writer gets their words, a formatting toolbar above the
// keyboard, and a live preview that renders exactly what readers will see.
export default function ChapterEditor() {
  const params = useLocalSearchParams<{ id: string; storyId?: string; next?: string }>();
  const chapterId = params.id;
  const isNew = chapterId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [storyId, setStoryId] = useState(params.storyId ?? '');
  const [chapterNumber, setChapterNumber] = useState<number | null>(null);

  // Live text selection inside the body field — formatting acts on this.
  const [sel, setSel] = useState<Sel>({ start: 0, end: 0 });
  // When we change the text programmatically we briefly control `selection`
  // to place the cursor, then release it back to uncontrolled.
  const [pendingSel, setPendingSel] = useState<Sel | null>(null);

  const [preview, setPreview] = useState(false);
  const [review, setReview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [imageBusy, setImageBusy] = useState(false);

  // Snapshot of the loaded chapter — used to detect unsaved changes.
  const saved = useRef({ title: '', body: '', isFree: true });

  const load = useCallback(async () => {
    if (isNew) {
      const n = Number(params.next);
      const num = Number.isFinite(n) && n > 0 ? n : 1;
      setChapterNumber(num);
      setTitle(`Chapter ${num}`);
      setIsFree(num <= 3);
      saved.current = { title: '', body: '', isFree: num <= 3 };
      return;
    }
    setLoading(true);
    try {
      const ch = await apiGet<ChapterDetail>(`/api/chapters/${chapterId}`);
      setTitle(ch.title);
      setBody(ch.body ?? '');
      setIsFree(ch.isFree);
      setStoryId(ch.storyId);
      setChapterNumber(ch.number);
      saved.current = { title: ch.title, body: ch.body ?? '', isFree: ch.isFree };
    } catch {
      setStatus('Could not load this chapter.');
    }
    setLoading(false);
  }, [isNew, chapterId, params.next]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const dirty =
    title !== saved.current.title ||
    body !== saved.current.body ||
    isFree !== saved.current.isFree;

  const wordCount = useMemo(() => {
    const plain = body
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/[*_>#]/g, ' ')
      .trim();
    return plain ? plain.split(/\s+/).length : 0;
  }, [body]);
  const readMinutes = Math.max(1, Math.round(wordCount / 220));

  // --- text editing helpers ------------------------------------------------
  function applyEdit(nextBody: string, nextSel: Sel) {
    setBody(nextBody);
    setSel(nextSel);
    setPendingSel(nextSel);
  }

  function onSelectionChange(
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) {
    setSel(e.nativeEvent.selection);
    if (pendingSel) setPendingSel(null);
  }

  // Wraps the selection in a marker (**bold**, *italic*). With no selection,
  // drops the markers in and parks the cursor between them.
  function wrap(marker: string) {
    const { start, end } = sel;
    const before = body.slice(0, start);
    const mid = body.slice(start, end);
    const after = body.slice(end);
    if (start === end) {
      applyEdit(before + marker + marker + after, {
        start: start + marker.length,
        end: start + marker.length,
      });
    } else {
      applyEdit(before + marker + mid + marker + after, {
        start: start + marker.length,
        end: end + marker.length,
      });
    }
  }

  // Toggles a line prefix (`## `, `> `) on the line holding the cursor.
  function prefixLine(prefix: string) {
    const { start } = sel;
    const lineStart = body.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const rest = body.slice(lineStart);
    if (rest.startsWith(prefix)) {
      applyEdit(body.slice(0, lineStart) + rest.slice(prefix.length), {
        start: Math.max(lineStart, start - prefix.length),
        end: Math.max(lineStart, start - prefix.length),
      });
    } else {
      applyEdit(body.slice(0, lineStart) + prefix + rest, {
        start: start + prefix.length,
        end: start + prefix.length,
      });
    }
  }

  // Drops a standalone block (scene break, image) at the cursor, padded with
  // blank lines so it parses as its own block.
  function insertBlock(text: string) {
    const { start, end } = sel;
    const before = body.slice(0, start);
    const after = body.slice(end);
    const padBefore = before.length === 0 ? '' : before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
    const padAfter = after.length === 0 ? '' : after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n';
    const insert = padBefore + text + padAfter;
    const pos = before.length + padBefore.length + text.length;
    applyEdit(before + insert + after, { start: pos, end: pos });
  }

  // Picks an illustration, uploads it to R2, inserts it as ![caption](url).
  async function addImage() {
    if (imageBusy) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setStatus('Photo access is needed to add an illustration.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setImageBusy(true);
    setStatus('Uploading illustration…');
    try {
      const ext = (asset.uri.split('.').pop() || 'jpg').toLowerCase();
      const type = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      const { url } = await apiUpload<{ url: string }>('/api/me/image', {
        uri: asset.uri,
        name: `illustration.${ext}`,
        type,
      });
      const finish = (caption: string) => {
        insertBlock(`![${caption.trim()}](${url})`);
        setStatus('Illustration added.');
      };
      // Alert.prompt is iOS-only — the app ships iPhone-first.
      if (Platform.OS === 'ios') {
        Alert.prompt(
          'Caption',
          'Add an optional caption for this illustration.',
          [
            { text: 'Skip', onPress: () => finish('') },
            { text: 'Add', onPress: (t) => finish(t ?? '') },
          ],
          'plain-text',
        );
      } else {
        finish('');
      }
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not upload the image.');
    }
    setImageBusy(false);
  }

  // --- save / publish ------------------------------------------------------
  async function commit() {
    if (busy) return;
    setBusy(true);
    setStatus(isNew ? 'Publishing…' : 'Saving…');
    try {
      if (isNew) {
        await apiSend<Chapter>(`/api/me/stories/${storyId}/chapters`, 'POST', {
          title: title.trim() || `Chapter ${chapterNumber ?? ''}`.trim(),
          body,
          isFree,
        });
      } else {
        await apiSend<Chapter>(`/api/me/chapters/${chapterId}`, 'PATCH', {
          title: title.trim() || `Chapter ${chapterNumber ?? ''}`.trim(),
          body,
          isFree,
        });
      }
      saved.current = { title, body, isFree };
      setReview(false);
      router.back();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not save.');
      setBusy(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      'Delete this chapter?',
      'This permanently removes the chapter for all readers, and renumbers the rest. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ],
    );
  }

  async function doDelete() {
    if (busy) return;
    setBusy(true);
    setStatus('Deleting…');
    try {
      await apiSend(`/api/me/chapters/${chapterId}`, 'DELETE');
      router.back();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not delete the chapter.');
      setBusy(false);
    }
  }

  function leave() {
    if (!dirty) {
      router.back();
      return;
    }
    Alert.alert('Discard changes?', 'Your edits to this chapter will be lost.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => router.back() },
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Minimal top bar — the tab bar is gone; this is all the chrome. */}
      <View style={styles.topBar}>
        <Pressable onPress={leave} hitSlop={10} style={styles.topBtn}>
          <Text style={styles.topBtnText}>Cancel</Text>
        </Pressable>
        <Text style={styles.topLabel} numberOfLines={1}>
          {isNew ? 'New chapter' : `Chapter ${chapterNumber ?? ''}`}
        </Text>
        <View style={styles.topRight}>
          {!isNew && (
            <Pressable onPress={confirmDelete} hitSlop={10} style={styles.eyeBtn}>
              <Ionicons name="trash-outline" size={19} color={colors.inkMuted} />
            </Pressable>
          )}
          <Pressable
            onPress={() => setPreview((p) => !p)}
            hitSlop={10}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={preview ? 'create-outline' : 'eye-outline'}
              size={20}
              color={colors.inkMuted}
            />
          </Pressable>
          <Pressable
            style={[styles.publishBtn, !dirty && !isNew && styles.publishOff]}
            onPress={() => setReview(true)}
          >
            <Text style={styles.publishText}>{isNew ? 'Publish' : 'Save'}</Text>
          </Pressable>
        </View>
      </View>

      {preview ? (
        // Live preview — the same renderer the reader uses.
        <ScrollView contentContainerStyle={styles.previewScroll}>
          <Text style={styles.previewChLabel}>
            Chapter {chapterNumber ?? ''}
          </Text>
          <Text style={styles.previewTitle}>{title || 'Untitled chapter'}</Text>
          {body.trim() ? (
            <MarkdownText body={body} color={colors.ink} faint={colors.inkFaint} />
          ) : (
            <Text style={styles.previewEmpty}>
              Nothing to preview yet — switch back and start writing.
            </Text>
          )}
        </ScrollView>
      ) : (
        <View style={styles.editArea}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Chapter title"
            placeholderTextColor={colors.inkFaint}
            style={styles.titleInput}
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            onSelectionChange={onSelectionChange}
            selection={pendingSel ?? undefined}
            placeholder="Begin your chapter…"
            placeholderTextColor={colors.inkFaint}
            multiline
            scrollEnabled
            textAlignVertical="top"
            inputAccessoryViewID={Platform.OS === 'ios' ? ACCESSORY_ID : undefined}
            style={styles.bodyInput}
          />
        </View>
      )}

      {!!status && <Text style={styles.status}>{status}</Text>}

      {/* Formatting toolbar — rides above the keyboard while writing. */}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={ACCESSORY_ID}>
          <View style={styles.toolbar}>
            <ToolBtn label="B" bold onPress={() => wrap('**')} />
            <ToolBtn label="I" italic onPress={() => wrap('*')} />
            <ToolIcon name="text" onPress={() => prefixLine('## ')} />
            <ToolIcon name="chatbox-outline" onPress={() => prefixLine('> ')} />
            <ToolIcon name="ellipsis-horizontal" onPress={() => insertBlock('* * *')} />
            <ToolIcon
              name="image-outline"
              onPress={addImage}
              disabled={imageBusy}
            />
          </View>
        </InputAccessoryView>
      )}

      {/* Android fallback — no keyboard accessory, so a docked toolbar. */}
      {Platform.OS !== 'ios' && !preview && (
        <View style={styles.toolbar}>
          <ToolBtn label="B" bold onPress={() => wrap('**')} />
          <ToolBtn label="I" italic onPress={() => wrap('*')} />
          <ToolIcon name="text" onPress={() => prefixLine('## ')} />
          <ToolIcon name="chatbox-outline" onPress={() => prefixLine('> ')} />
          <ToolIcon name="ellipsis-horizontal" onPress={() => insertBlock('* * *')} />
          <ToolIcon name="image-outline" onPress={addImage} disabled={imageBusy} />
        </View>
      )}

      {/* Publish / save review sheet */}
      <Modal visible={review} transparent animationType="slide" onRequestClose={() => setReview(false)}>
        <Pressable style={styles.backdrop} onPress={() => !busy && setReview(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetGrip} />
          <Text style={styles.sheetTitle}>
            {isNew ? 'Ready to publish?' : 'Save changes?'}
          </Text>
          <Text style={styles.sheetChapter} numberOfLines={2}>
            {title || `Chapter ${chapterNumber ?? ''}`}
          </Text>
          <View style={styles.sheetStats}>
            <Text style={styles.sheetStat}>
              {wordCount.toLocaleString()} word{wordCount === 1 ? '' : 's'}
            </Text>
            <Text style={styles.sheetDot}>·</Text>
            <Text style={styles.sheetStat}>{readMinutes} min read</Text>
          </View>

          <Pressable style={styles.freeRow} onPress={() => setIsFree((f) => !f)}>
            <View style={[styles.checkbox, isFree && styles.checkboxOn]}>
              {isFree && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.freeLabel}>Free chapter</Text>
              <Text style={styles.freeHint}>
                {isFree
                  ? 'Anyone can read this chapter at no cost.'
                  : 'Readers unlock this with an ad or NovelStack+.'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.confirmBtn, busy && { opacity: 0.6 }]}
            onPress={commit}
            disabled={busy}
          >
            <Text style={styles.confirmText}>
              {busy
                ? isNew
                  ? 'Publishing…'
                  : 'Saving…'
                : isNew
                  ? 'Publish chapter'
                  : 'Save changes'}
            </Text>
          </Pressable>
          {isNew && (
            <Text style={styles.sheetNote}>
              Published chapters appear for readers right away. You can edit them anytime.
            </Text>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// A text-glyph toolbar button (B / I).
function ToolBtn({
  label,
  bold,
  italic,
  onPress,
}: {
  label: string;
  bold?: boolean;
  italic?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.toolBtn} onPress={onPress} hitSlop={6}>
      <Text
        style={[
          styles.toolGlyph,
          bold && { fontWeight: '800' },
          italic && { fontStyle: 'italic' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// An icon toolbar button.
function ToolIcon({
  name,
  onPress,
  disabled,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={[styles.toolBtn, disabled && { opacity: 0.4 }]}
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
    >
      <Ionicons name={name} size={19} color={colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    gap: spacing.sm,
  },
  topBtn: { paddingVertical: 4 },
  topBtnText: { fontSize: 14, color: colors.inkMuted },
  topLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
  },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  eyeBtn: { padding: 4 },
  publishBtn: {
    backgroundColor: colors.signal,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  publishOff: { backgroundColor: colors.cardHi },
  publishText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  editArea: { flex: 1, paddingHorizontal: spacing.lg },
  titleInput: {
    fontFamily: fonts.displayXl,
    fontSize: 24,
    color: colors.ink,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    letterSpacing: -0.4,
  },
  bodyInput: {
    flex: 1,
    fontFamily: 'serif',
    fontSize: 18,
    lineHeight: 30,
    color: colors.ink,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },

  previewScroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  previewChLabel: {
    fontSize: 12,
    letterSpacing: 1,
    color: colors.signal,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  previewTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.ink,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  previewEmpty: { fontSize: 14, color: colors.inkFaint, fontStyle: 'italic' },

  status: {
    fontSize: 12,
    color: colors.inkMuted,
    textAlign: 'center',
    paddingVertical: 6,
  },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.paperSoft,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  toolBtn: {
    width: 42,
    height: 38,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  toolGlyph: { fontSize: 17, color: colors.ink },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: colors.paperSoft,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl + spacing.md,
    gap: spacing.sm,
  },
  sheetGrip: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.ink,
  },
  sheetChapter: { fontSize: 15, color: colors.inkMuted },
  sheetStats: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  sheetStat: { fontSize: 12, color: colors.inkFaint },
  sheetDot: { fontSize: 12, color: colors.inkFaint },

  freeRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
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
  checkMark: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  freeLabel: { fontSize: 14, fontWeight: '600', color: colors.ink },
  freeHint: { fontSize: 12, color: colors.inkFaint, marginTop: 2, lineHeight: 16 },

  confirmBtn: {
    backgroundColor: colors.signal,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  confirmText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  sheetNote: {
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 16,
  },
});
