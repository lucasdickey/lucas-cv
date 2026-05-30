// Retrieval: turn a natural-language research query into the set of relevant
// conversations, using the "Claude relevance filter" approach.
//
//   1. Expand the query into keywords/synonyms (cheap model).
//   2. Keyword pre-filter the corpus down to candidate conversations.
//   3. Ask a stronger model to judge which candidates are genuinely relevant.
//
// Pre-filtering keeps the (potentially large) corpus from being shipped to the
// model wholesale; the relevance pass provides the semantic judgement.

import { claude, MODELS, parseJsonFromResponse } from "./claude";
import { groupConversations, renderConversationsForModel } from "./markdown";
import type { DMConversation, DMMessage, RelevantConversation } from "./types";

/** Roughly cap each relevance request near this many characters of transcript. */
const RELEVANCE_CHAR_BUDGET = 120_000;

/** Use the cheap model to expand a query into match terms. Falls back to a
 *  naive tokenization if the model call fails. */
export async function expandQueryToKeywords(query: string): Promise<string[]> {
  const fallback = () =>
    Array.from(
      new Set(
        query
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s]/gu, " ")
          .split(/\s+/)
          .filter((w) => w.length > 2)
      )
    );

  try {
    const text = await claude({
      model: MODELS.keywords,
      maxTokens: 512,
      system:
        "You expand a research question into a flat list of search keywords for matching against direct-message text. Include synonyms, related jargon, product names, and likely phrasings. Respond ONLY with a JSON array of lowercase strings.",
      user: `Research question: "${query}"\n\nReturn 8-25 keywords/phrases as a JSON array.`,
    });
    const terms = parseJsonFromResponse<string[]>(text)
      .map((t) => String(t).toLowerCase().trim())
      .filter(Boolean);
    const merged = Array.from(new Set([...terms, ...fallback()]));
    return merged.length > 0 ? merged : fallback();
  } catch {
    return fallback();
  }
}

/** Conversations containing at least one message that matches any keyword. */
export function keywordPrefilter(
  messages: DMMessage[],
  keywords: string[]
): DMConversation[] {
  if (keywords.length === 0) return [];
  const conversations = groupConversations(messages);
  const terms = keywords.map((k) => k.toLowerCase());

  return conversations.filter((conv) =>
    conv.messages.some((m) => {
      const text = m.text.toLowerCase();
      return terms.some((t) => text.includes(t));
    })
  );
}

/** Split candidate conversations into batches under the char budget. */
function batchByBudget(conversations: DMConversation[]): DMConversation[][] {
  const batches: DMConversation[][] = [];
  let current: DMConversation[] = [];
  let size = 0;

  for (const conv of conversations) {
    const convSize = conv.messages.reduce((n, m) => n + m.text.length + 40, 0);
    if (current.length > 0 && size + convSize > RELEVANCE_CHAR_BUDGET) {
      batches.push(current);
      current = [];
      size = 0;
    }
    current.push(conv);
    size += convSize;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

const RELEVANCE_SYSTEM = `You are a UX research assistant. You are given direct-message conversations and a research question. Identify which conversations contain material genuinely relevant to the research question — user feedback, customer-interview content, pain points, feature requests, quotes, or context that bears on the question. Ignore conversations that merely mention a keyword in passing with no substantive relevance.

Respond ONLY with a JSON array. Each element: {"conversationId": string, "reason": string} where reason is one concise sentence. Return an empty array if none are relevant.`;

/** Ask the model which candidate conversations are relevant to the query. */
export async function relevanceFilter(
  candidates: DMConversation[],
  query: string,
  meName = "Me"
): Promise<RelevantConversation[]> {
  if (candidates.length === 0) return [];

  const batches = batchByBudget(candidates);
  const results: RelevantConversation[] = [];

  for (const batch of batches) {
    const transcript = renderConversationsForModel(batch, meName);
    const text = await claude({
      model: MODELS.relevance,
      maxTokens: 2048,
      system: RELEVANCE_SYSTEM,
      user: `Research question: "${query}"\n\nConversations:\n\n${transcript}`,
    });
    try {
      const parsed = parseJsonFromResponse<RelevantConversation[]>(text);
      for (const r of parsed) {
        if (r?.conversationId) {
          results.push({ conversationId: String(r.conversationId), reason: r.reason ?? "" });
        }
      }
    } catch {
      // If a batch fails to parse, skip it rather than failing the whole query.
    }
  }

  return results;
}
