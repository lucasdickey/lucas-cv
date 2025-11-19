/**
 * Agentic Commerce Protocol (ACP) Configuration
 *
 * This configuration file defines the settings for integrating with
 * the A-OK Shop's Apebot commerce agent.
 */

export interface ACPConfig {
  // API endpoint for the apebot
  apebotEndpoint: string;

  // Shop configuration
  shopUrl: string;
  shopName: string;

  // API authentication (if needed)
  apiKey?: string;

  // Agent behavior settings
  agentSettings: {
    // Maximum response time in ms
    maxResponseTime: number;

    // Enable streaming responses
    streamingEnabled: boolean;

    // Context retention (number of messages to keep in context)
    contextWindow: number;

    // Agent personality/prompt
    systemPrompt: string;
  };

  // Commerce capabilities
  capabilities: {
    productSearch: boolean;
    orderPlacement: boolean;
    customerSupport: boolean;
    recommendations: boolean;
  };
}

export const acpConfig: ACPConfig = {
  apebotEndpoint: 'https://a-ok.shop/apebot',
  shopUrl: 'https://a-ok.shop',
  shopName: 'A-OK Shop',

  // Note: API key should be stored in environment variables in production
  apiKey: process.env.NEXT_PUBLIC_APEBOT_API_KEY,

  agentSettings: {
    maxResponseTime: 30000, // 30 seconds
    streamingEnabled: true,
    contextWindow: 10, // Keep last 10 messages
    systemPrompt: `You are the A-OK Shop Apebot, a helpful AI shopping assistant for A-OK.shop,
    an AI-driven nerdwear satire fashion brand. You help customers discover products, answer
    questions about orders, and provide a fun, engaging shopping experience. Keep responses
    concise and on-brand with A-OK's satirical tech culture aesthetic.`,
  },

  capabilities: {
    productSearch: true,
    orderPlacement: true,
    customerSupport: true,
    recommendations: true,
  },
};

// API helper functions
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ApebotRequest {
  message: string;
  context?: ChatMessage[];
  sessionId?: string;
}

export interface ApebotResponse {
  message: string;
  suggestions?: string[];
  products?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    url: string;
  }>;
}

/**
 * Send a message to the Apebot API
 */
export async function sendToApebot(
  request: ApebotRequest
): Promise<ApebotResponse> {
  try {
    const response = await fetch(acpConfig.apebotEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(acpConfig.apiKey && { 'Authorization': `Bearer ${acpConfig.apiKey}` }),
      },
      body: JSON.stringify({
        message: request.message,
        context: request.context?.slice(-acpConfig.agentSettings.contextWindow),
        sessionId: request.sessionId,
        systemPrompt: acpConfig.agentSettings.systemPrompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`Apebot API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error communicating with Apebot:', error);

    // Return a fallback response
    return {
      message: "I'm having trouble connecting right now. Please visit A-OK.shop directly or try again later!",
      suggestions: ['Visit A-OK.shop', 'Try again'],
    };
  }
}
