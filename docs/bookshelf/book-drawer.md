# Kitchen book drawer

The third collection is available at `/real-books?case=drawer`. Photos `1000017021`–`1000017029`, supplied September 26, 2026, establish the cabinet proportions and book order.

## Collection and sources

The upper-right drawer contains 23 physical volumes: 22 identified books and one slim volume whose spine only reads “Presented by Stripe.” Keep that volume unidentified until a cover or title page is supplied. The Jonathan Lethem omnibus counts as one physical volume. *Homicidal Psycho Jungle Cat* lies face-up in front of the upright row; loose papers are not interactive books.

`drawer-books.js` records order, dimensions and photographic spine quadrilaterals. `drawer-links.json` records print-edition metadata and its sources. `drawer-covers.json` references 21 locally stored Amazon cover images; these can differ from the photographed edition. The French Charlie Mackesy edition has a verified 979 ISBN, no invented ISBN-10/ASIN, and a title-and-author search link. Its full cover is unavailable. The Stripe volume has no guessed author, product link or cover.

Photo assets: `closed.jpg` is 7021, `open.jpg` is 7024, `left.jpg` is 7026 and `right.jpg` is 7027. The scene samples these images for the countertop and spines. The follow-up `right-closeup.jpg` (7030) supplies nine clearer spine crops, rotated upright through their texture coordinates; clipped titles retain their earlier crops. `kitchen.jpg` (7020) provides the wider kitchen context in “The original.” The repeated 7021 reference adds no new volume or asset. Geometry approximates the photographs rather than measured cabinetry.

## Interaction

The cabinet starts closed. Tap the upper-right drawer face or handle to slide it out while the camera eases into an overhead view. Books inherit the moving tray transform. Tap a spine or the face-up Calvin & Hobbes book to lift it into the existing full-cover detail card. A search result selected while closed waits for the drawer and camera to open. Returning the book restores its original position.

Tap empty canvas outside the cabinet to close. One finger rotates, two fingers pan, and pinch zooms; mouse and keyboard alternatives remain available. The View dropdown offers Whole cabinet, Book row and Calvin & Hobbes. Reduced-motion users receive immediate drawer positioning and the existing reduced-motion reveal behavior.

## Verification

All 48 Node tests pass, including drawer reversal, frame-rate independence, reduced motion, parent transforms, stable pick targets, front-face occlusion, upward extraction/return, catalog bounds and metadata/assets. Changed-file ESLint has no errors and one existing unused-variable warning. Production build passes. Repository-wide ESLint and TypeScript checks still report existing errors outside this change (checkout, chat, AI configuration, scripts and vendored Three.js); the Next.js build is configured to skip those checks.

Browser checks at desktop and 390px mobile width cover closed/open geometry, dropdown framing, spine and face-up book selection, full-cover cards, return animation, selection from search while closed, and blank-canvas close. Physical two-finger/pinch input is not available in the browser harness; gesture-controller tests cover those paths.

Review follow-up adds app-handler regressions for newest-selection precedence, Escape preserving the wood/glass return animation, and drawer-specific camera bounds. All three failed under their original faulty behavior and pass with the fixes.
