import { motion } from "framer-motion";
import { ArrowRight, Zap, Brain, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Zap,
    title: "Boosts natural energy",
    description: "VitaBoost activates your body's natural energy pathways for sustained vitality throughout the day",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Brain,
    title: "Enhances mental clarity",
    description: "Powerful nootropics and adaptogens support focus, memory, and cognitive performance",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Moon,
    title: "Improves recovery",
    description: "Essential nutrients support deep, restorative sleep and faster muscle recovery",
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-warm py-16 md:py-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <h2 className="mb-2 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              How VitaBoost works in your body
            </h2>
          </div>
          <Button className="gap-2 bg-foreground font-body text-sm font-semibold text-background hover:bg-foreground/90">
            Buy Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all hover:shadow-medium"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}>
                  <step.icon className={`h-7 w-7 ${step.iconColor}`} />
                </div>
                <span className="font-display text-5xl font-bold text-muted/50">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
