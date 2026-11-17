#!/usr/bin/env python3
"""Cover regions of a screenshot with solid blocks (not blur: blur can be partly reversed).
Usage: python3 tools/redact.py in.png out.webp --width 1600 x,y,w,h [x,y,w,h ...]
Boxes are in the input image's pixels. Check the result by eye before publishing."""
import argparse
from PIL import Image, ImageDraw
ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("dst"); ap.add_argument("boxes", nargs="*")
ap.add_argument("--width", type=int, default=1600); ap.add_argument("--fill", default="#2b2e40")
a = ap.parse_args()
im = Image.open(a.src).convert("RGB"); d = ImageDraw.Draw(im)
for b in a.boxes:
    x, y, w, h = map(int, b.split(","))
    d.rounded_rectangle((x, y, x + w, y + h), radius=8, fill=a.fill)
if a.width and im.width > a.width:
    im = im.resize((a.width, round(im.height * a.width / im.width)), Image.LANCZOS)
im.save(a.dst, quality=84)
print(a.dst, im.size)
