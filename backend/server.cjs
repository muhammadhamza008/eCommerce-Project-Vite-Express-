require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const express = require("express");
const cors = require("cors");
const path = require("path");

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? require("stripe")(process.env.STRIPE_SECRET_KEY)
  : null;

const app = express();
// const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;

// CORS configuration - simplified for same-origin deployment
// Since frontend and backend are on the same server, CORS is less critical
// But we still allow it for development and flexibility
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : NODE_ENV === "production"
  ? [] // Same origin in production
  : ["http://localhost:8080", "http://localhost:5173"];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // In production with same origin, allow requests without origin check
      if (NODE_ENV === "production" && allowedOrigins.length === 0) {
        return callback(null, true);
      }

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || NODE_ENV === "development") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware (only in development)
if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// API Routes (must come before static file serving)
// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend server is running" });
});

app.get("/api/_whoami", (req, res) => {
  res.json({ ok: true, from: "express", time: new Date().toISOString() });
});

// Create Payment Intent endpoint
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    // Check if Stripe is initialized
    if (!stripe) {
      console.error("STRIPE_SECRET_KEY is not set in .env file");
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

    res.json({
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
});

// Serve static files from React app (production only)
if (NODE_ENV === "production") {
  const distPath = path.join(__dirname, "dist");

  app.use(express.static(distPath));

  // SPA fallback *only for non-asset, non-API routes*
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({
        error: "Not found",
        message: `API route ${req.method} ${req.path} not found`,
      });
    }

    // For any other path (including /assets that static didn't handle),
    // don't send text; either let it 404 or send index.html.
    if (req.path.startsWith("/assets/")) {
      // Let static 404 stand:
      return res.status(404).end();
    }

    res.sendFile(path.join(distPath, "index.html"));
  });
  //   const distPath = path.join(__dirname, "../dist");

  //   // Middleware to set correct MIME types for JavaScript modules
  //   app.use((req, res, next) => {
  //     // Set correct MIME type for .js files (especially module scripts)
  //     if (req.path.endsWith(".js")) {
  //       res.type("application/javascript");
  //     } else if (req.path.endsWith(".mjs")) {
  //       res.type("application/javascript");
  //     } else if (req.path.endsWith(".css")) {
  //       res.type("text/css");
  //     } else if (req.path.endsWith(".json")) {
  //       res.type("application/json");
  //     } else if (req.path.endsWith(".wasm")) {
  //       res.type("application/wasm");
  //     }
  //     next();
  //   });

  //   // Serve static assets with proper MIME types
  //   app.use(express.static(distPath, {
  //     maxAge: "1y", // Cache static assets for 1 year
  //     etag: true,
  //     setHeaders: (res, filePath) => {
  //       // Ensure JavaScript files have correct MIME type
  //       if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) {
  //         res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  //       }
  //     },
  //   }));

  //   // Handle React Router - all other routes return index.html
  //   app.get("*", (req, res) => {
  //     // Don't serve index.html for API routes
  //     if (req.path.startsWith("/api/")) {
  //       return res.status(404).json({
  //         error: "Not found",
  //         message: `API route ${req.method} ${req.path} not found`
  //       });
  //     }

  //     res.sendFile(path.join(distPath, "index.html"));
  //   });
  // } else {
  // 404 handler for development (when not serving static files)
  app.use((req, res) => {
    res.status(404).json({
      error: "Not found",
      message: `Route ${req.method} ${req.path} not found`,
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  // Don't leak error details in production
  const message =
    NODE_ENV === "production" ? "Internal server error" : err.message;

  res.status(err.status || 500).json({
    error: "Internal server error",
    message: message,
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("=".repeat(50));
  console.log(`🚀 Stripe backend server running`);
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`🌐 Server: http://0.0.0.0:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🔒 CORS allowed origins: ${allowedOrigins.join(", ")}`);

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️  WARNING: STRIPE_SECRET_KEY is not set in .env file");
  } else {
    const keyPrefix = process.env.STRIPE_SECRET_KEY.substring(0, 7);
    console.log(`✅ Stripe secret key loaded (${keyPrefix}...)`);
  }

  console.log("=".repeat(50));
});
