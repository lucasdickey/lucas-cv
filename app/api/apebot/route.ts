import { NextRequest, NextResponse } from 'next/server';

// Mock product database for demo mode
// IDs must match the keys in checkout route for Stripe integration
const mockProducts = [
  {
    id: 'ape-tie-hoodie',
    name: 'Ape in a Tie Hoodie',
    price: 49.99,
    image: 'https://via.placeholder.com/150x150?text=Ape+Tie+Hoodie',
    url: 'https://a-ok.shop/products/ape-tie-hoodie'
  },
  {
    id: 'ai-doomerism-shirt',
    name: 'AI Doomerism T-Shirt',
    price: 24.99,
    image: 'https://via.placeholder.com/150x150?text=AI+Doomerism',
    url: 'https://a-ok.shop/products/ai-doomerism'
  },
  {
    id: 'optimistic-sweater',
    name: 'Stay Optimistic Sweater',
    price: 59.99,
    image: 'https://via.placeholder.com/150x150?text=Stay+Optimistic',
    url: 'https://a-ok.shop/products/optimistic-sweater'
  },
];

function generateMockResponse(userMessage: string): { message: string; suggestions?: string[]; products?: any[] } {
  const messageLower = userMessage.toLowerCase();

  // Match keywords and generate contextual responses
  if (messageLower.includes('hoodie') || messageLower.includes('ape') || messageLower.includes('tie')) {
    return {
      message: "Nice choice! 🦍 We've got the perfect piece for you - the 'Ape in a Tie' hoodie. It's got that satirical vibe that says 'I understand the assignment' without saying a word. Perfect for anyone who gets the A-OK philosophy.",
      suggestions: ['View product', 'See other items', 'Check prices'],
      products: [mockProducts[0], mockProducts[1]],
    };
  }

  if (messageLower.includes('shirt') || messageLower.includes('t-shirt')) {
    return {
      message: "Our T-shirts are perfect for making a statement. Whether you're embracing the chaos or staying optimistic, we've got a design that speaks your language.",
      suggestions: ['Browse T-shirts', 'See hoodies', 'New arrivals'],
      products: [mockProducts[1]],
    };
  }

  if (messageLower.includes('price') || messageLower.includes('cost') || messageLower.includes('how much')) {
    return {
      message: "Our gear is priced to match the vibe: T-shirts from $24.99, hoodies from $49.99, and premium pieces up to $59.99. Quality satire at a fair price.",
      suggestions: ['Show me hoodies', 'Show me shirts', 'What\'s on sale?'],
    };
  }

  if (messageLower.includes('product') || messageLower.includes('show') || messageLower.includes('browse')) {
    return {
      message: "Check out our collection of AI-era satire wear. From 'Ape in a Tie' hoodies to 'AI Doomerism' shirts, we've got something for everyone who appreciates dark humor and tech culture.",
      suggestions: ['Hoodies', 'T-shirts', 'What\'s new?'],
      products: mockProducts,
    };
  }

  // Default response
  return {
    message: "I'm here to help you find the perfect A-OK gear! Ask me about hoodies, shirts, prices, or what's trending. What interests you?",
    suggestions: ['Show me products', 'Hoodies', 'T-shirts', 'Prices'],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userMessage = body.message || '';

    console.log(`[Apebot] User: ${userMessage}`);

    // For now, use mock responses in development
    // TODO: Replace with actual API call once endpoint is fully configured
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      // Use mock response in development
      const mockResponse = generateMockResponse(userMessage);
      console.log(`[Apebot] Mock response generated`);
      return NextResponse.json(mockResponse);
    }

    // Production: Try to call the real API
    try {
      const response = await fetch('https://a-ok.shop/apebot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(request.headers.get('authorization') && {
            'Authorization': request.headers.get('authorization')!,
          }),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (apiError) {
      console.error('Real API failed, falling back to mock:', apiError);
      // Fallback to mock if real API fails
      const mockResponse = generateMockResponse(userMessage);
      return NextResponse.json(mockResponse);
    }
  } catch (error) {
    console.error('Error in Apebot handler:', error);

    return NextResponse.json(
      {
        message:
          "I'm having trouble connecting right now. Please visit A-OK.shop directly or try again later!",
        suggestions: ['Visit A-OK.shop', 'Try again'],
      },
      { status: 200 }
    );
  }
}
