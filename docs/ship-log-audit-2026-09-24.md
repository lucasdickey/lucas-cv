# Homepage project snapshot — September 24, 2026

Window: June 27 through September 24, 2026, inclusive, in America/Los_Angeles.
This is a dated editorial snapshot, not a live GitHub feed.

A project qualifies through a public GitHub repository or a public product
surface. Private source is never linked. Authentication-protected previews,
internal decks, fixtures, and demos with no public source are not included.
A public landing page does not imply that its editing tools are anonymous.

## Featured work and public evidence

| Project | Public evidence | Default-branch commits | Active dates (Pacific) |
| --- | --- | ---: | --- |
| Piñata | [Source](https://github.com/lucasdickey/pinata), [product](https://yourpinata.dev), [walkthrough](https://yourpinata.dev/walkthrough) | 122 | Sep 4–23 |
| lucasdickey.com | [Source](https://github.com/lucasdickey/lucas-cv), [bookshelf](https://www.lucasdickey.com/real-books) | 35 | Jul 1–Sep 24 |
| one-off | [Zingers](https://zingers.dev), [Knuckle Butts](https://knucklebutts.com), [YouTube Block](https://one-off.dev/youtube-block) | 133 | Jul 1–Sep 24 |
| Downstream | [Daily issue](https://www.downstream.sh/daily/) | 430 | Aug 1–Sep 24 |
| A-OK Shop | [Source](https://github.com/lucasdickey/a-ok-shop), [store](https://a-ok-shop.vercel.app) | 12 | Jul 25–Sep 23 |
| Breathe Free | [Source](https://github.com/lucasdickey/breathe-free) | 5 | Aug 19–20 |
| Cross Cross Footy | [Game](https://2dads2dudes.dev/footy), [Android download page](https://2dads2dudes.dev/cross-cross-footy/apk/) | 46 | Jul 26–Aug 18 |
| simple-survey | [Source](https://github.com/lucasdickey/simple-survey) | 2 | Jul 2 |

All listed live URLs returned HTTP 200 with matching public page content without
authentication or a protection bypass. Deployment ownership was cross-checked
against the Vercel project's GitHub integration and production aliases.
Piñata's editor requires sign-in; its product example and walkthrough are public.

The old A-OK custom domain and Breathe Free deployment URL returned 404 during
this audit. A-OK now links to its verified Vercel production alias; Breathe Free
is source-only. The old simple-survey URL could not be tied to this repository
and is omitted. Do not infer ownership merely because a guessed domain responds.

## Counting and refresh procedure

1. List GitHub repositories, including visibility and push dates. Cross-check
   recent production deployments, their GitHub integrations, and protection
   settings in Vercel. Do not publish internal project inventories.
2. For each selected repository, paginate `GET /repos/{owner}/{repo}/commits`
   on its default branch, with `since=2026-06-27T07:00:00Z` and
   `until=2026-09-25T06:59:59Z`. Count the returned commits and convert committer
   dates to Pacific time. This snapshot was fetched before this homepage change.
3. Counts include merge and automated commits; they are activity counts, not
   a measure of features or effort. Unlike the August snapshot's local
   `git log --all`, this uses default-branch history consistently. Unmerged
   feature-branch activity is not represented, so totals are not comparable.
4. Read public source and public page content to write the project description.
   Check every live destination without cookies or bypass credentials. Remove
   links that are gated, broken, unrelated, or cannot be tied to the project.
5. Refresh `WINDOW_START`, `WINDOW_END`, project counts/dates, and this audit
   together. Keep only entries active in the chosen window; do not just append
   to the old log. The UI's totals and expand label derive from the array.

The resulting snapshot contains 8 projects, 785 commits, and 6 live entries.
Older work and projects without default-branch activity in the refreshed window
were removed from this section. This is a curated selection, not an exhaustive
inventory of all repositories or deployments.
