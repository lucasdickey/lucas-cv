'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BOOK_H,
  BOOK_W,
  GRAPH_BOOKS,
  GRAPH_EXTENT,
  GRAPH_PARTS,
  findCoverOverlaps,
  type GraphBook,
  type GraphPart,
} from '../lib/syllabusGraph';
import { syllabus, getSyllabusStatusLabel } from '../data/syllabus';

type Theme = 'marketer' | 'terminal';

interface Palette {
  surface: string;
  panel: string;
  ink: string;
  muted: string;
  edge: string;
  ring: string;
  focus: string;
  /**
   * Depth tokens. The graph used to be flat fills on a flat background; these
   * give it a stage to sit on. `stage*` are the three stops of the vignette
   * behind the map, `shadow` is the colour every drop shadow is mixed from,
   * and the `*Shadow` strings are the CSS elevations for the chrome around it.
   * They are held per theme rather than as alpha-over-white so the terminal
   * theme's shadows stay warm instead of turning grey.
   */
  stageInner: string;
  stageMid: string;
  stageOuter: string;
  shadow: string;
  cardShadow: string;
  chipShadow: string;
  frameShadow: string;
}

const PALETTES: Record<Theme, Palette> = {
  marketer: {
    surface: '#FFFFFF',
    panel: '#F4F5F7',
    ink: '#172B4D',
    muted: '#6B778C',
    edge: '#C1C7D0',
    ring: '#172B4D',
    focus: '#0052CC',
    stageInner: '#FFFFFF',
    stageMid: '#FAFBFC',
    stageOuter: '#EDF1F6',
    shadow: '#172B4D',
    cardShadow:
      '0 1px 1px rgba(23,43,77,0.06), 0 10px 24px -14px rgba(23,43,77,0.42)',
    chipShadow:
      '0 1px 1px rgba(23,43,77,0.05), 0 4px 8px -6px rgba(23,43,77,0.35)',
    frameShadow:
      '0 1px 2px rgba(23,43,77,0.07), 0 22px 44px -32px rgba(23,43,77,0.5)',
  },
  terminal: {
    surface: '#f0f0e0',
    panel: '#e8e8d8',
    ink: '#333333',
    muted: '#666666',
    edge: '#b8b8a8',
    ring: '#333333',
    focus: '#8b0000',
    stageInner: '#f7f7ea',
    stageMid: '#f0f0e0',
    stageOuter: '#e2e2ce',
    shadow: '#3d3d2b',
    cardShadow:
      '0 1px 1px rgba(61,61,43,0.08), 0 10px 24px -14px rgba(61,61,43,0.5)',
    chipShadow:
      '0 1px 1px rgba(61,61,43,0.07), 0 4px 8px -6px rgba(61,61,43,0.45)',
    frameShadow:
      '0 1px 2px rgba(61,61,43,0.09), 0 22px 44px -32px rgba(61,61,43,0.55)',
  },
};

/** Padding around the graph so covers never sit flush against the frame. */
const PAD = 70;
const VIEWBOX = GRAPH_EXTENT + PAD;

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 6;

const PART_ZOOM = 1.9;
const BOOK_ZOOM = 2.9;

/** How long the camera takes to glide between two views, in milliseconds. */
const GLIDE_MS = 520;

/** Radius of the ring the parts sit on, recovered from the built layout. */
const RING_R = Math.hypot(GRAPH_PARTS[0].x, GRAPH_PARTS[0].y);

/** Readings grouped by part, in fan order — the order arrow keys walk. */
const BOOKS_BY_PART = new Map<string, GraphBook[]>();
GRAPH_BOOKS.forEach((book) => {
  const siblings = BOOKS_BY_PART.get(book.partId);
  if (siblings) siblings.push(book);
  else BOOKS_BY_PART.set(book.partId, [book]);
});

/** Greedy wrap, so part titles can be laid out as tspans without measuring. */
function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const PART_LABEL_LINES = new Map(
  GRAPH_PARTS.map((part) => [part.id, wrap(part.title, 18)])
);

if (process.env.NODE_ENV !== 'production') {
  const clashes = findCoverOverlaps();
  if (clashes.length > 0) {
    console.warn(
      '[SyllabusGraph] Covers overlap — the layout constants in ' +
        'app/lib/syllabusGraph.ts need re-solving for the current syllabus:',
      clashes
    );
  }
}

interface Selection {
  kind: 'part' | 'book';
  id: string;
}

interface Camera {
  x: number;
  y: number;
  k: number;
}

/** Real acceleration and deceleration, so the camera reads as moving mass. */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ARROW_KEYS = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
]);

