// Renders a story cover: the uploaded image when one exists, otherwise the
// solid colour block with the title typeset on it. Server-safe, dependency-free.
export function Cover({
  coverUrl,
  coverColor,
  title,
  className,
}: {
  coverUrl?: string | null;
  coverColor?: string | null;
  title: string;
  className?: string;
}) {
  if (typeof coverUrl === 'string' && coverUrl.length > 0) {
    return (
      <img
        src={coverUrl}
        alt={title}
        className={className}
        style={{ objectFit: 'cover' }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{ background: coverColor ?? '#D85A30' }}
    >
      <div className="font-serif text-[11px] leading-tight text-white/90 p-2 line-clamp-3">
        {title}
      </div>
    </div>
  );
}
