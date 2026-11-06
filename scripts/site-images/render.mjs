#!/usr/bin/env node
/**
 * Draws the site's share image and favicons, both themed on the book collection:
 *
 *   og-image.png               1200×630 share card: an "Ex Libris" bookplate over Plate I,
 *                              the engraving of all six bookcases from the homepage
 *   favicon.ico                16, 32 and 48 px, from the small icons
 *   favicon-16x16.png          small icons: a few spines on a shelf and one leaning book,
 *   favicon-32x32.png            each drawn on its own pixel grid so every edge stays sharp
 *   apple-touch-icon.png       180 px, the engraved icon on a square tile (iOS rounds it)
 *   android-chrome-192x192.png engraved icon with hatched spines, shelf and wall
 *   android-chrome-512x512.png
 *   favicon.png                512 px copy of the engraved icon
 *
 * Colors are the site's: paper #f5f5dc, ink #2a2521, red #8b0000.
 *
 * Uses Playwright's Chromium to draw, and sharp (which comes with Next) to shrink
 * the share image. In a cloud session Playwright is already installed; on your
 * own machine, once: npm i --no-save playwright && npx playwright install chromium
 *
 *   node scripts/site-images/render.mjs              # writes into public/
 *   node scripts/site-images/render.mjs --out DIR    # writes into DIR, plus preview.png
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PUBLIC = path.join(ROOT, "public");

const PAPER = "#f5f5dc";
const INK = "#2a2521";
const RED = "#8b0000";
const BAND = "#e8e8d0";

/* ------------------------------------------------------------------ icons */

const rect = (x, y, w, h, fill, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`;

/**
 * A book tipped over to the left, resting its top corner against the right
 * edge of the spine beside it. It pivots on its bottom left corner, so a sliver
 * of wall shows between the two books at the shelf; that gap is what keeps them
 * apart at 16 px. Returns the book's box in its own upright frame and the
 * rotation that tips it into place.
 */
function leaning({ against, touchY, shelfY, angle, width }) {
  const rad = (angle * Math.PI) / 180;
  const rise = shelfY - touchY;
  const x = against + rise * Math.tan(rad);
  const h = rise / Math.cos(rad);
  return { x, y: shelfY - h, w: width, h, transform: `rotate(${-angle} ${x} ${shelfY})` };
}

/** 16-unit grid, sharp at 16 and 48 px: two spines, a tall thin one, and a book leaning on it. */
function icon16Svg(size) {
  const lean = leaning({ against: 10, touchY: 6, shelfY: 13, angle: 18, width: 2.6 });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 16">
  <rect width="16" height="16" rx="3" fill="${PAPER}"/>
  <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" fill="none" stroke="${INK}" stroke-opacity="0.35"/>
  ${rect(2, 4, 3, 9, INK)}${rect(2, 6, 3, 1, PAPER)}${rect(2, 10, 3, 1, PAPER)}
  ${rect(5, 6, 3, 7, RED)}${rect(5, 8, 3, 1, PAPER)}
  ${rect(8, 2, 2, 11, INK)}
  <g transform="${lean.transform}">${rect(lean.x, lean.y, lean.w, lean.h, INK)}</g>
  ${rect(1, 13, 14, 2, INK)}
</svg>`;
}

