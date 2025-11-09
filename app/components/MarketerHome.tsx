'use client'

import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Github, Linkedin, Twitter, Youtube, ShoppingBag, BookOpen, ArrowRight, TrendingUp, Briefcase, Code, MessageSquare, Film } from 'lucide-react';
import { books as recentBooks } from '../data/books';
import { toys } from '../data/toys';
import { lennyRecommendations } from '../data/lenny';
import { getPublishedPosts } from '../data/blog';
import { getCodeProjectImage } from '../utils/codeProjectImages';

interface Entry {
  title: string;
  description: string;
  publishedDate: string;
  type: "cv" | "code" | "news" | "opinion" | "media" | "twitter" | "books" | "lenny" | "toys" | "blog";
  sourceUrl?: string;
  sourceTitle: string;
  sourceDescription: string;
}

// Entries from homepage - matching page.tsx
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
  // GitHub Projects
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
    sourceDescription: "Visual development artifacts capture tool - MCP integration",
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
  // Opinion Pieces
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
    title: "Install Once, Deploy Everywhere: The Publisher's Dream in the Agentic Era",
    description:
      "Reflecting on DeepCast experience and what publishers need in the agentic era. Explores the vision of install-once, deploy-everywhere solutions for publishers navigating the evolving AI landscape and monetization opportunities.",
    publishedDate: "2025-08-15",
    type: "opinion",
    sourceUrl: "https://promptyield.com/blog/install-once-publishers-dream",
    sourceTitle: "PromptYield Blog",
    sourceDescription: "Publisher strategy and agentic era insights",
  },
  {
    title: "Advertising is Critical for AI Adoption: LLMs Are Everywhere—Affiliate Monetization Should Be Too",
    description:
      "AI is becoming a ubiquitous collaborator across the internet, creating countless unmonetized commercial opportunities beyond traditional chat interfaces. Analysis of how affiliate marketing and advertising can capitalize on the expanding LLM ecosystem.",
    publishedDate: "2025-07-18",
    type: "opinion",
    sourceUrl: "https://promptyield.com/blog/advertising-critical-ai-adoption",
    sourceTitle: "PromptYield Blog", 
    sourceDescription: "AI monetization and affiliate marketing strategy",
  },
  {
    title: "A Former Ecomm Exec's Perspective on Natural Language Advertising and Expectations of Affiliate Platforms",
    description:
      "Prompt Yield is anticipating the needs of the demand side (publishers & developers) and merchants alike. Merchants should push for more from their monetization stack tooling, including affiliate revenue platforms. Insights from e-commerce experience on natural language advertising in the agentic era.",
    publishedDate: "2025-08-13",
    type: "opinion",
    sourceUrl: "https://promptyield.com/blog/merchant-expectations-in-an-agentic-era",
    sourceTitle: "PromptYield Blog",
    sourceDescription: "E-commerce and affiliate platform expectations",
  },
  // Media
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
];

