'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  },
  terminal: {
    surface: '#f0f0e0',
    panel: '#e8e8d8',
    ink: '#333333',
    muted: '#666666',
    edge: '#b8b8a8',
    ring: '#333333',
    focus: '#8b0000',
  },
};

/** Padding around the graph so covers never sit flush against the frame. */
const PAD = 70;
const VIEWBOX = GRAPH_EXTENT + PAD;

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 6;

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

export default function SyllabusGraph({ theme }: { theme: Theme }) {
  const palette = PALETTES[theme];
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [selection, setSelection] = useState<Selection | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const dragRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);

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

  const zoomBy = useCallback(
    (factor: number, origin?: { x: number; y: number }) => {
      setTransform((current) => {
        const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.k * factor));
        if (k === current.k) return current;
        // Keep whatever is under `origin` pinned while the scale changes.
        const at = origin ?? { x: 0, y: 0 };
        const graphX = (at.x - current.x) / current.k;
        const graphY = (at.y - current.y) / current.k;
        return { k, x: at.x - graphX * k, y: at.y - graphY * k };
      });
    },
    []
  );

  /** Centres the view on a point in graph space at the given zoom. */
  const focusOn = useCallback((x: number, y: number, k: number) => {
    setTransform({ k, x: -x * k, y: -y * k });
  }, []);

  const reset = useCallback(() => {
    setTransform({ x: 0, y: 0, k: 1 });
    setSelection(null);
  }, []);

  const selectPart = useCallback(
    (part: GraphPart) => {
      setSelection({ kind: 'part', id: part.id });
      focusOn(part.x * 1.12, part.y * 1.12, 1.9);
    },
    [focusOn]
  );

  const selectBook = useCallback(
    (book: GraphBook) => {
      setSelection({ kind: 'book', id: book.slug });
      focusOn(book.x, book.y, 2.05);
    },
    [focusOn]
  );

  // Wheel zoom has to be bound natively: React's onWheel is passive, so it
  // cannot preventDefault and the page would scroll instead of the graph.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const origin = toViewBox(event.clientX, event.clientY);
      zoomBy(event.deltaY < 0 ? 1.12 : 1 / 1.12, origin ?? undefined);
    };

    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [toViewBox, zoomBy]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelection(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    // Deliberately no setPointerCapture here. Capturing on pointerdown
    // retargets the subsequent click to the <svg>, so clicks would never reach
    // the node they landed on; capture is taken below, once a real drag starts.
    dragRef.current = { x: event.clientX, y: event.clientY, moved: false };
  };

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
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
    setTransform((current) => ({
      ...current,
      x: current.x + dx * unitsPerPixel,
      y: current.y + dy * unitsPerPixel,
    }));
  };

  const onPointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
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

  const dimmed = (partId: string) =>
    selectedPart !== null && selectedPart.id !== partId;

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

  // Labels sit on the radial edges. Painting a surface-coloured stroke beneath
  // the glyphs knocks the line out from behind the text instead of letting it
  // run through the words.
  const halo = {
    stroke: palette.surface,
    strokeWidth: 7,
    strokeLinejoin: 'round' as const,
    paintOrder: 'stroke' as const,
  };

  return (
    <div className="w-full">
      <p id="syllabus-graph-help" className="sr-only">
        An interactive map of the syllabus. The guiding question is at the
        centre, the seven parts ring it, and each reading connects to its part.
        Move through the parts and readings with the Tab key and open one with
        Enter. Press Escape to clear the current selection. Drag to pan and
        scroll to zoom. The same information is available as a list — use the
        List view button above the map — and as Markdown at /syllabus.md.
      </p>

      <div
        className="relative w-full overflow-hidden rounded-lg border"
        style={{
          background: palette.surface,
          borderColor: palette.edge,
          aspectRatio: '1 / 1',
          maxHeight: '78vh',
        }}
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
        >
          <g
            transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}
          >
            {/* Centre to each part */}
            {GRAPH_PARTS.map((part) => (
              <line
                key={`spine-${part.id}`}
                x1={0}
                y1={0}
                x2={part.x}
                y2={part.y}
                stroke={part.color}
                strokeWidth={2.5}
                opacity={dimmed(part.id) ? 0.12 : 0.55}
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
                stroke={book.color}
                strokeWidth={1.6}
                opacity={dimmed(book.partId) ? 0.1 : 0.45}
              />
            ))}

            {/* The guiding question */}
            <circle r={20} fill={palette.ring} />
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
              const isDim = dimmed(part.id);
              const isActive =
                selectedPart?.id === part.id || hovered === part.id;
              const lines = PART_LABEL_LINES.get(part.id) ?? [part.title];

              return (
                <g
                  key={part.id}
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
                  <circle
                    cx={part.x}
                    cy={part.y}
                    r={isActive ? 32 : 26}
                    fill={part.color}
                    stroke={palette.ring}
                    strokeWidth={isActive ? 4 : 2.5}
                  />
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
              const isDim = dimmed(book.partId);
              const isActive =
                selection?.kind === 'book' && selection.id === book.slug;
              const isHovered = hovered === book.slug;
              const lift = isActive || isHovered ? 6 : 0;

              return (
                <g
                  key={book.slug}
                  tabIndex={0}
                  role="button"
                  aria-label={`${book.title} by ${book.author}. ${book.partLabel}, ${
                    book.partTitle
                  }. ${getSyllabusStatusLabel(book.status).replace(/^\S+\s/, '')}.${
                    book.note ? ` ${book.note}` : ''
                  }`}
                  aria-pressed={isActive}
                  style={buttonStyle}
                  opacity={isDim ? 0.28 : 1}
                  onMouseEnter={() => setHovered(book.slug)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(book.slug)}
                  onBlur={() => setHovered(null)}
                  {...activate(() => selectBook(book))}
                >
                  <rect
                    x={book.x - BOOK_W / 2}
                    y={book.y - BOOK_H / 2 - lift}
                    width={BOOK_W}
                    height={BOOK_H}
                    fill={palette.panel}
                  />
                  {book.coverUrl ? (
                    <image
                      href={book.coverUrl}
                      x={book.x - BOOK_W / 2}
                      y={book.y - BOOK_H / 2 - lift}
                      width={BOOK_W}
                      height={BOOK_H}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  ) : null}
                  <rect
                    x={book.x - BOOK_W / 2}
                    y={book.y - BOOK_H / 2 - lift}
                    width={BOOK_W}
                    height={BOOK_H}
                    fill="none"
                    stroke={isActive || isHovered ? palette.ring : book.color}
                    strokeWidth={isActive ? 5 : isHovered ? 4 : 2.5}
                  />
                  {book.status === 'read' ? (
                    <circle
                      cx={book.x + BOOK_W / 2 - 11}
                      cy={book.y - BOOK_H / 2 - lift + 11}
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
          onZoomIn={() => zoomBy(1.3)}
          onZoomOut={() => zoomBy(1 / 1.3)}
          onReset={reset}
        />
      </div>

      <Legend
        palette={palette}
        selectedPartId={selectedPart?.id ?? null}
        onSelect={selectPart}
      />

      <DetailPanel
        palette={palette}
        book={selectedBook}
        part={selection?.kind === 'part' ? selectedPart : null}
        onClear={() => setSelection(null)}
      />
    </div>
  );
}

function GraphControls({
  palette,
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  palette: Palette;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  const style = {
    background: palette.surface,
    borderColor: palette.edge,
    color: palette.ink,
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
        className="h-9 w-9 rounded border text-xs font-bold leading-none"
        style={style}
      >
        ⤢
      </button>
    </div>
  );
}

/**
 * The legend is not decoration: four of the seven hues sit below 3:1 contrast
 * on these surfaces, so the palette is only legible paired with names. It
 * doubles as the fastest way to jump to a part.
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
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Parts of the syllabus">
      {GRAPH_PARTS.map((part) => {
        const isSelected = selectedPartId === part.id;
        return (
          <li key={part.id}>
            <button
              type="button"
              onClick={() => onSelect(part)}
              aria-pressed={isSelected}
              className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: isSelected ? palette.panel : palette.surface,
                borderColor: isSelected ? palette.focus : palette.edge,
                color: palette.ink,
              }}
            >
              <span
                aria-hidden="true"
                className="inline-block h-3 w-3 flex-shrink-0 rounded-full"
                style={{
                  background: part.color,
                  boxShadow: `0 0 0 1.5px ${palette.ring}`,
                }}
              />
              <span>
                {part.label} — {part.title}
              </span>
              <span style={{ color: palette.muted }}>({part.bookCount})</span>
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
  const shell =
    'mt-4 rounded-lg border p-4 sm:p-5 transition-colors';
  const shellStyle = {
    background: palette.panel,
    borderColor: palette.edge,
    color: palette.ink,
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
          style={{ borderColor: palette.edge, color: palette.muted }}
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
