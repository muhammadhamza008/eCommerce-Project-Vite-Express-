import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, CreditCard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

type PurchaseActionsProps = {
  productName?: string;
  maxQuantity?: number;
  className?: string;
  context?: "default" | "cart";
  syncWithCart?: boolean; // If true, syncs quantity with cart. If false, always starts at 1
};

const PurchaseActions = ({
  productName = "VitaBoost Premium Daily Greens",
  maxQuantity = 10,
  className,
  context = "default",
  syncWithCart = false, // Default to false so product page always starts at 1
}: PurchaseActionsProps) => {
  const navigate = useNavigate();
  const { quantity: cartQuantity, setQuantity: setCartQuantity, selectedProduct, addToCart, updateCartItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Only sync with cart if syncWithCart is true (for cart page)
  // Product page will always start at 1, regardless of cart quantity
  useEffect(() => {
    if (syncWithCart && cartQuantity > 0) {
      setQuantity(cartQuantity);
    }
    // If syncWithCart is false, quantity stays at 1 (initial state)
  }, [cartQuantity, syncWithCart]);

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, maxQuantity));
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleSecondary = () => {
    if (context === "cart") {
      // Update existing cart item
      if (items.length > 0 && items[0].productId) {
        updateCartItem(items[0].productId, quantity);
      } else if (selectedProduct) {
        addToCart(selectedProduct, quantity);
      } else {
        setCartQuantity(quantity);
      }
      
      toast.success("Cart updated", {
        description: `You now have ${quantity} item${quantity > 1 ? "s" : ""} in your cart.`,
      });
      // Stay on cart page
      return;
    }

    // Add to cart from product page
    if (selectedProduct) {
      addToCart(selectedProduct, quantity);
    } else {
      setCartQuantity(quantity);
    }

    toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`, {
      description: productName,
    });
    navigate("/cart");
  };

  const handlePrimary = () => {
    if (context === "cart") {
      // Update cart before checkout
      if (items.length > 0 && items[0].productId) {
        updateCartItem(items[0].productId, quantity);
      } else if (selectedProduct) {
        addToCart(selectedProduct, quantity);
      } else {
        setCartQuantity(quantity);
      }
      
      toast.success("Proceeding to checkout", {
        description: `Checking out ${quantity} item${quantity > 1 ? "s" : ""}.`,
      });
    } else {
      // Buy now from product page
      if (selectedProduct) {
        addToCart(selectedProduct, quantity);
      } else {
        setCartQuantity(quantity);
      }
      
      toast.success(`Buying ${quantity} item${quantity > 1 ? "s" : ""} now`, {
        description: "Checkout flow would start here.",
      });
    }

    navigate("/checkout");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Quantity Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-10 w-10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-body text-lg font-semibold">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= maxQuantity}
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Buttons */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={handlePrimary}
            className="flex-1 gap-2 bg-primary font-body text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            <CreditCard className="h-5 w-5" />
            {context === "cart" ? "Proceed to Checkout" : "Buy Now"}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleSecondary}
            className="flex-1 gap-2 border-primary font-body text-base font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            {context === "cart" ? "Update Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PurchaseActions;

