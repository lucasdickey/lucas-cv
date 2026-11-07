"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { pegBoardBooks } from "../data/pegBoard";
import styles from "./PegBoard.module.css";

/**
 * The books on the go, as glowing peg pictures on a toy light box. It plays on
 * its own until someone taps it; then it's paint by numbers: every empty hole
 * shows its colour's code letter, and each tap or drag drops a clump of pegs.
 *
 * The board is drawn with three.js by public/peg-board/peg-board.js, which shares
 * the copy of three.js the /real-books page uses. Both load only once the board
 * is close to the screen. Pictures come from app/data/pegBoard.ts.
 */
const BOARD_MODULE = "/peg-board/peg-board.js?v=1";

type BoardState = { mode: "auto" | "paint"; wide: boolean; index: number; done: boolean[] };
type Board = {
  paint(): void;
  fillIn(): void;
  clear(): void;
  play(): void;
  next(): void;
  prev(): void;
  destroy(): void;
};

export default function PegBoard({ className }: { className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const board = useRef<Board | null>(null);
  const [state, setState] = useState<BoardState>({
    mode: "auto",
    wide: true,
    index: 0,
    done: pegBoardBooks.map(() => false),
  });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    let cancelled = false;
    const near = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        try {
          const { mountPegBoard } = await import(/* webpackIgnore: true */ BOARD_MODULE);
          if (cancelled || !host.current) return;
          board.current = mountPegBoard(host.current, {
            books: pegBoardBooks,
            reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            onState: (next: BoardState) => setState({ ...next, done: [...next.done] }),
          });
        } catch (err) {
          console.error("Peg board unavailable", err);
          if (!cancelled) setFailed(true);
        }
      },
      { rootMargin: "600px" },
    );
    near.observe(el);
    return () => {
      cancelled = true;
      near.disconnect();
      board.current?.destroy();
      board.current = null;
    };
  }, []);

  const painted = state.done.filter(Boolean).length;
  const shown = state.wide ? pegBoardBooks : [pegBoardBooks[state.index]];

  return (
    <div ref={frame} className={`${styles.frame} ${className ?? ""}`}>
      <div
        ref={host}
        className={styles.board}
        role="img"
        aria-label={`Peg-board pictures of the books I'm reading: ${pegBoardBooks.map((b) => `${b.title} by ${b.author}`).join("; ")}.`}
      >
        {failed && <p className={styles.fallback}>This peg board needs WebGL, which this browser isn&apos;t offering.</p>}
      </div>
      <div className={styles.caption}>
        <span className={styles.label}>
          <b>Now reading</b>
          {state.mode === "paint"
            ? painted > 0
              ? `${painted} of ${pegBoardBooks.length} painted`
              : "Paint by numbers: tap or drag to drop pegs"
            : "Tap the board to paint it yourself"}
        </span>
        <span className={styles.actions}>
          {!state.wide && (
            <>
              <button type="button" className={styles.button} onClick={() => board.current?.prev()} aria-label="Previous book">
                ◀
              </button>
              <span className={styles.count}>
                {state.index + 1} / {pegBoardBooks.length}
              </span>
              <button type="button" className={styles.button} onClick={() => board.current?.next()} aria-label="Next book">
                ▶
              </button>
            </>
          )}
          {state.mode === "auto" ? (
            <button type="button" className={styles.button} onClick={() => board.current?.paint()}>
              Paint it
            </button>
          ) : (
            <>
              <button type="button" className={styles.button} onClick={() => board.current?.fillIn()}>
                Fill in
              </button>
              <button type="button" className={styles.button} onClick={() => board.current?.clear()}>
                Clear
              </button>
              <button type="button" className={styles.button} onClick={() => board.current?.play()}>
                Play
              </button>
            </>
          )}
        </span>
      </div>
      <div className={styles.books}>
        {shown.map((b) => (
          <span key={b.slug}>
            <Link href={`/books/${b.slug}`} className={styles.book}>
              {b.title}
            </Link>{" "}
            <span className={styles.author}>by {b.author}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
