import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useLayout } from "../components/Frame";
import { ACCENT, INK, INK_DIM, INK_FAINT, MONO, SANS, SERIF } from "../theme";

export const Outro: React.FC<{
  stats: { label: string; value: string }[];
  line: string;
  url: string;
}> = ({ stats, line, url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit, height } = useLayout();

  const scrim = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enter = spring({
    frame: frame - 12,
    fps,
    config: { damping: 18, mass: 0.7, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "#070910",
          opacity: scrim * 0.96,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 22 * unit}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16 * unit,
            marginBottom: 52 * unit,
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{ textAlign: "center", minWidth: 190 * unit }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 86 * unit,
                  color: ACCENT,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontWeight: 500,
                  fontSize: 19 * unit,
                  letterSpacing: "0.2em",
                  color: INK_FAINT,
                  marginTop: 12 * unit,
                }}
              >
                {stat.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 58 * unit,
            lineHeight: 1.2,
            color: INK,
            textAlign: "center",
            padding: `0 ${90 * unit}px`,
            letterSpacing: "-0.022em",
          }}
        >
          {line}
        </div>

        <div
          style={{
            marginTop: 46 * unit,
            padding: `${18 * unit}px ${38 * unit}px`,
            border: `1.5px solid ${ACCENT}77`,
            borderRadius: 999,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 30 * unit,
            letterSpacing: "0.02em",
            color: ACCENT,
          }}
        >
          {url}
        </div>
        <div
          style={{
            marginTop: 26 * unit,
            fontFamily: SANS,
            fontSize: 24 * unit,
            color: INK_DIM,
          }}
        >
          The full reading list, in order, with notes.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