export default function SyllabusGraph({ theme }: { theme: Theme }) {
  const palette = PALETTES[theme];
  const svgRef = useRef<SVGSVGElement | null>(null);
  // useId can contain characters that are illegal in an XML id (React 19 wraps
  // it in guillemets), and these ids are referenced from url(#…).
  const uid = `syl${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const [transform, setTransform] = useState<Camera>({ x: 0, y: 0, k: 1 });
  const [selection, setSelection] = useState<Selection | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const dragRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const expandRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  // Live mirror of the camera, so a glide can read where it is starting from
  // without waiting for a render, and so each frame can hand the next one its
  // own output rather than a value React has not committed yet.
  const cameraRef = useRef<Camera>(transform);
  useEffect(() => {
    cameraRef.current = transform;
  }, [transform]);
  const glideRef = useRef<number | null>(null);

  // Every node keyed by `kind:id`, so arrow navigation can move DOM focus to
  // the node it just selected instead of leaving focus behind.
  const nodesRef = useRef(new Map<string, SVGGElement>());
  const nodeRefCallbacks = useRef(
    new Map<string, (el: SVGGElement | null) => void>()
  );
  // The callback per key has to be stable: a fresh closure every render would
  // detach and reattach all twenty-nine nodes on every frame of a glide.
  const registerNode = useCallback((key: string) => {
    const cached = nodeRefCallbacks.current.get(key);
    if (cached) return cached;
    const callback = (el: SVGGElement | null) => {
      if (el) nodesRef.current.set(key, el);
      else nodesRef.current.delete(key);
    };
    nodeRefCallbacks.current.set(key, callback);
    return callback;
  }, []);

  const selectedBook = useMemo(
    () =>
      selection?.kind === 'book'
        ? GRAPH_BOOKS.find((b) => b.slug === selection.id) ?? null
        : null,
    [selection]
  );
  const selectedPart = useMemo(() => {
    if (selection?.kind === 'part') {
      return GRAPH_PARTS.find((p) => p.id === selection.id) ?? null;
    }
    if (selectedBook) {
      return GRAPH_PARTS.find((p) => p.id === selectedBook.partId) ?? null;
    }
    return null;
  }, [selection, selectedBook]);

  /** Screen point -> untransformed viewBox coordinates. */
  const toViewBox = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const point = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: point.x, y: point.y };
  }, []);

  const stopGlide = useCallback(() => {
    if (glideRef.current !== null) {
      cancelAnimationFrame(glideRef.current);
      glideRef.current = null;
    }
  }, []);

  useEffect(() => stopGlide, [stopGlide]);

  const apply = useCallback((next: Camera) => {
    cameraRef.current = next;
    setTransform(next);
  }, []);

  /** Keep the graph within reach: panning can never lose it off-screen. */
  const clampPan = useCallback((next: Camera): Camera => {
    const limit = GRAPH_EXTENT * 1.1;
    const cx = Math.max(-limit, Math.min(limit, -next.x / next.k));
    const cy = Math.max(-limit, Math.min(limit, -next.y / next.k));
    return { k: next.k, x: -cx * next.k, y: -cy * next.k };
  }, []);

  const zoomBy = useCallback(
    (factor: number, origin?: { x: number; y: number }) => {
      stopGlide();
      const current = cameraRef.current;
      const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.k * factor));
      if (k === current.k) return;
      // Keep whatever is under `origin` pinned while the scale changes.
      const at = origin ?? { x: 0, y: 0 };
      const graphX = (at.x - current.x) / current.k;
      const graphY = (at.y - current.y) / current.k;
      apply({ k, x: at.x - graphX * k, y: at.y - graphY * k });
    },
    [apply, stopGlide]
  );

  const panBy = useCallback(
    (dx: number, dy: number) => {
      stopGlide();
      const current = cameraRef.current;
      apply(clampPan({ ...current, x: current.x + dx, y: current.y + dy }));
    },
    [apply, clampPan, stopGlide]
  );

  /**
   * Glide the camera so (x, y) in graph space ends up centred at scale k.
   *
   * The centre point is interpolated in graph space and the scale in log space
   * — a straight lerp on scale spends most of its time at the zoomed-in end and
   * reads as a lurch. Any glide already running is cancelled first, so a second
   * selection mid-flight redirects the camera rather than fighting it, and a
   * reader who has asked for reduced motion is simply put at the destination.
   */
  const glideTo = useCallback(
    (x: number, y: number, k: number) => {
      stopGlide();
      const target: Camera = { k, x: -x * k, y: -y * k };
      const from = cameraRef.current;
      const still =
        Math.abs(from.x - target.x) < 0.5 &&
        Math.abs(from.y - target.y) < 0.5 &&
        Math.abs(from.k - target.k) < 0.005;
      if (still || prefersReducedMotion()) {
        apply(target);
        return;
      }

      const fromCx = -from.x / from.k;
      const fromCy = -from.y / from.k;
      const start = performance.now();

      const step = (now: number) => {
        const p = Math.min(1, (now - start) / GLIDE_MS);
        if (p >= 1) {
          glideRef.current = null;
          apply(target);
          return;
        }
        const e = easeInOutCubic(p);
        const scale = from.k * Math.pow(k / from.k, e);
        const cx = fromCx + (x - fromCx) * e;
        const cy = fromCy + (y - fromCy) * e;
        apply({ k: scale, x: -cx * scale, y: -cy * scale });
        glideRef.current = requestAnimationFrame(step);
      };

      glideRef.current = requestAnimationFrame(step);
    },
    [apply, stopGlide]
  );

  const reset = useCallback(() => {
    setSelection(null);
    glideTo(0, 0, 1);
  }, [glideTo]);

  const selectPart = useCallback(
    (part: GraphPart) => {
      setSelection({ kind: 'part', id: part.id });
      glideTo(part.x * 1.12, part.y * 1.12, PART_ZOOM);
    },
    [glideTo]
  );

  const selectBook = useCallback(
    (book: GraphBook) => {
      setSelection({ kind: 'book', id: book.slug });
      glideTo(book.x, book.y, BOOK_ZOOM);
    },
    [glideTo]
  );

  /** Select and take focus with it, so keyboard and screen reader agree. */
  const moveTo = useCallback(
    (target: { kind: 'part'; node: GraphPart } | { kind: 'book'; node: GraphBook }) => {
      if (target.kind === 'part') {
        selectPart(target.node);
        nodesRef.current
          .get(`part:${target.node.id}`)
          ?.focus({ preventScroll: true });
      } else {
        selectBook(target.node);
        nodesRef.current
          .get(`book:${target.node.slug}`)
          ?.focus({ preventScroll: true });
      }
    },
    [selectBook, selectPart]
  );

  /**
   * Arrow keys walk the graph's own structure: sideways through a part's fan or
   * around the ring, up to a reading's part, down into a part's first reading.
   * Bound on the <svg> so it only fires while a node inside it holds focus, and
   * always swallowed so the page never scrolls out from under the map.
   */
  const onArrowKey = useCallback(
    (event: React.KeyboardEvent) => {
      if (!ARROW_KEYS.has(event.key)) return;
      const origin = (event.target as Element | null)?.closest?.(
        '[data-graph-node]'
      );
      if (!origin) return;
      event.preventDefault();
      event.stopPropagation();

      const kind = origin.getAttribute('data-node-kind');
      const id = origin.getAttribute('data-node-id') ?? '';

      if (kind === 'book') {
        const book = GRAPH_BOOKS.find((b) => b.slug === id);
        if (!book) return;
        if (event.key === 'ArrowUp') {
          const part = GRAPH_PARTS.find((p) => p.id === book.partId);
          if (part) moveTo({ kind: 'part', node: part });
          return;
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          const fan = BOOKS_BY_PART.get(book.partId) ?? [];
          if (fan.length < 2) return;
          const step = event.key === 'ArrowRight' ? 1 : -1;
          const next = fan[(book.indexInPart + step + fan.length) % fan.length];
          moveTo({ kind: 'book', node: next });
        }
        return;
      }

      if (kind === 'part') {
        const part = GRAPH_PARTS.find((p) => p.id === id);
        if (!part) return;
        if (event.key === 'ArrowDown') {
          const first = (BOOKS_BY_PART.get(part.id) ?? [])[0];
          if (first) moveTo({ kind: 'book', node: first });
          return;
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          const step = event.key === 'ArrowRight' ? 1 : -1;
          const n = GRAPH_PARTS.length;
          const next = GRAPH_PARTS[(part.index + step + n) % n];
          moveTo({ kind: 'part', node: next });
        }
      }
    },
    [moveTo]
  );

  // Wheel has to be bound natively: React's onWheel is passive, so it cannot
  // preventDefault, and the listener has to be rebound when `expanded` changes
  // because which gestures the graph is entitled to capture depends on it.
  //
  // Who owns the wheel depends on what the graph currently is. Inline it is a
  // preview embedded in a scrolling document — up to 78vh of it — so the
  // document owns a plain scroll: capturing it would stop the page dead under a
  // reader who is only trying to get past the map. Full screen the graph IS the
  // interaction mode, there is no page behind it, so it captures the wheel
  // outright and a two-finger swipe pans. ctrlKey is unambiguous in either mode
  // — it is how every browser reports a trackpad pinch, and what ctrl/cmd+
  // scroll sends — so it always zooms, because the alternative is the browser
  // zooming the whole page instead.
  //
  // Do not simplify this to an unconditional preventDefault: that is the
  // scroll-jack this replaced, and it looks like dead weight until you scroll a
  // phone-width page down through the graph.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (event: WheelEvent) => {
      // deltaMode 1 counts lines, 2 counts pages; normalise to pixels.
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1;
      const dx = event.deltaX * unit;
      const dy = event.deltaY * unit;

      if (event.ctrlKey) {
        event.preventDefault();
        const factor = Math.min(2.5, Math.max(0.4, Math.exp(-dy * 0.0025)));
        const origin = toViewBox(event.clientX, event.clientY);
        zoomBy(factor, origin ?? undefined);
        return;
      }

      if (!expanded) return;

      event.preventDefault();
      const ctm = svg.getScreenCTM();
      const unitsPerPixel = ctm ? 1 / ctm.a : 1;
      // Scrolling down carries the viewport down the canvas, so the content
      // moves up: the sign is inverted, and deltaX counts as much as deltaY.
      panBy(-dx * unitsPerPixel, -dy * unitsPerPixel);
    };

    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [expanded, panBy, toViewBox, zoomBy]);

  // Escape peels one layer at a time: a selection first, then full screen.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (selection) setSelection(null);
      else if (expanded) setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selection, expanded]);

  // While the graph is full screen it is a modal: the page behind must not
  // scroll, focus starts inside it, Tab cycles within it, and closing hands
  // focus back to the control that opened it.
  useEffect(() => {
    if (!expanded) {
      expandRef.current?.focus();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !shellRef.current) return;
      const items = Array.from(
        shellRef.current.querySelectorAll<HTMLElement | SVGElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])'
        )
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        (last as HTMLElement).focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        (first as HTMLElement).focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
    // Focusing the opener on collapse should not run on first mount, but the
    // cost of it doing so is nil: the button is already where focus belongs.
  }, [expanded]);

  // Full screen in portrait, the details sit below the legend and off the
  // bottom of the panel — a selection nobody can read is not a selection.
  // `nearest` is deliberate: in the landscape rail the card is already in view,
  // so this does nothing there.
  useEffect(() => {
    if (!expanded || !selection) return;
    detailRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [expanded, selection]);

  // Live pointers, so two fingers can pinch. A single pointer never reaches
  // size 2, so mouse dragging behaves exactly as it did before.
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; x: number; y: number } | null>(null);

  const pinchState = () => {
    const points = Array.from(pointersRef.current.values());
    if (points.length < 2) return null;
    const [a, b] = points;
    return {
      dist: Math.hypot(a.x - b.x, a.y - b.y),
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    };
  };

  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    // Only touch and pen are tracked. A mouse cannot pinch, and a mouse that is
    // released outside the svg never delivers its pointerup here — tracking it
    // would leave a phantom finger down and turn the next click into a pinch.
    if (event.pointerType !== 'mouse') {
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
    }
    if (pointersRef.current.size >= 2) {
      // A second finger turns the gesture into a pinch, not a drag.
      dragRef.current = null;
      pinchRef.current = pinchState();
      return;
    }
    stopGlide();
    // Deliberately no setPointerCapture here. Capturing on pointerdown
    // retargets the subsequent click to the <svg>, so clicks would never reach
    // the node they landed on; capture is taken below, once a real drag starts.
    dragRef.current = { x: event.clientX, y: event.clientY, moved: false };
  };

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (pointersRef.current.has(event.pointerId)) {
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
    }

    const previous = pinchRef.current;
    if (previous) {
      const now = pinchState();
      if (!now) return;
      pinchRef.current = now;
      const ctm = svgRef.current?.getScreenCTM();
      const unitsPerPixel = ctm ? 1 / ctm.a : 1;
      panBy((now.x - previous.x) * unitsPerPixel, (now.y - previous.y) * unitsPerPixel);
      if (previous.dist > 0 && now.dist > 0) {
        const origin = toViewBox(now.x, now.y);
        zoomBy(now.dist / previous.dist, origin ?? undefined);
      }
      return;
    }

    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;

    if (!drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const ctm = svgRef.current?.getScreenCTM();
    // One screen pixel is 1/ctm.a viewBox units, whatever the element's size.
    const unitsPerPixel = ctm ? 1 / ctm.a : 1;
    drag.x = event.clientX;
    drag.y = event.clientY;
    panBy(dx * unitsPerPixel, dy * unitsPerPixel);
  };

  const onPointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    const drag = dragRef.current;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    // A drag that never moved is a click on the background: clear selection.
    if (drag && !drag.moved && event.target === svgRef.current) {
      setSelection(null);
    }
  };

  /** Another part than the one in focus — the deepest level of dimming. */
  const otherPart = (partId: string) =>
    selectedPart !== null && selectedPart.id !== partId;

  /**
   * With a single reading selected its own siblings recede too, not just the
   * other parts: one book selected should read as one book, with its fan as
   * context rather than as competition.
   */
  const bookOpacity = (book: GraphBook) => {
    if (otherPart(book.partId)) return 0.22;
    if (selectedBook && selectedBook.slug !== book.slug) return 0.42;
    return 1;
  };

  const twigOpacity = (book: GraphBook) => {
    if (otherPart(book.partId)) return 0.1;
    if (selectedBook && selectedBook.slug !== book.slug) return 0.28;
    return 0.85;
  };

  const activate = (handler: () => void) => ({
    onClick: (event: React.MouseEvent) => {
      event.stopPropagation();
      handler();
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        handler();
      }
    },
  });

  const buttonStyle = { cursor: 'pointer', outline: 'none' } as const;

  // Labels sit on the radial edges. Painting a stage-coloured stroke beneath
  // the glyphs knocks the line out from behind the text instead of letting it
  // run through the words. It is the lightest stop of the vignette, so near the
  // rim the halo also lifts the label off the darker ground.
  const halo = {
    stroke: palette.stageInner,
    strokeWidth: 7,
    strokeLinejoin: 'round' as const,
    paintOrder: 'stroke' as const,
  };

  const glowColor = selectedBook?.color ?? selectedPart?.color ?? palette.focus;

  return (
    <div
      ref={shellRef}
      className={expanded ? 'fixed inset-0 z-[100] flex flex-col' : 'w-full'}
      style={expanded ? { background: palette.surface } : undefined}
      role={expanded ? 'dialog' : undefined}
      aria-modal={expanded ? true : undefined}
      aria-label={expanded ? 'Syllabus knowledge graph, full screen' : undefined}
    >
      {expanded ? (
        <div
          className="flex flex-shrink-0 items-center justify-between border-b px-4 py-3"
          style={{
            borderColor: palette.edge,
            background: palette.surface,
            boxShadow: palette.chipShadow,
          }}
        >
          <span className="text-sm font-bold" style={{ color: palette.ink }}>
            {syllabus.title}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setExpanded(false)}
            className="rounded border px-3 py-1.5 text-sm font-medium"
            style={{
              borderColor: palette.edge,
              color: palette.ink,
              background: palette.panel,
              boxShadow: palette.chipShadow,
            }}
          >
            Close
          </button>
        </div>
      ) : null}

      <p id="syllabus-graph-help" className="sr-only">
        An interactive map of the syllabus. The guiding question is at the
        centre, the seven parts ring it, and each reading connects to its part.
        Move through the parts and readings with the Tab key and open one with
        Enter. With a reading in focus, the left and right arrow keys move
        between the readings of that part and the up arrow moves to the part
        itself; with a part in focus, left and right move around the ring of
        parts and the down arrow moves into that part&apos;s first reading. Drag
        to pan, and pinch or hold control while scrolling to zoom; full screen,
        a two-finger scroll pans as well. Use the full screen button to open the
        map at the size of the window, which is easier to read on a phone. Escape clears the current
        selection, then leaves full screen. The same information is available as
        a list — use the List view button above the map — and as Markdown at
        /syllabus.md.
      </p>

      <div
        className={
          expanded ? 'flex min-h-0 flex-1 flex-col landscape:flex-row' : undefined
        }
      >
        <div
          className={
            expanded
              ? 'relative min-h-0 w-full flex-1 overflow-hidden'
              : 'relative w-full overflow-hidden rounded-lg border'
          }
          style={
            expanded
              ? { background: palette.stageOuter }
              : {
                  background: palette.stageOuter,
                  borderColor: palette.edge,
                  boxShadow: palette.frameShadow,
                  aspectRatio: '1 / 1',
                  maxHeight: '78vh',
                }
          }
        >
          <svg
            ref={svgRef}
            viewBox={`${-VIEWBOX} ${-VIEWBOX} ${VIEWBOX * 2} ${VIEWBOX * 2}`}
            className="h-full w-full touch-none"
            style={{ cursor: dragRef.current?.moved ? 'grabbing' : 'grab' }}
            role="group"
            aria-label="Syllabus knowledge graph"
            aria-describedby="syllabus-graph-help"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onArrowKey}
          >
            <defs>
              {/* The stage the graph sits on: lightest under the guiding
                  question, deepest at the rim. Painted outside the pan/zoom
                  group so the light stays put while the map moves. */}
              <radialGradient
                id={`${uid}-stage`}
                gradientUnits="userSpaceOnUse"
                cx={0}
                cy={0}
                r={VIEWBOX * 1.05}
              >
                <stop offset="0" stopColor={palette.stageInner} />
                <stop offset="0.55" stopColor={palette.stageMid} />
                <stop offset="1" stopColor={palette.stageOuter} />
              </radialGradient>

              <radialGradient
                id={`${uid}-core`}
                gradientUnits="userSpaceOnUse"
                cx={0}
                cy={0}
                r={92}
              >
                <stop offset="0" stopColor={palette.ring} stopOpacity={0.13} />
                <stop offset="0.55" stopColor={palette.ring} stopOpacity={0.05} />
                <stop offset="1" stopColor={palette.ring} stopOpacity={0} />
              </radialGradient>

              {/* Contact shadow under each cover. A gradient rather than a blur
                  filter: one of these per reading costs nothing to rasterise
                  while the camera is moving. */}
              <linearGradient id={`${uid}-shelf`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={palette.shadow} stopOpacity={0.3} />
                <stop offset="0.6" stopColor={palette.shadow} stopOpacity={0.08} />
                <stop offset="1" stopColor={palette.shadow} stopOpacity={0} />
              </linearGradient>

              {/* Spines run heavy and neutral at the hub, resolving into the
                  part's own hue by the time they reach it. */}
              {GRAPH_PARTS.map((part) => (
                <linearGradient
                  key={part.id}
                  id={`${uid}-spine-${part.id}`}
                  gradientUnits="userSpaceOnUse"
                  x1={0}
                  y1={0}
                  x2={part.x}
                  y2={part.y}
                >
                  <stop offset="0" stopColor={palette.ring} stopOpacity={0.5} />
                  <stop offset="1" stopColor={part.color} stopOpacity={1} />
                </linearGradient>
              ))}

              {/* Twigs fade outwards, so the eye reads the hierarchy as depth
                  rather than as one flat mesh. */}
              {GRAPH_BOOKS.map((book) => (
                <linearGradient
                  key={book.slug}
                  id={`${uid}-twig-${book.slug}`}
                  gradientUnits="userSpaceOnUse"
                  x1={book.parentX}
                  y1={book.parentY}
                  x2={book.x}
                  y2={book.y}
                >
                  <stop offset="0" stopColor={book.color} stopOpacity={0.95} />
                  <stop offset="1" stopColor={book.color} stopOpacity={0.3} />
                </linearGradient>
              ))}

              <filter
                id={`${uid}-glow`}
                x="-75%"
                y="-75%"
                width="250%"
                height="250%"
              >
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="9"
                  floodColor={glowColor}
                  floodOpacity="0.55"
                />
              </filter>
            </defs>

            <rect
              x={-VIEWBOX * 3}
              y={-VIEWBOX * 3}
              width={VIEWBOX * 6}
              height={VIEWBOX * 6}
              fill={`url(#${uid}-stage)`}
            />

            <g
              transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}
            >
              {/* The ring the parts sit on, drawn as a hairline so the graph
                  reads as a structure and not seven loose spokes. */}
              <circle
                cx={0}
                cy={0}
                r={RING_R}
                fill="none"
                stroke={palette.edge}
                strokeWidth={1.25}
                strokeDasharray="2 10"
                strokeLinecap="round"
                opacity={0.9}
              />

              {/* Centre to each part */}
              {GRAPH_PARTS.map((part) => (
                <line
                  key={`spine-${part.id}`}
                  x1={0}
                  y1={0}
                  x2={part.x}
                  y2={part.y}
                  stroke={`url(#${uid}-spine-${part.id})`}
                  strokeWidth={selectedPart?.id === part.id ? 4.4 : 3.4}
                  strokeLinecap="round"
                  opacity={otherPart(part.id) ? 0.12 : 0.8}
                />
              ))}

              {/* Each part to its readings */}
              {GRAPH_BOOKS.map((book) => (
                <line
                  key={`edge-${book.slug}`}
                  x1={book.parentX}
                  y1={book.parentY}
                  x2={book.x}
                  y2={book.y}
                  stroke={`url(#${uid}-twig-${book.slug})`}
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  opacity={twigOpacity(book)}
                />
              ))}

              {/* The guiding question */}
              <circle r={92} fill={`url(#${uid}-core)`} />
              <circle
                r={31}
                fill="none"
                stroke={palette.ring}
                strokeWidth={1}
                opacity={0.35}
              />
              <circle r={20} fill={palette.ring} />
              <circle r={20} fill="none" stroke={palette.stageInner} strokeWidth={2} opacity={0.35} />
              <text
                x={0}
                y={46}
                textAnchor="middle"
                fontSize={17}
                fontWeight={700}
                letterSpacing={2.4}
                fill={palette.muted}
                {...halo}
              >
                <tspan x={0} dy={0}>
                  THE GUIDING
                </tspan>
                <tspan x={0} dy={21}>
                  QUESTION
                </tspan>
              </text>

              {GRAPH_PARTS.map((part) => {
                const inward = 112;
                const hyp = Math.hypot(part.x, part.y) || 1;
                const lx = part.x - (inward * part.x) / hyp;
                const ly = part.y - (inward * part.y) / hyp;
                const isDim = otherPart(part.id);
                const isSelected =
                  selection?.kind === 'part' && selection.id === part.id;
                const isActive = isSelected || hovered === part.id;
                const lines = PART_LABEL_LINES.get(part.id) ?? [part.title];

                return (
                  <g
                    key={part.id}
                    ref={registerNode(`part:${part.id}`)}
                    data-graph-node=""
                    data-node-kind="part"
                    data-node-id={part.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`${part.label}, ${part.title}. ${part.bookCount} readings. ${part.summary}`}
                    aria-pressed={selectedPart?.id === part.id}
                    style={buttonStyle}
                    opacity={isDim ? 0.3 : 1}
                    onMouseEnter={() => setHovered(part.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(part.id)}
                    onBlur={() => setHovered(null)}
                    {...activate(() => selectPart(part))}
                  >
                    <g filter={isSelected ? `url(#${uid}-glow)` : undefined}>
                      <circle
                        cx={part.x}
                        cy={part.y}
                        r={isActive ? 32 : 26}
                        fill={part.color}
                        stroke={palette.ring}
                        strokeWidth={isActive ? 4 : 2.5}
                      />
                      {/* A hairline inside the ring: two weights of line read as
                          a lit edge without touching the ring's contrast. */}
                      <circle
                        cx={part.x}
                        cy={part.y}
                        r={isActive ? 28.5 : 23.4}
                        fill="none"
                        stroke={palette.stageInner}
                        strokeWidth={1}
                        opacity={0.4}
                      />
                    </g>
                    <text
                      x={lx}
                      y={ly - (lines.length - 1) * 10}
                      textAnchor="middle"
                      fontSize={17}
                      fontWeight={700}
                      letterSpacing={2.2}
                      fill={palette.muted}
                      {...halo}
                    >
                      {part.label.toUpperCase()}
                    </text>
                    <text
                      x={lx}
                      y={ly - (lines.length - 1) * 10 + 25}
                      textAnchor="middle"
                      fontSize={22}
                      fontWeight={700}
                      fill={palette.ink}
                      {...halo}
                    >
                      {lines.map((line, i) => (
                        <tspan key={line} x={lx} dy={i === 0 ? 0 : 24}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}

              {GRAPH_BOOKS.map((book) => {
                const isActive =
                  selection?.kind === 'book' && selection.id === book.slug;
                const isHovered = hovered === book.slug;
                const lift = isActive || isHovered ? 6 : 0;
                const top = book.y - BOOK_H / 2 - lift;

                return (
                  <g
                    key={book.slug}
                    ref={registerNode(`book:${book.slug}`)}
                    data-graph-node=""
                    data-node-kind="book"
                    data-node-id={book.slug}
                    tabIndex={0}
                    role="button"
                    aria-label={`${book.title} by ${book.author}. ${
                      book.partLabel
                    }, ${book.partTitle}. ${getSyllabusStatusLabel(
                      book.status
                    ).replace(/^\S+\s/, '')}.${book.note ? ` ${book.note}` : ''}`}
                    aria-pressed={isActive}
                    style={buttonStyle}
                    opacity={bookOpacity(book)}
                    onMouseEnter={() => setHovered(book.slug)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(book.slug)}
                    onBlur={() => setHovered(null)}
                    {...activate(() => selectBook(book))}
                  >
                    {/* Contact shadow: the cover sits on the stage rather than
                        being printed on it, and lifts further when active. */}
                    <rect
                      x={book.x - BOOK_W / 2 + 4}
                      y={top + BOOK_H - 1}
                      width={BOOK_W - 8}
                      height={lift ? 22 : 13}
                      fill={`url(#${uid}-shelf)`}
                    />
                    <g filter={isActive ? `url(#${uid}-glow)` : undefined}>
                      <rect
                        x={book.x - BOOK_W / 2}
                        y={top}
                        width={BOOK_W}
                        height={BOOK_H}
                        fill={palette.panel}
                      />
                      {book.coverUrl ? (
                        <image
                          href={book.coverUrl}
                          x={book.x - BOOK_W / 2}
                          y={top}
                          width={BOOK_W}
                          height={BOOK_H}
                          preserveAspectRatio="xMidYMid slice"
                        />
                      ) : null}
                      <rect
                        x={book.x - BOOK_W / 2}
                        y={top}
                        width={BOOK_W}
                        height={BOOK_H}
                        fill="none"
                        stroke={isActive || isHovered ? palette.ring : book.color}
                        strokeWidth={isActive ? 5 : isHovered ? 4 : 2.5}
                      />
                      {/* Spine highlight down the left edge of the cover. */}
                      <rect
                        x={book.x - BOOK_W / 2 + 2}
                        y={top + 2}
                        width={3}
                        height={BOOK_H - 4}
                        fill={palette.stageInner}
                        opacity={0.22}
                      />
                    </g>
                    {book.status === 'read' ? (
                      <circle
                        cx={book.x + BOOK_W / 2 - 11}
                        cy={top + 11}
                        r={7}
                        fill={book.color}
                        stroke={palette.surface}
                        strokeWidth={2.5}
                      />
                    ) : null}
                  </g>
                );
              })}
            </g>
          </svg>

          <GraphControls
            palette={palette}
            expanded={expanded}
            expandRef={expandRef}
            onZoomIn={() => zoomBy(1.3)}
            onZoomOut={() => zoomBy(1 / 1.3)}
            onReset={reset}
            onToggleExpand={() => setExpanded((open) => !open)}
          />
        </div>

        {/* Full screen, the legend and details sit under the map in portrait and
            beside it in landscape. The graph is a circle, so it is limited by the
            shorter side of its box: stacking them in a wide window would leave
            the map small with empty space either side of it. */}
        <div
          className={
            expanded
              ? 'max-h-[38vh] flex-shrink-0 overflow-y-auto border-t px-4 pb-4 landscape:max-h-none landscape:w-[22rem] landscape:border-l landscape:border-t-0 landscape:pt-4'
              : undefined
          }
          // The height cap is a class, not an inline style, so the landscape
          // variant can lift it — an inline style would win over the variant.
          style={
            expanded
              ? { borderColor: palette.edge, background: palette.surface }
              : undefined
          }
        >
          <Legend
            palette={palette}
            selectedPartId={selectedPart?.id ?? null}
            onSelect={selectPart}
          />

          <div ref={detailRef}>
            <DetailPanel
              palette={palette}
              book={selectedBook}
              part={selection?.kind === 'part' ? selectedPart : null}
              onClear={() => setSelection(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GraphControls({
  palette,
  expanded,
  expandRef,
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleExpand,
}: {
  palette: Palette;
  expanded: boolean;
  expandRef: React.RefObject<HTMLButtonElement | null>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleExpand: () => void;
}) {
  const style = {
    background: palette.surface,
    borderColor: palette.edge,
    color: palette.ink,
    boxShadow: palette.chipShadow,
  };
  return (
    <div className="absolute right-3 top-3 flex flex-col gap-1">
      <button
        type="button"
        onClick={onZoomIn}
        aria-label="Zoom in"
        className="h-9 w-9 rounded border text-lg font-bold leading-none"
        style={style}
      >
        +
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        aria-label="Zoom out"
        className="h-9 w-9 rounded border text-lg font-bold leading-none"
        style={style}
      >
        −
      </button>
      <button
        type="button"
        onClick={onReset}
        aria-label="Reset the view"
        title="Reset the view"
        className="h-9 w-9 rounded border text-base font-bold leading-none"
        style={style}
      >
        ↺
      </button>
      <button
        ref={expandRef}
        type="button"
        onClick={onToggleExpand}
        aria-label={expanded ? 'Exit full screen' : 'Open the graph full screen'}
        aria-expanded={expanded}
        title={expanded ? 'Exit full screen' : 'Open full screen'}
        className="h-9 w-9 rounded border text-base font-bold leading-none"
        style={style}
      >
        {expanded ? '⤡' : '⤢'}
      </button>
    </div>
  );
}

/**
 * The legend is not decoration: four of the seven hues sit below 3:1 contrast
 * on these surfaces, so the palette is only legible paired with names. It
 * doubles as the fastest way to jump to a part.
 *
 * Laid out as a column-fitting grid rather than a wrapping flex row: every chip
 * is the same width, the swatch and the count hold the same two columns down
 * the list, and a title that needs two lines wraps against a left margin
 * instead of centring itself under the first line.
 */
function Legend({
  palette,
  selectedPartId,
  onSelect,
}: {
  palette: Palette;
  selectedPartId: string | null;
  onSelect: (part: GraphPart) => void;
}) {
  return (
    <ul
      className="mt-4 grid gap-2"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))' }}
      aria-label="Parts of the syllabus"
    >
      {GRAPH_PARTS.map((part) => {
        const isSelected = selectedPartId === part.id;
        return (
          <li key={part.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onSelect(part)}
              aria-pressed={isSelected}
              className="grid h-full w-full grid-cols-[auto_1fr_auto] items-start gap-x-2 rounded-md border px-3 py-2 text-left text-xs font-medium transition-colors"
              style={{
                background: isSelected ? palette.panel : palette.surface,
                borderColor: isSelected ? palette.focus : palette.edge,
                color: palette.ink,
                boxShadow: isSelected
                  ? `inset 0 0 0 1px ${palette.focus}`
                  : palette.chipShadow,
              }}
            >
              <span
                aria-hidden="true"
                className="inline-block h-3 w-3 flex-shrink-0 rounded-full"
                style={{
                  marginTop: '2px',
                  background: part.color,
                  boxShadow: `0 0 0 1.5px ${palette.ring}`,
                }}
              />
              <span className="min-w-0 leading-snug">
                {part.label} — {part.title}
              </span>
              <span
                className="tabular-nums leading-snug"
                style={{ color: palette.muted }}
              >
                ({part.bookCount})
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function DetailPanel({
  palette,
  book,
  part,
  onClear,
}: {
  palette: Palette;
  book: GraphBook | null;
  part: GraphPart | null;
  onClear: () => void;
}) {
  const shell = 'mt-4 rounded-lg border p-4 sm:p-5 transition-colors';
  const accent = book?.color ?? part?.color;
  const shellStyle = {
    background: palette.panel,
    borderColor: palette.edge,
    color: palette.ink,
    boxShadow: palette.cardShadow,
    ...(accent ? { borderLeft: `3px solid ${accent}` } : null),
  };

  if (!book && !part) {
    return (
      <div className={shell} style={shellStyle} aria-live="polite">
        <p className="text-sm" style={{ color: palette.muted }}>
          Select a part or a reading on the map to see its details. The centre
          node is the question the whole syllabus is built around:{' '}
          <span style={{ color: palette.ink }}>
            {syllabus.missingBook.question}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className={shell} style={shellStyle} aria-live="polite">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div
            className="mb-1 text-xs font-bold uppercase tracking-widest"
            style={{ color: book?.color ?? part?.color }}
          >
            {book ? `${book.partLabel} — ${book.partTitle}` : part?.label}
          </div>
          <h3 className="text-lg font-bold leading-tight">
            {book ? book.title : part?.title}
          </h3>
          {book ? (
            <p className="mt-1 text-sm" style={{ color: palette.muted }}>
              {book.author} · {getSyllabusStatusLabel(book.status)}
              {book.orderIndex ? ` · #${book.orderIndex} in reading order` : ''}
            </p>
          ) : (
            <p className="mt-1 text-sm" style={{ color: palette.muted }}>
              {part?.bookCount} readings
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClear}
          className="flex-shrink-0 rounded border px-2 py-1 text-xs"
          style={{
            borderColor: palette.edge,
            color: palette.muted,
            background: palette.surface,
          }}
        >
          Clear
        </button>
      </div>

      {book?.note ? (
        <p className="mt-3 text-sm leading-relaxed">{book.note}</p>
      ) : null}
      {part ? <p className="mt-3 text-sm leading-relaxed">{part.summary}</p> : null}

      {book?.href ? (
        <a
          href={book.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-medium underline"
          style={{ color: palette.focus }}
        >
          Find this book →
        </a>
      ) : null}
    </div>
  );
}
