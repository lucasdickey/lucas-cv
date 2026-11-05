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
    id: "2097107494833422793",
    url: "https://x.com/Lucasdickey/status/2097107494833422793",
  },
  {
    id: "2092352357380358233",
    url: "https://x.com/Lucasdickey/status/2092352357380358233",
  },
  {
    id: "2088787364193972487",
    url: "https://x.com/Lucasdickey/status/2088787364193972487",
  },
  {
    id: "2112403570628632650",
    url: "https://x.com/Lucasdickey/status/2112403570628632650",
  },
  {
    id: "2090972531687878947",
    url: "https://x.com/Lucasdickey/status/2090972531687878947",
  },
  {
    id: "2094893782768722075",
    url: "https://x.com/Lucasdickey/status/2094893782768722075",
  },
];
