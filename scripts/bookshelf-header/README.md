# Bookshelf plates

Builds the engraved, layered images for the three bookshelf plates on the homepage
(`app/components/BookshelfScene.tsx`) from the 3D bookshelf at `/real-books`. Each plate is a
stack of same-size transparent layers; things move in a middle layer and pass behind the layer
in front (multiplane occlusion).

- Plate I, the skyline: all six bookcases, morning to night (`sky-*`)
- Plate II, the three study cases, whose layers fan apart (`study-*`)
- Plate III, the wooden case's top shelf, with a train (`wood-*`)

Output goes to `public/images/bookshelf-scenes/`, each layer at 3600px and 1800px wide.
`layout.json` records where each case, cubby and lamp sits; the lamp positions in
`BookshelfScene.tsx` come from its `skyline.cubbies`.

## Rebuild

Needs Node with Playwright and Chromium, and Python 3 with `numpy`, `scipy`, `opencv-python-headless`
and `Pillow`.

```bash
# 1. Serve the static bookshelf app
(cd public && python3 -m http.server 8077) &

# 2. Render each bookcase straight on, one image per layer (back wall, frame, books, top)
for c in wood glass study-left study-cream study-right tower; do
  node scripts/bookshelf-header/capture.mjs /tmp/plates $c 150
done
node scripts/bookshelf-header/capture.mjs /tmp/plates_hi wood 240

# 3. Lay the cases out and engrave each layer
python3 -I scripts/bookshelf-header/build_pano.py scripts/bookshelf-header /tmp/plates /tmp/out/skyline skyline
python3 -I scripts/bookshelf-header/build_pano.py scripts/bookshelf-header /tmp/plates /tmp/out/studyband study-band
python3 -I scripts/bookshelf-header/build_pano.py scripts/bookshelf-header /tmp/plates_hi /tmp/out/woodband wood-band

# 4. Write the AVIF layers (and layout.json)
python3 -I scripts/bookshelf-header/export_assets.py scripts/bookshelf-header /tmp/out public/images/bookshelf-scenes
```

The capture step loads `real-books/app.js` with a two-line patch applied in memory (it exposes the
scene and pauses its render loop). Nothing in `public/` is changed.
