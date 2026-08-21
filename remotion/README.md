# Syllabus film

A 60-second motion graphic of the [AI & Civilization syllabus](../app/data/syllabus.ts),
built with [Remotion](https://remotion.dev) and rendered to MP4 for sharing on
social networks.

The film draws the syllabus as a knowledge graph: the guiding question at the
centre, the seven parts as supernodes around it, and every reading flying in to
attach to its part. The camera pulls back as the graph outgrows the frame, dives
onto two readings to show what a node actually contains, then settles wide for
the closing questions.

## Why it lives in its own package

This directory has its own `package.json` and is **not** part of the Next.js
build. Remotion and its bundled Chromium/ffmpeg are large and only needed when
re-rendering the film, so keeping them out of the site's dependency tree means
the Vercel build is untouched by anything here.

It does read from the site: `src/graph.ts` and `src/copy.ts` import
`app/data/syllabus.ts` directly, and covers are loaded out of `public/images/`
via Remotion's `publicDir`. **Add a reading to the syllabus and it appears in the
film on the next render** — there is no second copy of the data to update.

## Rendering

```bash
cd remotion
npm install

npm run render                     # all three crops into out/
node render.mjs square             # just one crop
node render.mjs --still 700,1170   # PNGs at those frames, to check framing
node render.mjs --range 600-660 square   # a short clip, for iterating
```

| Composition             | Size      | Where it is for                     |
| ----------------------- | --------- | ----------------------------------- |
| `SyllabusFilmSquare`    | 1080×1080 | X, LinkedIn, Instagram feed         |
| `SyllabusFilmVertical`  | 1080×1920 | Reels, Stories, TikTok, Shorts      |
| `SyllabusFilmWide`      | 1920×1080 | YouTube, landscape embeds           |

`out/` is gitignored — the MP4s are build artefacts, not source.

To preview interactively (hot-reloads as you edit):

```bash
npm run studio
```

## Rendering environment

`render.mjs` looks for a preinstalled Chromium before letting Remotion download
its own, which matters in sandboxes with restricted egress. Override with
`REMOTION_BROWSER_EXECUTABLE=/path/to/chrome`.

Remotion drives *old* headless, which recent full Chrome builds have removed, so
the binary needs to be `chrome-headless-shell` rather than `chrome`.

## Fonts

The film uses Source Serif 4, Inter and JetBrains Mono, vendored as latin
subsets into `public/fonts/` so a render never depends on the network. They are
loaded through the `FontFace` API in `src/theme.ts` and held with `delayRender`
until ready. Refresh them with:

```bash
python3 ../scripts/fetch_video_fonts.py
```

## Structure

```
src/
  Root.tsx          the three compositions (square / vertical / wide)
  SyllabusFilm.tsx  scene boundaries and ordering
  graph.ts          graph layout — node positions and appearance frames
  camera.ts         the camera path over the graph
  copy.ts           on-screen text, derived from app/data/syllabus.ts
  theme.ts          palette and font loading
  scenes/           Hook, Progression, GraphScene, Questions, Outro
  components/       graph nodes, backdrop, word-reveal, cross-fade
```

### Editing notes

- **Timing** lives in two places: `FILM` in `SyllabusFilm.tsx` for scene
  boundaries (film-global frames), and `T` in `graph.ts` for everything inside
  the graph (graph-local frames, i.e. offset by `FILM.graphAt`).
- **The graph layout constants** in `graph.ts` were solved for, not eyeballed:
  they are the largest cover size and tightest graph for which no two covers
  overlap across all seven fans. If a part gains a reading, re-check that no
  covers collide before rendering — the search is a short script, see the
  constants' comment.
- **The palette** is the one `scripts/generate_syllabus_covers.py` paints
  placeholder covers with, so a book's node colour matches its cover on the
  syllabus page.
- **There is no audio.** Most social video autoplays muted; add a track in
  `SyllabusFilm.tsx` with Remotion's `<Audio>` if you want one, and check the
  licence before posting.
