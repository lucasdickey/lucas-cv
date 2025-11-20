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
        const delayMs = Math.min(2000 * Math.pow(2, attempt - 1), 20000); // exponential backoff, max 20s: 2s, 4s, 8s
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

    // Get origin from request headers, with fallback to environment-based URL
    let origin = request.headers.get('origin');
    if (!origin) {
      // Use host header to construct origin
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      origin = `${protocol}://${host}`;
    }

    console.log(`[Checkout] Origin: ${origin}`);

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

    // Get detailed error info
    let errorMessage = 'Unknown error';
    let statusCode = 500;

    if (error instanceof Stripe.errors.StripeError) {
      errorMessage = error.message;
      statusCode = error.statusCode || 500;
      console.error(`[Checkout] Stripe error (${statusCode}): ${errorMessage}`);
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error(`[Checkout] Error: ${errorMessage}`);
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