export default function MarketerHome() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Group entries by type
  const groupedEntries: Record<string, Entry[]> = {};
  entries.forEach((entry) => {
    if (!groupedEntries[entry.type]) {
      groupedEntries[entry.type] = [];
    }
    groupedEntries[entry.type].push(entry);
  });

  // Sort each group by date (newest first)
  Object.keys(groupedEntries).forEach((type) => {
    groupedEntries[type].sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );
  });

  // Calculate stats
  const blogPostsCount = getPublishedPosts().length;
  const cvEntries = groupedEntries['cv'] || [];
  const codeEntries = groupedEntries['code'] || [];
  const opinionEntries = groupedEntries['opinion'] || [];
  const mediaEntries = groupedEntries['media'] || [];

  const getFallbackCodeProjectImage = (entry: Entry) => {
    if (entry.sourceUrl) {
      try {
        const url = new URL(entry.sourceUrl);
        if (url.hostname === 'github.com') {
          const segments = url.pathname.split('/').filter(Boolean);
          const owner = segments[0];
          const repo = segments[1];
          if (owner && repo) {
            return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
          }
        }
        return `https://v1.screenshot.11ty.dev/${encodeURIComponent(entry.sourceUrl)}/opengraph/`;
      } catch (error) {
        console.warn('Unable to generate project image for', entry.title, error);
      }
    }
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none"><rect width="400" height="240" rx="16" fill="%23F4F5F7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236B778C" font-family="Arial" font-size="18">Project Preview</text></svg>';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white marketer-view">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-[#0052CC]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white marketer-view">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 mb-8">
          <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
            <Image
              src="/images/lucas-dickey-sitting.png"
              alt="Lucas Dickey sitting in a chair"
              width={598}
              height={632}
              className="w-full h-auto rounded-xl shadow-lg"
              priority
            />
          </div>

          <div className="flex-1 text-center lg:text-left">
            {/* Professional Portfolio Badge */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#DEEBFF] text-[#0052CC] text-sm font-medium rounded-md">
                Professional Portfolio
              </span>
            </div>

            {/* Main Heading */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#172B4D] mb-4">
                Lucas Dickey: From Strategy to {' '}
                <span className="text-[#0052CC] relative inline-block">
                  Execution
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#0052CC]"></span>
                </span>
              </h1>
              <p className="text-lg text-[#6B778C] max-w-2xl mx-auto lg:mx-0">
                Exploring business strategy, product management, and professional growth through actionable insights and real-world experience.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052CC] text-white font-medium rounded-md hover:bg-[#0065FF] transition-colors shadow-sm hover:shadow-md"
              >
                View Latest Insights
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#cv"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#172B4D] font-medium rounded-md border border-[#DFE1E6] hover:bg-[#F4F5F7] transition-colors"
              >
                Explore Experience
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-[#DFE1E6] pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <Link
              href="#blog"
              className="group block rounded-md px-3 py-4 text-center transition-colors hover:bg-[#F4F5F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052CC]"
            >
              <div className="text-3xl font-bold text-[#0052CC] mb-1 group-hover:underline">{blogPostsCount}</div>
              <div className="text-sm text-[#6B778C]">Blog Posts</div>
            </Link>
            <Link
              href="#cv"
              className="group block rounded-md px-3 py-4 text-center transition-colors hover:bg-[#F4F5F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052CC]"
            >
              <div className="text-3xl font-bold text-[#0052CC] mb-1 group-hover:underline">{cvEntries.length}</div>
              <div className="text-sm text-[#6B778C]">Career Milestones</div>
            </Link>
            <Link
              href="#code"
              className="group block rounded-md px-3 py-4 text-center transition-colors hover:bg-[#F4F5F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052CC]"
            >
              <div className="text-3xl font-bold text-[#0052CC] mb-1 group-hover:underline">{codeEntries.length}</div>
              <div className="text-sm text-[#6B778C]">Code Projects</div>
            </Link>
            <Link
              href="#opinion"
              className="group block rounded-md px-3 py-4 text-center transition-colors hover:bg-[#F4F5F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052CC]"
            >
              <div className="text-3xl font-bold text-[#0052CC] mb-1 group-hover:underline">{opinionEntries.length}</div>
              <div className="text-sm text-[#6B778C]">Opinion Pieces</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-16">
        {/* Professional Profile / CV Section */}
        <section id="cv">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-6 h-6 text-[#0052CC]" />
            <h2 className="text-3xl font-bold text-[#172B4D]">Professional Profile</h2>
            <span className="text-sm text-[#6B778C]">({cvEntries.length} entries)</span>
          </div>
          <p className="text-sm text-[#6B778C] mb-6">Product leadership and strategic execution across all stages</p>
          <div className="grid md:grid-cols-2 gap-6">
            {cvEntries.map((entry, index) => (
              <div key={index} className="bg-[#F4F5F7] rounded-lg p-6 hover:shadow-lg transition-all border border-transparent hover:border-[#0052CC]">
                <div className="flex justify-between items-start mb-3">
                  {entry.sourceUrl ? (
                    <a
                      href={entry.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#172B4D] text-lg hover:text-[#0052CC] hover:underline"
                    >
                      {entry.title}
                    </a>
                  ) : (
                    <h3 className="font-semibold text-[#172B4D] text-lg">{entry.title}</h3>
                  )}
                  <span className="text-xs text-[#6B778C] whitespace-nowrap ml-2">
                    {formatDate(entry.publishedDate)}
                  </span>
                </div>
                <p className="text-sm text-[#6B778C] mb-3 leading-relaxed">{entry.description}</p>
                <div className="text-xs text-[#6B778C]">
                  <span className="font-medium">Source:</span> {entry.sourceTitle}
                  {entry.sourceDescription && ` - ${entry.sourceDescription}`}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Code Repositories Section */}
        <section id="code">
          <div className="flex items-center gap-2 mb-6">
            <Code className="w-6 h-6 text-[#0052CC]" />
            <h2 className="text-3xl font-bold text-[#172B4D]">Code Repositories</h2>
            <span className="text-sm text-[#6B778C]">({codeEntries.length} projects)</span>
          </div>
          <p className="text-sm text-[#6B778C] mb-6">Open source tools and experiments</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codeEntries.map((entry, index) => (
              <a
                key={index}
                href={entry.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F4F5F7] rounded-lg p-6 hover:shadow-lg transition-all hover:border-[#0052CC] border border-transparent"
              >
                {(() => {
                  const marketingImage = getCodeProjectImage(entry);
                  const imageSrc = marketingImage || getFallbackCodeProjectImage(entry);
                  return (
                    <img
                      src={imageSrc}
                      alt={`${entry.title} preview`}
                      className="w-full h-36 object-cover rounded-lg mb-4"
                    />
                  );
                })()}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-[#172B4D] text-lg hover:text-[#0052CC]">{entry.title}</h3>
                  <span className="text-xs text-[#6B778C] whitespace-nowrap ml-2">
                    {formatDate(entry.publishedDate)}
                  </span>
                </div>
                <p className="text-sm text-[#6B778C] mb-3 leading-relaxed line-clamp-3">{entry.description}</p>
                <div className="text-xs text-[#6B778C]">
                  <span className="font-medium">Source:</span> {entry.sourceTitle}
                  {entry.sourceDescription && ` - ${entry.sourceDescription}`}
                </div>
                <div className="mt-3 flex items-center gap-1 text-[#0052CC] text-sm font-medium">
                  View on GitHub
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Reading, Read, Reading Soon Section */}
        <section id="books">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-[#0052CC]" />
            <h2 className="text-3xl font-bold text-[#172B4D]">Reading, Read, Reading Soon</h2>
            <span className="text-sm text-[#6B778C]">({recentBooks.filter(b => b.status !== "pending").length} books)</span>
          </div>
          <p className="text-sm text-[#6B778C] mb-6">Currently reading and recently completed reads</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBooks
              .filter(b => b.status !== "pending")
              .sort((a, b) => {
                if (a.status === "reading" && b.status !== "reading") return -1;
                if (a.status !== "reading" && b.status === "reading") return 1;
                return 0;
              })
              .map((book) => (
              <div key={book.slug} className="bg-[#F4F5F7] rounded-lg p-6 hover:shadow-lg transition-all border border-transparent hover:border-[#0052CC] relative">
                {book.status === "reading" && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    📖 Reading
                  </div>
                )}
                <div className="flex gap-4 mb-4">
                  <img
                    src={book.coverUrl}
                    alt={`${book.title} cover`}
                    className="w-20 h-32 object-cover rounded shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 pr-12">
                    <h3 className="font-bold text-[#172B4D] mb-1 text-sm leading-tight">{book.title}</h3>
                    <p className="text-[#6B778C] text-xs mb-2">by {book.author}</p>
                    <p className="text-[#333333] text-xs mb-3 leading-relaxed line-clamp-3">{book.description}</p>
                    <div className="flex items-center gap-4">
                      <a
                        href={book.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0052CC] text-xs hover:underline"
                      >
                        View on Amazon
                      </a>
                      <Link href={`/books/${book.slug}`} className="text-[#0052CC] hover:underline" title="View details">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ingestion Queue Section */}
          {recentBooks.filter(b => b.status === "pending").length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-6 h-6 text-[#6B778C]" />
                <h3 className="text-2xl font-bold text-[#172B4D]">Ingestion Queue</h3>
                <span className="text-sm text-[#6B778C]">({recentBooks.filter(b => b.status === "pending").length} books)</span>
              </div>
              <p className="text-sm text-[#6B778C] mb-6">Books lined up to read next</p>
              <div className="grid grid-cols-1 gap-3">
                {recentBooks
                  .filter(b => b.status === "pending")
                  .map((book) => (
                  <div key={book.slug} className="flex gap-3 p-3 border border-[#DFE1E6] rounded bg-[#F4F5F7] hover:bg-[#EAEEF2] transition-colors">
                    <img
                      src={book.coverUrl}
                      alt={`${book.title} cover`}
                      className="w-16 h-24 object-cover rounded shadow-sm flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#172B4D] text-xs mb-1 line-clamp-2">{book.title}</h4>
                      <p className="text-[#6B778C] text-xs mb-2">by {book.author}</p>
                      <p className="text-[#333333] text-xs mb-2 leading-relaxed line-clamp-2">{book.description}</p>
                      <div className="flex items-center gap-3">
                        <a
                          href={book.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0052CC] text-xs hover:underline"
                        >
                          View on Amazon
                        </a>
                        <Link href={`/books/${book.slug}`} className="text-[#0052CC] hover:underline" title="View details">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Lenny's Recommendations Section */}
        <section id="lenny">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-[#0052CC]" />
            <h2 className="text-3xl font-bold text-[#172B4D]">Lenny&apos;s Recommendations</h2>
            <span className="text-sm text-[#6B778C]">({lennyRecommendations.length} books)</span>
          </div>
          <p className="text-sm text-[#6B778C] mb-6">Essential reads for product managers, entrepreneurs, and startup founders</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {lennyRecommendations.map((book) => (
              <div key={book.slug} className="group relative aspect-[2/3] bg-[#F4F5F7] rounded overflow-hidden shadow-sm hover:shadow-md transition-all">
                <a 
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full hover:scale-105 transition-transform"
                >
                  <img 
                    src={book.coverUrl} 
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all flex items-center justify-center p-1">
                    <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-bold text-xs mb-1 leading-tight" 
                           style={{
                             display: '-webkit-box',
                             WebkitLineClamp: 3,
                             WebkitBoxOrient: 'vertical',
                             overflow: 'hidden'
                           }}>
                        {book.title}
                      </div>
                      <div className="text-xs opacity-90"
                           style={{
                             display: '-webkit-box',
                             WebkitLineClamp: 2,
                             WebkitBoxOrient: 'vertical',
                             overflow: 'hidden'
                           }}>
                        by {book.author}
                      </div>
                    </div>
                  </div>
                </a>
                <Link href={`/lenny/${book.slug}`} className="absolute top-1 right-1 z-10 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75" title="View details">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Toys Section */}
        <section id="toys">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-6 h-6 text-[#0052CC]" />
            <h2 className="text-3xl font-bold text-[#172B4D]">Recent Toys</h2>
            <span className="text-sm text-[#6B778C]">({toys.length} items)</span>
          </div>
          <p className="text-sm text-[#6B778C] mb-6">Gadgets, tools, and interesting products I&apos;ve recently purchased and can recommend</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toys.map((toy) => (
              <div key={toy.slug} className="bg-[#F4F5F7] rounded-lg p-6 hover:shadow-lg transition-all border border-transparent hover:border-[#0052CC]">
                <div className="flex gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={toy.imageUrl} 
                      alt={`${toy.title} product image`}
                      className="w-20 h-20 object-cover rounded shadow-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#172B4D] mb-1 text-sm leading-tight">{toy.title}</h3>
                    <p className="text-[#333333] text-xs mb-2 leading-relaxed line-clamp-3">{toy.description}</p>
                    {toy.comment && (
                      <p className="text-[#6B778C] text-xs mb-2 italic leading-relaxed line-clamp-2">
                        &ldquo;{toy.comment}&rdquo;
                      </p>
                    )}
                    <div className="flex items-center gap-4">
                      <a 
                        href={toy.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0052CC] text-xs hover:underline"
                      >
                        View on Amazon
                      </a>
                      <Link href={`/toys/${toy.slug}`} className="text-[#0052CC] hover:underline" title="View details">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Media Section */}
        <section id="media">
          <div className="flex items-center gap-2 mb-6">
            <Film className="w-6 h-6 text-[#0052CC]" />
            <h2 className="text-3xl font-bold text-[#172B4D]">Media</h2>
            <span className="text-sm text-[#6B778C]">({mediaEntries.length} items)</span>
          </div>
          <p className="text-sm text-[#6B778C] mb-6">Podcasts, videos, and creative content</p>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaEntries.map((entry, index) => (
              <div key={index} className="bg-[#F4F5F7] rounded-lg p-6 hover:shadow-lg transition-all border border-transparent hover:border-[#0052CC]">
                <div className="flex justify-between items-start mb-3">
                  <a
                    href={entry.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#172B4D] text-lg hover:text-[#0052CC] hover:underline"
                  >
                    {entry.title}
                  </a>
                  <span className="text-xs text-[#6B778C] whitespace-nowrap ml-2">
                    {formatDate(entry.publishedDate)}
                  </span>
                </div>
                <p className="text-sm text-[#6B778C] mb-4 leading-relaxed">{entry.description}</p>
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
                {entry.sourceUrl && entry.sourceUrl.includes("youtube.com") && (
                  <div className="mb-4">
                    <iframe
                      width="100%"
                      height="315"
                      src="https://www.youtube.com/embed/videoseries?list=PL-h0A9N1vFdUnUZ0aYk-Z8M7NTy2jtKdL"
                      title={entry.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded border border-[#DFE1E6]"
                    ></iframe>
                  </div>
                )}
                <div className="text-xs text-[#6B778C]">
                  <span className="font-medium">Source:</span> {entry.sourceTitle}
                  {entry.sourceDescription && ` - ${entry.sourceDescription}`}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Opinion Pieces Section */}
        <section id="opinion">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-6 h-6 text-[#0052CC]" />
            <h2 className="text-3xl font-bold text-[#172B4D]">Recent Opinion Pieces</h2>
            <span className="text-sm text-[#6B778C]">({opinionEntries.length} articles)</span>
          </div>
          <p className="text-sm text-[#6B778C] mb-6">Industry insights and thought leadership</p>
          <div className="grid md:grid-cols-2 gap-6">
            {opinionEntries.map((entry, index) => (
              <a
                key={index}
                href={entry.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F4F5F7] rounded-lg p-6 hover:shadow-lg transition-all hover:border-[#0052CC] border border-transparent"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-[#172B4D] text-lg hover:text-[#0052CC]">{entry.title}</h3>
                  <span className="text-xs text-[#6B778C] whitespace-nowrap ml-2">
                    {formatDate(entry.publishedDate)}
                  </span>
                </div>
                <p className="text-sm text-[#6B778C] mb-3 leading-relaxed line-clamp-3">{entry.description}</p>
                <div className="text-xs text-[#6B778C]">
                  <span className="font-medium">Source:</span> {entry.sourceTitle}
                  {entry.sourceDescription && ` - ${entry.sourceDescription}`}
                </div>
                <div className="mt-3 flex items-center gap-1 text-[#0052CC] text-sm font-medium">
                  Read article
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Social Links Footer */}
      <div className="border-t border-[#DFE1E6] bg-[#F4F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://linkedin.com/in/lucasdickey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#6B778C] hover:text-[#0052CC] transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href="https://github.com/lucas-dickey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#6B778C] hover:text-[#0052CC] transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="https://twitter.com/lucasdickey4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#6B778C] hover:text-[#0052CC] transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span className="text-sm">Twitter</span>
            </a>
            <a
              href="https://youtube.com/@apesonkeys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#6B778C] hover:text-[#0052CC] transition-colors"
            >
              <Youtube className="w-5 h-5" />
              <span className="text-sm">YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

