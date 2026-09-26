# Read checklist

Run `node scripts/book-checklist/server.mjs` from lucas-cv, then open http://127.0.0.1:3047.

Check finished books and Submit. The loopback-only tool edits `app/data/books.ts`, the existing archive used by both homepage themes and book detail pages. Existing read books are locked; unselected statuses are preserved. Selections survive reload in this browser. Physical duplicate copies share one checkbox; unidentified spines and notebooks are omitted.

New entries use only known title, author, cover, and retail link, without fabricated reviews, ratings, or completion dates. Existing entries retain their other metadata. Missing covers use a neutral local placeholder. Each save backs up the prior archive in `.git/book-checklist-backups/`; concurrent archive edits cause a conflict instead of overwriting them.

These are local repository changes. Review `git diff -- app/data/books.ts` and publish through the usual site deployment flow afterward. The editor is not a public production endpoint.

Tests: `node --test tests/book-checklist.test.mjs`.
