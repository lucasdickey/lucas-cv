import { getSyllabusStats, syllabus } from "../../app/data/syllabus";
import { BOOK_NODES, PART_NODES, bookBySlug } from "./graph";
import type { Step } from "./scenes/Progression";

/**
 * All on-screen copy is derived from app/data/syllabus.ts so the film cannot
 * drift from the page it is advertising. Each derivation falls back to
 * something sane if the source prose is later reworded.
 */

/** The guiding question, split into premise / question / turn for typesetting. */
export const guidingBeats = () => {
  const q = syllabus.guidingQuestion;
  const match = q.match(/^(.*?), (which .*?) — and (.*)$/);
  if (!match) {
    return { premise: q, hold: "", turn: "" };
  }
  const [, premise, hold, turn] = match;
  return {
    premise: `${premise} —`,
    hold: `${hold}?`,
    turn: `and ${turn}`,
  };
};

/** "Electricity democratized energy." -> subject / verb / object. */
export const progressionSteps = (): Step[] =>
  syllabus.missingBook.progression.map((line) => {
    const match = line.match(/^(.+?) (may democratize|democratized) (.+)\.$/);
    if (!match) {
      return { subject: line, verb: "", object: "" };
    }
    return { subject: match[1], verb: match[2], object: match[3] };
  });

/**
 * Three closing questions. The short, rhythmic ones read at video pace; the
 * longer ones in the syllabus do not.
 */
const PREFERRED_QUESTIONS = [
  "What becomes scarce once intelligence is abundant?",
  "Does AI strengthen states or networks?",
  "Does it concentrate power or decentralize it?",
];

export const closingQuestions = () => {
  const chosen = PREFERRED_QUESTIONS.filter((q) =>
    syllabus.centralQuestions.includes(q)
  );
  return chosen.length === 3 ? chosen : syllabus.centralQuestions.slice(0, 3);
};

export const centerQuestion = () => syllabus.missingBook.question;

export const outroStats = () => {
  const stats = getSyllabusStats();
  return [
    { label: "Readings", value: String(BOOK_NODES.length || stats.total) },
    { label: "Parts", value: String(PART_NODES.length) },
    { label: "Lenses", value: String(syllabus.lenses.length) },
  ];
};

/**
 * The readings the "new additions" film highlights, most recent last so the
 * film ends on the freshest one. There is no `dateAdded` field on a syllabus
 * reading, so this list is curated by hand — update it when the syllabus
 * gains its next readings worth announcing.
 */
export const NEW_ADDITIONS_SLUGS = [
  "machines-of-loving-grace",
  "the-adolescence-of-technology",
  "deep-utopia",
  "rise-and-fall-of-the-artificial-state",
] as const;

export interface NewAddition {
  slug: string;
  title: string;
  author: string;
  note?: string;
  coverUrl: string;
  partLabel: string;
  partTitle: string;
  accent: string;
}

/**
 * The syllabus page's notes run a sentence or two long, written for a reader
 * who can linger. A card in a 4-second highlight reel can't afford the full
 * text — there is no time to reveal and then actually read all of it before
 * the cut — so this keeps the opening clause and drops the rest at a word
 * boundary.
 */
const truncate = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max)}…`;
};

export const newAdditions = (): NewAddition[] =>
  NEW_ADDITIONS_SLUGS.map((slug) => {
    const book = bookBySlug(slug);
    const part = PART_NODES.find((p) => p.id === book.partId);
    return {
      slug: book.slug,
      title: book.title,
      author: book.author,
      note: book.note ? truncate(book.note, 110) : undefined,
      coverUrl: book.coverUrl,
      partLabel: part?.label ?? "",
      partTitle: book.partTitle,
      accent: book.accent,
    };
  });
