import { motion } from "framer-motion";
import { ArrowRight, Star, Check, Beaker, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import PurchaseActions from "@/components/PurchaseActions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import productHero from "@/assets/product-hero.jpg";

const heroFaqs = [
  {
    question: "What is VitaBoost?",
    answer: "VitaBoost is a premium daily supplement containing 75+ superfoods, vitamins, and minerals designed to boost energy, support immune function, and promote overall wellness.",
  },
  {
    question: "How does it work?",
    answer: "VitaBoost works by providing your body with essential nutrients that support natural energy production, immune health, and cellular function. Simply take 2 capsules daily with water.",
  },
  {
    question: "Is it safe?",
    answer: "Yes, VitaBoost is made with 100% natural, organic ingredients and is third-party tested for purity and potency. It's free from artificial additives, fillers, and common allergens.",
  },
];

const HeroSection = () => {
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
              <img
                src={productHero}
                alt="VitaBoost Premium Supplement"
                className="h-full w-full object-cover"
              />
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
                Daily Wellness
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              VitaBoost <sup className="text-lg font-medium text-muted-foreground">Rx</sup>
            </motion.h1>

            {/* Price & Rating */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-4 flex flex-wrap items-center gap-4"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-lg font-medium text-muted-foreground">From</span>
                <span className="font-display text-2xl font-bold text-foreground">$49</span>
                <span className="font-display text-lg text-muted-foreground line-through">$79</span>
                <span className="font-body text-sm text-muted-foreground">/month</span>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span className="font-body text-sm font-medium">4.9 TrustPilot</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 font-body text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Support natural energy levels and unlock better focus, recovery, and overall vitality
            </motion.p>

            <PurchaseActions className="mb-6" productName="VitaBoost Rx" />

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
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
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

export default HeroSection;
