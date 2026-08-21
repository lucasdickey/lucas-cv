import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BOOK_NODES,
  PART_NODES,
  T,
  TOUR_END,
  partSpotlight,
  tourPartAt,
  type PartNode,
} from "../graph";
import { sampleCamera, tourIntensity } from "../camera";
import { BookCard, CenterNode, Edges, Supernode } from "../components/GraphNodes";
import { useLayout } from "../components/Frame";
import { INK, INK_DIM, INK_FAINT, MONO, SANS, SERIF } from "../theme";

/** Running tally of readings as they attach to the graph. */
const Counter: React.FC<{ placed: number; total: number; opacity: number }> = ({
  placed,
  total,
  opacity,
}) => {
  const { unit, height, isTall } = useLayout();
  return (
    <div
      style={{
        position: "absolute",
        left: 62 * unit,
        top: isTall ? height * 0.135 : 58 * unit,
        opacity,
        fontFamily: MONO,
        fontWeight: 500,
        fontSize: 26 * unit,
        letterSpacing: "0.14em",
        color: INK_FAINT,
      }}
    >
      <span style={{ color: INK }}>{String(placed).padStart(2, "0")}</span>
      {` / ${total} READINGS`}
    </div>
  );
};

/**
 * The card that runs under each part while the camera holds on it. Screen
 * space rather than graph space, so it reads at the same size however far in
 * the camera has pushed.
 */
const PartCard: React.FC<{ part: PartNode; frame: number; opacity: number }> = ({
  part,
  frame,
  opacity,
}) => {
  const { unit, width, height, bottomInset } = useLayout();
  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width,
          height: height * 0.3,
          background:
            "linear-gradient(to top, rgba(6,8,13,0.95) 0%, rgba(6,8,13,0.72) 44%, rgba(6,8,13,0) 100%)",
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width,
          bottom: bottomInset,
          padding: `0 ${72 * unit}px`,
          textAlign: "center",
          opacity: opacity * enter,
          transform: `translateY(${(1 - enter) * 18 * unit}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 19 * unit,
            letterSpacing: "0.28em",
            color: part.accent,
            marginBottom: 10 * unit,
          }}
        >
          {part.label.toUpperCase()} · {part.bookCount}{" "}
          {part.bookCount === 1 ? "READING" : "READINGS"}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 42 * unit,
            lineHeight: 1.1,
            color: INK,
            letterSpacing: "-0.022em",
          }}
        >
          {part.title}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 26 * unit,
            lineHeight: 1.32,
            color: INK_DIM,
            marginTop: 12 * unit,
            maxWidth: 820 * unit,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {part.summary}
        </div>
      </div>
    </>
  );
};

export const GraphScene: React.FC<{ centerQuestion: string }> = ({
  centerQuestion,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit, width, height, graphScale } = useLayout();

  const camera = sampleCamera(frame);
  const tour = tourIntensity(frame);
  const tourPart = tourPartAt(frame);
  const spotlightOf = (partId: string) => partSpotlight(partId, frame);

  const placed = BOOK_NODES.filter((b) => frame >= b.appearAt + 6).length;
  const counterOpacity = interpolate(
    frame,
    [T.bookStart - 8, T.bookStart + 10, T.tourStart - 30, T.tourStart - 6],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const cardFrame = tourPart
    ? frame - (T.tourStart + tourPart.index * T.tourPerPart)
    : 0;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transformOrigin: "0px 0px",
          transform: [
            `translate(${width / 2}px, ${height / 2}px)`,
            `scale(${camera.scale * unit * graphScale})`,
            `translate(${-camera.x}px, ${-camera.y}px)`,
          ].join(" "),
          width: 0,
          height: 0,
        }}
      >
        <Edges
          parts={PART_NODES}
          books={BOOK_NODES}
          frame={frame}
          spotlightOf={spotlightOf}
        />
        <CenterNode frame={frame} fps={fps} question={centerQuestion} />
        {PART_NODES.map((part) => (
          <Supernode
            key={part.id}
            node={part}
            frame={frame}
            fps={fps}
            spotlight={spotlightOf(part.id)}
            labelOpacity={1 - tour}
          />
        ))}
        {BOOK_NODES.map((book) => (
          <BookCard
            key={book.slug}
            node={book}
            frame={frame}
            fps={fps}
            spotlight={spotlightOf(book.partId)}
          />
        ))}
      </AbsoluteFill>

      <Counter placed={placed} total={BOOK_NODES.length} opacity={counterOpacity} />
      {tourPart ? (
        <PartCard part={tourPart} frame={cardFrame} opacity={tour} />
      ) : null}
    </AbsoluteFill>
  );
};

export { TOUR_END };
