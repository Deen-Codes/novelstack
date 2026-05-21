'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ReportButton } from './ReportButton';

type CommentRow = {
  id: string;
  content: string;
  created_at: string;
  user: { display_name: string; username: string } | null;
};

export function Comments({ chapterId }: { chapterId: string }) {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [text, setText] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: cs } = await supabase
      .from('comments')
      .select('id, content, created_at, user:users(display_name, username)')
      .eq('chapter_id', chapterId)
      .order('created_at', { ascending: false });
    setComments((cs as unknown as CommentRow[]) ?? []);

    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('chapter_id', chapterId);
    setLikeCount(count ?? 0);

    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
    if (user) {
      const { data: myLike } = await supabase
        .from('likes')
        .select('user_id')
        .eq('chapter_id', chapterId)
        .eq('user_id', user.id)
        .maybeSingle();
      setLiked(!!myLike);
    }
  }, [chapterId]);

  useEffect(() => { load(); }, [load]);

  async function post() {
    if (!text.trim() || !userId) return;
    const supabase = createClient();
    await supabase.from('comments').insert({
      chapter_id: chapterId,
      user_id: userId,
      content: text.trim(),
    });
    setText('');
    load();
  }

  async function toggleLike() {
    if (!userId) return;
    const supabase = createClient();
    if (liked) {
      await supabase.from('likes').delete().eq('chapter_id', chapterId).eq('user_id', userId);
    } else {
      await supabase.from('likes').insert({ chapter_id: chapterId, user_id: userId });
    }
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
            <p className="text-[13px] font-medium">{c.user?.display_name ?? 'Reader'}</p>
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
