import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useLayout } from "../components/Frame";
import { ACCENT, INK, MONO, SERIF } from "../theme";

/**
 * Closing questions, stacked over the finished graph rather than replacing it —
 * the point being that the graph is what these are for. The graph is blurred
 * behind them so it reads as depth rather than as competing detail.
 */
export const Questions: React.FC<{ questions: string[] }> = ({ questions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit } = useLayout();

  const settle = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "#070910",
          opacity: settle * 0.93,
        }}
      />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: `0 ${80 * unit}px`,
          gap: 40 * unit,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 21 * unit,
            letterSpacing: "0.28em",
            color: ACCENT,
            marginBottom: 18 * unit,
            opacity: interpolate(frame, [8, 26], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            textAlign: "center",
          }}
        >
          THE QUESTIONS IT IS BUILT AROUND
        </div>

        {questions.map((question, i) => {
          const enter = spring({
            frame: frame - (18 + i * 26),
            fps,
            config: { damping: 17, mass: 0.6, stiffness: 84 },
          });
          return (
            <div
              key={question}
              style={{
                transform: `translateY(${(1 - enter) * 26 * unit}px)`,
                opacity: enter,
                textAlign: "center",
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: 46 * unit,
                lineHeight: 1.18,
                color: INK,
                letterSpacing: "-0.022em",
                maxWidth: 900 * unit,
              }}
            >
              {question}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
