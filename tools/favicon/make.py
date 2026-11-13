# Favicon step 1: build the monogram SVGs from Instrument Serif's own letter outlines.
#   PYTHONPATH=<dir with fonttools + brotli> python3 tools/favicon/make.py assets/fonts/instrument-serif-latin.woff2 tools/favicon
# Then step 2 (pack.py) renders the PNGs and the .ico.
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
font, out = sys.argv[1], sys.argv[2]
f = TTFont(font); gs = f.getGlyphSet(); cmap = f.getBestCmap()
INK, PAPER = "#141b2a", "#f3f3ee"

def word_path(text, cap, cx, cy, track=0, stroke=0):
    """Path for `text` with cap height `cap` (px), centred on (cx, cy)."""
    upm_cap = 720.0; s = cap / upm_cap
    names = [cmap[ord(c)] for c in text]
    # measure ink width
    x = 0; boxes = []
    for i, n in enumerate(names):
        b = BoundsPen(gs); gs[n].draw(b); x0, y0, x1, y1 = b.bounds
        boxes.append((x, x0, x1)); x += gs[n].width + track
    left = boxes[0][0] + boxes[0][1]; right = boxes[-1][0] + boxes[-1][2]
    width = (right - left) * s
    ox = cx - width / 2 - left * s; oy = cy + cap / 2
    pen = SVGPathPen(gs)
    for (adv, _, _), n in zip(boxes, names):
        gs[n].draw(TransformPen(pen, (s, 0, 0, -s, ox + adv * s, oy)))
    d = pen.getCommands()
    # round numbers to keep files small
    import re
    d = re.sub(r"-?\d+\.\d+", lambda m: ("%.2f" % float(m.group())).rstrip("0").rstrip("."), d)
    return d, width

def svg(size, rx, cap, plus=None, full=False, scale=1.0, stroke=0, track=0, note=""):
    c = size / 2
    d, w = word_path("IN", cap * scale, c, c, track=track)
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">']
    if note: parts.append(f"  <!-- {note} -->")
    parts.append(f'  <rect width="{size}" height="{size}"' + ("" if full else f' rx="{rx}"') + f' fill="{INK}"/>')
    st = f' stroke="{PAPER}" stroke-width="{stroke}" stroke-linejoin="round"' if stroke else ""
    parts.append(f'  <path fill="{PAPER}"{st} d="{d}"/>')
    parts.append("</svg>\n")
    return "\n".join(parts), w

for name, args in {
    "icon.svg": dict(size=32, rx=7, cap=19, stroke=0.7, track=70, note="Monogram IN in Instrument Serif (the site's display face), paper on navy ink"),
    "icon-16.svg": dict(size=16, rx=3, cap=11, stroke=0.55, track=110, note="16px version: slightly bolder strokes so the hairlines survive"),
    "icon-full.svg": dict(size=32, rx=0, cap=19, full=True, stroke=0.5, track=70, note="Full-bleed: iOS and Android round the corners themselves"),
    "icon-maskable.svg": dict(size=32, rx=0, cap=14, full=True, stroke=0.4, track=70, note="Maskable: the letters sit inside the central safe circle"),
}.items():
    s, w = svg(**args); open(f"{out}/{name}", "w").write(s); print(name, "ink width", round(w, 2), len(s), "bytes")
