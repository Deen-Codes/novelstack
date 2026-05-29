'use client';

import { deleteChapterAction } from '@/app/write/actions';

// Client-side confirm before the server action fires. Lives in its own file
// because the manage-story page is a server component and can't carry
// onSubmit handlers directly.
export function DeleteChapterButton({
  chapterId,
  storyId,
  chapterNumber,
}: {
  chapterId: string;
  storyId: string;
  chapterNumber: number;
}) {
  return (
    <form
      action={deleteChapterAction}
      onSubmit={(e) => {
        if (!confirm(`Delete Chapter ${chapterNumber}? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="chapterId" value={chapterId} />
      <input type="hidden" name="storyId" value={storyId} />
      <button
        type="submit"
        className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-full border border-signal-soft text-signal hover:bg-signal-soft transition-colors"
        title="Delete chapter"
      >
        Delete
      </button>
    </form>
  );
}
