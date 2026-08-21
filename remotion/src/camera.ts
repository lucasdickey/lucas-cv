import { Easing, interpolate } from "remotion";
import { PART_FRAMINGS, PART_NODES, T, TOUR_END } from "./graph";

export interface CameraState {
  scale: number;
  x: number;
  y: number;
}

interface CameraKey extends CameraState {
  frame: number;
}

/** Where the camera rests when the whole graph is the subject. */
const WIDE: CameraState = { scale: 0.56, x: 0, y: 0 };

/**
 * The camera pushes in on the guiding question, pulls back as the ring and
 * then the books arrive, and then tours the parts one at a time — each framed
 * on its own fan, so the covers are actually legible before it moves on.
 * Frames are graph-local.
 */
const buildKeys = (): CameraKey[] => {
  const keys: CameraKey[] = [
    { frame: 0, scale: 2.3, x: 0, y: 0 },
    { frame: T.superStart, scale: 2.15, x: 0, y: 0 },
    { frame: 150, scale: 1.05, x: 0, y: 0 },
    // The books land almost at once, so the pull-back to wide has to be there
    // to meet them rather than easing out over the fan.
    { frame: T.bookStart - 10, scale: 0.92, x: 0, y: 0 },
    { frame: T.bookStart + 26, ...WIDE },
    { frame: T.settleAt, ...WIDE },
  ];

  PART_FRAMINGS.forEach((framing, i) => {
    const segmentStart = T.tourStart + i * T.tourPerPart;
    keys.push({
      frame: segmentStart + T.tourTravel,
      scale: framing.scale,
      x: framing.x,
      y: framing.y,
    });
    keys.push({
      frame: segmentStart + T.tourPerPart - 4,
      scale: framing.scale,
      x: framing.x,
      y: framing.y,
    });
  });

  keys.push({ frame: TOUR_END + 46, ...WIDE });
  // A barely perceptible continued pull keeps the closing frames from feeling
  // frozen while the questions read over the top.
  keys.push({ frame: TOUR_END + 46 + 320, scale: 0.53, x: 0, y: 0 });

  return keys.sort((a, b) => a.frame - b.frame);
};

const KEYS = buildKeys();

export const sampleCamera = (frame: number): CameraState => {
  const first = KEYS[0];
  const last = KEYS[KEYS.length - 1];
  if (frame <= first.frame) return first;
  if (frame >= last.frame) return last;

  for (let i = 0; i < KEYS.length - 1; i += 1) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (frame < a.frame || frame > b.frame) continue;
    if (b.frame === a.frame) return b;

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

/** 0 while the whole graph is the subject, 1 while the camera is on one part. */
export const tourIntensity = (frame: number) =>
  interpolate(
    frame,
    [T.tourStart - 16, T.tourStart + 10, TOUR_END, TOUR_END + 30],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

export const partCount = PART_NODES.length;
