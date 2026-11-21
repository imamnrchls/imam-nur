/* Draws the site's illustrations (hero, footer and the six homepage tiles) as crayon / pastel pictures, in the browser,
   with nothing but canvas. Unlike paint.js, which redraws a photo, these are composed: each scene below is a few flat
   fields of colour (sky, ridges, meadows), small figures, and a handful of props, laid back to front.

   How a field is drawn
   1. It is filled flat, slightly darker than its colour.
   2. Broad strokes are laid over it in one direction. Each stroke is a bundle of thin wavering lines with gaps:
      the grain of a pastel stick on paper. A few strokes use a neighbouring colour.
   3. "Streaks": longer strokes in a second colour, only where a slow noise pattern is high, so they gather in patches
      (green running through an orange hillside, pale wisps through the sky).
   4. "Fringe": short strokes across the field's edge, so edges are ragged; on grass they stand up as bristles.
   5. "Speck": tiny paper-coloured dots, the paper showing through.
   Paper grain is laid over the whole picture at the end.

   Everything random comes from one seed, so a scene always gives the same picture.
   Options:  ?scene=hero&w=1600&seed=11   (w is the output width; the scene keeps its proportions)  */
(async function () {
  const q = new URLSearchParams(location.search);
  const NAME = q.get("scene") || "hero";
  const status = document.getElementById("status");

  /* ---------- seeded random numbers and noise ---------- */
  let s = +(q.get("seed") || 11) >>> 0 || 1;
  const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  const rr = (a, b) => a + (b - a) * rnd();
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const NS = (rnd() * 1e6) | 0;
  const hash = (x, y) => { let h = (x * 374761393 + y * 668265263 + NS * 144665) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const noise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  const fbm = (x, y) => noise(x, y) * 0.6 + noise(x * 2.1 + 9, y * 2.1) * 0.28 + noise(x * 4.3, y * 4.3 + 5) * 0.12;

  /* ---------- colours ---------- */
  const hex = (h) => (Array.isArray(h) ? h : [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
  const shade = (c, d) => hex(c).map((v) => clamp(v + d, 0, 255));
  const mix = (a, b, t) => hex(a).map((v, i) => v + (hex(b)[i] - v) * t);
  const rgba = (c, a = 1) => `rgba(${c.map((v) => Math.round(v)).join(",")},${a})`;
  // One palette for every picture, so the hero, footer and tiles read as one set.
  // A notch quieter than full pastel-stick colour, so the pictures sit inside a black-and-paper site.
  const C = {
    sky: "#3a80c9", skyHi: "#5b98d6", skyDeep: "#2c6cb4", haze: "#88aac6",
    paper: "#f3eee3", pink: "#eec2ad", peach: "#f0a877",
    ochre: "#e2a443", orange: "#e58a4c", yellow: "#ecc046",
    olive: "#929235", moss: "#6f8a33", green: "#477a49", teal: "#3f8578", deep: "#22403a",
    navy: "#1f2c47", ink: "#191b20", stone: "#a9a39a",
    skin: "#d9a07c", hair: "#1c1c22",
  };

  /* ---------- geometry (all in scene units) ---------- */
  // a smooth line through points (Catmull-Rom)
  const smooth = (pts, n = 10) => {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
      }
    }
    out.push(pts[pts.length - 1].slice());
    return out;
  };
  // a skyline or hill edge: smooth, then roughened by noise
  const ridge = (pts, rough = 6, freq = 0.012) => {
    const off = rnd() * 100, line = smooth(pts, 24);
    return line.map(([x, y]) => [x, y + (fbm(x * freq + off, off) - 0.5) * 2 * rough]);
  };
  // the height of a left-to-right line at x
  const yAt = (line, x) => {
    for (let i = 0; i < line.length - 1; i++) {
      const [x0, y0] = line[i], [x1, y1] = line[i + 1];
      if ((x >= x0 && x <= x1) || (x <= x0 && x >= x1)) return y0 + (y1 - y0) * ((x - x0) / (x1 - x0 || 1));
    }
    return line[x < line[0][0] ? 0 : line.length - 1][1];
  };
  // the area between a top line and a bottom line (or a bottom y)
  const band = (top, bottom) => {
    const b = typeof bottom === "number" ? [[top[top.length - 1][0], bottom], [top[0][0], bottom]] : bottom.slice().reverse();
    return top.concat(b);
  };
  const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const ellipse = (cx, cy, rx, ry, rot = 0, n = 30) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry;
    return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)];
  });
  // a round-ended bar from a to b (limbs)
  const capsule = (a, b, r, n = 8) => {
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), pts = [];
    for (let i = 0; i <= n; i++) { const t = ang - Math.PI / 2 + (i / n) * Math.PI; pts.push([b[0] + Math.cos(t) * r, b[1] + Math.sin(t) * r]); }
    for (let i = 0; i <= n; i++) { const t = ang + Math.PI / 2 + (i / n) * Math.PI; pts.push([a[0] + Math.cos(t) * r, a[1] + Math.sin(t) * r]); }
    return pts;
  };
  // a soft closed shape through points (torsos, rocks, bushes)
  const closed = (pts, n = 6) => smooth([pts[pts.length - 1], ...pts, pts[0], pts[1]], n).slice(n, (pts.length + 1) * n);
  // a lumpy round shape: tree crowns, shrubs
  const blob = (cx, cy, rx, ry, lump = 0.18, n = 40) => {
    const off = rnd() * 100;
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2, k = 1 + (noise(Math.cos(a) * 1.6 + off, Math.sin(a) * 1.6 + off) - 0.5) * 2 * lump;
      return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
    });
  };
  // a band that narrows along a line, from width w0 to w1 (paths, streams)
  const ribbon = (pts, w0, w1) => {
    const line = smooth(pts, 12), L = [], R = [];
    line.forEach(([x, y], i) => {
      const [ax, ay] = line[Math.max(0, i - 1)], [bx, by] = line[Math.min(line.length - 1, i + 1)], d = Math.hypot(bx - ax, by - ay) || 1;
      const w = (w0 + (w1 - w0) * (i / (line.length - 1))) / 2, nx = -(by - ay) / d, ny = (bx - ax) / d;
      L.push([x + nx * w, y + ny * w]); R.push([x - nx * w, y - ny * w]);
    });
    return L.concat(R.reverse());
  };
  const rot = (poly, cx, cy, a) => poly.map(([x, y]) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]);
  const bbox = (poly) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of poly) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return [x0, y0, x1, y1];
  };
  const inside = (poly, x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };

  /* ---------- the canvas ---------- */
  const SC = SCENES()[NAME];
  if (!SC) { status.textContent = `No scene called "${NAME}".`; return; }
  const OUT_W = +(q.get("w") || SC.out || SC.w), U = OUT_W / SC.w, W = SC.w, H = SC.h;
  const out = document.getElementById("out");
  out.width = OUT_W; out.height = Math.round(H * U);
  const ctx = out.getContext("2d", { willReadFrequently: true });
  ctx.setTransform(U, 0, 0, U, 0, 0);
  ctx.lineCap = "round";
  const pathOf = (poly) => { const p = new Path2D(); poly.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y))); p.closePath(); return p; };

  // One stroke: a bundle of thin wavering lines with gaps between them (chalk grain)
  function stroke(x, y, ang, len, wid, col, alpha) {
    const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
    const lw = clamp(wid * 0.14, 0.7, 2.6), lines = Math.max(2, Math.round(wid / (lw * 1.05))), bend = rr(-0.1, 0.1) * len;
    for (let k = 0; k < lines; k++) {
      if (rnd() < 0.24) continue;                                 // a gap: paper shows through
      const o = (k / (lines - 1) - 0.5) * wid + rr(-0.4, 0.4) * lw;
      const a = (-len / 2) * rr(0.7, 1.05), b = (len / 2) * rr(0.7, 1.05), l = rr(-9, 9);
      ctx.strokeStyle = rgba(shade(col, l), alpha * rr(0.5, 1));
      ctx.lineWidth = lw * rr(0.7, 1.45);
      ctx.beginPath();
      ctx.moveTo(x + dx * a + nx * o, y + dy * a + ny * o);
      ctx.quadraticCurveTo(x + nx * (o + bend), y + ny * (o + bend), x + dx * b + nx * (o + rr(-1, 1) * lw), y + dy * b + ny * (o + rr(-1, 1) * lw));
      ctx.stroke();
    }
  }

  /* paint(poly, options): one field of colour
     col      the colour                 w, len   stroke width and length (length as a multiple of width)
     ang      stroke direction (radians, 0 = flat, negative rises to the right)      jit    how much it wanders
     dens     how many strokes
     alt      [[colour, share], …]  neighbouring colours mixed into the strokes
     streaks  [{ col, th, freq, w, len, ang, alpha }]  second-colour strokes in patches (th: how rare, 0–1)
     fringe   { len, w, side: "up"|"all", ang, every }  ragged edge / grass bristles
     speck    { col, amt, size }  paper dots                                                         */
  function paint(poly, o) {
    const col = hex(o.col), w = o.w || 14, len = (o.len || 4.5) * w, ang = o.ang ?? -0.12, dens = o.dens ?? 1;
    const [x0, y0, x1, y1] = bbox(poly), area = (x1 - x0) * (y1 - y0), path = pathOf(poly);
    ctx.fillStyle = rgba(shade(col, -7));
    ctx.fill(path);
    ctx.save();
    ctx.clip(path);
    const n = Math.round((area / (w * len * 0.32)) * dens);
    for (let i = 0; i < n; i++) {
      const x = rr(x0 - w, x1 + w), y = rr(y0 - w, y1 + w);
      if (!inside(poly, clamp(x, x0, x1), clamp(y, y0, y1))) continue;
      let c = col;
      for (const [ac, share] of o.alt || []) if (rnd() < share) { c = hex(ac); break; }
      stroke(x, y, ang + rr(-1, 1) * (o.jit ?? 0.13), len * rr(0.7, 1.25), w * rr(0.8, 1.15), c, 0.9);
    }
    for (const st of o.streaks || []) {
      const sw = st.w || w * 0.8, sl = (st.len || 6) * sw, f = st.freq || 0.004, off = rnd() * 50;
      const m = Math.round((area / (sw * sl * 0.3)) * (st.dens ?? 1));
      for (let i = 0; i < m; i++) {
        const x = rr(x0, x1), y = rr(y0, y1);
        if (!inside(poly, x, y) || fbm(x * f + off, y * f * (st.squash || 2.6) + off) < (st.th ?? 0.55)) continue;
        stroke(x, y, (st.ang ?? ang) + rr(-0.1, 0.1), sl * rr(0.6, 1.3), sw * rr(0.7, 1.2), hex(st.col), st.alpha ?? 0.85);
      }
    }
    if (o.speck) {
      const sp = o.speck, m = Math.round((area / 900) * (sp.amt ?? 1) * 10), sz = sp.size || 1.6;
      ctx.fillStyle = rgba(hex(sp.col || C.paper));
      for (let i = 0; i < m; i++) {
        const x = rr(x0, x1), y = rr(y0, y1);
        if (!inside(poly, x, y)) continue;
        ctx.globalAlpha = rr(0.35, 0.95);
        ctx.beginPath();
        ctx.ellipse(x, y, sz * rr(0.4, 1.4), sz * rr(0.3, 0.8), ang + rr(-0.4, 0.4), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    if (o.fringe) {
      const f = o.fringe, every = f.every || 3, fw = f.w || w * 0.45;
      for (let i = 0; i < poly.length; i++) {
        const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length], sl = Math.hypot(bx - ax, by - ay);
        if (!sl) continue;
        let nx = -(by - ay) / sl, ny = (bx - ax) / sl;
        const mx = (ax + bx) / 2, my = (ay + by) / 2;
        if (inside(poly, mx + nx * 2, my + ny * 2)) { nx = -nx; ny = -ny; }       // make it point outwards
        if (f.side === "up" && ny > -0.25) continue;
        if (mx < 1 || mx > W - 1 || my < 1 || my > H - 1) continue;              // not along the picture's border
        for (let t = rnd() * every; t < sl; t += every * rr(0.6, 1.4)) {
          const px = ax + ((bx - ax) * t) / sl, py = ay + ((by - ay) * t) / sl, L = f.len * rr(0.25, 1);
          let a = f.ang != null ? f.ang + rr(-0.25, 0.25) : Math.atan2(ny, nx) + rr(-0.5, 0.5);
          if (Math.cos(a) * nx + Math.sin(a) * ny < 0) a += Math.PI;             // always outwards
          const sx = px - nx * L * 0.25, sy = py - ny * L * 0.25;
          stroke(sx + (Math.cos(a) * L) / 2, sy + (Math.sin(a) * L) / 2, a, L, fw * rr(0.5, 1), f.col ? hex(f.col) : col, 0.9);
        }
      }
    }
  }

  /* ---------- people ----------
     figure(x, y, h, o): a small person standing on the point (x, y), h tall.
     o.pose: walk | stand | wave | book | sit | read | hug | crouch | reach | lie      o.face: 1 (right) or -1 (left)
     o.top, o.bottom, o.pack, o.hair, o.skin: colours. o.headphones, o.camera: extras.
     Parts are drawn in a unit figure (feet at 0, head at -1, facing right) and then placed. */
  function figure(x, y, h, o) {
    const face = o.face || 1, T = o.top, B = o.bottom || C.navy, HAIR = o.hair || C.hair, SKIN = o.skin || C.skin;
    const parts = [];
    const add = (poly, c) => parts.push([poly, c]);
    const head = (cx, cy) => {
      add(ellipse(cx, cy, 0.064, 0.072), SKIN);
      add(ellipse(cx - 0.018, cy - 0.028, 0.066, 0.05, -0.15), HAIR);
      if (o.headphones) { add(capsule([cx - 0.06, cy - 0.01], [cx + 0.01, cy - 0.085], 0.016), o.headphones); add(ellipse(cx - 0.02, cy + 0.005, 0.03, 0.036), o.headphones); }
    };
    const torso = (dy = 0, a = 0, px = 0, py = -0.46) => rot(closed([[-0.11, -0.84], [0.08, -0.85], [0.125, -0.7], [0.115, -0.46], [-0.115, -0.45], [-0.135, -0.66]]).map(([u, v]) => [u, v + dy]), px, py + dy, a);
    const pack = (dy = 0, a = 0, py = -0.46) => o.pack && add(rot(closed([[-0.21, -0.82], [-0.08, -0.84], [-0.06, -0.52], [-0.2, -0.5]]).map(([u, v]) => [u, v + dy]), 0, py + dy, a), o.pack);
    const leg = (a, b, back) => add(capsule(a, b, 0.052), back ? shade(B, -14) : B);
    const shoe = (x0, y0) => add(ellipse(x0 + 0.025, y0 - 0.012, 0.048, 0.022), C.ink);
    const arm = (a, b, back) => { add(capsule(a, b, 0.043), shade(T, back ? -26 : -14)); add(ellipse(b[0], b[1], 0.03, 0.032), SKIN); };
    const p = o.pose || "stand";
    if (p === "walk" || p === "book") {
      leg([-0.01, -0.46], [-0.12, -0.03], 1); shoe(-0.13, 0);
      leg([0.03, -0.46], [0.12, -0.03]); shoe(0.12, 0);
      if (p === "walk") arm([-0.02, -0.78], [-0.1, -0.56], 1);
      pack(); add(torso(), T);
      if (p === "book") { add([[0.08, -0.74], [0.27, -0.71], [0.26, -0.6], [0.07, -0.62]], C.paper); arm([0.0, -0.77], [0.12, -0.64]); }
      else arm([0.03, -0.78], [0.08, -0.54]);
      head(0.01, -0.91);
    } else if (p === "stand" || p === "wave") {
      leg([-0.04, -0.46], [-0.05, -0.03], 1); shoe(-0.06, 0);
      leg([0.04, -0.46], [0.05, -0.03]); shoe(0.04, 0);
      pack(); add(torso(), T);
      if (p === "wave") arm([0.05, -0.79], [0.17, -1.01]); else arm([0.02, -0.78], [0.04, -0.53]);
      head(0.01, -0.91);
    } else if (p === "sit" || p === "read" || p === "hug") {
      const d = 0.36;   // the hips sit on the ground
      if (p === "read") { leg([0.0, -0.08], [0.4, -0.04], 1); shoe(0.4, -0.01); leg([0.0, -0.1], [0.2, -0.22]); leg([0.2, -0.22], [0.34, -0.04]); shoe(0.33, -0.01); }
      else { leg([0.0, -0.09], [0.21, -0.27], 1); leg([0.21, -0.27], [0.3, -0.04], 1); shoe(0.29, -0.01); leg([0.02, -0.1], [0.24, -0.25]); leg([0.24, -0.25], [0.34, -0.04]); shoe(0.33, -0.01); }
      pack(d); add(torso(d, 0.08, 0, -0.46), T);
      if (p === "read") { add(rot([[0.07, -0.42], [0.27, -0.37], [0.26, -0.27], [0.06, -0.31]], 0.16, -0.34, 0.1), C.paper); arm([0.03, -0.42], [0.15, -0.32]); }
      else if (p === "hug") arm([0.03, -0.43], [0.21, -0.27]);
      else arm([0.02, -0.42], [0.12, -0.16]);
      head(0.04, -0.56);
    } else if (p === "crouch") {
      leg([0.0, -0.22], [-0.13, -0.05], 1); leg([-0.13, -0.05], [-0.26, -0.03], 1);
      leg([0.02, -0.22], [0.18, -0.33]); leg([0.18, -0.33], [0.2, -0.03]); shoe(0.19, 0);
      pack(0.25, 0.32, -0.46); add(torso(0.25, 0.32), T);
      add(closed([[0.12, -0.67], [0.22, -0.67], [0.22, -0.58], [0.12, -0.58]], 3), C.ink);
      add(ellipse(0.235, -0.625, 0.022, 0.026), C.ink);
      arm([0.05, -0.52], [0.14, -0.6]);
      head(0.07, -0.66);
    } else if (p === "reach") {
      leg([-0.04, -0.44], [-0.12, -0.03], 1); shoe(-0.13, 0);
      leg([0.04, -0.44], [0.1, -0.03]); shoe(0.1, 0);
      pack(0, 0.45, -0.44); add(torso(0, 0.45, 0, -0.44), T);
      arm([0.17, -0.7], [0.3, -0.5]);
      head(0.27, -0.83);
    } else if (p === "lie") {
      leg([-0.4, -0.06], [0.02, -0.05], 1); shoe(0.02, -0.03);
      leg([-0.4, -0.08], [-0.2, -0.3]); leg([-0.2, -0.3], [-0.04, -0.05]); shoe(-0.05, -0.02);
      add(closed([[-0.82, -0.15], [-0.42, -0.17], [-0.38, -0.02], [-0.8, 0.0]]), T);
      arm([-0.68, -0.12], [-0.5, -0.2]);
      add(ellipse(-0.89, -0.07, 0.072, 0.064), SKIN);
      add(ellipse(-0.91, -0.04, 0.062, 0.05), HAIR);
      if (o.headphones) { add(capsule([-0.95, -0.1], [-0.84, -0.13], 0.017), o.headphones); add(ellipse(-0.885, -0.115, 0.034, 0.03), o.headphones); }
    }
    for (const [poly, c] of parts) {
      const pp = poly.map(([u, v]) => [x + u * h * face, y + v * h]);
      paint(pp, { col: c, w: Math.max(2.2, h * 0.05), len: 2.6, ang: -0.9, dens: 0.8, fringe: { len: h * 0.018, w: h * 0.015, every: Math.max(1.5, h * 0.03) } });
    }
  }

  const API = { paint, figure, ridge, smooth, ribbon, band, rect, ellipse, capsule, closed, blob, rot, yAt, mix, shade, rr, rnd, C, W, H };
  status.textContent = "Drawing…";
  await new Promise((r) => setTimeout(r));
  SC.draw(API);

  /* ---------- paper grain ---------- */
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const d = ctx.getImageData(0, 0, out.width, out.height), px = d.data, PAPER = hex(C.paper);
  for (let i = 0; i < px.length; i += 4) {
    const n = (rnd() - 0.5) * 9, k = rnd() < 0.008 ? 0.5 : 0;            // now and then a fleck of bare paper
    for (let j = 0; j < 3; j++) px[i + j] = clamp(px[i + j] + (PAPER[j] - px[i + j]) * k + n, 0, 255);
  }
  ctx.putImageData(d, 0, 0);
  status.textContent = `Done: ${NAME}, ${out.width}×${out.height}. Right-click the picture to save it.`;
  window.SCENE_DONE = true;

  /* =====================================================================
     The scenes. Units are the picture's own pixels at its normal width.
     ===================================================================== */
  function SCENES() {
    return {
      /* Homepage background: hikers on a ridge, a volcano over a sea of cloud. Full screen, with the name over the middle,
         so the middle is kept quiet and the figures sit low and near the centre (a phone shows only the middle third). */
      hero: { w: 1600, h: 1200, draw(S) {
        const { paint, figure, ridge, band, rect, blob, yAt, C, H } = S;
        paint(rect(0, 0, 1600, H), { col: C.sky, w: 26, len: 3.2, ang: 0.22, jit: 0.4, alt: [[C.skyHi, 0.22], [C.skyDeep, 0.12]], streaks: [{ col: C.paper, th: 0.74, freq: 0.0022, w: 9, len: 9, ang: 0.25, alpha: 0.5 }], speck: { col: C.paper, amt: 0.55 } });
        // the volcano, hazy with distance, its far side in shadow
        const vol = ridge([[520, 780], [720, 660], [880, 560], [975, 505], [1030, 498], [1085, 515], [1230, 600], [1470, 760]], 7, 0.025);
        paint(band(vol, 820), { col: C.haze, w: 18, ang: 0.7, jit: 0.2, alt: [[C.skyHi, 0.2]], streaks: [{ col: C.paper, th: 0.6, freq: 0.006, w: 7, ang: 1.0, alpha: 0.55 }], fringe: { len: 10, w: 5 } });
        paint([[1040, 503], [1085, 515], [1230, 600], [1470, 760], [1470, 820], [1060, 820], [1075, 720], [1050, 640], [1060, 560]], { col: S.mix(C.haze, C.skyDeep, 0.28), w: 14, ang: 1.1, jit: 0.2, alt: [[C.haze, 0.25]], fringe: { len: 18, w: 6 } });
        // the sea of cloud
        paint(band(ridge([[0, 712], [400, 726], [900, 716], [1300, 734], [1600, 722]], 14, 0.009), 900), { col: C.paper, w: 18, ang: -0.04, alt: [[C.pink, 0.3]], streaks: [{ col: C.pink, th: 0.5, freq: 0.004, w: 10, ang: -0.05 }], fringe: { len: 34, side: "up", w: 9, ang: -0.1 } });
        // the far ridge, falling to the right
        paint(band(ridge([[0, 760], [300, 770], [700, 805], [1100, 840], [1600, 860]], 14, 0.01), 1200), { col: C.teal, w: 20, ang: 0.08, alt: [[C.green, 0.3]], streaks: [{ col: C.deep, th: 0.6, freq: 0.006, ang: 0.08 }], fringe: { len: 16, side: "up", w: 7, ang: -1.45 } });
        // the meadow the hikers climb, rising to the right
        const crest = ridge([[0, 1030], [400, 975], [800, 900], [1200, 835], [1600, 790]], 6, 0.02);
        paint(band(crest, 1200), { col: C.olive, w: 22, ang: -0.16, alt: [[C.moss, 0.25]], streaks: [{ col: C.yellow, th: 0.56, freq: 0.0035, w: 12, ang: -0.18 }, { col: C.moss, th: 0.62, freq: 0.005, w: 14, ang: -0.16 }], fringe: { len: 26, side: "up", w: 6, ang: -1.5, every: 2.5 }, speck: { col: C.paper, amt: 0.25 } });
        for (const [bx, r] of [[1180, 26], [1240, 18], [1420, 34], [1500, 22]]) paint(blob(bx, yAt(crest, bx) + 10, r, r * 0.62, 0.25), { col: C.deep, w: 9, ang: -0.9, alt: [[C.green, 0.3]], fringe: { len: 9, w: 4, side: "up" } });
        // the lower slope, steeper, in orange
        const low = ridge([[0, 1110], [500, 1070], [1000, 1010], [1600, 945]], 10, 0.01);
        paint(band(low, 1200), { col: C.orange, w: 24, ang: -0.2, alt: [[C.ochre, 0.3]], streaks: [{ col: C.olive, th: 0.58, freq: 0.004, w: 16, ang: -0.2 }, { col: C.pink, th: 0.7, freq: 0.005, w: 10, ang: -0.2 }], fringe: { len: 30, side: "up", w: 8, ang: -1.4, every: 3 } });
        // the trail, a worn pale line up the slope to the hikers
        paint(S.ribbon([[330, 1215], [480, 1110], [590, 1020], [660, 958], [712, 930]], 46, 4), { col: C.pink, w: 9, ang: -0.6, alt: [[C.paper, 0.35]], fringe: { len: 10, w: 4 } });
        // the hikers, walking up the ridge
        figure(700, yAt(crest, 700) + 6, 92, { pose: "walk", top: C.yellow, bottom: C.navy, pack: C.orange });
        figure(800, yAt(crest, 800) + 5, 96, { pose: "book", top: "#2f63c4", bottom: C.olive, pack: C.deep });
        figure(900, yAt(crest, 900) + 5, 88, { pose: "walk", top: "#c9563c", bottom: C.navy, pack: C.ochre });
      } },

      /* Footer: two people sitting talking on a hillside by a tent, with layered ridges behind.
         The top melts into the page, and the big line of text sits over the dark bottom. */
      footer: { w: 1600, h: 1063, draw(S) {
        const { paint, figure, ridge, band, rect, blob, yAt, C, H } = S;
        paint(rect(0, 0, 1600, H), { col: C.sky, w: 26, len: 3.2, ang: 0.22, jit: 0.4, alt: [[C.skyHi, 0.25]], speck: { col: C.paper, amt: 0.5 } });
        paint(band(ridge([[0, 500], [300, 465], [620, 500], [1000, 450], [1350, 485], [1600, 465]], 14, 0.01), 700), { col: C.haze, w: 18, ang: 0.5, alt: [[C.pink, 0.15]], fringe: { len: 10, w: 5, side: "up" } });
        paint(band(ridge([[0, 585], [400, 560], [800, 600], [1200, 560], [1600, 585]], 16, 0.012), 760), { col: C.teal, w: 20, ang: -0.1, alt: [[C.green, 0.25]], fringe: { len: 14, w: 6, side: "up", ang: -1.45 } });
        const crest = ridge([[0, 740], [400, 700], [900, 675], [1250, 662], [1600, 680]], 8, 0.02);
        paint(band(crest, 1063), { col: C.ochre, w: 24, ang: -0.08, alt: [[C.orange, 0.3]], streaks: [{ col: C.moss, th: 0.58, freq: 0.0035, w: 16, ang: -0.12 }, { col: C.peach, th: 0.62, freq: 0.004, w: 12 }], fringe: { len: 32, side: "up", w: 7, ang: -1.5, every: 2.5 } });
        // tent
        const tx = 1240, ty = yAt(crest, 1240) + 18;
        paint([[tx - 95, ty], [tx - 8, ty - 104], [tx + 70, ty - 10], [tx + 64, ty + 2]], { col: C.orange, w: 9, ang: -0.9, alt: [[C.peach, 0.3]], fringe: { len: 6, w: 3 } });
        paint([[tx - 30, ty], [tx - 8, ty - 60], [tx + 14, ty]], { col: C.navy, w: 6, ang: -1.2 });
        // the two of them
        figure(1000, yAt(crest, 1000) + 16, 112, { pose: "hug", top: C.yellow, bottom: C.navy });
        figure(1115, yAt(crest, 1115) + 16, 114, { pose: "sit", face: -1, top: "#2f63c4", bottom: C.olive });
        // dark scrub along the bottom, under the text
        const scrub = ridge([[0, 900], [300, 870], [700, 930], [1100, 890], [1600, 920]], 26, 0.02);
        paint(band(scrub, 1063), { col: C.deep, w: 22, ang: -1.3, len: 3, alt: [[C.navy, 0.3], [C.green, 0.15]], fringe: { len: 46, side: "up", w: 10, ang: -1.45, every: 3 } });
        for (const [bx, r] of [[120, 60], [420, 44], [1450, 70]]) paint(blob(bx, yAt(scrub, bx) + 10, r, r * 0.7, 0.3), { col: C.deep, w: 12, ang: -1.2, alt: [[C.green, 0.25]], fringe: { len: 14, w: 5, side: "up" } });
      } },

      /* The six tiles (3:4, shown small): one person each, doing the thing the tile leads to. */
      about: { w: 600, h: 800, draw(S) {   // standing on a summit, looking out
        const { paint, figure, ridge, band, rect, yAt, C, H } = S;
        paint(rect(0, 0, 600, H), { col: C.sky, w: 16, len: 3.2, ang: 0.22, jit: 0.4, alt: [[C.skyHi, 0.25]], streaks: [{ col: C.paper, th: 0.64, freq: 0.006, w: 6, len: 9, ang: 0.35, alpha: 0.6 }], speck: { col: C.paper, amt: 0.6, size: 1.3 } });
        paint(band(ridge([[0, 520], [300, 528], [600, 515]], 8, 0.02), 760), { col: C.pink, w: 12, ang: -0.04, alt: [[C.paper, 0.3]], fringe: { len: 18, side: "up", w: 5, ang: -0.1 } });
        const crest = ridge([[0, 690], [200, 600], [330, 560], [420, 575], [600, 660]], 5, 0.03);
        paint(band(crest, 800), { col: C.ochre, w: 16, ang: -0.1, alt: [[C.orange, 0.3]], streaks: [{ col: C.moss, th: 0.6, freq: 0.012, w: 8, ang: -1.35, len: 4, squash: 0.5 }, { col: C.peach, th: 0.6, freq: 0.01, w: 10 }], fringe: { len: 18, side: "up", w: 4, ang: -1.5, every: 2 } });
        figure(330, yAt(crest, 330) + 6, 180, { pose: "stand", top: C.yellow, bottom: C.navy, pack: C.orange });
      } },
      gallery: { w: 600, h: 800, draw(S) {   // crouched with a camera, framing the mountain
        const { paint, figure, ridge, band, rect, yAt, C, H } = S;
        paint(rect(0, 0, 600, H), { col: C.pink, w: 16, len: 3.2, ang: 0.22, jit: 0.4, alt: [[C.peach, 0.25], [C.paper, 0.2]], speck: { col: C.paper, amt: 0.5, size: 1.3 } });
        paint(band(ridge([[0, 520], [180, 380], [270, 300], [320, 296], [400, 360], [600, 470]], 5, 0.03), 620), { col: C.teal, w: 13, ang: 0.6, alt: [[C.haze, 0.25]], streaks: [{ col: C.paper, th: 0.62, freq: 0.012, w: 5, ang: 1.0, alpha: 0.6 }], fringe: { len: 7, w: 3 } });
        const crest = ridge([[0, 620], [300, 590], [600, 610]], 6, 0.02);
        paint(band(crest, 800), { col: C.olive, w: 16, ang: -0.08, alt: [[C.moss, 0.3]], streaks: [{ col: C.yellow, th: 0.56, freq: 0.008, w: 10 }], fringe: { len: 18, side: "up", w: 4, ang: -1.5, every: 2 } });
        paint(S.closed([[60, 760], [80, 700], [200, 680], [300, 700], [320, 770], [200, 800]]), { col: C.stone, w: 10, ang: -0.6, alt: [[C.pink, 0.25]], fringe: { len: 6, w: 3 } });
        figure(180, 700, 200, { pose: "crouch", top: "#2f63c4", bottom: C.navy });
      } },
      writing: { w: 600, h: 800, draw(S) {   // sitting under a tree with a notebook
        const { paint, figure, ridge, band, rect, blob, C, H } = S;
        paint(rect(0, 0, 600, H), { col: C.yellow, w: 16, len: 3.2, ang: 0.22, jit: 0.4, alt: [[C.paper, 0.25], [C.peach, 0.12]], speck: { col: C.paper, amt: 0.5, size: 1.3 } });
        const crest = ridge([[0, 470], [300, 450], [600, 465]], 6, 0.02);
        paint(band(crest, 800), { col: C.green, w: 16, ang: -0.1, alt: [[C.moss, 0.3]], streaks: [{ col: C.teal, th: 0.56, freq: 0.008, w: 12 }, { col: C.olive, th: 0.62, freq: 0.01, w: 10 }], fringe: { len: 18, side: "up", w: 4, ang: -1.5, every: 2 } });
        paint([[400, 640], [418, 380], [446, 380], [462, 640]], { col: C.navy, w: 7, ang: -1.5, alt: [[C.ink, 0.3]] });
        paint(blob(430, 230, 210, 170, 0.22), { col: C.deep, w: 14, ang: -0.8, alt: [[C.green, 0.3], [C.teal, 0.15]], fringe: { len: 16, w: 5 } });
        paint(S.ellipse(330, 690, 220, 20), { col: S.mix(C.green, C.deep, 0.5), w: 10, ang: -0.05, alt: [[C.green, 0.35]], fringe: { len: 14, w: 5, ang: 0 } });
        figure(270, 680, 210, { pose: "read", top: "#c9563c", bottom: C.navy });
      } },
      portfolio: { w: 600, h: 800, draw(S) {   // building a cairn, stone by stone
        const { paint, figure, ridge, band, rect, closed, yAt, C, H } = S;
        paint(rect(0, 0, 600, H), { col: C.sky, w: 16, len: 3.2, ang: 0.22, jit: 0.4, alt: [[C.skyHi, 0.25]], speck: { col: C.paper, amt: 0.6, size: 1.3 } });
        const crest = ridge([[0, 520], [250, 590], [360, 612], [480, 622], [600, 680]], 4, 0.02);
        paint(band(crest, 800), { col: C.orange, w: 16, ang: 0.25, alt: [[C.ochre, 0.3]], streaks: [{ col: C.olive, th: 0.55, freq: 0.008, w: 12, ang: 0.25 }], fringe: { len: 18, side: "up", w: 4, ang: -1.5, every: 2 } });
        const cx = 410, gy = Math.max(yAt(crest, cx - 70), yAt(crest, cx + 70)) + 12;
        const stones = [[78, 30], [62, 26], [48, 22], [34, 18]];
        let y = gy;
        stones.forEach(([rw, rh], i) => { paint(closed([[cx - rw, y - 4], [cx - rw * 0.8, y - rh * 1.6], [cx + rw * 0.7, y - rh * 1.7], [cx + rw, y - 2]], 4), { col: [C.stone, C.pink, C.haze, C.stone][i], w: 8, ang: -0.3, alt: [[C.paper, 0.2]], fringe: { len: 5, w: 2.5 } }); y -= rh * 1.55; });
        figure(255, yAt(crest, 255) + 6, 190, { pose: "reach", top: C.yellow, bottom: C.navy });
        paint(closed([[300, y + 6], [306, y - 14], [336, y - 16], [340, y + 4]], 4), { col: C.pink, w: 6, ang: -0.3, fringe: { len: 4, w: 2 } });
      } },
      music: { w: 600, h: 800, draw(S) {   // lying in the grass with headphones on
        const { paint, figure, ridge, band, rect, C, H } = S;
        paint(rect(0, 0, 600, H), { col: C.sky, w: 16, len: 3.2, ang: 0.22, jit: 0.4, alt: [[C.skyHi, 0.25]], speck: { col: C.paper, amt: 0.6, size: 1.3 } });
        const crest = ridge([[0, 300], [300, 280], [600, 300]], 7, 0.02);
        paint(band(crest, 800), { col: C.moss, w: 16, ang: -0.1, alt: [[C.green, 0.3], [C.olive, 0.2]], streaks: [{ col: C.yellow, th: 0.62, freq: 0.007, w: 10 }, { col: C.green, th: 0.6, freq: 0.009, w: 12 }], fringe: { len: 20, side: "up", w: 4, ang: -1.5, every: 2 } });
        paint(S.ellipse(330, 572, 180, 22), { col: S.mix(C.moss, C.deep, 0.45), w: 10, ang: -0.05, alt: [[C.moss, 0.35]], fringe: { len: 14, w: 5, ang: 0 } });
        figure(470, 560, 280, { pose: "lie", top: C.yellow, bottom: C.navy, headphones: "#c9563c" });
        // tall grass in front
        paint(band(ridge([[0, 690], [300, 670], [600, 700]], 14, 0.03), 800), { col: C.green, w: 14, ang: -1.4, len: 3, alt: [[C.moss, 0.3]], fringe: { len: 40, side: "up", w: 4, ang: -1.5, every: 3 } });
      } },
      contact: { w: 600, h: 800, draw(S) {   // waving to a friend coming up the path
        const { paint, figure, ridge, band, rect, yAt, C, H } = S;
        paint(rect(0, 0, 600, H), { col: C.sky, w: 16, len: 3.2, ang: 0.22, jit: 0.4, alt: [[C.skyHi, 0.25]], streaks: [{ col: C.paper, th: 0.62, freq: 0.006, w: 6, len: 9, ang: 0.35, alpha: 0.6 }], speck: { col: C.paper, amt: 0.6, size: 1.3 } });
        const crest = ridge([[0, 470], [300, 440], [600, 455]], 6, 0.02);
        paint(band(crest, 800), { col: C.olive, w: 16, ang: -0.08, alt: [[C.moss, 0.3]], streaks: [{ col: C.yellow, th: 0.55, freq: 0.008, w: 10 }], fringe: { len: 18, side: "up", w: 4, ang: -1.5, every: 2 } });
        paint([[120, 800], [250, 640], [330, 520], [370, 446], [392, 446], [370, 530], [330, 650], [300, 800]], { col: C.pink, w: 10, ang: -1.1, alt: [[C.paper, 0.3]], fringe: { len: 8, w: 3 } });
        figure(380, 500, 120, { pose: "wave", face: -1, top: "#c9563c", bottom: C.navy });
        figure(250, 700, 190, { pose: "walk", top: "#2f63c4", bottom: C.olive, pack: C.ochre });
      } },
    };
  }
})();
