import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  RichText,
  useEditorBridge,
  useEditorContent,
  TenTapStartKit,
  CoreBridge,
} from '@10play/tentap-editor';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { DarkEditorToolbar } from '@/components/DarkEditorToolbar';
import { apiGet, apiSend, apiUpload } from '@/lib/api';
import { mdToHtml, htmlToMd } from '@/lib/chapterFormat';
import type { Chapter, ChapterDetail } from '@/lib/types';

// CSS injected into the editor's webview so the writing surface matches the
// app's dark theme and the reader's typography — baked in at init, no flash.
const EDITOR_CSS = `
  * { -webkit-user-select: text; }
  body { background-color: ${colors.paper}; margin: 0; }
  .ProseMirror {
    background-color: ${colors.paper};
    color: ${colors.ink};
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 18px;
    line-height: 1.72;
    padding: 16px 20px 120px;
    caret-color: ${colors.signal};
  }
  .ProseMirror p { margin: 0 0 16px; }
  .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
    font-family: -apple-system, system-ui, sans-serif;
    color: ${colors.ink};
    font-weight: 800;
    font-size: 21px;
    margin: 24px 0 12px;
  }
  .ProseMirror blockquote {
    border-left: 3px solid ${colors.inkFaint};
    margin: 0 0 16px;
    padding-left: 14px;
    color: ${colors.inkMuted};
    font-style: italic;
  }
  .ProseMirror hr {
    border: none;
    border-top: 1px solid ${colors.border};
    margin: 22px 0;
  }
  .ProseMirror img { max-width: 100%; height: auto; border-radius: 12px; }
  .ProseMirror ul, .ProseMirror ol { padding-left: 22px; margin: 0 0 16px; }
  .ProseMirror strong { font-weight: 700; }
  .ProseMirror p.is-editor-empty:first-child::before {
    color: ${colors.inkFaint};
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
`;

// The formatting toolbar lives in components/DarkEditorToolbar — a focused
// minimal bar (bold / italic / heading / bullet / undo / redo) themed to
// match the app, instead of 10tap's default white bar that fought the dark
// canvas.

// Loaded chapter, handed from the loader screen to the editor body.
type Loaded = {
  isNew: boolean;
  chapterId: string;
  storyId: string;
  number: number | null;
  title: string;
  html: string;
  isFree: boolean;
};

// The immersive chapter editor. The screen first loads the chapter, then
// mounts <EditorBody> — so the rich-text editor is created exactly once,
// already holding the chapter's content.
export default function ChapterEditor() {
  const params = useLocalSearchParams<{ id: string; storyId?: string; next?: string }>();
  const isNew = params.id === 'new';
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (isNew) {
      const n = Number(params.next);
      const num = Number.isFinite(n) && n > 0 ? n : 1;
      setLoaded({
        isNew: true,
        chapterId: 'new',
        storyId: params.storyId ?? '',
        number: num,
        title: `Chapter ${num}`,
        html: '<p></p>',
        // New chapters start free — the story-manage Chapters page is where
        // authors flip individual chapters to paid.
        isFree: true,
      });
      return;
    }
    try {
      const ch = await apiGet<ChapterDetail>(`/api/chapters/${params.id}`);
      setLoaded({
        isNew: false,
        chapterId: params.id,
        storyId: ch.storyId,
        number: ch.number,
        title: ch.title,
        html: mdToHtml(ch.body ?? ''),
        isFree: ch.isFree,
      });
    } catch {
      setError('Could not load this chapter.');
    }
  }, [isNew, params.id, params.next, params.storyId]);

  useFocusEffect(
    useCallback(() => {
      // Load once only — re-running would discard unsaved edits.
      if (!loaded && !error) load();
    }, [loaded, error, load]),
  );

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.topBtn}>
            <Text style={styles.topBtnText}>Exit</Text>
          </Pressable>
        </View>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!loaded) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  return <EditorBody data={loaded} />;
}

