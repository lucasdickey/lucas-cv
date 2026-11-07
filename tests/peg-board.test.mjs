import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PEG_COLORS, ROW_STEP, layoutBoard, parseTemplate, clumpAt, fillDelays } from '../public/peg-board/logic.js';

// The templates live in a TypeScript data file; read their rows out as text.
const source = fs.readFileSync(new URL('../app/data/pegBoard.ts', import.meta.url), 'utf8');
const templates = [...source.matchAll(/template: \[([\s\S]*?)\]/g)].map((m) => [...m[1].matchAll(/"([^"]*)"/g)].map((r) => r[1]));

test('every template is a clean grid of known peg codes', () => {
  assert.equal(templates.length, 3);
  for (const rows of templates) {
    assert.ok(rows.length >= 30, 'tall enough to read as a cover');
    const width = rows[0].length;
    for (const row of rows) {
      assert.equal(row.length, width, `ragged row: ${row}`);
      for (const code of row) assert.ok(code === '.' || PEG_COLORS[code], `unknown code ${code}`);
    }
    assert.ok(parseTemplate(rows).length > rows.length * width * 0.3, 'mostly pegs, not holes');
  }
  assert.throws(() => parseTemplate(['RX']), /Unknown peg code "X"/);
});

for (const wide of [true, false]) {
  test(`${wide ? 'wide' : 'narrow'} layout keeps every peg on its own hole, inside the board, on the right stagger`, () => {
    const board = layoutBoard(templates, wide);
    const holes = new Set(board.holes.map((h) => `${h.c},${h.r}`));
    const seen = new Set();
    for (const p of board.pegs) {
      const key = `${p.book},${p.c},${p.r}`;
      assert.ok(holes.has(`${p.c},${p.r}`), `peg off the board at ${key}`);
      assert.ok(!seen.has(key), `two pegs share a hole at ${key}`);
      seen.add(key);
      if (p.kind === 'cover') assert.equal((p.r - p.tr) % 2, 0, 'template rows keep their stagger');
      assert.ok(Math.abs(p.x) <= board.width / 2 && Math.abs(p.y) <= board.height / 2);
    }
    // Centred: the outermost holes are equally far from the middle.
    const xs = board.holes.map((h) => h.x);
    const ys = board.holes.map((h) => h.y);
    assert.ok(Math.abs(Math.min(...xs) + Math.max(...xs)) < 1e-9);
    assert.ok(Math.abs(Math.min(...ys) + Math.max(...ys)) < 1e-9);
    assert.ok(Math.abs(board.height - ((board.rows - 1) * ROW_STEP + 1)) < 1e-9);
    assert.equal(board.pegs.some((p) => p.kind === 'header'), wide);
  });
}

test('the wide board spells NOW READING in rainbow pegs, one colour per letter', () => {
  const header = layoutBoard(templates, true).pegs.filter((p) => p.kind === 'header');
  const letters = [...new Set(header.map((p) => p.letter))];
  assert.equal(letters.length, 10); // N O W R E A D I N G, the space takes no pegs
  assert.equal(header.find((p) => p.letter === 0).code, 'R');
  assert.equal(header.find((p) => p.letter === 1).code, 'O');
});

test('a tap gathers the pegs within reach, nearest first', () => {
  const board = layoutBoard(templates, false);
  const covers = board.pegs.filter((p) => p.book === 0);
  const target = covers[Math.floor(covers.length / 2)];
  const clump = clumpAt(board.pegs, target.x, target.y, 2.5, (p) => p.book === 0);
  assert.ok(clump.length >= 12 && clump.length <= 30, `clump of ${clump.length}`);
  assert.equal(board.pegs[clump[0].i], target);
  for (let k = 1; k < clump.length; k++) assert.ok(clump[k].d >= clump[k - 1].d);
  assert.ok(clump.every(({ i }) => board.pegs[i].book === 0));
});

test('a fill lights one colour after another, all within its time', () => {
  const board = layoutBoard(templates, true);
  const indices = board.pegs.map((p, i) => (p.book === 1 ? i : -1)).filter((i) => i >= 0);
  const delays = fillDelays(board.pegs, indices, 2.4, 7);
  assert.equal(delays.size, indices.length);
  for (const d of delays.values()) assert.ok(d >= 0 && d <= 2.4);
  // The most common colour (blue on this cover) starts before the rarest one (white) finishes.
  const by = (code) => indices.filter((i) => board.pegs[i].code === code).map((i) => delays.get(i));
  assert.ok(Math.min(...by('B')) < Math.min(...by('W')));
  assert.deepEqual([...fillDelays(board.pegs, indices, 2.4, 7)], [...delays], 'same seed, same fill');
});
