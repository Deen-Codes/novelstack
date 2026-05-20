import Link from 'next/link';
import type { Story } from '@/lib/types';

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/story/${story.slug}`} className="block group">
      <div
        className="aspect-[3/4] rounded-[10px] p-4 flex flex-col justify-end transition-transform duration-200 group-hover:-translate-y-1"
        style={{ background: story.cover_color }}
      >
        <span className="self-start mb-auto text-[11px] text-white/90 bg-black/25 px-2 py-0.5 rounded-full capitalize">
          {story.genre}
        </span>
        <div className="font-serif text-[17px] font-medium text-white leading-tight">
          {story.title}
        </div>
      </div>
      <div className="flex justify-between items-center pt-2.5 px-1">
        <span className="text-[13px] font-medium text-ink">
          {story.author?.display_name ?? 'Unknown author'}
        </span>
        <span className="text-[12px] text-ink-faint">
          {story.total_reads.toLocaleString()} reads
        </span>
      </div>
    </Link>
  );
}
