import { DefaultCover } from './DefaultCover';

// Renders a story cover.
//   - If `coverUrl` exists: render that uploaded image.
//   - Otherwise: render one of 10 typographic default variants (chosen
//     deterministically by hashing `storyId`). The title IS the design,
//     so parents that use the default variant should NOT render the title
//     text again underneath the cover.
// `mature` overlays an "18+" badge on top either way.
export function Cover({
  storyId,
  coverUrl,
  coverColor: _coverColor,
  title,
  genre,
  authorName,
  className,
  mature,
}: {
  storyId?: string;
  coverUrl?: string | null;
  coverColor?: string | null;
  title: string;
  genre?: string | null;
  authorName?: string | null;
  className?: string;
  mature?: boolean;
}) {
  return (
    <div className={`relative ${className ?? ''}`}>
      {typeof coverUrl === 'string' && coverUrl.length > 0 ? (
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <DefaultCover
          storyId={storyId ?? title}
          title={title}
          genre={genre}
          authorName={authorName}
          className="w-full h-full"
        />
      )}
      {mature && (
        <span className="absolute top-1.5 right-1.5 bg-black/80 text-cream text-[9px] font-bold px-1.5 py-0.5 rounded">
          18+
        </span>
      )}
    </div>
  );
}

// Helper used by parent UIs to decide whether to render the title text
// underneath a cover. When using a default variant the title is already
// baked into the cover, so the label would duplicate.
export function hasUploadedCover(coverUrl?: string | null): boolean {
  return typeof coverUrl === 'string' && coverUrl.length > 0;
}
