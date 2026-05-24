// NovelStack — reviewer / test account.
// Creates (or refreshes) a dedicated test account and mints a long-lived
// deep link that always signs into it. Used for simulator testing and for
// the demo account Apple App Review requires.
//
// Run from the web/ directory:
//   node scripts/reviewer-link.mjs
// DATABASE_URL and AUTH_SECRET are read from web/.env.local if present, or
// from the environment. Without AUTH_SECRET the account is still created —
// the script just can't mint the link until the secret is supplied.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import postgres from 'postgres';
import { SignJWT } from 'jose';

// Load env from web/.env.local without pulling in a dependency.
const here = dirname(fileURLToPath(import.meta.url));
try {
  for (const line of readFileSync(join(here, '..', '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  // No .env.local — rely on the real environment.
}

const { DATABASE_URL, AUTH_SECRET } = process.env;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const EMAIL = 'reviewer@novelstack.app';
const USERNAME = 'novelstack_reviewer';

const sql = postgres(DATABASE_URL, { ssl: 'require' });
const [user] = await sql`
  insert into users (email, username, display_name, date_of_birth, bio)
  values (${EMAIL}, ${USERNAME}, 'App Reviewer', '1990-01-01',
          'NovelStack test account for app review.')
  on conflict (email) do update
    set display_name = 'App Reviewer', date_of_birth = '1990-01-01'
  returning id, email, username
`;
await sql.end();

console.log('Reviewer account ready:');
console.log('  id      ', user.id);
console.log('  email   ', user.email);
console.log('  username', user.username);

if (!AUTH_SECRET) {
  console.log('\nAUTH_SECRET is not set — account created, but the login link');
  console.log('cannot be minted. Add AUTH_SECRET (from the Render service');
  console.log('Environment settings) and run this script again.');
  process.exit(0);
}

// A 10-year session JWT — the same shape signSession() produces, just with a
// far longer expiry so the reviewer link keeps working.
const jwt = await new SignJWT({ sub: user.id })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('3650d')
  .sign(new TextEncoder().encode(AUTH_SECRET));

const link = `novelstack://auth-callback?session=${jwt}`;
console.log('\nReviewer login link (opens the app already signed in):');
console.log('  ' + link);
console.log('\nSign in on the booted iOS simulator with:');
console.log(`  xcrun simctl openurl booted "${link}"`);
