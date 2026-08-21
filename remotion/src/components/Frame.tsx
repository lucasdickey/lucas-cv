import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BG, INK_FAINT, MONO } from "../theme";

/**
 * The film is composed against a 1080x1080 square and scaled to whatever the
 * composition is, so one set of layout numbers serves the square, vertical and
 * widescreen cuts.
 */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const unit = Math.min(width, height) / 1080;
  return {
    width,
    height,
    unit,
    isTall: height / width > 1.15,
    isWide: width / height > 1.15,
  };
};

export const Backdrop: React.FC<{ glow?: string; intensity?: number }> = ({
  glow = "#2C3550",
  intensity = 1,
}) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 46%, ${glow}${Math.round(
          intensity * 90
        )
          .toString(16)
          .padStart(2, "0")} 0%, rgba(0,0,0,0) 62%)`,
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.055) 1px, rgba(0,0,0,0) 1px)",
        backgroundSize: "38px 38px",
        opacity: 0.75,
      }}
    />
    {/* Corner-to-centre falloff keeps the graph from crowding the edges. */}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  </AbsoluteFill>
);

/** Small persistent title in the tall cut, where the square art leaves room. */
export const TallChrome: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { unit, height, isTall } = useLayout();
  if (!isTall) return null;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: height * 0.075,
          width: "100%",
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 22 * unit,
          letterSpacing: "0.3em",
          color: INK_FAINT,
          opacity,
        }}
      >
        AI &amp; CIVILIZATION
      </div>
      <div
        style={{
          position: "absolute",
          bottom: height * 0.07,
          width: "100%",
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 20 * unit,
          letterSpacing: "0.22em",
          color: INK_FAINT,
          opacity,
        }}
      >
        LUCASDICKEY.COM/SYLLABUS
      </div>
    </>
  );
};

/** Cross-fades a scene in and out against whatever is behind it. */
export const Fade: React.FC<{
  duration: number;
  inFrames?: number;
  outFrames?: number;
  children: React.ReactNode;
}> = ({ duration, inFrames = 16, outFrames = 16, children }) => {
  const frame = useCurrentFrame();

  // Either edge can be zero-length (the graph never fades out, it is handed off
  // to the overlays), so the ranges are assembled rather than written literally
  // — interpolate() rejects a repeated input value.
  const points: number[] = [];
  const values: number[] = [];
  if (inFrames > 0) {
    points.push(0, inFrames);
    values.push(0, 1);
  } else {
    points.push(0);
    values.push(1);
  }
  if (outFrames > 0) {
    points.push(duration - outFrames, duration);
    values.push(1, 0);
  } else {
    points.push(duration);
    values.push(1);
  }

  const opacity = interpolate(frame, points, values, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
