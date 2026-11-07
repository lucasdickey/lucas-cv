"""Turn book covers into peg-board templates for app/data/pegBoard.ts.

usage: python3 -I scripts/peg-board/make_templates.py [preview.png]

Each cover becomes rows of code letters, the way the toy's printed template sheets
mark which colour goes in each hole: R O Y G B V P W, and "." for an empty hole.
Odd rows sit half a hole to the right (the board's staggered grid). Colours snap
to a short per-cover list with no dithering, then a cleanup pass replaces lone
pegs with what surrounds them, so the pictures read as bold shapes. The output is
a starting point: tidy it by hand in pegBoard.ts if a shape needs help.
"""
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
COLS = 22
ROW_STEP = 3 ** 0.5 / 2  # row spacing of the staggered grid, in hole widths

PEGS = {
    "R": (255, 43, 43), "O": (255, 140, 26), "Y": (255, 228, 31), "G": (51, 217, 74),
    "B": (47, 123, 255), "V": (155, 81, 255), "P": (255, 79, 179), "W": (242, 242, 255),
}

COVERS = [
    # (cover file, colours allowed, options, touch-ups)
    ("the-adventures-of-amina-al-sirafi.jpg", "YBWPV", dict(sat=1.5, dark=0.13), []),
    ("the-worldly-philosophers.jpg", "RBW", dict(sat=1.3, dark=0.20, grey_to="B", grey_chroma=40, grey_below=0.78), [
        # Type is too small to spell at this size, so suggest it the way peg templates do:
        # short white bars with word gaps. Author across the top panel...
        ("fill", (3, 4), [(1, 6), (8, 9), (11, 20)], "W"),
        # ...and the two-line title in the red band (plus one stray hole at its edge).
        ("fill", (12, 12), [(0, 0)], "R"),
        ("fill", (12, 13), [(3, 6), (8, 18)], "W"),
        ("fill", (15, 16), [(2, 19)], "W"),
    ]),
    ("the-conquest-of-happiness.jpg", "YW", dict(sat=1.2, dark=0.0, ink_to="W", ink_chroma=30, thicken=3), [
        ("replace", (0, 24), "W", "Y"),
        # The black title as empty holes in the sun: The / Conquest / of / Happiness.
        ("fill", (6, 6), [(9, 12)], "."),
        ("fill", (9, 10), [(5, 16)], "."),
        ("fill", (12, 12), [(10, 11)], "."),
        ("fill", (15, 16), [(4, 17)], "."),
        # Bertrand / Russell in white below it.
        ("fill", (25, 34), [(0, 21)], "."),
        ("fill", (26, 27), [(3, 18)], "W"),
        ("fill", (30, 31), [(5, 16)], "W"),
    ]),
]


def to_lab(rgb):
    a = np.clip(np.asarray(rgb, np.float32) / 255.0, 0, 1)
    a = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]], np.float32)
    xyz = a @ m.T / np.array([0.9505, 1.0, 1.089], np.float32)
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def neighbours(r, c, rows, cols):
    """The six holes around (r, c) on a grid whose odd rows are shifted right."""
    shift = 0 if r % 2 else -1
    out = [(r, c - 1), (r, c + 1)]
    for dr in (-1, 1):
        out += [(r + dr, c + shift), (r + dr, c + shift + 1)]
    return [(y, x) for y, x in out if 0 <= y < rows and 0 <= x < cols]


def touch_up(rows, ops):
    grid = [list(row) for row in rows]
    for op in ops:
        if op[0] == "fill":
            _, (r0, r1), spans, key = op
            for r in range(r0, min(r1, len(grid) - 1) + 1):
                for c0, c1 in spans:
                    for c in range(c0, c1 + 1):
                        grid[r][c] = key
        elif op[0] == "replace":
            _, (r0, r1), old, new = op
            for r in range(r0, min(r1, len(grid) - 1) + 1):
                grid[r] = [new if k == old else k for k in grid[r]]
    return ["".join(row) for row in grid]


