/* Homepage hero: a drifting field of characters behind the name.
   A slowly moving cloud-like noise pattern is drawn as a grid of monospace characters.
   Denser parts use heavier symbols, the edges of each cloud spell letters from the name,
   and the mouse clears a soft hole around itself.
   Turn it off with  heroAscii: false  in content.js. */
(function () {
  const S = window.SITE || {};
  const host = document.querySelector(".hero-bg");
  if (!host || S.heroAscii === false) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;

  const canvas = document.createElement("canvas");
  canvas.className = "ascii-field";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  /* ---------- Characters ---------- */
  const RAMP = ".:-=+*#%".split("");                       // light → heavy, inside the clouds
  const EDGE = (Array.isArray(S.name) ? S.name.join("") : "IMAMNURCHOLIS").replace(/[^A-Za-z]/g, "").toUpperCase().split("");
  const FONT = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  const THRESH = 0.47, EDGE_W = 0.045;                      // where a cloud starts, and how wide its letter rim is

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

  /* ---------- Glyph atlas: each character drawn once, then copied ---------- */
  let cell = 14, cols = 0, rows = 0, dpr = 1, atlas = null, glyphs = {};
  function buildAtlas() {
    const chars = [...new Set([...RAMP, ...EDGE])];
    const s = Math.ceil(cell * dpr);
    atlas = document.createElement("canvas");
    atlas.width = s * chars.length; atlas.height = s;
    const a = atlas.getContext("2d");
    a.fillStyle = "#f3f3ee";
    a.font = `500 ${Math.round(cell * 0.78 * dpr)}px ${FONT}`;
    a.textAlign = "center"; a.textBaseline = "middle";
    glyphs = {};
    chars.forEach((ch, i) => { a.fillText(ch, i * s + s / 2, s / 2 + dpr * 0.5); glyphs[ch] = i * s; });
  }

  function resize() {
    const r = host.getBoundingClientRect();
    const w = host.clientWidth || r.width, h = host.clientHeight || r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cell = w < 700 ? 11 : w < 1200 ? 13 : 14;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    cols = Math.ceil(w / cell) + 1; rows = Math.ceil(h / cell) + 1;
    buildAtlas();
  }

  /* ---------- Pointer (eased), in canvas pixels ---------- */
  const ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999, a: 0, ta: 0 };
  if (!coarse) {
    addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      const sx = r.width ? host.clientWidth / r.width : 1;   // the intro scales the hero; map back to unscaled pixels
      ptr.tx = (e.clientX - r.left) * sx; ptr.ty = (e.clientY - r.top) * sx;
      if (ptr.a < 0.01) { ptr.x = ptr.tx; ptr.y = ptr.ty; }
      ptr.ta = 1; wake();
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => { ptr.ta = 0; });
  }

  /* ---------- Draw one frame ---------- */
  function draw(t) {
    const w = canvas.width, s = Math.ceil(cell * dpr);
    ctx.clearRect(0, 0, w, canvas.height);
    ptr.x += (ptr.tx - ptr.x) * 0.12; ptr.y += (ptr.ty - ptr.y) * 0.12; ptr.a += (ptr.ta - ptr.a) * 0.08;
    const R = Math.max(110, Math.min(220, host.clientWidth * 0.13));   // radius of the cleared hole
    const z = t * 0.00009, drift = t * 0.000035, scale = 0.085 * (14 / cell) * 0.55;
    const step = Math.floor(t / 900);
    for (let j = 0; j < rows; j++) {
      const y = j * cell;
      for (let i = 0; i < cols; i++) {
        const x = i * cell;
        // gentle domain warp makes the shapes curl like cloud instead of sliding
        const wx = noise(i * scale * 0.6, j * scale * 0.6, z + 7.3) - 0.5;
        let d = fbm(i * scale + drift + wx * 1.6, j * scale * 1.25 + wx, z);
        if (ptr.a > 0.01) {
          const dx = x - ptr.x, dy = y - ptr.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < R) { const k = 1 - dist / R; d -= k * k * (3 - 2 * k) * 0.55 * ptr.a; }
        }
        if (d < THRESH) continue;
        let ch, alpha;
        if (d < THRESH + EDGE_W) {
          ch = EDGE[(((hash(i, j) * 97) | 0) + Math.floor(t / 1400 + hash(j, i) * 4)) % EDGE.length]; // each cell changes letter on its own beat
          alpha = 0.3;
        } else {
          const k = Math.min(1, (d - THRESH - EDGE_W) / 0.2);
          ch = RAMP[Math.min(RAMP.length - 1, (k * RAMP.length) | 0)];
          alpha = 0.16 + k * 0.32;
        }
        if (hash(i + 13, j + step) > 0.985) alpha = Math.min(0.85, alpha + 0.35);   // an occasional brighter glyph
        ctx.globalAlpha = alpha;
        ctx.drawImage(atlas, glyphs[ch], 0, s, s, Math.round(x * dpr - s / 2), Math.round(y * dpr - s / 2), s, s);
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- Loop: ~30 fps, only while the hero can be seen ---------- */
  let raf = 0, last = 0;
  const visible = () => !document.hidden && scrollY < innerHeight * 1.1;
  function frame(t) {
    raf = 0;
    if (!visible()) return;
    if (t - last >= 33) { last = t; draw(t); }
    raf = requestAnimationFrame(frame);
  }
  function wake() { if (!reduced && !raf && visible()) raf = requestAnimationFrame(frame); }

  resize();
  if (reduced) { draw(20000); }       // reduced motion: one still frame, no animation, no pointer effect
  else wake();
  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduced) draw(20000); }, 150); });
  addEventListener("scroll", wake, { passive: true });
  document.addEventListener("visibilitychange", wake);
})();
