"""Compose the captured bookcases into wide depth plates, then engrave each plate.

usage: python3 -I build_pano.py <scripts dir> <plates dir> <out dir> <layout name>
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, sys.argv[1])
from engrave import (CATS, PAPER, INK, engrave_layer, id_edges, load_case, red_books, resize,
                     save_rgba, smooth_noise, hatch)

plates_dir, out_dir, layout_name = Path(sys.argv[2]), Path(sys.argv[3]), sys.argv[4]
out_dir.mkdir(parents=True, exist_ok=True)

LAYOUTS = {
    # (case, gap before in units)
    "skyline": dict(cases=[("study-left", 0), ("study-cream", 0.25), ("study-right", 0.25), ("wood", 1.5),
                           ("glass", 1.5), ("tower", 1.3)],
                    width_px=3600, margin=1.8, top=0.9, floor=1.7),
    # The three study cases, closer in: the top two rows and the stacks on top.
    "study-band": dict(cases=[("study-left", 0), ("study-cream", 0.25), ("study-right", 0.25)],
                       width_px=3600, margin=1.2, top=0.5, floor=0, crop_units=(8.2, 16.25)),
    # The wooden case alone, framed wide: top rows plus the fern and caps.
    "wood-band": dict(cases=[("wood", 0)], width_px=3600, margin=3.0, top=0.5, floor=0, crop_units=(9.75, 14.95)),
}
L = LAYOUTS[layout_name]

cases = []
x = L["margin"]
for name, gap in L["cases"]:
    src = plates_dir / name
    data = load_case(src)
    m = data["meta"]
    fx0, fx1 = m["frameBox"][0][0], m["frameBox"][1][0]
    x += gap
    cases.append(dict(name=name, data=data, x0=x, fx0=fx0, fx1=fx1))
    x += fx1 - fx0
total_w = x + L["margin"]
tallest = max(c["data"]["meta"]["all"][1][1] - c["data"]["meta"]["frameBox"][0][1] for c in cases)
if "crop_units" in L:
    y_lo, y_hi = L["crop_units"]
    total_h = y_hi - y_lo
else:
    total_h = L["top"] + tallest + L["floor"]
P_out = L["width_px"] / total_w
W, H = L["width_px"], round(total_h * P_out)
floor_row = round((L["top"] + tallest) * P_out) if "crop_units" not in L else None
print(layout_name, "units", round(total_w, 2), "x", round(total_h, 2), "px", W, H, "P_out", round(P_out, 2))

# Composite canvases per layer at output resolution.
acc = {c: dict(rgb=np.zeros((H, W, 3), np.float32), a=np.zeros((H, W), np.float32),
               normal=np.zeros((H, W, 4), np.float32), edges=np.zeros((H, W), np.float32),
               red=np.zeros((H, W), np.float32)) for c in CATS}


def paste(dst, src, top, left, mode):
    h, w = src.shape[:2]
    y0, x0 = max(0, top), max(0, left)
    y1, x1 = min(dst.shape[0], top + h), min(dst.shape[1], left + w)
    if y1 <= y0 or x1 <= x0:
        return None
    s = src[y0 - top:y1 - top, x0 - left:x1 - left]
    return (slice(y0, y1), slice(x0, x1)), s


for c in cases:
    d, m = c["data"], c["data"]["meta"]
    P = m["P"]
    k = P_out / P
    # world -> output px. Source image: col = W/2 + (x - cx) * P, row = (maxY - y) * P
    left = round((c["x0"] - (c["fx0"] - (m["cx"] - (m["W"] / 2) / P))) * P_out)
    if "crop_units" in L:
        top = round((L["crop_units"][1] - m["maxY"]) * P_out)
    else:
        floor_y = m["frameBox"][0][1]
        top = round(floor_row - (m["maxY"] - floor_y) * P_out)
    c["left"], c["top"], c["k"] = left, top, k
    for cat in CATS:
        layer = d[cat]
        if layer[..., 3].max() < 0.01:
            continue
        edges = id_edges(d[f"id_{cat}"], d[f"normal_{cat}"], thickness=max(1, round(1.5 / k)))
        a = resize(layer[..., 3], k)
        rgb = resize(layer[..., :3] * layer[..., 3:4], k) / np.maximum(a[..., None], 1e-4)
        nrm = resize(d[f"normal_{cat}"], k, cv2.INTER_NEAREST)
        e = np.clip(resize(edges, k) * 1.7, 0, 1)
        red = resize(red_books(layer[..., :3], d[f"id_{cat}"]), k) if cat == "books" else np.zeros_like(a)
        A = acc[cat]
        sl = paste(A["a"], a, top, left, None)
        if sl is None:
            continue
        (ys, xs), a_s = sl
        h_, w_ = a_s.shape
        crop = lambda im: im[ys.start - top:ys.start - top + h_, xs.start - left:xs.start - left + w_]
        rgb_s, n_s, e_s, r_s = crop(rgb), crop(nrm), crop(e), crop(red)
        A["rgb"][ys, xs] = A["rgb"][ys, xs] * (1 - a_s[..., None]) + rgb_s * a_s[..., None]
        take = a_s > 0.5
        A["normal"][ys, xs][take] = n_s[take]
        A["edges"][ys, xs] = np.maximum(A["edges"][ys, xs] * (1 - a_s), e_s)
        A["red"][ys, xs] = np.maximum(A["red"][ys, xs] * (1 - a_s), r_s)
        A["a"][ys, xs] = a_s + A["a"][ys, xs] * (1 - a_s)

layers = {}
for i, cat in enumerate(CATS):
    A = acc[cat]
    a = A["a"]
    rgb = np.clip(A["rgb"], 0, 1)
    ink = engrave_layer(rgb, a, A["normal"], A["edges"], cat, seed=i * 101 + 5,
                        hatch_min_alpha=0.5 if cat == "frame" else 0.0)
    if cat == "back":
        # Floor shadows have thin alpha and no surface: hatch them lightly on the diagonal.
        shadow = np.clip(a - (A["normal"][..., 3] > 0.5), 0, 1) * (A["normal"][..., 3] < 0.5)
        ink = np.maximum(ink, hatch(a.shape, 25, 4.2, np.clip(shadow * 1.1, 0, 0.55), 77) * (shadow > 0.05))
    fill = np.clip((a - 0.5) / 0.2, 0, 1)
    if cat == "back":
        fill = np.where(A["normal"][..., 3] > 0.5, fill, 0)
    ink = ink * (a > 0.05)
    layers[cat] = dict(ink=ink, fill=fill, red=A["red"])
    np.savez_compressed(out_dir / f"{cat}.npz", ink=ink.astype(np.float16), fill=fill.astype(np.float16),
                        red=A["red"].astype(np.float16))

# Floor band: a ground line and sparse lines that thin out toward the bottom.
floor = np.zeros((H, W), np.float32)
if floor_row is not None:
    rows = np.arange(H)[:, None].astype(np.float32)
    below = np.clip((rows - floor_row) / max(1, H - floor_row), 0, 1)
    band = (rows >= floor_row) * np.clip(0.42 - below * 0.5, 0, 1)
    floor = hatch((H, W), 0, 5.5, np.broadcast_to(band, (H, W)).astype(np.float32), 99, wobble=0.1)
    floor[floor_row - 1:floor_row + 2, :] = np.maximum(floor[floor_row - 1:floor_row + 2, :], 0.85)
    edge_fade = np.clip(np.minimum(np.arange(W), W - 1 - np.arange(W)) / (W * 0.08), 0, 1)[None, :]
    floor *= edge_fade
np.savez_compressed(out_dir / "floor.npz", ink=floor.astype(np.float16))

# Cubby openings: back wall not covered by the frame.
cub = ((acc["back"]["a"] > 0.5) & (acc["back"]["normal"][..., 3] > 0.5) & (acc["frame"]["a"] < 0.5)).astype(np.uint8)
cub = cv2.morphologyEx(cub, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
n, lab, stats, cent = cv2.connectedComponentsWithStats(cub, 8)
cubbies = []
for i in range(1, n):
    x0, y0, w, h, area = stats[i]
    if area < (P_out * 0.8) ** 2:
        continue
    cubbies.append(dict(x=x0 / W, y=y0 / H, w=w / W, h=h / H))
cubbies.sort(key=lambda b: (b["x"], b["y"]))

meta = dict(layout=layout_name, W=W, H=H, P_out=P_out, floor_row=floor_row, total_units=[total_w, total_h],
            cases=[dict(name=c["name"], x0=c["x0"] / total_w, x1=(c["x0"] + c["fx1"] - c["fx0"]) / total_w,
                        left=c["left"], top=c["top"], k=c["k"]) for c in cases],
            cubbies=cubbies)
(out_dir / "meta.json").write_text(json.dumps(meta, indent=1))
print("cubbies", len(cubbies))
