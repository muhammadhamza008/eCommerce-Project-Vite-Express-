import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Stimulates natural energy production",
  "Boosts focus and mental clarity",
  "Supports immune system function",
  "Backed by science, trusted by experts",
];

const FeaturesSection = () => {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              More energy, less fatigue
            </h2>
            <ul className="mb-8 space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-green/10">
                    <Check className="h-3 w-3 text-accent-green" />
                  </div>
                  <span className="font-body text-base text-muted-foreground md:text-lg">
                    {feature}
                  </span>
                </motion.li>
              ))}
            </ul>
            <Button className="h-12 gap-2 bg-foreground px-8 font-body text-base font-semibold text-background hover:bg-foreground/90">
          Buy Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-warm"
          >
            <img
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80"
              alt="Active lifestyle"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
