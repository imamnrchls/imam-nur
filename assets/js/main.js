/* Shared behaviour: smooth scroll, split titles, menu, page transitions, reveals */
(function () {
  const S = window.SITE;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!window.gsap;
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Icons: inline SVG so they look identical on every device (text arrows can turn into emoji on phones) ---------- */
  const ICONS = {
    ne: "M2.5 11.5l9-9M4 2.5h7.5V10",
    left: "M12 7H2M6 3L2 7l4 4",
    right: "M2 7h10M8 3l4 4-4 4",
    close: "M3 3l8 8M11 3l-8 8",
  };
  const icon = (name) => `<svg class="ico" viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="${ICONS[name]}"/></svg>`;

  /* ---------- Split a title into masked characters ---------- */
  function splitTitle(el, lines) {
    el.setAttribute("aria-label", lines.join(" "));
    el.innerHTML = lines.map((line) =>
      `<span class="line" aria-hidden="true"><span class="line-inner">${[...line].map((ch) =>
        ch === " " ? `<span class="mask">&nbsp;</span>` : `<span class="mask"><span class="char"><span class="ci">${esc(ch)}</span></span></span>`
      ).join("")}</span></span>`).join("");
    return el.querySelectorAll(".char");
  }

  /* ---------- Fit a title so its widest line fills a share of the box ---------- */
  function fitTitle(el, { width = 0.86, height = 0.62, box } = {}) {
    const b = box || el.parentElement;
    el.style.fontSize = "100px";
    const inners = el.querySelectorAll(".line-inner");
    let w = 0;
    inners.forEach((n) => (w = Math.max(w, n.getBoundingClientRect().width)));
    const h = el.getBoundingClientRect().height;
    if (!w || !h) return;
    const byW = (b.clientWidth * width / w) * 100;
    const byH = (b.clientHeight * height / h) * 100;
    el.style.fontSize = Math.max(28, Math.min(byW, byH)) + "px";
  }

  /* ---------- Smooth scrolling ---------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    if (hasGsap && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- Frame, wipe, menu (injected on every page) ---------- */
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="wipe is-cover" aria-hidden="true"></div>
    <button class="plus" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span></button>
    <nav class="menu" id="menu" aria-label="Main">
      <ol>
        <li><a href="index.html"><span class="code">00 — Home</span><span class="inner">Home</span><span class="arrow">${icon("ne")}</span></a></li>
        ${S.menu.map((m, i) => `<li><a href="${esc(m.href)}"><span class="code">${String(i + 1).padStart(2, "0")} — ${esc(m.code)}</span><span class="inner">${esc(m.label)}</span><span class="arrow">${icon("ne")}</span></a></li>`).join("")}
      </ol>
      <div class="menu-foot small"><span>${esc(S.name.join(" "))}</span><span>${esc(S.role)}</span><span>${esc(S.location)}</span></div>
    </nav>`);

  const plus = document.querySelector(".plus");
  const menu = document.querySelector(".menu");
  let menuOpen = false;
  function toggleMenu(open = !menuOpen) {
    menuOpen = open;
    document.body.classList.toggle("menu-open", open);
    plus.setAttribute("aria-expanded", open);
    plus.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) lenis?.stop(); else lenis?.start();
    if (!hasGsap) { menu.style.visibility = open ? "visible" : "hidden"; menu.style.clipPath = open ? "none" : ""; return; }
    gsap.killTweensOf([menu, ".menu .inner"]);
    if (open) {
      gsap.set(menu, { visibility: "visible" });
      gsap.to(menu, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0 : 0.9, ease: "expo.inOut" });
      gsap.fromTo(".menu .inner", { yPercent: 110 }, { yPercent: 0, duration: reduced ? 0 : 1, ease: "expo.out", stagger: 0.05, delay: reduced ? 0 : 0.35 });
    } else {
      gsap.to(menu, { clipPath: "inset(0 0 100% 0)", duration: reduced ? 0 : 0.8, ease: "expo.inOut", onComplete: () => gsap.set(menu, { visibility: "hidden" }) });
    }
  }
  plus.addEventListener("click", () => toggleMenu());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menuOpen) toggleMenu(false); });

  /* ---------- Footer (shared by every page) ---------- */
  const SOCIAL_ICONS = {
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8v.01"/>',
    linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M8 10.5V16M8 8v.01M11.5 16v-5.5M11.5 13.2c0-1.6 1-2.8 2.4-2.8s2.1 1 2.1 2.6V16"/>',
  };
  const socials = S.links.map((l) => {
    const ic = SOCIAL_ICONS[l.label.toLowerCase()];
    return `<a class="foot-icon" href="${esc(l.url)}" target="_blank" rel="noopener" aria-label="${esc(l.label)}" title="${esc(l.label)}">${ic ? `<svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg>` : esc(l.label[0])}</a>`;
  }).join("");
  const F = S.footer || {};
  const footer = document.createElement("footer");
  footer.className = "site-foot";
  footer.innerHTML = `
    <svg class="foot-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <filter id="ink-duotone" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values=".33 .33 .33 0 0  .33 .33 .33 0 0  .33 .33 .33 0 0  0 0 0 1 0"/>
        <feComponentTransfer>
          <feFuncR type="linear" slope="1.35" intercept="-.12"/><feFuncG type="linear" slope="1.35" intercept="-.12"/><feFuncB type="linear" slope="1.35" intercept="-.12"/>
        </feComponentTransfer>
        <feComponentTransfer>
          <feFuncR type="table" tableValues=".12 .93"/><feFuncG type="table" tableValues=".24 .89"/><feFuncB type="table" tableValues=".47 .78"/>
        </feComponentTransfer>
      </filter>
    </svg>
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="foot-name" href="index.html"><span class="foot-mark" aria-hidden="true">IN</span>${esc(S.name.join(" ").replace(/\b(\w)(\w*)/g, (m, a, b) => a + b.toLowerCase()))}</a>
        <p class="foot-tag">${esc(F.tagline || S.role)}</p>
        <div class="foot-social">${socials}</div>
      </div>
      <nav class="foot-col" aria-label="Explore">
        <h2>Explore</h2>
        <ul>
          <li><a href="index.html">Home</a></li>
          ${S.menu.filter((m) => !m.href.includes("#")).map((m) => `<li><a href="${esc(m.href)}">${esc(m.label)}</a></li>`).join("")}
        </ul>
      </nav>
      <nav class="foot-col" aria-label="Elsewhere">
        <h2>Elsewhere</h2>
        <ul>${S.links.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("")}</ul>
      </nav>
      <div class="foot-col">
        <h2>Contact</h2>
        <ul>
          <li><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></li>
          <li><span>${esc(S.location)}</span></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© ${new Date().getFullYear()} ${esc(S.name.join(" ").replace(/\b(\w)(\w*)/g, (m, a, b) => a + b.toLowerCase()))}.</span>
      <span>Photos via <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a></span>
    </div>
    ${F.art ? `<div class="foot-art" aria-hidden="true"><img src="${esc(F.art)}" alt="" loading="lazy" decoding="async"></div>` : ""}`;
  (document.querySelector("main") || document.body).insertAdjacentElement("afterend", footer);
  if ("IntersectionObserver" in window) {
    // The fixed label at the top of inner pages would sit on top of the footer text; hide it while the footer is in view.
    new IntersectionObserver(([e]) => document.body.classList.toggle("foot-in-view", e.isIntersecting && e.intersectionRatio > 0.15), { threshold: [0, 0.15, 0.5] }).observe(footer);
  }
  footer.querySelector(".foot-art img")?.addEventListener("load", () => window.ScrollTrigger?.refresh(), { once: true });

  /* ---------- Page transitions ---------- */
  const wipe = document.querySelector(".wipe");
  function reveal() {
    if (!hasGsap || reduced) { wipe.classList.remove("is-cover"); wipe.style.transform = "scaleY(0)"; return Promise.resolve(); }
    return new Promise((res) => {
      gsap.fromTo(wipe, { scaleY: 1, transformOrigin: "top" }, { scaleY: 0, duration: 0.9, ease: "expo.inOut", onComplete: () => { wipe.classList.remove("is-cover"); res(); } });
    });
  }
  function leave(href) {
    if (!hasGsap || reduced) { location.href = href; return; }
    gsap.fromTo(wipe, { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 0.7, ease: "expo.inOut", onComplete: () => (location.href = href) });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || a.hasAttribute("download")) return;
    const samePage = url.pathname === location.pathname && url.search === location.search;
    if (samePage && url.hash) { // in-page anchor
      e.preventDefault(); if (menuOpen) toggleMenu(false);
      const t = document.querySelector(url.hash); if (t) lenis ? lenis.scrollTo(t, { offset: -80 }) : t.scrollIntoView();
      return;
    }
    e.preventDefault();
    leave(url.href);
  });
  // Coming back with the browser's back button (bfcache): uncover again
  window.addEventListener("pageshow", (e) => { if (e.persisted && hasGsap) gsap.set(wipe, { scaleY: 0 }); });

  /* ---------- Scroll reveals ---------- */
  function initReveals(root = document) {
    const els = root.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (!hasGsap || !window.ScrollTrigger || reduced) { els.forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; }); return; }
    ScrollTrigger.batch(els, {
      start: "top 99%", // near the bottom of the page an element may never rise above a stricter line
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }),
    });
  }

  /* ---------- Debounced resize ---------- */
  function onResize(fn) {
    let t, w = innerWidth;
    addEventListener("resize", () => {
      clearTimeout(t);
      t = setTimeout(() => { if (Math.abs(innerWidth - w) < 2 && matchMedia("(hover: none)").matches) return; w = innerWidth; fn(); }, 150);
    });
  }

  window.UI = { esc, icon, splitTitle, fitTitle, reveal, initReveals, onResize, reduced, hasGsap, get lenis() { return lenis; } };
})();
