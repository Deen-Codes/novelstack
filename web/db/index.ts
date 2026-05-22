// Database client — Drizzle ORM over a postgres.js connection to Render
// PostgreSQL. Import `db` anywhere on the server to run typed queries.
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL ?? '';

// Cache the connection on globalThis so Next.js hot-reload in development
// doesn't open a fresh pool on every file change.
const globalForDb = globalThis as unknown as {
  __novelstackSql?: ReturnType<typeof postgres>;
};

// Render PostgreSQL requires SSL. Plain `postgres()` would connect without it
// and be rejected — so enable SSL for any non-local connection.
const sql =
  globalForDb.__novelstackSql ??
  postgres(connectionString, {
    prepare: false,
    ssl: connectionString.includes('localhost') ? false : 'require',
  });
if (process.env.NODE_ENV !== 'production') globalForDb.__novelstackSql = sql;

export const db = drizzle(sql, { schema });
export { schema };
