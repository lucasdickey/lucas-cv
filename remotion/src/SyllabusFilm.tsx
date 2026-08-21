import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Fade, TallChrome } from "./components/Frame";
import { Hook } from "./scenes/Hook";
import { Progression } from "./scenes/Progression";
import { GraphScene } from "./scenes/GraphScene";
import { Questions } from "./scenes/Questions";
import { Outro } from "./scenes/Outro";
import {
  centerQuestion,
  closingQuestions,
  guidingBeats,
  outroStats,
  progressionSteps,
} from "./copy";
import { useFilmFonts } from "./theme";

/** Scene boundaries, in frames at 30fps. 1800 frames = 60s. */
export const FILM = {
  fps: 30,
  duration: 1800,
  hookAt: 0,
  hookFor: 180,
  progressionAt: 180,
  progressionFor: 290,
  graphAt: 470,
  graphFor: 1330,
  questionsAt: 1520,
  questionsFor: 150,
  outroAt: 1665,
  outroFor: 135,
};

export const SyllabusFilm: React.FC = () => {
  useFilmFonts();
  const frame = useCurrentFrame();
  const beats = guidingBeats();

  // The backdrop glow warms as the graph fills in, then cools for the outro.
  const glow = interpolate(
    frame,
    [FILM.graphAt, FILM.graphAt + 300, FILM.questionsAt, FILM.duration],
    [0.55, 1, 0.8, 0.35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const chrome = interpolate(
    frame,
    [FILM.graphAt - 40, FILM.graphAt, FILM.questionsAt - 30, FILM.questionsAt],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      <Backdrop intensity={glow} />

      <Sequence from={FILM.hookAt} durationInFrames={FILM.hookFor}>
        <Fade duration={FILM.hookFor} inFrames={14} outFrames={22}>
          <Hook premise={beats.premise} hold={beats.hold} turn={beats.turn} />
        </Fade>
      </Sequence>

      <Sequence from={FILM.progressionAt} durationInFrames={FILM.progressionFor}>
        <Fade duration={FILM.progressionFor} inFrames={18} outFrames={26}>
          <Progression steps={progressionSteps()} />
        </Fade>
      </Sequence>

      <Sequence from={FILM.graphAt} durationInFrames={FILM.graphFor}>
        <Fade duration={FILM.graphFor} inFrames={24} outFrames={0}>
          <GraphScene centerQuestion={centerQuestion()} />
        </Fade>
      </Sequence>

      <Sequence from={FILM.questionsAt} durationInFrames={FILM.questionsFor}>
        <Fade duration={FILM.questionsFor} inFrames={18} outFrames={26}>
          <Questions questions={closingQuestions()} />
        </Fade>
      </Sequence>

      <Sequence from={FILM.outroAt} durationInFrames={FILM.outroFor}>
        <Fade duration={FILM.outroFor} inFrames={20} outFrames={0}>
          <Outro
            stats={outroStats()}
            line="A syllabus, not a conclusion."
            url="lucasdickey.com/syllabus"
          />
        </Fade>
      </Sequence>

      <TallChrome opacity={chrome} />
    </AbsoluteFill>
  );
};
