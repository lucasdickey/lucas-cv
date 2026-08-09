// Single-pass theme synthesis over the relevant conversations.
//
// Produces a Markdown report: the themes that emerge across the messages, each
// backed by representative verbatim quotes (attributed to the owner or the
// counterpart). This is the artifact shown on screen and offered for download.

import { claude, MODELS } from "./claude";
import { renderConversationsForModel } from "./markdown";
import type { DMConversation } from "./types";

/** Keep synthesis input within a safe single-request size. */
const SYNTHESIS_CHAR_BUDGET = 300_000;

const SYNTHESIS_SYSTEM = `You are a senior UX/customer-research analyst. You are given a set of direct-message conversations (between "Me" — the researcher — and counterparts labelled "Them") that were already filtered as relevant to a research question.

Synthesize the themes that emerge across these conversations. Be faithful to what was actually said; do not invent or extrapolate beyond the evidence.

Output GitHub-flavored Markdown with this structure:
# Theme Synthesis
A 2-4 sentence executive summary.

## Themes
For each theme (aim for 3-8, ordered by significance):
### <Theme title>
- A short paragraph explaining the theme and its significance.
- **Representative quotes:** a bulleted list of 1-4 verbatim quotes. Quote exactly, in quotation marks, each attributed like — Them or — Me, with the approximate date if useful.

## Notable tensions or open questions
Bullet points of contradictions, unmet needs, or gaps worth following up.

Keep quotes verbatim and clearly attributed. Prefer the counterpart's ("Them") words for user-voice insights.`;

export async function synthesizeThemes(
  conversations: DMConversation[],
  query: string,
  meName = "Me"
): Promise<{ markdown: string; truncated: boolean }> {
  let transcript = renderConversationsForModel(conversations, meName);
  let truncated = false;
  if (transcript.length > SYNTHESIS_CHAR_BUDGET) {
    transcript = transcript.slice(0, SYNTHESIS_CHAR_BUDGET);
    truncated = true;
  }

  const markdown = await claude({
    model: MODELS.synthesis,
    maxTokens: 8192,
    temperature: 0.3,
    system: SYNTHESIS_SYSTEM,
    user: `Research question: "${query}"\n\n${
      truncated
        ? "NOTE: The transcript below was truncated to fit; synthesize from what is present.\n\n"
        : ""
    }Conversations:\n\n${transcript}`,
  });

  return { markdown, truncated };
}
