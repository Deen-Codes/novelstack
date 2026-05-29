import Link from 'next/link';
import type { Story } from '@/lib/types';
import { Cover, hasUploadedCover } from '@/components/Cover';

// Compact story card used on profile pages + anywhere a uniform tile is
// useful. If the story has an uploaded cover image, the genre + title get
// overlaid on top (the image is the canvas). If it's a typographic default
// cover, the title is already baked in — overlaying it again would double
// up — so we skip the overlay and let the default cover speak for itself.
export function StoryCard({ story }: { story: Story }) {
  const uploaded = hasUploadedCover(story.coverUrl);
  return (
    <Link href={`/story/${story.slug}`} className="block group">
      <div className="relative aspect-[3/4] rounded-[10px] overflow-hidden transition-transform duration-200 group-hover:-translate-y-1">
        <Cover
          storyId={story.id}
          coverUrl={story.coverUrl}
          coverColor={story.coverColor}
          title={story.title}
          genre={story.genre}
          authorName={story.author?.displayName}
          className="absolute inset-0 w-full h-full"
        />
        {uploaded && (
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <span className="self-start mb-auto text-[11px] text-cream/90 bg-black/25 px-2 py-0.5 rounded-full capitalize">
              {story.genre}
            </span>
            <div className="font-display text-[17px] font-medium text-cream leading-tight">
              {story.title}
            </div>
          </div>
        )}
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
