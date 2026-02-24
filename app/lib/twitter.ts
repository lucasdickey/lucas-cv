// Types for Twitter mention data
export interface TwitterMention {
  id: string;
  text: string;
  authorId: string;
  authorUsername: string;
  authorName: string;
  authorProfileImageUrl: string;
  createdAt: string;
  tweetUrl: string;
  metrics: {
    likeCount: number;
    retweetCount: number;
    replyCount: number;
  };
}

// Twitter API v2 response types
interface TwitterApiTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
    quote_count: number;
  };
}

interface TwitterApiUser {
  id: string;
  username: string;
  name: string;
  profile_image_url: string;
}

interface TwitterApiResponse {
  data?: TwitterApiTweet[];
  includes?: {
    users?: TwitterApiUser[];
  };
  meta?: {
    newest_id?: string;
    oldest_id?: string;
    result_count?: number;
  };
}

/**
 * Fetch recent mentions of @atlas from the Twitter/X API v2.
 * Requires a Bearer token with search:recent access (Basic tier or higher).
 */
export async function fetchTwitterMentions(sinceId?: string): Promise<{
  mentions: TwitterMention[];
  newestId?: string;
}> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    throw new Error("TWITTER_BEARER_TOKEN environment variable is not set");
  }

  const params = new URLSearchParams({
    query: "@atlas -is:retweet",
    "tweet.fields": "created_at,public_metrics,author_id",
    expansions: "author_id",
    "user.fields": "username,name,profile_image_url",
    max_results: "100",
  });

  if (sinceId) {
    params.set("since_id", sinceId);
  }

  const response = await fetch(
    `https://api.twitter.com/2/tweets/search/recent?${params}`,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Twitter API error: ${response.status} ${response.statusText} — ${body}`
    );
  }

  const data: TwitterApiResponse = await response.json();

  if (!data.data || data.data.length === 0) {
    return { mentions: [], newestId: undefined };
  }

  const usersMap = new Map<string, TwitterApiUser>();
  data.includes?.users?.forEach((user) => usersMap.set(user.id, user));

  const mentions: TwitterMention[] = data.data.map((tweet) => {
    const author = usersMap.get(tweet.author_id);
    return {
      id: tweet.id,
      text: tweet.text,
      authorId: tweet.author_id,
      authorUsername: author?.username ?? "unknown",
      authorName: author?.name ?? "Unknown",
      authorProfileImageUrl: author?.profile_image_url ?? "",
      createdAt: tweet.created_at,
      tweetUrl: `https://x.com/${author?.username ?? "i"}/status/${tweet.id}`,
      metrics: {
        likeCount: tweet.public_metrics.like_count,
        retweetCount: tweet.public_metrics.retweet_count,
        replyCount: tweet.public_metrics.reply_count,
      },
    };
  });

  return { mentions, newestId: data.meta?.newest_id };
}

// ── RSS helpers ──

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateRssXml(mentions: TwitterMention[]): string {
  const items = mentions
    .map(
      (m) => `    <item>
      <title>${escapeXml(`@${m.authorUsername}: ${m.text.substring(0, 120)}${m.text.length > 120 ? "..." : ""}`)}</title>
      <link>${m.tweetUrl}</link>
      <description><![CDATA[${m.text}]]></description>
      <pubDate>${new Date(m.createdAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${m.tweetUrl}</guid>
      <author>${escapeXml(m.authorName)} (@${escapeXml(m.authorUsername)})</author>
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>@atlas Twitter Mentions</title>
    <link>https://lucas.cv/twitter-monitor</link>
    <description>Recent Twitter/X mentions of @atlas, updated every 15 minutes</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://lucas.cv/api/twitter/rss" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}
