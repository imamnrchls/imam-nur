# imam-nur — personal website

A static personal site for portfolio, photos, writing and personal info.
Built with plain HTML, CSS and JavaScript. Animations use [GSAP](https://gsap.com) + ScrollTrigger, and smooth scrolling uses [Lenis](https://github.com/darkroomengineering/lenis). There is no build step.

## Pages

| File | What it shows |
| --- | --- |
| `index.html` | Hero with your name over the mountain photo. Scrolling pins the screen: the photo closes onto the grid line, the name rolls out, a second title rolls in, and six image tiles open. Each tile links to a section. |
| `portfolio.html` → `project.html?id=…` | Project list with a cursor-following preview, plus a detail page for each project |
| `photos.html` | Gallery: photo and video grid with a lightbox (keyboard and swipe) |
| `writing.html` → `article.html?slug=…` | Writing list, plus a reading page for each piece |
| `about.html` (`#contact`) | Bio, facts, email and links |
| `music.html` | Music recommendations with Apple Music players |

## Editing content

All text, images and links are in **`assets/js/content.js`**. Edit that file, save it, and refresh the browser.

- To use your own images, put them in `images/` and point to them as `"images/name.jpg"`.
- **Keep images small.** Resize photos to about 1800 px on the long side (JPEG quality ~80) before adding them, and for the Gallery add a ~900 px copy in `images/photos/thumbs/` as `thumb` (with its `w`/`h`). Strip metadata first: phone photos and videos often carry the GPS location where they were taken. For example: `ffmpeg -i in.mov -map_metadata -1 -c:v libx264 -crf 26 -c:a aac -b:a 96k -movflags +faststart out.mp4`.
- **Images from other websites:** every page has a Content-Security-Policy that allows images only from this site, `images.unsplash.com` and `is1-ssl.mzstatic.com` (Apple Music covers). To use another host, add it to `img-src` in `vercel.json` and in the `<meta http-equiv="Content-Security-Policy">` tag of **every** `.html` file. Otherwise the browser blocks the image.
- If you change the one inline `<script>` in the `<head>`, its `sha256-…` hash in the CSP must be updated, or the script stops running.
- The homepage tiles come from the `menu` list.
- In writing `body`, a blank line starts a new paragraph, and a line starting with `## ` becomes a sub-heading.

## Run locally

```bash
node serve.js
```

Then open http://localhost:4174.

## Libraries

GSAP 3.12.5, ScrollTrigger and Lenis 1.1.13 are served from `assets/vendor/`, not a CDN. These files are byte-identical to the npm packages. This removes two third-party connections from every page load. It also means a compromised CDN cannot run code on the site. To upgrade, replace the files and change the `?v=` in the `<script>` tags.

## Deploy

The site is static, so you can host it anywhere:
- **GitHub Pages:** go to Settings → Pages → Deploy from branch → `main` / root.
- **Netlify / Vercel:** import the repo. There is no build command, and the output directory is `/`.

**Security headers and caching (Vercel):** `vercel.json` sends the CSP (plus `frame-ancestors 'none'`, which a `<meta>` tag cannot set), HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy`. It also sets caching: `assets/vendor/` is cached for a year, because those files are pinned by version. `images/` is cached for a week, so if you replace a picture under the same name, rename it to make visitors see it straight away. HTML, CSS and JS are not long-cached, so content edits show up immediately. `node serve.js` reads the same `vercel.json`, so the local preview matches the live headers. **If you change the CSP, change it in `vercel.json` and in the `<meta>` tag of every `.html` file.**

The homepage tile images and the hero and footer pictures are set in `assets/js/content.js`. Replace any of them with your own files in `images/`.
