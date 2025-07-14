"use client";

import { useState, useEffect, useRef } from "react";
import { Github, Linkedin, Twitter, Youtube, ShoppingBag } from "lucide-react";
import AudioPlayer from "../components/AudioPlayer";

interface Entry {
  title: string;
  description: string;
  publishedDate: string;
  type: "cv" | "code" | "news" | "opinion" | "media" | "twitter" | "books" | "toys";
  sourceUrl: string;
  sourceTitle: string;
  sourceDescription: string;
}

interface Book {
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  amazonUrl: string;
}

interface Toy {
  title: string;
  description: string;
  imageUrl: string;
  amazonUrl: string;
  comment?: string;
}

const recentBooks: Book[] = [
  {
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    description: "A novel exploring friendship, gaming, and creativity",
    coverUrl: "/images/books/tomorrow-and-tomorrow.jpg",
    amazonUrl: "https://amzn.to/4lnvrBX"
  },
  {
    title: "Amusing Ourselves to Death",
    author: "Neil Postman",
    description: "A critical analysis of media and public discourse",
    coverUrl: "/images/books/amusing-ourselves-to-death.jpg",
    amazonUrl: "https://amzn.to/4lMkbyS"
  },
  {
    title: "Abundance: Progress Takes Imagination",
    author: "Ezra Klein",
    description: "A book about progress and imagination in society",
    coverUrl: "/images/books/abundance-progress.jpg",
    amazonUrl: "https://amzn.to/4m5EBTJ"
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    description: "A classic allegorical novel critiquing totalitarian systems through farm animals",
    coverUrl: "/images/books/animal-farm.jpg",
    amazonUrl: "https://amzn.to/3IiGC06"
  },
  {
    title: "Do Androids Dream Of Electric Sheep?",
    author: "Philip K. Dick",
    description: "A science fiction novel exploring artificial intelligence and humanity",
    coverUrl: "/images/books/do-androids-dream.jpg",
    amazonUrl: "https://amzn.to/46xjAMS"
  },
  {
    title: "Artificial Intelligence: A Modern Approach",
    author: "Peter Norvig & Stuart Russell",
    description: "A comprehensive textbook on artificial intelligence covering modern approaches",
    coverUrl: "/images/books/ai-modern-approach.jpg",
    amazonUrl: "https://amzn.to/44EUsRO"
  },
  {
    title: "The Business of Venture Capital",
    author: "Mahendra Ramsinghani",
    description: "A guide to venture capital strategies from industry experts",
    coverUrl: "/images/books/business-venture-capital.jpg",
    amazonUrl: "https://amzn.to/3TsNXwr"
  },
  {
    title: "Exhalation: Stories",
    author: "Ted Chiang",
    description: "A collection of short stories by acclaimed science fiction author Ted Chiang",
    coverUrl: "/images/books/exhalation-stories.jpg",
    amazonUrl: "https://amzn.to/46wer7N"
  }
];

