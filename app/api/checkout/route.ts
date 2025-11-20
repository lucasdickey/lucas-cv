import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

// Product catalog with Stripe price IDs
const products: Record<
  string,
  {
    name: string;
    price: number;
    stripePriceId: string;
    image: string;
    description: string;
  }
> = {
  'ape-tie-hoodie': {
    name: 'Ape in a Tie Hoodie',
    price: 4999, // in cents
    stripePriceId: process.env.STRIPE_PRICE_APE_TIE_HOODIE || 'price_test_ape_hoodie',
    image: 'https://via.placeholder.com/300x300?text=Ape+Tie+Hoodie',
    description: 'Premium hoodie featuring the iconic Ape in a Tie design',
  },
  'ai-doomerism-shirt': {
    name: 'AI Doomerism T-Shirt',
    price: 2499, // in cents
    stripePriceId: process.env.STRIPE_PRICE_AI_DOOMERISM || 'price_test_ai_shirt',
    image: 'https://via.placeholder.com/300x300?text=AI+Doomerism',
    description: 'Express your existential concerns with style',
  },
  'optimistic-sweater': {
    name: 'Stay Optimistic Sweater',
    price: 5999, // in cents
    stripePriceId: process.env.STRIPE_PRICE_OPTIMISTIC || 'price_test_sweater',
    image: 'https://via.placeholder.com/300x300?text=Stay+Optimistic',
    description: 'A reminder to stay positive in the age of AI',
  },
};

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json();

    if (!productId || !products[productId]) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = products[productId];
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // In test mode, use test price IDs
    const priceId = process.env.NODE_ENV === 'production'
      ? product.stripePriceId
      : 'price_1HJ7CXA0ZGfh92lHNVMdLMHe'; // Stripe test price ID for testing

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          // For demo mode, create dynamic pricing if price ID doesn't exist
          price: process.env.STRIPE_SECRET_KEY ? priceId : undefined,
          // Fallback: create price inline
          ...(process.env.STRIPE_SECRET_KEY ? {} : {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                description: product.description,
                images: [product.image],
              },
              unit_amount: product.price,
            },
          }),
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${origin}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?checkout=cancel`,
      customer_email: undefined, // Will be captured in checkout form
    });

    return NextResponse.json({
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
