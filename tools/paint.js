/* Redraws a photograph as a pastel / crayon drawing, in the browser, with nothing but canvas.
   The colours come from the photo itself: its main colours are found first (the palette) and every stroke uses one of them.

   How it works
   1. The photo's main colours are picked (k-means). Saturation is lifted a little, as pastel sticks are purer than a photo.
   2. The picture is built in layers of strokes, from broad to fine. A finer stroke is only added where the drawing
      still differs from the photo, so flat areas (sky, hillsides) keep their broad strokes and detail lands on edges.
   3. Every stroke is a bundle of thin, slightly wavering lines with gaps between them: the grain of chalk on paper.
      Strokes share one hatching direction, and bend to follow strong edges (ridges, cloud rims).
   4. Paper grain is laid over the result.

   Everything random comes from one seed, so the same photo always gives the same drawing.
   Options go in the address:  ?src=images/photo.webp&w=1600&seed=7&colors=20&scale=1
   scale sizes the strokes: 1 suits a 1600-px picture shown full screen; a picture shown small (the homepage tiles)
   needs smaller strokes, or it turns into a few blobs. detail below 1 adds finer strokes where the photo is soft
   (a hazy, low-contrast photo needs about 0.5); hatch below 1 lays fewer loose scribbles over the top.  */
