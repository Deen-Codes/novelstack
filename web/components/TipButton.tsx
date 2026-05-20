'use client';

import { useState } from 'react';
import { sendTip } from '@/app/tip/actions';

const AMOUNTS = [
  { cents: 300, label: '$3' },
  { cents: 500, label: '$5' },
  { cents: 1000, label: '$10' },
];

export function TipButton({
  recipientId,
  storyId,
  signedIn,
}: {
  recipientId: string;
  storyId?: string;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [amount, setAmount] = useState(500);

  if (!signedIn) {
    return (
      <a href="/signin" className="text-[13px] text-signal font-medium">
        Tip the writer
      </a>
    );
  }
  if (done) {
    return <span className="text-[13px] text-ink-faint">Tip recorded — thank you</span>;
  }
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-[13px] text-signal font-medium"
      >
        Tip the writer
      </button>
    );
  }

  return (
    <form
      action={sendTip}
      onSubmit={() => setDone(true)}
      className="border border-border-soft rounded-lg p-3 bg-white max-w-xs"
    >
      <input type="hidden" name="recipientId" value={recipientId} />
      {storyId && <input type="hidden" name="storyId" value={storyId} />}
      <input type="hidden" name="amount" value={amount} />

      <div className="flex gap-2 mb-2">
        {AMOUNTS.map((a) => (
          <button
            key={a.cents}
            type="button"
            onClick={() => setAmount(a.cents)}
            className={`text-[13px] rounded-full px-3 py-1 border ${
              amount === a.cents
                ? 'bg-signal text-paper border-signal'
                : 'border-border-soft text-ink'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
      <textarea
        name="message"
        rows={2}
        placeholder="Add a note (optional)"
        className="w-full border border-border-soft rounded-md px-2 py-1.5 text-[13px] bg-white"
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-signal text-paper text-[13px] px-3 py-1.5 rounded-full font-medium"
        >
          Send ${(amount / 100).toFixed(0)}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12px] text-ink-faint"
        >
          Cancel
        </button>
      </div>
      <p className="text-[11px] text-ink-faint mt-2">
        70% goes to the writer. Charged when card payments go live.
      </p>
    </form>
  );
}
