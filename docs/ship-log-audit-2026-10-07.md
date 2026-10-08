# Homepage project snapshot — October 7, 2026

Window: July 10 through October 7, 2026, inclusive, in America/Los_Angeles.
This is a dated editorial snapshot, not a live GitHub feed.

A project qualifies through a public GitHub repository or a public product
surface. Private source is never linked. Authentication-protected previews,
internal decks, fixtures, and demos with no public source are not included.
A public landing page does not imply that its editing tools are anonymous.

## Featured work and public evidence

| Project | Public evidence | Default-branch commits | Active dates (Pacific) |
| --- | --- | ---: | --- |
| OP-1 Jam | [Source](https://github.com/lucasdickey/op1-jam), [download page](https://one-off.dev/op1-jam) | 2 | Oct 6 |
| Breathe Free | [Source](https://github.com/lucasdickey/breathe-free), [download page](https://one-off.dev/breathe-free), [web version](https://one-off.dev/breathe-free/web) | 34 | Aug 19–Oct 7 |
| Piñata | [Source](https://github.com/lucasdickey/pinata), [product](https://yourpinata.dev), [walkthrough](https://yourpinata.dev/walkthrough) | 168 | Sep 4–Oct 7 |
| lucasdickey.com | [Source](https://github.com/lucasdickey/lucas-cv), [bookshelf](https://www.lucasdickey.com/real-books) | 56 | Jul 29–Oct 7 |
| one-off | [Zingers](https://zingers.dev), [Knuckle Butts](https://knucklebutts.com), [YouTube Block](https://one-off.dev/youtube-block) | 157 | Jul 11–Oct 7 |
| Downstream | [Daily issue](https://www.downstream.sh/daily/), [presidential memoranda](https://www.downstream.sh/presidential/), [Floor Radar](https://www.downstream.sh/floor/) | 478 | Aug 1–Oct 7 |
| A-OK Shop | [Source](https://github.com/lucasdickey/a-ok-shop), [store](https://a-ok.ai) | 47 | Jul 25–Oct 7 |
| Cross Cross Footy | [Game](https://2dads2dudes.dev/footy), [Android download page](https://2dads2dudes.dev/cross-cross-footy/apk/) | 49 | Jul 26–Oct 4 |

All listed live URLs returned HTTP 200 with matching public page content without
authentication or a protection bypass. Piñata's editor requires sign-in; its
product example and walkthrough are public. Vercel deployment settings were not
re-checked for this refresh; every destination above was opened directly.

Changes since the September 24 snapshot:

- OP-1 Jam is new. It started in the one-off repository and moved to its own
  public repository on October 6, so its own count is small.
- Breathe Free now has a live download page on one-off.dev, which links to its
  public source, so it is no longer source-only.
- A-OK Shop moved to a-ok.ai, which serves the same store as the Vercel
  production alias the last snapshot linked.
- simple-survey had no default-branch commits in this window and was removed.

OP-1 Jam's thumbnail is a frame from its published teaser video, and Breathe
Free's is one of the app screenshots on its download page. Neither is a capture
of the page itself, so `scripts/ship-log-thumbnails.mjs` does not list them.

## Counting and refresh procedure

1. List GitHub repositories, including visibility and push dates. Cross-check
   recent production deployments, their GitHub integrations, and protection
   settings in Vercel when that access is available. Do not publish internal
   project inventories.
2. For each selected repository, count the commits on its default branch
   whose committer date falls between `2026-07-10T07:00:00Z` and
   `2026-10-08T06:59:59Z`, then convert those dates to Pacific time. Either
   paginate `GET /repos/{owner}/{repo}/commits` with `since` and `until`, or
   read the default branch's history from a history-only clone
   (`git clone --bare --filter=tree:0`). This refresh used the clone; recounting
   the September window that way reproduced that snapshot's numbers. This
   snapshot was taken before this homepage change.
3. Counts include merge and automated commits; they are activity counts, not
   a measure of features or effort. They use default-branch history only, so
   unmerged feature-branch activity is not represented.
4. Read public source and public page content to write the project description.
   Check every live destination without cookies or bypass credentials. Remove
   links that are gated, broken, unrelated, or cannot be tied to the project.
   Do not infer ownership merely because a guessed domain responds.
5. Refresh `WINDOW_START`, `WINDOW_END`, project counts/dates, and this audit
   together. Keep only entries active in the chosen window; do not just append
   to the old log. The UI's totals and expand label derive from the array.

The resulting snapshot contains 8 projects, 991 commits, and 8 live entries.
Projects without default-branch activity in the refreshed window were removed
from this section. This is a curated selection, not an exhaustive inventory of
all repositories or deployments.
