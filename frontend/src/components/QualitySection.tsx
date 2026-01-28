import { motion } from "framer-motion";
import { useState } from "react";

const tests = [
  {
    name: "Potency",
    fullName: "Potency Tested",
    description: "A test to verify the supplement contains the correct concentration of active ingredients for maximum effectiveness.",
  },
  {
    name: "Purity",
    fullName: "Purity Tested", 
    description: "A test to ensure the product is free from contaminants, heavy metals, and unwanted substances.",
  },
  {
    name: "Quality",
    fullName: "Quality Tested",
    description: "A test to confirm the product meets strict manufacturing standards and quality control requirements.",
  },
  {
    name: "Safety",
    fullName: "Safety Tested",
    description: "A test to verify the product adheres to safety recommendations and is suitable for daily consumption.",
  },
];

const QualitySection = () => {
  const [activeTest, setActiveTest] = useState(0);

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50"
          >
            <img
              src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80"
              alt="Lab testing"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-8 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Always lab tested for quality & consistency
            </h2>

            {/* Test Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {tests.map((test, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTest(index)}
                  className={`rounded-full px-4 py-2 font-body text-sm font-medium transition-all ${
                    activeTest === index
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {test.name}
                </button>
              ))}
            </div>

            {/* Active Test Info */}
            <motion.div
              key={activeTest}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                {tests[activeTest].fullName}
              </h3>
              <p className="font-body text-muted-foreground">
                {tests[activeTest].description}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
