import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="bg-foreground py-16 md:py-24">
      <div className="container mx-auto text-center">
        <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-background md:text-4xl lg:text-5xl">
          Ready to transform your wellness?
        </h2>
        <p className="mx-auto mb-8 max-w-xl font-body text-lg text-background/70">
          Join thousands of satisfied customers who have made VitaBoost an essential part of their daily routine.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 gap-2 bg-background px-8 font-body text-base font-semibold text-foreground hover:bg-background/90"
          >
            Buy Now
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 border-background/30 px-8 font-body text-base font-semibold text-background hover:bg-background/10"
          >
            Learn more
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
