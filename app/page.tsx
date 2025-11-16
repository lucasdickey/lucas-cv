"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Linkedin, Twitter, Youtube, ShoppingBag } from "lucide-react";
import AudioPlayer from "../components/AudioPlayer";
import IngestionQueue from "../components/IngestionQueue";
import { useViewMode } from "./contexts/view-mode-context";
import MarketerHome from "./components/MarketerHome";
import { getCodeProjectImage } from "./utils/codeProjectImages";
import { ListeningSection } from "./components/ListeningSection";
import { ExpandableSection } from "./components/ExpandableSection";

interface Entry {
  title: string;
  description: string;
  publishedDate: string;
  type:
    | "cv"
    | "code"
    | "news"
    | "opinion"
    | "media"
    | "twitter"
    | "books"
    | "lenny"
    | "toys"
    | "blog";
  sourceUrl?: string;
  sourceTitle: string;
  sourceDescription: string;
}

type ContributionLevelString =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

type ContributionDay = {
  date: string;
  contributionCount: number;
  intensity?: number;
  level?: number;
  contributionLevel?: ContributionLevelString;
};

type ContributionWeek = {
  contributionDays: ContributionDay[];
};

interface GitHubContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

import { type Book, books as recentBooks } from "./data/books";
import { toys } from "./data/toys";
import { lennyRecommendations } from "./data/lenny";
import { getPublishedPosts } from "./data/blog";

