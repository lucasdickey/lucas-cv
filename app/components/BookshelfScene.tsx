"use client";

/* eslint-disable @next/next/no-img-element -- each plate is a stack of same-size
   transparent layers that must line up pixel for pixel; next/image would wrap
   and re-encode them. */

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import ShelfTrain from "./ShelfTrain";
import styles from "./BookshelfScene.module.css";

/**
 * Engraved plates of the real bookshelves, placed through the homepage in
 * either theme. Each is built from depth layers rendered out of the /real-books
 * 3D scene (see scripts/bookshelf-header); things move in a middle layer and
 * pass behind the layer in front.
 *
 *   night  Plate I: six bookcases from morning to night, lamps coming on
 *   study  Plate II: the three study cases, whose layers fan apart on request
 *   train  Plate III: the wooden case's top shelf, with a train behind the dividers
 */
export type BookshelfSceneKind = "night" | "study" | "train";

const SRC = "/images/bookshelf-scenes";

const PLATES: Record<
  BookshelfSceneKind,
  { numeral: string; title: string; description: string; href: string; animated: boolean }
> = {
  night: {
    numeral: "Plate I",
    title: "Six bookcases, morning to night",
    description:
      "Engraving of six bookcases side by side. Window light drifts across the wall behind them, then night falls and lamps come on inside the shelves.",
    href: "/real-books",
    animated: true,
  },
  study: {
    numeral: "Plate II",
    title: "The study shelves, in layers",
    description:
      "Engraving of three study bookcases that can separate into their layers: the back wall, the books and the frame.",
    href: "/real-books?case=study-cream",
    animated: false,
  },
  train: {
    numeral: "Plate III",
    title: "The top shelf, with a train",
    description:
      "Engraving of the top shelf of the wooden bookcase. A small red train runs along the shelf, passing behind each divider.",
    href: "/real-books",
    animated: true,
  },
};

// Plate I lamps, one per cubby opening found in the render:
// [left %, top %, width %, height %, start delay in seconds].
const LAMPS: [number, number, number, number, number][] = [
  [3.75, 19.15, 11.17, 11.99, 1.04], [3.75, 32.79, 11.17, 12.6, 0.48], [3.75, 46.42, 11.17, 12.77, 2.08],
  [3.75, 60.66, 11.17, 12.17, 0.23], [3.75, 74.89, 11.17, 11.56, 1.71], [16.75, 20.02, 10.94, 11.13, 1.17],
  [16.75, 33.48, 10.94, 11.91, 0.19], [16.75, 46.85, 10.94, 12.51, 1.62], [16.75, 60.66, 10.94, 12.08, 0.12],
  [16.75, 74.89, 10.94, 11.22, 1.39], [29.5, 19.15, 11.17, 11.91, 0.22], [29.5, 32.79, 11.17, 12.6, 0.29],
  [29.5, 46.42, 11.17, 12.68, 1.36], [29.5, 60.57, 11.17, 12.17, 2.65], [29.5, 74.81, 11.17, 11.56, 0.4],
  [44.72, 18.55, 1.72, 12.08, 0.71], [44.72, 32.87, 3.94, 10.96, 2.01], [44.72, 45.99, 3.94, 10.61, 3.03],
  [44.72, 59.1, 3.94, 10.09, 1.85], [44.72, 72.3, 3.94, 9.4, 1.27], [46.92, 18.55, 1.75, 12.08, 3.12],
  [49.0, 18.55, 1.86, 12.08, 0.15], [49.03, 32.87, 4.03, 10.96, 2.75], [49.03, 45.99, 4.03, 10.61, 0.93],
  [49.03, 59.1, 4.03, 10.09, 0.46], [49.03, 72.3, 4.03, 9.4, 0.38], [51.11, 18.55, 1.94, 12.08, 0.99],
  [53.22, 18.55, 1.94, 12.08, 2.61], [53.22, 32.87, 4.03, 10.96, 0.58], [53.22, 45.99, 4.03, 10.61, 1.86],
  [53.22, 59.1, 4.03, 10.09, 2.04], [53.22, 72.3, 4.03, 9.4, 1.19], [55.44, 18.55, 1.83, 12.08, 1.75],
  [57.64, 18.55, 1.75, 12.08, 0.2], [57.64, 32.87, 3.92, 10.96, 0.19], [57.64, 45.99, 3.92, 10.61, 0.66],
  [57.64, 59.1, 3.92, 10.09, 2.18], [57.64, 72.3, 3.92, 9.4, 1.37], [59.83, 18.55, 1.72, 12.08, 1.01],
  [69.83, 32.01, 3.69, 11.99, 1.84], [69.83, 50.82, 3.69, 8.37, 2.8], [69.83, 60.48, 3.69, 10.53, 2.33],
  [69.83, 75.67, 3.69, 12.51, 3.14], [73.97, 32.01, 4.0, 11.99, 0.38], [73.97, 50.82, 4.0, 8.37, 2.42],
  [73.97, 60.48, 4.0, 10.53, 0.49], [73.97, 75.67, 4.0, 12.51, 0.13], [78.58, 32.01, 3.97, 11.99, 2.14],
  [78.58, 50.82, 3.97, 8.37, 1.83], [78.58, 60.48, 3.97, 10.53, 2.8], [78.58, 75.67, 3.97, 12.51, 2.22],
  [83.03, 32.01, 3.47, 11.99, 1.9], [83.03, 50.82, 3.47, 8.37, 1.46], [83.03, 60.48, 3.47, 10.53, 2.69],
  [83.03, 75.67, 3.47, 12.51, 1.52],
];

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

