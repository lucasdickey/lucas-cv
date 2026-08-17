/**
 * The Last 90 Days — a rolling record of active build work.
 *
 * Every project here had commits in the trailing 90-day window. Counts and date
 * ranges come from `git log --all` across every branch, not just the default
 * one, so work parked on a feature branch still counts.
 *
 * `liveUrl` is only set for deployments that are publicly reachable with no
 * auth wall. Anything gated (or personal enough that a public link is the wrong
 * call) is described but not linked.
 *
 * `repoUrl` is only set where the GitHub repo is actually public — several of
 * these are private, and a "Source" link that 404s is worse than no link.
 * Verify with `gh repo view <owner>/<repo> --json visibility` before adding one.
 *
 * To refresh: re-run the audit, update `WINDOW_*` below, and adjust each
 * project's `commits` / `firstCommit` / `lastCommit`.
 */

export const WINDOW_START = "2026-05-19";
export const WINDOW_END = "2026-08-17";

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
    name: "one-off",
    tagline: "A dozen ideas, built and left standing",
    summary:
      "Built a permanent home for small, self-contained web experiments so that finished ideas get published and kept rather than thrown away — it now runs everything from an agent-payable commerce demo to an interactive Go tutorial.",
    bullets: [
      "Ran a full user-research study on how founders want to work with AI agents — participants choose a survey or a conversational interview, and the choice itself is a research signal. Participant identity is stored in a separate database that fails closed, so who someone is never sits next to what they said.",
      "Used the site as a proving ground for machine-payable commerce and MCP: an end-to-end Machine Payments Protocol talk with a live agent buying real goods, an embedded branded identity-collection widget delivered inside an MCP tool result, and a crowdsourced long-read service that prints and mails what wins — paid agent-to-agent.",
      "Shipped a long tail of standalone builds — a phone-first Go tutorial, a self-improving ASCII-art gallery, a 450-character crossword generator, a 3D industrial-design lab, an Android room-presence tracker, and a co-writing IDE that checks whether an AI draft still sounds like the person who wrote it.",
    ],
    // Repo is private; the deployments are the public surface.
    liveUrl: "https://one-off.dev",
    extraLinks: [
      { label: "MPP demo", url: "https://one-off.dev/mpp-demo" },
      { label: "Learn Go", url: "https://one-off.dev/learn-go" },
      { label: "Pika-Cross", url: "https://one-off.dev/pika-cross" },
      { label: "Design Lab", url: "https://one-off.dev/design-lab" },
      { label: "ASCII Evolve", url: "https://one-off.dev/ascii-evolve" },
      { label: "Slowpost", url: "https://one-off.dev/slowpost" },
      { label: "Atlas MCP", url: "https://one-off.dev/atlas-mcp" },
      { label: "gen-siggy", url: "https://one-off.dev/gen-siggy" },
    ],
    commits: 229,
    firstCommit: "2026-06-13",
    lastCommit: "2026-08-17",
    tags: ["mcp", "agentic-commerce", "user-research", "next.js"],
  },
  {
    name: "Downstream",
    tagline: "A company built in the open, thesis to daily artifact",
    summary:
      "Founded a legislative consequence-modeling company — what a law actually does after it passes — and wrote down the entire founding, from thesis to brand to working software, under version control from day one.",
    bullets: [
      "Wrote the thesis before the code: a founding memo, an upper-bound analysis, a ten-rung build ladder, competitive assessments, and a 206-entry lexicon of the terms of art in American lawmaking — each entry noting what a claim gets wrong if the term is misread.",
      "Turned the plan into a running pipeline: a daily Federal Register issue that publishes itself as a site, an immutable hash-chained archive, and an MCP server that serves dated snapshots, so any claim can be checked against the exact source that existed when it was made.",
      "Made correctness the actual product — claims over a newly enacted housing act were audited line by line against enrolled text, and the overclaims, miscounts, and one snapshot-discipline breach that turned up were corrected in public and logged, rather than quietly fixed.",
    ],
    // Repo is private. Strategy docs and essays are deliberately unpublished —
    // only link surfaces that are actually live.
    liveUrl: "https://seedownstream.com",
    extraLinks: [
      { label: "The daily issue", url: "https://www.downstream.sh/daily/" },
      { label: "Quotes", url: "https://www.downstream.sh/quotes/" },
      { label: "Gov-graph", url: "https://www.downstream.sh/gov-graph" },
      { label: "Styleguide", url: "https://www.downstream.sh/styleguide/" },
      { label: "MCP server", url: "https://mcp.downstream.sh" },
    ],
    commits: 204,
    firstCommit: "2026-08-01",
    lastCommit: "2026-08-15",
    tags: ["founding", "civic-tech", "mcp", "data-provenance"],
  },
  {
    name: "Cross Cross Footy",
    tagline: "Four-way soccer, tuned by measurement",
    summary:
      "Took a four-team, one-arena soccer game from design docs to a playable web build and an installable Android APK, letting playtest telemetry rather than argument settle the rules.",
    bullets: [
      "Separated the ruleset from the evidence for it, so that when measurement contradicted the design — as it did for the anti-stall detector, goal attribution, and which lever actually controls scoring — the reversal and its reasoning got written down instead of being lost with the session.",
      "Carried the prototype onto real devices with touch controls and frame-rate-independent simulation, because a game tuned only on a laptop tells you very little about the phone it will actually be played on.",
      "Restructured the repo so each project owns its own tooling and docs, making room for the next build without the last one bleeding into it.",
    ],
    // Repo is private.
    liveUrl: "https://2dads2dudes.dev/footy",
    extraLinks: [
      { label: "Android APK", url: "https://2dads2dudes.dev/cross-cross-footy/apk/" },
    ],
    commits: 44,
    firstCommit: "2026-07-27",
    lastCommit: "2026-08-16",
    tags: ["games", "android", "telemetry", "canvas"],
  },
  {
    name: "exit-model",
    tagline: "Startup exit outcomes, modeled honestly",
    summary:
      "Built a cap-table and waterfall tool that shows founders, investors, and employees what they each actually walk away with under different exits — then rebuilt the math from scratch after finding it wrong.",
    bullets: [
      "Corrected SAFE conversion, priced-round issuance, the liquidation waterfall, and vesting together rather than patching them one at a time, since a cap-table tool that is subtly wrong is worse than no tool at all.",
      "Grew it from a calculator into a product: per-persona value-over-time charts, rules-based advice, worked examples, term-sheet extraction from uploaded documents, and sharing you can revoke.",
      "Cleaned up its own security posture by removing live credentials that had been committed into documentation and setup scripts, and moved the deployment somewhere the secrets are managed properly.",
    ],
    // Repo is private.
    liveUrl: "https://exit-model.vercel.app",
    commits: 31,
    firstCommit: "2026-05-19",
    lastCommit: "2026-07-31",
    tags: ["fintech", "cap-tables", "next.js"],
  },
  {
    name: "atlas-mcp-proto",
    tagline: "Can an agent walk a founder through incorporation?",
    summary:
      "Prototyped an answer to a single strategic question — whether an agent-driven MCP conversation can carry a founder through company formation while holding context, collecting structured data, and handing off to a browser only where a browser is genuinely the right surface.",
    bullets: [
      "Built the full conversational flow end to end, from 'I want to start an AI company' through name validation, founder and equity structure, and a generated formation package, with everything mocked so the interaction could be judged on its own merits.",
      "Made the prototype legible to other people — a tool inspector, a presentation rendered from the live codebase, and an annotated walkthrough built around real transcript excerpts — because a strategic prototype only pays off if the org can see what it learned.",
      "Hardened it enough to survive being demoed, moving to a hosted database, fixing silent production failures, and making the whole thing work on a phone.",
    ],
    // Repo is private.
    liveUrl: "https://atlas-mcp-proto.vercel.app",
    commits: 21,
    firstCommit: "2026-06-09",
    lastCommit: "2026-06-15",
    tags: ["mcp", "agents", "prototype", "stripe-atlas"],
  },
  {
    name: "lucas.cv",
    tagline: "The interactive resume, still growing",
    summary:
      "Kept extending this terminal-styled personal site past the resume itself, into the reading, syllabi, and public writing that show what the work is actually informed by.",
    bullets: [
      "Added an AI & Civilization syllabus with its own page, real publisher cover art for every reading, and links back to source, turning a list of titles into something someone could actually follow.",
      "Kept the reading list honest — new titles added, ordering revised, finished books marked as read.",
      "Surfaced public writing on the home page so the site reflects current thinking rather than only past roles.",
    ],
    repoUrl: "https://github.com/lucasdickey/lucas-cv",
    liveUrl: "https://lucas.cv",
    commits: 13,
    firstCommit: "2026-05-30",
    lastCommit: "2026-08-06",
    tags: ["personal-site", "next.js"],
  },
  {
    name: "a-ok-shop",
    tagline: "A storefront that sells to people and to software",
    summary:
      "Reworked the Apes on Keys storefront around the phone, where the shopping actually happens, and then opened it to buyers that aren't people at all.",
    bullets: [
      "Overhauled the mobile experience with a sticky add-to-cart and a full design pass, on the reasoning that a storefront optimized for desktop is optimized for the minority of its traffic.",
      "Opened the store to machine buyers with an order-status endpoint and a deliberately cheap machine-payable item, so agent-to-agent settlement could be tested live and for real rather than only in a sandbox.",
      "Hardened the money path so that a failed order is visible instead of silent.",
    ],
    repoUrl: "https://github.com/lucasdickey/a-ok-shop",
    liveUrl: "https://a-ok.shop",
    commits: 9,
    firstCommit: "2026-05-25",
    lastCommit: "2026-07-25",
    tags: ["e-commerce", "agentic-commerce", "shopify"],
  },
  {
    name: "simple-survey",
    tagline: "The survey engine, generalized for anyone",
    summary:
      "Extracted the survey platform built for the research study and finished it as a standalone template, so the next person running a study doesn't rebuild the same thing.",
    bullets: [
      "Made surveys data rather than code — question sets are typed config and conditional logic is declarative, so a new study is a new file, not a new branch of logic.",
      "Made every external provider optional, so the app builds and runs before any credentials exist and someone can clone it and immediately see it work.",
      "Wrote for two audiences at once: a README for humans and a rules file for coding agents, stating the invariants that must not be 'fixed' — PII separation fails closed, and participant text is data, never instructions.",
    ],
    repoUrl: "https://github.com/lucasdickey/simple-survey",
    liveUrl: "https://simple-survey.vercel.app",
    commits: 4,
    firstCommit: "2026-07-02",
    lastCommit: "2026-07-25",
    tags: ["template", "open-source", "next.js"],
  },
  {
    name: "pre-inc-founders-agreement",
    tagline: "The hard conversations, before there's anything to fight over",
    summary:
      "Extended this founder-alignment tool so an agent can run the interview, on the view that the conversation about equity, vesting, IP, and exit terms should meet founders wherever they already are.",
    bullets: [
      "Added an incorporation MCP server as a Delaware C-Corp proof of concept, making the tool callable by an agent rather than only by a person in a browser.",
      "Brought the agent-facing surface in line with the spec, including structured output and proper handling of the sensitive fields no chat transcript should hold.",
      "Documented the tool surface and its composite flow so the design could be reviewed by others without anyone having to run it.",
    ],
    repoUrl: "https://github.com/lucasdickey/pre-inc-founders-agreement",
    liveUrl: "https://pre-inc.vercel.app",
    commits: 4,
    firstCommit: "2026-05-30",
    lastCommit: "2026-06-10",
    tags: ["mcp", "founders", "stripe-atlas"],
  },
  {
    name: "print-mail-service",
    tagline: "Physical mail, ordered by software",
    summary:
      "Made an existing print-and-mail service callable by agents, so a piece of physical mail can be discovered, priced, paid for, and sent without a human in the loop.",
    bullets: [
      "Added discovery and payment-gated endpoints so an agent can find the service, learn what it costs, pay, and place an order end to end.",
      "Fixed a units bug in the charge amount that would have mispriced every agent-initiated order.",
      "Consolidated the existing codebase — removing orphaned flows and centralizing service clients — before layering the agent path on top, rather than building new surface over a shaky base.",
    ],
    repoUrl: "https://github.com/lucasdickey/print-mail-service",
    liveUrl: "https://print-mail-service.vercel.app",
    commits: 4,
    firstCommit: "2026-05-25",
    lastCommit: "2026-05-30",
    tags: ["agentic-commerce", "payments", "lob"],
  },
  {
    name: "10kay",
    tagline: "SEC filing analysis you can trust to re-run",
    summary:
      "Spent the window making this automated 10-K and 10-Q analysis pipeline trustworthy rather than adding to it, on the principle that an unreliable data pipeline produces confident nonsense.",
    bullets: [
      "Introduced a real data-access layer so every write is idempotent, making a re-run of any pipeline phase safe instead of duplicative.",
      "Tracked down silent data loss — a logger that was committing its callers' in-flight work, and batch loops that kept reusing an aborted transaction so one bad row quietly dropped every row after it.",
      "Made the AI output survivable by repairing and recording truncated responses, after finding that the longest and most valuable analyses were being cut off mid-response and discarded whole.",
    ],
    repoUrl: "https://github.com/lucasdickey/10kay",
    liveUrl: "https://10kay.vercel.app",
    commits: 1,
    firstCommit: "2026-07-25",
    lastCommit: "2026-07-25",
    tags: ["data-pipeline", "sec-filings", "python"],
  },
  {
    name: "back-at-ya",
    tagline: "A dormant project, briefly revisited",
    summary:
      "Added a small feature to a parked scheduled-SMS project — kept here because an honest activity log includes the quiet months too.",
    bullets: [
      "Added a click-to-zoom image gallery.",
      "Left on a working branch rather than merged, since the project isn't active.",
      "No other work in the window; the last substantive push was in January 2026.",
    ],
    // Repo is private; nothing deployed.
    commits: 1,
    firstCommit: "2026-06-07",
    lastCommit: "2026-06-07",
    tags: ["dormant"],
  },
];

export function getShipLogStats() {
  const commits = shipLog.reduce((sum, p) => sum + p.commits, 0);
  const live = shipLog.filter((p) => Boolean(p.liveUrl)).length;
  return { projects: shipLog.length, commits, live };
}
