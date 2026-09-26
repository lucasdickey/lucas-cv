// Minimal Anthropic Messages API client (raw fetch).
//
// We call the REST API directly rather than through the Vercel AI SDK so the
// behaviour is pinned and independent of SDK major-version churn. It reads the
// same ANTHROPIC_API_KEY the rest of the app already relies on.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

/** Models used across the retrieval/synthesis pipeline. */
export const MODELS = {
  /** Cheap + fast: query → keyword expansion. */
  keywords: "claude-haiku-4-5-20251001",
  /** Balanced: judging which conversations are relevant. */
  relevance: "claude-sonnet-4-6",
  /** Highest quality: the single synthesis pass. */
  synthesis: "claude-opus-4-8",
} as const;

interface ClaudeOptions {
  model: string;
  system?: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}

export async function claude({
  model,
  system,
  user,
  maxTokens = 4096,
  temperature = 0.2,
}: ClaudeOptions): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      ...(system ? { system } : {}),
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  return (data.content ?? [])
    .filter((b) => b.type === "text" && b.text)
    .map((b) => b.text)
    .join("")
    .trim();
}

/**
 * Extract a JSON value from a model response that may be wrapped in prose or a
 * ```json fenced block. Throws if nothing parseable is found.
 */
export function parseJsonFromResponse<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.search(/[[{]/);
  const end = Math.max(candidate.lastIndexOf("]"), candidate.lastIndexOf("}"));
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`No JSON found in model response: ${text.slice(0, 200)}`);
  }
  return JSON.parse(candidate.slice(start, end + 1)) as T;
}