/** 32-unit grid, sharp at 32 px: the same shelf with a cream book and finer title bands. */
function icon32Svg(size) {
  const lean = leaning({ against: 22, touchY: 12, shelfY: 26, angle: 16, width: 3.6 });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="${PAPER}"/>
  <rect x="0.5" y="0.5" width="31" height="31" rx="5.5" fill="none" stroke="${INK}" stroke-opacity="0.35"/>
  ${rect(3, 7, 6, 19, INK)}${rect(3, 10, 6, 2, PAPER)}${rect(3, 21, 6, 1, PAPER)}${rect(3, 23, 6, 1, PAPER)}
  ${rect(9, 11, 4, 15, INK)}${rect(9, 12, 3, 14, PAPER)}${rect(9, 15, 3, 1, INK)}${rect(9, 22, 3, 1, INK)}
  ${rect(13, 9, 5, 17, RED)}${rect(13, 12, 5, 2, PAPER)}${rect(13, 22, 5, 1, PAPER)}
  ${rect(18, 4, 4, 22, INK)}${rect(19, 7, 2, 1, PAPER)}${rect(19, 23, 2, 1, PAPER)}
  <g transform="${lean.transform}">
    ${rect(lean.x, lean.y, lean.w, lean.h, INK)}${rect(lean.x, lean.y + 2.5, lean.w, 1.2, RED)}
  </g>
  ${rect(2, 26, 28, 3, INK)}${rect(3, 29, 26, 1, INK, ' fill-opacity="0.18"')}
</svg>`;
}

/**
 * Large icon, drawn like the bookshelf plates: hatched wall, spines filled with
 * fine engraved lines and title bands, a plank shelf with a shadow under it.
 * `square` fills the whole canvas (for iOS, which rounds the corners itself).
 */
function largeIconSvg(size, { square = false } = {}) {
  // 64-unit grid.
  const spines = [
    // x, width, top, kind, bands (y, height)
    { x: 9, w: 9, top: 13, kind: "ink", bands: [[17, 2], [42, 1.2], [45, 1.2]] },
    { x: 18, w: 7, top: 20, kind: "paper", bands: [[24, 1.4], [44, 1.4]] },
    { x: 25, w: 8, top: 17, kind: "red", bands: [[21, 1.6], [40, 4]] },
    { x: 33, w: 6, top: 9, kind: "ink", bands: [[13, 1.4], [46, 1.4]] },
  ];
  const fill = { ink: INK, red: RED, paper: PAPER };
  const hatchFor = { ink: "url(#hInk)", red: "url(#hRed)", paper: "url(#hPaper)" };
  const bandFor = { ink: PAPER, red: PAPER, paper: INK };
  const base = 50;

  const spine = ({ x, w, top, kind, bands }) => {
    const h = base - top;
    const bandRects = bands
      .map(([y, bh]) => `<rect x="${x}" y="${y}" width="${w}" height="${bh}" fill="${bandFor[kind]}" fill-opacity="${kind === "paper" ? 0.85 : 0.92}"/>`)
      .join("");
    return `<g>
      <rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${fill[kind]}"/>
      <rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${hatchFor[kind]}"/>
      ${bandRects}
      <rect x="${x}" y="${top}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="0.6"/>
    </g>`;
  };

  const l = leaning({ against: 39, touchY: 15, shelfY: base, angle: 18, width: 7 });
  const lean = `<g transform="${l.transform}">
      ${rect(l.x, l.y, l.w, l.h, INK)}${rect(l.x, l.y, l.w, l.h, "url(#hInk)")}
      ${rect(l.x, l.y + 4, l.w, 1.6, RED)}
      ${rect(l.x, l.y + l.h - 9, l.w, 1.2, PAPER, ' fill-opacity="0.92"')}
      <rect x="${l.x}" y="${l.y}" width="${l.w}" height="${l.h}" fill="none" stroke="${INK}" stroke-width="0.6"/>
    </g>`;

  const tile = square
    ? `<rect width="64" height="64" fill="${PAPER}"/><rect width="64" height="64" fill="url(#hWall)"/>`
    : `<rect width="64" height="64" rx="12" fill="${PAPER}"/>
       <rect width="64" height="64" rx="12" fill="url(#hWall)"/>
       <rect x="1" y="1" width="62" height="62" rx="11" fill="none" stroke="${INK}" stroke-width="1.2"/>
       <rect x="3.2" y="3.2" width="57.6" height="57.6" rx="9" fill="none" stroke="${INK}" stroke-width="0.4" stroke-opacity="0.7"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs>
    <pattern id="hWall" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
      <rect width="2.2" height="0.35" fill="${INK}" fill-opacity="0.16"/>
    </pattern>
    <pattern id="hInk" width="0.9" height="4" patternUnits="userSpaceOnUse">
      <rect width="0.28" height="4" fill="${PAPER}" fill-opacity="0.22"/>
    </pattern>
    <pattern id="hRed" width="0.9" height="4" patternUnits="userSpaceOnUse">
      <rect width="0.3" height="4" fill="#3a0000" fill-opacity="0.35"/>
    </pattern>
    <pattern id="hPaper" width="1.1" height="4" patternUnits="userSpaceOnUse">
      <rect width="0.3" height="4" fill="${INK}" fill-opacity="0.38"/>
    </pattern>
    <pattern id="hShelf" width="4" height="0.8" patternUnits="userSpaceOnUse">
      <rect width="4" height="0.3" fill="${PAPER}" fill-opacity="0.25"/>
    </pattern>
    <clipPath id="tile"><rect width="64" height="64" rx="${square ? 0 : 12}"/></clipPath>
  </defs>
  ${tile}
  <g clip-path="url(#tile)">
    <!-- shadow on the wall under the shelf -->
    <rect x="6" y="${base + 5}" width="52" height="3" fill="${INK}" fill-opacity="0.18"/>
    ${spines.map(spine).join("")}
    ${lean}
    <!-- shelf plank -->
    <rect x="5" y="${base}" width="54" height="5" fill="${INK}"/>
    <rect x="5" y="${base}" width="54" height="5" fill="url(#hShelf)"/>
    <rect x="5" y="${base}" width="54" height="1" fill="${PAPER}" fill-opacity="0.18"/>
  </g>
</svg>`;
}

/* --------------------------------------------------------------- og image */

async function dataUrl(file, type) {
  return `data:${type};base64,${(await readFile(file)).toString("base64")}`;
}

async function ogHtml() {
  const plate = await dataUrl(path.join(PUBLIC, "images/bookshelf-scenes/sky-day.avif"), "image/avif");
  const serif = await dataUrl(path.join(PUBLIC, "fonts/SourceSerif4-latin.woff2"), "font/woff2");
  const mono = await dataUrl(path.join(PUBLIC, "fonts/JetBrainsMono-latin.woff2"), "font/woff2");

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: "Source Serif 4"; font-weight: 400 700; src: url(${serif}) format("woff2"); }
  @font-face { font-family: "JetBrains Mono"; font-weight: 500; src: url(${mono}) format("woff2"); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; background: ${PAPER}; overflow: hidden; }
  body { position: relative; color: ${INK}; font-family: "JetBrains Mono", monospace; }

  /* Bookplate border: a heavy rule with a hairline just inside it. */
  .plate {
    position: absolute; inset: 16px;
    border: 2px solid ${INK};
    display: flex; flex-direction: column;
    overflow: hidden;
  }
  .plate::after {
    content: ""; position: absolute; inset: 5px;
    border: 0.75px solid rgba(42, 37, 33, 0.55);
    pointer-events: none; z-index: 3;
  }

  /* The same diagonal wall hatching the homepage plates use. */
  .wall {
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(-32deg, rgba(42, 37, 33, 0.11) 0 0.7px, transparent 0.7px 2.7px);
  }

  header {
    position: relative; z-index: 2;
    padding: 30px 44px 0 46px;
    display: flex; align-items: flex-end; justify-content: space-between;
  }
  .kicker {
    display: flex; align-items: center; gap: 14px;
    color: ${RED}; font-size: 17px; letter-spacing: 0.34em; text-transform: uppercase;
  }
  .kicker::after { content: ""; width: 74px; height: 1.5px; background: ${RED}; }
  h1 {
    margin-top: 10px;
    font-family: "Source Serif 4", serif; font-weight: 600;
    font-size: 78px; line-height: 0.95; letter-spacing: -0.01em;
  }
  .sub { margin-top: 12px; font-size: 19px; color: #555048; }
  .sub b { color: ${RED}; font-weight: 500; }

  .shelves {
    position: relative; flex: 1; min-height: 0;
    margin-top: -6px;
  }
  .shelves img {
    position: absolute; left: 50%; bottom: -2px;
    width: 1190px; transform: translateX(-50%);
  }

  footer {
    position: relative; z-index: 2;
    height: 50px; flex: none;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 30px 0 32px;
    background: ${BAND}; border-top: 1px solid #c9c7b0;
    font-size: 17px; color: #666;
  }
  footer .num { color: ${RED}; font-weight: 700; margin-right: 12px; }
  footer .url { color: ${INK}; }
</style></head><body>
  <div class="plate">
    <div class="wall"></div>
    <header>
      <div>
        <div class="kicker">Ex Libris</div>
        <h1>Lucas Dickey</h1>
        <div class="sub">product leader <b>·</b> serial founder <b>·</b> reader</div>
      </div>
    </header>
    <div class="shelves"><img src="${plate}" alt=""></div>
    <footer>
      <span><span class="num">Plate I</span>Six bookcases, drawn from the real shelves</span>
      <span class="url">lucasdickey.com</span>
    </footer>
  </div>
</body></html>`;
}

