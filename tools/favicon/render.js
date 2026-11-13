// Rasterise the SVGs with Chromium: render.js <svg> <size> <out.png>  (several triples allowed)
const { chromium } = require("playwright"); const fs = require("fs");
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage();
  const a = process.argv.slice(2);
  for (let k = 0; k < a.length; k += 3) {
    const [svg, size, out] = [a[k], +a[k + 1], a[k + 2]];
    const url = "data:image/svg+xml;base64," + fs.readFileSync(svg).toString("base64");
    const png = await pg.evaluate(async ([url, size]) => {
      const img = new Image(); img.src = url; await img.decode();
      const c = document.createElement("canvas"); c.width = c.height = size;
      c.getContext("2d").drawImage(img, 0, 0, size, size); return c.toDataURL("image/png");
    }, [url, size]);
    fs.writeFileSync(out, Buffer.from(png.split(",")[1], "base64"));
  }
  await b.close();
})();
