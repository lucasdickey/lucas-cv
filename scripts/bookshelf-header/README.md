# Bookshelf header

Builds engraved, layered header images from the 3D bookshelf at `/real-books`, for a
multiplane occlusion header: things move in a middle layer and pass behind the layer in front.

`preview/index.html` compares three variants (Night Shift, Shelf Express, Exploded View) using the
images in `preview/assets/`.

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
python3 -I scripts/bookshelf-header/build_pano.py scripts/bookshelf-header /tmp/plates_hi /tmp/out/woodband wood-band

# 4. Write the day and night AVIF layers
python3 -I scripts/bookshelf-header/export_assets.py scripts/bookshelf-header /tmp/out scripts/bookshelf-header/preview/assets
```

The capture step loads `real-books/app.js` with a two-line patch applied in memory (it exposes the
scene and pauses its render loop). Nothing in `public/` is changed.