const recentToys: Toy[] = [
  {
    title: "Opal Tadpole",
    description: "Tiny 4K webcam that clips to your laptop screen",
    imageUrl: "/images/toys/opal-tadpole.jpg",
    amazonUrl: "https://amzn.to/4eO3d0P"
  },
  {
    title: "Nova Wave 2",
    description: "AI-powered light that adapts to your circadian rhythm",
    imageUrl: "/images/toys/nova-wave-2.jpg",
    amazonUrl: "https://amzn.to/4lrKRoN"
  },
  {
    title: "Focusrite Scarlett 2i2",
    description: "USB audio interface for recording with professional sound quality",
    imageUrl: "/images/toys/focusrite-scarlett-2i2.jpg",
    amazonUrl: "https://amzn.to/4lVDupz"
  },
  {
    title: "AIAIAI TMA-2 DJ Wireless Headphones",
    description: "Professional wireless DJ headphones with high isolation",
    imageUrl: "/images/toys/aiaiai-tma2-headphones.jpg",
    amazonUrl: "https://amzn.to/3Tx9jJ5"
  },
  {
    title: "AKAI Professional LPD8",
    description: "Compact USB MIDI pad controller for beat making",
    imageUrl: "/images/toys/akai-lpd8.jpg",
    amazonUrl: "https://amzn.to/4kAcMSg"
  },
  {
    title: "Desk Clamp Power Strip",
    description: "Mountable power strip that clamps to your desk edge",
    imageUrl: "/images/toys/desk-clamp-power-strip.jpg",
    amazonUrl: "https://amzn.to/4liQ1TX"
  },
  {
    title: "Native Instruments Maschine Mikro Mk3",
    description: "Compact drum machine and sampler controller",
    imageUrl: "/images/toys/maschine-mikro-mk3.jpg",
    amazonUrl: "https://amzn.to/44YxbeY"
  },
  {
    title: "Shure MV7i Smart Microphone",
    description: "USB microphone with built-in audio interface for podcasting",
    imageUrl: "/images/toys/shure-mv7i.jpg",
    amazonUrl: "https://amzn.to/4lpE3bl"
  }
];

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
    sourceDescription: "Gamified fitness tracking platform",
  },
  {
    title: "a-ok-audio-news [Work in Progress]",
    description:
      "🚧 Aggregated 2x daily AI/Tech news podcast generator with automated content curation, script generation, and audio production. Built with Python for news aggregation and content processing. Currently active development with multi-agent workflow improvements.",
    publishedDate: "2025-05-19",
    type: "code",
    sourceUrl: "https://github.com/lucas-dickey/a-ok-audio-news",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Automated news podcast generator - 2 stars [WIP]",
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
    title:
      "Beyond Legacy Thinking: Modernizing Podcast Monetization for Creator Success",
    description:
      "Analysis of challenges facing podcast creators in monetizing content, exploring outdated industry practices and proposing innovative solutions. Examines how AI and advanced targeting can improve podcast monetization strategies beyond traditional advertising models.",
    publishedDate: "2024-11-15",
    type: "opinion",
    sourceUrl:
      "https://www.deepcast.pro/resources/beyond-legacy-thinking-modernizing-podcast-monetization-for-creator-success",
    sourceTitle: "DeepCast Resources",
    sourceDescription: "Podcast monetization strategy and industry analysis",
  },
  {
    title:
      "The DeepChat Vision: Transforming How Audiences Engage With Podcasts",
    description:
      "Exploration of how AI technology revolutionizes podcast engagement by creating interactive, conversational experiences between listeners and content. Details unprecedented audience insights and new monetization opportunities through automated affiliate links.",
    publishedDate: "2024-10-15",
    type: "opinion",
    sourceUrl:
      "https://www.deepcast.pro/resources/the-deepchat-vision-transforming-how-audiences-engage-with-podcasts",
    sourceTitle: "DeepCast Resources",
    sourceDescription: "AI-powered podcast engagement transformation",
  },
  {
    title: "Why Quality Podcast Transcription Is Critical for Success",
    description:
      "In-depth exploration of how high-quality podcast transcription dramatically improves discoverability, engagement, and monetization potential. Advocates for comprehensive, AI-powered transcription as solution to current industry limitations in SEO and accessibility.",
    publishedDate: "2024-09-15",
    type: "opinion",
    sourceUrl:
      "https://www.deepcast.pro/resources/why-quality-podcast-transcription-is-critical-for-success",
    sourceTitle: "DeepCast Resources",
    sourceDescription:
      "Podcast transcription strategy and technical implementation",
  },
  {
    title: "Why Podcast Discovery is Broken (And How We're Fixing It)",
    description:
      "Analysis of current podcast discovery challenges and DeepCast's innovative solutions including semantic search, topic-based navigation, and transcript search capabilities. Addresses limitations of major platforms that rely primarily on word-of-mouth discovery.",
    publishedDate: "2024-08-15",
    type: "opinion",
    sourceUrl:
      "https://www.deepcast.pro/resources/why-podcast-discovery-is-broken-and-how-were-fixing-it",
    sourceTitle: "DeepCast Resources",
    sourceDescription: "Podcast discovery infrastructure and search technology",
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
  
  // Recent Reads
  {
    title: "Recent Reads",
    description: "Books I've read or re-read in the last 90 days. These are contemporaneous books as well as ones I've revisited recently. A mix of fiction, philosophy, psychology, and economics that inform my thinking on technology, society, and human nature.",
    publishedDate: "2025-01-01",
    type: "books",
    sourceUrl: "#books",
    sourceTitle: "Personal Library",
    sourceDescription: "Recent reading list and book recommendations"
  },
  
  // Recent Toys
  {
    title: "Recent Toys",
    description: "Gadgets, tools, and interesting products I've recently purchased and can recommend. Each comes with my personal thoughts on why I bought it and how it's been working out.",
    publishedDate: "2025-01-11",
    type: "toys",
    sourceUrl: "#toys",
    sourceTitle: "Personal Gear",
    sourceDescription: "Recent purchases and product recommendations"
  },

  // Podcast & Media
  {
    title: "Sound Strategy Podcast",
    description:
      "Human-generated podcast leveraging DeepCast technology for marketing automation, metadata generation, and content distribution. Explores intersection of technology, strategy, and entrepreneurship from a founder's perspective.",
    publishedDate: "2024-06-01",
    type: "media",
    sourceUrl: "https://soundstrategy.fm",
    sourceTitle: "Sound Strategy",
    sourceDescription:
      "Technology and entrepreneurship insights with AI-powered production",
  },
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

export default function TerminalRepoList() {
  const [loading, setLoading] = useState(true);
  const [groupedEntries, setGroupedEntries] = useState<Record<string, Entry[]>>(
    {}
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [asteriskIndex, setAsteriskIndex] = useState(0);
  const [thinkingIndex, setThinkingIndex] = useState(0);

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
      code: { name: "Code Repositories", icon: "📦" },
      // news: { name: "News Articles", icon: "📰" }, // COMMENTED OUT
      opinion: { name: "Recent Opinion Pieces", icon: "💭" },
      media: { name: "Media", icon: "🎬" },
      twitter: { name: "Twitter Posts", icon: "🐦" },
      books: { name: "Recent Reads", icon: "📚" },
      toys: { name: "Recent Toys", icon: "🧸" },
    };
    return (
      typeMap[type] || {
        name: type.charAt(0).toUpperCase() + type.slice(1),
        icon: "📄",
      }
    );
  };

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
          <span className="hidden sm:inline">{formatCurrentTime(currentTime)} </span>
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
          <span className="hidden sm:inline">Vibe coded by Lucas with his colleague Claude
          Code -- flattering hallucinations, '{asteriskVariants[asteriskIndex]}{" "}
          {thinkingVariants[thinkingIndex]}', and all!</span>
          <span className="inline sm:hidden">Vibe coded by Lucas with Claude Code</span>
        </div>
        <div className="text-[#333333] mb-1">
          <span className="text-[#8b0000]">$</span> cd{" "}
          <b>professional-profile</b>/{" "}
        </div>
        <div className="text-[#333333] mb-1">
          <span className="text-[#8b0000]">$</span> ls -la{" "}
        </div>
      </div>

      {/* Table of Contents */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="text-[#8b0000] font-bold mb-3">Table of Contents</div>
        <div className="text-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.keys(groupedEntries)
              .sort((a, b) => {
                const order = ['cv', 'code', 'opinion', 'books', 'toys', 'media', 'twitter'];
                return order.indexOf(a) - order.indexOf(b);
              })
              .map((type) => {
                const typeInfo = getTypeInfo(type);
                return (
                  <a
                    key={type}
                    href={`#${type}`}
                    className="text-left px-2 py-1 rounded hover:bg-[#e0e0d0] transition-colors text-[#0000ff] hover:underline"
                  >
                    {typeInfo.icon} {typeInfo.name} (
                    {type === 'books' ? recentBooks.length : type === 'toys' ? recentToys.length : groupedEntries[type].length})
                  </a>
                );
              })}
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

      {/* Content */}
      <div>
        {Object.keys(groupedEntries)
          .sort((a, b) => {
            const order = ['cv', 'code', 'opinion', 'books', 'toys', 'media', 'twitter'];
            return order.indexOf(a) - order.indexOf(b);
          })
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
                  </span>
                  <span className="text-[#666666] text-sm ml-2">
                    ({type === 'books' ? recentBooks.length : type === 'toys' ? recentToys.length : typeEntries.length} {type === 'books' ? 'books' : type === 'toys' ? 'toys' : 'entries'})
                  </span>
                </div>

                {/* Entries List */}
                <div className="bg-[#f5f5dc]">
                  {typeEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="p-4 border-b border-[#e0e0d0] last:border-b-0 hover:bg-[#f0f0e0] transition-colors duration-200"
                    >
                      {/* Entry Header */}
                      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <a
                          href={entry.sourceUrl}
                          className="text-[#0000ff] font-bold text-lg hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {entry.title}
                        </a>
                        <span className="text-[#8b0000] text-sm whitespace-nowrap">
                          {formatDate(entry.publishedDate)}
                        </span>
                      </div>

                      {/* Entry Description */}
                      <div className="text-[#333333] mb-2 leading-relaxed">
                        {entry.description}
                      </div>

                      {/* Books Grid for Recent Reads */}
                      {entry.type === "books" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {recentBooks.map((book, bookIndex) => (
                            <div key={bookIndex} className="border border-[#cccccc] rounded-lg p-3 bg-[#fafafa] hover:bg-[#f0f0f0] transition-colors">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                  <img 
                                    src={book.coverUrl} 
                                    alt={`${book.title} cover`}
                                    className="w-16 h-24 object-cover rounded shadow-sm"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-[#333333] mb-1 text-sm leading-tight">
                                    {book.title}
                                  </h4>
                                  <p className="text-[#666666] text-xs mb-2">
                                    by {book.author}
                                  </p>
                                  <p className="text-[#333333] text-xs mb-2 leading-relaxed">
                                    {book.description}
                                  </p>
                                  <a 
                                    href={book.amazonUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0000ff] text-xs hover:underline"
                                  >
                                    View on Amazon
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Toys Grid for Recent Toys */}
                      {entry.type === "toys" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {recentToys.map((toy, toyIndex) => (
                            <div key={toyIndex} className="border border-[#cccccc] rounded-lg p-3 bg-[#fafafa] hover:bg-[#f0f0f0] transition-colors">
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
                                      "{toy.comment}"
                                    </p>
                                  )}
                                  <a 
                                    href={toy.amazonUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0000ff] text-xs hover:underline"
                                  >
                                    View on Amazon
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* YouTube Embed for YouTube URLs */}
                      {entry.sourceUrl.includes("youtube.com") &&
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

                      {/* Spotify Embed for Sound Strategy */}
                      {entry.title === "Sound Strategy Podcast" && (
                        <div className="mb-4">
                          <iframe
                            style={{ borderRadius: "12px" }}
                            src="https://open.spotify.com/embed/show/0WxvhkDeHnvTisq0UTpIZK?utm_source=generator"
                            width="100%"
                            height="450"
                            frameBorder="0"
                            allowFullScreen={true}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                          ></iframe>
                        </div>
                      )}

                      {/* Entry Source */}
                      <div className="text-[#666666] text-sm">
                        Source:{" "}
                        <a
                          href={entry.sourceUrl}
                          className="text-[#006400] hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {entry.sourceTitle}
                        </a>
                        {entry.sourceDescription &&
                          ` - ${entry.sourceDescription}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
