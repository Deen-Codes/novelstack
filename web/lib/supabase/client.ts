import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase client for client components
// (sign-in, comments, reading prefs, ad-unlock button).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );
}
