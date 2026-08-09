import { NextRequest, NextResponse } from "next/server";
import {
  clearCorpus,
  getManifest,
  writeManifest,
  writeShard,
} from "@/app/lib/dm/store";
import type { DMManifest, DMMessage, DMSource } from "@/app/lib/dm/types";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Chunked corpus upload. The browser parses the (potentially multi-MB) archive
 * and drives this endpoint:
 *   { action: "begin" }                                  — clear prior corpus
 *   { action: "shard", index, messages }                 — write one shard
 *   { action: "commit", shardCount, totalMessages, ... } — publish manifest
 *
 * Also: GET → current manifest, DELETE → wipe the corpus.
 */
export async function POST(request: NextRequest) {
  let body: {
    action?: string;
    index?: number;
    messages?: DMMessage[];
    shardCount?: number;
    totalMessages?: number;
    selfId?: string | null;
    sources?: DMSource[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    switch (body.action) {
      case "begin": {
        await clearCorpus();
        return NextResponse.json({ ok: true });
      }
      case "shard": {
        if (typeof body.index !== "number" || !Array.isArray(body.messages)) {
          return NextResponse.json({ error: "index and messages are required" }, { status: 400 });
        }
        await writeShard(body.index, body.messages);
        return NextResponse.json({ ok: true, index: body.index });
      }
      case "commit": {
        const manifest: DMManifest = {
          shardCount: body.shardCount ?? 0,
          totalMessages: body.totalMessages ?? 0,
          selfId: body.selfId ?? null,
          sources: body.sources ?? ["archive"],
          updatedAt: new Date().toISOString(),
        };
        await writeManifest(manifest);
        return NextResponse.json({ ok: true, manifest });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Storage failed. Is Vercel KV configured?", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const manifest = await getManifest();
    return NextResponse.json({ manifest });
  } catch (error) {
    return NextResponse.json({ manifest: null, error: String(error) }, { status: 200 });
  }
}

export async function DELETE() {
  try {
    await clearCorpus();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
