import Link from 'next/link';
import { GENRES } from '@/lib/genres';

// The control panel's contents. Server-rendered: every item is a plain link,
// and the page reads the URL to decide what the main area shows. Active state
// is computed from the current view / genre passed down from the page.

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium uppercase tracking-wider text-ink-faint px-2 mt-5 mb-1.5">
      {children}
    </div>
  );
}

function NavItem({
  href,
  active,
  label,
  icon,
}: {
  href: string;
  active: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13.5px] ${
        active ? 'bg-ink text-paper font-medium' : 'text-ink-muted hover:bg-paper-soft'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {label}
    </Link>
  );
}

const ic = {
  feed: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.4 5 5.6.8-4 4 1 5.6L12 21l-5 2.4 1-5.6-4-4 5.6-.8z" />
    </svg>
  ),
  bookmark: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  pen: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  ),
  users: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

export function SidebarNav({
  view,
  genre,
  query,
  signedIn,
}: {
  view: string;
  genre?: string;
  query?: string;
  signedIn: boolean;
}) {
  return (
    <nav className="px-3 pb-8">
      <form action="/" className="px-1 mb-1">
        <div className="flex items-center gap-2 bg-white border border-border-soft rounded-lg px-2.5 py-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-faint shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            name="q"
            defaultValue={query ?? ''}
            placeholder="Search stories"
            className="bg-transparent text-[13px] outline-none w-full placeholder:text-ink-faint"
          />
        </div>
      </form>

      <SectionLabel>Discover</SectionLabel>
      <NavItem href="/" active={view === 'feed' && !genre && !query} label="For you" icon={ic.feed} />

      <div className="flex flex-wrap gap-1.5 px-1 mt-2">
        {GENRES.map((g) => {
          const active = view === 'feed' && genre === g.value;
          return (
            <Link
              key={g.value}
              href={`/?genre=${g.value}`}
              className={`text-[12px] px-2.5 py-1 rounded-full border ${
                active
                  ? 'bg-ink text-paper border-ink font-medium'
                  : 'border-border-soft text-ink-muted hover:border-ink/40'
              }`}
            >
              {g.label}
            </Link>
          );
        })}
      </div>

      {signedIn ? (
        <>
          <SectionLabel>Your shelf</SectionLabel>
          <NavItem href="/?view=saved" active={view === 'saved'} label="Saved books" icon={ic.bookmark} />
          <NavItem href="/?view=writing" active={view === 'writing'} label="Your stories" icon={ic.pen} />
          <NavItem href="/?view=following" active={view === 'following'} label="Following" icon={ic.users} />
          <Link
            href="/write/new"
            className="mt-3 flex items-center justify-center gap-1.5 bg-signal text-paper text-[13px] font-medium rounded-lg py-2 mx-1"
          >
            + New story
          </Link>
        </>
      ) : (
        <div className="mt-5 mx-1 rounded-xl border border-border-soft bg-paper-soft p-3.5">
          <p className="text-[12.5px] text-ink-muted leading-snug mb-2.5">
            Sign in to save books, follow writers and publish your own stories — synced across your devices.
          </p>
          <Link
            href="/signin"
            className="block text-center bg-ink text-paper text-[13px] font-medium rounded-lg py-2"
          >
            Sign in
          </Link>
        </div>
      )}
    </nav>
  );
}