const entries: Entry[] = [
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

const asteriskVariants = ["*", "✻", "∗", "※", "❄", "✢"];
const thinkingVariants = [
  "cogitating",
  "processing",
  "reflecting",
  "evaluating",
  "concluding",
  "generating",
  "developing",
  "assembling",
  "composing",
  "digesting",
  "exploring",
  "examining",
  "ideating",
  "iterating",
  "computing",
  "planning",
  "scheming",
  "thinking",
  "working",
  "crafting",
  "building",
  "creating",
  "weaving",
  "molding",
  "shaping",
  "designing",
  "plotting",
  "hatching",
  "cooking",
  "formulating",
];

export default function TerminalRepoList() {
  const { viewMode } = useViewMode();
  const [loading, setLoading] = useState(true);
  const [groupedEntries, setGroupedEntries] = useState<Record<string, Entry[]>>(
    {}
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [asteriskIndex, setAsteriskIndex] = useState(0);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [githubContributions, setGithubContributions] =
    useState<GitHubContributionData | null>(null);
  const [githubContributionsError, setGithubContributionsError] =
    useState(false);

  const contributionColors = [
    "#f6f1d9",
    "#eadbb4",
    "#d4b185",
    "#b07a4b",
    "#6c4328",
  ];

  const getContributionLevel = (day: ContributionDay) => {
    if (typeof day.intensity === "number") {
      return Math.max(
        0,
        Math.min(contributionColors.length - 1, day.intensity)
      );
    }
    if (typeof day.level === "number") {
      return Math.max(0, Math.min(contributionColors.length - 1, day.level));
    }
    if (day.contributionLevel) {
      const map: Record<ContributionLevelString, number> = {
        NONE: 0,
        FIRST_QUARTILE: 1,
        SECOND_QUARTILE: 2,
        THIRD_QUARTILE: 3,
        FOURTH_QUARTILE: 4,
      };
      return map[day.contributionLevel];
    }
    if (typeof day.contributionCount === "number") {
      if (day.contributionCount === 0) return 0;
      if (day.contributionCount >= 20) return 4;
      if (day.contributionCount >= 10) return 3;
      if (day.contributionCount >= 5) return 2;
      return 1;
    }
    return 0;
  };

  const getFallbackCodeProjectImage = (entry: Entry) => {
    if (entry.sourceUrl) {
      try {
        const url = new URL(entry.sourceUrl);
        if (url.hostname === "github.com") {
          const segments = url.pathname.split("/").filter(Boolean);
          const owner = segments[0];
          const repo = segments[1];
          if (owner && repo) {
            return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
          }
        }
        return `https://v1.screenshot.11ty.dev/${encodeURIComponent(
          entry.sourceUrl
        )}/opengraph/`;
      } catch (error) {
        console.warn(
          "Unable to generate project image for",
          entry.title,
          error
        );
      }
    }
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none"><rect width="400" height="240" rx="16" fill="%23F4F5F7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236B778C" font-family="Arial" font-size="18">Project Preview</text></svg>';
  };

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 3000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    // Animate asterisk and thinking words every 500ms with random selection
    const animationInterval = setInterval(() => {
      setAsteriskIndex(Math.floor(Math.random() * asteriskVariants.length));
      setThinkingIndex(Math.floor(Math.random() * thinkingVariants.length));
    }, 1000);

    return () => clearInterval(animationInterval);
  }, []);

  useEffect(() => {
    const usernames = ["lucas-dickey", "lucasdickey"];

    const fetchContributions = async () => {
      for (const username of usernames) {
        try {
          const response = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${username}?type=calendar`
          );
          if (!response.ok) {
            continue;
          }
          const data = await response.json();
          const total =
            data.totalContributions ??
            data.contributions?.[0]?.totalContributions ??
            data.contributionYears?.[0]?.total ??
            0;
          const weeks: ContributionWeek[] =
            data.weeks ??
            data.contributions?.[0]?.weeks ??
            data.contributionYears?.[0]?.weeks ??
            [];

          if (weeks.length) {
            setGithubContributions({ totalContributions: total, weeks });
            setGithubContributionsError(false);
            return;
          }
        } catch (error) {
          console.warn(
            `Failed to load GitHub contributions for ${username}`,
            error
          );
        }
      }

      setGithubContributionsError(true);
    };

    fetchContributions();
  }, []);

  useEffect(() => {
    // Simulate loading delay for terminal effect
    setTimeout(() => {
      const grouped: Record<string, Entry[]> = {};

      entries.forEach((entry) => {
        if (!grouped[entry.type]) {
          grouped[entry.type] = [];
        }
        grouped[entry.type].push(entry);
      });

      // Sort each group by date (newest first)
      Object.keys(grouped).forEach((type) => {
        grouped[type].sort(
          (a, b) =>
            new Date(b.publishedDate).getTime() -
            new Date(a.publishedDate).getTime()
        );
      });

      setGroupedEntries(grouped);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!loading) {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [loading]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrentTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options).replace(",", "");
  };

  const getTypeInfo = (type: string) => {
    const typeMap: Record<string, { name: string; icon: string }> = {
      cv: { name: "Professional Profile", icon: "👤" },
      code: { name: "Museum of Passion Projects", icon: "📦" },
      // news: { name: "News Articles", icon: "📰" }, // COMMENTED OUT
      opinion: { name: "Recent Opinion Pieces", icon: "💭" },
      blog: { name: "Musings: Work & Life", icon: "📝" },
      media: { name: "Media", icon: "🎬" },
      twitter: { name: "Twitter Posts", icon: "🐦" },
      books: { name: "Reading, Read, Reading Soon", icon: "📚" },
      lenny: { name: "Lenny's Recommendations", icon: "📖" },
      toys: { name: "Recent Toys", icon: "🧸" },
    };
    return (
      typeMap[type] || {
        name: type.charAt(0).toUpperCase() + type.slice(1),
        icon: "📄",
      }
    );
  };

  // Render marketer view if in marketer mode
  if (viewMode === "marketer") {
    return <MarketerHome />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5dc] text-[#333333] font-mono p-5">
        <div className="text-center text-[#8b0000] py-5">
          Loading entries<span className="animate-pulse">_</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5dc] text-[#333333] font-mono p-5">
      {/* Terminal Header */}
      <div className="border border-[#cccccc] bg-[#e8e8d8] p-2 md:p-4 mb-5 rounded-md shadow-sm overflow-x-auto">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff6057] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-4 text-[#666666] text-sm">terminal — bash</div>
        </div>
        <div className="text-[#8b0000] mb-2 text-xs md:text-sm">
          <span className="hidden sm:inline">
            {formatCurrentTime(currentTime)}{" "}
          </span>
          <span className="inline sm:hidden">~/</span>
          <span className="font-bold">lucas-dickey</span> git:(master)±9 lucas
        </div>
        {/* Desktop ASCII Art */}
        <pre className="text-[#8b0000] mb-2 text-xs leading-none hidden lg:block">
          {`
▒▒▒        ▒▒▒  ▒▒▒   ▒▒▒▒▒▒    ▒▒▒▒▒▒    ▒▒▒▒▒▒ 
▒▒▒        ▒▒▒  ▒▒▒   ▒▒▒▒▒▒    ▒▒▒▒▒▒    ▒▒▒▒▒▒ 
▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒  ▒▒▒  ▒▒▒     
▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒  ▒▒▒  ▒▒▒     
▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒ 
▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒ 
▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒  ▒▒▒       ▒▒▒
▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒  ▒▒▒       ▒▒▒
▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒    ▒▒▒▒▒▒   ▒▒▒  ▒▒▒   ▒▒▒▒▒▒ 
▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒    ▒▒▒▒▒▒   ▒▒▒  ▒▒▒   ▒▒▒▒▒▒`}
        </pre>
        {/* Tablet ASCII Art */}
        <pre className="text-[#8b0000] mb-2 text-xs leading-none hidden md:block lg:hidden">
          {`
▒▒▒     ▒▒  ▒▒  ▒▒▒▒   ▒▒▒▒   ▒▒▒▒ 
▒▒▒     ▒▒  ▒▒  ▒▒     ▒▒▒▒   ▒▒   
▒▒▒     ▒▒  ▒▒  ▒▒     ▒▒▒▒   ▒▒▒▒ 
▒▒▒     ▒▒  ▒▒  ▒▒     ▒  ▒      ▒▒
▒▒▒▒▒▒  ▒▒▒▒▒   ▒▒▒▒   ▒  ▒   ▒▒▒▒`}
        </pre>
        {/* Mobile ASCII Art */}
        <pre className="text-[#8b0000] mb-2 text-xs leading-none block md:hidden">
          {`
▒▒    ▒▒  ▒▒  ▒▒▒  ▒▒▒  ▒▒▒
▒▒    ▒▒  ▒▒  ▒    ▒▒▒  ▒  
▒▒    ▒▒  ▒▒  ▒    ▒▒▒  ▒▒▒
▒▒    ▒▒  ▒▒  ▒    ▒ ▒    ▒
▒▒▒▒  ▒▒▒▒   ▒▒▒  ▒  ▒  ▒▒▒`}
        </pre>
        <div className="text-[#333333] mb-1 text-xs md:text-sm">
          <span className="hidden sm:inline">
            Vibe coded by Lucas with his colleague Claude Code -- flattering
            hallucinations, &apos;{asteriskVariants[asteriskIndex]}{" "}
            {thinkingVariants[thinkingIndex]}&apos;, and all!
          </span>
          <span className="inline sm:hidden">
            Vibe coded by Lucas with Claude Code
          </span>
        </div>
        <div className="text-[#333333] mb-1">
          <span className="text-[#8b0000]">$</span> ls -la{" "}
        </div>
      </div>

      {/* Table of Contents */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="text-[#8b0000] font-bold mb-3">Table of Contents</div>
        <div className="text-sm">
          <div className="flex flex-col gap-2">
            {Object.keys(groupedEntries)
              .sort((a, b) => {
                const order = [
                  "cv",
                  "code",
                  "blog",
                  "books",
                  "lenny",
                  "toys",
                  "podcasts",
                  "twitter",
                  "opinion",
                ];
                const aIndex = order.indexOf(a);
                const bIndex = order.indexOf(b);
                // Handle -1 (not in order array) by putting them at the end
                return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
              })
              .filter((type) => type !== "media")
              .map((type) => {
                // Skip opinion, we'll add it after podcasts
                if (type === "opinion") return null;

                const typeInfo = getTypeInfo(type);
                return (
                  <a
                    key={type}
                    href={`#${type}`}
                    className="text-left px-2 py-1 rounded hover:bg-[#e0e0d0] transition-colors text-[#0000ff] hover:underline"
                  >
                    {typeInfo.icon} {typeInfo.name} (
                    {type === "books"
                      ? recentBooks.length
                      : type === "lenny"
                      ? lennyRecommendations.length
                      : type === "toys"
                      ? toys.length
                      : type === "blog"
                      ? getPublishedPosts().length
                      : groupedEntries[type].length}
                    )
                  </a>
                );
              })}

            {/* Opinion link in table of contents */}
            {groupedEntries["opinion"] && (
              <a
                href="#opinion"
                className="text-left px-2 py-1 rounded hover:bg-[#e0e0d0] transition-colors text-[#0000ff] hover:underline"
              >
                💭 Opinions Posted Elsewhere ({groupedEntries["opinion"].length})
              </a>
            )}

            {/* Podcast Brain Food link in table of contents */}
            <a
              href="#podcasts"
              className="text-left px-2 py-1 rounded hover:bg-[#e0e0d0] transition-colors text-[#0000ff] hover:underline"
            >
              🎙️ Podcast Brain Food
            </a>
          </div>
        </div>
      </div>

      {/* Audio Resume */}
      <div className="mb-5">
        <AudioPlayer
          audioSrc="/resume-audio.mp3"
          title="🎧 Listen to Lucas Dickey's CV"
          description="Hear this resume read aloud using Eleven Labs TTS with Lucas's voice clone"
        />
      </div>

      {/* Quick Links */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="text-[#8b0000] font-bold mb-3">Quick Links</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Linkedin size={16} className="text-[#333333]" />
            <a
              href="https://linkedin.com/in/lucasdickey"
              className="text-[#0000ff] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ./lucasdickey
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Github size={16} className="text-[#333333]" />
            <a
              href="https://github.com/lucas-dickey"
              className="text-[#0000ff] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ./lucasdickey
            </a>
            <span className="text-[#666666] text-xs ml-2">
              (Recent projects emphasizing fun vibe coded projects of different
              magnitudes)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Twitter size={16} className="text-[#333333]" />
            <a
              href="https://twitter.com/lucasdickey4"
              className="text-[#0000ff] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @lucasdickey4
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Youtube size={16} className="text-[#333333]" />
            <a
              href="https://youtube.com/@apesonkeys"
              className="text-[#0000ff] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @apesonkeys
            </a>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <ShoppingBag size={16} className="text-[#333333]" />
          <a
            href="https://a-ok.shop"
            className="text-[#0000ff] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            A-OK.shop
          </a>
          <span className="text-[#666666] text-xs ml-2">
            (AI-driven nerdwear satire fashion brand)
          </span>
        </div>
      </div>

      {/* GitHub Contributions Timeline */}
      {githubContributions && !githubContributionsError && (
        <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
          <div className="text-[#8b0000] font-bold mb-3">
            GitHub Commit Timeline
            <span className="text-[#666666] text-sm ml-2 font-normal">
              ({githubContributions.totalContributions} contributions in the last year)
            </span>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-flex gap-[2px] min-w-full">
              {githubContributions.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {week.contributionDays.map((day, dayIndex) => {
                    const level = getContributionLevel(day);
                    const color = contributionColors[level];
                    return (
                      <div
                        key={dayIndex}
                        className="group relative"
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: color,
                          borderRadius: '2px',
                          border: '1px solid #cccccc',
                        }}
                        title={`${day.date}: ${day.contributionCount} contributions`}
                      >
                        <div className="hidden group-hover:block absolute z-10 bg-[#333333] text-white text-xs px-2 py-1 rounded whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2">
                          {day.date}: {day.contributionCount} contributions
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-[#666666]">
            <span>Less</span>
            {contributionColors.map((color, index) => (
              <div
                key={index}
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: color,
                  borderRadius: '2px',
                  border: '1px solid #cccccc',
                }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {Object.keys(groupedEntries)
          .sort((a, b) => {
            const order = [
              "cv",
              "code",
              "blog",
              "books",
              "lenny",
              "toys",
              "twitter",
              "opinion",
            ];
            const aIndex = order.indexOf(a);
            const bIndex = order.indexOf(b);
            return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
          })
          .filter((type) => type !== "media")
          .map((type) => {
            const typeInfo = getTypeInfo(type);
            const typeEntries = groupedEntries[type];

            return (
              <div
                key={type}
                id={type}
                className="mb-8 border border-[#cccccc] rounded-md overflow-hidden shadow-sm"
              >
                {/* Type Header */}
                <div className="bg-[#e8e8d0] px-4 py-3 border-b border-[#cccccc]">
                  <span className="text-[#8b0000] text-lg font-bold">
                    {typeInfo.icon} {typeInfo.name}
                    {type === "code" && ": Code Repositories"}
                  </span>
                  <span className="text-[#666666] text-sm ml-2">
                    (
                    {type === "books"
                      ? recentBooks.length
                      : type === "lenny"
                      ? lennyRecommendations.length
                      : type === "toys"
                      ? toys.length
                      : type === "blog"
                      ? getPublishedPosts().length
                      : typeEntries.length}{" "}
                    {type === "books"
                      ? "books"
                      : type === "lenny"
                      ? "books"
                      : type === "toys"
                      ? "toys"
                      : type === "blog"
                      ? "posts"
                      : "entries"}
                    )
                  </span>
                </div>

                {/* Entries List */}
                <div className="bg-[#f5f5dc]">
                  {/* Determine if this section should be expandable */}
                  {(() => {
                    const expandableConfig: Record<string, number> = {
                      cv: 4,
                      code: 6,
                      blog: 5,
                      toys: 3,
                      books: 4,
                      lenny: 1,
                      opinion: 2,
                    };
                    const maxRows = expandableConfig[type];
                    const entriesContent = typeEntries.map((entry, index) => {
                    const isCodeEntry = entry.type === "code";
                    const codeEntryImage = isCodeEntry
                      ? (() => {
                          const marketingImage = getCodeProjectImage(entry);
                          return (
                            marketingImage || getFallbackCodeProjectImage(entry)
                          );
                        })()
                      : null;

                    const renderEntryHeaderAndDescription = () => (
                      <>
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <div className="text-[#0000ff] font-bold text-lg">
                            {entry.sourceUrl ? (
                              <a
                                href={entry.sourceUrl}
                                className="hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {entry.title}
                              </a>
                            ) : (
                              <span>{entry.title}</span>
                            )}
                          </div>
                          <span className="text-[#8b0000] text-sm whitespace-nowrap">
                            {formatDate(entry.publishedDate)}
                          </span>
                        </div>

                        <div className="text-[#333333] mb-4 leading-relaxed">
                          {entry.description}
                        </div>
                      </>
                    );

                    return (
                      <div
                        key={index}
                        className="p-4 border-b border-[#e0e0d0] last:border-b-0 hover:bg-[#f0f0e0] transition-colors duration-200"
                      >
                        {isCodeEntry ? (
                          <div className="flex flex-col md:flex-row gap-4 items-start mb-2">
                            {codeEntryImage ? (
                              <div className="w-full max-w-sm md:max-w-[200px] rounded border border-[#cccccc] shadow-sm bg-[#fafafa] flex items-center justify-center p-4">
                                <img
                                  src={codeEntryImage}
                                  alt={`${entry.title} repository preview`}
                                  className={`rounded border border-[#cccccc] shadow-sm ${
                                    entry.title === "10kay"
                                      ? "w-1/2 h-auto"
                                      : "w-full h-auto"
                                  }`}
                                />
                              </div>
                            ) : (
                              <div className="w-full max-w-sm md:max-w-[200px] h-32 rounded border border-[#cccccc] shadow-sm bg-[#0d1117] flex items-center justify-center">
                                <Github className="w-16 h-16 text-white" />
                              </div>
                            )}
                            <div className="flex-1">
                              {renderEntryHeaderAndDescription()}
                            </div>
                          </div>
                        ) : (
                          renderEntryHeaderAndDescription()
                        )}

                        {entry.type === "books" && (
                          (() => {
                            const booksToShow = recentBooks.filter(
                              (book) => book.status !== "pending"
                            ).sort((a, b) => {
                              if (a.status === "reading" && b.status !== "reading")
                                return -1;
                              if (a.status !== "reading" && b.status === "reading")
                                return 1;
                              return 0;
                            });

                            const booksContent = (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {booksToShow.map(
                                  (book: Book, bookIndex: number) => (
                                    <div
                                      key={bookIndex}
                                      className="border border-[#cccccc] rounded-lg p-3 bg-[#fafafa] hover:bg-[#f0f0f0] transition-colors relative"
                                    >
                                      {book.status === "reading" && (
                                        <div className="absolute top-2 right-2 bg-[#ff0000] text-white text-xs font-bold px-2 py-1 rounded">
                                          📖 Reading
                                        </div>
                                      )}
                                      <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                          <img
                                            src={book.coverUrl}
                                            alt={`${book.title} cover`}
                                            className="w-16 h-24 object-cover rounded shadow-sm"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0 pr-16">
                                          <h4 className="font-bold text-[#333333] mb-1 text-sm leading-tight">
                                            {book.title}
                                          </h4>
                                          <p className="text-[#666666] text-xs mb-2">
                                            by {book.author}
                                          </p>
                                          <p className="text-[#333333] text-xs mb-2 leading-relaxed">
                                            {book.description}
                                          </p>
                                          <div className="flex items-center gap-4">
                                            <a
                                              href={book.amazonUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-[#0000ff] text-xs hover:underline"
                                            >
                                              View on Amazon
                                            </a>
                                            <Link
                                              href={`/books/${book.slug}`}
                                              className="text-[#0000ff] hover:underline"
                                              title="View details"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                                />
                                              </svg>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            );

                            return (
                              <>
                                {booksToShow.length > 8 ? (
                                  <ExpandableSection
                                    maxRows={4}
                                    rowHeight={160}
                                    expandLabel="Show all books"
                                    collapseLabel="Hide extra books"
                                  >
                                    {booksContent}
                                  </ExpandableSection>
                                ) : (
                                  booksContent
                                )}
                                <IngestionQueue books={recentBooks} />
                              </>
                            );
                          })()
                        )}

                        {/* Toys Grid for Recent Toys */}
                        {entry.type === "toys" && (
                          (() => {
                            const toysContent = (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {toys.map((toy, toyIndex) => (
                                  <div
                                    key={toyIndex}
                                    className="border border-[#cccccc] rounded-lg p-3 bg-[#fafafa] hover:bg-[#f0f0f0] transition-colors"
                                  >
                                    <div className="flex gap-4">
                                      <div className="flex-shrink-0">
                                        <img
                                          src={toy.imageUrl}
                                          alt={`${toy.title} product image`}
                                          className="w-16 h-16 object-cover rounded shadow-sm"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-[#333333] mb-1 text-sm leading-tight">
                                          {toy.title}
                                        </h4>
                                        <p className="text-[#333333] text-xs mb-2 leading-relaxed">
                                          {toy.description}
                                        </p>
                                        {toy.comment && (
                                          <p className="text-[#666666] text-xs mb-2 italic leading-relaxed">
                                            &ldquo;{toy.comment}&rdquo;
                                          </p>
                                        )}
                                        <div className="flex items-center gap-4">
                                          <a
                                            href={toy.amazonUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#0000ff] text-xs hover:underline"
                                          >
                                            View on Amazon
                                          </a>
                                          <Link
                                            href={`/toys/${toy.slug}`}
                                            className="text-[#0000ff] hover:underline"
                                            title="View details"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                              />
                                            </svg>
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );

                            if (toys.length > 6) {
                              return (
                                <ExpandableSection
                                  maxRows={3}
                                  rowHeight={140}
                                  expandLabel="Show all toys"
                                  collapseLabel="Hide extra toys"
                                >
                                  {toysContent}
                                </ExpandableSection>
                              );
                            }

                            return toysContent;
                          })()
                        )}

                        {/* Blog Posts Grid */}
                        {entry.type === "blog" && (
                          <div className="grid grid-cols-1 gap-4 mb-4">
                            {[...getPublishedPosts()]
                              .sort(
                                (a, b) =>
                                  new Date(b.publishedDate).getTime() -
                                  new Date(a.publishedDate).getTime()
                              )
                              .slice(0, 3)
                              .map((post, postIndex) => (
                                <div
                                  key={postIndex}
                                  className="border border-[#cccccc] rounded-lg p-4 bg-[#fafafa] hover:bg-[#f0f0f0] transition-colors"
                                >
                                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                                    <Link
                                      href={`/blog/${post.slug}`}
                                      className="text-[#0000ff] font-bold text-lg hover:underline flex-1"
                                    >
                                      {post.title}
                                    </Link>
                                    <div className="flex items-center gap-4 text-sm text-[#666666]">
                                      <span className="text-[#8b0000]">
                                        {new Date(
                                          post.publishedDate
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </span>
                                      <span>{post.readTime} min read</span>
                                    </div>
                                  </div>

                                  <p className="text-[#333333] text-sm mb-3 leading-relaxed">
                                    {post.excerpt}
                                  </p>

                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {post.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="text-xs bg-[#e0e0d0] text-[#666666] px-2 py-1 rounded border"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>

                                  <Link
                                    href={`/blog/${post.slug}`}
                                    className="text-[#0000ff] text-sm hover:underline"
                                  >
                                    Read full post →
                                  </Link>
                                </div>
                              ))}
                            <div className="text-center mt-4">
                              <Link
                                href="/blog"
                                className="text-[#0000ff] hover:underline font-medium"
                              >
                                View all {getPublishedPosts().length} blog posts
                                →
                              </Link>
                            </div>
                          </div>
                        )}

                        {/* Lenny's Recommendations Grid */}
                        {entry.type === "lenny" && (
                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-4">
                            {lennyRecommendations.map((book, bookIndex) => (
                              <div
                                key={bookIndex}
                                className="group relative aspect-[2/3] bg-[#fafafa] rounded overflow-hidden shadow-sm"
                              >
                                <a
                                  href={book.amazonUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-full h-full hover:shadow-md transition-all duration-300 hover:scale-105"
                                >
                                  <img
                                    src={book.coverUrl}
                                    alt={`${book.title} cover`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center p-1">
                                    <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <div
                                        className="font-bold text-xs mb-1 leading-tight"
                                        style={{
                                          display: "-webkit-box",
                                          WebkitLineClamp: 3,
                                          WebkitBoxOrient: "vertical",
                                          overflow: "hidden",
                                        }}
                                      >
                                        {book.title}
                                      </div>
                                      <div
                                        className="text-xs opacity-90"
                                        style={{
                                          display: "-webkit-box",
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: "vertical",
                                          overflow: "hidden",
                                        }}
                                      >
                                        by {book.author}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                                <Link
                                  href={`/lenny/${book.slug}`}
                                  className="absolute top-1 right-1 z-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
                                  title="View details"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                    />
                                  </svg>
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* YouTube Embed for YouTube URLs */}
                        {entry.sourceUrl &&
                          entry.sourceUrl.includes("youtube.com") &&
                          entry.sourceUrl.includes("@apesonkeys") && (
                            <div className="mb-4">
                              <iframe
                                width="100%"
                                height="315"
                                src="https://www.youtube.com/embed/videoseries?list=PL-h0A9N1vFdUnUZ0aYk-Z8M7NTy2jtKdL"
                                title={entry.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded border border-[#cccccc]"
                              ></iframe>
                            </div>
                          )}

                        {/* Spotify Embed for Key To Sleep */}
                        {entry.title === "Key To Sleep" && (
                          <div className="mb-4">
                            <iframe
                              style={{ borderRadius: "12px" }}
                              src="https://open.spotify.com/embed/show/5mzflcTu9vWhB0Nw0lABRo?utm_source=generator"
                              width="100%"
                              height="352"
                              frameBorder="0"
                              allowFullScreen
                              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                              loading="lazy"
                            ></iframe>
                          </div>
                        )}

                        {/* Affiliate Links Call-out for purchase sections */}
                        {(entry.type === "lenny" ||
                          entry.type === "toys") && (
                          <div className="bg-[#fff8dc] border border-[#daa520] rounded p-3 text-sm">
                            <strong>Affiliate Links:</strong> All{" "}
                            {entry.type === "toys" ? "product" : "book"} links
                            above are Amazon affiliate links. I may earn a small
                            commission if you purchase through these links, at
                            no extra cost to you.
                          </div>
                        )}
                      </div>
                    );
                  });

                    // If section is expandable and has more rows than max, wrap in ExpandableSection
                    if (maxRows && typeEntries.length > maxRows) {
                      return (
                        <ExpandableSection
                          maxRows={maxRows}
                          rowHeight={type === "blog" ? 180 : type === "toys" ? 140 : type === "books" ? 160 : type === "lenny" ? 220 : 200}
                          expandLabel="Click to expand"
                          collapseLabel="Click to collapse"
                        >
                          {entriesContent}
                        </ExpandableSection>
                      );
                    }

                    return entriesContent;
                  })()}
                </div>
              </div>
            );
          })}

        {/* Listening Section */}
        <div
          id="podcasts"
          className="mb-8 border border-[#cccccc] rounded-md overflow-hidden shadow-sm"
        >
          <div className="bg-[#f5f5dc]">
            <ListeningSection showTitle={true} showDescription={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
