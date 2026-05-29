#!/usr/bin/env python3
"""
NovelStack App Store marketing screenshot builder.

Wraps raw simulator screenshots in a branded card with a tagline overlay.
Designed for iPhone 6.9" (1320 x 2868) — the only size Apple actually
requires; they auto-scale for smaller devices.

USAGE:
  1. Drop your simulator screenshots into ./raw/ named:
       01-home.png
       02-reader.png
       03-story.png
       04-library.png
       05-community.png
       06-write.png
  2. Run:  python3 build.py
  3. Output lands in ./out/ as 01.png .. 06.png at 1320x2868
  4. Upload them into App Store Connect in order

If a raw file is missing the script skips it cleanly so you can iterate.
"""
import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, 'raw')
OUT = os.path.join(HERE, 'out')
os.makedirs(OUT, exist_ok=True)

FONT_PATH = '/tmp/Bricolage-ExtraBold.ttf'

# Final iPhone 6.9" dimensions Apple requires.
W, H = 1320, 2868
PAPER = (20, 17, 15)
EMBER = (200, 65, 78)
EMBER_HI = (218, 88, 99)
EMBER_DEEP = (96, 26, 35)
INK = (240, 232, 220)
CREAM = (244, 236, 223)

# Tagline + sub for each screenshot, paired by filename prefix. Ordered so
# the strongest shots come first — App Store search results show the first
# two or three above the fold.
#
# Note: the NovelStack+ subscription page deliberately isn't included here.
# Apple's reviewers navigate to it themselves from inside the app to verify
# the IAP disclosure — they don't need it as a marketing shot. Keeping it
# out of the public listing keeps the marketing focused on reading/writing
# rather than a pricing pitch.
SHOTS = [
    ('01-home.png',      'Stories that pull you in.',   'A daily curated feed of serialised fiction.'),
    ('02-reader.png',    'Read, beautifully.',           'A reader built for long sessions and late nights.'),
    ('03-story.png',     'Every story, in one place.',   'Covers, chapters, ratings — find what to read next.'),
    ('04-library.png',   'Your shelf, in sync.',         'Pick up exactly where you left off, on every device.'),
    ('05-community.png', 'A real readers’ community.',   'Talk to writers. Cheer each chapter.'),
    ('06-earnings.png',  'Get paid to write.',           'Tips, ad share, and a slice of every NovelStack+ sub.'),
    ('07-write.png',     'Publish chapter by chapter.',  'A focused editor — write, format, hit Publish.'),
]

def gradient_bg(w, h):
    img = Image.new('RGB', (w, h), PAPER)
    px = img.load()
    cx, cy = w // 2, int(h * 0.32)
    max_r = int(math.hypot(w, h) * 0.55)
    for y in range(h):
        for x in range(w):
            d = math.hypot(x - cx, y - cy)
            t = max(0.0, 1.0 - d / max_r)
            t = t * t * t * 0.55
            r = int(PAPER[0] + (EMBER[0] - PAPER[0]) * t)
            g = int(PAPER[1] + (EMBER[1] - PAPER[1]) * t)
            b = int(PAPER[2] + (EMBER[2] - PAPER[2]) * t)
            px[x, y] = (r, g, b)
    return img

def rounded_corners(img, radius):
    """Returns img with rounded corners as RGBA."""
    rgba = img.convert('RGBA')
    mask = Image.new('L', img.size, 0)
    dm = ImageDraw.Draw(mask)
    dm.rounded_rectangle((0, 0, img.size[0], img.size[1]), radius, fill=255)
    rgba.putalpha(mask)
    return rgba

def fit_font(draw, text, max_w, start_size):
    """Largest font size that fits text within max_w."""
    size = start_size
    while size > 20:
        f = ImageFont.truetype(FONT_PATH, size)
        b = draw.textbbox((0, 0), text, font=f)
        if b[2] - b[0] <= max_w:
            return f
        size -= 4
    return ImageFont.truetype(FONT_PATH, 20)

