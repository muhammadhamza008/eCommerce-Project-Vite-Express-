// Vercel serverless function for creating Stripe Payment Intent
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only POST requests are allowed",
    });
  }

  try {
    // Check if Stripe is initialized
    if (!stripe) {
      console.error("STRIPE_SECRET_KEY is not set in environment variables");
      return res.status(500).json({
        error: "Server configuration error",
        message: "Stripe secret key is not configured",
      });
    }

    const { amount, currency = "usd" } = req.body;

    // Validate input
    if (amount === undefined || amount === null) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Amount is required",
      });
    }

    const amountNum = typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        error: "Invalid amount",
        message: "Amount must be a positive number",
      });
    }

    // Validate currency
    const validCurrencies = ["usd", "eur", "gbp", "cad", "aud"];
    const currencyLower = currency.toLowerCase();
    if (!validCurrencies.includes(currencyLower)) {
      return res.status(400).json({
        error: "Invalid currency",
        message: `Currency must be one of: ${validCurrencies.join(", ")}`,
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountNum), // Amount in cents
      currency: currencyLower,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: "accept_a_payment",
        created_at: new Date().toISOString(),
      },
    });

    console.log(
      `✅ Payment Intent created: ${paymentIntent.id} for amount ${amountNum} ${currencyLower}`
    );

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("❌ Error creating payment intent:", error);

    // Provide more specific error messages
    let statusCode = 500;
    let errorMessage = "Failed to create payment intent";

    if (error.type === "StripeInvalidRequestError") {
      statusCode = 400;
      errorMessage = error.message;
    } else if (error.type === "StripeAuthenticationError") {
      statusCode = 500;
      errorMessage = "Stripe authentication failed. Please check your API key.";
    } else if (error.type === "StripeAPIError") {
      statusCode = 502;
      errorMessage = "Stripe API error. Please try again later.";
    }

    res.status(statusCode).json({
      error: error.type || "StripeError",
      message: errorMessage,
    });
  }
};
