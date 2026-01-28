import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");
  
  return {
    base: "/",
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api/woocommerce": {
          target: env.VITE_WOOCOMMERCE_BASE_URL || "https://precisionpeptidelab.co.uk",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/woocommerce/, ""),
          configure: (proxy, _options) => {
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              // Add authentication headers if provided
              const consumerKey = env.VITE_WOOCOMMERCE_CONSUMER_KEY || "";
              const consumerSecret = env.VITE_WOOCOMMERCE_CONSUMER_SECRET || "";
              
              if (consumerKey && consumerSecret) {
                const credentials = `${consumerKey}:${consumerSecret}`;
                const auth = Buffer.from(credentials).toString("base64");
                proxyReq.setHeader("Authorization", `Basic ${auth}`);
              }
            });
          },
        },
        "/api/create-payment-intent": {
          target: env.VITE_BACKEND_URL || "http://localhost:3000",
          changeOrigin: true,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.warn("Backend payment intent endpoint not available:", err.message);
            });
          },
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: false,
      minify: "esbuild", // Use esbuild (default, faster and no extra dependencies)
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            stripe: ["@stripe/stripe-js", "@stripe/react-stripe-js"],
          },
        },
      },
    },
  };
});
