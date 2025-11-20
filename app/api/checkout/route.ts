import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeProduct } from '@/lib/stripe-products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Retry logic for transient Stripe API failures
async function createCheckoutSessionWithRetry(
  priceId: string,
  quantity: number,
  successUrl: string,
  cancelUrl: string,
  maxRetries: number = 3
) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      console.log(`[Checkout] Session created successfully on attempt ${attempt}`);
      return session;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[Checkout] Attempt ${attempt} failed: ${lastError.message}`);

      // Only retry on transient errors
      if (attempt < maxRetries) {
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // exponential backoff, max 10s
        console.log(`[Checkout] Retrying after ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error('Failed to create checkout session after retries');
}

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
    const origin = request.headers.get('origin') || 'https://lucas-q8wcsvldp-lucasdickeys-projects.vercel.app';

    // Create a checkout session with retry logic
    const session = await createCheckoutSessionWithRetry(
      product.priceId,
      quantity,
      `${origin}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      `${origin}?checkout=cancel`
    );

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
