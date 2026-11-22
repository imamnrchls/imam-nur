/* Inner pages: everything is rendered from content.js */
(function () {
  const S = window.SITE, U = window.UI, esc = U.esc;
  const page = document.body.dataset.page;
  const main = document.getElementById("page");
  const params = new URLSearchParams(location.search);
  const fmtDate = (d) => { const x = new Date(d + "T00:00:00"); return isNaN(x) ? esc(d) : x.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); };
  // width/height attributes reserve the space before an image loads (no layout jump)
  const size = (p) => (p.w > 0 && p.h > 0 ? ` width="${+p.w}" height="${+p.h}"` : "");

  // Simple text → HTML. Blank line = paragraph, "## " = heading, "> " = quote, "- " = list,
  // ``` fenced block = code, [text](url) = link.
  function prose(text) {
    const codes = [];
    const src = String(text || "").replace(/```[^\n]*\n([\s\S]*?)```/g, (m, c) => {
      codes.push(c.replace(/\s+$/, ""));
      return `\n\n@@CODE${codes.length - 1}@@\n\n`;
    });
    const link = (t) => t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|[\w./#-]+)\)/g, '<a href="$2">$1</a>');
    return src.split(/\n\s*\n/).map((raw) => {
      const b = raw.trim();
      if (!b) return "";
      const code = b.match(/^@@CODE(\d+)@@$/);
      if (code) return `<div class="codeblock"><button type="button" class="copy small" aria-label="Copy code to clipboard">Copy</button><pre tabindex="0"><code>${esc(codes[+code[1]])}</code></pre></div>`;
      if (b.startsWith("## ")) return `<h2>${link(esc(b.slice(3)))}</h2>`;
      if (b.startsWith("> ")) return `<blockquote><p>${link(esc(b.replace(/^> ?/gm, ""))).replace(/\n/g, "<br>")}</p></blockquote>`;
      if (b.startsWith("- ")) return `<ul>${b.split("\n").map((l) => `<li>${link(esc(l.replace(/^- /, "")))}</li>`).join("")}</ul>`;
      return `<p>${link(esc(b)).replace(/\n/g, "<br>")}</p>`;
    }).join("");
  }
  // Break long titles into lines of roughly `max` characters
  function toLines(text, max = 12) {
    const out = []; let cur = "";
    String(text).toUpperCase().split(/\s+/).forEach((w) => {
      if (cur && (cur + " " + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w;
    });
    if (cur) out.push(cur);
    return out;
  }
  const head = (lines, lede = "", code = "") => {
    document.querySelector(".page-code").textContent = code;
    return `<header class="page-head"><h1 class="title" id="pageTitle"></h1>${lede ? `<div class="lede"><p class="small muted">${code ? esc(code) : ""}</p><p data-reveal>${esc(lede)}</p></div>` : ""}</header>`;
  };
  const menuItem = (key) => S.menu.find((m) => m.href.startsWith(key)) || { code: "" };

  /* ---------- Portfolio artwork ----------
     Projects without a public screenshot get a small artwork drawn from their real numbers
     (dots, rings, bars… in SVG). Same seed → same picture on every visit. */
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const hash = (str) => [...String(str)].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);
  const f = (n) => Math.round(n * 10) / 10;
  function artSvg(p, compact = false) {
    const a = p.art || {}, r = rng(hash(p.id)), W = 600, H = 400;
    // Archival poster frame: hairline border, corner registration marks, and faint serif watermark
    const reg = (x, y) => `<path class="a-reg" d="M${x - 5} ${y}h10M${x} ${y - 5}v10"/>`;
    const wm = !compact && p.stats?.[0]?.[0] ? `<text class="a-wm" x="${W - 32}" y="${H - 34}" text-anchor="end">${esc(p.stats[0][0])}</text>` : "";
    let g = `<rect class="a-frame" x="16" y="16" width="${W - 32}" height="${H - 32}" fill="none"/>` +
      reg(28, 28) + reg(W - 28, 28) + reg(28, H - 28) + reg(W - 28, H - 28) + wm;
    if (a.kind === "dots") {
      const cols = 25, rows = Math.ceil(a.total / cols), gap = 19, x0 = (W - (cols - 1) * gap) / 2, y0 = (H - (rows - 1) * gap) / 2;
      const hi = new Set(), hiMax = Math.min(Math.max(0, a.hi || 0), a.total);
      while (hi.size < hiMax) hi.add(Math.floor(r() * a.total));
      const pts = [];
      for (let k = 0; k < a.total; k++) {
        const cx = f(x0 + (k % cols) * gap), cy = f(y0 + Math.floor(k / cols) * gap);
        if (hi.has(k)) pts.push([cx, cy]);
      }
      // Faint constellation hairlines linking a subset of highlighted hires
      for (let k = 1; k < pts.length; k += 2) {
        g += `<line class="a-hair" x1="${pts[k - 1][0]}" y1="${pts[k - 1][1]}" x2="${pts[k][0]}" y2="${pts[k][1]}"/>`;
      }
      for (let k = 0; k < a.total; k++) {
        const cx = f(x0 + (k % cols) * gap), cy = f(y0 + Math.floor(k / cols) * gap), isHi = hi.has(k);
        if (isHi) g += `<circle class="a-halo" cx="${cx}" cy="${cy}" r="10.5"/>`;
        g += `<circle data-a class="${isHi ? "a-hi" : "a-ink"}" cx="${cx}" cy="${cy}" r="${isHi ? 5.6 : 3.2}"/>`;
      }
    } else if (a.kind === "rings") {
      // Astrolabe compass spokes + outer drafting ring
      g += `<circle class="a-hair" cx="${W / 2}" cy="${H / 2}" r="188" fill="none" stroke-dasharray="2 6"/>`;
      for (let k = 0; k < 12; k++) {
        const t = (k / 12) * Math.PI * 2;
        g += `<line class="a-hair" x1="${f(W / 2 + Math.cos(t) * 34)}" y1="${f(H / 2 + Math.sin(t) * 34)}" x2="${f(W / 2 + Math.cos(t) * 188)}" y2="${f(H / 2 + Math.sin(t) * 188)}"/>`;
      }
      g += reg(W / 2, H / 2);
      a.rings.forEach((n, ri) => {
        const rad = [166, 118, 70][ri] || 40, dr = [2.4, 3.1, 4.8][ri] || 3;
        g += `<circle class="a-line" cx="${W / 2}" cy="${H / 2}" r="${rad}" fill="none"/>`;
        for (let k = 0; k < n; k++) { const t = (k / n) * Math.PI * 2 - Math.PI / 2; g += `<circle data-a class="${ri === 2 ? "a-hi" : "a-ink"}" cx="${f(W / 2 + Math.cos(t) * rad)}" cy="${f(H / 2 + Math.sin(t) * rad)}" r="${dr}"/>`; }
      });
    } else if (a.kind === "bars") {
      const n = a.from, gap = 36, x0 = (W - (n - 1) * gap) / 2, drop = new Set(), dropMax = Math.min(Math.max(0, n - (a.to || 0)), n);
      while (drop.size < dropMax) drop.add(Math.floor(r() * n));
      // Horizontal architectural guide lines
      [90, 170, 250].forEach((y) => { g += `<line class="a-hair" x1="${x0 - 24}" x2="${W - x0 + 24}" y1="${y}" y2="${y}"/>`; });
      for (let k = 0; k < n; k++) {
        const h = 140 + r() * 125, gone = drop.has(k), x = f(x0 + k * gap), y = f(328 - h);
        g += `<rect data-b class="${gone ? "a-faint" : "a-ink"}" x="${f(x - 5)}" y="${y}" width="10" height="${f(h)}"/>`;
        if (!gone) g += `<rect class="a-hi" x="${f(x - 5)}" y="${y}" width="10" height="5"/>`;
        if (!compact) g += `<text class="a-idx" x="${x}" y="356" text-anchor="middle">${String(k + 1).padStart(2, "0")}</text>`;
      }
      g += `<line class="a-line" x1="${x0 - 24}" x2="${W - x0 + 24}" y1="336" y2="336"/>`;
    } else if (a.kind === "waves") {
      for (let x = 60; x < W; x += 60) g += `<line class="a-hair" x1="${x}" x2="${x}" y1="34" y2="${H - 34}"/>`;
      for (let k = 0; k < 9; k++) {
        const amp = 44 - k * 3.2, ph = k * 0.5, y = 92 + k * 27; let d = "";
        for (let x = 24; x <= W - 24; x += 10) d += `${x === 24 ? "M" : "L"}${x} ${f(y + Math.sin(x / 62 + ph) * amp * (1 - x / (W * 1.25)))} `;
        g += `<path data-w pathLength="1" class="${k === 4 ? "a-hi-line" : "a-line"}" d="${d}" fill="none"/>`;
        if (k === 4) {
          for (let x = 94; x < W - 60; x += 120) {
            const cy = f(y + Math.sin(x / 62 + ph) * amp * (1 - x / (W * 1.25)));
            g += `<circle data-a class="a-hi" cx="${x}" cy="${cy}" r="4.5"/>`;
          }
        }
      }
    } else if (a.kind === "stairs") {
      const n = a.steps.length, w = 82, gap = 8, x0 = (W - (n * w + (n - 1) * gap)) / 2;
      a.steps.forEach((label, k) => {
        const h = 70 + k * 46, x = x0 + k * (w + gap);
        g += `<g data-b><rect class="${k === n - 1 ? "a-hi" : "a-ink"}" x="${f(x)}" y="${f(350 - h)}" width="${w}" height="${h}"/><text class="a-txt" x="${f(x + 8)}" y="${f(350 - h + 20)}">${esc(label)}</text></g>`;
      });
    }
    return `<svg class="art" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(a.label || p.title)}" preserveAspectRatio="xMidYMid slice">${g}</svg>${!compact && a.label ? `<figcaption class="art-cap small">${esc(a.label)}</figcaption>` : ""}`;
  }
  /* ---------- Dial cover (project with `dial`) ----------
     A watch made of watches: the faces sit around a dial like hour marks, a seconds hand sweeps in step
     with the real clock, and each face lifts as the hand passes it. The centre shows the visitor's time
     and the name of the face under the hand. Started by initDials() after render. */
  const dialHtml = (p) => {
    const ticks = Array.from({ length: 60 }, (_, k) => { const t = (k * 6 * Math.PI) / 180, r1 = k % 6 ? 47.2 : 45.6; return `<line x1="${f(50 + Math.sin(t) * r1)}" y1="${f(50 - Math.cos(t) * r1)}" x2="${f(50 + Math.sin(t) * 49)}" y2="${f(50 - Math.cos(t) * 49)}"${k % 6 ? "" : ' class="major"'}/>`; }).join("");
    return `<div class="dial" role="img" aria-label="${esc(p.coverAlt || p.title)}">
      <div class="dial-ring">
        <svg class="dial-ticks" viewBox="0 0 100 100" aria-hidden="true">${ticks}</svg>
        <div class="dial-sweep" aria-hidden="true"></div>
        ${p.dial.map((d, k) => `<span class="dial-face" data-name="${esc(d.name)}"><img src="${esc(d.src)}" alt="" width="216" height="216" decoding="async"></span>`).join("")}
        <div class="dial-hand" aria-hidden="true"></div>
        <div class="dial-read" aria-hidden="true"><span class="dial-by small">imemnur</span><b class="dial-time">00:00</b><span class="dial-name small"></span></div>
      </div>
    </div>`;
  };
  const plate = (p, i) => {
    const n = String(i + 1).padStart(2, "0"), href = `project.html?id=${encodeURIComponent(p.id)}`;
    const isShot = !p.dial && !!p.cover;
    return `<article class="plate${i % 2 ? " flip" : ""}" id="${esc(p.id)}" data-plate>
      <a class="plate-art tone-${i % 4}" href="${href}" aria-label="Open ${esc(p.title)}" data-reveal>
        <div class="plate-frame${p.dial ? " is-dial" : isShot ? " is-shot" : ""}">${p.dial ? dialHtml(p) : isShot ? `<div class="plate-mat"><img src="${esc(p.cover)}" alt="${esc(p.coverAlt || p.title)}" loading="lazy" decoding="async"></div><span class="shot-meta small" aria-hidden="true">${esc(p.code)} · ${esc(p.year)}</span>` : artSvg(p)}</div>
        <span class="plate-tag small">PL.${n}</span>
      </a>
      <div class="plate-body">
        <span class="plate-no" aria-hidden="true">${n}</span>
        <p class="small muted" data-reveal>${esc(p.code)} · ${esc(p.type)} · ${esc(p.year)}</p>
        <h2 class="plate-t" data-reveal><a href="${href}">${esc(p.title)}</a></h2>
        <p class="plate-sum" data-reveal>${esc(p.summary)}</p>
        ${p.stats?.length ? `<ul class="figs" data-reveal>${p.stats.map(([v, l]) => `<li><b>${esc(v)}</b><span>${esc(l)}</span></li>`).join("")}</ul>` : ""}
        <a class="plate-open small" href="${href}" data-reveal>Open project ${U.icon("ne")}</a>
      </div>
    </article>`;
  };

  let titleLines = [], html = "";
  const notFound = (what) => { titleLines = ["NOT", "FOUND"]; html = head(titleLines) + `<p class="prose">That ${what} doesn't exist. <a href="index.html">Back home</a>.</p>`; };

  switch (page) {
    case "portfolio": {
      titleLines = ["PORTFOLIO"];
      const years = S.portfolio.map((p) => (String(p.year).match(/\d{4}/g) || [])).flat().map(Number).filter(Boolean);
      const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : "";
      const initView = params.get("view") === "index" ? "index" : "plates";
      html = head(titleLines, `${S.portfolio.length} pieces of work${span ? `, ${span}` : ""}: people systems, software and research.`, menuItem("portfolio").code) +
        `<div class="marquee" aria-hidden="true"><div class="marquee-track">${[0, 1].map(() => `<span>${(S.portfolioTags || []).map((t) => `<i>${esc(t)}</i>`).join("")}</span>`).join("")}</div></div>
        <div class="view-bar small" role="group" aria-label="Portfolio view">
          <span class="muted">${S.portfolio.length} works${span ? ` · ${span}` : ""}</span>
          <div class="view-tabs">
            <button type="button" class="view-btn${initView === "plates" ? " is-on" : ""}" data-view="plates" aria-pressed="${initView === "plates"}">Exhibition</button>
            <span class="muted" aria-hidden="true">/</span>
            <button type="button" class="view-btn${initView === "index" ? " is-on" : ""}" data-view="index" aria-pressed="${initView === "index"}">Index</button>
          </div>
        </div>
        <ol class="rows index"${initView === "index" ? "" : " hidden"}>${S.portfolio.map((p, i) => `
          <li class="row" data-reveal><a href="project.html?id=${encodeURIComponent(p.id)}" data-pi="${i}">
            <span class="code">${esc(p.code)}</span><span class="t">${esc(p.title)}</span>
            <span class="code x mid">${esc(p.type)}</span><span class="code r">${esc(p.year)}</span>
          </a></li>`).join("")}</ol>
        <div class="plates"${initView === "plates" ? "" : " hidden"}>${S.portfolio.map((p, i) => plate(p, i)).join("")}</div>`;
      break;
    }
    case "project": {
      const i = S.portfolio.findIndex((p) => p.id === params.get("id"));
      if (i < 0) { notFound("project"); break; }
      const p = S.portfolio[i], next = S.portfolio[(i + 1) % S.portfolio.length];
      document.title = `${p.title} — ${S.name.join(" ")}`;
      titleLines = toLines(p.title);
      const shots = (p.gallery || []).map((g) => (typeof g === "string" ? { src: g } : g));
      const shotFig = (g) => `<figure class="shot${g.phone ? " phone" : ""}" data-reveal><div class="shot-img"><img src="${esc(g.src)}" alt="${esc(g.alt || g.caption || "")}"${size(g)} loading="lazy" decoding="async"></div>${g.caption ? `<figcaption class="small muted">${esc(g.caption)}</figcaption>` : ""}</figure>`;
      // consecutive phone shots sit together in one tinted band
      const shotsHtml = shots.reduce((acc, g, k) => {
        if (g.phone) { if (shots[k - 1]?.phone) acc[acc.length - 1].items.push(g); else acc.push({ band: true, items: [g] }); } else acc.push({ items: [g] });
        return acc;
      }, []).map((grp) => grp.band ? `<div class="shot-band">${grp.items.map(shotFig).join("")}</div>` : shotFig(grp.items[0])).join("");
      html = head(titleLines, p.summary, p.code) +
        `<figure class="cover ${p.dial ? "dial-cover" : p.cover ? "shot-cover tone-" + (i % 4) : "art-cover tone-" + (i % 4)}" data-reveal>${p.dial ? dialHtml(p) : p.cover
          ? `<div class="plate-mat"><img src="${esc(p.cover)}" alt="${esc(p.coverAlt || p.title)}" class="parallax"></div><span class="shot-meta small" aria-hidden="true">${esc(p.code)} · ${esc(p.year)}</span>`
          : artSvg(p)}</figure>
         ${p.stats?.length ? `<ul class="figs wide" data-reveal>${p.stats.map(([n, l]) => `<li><b>${esc(n)}</b><span>${esc(l)}</span></li>`).join("")}</ul>` : ""}
         <article class="article">
           <div class="meta small" data-reveal><span>${esc(p.code)}</span><span class="muted">${esc(p.type)}</span><span class="muted">${esc(p.year)}</span>
             ${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">Visit project ${U.icon("ne")}</a>` : ""}<a href="portfolio.html">${U.icon("left")} All work</a></div>
           <div class="prose" data-reveal>${prose(p.body)}</div>
         </article>
         ${shotsHtml ? `<div class="shots">${shotsHtml}</div>` : ""}
         ${S.portfolio.length > 1 ? `<a class="next-link" href="project.html?id=${encodeURIComponent(next.id)}"><span class="small">Next project — ${esc(next.code)}</span><span class="t">${esc(next.title)}</span></a>` : ""}`;
      break;
    }
    case "photos": {
      titleLines = ["GALLERY"];
      html = !S.photos.length ? head(titleLines, "Nothing here yet.", menuItem("photos").code) : head(titleLines, "A running archive of photographs and short videos. Click any one to view it larger.", menuItem("photos").code) +
        `<div class="photo-grid">${S.photos.map((p, i) => `
          <figure class="photo" data-reveal data-i="${i}" tabindex="0" role="button" aria-label="Open ${esc(p.caption)}">
            <div class="ph">${p.video
              ? `<video data-src="${esc(p.video)}"${p.thumb ? ` poster="${esc(p.thumb)}"` : ""}${size(p)} muted loop playsinline preload="none" aria-label="${esc(p.caption)}"></video>`
              : `<img src="${esc(p.thumb || p.src)}" alt="${esc(p.caption)}"${size(p)} loading="lazy" decoding="async">`}</div>
            <figcaption class="small"><span>${esc(p.code)}</span><span class="muted">${esc(p.place)}</span></figcaption>
          </figure>`).join("")}</div>
        <div class="lightbox" role="dialog" aria-modal="true" aria-label="Gallery viewer">
          <div class="lb-top small"><span class="lb-code"></span><button type="button" class="lb-close small">Close ${U.icon("close")}</button></div>
          <div class="lb-stage"><img alt=""><video controls playsinline loop hidden></video></div>
          <div class="lb-bot small"><button type="button" class="lb-prev small">${U.icon("left")} Prev</button><span class="lb-cap"></span><button type="button" class="lb-next small">Next ${U.icon("right")}</button></div>
        </div>`;
      break;
    }
    case "writing": {
      titleLines = ["WRITING"];
      html = head(titleLines, "Essays, notes and things I want to remember.", menuItem("writing").code) +
        `<ol class="rows">${S.writing.map((w) => `
          <li class="row" data-reveal><a href="article.html?slug=${encodeURIComponent(w.slug)}">
            <span class="code">${esc(w.code)}</span>
            <span><span class="t">${esc(w.title)}</span><p class="ex">${esc(w.excerpt)}</p></span>
            <span class="code x mid">${esc((w.tags || []).join(", "))}</span><span class="code r">${fmtDate(w.date)}</span>
          </a></li>`).join("")}</ol>`;
      break;
    }
    case "article": {
      const i = S.writing.findIndex((w) => w.slug === params.get("slug"));
      if (i < 0) { notFound("piece of writing"); break; }
      const w = S.writing[i], next = S.writing[(i + 1) % S.writing.length];
      document.title = `${w.title} — ${S.name.join(" ")}`;
      titleLines = toLines(w.title);
      html = head(titleLines, w.excerpt, w.code) +
        `<article class="article">
           <div class="meta small" data-reveal><span>${fmtDate(w.date)}</span><span class="muted">${esc(w.code)}</span>${w.tags?.length ? `<span class="muted">${esc(w.tags.join(", "))}</span>` : ""}<a href="writing.html">${U.icon("left")} All writing</a>${w.source ? `<a href="${esc(w.source)}" target="_blank" rel="noopener">Original post ${U.icon("ne")}</a>` : ""}</div>
           <div class="prose" data-reveal>${prose(w.body)}</div>
         </article>
         ${S.writing.length > 1 ? `<a class="next-link" href="article.html?slug=${encodeURIComponent(next.slug)}"><span class="small">Read next — ${esc(next.code)}</span><span class="t">${esc(next.title)}</span></a>` : ""}`;
      break;
    }
    case "about": {
      titleLines = ["ABOUT"];
      const a = S.about, records = (S.music || []).length;
      const num = (i) => String(i + 1).padStart(2, "0");
      const words = (list, cls) => list.map((w) => `<span class="${cls}">${esc(w)}</span>`).join('<i class="pick-mark" aria-hidden="true"></i>');
      html = head(titleLines, S.role, menuItem("about").code) +
        `<section class="about-open${a.image ? "" : " no-portrait"}">
           ${a.image ? `<figure class="about-fig" data-reveal>
             <div class="portrait"${a.ascii === false ? "" : " data-ascii"}><img src="${esc(a.image)}" alt="Portrait of Imam" class="parallax"></div>
             ${a.caption ? `<figcaption class="small muted">${esc(a.caption)}</figcaption>` : ""}
           </figure>` : ""}
           <div class="about-words">
             ${a.statement ? `<p class="statement" data-reveal>${esc(a.statement)}</p>` : ""}
             ${a.intro ? `<p class="intro" data-reveal>${esc(a.intro)}</p>` : ""}
           </div>
         </section>
         ${a.chapters?.length ? `<ol class="chapters">${a.chapters.map((c, i) => `
           <li class="chapter" data-reveal>
             <span class="ch-no" aria-hidden="true">${num(i)}</span>
             <h2 class="ch-title">${esc(c.title)}</h2>
             <div class="ch-text"><p>${esc(String(c.text).replace("{records}", records))}</p>
               ${c.link ? `<a class="ch-link small" href="${esc(c.link.href)}">${esc(c.link.label)} ${U.icon("ne")}</a>` : ""}</div>
           </li>`).join("")}</ol>` : ""}
         <section class="index-of" aria-labelledby="index-h">
           <h2 class="facts-label small" id="index-h" data-reveal>A partial index</h2>
           ${records ? `<p class="index-row" data-reveal><a class="index-key small" href="music.html">Records</a>${words(S.music.map((m) => m.title), "iw")}</p>` : ""}
           ${a.films?.length ? `<p class="index-row" data-reveal><span class="index-key small">Films</span>${words(a.films, "iw")}</p>` : ""}
           ${a.also?.length ? `<p class="index-row" data-reveal><span class="index-key small">Also</span>${words(a.also, "iw")}</p>` : ""}
         </section>
         ${a.facts?.length ? `<section class="about-work">
           <h2 class="facts-label small" data-reveal>At work</h2>
           <ul class="facts" data-reveal>${a.facts.map(([k, v]) => `<li><span class="small muted">${esc(k)}</span><span>${esc(v)}</span></li>`).join("")}</ul>
         </section>` : ""}
         <section class="contact" id="contact">
           <span class="small">${esc(menuItem("about.html#contact").code)} — Contact</span><br>
           <a class="mail" href="mailto:${esc(S.email)}" data-reveal>${esc(S.email)}</a>
           <nav class="small" data-reveal>${S.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ${U.icon("ne")}</a>`).join("")}</nav>
         </section>`;
      break;
    }
    case "music": {
      titleLines = ["MUSIC"];
      const list = S.music || [];
      const code = (m, i) => m.code || `MU-${String(i + 1).padStart(3, "0")}`;
      // Tracklist: the songs I recommend (m.picks = track numbers) carry the site's "+" mark.
      const secs = (t) => { const [mm, ss] = String(t).split(":").map(Number); return (mm || 0) * 60 + (ss || 0); };
      const tracklist = (m) => {
        const tracks = m.tracks || [], picks = new Set(m.picks || []);
        if (!tracks.length) return "";
        const mins = Math.round(tracks.reduce((n, [, t]) => n + secs(t), 0) / 60);
        return `<div class="tracks-wrap">
          <div class="tracks-head small"><span>Tracklist — ${tracks.length} songs, ${mins} min</span>${picks.size ? `<span class="tracks-key"><i class="pick-mark" aria-hidden="true"></i> Start here</span>` : ""}</div>
          <ol class="tracks">${tracks.map(([name, time], k) => {
            const pick = picks.has(k + 1);
            return `<li class="track${pick ? " pick" : ""}" data-k="${k}"><span class="tn code">${String(k + 1).padStart(2, "0")}</span><span class="tt">${pick ? '<i class="pick-mark" aria-hidden="true"></i>' : ""}<span>${esc(name)}</span>${pick ? '<span class="sr-only"> (recommended)</span>' : ""}</span><span class="td code">${esc(time)}</span></li>`;
          }).join("")}</ol>
        </div>`;
      };
      html = !list.length ? head(titleLines, "No recommendations here yet.", menuItem("music").code) : head(titleLines, `${list.length} records I keep coming back to. Open one to see what to play first.`, menuItem("music").code) +
        `<div class="covers" data-reveal aria-hidden="true">${list.map((m, i) => m.cover ? `<button type="button" tabindex="-1" data-open="${i}"><img src="${esc(m.cover)}" alt="" loading="lazy"></button>` : "").join("")}</div>
        <ol class="records">${list.map((m, i) => `
          <li class="rec" data-reveal>
            <button type="button" class="rec-row" aria-expanded="false" aria-controls="rec-${i}"${m.cover ? ` data-cover="${esc(m.cover)}"` : ""}>
              <span class="code">${esc(code(m, i))}</span>
              <span class="rec-t">${esc(m.title || "")}</span>
              <span class="code x mid">${esc(m.artist || "")}</span>
              <span class="code r">${esc(m.year || m.kind || "")}<i class="rec-plus" aria-hidden="true"></i></span>
            </button>
            <div class="rec-panel" id="rec-${i}">
              <div class="rec-inner">
                <div class="rec-side">
                  ${m.cover ? `<div class="rec-media" aria-hidden="true">
                    <div class="rec-disc"><div class="rec-spin"><img src="${esc(m.cover)}" alt="" loading="lazy"></div></div>
                    <img class="rec-sleeve" src="${esc(m.cover)}" alt="" loading="lazy">
                  </div>` : ""}
                  <p class="small muted">${esc([m.artist, m.kind, m.year].filter(Boolean).join(" · "))}</p>
                  ${m.note ? `<p class="rec-note">${esc(m.note)}</p>` : ""}
                  ${m.url ? `<a class="btn-listen small" href="${esc(m.url)}" target="_blank" rel="noopener">Listen on Apple Music ${U.icon("ne")}</a>` : ""}
                </div>
                ${tracklist(m)}
              </div>
            </div>
          </li>`).join("")}</ol>`;
      break;
    }
    default: notFound("page");
  }

  main.innerHTML = html;
  // Per-item CSS values are set here, not in style="" attributes, so the CSP can forbid inline styles
  main.querySelectorAll("[data-k]").forEach((el) => el.style.setProperty("--k", el.dataset.k));

  /* ---------- Title: split, fit, animate ---------- */
  const titleEl = document.getElementById("pageTitle");
  const chars = U.splitTitle(titleEl, titleLines);
  const fit = () => {
    const cs = getComputedStyle(main);
    const w = main.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    U.fitTitle(titleEl, { width: 1, height: titleLines.length > 1 ? 0.55 : 0.32, box: { clientWidth: w, clientHeight: innerHeight } });
  };
  fit();
  document.fonts?.ready.then(() => { fit(); window.ScrollTrigger?.refresh(); });
  U.onResize(() => { fit(); window.ScrollTrigger?.refresh(); });

  if (U.hasGsap && !U.reduced) {
    gsap.set(chars, { yPercent: 110 });
    U.reveal();
    gsap.to(chars, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.04, delay: 0.45 });
    gsap.from(".topbar > *", { autoAlpha: 0, y: -10, duration: 1, stagger: 0.08, delay: 0.6 });
    if (window.ScrollTrigger) {
      document.querySelectorAll(".parallax").forEach((img) => {
        gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }
  } else U.reveal();
  U.initReveals();

  /* ---------- Portfolio: Exhibition / Index view toggle + artwork that draws itself in ---------- */
  if (page === "portfolio") {
    const platesEl = document.querySelector(".plates"), indexEl = document.querySelector(".rows.index");
    const viewBtns = [...document.querySelectorAll(".view-btn")];
    const setView = (view) => {
      const isIndex = view === "index";
      platesEl.hidden = isIndex;
      indexEl.hidden = !isIndex;
      viewBtns.forEach((b) => {
        const on = b.dataset.view === view;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on);
      });
      const url = new URL(location.href);
      if (isIndex) url.searchParams.set("view", "index"); else url.searchParams.delete("view");
      history.replaceState(null, "", url);
      const shown = isIndex ? indexEl : platesEl;
      const rev = shown.querySelectorAll("[data-reveal]");
      if (U.hasGsap && !U.reduced) gsap.to(rev, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.04, overwrite: true });
      else rev.forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
      window.ScrollTrigger?.refresh();
      U.lenis?.resize();
    };
    let fp = null;
    if (U.hasGsap && matchMedia("(hover: hover)").matches) {
      fp = document.createElement("div");
      fp.className = "float-preview is-card";
      fp.setAttribute("aria-hidden", "true");
      fp.innerHTML = `<div class="fp-stage"></div><div class="fp-cap small"><span class="fp-id"></span><span class="fp-yr"></span></div>`;
      document.body.appendChild(fp);
      const stage = fp.querySelector(".fp-stage"), fpId = fp.querySelector(".fp-id"), fpYr = fp.querySelector(".fp-yr");
      const xTo = gsap.quickTo(fp, "x", { duration: 0.55, ease: "power3" });
      const yTo = gsap.quickTo(fp, "y", { duration: 0.55, ease: "power3" });
      const rTo = gsap.quickTo(fp, "rotation", { duration: 0.5, ease: "power3" });
      let lastX = 0, tiltTimer = 0;
      addEventListener("mousemove", (e) => {
        xTo(e.clientX); yTo(e.clientY);
        if (!U.reduced) {
          const dx = e.clientX - lastX; lastX = e.clientX;
          rTo(Math.max(-5, Math.min(5, dx * 0.22)));
          clearTimeout(tiltTimer);
          tiltTimer = setTimeout(() => rTo(0), 120);
        }
      }, { passive: true });
      const renderPreview = (idx) => {
        const p = S.portfolio[idx]; if (!p) return;
        const n = String(idx + 1).padStart(2, "0");
        stage.className = `fp-stage tone-${idx % 4}${p.dial ? " is-dial" : p.cover ? " is-shot" : ""}`;
        if (p.dial) {
          stage.innerHTML = `<div class="fp-dial">${p.dial.map((d) => `<img src="${esc(d.src)}" alt="" decoding="async">`).join("")}</div>`;
        } else if (p.cover) {
          stage.innerHTML = `<div class="plate-mat"><img src="${esc(p.cover)}" alt="" decoding="async"></div>`;
        } else {
          stage.innerHTML = artSvg(p, true);
        }
        fpId.textContent = `PL.${n} · ${p.code}`;
        fpYr.textContent = p.year;
      };
      indexEl.querySelectorAll("a[data-pi]").forEach((a) => {
        a.addEventListener("mouseenter", () => {
          renderPreview(+a.dataset.pi);
          gsap.to(fp, { opacity: 1, scale: 1, duration: 0.45, ease: "expo.out", overwrite: "auto" });
        });
        a.addEventListener("mouseleave", () => gsap.to(fp, { opacity: 0, scale: 0.92, duration: 0.35, ease: "expo.out", overwrite: "auto" }));
      });
    }
    viewBtns.forEach((b) => b.addEventListener("click", () => {
      if (b.classList.contains("is-on")) return;
      if (fp) gsap.to(fp, { opacity: 0, scale: 0.92, duration: 0.25, overwrite: "auto" });
      setView(b.dataset.view);
    }));
  }
  if (U.hasGsap && !U.reduced && window.ScrollTrigger) {
    document.querySelectorAll("svg.art").forEach((svg) => {
      const st = { trigger: svg, start: "top 85%", once: true };
      const dots = svg.querySelectorAll("circle[data-a]"), bars = svg.querySelectorAll("[data-b]"), waves = svg.querySelectorAll("path[data-w]");
      if (dots.length) gsap.from(dots, { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: .7, ease: "back.out(2)", stagger: { amount: 1.4, from: "random" }, scrollTrigger: st });
      if (bars.length) gsap.from(bars, { scaleY: 0, transformOrigin: "50% 100%", duration: 1, ease: "expo.out", stagger: .07, scrollTrigger: st });
      if (waves.length) gsap.fromTo(waves, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", stagger: .1, scrollTrigger: st });
    });
    document.querySelectorAll(".plate-mat img").forEach((img) => {
      gsap.fromTo(img, { scale: 1.06 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "center center", scrub: true } });
    });
    document.querySelectorAll(".plate-no").forEach((no) => {
      gsap.fromTo(no, { yPercent: 10 }, { yPercent: -10, ease: "none", scrollTrigger: { trigger: no.closest(".plate"), start: "top bottom", end: "bottom top", scrub: true } });
    });
  }

  /* ---------- Music: open a record (one at a time); the cover follows the cursor over the list ---------- */
  if (page === "music" && (S.music || []).length) {
    const rows = [...document.querySelectorAll(".rec-row")];
    const scrollToRow = (btn) => {
      if (U.lenis) U.lenis.scrollTo(btn, { offset: -90 });
      else btn.scrollIntoView({ behavior: U.reduced ? "auto" : "smooth", block: "start" });
    };
    const refreshAfterToggle = () => { window.ScrollTrigger?.refresh(); U.lenis?.resize(); };
    document.querySelectorAll(".rec-panel").forEach((panel) => {
      panel.addEventListener("transitionend", (e) => { if (e.propertyName === "grid-template-rows") refreshAfterToggle(); });
    });
    const setOpen = (btn, open) => {
      btn.setAttribute("aria-expanded", open); btn.closest(".rec").classList.toggle("open", open);
    };
    let scrollTimer;
    const toggle = (btn) => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      rows.forEach((r) => r !== btn && r.getAttribute("aria-expanded") === "true" && setOpen(r, false));
      setOpen(btn, open);
      clearTimeout(scrollTimer);
      if (U.reduced) { refreshAfterToggle(); if (open) scrollToRow(btn); }
      else if (open) scrollTimer = setTimeout(() => { refreshAfterToggle(); scrollToRow(btn); }, 720);
    };
    rows.forEach((btn) => btn.addEventListener("click", () => toggle(btn)));
    document.querySelectorAll(".covers [data-open]").forEach((c) => c.addEventListener("click", () => { const btn = rows[+c.dataset.open]; if (btn.getAttribute("aria-expanded") !== "true") toggle(btn); else scrollToRow(btn); }));

    if (U.hasGsap && matchMedia("(hover: hover)").matches) {
      const fp = document.createElement("div");
      fp.className = "float-preview square"; fp.innerHTML = "<img alt=''>";
      document.body.appendChild(fp);
      const img = fp.querySelector("img");
      const xTo = gsap.quickTo(fp, "x", { duration: 0.6, ease: "power3" }), yTo = gsap.quickTo(fp, "y", { duration: 0.6, ease: "power3" });
      addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); });
      rows.filter((b) => b.dataset.cover).forEach((b) => {
        b.addEventListener("mouseenter", () => { if (b.getAttribute("aria-expanded") === "true") return; img.src = b.dataset.cover; gsap.to(fp, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" }); });
        b.addEventListener("mouseleave", () => gsap.to(fp, { opacity: 0, scale: 0.9, duration: 0.4, ease: "expo.out" }));
        b.addEventListener("click", () => gsap.to(fp, { opacity: 0, scale: 0.9, duration: 0.3 }));
      });
    }
  }

  /* ---------- Photos: lightbox ---------- */
  if (page === "photos" && S.photos.length) {
    // Grid videos: download and play only while on screen (and never on their own with reduced motion)
    const gridVids = document.querySelectorAll(".photo video[data-src]");
    const load = (v) => { if (!v.src) { v.src = v.dataset.src; v.preload = "auto"; } };
    if ("IntersectionObserver" in window && !U.reduced) {
      const io = new IntersectionObserver((entries) => entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) { load(v); v.play().catch(() => {}); } else v.pause();
      }), { rootMargin: "200px 0px" });
      gridVids.forEach((v) => io.observe(v));
    } else if (!U.reduced) gridVids.forEach((v) => { load(v); v.autoplay = true; });

    const lb = document.querySelector(".lightbox"), lbImg = lb.querySelector("img"), lbVid = lb.querySelector("video");
    let cur = 0, lastFocus = null;
    const show = (i) => {
      cur = (i + S.photos.length) % S.photos.length;
      const p = S.photos[cur];
      lbVid.pause();
      lbImg.hidden = !!p.video; lbVid.hidden = !p.video;
      if (p.video) { lbVid.src = p.video; lbVid.play().catch(() => {}); } else { lbVid.removeAttribute("src"); lbImg.src = p.src; lbImg.alt = p.caption; }
      lb.querySelector(".lb-code").textContent = `${p.code} — ${cur + 1}/${S.photos.length}`;
      lb.querySelector(".lb-cap").textContent = `${p.caption}${p.place ? " · " + p.place : ""}`;
      if (U.hasGsap) gsap.fromTo(p.video ? lbVid : lbImg, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" });
    };
    const open = (i) => {
      lastFocus = document.activeElement; show(i);
      document.body.classList.add("lb-open"); U.lenis?.stop();
      if (U.hasGsap) gsap.to(lb, { autoAlpha: 1, duration: 0.4 }); else { lb.style.visibility = "visible"; lb.style.opacity = 1; }
      lb.querySelector(".lb-close").focus();
    };
    const close = () => {
      lbVid.pause();
      document.body.classList.remove("lb-open");
      if (!document.body.classList.contains("menu-open")) U.lenis?.start();
      if (U.hasGsap) gsap.to(lb, { autoAlpha: 0, duration: 0.3 }); else { lb.style.visibility = "hidden"; lb.style.opacity = 0; }
      lastFocus?.focus();
    };
    document.querySelectorAll(".photo").forEach((f) => {
      f.addEventListener("click", () => open(+f.dataset.i));
      f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(+f.dataset.i); } });
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", () => show(cur - 1));
    lb.querySelector(".lb-next").addEventListener("click", () => show(cur + 1));
    addEventListener("keydown", (e) => {
      if (!document.body.classList.contains("lb-open")) return;
      if (e.key === "Escape") { e.stopImmediatePropagation(); close(); return; }
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
      if (e.key === "Tab") {
        const focusable = [...lb.querySelectorAll("button:not([disabled]), video:not([hidden])")];
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    let sx = 0;
    lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
  }

  /* ---------- Dial covers: sync to the clock ---------- */
  (function initDials() {
    const dials = [...document.querySelectorAll(".dial")];
    if (!dials.length) return;
    const pad = (n) => String(n).padStart(2, "0");
    dials.forEach((d) => {
      const faces = d.querySelectorAll(".dial-face"), n = faces.length;
      if (!n) return;
      d.style.setProperty("--step", `${60 / n}s`);
      faces.forEach((el, k) => { el.style.setProperty("--a", `${(k * 360) / n}deg`); el.style.setProperty("--k", k); });
    });
    const sync = () => dials.forEach((d) => d.style.setProperty("--sync", `${((Date.now() / 1000) % 60).toFixed(3)}s`));
    const tick = () => {
      const now = new Date(), sec = now.getSeconds() + now.getMilliseconds() / 1000;
      const hm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      dials.forEach((d) => {
        const faces = d.querySelectorAll(".dial-face"), n = faces.length;
        if (!n) return;
        d.querySelector(".dial-time").textContent = hm;
        if (U.reduced) return;
        const k = Math.round(sec / (60 / n)) % n;
        const name = d.querySelector(".dial-name"), label = faces[k].dataset.name;
        if (name.textContent !== label) name.textContent = label;
      });
    };
    let timer = 0;
    const start = () => {
      if (timer || document.hidden) return;
      sync(); tick();
      timer = setInterval(tick, U.reduced ? 15000 : 250);
    };
    const stop = () => { clearInterval(timer); timer = 0; };
    start();
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  })();

  /* ---------- Code blocks: copy button ---------- */
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall back below (http pages, older browsers) */ }
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.className = "sr-only";
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }
  document.querySelectorAll(".codeblock .copy").forEach((btn) => {
    let t;
    btn.addEventListener("click", async () => {
      const ok = await copyText(btn.nextElementSibling.innerText.replace(/\n$/, ""));
      btn.textContent = ok ? "Copied" : "Press Ctrl+C";
      btn.classList.toggle("is-done", ok);
      clearTimeout(t);
      t = setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("is-done"); }, 1800);
    });
  });

  // Jump to #contact etc. after render
  if (location.hash) setTimeout(() => { let t = null; try { t = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) { /* malformed hash */ } if (t) U.lenis ? U.lenis.scrollTo(t, { offset: -80, immediate: true }) : t.scrollIntoView(); }, 300);
})();
