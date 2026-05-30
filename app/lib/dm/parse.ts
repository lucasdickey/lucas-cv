// Parsing for the X (Twitter) data-archive direct-message files.
//
// This module is intentionally dependency-free and browser-safe: the archive
// is parsed client-side so large files never have to be POSTed in one piece
// (Vercel caps request bodies well below a real DM export's size).
//
// The relevant files in an X export are:
//   data/direct-messages.js        — 1:1 conversations
//   data/direct-messages-group.js  — group conversations
//
// Each is a JS assignment of the form:
//   window.YTD.direct_messages.part0 = [ { "dmConversation": { ... } }, ... ]

import type { DMMessage } from "./types";

interface RawMessageCreate {
  id: string;
  senderId: string;
  recipientId?: string;
  text?: string;
  createdAt: string;
  mediaUrls?: string[];
}

interface RawConversation {
  dmConversation?: {
    conversationId: string;
    messages: Array<{ messageCreate?: RawMessageCreate }>;
  };
}

/**
 * Strip the `window.YTD.* = ` assignment wrapper (if present) and JSON.parse
 * the array payload. Tolerates a raw JSON array as well.
 */
export function extractJsonArray(fileText: string): unknown[] {
  const trimmed = fileText.trim();
  const start = trimmed.indexOf("[");
  const end = trimmed.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(
      "Could not find a JSON array in the file. Make sure you uploaded direct-messages.js (or direct-messages-group.js) from your X archive."
    );
  }
  const json = trimmed.slice(start, end + 1);
  return JSON.parse(json) as unknown[];
}

/**
 * Parse one archive file's text into normalized messages. `fromMe` is left
 * false here; call {@link assignFromMe} once a self id is known.
 */
export function parseArchiveFile(fileText: string): DMMessage[] {
  const raw = extractJsonArray(fileText) as RawConversation[];
  const messages: DMMessage[] = [];

  for (const entry of raw) {
    const conv = entry?.dmConversation;
    if (!conv?.conversationId || !Array.isArray(conv.messages)) continue;

    for (const m of conv.messages) {
      const mc = m?.messageCreate;
      if (!mc?.id || !mc.senderId || !mc.createdAt) continue;
      messages.push({
        id: mc.id,
        conversationId: conv.conversationId,
        senderId: mc.senderId,
        text: mc.text ?? "",
        createdAt: mc.createdAt,
        fromMe: false,
        source: "archive",
        mediaUrls:
          mc.mediaUrls && mc.mediaUrls.length > 0 ? mc.mediaUrls : undefined,
      });
    }
  }

  return messages;
}

/**
 * Auto-detect the account owner's X user id.
 *
 * The owner is the one participant present in (nearly) every conversation, so
 * we rank participant ids by how many distinct conversations they appear in.
 * For 1:1 conversations the id is encoded in "<a>-<b>"; for everything else we
 * fall back to senders. Returns null if it can't be determined.
 */
export function detectSelfId(messages: DMMessage[]): string | null {
  if (messages.length === 0) return null;

  const conversationsById = new Map<string, Set<string>>();
  for (const m of messages) {
    let participants = conversationsById.get(m.conversationId);
    if (!participants) {
      participants = new Set<string>();
      conversationsById.set(m.conversationId, participants);
      // 1:1 conversation ids encode both participants.
      const parts = m.conversationId.split("-");
      if (parts.length === 2 && parts.every((p) => /^\d+$/.test(p))) {
        participants.add(parts[0]);
        participants.add(parts[1]);
      }
    }
    participants.add(m.senderId);
  }

  const convCount = new Map<string, number>();
  for (const participants of conversationsById.values()) {
    for (const id of participants) {
      convCount.set(id, (convCount.get(id) ?? 0) + 1);
    }
  }

  let best: string | null = null;
  let bestCount = -1;
  for (const [id, count] of convCount) {
    if (count > bestCount) {
      best = id;
      bestCount = count;
    }
  }
  return best;
}

/** Stamp `fromMe` onto every message given the detected self id. */
export function assignFromMe(messages: DMMessage[], selfId: string): DMMessage[] {
  return messages.map((m) => ({ ...m, fromMe: m.senderId === selfId }));
}