function EditorBody({ data }: { data: Loaded }) {
  const { isNew, chapterId, storyId, number } = data;
  const [title, setTitle] = useState(data.title);
  // isFree is no longer prompted at publish — authors set Free/Paid on the
  // story-manage Chapters page. We carry the chapter's existing value so an
  // edit-save round-trip doesn't clobber it.
  const isFree = data.isFree;
  const [review, setReview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [imageBusy, setImageBusy] = useState(false);
  const [words, setWords] = useState(0);

  // The rich-text editor — created once with the chapter's content already
  // converted to HTML, themed to the app via baked-in CSS.
  const editor = useEditorBridge({
    // Existing chapters pop the keyboard straight into the body so writers
    // can keep going. New chapters leave the editor unfocused because the
    // title input grabs autoFocus instead.
    autofocus: !isNew,
    avoidIosKeyboard: true,
    initialContent: data.html,
    bridgeExtensions: [...TenTapStartKit, CoreBridge.configureCSS(EDITOR_CSS)],
    theme: {
      webview: { backgroundColor: colors.paper },
      webviewContainer: { backgroundColor: colors.paper },
    },
  });

  // Live HTML drives the unsaved-changes guard. The baseline is whatever the
  // editor first emits, so simply opening a chapter never counts as an edit.
  const liveHtml = useEditorContent(editor, { type: 'html' });
  const baseline = useRef<string | null>(null);
  if (liveHtml != null && baseline.current === null) baseline.current = liveHtml;

  const dirty =
    title !== data.title ||
    (liveHtml != null && baseline.current != null && liveHtml !== baseline.current);

  // Picks an illustration, uploads it to R2, drops it into the editor.
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
      editor.setImage(url);
      setStatus('Illustration added.');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not upload the image.');
    }
    setImageBusy(false);
  }

  // Counts words off the plain text, then opens the publish/save sheet.
  async function openReview() {
    try {
      const text = await editor.getText();
      const trimmed = text.trim();
      setWords(trimmed ? trimmed.split(/\s+/).length : 0);
    } catch {
      setWords(0);
    }
    setReview(true);
  }

  // Saves the chapter — the editor's HTML is converted back to Markdown.
  async function commit() {
    if (busy) return;
    setBusy(true);
    setStatus(isNew ? 'Publishing…' : 'Saving…');
    try {
      const body = htmlToMd(await editor.getHTML());
      const payload = {
        title: title.trim() || `Chapter ${number ?? ''}`.trim(),
        body,
        isFree,
      };
      if (isNew) {
        await apiSend<Chapter>(`/api/me/stories/${storyId}/chapters`, 'POST', payload);
      } else {
        await apiSend<Chapter>(`/api/me/chapters/${chapterId}`, 'PATCH', payload);
      }
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

  const readMinutes = Math.max(1, Math.round(words / 220));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Minimal top bar — the tab bar is gone; this is all the chrome. */}
      <View style={styles.topBar}>
        <Pressable onPress={leave} hitSlop={10} style={styles.topBtn}>
          <Text style={styles.topBtnText}>Cancel</Text>
        </Pressable>
        <Text style={styles.topLabel} numberOfLines={1}>
          {isNew ? 'New chapter' : `Chapter ${number ?? ''}`}
        </Text>
        <View style={styles.topRight}>
          <Pressable onPress={addImage} hitSlop={10} style={styles.iconBtn} disabled={imageBusy}>
            <Ionicons
              name="image-outline"
              size={20}
              color={imageBusy ? colors.inkFaint : colors.inkMuted}
            />
          </Pressable>
          {!isNew && (
            <Pressable onPress={confirmDelete} hitSlop={10} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={19} color={colors.inkMuted} />
            </Pressable>
          )}
          <Pressable
            style={[styles.publishBtn, !dirty && !isNew && styles.publishOff]}
            onPress={openReview}
          >
            <Text style={[styles.publishText, !dirty && !isNew && styles.publishTextOff]}>
              {isNew ? 'Publish' : 'Save'}
            </Text>
          </Pressable>
        </View>
      </View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Chapter title"
        placeholderTextColor={colors.inkFaint}
        style={styles.titleInput}
        // Brand-new chapter → the title needs naming first, so keyboard
        // opens on title. Existing chapters jump straight to the body via
        // the editor's autoFocus (see useEditorBridge above).
        autoFocus={isNew}
      />

      {!!status && <Text style={styles.status}>{status}</Text>}

      {/* The rich-text editor — formatting renders live, no markdown markers. */}
      <View style={styles.editorWrap}>
        <RichText editor={editor} />
      </View>

      {/* Formatting toolbar — rides above the keyboard while writing. */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.toolbarWrap}
      >
        <DarkEditorToolbar editor={editor} />
      </KeyboardAvoidingView>

      {/* Publish / save review sheet */}
      <Modal
        visible={review}
        transparent
        animationType="slide"
        onRequestClose={() => setReview(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => !busy && setReview(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetGrip} />
          <Text style={styles.sheetTitle}>{isNew ? 'Ready to publish?' : 'Save changes?'}</Text>
          <Text style={styles.sheetChapter} numberOfLines={2}>
            {title || `Chapter ${number ?? ''}`}
          </Text>
          <View style={styles.sheetStats}>
            <Text style={styles.sheetStat}>
              {words.toLocaleString()} word{words === 1 ? '' : 's'}
            </Text>
            <Text style={styles.sheetDot}>·</Text>
            <Text style={styles.sheetStat}>{readMinutes} min read</Text>
          </View>

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
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconBtn: { padding: 4 },
  publishBtn: {
    backgroundColor: '#F4ECDF',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: radius.md,
    marginLeft: 2,
  },
  publishOff: { backgroundColor: colors.cardHi },
  publishText: { color: '#15100E', fontSize: 13, fontWeight: '700' },
  publishTextOff: { color: colors.inkFaint },

  errorText: { fontSize: 14, color: colors.inkMuted, padding: spacing.lg },

  titleInput: {
    fontFamily: fonts.displayXl,
    fontSize: 24,
    color: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    letterSpacing: -0.4,
  },
  status: {
    fontSize: 12,
    color: colors.inkMuted,
    paddingHorizontal: spacing.lg,
    paddingBottom: 4,
  },
  editorWrap: { flex: 1 },
  toolbarWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },

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
  sheetTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.ink },
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
    backgroundColor: '#F4ECDF',
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  confirmText: { color: '#15100E', fontSize: 15, fontWeight: '700' },
  sheetNote: {
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 16,
  },
});
