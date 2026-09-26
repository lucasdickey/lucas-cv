#!/usr/bin/env node
/**
 * Screenshots each "The Last 90 Days" project from its live site and writes
 * the 800×500 WebP thumbnails that app/data/shipLog.ts points at, in
 * public/images/ship-log/.
 *
 * Meant to run on your own machine, not in CI. One-time setup (the --no-save
 * keeps package.json and the lockfile unchanged; sharp already comes with Next):
 *
 *   npm i --no-save playwright
 *   npx playwright install chromium
 *
 * Then:
 *
 *   node scripts/ship-log-thumbnails.mjs                  # every project
 *   node scripts/ship-log-thumbnails.mjs pinata zingers   # just these
 *   node scripts/ship-log-thumbnails.mjs --headed         # watch it work
 *   node scripts/ship-log-thumbnails.mjs --keep-png       # also save full-size PNGs
 *
 * Look at the results before committing: a page that was mid-load or showing
 * a sign-in screen makes a bad thumbnail. Projects without a live site (Breathe
 * Free, simple-survey) are not listed here; their images are made by hand.
 */

import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public/images/ship-log");
const PNG_DIR = path.join(os.tmpdir(), "ship-log-screens");

// 1280×800 is the thumbnail's 16:10 shape, captured at 2× so text survives
// the shrink to 800×500.
const VIEWPORT = { width: 1280, height: 800 };
const THUMB = { width: 800, height: 500 };

/**
 * One entry per thumbnail. `file` must match the thumbnail src in shipLog.ts.
 *   wait      extra time after load, for animations, 3D scenes and canvases
 *   scrollTo  text on the page to bring to the top before the screenshot
 */
const TARGETS = [
  {
    name: "pinata",
    file: "pinata.webp",
    url: "https://yourpinata.dev",
    scrollTo: "See what a marked-up capture looks like",
  },
  {
    name: "real-books",
    file: "real-books.webp",
    url: "https://www.lucasdickey.com/real-books",
    wait: 8000,
  },
  { name: "zingers", file: "one-off-zingers.webp", url: "https://zingers.dev" },
  {
    name: "downstream",
    file: "downstream.webp",
    url: "https://www.downstream.sh/daily/",
  },
  {
    name: "a-ok-shop",
    file: "a-ok-shop.webp",
    url: "https://a-ok-shop.vercel.app",
  },
  {
    name: "cross-cross-footy",
    file: "cross-cross-footy.webp",
    url: "https://2dads2dudes.dev/footy",
    wait: 6000,
  },
];

const args = process.argv.slice(2);
const headed = args.includes("--headed");
const keepPng = args.includes("--keep-png");
const only = args.filter((a) => !a.startsWith("--"));

const unknown = only.filter((n) => !TARGETS.some((t) => t.name === n));
if (unknown.length) {
  console.error(`Unknown project: ${unknown.join(", ")}`);
  console.error(`Choose from: ${TARGETS.map((t) => t.name).join(", ")}`);
  process.exit(1);
}
const targets = only.length
  ? TARGETS.filter((t) => only.includes(t.name))
  : TARGETS;

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright is not installed. Run:\n");
  console.error("  npm i --no-save playwright");
  console.error("  npx playwright install chromium\n");
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });
if (keepPng) await mkdir(PNG_DIR, { recursive: true });

const browser = await chromium.launch({ headless: !headed });
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  colorScheme: "light",
  reducedMotion: "no-preference",
});

let failed = 0;
for (const target of targets) {
  const page = await context.newPage();
  try {
    // networkidle can hang on pages that poll; fall through after the timeout.
    await page
      .goto(target.url, { waitUntil: "networkidle", timeout: 45_000 })
      .catch(() => page.waitForLoadState("load"));

    if (target.scrollTo) {
      const anchor = page.getByText(target.scrollTo, { exact: false }).first();
      if (await anchor.count()) {
        await anchor.evaluate((el) => el.scrollIntoView({ block: "start" }));
        await page.mouse.wheel(0, -40); // a little breathing room above the heading
      } else {
        console.warn(
          `  ${target.name}: "${target.scrollTo}" not found, using the top of the page`,
        );
      }
    }

    await page.waitForTimeout(target.wait ?? 3000);
    const png = await page.screenshot({ type: "png" });

    if (keepPng)
      await sharp(png).toFile(path.join(PNG_DIR, `${target.name}.png`));
    const out = path.join(OUT_DIR, target.file);
    const info = await sharp(png)
      .resize(THUMB.width, THUMB.height, { fit: "cover", position: "top" })
      .webp({ quality: 82 })
      .toFile(out);
    console.log(
      `✓ ${target.name.padEnd(18)} ${(info.size / 1024).toFixed(0).padStart(4)} KB  ${path.relative(ROOT, out)}`,
    );
  } catch (err) {
    failed++;
    console.error(`✗ ${target.name}: ${err.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
if (keepPng) console.log(`\nFull-size screenshots: ${PNG_DIR}`);
console.log("\nReview the images, then commit the ones you want to keep.");
process.exit(failed ? 1 : 0);
