'use client';

import { useState, useTransition } from 'react';
import { importAdRevenue } from './actions';

// Tiny client form — the server action does the actual work. Kept client-side
// so we can render the result inline instead of a full page reload.
export function ImportAdRevenueForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setResult(null);
    setError(null);
    const out = await importAdRevenue(formData);
    if (out.ok) {
      setResult(`Confirmed ${out.confirmed ?? 0} ad unlocks.`);
    } else {
      setError(out.error ?? 'Import failed.');
    }
  }

  return (
    <form
      action={(fd) => startTransition(() => void onSubmit(fd))}
      className="rounded-2xl border border-border-soft bg-white p-5 space-y-4"
    >
      <h2 className="font-serif text-lg text-ink">Import ad revenue</h2>

      <label className="block">
        <span className="text-[12px] uppercase tracking-wide font-semibold text-ink-muted">
          Cents per unlock
        </span>
        <input
          name="centsPerUnlock"
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="e.g. 2"
          className="mt-1 w-full border border-border-soft rounded-lg px-3 py-2 text-[14px]"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-[12px] uppercase tracking-wide font-semibold text-ink-muted">
            From (inclusive)
          </span>
          <input
            name="from"
            type="date"
            required
            className="mt-1 w-full border border-border-soft rounded-lg px-3 py-2 text-[14px]"
          />
        </label>
        <label className="block">
          <span className="text-[12px] uppercase tracking-wide font-semibold text-ink-muted">
            To (exclusive)
          </span>
          <input
            name="to"
            type="date"
            required
            className="mt-1 w-full border border-border-soft rounded-lg px-3 py-2 text-[14px]"
          />
        </label>
      </div>

      <button
        disabled={pending}
        className="rounded-lg bg-[#15100E] text-white px-4 py-2.5 text-[14px] font-semibold disabled:opacity-60"
      >
        {pending ? 'Importing…' : 'Import ad revenue'}
      </button>

      {result && <p className="text-[13px] text-[#7FB08A]">{result}</p>}
      {error && <p className="text-[13px] text-signal">{error}</p>}
    </form>
  );
}
