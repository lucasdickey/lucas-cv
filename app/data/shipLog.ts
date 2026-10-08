/**
 * A curated 90-day snapshot of projects with public source or a verified public
 * product surface. Private repositories never receive a source link; projects
 * with neither a public repository nor an accessible product are excluded.
 *
 * Refreshed 2026-10-07 against GitHub and the live sites. Counts use each
 * repository's default-branch history, including merges and automated commits,
 * rather than local feature branches. Dates use America/Los_Angeles.
 * See docs/ship-log-audit-2026-10-07.md for public sources and refresh procedure.
 */

export const WINDOW_START = "2026-07-10";
export const WINDOW_END = "2026-10-07";

export const WINDOW_LABEL = `${new Date(WINDOW_START).toLocaleDateString("en-US", {
  month: "long", day: "numeric", timeZone: "UTC",
})} – ${new Date(WINDOW_END).toLocaleDateString("en-US", {
  month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
})}`;

export interface ShipLogLink {
  label: string;
  url: string;
}

export interface ShipLogThumbnail {
  src: string;
  alt: string;
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
  /** Small 16:10 preview in public/images/ship-log/. Public material only. */
  thumbnail?: ShipLogThumbnail;
  commits: number;
  firstCommit: string;
  lastCommit: string;
  tags: string[];
}

