import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { NewAddition } from "../copy";
import { Words } from "../components/Words";
import { useLayout } from "../components/Frame";
import { INK, INK_DIM, INK_FAINT, MONO, SANS, SERIF } from "../theme";

const asset = (path: string) => staticFile(path.replace(/^\//, ""));

const COVER_W = 300;
const COVER_H = 450;

/**
 * One reading, held on screen full-bleed: cover, title, author, part, and the
 * note it is filed against. Frame is sequence-local — each addition gets its
 * own <Sequence> in NewAdditionsFilm, so this always starts counting from 0.
 */
export const AdditionCard: React.FC<{
  addition: NewAddition;
  index: number;
  total: number;
}> = ({ addition, index, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit } = useLayout();

  const pop = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 120 },
  });

  const labelOpacity = interpolate(frame, [4, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${90 * unit}px`,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 19 * unit,
          letterSpacing: "0.26em",
          color: addition.accent,
          opacity: labelOpacity,
          marginBottom: 26 * unit,
          textAlign: "center",
        }}
      >
        NEW · {addition.partLabel.toUpperCase()} · {addition.partTitle.toUpperCase()}
      </div>

      <div
        style={{
          width: COVER_W * unit,
          height: COVER_H * unit,
          borderRadius: 9 * unit,
          overflow: "hidden",
          transform: `scale(${0.82 + pop * 0.18})`,
          opacity: Math.min(1, pop * 1.3),
          boxShadow: `0 0 0 2.5px ${addition.accent}, 0 30px 70px rgba(0,0,0,0.65)`,
          background: "#1A1E28",
          marginBottom: 34 * unit,
        }}
      >
        <Img
          src={asset(addition.coverUrl)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div
        style={{
          textAlign: "center",
          maxWidth: 900 * unit,
        }}
      >
        <Words
          text={addition.title}
          frame={frame}
          fps={fps}
          startAt={16}
          stagger={2}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 48 * unit,
            lineHeight: 1.16,
            color: INK,
            letterSpacing: "-0.02em",
          }}
        />
        <div style={{ height: 10 * unit }} />
        <Words
          text={addition.author}
          frame={frame}
          fps={fps}
          startAt={26}
          stagger={2}
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 26 * unit,
            color: INK_DIM,
            letterSpacing: "0.01em",
          }}
        />
        {addition.note ? (
          <div
            style={{
              marginTop: 22 * unit,
              opacity: interpolate(frame, [34, 50], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${
                interpolate(frame, [34, 50], [10, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }) * unit
              }px)`,
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 24 * unit,
              lineHeight: 1.4,
              color: INK_FAINT,
            }}
          >
            {addition.note}
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 56 * unit,
          display: "flex",
          gap: 10 * unit,
          opacity: labelOpacity,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 8 * unit,
              height: 8 * unit,
              borderRadius: "50%",
              background: i === index ? addition.accent : "rgba(255,255,255,0.22)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
