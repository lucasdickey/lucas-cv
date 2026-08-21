import { getSyllabusStats, syllabus } from "../../app/data/syllabus";
import { BOOK_NODES, PART_NODES } from "./graph";
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
