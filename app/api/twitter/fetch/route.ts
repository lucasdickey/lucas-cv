import { NextRequest, NextResponse } from "next/server";
import { kvGet, kvSet } from "@/app/lib/kv";
import { fetchTwitterMentions, TwitterMention } from "@/app/lib/twitter";

/**
 * GET /api/twitter/fetch
 *
 * Cron-triggered endpoint that fetches new @atlas mentions from the
 * Twitter/X API and stores them in Vercel KV.
 *
 * Protected by CRON_SECRET — Vercel automatically sends this header
 * for scheduled cron invocations.
 */
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the most recent tweet ID we've already fetched
    const sinceId = await kvGet<string>("twitter:since_id");

    const { mentions, newestId } = await fetchTwitterMentions(
      sinceId ?? undefined
    );

    if (mentions.length > 0) {
      // Retrieve existing stored mentions
      const existing =
        (await kvGet<TwitterMention[]>("twitter:mentions")) ?? [];

      // Prepend new mentions, cap at 500 to keep storage bounded
      const updated = [...mentions, ...existing].slice(0, 500);
      await kvSet("twitter:mentions", updated);

      // Advance the cursor so the next run only fetches newer tweets
      if (newestId) {
        await kvSet("twitter:since_id", newestId);
      }
    }

    await kvSet("twitter:last_fetch", new Date().toISOString());

    return NextResponse.json({
      success: true,
      newMentions: mentions.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Twitter fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentions", details: String(error) },
      { status: 500 }
    );
  }
}
