import { createClient } from '@supabase/supabase-js';

// Public anon client — safe for reading published stories and chapters.
// For authenticated reads/writes (writer dashboard, payments) wrap with
// @supabase/ssr server/browser clients — see architecture.md.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);
