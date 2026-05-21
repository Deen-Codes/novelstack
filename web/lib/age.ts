import { createClient } from '@/lib/supabase/server';

// True only when there is a signed-in user whose stored date of birth
// makes them 18+. Logged-out users and users with no DOB count as minors,
// so mature (is_mature) content is hidden from them. (Q1 decision.)
export async function viewerIsAdult(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('users')
    .select('date_of_birth')
    .eq('id', user.id)
    .single();
  if (!data?.date_of_birth) return false;

  const dob = new Date(data.date_of_birth);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return dob <= cutoff;
}
