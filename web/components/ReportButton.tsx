'use client';

import { useState } from 'react';
import { submitReport } from '@/app/moderation/actions';

const REASONS = [
  { v: 'csam', l: 'Child exploitation (CSAM)' },
  { v: 'harassment', l: 'Harassment or bullying' },
  { v: 'hate', l: 'Hate speech' },
  { v: 'graphic_abuse', l: 'Graphic violence or abuse' },
  { v: 'spam', l: 'Spam' },
  { v: 'copyright', l: 'Copyright / plagiarism' },
  { v: 'self_harm', l: 'Self-harm promotion' },
  { v: 'other', l: 'Something else' },
];

export function ReportButton({
  targetType,
  targetId,
  signedIn,
}: {
  targetType: 'story' | 'chapter' | 'comment' | 'user';
  targetId: string;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  if (!signedIn) {
    return (
      <a href="/signin" className="text-[12px] text-ink-faint underline">
        Report
      </a>
    );
  }
  if (done) {
    return <span className="text-[12px] text-ink-faint">Reported — thank you</span>;
  }
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-[12px] text-ink-faint underline"
      >
        Report
      </button>
    );
  }

  return (
    <form
      action={submitReport}
      onSubmit={() => setDone(true)}
      className="border border-border-soft rounded-lg p-3 mt-2 bg-card max-w-sm"
    >
      <input type="hidden" name="targetType" value={targetType} />
      <input type="hidden" name="targetId" value={targetId} />
      <select
        name="reason"
        className="w-full border border-border-soft rounded-md px-2 py-1.5 text-[13px] bg-card mb-2"
      >
        {REASONS.map((r) => (
          <option key={r.v} value={r.v}>{r.l}</option>
        ))}
      </select>
      <textarea
        name="detail"
        rows={2}
        placeholder="Anything else? (optional)"
        className="w-full border border-border-soft rounded-md px-2 py-1.5 text-[13px] bg-card"
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-signal text-cream text-[12px] px-3 py-1.5 rounded-full font-medium"
        >
          Submit report
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12px] text-ink-faint"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
