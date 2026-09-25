/**
 * A curated 90-day snapshot of projects with public source or a verified public
 * product surface. Private repositories never receive a source link; projects
 * with neither a public repository nor an accessible product are excluded.
 *
 * Refreshed 2026-09-24 against GitHub and Vercel. Counts now use the GitHub
 * commits API on each default branch, including merges and automated commits,
 * rather than local feature branches. Dates use America/Los_Angeles.
 * See docs/ship-log-audit-2026-09-24.md for public sources and refresh procedure.
 */

export const WINDOW_START = "2026-06-27";
export const WINDOW_END = "2026-09-24";

export const WINDOW_LABEL = `${new Date(WINDOW_START).toLocaleDateString("en-US", {
  month: "long", day: "numeric", timeZone: "UTC",
})} – ${new Date(WINDOW_END).toLocaleDateString("en-US", {
  month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
})}`;

export interface ShipLogLink {
  label: string;
  url: string;
}

export interface ShipLogProject {
  /** Display name for the project. */
  name: string;
  /** One-line framing of what it is. */
  tagline: string;
  /** Single sentence: what we did and why. */
  summary: string;
  /** Three bullets. What and why — not how. */
  bullets: string[];
  /** Public source, when the repo is public. */
  repoUrl?: string;
  /** Primary live deployment. Only set when public and un-gated. */
  liveUrl?: string;
  /** Additional public surfaces worth a direct look. */
  extraLinks?: ShipLogLink[];
  commits: number;
  firstCommit: string;
  lastCommit: string;
  tags: string[];
}

