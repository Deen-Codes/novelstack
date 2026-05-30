#!/usr/bin/env python3
"""
cover_overlay.py — composite NovelStack typography onto an AI-generated
cover image. Takes any image (JPG / PNG / HEIC) + title + author + an
optional style preset, outputs a finished 3:4 cover ready to upload via
the app's Cover tab.

Usage:
    python cover_overlay.py <image> <title> <author> [--style bottom|top|centered] [--out OUT.png]

Examples:
    python cover_overlay.py raw/salt_wind.heic "The Salt-Wind Almanac" "NovelStack Originals"
    python cover_overlay.py raw/marriage.png "The Morning of the Marriage" "NovelStack Originals" --style centered
    python cover_overlay.py raw/threshold.jpg "Threshold Protocol" "NovelStack Originals" --style top --out covers/threshold.png

Requirements:
    pip install --break-system-packages pillow pillow-heif

Output is a 1200x1600 PNG (3:4 aspect, sized for App Store screenshots
and the iOS cover upload flow which accepts up to 5 MB).
"""
import argparse
import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageEnhance
except ImportError:
    print("ERROR: pip install --break-system-packages pillow", file=sys.stderr)
    sys.exit(1)

# HEIC support is optional — only required if you feed it a .heic file.
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    pillow_heif = None

# Output dimensions (3:4 portrait, App-Store-screenshot-friendly).
OUT_W = 1200
OUT_H = 1600

# Brand tokens — kept in sync with mobile/theme/tokens.ts.
CREAM = (244, 236, 223)
INK = (242, 234, 220)
SIGNAL = (200, 65, 78)
SCRIM_DARK = (0, 0, 0)

# Font search order. The script bundles a fallback (DejaVu Sans Bold) in
# scripts/fonts/ so it always works. To get Bricolage Grotesque (the
# brand display font) on macOS:
#   1. Visit fonts.google.com/specimen/Bricolage+Grotesque
#   2. Click "Download family", unzip
#   3. Open each .ttf, click Install Font in Font Book
#   4. Re-run — Helvetica path picks up the install via system fonts
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FONT_SEARCH = [
    # Bricolage Grotesque if Deen has installed it via Font Book on macOS
    os.path.expanduser("~/Library/Fonts/BricolageGrotesque-ExtraBold.ttf"),
    os.path.expanduser("~/Library/Fonts/BricolageGrotesque-Bold.ttf"),
    "/Library/Fonts/BricolageGrotesque-ExtraBold.ttf",
    "/Library/Fonts/BricolageGrotesque-Bold.ttf",
    # macOS system fonts that actually exist by default
    "/System/Library/Fonts/Avenir Next.ttc",
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/SFNS.ttf",
    # Linux fallback (and the bundled font that ships with this script)
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    os.path.join(SCRIPT_DIR, "fonts", "Fallback-Bold.ttf"),
]


def load_font(size: int, weight: str = "bold") -> ImageFont.FreeTypeFont:
    """Load the best available font at the requested size."""
    last_err = None
    for path in FONT_SEARCH:
        if not os.path.exists(path):
            continue
        try:
            # .ttc files (font collections) need a font-index argument.
            if path.endswith(".ttc"):
                return ImageFont.truetype(path, size, index=0)
            return ImageFont.truetype(path, size)
        except Exception as e:
            last_err = e
            continue
    print(
        f"WARNING: no usable font found — falling back to PIL default (text will look tiny). "
        f"Bundle a .ttf in scripts/fonts/Fallback-Bold.ttf to fix. Last error: {last_err}",
        file=sys.stderr,
    )
    return ImageFont.load_default()


def fit_to_cover(img: Image.Image) -> Image.Image:
    """Crop + resize the source image to OUT_W × OUT_H (3:4), preserving cover-fit semantics."""
    src_w, src_h = img.size
    src_ratio = src_w / src_h
    tgt_ratio = OUT_W / OUT_H

    if src_ratio > tgt_ratio:
        # Source is wider than target — crop horizontally.
        new_w = int(src_h * tgt_ratio)
        offset = (src_w - new_w) // 2
        img = img.crop((offset, 0, offset + new_w, src_h))
    else:
        # Source is taller — crop vertically (favour the upper third to keep skies).
        new_h = int(src_w / tgt_ratio)
        offset = max(0, (src_h - new_h) // 3)
        img = img.crop((0, offset, src_w, offset + new_h))

    return img.resize((OUT_W, OUT_H), Image.LANCZOS)


def draw_text_block(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.FreeTypeFont,
    box: tuple[int, int, int, int],  # x, y, w, h
    fill: tuple[int, int, int],
    align: str = "left",
    line_spacing: float = 0.92,
) -> int:
    """Word-wrap text into a box and draw. Returns total height used."""
    x, y, w, h = box
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        candidate = (line + " " + word).strip()
        bbox = draw.textbbox((0, 0), candidate, font=font)
        if bbox[2] - bbox[0] <= w:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)

    bbox = draw.textbbox((0, 0), "Mg", font=font)
    line_h = int((bbox[3] - bbox[1]) * line_spacing) + (bbox[3] - bbox[1] - (bbox[3] - bbox[1]))
    line_h = int((bbox[3] - bbox[1]) * (1.0 + (line_spacing - 1.0)))
    line_h = int((bbox[3] - bbox[1]) * 1.05) if line_spacing >= 1.0 else int((bbox[3] - bbox[1]) * line_spacing)

    for i, ln in enumerate(lines):
        bbox = draw.textbbox((0, 0), ln, font=font)
        line_w = bbox[2] - bbox[0]
        if align == "right":
            lx = x + w - line_w
        elif align == "center":
            lx = x + (w - line_w) // 2
        else:
            lx = x
        draw.text((lx, y + i * line_h), ln, font=font, fill=fill)

    return len(lines) * line_h


