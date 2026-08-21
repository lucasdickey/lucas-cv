/**
 * The syllabus drawn as a knowledge graph.
 *
 * The guiding question sits at the centre, the seven parts ring it as
 * supernodes, and every reading hangs off its part in a fan. This module owns
 * the geometry and is the single source of truth for it: both the interactive
 * graph on /syllabus and the Remotion film in /remotion lay out from these
 * numbers, so the site and the video agree on where a book sits.
 *
 * Coordinates are in design units — a square centred on (0, 0). Consumers scale
 * them to whatever viewport or composition they render into.
 */

import { syllabusParts, type SyllabusStatus } from "../data/syllabus";

const RING_RADIUS = 340;
/** Distance from a supernode out to the books hanging off it. */
const BOOK_DISTANCE = 200;
/** Degrees between adjacent books in a part's fan. */
const BOOK_SPREAD = 28;
/** Every other book is pushed further out so neighbouring covers never touch. */
const BOOK_STAGGER = 140;

export const BOOK_W = 96;
export const BOOK_H = 144;

/**
 * These five constants were solved for rather than eyeballed: they are the
 * largest cover size and tightest graph for which no two axis-aligned covers
 * overlap, across all seven fans. A part gaining a sixth reading changes the
 * densest fan and means re-solving them — `assertNoOverlaps()` below is the
 * check that catches it.
 */

/**
 * Categorical palette for the seven parts, on light surfaces.
 *
 * Taken in documented order from the data-viz reference palette rather than
 * hand-picked. Seven hand-rolled hues cannot be made colourblind-safe across
 * every pair — with all 21 pairs in play no ordering clears the floors — so
 * colour here is a supporting cue, never the identity channel: every part node
 * carries a visible text label, its readings cluster around it, and the list
 * view and /syllabus.md carry the same structure without colour at all.
 *
 * Validated on the ring-adjacent pairlist (including the wrap from Part VII
 * back to Part I) against the darker of the site's two surfaces, #f0f0e0:
 * lightness, chroma and normal-vision floors all pass, worst adjacent CVD
 * ΔE 9.1 (target 8). Four hues sit below 3:1 contrast, which is why each node
 * is drawn with a darker ring as well as a fill.
 */
export const PART_COLORS: Record<string, string> = {
  "civilization-history": "#2a78d6",
  "media-cognition": "#eb6834",
  "economics-institutions": "#1baf7a",
  "networks-states-power": "#eda100",
  "ai-futures": "#e87ba4",
  "ethics-society-governance": "#4a3aa7",
  "information-civilization": "#e34948",
};

export const FALLBACK_COLOR = "#6B778C";

export const partColor = (partId: string) =>
  PART_COLORS[partId] ?? FALLBACK_COLOR;

export interface GraphPart {
  id: string;
  label: string;
  title: string;
  summary: string;
  /** Degrees, measured from the positive x-axis. */
  angle: number;
  x: number;
  y: number;
  color: string;
  bookCount: number;
  index: number;
}

export interface GraphBook {
  slug: string;
  title: string;
  author: string;
  note?: string;
  coverUrl: string;
  href?: string;
  status: SyllabusStatus;
  orderIndex?: number;
  partId: string;
  partLabel: string;
  partTitle: string;
  x: number;
  y: number;
  parentX: number;
  parentY: number;
  color: string;
  /** Position among all readings, reading parts in order. */
  index: number;
  /** Position within its own part's fan. */
  indexInPart: number;
}

const rad = (deg: number) => (deg * Math.PI) / 180;

const build = () => {
  const parts: GraphPart[] = [];
  const books: GraphBook[] = [];
  let bookIndex = 0;

  syllabusParts.forEach((part, i) => {
    // Start at the top and go clockwise, so Part I reads first.
    const angle = -90 + (i * 360) / syllabusParts.length;
    const color = partColor(part.id);
    const x = RING_RADIUS * Math.cos(rad(angle));
    const y = RING_RADIUS * Math.sin(rad(angle));

    parts.push({
      id: part.id,
      label: part.label,
      title: part.title,
      summary: part.summary,
      angle,
      x,
      y,
      color,
      bookCount: part.readings.length,
      index: i,
    });

    const n = part.readings.length;
    part.readings.forEach((reading, j) => {
      const offset = (j - (n - 1) / 2) * BOOK_SPREAD;
      const distance = BOOK_DISTANCE + (j % 2 === 1 ? BOOK_STAGGER : 0);
      const theta = rad(angle + offset);

      books.push({
        slug: reading.slug,
        title: reading.title,
        author: reading.author,
        note: reading.note,
        coverUrl: reading.coverUrl ?? "",
        href: reading.amazonUrl || reading.url,
        status: reading.status,
        orderIndex: reading.orderIndex,
        partId: part.id,
        partLabel: part.label,
        partTitle: part.title,
        x: x + distance * Math.cos(theta),
        y: y + distance * Math.sin(theta),
        parentX: x,
        parentY: y,
        color,
        index: bookIndex,
        indexInPart: j,
      });
      bookIndex += 1;
    });
  });

  return { parts, books };
};

export const { parts: GRAPH_PARTS, books: GRAPH_BOOKS } = build();

/** Half-width of the square the whole graph fits inside, covers included. */
export const GRAPH_EXTENT =
  Math.max(...GRAPH_BOOKS.map((b) => Math.hypot(b.x, b.y))) +
  Math.hypot(BOOK_W, BOOK_H) / 2;

/**
 * Every pair of covers that overlaps, as axis-aligned boxes with a small
 * margin. Should always be empty; used by the layout test so a new reading
 * cannot silently produce a graph with covers stacked on top of each other.
 */
export const findCoverOverlaps = (margin = 12): [string, string][] => {
  const clashes: [string, string][] = [];
  for (let i = 0; i < GRAPH_BOOKS.length; i += 1) {
    for (let j = i + 1; j < GRAPH_BOOKS.length; j += 1) {
      const a = GRAPH_BOOKS[i];
      const b = GRAPH_BOOKS[j];
      if (
        Math.abs(a.x - b.x) < BOOK_W + margin &&
        Math.abs(a.y - b.y) < BOOK_H + margin
      ) {
        clashes.push([a.slug, b.slug]);
      }
    }
  }
  return clashes;
};
