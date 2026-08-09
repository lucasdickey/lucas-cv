import { NextResponse } from "next/server";
import { getManifest, mergeMessages } from "@/app/lib/dm/store";
import {
  fetchRecentDmMessages,
  isXApiConfigured,
  isXConnected,
} from "@/app/lib/dm/xapi";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * POST — top up the corpus with recent DMs from the live X API and merge them
 * (de-duplicated) into the stored set. Each read is billed under X's
 * pay-per-use pricing, so the fetch is capped to a few pages.
 */
export async function POST() {
  if (!isXApiConfigured()) {
    return NextResponse.json(
      { error: "X API is not configured on the server." },
      { status: 400 }
    );
  }
  if (!(await isXConnected())) {
    return NextResponse.json(
      { error: "X account not connected. Authorize access first." },
      { status: 400 }
    );
  }

  try {
    const manifest = await getManifest();
    const incoming = await fetchRecentDmMessages(manifest?.selfId ?? null);
    const before = manifest?.totalMessages ?? 0;
    const updated = await mergeMessages(incoming);
    return NextResponse.json({
      ok: true,
      fetched: incoming.length,
      added: updated.totalMessages - before,
      totalMessages: updated.totalMessages,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Sync failed.", details: String(error) },
      { status: 500 }
    );
  }
}