def add_scrim(img: Image.Image, position: str = "bottom") -> Image.Image:
    """Add a dark gradient scrim so light text stays legible over busy imagery."""
    scrim = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(scrim)

    if position == "bottom":
        # Bottom-heavy gradient.
        for i in range(OUT_H):
            alpha = 0
            if i > OUT_H * 0.45:
                alpha = int(((i - OUT_H * 0.45) / (OUT_H * 0.55)) * 220)
                alpha = min(220, alpha)
            draw.rectangle([0, i, OUT_W, i + 1], fill=(0, 0, 0, alpha))
    elif position == "top":
        for i in range(OUT_H):
            alpha = 0
            if i < OUT_H * 0.45:
                alpha = int((1 - (i / (OUT_H * 0.45))) * 200)
            draw.rectangle([0, i, OUT_W, i + 1], fill=(0, 0, 0, alpha))
    else:  # centered — vignette
        for i in range(OUT_H):
            dist = abs(i - OUT_H / 2) / (OUT_H / 2)
            alpha = int(dist * 140)
            draw.rectangle([0, i, OUT_W, i + 1], fill=(0, 0, 0, alpha))

    base = img.convert("RGBA")
    return Image.alpha_composite(base, scrim).convert("RGB")


def render_cover(
    image_path: str,
    title: str,
    author: str,
    style: str = "bottom",
    out_path: str | None = None,
) -> str:
    src = Image.open(image_path).convert("RGB")
    img = fit_to_cover(src)
    img = add_scrim(img, position=style)

    draw = ImageDraw.Draw(img)

    # Title takes ~75% of the width with generous padding.
    pad_x = 80
    title_w = OUT_W - (pad_x * 2)

    if style == "bottom":
        title_font = load_font(120)
        bbox = draw.textbbox((0, 0), "Mg", font=title_font)
        line_h_est = int((bbox[3] - bbox[1]) * 1.05)
        # Estimate how many lines the title will need.
        words = title.split()
        est_lines = max(1, min(4, len(words) // 2 + (1 if len(words) % 2 else 0)))
        # Place block bottom-up.
        title_y = OUT_H - 200 - (line_h_est * est_lines)
        used = draw_text_block(
            draw, title, title_font,
            (pad_x, title_y, title_w, OUT_H),
            fill=CREAM, align="left", line_spacing=1.0,
        )
        # Author beneath.
        author_font = load_font(28)
        draw.text((pad_x, title_y + used + 28), author.upper(), font=author_font, fill=(200, 65, 78))

    elif style == "top":
        title_font = load_font(110)
        used = draw_text_block(
            draw, title, title_font,
            (pad_x, 160, title_w, OUT_H),
            fill=CREAM, align="left", line_spacing=1.0,
        )
        author_font = load_font(26)
        draw.text((pad_x, 160 + used + 28), author.upper(), font=author_font, fill=(200, 65, 78))

    else:  # centered
        title_font = load_font(110)
        # Pre-compute the height to centre vertically.
        # We re-use the wrap from draw_text_block by drawing once to a temp draw.
        temp_img = Image.new("RGB", (OUT_W, OUT_H), (0, 0, 0))
        temp_draw = ImageDraw.Draw(temp_img)
        # Draw to a throwaway just to measure height.
        h_used = draw_text_block(
            temp_draw, title, title_font,
            (pad_x, 0, title_w, OUT_H),
            fill=CREAM, align="center",
        )
        title_y = (OUT_H - h_used) // 2 - 60
        # Hairline above.
        rule_w = 80
        rule_x = (OUT_W - rule_w) // 2
        draw.rectangle(
            [rule_x, title_y - 60, rule_x + rule_w, title_y - 56],
            fill=CREAM,
        )
        draw_text_block(
            draw, title, title_font,
            (pad_x, title_y, title_w, OUT_H),
            fill=CREAM, align="center", line_spacing=1.0,
        )
        author_font = load_font(26)
        bbox = draw.textbbox((0, 0), author.upper(), font=author_font)
        a_w = bbox[2] - bbox[0]
        draw.text(
            ((OUT_W - a_w) // 2, title_y + h_used + 40),
            author.upper(),
            font=author_font,
            fill=(200, 65, 78),
        )

    if out_path is None:
        stem = Path(image_path).stem
        out_path = str(Path(image_path).parent / f"{stem}_cover.png")

    img.save(out_path, "PNG", optimize=True)
    return out_path


def main() -> int:
    parser = argparse.ArgumentParser(description="Composite NovelStack typography onto an AI-generated cover image.")
    parser.add_argument("image", help="Path to the source image (JPG/PNG/HEIC).")
    parser.add_argument("title", help="Book title.")
    parser.add_argument("author", help="Author / imprint name.")
    parser.add_argument("--style", choices=["bottom", "top", "centered"], default="bottom",
                        help="Title placement style. bottom = title bottom-left (default), top = title top-left, centered = editorial centred with hairline.")
    parser.add_argument("--out", default=None, help="Output path (default: <stem>_cover.png next to the input).")
    args = parser.parse_args()

    if not os.path.exists(args.image):
        print(f"ERROR: file not found — {args.image}", file=sys.stderr)
        return 1
    if args.image.lower().endswith(".heic") and pillow_heif is None:
        print("ERROR: pillow-heif is required for .heic input. Run: pip install --break-system-packages pillow-heif", file=sys.stderr)
        return 1

    out = render_cover(args.image, args.title, args.author, style=args.style, out_path=args.out)
    print(f"✓ Wrote {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
