// Pure layout and timing for the peg board. No three.js here, so it can be tested in Node.

/** Peg colours by the code letters used in the templates (the toy's own colours). */
export const PEG_COLORS = {
  R: '#ff2b2b', O: '#ff8c1a', Y: '#ffe41f', G: '#33d94a',
  B: '#2f7bff', V: '#9b51ff', P: '#ff4fb3', W: '#f2f2ff',
};
export const RAINBOW = ['R', 'O', 'Y', 'G', 'B', 'V', 'P'];

/** Distance between rows of the staggered grid, in hole widths. */
export const ROW_STEP = Math.sqrt(3) / 2;

/** Container width (px) at and above which all three covers share one board. */
export const WIDE_MIN = 640;

const FONT = {
  N: ['#...#', '#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '#.#.#', '.#.#.'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.####'],
  ' ': ['...', '...', '...', '...', '...', '...', '...'],
};

/** Small seeded random source, so a fill plays out the same way every time. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Template rows -> the holes that take a peg: [{ r, c, code }]. */
export function parseTemplate(rows) {
  const cells = [];
  rows.forEach((row, r) => {
    [...row].forEach((code, c) => {
      if (code !== '.') {
        if (!PEG_COLORS[code]) throw new Error(`Unknown peg code "${code}" at row ${r}, column ${c}`);
        cells.push({ r, c, code });
      }
    });
  });
  return cells;
}

function textCells(text) {
  const out = [];
  let x = 0;
  let letter = 0;
  for (const ch of text) {
    const glyph = FONT[ch];
    glyph.forEach((line, y) => [...line].forEach((v, dx) => v === '#' && out.push({ c: x + dx, r: y, letter })));
    x += glyph[0].length + 1;
    if (ch !== ' ') letter += 1;
  }
  return { cells: out, width: x - 1 };
}

/**
 * Lay the board out. Wide boards carry "NOW READING" across the top and all the
 * covers side by side; narrow boards hold one cover, and every cover shares it.
 * Positions are in hole widths, centred on the board, y pointing up.
 * Template rows land on board rows of the same parity, so the stagger matches.
 */
export function layoutBoard(templates, wide) {
  const coverCols = Math.max(...templates.map((t) => t[0].length));
  const coverRows = Math.max(...templates.map((t) => t.length));
  const margin = wide ? 3 : 2;
  const gap = 4;
  const header = wide ? textCells('NOW READING') : null;
  const top = wide ? 1 + 7 + 2 : margin;
  const cols = wide ? margin * 2 + coverCols * templates.length + gap * (templates.length - 1) : coverCols + margin * 2;
  const rows = top + coverRows + (wide ? 1 : margin);
  const even = (n) => n + (n % 2);
  const at = (c, r) => ({
    x: c + (r % 2 ? 0.5 : 0) - (cols - 0.5) / 2,
    y: ((rows - 1) * ROW_STEP) / 2 - r * ROW_STEP,
  });

  const holes = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) holes.push({ c, r, ...at(c, r) });

  const pegs = [];
  if (header) {
    const c0 = Math.floor((cols - header.width) / 2);
    for (const cell of header.cells) {
      const r = 1 + cell.r;
      pegs.push({ kind: 'header', book: -1, code: RAINBOW[cell.letter % RAINBOW.length], letter: cell.letter, c: c0 + cell.c, r, ...at(c0 + cell.c, r) });
    }
  }
  templates.forEach((rowsOfTemplate, book) => {
    const c0 = wide ? margin + book * (coverCols + gap) : margin;
    const r0 = even(top + Math.floor((coverRows - rowsOfTemplate.length) / 2));
    for (const cell of parseTemplate(rowsOfTemplate)) {
      const c = c0 + cell.c;
      const r = r0 + cell.r;
      pegs.push({ kind: 'cover', book, code: cell.code, tr: cell.r, tc: cell.c, c, r, ...at(c, r) });
    }
  });

  return {
    wide,
    cols,
    rows,
    width: cols + 0.5,
    height: (rows - 1) * ROW_STEP + 1,
    holes,
    pegs,
  };
}

/** Pegs whose holes lie within `radius` of (x, y), nearest first. */
export function clumpAt(pegs, x, y, radius, include = () => true) {
  const hits = [];
  pegs.forEach((p, i) => {
    if (!include(p, i)) return;
    const d = Math.hypot(p.x - x, p.y - y);
    if (d <= radius) hits.push({ i, d });
  });
  return hits.sort((a, b) => a.d - b.d);
}

/**
 * When each peg of a cover lights during a fill: one colour at a time, most
 * plentiful first, each colour sweeping diagonally from the top left, the way
 * you would work through a template. Returns delays in seconds, keyed by peg index.
 */
export function fillDelays(pegs, indices, duration, seed = 1) {
  const rand = mulberry32(seed);
  const counts = {};
  for (const i of indices) counts[pegs[i].code] = (counts[pegs[i].code] || 0) + 1;
  const order = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const per = duration / Math.max(1, order.length);
  const rows = Math.max(1, ...indices.map((i) => pegs[i].tr ?? pegs[i].r));
  const cols = Math.max(1, ...indices.map((i) => pegs[i].tc ?? pegs[i].c));
  const delays = new Map();
  for (const i of indices) {
    const p = pegs[i];
    const k = order.indexOf(p.code);
    const diag = ((p.tr ?? p.r) / rows + (p.tc ?? p.c) / cols) / 2;
    delays.set(i, k * per + diag * per * 0.85 + rand() * per * 0.15);
  }
  return delays;
}
