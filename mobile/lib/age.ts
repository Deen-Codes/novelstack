import { supabase } from '@/lib/supabase';

// True only when there is a signed-in user whose stored date of birth
// makes them 18+. Logged-out users and users with no DOB count as minors,
// so mature (is_mature) content is hidden from them. (Q1 decision —
// mirrors web/lib/age.ts.)
export async function viewerIsAdult(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('users')
    .select('date_of_birth')
    .eq('id', user.id)
    .single();
  const dob = (data as { date_of_birth: string | null } | null)?.date_of_birth;
  if (!dob) return false;

  const born = new Date(dob);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return born <= cutoff;
}
