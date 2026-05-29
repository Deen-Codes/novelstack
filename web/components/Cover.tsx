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
          className="w-full h-full flex items-end relative"
          style={{
            background: coverColor
              ? `linear-gradient(160deg, ${coverColor} 0%, rgba(0,0,0,0.45) 100%)`
              : 'linear-gradient(160deg, #5B2E1C 0%, #1F0F0A 100%)',
          }}
        >
          <div
            className="font-display font-bold text-[12px] leading-tight text-cream/90 p-3 line-clamp-3"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {title}
          </div>
        </div>
      )}
      {mature && (
        <span className="absolute top-1.5 right-1.5 bg-black/80 text-cream text-[9px] font-bold px-1.5 py-0.5 rounded">
          18+
        </span>
      )}
    </div>
  );
}
