/* Drifting fields of characters: behind the homepage name, on the six homepage tiles, and over the About portrait.
   A slowly moving cloud-like noise pattern is drawn as a grid of faint monospace characters over a picture.
   Denser parts use heavier symbols, the edges of each cloud spell letters from the name,
   and the mouse clears a soft hole around itself.
   Turn off with  heroAscii: false  (homepage hero and tiles) or  ascii: false  under about (About page) in content.js.

   Kept cheap on purpose: only characters that changed since the last frame are redrawn (the clouds drift slowly,
   so most stay put), the cloud shape is computed on a coarse grid (every 3rd cell) and blended in between,
   all fields share one ~24 fps loop, and a field only draws while it can actually be seen.
   Visitors who prefer reduced motion get one still frame. */
(function () {
  const S = window.SITE || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const FONT = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  const NAME = (Array.isArray(S.name) ? S.name.join("") : "IMAMNURCHOLIS").replace(/[^A-Za-z]/g, "").toUpperCase().split("");
  const K = 3;          // the cloud shape is computed every K cells and blended in between
  const FRAME = 42;     // ms between frames (~24 fps)
  const LEVELS = 10;    // opacity steps baked into the glyph strip (fewer steps = fewer redraws)
  const BUDGET = 900;   // most characters (re)drawn per field per frame: the first frame would otherwise draw thousands at once
                        // and stall the homepage intro; the rest simply follow on the next frames

  /* ---------- Noise: smooth 3D value noise + two octaves ---------- */
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
  const fbm = (x, y, z) => noise(x, y, z) * 0.64 + noise(x * 2.03, y * 2.03, z * 1.3) * 0.36;

  /* ---------- One pointer and one loop for every field ---------- */
  const ptr = { x: -1e5, y: -1e5, on: false };
  if (!coarse && !reduced) {
    addEventListener("pointermove", (e) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = true; wake(); }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => { ptr.on = false; });
  }
  const fields = [];
  let raf = 0, last = 0;
  function frame(t) {
    raf = 0;
    if (document.hidden) return;
    let any = false;
    if (t - last >= FRAME) { last = t; for (const f of fields) if (f.live()) { f.draw(t); any = true; } }
    else any = fields.some((f) => f.live());
    if (any) raf = requestAnimationFrame(frame);
  }
  function wake() { if (!reduced && !raf && !document.hidden) raf = requestAnimationFrame(frame); }
  addEventListener("scroll", wake, { passive: true });
  document.addEventListener("visibilitychange", wake);
  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => fields.forEach((f) => f.resize()), 150); });

  function mount(host, o) {
    const canvas = document.createElement("canvas");
    canvas.className = "ascii-field";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = [...new Set([...o.ramp, ...(o.edge || [])])];
    let cell = 14, cols = 0, rows = 0, dpr = 1, W = 0, H = 0, atlas = null, glyph = {};
    let gw = 0, gh = 0, grid = null, rnd = null;     // coarse cloud grid, and a fixed random number per cell
    let shown = null;                                 // what each cell shows now (0 = nothing), so unchanged cells are skipped
    const ease = { x: 0, y: 0, a: 0 };                // pointer, eased, in this field's pixels

    /* Each character is drawn once per opacity step into a grid of tiles, then copied for every cell */
    function buildAtlas() {
      const s = Math.ceil(cell * dpr);
      atlas = document.createElement("canvas");
      atlas.width = s * chars.length; atlas.height = s * LEVELS;
      const a = atlas.getContext("2d");
      a.fillStyle = o.color;
      if (o.shadow) { a.shadowColor = o.shadow; a.shadowBlur = 2.5 * dpr; } // keeps light characters readable on a bright photo
      a.font = `500 ${Math.round(cell * o.fontScale * dpr)}px ${FONT}`;
      a.textAlign = "center"; a.textBaseline = "middle";
      glyph = {};
      chars.forEach((ch, i) => {
        glyph[ch] = i;
        for (let l = 1; l <= LEVELS; l++) { a.globalAlpha = l / LEVELS; a.fillText(ch, i * s + s / 2, (l - 1) * s + s / 2 + dpr * 0.5); }
      });
    }

    function resize() {
      const box = o.follow || host;                   // with a parallax image, match the image's own box
      W = box.clientWidth; H = box.clientHeight;
      if (!W || !H) return;
      if (o.follow) canvas.style.height = H + "px";
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cell = o.cell(W);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      cols = Math.ceil(W / cell); rows = Math.ceil(H / cell);
      gw = Math.ceil(cols / K) + 2; gh = Math.ceil(rows / K) + 2;
      grid = new Float32Array(gw * gh);
      rnd = new Float32Array(cols * rows * 2);
      for (let n = 0; n < rnd.length; n++) rnd[n] = Math.random();
      shown = new Int16Array(cols * rows);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      buildAtlas();
      if (reduced) draw(20000);
    }

    function draw(t) {
      if (!cols) return;
      const s = Math.ceil(cell * dpr);

      // 1. cloud shape on the coarse grid (the expensive part: only 1 in K*K cells)
      const z = t * 0.00009, drift = t * 0.000035, sc = o.scale * (14 / cell);
      for (let J = 0; J < gh; J++) for (let I = 0; I < gw; I++) {
        const i = I * K, j = J * K;
        const wx = noise(i * sc * 0.6, j * sc * 0.6, z + 7.3) - 0.5;   // gentle warp: shapes curl like cloud
        grid[J * gw + I] = fbm(i * sc + drift + wx * 1.6, j * sc * 1.25 + wx, z);
      }

      // 2. pointer hole, in this field's own unscaled pixels (the hero intro scales its box)
      if (ptr.on || ease.a > 0.01) {
        const r = canvas.getBoundingClientRect(), k = r.width ? W / r.width : 1;
        const tx = (ptr.x - r.left) * k, ty = (ptr.y - r.top) * k, R0 = o.radius(W);
        const near = ptr.on && tx > -R0 && ty > -R0 && tx < W + R0 && ty < H + R0;
        if (near && ease.a < 0.01) { ease.x = tx; ease.y = ty; }
        ease.x += (tx - ease.x) * 0.15; ease.y += (ty - ease.y) * 0.15; ease.a += ((near ? 1 : 0) - ease.a) * 0.1;
      }
      const R = o.radius(W), R2 = R * R, holeOn = ease.a > 0.01;

      // 3. every cell: blend the coarse grid, cut the hole, pick a character
      const blink = Math.floor(t / 900) * 0.618, step = t / 1400, edge = o.edge, ramp = o.ramp, nE = edge ? edge.length : 0;
      const t0 = o.thresh, t1 = o.thresh + (o.edgeW || 0), boost = o.boost || 1;
      let budget = reduced ? Infinity : BUDGET;
      for (let j = 0; j < rows; j++) {
        const J = (j / K) | 0, fy = (j - J * K) / K, y = j * cell + cell / 2, dy = y - ease.y;
        const rowHole = holeOn && dy * dy < R2;
        for (let i = 0; i < cols; i++) {
          const I = (i / K) | 0, fx = (i - I * K) / K, g = J * gw + I;
          let d = lerp(lerp(grid[g], grid[g + 1], fx), lerp(grid[g + gw], grid[g + gw + 1], fx), fy);
          const x = i * cell + cell / 2;
          if (rowHole) {
            const dx = x - ease.x, dist2 = dx * dx + dy * dy;
            if (dist2 < R2) { const k = 1 - Math.sqrt(dist2) / R; d -= k * k * (3 - 2 * k) * 0.55 * ease.a; }
          }
          const c = j * cols + i;
          let code = 0;
          if (d >= t0) {
            const n = c * 2;
            let ch, alpha;
            if (edge && d < t1) {
              ch = edge[(((rnd[n] * 97) | 0) + Math.floor(step + rnd[n + 1] * 4)) % nE];  // each cell changes letter on its own beat
              alpha = 0.3;
            } else {
              const k = Math.min(1, (d - t1) / 0.2);
              ch = ramp[Math.min(ramp.length - 1, (k * ramp.length) | 0)];
              alpha = 0.16 + k * 0.32;
            }
            if ((rnd[n + 1] + blink) % 1 > 0.985) alpha += 0.35;                           // an occasional brighter glyph
            const level = Math.max(1, Math.min(LEVELS, Math.round(alpha * boost * LEVELS)));
            code = 1 + glyph[ch] * LEVELS + (level - 1);
          }
          if (code === shown[c]) continue;                                                 // unchanged: leave it
          if (budget-- <= 0) continue;                                                     // over this frame's budget: next frame
          shown[c] = code;
          const X = Math.round(x * dpr - s / 2), Y = Math.round(y * dpr - s / 2);
          ctx.clearRect(X, Y, s, s);
          if (code) { const q = code - 1, gi = (q / LEVELS) | 0; ctx.drawImage(atlas, gi * s, (q - gi * LEVELS) * s, s, s, X, Y, s, s); }
        }
      }
      if (o.follow) canvas.style.transform = o.follow.style.transform; // stay aligned with a parallax image
    }

    let onScreen = true;
    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; wake(); }).observe(host);
    fields.push({ draw, resize, live: () => onScreen && cols > 0 && (!o.visible || o.visible()) });
    resize();
    if (o.follow && !o.follow.complete) o.follow.addEventListener("load", resize, { once: true });
    wake();
  }

  // The look every field shares
  const LOOK = { ramp: ".:-=+*#%".split(""), edge: NAME, color: "#f3f3ee", fontScale: 0.78, thresh: 0.47, edgeW: 0.045 };
  // A box GSAP has clipped shut (clip-path inset of 100%, or 50% from both sides) cannot be seen
  // (browsers shorten the value: "inset(50% 0%)" means top and bottom are both 50%)
  const clippedShut = (el) => {
    const m = /inset\(([^)]*)\)/.exec(el.style.clipPath || "");
    if (!m) return false;
    const v = m[1].trim().split(/\s+/).map(parseFloat), top = v[0], bottom = v.length > 2 ? v[2] : v[0];
    return top + bottom >= 99.5;
  };

  /* ---------- Homepage hero and the six tiles ---------- */
  const hero = document.querySelector(".hero-bg");
  if (hero && S.heroAscii !== false) {
    mount(hero, {
      ...LOOK, scale: 0.0468,
      cell: (w) => (w < 700 ? 11 : w < 1200 ? 13 : 14),
      radius: (w) => Math.max(110, Math.min(220, w * 0.13)),
      visible: () => !clippedShut(hero),                   // the scroll scene closes the photo onto the grid line
    });
    document.querySelectorAll(".tile-img").forEach((tile) => mount(tile, {
      ...LOOK, scale: 0.11, boost: 1.5, shadow: "rgba(11, 11, 11, .6)",   // small, varied photos: smaller clouds, bolder characters
      cell: (w) => (w < 160 ? 8 : 9),
      radius: (w) => Math.max(45, w * 0.4),
      visible: () => !clippedShut(tile),                   // tiles stay shut until the scroll scene opens them
    }));
  }

  /* ---------- About portrait (same look, scaled to the smaller frame) ---------- */
  const portrait = document.querySelector(".portrait[data-ascii]");
  const pimg = portrait && portrait.querySelector("img");
  if (portrait && pimg) mount(portrait, {
    ...LOOK, follow: pimg, scale: 0.075, thresh: 0.44, boost: 1.7, shadow: "rgba(11, 11, 11, .75)",  // the photo is brighter and busier than the hero
    cell: () => 11,
    radius: (w) => Math.max(70, w * 0.22),
  });
})();
