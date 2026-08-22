import {
  BOOK_H,
  BOOK_W,
  GRAPH_BOOKS,
  GRAPH_PARTS,
} from "../../app/lib/syllabusGraph";
import { partColor } from "./theme";

/**
 * The syllabus drawn as a knowledge graph: the guiding question at the centre,
 * the seven parts as supernodes on a ring around it, and every reading hung off
 * its part in a fan.
 *
 * Node positions come from app/lib/syllabusGraph, the same module the
 * interactive graph on /syllabus lays out from, so the site and the film place
 * a book in the same spot. What lives here is what is specific to the film:
 * when each node arrives, the dark-surface palette, and how the camera tours
 * the parts. Coordinates are design units — a 1080x1080 square centred on
 * (0, 0) — which the camera scales to whatever the composition is.
 */

export { BOOK_H, BOOK_W };

export interface PartNode {
  id: string;
  label: string;
  title: string;
  summary: string;
  angle: number;
  x: number;
  y: number;
  accent: string;
  deep: string;
  bookCount: number;
  appearAt: number;
  index: number;
}

export interface BookNode {
  slug: string;
  title: string;
  author: string;
  note?: string;
  coverUrl: string;
  status: string;
  partId: string;
  partTitle: string;
  x: number;
  y: number;
  parentX: number;
  parentY: number;
  accent: string;
  appearAt: number;
  index: number;
}

/**
 * Graph-local frame numbers, at 30fps.
 *
 * The fan-out is deliberately near-instant: the books arrive roughly one frame
 * apart, so the graph assembles as a burst rather than a queue. Each cover
 * still has its own spring, so the cascade reads over about a second even
 * though the last book is triggered 23 frames after the first.
 */
export const T = {
  centerIn: 0,
  superStart: 34,
  superStep: 20,
  bookStart: 190,
  bookStep: 1.05,
  settleAt: 250,
  /**
   * How long a part's label stays lit after its node appears. It fades back
   * out well before the tour, so a part is "mentioned" once as the ring
   * forms and then goes quiet — the label's only other job is naming the
   * part again when the tour actually visits it (via the part card).
   */
  labelHold: 46,
  labelFade: 20,
  /** The camera visits every part in turn, framed on that part's own fan. */
  tourStart: 262,
  // Under 2s per part end to end: ~0.6s travelling in, ~1.15s holding.
  tourPerPart: 53,
  tourTravel: 18,
};

export const TOUR_END = T.tourStart + GRAPH_PARTS.length * T.tourPerPart;

/**
 * 1 while a part's label is freshly mentioned, ramping to 0 over labelFade
 * frames once labelHold has elapsed since the part's own node appeared.
 * Node-local rather than global, so each part's label clock starts when that
 * part actually appears rather than all fading on one shared timer.
 */
export const partLabelOpacity = (appearAt: number, frame: number): number => {
  const since = frame - appearAt;
  if (since < T.labelHold) return 1;
  const t = (since - T.labelHold) / T.labelFade;
  return Math.max(0, 1 - t);
};

const build = () => {
  const parts: PartNode[] = GRAPH_PARTS.map((part, i) => {
    const { accent, deep } = partColor(part.id);
    return {
      id: part.id,
      label: part.label,
      title: part.title,
      summary: part.summary,
      angle: part.angle,
      x: part.x,
      y: part.y,
      accent,
      deep,
      bookCount: part.bookCount,
      appearAt: T.superStart + i * T.superStep,
      index: i,
    };
  });

  const books: BookNode[] = GRAPH_BOOKS.map((book) => ({
    slug: book.slug,
    title: book.title,
    author: book.author,
    note: book.note,
    coverUrl: book.coverUrl,
    status: book.status,
    partId: book.partId,
    partTitle: book.partTitle,
    x: book.x,
    y: book.y,
    parentX: book.parentX,
    parentY: book.parentY,
    accent: partColor(book.partId).accent,
    appearAt: T.bookStart + book.index * T.bookStep,
    index: book.index,
  }));

  return { parts, books };
};

export const { parts: PART_NODES, books: BOOK_NODES } = build();

export const bookBySlug = (slug: string) => {
  const found = BOOK_NODES.find((b) => b.slug === slug);
  if (!found) throw new Error(`No syllabus reading with slug "${slug}"`);
  return found;
};

/** How much of the design square the camera may fill when framing one part. */
const FRAME_HALF_W = 470;
/** Shorter than the width: the lower third carries the part's card. */
const FRAME_HALF_H = 372;

export interface PartFraming {
  id: string;
  x: number;
  y: number;
  scale: number;
}

/**
 * Where the camera sits to hold one part in frame — the centre and scale of a
 * box drawn around that part's node and every cover hanging off it. Computed
 * rather than hand-tuned, so a part gaining a reading reframes itself.
 */
export const PART_FRAMINGS: PartFraming[] = PART_NODES.map((part) => {
  const own = BOOK_NODES.filter((b) => b.partId === part.id);
  const xs: number[] = [part.x - 64, part.x + 64];
  const ys: number[] = [part.y - 64, part.y + 64];
  for (const book of own) {
    xs.push(book.x - BOOK_W / 2, book.x + BOOK_W / 2);
    ys.push(book.y - BOOK_H / 2, book.y + BOOK_H / 2);
  }

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const halfW = Math.max(1, (maxX - minX) / 2);
  const halfH = Math.max(1, (maxY - minY) / 2);

  return {
    id: part.id,
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
    scale: Math.min(2.35, Math.max(0.9, Math.min(FRAME_HALF_W / halfW, FRAME_HALF_H / halfH))),
  };
});

/** The part the tour is on at this frame, or null outside the tour. */
export const tourPartAt = (frame: number): PartNode | null => {
  if (frame < T.tourStart || frame >= TOUR_END) return null;
  const index = Math.floor((frame - T.tourStart) / T.tourPerPart);
  return PART_NODES[index] ?? null;
};

/**
 * 1 when a part is the subject, dropping to a floor when another part is.
 * Eased across the segment boundary so the spotlight slides between parts
 * rather than snapping.
 */
export const partSpotlight = (partId: string, frame: number): number => {
  if (frame < T.tourStart - 12 || frame >= TOUR_END + 30) return 1;

  const index = PART_NODES.findIndex((p) => p.id === partId);
  if (index < 0) return 1;

  const segmentStart = T.tourStart + index * T.tourPerPart;
  const segmentEnd = segmentStart + T.tourPerPart;
  const FADE = 14;
  const FLOOR = 0.16;

  if (frame >= segmentStart && frame < segmentEnd) return 1;

  const distance =
    frame < segmentStart ? segmentStart - frame : frame - segmentEnd;
  if (distance >= FADE) return FLOOR;
  return FLOOR + (1 - FLOOR) * (1 - distance / FADE);
};
