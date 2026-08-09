// Rendering helpers: turn normalized messages into the Markdown artifact that
// gets downloaded and fed to downstream agents.

import type { DMConversation, DMMessage } from "./types";

/** Group a flat message list into conversations sorted chronologically. */
export function groupConversations(messages: DMMessage[]): DMConversation[] {
  const byConv = new Map<string, DMMessage[]>();
  for (const m of messages) {
    const list = byConv.get(m.conversationId);
    if (list) list.push(m);
    else byConv.set(m.conversationId, [m]);
  }

  const conversations: DMConversation[] = [];
  for (const [conversationId, msgs] of byConv) {
    msgs.sort((a, b) => (a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0));
    const participantIds = Array.from(
      new Set(msgs.filter((m) => !m.fromMe).map((m) => m.senderId))
    );
    conversations.push({
      conversationId,
      participantIds,
      messages: msgs,
      startedAt: msgs[0]?.createdAt ?? "",
      endedAt: msgs[msgs.length - 1]?.createdAt ?? "",
    });
  }

  conversations.sort((a, b) => (a.startedAt < b.startedAt ? -1 : 1));
  return conversations;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

/** Label for a counterpart conversation (group vs 1:1, with ids). */
function counterpartLabel(conv: DMConversation): string {
  if (conv.participantIds.length === 0) return "conversation";
  if (conv.participantIds.length === 1) return `user ${conv.participantIds[0]}`;
  return `group (${conv.participantIds.length} participants)`;
}

interface RenderOptions {
  /** The research query that produced this set (for the document header). */
  query: string;
  /** Optional per-conversation relevance reasons keyed by conversationId. */
  reasons?: Record<string, string>;
  /** Display name to use for the account owner. */
  meName?: string;
}

/**
 * Render the relevant conversations as a single Markdown document. Each message
 * is attributed to "Me (Lucas)" or the counterpart so downstream analysis can
 * distinguish what was shared by whom.
 */
export function renderConversationsMarkdown(
  conversations: DMConversation[],
  options: RenderOptions
): string {
  const me = options.meName ?? "Me";
  const totalMessages = conversations.reduce((n, c) => n + c.messages.length, 0);

  const lines: string[] = [];
  lines.push(`# DM Research Extract`);
  lines.push("");
  lines.push(`**Research query:** ${options.query}`);
  lines.push(`**Generated:** ${fmtDate(new Date().toISOString())}`);
  lines.push(
    `**Scope:** ${conversations.length} conversation${conversations.length === 1 ? "" : "s"}, ${totalMessages} message${totalMessages === 1 ? "" : "s"}`
  );
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const conv of conversations) {
    lines.push(`## Conversation with ${counterpartLabel(conv)}`);
    lines.push("");
    lines.push(
      `*${fmtDate(conv.startedAt)} → ${fmtDate(conv.endedAt)} · ${conv.messages.length} messages · id \`${conv.conversationId}\`*`
    );
    const reason = options.reasons?.[conv.conversationId];
    if (reason) {
      lines.push("");
      lines.push(`> **Why relevant:** ${reason}`);
    }
    lines.push("");

    for (const m of conv.messages) {
      const who = m.fromMe ? me : "Them";
      const text = m.text.trim() || "_(no text)_";
      lines.push(`- **${who}** · ${fmtDate(m.createdAt)}`);
      // Indent multi-line message bodies under the bullet.
      for (const para of text.split("\n")) {
        lines.push(`  ${para}`);
      }
      if (m.mediaUrls?.length) {
        lines.push(`  _[media: ${m.mediaUrls.length} attachment(s)]_`);
      }
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * A compact text rendering used as model input for relevance + synthesis,
 * keeping token usage lower than the full Markdown artifact.
 */
export function renderConversationsForModel(
  conversations: DMConversation[],
  meName = "Me"
): string {
  const out: string[] = [];
  for (const conv of conversations) {
    out.push(`### conversationId: ${conv.conversationId} (${counterpartLabel(conv)})`);
    for (const m of conv.messages) {
      const who = m.fromMe ? meName : "Them";
      const date = fmtDate(m.createdAt);
      out.push(`[${date}] ${who}: ${m.text.replace(/\s+/g, " ").trim()}`);
    }
    out.push("");
  }
  return out.join("\n");
}
