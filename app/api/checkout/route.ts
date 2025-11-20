import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeProduct } from '@/lib/stripe-products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json();
    console.log(`[Checkout] Received request for product: ${productId}`);

    if (!productId) {
      console.error('[Checkout] No product ID provided');
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Fetch the product from Stripe
    console.log(`[Checkout] Fetching product ${productId} from Stripe`);
    const product = await getStripeProduct(productId);

    if (!product || !product.priceId) {
      console.error(`[Checkout] Product not found or no price: ${productId}`);
      return NextResponse.json(
        { error: 'Product not found or has no price' },
        { status: 404 }
      );
    }

    console.log(`[Checkout] Creating Stripe session for ${product.name} (priceId: ${product.priceId})`);
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create a checkout session with the real Stripe product
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: product.priceId,
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${origin}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?checkout=cancel`,
    });

    console.log(`[Checkout] Successfully created session: ${session.id}`);
    return NextResponse.json({
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error('[Checkout] Error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      console.error(`[Checkout] Stripe error: ${error.message} (${error.statusCode})`);
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create checkout session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
