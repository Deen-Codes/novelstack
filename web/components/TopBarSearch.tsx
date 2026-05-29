'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Inline search affordance that lives in AppHeader. On desktop it's a wide
// input with a magnifying-glass icon; on mobile it collapses to just the icon
// and expands inline when tapped (no modal — that breaks scroll).
export function TopBarSearch() {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = sp?.get('q') ?? '';
  const [q, setQ] = useState(initial);
  const [mobileOpen, setMobileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keep the input value in sync if the user navigates to a different /search?q=
  useEffect(() => { setQ(initial); }, [initial]);
  useEffect(() => {
    if (mobileOpen) inputRef.current?.focus();
  }, [mobileOpen]);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const term = q.trim();
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
    setMobileOpen(false);
  }

  return (
    <>
      {/* Desktop — always-visible field */}
      <form
        onSubmit={submit}
        className="hidden md:flex flex-1 max-w-[520px] items-center gap-2 px-3.5 h-10 rounded-full border border-border-soft"
        style={{ background: 'var(--color-paper-soft)' }}
      >
        <SearchIcon />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stories and authors…"
          className="flex-1 bg-transparent outline-none text-[14px] text-ink placeholder:text-ink-faint"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            className="text-ink-faint hover:text-ink"
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        )}
      </form>

      {/* Mobile — icon collapses an inline input over the row */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="md:hidden ml-auto mr-1 w-9 h-9 rounded-full border border-border-soft flex items-center justify-center"
        style={{ background: 'var(--color-paper-soft)' }}
        aria-label="Search"
      >
        <SearchIcon />
      </button>
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-x-0 top-0 z-[60] border-b border-border-soft px-4 py-3"
          style={{
            background: 'rgba(20, 17, 15, 0.95)',
            backdropFilter: 'blur(20px) saturate(140%)',
          }}
        >
          <form onSubmit={submit} className="flex items-center gap-2">
            <div
              className="flex-1 flex items-center gap-2 px-3.5 h-10 rounded-full border border-border-soft"
              style={{ background: 'var(--color-paper-soft)' }}
            >
              <SearchIcon />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search stories and authors…"
                className="flex-1 bg-transparent outline-none text-[14px] text-ink placeholder:text-ink-faint"
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="text-[13px] text-ink-muted px-2"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-faint">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.54 13.54a1 1 0 0 1-1.42 1.42L12 13.41l-2.12 2.55a1 1 0 1 1-1.42-1.42L10.59 12 8.46 9.88a1 1 0 1 1 1.42-1.42L12 10.59l2.12-2.13a1 1 0 1 1 1.42 1.42L13.41 12l2.13 2.12z" />
    </svg>
  );
}
