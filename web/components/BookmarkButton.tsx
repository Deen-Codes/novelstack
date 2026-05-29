'use client';

import { useState, useTransition } from 'react';
import { toggleBookmark } from '@/app/story/actions';

export function BookmarkButton({
  storyId,
  slug,
  initial,
  signedIn,
}: {
  storyId: string;
  slug: string;
  initial: boolean;
  signedIn: boolean;
}) {
  const [bookmarked, setBookmarked] = useState(initial);
  const [pending, startTransition] = useTransition();

  if (!signedIn) {
    return (
      <a
        href="/signin"
        className="inline-block text-[13px] border border-border-soft rounded-full px-4 py-2"
      >
        Sign in to save
      </a>
    );
  }

  return (
    <button
      disabled={pending}
      onClick={() => {
        const current = bookmarked;
        setBookmarked(!current);
        startTransition(() => toggleBookmark(storyId, slug, current));
      }}
      className={`text-[13px] rounded-full px-4 py-2 font-medium disabled:opacity-60 ${
        bookmarked ? 'bg-signal text-cream' : 'border border-border-soft text-ink'
      }`}
    >
      {bookmarked ? 'Saved ✓' : 'Save story'}
    </button>
  );
}
