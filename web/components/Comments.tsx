'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getCommentsState,
  postComment,
  toggleChapterLike,
  type CommentView,
} from '@/app/read/actions';
import { ReportButton } from './ReportButton';

export function Comments({ chapterId }: { chapterId: string }) {
  const [comments, setComments] = useState<CommentView[]>([]);
  const [text, setText] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const load = useCallback(async () => {
    const state = await getCommentsState(chapterId);
    setComments(state.comments);
    setLikeCount(state.likeCount);
    setLiked(state.liked);
    setUserId(state.userId);
  }, [chapterId]);

  useEffect(() => { load(); }, [load]);

  async function post() {
    if (!text.trim() || !userId) return;
    await postComment(chapterId, text.trim());
    setText('');
    load();
  }

  async function toggleLike() {
    if (!userId) return;
    await toggleChapterLike(chapterId);
    load();
  }

  return (
    <div>
      <button
        onClick={toggleLike}
        className="text-[13px] border border-border-soft rounded-full px-4 py-1.5 mb-6"
      >
        {liked ? '♥' : '♡'} {likeCount} like{likeCount === 1 ? '' : 's'}
      </button>

      <h2 className="font-serif text-xl font-medium mb-3">
        {comments.length} comment{comments.length === 1 ? '' : 's'}
      </h2>

      {userId ? (
        <div className="mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Share what you thought…"
            className="w-full border border-border-soft rounded-lg px-3.5 py-2.5 text-[14px] bg-white"
          />
          <button
            onClick={post}
            className="mt-2 bg-signal text-paper px-4 py-2 rounded-full text-sm font-medium"
          >
            Post comment
          </button>
        </div>
      ) : (
        <p className="text-[13px] text-ink-muted mb-6">Sign in to join the conversation.</p>
      )}

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="border-b border-border-soft pb-3">
            <p className="text-[13px] font-medium">{c.author?.displayName ?? 'Reader'}</p>
            <p className="text-[14px] text-ink-muted mt-0.5">{c.content}</p>
            <div className="mt-1">
              <ReportButton targetType="comment" targetId={c.id} signedIn={!!userId} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
