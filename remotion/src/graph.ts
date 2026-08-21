import { syllabusParts } from "../../app/data/syllabus";
import { partColor } from "./theme";

/**
 * The syllabus drawn as a knowledge graph: the guiding question at the centre,
 * the seven parts as supernodes on a ring around it, and every reading hung off
 * its part in a fan. All coordinates are in "design units" — a 1080x1080 square
 * centred on (0, 0) — and the camera scales them to whatever the composition is.
 */

const RING_RADIUS = 340;
/** Distance from a supernode out to the books hanging off it. */
const BOOK_DISTANCE = 200;
/** Degrees between adjacent books in a part's fan. */
const BOOK_SPREAD = 28;
/**
 * Every other book is pushed further out so neighbouring covers never touch.
 * These four constants were solved for rather than eyeballed: they are the
 * largest cover size and tightest graph for which no two axis-aligned covers
 * overlap, across all seven fans. Changing the syllabus's shape (a part gaining
 * a sixth reading, say) means re-solving them.
 */
const BOOK_STAGGER = 140;

export const BOOK_W = 96;
export const BOOK_H = 144;

const rad = (deg: number) => (deg * Math.PI) / 180;

export interface PartNode {
  id: string;
  label: string;
  title: string;
  angle: number;
  x: number;
  y: number;
  accent: string;
  deep: string;
  bookCount: number;
  appearAt: number;
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

/** Graph-local frame numbers, at 30fps. */
export const T = {
  centerIn: 0,
  superStart: 46,
  superStep: 26,
  bookStart: 214,
  bookStep: 21,
  wideAt: 700,
  focusAIn: 790,
  focusAOut: 855,
  focusBIn: 900,
  focusBOut: 990,
  pullBack: 1050,
};

const build = () => {
  const parts: PartNode[] = [];
  const books: BookNode[] = [];
  let bookIndex = 0;

  syllabusParts.forEach((part, i) => {
    // Start at the top and go clockwise, so Part I reads first.
    const angle = -90 + (i * 360) / syllabusParts.length;
    const { accent, deep } = partColor(part.id);
    const x = RING_RADIUS * Math.cos(rad(angle));
    const y = RING_RADIUS * Math.sin(rad(angle));

    parts.push({
      id: part.id,
      label: part.label,
      title: part.title,
      angle,
      x,
      y,
      accent,
      deep,
      bookCount: part.readings.length,
      appearAt: T.superStart + i * T.superStep,
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
        status: reading.status,
        partId: part.id,
        partTitle: part.title,
        x: x + distance * Math.cos(theta),
        y: y + distance * Math.sin(theta),
        parentX: x,
        parentY: y,
        accent,
        appearAt: T.bookStart + bookIndex * T.bookStep,
        index: bookIndex,
      });
      bookIndex += 1;
    });
  });

  return { parts, books };
};

export const { parts: PART_NODES, books: BOOK_NODES } = build();

export const bookBySlug = (slug: string) => {
  const found = BOOK_NODES.find((b) => b.slug === slug);
  if (!found) {
    throw new Error(`No syllabus reading with slug "${slug}"`);
  }
  return found;
};

/**
 * The two readings the camera dives into mid-build. Both carry a framing note
 * that lands on its own, which is what makes them worth stopping on.
 */
export const FOCUS_SLUGS = [
  "amusing-ourselves-to-death",
  "the-square-and-the-tower",
];

/** Frame the last book settles on the graph, plus a beat. */
export const BUILD_ENDS =
  T.bookStart + (BOOK_NODES.length - 1) * T.bookStep + 40;

/**
 * The part whose books are landing at this frame, plus the window it holds the
 * caption for, so consecutive parts cross-fade instead of snapping over.
 */
export const partCaptionAt = (frame: number) => {
  const changes: { part: PartNode; at: number }[] = [];
  PART_NODES.forEach((part) => {
    const firstBook = BOOK_NODES.find((b) => b.partId === part.id);
    changes.push({ part, at: Math.min(part.appearAt, firstBook?.appearAt ?? Infinity) });
  });
  changes.sort((a, b) => a.at - b.at);

  for (let i = changes.length - 1; i >= 0; i -= 1) {
    if (frame >= changes[i].at) {
      return {
        part: changes[i].part,
        since: changes[i].at,
        until: changes[i + 1]?.at ?? Infinity,
      };
    }
  }
  return null;
};
