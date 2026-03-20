import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { TwitterMention } from "./twitter";

/**
 * AI summarization for Twitter mentions using Vercel AI SDK.
 *
 * Required environment variable:
 * - ANTHROPIC_API_KEY
 */
export async function summarizeMentions(mentions: TwitterMention[]): Promise<string> {
  const model = anthropic("claude-3-5-sonnet-20241022");

  // Organize mentions by category
  const atlas = mentions.filter((m) => m.category === "atlas");
  const stripe = mentions.filter((m) => m.category === "stripe");
  const patrickc = mentions.filter((m) => m.category === "patrickc");

  const prompt = `
    You are a helpful assistant. Please summarize the following Twitter/X activity.
    The summary will be sent over WhatsApp, so keep it concise but informative.

    IMPORTANT: Prioritize @atlas mentions over @stripe mentions.

    Data:
    - @atlas mentions: ${atlas.length}
    - @stripe mentions: ${stripe.length}
    - @patrickc tweets: ${patrickc.length}

    Full content:
    ${mentions
      .map(
        (m) =>
          `[${m.category}] @${m.authorUsername}: ${m.text} (${m.metrics.likeCount} likes, ${m.metrics.retweetCount} retweets)`
      )
      .join("\n\n")}

    Instructions:
    1. Start with @atlas mentions. Highlight the most important/interesting ones.
    2. Then cover @stripe mentions.
    3. Include @patrickc's tweets.
    4. Use a professional yet conversational tone.
    5. Use emojis where appropriate to make it readable on WhatsApp.
  `;

  try {
    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 500,
    });
    return text.trim();
  } catch (error) {
    console.error("AI summarization failed:", error);
    // Fallback simple summary
    return `Summary for 30 mentions:
- @atlas: ${atlas.length}
- @stripe: ${stripe.length}
- @patrickc: ${patrickc.length}
(AI summarization failed, please check the dashboard for details.)`;
  }
}