def template(path, allowed, sat=1.4, dark=0.18, grey_to=None, grey_chroma=0, grey_below=1.0,
             ink_to=None, ink_chroma=0, thicken=0):
    img = cv2.cvtColor(cv2.imread(str(path)), cv2.COLOR_BGR2RGB)
    rows = int(round(COLS * img.shape[0] / img.shape[1] / ROW_STEP))
    cell = 12  # sample each hole from a 12-pixel cell of a resized cover
    w, h = COLS * cell, int(round(rows * ROW_STEP * cell))
    img = cv2.resize(img, (w, h), interpolation=cv2.INTER_AREA)
    if thicken:
        img = cv2.erode(img, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * thicken + 1,) * 2))
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV).astype(np.float32)
    hsv[..., 1] = np.clip(hsv[..., 1] * sat, 0, 255)
    img = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB).astype(np.float32)
    pal_keys = list(allowed)
    pal_lab = to_lab([PEGS[k] for k in pal_keys])
    grid = [["."] * COLS for _ in range(rows)]
    for r in range(rows):
        for c in range(COLS):
            cx = (c + (0.5 if r % 2 else 0) + 0.5) * cell
            cy = (r * ROW_STEP + 0.5) * cell
            x0, x1 = int(max(0, cx - cell / 2)), int(min(w, cx + cell / 2))
            y0, y1 = int(max(0, cy - cell / 2)), int(min(h, cy + cell / 2))
            px = img[y0:y1, x0:x1].reshape(-1, 3).mean(0)
            lum = (0.2126 * px[0] + 0.7152 * px[1] + 0.0722 * px[2]) / 255
            lab = to_lab(px)
            chroma = float(np.hypot(lab[1], lab[2]))
            if ink_to and chroma < ink_chroma:
                grid[r][c] = ink_to if lum < 0.45 else "."
                continue
            if lum < dark:
                continue
            if grey_to and chroma < grey_chroma and lum < grey_below:
                grid[r][c] = grey_to
                continue
            grid[r][c] = pal_keys[int(np.argmin(((pal_lab - lab) ** 2).sum(1)))]
    # Cleanup: a hole takes the colour most of its neighbours share, twice over.
    for _ in range(2):
        nxt = [row[:] for row in grid]
        for r in range(rows):
            for c in range(COLS):
                votes = {}
                for y, x in neighbours(r, c, rows, COLS):
                    votes[grid[y][x]] = votes.get(grid[y][x], 0) + 1
                best, n = max(votes.items(), key=lambda kv: kv[1])
                if best != grid[r][c] and n >= 4:
                    nxt[r][c] = best
        grid = nxt
    return ["".join(row) for row in grid]


def preview(templates, out):
    pitch, step = 16, 16 * ROW_STEP
    tiles = []
    for rows in templates:
        h, w = int(len(rows) * step + pitch), COLS * pitch + pitch
        im = np.full((h, w, 3), 12, np.uint8)
        for r, row in enumerate(rows):
            for c, k in enumerate(row):
                x, y = int((c + (0.5 if r % 2 else 0) + 0.5) * pitch), int(r * step + pitch / 2)
                if k == ".":
                    cv2.circle(im, (x, y), 2, (40, 40, 44), -1, cv2.LINE_AA)
                else:
                    cv2.circle(im, (x, y), 6, PEGS[k], -1, cv2.LINE_AA)
        tiles.append(im)
    hmax = max(t.shape[0] for t in tiles)
    tiles = [np.pad(t, ((0, hmax - t.shape[0]), (0, 24), (0, 0)), constant_values=30) for t in tiles]
    cv2.imwrite(out, cv2.cvtColor(np.hstack(tiles), cv2.COLOR_RGB2BGR))


def main():
    templates = []
    for name, allowed, opts, ops in COVERS:
        rows = touch_up(template(ROOT / "public" / "images" / "books" / name, allowed, **opts), ops)
        templates.append(rows)
        print(f"// {name}: {COLS} x {len(rows)}")
        print("[\n" + "\n".join(f'  "{row}",' for row in rows) + "\n]")
    if len(sys.argv) > 1:
        preview(templates, sys.argv[1])


if __name__ == "__main__":
    main()
