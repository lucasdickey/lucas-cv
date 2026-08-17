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
import ApebotChat from "./components/ApebotChat";
import SyllabusPartIcon from "./components/SyllabusPartIcon";
import FeaturedTweets from "./components/FeaturedTweets";
import { featuredTweets } from "./data/tweets";
import { type Entry, getTypeInfo, groupedEntries } from "./data/cv";

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
import { syllabus, getSyllabusStats } from "./data/syllabus";
import { toys } from "./data/toys";
import { lennyRecommendations } from "./data/lenny";
import { getPublishedPosts } from "./data/blog";

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
  // Starts null so the server and the first client render agree; the live
  // clock is filled in after mount. Seeding this with `new Date()` would
  // produce a hydration mismatch now that the page renders on the server.
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
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
    // Set once on mount, then update on an interval
    setCurrentTime(new Date());

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

  // `groupedEntries` is now derived at module scope in ./data/cv, so the
  // content is present in the server-rendered HTML rather than being filled
  // in by an effect after hydration.

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
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

  // Render marketer view if in marketer mode
  if (viewMode === "marketer") {
    return <MarketerHome />;
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
            {currentTime ? `${formatCurrentTime(currentTime)} ` : ""}
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
                  "syllabus",
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
                      : type === "syllabus"
                      ? getSyllabusStats().total
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
              "syllabus",
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
                      : type === "syllabus"
                      ? getSyllabusStats().total
                      : type === "lenny"
                      ? lennyRecommendations.length
                      : type === "toys"
                      ? toys.length
                      : type === "blog"
                      ? getPublishedPosts().length
                      : typeEntries.length}{" "}
                    {type === "books"
                      ? "books"
                      : type === "syllabus"
                      ? "readings"
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

                        {entry.type === "syllabus" && (
                          (() => {
                            const stats = getSyllabusStats();

                            return (
                              <div className="mb-2">
                                <div className="border-l-4 border-[#8b0000] pl-3 mb-4 text-[#333333] italic">
                                  {syllabus.guidingQuestion}
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  {syllabus.lenses.map((lens) => (
                                    <span
                                      key={lens}
                                      className="text-xs bg-[#e0e0d0] text-[#666666] px-2 py-1 rounded border"
                                    >
                                      #{lens.toLowerCase().replace(/\s+/g, "-")}
                                    </span>
                                  ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                  {syllabus.parts.map((part) => (
                                    <Link
                                      key={part.id}
                                      href={`/syllabus#${part.id}`}
                                      className="block border border-[#cccccc] rounded-lg p-3 bg-[#fafafa] hover:bg-[#f0f0f0] hover:border-[#8b0000] transition-colors"
                                    >
                                      <div className="flex items-start gap-3">
                                        <SyllabusPartIcon
                                          partId={part.id}
                                          className="w-7 h-7 text-[#8b0000] flex-shrink-0 mt-0.5"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex justify-between items-start gap-2 mb-1">
                                            <h4 className="font-bold text-[#0000ff] text-sm leading-tight">
                                              {part.label} — {part.title}
                                            </h4>
                                            <span className="text-[#666666] text-xs whitespace-nowrap">
                                              {part.readings.length}{" "}
                                              {part.readings.length === 1
                                                ? "reading"
                                                : "readings"}
                                            </span>
                                          </div>
                                          <p className="text-[#666666] text-xs leading-relaxed">
                                            {part.summary}
                                          </p>
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>

                                <div className="border border-[#cccccc] rounded-lg p-4 bg-[#fafafa]">
                                  <div className="text-[#333333] text-xs mb-3">
                                    <span className="text-[#666666]">
                                      status:
                                    </span>{" "}
                                    {stats.read} read · {stats.reading} reading ·{" "}
                                    {stats.pending} queued · {stats.total} total
                                    across {stats.parts} parts
                                  </div>
                                  <div className="text-[#333333] text-xs mb-3 leading-relaxed">
                                    The missing book:{" "}
                                    <span className="italic">
                                      {syllabus.missingBook.question}
                                    </span>
                                  </div>
                                  <Link
                                    href="/syllabus"
                                    className="text-[#0000ff] text-sm hover:underline"
                                  >
                                    Read the full syllabus →
                                  </Link>
                                </div>
                              </div>
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

        {/* Featured on X Section */}
        <div
          id="featured-tweets"
          className="mb-8 border border-[#cccccc] rounded-md overflow-hidden shadow-sm"
        >
          <div className="bg-[#e8e8d0] px-4 py-3 border-b border-[#cccccc]">
            <span className="text-[#8b0000] text-lg font-bold">
              🐦 Featured on X
            </span>
            <span className="text-[#666666] text-sm ml-2">
              ({featuredTweets.length} posts)
            </span>
          </div>
          <div className="bg-[#f5f5dc] p-4">
            <p className="text-[#333333] mb-4 leading-relaxed">
              Selected posts showcasing recent work and builds.
            </p>
            <FeaturedTweets />
          </div>
        </div>

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

      {/* A-OK Shop Apebot Chat */}
      <ApebotChat />
    </div>
  );
}
