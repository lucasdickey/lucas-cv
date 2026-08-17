// Single source of truth for the CV / portfolio entries rendered on the
// homepage and serialized to Markdown at /cv.md and /llms.txt.
//
// This module is intentionally free of "use client" and of any React or
// browser dependency so that it can be imported by server components and
// by route handlers that emit plain text for agents and crawlers.

export type EntryType =
  | "cv"
  | "code"
  | "news"
  | "opinion"
  | "media"
  | "twitter"
  | "books"
  | "syllabus"
  | "lenny"
  | "toys"
  | "blog";

export interface Entry {
  title: string;
  description: string;
  publishedDate: string;
  type: EntryType;
  sourceUrl?: string;
  sourceTitle: string;
  sourceDescription: string;
}

export const entries: Entry[] = [
  // CV Section - Professional Background
  {
    title: "Lucas Dickey - Senior Product Leader & Serial Founder",
    description:
      "20+ years as PM and product leader across all stages: Amazon (growth), acquisitions, co-founder at Fernish ($45M raised, 250+ employees), founder at DeepCast. Known for 0→1 and 1→10 execution, product-market fit hunting, and hands-on GTM. Experience from public behemoth (Amazon) to VC-backed startups to PE-owned companies.",
    publishedDate: "2025-06-20",
    type: "cv",
    sourceUrl: "https://linkedin.com/in/lucasdickey",
    sourceTitle: "Professional Profile",
    sourceDescription:
      "Senior operator, founder, and product leader (Buttoned up, sanitized version of me, with some spice)",
  },
  {
    title: "Stripe Atlas - Product Manager (2025-Present)",
    description:
      "Product Manager on Stripe Atlas team, working on experimental projects for early-stage company inception. Stripe Atlas has helped 70,000+ startups in 140+ countries incorporate and launch their businesses, streamlining company formation, legal documentation, tax ID registration, banking, and providing startup perks. Focused on building new products and features to support founders at the earliest stages of their startup journey.",
    publishedDate: "2025-12-24",
    type: "cv",
    sourceUrl: "https://stripe.com/atlas",
    sourceTitle: "Stripe Atlas",
    sourceDescription: "Company formation platform - Product Manager",
  },
  {
    title: "DeepCast - CEO & Founder (2023-2025)",
    description:
      "Founded and led podcast intelligence platform leveraging AI for transcription, summarization, and search. Built on Claude LLM, AssemblyAI, Pinecone vector DB. CEO & CPO responsible for product strategy, fundraising, and team building in the rapidly evolving AI/audio space.",
    publishedDate: "2025-06-20",
    type: "cv",
    sourceUrl: "https://deepcast.fm",
    sourceTitle: "DeepCast",
    sourceDescription: "AI-powered podcast intelligence platform",
  },
  {
    title: "Fernish - Co-Founder & CPTO (2017-2023)",
    description:
      "Co-founded furniture rental startup focused on circular economy for renters. Scaled to $45M raised, $20M+ debt facilities, 10K+ customers, 250+ employees, nationwide operations across 7+ major markets. Led product, engineering, design, data science, and shared P&L ownership. Acquired in 2023.",
    publishedDate: "2023-06-28",
    type: "cv",
    sourceUrl: "https://fernish.com",
    sourceTitle: "Fernish",
    sourceDescription: "Furniture rental platform - Co-founder & CPTO",
  },
  {
    title: "Amazon MP3 - Product Manager (2007-2011)",
    description:
      "Early PM on Amazon's digital music business from launch, scaling from $0 to $300M in 3 years. Launched internationally across EU and Japan. Led Cloud Drive/Cloud Player strategy, presented to Jeff Bezos S-team. First internal consumer of CloudFront and S3 for consumer applications - foundation for Amazon Music.",
    publishedDate: "2011-02-01",
    type: "cv",
    sourceUrl: "https://amazon.com",
    sourceTitle: "Amazon",
    sourceDescription: "Digital music platform - launched and scaled to $300M",
  },
  {
    title: "Azibo - Chief Product Officer (2022-2023)",
    description:
      "CPO of Series A landlord management platform. Led product management, design, and strategy. Managed 3 PMs, 1 analyst, 5 designers. Re-launched brand, shipped lease generation, banking features, and accounting suite. Management participant in board meetings.",
    publishedDate: "2023-06-01",
    type: "cv",
    sourceUrl: "https://azibo.com",
    sourceTitle: "Azibo",
    sourceDescription: "Real estate management platform - CPO",
  },

  // GitHub Projects - Real Projects
  {
    title: "pre-inc-founders-agreement",
    description:
      "Conversational web app that guides co-founders through the hard conversations before incorporating — equity splits, vesting, IP contributions, decision-making frameworks, and exit scenarios. Built as a prototype for Stripe Atlas, it uses AI-driven interviews so each founder can reflect independently, then exports aligned terms as YAML (Atlas-compatible), markdown, or formal documents. Because the best time to agree on the uncomfortable stuff is before there's anything to fight over.",
    publishedDate: "2026-01-29",
    type: "code",
    sourceUrl: "https://github.com/lucasdickey/pre-inc-founders-agreement",
    sourceTitle: "GitHub Repository",
    sourceDescription: "AI-guided founder alignment tool — prototype for Stripe Atlas",
  },
  {
    title: "prompt-capture-mcp",
    description:
      "Lightweight system for automatic prompt logging in Claude Code using UserPromptSubmit hooks with FastAPI backend. Captures every prompt sent to Claude Code with metadata including timestamps, project context, workspace info, and model information. Features non-intrusive background operation, markdown-formatted logs, and auto-start integration.",
    publishedDate: "2025-10-30",
    type: "code",
    sourceUrl: "https://github.com/lucasdickey/prompt-capture-mcp",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Lightweight prompt logging for Claude Code - 0 stars",
  },
  {
    title: "a-ok-shop",
    description:
      "AI-generated satire fashion brand with fully automated Shopify storefront. Features GraphQL integration, custom Next.js infrastructure, dynamic game-based discount codes, and self-replicating art generation.",
    publishedDate: "2025-04-20",
    type: "code",
    sourceUrl: "https://github.com/lucas-dickey/a-ok-shop",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Automated e-commerce with AI art generation - 1 star",
  },
  {
    title: "OB3.chat - One Big Beautiful Bill discovery app",
    description:
      "RAG-based chat application that explores House Resolution 1 - 2025, enabling legislators, journalists, and citizens to dig into the thousand-plus page piece of legislation through conversational AI. Live at OB3.chat",
    publishedDate: "2025-06-09",
    type: "code",
    sourceUrl: "https://ob3.chat",
    sourceTitle: "OB3.chat",
    sourceDescription: "Government affairs research tool - 1 star",
  },
  {
    title: "self-replicating-art",
    description:
      "Experimental TypeScript project exploring generative art creation with self-replicating algorithms. Part of the broader A-OK brand ecosystem for automated creative content generation.",
    publishedDate: "2025-05-14",
    type: "code",
    sourceUrl: "https://github.com/lucas-dickey/self-replicating-art",
    sourceTitle: "GitHub Repository",
    sourceDescription:
      "Generative art with self-replicating algorithms - 1 star",
  },
  {
    title: "key-to-sleep",
    description:
      "Sleep story generator that evolved from manual content creation to a fully automated, agentic pipeline. Inspired by bedtime stories for my son JJ, this platform uses AI agents for content creation, audio synthesis, and distribution.",
    publishedDate: "2025-05-28",
    type: "code",
    sourceUrl: "https://github.com/lucas-dickey/key-to-sleep",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Sleep story generator with AI pipeline - 18 stars",
  },
  {
    title: "run-human-run",
    description:
      "2D casual game inspired by Pacman and Snake where a human is chased by apes (representing AI agents) while collecting UBI credits to win discounts at the A-OK shop. A darkly humorous take on AI doomerism and economic anxiety.",
    publishedDate: "2025-05-29",
    type: "code",
    sourceUrl: "https://github.com/lucasdickey/run-humans-run",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Darkly humorous AI doomerism game - 2 stars",
  },
  {
    title: "emojis-everywhere",
    description:
      "Simple Mac client for fetching emojis quickly for pasting in any context. Built with Swift and includes a Makefile-based build system. Designed for efficient emoji lookup and insertion across all macOS applications.",
    publishedDate: "2025-10-10",
    type: "code",
    sourceUrl: "https://github.com/lucasdickey/emojis-everywhere",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Mac emoji quick-access utility - 0 stars",
  },
  {
    title: "VizRepoAssist",
    description:
      "Visual Development Artifacts MCP Server that automatically captures screenshots of web applications during development. Preserves the visual journey of product development by taking screenshots at logical breakpoints and storing them in Git repositories alongside code. Features automated screenshot capture via pre-commit hooks, route auto-discovery for Next.js applications, multi-viewport support, and MCP server integration for Claude Code.",
    publishedDate: "2025-10-16",
    type: "code",
    sourceUrl: "https://github.com/Prompt-Yield/VizRepoAssist",
    sourceTitle: "GitHub Repository",
    sourceDescription:
      "Visual development artifacts capture tool - MCP integration",
  },
  {
    title: "quick-screenshot-annotator",
    description:
      "Quick screenshot annotation tool for macOS built with Swift. Streamlines the process of capturing and annotating screenshots with an intuitive interface. Designed for rapid markup and sharing of visual feedback, perfect for bug reports, design reviews, and documentation.",
    publishedDate: "2025-10-28",
    type: "code",
    sourceUrl: "https://github.com/lucasdickey/quick-screenshot-annotator",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Mac screenshot annotation utility - 0 stars",
  },
  {
    title: "breathe-free",
    description:
      "Mindful breathing exercise web application designed to help users find calm through guided breathing techniques. Features box breathing with customizable breathing cycles, a visual breathing guide, and a minimal, distraction-free interface. Built with Next.js, React, Tailwind CSS, and TypeScript with responsive design for various devices.",
    publishedDate: "2025-10-27",
    type: "code",
    sourceUrl: "https://github.com/lucasdickey/breathe-free",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Guided breathing exercise app - 1 star",
  },
  {
    title: "10kay",
    description: "Automated SEC Filing Analysis for Tech Companies",
    publishedDate: "2025-11-12",
    type: "code",
    sourceUrl: "https://github.com/lucasdickey/10kay",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Strategic insights from 10-K and 10-Q filings, translated into actionable intelligence for tech professionals and operators."
  },
  {
    title: "Voice Mode",
    description: "System-wide voice dictation for Android with AI-powered transcription cleanup",
    publishedDate: "2025-11-12",
    type: "code",
    sourceUrl: "https://github.com/lucasdickey/voice-mode",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Inspired by Wispr Flow for macOS, this app provides intelligent speech-to-text functionality across all Android apps."
  },

  // News Articles - COMMENTED OUT
  // {
  //   title: "Breaking: New JavaScript Framework Released",
  //   description:
  //     "Major announcement of a new JavaScript framework that promises to revolutionize frontend development with improved performance and developer experience.",
  //   publishedDate: "2024-01-03",
  //   type: "news",
  //   sourceUrl: "https://news.dev/new-js-framework",
  //   sourceTitle: "Developer News",
  //   sourceDescription: "Latest news and updates from the software development community",
  // },

  // Industry Insights & Thought Leadership
  {
    title: "AI-Powered Content Creation at Scale",
    description:
      "My X account represents my thoughts on AI, product, and entrepreneurship. For example, insights from building DeepCast and A-OK projects on leveraging Claude, GPT, and other LLMs for automated content generation, from podcasts to e-commerce. Real-world learnings on multi-agent workflows and production AI applications.",
    publishedDate: "2025-01-15",
    type: "opinion",
    sourceUrl: "https://twitter.com/lucasdickey4",
    sourceTitle: "Industry Analysis",
    sourceDescription:
      "AI implementation insights from startup experience (AI engineering explorations, political rants, VC/startup musings)",
  },
  {
    title: "Supercharging The Thing",
    description:
      "Medium article exploring product strategy, growth tactics, and the intersection of technology and human behavior. Insights from years of building and scaling digital products across multiple industries.",
    publishedDate: "2024-12-20",
    type: "opinion",
    sourceUrl:
      "https://lucasdickey.medium.com/supercharging-the-thing-45bfb47bb933",
    sourceTitle: "Medium",
    sourceDescription: "Product strategy and growth insights",
  },
  {
    title:
      "Install Once, Deploy Everywhere: The Publisher's Dream in the Agentic Era",
    description:
      "Reflecting on DeepCast experience and what publishers need in the agentic era. Explores the vision of install-once, deploy-everywhere solutions for publishers navigating the evolving AI landscape and monetization opportunities.",
    publishedDate: "2025-08-15",
    type: "opinion",
    sourceUrl: "https://promptyield.com/blog/install-once-publishers-dream",
    sourceTitle: "PromptYield Blog",
    sourceDescription: "Publisher strategy and agentic era insights",
  },
  {
    title:
      "Advertising is Critical for AI Adoption: LLMs Are Everywhere—Affiliate Monetization Should Be Too",
    description:
      "AI is becoming a ubiquitous collaborator across the internet, creating countless unmonetized commercial opportunities beyond traditional chat interfaces. Analysis of how affiliate marketing and advertising can capitalize on the expanding LLM ecosystem.",
    publishedDate: "2025-07-18",
    type: "opinion",
    sourceUrl: "https://promptyield.com/blog/advertising-critical-ai-adoption",
    sourceTitle: "PromptYield Blog",
    sourceDescription: "AI monetization and affiliate marketing strategy",
  },
  {
    title:
      "A Former Ecomm Exec's Perspective on Natural Language Advertising and Expectations of Affiliate Platforms",
    description:
      "Prompt Yield is anticipating the needs of the demand side (publishers & developers) and merchants alike. Merchants should push for more from their monetization stack tooling, including affiliate revenue platforms. Insights from e-commerce experience on natural language advertising in the agentic era.",
    publishedDate: "2025-08-13",
    type: "opinion",
    sourceUrl:
      "https://promptyield.com/blog/merchant-expectations-in-an-agentic-era",
    sourceTitle: "PromptYield Blog",
    sourceDescription: "E-commerce and affiliate platform expectations",
  },

  // Blog
  {
    title: "",
    description:
      "Exploring software development, learning, and technology through the lens of agentic coding and continuous personal growth. Powered by simple TypeScript files rather than a complex CMS.",
    publishedDate: "2025-09-12",
    type: "blog",
    sourceUrl: "/blog",
    sourceTitle: "Personal Blog",
    sourceDescription: "Lightweight blog built with Next.js and TypeScript",
  },

  // Recent Reads
  {
    title: "",
    description:
      "Books I've read or re-read in the last 90 days. These are contemporaneous books as well as ones I've revisited recently. A mix of fiction, philosophy, psychology, and economics that inform my thinking on technology, society, and human nature.",
    publishedDate: "2025-07-15",
    type: "books",
    sourceTitle: "Personal Library",
    sourceDescription: "Recent reading list and book recommendations",
  },

  // AI & Civilization Syllabus
  {
    title: "",
    description:
      "A self-directed reading program built around a single question: if intelligence becomes abundant, inexpensive, and increasingly non-human, which theories of civilization still hold — and which must be rewritten? Seven parts spanning history, media theory, economics, institutions, AI futures, ethics, and governance.",
    publishedDate: "2026-08-06",
    type: "syllabus",
    sourceTitle: "AI & Civilization Reading Syllabus",
    sourceDescription:
      "Multidisciplinary reading syllabus on AI as a civilizational technology",
  },

  // Lenny's Recommendations
  {
    title: "",
    description:
      "Curated book recommendations from Lenny Rachitsky's newsletter. These are essential reads for product managers, entrepreneurs, and startup founders.",
    publishedDate: "2025-07-21",
    type: "lenny",
    sourceUrl: "#lenny",
    sourceTitle: "Lenny's Newsletter",
    sourceDescription: "Essential startup and product management reads",
  },

  // Recent Toys
  {
    title: "",
    description:
      "Gadgets, tools, and interesting products I've recently purchased and can recommend. Each comes with my personal thoughts on why I bought it and how it's been working out.",
    publishedDate: "2025-07-15",
    type: "toys",
    sourceUrl: "#toys",
    sourceTitle: "Personal Gear",
    sourceDescription: "Recent purchases and product recommendations",
  },

  // Podcast & Media
  {
    title: "Key To Sleep",
    description:
      "AI-generated sleep stories and calming content designed to help listeners fall asleep naturally. Created after manually doing scripts through ChatGPT, artwork with DALL-E, and speech-to-text with Eleven Labs for my son. This podcast was my first agile spike on an end-to-end agentic creation of a podcast. My son loves it when I publish a new episode for him. Features automated content creation pipeline with soothing narratives and ambient soundscapes.",
    publishedDate: "2024-05-01",
    type: "media",
    sourceUrl: "https://anchor.fm/s/104b5c3cc/podcast/rss",
    sourceTitle: "Key To Sleep",
    sourceDescription: "AI-generated sleep stories and calming content",
  },
  {
    title: "Apes on Keys YouTube Channel",
    description:
      "Creative video content exploring music, technology, and digital creativity (piano performances, tech tutorials, and creative process videos). Features original compositions, tech experiments, and behind-the-scenes content from various projects and creative endeavors.",
    publishedDate: "2024-03-01",
    type: "media",
    sourceUrl: "https://www.youtube.com/@apesonkeys/videos",
    sourceTitle: "Apes on Keys",
    sourceDescription: "YouTube channel for music and creative content",
  },
  // Cross-Industry Product Leadership
  {
    title:
      "Multi-Industry Product Leadership: Digital Media, AdTech, Ticketing & Biometrics",
    description:
      "Led product across diverse high-growth sectors: doubleTwist (digital music/media management, 'iTunes for Android' with Pandora-like radio using Echo Nest, 7 OS integrations, featured at Google I/O); Thinknear (adtech/martech, scaled $1M→$35M revenue, employee #10→85); Atom Tickets (adtech/data services, Fandango competitor); Rival (ticketing/biometrics, facial recognition + rotating QR codes for stadium access, sold to Ticketmaster). Consistent track record of 0→1 execution across consumer and B2B platforms.",
    publishedDate: "2017-05-01",
    type: "cv",
    sourceUrl: "https://linkedin.com/in/lucasdickey",
    sourceTitle: "Cross-Industry Experience",
    sourceDescription:
      "Product leadership across adtech, martech, ticketing, and biometrics",
  },
  // Angel Investing & Advisory
  {
    title: "Angel Investor & Startup Advisor Portfolio",
    description:
      "Active angel investor and advisor since 2011. Portfolio includes Trellis (legal intelligence), Abstract (government affairs), Nine Sixteen (acquired by Fyllo), Mapfit (acquired by Foursquare), and others. Focus on B2B SaaS, AI/ML applications, and marketplace businesses.",
    publishedDate: "2025-01-01",
    type: "cv",
    sourceUrl: "https://linkedin.com/in/lucasdickey",
    sourceTitle: "Investment Portfolio",
    sourceDescription: "Angel investor and startup advisor since 2011",
  },
  // Civic & Ecosystem Leadership
  {
    title: "LA Tech Ecosystem & Civic Leadership",
    description:
      "Decade-long commitment to LA civic engagement and entrepreneurship ecosystem: Westwood Neighborhood Council (Policy Committee & At-Large Board), North Area Neighborhood Development Council (Renter Representative), PledgeLA/Fund for South LA Founders, Annenberg Tech, UNITE-LA, Riordan College-to-Career (C2C), LA-Tech.org, Bixel Exchange, Grid110, SoCal Tech for SoCal Hospitals, and IAB working groups. Focus on workforce development, pipeline access, job creation, and policy advocacy.",
    publishedDate: "2024-12-01",
    type: "cv",
    sourceUrl: "https://westwoodcouncil.org",
    sourceTitle: "Civic & Ecosystem Leadership",
    sourceDescription: "LA tech ecosystem building and civic policy engagement",
  },
];

