import React from "react";
import { spring } from "remotion";

/**
 * Word-by-word reveal. Each word rises and fades on its own spring so a line
 * lands as a phrase rather than a block switching on.
 */
export const Words: React.FC<{
  text: string;
  frame: number;
  fps: number;
  startAt: number;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({ text, frame, fps, startAt, stagger = 2.6, style }) => (
  <span style={style}>
    {text.split(" ").map((word, i) => {
      const enter = spring({
        frame: frame - startAt - i * stagger,
        fps,
        config: { damping: 16, mass: 0.5, stiffness: 90 },
      });
      return (
        <span
          key={`${word}-${i}`}
          style={{
            display: "inline-block",
            opacity: enter,
            transform: `translateY(${(1 - enter) * 0.42}em)`,
            marginRight: "0.26em",
          }}
        >
          {word}
        </span>
      );
    })}
  </span>
);
