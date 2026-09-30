// Documentation images (DOC-003): every widget of the preview page
// (js/preview/index.html) captured in the light and the dark theme from the
// built front end, into docs/img/widgets/<kind>-{light,dark}.png.
//
//   npm run build && npm run images
import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { mkdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const ROOT = new URL("../..", import.meta.url).pathname;
const OUT = join(ROOT, "docs/img/widgets");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

const server = createServer((req, res) => {
  try {
    const path = join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
    res.writeHead(200, { "content-type": TYPES[extname(path)] ?? "application/octet-stream" });
    res.end(readFileSync(path));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const base = `http://127.0.0.1:${server.address().port}/js/preview/index.html`;

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({ viewport: { width: 800, height: 700 }, deviceScaleFactor: 2, colorScheme: theme });
    await page.goto(`${base}?theme=${theme}`);
    await page.waitForTimeout(500);
    for (const el of await page.locator("#panel > div").all()) {
      const kind = (await el.getAttribute("data-kind")).replace(/^awf-/, "");
      await el.locator(".awf-root").screenshot({ path: join(OUT, `${kind}-${theme}.png`), omitBackground: theme === "light" });
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`documentation images written to ${OUT}`);
