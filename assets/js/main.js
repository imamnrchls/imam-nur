/* Shared behaviour: smooth scroll, split titles, menu, page transitions, reveals */
(function () {
  const S = window.SITE;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!window.gsap;
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Split a title into masked characters ---------- */
  function splitTitle(el, lines) {
    el.setAttribute("aria-label", lines.join(" "));
    el.innerHTML = lines.map((line) =>
      `<span class="line" aria-hidden="true"><span class="line-inner">${[...line].map((ch) =>
        ch === " " ? `<span class="mask">&nbsp;</span>` : `<span class="mask"><span class="char">${esc(ch)}</span></span>`
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
        <li><a href="index.html"><span class="code">00 — Home</span><span class="inner">Home</span><span class="arrow">↗</span></a></li>
        ${S.menu.map((m, i) => `<li><a href="${esc(m.href)}"><span class="code">${String(i + 1).padStart(2, "0")} — ${esc(m.code)}</span><span class="inner">${esc(m.label)}</span><span class="arrow">↗</span></a></li>`).join("")}
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
      start: "top 92%",
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

  window.UI = { esc, splitTitle, fitTitle, reveal, initReveals, onResize, reduced, hasGsap, get lenis() { return lenis; } };
})();
