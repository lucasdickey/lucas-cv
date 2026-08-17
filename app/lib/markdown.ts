/**
 * Markdown serialization for agent-readable surfaces.
 *
 * These helpers turn the same data the site renders into plain Markdown so
 * that agents, crawlers, and LLMs can consume the CV without executing
 * JavaScript or parsing the terminal UI. Used by /cv.md, /blog.md and
 * /llms.txt.
 */

import {
  type Entry,
  ENTRY_TYPE_ORDER,
  getTypeInfo,
  groupedEntries,
} from "../data/cv";
import { type BlogPost, getPublishedPosts } from "../data/blog";

export const SITE_URL = "https://lucas.cv";

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
    "## Core",
    "",
    `- [Full CV (Markdown)](${SITE_URL}/cv.md): Complete professional history, projects, writing, and public work.`,
    `- [Homepage](${SITE_URL}): Terminal-styled index of everything below.`,
    `- [Writing index (Markdown)](${SITE_URL}/blog.md): All published posts with excerpts.`,
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
    `- [AI & Civilization syllabus](${SITE_URL}/syllabus): Curated readings on AI and society.`,
    `- [Toys](${SITE_URL}/toys): Small interactive experiments.`,
    `- [GitHub](https://github.com/lucasdickey): Source for the projects listed in the CV.`,
    ""
  );

  return out.join("\n");
}
