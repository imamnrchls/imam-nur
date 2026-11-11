/* Inner pages: everything is rendered from content.js */
(function () {
  const S = window.SITE, U = window.UI, esc = U.esc;
  const page = document.body.dataset.page;
  const main = document.getElementById("page");
  const params = new URLSearchParams(location.search);
  const fmtDate = (d) => { const x = new Date(d + "T00:00:00"); return isNaN(x) ? esc(d) : x.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); };
  const year = (d) => String(d).slice(0, 4);

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
      titleLines = ["PHOTOS"];
      html = !S.photos.length ? head(titleLines, "No photographs here yet.", menuItem("photos").code) : head(titleLines, "A running archive of photographs. Click any image to view it larger.", menuItem("photos").code) +
        `<div class="photo-grid">${S.photos.map((p, i) => `
          <figure class="photo" data-reveal data-i="${i}" tabindex="0" role="button" aria-label="Open ${esc(p.caption)}">
            <div class="ph">${p.video ? `<video src="${esc(p.video)}#t=0.1" muted loop autoplay playsinline preload="metadata" aria-label="${esc(p.caption)}"></video>` : `<img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy">`}</div>
            <figcaption class="small"><span>${esc(p.code)}</span><span class="muted">${esc(p.place)}</span></figcaption>
          </figure>`).join("")}</div>
        <div class="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer">
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
           ${a.image ? `<div class="portrait" data-reveal><img src="${esc(a.image)}" alt="Portrait" class="parallax"></div>` : ""}
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
    case "archive": {
      titleLines = ["ARCHIVE"];
      const all = [
        ...S.portfolio.map((p) => ({ code: p.code, title: p.title, kind: "Portfolio", y: p.year, href: `project.html?id=${encodeURIComponent(p.id)}` })),
        ...S.writing.map((w) => ({ code: w.code, title: w.title, kind: "Writing", y: year(w.date), href: `article.html?slug=${encodeURIComponent(w.slug)}` })),
        ...S.photos.map((p) => ({ code: p.code, title: p.caption, kind: "Photo", y: "", href: "photos.html" })),
      ];
      html = head(titleLines, `Everything in one list — ${all.length} entries.`, menuItem("archive").code) +
        `<ol class="rows">${all.map((r) => `
          <li class="row" data-reveal><a href="${r.href}">
            <span class="code">${esc(r.code)}</span><span class="t">${esc(r.title)}</span>
            <span class="code x mid">${esc(r.kind)}</span><span class="code r">${esc(r.y)}</span>
          </a></li>`).join("")}</ol>`;
      break;
    }
    default: notFound("page");
  }

  main.innerHTML = html;

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

  /* ---------- Photos: lightbox ---------- */
  if (page === "photos" && S.photos.length) {
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
  if (location.hash) setTimeout(() => { const t = document.querySelector(location.hash); if (t) U.lenis ? U.lenis.scrollTo(t, { offset: -80, immediate: true }) : t.scrollIntoView(); }, 300);
})();
