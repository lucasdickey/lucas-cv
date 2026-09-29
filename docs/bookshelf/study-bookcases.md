# September 28 Drive shelves

Source: the user's [Drive folder](https://drive.google.com/drive/folders/10RcHWNEpZHC2I6aNJoCoZlIkZWLVz5VB). All 26 JPEGs were downloaded, orientation-corrected, and resized to a maximum dimension of 1280px. The folder also contains a video; the stills provide the required overview and close-up coverage, so it is not part of this import. Original JPEGs remain outside the repository. `drive-source-manifest.json` maps original filenames/Drive IDs to optimized web assets.

| Collection | Route | Volumes | Views | Source images |
| --- | --- | ---: | ---: | --- |
| Black bookcase, left | `/real-books?case=study-left` | 95 | 6 | 01, 15–20 |
| Cream bookcase | `/real-books?case=study-cream` | 92 | 5 | 02, 09, 11–14 |
| Black bookcase, right | `/real-books?case=study-right` | 103 | 6 | 03–08, 10 |
| Blue book tower | `/real-books?case=tower` | 41 | 12 | 21–26 |

The black cases include their top surfaces as a view. Physical duplicates remain distinct: for example, two copies of *The Lean Startup* in the cream case and *High Growth Handbook* in both the left case and tower. Magazines in the tower are selectable too. The catalog describes visible volumes, not a deduplicated reading list.

`study-books.js` defines photographed spine quadrilaterals and independent book geometry. Leaning spines are rectified where necessary. Stacked books have individual thicknesses, layouts, and supports. `study-bookcases.js` builds opaque cabinet frames or the blue steel tower. No full-shelf billboard is used in the interactive scene. Overview photographs remain available through “The original.”

Four volumes remain explicitly unidentified: an orange volume and a flat volume in the left case, an illustrated volume on the cream case's third shelf, and the white volume atop the right case. They remain visible and selectable but have no guessed retail links. The illustrated volume also uses its photographed cover on its upper face. Some small/occluded text cannot be recovered from these images; unknown author fields are intentionally blank.

Verified metadata is stored in `study-links.json`, with source work URLs, matched titles/authors, and checksum-valid ISBN-10s. `study-covers.json` points to locally downloaded Open Library artwork and retains source URLs. A match does not claim that the photographed edition is identical or that Amazon currently stocks it. Unmatched titles fall back to an explicitly labeled Amazon title-and-author search; unidentified volumes have no shopping link.

Only the selected collection's photos and extracted spine textures load into the scene. Existing wooden, glass, and drawer collections keep their behavior. New routes use the same gesture controls, search, shelf dropdown, and reversible book-opening animation. The taller cases extend the vertical gesture/keyboard pan limit to their top view.

Validation: `node --test tests/*.test.mjs`, scoped ESLint, production Next.js build, desktop/mobile browser checks for all four routes, focused shelf navigation, spine selection, search, cover cards, and return-to-shelf behavior.

Import result: 261 distinct titles have verified bibliographic matches; 237 edition records have local cover images. Four visible volumes remain unidentified.
