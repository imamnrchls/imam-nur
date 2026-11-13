# Favicon step 2: render every size from the SVGs and write them to the site root.
#   python3 tools/favicon/pack.py        (run from the repository root; needs Playwright and Pillow)
import os, subprocess
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__)); tmp = os.path.join(here, "_png"); os.makedirs(tmp, exist_ok=True)
jobs = [("icon-16.svg", 16, "i16.png"), ("icon.svg", 32, "i32.png"), ("icon.svg", 48, "i48.png"),
        ("icon-full.svg", 180, "apple-touch-icon.png"), ("icon-full.svg", 192, "icon-192.png"),
        ("icon-full.svg", 512, "icon-512.png"), ("icon-maskable.svg", 512, "icon-maskable-512.png")]
args = []
for svg, size, out in jobs: args += [os.path.join(here, svg), str(size), os.path.join(tmp, out)]
subprocess.run(["node", os.path.join(here, "render.js"), *args], check=True)
def opaque(name):  # the tiles are solid; drop the alpha channel where the corners are square
    return Image.open(os.path.join(tmp, name)).convert("RGB")
for name in ("apple-touch-icon.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png"):
    opaque(name).save(name, optimize=True)
# .ico with hand-tuned 16px plus 32 and 48 (rounded corners keep their transparency)
i16, i32, i48 = (Image.open(os.path.join(tmp, n)).convert("RGBA") for n in ("i16.png", "i32.png", "i48.png"))
i48.save("favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[i16, i32])
with open(os.path.join(here, "icon.svg")) as f: open("favicon.svg", "w").write(f.read())
for n in os.listdir(tmp): os.remove(os.path.join(tmp, n))
os.rmdir(tmp)
print("wrote favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png")
