import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PurchaseActions from "@/components/PurchaseActions";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { Loader2 } from "lucide-react";

const Cart = () => {
  const { quantity, unitPrice, items, selectedProduct } = useCart();
  const cartProduct = items.length > 0 ? items[0].product : selectedProduct;
  const subtotal = unitPrice * quantity;
  const tax = subtotal * 0.08; // 8% example tax
  const total = subtotal + tax;
  const isEmpty = quantity === 0;
  
  const productImage = cartProduct?.images?.[0]?.src || "";
  const productName = cartProduct?.name || "VitaBoost Premium Daily Greens";
  const productDescription = cartProduct?.short_description || "30-day supply · Once daily · 75+ superfoods, vitamins, and minerals";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-10 md:py-14">
        <h1 className="mb-6 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Your Cart
        </h1>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
            <p className="mb-2 font-display text-xl font-semibold text-foreground">
              Your cart is empty
            </p>
            <p className="mb-6 max-w-md font-body text-sm text-muted-foreground">
              Start by choosing your ideal quantity on the product page, then add VitaBoost to your
              cart.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-2 font-body text-sm font-semibold text-background hover:bg-foreground/90"
            >
              Browse products
            </a>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
            {/* Cart items */}
            <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {productName}
                  </h2>
                  <p 
                    className="font-body text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: productDescription }}
                  />
                  <p className="font-body text-sm font-medium text-foreground">
                    Ships in 1–2 business days · Free shipping
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-display text-xl font-bold text-foreground">
                    ${unitPrice.toFixed(2)}
                  </p>
                  {cartProduct?.regular_price && parseFloat(cartProduct.regular_price) > unitPrice && (
                    <p className="font-body text-xs text-muted-foreground line-through">
                      ${parseFloat(cartProduct.regular_price).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <p className="font-body text-sm text-muted-foreground">
                  Adjust your quantity or proceed to checkout to complete your order.
                </p>
                <PurchaseActions productName={productName} context="cart" syncWithCart={true} />
              </div>
            </div>

            {/* Summary */}
            <aside className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Order Summary
              </h2>
              <div className="space-y-2 font-body text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({quantity} item{quantity > 1 ? "s" : ""})</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="text-foreground">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax (estimated)</span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-body text-base font-semibold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="font-body text-xs text-muted-foreground">
                You&apos;ll see the final amount at checkout before you place your order.
              </p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;

