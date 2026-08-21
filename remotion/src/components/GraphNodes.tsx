import React from "react";
import { Easing, Img, interpolate, spring, staticFile } from "remotion";
import { BOOK_H, BOOK_W, BookNode, PartNode } from "../graph";
import { INK, MONO, SERIF } from "../theme";

const asset = (path: string) => staticFile(path.replace(/^\//, ""));

/** Eased 0 -> 1 over `length` frames starting at `at`. */
const rampIn = (frame: number, at: number, length: number) =>
  interpolate(frame, [at, at + length], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const CenterNode: React.FC<{
  frame: number;
  fps: number;
  question: string;
}> = ({ frame, fps, question }) => {
  const pop = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 90 },
  });
  // The core stays bright but the text recedes once the graph is the subject.
  const textOpacity = interpolate(frame, [8, 30, 140, 180], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 1 + 0.035 * Math.sin((frame / fps) * 1.6);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(-50%, -50%) scale(${pop * pulse})`,
        width: 330,
        height: 330,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 42%, rgba(255,255,255,0) 70%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 206,
          height: 206,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.28)",
        }}
      />
      {/* Once the question has been read the centre becomes a node like any
          other, so the graph still has something to converge on. */}
      <div
        style={{
          position: "absolute",
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: "0 0 26px rgba(255,255,255,0.85)",
          opacity: 1 - textOpacity,
        }}
      />
      <div
        style={{
          width: 230,
          textAlign: "center",
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 30,
          lineHeight: 1.2,
          color: INK,
          opacity: textOpacity,
          letterSpacing: "-0.01em",
        }}
      >
        {question}
      </div>
    </div>
  );
};

export const Supernode: React.FC<{
  node: PartNode;
  frame: number;
  fps: number;
  /** 1 when this part is the subject, lower while another one is. */
  spotlight: number;
  /** Falls to 0 during the tour, where the card names the part instead. */
  labelOpacity: number;
}> = ({ node, frame, fps, spotlight, labelOpacity }) => {
  const local = frame - node.appearAt;
  const pop = spring({
    frame: local,
    fps,
    config: { damping: 13, mass: 0.6, stiffness: 110 },
  });
  if (local < -2) return null;

  // A ring that expands once and dissolves, so each part lands with a beat.
  const ring = interpolate(local, [0, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Only the numeral sits on the node; the part's name runs as a caption in
  // screen space, where it stays readable however far the camera pulls back.
  const inward = 108;
  const hyp = Math.hypot(node.x, node.y) || 1;
  const lx = node.x - (inward * node.x) / hyp;
  const ly = node.y - (inward * node.y) / hyp;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: node.x,
          top: node.y,
          opacity: spotlight,
          transform: `translate(-50%, -50%) scale(${pop})`,
          width: 116,
          height: 116,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${node.accent}44 0%, ${node.accent}14 55%, rgba(0,0,0,0) 72%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: node.accent,
            boxShadow: `0 0 34px ${node.accent}99`,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 46 + ring * 150,
            height: 46 + ring * 150,
            borderRadius: "50%",
            border: `2px solid ${node.accent}`,
            opacity: (1 - ring) * 0.7,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: lx,
          top: ly,
          transform: "translate(-50%, -50%)",
          width: 150,
          textAlign: "center",
          opacity: pop * spotlight * labelOpacity,
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 21,
          letterSpacing: "0.2em",
          color: node.accent,
        }}
      >
        {node.label.toUpperCase()}
      </div>
    </>
  );
};

export const BookCard: React.FC<{
  node: BookNode;
  frame: number;
  fps: number;
  /** 1 when this book's part is the subject, lower while another one is. */
  spotlight: number;
}> = ({ node, frame, fps, spotlight }) => {
  const local = frame - node.appearAt;
  if (local < -2) return null;

  const pop = spring({
    frame: local,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 105 },
  });
  // Each cover slides out from its supernode rather than fading in on the spot,
  // so the edge reads as the book being attached to the part.
  const x = node.parentX + (node.x - node.parentX) * pop;
  const y = node.parentY + (node.y - node.parentY) * pop;

  const lit = spotlight > 0.85;
  const opacity = Math.min(1, pop * 1.2) * spotlight;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.55 + pop * 0.45})`,
        width: BOOK_W,
        height: BOOK_H,
        opacity,
        borderRadius: 5,
        overflow: "hidden",
        boxShadow: lit
          ? `0 0 0 2.5px ${node.accent}, 0 22px 54px rgba(0,0,0,0.7)`
          : `0 0 0 1.5px ${node.accent}55, 0 10px 26px rgba(0,0,0,0.55)`,
        background: "#1A1E28",
      }}
    >
      <Img
        src={asset(node.coverUrl)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {node.status === "read" ? (
        <div
          style={{
            position: "absolute",
            right: 7,
            top: 7,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: node.accent,
            boxShadow: "0 0 0 2px rgba(0,0,0,0.55)",
          }}
        />
      ) : null}
    </div>
  );
};

/**
 * Every edge in the graph, drawn in one SVG under the same camera transform as
 * the nodes. Each line grows from its parent to its child as the child lands.
 */
export const Edges: React.FC<{
  parts: PartNode[];
  books: BookNode[];
  frame: number;
  spotlightOf: (partId: string) => number;
}> = ({ parts, books, frame, spotlightOf }) => (
  <svg
    style={{
      position: "absolute",
      left: -1200,
      top: -1200,
      width: 2400,
      height: 2400,
      overflow: "visible",
      pointerEvents: "none",
    }}
    viewBox="-1200 -1200 2400 2400"
  >
    {parts.map((part) => {
      const grow = rampIn(frame, part.appearAt, 26);
      return (
        <line
          key={part.id}
          x1={0}
          y1={0}
          x2={part.x * grow}
          y2={part.y * grow}
          stroke={part.accent}
          strokeWidth={2.2}
          opacity={grow * 0.5 * spotlightOf(part.id)}
        />
      );
    })}
    {books.map((book) => {
      const grow = rampIn(frame, book.appearAt, 20);
      if (grow <= 0) return null;
      return (
        <line
          key={book.slug}
          x1={book.parentX}
          y1={book.parentY}
          x2={book.parentX + (book.x - book.parentX) * grow}
          y2={book.parentY + (book.y - book.parentY) * grow}
          stroke={book.accent}
          strokeWidth={1.4}
          opacity={grow * 0.42 * spotlightOf(book.partId)}
        />
      );
    })}
  </svg>
);
