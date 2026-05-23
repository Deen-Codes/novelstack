// Renders a story cover: the uploaded image when one exists, otherwise the
// solid colour block with the title typeset on it. Server-safe, dependency-free.
// `mature` overlays an "18+" badge so readers can see a story is mature.
export function Cover({
  coverUrl,
  coverColor,
  title,
  className,
  mature,
}: {
  coverUrl?: string | null;
  coverColor?: string | null;
  title: string;
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
        <div
          className="w-full h-full flex items-end"
          style={{ background: coverColor ?? '#D85A30' }}
        >
          <div className="font-serif text-[11px] leading-tight text-white/90 p-2 line-clamp-3">
            {title}
          </div>
        </div>
      )}
      {mature && (
        <span className="absolute top-1 right-1 bg-black/75 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
          18+
        </span>
      )}
    </div>
  );
}
