import { motion } from "framer-motion";
import { Zap, Brain, Heart, Shield, Sparkles, Moon } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Boosted Energy",
    description: "Natural sustained energy throughout the day without crashes or jitters.",
  },
  {
    icon: Brain,
    title: "Mental Clarity",
    description: "Enhanced focus and cognitive function for peak mental performance.",
  },
  {
    icon: Heart,
    title: "Heart Health",
    description: "Supports cardiovascular health with powerful antioxidants.",
  },
  {
    icon: Shield,
    title: "Immune Support",
    description: "Strengthens your immune system with essential vitamins and minerals.",
  },
  {
    icon: Sparkles,
    title: "Radiant Skin",
    description: "Promotes healthy, glowing skin from the inside out.",
  },
  {
    icon: Moon,
    title: "Better Sleep",
    description: "Supports natural sleep patterns and recovery.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ProductBenefits = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Experience the Benefits
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg text-muted-foreground">
            Our comprehensive formula delivers multiple health benefits to help you 
            look and feel your best every day.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-medium"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <benefit.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="font-body text-muted-foreground">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductBenefits;
