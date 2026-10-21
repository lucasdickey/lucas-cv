"""Line-engraving renderer for the real-books depth plates.

Each captured case directory holds straight-on renders:
  beauty.png              everything
  back/frame/books/top    one layer each, transparent elsewhere, shadows kept
  normal[_cat].png        view-space normals (packed 0..1)
  id[_cat].png            flat per-mesh colors; blue channel = category code
"""
import json
import math
from pathlib import Path

import cv2
import numpy as np

CATS = ["back", "frame", "books", "top"]
CAT_CODE = {"back": 40, "frame": 100, "books": 170, "top": 230}

PAPER = np.array([0xF5, 0xF5, 0xDC], np.float32) / 255
INK = np.array([0x2A, 0x25, 0x21], np.float32) / 255
RED = np.array([0x8B, 0x00, 0x00], np.float32) / 255


def read_rgba(path):
    im = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
    im = cv2.cvtColor(im, cv2.COLOR_BGRA2RGBA)
    return im.astype(np.float32) / 255


def load_case(d):
    d = Path(d)
    meta = json.loads((d / "meta.json").read_text())
    data = {"meta": meta, "beauty": read_rgba(d / "beauty.png")}
    for c in CATS:
        data[c] = read_rgba(d / f"{c}.png")
        data[f"normal_{c}"] = read_rgba(d / f"normal_{c}.png")
        data[f"id_{c}"] = read_rgba(d / f"id_{c}.png")
    data["normal"] = read_rgba(d / "normal.png")
    data["id"] = read_rgba(d / "id.png")
    return data


def id_edges(idmap, normal, thickness):
    """Outline map at source resolution: object changes, surface folds and silhouettes."""
    a = idmap[..., 3] > 0.5
    ids = np.round(idmap[..., 0] * 255).astype(np.int32) + 256 * np.round(idmap[..., 1] * 255).astype(np.int32)
    ids[~a] = -1
    n = normal[..., :3] * 2 - 1
    e = np.zeros(ids.shape, bool)
    for dy, dx in ((0, 1), (1, 0)):
        sa = ids[: ids.shape[0] - dy, : ids.shape[1] - dx]
        sb = ids[dy:, dx:]
        na = n[: n.shape[0] - dy, : n.shape[1] - dx]
        nb = n[dy:, dx:]
        diff = (sa != sb) & ((sa >= 0) | (sb >= 0))
        fold = ((na * nb).sum(-1) < 0.85) & (sa >= 0) & (sb >= 0)
        hit = diff | fold
        e[: e.shape[0] - dy, : e.shape[1] - dx] |= hit
    e = e.astype(np.uint8) * 255
    if thickness > 1:
        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (thickness, thickness))
        e = cv2.dilate(e, k)
    return e.astype(np.float32) / 255


def resize(im, scale, interp=cv2.INTER_AREA):
    h, w = im.shape[:2]
    return cv2.resize(im, (max(1, round(w * scale)), max(1, round(h * scale))), interpolation=interp)


