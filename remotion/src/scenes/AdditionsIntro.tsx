import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Words } from "../components/Words";
import { useLayout } from "../components/Frame";
import { ACCENT, INK, INK_DIM, MONO, SERIF } from "../theme";

/** Opens the "new additions" cut on a count, then the syllabus it belongs to. */
export const AdditionsIntro: React.FC<{ count: number }> = ({ count }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit } = useLayout();

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${88 * unit}px`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 21 * unit,
          letterSpacing: "0.28em",
          color: ACCENT,
          marginBottom: 22 * unit,
        }}
      >
        AI &amp; CIVILIZATION SYLLABUS
      </div>
      <Words
        text={`${count} new readings`}
        frame={frame}
        fps={fps}
        startAt={6}
        stagger={4}
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 84 * unit,
          lineHeight: 1.1,
          color: INK,
          letterSpacing: "-0.03em",
        }}
      />
      <div style={{ height: 20 * unit }} />
      <Words
        text="just added to the reading list."
        frame={frame}
        fps={fps}
        startAt={26}
        stagger={2.4}
        style={{
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: 40 * unit,
          lineHeight: 1.24,
          color: INK_DIM,
          letterSpacing: "-0.012em",
        }}
      />
    </AbsoluteFill>
  );
};
