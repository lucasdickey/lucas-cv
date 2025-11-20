# Agentic Commerce Protocol (ACP) Integration

This directory contains the configuration and implementation for integrating with the A-OK Shop's Apebot using the Agentic Commerce Protocol.

## Overview

The ACP integration enables AI-powered commerce capabilities directly within the lucas.cv website, allowing visitors to interact with the A-OK Shop's intelligent shopping assistant.

**Architecture:** The implementation uses a **backend API proxy** pattern that routes all chat requests through `app/api/apebot/route.ts`. This approach:
- ✅ Avoids CORS issues with external APIs
- ✅ Provides a centralized request handler
- ✅ Allows for graceful fallbacks and error handling
- ✅ Enables easy addition of features like rate limiting and logging
- ✅ Works seamlessly in development and production

## Components

### 1. Configuration (`acp.config.ts`)

The main configuration file that defines:
- **API Endpoint**: Routes through local proxy at `/api/apebot` (backend proxies to `https://a-ok.shop/apebot`)
- **Agent Settings**: Response time, streaming, context window, and system prompts
- **Capabilities**: Enabled commerce features (product search, orders, support, recommendations)
- **API Helpers**: Functions for communicating with the Apebot API

### 1.5 API Proxy (`app/api/apebot/route.ts`)

The backend API route that:
- Proxies requests to the actual Apebot API at `https://a-ok.shop/apebot`
- Handles CORS issues automatically
- Provides graceful fallback responses in development
- Manages error handling and rate limiting

### 2. Chat Component (`../components/ApebotChat.tsx`)

A custom-built chat interface that:
- Matches the terminal aesthetic of lucas.cv
- Provides a floating chat button
- Supports minimize/maximize functionality
- Maintains conversation context
- Handles loading states and errors gracefully
- Is fully responsive and accessible

## Setup

### 1. Environment Variables

Create a `.env.local` file (based on `.env.example`):

```bash
NEXT_PUBLIC_APEBOT_API_KEY=your_api_key_here
```

**Note**: If the Apebot API doesn't require authentication, you can leave this empty.

### 2. Configuration

Adjust settings in `app/config/acp.config.ts`:

```typescript
export const acpConfig: ACPConfig = {
  apebotEndpoint: 'https://a-ok.shop/apebot',
  // ... other settings
};
```

## API Interface

### Request Format

```typescript
{
  message: string,              // User's message
  context?: ChatMessage[],      // Previous messages for context
  sessionId?: string,           // Unique session identifier
  systemPrompt?: string         // System prompt for the agent
}
```

### Response Format

```typescript
{
  message: string,              // Agent's response
  suggestions?: string[],       // Optional quick reply suggestions
  products?: Array<{            // Optional product recommendations
    id: string,
    name: string,
    price: number,
    image: string,
    url: string
  }>
}
```

## Features

### Current Features
- ✅ Real-time chat interface
- ✅ Context-aware conversations
- ✅ Session management
- ✅ Error handling with fallbacks
- ✅ Terminal-themed UI
- ✅ Responsive design
- ✅ Minimize/maximize functionality

### Planned Features
- 🔄 Product search and filtering
- 🔄 Direct cart integration
- 🔄 Order tracking
- 🔄 Personalized recommendations
- 🔄 Multi-language support
- 🔄 Voice input/output

## Usage

The Apebot chat widget automatically appears on all pages as a floating button in the bottom-right corner. Users can:

1. Click the button to open the chat
2. Type messages to ask about products or get help
3. Minimize the chat to continue browsing
4. Close the chat completely when done

## Customization

### Styling

The chat component uses Tailwind CSS classes that match the lucas.cv terminal theme:
- Background: `#f5f5dc` (beige)
- Primary: `#8b0000` (dark red)
- Text: `#333333` (dark gray)
- Borders: `#cccccc` (light gray)

To customize, edit the classes in `ApebotChat.tsx`.

### Agent Behavior

Adjust the system prompt in `acp.config.ts` to change how the agent responds:

```typescript
systemPrompt: `Your custom instructions here...`
```

## Development

### Testing Locally

```bash
npm run dev
```

The chat widget will appear on `http://localhost:3000`.

### Testing the API

You can test the Apebot API directly:

```bash
curl -X POST https://a-ok.shop/apebot \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me your products"}'
```

## Troubleshooting

### Chat not appearing
- Check that `ApebotChat` is imported and rendered in `app/page.tsx`
- Verify the component is not hidden by z-index or overflow issues

### API errors
- Check the browser console for error messages
- Verify the API endpoint is correctly set to `/api/apebot` (local proxy)
- Check if authentication is required (set `NEXT_PUBLIC_APEBOT_API_KEY` if needed)
- The backend proxy at `app/api/apebot/route.ts` handles CORS automatically
- In development, the proxy provides mock fallback responses if the external API is unavailable

### Styling issues
- Verify Tailwind CSS is properly configured
- Check for CSS conflicts with other components
- Use browser dev tools to inspect applied styles

## Architecture

```
lucas-cv/
├── app/
│   ├── api/
│   │   └── apebot/
│   │       └── route.ts         # Backend proxy to Apebot API
│   ├── config/
│   │   ├── acp.config.ts        # ACP configuration
│   │   └── ACP_README.md        # This file
│   └── components/
│       └── ApebotChat.tsx       # Chat UI component
└── .env.example                 # Environment variables template

### Request Flow

Browser (ApebotChat.tsx)
   ↓
POST /api/apebot (local proxy)
   ↓
app/api/apebot/route.ts (handles CORS, auth, fallbacks)
   ↓
POST https://a-ok.shop/apebot (external API)
   ↓
Response → ApebotChat.tsx
```

## Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Validate and sanitize all user inputs
- Implement rate limiting if needed
- Monitor API usage and costs

## Resources

- [A-OK Shop](https://a-ok.shop) - Main shop website
- [lucas.cv](https://lucas.cv) - This portfolio site
- [GitHub Repository](https://github.com/lucas-dickey/lucas-cv) - Source code

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments in `acp.config.ts` and `ApebotChat.tsx`
3. Open an issue on GitHub
4. Contact the A-OK Shop team for API-specific questions