function Layer({
  name,
  priority,
  className,
}: {
  name: string;
  priority?: "high" | "low";
  className?: string;
}) {
  return (
    <img
      src={`${SRC}/${name}-1800.avif`}
      srcSet={`${SRC}/${name}-1800.avif 1800w, ${SRC}/${name}.avif 3600w`}
      sizes="(max-width: 720px) 760px, 100vw"
      alt=""
      className={cx(styles.layer, className)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority}
      decoding="async"
      draggable={false}
    />
  );
}

function Panes() {
  return (
    <>
      <i className={styles.pane} />
      <i className={styles.pane} />
      <i className={styles.pane} />
      <i className={styles.pane} />
    </>
  );
}

function Lamps() {
  return LAMPS.map(([x, y, w, h, delay], i) => (
    <i
      key={i}
      className={styles.lamp}
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, animationDelay: `${delay}s` }}
    />
  ));
}

function NightShift({ eager }: { eager: boolean }) {
  return (
    <div className={styles.stage}>
      <div className={cx(styles.layer, styles.wall)} />
      <div className={styles.sun}>
        <Panes />
      </div>
      <Layer name="sky-day" priority={eager ? "high" : undefined} />
      <div className={cx(styles.layer, styles.dusk)} />
      <div className={cx(styles.layer, styles.nightfall)}>
        <div className={cx(styles.layer, styles.nightWall)} />
        <div className={styles.moon}>
          <Panes />
        </div>
        <Layer name="sky-floor-night" priority={eager ? "low" : undefined} />
        <Layer name="sky-back-night" priority={eager ? "low" : undefined} />
        <div className={cx(styles.layer, styles.lamps)}>
          <Lamps />
        </div>
        <Layer name="sky-fore-night" priority={eager ? "low" : undefined} />
        <div className={cx(styles.layer, styles.spill)}>
          <Lamps />
        </div>
      </div>
    </div>
  );
}

// Back to front: [image, distance apart when separated (px), drift with the pointer (px)].
const STUDY_CARDS: [string | null, number, number][] = [
  [null, 0, 0],
  ["study-back", 90, 2],
  ["study-books", 180, 5],
  ["study-frame", 270, 8],
];

function StudyLayers({ rig, eager }: { rig: RefObject<HTMLDivElement | null>; eager: boolean }) {
  return (
    <div ref={rig} className={cx(styles.stage, styles.rig)}>
      {STUDY_CARDS.map(([name, z, depth]) => (
        <div
          key={name ?? "wall"}
          className={cx(styles.card, !name && styles.cardWall)}
          style={{ "--z": z, "--depth": depth } as CSSProperties}
        >
          {name ? <Layer name={name} priority={eager ? "high" : undefined} /> : <div className={cx(styles.layer, styles.wall)} />}
        </div>
      ))}
    </div>
  );
}

