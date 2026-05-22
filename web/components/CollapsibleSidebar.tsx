'use client';

import { useState } from 'react';

// Desktop-only control panel shell. Holds the collapse state; the nav markup
// itself is server-rendered and passed in as children. Hidden on mobile, where
// the bottom tab bar + inline genre chips do the navigating instead.
export function CollapsibleSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <div className="hidden md:block shrink-0 w-11 border-r border-border-soft">
        <button
          onClick={() => setOpen(true)}
          aria-label="Expand panel"
          className="sticky top-[57px] w-11 h-12 flex items-center justify-center text-ink-muted hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <aside className="hidden md:flex flex-col shrink-0 w-60 border-r border-border-soft sticky top-[57px] self-start max-h-[calc(100vh-57px)] overflow-y-auto">
      <div className="flex justify-between items-center px-4 pt-4 pb-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          Control panel
        </span>
        <button
          onClick={() => setOpen(false)}
          aria-label="Collapse panel"
          className="text-ink-faint hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
      {children}
    </aside>
  );
}
