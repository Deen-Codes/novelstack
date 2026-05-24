'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Permanently deletes a story (chapters cascade). Confirms first.
export function DeleteStoryButton({ storyId }: { storyId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    const ok = window.confirm(
      'Delete this story and all its chapters? This cannot be undone.',
    );
    if (!ok) return;
    setBusy(true);
    const res = await fetch(`/api/me/stories/${storyId}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/?view=writing');
    } else {
      setBusy(false);
      window.alert('Could not delete the story. Please try again.');
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      className="text-[13px] text-red-500 border border-red-500/30 rounded-full px-4 py-2 disabled:opacity-60"
    >
      {busy ? 'Deleting…' : 'Delete story'}
    </button>
  );
}
