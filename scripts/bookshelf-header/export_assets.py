"""Turn engraved layer data into the AVIF layers the homepage scenes use.

usage: python3 -I export_assets.py <scripts dir> <out root> <assets dir>

<out root> holds the build_pano.py output folders (skyline, studyband, woodband).
Every layer is written twice: full width (3600px) and half width (-1800).
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, sys.argv[1])
from engrave import INK, PAPER, RED, layer_rgba

root, assets = Path(sys.argv[2]), Path(sys.argv[3])
assets.mkdir(parents=True, exist_ok=True)

hexc = lambda h: np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255
NIGHT_FILL = hexc("#232c44")
NIGHT_INK = hexc("#0a0e18")
NIGHT_RED = hexc("#5a1c24")
NIGHT_WALL_INK = hexc("#0d1321")

sizes = {}


def save(name, rgba, quality=60):
    im = Image.fromarray((np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8), "RGBA")
    half = im.convert("RGBa").resize((im.width // 2, im.height // 2), Image.LANCZOS).convert("RGBA")
    for suffix, img in (("", im), ("-1800", half)):
        path = assets / f"{name}{suffix}.avif"
        img.save(path, "AVIF", quality=quality)
        sizes[f"{name}{suffix}"] = path.stat().st_size // 1024


def load(d, cat):
    z = np.load(d / f"{cat}.npz")
    return {k: z[k].astype(np.float32) for k in z.files}


def layer(L, paper, ink, red=None, use_red=True):
    col = ink if red is None or not use_red else ink * (1 - L["red"][..., None]) + red * L["red"][..., None]
    return layer_rgba(L["ink"], L["fill"], col, paper=paper)


def stack(*rgbas):
    """Merge straight-alpha RGBA layers back to front."""
    H, W = rgbas[0].shape[:2]
    prem = np.zeros((H, W, 3), np.float32)
    a = np.zeros((H, W), np.float32)
    for r in rgbas:
        ra = r[..., 3]
        prem = prem * (1 - ra[..., None]) + r[..., :3] * ra[..., None]
        a = ra + a * (1 - ra)
    return np.dstack([prem / np.maximum(a, 1e-5)[..., None], a])


def floor_layer(floor_ink, ink):
    """Floor lines only; the wall itself (color and faint hatching) is drawn in CSS."""
    return layer_rgba(floor_ink, np.zeros_like(floor_ink), ink)


layouts = {}

# Plate I, Night Shift: the skyline. One daytime image, three night layers.
d = root / "skyline"
layouts["skyline"] = json.loads((d / "meta.json").read_text())
L = {c: load(d, c) for c in ["back", "books", "frame", "top"]}
floor = np.load(d / "floor.npz")["ink"].astype(np.float32)
save("sky-day", stack(floor_layer(floor, INK), *(layer(L[c], PAPER, INK, RED) for c in ["back", "books", "frame", "top"])))
save("sky-floor-night", floor_layer(floor, NIGHT_WALL_INK * 0.6 + NIGHT_FILL * 0.4))
save("sky-back-night", layer(L["back"], NIGHT_FILL, NIGHT_INK))
save("sky-fore-night", stack(*(layer(L[c], NIGHT_FILL, NIGHT_INK, NIGHT_RED) for c in ["books", "frame", "top"])))

# Plate II, Exploded View: the three study cases, one image per layer, red spines kept.
# The stacks on top of these cases are books, so they ride in the books layer.
d = root / "studyband"
layouts["studyband"] = json.loads((d / "meta.json").read_text())
L = {c: load(d, c) for c in ["back", "books", "frame"]}
for c in ["back", "books", "frame"]:
    save(f"study-{c}", layer(L[c], PAPER, INK, RED))

# Plate III, Shelf Express: the wooden case's top shelf, books in plain ink so the train is the only red.
d = root / "woodband"
wmeta = json.loads((d / "meta.json").read_text())
layouts["woodband"] = wmeta
L = {c: load(d, c) for c in ["back", "books", "frame", "top"]}
H, W = L["back"]["ink"].shape
save("wood-backbooks", stack(layer(L["back"], PAPER, INK), layer(L["books"], PAPER, INK, use_red=False)))
save("wood-frame", layer(L["frame"], PAPER, INK))
top = layer(L["top"], PAPER, INK)
# Split the fern (left) from the caps (right) so the fern can sway on its own.
case = wmeta["cases"][0]
split = round((wmeta["total_units"][0] * case["x0"] + (-1.5 + 5.33)) * wmeta["P_out"])
fern, caps = top.copy(), top.copy()
fern[:, split:, 3] = 0
caps[:, :split, 3] = 0
save("wood-fern", fern)
save("wood-caps", caps)
layouts["fern_split"] = split / W

(Path(sys.argv[1]) / "layout.json").write_text(json.dumps(layouts, indent=1))
print(json.dumps(sizes))
print("full KB", sum(v for k, v in sizes.items() if not k.endswith("-1800")),
      "half KB", sum(v for k, v in sizes.items() if k.endswith("-1800")))
