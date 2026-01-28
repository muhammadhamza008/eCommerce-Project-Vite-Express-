import { motion } from "framer-motion";
import { Star, Beaker, Shield, Loader2 } from "lucide-react";
import PurchaseActions from "@/components/PurchaseActions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useWooCommerceProducts } from "@/hooks/useWooCommerceProducts";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

const ProductHero = () => {
  const { data: products, isLoading, error } = useWooCommerceProducts({
    per_page: 1,
    status: "publish",
  });
  const { setSelectedProduct, selectedProduct } = useCart();

  const product = products?.[0] || selectedProduct;

  // Set selected product when products load
  useEffect(() => {
    if (product && !selectedProduct) {
      setSelectedProduct(product);
    }
  }, [product, selectedProduct, setSelectedProduct]);

  if (isLoading) {
    return (
      <section className="bg-warm py-8 md:py-12 lg:py-16">
        <div className="container mx-auto">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="bg-warm py-8 md:py-12 lg:py-16">
        <div className="container mx-auto">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-body text-muted-foreground">
              {error
                ? "Unable to load products. Please check your WooCommerce API configuration."
                : "No products found."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const mainImage = product.images?.[0]?.src || "";
  const price = parseFloat(product.price || product.regular_price || "0");
  const regularPrice = parseFloat(product.regular_price || "0");
  const onSale = product.on_sale && product.sale_price;
  const salePrice = onSale ? parseFloat(product.sale_price || "0") : null;
  const category = product.categories?.[0]?.name || "Product";
  const rating = parseFloat(product.average_rating || "0");

  const heroFaqs = [
    {
      question: `What is ${product.name}?`,
      answer: product.short_description || product.description || "A premium product designed to enhance your wellness.",
    },
    {
      question: "How does it work?",
      answer: product.description || "This product works by providing essential nutrients to support your health and wellness goals.",
    },
    {
      question: "Is it safe?",
      answer: "Yes, this product is made with quality ingredients and is third-party tested for purity and potency.",
    },
  ];

  return (
    <section className="bg-warm py-8 md:py-12 lg:py-16">
      <div className="container mx-auto">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Image */}
          <div className="relative">
            {/* Floating Badges */}
            <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 shadow-soft"
              >
                <Beaker className="h-4 w-4 text-muted-foreground" />
                <span className="font-body text-xs font-medium text-foreground">Made in the USA</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 shadow-soft"
              >
                <Shield className="h-4 w-4 text-accent-green" />
                <span className="font-body text-xs font-medium text-foreground">HSA/FSA Eligible</span>
              </motion.div>
            </div>

            {/* Main Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-warm-dark"
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                  No image available
                </div>
              )}
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-accent-green" />
              <span className="font-body text-sm font-medium text-muted-foreground">
                {category}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              {product.name}
            </motion.h1>

            {/* Price & Rating */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-4 flex flex-wrap items-center gap-4"
            >
              <div className="flex items-baseline gap-2">
                {onSale && salePrice ? (
                  <>
                    <span className="font-display text-2xl font-bold text-foreground">
                      ${salePrice.toFixed(2)}
                    </span>
                    <span className="font-display text-lg text-muted-foreground line-through">
                      ${regularPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-display text-2xl font-bold text-foreground">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>
              {rating > 0 && (
                <div className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="font-body text-sm font-medium">
                    {rating.toFixed(1)} ({product.rating_count} reviews)
                  </span>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 font-body text-base leading-relaxed text-muted-foreground md:text-lg"
              dangerouslySetInnerHTML={{
                __html: product.short_description || "Support natural energy levels and unlock better focus, recovery, and overall vitality",
              }}
            />

            <PurchaseActions className="mb-6" productName={product.name} />

            {/* Feature List */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 space-y-2"
            >
              {[
                "No subscription required",
                "Personalized care, 100% online",
                "Third-party lab tested",
                "Free express shipping",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-body text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Inline FAQs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Accordion type="single" collapsible className="space-y-2">
                {heroFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`hero-faq-${index}`}
                    className="rounded-xl border border-border bg-background px-4 data-[state=open]:shadow-soft"
                  >
                    <AccordionTrigger className="font-display text-sm font-semibold text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 font-body text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
