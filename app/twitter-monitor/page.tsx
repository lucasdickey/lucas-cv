import { kvGet } from "@/app/lib/kv";
import Link from "next/link";
import { TwitterMention } from "@/app/lib/twitter";

export const metadata = {
  title: "@atlas Twitter Mentions — Lucas Dickey",
  description:
    "Live feed of @atlas mentions on Twitter/X, updated every 15 minutes.",
};

// Revalidate the page every 15 minutes to stay in sync with the cron
export const revalidate = 900;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MentionCard({ mention }: { mention: TwitterMention }) {
  return (
    <div className="border border-[#e1e4e8] rounded-lg p-5 bg-white hover:shadow-md transition-shadow">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        {mention.authorProfileImageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={mention.authorProfileImageUrl}
            alt={mention.authorName}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          <div className="font-semibold text-[#172B4D]">
            {mention.authorName}
          </div>
          <a
            href={`https://x.com/${mention.authorUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#0052CC] hover:underline"
          >
            @{mention.authorUsername}
          </a>
        </div>
        <span className="ml-auto text-xs text-[#6B778C]">
          {formatDate(mention.createdAt)}
        </span>
      </div>

      {/* Tweet text */}
      <p className="text-[#172B4D] leading-relaxed mb-3 whitespace-pre-wrap">
        {mention.text}
      </p>

      {/* Metrics + link row */}
      <div className="flex items-center justify-between text-sm text-[#6B778C]">
        <div className="flex gap-4">
          <span title="Replies">{mention.metrics.replyCount} replies</span>
          <span title="Retweets">{mention.metrics.retweetCount} retweets</span>
          <span title="Likes">{mention.metrics.likeCount} likes</span>
        </div>
        <a
          href={mention.tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0052CC] font-medium hover:underline"
        >
          View on X &rarr;
        </a>
      </div>
    </div>
  );
}

export default async function TwitterMonitorPage() {
  let mentions: TwitterMention[] = [];
  let lastFetch: string | null = null;
  let kvError = false;

  try {
    mentions =
      (await kvGet<TwitterMention[]>("twitter:mentions")) ?? [];
    lastFetch = await kvGet<string>("twitter:last_fetch");
  } catch {
    kvError = true;
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#0052CC] hover:text-[#0065FF] mb-4 text-sm font-medium"
          >
            &larr; Back to home
          </Link>
          <h1 className="text-3xl font-bold text-[#172B4D] mb-2">
            @atlas Mentions
          </h1>
          <p className="text-[#6B778C]">
            Live Twitter/X mentions of <strong>@atlas</strong>, updated every 15
            minutes.
          </p>

          {/* RSS subscribe link */}
          <a
            href="/api/twitter/rss"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-sm text-[#0052CC] hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1" />
            </svg>
            Subscribe via RSS
          </a>

          {lastFetch && (
            <p className="text-xs text-[#6B778C] mt-2">
              Last checked: {formatDate(lastFetch)}
            </p>
          )}
        </div>

        {/* Error state */}
        {kvError && (
          <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4 mb-6 text-sm text-yellow-800">
            Vercel KV is not configured yet. Add a KV store to your Vercel
            project to enable persistent mention storage.
          </div>
        )}

        {/* Empty state */}
        {!kvError && mentions.length === 0 && (
          <div className="border border-[#e1e4e8] bg-white rounded-lg p-8 text-center text-[#6B778C]">
            No mentions found yet. The cron job will populate this feed
            automatically.
          </div>
        )}

        {/* Mentions list */}
        <div className="space-y-4">
          {mentions.map((mention) => (
            <MentionCard key={mention.id} mention={mention} />
          ))}
        </div>

        {/* Footer */}
        {mentions.length > 0 && (
          <p className="text-center text-xs text-[#6B778C] mt-8">
            Showing {mentions.length} mention{mentions.length !== 1 && "s"}
          </p>
        )}
      </div>
    </div>
  );
}