export const shipLog: ShipLogProject[] = [
  {
    "name": "OP-1 Jam",
    "tagline": "Claude writes the notes, your OP-1 plays them",
    "summary": "Built a free Mac app for jamming with Claude on a teenage engineering OP-1: Claude writes short loops, the OP-1 plays them on whatever sound you pick, and Claude answers what you play.",
    "bullets": [
      "Plug the OP-1 in over USB and the app finds it; Claude writes bass, chords, or drums on the sound you choose.",
      "Play along and layer up. Claude listens to what you play and writes around what’s already on tape.",
      "Published as open source, with a download page and a 30-second teaser recorded from the app itself."
    ],
    "repoUrl": "https://github.com/lucasdickey/op1-jam",
    "liveUrl": "https://one-off.dev/op1-jam",
    "thumbnail": {
      "src": "/images/ship-log/op1-jam.webp",
      "alt": "The OP-1 Jam window on a Mac, with a loop Claude wrote laid out as rows of notes"
    },
    "commits": 2,
    "firstCommit": "2026-10-06",
    "lastCommit": "2026-10-06",
    "tags": [
      "music",
      "open-source",
      "macos"
    ]
  },
  {
    "name": "Breathe Free",
    "tagline": "Box breathing for Mac, Android, and the browser",
    "summary": "Rebuilt the open-source breathing app as native Mac and Android apps where the picture and the sound follow one clock, and published them on a single download page.",
    "bullets": [
      "A glowing orb grows and shrinks through in, hold, out, and hold, with a soft sound on each step, so you can close your eyes and still keep time.",
      "The sky behind it follows the real time of day, from dawn to a starry night, and sessions run from 2 to 50 cycles.",
      "Version 2.2 downloads directly for Mac and Android ahead of the app stores, and a browser version needs no install."
    ],
    "repoUrl": "https://github.com/lucasdickey/breathe-free",
    "liveUrl": "https://one-off.dev/breathe-free",
    "extraLinks": [
      {
        "label": "Breathe in your browser",
        "url": "https://one-off.dev/breathe-free/web"
      }
    ],
    "thumbnail": {
      "src": "/images/ship-log/breathe-free.webp",
      "alt": "Breathe Free on a Mac: a glowing orb inside a box, with the cue “Breathe in”"
    },
    "commits": 34,
    "firstCommit": "2026-08-19",
    "lastCommit": "2026-10-07",
    "tags": [
      "open-source",
      "macos",
      "android"
    ]
  },
  {
    "name": "Piñata",
    "tagline": "Website feedback, pinned to the exact spot",
    "summary": "Built a way to capture a public website, mark up the parts that need attention, and share a single feedback link with its founder.",
    "bullets": [
      "Capture desktop and mobile pages, then place pins, boxes, circles, and arrows on the screenshot.",
      "Keep replies and resolution history next to the thing being discussed. Editing requires sign-in; the product example and walkthrough are public.",
      "Added a private, read-only link that hands a project’s open marks to an AI agent, plus a demo video and a ten-chapter walkthrough."
    ],
    "repoUrl": "https://github.com/lucasdickey/pinata",
    "liveUrl": "https://yourpinata.dev",
    "extraLinks": [
      {
        "label": "Watch the walkthrough",
        "url": "https://yourpinata.dev/walkthrough"
      }
    ],
    "thumbnail": {
      "src": "/images/ship-log/pinata.webp",
      "alt": "A marked-up page capture in Piñata, with numbered pins and a reply thread"
    },
    "commits": 168,
    "firstCommit": "2026-09-04",
    "lastCommit": "2026-10-07",
    "tags": [
      "feedback",
      "open-source",
      "next.js"
    ]
  },
  {
    "name": "lucasdickey.com",
    "tagline": "A reading list you can walk into",
    "summary": "Turned photos and video of my real bookshelves into an interactive 3D collection, with individual books you can pull out and inspect.",
    "bullets": [
      "Matched book spines from close-up photographs and linked identified titles to Amazon.",
      "Added a spine-to-cover animation: the selected book leaves its shelf, turns toward you, and returns when you close it.",
      "Added a glass cabinet of 50 photographed books and a kitchen drawer of 23 more, with search on desktop and touch controls on phones."
    ],
    "repoUrl": "https://github.com/lucasdickey/lucas-cv",
    "liveUrl": "https://www.lucasdickey.com/real-books",
    "thumbnail": {
      "src": "/images/ship-log/real-books.webp",
      "alt": "The real bookshelf the 3D reading list was built from"
    },
    "commits": 56,
    "firstCommit": "2026-07-29",
    "lastCommit": "2026-10-07",
    "tags": [
      "3d",
      "books",
      "next.js"
    ]
  },
  {
    "name": "one-off",
    "tagline": "Small experiments that become public things",
    "summary": "Kept publishing standalone experiments, with recent additions spanning daily comics, code-drawn family comic strips, and a YouTube blocker for Android and Mac.",
    "bullets": [
      "Zingers turns an AI/tech story into five candidate three-panel strips, scores them, and leaves the final choice to me.",
      "Knuckle Butts turns things the kids said into comic strips drawn by code, with a permanent page for each strip.",
      "Published YouTube Block for Android and Mac: it blocks the YouTube app and YouTube in every browser, and turning it off takes a parent PIN or an admin password."
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
    "thumbnail": {
      "src": "/images/ship-log/one-off-zingers.webp",
      "alt": "A three-panel Zingers comic strip drawn by code"
    },
    "commits": 157,
    "firstCommit": "2026-07-11",
    "lastCommit": "2026-10-07",
    "tags": [
      "comics",
      "generative-art",
      "android"
    ]
  },
  {
    "name": "Downstream",
    "tagline": "A daily record of what government did",
    "summary": "Built a public, dated record of what the federal government does, from the Federal Register to presidential memoranda and the House floor schedule, so readers and agents can check a claim against its source.",
    "bullets": [
      "Publish daily issues with documents grouped by agency and the dates they set, each with a dated permalink and a Markdown version.",
      "Keep a record of presidential memoranda, most of which never appear in the Federal Register, so they can be found and cited.",
      "Capture the House’s weekly floor schedule and show recess weeks as confirmed absences, so gaps are visible rather than mistaken for inactivity."
    ],
    "liveUrl": "https://www.downstream.sh/daily/",
    "extraLinks": [
      {
        "label": "Presidential memoranda",
        "url": "https://www.downstream.sh/presidential/"
      },
      {
        "label": "Floor Radar",
        "url": "https://www.downstream.sh/floor/"
      }
    ],
    "thumbnail": {
      "src": "/images/ship-log/downstream.webp",
      "alt": "Downstream daily issue: what the government did, every day it did it"
    },
    "commits": 478,
    "firstCommit": "2026-08-01",
    "lastCommit": "2026-10-07",
    "tags": [
      "civic-tech",
      "data-provenance",
      "publishing"
    ]
  },
  {
    "name": "A-OK Shop",
    "tagline": "A working storefront, with room to experiment",
    "summary": "Moved the Apes on Keys merch store to a-ok.ai with a new look, a daily run of AI-drawn apes, and a storefront that AI agents can read and buy from.",
    "bullets": [
      "Carried the new Club Receipt look, part club graphic and part store receipt, to every customer-facing page.",
      "Started Chaos Monkeys, a daily ape drafted by AI models, and put the keepers on tees and hoodies for sale.",
      "Opened the shop to AI agents: pages they can read, actions they can call from the browser, and orders that go through the regular checkout."
    ],
    "repoUrl": "https://github.com/lucasdickey/a-ok-shop",
    "liveUrl": "https://a-ok.ai",
    "thumbnail": {
      "src": "/images/ship-log/a-ok-shop.webp",
      "alt": "The A-OK ape logo in headphones and a cap"
    },
    "commits": 47,
    "firstCommit": "2026-07-25",
    "lastCommit": "2026-10-07",
    "tags": [
      "e-commerce",
      "ai-agents",
      "design"
    ]
  },
  {
    "name": "Cross Cross Footy",
    "tagline": "Four teams, one pitch, a phone in your hands",
    "summary": "Took a four-way soccer game onto the web and Android, then kept tuning the rules and touch layout through playtesting.",
    "bullets": [
      "Built a playable browser version and a downloadable Android build.",
      "Adjusted goal credit, including dribbled goals, and the anti-stall behavior based on measured play.",
      "Improved the landscape layout and placed scores directly on the pitch, flashing when they change."
    ],
    "liveUrl": "https://2dads2dudes.dev/footy",
    "extraLinks": [
      {
        "label": "Android APK",
        "url": "https://2dads2dudes.dev/cross-cross-footy/apk/"
      }
    ],
    "thumbnail": {
      "src": "/images/ship-log/cross-cross-footy.webp",
      "alt": "Cross Cross Footy: an octagonal pitch with a goal on each side"
    },
    "commits": 49,
    "firstCommit": "2026-07-26",
    "lastCommit": "2026-10-04",
    "tags": [
      "games",
      "android",
      "canvas"
    ]
  }
];

export function getShipLogStats() {
  const commits = shipLog.reduce((sum, p) => sum + p.commits, 0);
  const live = shipLog.filter((p) => Boolean(p.liveUrl)).length;
  return { projects: shipLog.length, commits, live };
}
