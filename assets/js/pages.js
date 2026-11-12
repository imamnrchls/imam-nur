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

  let titleLines = [], html = "";
  const notFound = (what) => { titleLines = ["NOT", "FOUND"]; html = head(titleLines) + `<p class="prose">That ${what} doesn't exist. <a href="index.html">Back home</a>.</p>`; };

  switch (page) {
    case "portfolio": {
      titleLines = ["PORTFOLIO"];
      const anyCover = S.portfolio.some((p) => p.cover);
      html = head(titleLines, anyCover ? "Selected projects. Hover a row to preview, click to open." : "Selected projects. Click one to open.", menuItem("portfolio").code) +
        `<ol class="rows">${S.portfolio.map((p) => `
          <li class="row" data-reveal><a href="project.html?id=${encodeURIComponent(p.id)}"${p.cover ? ` data-cover="${esc(p.cover)}"` : ""}>
            <span class="code">${esc(p.code)}</span><span class="t">${esc(p.title)}</span>
            <span class="code x mid">${esc(p.type)}</span><span class="code r">${esc(p.year)}</span>
            ${p.cover ? `<img class="thumb" src="${esc(p.cover)}" alt="" loading="lazy">` : ""}
          </a></li>`).join("")}</ol>`;
      break;
    }
    case "project": {
      const i = S.portfolio.findIndex((p) => p.id === params.get("id"));
      if (i < 0) { notFound("project"); break; }
      const p = S.portfolio[i], next = S.portfolio[(i + 1) % S.portfolio.length];
      document.title = `${p.title} — ${S.name.join(" ")}`;
      titleLines = toLines(p.title);
      html = head(titleLines, p.summary, p.code) +
        `${p.cover ? `<figure class="cover" data-reveal><img src="${esc(p.cover)}" alt="${esc(p.title)}" class="parallax"></figure>` : ""}
         <article class="article">
           <div class="meta small" data-reveal><span>${esc(p.code)}</span><span class="muted">${esc(p.type)}</span><span class="muted">${esc(p.year)}</span>
             ${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">Visit project ${U.icon("ne")}</a>` : ""}</div>
           <div class="prose" data-reveal>${prose(p.body)}</div>
         </article>
         ${p.gallery?.length ? `<div class="gallery">${p.gallery.map((g) => `<img src="${esc(g)}" alt="" loading="lazy" data-reveal>`).join("")}</div>` : ""}
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
      const a = S.about;
      html = head(titleLines, S.role, menuItem("about").code) +
        `<section class="about-grid${a.image ? "" : " no-portrait"}">
           ${a.image ? `<div class="portrait"${a.ascii === false ? "" : " data-ascii"} data-reveal><img src="${esc(a.image)}" alt="Portrait" class="parallax"></div>` : ""}
           <div>
             <div class="prose" data-reveal>${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
             ${[["Off the clock", a.likes], ["At work", a.facts]].filter(([, rows]) => rows?.length).map(([label, rows]) => `
             <h2 class="facts-label small" data-reveal>${esc(label)}</h2>
             <ul class="facts" data-reveal>${rows.map(([k, v]) => `<li><span class="small muted">${esc(k)}</span><span>${esc(v)}</span></li>`).join("")}</ul>`).join("")}
           </div>
         </section>
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
    U.reveal().then(() => {});
    gsap.to(chars, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.04, delay: 0.45 });
    gsap.from(".page-lines i", { scaleY: 0, duration: 1.6, ease: "expo.inOut", stagger: 0.1, delay: 0.2 });
    gsap.from(".topbar > *", { autoAlpha: 0, y: -10, duration: 1, stagger: 0.08, delay: 0.6 });
    if (window.ScrollTrigger) {
      document.querySelectorAll(".parallax").forEach((img) => {
        gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }
  } else U.reveal();
  U.initReveals();

  /* ---------- Portfolio: floating cover preview ---------- */
  if (page === "portfolio" && U.hasGsap && matchMedia("(hover: hover)").matches) {
    const fp = document.createElement("div");
    fp.className = "float-preview"; fp.innerHTML = "<img alt=''>";
    document.body.appendChild(fp);
    const img = fp.querySelector("img");
    const xTo = gsap.quickTo(fp, "x", { duration: 0.6, ease: "power3" }), yTo = gsap.quickTo(fp, "y", { duration: 0.6, ease: "power3" });
    addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); });
    document.querySelectorAll(".row a[data-cover]").forEach((a) => {
      a.addEventListener("mouseenter", () => { img.src = a.dataset.cover; gsap.to(fp, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" }); });
      a.addEventListener("mouseleave", () => gsap.to(fp, { opacity: 0, scale: 0.9, duration: 0.4, ease: "expo.out" }));
    });
  }

  /* ---------- Music: open a record (one at a time); the cover follows the cursor over the list ---------- */
  if (page === "music" && (S.music || []).length) {
    const rows = [...document.querySelectorAll(".rec-row")];
    const setOpen = (btn, open) => {
      btn.setAttribute("aria-expanded", open); btn.closest(".rec").classList.toggle("open", open);
    };
    const toggle = (btn) => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      rows.forEach((r) => r !== btn && r.getAttribute("aria-expanded") === "true" && setOpen(r, false));
      setOpen(btn, open);
      if (open) setTimeout(() => (U.lenis ? U.lenis.scrollTo(btn, { offset: -90 }) : btn.scrollIntoView({ behavior: "smooth", block: "start" })), 350);
    };
    rows.forEach((btn) => btn.addEventListener("click", () => toggle(btn)));
    document.querySelectorAll(".covers [data-open]").forEach((c) => c.addEventListener("click", () => { const btn = rows[+c.dataset.open]; if (btn.getAttribute("aria-expanded") !== "true") toggle(btn); else U.lenis ? U.lenis.scrollTo(btn, { offset: -90 }) : btn.scrollIntoView({ behavior: "smooth" }); }));

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
      lastFocus = document.activeElement; show(i); U.lenis?.stop();
      if (U.hasGsap) gsap.to(lb, { autoAlpha: 1, duration: 0.4 }); else { lb.style.visibility = "visible"; lb.style.opacity = 1; }
      lb.querySelector(".lb-close").focus();
    };
    const close = () => {
      lbVid.pause();
      U.lenis?.start();
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
      if (lb.style.visibility !== "visible" && getComputedStyle(lb).visibility !== "visible") return;
      if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1);
    });
    let sx = 0;
    lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
  }

  /* ---------- Code blocks: copy button ---------- */
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall back below (http pages, older browsers) */ }
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
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
