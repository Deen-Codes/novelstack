import type { Config } from 'drizzle-kit';

// drizzle-kit reads this to generate and apply migrations.
// DATABASE_URL is loaded from web/.env.local (drizzle-kit picks .env up itself).
export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
} satisfies Config;
