import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    title: "Life-changing supplement!",
    content: "I've been taking VitaBoost for 3 months now and the difference is incredible. More energy, better sleep, and my skin has never looked better. Highly recommend!",
    verified: true,
  },
  {
    name: "James L.",
    rating: 5,
    date: "1 month ago",
    title: "Finally found what works",
    content: "After trying countless supplements, VitaBoost is the only one that actually delivers on its promises. I feel more focused and energized throughout the day.",
    verified: true,
  },
  {
    name: "Emily R.",
    rating: 4,
    date: "3 weeks ago",
    title: "Great quality product",
    content: "The quality of ingredients is evident. I appreciate that it's organic and the capsules are easy to swallow. Noticed improvements in my digestion and energy levels.",
    verified: true,
  },
  {
    name: "Michael T.",
    rating: 5,
    date: "1 week ago",
    title: "Worth every penny",
    content: "Was skeptical at first, but the results speak for themselves. My gym performance has improved and I recover faster. This is now a staple in my routine.",
    verified: true,
  },
];

const ProductReviews = () => {
  const averageRating = 4.8;
  const totalReviews = 2847;

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
                Customer Reviews
              </h2>
              <p className="font-body text-lg text-muted-foreground">
                See what our customers are saying
              </p>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-6">
              <div className="text-center">
                <span className="font-display text-4xl font-bold text-foreground">
                  {averageRating}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(averageRating) ? "fill-gold text-gold" : "fill-muted text-muted"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <span className="font-display text-2xl font-bold text-foreground">
                  {totalReviews.toLocaleString()}
                </span>
                <p className="font-body text-sm text-muted-foreground">Reviews</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl border border-border bg-background p-6"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-muted/30" />

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display font-semibold text-primary">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-body font-semibold text-foreground">
                      {review.name}
                    </span>
                    {review.verified && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-body text-xs font-medium text-primary">
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="font-body text-xs text-muted-foreground">
                    {review.date}
                  </span>
                </div>
              </div>

              <div className="mb-2 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "fill-gold text-gold" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>

              <h4 className="mb-2 font-display text-lg font-semibold text-foreground">
                {review.title}
              </h4>
              <p className="font-body text-muted-foreground">{review.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
