'use client'

import { useEffect, useRef } from "react";
import { featuredTweets } from "../data/tweets";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    twttr?: any;
  }
}

const WIDGETS_SRC = "https://platform.twitter.com/widgets.js";

/**
 * Renders selected X/Twitter posts as live embeds. The actual tweet content
 * and media are pulled client-side by X's widgets.js, so the section always
 * reflects the current state of each post. If the embed fails to load (e.g.
 * the visitor blocks X), each container falls back to a plain link.
 */
export default function FeaturedTweets() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const renderTweets = () => {
      if (cancelled) return;
      const widgets = window.twttr?.widgets;
      if (!widgets || !containerRef.current) return;

      featuredTweets.forEach((tweet) => {
        const el = document.getElementById(`tweet-${tweet.id}`);
        // Only render into an empty container to avoid duplicate embeds.
        if (el && el.childElementCount === 0) {
          widgets.createTweet(tweet.id, el, {
            align: "center",
            dnt: true,
            conversation: "none",
          });
        }
      });
    };

    if (window.twttr?.widgets) {
      renderTweets();
      return;
    }

    // Load widgets.js once and render when ready.
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGETS_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", renderTweets);
      return () => existing.removeEventListener("load", renderTweets);
    }

    const script = document.createElement("script");
    script.src = WIDGETS_SRC;
    script.async = true;
    script.onload = renderTweets;
    document.body.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={containerRef} className="grid md:grid-cols-2 gap-6">
      {featuredTweets.map((tweet) => (
        <div
          key={tweet.id}
          id={`tweet-${tweet.id}`}
          className="min-h-[220px] flex items-center justify-center rounded-lg bg-[#F4F5F7] p-2"
        >
          {/* Fallback shown until (or unless) the live embed replaces it. */}
          <a
            href={tweet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#0052CC] hover:underline"
          >
            View post on X →
          </a>
        </div>
      ))}
    </div>
  );
}
