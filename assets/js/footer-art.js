/* Footer picture, drawn by code: the dotted mountain photo is copied onto a canvas so its dots can move.
   - The cloud (every dot lighter than the flat grey sky) thins and thickens in slow bands that drift sideways.
   - The mouse dissolves the dots around itself into the grey, like the drifting characters on the homepage.
   The plain picture stays underneath until the canvas is ready, and is all that visitors who prefer reduced motion
   (or browsers without canvas) get. Turn it off with  artMotion: false  under footer in content.js.

   Kept cheap on purpose: only the cloud's dots are recomputed, their density comes from a coarse noise grid,
   only the changed rectangles are sent to the screen, and nothing runs while the footer is off screen. */
(function () {
  const S = window.SITE || {};
  const pic = document.querySelector(".foot-pic");
  const img = pic && pic.querySelector("img");
  if (!img || (S.footer || {}).artMotion === false) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* ---------- Smooth 3D value noise, two octaves ---------- */
  const P = new Uint8Array(512);
  { const p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) P[i] = p[i & 255]; }
  const fade = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  function noise(x, y, z) {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    x -= X; y -= Y; z -= Z;
    const xi = X & 255, yi = Y & 255, zi = Z & 255, u = fade(x), v = fade(y), w = fade(z);
    const h = (a, b, c) => P[P[P[a] + b] + c] / 255;
    return lerp(
      lerp(lerp(h(xi, yi, zi), h(xi + 1, yi, zi), u), lerp(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), u), v),
      lerp(lerp(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), u), lerp(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), u), v),
      w);
  }
  const fbm = (x, y, z) => noise(x, y, z) * 0.65 + noise(x * 2.1, y * 2.1, z * 1.4) * 0.35;
  // A fixed pseudo-random byte per pixel: the order in which dots drop out
  const hash = (i) => { i = Math.imul(i ^ (i >>> 15), 0x2c1b3c6d); i ^= i >>> 12; i = Math.imul(i, 0x297a2d39); return (i ^ (i >>> 15)) >>> 24; };

  function start() {
    const W = img.naturalWidth, H = img.naturalHeight;
    if (!W || !H || W * H > 3e6) return;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;
    let data;
    try { ctx.drawImage(img, 0, 0); data = ctx.getImageData(0, 0, W, H); } catch (e) { return; }
    const buf = new Uint32Array(data.data.buffer), orig = buf.slice();

    // The flat sky is the most common colour; the cloud is every dot lighter than it
    const count = new Map();
    for (let i = 0; i < orig.length; i += 7) count.set(orig[i], (count.get(orig[i]) || 0) + 1);
    let bg = orig[0], top = 0;
    count.forEach((n, c) => { if (n > top) { top = n; bg = c; } });
    const lum = (c) => c & 255, bgLum = lum(bg);   // the picture is grey, so one channel is the brightness

    const G = 24, cols = Math.ceil(W / G) + 2, rows = Math.ceil(H / G) + 2;
    const field = new Float32Array(cols * rows);
    let n = 0, x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (let i = 0; i < orig.length; i++) if (lum(orig[i]) > bgLum + 8) n++;
    if (!n) return;
    const at = new Uint32Array(n), cell = new Uint16Array(n), fx = new Uint8Array(n), fy = new Uint8Array(n), thr = new Uint8Array(n);
    for (let i = 0, k = 0; i < orig.length; i++) {
      if (lum(orig[i]) <= bgLum + 8) continue;
      const x = i % W, y = (i / W) | 0;
      at[k] = i; cell[k] = ((y / G) | 0) * cols + ((x / G) | 0); fx[k] = ((x % G) / G) * 255; fy[k] = ((y % G) / G) * 255; thr[k] = hash(i);
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      k++;
    }
    const r0 = (y0 / G) | 0, r1 = Math.min(rows - 1, ((y1 / G) | 0) + 1);

    // Pointer, in picture pixels
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, s: 0, on: false, r: 90 };
    let old = null;   // the rectangle the pointer changed last frame
    const hover = matchMedia("(hover: hover)").matches;
    const foot = pic.closest("footer") || pic;
    if (hover) {
      foot.addEventListener("pointermove", (e) => {
        const b = pic.getBoundingClientRect(), k = Math.max(b.width / W, b.height / H);   // object-fit: cover, anchored bottom centre
        ptr.tx = (e.clientX - b.left - (b.width - W * k) / 2) / k;
        ptr.ty = (e.clientY - b.top - (b.height - H * k)) / k;
        ptr.r = Math.max(50, 115 / k);
        if (!ptr.on && ptr.s < 0.02) { ptr.x = ptr.tx; ptr.y = ptr.ty; }
        ptr.on = true; wake();
      }, { passive: true });
      foot.addEventListener("pointerleave", () => { ptr.on = false; });
    }

    function draw(t) {
      // 1. put back what the pointer dissolved last frame
      if (old) for (let y = old.y; y < old.y + old.h; y++) { const a = y * W + old.x; buf.set(orig.subarray(a, a + old.w), a); }

      // 2. cloud: density from a coarse noise grid that drifts sideways
      const dx = t * 0.00007, dz = t * 0.00004;
      for (let r = r0; r <= r1; r++) for (let c = 0; c < cols; c++) {
        const v = fbm(c * 0.07 - dx, r * 0.16, dz);
        const p = Math.min(1, Math.max(0, (v - 0.33) / 0.27));
        field[r * cols + c] = 40 + p * p * (3 - 2 * p) * 225;   // 40..265: never fewer than about one dot in six
      }
      for (let k = 0; k < n; k++) {
        const c = cell[k], u = fx[k] / 255, v = fy[k] / 255;
        const d = lerp(lerp(field[c], field[c + 1], u), lerp(field[c + cols], field[c + cols + 1], u), v);
        buf[at[k]] = thr[k] < d ? orig[at[k]] : bg;
      }

      // 3. pointer: dots dissolve into the sky around it
      ptr.s += ((ptr.on ? 1 : 0) - ptr.s) * 0.14;
      ptr.x += (ptr.tx - ptr.x) * 0.2; ptr.y += (ptr.ty - ptr.y) * 0.2;
      let now = null;
      if (ptr.s > 0.01) {
        const R = ptr.r * (0.6 + 0.4 * ptr.s), R2 = R * R;
        const ax = Math.max(0, Math.floor(ptr.x - R)), ay = Math.max(0, Math.floor(ptr.y - R));
        const bx = Math.min(W, Math.ceil(ptr.x + R)), by = Math.min(H, Math.ceil(ptr.y + R));
        if (bx > ax && by > ay) {
          now = { x: ax, y: ay, w: bx - ax, h: by - ay };
          for (let y = ay; y < by; y++) for (let x = ax; x < bx; x++) {
            const ex = x - ptr.x, ey = y - ptr.y, d2 = ex * ex + ey * ey;
            if (d2 >= R2) continue;
            const q = 1 - d2 / R2, i = y * W + x;
            if (buf[i] !== bg && hash(i) < q * q * ptr.s * 300) buf[i] = bg;
          }
        }
      }

      // 4. send only what changed
      ctx.putImageData(data, 0, 0, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
      if (old) ctx.putImageData(data, 0, 0, old.x, old.y, old.w, old.h);
      if (now) ctx.putImageData(data, 0, 0, now.x, now.y, now.w, now.h);
      old = now;
    }

    // One loop, only while the footer can be seen
    let raf = 0, last = 0, seen = false;
    function frame(t) {
      raf = 0;
      if (!seen || document.hidden) return;
      if (t - last >= (ptr.on || ptr.s > 0.01 ? 40 : 90)) { last = t; draw(t); }
      raf = requestAnimationFrame(frame);
    }
    function wake() { if (!raf && seen && !document.hidden) raf = requestAnimationFrame(frame); }
    document.addEventListener("visibilitychange", wake);
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => { seen = es[es.length - 1].isIntersecting; wake(); }, { rootMargin: "100px" }).observe(foot);
    else { seen = true; }

    draw(performance.now());
    pic.appendChild(canvas);
    pic.classList.add("is-drawn");   // hides the plain picture underneath
    wake();
  }

  if (img.complete && img.naturalWidth) start();
  else img.addEventListener("load", start, { once: true });
})();
