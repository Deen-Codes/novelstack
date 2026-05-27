// Web tipping is parked for v1. Mobile (iOS) does tips via Apple IAP
// (`mobile/app/story/[id].tsx` — the Spark/Cheer/Standing Ovation/Patron
// sheet). To re-enable web tipping later, wire this component to Stripe
// Checkout and bring back the existing prop signature below — `story/[slug]`,
// `u/[username]`, and `Reader.tsx` already pass these props.
export function TipButton(_props: {
  recipientId: string;
  storyId?: string;
  signedIn: boolean;
}) {
  return null;
}
