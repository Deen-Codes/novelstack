// NovelStack — authentication we own (replaces Supabase Auth).
// Magic-link sign-in: a one-time token is emailed, exchanged for a signed JWT
// session. Web stores the JWT in an httpOnly cookie; mobile stores it itself
// and sends it as `Authorization: Bearer <jwt>`.
import 'server-only';
import { cookies, headers } from 'next/headers';
import { createHash, randomBytes } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { db } from '@/db';
import { users, authTokens } from '@/db/schema';

export const SESSION_COOKIE = 'novelstack_session';
const TOKEN_TTL_MIN = 60;
const SESSION_TTL_DAYS = 60;
export const SESSION_MAX_AGE = SESSION_TTL_DAYS * 24 * 60 * 60;

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('AUTH_SECRET is not set');
  return new TextEncoder().encode(s);
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// --- Magic-link tokens -----------------------------------------------------
export async function createMagicToken(email: string): Promise<string> {
  const token = randomBytes(32).toString('base64url');
  await db.insert(authTokens).values({
    email: email.toLowerCase().trim(),
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + TOKEN_TTL_MIN * 60_000),
  });
  return token;
}

// Verifies a magic-link token and marks it used. Returns the email, or null
// if the token is unknown, already used, or expired.
export async function consumeMagicToken(token: string): Promise<string | null> {
  const [row] = await db
    .select()
    .from(authTokens)
    .where(
      and(
        eq(authTokens.tokenHash, hashToken(token)),
        isNull(authTokens.consumedAt),
        gt(authTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (!row) return null;
  await db.update(authTokens).set({ consumedAt: new Date() }).where(eq(authTokens.id, row.id));
  return row.email;
}

// --- Users -----------------------------------------------------------------
// Sign-in and sign-up are one flow: a never-seen email creates the account.
export async function findOrCreateUser(email: string) {
  const e = email.toLowerCase().trim();
  const [existing] = await db.select().from(users).where(eq(users.email, e)).limit(1);
  if (existing) return existing;
  const base = (e.split('@')[0] ?? 'reader').replace(/[^a-z0-9]/g, '').slice(0, 16) || 'reader';
  const username = `${base}_${randomBytes(3).toString('hex')}`;
  const [created] = await db
    .insert(users)
    .values({ email: e, username, displayName: 'New reader' })
    .returning();
  return created;
}

// --- Session JWTs ----------------------------------------------------------
export async function signSession(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_DAYS}d`)
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

// Resolves the signed-in user from either the session cookie (web) or an
// `Authorization: Bearer` header (mobile / API). Returns null if signed out.
export async function getSessionUser() {
  let token: string | undefined;

  const h = await headers();
  const authHeader = h.get('authorization');
  if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7);

  if (!token) {
    const c = await cookies();
    token = c.get(SESSION_COOKIE)?.value;
  }
  if (!token) return null;

  const userId = await verifySessionToken(token);
  if (!userId) return null;

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user ?? null;
}
