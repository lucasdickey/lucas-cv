import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

/**
 * The film reuses the palette that scripts/generate_syllabus_covers.py paints
 * the placeholder covers with, so a book's node on the graph is the same colour
 * as its cover on the syllabus page. Each syllabus part is a supernode.
 */
export const PART_COLORS: Record<string, { deep: string; accent: string }> = {
  "civilization-history": { deep: "#6B1D1D", accent: "#E8B4A0" },
  "media-cognition": { deep: "#14494F", accent: "#8FD4CE" },
  "economics-institutions": { deep: "#1E4433", accent: "#9DD5A8" },
  "networks-states-power": { deep: "#262A55", accent: "#A9B0EE" },
  "ai-futures": { deep: "#1B2027", accent: "#7FD1E8" },
  "ethics-society-governance": { deep: "#3A2450", accent: "#CBA6E8" },
  "information-civilization": { deep: "#5A3417", accent: "#E8C79A" },
};

export const FALLBACK_ACCENT = "#D8DEE9";

/** The film's own accent, borrowed from the AI Futures part. */
export const ACCENT = "#7FD1E8";

export const partColor = (partId: string) =>
  PART_COLORS[partId] ?? { deep: "#2A2F3A", accent: FALLBACK_ACCENT };

export const BG = "#080A0F";
export const BG_LIFT = "#11151F";
export const INK = "#FFFFFF";
export const INK_DIM = "rgba(255,255,255,0.62)";
export const INK_FAINT = "rgba(255,255,255,0.32)";

export const SERIF = "'Source Serif 4', Georgia, 'Bitstream Charter', serif";
export const SANS = "Inter, 'Liberation Sans', Helvetica, Arial, sans-serif";
export const MONO =
  "'JetBrains Mono', ui-monospace, 'DejaVu Sans Mono', monospace";

const FACES: [string, string, string][] = [
  ["Source Serif 4", "fonts/SourceSerif4-latin.woff2", "400 700"],
  ["Inter", "fonts/Inter-latin.woff2", "400 700"],
  ["JetBrains Mono", "fonts/JetBrainsMono-latin.woff2", "500"],
];

/**
 * Registers the vendored webfonts and holds the render until they are ready.
 * Loading them through the FontFace API rather than a <link> avoids the race
 * where document.fonts.load() runs before the stylesheet has been parsed.
 */
export const useFilmFonts = () => {
  const [handle] = useState(() => delayRender("Loading syllabus film fonts"));

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      FACES.map(async ([family, path, weight]) => {
        const face = new FontFace(family, `url(${staticFile(path)})`, {
          weight,
          style: "normal",
        });
        await face.load();
        document.fonts.add(face);
      })
    )
      .then(() => document.fonts.ready)
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) {
          continueRender(handle);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [handle]);
};
