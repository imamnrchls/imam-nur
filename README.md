# imam-nur — personal website

A static personal site for portfolio, photos, writing and personal info.
Built with plain HTML, CSS and JavaScript. Animations use [GSAP](https://gsap.com) + ScrollTrigger, and smooth scrolling uses [Lenis](https://github.com/darkroomengineering/lenis). There is no build step.

## Pages

| File | What it shows |
| --- | --- |
| `index.html` | Hero with your name over the mountain photo. Scrolling pins the screen: the photo closes onto the grid line, the name rolls out, a second title rolls in, and six image tiles open. Each tile links to a section. |
| `portfolio.html` → `project.html?id=…` | Project list with a cursor-following preview, plus a detail page for each project |
| `photos.html` | Photo grid with a lightbox (keyboard and swipe) |
| `writing.html` → `article.html?slug=…` | Writing list, plus a reading page for each piece |
| `about.html` (`#contact`) | Bio, facts, email and links |
| `archive.html` | Every item in one list |

## Editing content

All text, images and links are in **`assets/js/content.js`**. Edit that file, save it, and refresh the browser.

- To use your own images, put them in `images/` and point to them as `"images/name.jpg"`.
- The homepage tiles come from the `menu` list.
- In writing `body`, a blank line starts a new paragraph, and a line starting with `## ` becomes a sub-heading.

## Run locally

```bash
node serve.js
```

Then open http://localhost:4174.

## Deploy

The site is static, so you can host it anywhere:
- **GitHub Pages:** go to Settings → Pages → Deploy from branch → `main` / root.
- **Netlify / Vercel:** import the repo. There is no build command, and the output directory is `/`.

The homepage tile images and the hero and footer pictures are set in `assets/js/content.js`. Replace any of them with your own files in `images/`.
