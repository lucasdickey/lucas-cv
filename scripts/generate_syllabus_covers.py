#!/usr/bin/env python3
"""
Generate SVG cover art for the AI & Civilization syllabus readings.

A few syllabus readings — the essay collections and the interview series —
have no printed cover to fetch. This generates a typographic cover for those,
color-coded by syllabus part, written to /public/images/syllabus/<slug>.svg.

Every reading that is an actual book gets real publisher artwork instead, via
scripts/fetch_syllabus_covers.py.

Usage:
    python3 scripts/generate_syllabus_covers.py
"""

import os
from xml.sax.saxutils import escape

OUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public",
    "images",
    "syllabus",
)

WIDTH, HEIGHT = 400, 600

# Each part gets its own palette so the covers read as one set.
PARTS = {
    "civilization-history": ("Part I", "#6B1D1D", "#E8B4A0"),
    "media-cognition": ("Part II", "#14494F", "#8FD4CE"),
    "economics-institutions": ("Part III", "#1E4433", "#9DD5A8"),
    "networks-states-power": ("Part IV", "#262A55", "#A9B0EE"),
    "ai-futures": ("Part V", "#1B2027", "#7FD1E8"),
    "ethics-society-governance": ("Part VI", "#3A2450", "#CBA6E8"),
    "information-civilization": ("Part VII", "#5A3417", "#E8C79A"),
}

# slug, part id, title, author, kind
READINGS = [
    ("ai-2027", "ai-futures",
     "AI 2027", "Daniel Kokotajlo", "essays"),
    ("dwarkesh-interviews", "ai-futures",
     "Long-form Interviews", "Dwarkesh Patel", "interviews"),
    ("situational-awareness", "ai-futures",
     "Situational Awareness", "Leopold Aschenbrenner", "essays"),
]

KIND_LABEL = {"book": "", "essays": "Essays", "interviews": "Interviews"}


def wrap(text, max_chars):
    """Greedy word wrap, splitting over-long words at the limit."""
    lines, line = [], ""
    for word in text.split():
        while len(word) > max_chars:
            if line:
                lines.append(line)
                line = ""
            lines.append(word[: max_chars - 1] + "-")
            word = word[max_chars - 1:]
        candidate = f"{line} {word}".strip()
        if len(candidate) <= max_chars:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def title_layout(title):
    """Pick a font size that keeps the title inside the cover."""
    for size, max_chars, max_lines in ((44, 13, 4), (36, 16, 5), (30, 20, 6), (25, 24, 7)):
        lines = wrap(title, max_chars)
        if len(lines) <= max_lines:
            return size, lines
    return 22, wrap(title, 28)[:8]


def build_svg(slug, part_id, title, author, kind):
    part_label, bg, accent = PARTS[part_id]
    size, lines = title_layout(title)
    line_height = int(size * 1.18)

    # Vertically center the title block in the middle of the cover.
    block_height = line_height * len(lines)
    start_y = 250 - block_height // 2 + size

    title_tspans = "".join(
        f'<tspan x="40" y="{start_y + i * line_height}">{escape(line)}</tspan>'
        for i, line in enumerate(lines)
    )

    author_lines = wrap(author, 24)
    author_y = start_y + block_height + 18
    author_tspans = "".join(
        f'<tspan x="40" y="{author_y + i * 26}">{escape(line)}</tspan>'
        for i, line in enumerate(author_lines)
    )

    kind_label = KIND_LABEL[kind]
    footer = f"{part_label} · {kind_label}" if kind_label else part_label

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" width="{WIDTH}" height="{HEIGHT}" role="img" aria-label="{escape(title)} by {escape(author)}">
  <defs>
    <linearGradient id="bg-{slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{bg}"/>
      <stop offset="100%" stop-color="#11131A"/>
    </linearGradient>
  </defs>
  <rect width="{WIDTH}" height="{HEIGHT}" fill="url(#bg-{slug})"/>
  <rect x="0" y="0" width="10" height="{HEIGHT}" fill="{accent}" opacity="0.85"/>
  <rect x="26" y="18" width="{WIDTH - 52}" height="{HEIGHT - 36}" fill="none" stroke="#FFFFFF" stroke-opacity="0.16"/>
  <line x1="40" y1="118" x2="150" y2="118" stroke="{accent}" stroke-width="3"/>
  <text x="40" y="86" font-family="ui-monospace, 'SFMono-Regular', Menlo, monospace" font-size="15" letter-spacing="2.5" fill="{accent}" fill-opacity="0.95">{escape(part_label.upper())}</text>
  <text font-family="Georgia, 'Times New Roman', serif" font-size="{size}" font-weight="700" fill="#FFFFFF">{title_tspans}</text>
  <text font-family="Helvetica, Arial, sans-serif" font-size="19" fill="#FFFFFF" fill-opacity="0.72">{author_tspans}</text>
  <line x1="40" y1="{HEIGHT - 78}" x2="{WIDTH - 40}" y2="{HEIGHT - 78}" stroke="#FFFFFF" stroke-opacity="0.18"/>
  <text x="40" y="{HEIGHT - 50}" font-family="ui-monospace, 'SFMono-Regular', Menlo, monospace" font-size="13" letter-spacing="1.5" fill="#FFFFFF" fill-opacity="0.6">{escape(footer.upper())}</text>
</svg>
"""


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for slug, part_id, title, author, kind in READINGS:
        path = os.path.join(OUT_DIR, f"{slug}.svg")
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(build_svg(slug, part_id, title, author, kind))
        print(f"wrote {path}")
    print(f"\n{len(READINGS)} covers generated")


if __name__ == "__main__":
    main()
