#!/usr/bin/env node
/**
 * Renders the syllabus film.
 *
 *   node render.mjs                       # all three crops to out/
 *   node render.mjs square vertical       # only the named crops
 *   node render.mjs --still 900,1200      # PNGs at those frames, for checking
 *   node render.mjs --range 600-660 square  # a short clip, for iterating
 *
 * The bundle is built once and reused across crops, which is most of the
 * wall-clock saving when rendering all three.
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "out");

const CROPS = {
  square: { id: "SyllabusFilmSquare", file: "syllabus-square-v2.mp4" },
  vertical: { id: "SyllabusFilmVertical", file: "syllabus-vertical-v2.mp4" },
  wide: { id: "SyllabusFilmWide", file: "syllabus-wide-v2.mp4" },
};

/**
 * Chromium is preinstalled in this container; without this Remotion tries to
 * download its own copy, which the egress proxy blocks.
 */
const BROWSER_CANDIDATES = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  // Remotion drives old-headless, which the full Chrome binary no longer has;
  // chrome-headless-shell is the standalone implementation of it.
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
];

const browserExecutable =
  BROWSER_CANDIDATES.find((p) => p && fs.existsSync(p)) ?? null;

const args = process.argv.slice(2);
const stillIndex = args.indexOf("--still");
const stillFrames =
  stillIndex >= 0
    ? String(args[stillIndex + 1] ?? "900")
        .split(",")
        .map((f) => Number(f.trim()))
    : null;
const rangeIndex = args.indexOf("--range");
const frameRange =
  rangeIndex >= 0
    ? String(args[rangeIndex + 1])
        .split("-")
        .map(Number)
    : null;
const named = args.filter((a) => Object.keys(CROPS).includes(a));
const crops = named.length ? named : Object.keys(CROPS);

fs.mkdirSync(OUT, { recursive: true });

console.log(
  browserExecutable
    ? `browser: ${browserExecutable}`
    : "browser: Remotion default"
);
console.log("bundling…");

const serveUrl = await bundle({
  entryPoint: path.join(HERE, "src", "index.ts"),
  publicDir: path.join(HERE, "..", "public"),
  onProgress: (p) => {
    if (p % 25 === 0) console.log(`  bundle ${p}%`);
  },
});

const chromiumOptions = { gl: "swangle" };
const CONCURRENCY = Math.max(2, Math.min(8, os.cpus().length - 1));

if (stillFrames) {
  const composition = await selectComposition({
    serveUrl,
    id: CROPS[crops[0]].id,
    browserExecutable,
    chromiumOptions,
  });
  for (const frame of stillFrames) {
    const output = path.join(OUT, `still-${crops[0]}-${String(frame).padStart(4, "0")}.png`);
    await renderStill({
      composition,
      serveUrl,
      output,
      frame,
      browserExecutable,
      chromiumOptions,
      imageFormat: "png",
    });
    console.log(`wrote ${output}`);
  }
  process.exit(0);
}

for (const crop of crops) {
  const { id, file } = CROPS[crop];
  const composition = await selectComposition({
    serveUrl,
    id,
    browserExecutable,
    chromiumOptions,
  });
  const outputLocation = path.join(OUT, file);
  let last = -1;

  console.log(`rendering ${id} -> ${file}`);
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    // renderMedia writes to `outputLocation`; `output` is renderStill's key and
    // is silently ignored here, which looks like a successful render that
    // produced no file.
    outputLocation,
    frameRange,
    browserExecutable,
    chromiumOptions,
    crf: 21,
    // x264 defaults leave visible banding on the dark radial backdrop.
    x264Preset: "slow",
    // Without these two, jpeg frames encode as full-range yuvj420p tagged
    // bt470bg — PAL colorimetry on an HD file. Platforms that re-encode it
    // shift the cover colours. bt709 limited range is what they expect.
    pixelFormat: "yuv420p",
    colorSpace: "bt709",
    concurrency: CONCURRENCY,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 100);
      if (pct >= last + 10) {
        last = pct;
        console.log(`  ${pct}%`);
      }
    },
  });
  const { size } = fs.statSync(outputLocation);
  console.log(`wrote ${outputLocation} (${(size / 1024 / 1024).toFixed(1)} MB)`);
}
