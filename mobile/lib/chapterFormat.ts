// Bridges the chapter's stored format and the editor's working format.
//
// Chapters are SAVED as a small fiction-subset Markdown — the reader
// (MarkdownText) and the website render that directly, unchanged. The
// rich-text editor, however, works in HTML. These two converters are the
// only place the two formats meet: load = Markdown -> HTML, save = HTML ->
// Markdown. Anything the reader can't render is degraded gracefully to
// plain text rather than left as raw syntax.

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// Markdown inline emphasis (**bold**, *italic*, _italic_) -> HTML.
function inlineMdToHtml(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>');
}

// Fiction-subset Markdown -> HTML, used to seed the editor on load.
export function mdToHtml(md: string): string {
  const blocks = (md ?? '').replace(/\r\n/g, '\n').split(/\n{2,}/);
  const html: string[] = [];
  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;
    if (/^(?:\*\s*){3,}$/.test(block) || /^-{3,}$/.test(block) || /^_{3,}$/.test(block)) {
      html.push('<hr>');
    } else if (/^!\[[^\]]*\]\([^)]+\)$/.test(block)) {
      const m = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)!;
      html.push(`<img src="${escapeAttr(m[2])}" alt="${escapeAttr(m[1])}">`);
    } else if (block.startsWith('## ')) {
      html.push(`<h2>${inlineMdToHtml(block.slice(3).trim())}</h2>`);
    } else if (block.startsWith('# ')) {
      html.push(`<h2>${inlineMdToHtml(block.slice(2).trim())}</h2>`);
    } else if (block.split('\n').every((l) => l.startsWith('>'))) {
      // Escape each quote line on its own, then join with real <br> tags so
      // the line breaks survive the round-trip back to Markdown.
      const inner = block
        .split('\n')
        .map((l) => inlineMdToHtml(l.replace(/^>\s?/, '')))
        .join('<br>');
      html.push(`<blockquote><p>${inner}</p></blockquote>`);
    } else {
      // Soft newlines inside a paragraph collapse to spaces — the same way
      // the reader renders them.
      html.push(`<p>${inlineMdToHtml(block.split('\n').join(' '))}</p>`);
    }
  }
  return html.join('') || '<p></p>';
}

// Inline HTML -> Markdown. Keeps the emphasis the reader supports and quietly
// strips the rest, leaving its text intact, then decodes HTML entities.
function inlineHtmlToMd(s: string): string {
  return s
    .replace(/<\s*(strong|b)\b[^>]*>([\s\S]*?)<\/\s*(?:strong|b)\s*>/gi, '**$2**')
    .replace(/<\s*(em|i)\b[^>]*>([\s\S]*?)<\/\s*(?:em|i)\s*>/gi, '*$2*')
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, "'")
    .replace(/&apos;/gi, "'");
}

// A list becomes a run of short paragraphs — plain "• "/"1. " text that the
// reader renders cleanly without needing real list support.
function listToMd(inner: string, ordered: boolean): string {
  const items = [...inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => m[1]);
  const lines = items.map((it, i) => {
    const text = inlineHtmlToMd(it.replace(/<\/?p\b[^>]*>/gi, ' '))
      .replace(/\s+/g, ' ')
      .trim();
    return (ordered ? `${i + 1}. ` : '• ') + text;
  });
  return '\n\n' + lines.filter(Boolean).join('\n\n') + '\n\n';
}

// The editor's HTML -> fiction-subset Markdown, used when saving a chapter.
export function htmlToMd(html: string): string {
  let h = (html ?? '').replace(/\r?\n/g, '');
  // Images become their own block.
  h = h.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = (tag.match(/src="([^"]*)"/i) || [])[1] || '';
    const alt = (tag.match(/alt="([^"]*)"/i) || [])[1] || '';
    return src ? `\n\n![${alt}](${src})\n\n` : '';
  });
  // Horizontal rule -> scene break.
  h = h.replace(/<hr\b[^>]*\/?>/gi, '\n\n* * *\n\n');
  // Headings (any level) -> "## ".
  h = h.replace(
    /<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi,
    (_m, inner) => `\n\n## ${inlineHtmlToMd(inner).trim()}\n\n`,
  );
  // Blockquote -> "> " lines.
  h = h.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, inner) => {
    const text = inlineHtmlToMd(inner.replace(/<\/?p\b[^>]*>/gi, '\n')).trim();
    const quoted = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => `> ${l}`)
      .join('\n');
    return `\n\n${quoted}\n\n`;
  });
  // Lists -> bullet / numbered paragraphs.
  h = h.replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (_m, inner) => listToMd(inner, true));
  h = h.replace(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi, (_m, inner) => listToMd(inner, false));
  // Paragraphs.
  h = h.replace(
    /<p\b[^>]*>([\s\S]*?)<\/p>/gi,
    (_m, inner) => `\n\n${inlineHtmlToMd(inner).trim()}\n\n`,
  );
  // Strip anything still standing, decode entities, tidy blank lines.
  return inlineHtmlToMd(h)
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
