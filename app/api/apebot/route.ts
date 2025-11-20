import { NextRequest, NextResponse } from 'next/server';
import { getStripeProducts } from '@/lib/stripe-products';

// Type for products in responses
interface ResponseProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  url: string;
}

// Helper function to parse quantity from user message
function parseQuantity(message: string): number {
  const quantityMap: { [key: string]: number } = {
    'one': 1,
    '1': 1,
    'two': 2,
    '2': 2,
    'three': 3,
    '3': 3,
    'four': 4,
    '4': 4,
    'five': 5,
    '5': 5,
    'a couple': 2,
    'couple': 2,
    'few': 3,
    'several': 5,
  };

  for (const [word, qty] of Object.entries(quantityMap)) {
    if (message.toLowerCase().includes(word)) {
      return qty;
    }
  }
  return Infinity; // No quantity limit found
}

function generateMockResponse(
  userMessage: string,
  allProducts: ResponseProduct[]
): { message: string; suggestions?: string[]; products?: ResponseProduct[] } {
  const messageLower = userMessage.toLowerCase();
  const requestedQuantity = parseQuantity(userMessage);

  // Match keywords and generate contextual responses
  if (messageLower.includes('hoodie') || messageLower.includes('ape') || messageLower.includes('tie')) {
    const hoodies = allProducts.filter((p) =>
      p.name.toLowerCase().includes('hoodie')
    );
    const limitedHoodies = hoodies.slice(0, requestedQuantity);
    return {
      message: "Nice choice! 🦍 We've got some amazing hoodies with satirical designs. Perfect for anyone who gets the A-OK philosophy.",
      suggestions: ['View product', 'See other items', 'Check prices'],
      products: limitedHoodies.length > 0 ? limitedHoodies : allProducts.slice(0, Math.min(2, requestedQuantity)),
    };
  }

  if (messageLower.includes('shirt') || messageLower.includes('t-shirt')) {
    const shirts = allProducts.filter((p) =>
      p.name.toLowerCase().includes('shirt') || p.name.toLowerCase().includes('t-shirt')
    );
    const limitedShirts = shirts.slice(0, requestedQuantity);
    return {
      message: "Our T-shirts are perfect for making a statement. Whether you're embracing the chaos or staying optimistic, we've got a design that speaks your language.",
      suggestions: ['Browse T-shirts', 'See hoodies', 'New arrivals'],
      products: limitedShirts.length > 0 ? limitedShirts : allProducts.slice(0, Math.min(1, requestedQuantity)),
    };
  }

  if (messageLower.includes('price') || messageLower.includes('cost') || messageLower.includes('how much')) {
    const minPrice = Math.min(...allProducts.map((p) => p.price));
    const maxPrice = Math.max(...allProducts.map((p) => p.price));
    return {
      message: `Our gear is priced to match the vibe: from $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}. Quality satire at a fair price.`,
      suggestions: ['Show me hoodies', 'Show me shirts', 'What\'s new?'],
    };
  }

  if (messageLower.includes('product') || messageLower.includes('show') || messageLower.includes('browse')) {
    const limitedProducts = allProducts.slice(0, requestedQuantity);
    return {
      message: "Check out our collection of AI-era satire wear. We've got hoodies, shirts, and more with designs that celebrate and poke fun at tech culture.",
      suggestions: ['Hoodies', 'T-shirts', 'What\'s new?'],
      products: limitedProducts.length > 0 ? limitedProducts : allProducts,
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

    // Fetch real Stripe products
    let stripeProducts: ResponseProduct[] = [];
    try {
      const products = await getStripeProducts();
      console.log(`[Apebot] Raw Stripe products:`, products);

      if (products && products.length > 0) {
        stripeProducts = products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image || 'https://via.placeholder.com/150x150?text=Product',
          url: p.url,
        }));
        console.log(`[Apebot] Loaded ${stripeProducts.length} products from Stripe`);
        console.log(`[Apebot] Product names:`, stripeProducts.map(p => p.name));
      } else {
        console.warn('[Apebot] No products returned from Stripe');
      }
    } catch (stripeError) {
      console.error('[Apebot] Error fetching Stripe products:', stripeError);
      // Continue with empty list - generateMockResponse will still work
      console.log('[Apebot] Continuing without products due to API error');
    }

    // For now, use mock responses (but with real Stripe products)
    // TODO: Replace with actual API call once endpoint is fully configured
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      // Use mock response with real Stripe products
      const mockResponse = generateMockResponse(userMessage, stripeProducts);
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
      // Fallback to mock with Stripe products if real API fails
      const mockResponse = generateMockResponse(userMessage, stripeProducts);
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
