import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Backdrop, Fade, TallChrome } from "./components/Frame";
import { AdditionsIntro } from "./scenes/AdditionsIntro";
import { AdditionCard } from "./scenes/AdditionCard";
import { Outro } from "./scenes/Outro";
import { NEW_ADDITIONS_SLUGS, newAdditions, outroStats } from "./copy";
import { useFilmFonts } from "./theme";

/**
 * A short cut announcing whatever is newest on the syllabus, for reposting
 * whenever a handful of readings land at once. Reuses the main film's palette,
 * fonts and chrome so it reads as the same series, but it is its own
 * composition rather than a scene inside SyllabusFilm.tsx: the two have
 * unrelated running times and neither one's timeline should have to account
 * for the other's.
 */
const introFor = 80;
const cardFor = 130;
const cardsAt = introFor;
const outroAt = cardsAt + cardFor * NEW_ADDITIONS_SLUGS.length;
const outroFor = 90;

export const FILM_ADDITIONS = {
  fps: 30,
  introAt: 0,
  introFor,
  cardsAt,
  cardFor,
  outroAt,
  outroFor,
  duration: outroAt + outroFor,
};

export const NewAdditionsFilm: React.FC = () => {
  useFilmFonts();
  const additions = newAdditions();

  return (
    <AbsoluteFill>
      <Backdrop intensity={0.7} />

      <Sequence from={FILM_ADDITIONS.introAt} durationInFrames={FILM_ADDITIONS.introFor}>
        <Fade duration={FILM_ADDITIONS.introFor} inFrames={16} outFrames={22}>
          <AdditionsIntro count={additions.length} />
        </Fade>
      </Sequence>

      {additions.map((addition, i) => (
        <Sequence
          key={addition.slug}
          from={FILM_ADDITIONS.cardsAt + i * FILM_ADDITIONS.cardFor}
          durationInFrames={FILM_ADDITIONS.cardFor}
        >
          <Fade duration={FILM_ADDITIONS.cardFor} inFrames={14} outFrames={20}>
            <AdditionCard addition={addition} index={i} total={additions.length} />
          </Fade>
        </Sequence>
      ))}

      <Sequence from={FILM_ADDITIONS.outroAt} durationInFrames={FILM_ADDITIONS.outroFor}>
        <Fade duration={FILM_ADDITIONS.outroFor} inFrames={18} outFrames={0}>
          <Outro
            stats={outroStats()}
            line="The syllabus keeps growing."
            url="lucasdickey.com/syllabus"
          />
        </Fade>
      </Sequence>

      <TallChrome opacity={1} />
    </AbsoluteFill>
  );
};