/* ------------------------------------------------------------------- ico */

/** An .ico holding PNG images, which every current browser reads. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = header.length + dir.length;
  images.forEach(({ size, png }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt16LE(1, o + 4); // color planes
    dir.writeUInt16LE(32, o + 6); // bits per pixel
    dir.writeUInt32LE(png.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += png.length;
  });
  return Buffer.concat([header, dir, ...images.map((im) => im.png)]);
}

/* ------------------------------------------------------------------ main */

async function shoot(page, html, width, height) {
  await page.setViewportSize({ width, height });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((im) => im.decode().catch(() => {})));
  });
  return page.screenshot({ clip: { x: 0, y: 0, width, height }, omitBackground: true });
}

const svgPage = (svg) => `<!doctype html><html><body style="margin:0;background:transparent">${svg}</body></html>`;

async function main() {
  const outFlag = process.argv.indexOf("--out");
  const outDir = outFlag > -1 ? path.resolve(process.argv[outFlag + 1]) : PUBLIC;
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const files = {};

  // 128 colors keeps every engraved line but brings the file from ~680 KB to
  // ~130 KB, under the ~300 KB past which WhatsApp drops link previews.
  files["og-image.png"] = await sharp(await shoot(page, await ogHtml(), 1200, 630))
    .png({ palette: true, colors: 128, quality: 100, effort: 10, compressionLevel: 9 })
    .toBuffer();

  const small = {
    16: await shoot(page, svgPage(icon16Svg(16)), 16, 16),
    32: await shoot(page, svgPage(icon32Svg(32)), 32, 32),
    48: await shoot(page, svgPage(icon16Svg(48)), 48, 48),
  };
  files["favicon-16x16.png"] = small[16];
  files["favicon-32x32.png"] = small[32];
  files["favicon.ico"] = ico([16, 32, 48].map((size) => ({ size, png: small[size] })));

  files["apple-touch-icon.png"] = await shoot(page, svgPage(largeIconSvg(180, { square: true })), 180, 180);
  files["android-chrome-192x192.png"] = await shoot(page, svgPage(largeIconSvg(192)), 192, 192);
  files["android-chrome-512x512.png"] = await shoot(page, svgPage(largeIconSvg(512)), 512, 512);
  files["favicon.png"] = files["android-chrome-512x512.png"];

  for (const [name, buf] of Object.entries(files)) {
    await writeFile(path.join(outDir, name), buf);
    console.log(`${name.padEnd(28)} ${(buf.length / 1024).toFixed(1).padStart(7)} KB`);
  }

  if (outDir !== PUBLIC) {
    // A contact sheet: each icon at its real size and enlarged, on light and dark tabs.
    const img = (name, px, pixelated) =>
      `<img src="data:image/png;base64,${files[name].toString("base64")}" width="${px}" height="${px}" style="${pixelated ? "image-rendering:pixelated;" : ""}margin:8px;vertical-align:middle">`;
    const row = (bg) => `<div style="background:${bg};padding:10px">
      ${img("favicon-16x16.png", 16)} ${img("favicon-32x32.png", 32)} ${img("favicon-16x16.png", 96, true)} ${img("favicon-32x32.png", 96, true)}
      ${img("android-chrome-192x192.png", 32)} ${img("apple-touch-icon.png", 180)} ${img("android-chrome-512x512.png", 256)}
    </div>`;
    const sheet = `<!doctype html><html><body style="margin:0">${row("#ffffff")}${row("#202124")}${row("#dee1e6")}</body></html>`;
    await page.setViewportSize({ width: 900, height: 900 });
    await page.setContent(sheet);
    await writeFile(path.join(outDir, "preview.png"), await page.screenshot({ fullPage: true }));
    console.log("preview.png");
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
