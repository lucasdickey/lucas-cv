import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in dollars
  priceId: string;
  image: string;
  url: string;
}

// Cache products for 30 minutes to avoid rate limits
let productCache: StripeProduct[] | null = null;
let cacheTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Fallback cache: stores last successful fetch to survive rate limits
let fallbackProductCache: StripeProduct[] | null = null;

/**
 * Fetch all active products and their prices from Stripe
 * Optimized to reduce API calls: 2 calls instead of 39+ (1 for products, 1 for all prices)
 */
export async function getStripeProducts(): Promise<StripeProduct[]> {
  // Return cached results if still fresh
  if (productCache && Date.now() - cacheTime < CACHE_DURATION) {
    console.log('[Stripe] Returning fresh cached products');
    return productCache;
  }

  try {
    // Fetch all active products (1 API call)
    const products = await stripe.products.list({
      active: true,
      limit: 100,
    });

    // Fetch all active prices at once (1 API call instead of N calls)
    const allPrices = await stripe.prices.list({
      active: true,
      limit: 100,
    });

    // Build a map of product ID to first price for fast lookup
    const priceMap = new Map<string, typeof allPrices.data[0]>();
    allPrices.data.forEach((price) => {
      if (price.product && typeof price.product === 'string') {
        if (!priceMap.has(price.product)) {
          priceMap.set(price.product, price);
        }
      }
    });

    // Map products to include pricing info
    const productsWithPrices: StripeProduct[] = products.data
      .map((product) => {
        const price = priceMap.get(product.id);
        const unitAmount = price?.unit_amount || 0;

        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: unitAmount / 100, // Convert from cents to dollars
          priceId: price?.id || '',
          image: (product.images?.[0] || '') as string,
          url: `https://a-ok.shop/products/${product.id}`,
        };
      })
      .filter((p) => p.priceId); // Only include products with prices

    // Cache the results
    productCache = productsWithPrices;
    cacheTime = Date.now();

    // Update fallback cache with successful fetch
    fallbackProductCache = productsWithPrices;
    console.log(`[Stripe] Successfully fetched and cached ${productsWithPrices.length} products (using optimized 2-call approach)`);

    return productsWithPrices;
  } catch (error) {
    console.error('[Stripe] Error fetching products:', error);

    // If we have fallback data, return it instead of empty array
    if (fallbackProductCache && fallbackProductCache.length > 0) {
      console.warn(`[Stripe] API failed, falling back to ${fallbackProductCache.length} previously cached products`);
      return fallbackProductCache;
    }

    console.warn('[Stripe] No fallback products available');
    // Return empty array only if we have no fallback
    return [];
  }
}

/**
 * Get a single product by ID
 */
export async function getStripeProduct(productId: string): Promise<StripeProduct | null> {
  try {
    const products = await getStripeProducts();
    return products.find((p) => p.id === productId) || null;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

/**
 * Clear the product cache (useful for refreshing on demand)
 */
export function clearProductCache() {
  productCache = null;
  cacheTime = 0;
  // Keep fallback cache intact for resilience
  console.log('[Stripe] Cleared active cache but kept fallback cache');
}

/**
 * Clear both caches (full reset)
 */
export function clearAllProductCaches() {
  productCache = null;
  cacheTime = 0;
  fallbackProductCache = null;
  console.log('[Stripe] Cleared all product caches');
}
