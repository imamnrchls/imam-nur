/* Homepage: intro animation + pinned scroll scene */
(function () {
  const S = window.SITE, U = window.UI;
  const stage = document.querySelector(".stage");
  const bgImg = document.querySelector(".hero-bg img");
  const nameEl = document.querySelector(".title--name");
  const indexEl = document.querySelector(".title--index");
  const tilesEl = document.querySelector(".tiles");

  bgImg.src = S.heroImage;
  document.querySelector(".credit").href = S.heroCredit.url;
  document.querySelector(".credit").textContent = S.heroCredit.label;
  document.querySelector(".meta-role").textContent = S.role;

  const nameChars = U.splitTitle(nameEl, S.name);
  const indexChars = U.splitTitle(indexEl, S.indexTitle);

  tilesEl.innerHTML = S.menu.map((m) => `
    <a class="tile" href="${U.esc(m.href)}" aria-label="${U.esc(m.label)}">
      <span class="tile-img"><img src="${U.esc(m.image)}" alt="" loading="eager" decoding="async"></span>
      <span class="tile-label code"><span>${U.esc(m.code)}</span><span>${U.esc(m.label)}</span></span>
    </a>`).join("");
  const tiles = tilesEl.querySelectorAll(".tile");
  const tileImgs = tilesEl.querySelectorAll(".tile-img");
  const tileLabels = tilesEl.querySelectorAll(".tile-label");

  const fit = () => {
    const mobile = innerWidth <= 700;
    U.fitTitle(nameEl, { width: mobile ? 0.9 : 0.86, height: 0.5, box: stage });
    U.fitTitle(indexEl, { width: mobile ? 0.9 : 0.72, height: 0.5, box: stage });
  };
  fit();
  document.fonts?.ready.then(() => { fit(); window.ScrollTrigger?.refresh(); });

  // Without GSAP: show everything statically.
  if (!U.hasGsap || !window.ScrollTrigger) {
    indexEl.style.display = "none";
    tiles.forEach((t) => (t.style.visibility = "visible"));
    U.reveal(); U.initReveals();
    return;
  }

  /* ---------- Initial states ---------- */
  gsap.set(indexChars, { yPercent: 110 });
  gsap.set(".hero-bg", { clipPath: "inset(0% 0% 0% 0%)" });
  gsap.set(tiles, { autoAlpha: 1 });
  gsap.set(tileImgs, { clipPath: "inset(100% 0% 0% 0%)" });
  gsap.set(tileImgs.length ? tilesEl.querySelectorAll(".tile-img img") : [], { scale: 1.35 });
  gsap.set(tileLabels, { autoAlpha: 0, y: 12 });
  gsap.set(tilesEl, { pointerEvents: "none" });

  /* ---------- Intro (runs once, after the background is ready) ---------- */
  function intro() {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    if (U.reduced) { U.reveal(); tl.set([".lines i", nameChars, ".hero-meta", ".plus"], { clearProps: "all" }); return tl; }
    U.reveal();
    // The intro moves the inner layer (.ci, .hero-bg) and the scroll scene moves the outer layer
    // (.char, img), so scrolling back up always returns to the intro's final state.
    tl.from(".hero-bg", { scale: 1.25, duration: 2.6, ease: "expo.out" }, 0.1)
      .from(".lines .v", { scaleY: 0, duration: 1.6, stagger: 0.12, ease: "expo.inOut" }, 0.2)
      .from(".lines .h", { scaleX: 0, duration: 1.6, ease: "expo.inOut" }, 0.35)
      .from(nameEl.querySelectorAll(".ci"), {
        yPercent: 110, duration: 1.5,
        stagger: { each: 0.045, from: "center" },
      }, 0.7)
      .from(".plus", { rotate: -180, scale: 0, duration: 1.2 }, 1.1)
      .from(".hero-meta > *", { autoAlpha: 0, y: 10, duration: 1, stagger: 0.08 }, 1.4);
    return tl;
  }

  /* ---------- Scroll scene (pinned, scrubbed) ---------- */
  function scene() {
    const mm = gsap.matchMedia();
    mm.add({ mobile: "(max-width: 700px)", desktop: "(min-width: 701px)" }, (ctx) => {
      const { mobile } = ctx.conditions;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage, start: "top top", end: mobile ? "+=220%" : "+=260%",
          pin: true, scrub: 1, anticipatePin: 1,
          onUpdate: (st) => gsap.set(tilesEl, { pointerEvents: st.progress > 0.82 ? "auto" : "none" }),
        },
      });
      // 1. the photo closes like a shutter onto the horizontal grid line
      tl.to(".hero-bg", { clipPath: "inset(50% 0% 50% 0%)", duration: 1, ease: "power2.inOut" }, 0)
        .to(bgImg, { scale: 1.2, duration: 1, ease: "power2.inOut" }, 0)
        .to(stage, { "--fg": "#0b0b0b", "--ln": "rgba(11,11,11,.55)", duration: 0.35 }, 0.45)
        .to(".plus", { color: "#0b0b0b", duration: 0.35 }, 0.45)
        .to(".hero-meta", { autoAlpha: 0, duration: 0.3 }, 0.1)
      // 2. the name rolls up and out, the index title rolls in
        .to(nameChars, { yPercent: -110, duration: 0.6, stagger: { each: 0.03, from: "start" }, ease: "power2.in" }, 0.25)
        .to(indexChars, { yPercent: 0, duration: 0.7, stagger: { each: 0.035, from: "start" }, ease: "power2.out" }, 0.95)
      // 3. the six tiles open from the bottom, one after another
        .to(tileImgs, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, stagger: 0.12, ease: "power3.inOut" }, 1.35)
        .to(tilesEl.querySelectorAll(".tile-img img"), { scale: 1, duration: 1.1, stagger: 0.12, ease: "power3.out" }, 1.35)
        .to(tileLabels, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" }, 1.75)
        .to({}, { duration: 0.6 }); // hold at the end so the menu can be used
      return () => tl.scrollTrigger?.kill();
    });
  }

  let started = false;
  const go = () => {
    if (started) return; started = true;
    intro(); scene();
    U.initReveals(); // created after the pin so their positions include the pinned distance
    ScrollTrigger.refresh(); U.lenis?.resize();
  };
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  if (bgImg.complete && bgImg.naturalWidth) go();
  else { bgImg.addEventListener("load", go, { once: true }); bgImg.addEventListener("error", go, { once: true }); setTimeout(go, 2500); }

  U.onResize(() => { fit(); ScrollTrigger.refresh(); });
})();
