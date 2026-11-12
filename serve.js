// Tiny static file server used only for local preview.
const http = require("http"), fs = require("fs"), path = require("path");
const root = __dirname;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".mp4": "video/mp4" };
// Use the same headers as production (vercel.json), minus caching, so the local preview behaves like the live site.
const rules = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8")).headers || [];
const headersFor = (url) => Object.fromEntries(rules.filter((r) => new RegExp(`^${r.source}$`).test(url))
  .flatMap((r) => r.headers).filter((h) => h.key.toLowerCase() !== "cache-control").map((h) => [h.key, h.value]));
const security = headersFor("/");
http.createServer((req, res) => {
  let rel;
  try { rel = decodeURIComponent(req.url.split("?")[0]); } catch { return res.writeHead(400, security).end("Bad request"); }
  const file = path.join(root, rel === "/" ? "index.html" : rel);
  // Stay inside the site folder, and never serve dotfiles/dot-folders (.git, .claude, …) or the server itself.
  const inside = path.relative(root, file);
  if (!inside || inside.startsWith("..") || path.isAbsolute(inside) || inside.split(path.sep).some((p) => p.startsWith(".")) || inside === "serve.js")
    return res.writeHead(403, security).end("Forbidden");
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return res.writeHead(404, security).end("Not found");
    const type = types[path.extname(file).toLowerCase()] || "application/octet-stream";
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
    const head = { ...headersFor(rel), "Content-Type": type, "Cache-Control": "no-store", "Accept-Ranges": "bytes" };
    if (range && (range[1] || range[2])) { // Safari needs range requests to play video
      let start = range[1] ? +range[1] : st.size - +range[2], end = range[1] && range[2] ? Math.min(+range[2], st.size - 1) : st.size - 1;
      if (start < 0) start = 0;
      if (start > end) return res.writeHead(416, { ...security, "Content-Range": `bytes */${st.size}` }).end();
      res.writeHead(206, { ...head, "Content-Range": `bytes ${start}-${end}/${st.size}`, "Content-Length": end - start + 1 });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, { ...head, "Content-Length": st.size });
    fs.createReadStream(file).pipe(res);
  });
}).listen(4174, "127.0.0.1", () => console.log("http://localhost:4174"));
