import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE = 'https://novelstack.app';

// Lists every public story so Google can crawl and deep-link to books.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase
    .from('stories')
    .select('slug, updated_at')
    .neq('status', 'draft');

  const storyUrls: MetadataRoute.Sitemap = (data ?? []).map((s: { slug: string; updated_at: string }) => ({
    url: `${BASE}/story/${s.slug}`,
    lastModified: s.updated_at,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: new Date(), priority: 1 },
    ...storyUrls,
  ];
}
