import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How should I take VitaBoost Daily Greens?",
    answer: "Take 2 capsules daily with water, preferably with a meal for optimal absorption. We recommend taking it in the morning to maximize the energy-boosting benefits throughout your day.",
  },
  {
    question: "Is VitaBoost suitable for vegetarians/vegans?",
    answer: "Yes! VitaBoost is 100% plant-based and suitable for both vegetarians and vegans. Our capsules are made from vegetable cellulose, and all ingredients are sourced from organic, plant-based sources.",
  },
  {
    question: "How long until I see results?",
    answer: "Many customers report feeling more energized within the first week. However, for optimal results, we recommend consistent use for at least 30 days. The full benefits of our superfoods blend typically become more noticeable after 2-3 months of regular use.",
  },
  {
    question: "Are there any side effects?",
    answer: "VitaBoost is made with natural, organic ingredients and is generally well-tolerated. Some people may experience mild digestive changes initially as their body adjusts. If you have any concerns or are taking medications, please consult with your healthcare provider.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with VitaBoost, simply return the unused portion for a full refund, no questions asked. We're confident you'll love our product!",
  },
  {
    question: "Is VitaBoost third-party tested?",
    answer: "Absolutely! All batches of VitaBoost are tested by independent, third-party laboratories for purity, potency, and safety. We're committed to transparency and quality, and certificates of analysis are available upon request.",
  },
];

const ProductFAQ = () => {
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
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg text-muted-foreground">
            Got questions? We've got answers. If you don't find what you're looking for, 
            feel free to contact our support team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-border bg-card px-6 data-[state=open]:shadow-soft"
              >
                <AccordionTrigger className="font-display text-left text-lg font-semibold text-foreground hover:no-underline [&[data-state=open]>svg]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 font-body text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductFAQ;
