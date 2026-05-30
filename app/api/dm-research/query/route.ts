import { NextRequest, NextResponse } from "next/server";
import { loadAllMessages, getManifest } from "@/app/lib/dm/store";
import {
  expandQueryToKeywords,
  keywordPrefilter,
  relevanceFilter,
} from "@/app/lib/dm/retrieval";
import { renderConversationsMarkdown } from "@/app/lib/dm/markdown";

export const runtime = "nodejs";
export const maxDuration = 300;

const ME_NAME = "Lucas";

/**
 * POST { query } — run the retrieval pipeline and return the relevant
 * conversations as a single Markdown document (plus the matched conversation
 * ids so a follow-up /synthesize call can reuse the selection).
 */
export async function POST(request: NextRequest) {
  let query = "";
  try {
    ({ query = "" } = await request.json());
  } catch {
    /* ignore */
  }
  if (!query.trim()) {
    return NextResponse.json({ error: "A research query is required." }, { status: 400 });
  }

  try {
    const messages = await loadAllMessages();
    if (messages.length === 0) {
      return NextResponse.json(
        { error: "No DM corpus stored yet. Upload your X archive first." },
        { status: 400 }
      );
    }

    const keywords = await expandQueryToKeywords(query);
    const candidates = keywordPrefilter(messages, keywords);

    if (candidates.length === 0) {
      return NextResponse.json({
        query,
        keywords,
        stats: { corpusMessages: messages.length, candidates: 0, relevant: 0, messages: 0 },
        conversationIds: [],
        reasons: {},
        markdown: `# DM Research Extract\n\n**Research query:** ${query}\n\nNo conversations matched the keyword pre-filter. Try rephrasing or broadening the query.`,
      });
    }

    const relevant = await relevanceFilter(candidates, query, ME_NAME);
    const relevantIds = new Set(relevant.map((r) => r.conversationId));
    const reasons: Record<string, string> = {};
    for (const r of relevant) reasons[r.conversationId] = r.reason;

    const selected = candidates.filter((c) => relevantIds.has(c.conversationId));
    const messageCount = selected.reduce((n, c) => n + c.messages.length, 0);

    const markdown = renderConversationsMarkdown(selected, {
      query,
      reasons,
      meName: ME_NAME,
    });

    const manifest = await getManifest();
    return NextResponse.json({
      query,
      keywords,
      stats: {
        corpusMessages: messages.length,
        candidates: candidates.length,
        relevant: selected.length,
        messages: messageCount,
        corpusUpdatedAt: manifest?.updatedAt ?? null,
      },
      conversationIds: selected.map((c) => c.conversationId),
      reasons,
      markdown,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Query failed.", details: String(error) },
      { status: 500 }
    );
  }
}
