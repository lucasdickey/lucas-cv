import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeProduct } from '@/lib/stripe-products';

// Lazy-initialize Stripe client to avoid build-time errors
let stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripe) {
    const stripeApiKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (!stripeApiKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    stripe = new Stripe(stripeApiKey, {
      apiVersion: '2023-10-16',
    });
  }
  return stripe;
}

// Retry logic for transient Stripe API failures
async function createCheckoutSessionWithRetry(
  priceId: string,
  quantity: number,
  successUrl: string,
  cancelUrl: string,
  maxRetries: number = 3
) {
  let lastError: Error | null = null;

  console.log(`[Checkout] Creating session with priceId: ${priceId}, quantity: ${quantity}`);
  console.log(`[Checkout] Success URL: ${successUrl}`);
  console.log(`[Checkout] Cancel URL: ${cancelUrl}`);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Checkout] Attempt ${attempt}/${maxRetries} - calling Stripe API...`);

      const session = await getStripeClient().checkout.sessions.create({
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

      console.log(`[Checkout] ✓ Session created successfully on attempt ${attempt}: ${session.id}`);
      return session;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Log detailed error info
      console.error(`[Checkout] ✗ Attempt ${attempt} failed:`);
      console.error(`  Message: ${lastError.message}`);
      if (error instanceof Stripe.errors.StripeError) {
        console.error(`  Status Code: ${(error as any).statusCode}`);
        console.error(`  Error Type: ${(error as any).type}`);
        console.error(`  Error Code: ${(error as any).code}`);
      }

      // Only retry on transient errors (not auth/validation errors)
      const isTransientError = lastError.message.includes('connection') ||
                               lastError.message.includes('timeout') ||
                               lastError.message.includes('503') ||
                               lastError.message.includes('429');

      if (attempt < maxRetries && isTransientError) {
        const delayMs = Math.min(2000 * Math.pow(2, attempt - 1), 20000);
        console.log(`[Checkout] Transient error detected - retrying after ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else if (attempt < maxRetries) {
        console.log(`[Checkout] Non-transient error - not retrying`);
        throw lastError;
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

    if (!product) {
      console.error(`[Checkout] ✗ Product not found: ${productId}`);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.priceId) {
      console.error(`[Checkout] ✗ Product found but has no priceId: ${productId}`);
      console.error(`  Product data:`, JSON.stringify(product, null, 2));
      return NextResponse.json(
        { error: 'Product has no price' },
        { status: 404 }
      );
    }

    console.log(`[Checkout] ✓ Product found: ${product.name}`);
    console.log(`  ID: ${product.id}`);
    console.log(`  Price ID: ${product.priceId}`);
    console.log(`  Price: $${product.price}`);

    // Get origin for Stripe redirect URLs
    // IMPORTANT: Stripe requires these URLs to be whitelisted in the Stripe dashboard
    // Use the actual domain the user is accessing from
    let origin = request.headers.get('origin');
    const host = request.headers.get('host');

    console.log(`[Checkout] Headers - origin: ${origin}, host: ${host}`);

    if (!origin) {
      // Fallback: construct from host header
      const hostname = host || 'localhost:3000';
      const protocol = hostname.includes('localhost') ? 'http' : 'https';
      origin = `${protocol}://${hostname}`;
      console.log(`[Checkout] Origin header missing - derived from host: ${origin}`);
    } else {
      console.log(`[Checkout] Using origin from headers: ${origin}`);
    }

    // Stripe requires these exact URLs to be whitelisted
    console.log(`[Checkout] Constructed URLs will use origin: ${origin}`);

    // Construct redirect URLs for Stripe
    const successUrl = `${origin}?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}?checkout=cancel`;

    console.log(`[Checkout] Stripe redirect URLs:`);
    console.log(`  Success: ${successUrl}`);
    console.log(`  Cancel:  ${cancelUrl}`);
    console.log(`[Checkout] ⚠️  IMPORTANT: These URLs MUST be whitelisted in Stripe dashboard`);

    // Create a checkout session with retry logic
    const session = await createCheckoutSessionWithRetry(
      product.priceId,
      quantity,
      successUrl,
      cancelUrl
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
