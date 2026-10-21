"""Turn engraved layer data into the WebP plates the header uses.

usage: python3 -I export_assets.py <scripts dir> <out root> <assets dir>
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, sys.argv[1])
from engrave import INK, PAPER, RED, hatch, layer_rgba, over

root, assets = Path(sys.argv[2]), Path(sys.argv[3])
assets.mkdir(parents=True, exist_ok=True)

hexc = lambda h: np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255
NIGHT_WALL = hexc("#141b2b")
NIGHT_FILL = hexc("#232c44")
NIGHT_INK = hexc("#0a0e18")
NIGHT_RED = hexc("#5a1c24")
NIGHT_WALL_INK = hexc("#0d1321")

sizes = {}


def save(name, rgba, quality=60):
    im = Image.fromarray((np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8), "RGBA" if rgba.shape[2] == 4 else "RGB")
    path = assets / f"{name}.avif"
    im.save(path, "AVIF", quality=quality)
    sizes[name] = path.stat().st_size // 1024


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


# Skyline: separate plates for the exploded view, night set for the time-lapse.
d = root / "skyline"
meta = json.loads((d / "meta.json").read_text())
L = {c: load(d, c) for c in ["back", "books", "frame", "top"]}
floor = np.load(d / "floor.npz")["ink"].astype(np.float32)
H, W = floor.shape
save("sky-floor-day", floor_layer(floor, INK))
save("sky-floor-night", floor_layer(floor, NIGHT_WALL_INK * 0.6 + NIGHT_FILL * 0.4))
for c in ["back", "books", "frame", "top"]:
    save(f"sky-{c}-day", layer(L[c], PAPER, INK, RED))
save("sky-back-night", layer(L["back"], NIGHT_FILL, NIGHT_INK))
save("sky-fore-night", stack(*(layer(L[c], NIGHT_FILL, NIGHT_INK, NIGHT_RED) for c in ["books", "frame", "top"])))
save("sky-poster", stack(floor_layer(floor, INK), *(layer(L[c], PAPER, INK, RED) for c in ["back", "books", "frame", "top"])))

# Wooden close-up: books in plain ink so the train is the only red.
d = root / "woodband"
wmeta = json.loads((d / "meta.json").read_text())
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
wood_poster = stack(layer(L["back"], PAPER, INK), layer(L["books"], PAPER, INK, use_red=False), layer(L["frame"], PAPER, INK), top)
save("wood-poster", wood_poster)

(assets / "layout.json").write_text(json.dumps(dict(sky=meta, wood=wmeta, fern_split=split / W), indent=1))
print(json.dumps(sizes))
print("total KB", sum(sizes.values()))