export const shipLog: ShipLogProject[] = [
  {
    "name": "Piñata",
    "tagline": "Website feedback, pinned to the exact spot",
    "summary": "Built a way to capture a public website, mark up the parts that need attention, and share a single feedback link with its founder.",
    "bullets": [
      "Capture desktop and mobile pages, then place pins, boxes, circles, and arrows on the screenshot.",
      "Keep replies and resolution history next to the thing being discussed. Editing requires sign-in; the product example and walkthrough are public.",
      "Published a ten-chapter walkthrough that explains the full capture, annotate, share, and reply flow."
    ],
    "repoUrl": "https://github.com/lucasdickey/pinata",
    "liveUrl": "https://yourpinata.dev",
    "extraLinks": [
      {
        "label": "Watch the walkthrough",
        "url": "https://yourpinata.dev/walkthrough"
      }
    ],
    "commits": 122,
    "firstCommit": "2026-09-04",
    "lastCommit": "2026-09-23",
    "tags": [
      "feedback",
      "open-source",
      "next.js"
    ]
  },
  {
    "name": "lucasdickey.com",
    "tagline": "A reading list you can walk into",
    "summary": "Turned photos and video of my real bookshelf into an interactive 3D collection, with individual books you can pull out and inspect.",
    "bullets": [
      "Matched book spines from close-up photographs and linked identified titles to Amazon.",
      "Added a spine-to-cover animation: the selected book leaves its shelf, turns toward you, and returns when you close it.",
      "Built a phone-friendly shelf browser with touch controls, search, and a book detail sheet, alongside the site’s reading lists and syllabi."
    ],
    "repoUrl": "https://github.com/lucasdickey/lucas-cv",
    "liveUrl": "https://www.lucasdickey.com/real-books",
    "commits": 35,
    "firstCommit": "2026-07-01",
    "lastCommit": "2026-09-24",
    "tags": [
      "3d",
      "books",
      "next.js"
    ]
  },
  {
    "name": "one-off",
    "tagline": "Small experiments that become public things",
    "summary": "Kept publishing standalone experiments, with recent additions spanning daily comics, code-drawn family comic strips, and an Android utility.",
    "bullets": [
      "Zingers turns an AI/tech story into five candidate three-panel strips, scores them, and leaves the final choice to me.",
      "Knuckle Butts turns things the kids said into comic strips drawn by code, with a permanent page for each strip.",
      "Published YouTube Block, a sideloaded Android app that blocks YouTube on one phone, with setup instructions and an APK download."
    ],
    "liveUrl": "https://zingers.dev",
    "extraLinks": [
      {
        "label": "Knuckle Butts",
        "url": "https://knucklebutts.com"
      },
      {
        "label": "YouTube Block",
        "url": "https://one-off.dev/youtube-block"
      }
    ],
    "commits": 133,
    "firstCommit": "2026-07-01",
    "lastCommit": "2026-09-24",
    "tags": [
      "comics",
      "generative-art",
      "android"
    ]
  },
  {
    "name": "Downstream",
    "tagline": "A daily record of what government did",
    "summary": "Built a public Federal Register reading surface that keeps each day’s source material available, so readers and agents can check a claim against a dated record.",
    "bullets": [
      "Publish daily issues with documents grouped by agency and the dates they set.",
      "Show ten business days of coverage, including missing captures, so gaps are visible rather than mistaken for inactivity.",
      "Offer dated permalinks and a Markdown version alongside the readable daily issue."
    ],
    "liveUrl": "https://www.downstream.sh/daily/",
    "commits": 430,
    "firstCommit": "2026-08-01",
    "lastCommit": "2026-09-24",
    "tags": [
      "civic-tech",
      "data-provenance",
      "publishing"
    ]
  },
  {
    "name": "A-OK Shop",
    "tagline": "A working storefront, with room to experiment",
    "summary": "Extended the Apes on Keys merch store with interactive design concepts and fixes to the buying flow.",
    "bullets": [
      "Built multiple storefront directions around the actual catalog and shopping bag, so the designs can be tried as working experiences.",
      "Fixed checkout for print-on-demand tees and hoodies, and aligned the size and color choices with what can be purchased.",
      "Added paid-order notifications and corrected the order data sent by checkout webhooks."
    ],
    "repoUrl": "https://github.com/lucasdickey/a-ok-shop",
    "liveUrl": "https://a-ok-shop.vercel.app",
    "commits": 12,
    "firstCommit": "2026-07-25",
    "lastCommit": "2026-09-23",
    "tags": [
      "e-commerce",
      "stripe",
      "design"
    ]
  },
  {
    "name": "Breathe Free",
    "tagline": "Breathing guidance that keeps time",
    "summary": "Refined the open-source breathing app so its visual cues and audio follow the same breathing cycle.",
    "bullets": [
      "Fixed timing and animation bugs in the breathing sequence.",
      "Added procedural clouds and synchronized the audio cues with the exercise.",
      "Updated the app’s framework and runtime to repair its deployment build. The public source is available below."
    ],
    "repoUrl": "https://github.com/lucasdickey/breathe-free",
    "commits": 5,
    "firstCommit": "2026-08-19",
    "lastCommit": "2026-08-20",
    "tags": [
      "open-source",
      "animation",
      "audio"
    ]
  },
  {
    "name": "Cross Cross Footy",
    "tagline": "Four teams, one pitch, a phone in your hands",
    "summary": "Took a four-way soccer game onto the web and Android, then kept tuning the rules and touch layout through playtesting.",
    "bullets": [
      "Built a playable browser version and a downloadable Android build.",
      "Adjusted goal attribution and the anti-stall behavior based on measured play.",
      "Improved the landscape layout and placed scores directly on the pitch, flashing when they change."
    ],
    "liveUrl": "https://2dads2dudes.dev/footy",
    "extraLinks": [
      {
        "label": "Android APK",
        "url": "https://2dads2dudes.dev/cross-cross-footy/apk/"
      }
    ],
    "commits": 46,
    "firstCommit": "2026-07-26",
    "lastCommit": "2026-08-18",
    "tags": [
      "games",
      "android",
      "canvas"
    ]
  },
  {
    "name": "simple-survey",
    "tagline": "A reusable starting point for research surveys",
    "summary": "Published the survey platform as a standalone, configuration-driven template for the next study.",
    "bullets": [
      "Define question sets and conditional paths in typed configuration.",
      "Keep external providers optional so the project can run before credentials are added.",
      "Document the privacy boundaries and separate participant identity from responses."
    ],
    "repoUrl": "https://github.com/lucasdickey/simple-survey",
    "commits": 2,
    "firstCommit": "2026-07-02",
    "lastCommit": "2026-07-02",
    "tags": [
      "template",
      "open-source",
      "next.js"
    ]
  }
];

export function getShipLogStats() {
  const commits = shipLog.reduce((sum, p) => sum + p.commits, 0);
  const live = shipLog.filter((p) => Boolean(p.liveUrl)).length;
  return { projects: shipLog.length, commits, live };
}
