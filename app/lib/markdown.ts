/**
 * Markdown serialization for agent-readable surfaces.
 *
 * These helpers turn the same data the site renders into plain Markdown so
 * that agents, crawlers, and LLMs can consume the site without executing
 * JavaScript or parsing the terminal UI. Used by /cv.md, /blog.md,
 * /syllabus.md and /llms.txt.
 */

import {
  type Entry,
  ENTRY_TYPE_ORDER,
  getTypeInfo,
  groupedEntries,
} from "../data/cv";
import { type BlogPost, getPublishedPosts } from "../data/blog";
import {
  getSyllabusStats,
  syllabus,
  syllabusParts,
  type SyllabusReading,
  type SyllabusStatus,
} from "../data/syllabus";
import { GRAPH_BOOKS, GRAPH_PARTS } from "./syllabusGraph";
import { SITE_URL } from './site';

export { SITE_URL };

/** Resolves relative and anchor hrefs to absolute URLs for off-site consumers. */
function absoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("#")) return `${SITE_URL}/${url}`;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Collapses whitespace so descriptions stay on a single Markdown line. */
function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function renderEntry(entry: Entry): string {
  const lines: string[] = [`### ${entry.title}`, ""];

  const meta: string[] = [`**Date:** ${entry.publishedDate}`];
  if (entry.sourceTitle) {
    meta.push(
      entry.sourceUrl
        ? `**Source:** [${entry.sourceTitle}](${absoluteUrl(entry.sourceUrl)})`
        : `**Source:** ${entry.sourceTitle}`
    );
  }
  lines.push(meta.join("  \n"), "");

  lines.push(oneLine(entry.description), "");

  if (entry.sourceDescription) {
    lines.push(`_${oneLine(entry.sourceDescription)}_`, "");
  }

  return lines.join("\n");
}

/**
 * Full CV as Markdown, ordered to match the site's own section order.
 */
