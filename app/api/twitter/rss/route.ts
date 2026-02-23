import { NextResponse } from "next/server";
import { kvGet } from "@/app/lib/kv";
import { generateRssXml, TwitterMention } from "@/app/lib/twitter";

/**
 * GET /api/twitter/rss
 *
 * Returns an RSS 2.0 XML feed of stored @atlas Twitter mentions.
 * Public endpoint — no auth required so RSS readers can subscribe.
 */
export async function GET() {
  try {
    const mentions =
      (await kvGet<TwitterMention[]>("twitter:mentions")) ?? [];

    const xml = generateRssXml(mentions);

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("RSS generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate RSS feed" },
      { status: 500 }
    );
  }
}