/**
 * Canonical section order, mirrored by the terminal homepage and the
 * Markdown serializer so both surfaces present the CV identically.
 */
export const ENTRY_TYPE_ORDER: EntryType[] = [
  "cv",
  "code",
  "blog",
  "books",
  "syllabus",
  "lenny",
  "toys",
  "twitter",
  "opinion",
];

export const ENTRY_TYPE_LABELS: Record<string, { name: string; icon: string }> =
  {
    cv: { name: "Professional Profile", icon: "👤" },
    code: { name: "Museum of Passion Projects", icon: "📦" },
    opinion: { name: "Recent Opinion Pieces", icon: "💭" },
    blog: { name: "Musings: Work & Life", icon: "📝" },
    media: { name: "Media", icon: "🎬" },
    twitter: { name: "Twitter Posts", icon: "🐦" },
    books: { name: "Reading, Read, Reading Soon", icon: "📚" },
    syllabus: { name: "AI & Civilization Syllabus", icon: "🏛️" },
    lenny: { name: "Lenny's Recommendations", icon: "📖" },
    toys: { name: "Recent Toys", icon: "🧸" },
  };

export function getTypeInfo(type: string): { name: string; icon: string } {
  return (
    ENTRY_TYPE_LABELS[type] || {
      name: type.charAt(0).toUpperCase() + type.slice(1),
      icon: "📄",
    }
  );
}

