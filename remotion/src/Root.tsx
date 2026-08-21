import React from "react";
import { Composition } from "remotion";
import { FILM, SyllabusFilm } from "./SyllabusFilm";

/**
 * One film, three crops: square for feeds, vertical for stories and Reels,
 * widescreen for YouTube and landscape embeds.
 */
export const Root: React.FC = () => (
  <>
    <Composition
      id="SyllabusFilmSquare"
      component={SyllabusFilm}
      durationInFrames={FILM.duration}
      fps={FILM.fps}
      width={1080}
      height={1080}
    />
    <Composition
      id="SyllabusFilmVertical"
      component={SyllabusFilm}
      durationInFrames={FILM.duration}
      fps={FILM.fps}
      width={1080}
      height={1920}
    />
    <Composition
      id="SyllabusFilmWide"
      component={SyllabusFilm}
      durationInFrames={FILM.duration}
      fps={FILM.fps}
      width={1920}
      height={1080}
    />
  </>
);
