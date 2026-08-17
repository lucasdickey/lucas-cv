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
 * Renders selected X/Twitter posts as live embeds. The tweet content and media
 * are pulled client-side by X's widgets.js, so the section always reflects the
 * current state of each post.
 *
 * Each card renders a plain link first and swaps it for the embed once X
 * confirms the tweet loaded. If widgets.js is blocked, the post was deleted, or
 * the account went private, `createTweet` resolves undefined and the link
 * stays — so a card is never left blank.
 *
 * Note: the embed target must be a node we control separately from the
 * fallback. An earlier version passed the fallback's own parent and guarded on
 * `childElementCount === 0`, which the fallback itself made permanently false,
 * so no embed ever rendered.
 */
export default function FeaturedTweets({
  variant = "marketer",
}: {
  variant?: "terminal" | "marketer";
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const renderTweets = () => {
      if (cancelled) return;
      const widgets = window.twttr?.widgets;
      if (!widgets || !containerRef.current) return;

      featuredTweets.forEach((tweet) => {
        const mount = containerRef.current?.querySelector<HTMLElement>(
          `[data-tweet-mount="${tweet.id}"]`
        );
        if (!mount || mount.dataset.embedded === "true") return;

        // Claim the mount before the async call so a re-run can't double-embed.
        mount.dataset.embedded = "true";

        widgets
          .createTweet(tweet.id, mount, {
            align: "center",
            dnt: true,
            conversation: "none",
            theme: "light",
          })
          .then((embedded?: HTMLElement) => {
            if (cancelled) return;
            if (embedded) {
              // Embed is up — retire the fallback link.
              const card = mount.closest("[data-tweet-card]");
              card
                ?.querySelector<HTMLElement>("[data-tweet-fallback]")
                ?.remove();
            } else {
              // Tweet unavailable; release the claim and keep the link.
              mount.dataset.embedded = "false";
            }
          })
          .catch(() => {
            if (!cancelled) mount.dataset.embedded = "false";
          });
      });
    };

    if (window.twttr?.widgets) {
      renderTweets();
      return () => {
        cancelled = true;
      };
    }

    // Load widgets.js once and render when ready.
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGETS_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", renderTweets);
      return () => {
        cancelled = true;
        existing.removeEventListener("load", renderTweets);
      };
    }

    const script = document.createElement("script");
    script.src = WIDGETS_SRC;
    script.async = true;
    script.onload = renderTweets;
    document.body.appendChild(script);

    return () => {
      cancelled = true;
      script.onload = null;
    };
  }, []);

  const isTerminal = variant === "terminal";

  return (
    <div ref={containerRef} className="grid md:grid-cols-2 gap-6">
      {featuredTweets.map((tweet) => (
        <div
          key={tweet.id}
          data-tweet-card
          className={
            isTerminal
              ? "min-h-[220px] flex flex-col items-center justify-center rounded border border-[#cccccc] bg-[#fafafa] p-2"
              : "min-h-[220px] flex flex-col items-center justify-center rounded-lg bg-[#F4F5F7] p-2"
          }
        >
          {/* The embed is mounted here, separate from the fallback below. */}
          <div data-tweet-mount={tweet.id} className="w-full" />
          <a
            data-tweet-fallback
            href={tweet.url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              isTerminal
                ? "text-sm text-[#0000ff] hover:underline py-4"
                : "text-sm text-[#0052CC] hover:underline py-4"
            }
          >
            View post on X →
          </a>
        </div>
      ))}
    </div>
  );
}
