import { redirect } from 'next/navigation';

// Q3 decision: "Community" is no longer a separate threads tab — it's merged
// into the home feed. This route just forwards there.
export default function Community() {
  redirect('/browse');
}
