import type { MetadataRoute } from 'next';
import { ne } from 'drizzle-orm';
import { db } from '@/db';
import { stories } from '@/db/schema';

const BASE = 'https://novelstack.app';

// Generated per request, never at build time — the database may not be
// reachable during the build, and the catalog changes constantly anyway.
export const dynamic = 'force-dynamic';

// Lists every public story so Google can crawl and deep-link to books.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let storyUrls: MetadataRoute.Sitemap = [];
  try {
    const rows = await db
      .select({ slug: stories.slug, updatedAt: stories.updatedAt })
      .from(stories)
      .where(ne(stories.status, 'draft'));
    storyUrls = rows.map((s) => ({
      url: `${BASE}/story/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  } catch {
    // Database unreachable — still return a valid sitemap with the homepage.
  }

  return [{ url: BASE, lastModified: new Date(), priority: 1 }, ...storyUrls];
}
