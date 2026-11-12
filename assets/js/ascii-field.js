/* Drifting fields of characters.
   A slowly moving cloud-like noise pattern is drawn as a grid of monospace characters, and the mouse clears a soft hole around itself.

   - Homepage hero (".hero-bg"): faint characters float over the photo. Denser parts use heavier symbols,
     and the edges of each cloud spell letters from the name. Turn off with  heroAscii: false  in content.js.
   - About portrait (".portrait[data-ascii]"): inside each cloud the photo itself turns into characters
     (brighter areas get denser characters). Turn off with  ascii: false  in the about section of content.js.

   Both pause when off screen, and show one still frame for visitors who prefer reduced motion. */
(function () {
  const S = window.SITE || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const FONT = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  const NAME = (Array.isArray(S.name) ? S.name.join("") : "IMAMNURCHOLIS").replace(/[^A-Za-z]/g, "").toUpperCase().split("");

  /* ---------- Noise: smooth 3D value noise + a few octaves ---------- */
  const P = new Uint8Array(512);
  { const p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) P[i] = p[i & 255]; }
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + (b - a) * t;
  function noise(x, y, z) {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    x -= X; y -= Y; z -= Z;
    const xi = X & 255, yi = Y & 255, zi = Z & 255;
    const u = fade(x), v = fade(y), w = fade(z);
    const h = (a, b, c) => P[P[P[a] + b] + c] / 255;
    return lerp(
      lerp(lerp(h(xi, yi, zi), h(xi + 1, yi, zi), u), lerp(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), u), v),
      lerp(lerp(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), u), lerp(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), u), v),
      w);
  }
  const fbm = (x, y, z) => noise(x, y, z) * 0.57 + noise(x * 2.03, y * 2.03, z * 1.3) * 0.29 + noise(x * 4.1, y * 4.1, z * 1.7) * 0.14;
  const hash = (i, j) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); };
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  function mount(host, o) {
    const canvas = document.createElement("canvas");
    canvas.className = "ascii-field";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = [...new Set([...o.ramp, ...(o.edge || [])])];
    let cell = 14, cols = 0, rows = 0, dpr = 1, W = 0, H = 0, atlas = null, glyph = {}, lum = null, tint = null;

    /* Each character is drawn once into a strip, then copied for every cell */
    function buildAtlas() {
      const s = Math.ceil(cell * dpr);
      atlas = document.createElement("canvas");
      atlas.width = s * chars.length; atlas.height = s;
      const a = atlas.getContext("2d");
      a.fillStyle = o.color;
      a.font = `500 ${Math.round(cell * o.fontScale * dpr)}px ${FONT}`;
      a.textAlign = "center"; a.textBaseline = "middle";
      glyph = {};
      chars.forEach((ch, i) => { a.fillText(ch, i * s + s / 2, s / 2 + dpr * 0.5); glyph[ch] = i * s; });
    }

    /* Image mode: brightness of the photo under each cell (the photo is drawn like object-fit: cover) */
    function sample() {
      lum = null; tint = null;
      const img = o.image;
      if (!img || !img.naturalWidth || !cols) return;
      try {
        const c = document.createElement("canvas"); c.width = cols; c.height = rows;
        const g = c.getContext("2d", { willReadFrequently: true });
        const k = Math.max(cols * cell / img.naturalWidth, rows * cell / img.naturalHeight);
        const sw = cols * cell / k, sh = rows * cell / k;
        g.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cols, rows);
        const px = g.getImageData(0, 0, cols, rows).data;
        lum = new Float32Array(cols * rows); tint = new Array(cols * rows);
        for (let i = 0; i < lum.length; i++) {
          const r = px[i * 4], g2 = px[i * 4 + 1], b = px[i * 4 + 2];
          lum[i] = (r * 0.299 + g2 * 0.587 + b * 0.114) / 255;
          tint[i] = `rgb(${(r * o.shade) | 0},${(g2 * o.shade) | 0},${(b * o.shade) | 0})`; // a deep shade of the photo's own colour
        }
      } catch (e) { lum = null; } // an image from another site without CORS cannot be read; fall back to plain characters
    }

    function resize() {
      const box = o.follow || host;                       // with a parallax image, match the image's own box
      W = box.clientWidth; H = box.clientHeight;
      if (!W || !H) return;
      if (o.follow) canvas.style.height = H + "px";
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cell = o.cell(W);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      cols = Math.ceil(W / cell); rows = Math.ceil(H / cell);
      buildAtlas(); sample();
    }

    /* Pointer, eased, in the host's unscaled pixels */
    const ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999, a: 0, ta: 0 };
    if (!coarse && !reduced) {
      addEventListener("pointermove", (e) => {
        const r = canvas.getBoundingClientRect();
        if (!r.width) return;
        const k = W / r.width, R = o.radius(W);                 // the hero intro scales its box; map back
        ptr.tx = (e.clientX - r.left) * k; ptr.ty = (e.clientY - r.top) * k;
        const near = ptr.tx > -R && ptr.ty > -R && ptr.tx < W + R && ptr.ty < H + R;
        if (near && ptr.a < 0.01) { ptr.x = ptr.tx; ptr.y = ptr.ty; }
        ptr.ta = near ? 1 : 0; wake();
      }, { passive: true });
      document.documentElement.addEventListener("pointerleave", () => { ptr.ta = 0; });
    }

    function draw(t) {
      if (!cols) return;
      const s = Math.ceil(cell * dpr);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ptr.x += (ptr.tx - ptr.x) * 0.12; ptr.y += (ptr.ty - ptr.y) * 0.12; ptr.a += (ptr.ta - ptr.a) * 0.08;
      const R = o.radius(W);
      const z = t * 0.00009, drift = t * 0.000035, sc = o.scale * (14 / cell);
      const blink = Math.floor(t / 900);
      for (let j = 0; j < rows; j++) {
        const y = j * cell + cell / 2;
        for (let i = 0; i < cols; i++) {
          const x = i * cell + cell / 2;
          const wx = noise(i * sc * 0.6, j * sc * 0.6, z + 7.3) - 0.5;    // gentle warp: shapes curl like cloud
          let d = fbm(i * sc + drift + wx * 1.6, j * sc * 1.25 + wx, z);
          if (ptr.a > 0.01) {
            const dx = x - ptr.x, dy = y - ptr.y, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < R) { const k = 1 - dist / R; d -= k * k * (3 - 2 * k) * 0.55 * ptr.a; }
          }
          if (d < o.thresh) continue;
          const X = Math.round(x * dpr - s / 2), Y = Math.round(y * dpr - s / 2);
          let ch, alpha;
          if (lum) {
            // the photo turns into characters: the cell takes a deep shade of the photo's colour,
            // and a character as bright as the photo there is drawn on top
            const k = smooth(o.thresh, o.thresh + 0.08, d), n = j * cols + i, L = lum[n];
            ctx.globalAlpha = 0.92 * k; ctx.fillStyle = tint[n]; ctx.fillRect(X, Y, s, s);
            ch = o.ramp[Math.min(o.ramp.length - 1, (L * 1.15 * o.ramp.length) | 0)];
            alpha = k * (0.55 + L * 0.45);
          } else if (o.edge && d < o.thresh + o.edgeW) {
            ch = o.edge[(((hash(i, j) * 97) | 0) + Math.floor(t / 1400 + hash(j, i) * 4)) % o.edge.length]; // each cell changes letter on its own beat
            alpha = 0.3;
          } else {
            const k = Math.min(1, (d - o.thresh - (o.edgeW || 0)) / 0.2);
            ch = o.ramp[Math.min(o.ramp.length - 1, (k * o.ramp.length) | 0)];
            alpha = 0.16 + k * 0.32;
          }
          if (ch === " ") continue;
          if (hash(i + 13, j + blink) > 0.985) alpha = Math.min(0.9, alpha + 0.35);   // an occasional brighter glyph
          ctx.globalAlpha = alpha;
          ctx.drawImage(atlas, glyph[ch], 0, s, s, X, Y, s, s);
        }
      }
      ctx.globalAlpha = 1;
      if (o.follow) canvas.style.transform = o.follow.style.transform; // stay aligned with a parallax image
    }

    /* Loop at ~30 fps, only while the box is on screen and the tab is visible */
    let raf = 0, last = 0, onScreen = true;
    const visible = () => !document.hidden && onScreen && (!o.visible || o.visible());
    function frame(t) {
      raf = 0;
      if (!visible()) return;
      if (t - last >= 33) { last = t; draw(t); }
      raf = requestAnimationFrame(frame);
    }
    function wake() { if (reduced) return; if (!raf && visible()) raf = requestAnimationFrame(frame); }
    const still = () => draw(20000);

    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; wake(); }).observe(host);
    resize();
    if (o.image && !o.image.complete) o.image.addEventListener("load", () => { resize(); if (reduced) still(); }, { once: true });
    if (reduced) still(); else wake();
    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduced) still(); }, 150); });
    addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", wake);
  }

  /* ---------- Homepage hero ---------- */
  const hero = document.querySelector(".hero-bg");
  if (hero && S.heroAscii !== false) mount(hero, {
    ramp: ".:-=+*#%".split(""), edge: NAME, color: "#f3f3ee", fontScale: 0.78,
    thresh: 0.47, edgeW: 0.045, scale: 0.0468,
    cell: (w) => (w < 700 ? 11 : w < 1200 ? 13 : 14),
    radius: (w) => Math.max(110, Math.min(220, w * 0.13)),
    visible: () => scrollY < innerHeight * 1.1,              // the scroll scene closes the hero after this
  });

  /* ---------- About portrait ---------- */
  const portrait = document.querySelector(".portrait[data-ascii]");
  const pimg = portrait && portrait.querySelector("img");
  if (portrait && pimg) mount(portrait, {
    image: pimg, follow: pimg,
    ramp: ".:-=+*#%@".split(""), color: "#f3f3ee", shade: 0.28, fontScale: 1,
    thresh: 0.5, scale: 0.06,
    cell: (w) => (w < 420 ? 10 : 11),
    radius: (w) => Math.max(70, w * 0.22),
  });
})();
