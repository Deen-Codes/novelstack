import Link from 'next/link';
import type { Story } from '@/lib/types';
import { Cover } from '@/components/Cover';

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/story/${story.slug}`} className="block group">
      <div className="relative aspect-[3/4] rounded-[10px] overflow-hidden transition-transform duration-200 group-hover:-translate-y-1">
        <Cover
          coverUrl={story.coverUrl}
          coverColor={story.coverColor}
          title={story.title}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <span className="self-start mb-auto text-[11px] text-cream/90 bg-black/25 px-2 py-0.5 rounded-full capitalize">
            {story.genre}
          </span>
          <div className="font-display text-[17px] font-medium text-cream leading-tight">
            {story.title}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-2.5 px-1">
        <span className="text-[13px] font-medium text-ink">
          {story.author?.displayName ?? 'Unknown author'}
        </span>
        <span className="text-[12px] text-ink-faint">
          {story.totalReads.toLocaleString()} reads
        </span>
      </div>
    </Link>
  );
}
