import { Easing, interpolate } from "remotion";
import { bookBySlug, FOCUS_SLUGS, T } from "./graph";

export interface CameraState {
  scale: number;
  x: number;
  y: number;
}

interface CameraKey extends CameraState {
  frame: number;
}

const focusA = bookBySlug(FOCUS_SLUGS[0]);
const focusB = bookBySlug(FOCUS_SLUGS[1]);

/** Pushes the focused cover above centre, leaving the lower half for its card. */
const CARD_CLEARANCE = 78;

/**
 * The camera pushes in tight on the guiding question, pulls back as the graph
 * outgrows the frame, dives onto two readings once every book is placed, then
 * settles wide for the closing questions. Frames are graph-local.
 */
const KEYS: CameraKey[] = [
  { frame: 0, scale: 2.3, x: 0, y: 0 },
  { frame: T.superStart, scale: 2.15, x: 0, y: 0 },
  { frame: 240, scale: 1.05, x: 0, y: 0 },
  { frame: 430, scale: 0.9, x: 0, y: 0 },
  { frame: 620, scale: 0.68, x: 0, y: 0 },
  { frame: T.wideAt, scale: 0.56, x: 0, y: 0 },
  { frame: T.focusAIn - 45, scale: 0.56, x: 0, y: 0 },
  { frame: T.focusAIn, scale: 1.75, x: focusA.x, y: focusA.y + CARD_CLEARANCE },
  { frame: T.focusAOut, scale: 1.75, x: focusA.x, y: focusA.y + CARD_CLEARANCE },
  { frame: T.focusBIn, scale: 1.75, x: focusB.x, y: focusB.y + CARD_CLEARANCE },
  { frame: T.focusBOut, scale: 1.75, x: focusB.x, y: focusB.y + CARD_CLEARANCE },
  { frame: T.pullBack, scale: 0.56, x: 0, y: 0 },
  // A barely-perceptible continued pull keeps the closing frames from feeling
  // frozen while the questions read over the top.
  { frame: 1330, scale: 0.53, x: 0, y: 0 },
];

export const sampleCamera = (frame: number): CameraState => {
  const first = KEYS[0];
  const last = KEYS[KEYS.length - 1];
  if (frame <= first.frame) return first;
  if (frame >= last.frame) return last;

  for (let i = 0; i < KEYS.length - 1; i += 1) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (frame < a.frame || frame > b.frame) continue;

    const t = interpolate(frame, [a.frame, b.frame], [0, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return {
      scale: a.scale + (b.scale - a.scale) * t,
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    };
  }

  return last;
};

/** 0 while wide, 1 while the camera is parked on a reading. */
export const focusIntensity = (frame: number) =>
  interpolate(
    frame,
    [
      T.focusAIn - 20,
      T.focusAIn,
      T.focusBOut,
      T.focusBOut + 30,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

/** Which focus reading is on screen, and the frame its card started entering. */
export const focusState = (frame: number) => {
  const handover = (T.focusAOut + T.focusBIn) / 2;
  if (frame >= T.focusAIn - 20 && frame < handover) {
    return { slug: FOCUS_SLUGS[0], since: T.focusAIn - 14 };
  }
  if (frame >= handover && frame <= T.focusBOut + 30) {
    return { slug: FOCUS_SLUGS[1], since: T.focusBIn - 14 };
  }
  return null;
};