(async function () {
  const q = new URLSearchParams(location.search);
  const SRC = "../" + (q.get("src") || "images/hero-trail.webp");
  const OUT_W = +(q.get("w") || 1600), K = +(q.get("scale") || 1), DETAIL = +(q.get("detail") || 1), HATCHING = +(q.get("hatch") || 1), SEED = +(q.get("seed") || 7), COLORS = +(q.get("colors") || 20);
  const HATCH = -0.62;                         // the shared stroke direction, in radians (rising to the right)
  const status = document.getElementById("status");

  /* ---------- seeded random numbers ---------- */
  let s = SEED >>> 0 || 1;
  const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  const rr = (a, b) => a + (b - a) * rnd();
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  /* ---------- the photo ---------- */
  const img = new Image();
  img.src = SRC;
  await img.decode();
  const W = OUT_W, H = Math.round(OUT_W * img.naturalHeight / img.naturalWidth);
  const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  const pixels = (blur) => {
    const c = mk(W, H), x = c.getContext("2d", { willReadFrequently: true });
    x.filter = `saturate(1.32) contrast(1.1)${blur ? ` blur(${blur}px)` : ""}`;
    x.drawImage(img, -8, -8, W + 16, H + 16);   // slightly oversize, so the blur has no faded border
    return x.getImageData(0, 0, W, H).data;
  };

  /* ---------- 1. palette: the photo's main colours ---------- */
  const small = pixels(3), samples = [];
  for (let y = 4; y < H; y += 9) for (let x = 4; x < W; x += 9) { const i = (y * W + x) * 4; samples.push([small[i], small[i + 1], small[i + 2]]); }
  let palette = Array.from({ length: COLORS }, () => samples[(rnd() * samples.length) | 0].slice());
  for (let it = 0; it < 14; it++) {
    const sum = palette.map(() => [0, 0, 0, 0]);
    for (const p of samples) {
      let best = 0, bd = 1e9;
      for (let k = 0; k < palette.length; k++) { const c = palette[k], d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2; if (d < bd) { bd = d; best = k; } }
      const t = sum[best]; t[0] += p[0]; t[1] += p[1]; t[2] += p[2]; t[3]++;
    }
    palette = palette.map((c, k) => (sum[k][3] ? [sum[k][0] / sum[k][3], sum[k][1] / sum[k][3], sum[k][2] / sum[k][3]] : samples[(rnd() * samples.length) | 0].slice()));
  }
  // Pastel sticks: shadows lean to cool blue-green instead of the photo's near-black, and no colour is left dull
  palette = palette.map(([r, g, b]) => {
    const l = (r * 0.299 + g * 0.587 + b * 0.114) / 255, k = clamp((0.42 - l) / 0.42, 0, 1) * 0.55;   // how deep in shadow
    return [r + (38 - r) * k, g + (72 - g) * k * 0.9 + 6 * k, b + (104 - b) * k];
  });
  // the two palette colours closest to a colour
  const nearest = (r, g, b) => {
    let a = 0, b2 = 0, da = 1e9, db = 1e9;
    for (let k = 0; k < palette.length; k++) {
      const c = palette[k], d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
      if (d < da) { db = da; b2 = a; da = d; a = k; } else if (d < db) { db = d; b2 = k; }
    }
    return [palette[a], palette[b2]];
  };

  /* ---------- edges: which way each part of the picture runs ---------- */
  const soft = pixels(5), lum = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) lum[i] = soft[i * 4] * 0.299 + soft[i * 4 + 1] * 0.587 + soft[i * 4 + 2] * 0.114;
  const edge = (x, y) => {
    x = clamp(x | 0, 2, W - 3); y = clamp(y | 0, 2, H - 3);
    const i = y * W + x;
    return [lum[i + 2] - lum[i - 2], lum[i + 2 * W] - lum[i - 2 * W]];
  };

  /* ---------- the drawing ---------- */
  const out = document.getElementById("out");
  out.width = W; out.height = H;
  const ctx = out.getContext("2d", { willReadFrequently: true });
  ctx.lineCap = "round";
  // paper: the photo's average colour, pale
  const avg = palette.reduce((a, c) => [a[0] + c[0], a[1] + c[1], a[2] + c[2]], [0, 0, 0]).map((v) => v / palette.length);
  ctx.fillStyle = `rgb(${avg.map((v) => Math.round(v * 0.45 + 140)).join(",")})`;
  ctx.fillRect(0, 0, W, H);

  // One stroke: a bundle of thin wavering lines with gaps (chalk grain)
  function stroke(x, y, ang, len, wid, col, alpha) {
    const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
    const lines = Math.max(2, Math.round(wid / (1.7 * Math.max(K, 0.5)))), bend = rr(-0.12, 0.12) * len;
    for (let k = 0; k < lines; k++) {
      if (rnd() < 0.3) continue;                                   // a gap: paper shows through
      const o = (k / (lines - 1) - 0.5) * wid + rr(-0.6, 0.6) * K;
      const a = -len / 2 * rr(0.72, 1.05), b = len / 2 * rr(0.72, 1.05);
      const l = rr(-7, 7);                                           // each line a touch lighter or darker
      ctx.strokeStyle = `rgba(${clamp(col[0] + l, 0, 255) | 0},${clamp(col[1] + l, 0, 255) | 0},${clamp(col[2] + l, 0, 255) | 0},${alpha * rr(0.55, 1)})`;
      ctx.lineWidth = rr(0.9, 2.3) * Math.max(K, 0.45);
      ctx.beginPath();
      ctx.moveTo(x + dx * a + nx * o, y + dy * a + ny * o);
      ctx.quadraticCurveTo(x + nx * (o + bend), y + ny * (o + bend), x + dx * b + nx * (o + rr(-1, 1)), y + dy * b + ny * (o + rr(-1, 1)));
      ctx.stroke();
    }
  }

  // Layers, broad to fine.  wid: stroke width · step: spacing · blur: how soft the photo is read · need: how different
  // the drawing must still be before a stroke is added · follow: how much strokes bend to edges
  const LAYERS = [
    { wid: 54, step: 24, blur: 14, need: 0,  follow: 0.2,  len: 4.4, alpha: 0.95 },
    { wid: 26, step: 12, blur: 7,  need: 9,  follow: 0.4,  len: 4.2, alpha: 0.9 },
    { wid: 12, step: 6,  blur: 3,  need: 11, follow: 0.65, len: 3.8, alpha: 0.9 },
    { wid: 6,  step: 4,  blur: 1.5, need: 15, follow: 0.85, len: 3.4, alpha: 0.92 },
    { wid: 3,  step: 3,  blur: 0.6, need: 26, follow: 1.0,  len: 3.0, alpha: 0.95 },
  ];
  for (const L of LAYERS) { L.need *= DETAIL; L.wid *= K; L.step = Math.max(1.5, L.step * K); L.blur *= K; }
  for (const [n, L] of LAYERS.entries()) {
    status.textContent = `Painting… layer ${n + 1} of ${LAYERS.length}`;
    await new Promise((r) => setTimeout(r));
    const ref = pixels(L.blur), now = L.need ? ctx.getImageData(0, 0, W, H).data : null;
    const pts = [];
    for (let y = 0; y < H + L.step; y += L.step) for (let x = 0; x < W + L.step; x += L.step) pts.push([x + rr(-0.5, 0.5) * L.step, y + rr(-0.5, 0.5) * L.step]);
    for (let i = pts.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }   // no visible rows
    for (const [px, py] of pts) {
      const x = clamp(px | 0, 0, W - 1), y = clamp(py | 0, 0, H - 1), i = (y * W + x) * 4;
      const r = ref[i], g = ref[i + 1], b = ref[i + 2];
      if (now) { const d = Math.abs(r - now[i]) + Math.abs(g - now[i + 1]) + Math.abs(b - now[i + 2]); if (d / 3 < L.need) continue; }
      // colour: a palette colour (now and then its neighbour, which gives the lively mix), pulled a little to the photo
      const [c1, c2] = nearest(r, g, b), c = rnd() < 0.17 ? c2 : c1, mix = n < 3 ? 0.1 : 0.3;
      const col = [c[0] + (r - c[0]) * mix, c[1] + (g - c[1]) * mix, c[2] + (b - c[2]) * mix];
      // direction: the shared hatch, bent along strong edges
      const [gx, gy] = edge(x, y), mag = Math.hypot(gx, gy), k = clamp(mag / 26, 0, 1) * L.follow;
      const t = Math.atan2(gy, gx) + Math.PI / 2;
      const vx = Math.cos(2 * HATCH) * (1 - k) + Math.cos(2 * t) * k, vy = Math.sin(2 * HATCH) * (1 - k) + Math.sin(2 * t) * k;
      const ang = Math.atan2(vy, vx) / 2 + rr(-0.14, 0.14);
      stroke(px, py, ang, L.wid * L.len * rr(0.7, 1.25), L.wid, col, L.alpha);
    }
  }

  /* ---------- hatching: loose scribbles in a neighbouring colour, over everything ---------- */
  {
    status.textContent = "Painting… hatching";
    await new Promise((r) => setTimeout(r));
    const ref = pixels(6 * K), STEP = 20 * K;
    for (let y = 0; y < H + STEP; y += STEP) for (let x = 0; x < W + STEP; x += STEP) {
      if (rnd() > 0.55 * HATCHING) continue;
      const px = x + rr(-0.5, 0.5) * STEP, py = y + rr(-0.5, 0.5) * STEP;
      const cx = clamp(px | 0, 0, W - 1), cy = clamp(py | 0, 0, H - 1), i = (cy * W + cx) * 4;
      const [gx, gy] = edge(cx, cy);
      if (Math.hypot(gx, gy) > 18) continue;                         // keep edges clean
      const [c1, c2] = nearest(ref[i], ref[i + 1], ref[i + 2]);
      const lift = rnd() < 0.5 ? 26 : -22;                           // a lighter or a darker stick of the same family
      const col = rnd() < 0.5 ? c2 : [c1[0] + lift, c1[1] + lift, c1[2] + lift];
      stroke(px, py, HATCH + rr(-0.1, 0.1), rr(40, 95) * K, rr(5, 11) * K, col, 0.5);
    }
  }

  /* ---------- 4. paper grain ---------- */
  const d = ctx.getImageData(0, 0, W, H), p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const g = (rnd() - 0.5) * 20 + (rnd() < 0.015 ? 24 : 0);
    p[i] = clamp(p[i] + g, 0, 255); p[i + 1] = clamp(p[i + 1] + g, 0, 255); p[i + 2] = clamp(p[i + 2] + g, 0, 255);
  }
  ctx.putImageData(d, 0, 0);
  status.textContent = `Done: ${W}×${H}, ${palette.length} colours, seed ${SEED}. Right-click the picture to save it.`;
  window.PAINT_DONE = true;
})();