def smooth_noise(shape, scale, seed):
    rng = np.random.default_rng(seed)
    h, w = shape
    small = rng.standard_normal((h // scale + 3, w // scale + 3)).astype(np.float32)
    big = cv2.resize(small, (w + 3 * scale, h + 3 * scale), interpolation=cv2.INTER_CUBIC)[:h, :w]
    return big / (big.std() + 1e-6)


def hatch(shape, angle_deg, spacing, width_frac, seed, wobble=0.16):
    """Anti-aliased parallel lines. width_frac (0..1 per pixel) = share of each period that is ink."""
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = math.radians(angle_deg)
    u = (-xx * math.sin(a) + yy * math.cos(a)) / spacing
    u += wobble * smooth_noise(shape, 48, seed)
    f = u - np.floor(u)
    dist = np.minimum(f, 1 - f) * spacing
    half = width_frac * spacing * 0.5
    return np.clip(half - dist + 0.5, 0, 1) * (width_frac > 0.02)


def darkness(rgb, alpha, gamma=0.55, lift=0.08, sharpen=0.7):
    lum = rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114
    d = 1 - np.power(np.clip(lum, 0, 1), gamma)
    d = np.clip((d - lift) / (1 - lift), 0, 1)
    blur = cv2.GaussianBlur(d, (0, 0), 5)
    d = np.clip(d + sharpen * (d - blur), 0, 1)
    return d * (alpha > 0.01)


# Per-layer line angles: (front faces, side faces, top/bottom faces)
ANGLES = {
    "back": (0, 0, 0),
    "frame": (0, 90, 0),
    "books": (90, 60, 0),
    "top": (40, 40, 40),
}
TONE = {"back": 0.58, "frame": 0.62, "books": 1.0, "top": 0.6}
GAMMA = {"back": 0.6, "frame": 0.7, "books": 1.0, "top": 0.9}


def engrave_layer(rgb, alpha, normal, edges, cat, spacing=4.5, seed=0, strength=None, hatch_min_alpha=0.0):
    """Return ink coverage (0..1) for one layer at output resolution."""
    shape = alpha.shape
    d = darkness(rgb, alpha, gamma=GAMMA[cat]) * (strength if strength is not None else TONE[cat])
    n = normal[..., :3] * 2 - 1
    nx, ny, nz = np.abs(n[..., 0]), np.abs(n[..., 1]), np.abs(n[..., 2])
    front = nz >= np.maximum(nx, ny)
    side = (~front) & (nx >= ny)
    topb = (~front) & (~side)
    w1 = np.clip(d * 1.15, 0, 0.62)
    w2 = np.clip((d - 0.45) * 1.3, 0, 0.6)
    w3 = np.clip((d - 0.72) * 1.6, 0, 0.5)
    cov = np.zeros(shape, np.float32)
    for mask, ang in zip((front, side, topb), ANGLES[cat]):
        if not mask.any():
            continue
        l1 = hatch(shape, ang, spacing, w1 * mask, seed + ang)
        l2 = hatch(shape, ang + 38, spacing * 1.08, w2 * mask, seed + ang + 7)
        l3 = hatch(shape, ang - 38, spacing * 1.12, w3 * mask, seed + ang + 13)
        cov = np.maximum(cov, 1 - (1 - l1) * (1 - l2) * (1 - l3))
    ink = np.maximum(cov * (alpha > hatch_min_alpha), edges * 0.92)
    return ink * np.clip(alpha * 1.4, 0, 1)


def redness(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx = rgb.max(-1)
    mn = rgb.min(-1)
    sat = (mx - mn) / (mx + 1e-4)
    return np.clip((r - np.maximum(g, b) * 1.25) * 4, 0, 1) * np.clip((sat - 0.45) * 4, 0, 1) * np.clip((r - 0.3) * 4, 0, 1)


def per_object(value, idmap):
    """Average a per-pixel value over each object (mesh) so a whole spine shares one decision."""
    a = idmap[..., 3] > 0.5
    ids = (np.round(idmap[..., 0] * 255).astype(np.int64) + 256 * np.round(idmap[..., 1] * 255).astype(np.int64))
    ids[~a] = 0
    sums = np.bincount(ids.ravel(), weights=value.ravel(), minlength=65536)
    cnts = np.bincount(ids.ravel(), minlength=65536)
    mean = sums / np.maximum(cnts, 1)
    mean[0] = 0
    return mean[ids].astype(np.float32)


def red_books(rgb, idmap, threshold=0.28):
    m = per_object(redness(rgb), idmap)
    return np.clip((m - threshold) * 8, 0, 1)


def to_rgba(ink, alpha, paper=PAPER, ink_color=INK, red=None):
    col = np.broadcast_to(ink_color, ink.shape + (3,)).copy()
    if red is not None:
        col = col * (1 - red[..., None]) + RED * red[..., None]
    rgb = paper * (1 - ink[..., None]) + col * ink[..., None]
    a = np.clip(alpha, 0, 1)
    return np.dstack([rgb, a])


def layer_rgba(ink, fill, ink_color, paper=PAPER):
    """Paper laid down with coverage `fill`, then ink on top. Returns straight (non-premultiplied) RGBA."""
    ink_col = np.broadcast_to(ink_color, ink.shape + (3,)) if np.ndim(ink_color) == 1 else ink_color
    alpha = 1 - (1 - fill) * (1 - ink)
    premul = paper * (fill * (1 - ink))[..., None] + ink_col * ink[..., None]
    return np.dstack([premul / np.maximum(alpha, 1e-5)[..., None], alpha])


def over(dst_rgb, rgba):
    a = rgba[..., 3:4]
    return dst_rgb * (1 - a) + rgba[..., :3] * a


def save_rgba(path, rgba):
    im = (np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8)
    cv2.imwrite(str(path), cv2.cvtColor(im, cv2.COLOR_RGBA2BGRA))
