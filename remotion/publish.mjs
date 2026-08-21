#!/usr/bin/env node
/**
 * Copies the rendered MP4s from out/ into the site's public/video/, which is
 * where they are served from.
 *
 * out/ is a build directory and gitignored; public/video/ is the published
 * copy and is committed. Keeping the copy behind a script rather than
 * rendering straight into public/ means a half-finished or experimental
 * render never lands on the site by accident.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "out");
const PUBLISHED = path.join(HERE, "..", "public", "video");

const renders = fs.existsSync(OUT)
  ? fs.readdirSync(OUT).filter((f) => f.endsWith(".mp4"))
  : [];

if (renders.length === 0) {
  console.error(`No MP4s in ${OUT}. Run \`npm run render\` first.`);
  process.exit(1);
}

fs.mkdirSync(PUBLISHED, { recursive: true });
for (const file of renders) {
  const to = path.join(PUBLISHED, file);
  fs.copyFileSync(path.join(OUT, file), to);
  const { size } = fs.statSync(to);
  console.log(`${file} -> public/video/ (${(size / 1024 / 1024).toFixed(1)} MB)`);
}
