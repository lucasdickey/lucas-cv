import { NextRequest, NextResponse } from "next/server";
import { loadAllMessages } from "@/app/lib/dm/store";
import { groupConversations } from "@/app/lib/dm/markdown";
import { synthesizeThemes } from "@/app/lib/dm/synthesis";

export const runtime = "nodejs";
export const maxDuration = 300;

const ME_NAME = "Lucas";

/**
 * POST { query, conversationIds } — synthesize themes (with representative
 * quotes) across the previously-selected conversations. Returns Markdown for
 * on-screen display and download.
 */
export async function POST(request: NextRequest) {
  let query = "";
  let conversationIds: string[] = [];
  try {
    const body = await request.json();
    query = body.query ?? "";
    conversationIds = Array.isArray(body.conversationIds) ? body.conversationIds : [];
  } catch {
    /* ignore */
  }

  if (!query.trim()) {
    return NextResponse.json({ error: "A research query is required." }, { status: 400 });
  }
  if (conversationIds.length === 0) {
    return NextResponse.json(
      { error: "No conversations to synthesize. Run a query first." },
      { status: 400 }
    );
  }

  try {
    const messages = await loadAllMessages();
    const idSet = new Set(conversationIds);
    const selected = groupConversations(messages).filter((c) => idSet.has(c.conversationId));

    if (selected.length === 0) {
      return NextResponse.json(
        { error: "Selected conversations are no longer in the corpus." },
        { status: 400 }
      );
    }

    const { markdown, truncated } = await synthesizeThemes(selected, query, ME_NAME);
    return NextResponse.json({ markdown, truncated });
  } catch (error) {
    return NextResponse.json(
      { error: "Synthesis failed.", details: String(error) },
      { status: 500 }
    );
  }
}
