import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Words } from "../components/Words";
import { useLayout } from "../components/Frame";
import { ACCENT, INK, INK_DIM, SERIF } from "../theme";

/**
 * The syllabus opens on its own guiding question, split into the premise and
 * the two things the premise puts at risk.
 */
export const Hook: React.FC<{ premise: string; hold: string; turn: string }> = ({
  premise,
  hold,
  turn,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit, height } = useLayout();

  const premiseOut = interpolate(frame, [66, 88], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const premiseLift = interpolate(frame, [66, 88], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${88 * unit}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: height / 2,
          transform: `translateY(-50%) translateY(${premiseLift * unit}px)`,
          opacity: premiseOut,
          textAlign: "center",
          maxWidth: 900 * unit,
        }}
      >
        <Words
          text={premise}
          frame={frame}
          fps={fps}
          startAt={6}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: 56 * unit,
            lineHeight: 1.26,
            color: INK_DIM,
            letterSpacing: "-0.015em",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: height / 2,
          transform: "translateY(-50%)",
          textAlign: "center",
          maxWidth: 940 * unit,
        }}
      >
        <Words
          text={hold}
          frame={frame}
          fps={fps}
          startAt={86}
          stagger={2.2}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 74 * unit,
            lineHeight: 1.16,
            color: INK,
            letterSpacing: "-0.025em",
          }}
        />
        <div style={{ height: 18 * unit }} />
        <Words
          text={turn}
          frame={frame}
          fps={fps}
          startAt={124}
          stagger={2.2}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 74 * unit,
            lineHeight: 1.16,
            color: ACCENT,
            letterSpacing: "-0.025em",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
