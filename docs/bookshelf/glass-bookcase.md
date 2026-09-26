# Glass bookcase

The second cabinet is available at `/real-books?case=glass`. The default route still shows the wooden bookcase. The selector uses normal links so browser history, bookmarking, and loading only the selected cabinet's photos work without adding scene-disposal state.

The September 26, 2026 photo batch contains two rows. `glass-books.js` records 50 physical items, preserving the duplicate HBR finance guide. The two Balch books are different titles. The loose papers and unlabelled thin item beside On Liberty are not assigned invented titles. The small dictionary and the white spine between We the Corporations and The Tangled Tree remain unmatched.

`assets/glass/full.jpg` is 1000017009; `left.jpg` is 1000017010; `center.jpg` is 1000017011; `stack.jpg` is 1000017012; `top.jpg` is 1000017013. All are 1280 × 964. Spine quadrilaterals are in source-image pixels; `layout` is independent world geometry. Stack entries are bottom to top. Decorations are approximate geometry, not product entries.

`glass-links.json` includes source references for 41 distinct print-edition matches (42 physical copies). Matching editions may differ from the photographed copies, as stated in the card. 39 full covers were retrieved from Amazon's ISBN image endpoint and stored locally in the shared cover manifest. The other identified titles retain explicit title/author search links. The two unidentified items have no retail links. No runtime metadata API or credential is required.

Verification: catalog/quad/layout/ISBN tests; existing navigation, reveal, title-search and original-catalog tests; production build; browser checks at desktop and 390 × 844 for catalog search, full covers, stacked-book selection, return, and switching cabinets.
