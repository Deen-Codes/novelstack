import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { viewerIsAdult } from '@/lib/age';
import { StoryCard } from '@/components/StoryCard';
import type { Story } from '@/lib/types';

// Honest, scale-independent facts — no fabricated user counts pre-launch.
const stats = [
  { num: '70%', label: "Writers' share of revenue" },
  { num: '$6.99', label: 'All-access, per month' },
  { num: 'Free', label: 'To start reading' },
  { num: 'Daily', label: 'New chapters drop' },
];

const props = [
  { title: 'Writers keep 70%.', body: 'Of every subscription and every ad — paid monthly, open to everyone from chapter one.' },
  { title: 'Discovery that discovers.', body: 'Human-curated weekly picks. Recommendations from what you read, not what pays for placement.' },
  { title: 'A reading experience worth opening.', body: 'Cream paper, beautiful type, and ads that never interrupt the page.' },
];

export default async function Home() {
  // Real trending stories from Supabase — top by total reads.
  const supabase = await createClient();
  const adult = await viewerIsAdult();
  const trendingQuery = supabase
    .from('stories')
    .select('*, author:users(id, username, display_name, is_verified)')
    .neq('status', 'draft')
    .order('total_reads', { ascending: false })
    .limit(4);
  if (!adult) trendingQuery.eq('is_mature', false);
  const { data } = await trendingQuery;
  const trending = (data ?? []) as Story[];

  return (
    <main>
      <nav className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[22px] font-medium tracking-tight">
            novelstack<span className="text-signal">.</span>
          </Link>
          <div className="flex items-center gap-7 text-sm text-ink-muted">
            <Link href="/browse">Read</Link>
            <Link href="/write">Write</Link>
            <Link href="/browse" className="bg-ink text-paper px-4 py-2 rounded-full font-medium">
              Open app
            </Link>
          </div>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto px-6 pt-20 pb-14">
        <p className="text-[13px] text-signal font-medium mb-4">A new chapter for online fiction</p>
        <h1 className="font-serif text-6xl md:text-7xl font-medium tracking-tight leading-[1.02] max-w-2xl">
          Stories worth following.
        </h1>
        <p className="text-lg text-ink-muted max-w-xl mt-6 mb-8">
          Free to read with a short ad between chapters, or $6.99/month for every book, ad-free.
          Writers keep 70%.
        </p>
        <div className="flex gap-3">
          <Link href="/browse" className="bg-signal text-paper px-5 py-2.5 rounded-full font-medium text-sm">
            Start reading free
          </Link>
          <Link href="/write" className="border border-ink/25 px-5 py-2.5 rounded-full font-medium text-sm">
            Become a writer
          </Link>
        </div>
      </header>

      <section className="border-y border-ink/10">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-serif text-4xl font-medium">{s.num}</div>
              <div className="text-[13px] text-ink-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-[13px] text-ink-muted mb-2">Trending this week</p>
        <h2 className="font-serif text-4xl font-medium tracking-tight mb-10">
          Stories everyone is talking about.
        </h2>
        {trending.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trending.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <p className="text-ink-muted text-[15px]">
            No published stories yet — <Link href="/write" className="text-signal">be the first to write one</Link>.
          </p>
        )}
      </section>

      <section className="bg-paper-soft">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-[13px] text-ink-muted mb-2">Why NovelStack</p>
          <h2 className="font-serif text-4xl font-medium tracking-tight mb-10">
            Built for readers and writers, not the algorithm.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {props.map((p) => (
              <div key={p.title} className="bg-white border border-border-soft rounded-2xl p-7">
                <h3 className="font-serif text-xl font-medium mb-2.5">{p.title}</h3>
                <p className="text-[15px] text-ink-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="font-serif text-5xl font-medium tracking-tight mb-4">
          Your next chapter starts here.
        </h2>
        <p className="text-lg text-ink-muted mb-8">
          Be part of the writers and readers building the next generation of fiction.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/browse" className="bg-signal text-paper px-5 py-2.5 rounded-full font-medium text-sm">
            Start reading free
          </Link>
          <Link href="/write" className="border border-ink/25 px-5 py-2.5 rounded-full font-medium text-sm">
            Become a writer
          </Link>
        </div>
      </section>

      <footer className="border-t border-ink/10">
        <div className="max-w-6xl mx-auto px-6 py-10 text-[13px] text-ink-faint flex justify-between">
          <span>© 2026 NovelStack</span>
          <span>Substack for novels.</span>
        </div>
      </footer>
    </main>
  );
}