export function renderCvMarkdown(): string {
  const out: string[] = [
    "# Lucas Dickey",
    "",
    "Product leader and serial founder. Currently a Product Manager on Stripe",
    "Atlas, working on company formation and the developer surfaces early-stage",
    "founders build on.",
    "",
    `Canonical HTML version: ${SITE_URL}`,
    "",
    "**LinkedIn:** https://linkedin.com/in/lucasdickey  ",
    "**GitHub:** https://github.com/lucasdickey  ",
    "**X/Twitter:** https://twitter.com/lucasdickey4",
    "",
    "---",
    "",
  ];

  // Known sections first, in the site's order, then anything new that has
  // been added to the data but not yet to ENTRY_TYPE_ORDER.
  const known = ENTRY_TYPE_ORDER.filter((type) => groupedEntries[type]?.length);
  const extra = Object.keys(groupedEntries).filter(
    (type) => !ENTRY_TYPE_ORDER.includes(type as Entry["type"])
  );

  for (const type of [...known, ...extra]) {
    // Sections like blog/books/toys are navigational stubs on the homepage:
    // their entries carry no title and exist only to link to a dedicated
    // page. Dropping untitled entries leaves those sections empty, and
    // llms.txt indexes the pages they pointed at.
    const sectionEntries = (groupedEntries[type] ?? []).filter(
      (entry) => entry.title.trim().length > 0
    );

    if (!sectionEntries.length) {
      continue;
    }

    out.push(`## ${getTypeInfo(type).name}`, "");
    for (const entry of sectionEntries) {
      out.push(renderEntry(entry));
    }
    out.push("---", "");
  }

  const posts = getPublishedPosts();
  if (posts.length) {
    out.push("## Writing", "");
    for (const post of sortPosts(posts)) {
      out.push(
        `- [${post.title}](${SITE_URL}/blog/${post.slug}) — ${post.publishedDate} — ${oneLine(
          post.excerpt
        )} ([Markdown](${SITE_URL}/blog/${post.slug}.md))`
      );
    }
    out.push("");
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

/** A single blog post as a standalone Markdown document with front matter. */
export function renderBlogPostMarkdown(post: BlogPost): string {
  const frontMatter = [
    "---",
    `title: ${JSON.stringify(post.title)}`,
    `date: ${post.publishedDate}`,
    `tags: [${post.tags.join(", ")}]`,
    `read_time: ${post.readTime} min`,
    `canonical: ${SITE_URL}/blog/${post.slug}`,
    "---",
    "",
  ].join("\n");

  return `${frontMatter}${post.content.trim()}\n`;
}

/** Index of all published posts as Markdown. */
export function renderBlogIndexMarkdown(): string {
  const out: string[] = [
    "# Writing — Lucas Dickey",
    "",
    `Canonical HTML version: ${SITE_URL}/blog`,
    "",
  ];

  for (const post of sortPosts(getPublishedPosts())) {
    out.push(
      `## ${post.title}`,
      "",
      `**Date:** ${post.publishedDate} · **Read time:** ${post.readTime} min · **Tags:** ${post.tags.join(
        ", "
      )}`,
      "",
      oneLine(post.excerpt),
      "",
      `[Read in full](${SITE_URL}/blog/${post.slug}) · [Markdown](${SITE_URL}/blog/${post.slug}.md)`,
      "",
    );
  }

  return out.join("\n").trimEnd() + "\n";
}

/** Plain-word status, without the emoji the UI prefixes. */
const STATUS_WORD: Record<SyllabusStatus, string> = {
  read: "Read",
  reading: "Reading",
  pending: "Queued",
};

function renderReading(reading: SyllabusReading): string {
  const lines: string[] = [`#### ${reading.title}`, ""];

  const meta: string[] = [
    `**Author:** ${reading.author}`,
    `**Format:** ${reading.format}`,
    `**Status:** ${STATUS_WORD[reading.status]}`,
  ];
  if (reading.orderIndex) {
    meta.push(`**Suggested reading order:** #${reading.orderIndex}`);
  }
  const link = reading.url ?? reading.amazonUrl;
  if (link) {
    meta.push(`**Link:** ${link}`);
  }
  lines.push(meta.join("  \n"), "");

  if (reading.note) {
    lines.push(oneLine(reading.note), "");
  }

  return lines.join("\n");
}

/**
 * The graph the /syllabus page can be browsed as, written out as an edge list.
 *
 * The list and graph views show the same readings, but the graph also carries
 * structure — which part a reading hangs off, and that every part hangs off one
 * guiding question. Serialising the edges means an agent gets that structure
 * without inferring it from headings or running the page.
 */
function renderSyllabusGraph(): string {
  const out: string[] = [
    "## Graph structure",
    "",
    "The syllabus is a graph: one guiding question at the centre, seven parts",
    "hanging off it, and every reading hanging off its part.",
    "",
    "Edges, as `parent -> child`:",
    "",
  ];

  for (const part of GRAPH_PARTS) {
    out.push(`- \`guiding-question\` -> \`${part.id}\` (${part.label} — ${part.title})`);
  }
  out.push("");
  for (const book of GRAPH_BOOKS) {
    out.push(`- \`${book.partId}\` -> \`${book.slug}\` (${book.title})`);
  }
  out.push("");

  return out.join("\n");
}

/**
 * The whole syllabus as Markdown: framing, every reading with its note and
 * status, the suggested order, and the graph structure behind the graph view.
 */
export function renderSyllabusMarkdown(): string {
  const stats = getSyllabusStats();

  const out: string[] = [
    `# ${syllabus.title}`,
    "",
    `Canonical HTML version: ${SITE_URL}/syllabus`,
    "",
    `> ${oneLine(syllabus.guidingQuestion)}`,
    "",
    oneLine(syllabus.purpose),
    "",
    `**Progress:** ${stats.total} readings across ${stats.parts} parts — ` +
      `${stats.read} read, ${stats.reading} in progress, ${stats.pending} queued.`,
    "",
    "## Lenses",
    "",
    syllabus.lenses.map((lens) => `- ${lens}`).join("\n"),
    "",
    "## Learning goals",
    "",
    syllabus.learningGoals.map((goal, i) => `${i + 1}. ${oneLine(goal)}`).join("\n"),
    "",
    "## Central questions",
    "",
    syllabus.centralQuestions.map((q) => `- ${oneLine(q)}`).join("\n"),
    "",
    "## Readings",
    "",
  ];

  for (const part of syllabusParts) {
    out.push(
      `### ${part.label} — ${part.title}`,
      "",
      oneLine(part.summary),
      "",
      ...part.readings.map(renderReading)
    );
  }

  out.push(
    "## Suggested reading order",
    "",
    syllabus.suggestedOrder.map((item, i) => `${i + 1}. ${item}`).join("\n"),
    "",
    "## The missing book",
    "",
    `The book that has not yet been written sits somewhere between ` +
      `${formatInfluences()}. Its central question would be:`,
    "",
    `> ${oneLine(syllabus.missingBook.question)}`,
    "",
    syllabus.missingBook.progression.map((line) => `- ${line}`).join("\n"),
    "",
    oneLine(syllabus.missingBook.closing),
    "",
    renderSyllabusGraph(),
    "## Addressing a particular view",
    "",
    "Every presentation of this page has a URL, so a specific one can be linked",
    "or fetched directly rather than reached by clicking:",
    "",
    `- ${SITE_URL}/syllabus — the graph, the default`,
    `- ${SITE_URL}/syllabus?view=list — the same readings as a list`,
    `- ${SITE_URL}/syllabus?theme=marketer — the light editorial presentation`,
    `- ${SITE_URL}/syllabus?theme=terminal — the terminal presentation`,
    `- ${SITE_URL}/syllabus.md — this document`,
    "",
    "`view` and `theme` compose, e.g. `?theme=marketer&view=list`. `theme` works",
    "on every page of the site, not just this one, and applies to the page it is",
    "on without changing what the browser has stored. Without either parameter",
    "the page falls back to whatever was last chosen, then to the default.",
    ""
  );

  return out.join("\n").trimEnd() + "\n";
}

/** "A, B, and C" — the Missing Book's influences, as prose. */
function formatInfluences(): string {
  const influences = syllabus.missingBook.influences;
  return `${influences.slice(0, -1).join(", ")}, and ${
    influences[influences.length - 1]
  }`;
}

/**
 * llms.txt index, following the convention at https://llmstxt.org — an H1,
 * a blockquote summary, then link lists pointing at the Markdown surfaces.
 */
export function renderLlmsTxt(): string {
  const posts = sortPosts(getPublishedPosts()).slice(0, 15);

  const out: string[] = [
    "# Lucas Dickey",
    "",
    "> Product leader and serial founder. Currently a Product Manager on Stripe Atlas.",
    "> Previously founder/CEO of DeepCast, co-founder & CPTO of Fernish, CPO of Azibo,",
    "> and an early PM on Amazon's digital music business. Writes and builds at the",
    "> intersection of AI agents, developer surfaces, and company formation.",
    "",
    "This site publishes Markdown alongside every HTML page so that agents can read it",
    "directly. Append `.md` to a blog post URL to get its source.",
    "",
    "Pages render in one of two presentations, selectable per-request with a query",
    "parameter: `?theme=terminal` or `?theme=marketer`. The syllabus additionally",
    "takes `?view=graph` or `?view=list`. The content is identical either way.",
    "",
    "## Core",
    "",
    `- [Full CV (Markdown)](${SITE_URL}/cv.md): Complete professional history, projects, writing, and public work.`,
    `- [Homepage](${SITE_URL}): Terminal-styled index of everything below.`,
    `- [Writing index (Markdown)](${SITE_URL}/blog.md): All published posts with excerpts.`,
    `- [AI & Civilization syllabus (Markdown)](${SITE_URL}/syllabus.md): The full reading syllabus, with every reading, its status, and the graph structure behind it.`,
    "",
    "## Writing",
    "",
  ];

  for (const post of posts) {
    out.push(
      `- [${post.title}](${SITE_URL}/blog/${post.slug}.md): ${oneLine(post.excerpt)}`
    );
  }

  out.push(
    "",
    "## Optional",
    "",
    `- [Reading list](${SITE_URL}/books): Books read and queued.`,
    `- [Toys](${SITE_URL}/toys): Small interactive experiments.`,
    `- [GitHub](https://github.com/lucasdickey): Source for the projects listed in the CV.`,
    ""
  );

  return out.join("\n");
}
