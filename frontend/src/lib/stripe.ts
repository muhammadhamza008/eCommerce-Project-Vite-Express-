// Stripe configuration and utilities

import { loadStripe, Stripe } from "@stripe/stripe-js";

export const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Create a Payment Intent via your backend
 * This calls your backend API endpoint that creates a Payment Intent
 * You need to set up a backend endpoint at /api/create-payment-intent
 * 
 * Example backend implementation (Node.js/Express):
 * 
 * app.post('/api/create-payment-intent', async (req, res) => {
 *   const { amount, currency } = req.body;
 *   const paymentIntent = await stripe.paymentIntents.create({
 *     amount: Math.round(amount * 100),
 *     currency: currency || 'usd',
 *   });
 *   res.json({ clientSecret: paymentIntent.client_secret });
 * });
 */
export const createPaymentIntent = async (amount: number, currency = "usd") => {
  try {
    // Always use relative URL since frontend and backend are on the same server
    const apiUrl = "/api/create-payment-intent";
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    // If backend endpoint doesn't exist, throw error to be handled by caller
    throw new Error(
      "Payment Intent endpoint not found. Please set up a backend endpoint at /api/create-payment-intent"
    );
  }
};

/**
 * Alternative: Create payment intent via WooCommerce if you have Stripe plugin
 * This would require WooCommerce REST API with order creation that includes payment
 */
export const createPaymentIntentViaWooCommerce = async (
  orderId: number,
  amount: number
) => {
  // If you're using WooCommerce Stripe plugin, you might be able to
  // create payment intents through WooCommerce API
  // This is plugin-specific and may require additional setup
  throw new Error(
    "WooCommerce Stripe integration requires plugin-specific setup. Please implement a backend endpoint for Payment Intent creation."
  );
};
