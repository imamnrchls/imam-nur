# imam-nur — personal website

A static personal site for portfolio, photos, writing and personal info.
Built with plain HTML, CSS and JavaScript. Animations use [GSAP](https://gsap.com) + ScrollTrigger, and smooth scrolling uses [Lenis](https://github.com/darkroomengineering/lenis). There is no build step.

## Pages

| File | What it shows |
| --- | --- |
| `index.html` | Hero with your name over the mountain photo, with a drifting field of characters behind the name and on the six tiles (`assets/js/ascii-field.js`; turn it off with `heroAscii: false` in `content.js`). The field clears around the mouse and stays still for visitors who prefer reduced motion. Scrolling pins the screen: the photo closes onto the grid line, the name rolls out, a second title rolls in, and six image tiles open. Each tile links to a section. |
| `portfolio.html` → `project.html?id=…` | Project list with a cursor-following preview, plus a detail page for each project |
| `photos.html` | Gallery: photo and video grid with a lightbox (keyboard and swipe) |
| `writing.html` → `article.html?slug=…` | Writing list, plus a reading page for each piece |
| `about.html` (`#contact`) | Bio, facts, email and links. The portrait has the same drifting characters as the homepage, and the mouse clears them (`ascii: false` under `about` in `content.js` turns this off). |
| `music.html` | Music recommendations with Apple Music players |

## Editing content

All text, images and links are in **`assets/js/content.js`**. Edit that file, save it, and refresh the browser.

- To use your own images, put them in `images/` and point to them as `"images/name.webp"` (or `.jpg`).
- **Keep images small.** Resize photos to about 1800 px on the long side (JPEG quality ~80) before adding them. For the Gallery, add an ~800 px WebP copy in `images/photos/thumbs/` as `thumb` (with its `w`/`h`). Use WebP for other pictures: it is often 25–70% smaller than JPEG. Strip metadata first: phone photos and videos often carry the GPS location where they were taken. For example: `ffmpeg -i in.mov -map_metadata -1 -c:v libx264 -crf 26 -c:a aac -b:a 96k -movflags +faststart out.mp4`.
- **Images from other websites:** every page has a Content-Security-Policy that allows images only from this site and `is1-ssl.mzstatic.com` (Apple Music covers). Inline `style="…"` attributes are blocked too, so set per-element CSS values from JavaScript (`el.style.setProperty`). To use another host, add it to `img-src` in `vercel.json` and in the `<meta http-equiv="Content-Security-Policy">` tag of **every** `.html` file. Otherwise the browser blocks the image.
- If you change the one inline `<script>` in the `<head>`, its `sha256-…` hash in the CSP must be updated, or the script stops running.
- The homepage tiles come from the `menu` list.
- In writing `body`, a blank line starts a new paragraph, and a line starting with `## ` becomes a sub-heading.

## Run locally

```bash
node serve.js
```

Then open http://localhost:4174.

## Libraries

GSAP 3.12.5, ScrollTrigger and Lenis 1.1.13 are served from `assets/vendor/`, not a CDN. These files are byte-identical to the npm packages. To upgrade, replace the files and change the `?v=` in the `<script>` tags.

The fonts (Inter Tight and Instrument Serif, SIL Open Font License) are served from `assets/fonts/` (Latin and Latin Extended subsets), not Google Fonts.

Nothing loads from another site except the Apple Music covers on the Music page. So visitors' browsers don't contact Google or a CDN, and a compromised third party cannot change what the site runs.

## Deploy

The site is deployed on **Vercel** from `main`. There is no build command, and the output directory is `/`. It is a plain static site, so it would run on any host, but the security headers below live in `vercel.json`.

**Security headers and caching (Vercel):** `vercel.json` sends the CSP (plus `frame-ancestors 'none'`, which a `<meta>` tag cannot set), HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` (other sites cannot embed your images and files). It also sets caching: `assets/vendor/` and `assets/fonts/` are cached for a year, because those files don't change. `images/` is cached for a week, so **when you replace a picture, give the new file a new name** (and update the path in `content.js`). A file kept under the same name can show the old picture to returning visitors for up to a week. HTML, CSS and JS are not long-cached, so content edits show up immediately. `node serve.js` reads the same `vercel.json`, so the local preview matches the live headers. **If you change the CSP, change it in `vercel.json` and in the `<meta>` tag of every `.html` file.**

The homepage tile images (`images/tiles/`) and the hero and footer pictures are set in `assets/js/content.js`. The hero, footer and tile pictures are pastel drawings made from photos by `tools/paint.js`: run `node serve.js`, open `http://localhost:4174/tools/paint.html?src=images/your-photo.webp`, save the result into `images/` and point `heroImage` (or `footer.art`, or a tile's `image`) at it (the colours are taken from the photo; `&seed=`, `&colors=` and `&w=` in the address change the result; `&scale=0.45` gives smaller strokes for the small tile pictures, and `&detail=0.3&hatch=0.25` keeps detail in a hazy photo like the footer's. Every drawing gets the same colour grade (shadows into one navy ink, highlights toward the page's paper colour, a ceiling on saturation), so pictures from different photos still look like one site; `&grade=0` turns it off). Replace any of them with your own files in `images/`.
