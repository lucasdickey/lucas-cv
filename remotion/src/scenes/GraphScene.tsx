import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BOOK_NODES, PART_NODES, T, bookBySlug, partCaptionAt } from "../graph";
import { focusIntensity, focusState, sampleCamera } from "../camera";
import { BookCard, CenterNode, Edges, Supernode } from "../components/GraphNodes";
import { useLayout } from "../components/Frame";
import { INK, INK_DIM, INK_FAINT, MONO, SANS, SERIF } from "../theme";

/** Card that names the reading the camera has stopped on. */
const FocusCard: React.FC<{ slug: string; frame: number }> = ({ slug, frame }) => {
  const { unit, width, bottomInset } = useLayout();
  const book = bookBySlug(slug);
  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: width * 0.5,
        bottom: bottomInset,
        transform: `translateX(-50%) translateY(${(1 - enter) * 34 * unit}px)`,
        opacity: enter,
        width: Math.min(width * 0.86, 860 * unit),
        padding: `${26 * unit}px ${32 * unit}px`,
        borderRadius: 14 * unit,
        background: "rgba(10,13,20,0.86)",
        border: `1px solid ${book.accent}55`,
        boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
        borderLeft: `${5 * unit}px solid ${book.accent}`,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 18 * unit,
          letterSpacing: "0.2em",
          color: book.accent,
          marginBottom: 10 * unit,
        }}
      >
        {book.partTitle.toUpperCase()}
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 44 * unit,
          lineHeight: 1.12,
          color: INK,
          letterSpacing: "-0.02em",
        }}
      >
        {book.title}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 24 * unit,
          color: INK_FAINT,
          marginTop: 6 * unit,
        }}
      >
        {book.author}
      </div>
      {book.note ? (
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 28 * unit,
            lineHeight: 1.34,
            color: INK_DIM,
            marginTop: 16 * unit,
          }}
        >
          {book.note}
        </div>
      ) : null}
    </div>
  );
};

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
 * Names the part currently being populated. Keeping this in screen space rather
 * than on the node means it reads at the same size however far out the camera
 * is, and the gradient under it keeps the text off the covers behind.
 */
const PartCaption: React.FC<{ frame: number; opacity: number }> = ({
  frame,
  opacity,
}) => {
  const { unit, height, width, isTall, bottomInset } = useLayout();
  const state = partCaptionAt(frame);
  if (!state || opacity <= 0) return null;

  const { part, since, until } = state;
  // The final part has no successor, so it holds until the scene fades it out.
  const end = Number.isFinite(until) ? until : since + 6000;
  const swap = interpolate(frame, [since, since + 10, end - 10, end], [0, 1, 1, 0], {
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
          height: height * (isTall ? 0.32 : 0.26),
          background:
            "linear-gradient(to top, rgba(6,8,13,0.95) 0%, rgba(6,8,13,0.7) 42%, rgba(6,8,13,0) 100%)",
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width,
          bottom: bottomInset,
          textAlign: "center",
          opacity: opacity * swap,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 19 * unit,
            letterSpacing: "0.28em",
            color: part.accent,
            marginBottom: 9 * unit,
          }}
        >
          {part.label.toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 38 * unit,
            lineHeight: 1.12,
            color: INK,
            letterSpacing: "-0.02em",
          }}
        >
          {part.title}
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
  const dimmed = focusIntensity(frame);
  const focus = focusState(frame);

  const placed = BOOK_NODES.filter((b) => frame >= b.appearAt + 8).length;
  const counterOpacity = interpolate(
    frame,
    [T.bookStart - 10, T.bookStart + 12, T.focusAIn - 50, T.focusAIn - 26],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const captionOpacity = interpolate(
    frame,
    [T.superStart, T.superStart + 20, T.focusAIn - 50, T.focusAIn - 26],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

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
        <Edges parts={PART_NODES} books={BOOK_NODES} frame={frame} dimmed={dimmed} />
        <CenterNode frame={frame} fps={fps} question={centerQuestion} />
        {PART_NODES.map((part) => (
          <Supernode key={part.id} node={part} frame={frame} fps={fps} />
        ))}
        {BOOK_NODES.map((book) => (
          <BookCard
            key={book.slug}
            node={book}
            frame={frame}
            fps={fps}
            dimmed={dimmed}
            highlighted={focus?.slug === book.slug}
          />
        ))}
      </AbsoluteFill>

      {/* Scrim that lifts the focus card off the graph behind it. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(6,8,13,0.92) 0%, rgba(6,8,13,0.35) 34%, rgba(0,0,0,0) 58%)",
          opacity: dimmed,
        }}
      />
      {focus ? (
        <FocusCard slug={focus.slug} frame={frame - focus.since} />
      ) : null}
      <Counter placed={placed} total={BOOK_NODES.length} opacity={counterOpacity} />
      <PartCaption frame={frame} opacity={captionOpacity} />
    </AbsoluteFill>
  );
};
