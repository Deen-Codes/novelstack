'use client';

import { useRef, useState } from 'react';
import { Cover } from './Cover';

// Author-facing cover picker for the Write screen. Uploads the chosen image
// to R2 via /api/me/cover, then PATCHes the story so coverUrl sticks.
export function CoverUploader({
  storyId,
  title,
  initialCoverUrl,
  coverColor,
}: {
  storyId: string;
  title: string;
  initialCoverUrl: string | null;
  coverColor: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Cover image must be 5 MB or smaller.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const uploadRes = await fetch('/api/me/cover', { method: 'POST', body: form });
      const uploaded = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploaded.error ?? 'Upload failed.');

      const patchRes = await fetch(`/api/me/stories/${storyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverUrl: uploaded.coverUrl }),
      });
      if (!patchRes.ok) {
        const patched = await patchRes.json();
        throw new Error(patched.error ?? 'Could not save the cover.');
      }
      setCoverUrl(uploaded.coverUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
    setBusy(false);
  }

  return (
    <div className="flex gap-4 items-start">
      <Cover
        coverUrl={coverUrl}
        coverColor={coverColor}
        title={title}
        className="w-24 shrink-0 aspect-[3/4] rounded-lg overflow-hidden border border-border-soft"
      />
      <div className="min-w-0">
        <p className="text-[14px] font-medium">Cover image</p>
        <p className="text-[12px] text-ink-faint mt-0.5 mb-2">
          JPEG, PNG or WebP · up to 5 MB · 3:4 looks best.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onPick}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="text-[13px] font-medium border border-border-soft rounded-full px-4 py-1.5 disabled:opacity-60"
        >
          {busy ? 'Uploading…' : coverUrl ? 'Replace cover' : 'Upload cover'}
        </button>
        {error && <p className="text-[12px] text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
}
