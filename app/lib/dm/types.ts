// Shared types for the DM Research Extractor.
//
// A single-user tool: it ingests Lucas's X (Twitter) direct-message history
// (primarily from the official data archive, optionally topped up via the
// X API) and lets him pull semantically relevant messages for research.

/** Where a stored message originally came from. */
export type DMSource = "archive" | "api";

/** A normalized direct message, agnostic to whether it came from the archive
 *  export or the live API. */
export interface DMMessage {
  /** X message id (stable, used for de-duplication across sources). */
  id: string;
  /** The conversation this message belongs to. For 1:1 DMs the X archive uses
   *  "<userIdA>-<userIdB>"; for group DMs it is an opaque id. */
  conversationId: string;
  /** X user id of the sender. */
  senderId: string;
  /** Message body text. */
  text: string;
  /** ISO-8601 timestamp. */
  createdAt: string;
  /** True when Lucas sent it, false when the counterpart did. */
  fromMe: boolean;
  /** Origin of the record. */
  source: DMSource;
  /** Any attached media URLs (best-effort, may be expired). */
  mediaUrls?: string[];
}

/** Metadata describing the currently-stored corpus. */
export interface DMManifest {
  /** Number of shards the corpus is split across in KV. */
  shardCount: number;
  /** Total number of messages stored. */
  totalMessages: number;
  /** Detected X user id of the account owner ("me"). */
  selfId: string | null;
  /** Distinct sources present in the corpus. */
  sources: DMSource[];
  /** ISO timestamp of the last write. */
  updatedAt: string;
}

/** A conversation assembled from messages, used during retrieval / rendering. */
export interface DMConversation {
  conversationId: string;
  /** Counterpart participant ids (everyone who isn't "me"). */
  participantIds: string[];
  messages: DMMessage[];
  /** Earliest / latest message timestamps (ISO). */
  startedAt: string;
  endedAt: string;
}

/** One conversation the relevance filter judged relevant to the query. */
export interface RelevantConversation {
  conversationId: string;
  /** Short reason the model considered it relevant. */
  reason: string;
}
