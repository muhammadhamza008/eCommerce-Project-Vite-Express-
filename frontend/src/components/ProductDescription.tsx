import { motion } from "framer-motion";

const ProductDescription = () => {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            Unlock Your Full Potential
          </h2>

          <div className="prose prose-lg mx-auto font-body text-muted-foreground">
            <p className="mb-6 text-center leading-relaxed">
              VitaBoost Premium Daily Greens is more than just a supplement – it's a 
              comprehensive wellness solution designed to help you thrive every day. 
              Our carefully curated blend combines ancient wisdom with modern science 
              to deliver maximum benefits in every serving.
            </p>

            <div className="my-12 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="mb-3 font-display text-xl font-semibold text-foreground">
                  Premium Ingredients
                </h3>
                <p className="text-base text-muted-foreground">
                  Sourced from organic farms worldwide, our ingredients undergo rigorous 
                  testing to ensure purity, potency, and effectiveness. No fillers, no 
                  artificial additives – just pure, natural goodness.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="mb-3 font-display text-xl font-semibold text-foreground">
                  Science-Backed Formula
                </h3>
                <p className="text-base text-muted-foreground">
                  Developed in collaboration with leading nutritionists and backed by 
                  clinical research, our formula is optimized for maximum bioavailability 
                  and absorption.
                </p>
              </div>
            </div>

            <p className="text-center leading-relaxed">
              Each bottle contains a 30-day supply of our powerful formula. Simply take 
              two capsules daily with water, preferably with a meal, to experience the 
              transformative benefits of VitaBoost. Join thousands of satisfied customers 
              who have made VitaBoost an essential part of their daily wellness routine.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductDescription;
