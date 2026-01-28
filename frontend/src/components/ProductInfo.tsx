import { motion } from "framer-motion";
import { Star, Truck, Shield, Leaf } from "lucide-react";
import PurchaseActions from "@/components/PurchaseActions";

const ProductInfo = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5"
      >
        <Leaf className="h-4 w-4 text-primary" />
        <span className="font-body text-xs font-semibold uppercase tracking-wider text-primary">
          Best Seller
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl"
      >
        VitaBoost Premium Daily Greens
      </motion.h1>

      {/* Rating */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-3"
      >
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < 4 ? "fill-gold text-gold" : "fill-gold/30 text-gold/30"}`}
            />
          ))}
        </div>
        <span className="font-body text-sm text-muted-foreground">
          4.8 out of 5 · <span className="text-foreground underline">2,847 reviews</span>
        </span>
      </motion.div>

      {/* Price */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-baseline gap-3"
      >
        <span className="font-display text-4xl font-bold text-foreground">$59.99</span>
        <span className="font-body text-lg text-muted-foreground line-through">$79.99</span>
        <span className="rounded-full bg-accent px-3 py-1 font-body text-sm font-semibold text-accent-foreground">
          Save 25%
        </span>
      </motion.div>

      {/* Short Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="font-body text-base leading-relaxed text-muted-foreground md:text-lg"
      >
        A powerful blend of 75+ superfoods, vitamins, and minerals designed to boost 
        your energy, support immune function, and promote overall wellness. Made with 
        organic ingredients and backed by science.
      </motion.p>

      <PurchaseActions productName="VitaBoost Premium Daily Greens" className="" />

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-3 gap-4 rounded-xl border border-border bg-card p-4"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Truck className="h-6 w-6 text-primary" />
          <span className="font-body text-xs text-muted-foreground">Free Shipping</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-body text-xs text-muted-foreground">30-Day Guarantee</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-body text-xs text-muted-foreground">100% Organic</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductInfo;