function ShelfExpress({ eager }: { eager: boolean }) {
  return (
    <div className={styles.stage}>
      <div className={cx(styles.layer, styles.wall)} />
      <Layer name="wood-backbooks" priority={eager ? "high" : undefined} />
      <div className={styles.track}>
        <div className={styles.rail} />
        <ShelfTrain className={styles.engine} spin={styles.spin} rod={styles.rod} puff={styles.puff} />
      </div>
      <Layer name="wood-frame" priority={eager ? "high" : undefined} />
      <Layer name="wood-fern" className={styles.fern} priority={eager ? "high" : undefined} />
      <Layer name="wood-caps" priority={eager ? "high" : undefined} />
    </div>
  );
}

const prefersStill = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function BookshelfScene({
  scene,
  variant,
  priority = false,
  className,
}: {
  scene: BookshelfSceneKind;
  variant: "terminal" | "marketer";
  /** Load right away; use for the plate at the top of the page. */
  priority?: boolean;
  className?: string;
}) {
  const plate = PLATES[scene];
  const root = useRef<HTMLElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [exploded, setExploded] = useState(false);

  // Hold the motion until every layer has loaded, so nothing moves over a half-drawn plate.
  useEffect(() => {
    const images = Array.from(root.current?.querySelectorAll("img") ?? []);
    let waiting = images.filter((img) => !img.complete).length;
    if (waiting === 0) {
      setReady(true);
      return;
    }
    const settle = () => {
      waiting -= 1;
      if (waiting <= 0) setReady(true);
    };
    const pending = images.filter((img) => !img.complete);
    for (const img of pending) {
      img.addEventListener("load", settle, { once: true });
      img.addEventListener("error", settle, { once: true });
    }
    return () => {
      for (const img of pending) {
        img.removeEventListener("load", settle);
        img.removeEventListener("error", settle);
      }
    };
  }, []);

  // Stop the motion while the plate is off screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Plate II fans its layers apart once on its own, the first time it is in full view,
  // so visitors see what the button does. Any press of the button cancels this.
  useEffect(() => {
    const el = root.current;
    if (scene !== "study" || !ready || !el || prefersStill()) return;
    let start: ReturnType<typeof setTimeout> | undefined;
    let end: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || touched.current) return;
        observer.disconnect();
        start = setTimeout(() => {
          if (touched.current) return;
          setExploded(true);
          end = setTimeout(() => {
            if (!touched.current) setExploded(false);
          }, 2800);
        }, 700);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [scene, ready]);

  const drift = (x: number, y: number) => {
    rig.current?.style.setProperty("--px", x.toFixed(3));
    rig.current?.style.setProperty("--py", y.toFixed(3));
  };

  return (
    <figure
      ref={root}
      className={cx(styles.scene, styles[scene], styles[variant], exploded && styles.exploded, className)}
      data-running={ready && visible && !paused}
    >
      <div className={styles.frame}>
        <div
          className={cx(styles.viewport, scene === "study" && styles.viewport3d)}
          role="img"
          aria-label={plate.description}
          onPointerMove={(e) => {
            if (scene !== "study" || e.pointerType === "touch" || prefersStill()) return;
            const r = e.currentTarget.getBoundingClientRect();
            drift(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
          }}
          onPointerLeave={() => drift(0, 0)}
        >
          {scene === "night" && <NightShift eager={priority} />}
          {scene === "study" && <StudyLayers rig={rig} eager={priority} />}
          {scene === "train" && <ShelfExpress eager={priority} />}
        </div>
        <figcaption className={styles.caption}>
          <span className={styles.label}>
            <span className={styles.plate}>{plate.numeral}</span>
            {plate.title}
          </span>
          <span className={styles.actions}>
            {plate.animated && (
              <button type="button" className={cx(styles.button, styles.motionOnly)} onClick={() => setPaused((p) => !p)}>
                {paused ? <Play className="h-3 w-3" aria-hidden="true" /> : <Pause className="h-3 w-3" aria-hidden="true" />}
                {paused ? "Play" : "Pause"}
              </button>
            )}
            {scene === "study" && (
              <button
                type="button"
                className={styles.button}
                onClick={() => {
                  touched.current = true;
                  setExploded((x) => !x);
                }}
              >
                {exploded ? "Stack the layers" : "Separate the layers"}
              </button>
            )}
            <a href={plate.href} className={styles.link}>
              Walk the shelves in 3D <ArrowUpRight className="inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />
            </a>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
