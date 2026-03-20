import { Chat } from "chat";
import { createWhatsAppAdapter } from "@chat-adapter/whatsapp";
import { createMemoryState } from "@chat-adapter/state-memory";

/**
 * WhatsApp bot using Vercel Chat SDK.
 */
export const bot = (typeof process !== 'undefined' && process.env.WHATSAPP_ACCESS_TOKEN)
  ? new Chat({
      userName: "StripeMonitorBot",
      adapters: {
        whatsapp: createWhatsAppAdapter({
          phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "PLACEHOLDER",
          accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "PLACEHOLDER",
          verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "PLACEHOLDER",
          appSecret: process.env.WHATSAPP_APP_SECRET || "PLACEHOLDER",
        }),
      },
      state: createMemoryState(),
    })
  : null;

/**
 * Send a WhatsApp message to a specific phone number.
 */
export async function sendWhatsAppSummary(text: string) {
  if (!bot) {
    console.error("WhatsApp bot is not initialized. Check environment variables.");
    return;
  }

  const recipient = process.env.MY_WHATSAPP_NUMBER;
  if (!recipient) {
    console.error("MY_WHATSAPP_NUMBER is not set");
    return;
  }

  try {
    const thread = await bot.openDM(recipient);
    await thread.post(text);
    console.log(`WhatsApp summary sent to ${recipient}`);
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    throw error;
  }
}