def wrap_text(draw, text, font, max_w):
    """Greedy word-wrap for the subtitle into multiple lines."""
    words = text.split()
    lines, cur = [], []
    for w in words:
        cand = (' '.join(cur + [w])).strip()
        b = draw.textbbox((0, 0), cand, font=font)
        if b[2] - b[0] <= max_w:
            cur.append(w)
        else:
            if cur:
                lines.append(' '.join(cur))
            cur = [w]
    if cur:
        lines.append(' '.join(cur))
    return lines

def build_one(raw_name, headline, sub, out_name):
    raw_path = os.path.join(RAW, raw_name)
    if not os.path.exists(raw_path):
        print(f'skip (missing): {raw_name}')
        return
    bg = gradient_bg(W, H)
    draw = ImageDraw.Draw(bg)

    # ---- Headline + subtitle (top of card) ----
    pad_x = 90
    headline_font = fit_font(draw, headline, W - pad_x * 2, 102)
    sub_font = ImageFont.truetype(FONT_PATH, 38)
    headline_y = 180
    hb = draw.textbbox((0, 0), headline, font=headline_font)
    hx = (W - (hb[2] - hb[0])) // 2 - hb[0]
    draw.text((hx, headline_y), headline, font=headline_font, fill=INK)

    sub_lines = wrap_text(draw, sub, sub_font, W - pad_x * 2)
    sy = headline_y + (hb[3] - hb[1]) + 30
    for line in sub_lines:
        lb = draw.textbbox((0, 0), line, font=sub_font)
        lx = (W - (lb[2] - lb[0])) // 2 - lb[0]
        draw.text((lx, sy), line, font=sub_font, fill=(180, 160, 145))
        sy += (lb[3] - lb[1]) + 14

    # ---- Screenshot (centered below the headline block) ----
    shot = Image.open(raw_path).convert('RGB')
    # Scale to ~78% of canvas width, preserving aspect.
    target_w = int(W * 0.78)
    sw, sh = shot.size
    target_h = int(sh * (target_w / sw))
    shot = shot.resize((target_w, target_h), Image.LANCZOS)
    shot_rounded = rounded_corners(shot, 76)

    # Drop shadow under the device.
    shadow = Image.new('RGBA', (target_w + 80, target_h + 80), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((40, 60, target_w + 40, target_h + 60), 76, fill=(0, 0, 0, 160))
    shadow = shadow.filter(ImageFilter.GaussianBlur(34))

    shot_x = (W - target_w) // 2
    shot_y = sy + 80
    bg.paste(shadow, (shot_x - 40, shot_y - 20), shadow)
    bg.paste(shot_rounded, (shot_x, shot_y), shot_rounded)

    # ---- Brand mark at very bottom (subtle) ----
    mark_font = ImageFont.truetype(FONT_PATH, 70)
    nb = draw.textbbox((0, 0), 'n', font=mark_font)
    n_w = nb[2] - nb[0]
    n_h = nb[3] - nb[1]
    dot_d = 14
    gap = 6
    total = n_w + gap + dot_d
    mx = (W - total) // 2 - nb[0]
    my = H - 180 - n_h
    draw.text((mx, my), 'n', font=mark_font, fill=INK)
    dx = mx + n_w + gap + nb[0]
    dy = my + nb[1] + n_h - dot_d
    draw.ellipse((dx, dy, dx + dot_d, dy + dot_d), fill=EMBER)

    out_path = os.path.join(OUT, out_name)
    bg.save(out_path, 'PNG', optimize=True)
    print(f'built {out_name} ({W}x{H})')

def main():
    if not os.path.exists(FONT_PATH):
        # When run on the user's Mac the font lives in node_modules — fall
        # back gracefully so they can swap the path.
        local = os.path.join(HERE, '..', 'mobile', 'node_modules',
                             '@expo-google-fonts', 'bricolage-grotesque',
                             '800ExtraBold',
                             'BricolageGrotesque_800ExtraBold.ttf')
        if os.path.exists(local):
            import shutil
            shutil.copy(local, FONT_PATH)
        else:
            raise SystemExit(f'Font not found at {FONT_PATH} or {local}.')

    for i, (raw, headline, sub) in enumerate(SHOTS, 1):
        build_one(raw, headline, sub, f'{i:02d}.png')

if __name__ == '__main__':
    main()
