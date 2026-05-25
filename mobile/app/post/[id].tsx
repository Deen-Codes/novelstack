import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGet, apiSend } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { ago } from '@/lib/time';
import { Cover } from '@/components/Cover';
import type { PostComment, PostDetail } from '@/lib/types';

function Avatar({ url, name, size }: { url: string | null; name: string; size: number }) {
  return (
    <View style={[styles.av, { width: size, height: size, borderRadius: size / 2 }]}>
      {url ? (
        <Image source={{ uri: url }} style={{ width: size, height: size }} />
      ) : (
        <Text style={[styles.avText, { fontSize: size * 0.4 }]}>
          {(name || '?').slice(0, 1).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

// A community update with its full comment thread. Readers can like and
// reply; authors can edit or delete their own post and comments.
export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [meId, setMeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  // Inline editing.
  const [editingPost, setEditingPost] = useState(false);
  const [postDraft, setPostDraft] = useState('');
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');

  const load = useCallback(async () => {
    try {
      setPost(await apiGet<PostDetail>(`/api/posts/${id}`));
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
    getCurrentUser().then((u) => setMeId(u?.id ?? null));
  }, [load]);

  async function toggleLike() {
    if (!post) return;
    const prev = { likedByMe: post.likedByMe, likeCount: post.likeCount };
    setPost({
      ...post,
      likedByMe: !post.likedByMe,
      likeCount: post.likeCount + (post.likedByMe ? -1 : 1),
    });
    try {
      const r = await apiSend<{ liked: boolean; likeCount: number }>(
        `/api/posts/${id}/like`,
        'POST',
      );
      setPost((p) => (p ? { ...p, likedByMe: r.liked, likeCount: r.likeCount } : p));
    } catch {
      setPost((p) => (p ? { ...p, ...prev } : p));
    }
  }

  async function send() {
    const text = comment.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      await apiSend(`/api/posts/${id}/comments`, 'POST', { body: text });
      setComment('');
      await load();
    } catch {
      // Leave the text so the reader can retry.
    }
    setBusy(false);
  }

  // --- Post edit / delete --------------------------------------------------
  function postMenu() {
    Alert.alert('Your update', undefined, [
      {
        text: 'Edit',
        onPress: () => {
          setPostDraft(post?.body ?? '');
          setEditingPost(true);
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Delete update?', 'This removes the post and its comments.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: deletePost },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  async function savePost() {
    const text = postDraft.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      await apiSend(`/api/posts/${id}`, 'PATCH', { body: text });
      setEditingPost(false);
      await load();
    } catch {
      // Leave the editor open.
    }
    setBusy(false);
  }

  async function deletePost() {
    try {
      await apiSend(`/api/posts/${id}`, 'DELETE');
      router.back();
    } catch {
      // Stay on the screen on failure.
    }
  }

  // --- Comment edit / delete ----------------------------------------------
  async function saveComment(commentId: string) {
    const text = commentDraft.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      await apiSend(`/api/post-comments/${commentId}`, 'PATCH', { body: text });
      setEditCommentId(null);
      await load();
    } catch {
      // Leave the editor open.
    }
    setBusy(false);
  }

  function confirmDeleteComment(commentId: string) {
    Alert.alert('Delete comment?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiSend(`/api/post-comments/${commentId}`, 'DELETE');
            await load();
          } catch {
            // No-op.
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (notFound || !post) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.head}>
          <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.headTitle}>Update</Text>
          <View style={{ width: 38 }} />
        </View>
        <Text style={styles.notFound}>This update is no longer available.</Text>
      </SafeAreaView>
    );
  }

  const mine = !!meId && post.author?.id === meId;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.head}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.headTitle}>Update</Text>
        {mine ? (
          <Pressable style={styles.back} onPress={postMenu} hitSlop={8}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.ink} />
          </Pressable>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.postHead}>
            <Avatar
              url={post.author?.avatarUrl ?? null}
              name={post.author?.displayName ?? '?'}
              size={44}
            />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.author} numberOfLines={1}>
                {post.author?.displayName ?? 'A writer'}
              </Text>
              <Text style={styles.time}>{ago(post.createdAt)}</Text>
            </View>
          </View>

          {editingPost ? (
            <View style={styles.editBlock}>
              <TextInput
                value={postDraft}
                onChangeText={setPostDraft}
                multiline
                autoFocus
                style={styles.editInput}
              />
              <View style={styles.editRow}>
                <Pressable onPress={() => setEditingPost(false)}>
                  <Text style={styles.editCancel}>Cancel</Text>
                </Pressable>
                <Pressable onPress={savePost} disabled={busy}>
                  <Text style={styles.editSave}>{busy ? 'Saving…' : 'Save'}</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Text style={styles.body}>{post.body}</Text>
          )}

          {post.story && (
            <Pressable
              style={styles.bookCard}
              onPress={() => post.story && router.push(`/story/${post.story.slug}`)}
            >
              <Cover
                coverUrl={post.story.coverUrl}
                coverColor={post.story.coverColor}
                title={post.story.title}
                mature={post.story.isMature}
                style={styles.bookCover}
              />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>
                  {post.story.title}
                </Text>
                <Text style={styles.bookRead}>Read story ›</Text>
              </View>
            </Pressable>
          )}

          <View style={styles.metaRow}>
            <Pressable style={styles.likeBtn} onPress={toggleLike} hitSlop={6}>
              <Ionicons
                name={post.likedByMe ? 'heart' : 'heart-outline'}
                size={20}
                color={post.likedByMe ? colors.signal : colors.inkMuted}
              />
              <Text style={styles.metaText}>
                {post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}
              </Text>
            </Pressable>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>
              {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
            </Text>
          </View>

          <View style={styles.divider} />
          {post.comments.length === 0 ? (
            <Text style={styles.noComments}>No comments yet — be the first to reply.</Text>
          ) : (
            post.comments.map((c: PostComment) => {
              const mineComment = !!meId && c.user?.id === meId;
              const editing = editCommentId === c.id;
              return (
                <View key={c.id} style={styles.comment}>
                  <Avatar
                    url={c.user?.avatarUrl ?? null}
                    name={c.user?.displayName ?? '?'}
                    size={34}
                  />
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentName}>
                      {c.user?.displayName ?? 'A reader'}
                      <Text style={styles.commentTime}>{'  ·  '}{ago(c.createdAt)}</Text>
                    </Text>
                    {editing ? (
                      <View>
                        <TextInput
                          value={commentDraft}
                          onChangeText={setCommentDraft}
                          multiline
                          autoFocus
                          style={styles.editInput}
                        />
                        <View style={styles.editRow}>
                          <Pressable onPress={() => setEditCommentId(null)}>
                            <Text style={styles.editCancel}>Cancel</Text>
                          </Pressable>
                          <Pressable onPress={() => saveComment(c.id)} disabled={busy}>
                            <Text style={styles.editSave}>{busy ? 'Saving…' : 'Save'}</Text>
                          </Pressable>
                        </View>
                      </View>
                    ) : (
                      <>
                        <Text style={styles.commentBody}>{c.body}</Text>
                        {mineComment && (
                          <View style={styles.ownRow}>
                            <Pressable
                              onPress={() => {
                                setEditCommentId(c.id);
                                setCommentDraft(c.body);
                              }}
                              hitSlop={6}
                            >
                              <Text style={styles.ownLink}>Edit</Text>
                            </Pressable>
                            <Pressable onPress={() => confirmDeleteComment(c.id)} hitSlop={6}>
                              <Text style={styles.ownLinkDanger}>Delete</Text>
                            </Pressable>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: spacing.lg }} />
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Add a comment…"
            placeholderTextColor={colors.inkFaint}
            multiline
            style={styles.input}
          />
          <Pressable
            style={[styles.sendBtn, (!comment.trim() || busy) && styles.sendOff]}
            onPress={send}
            disabled={!comment.trim() || busy}
          >
            <Ionicons name="arrow-up" size={18} color="#15100E" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
  },
  back: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headTitle: { fontFamily: fonts.display, fontSize: 17, color: colors.ink },
  notFound: { fontSize: 14, color: colors.inkMuted, textAlign: 'center', marginTop: 60 },

  scroll: { padding: spacing.lg },
  av: {
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avText: { color: '#FFFFFF', fontWeight: '600' },

  postHead: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  author: { fontSize: 15, fontWeight: '600', color: colors.ink },
  time: { fontSize: 12, color: colors.inkFaint, marginTop: 1 },
  body: { fontSize: 16, color: colors.ink, lineHeight: 24, marginTop: 13 },

  editBlock: { marginTop: 13 },
  editInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.card,
    minHeight: 60,
    textAlignVertical: 'top',
    marginTop: 6,
  },
  editRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 18, marginTop: 8 },
  editCancel: { fontSize: 13, color: colors.inkMuted, fontWeight: '600' },
  editSave: { fontSize: 13, color: colors.signal, fontWeight: '700' },

  bookCard: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 13,
    padding: 11,
  },
  bookCover: { width: 50, height: 68, borderRadius: 7 },
  bookInfo: { flex: 1, minWidth: 0, justifyContent: 'center' },
  bookTitle: { fontFamily: fonts.display, fontSize: 14.5, color: colors.ink },
  bookRead: { fontSize: 12.5, color: colors.signal, fontWeight: '600', marginTop: 5 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, color: colors.inkMuted, fontWeight: '500' },
  metaDot: { color: colors.inkFaint },

  divider: { height: 1, backgroundColor: colors.borderSoft, marginTop: 16, marginBottom: 16 },
  noComments: { fontSize: 13.5, color: colors.inkFaint, lineHeight: 20 },
  comment: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  commentBubble: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.card,
    borderRadius: 13,
    padding: 11,
  },
  commentName: { fontSize: 13, fontWeight: '600', color: colors.ink },
  commentTime: { fontSize: 11.5, fontWeight: '400', color: colors.inkFaint },
  commentBody: { fontSize: 14, color: colors.ink, lineHeight: 20, marginTop: 4 },
  ownRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  ownLink: { fontSize: 12, color: colors.inkMuted, fontWeight: '600' },
  ownLinkDanger: { fontSize: 12, color: colors.signal, fontWeight: '600' },

  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 9,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    backgroundColor: colors.paper,
  },
  input: {
    flex: 1,
    maxHeight: 110,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 14.5,
    color: colors.ink,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: '#F4ECDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOff: { opacity: 0.4 },
});
