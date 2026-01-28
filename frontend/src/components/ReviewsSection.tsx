import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    name: "Sarah M.",
    rating: 5,
    content: "VitaBoost has completely transformed my mornings. I wake up feeling energized and focused. The quality is unmatched!",
  },
  {
    name: "James L.",
    rating: 5,
    content: "After trying countless supplements, VitaBoost is the only one that delivers. My energy levels are consistently high throughout the day.",
  },
  {
    name: "Emily R.",
    rating: 5,
    content: "The customer service is amazing. They care about how the supplement works for you. The delivery is fast and stress-free!",
  },
  {
    name: "Michael T.",
    rating: 5,
    content: "As a busy professional, I have little free time. VitaBoost gives me the sustained energy I need. No more afternoon crashes!",
  },
  {
    name: "Lisa K.",
    rating: 5,
    content: "I was skeptical at first, but the results speak for themselves. In just 4 weeks, I feel like a new person. Highly recommend!",
  },
];

const ReviewsSection = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const nextReviews = () => {
    setStartIndex((prev) => Math.min(prev + 1, reviews.length - visibleCount));
  };

  const prevReviews = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section id="reviews" className="bg-warm py-16 md:py-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-gold text-gold" />
              <span className="font-display text-lg font-semibold">4.9/5</span>
            </div>
            <span className="text-muted-foreground">on TrustPilot</span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Real people, real results
          </h2>
        </motion.div>

        {/* Reviews Grid */}
        <div className="relative">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(startIndex, startIndex + visibleCount).map((review, index) => (
              <motion.div
                key={startIndex + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display font-semibold text-foreground">
                    {review.name}
                  </span>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {review.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevReviews}
              disabled={startIndex === 0}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextReviews}
              disabled={startIndex >= reviews.length - visibleCount}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
