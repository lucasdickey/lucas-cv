import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useLayout } from "../components/Frame";
import { ACCENT, INK, INK_DIM, INK_FAINT, MONO, SERIF } from "../theme";

export interface Step {
  subject: string;
  verb: string;
  object: string;
}

/**
 * The four-line argument the syllabus is built on: each technology democratized
 * one layer, and the fourth line is the one nobody has lived through yet.
 */
export const Progression: React.FC<{ steps: Step[] }> = ({ steps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit, height, width } = useLayout();

  const rowGap = 116 * unit;
  const top = height / 2 - (rowGap * (steps.length - 1)) / 2;
  // A measured column rather than the full frame, so the widescreen cut does
  // not strand the list against the left edge.
  const column = Math.min(width - 120 * unit, 1000 * unit);
  const gutter = (width - column) / 2;

  return (
    <AbsoluteFill>
      {steps.map((step, i) => {
        const at = 14 + i * 44;
        const isLast = i === steps.length - 1;
        const enter = spring({
          frame: frame - at,
          fps,
          config: { damping: 18, mass: 0.8, stiffness: 78 },
        });
        // Everything before the last line recedes once the last line lands, so
        // "reasoning itself" is what the eye is left holding.
        const recede = isLast
          ? 0
          : interpolate(frame, [14 + steps.length * 44, 14 + steps.length * 44 + 26], [0, 1], {
              easing: Easing.inOut(Easing.quad),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
        const glow = isLast
          ? interpolate(frame, [at + 20, at + 60], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;

        return (
          <div
            key={step.object}
            style={{
              position: "absolute",
              top: top + i * rowGap,
              left: gutter,
              width: column,
              transform: `translateY(-50%) translateX(${(1 - enter) * -70 * unit}px)`,
              opacity: enter * (1 - recede * 0.72),
              display: "flex",
              alignItems: "baseline",
              gap: 26 * unit,
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontWeight: 500,
                fontSize: 24 * unit,
                color: isLast ? ACCENT : INK_FAINT,
                minWidth: 52 * unit,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: (isLast ? 56 : 48) * unit,
                lineHeight: 1.18,
                color: isLast ? INK : INK_DIM,
                fontWeight: isLast ? 600 : 400,
                letterSpacing: "-0.02em",
              }}
            >
              {step.subject}{" "}
              <span style={{ color: INK_FAINT, fontStyle: "italic" }}>
                {step.verb}
              </span>{" "}
              <span
                style={{
                  color: isLast ? ACCENT : INK,
                  fontWeight: 700,
                  textShadow: glow ? `0 0 ${34 * glow * unit}px ${ACCENT}88` : undefined,
                }}
              >
                {step.object}
              </span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
