import { NextRequest, NextResponse } from "next/server";
import { kvGet, kvSet } from "@/app/lib/kv";
import { fetchAllTwitterActivity, TwitterMention, TwitterCategory } from "@/app/lib/twitter";
import { summarizeMentions } from "@/app/lib/ai";
import { sendWhatsAppSummary } from "@/app/lib/bot";

/**
 * GET /api/twitter/fetch
 *
 * Cron-triggered endpoint that fetches new @atlas, @stripe mentions and
 * @patrickc tweets from the Twitter/X API and stores them in Vercel KV.
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
    // Get the most recent tweet IDs we've already fetched
    const sinceIds: Record<TwitterCategory, string | undefined> = {
      atlas: (await kvGet<string>("twitter:since_id:atlas")) ?? undefined,
      stripe: (await kvGet<string>("twitter:since_id:stripe")) ?? undefined,
      patrickc: (await kvGet<string>("twitter:since_id:patrickc")) ?? undefined,
    };

    // For backwards compatibility, check the old since_id key for atlas
    if (!sinceIds.atlas) {
      sinceIds.atlas = (await kvGet<string>("twitter:since_id")) ?? undefined;
    }

    const { mentions, newestIds } = await fetchAllTwitterActivity(sinceIds);

    if (mentions.length > 0) {
      // 1. Update persistent history (all-time mentions list)
      const existing = (await kvGet<TwitterMention[]>("twitter:mentions")) ?? [];
      const updated = [...mentions, ...existing].slice(0, 500);
      await kvSet("twitter:mentions", updated);

      // 2. Manage unsent queue for WhatsApp notifications
      const unsent = (await kvGet<TwitterMention[]>("twitter:unsent_mentions")) ?? [];
      const currentUnsent = [...unsent, ...mentions];

      if (currentUnsent.length >= 30) {
        // We hit the threshold! Trigger AI summary and WhatsApp notification.
        const summary = await summarizeMentions(currentUnsent);
        await sendWhatsAppSummary(summary);

        // Clear the unsent list
        await kvSet("twitter:unsent_mentions", []);
      } else {
        // Not enough yet, save for later
        await kvSet("twitter:unsent_mentions", currentUnsent);
      }

      // 3. Advance cursors for each category
      for (const [category, newestId] of Object.entries(newestIds)) {
        if (newestId) {
          await kvSet(`twitter:since_id:${category}`, newestId);
          // Maintain legacy key for atlas
          if (category === "atlas") {
            await kvSet("twitter:since_id", newestId);
          }
        }
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
