import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

// Shared top nav for app pages. Shows different links for signed-in users.
export async function AppHeader() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b border-ink/10 bg-paper/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="text-[20px] font-medium tracking-tight">
          novelstack<span className="text-signal">.</span>
        </Link>
        <div className="flex items-center gap-5 text-sm text-ink-muted">
          <Link href="/browse" className="hover:text-ink">Home</Link>
          <Link href="/search" className="hover:text-ink">Search</Link>
          {user ? (
            <>
              <Link href="/write" className="hover:text-ink">Write</Link>
              <Link href="/library" className="hover:text-ink">Library</Link>
              <Link
                href="/settings"
                className="bg-ink text-paper px-4 py-2 rounded-full font-medium"
              >
                Account
              </Link>
            </>
          ) : (
            <Link
              href="/signin"
              className="bg-ink text-paper px-4 py-2 rounded-full font-medium"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
