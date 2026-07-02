export interface FeaturedTweet {
  /** Numeric X/Twitter status ID (the trailing number in the tweet URL). */
  id: string;
  /** Canonical URL, used as the graceful fallback link if the embed fails to load. */
  url: string;
  /** Optional short caption for context; the live embed renders the real tweet content. */
  caption?: string;
}

// Selected posts that showcase recent work and builds.
// Newest first. To add a tweet, drop in its status ID and URL.
export const featuredTweets: FeaturedTweet[] = [
  {
    id: "2052217979618853045",
    url: "https://x.com/i/status/2052217979618853045",
  },
  {
    id: "2050635178872115695",
    url: "https://x.com/i/status/2050635178872115695",
  },
];