/**
 * Groups entries by type and sorts each group newest-first.
 *
 * This is a pure function over module-level data, so it can run during the
 * server render. Previously this work happened inside a `useEffect` behind a
 * 500ms timeout, which meant the server-rendered HTML contained a loading
 * placeholder instead of any content.
 */
export function groupEntriesByType(
  source: Entry[] = entries
): Record<string, Entry[]> {
  const grouped: Record<string, Entry[]> = {};

  source.forEach((entry) => {
    if (!grouped[entry.type]) {
      grouped[entry.type] = [];
    }
    grouped[entry.type].push(entry);
  });

  Object.keys(grouped).forEach((type) => {
    grouped[type].sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );
  });

  return grouped;
}

/**
 * Sections hidden from the site while their content is reworked.
 *
 * Nothing is deleted: the entries stay in `entries` above and remain
 * reachable via `groupEntriesByType(entries)`. They are simply left out of
 * every rendered surface — the terminal view, the marketer view, and the
 * Markdown at /cv.md — so the section can be rewritten before it goes back up.
 *
 * To restore a section, remove its type from this set.
 */
export const ARCHIVED_ENTRY_TYPES = new Set<EntryType>(["code"]);

export function isArchivedType(type: string): boolean {
  return ARCHIVED_ENTRY_TYPES.has(type as EntryType);
}

/** Every entry, including archived sections. */
export const allGroupedEntries: Record<string, Entry[]> = groupEntriesByType();

/**
 * Entries grouped once at module scope, with archived sections removed.
 * This is what the site and the Markdown surfaces render.
 */
export const groupedEntries: Record<string, Entry[]> = groupEntriesByType(
  entries.filter((entry) => !isArchivedType(entry.type))
);
