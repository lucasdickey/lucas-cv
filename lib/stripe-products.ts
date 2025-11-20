import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
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

// Cache products for 5 minutes to avoid excessive API calls
let productCache: StripeProduct[] | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all active products and their prices from Stripe
 */
export async function getStripeProducts(): Promise<StripeProduct[]> {
  // Return cached results if still fresh
  if (productCache && Date.now() - cacheTime < CACHE_DURATION) {
    return productCache;
  }

  try {
    // Fetch all active products
    const products = await stripe.products.list({
      active: true,
      limit: 100,
    });

    // For each product, get its default price
    const productsWithPrices: StripeProduct[] = await Promise.all(
      products.data.map(async (product) => {
        // Get the product's prices
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
          limit: 1,
        });

        const price = prices.data[0];
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
    );

    // Cache the results
    productCache = productsWithPrices;
    cacheTime = Date.now();

    return productsWithPrices;
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    // Return empty array if fetch fails
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
}
