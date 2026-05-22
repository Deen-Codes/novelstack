import type { MetadataRoute } from 'next';
import { ne } from 'drizzle-orm';
import { db } from '@/db';
import { stories } from '@/db/schema';

const BASE = 'https://novelstack.app';

// Lists every public story so Google can crawl and deep-link to books.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await db
    .select({ slug: stories.slug, updatedAt: stories.updatedAt })
    .from(stories)
    .where(ne(stories.status, 'draft'));

  const storyUrls: MetadataRoute.Sitemap = rows.map((s) => ({
    url: `${BASE}/story/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: new Date(), priority: 1 },
    ...storyUrls,
  ];
}
