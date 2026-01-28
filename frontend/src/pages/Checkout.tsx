import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { getStripe, createPaymentIntent } from "@/lib/stripe";
import StripePaymentForm from "@/components/StripePaymentForm";
import { wooCommerceApi } from "@/lib/woocommerce";

const Checkout = () => {
  const { quantity, unitPrice, items, selectedProduct, clearCart } = useCart();
  const cartProduct = items.length > 0 ? items[0].product : selectedProduct;
  const productName = cartProduct?.name || "VitaBoost Premium Daily Greens";
  const subtotal = unitPrice * quantity;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Create payment intent when component mounts or total changes
  useEffect(() => {
    if (total > 0 && quantity > 0) {
      const initializePayment = async () => {
        try {
          // Try to create payment intent via backend
          // If backend endpoint doesn't exist, we'll handle it gracefully
          const secret = await createPaymentIntent(total);
          setClientSecret(secret);
        } catch (error) {
          // If backend endpoint doesn't exist, we'll proceed without it
          // and create order directly after payment
          console.warn("Payment Intent creation failed, will create order after payment:", error);
        }
      };
      initializePayment();
    }
  }, [total, quantity]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setPaymentIntentId(paymentIntentId);
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.address || !formData.city || !formData.state || !formData.zip) {
      toast.error("Please fill in all required shipping fields");
      return;
    }

    if (!cartProduct || quantity === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // Create order in WooCommerce with Stripe payment info
      const orderData = {
        payment_method: "stripe",
        payment_method_title: "Stripe",
        set_paid: true, // Mark as paid since Stripe payment succeeded
        transaction_id: paymentIntentId,
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.zip,
          country: "US",
          email: formData.email,
        },
        shipping: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.zip,
          country: "US",
        },
        line_items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
        shipping_lines: [
          {
            method_id: "free_shipping",
            method_title: "Free Shipping",
            total: "0.00",
          },
        ],
        fee_lines: tax > 0
          ? [
              {
                name: "Tax",
                total: tax.toFixed(2),
              },
            ]
          : [],
        meta_data: [
          {
            key: "_stripe_payment_intent_id",
            value: paymentIntentId,
          },
        ],
      };

      const order = await wooCommerceApi.createOrder(orderData);

      toast.success("Order placed successfully!", {
        description: `Order #${order.id} has been created and paid via Stripe.`,
      });

      // Clear cart after successful order
      clearCart();

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
      });
    } catch (error: any) {
      console.error("Error creating order after payment:", error);
      
      let errorMessage = error.message || "Order creation failed after payment.";
      
      if (errorMessage.includes("write permissions") || errorMessage.includes("permission")) {
        errorMessage = "Your WooCommerce API key needs Write permissions. Go to WordPress Admin > WooCommerce > Settings > Advanced > REST API and update your API key to have Read/Write permissions.";
      } else if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        errorMessage = "Authentication failed. Please check that your WooCommerce API credentials (Consumer Key and Secret) are correct in your .env file.";
      } else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
        errorMessage = "Access forbidden. Your API key may not have the required permissions. Ensure it has Read/Write access.";
      }
      
      toast.error("Payment succeeded but order creation failed", {
        description: errorMessage + " Payment Intent ID: " + paymentIntentId,
        duration: 6000,
      });
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error("Payment failed", {
      description: error,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-10 md:py-14">
        <h1 className="mb-6 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Checkout
        </h1>

        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          {/* Left: details */}
          <div className="space-y-6">
            <Card className="border-border shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-xl text-foreground">
                  Shipping details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address">Street address</Label>
                  <Input
                    id="address"
                    placeholder="123 Wellness St."
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="San Francisco"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="CA"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="zip">ZIP code</Label>
                    <Input
                      id="zip"
                      placeholder="94107"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-xl text-foreground">
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientSecret ? (
                  <Elements
                    stripe={getStripe()}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "hsl(var(--primary))",
                          colorBackground: "hsl(var(--background))",
                          colorText: "hsl(var(--foreground))",
                          colorDanger: "hsl(var(--destructive))",
                          fontFamily: "var(--font-body)",
                          spacingUnit: "4px",
                          borderRadius: "8px",
                        },
                      },
                    }}
                  >
                    <StripePaymentForm
                      amount={total}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                ) : (
                  <div className="space-y-4 rounded-lg border border-border bg-muted/50 p-4">
                    <p className="font-body text-sm font-medium text-foreground">
                      Stripe Payment Setup Required
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      To enable Stripe payments, you need to:
                    </p>
                    <ol className="ml-4 list-decimal space-y-1 font-body text-xs text-muted-foreground">
                      <li>Add your Stripe Publishable Key to <code className="rounded bg-background px-1">.env</code>: <code className="rounded bg-background px-1">VITE_STRIPE_PUBLISHABLE_KEY=pk_...</code></li>
                      <li>Set up a backend endpoint at <code className="rounded bg-background px-1">/api/create-payment-intent</code> that creates Stripe Payment Intents</li>
                      <li>Add your Stripe Secret Key to your backend environment</li>
                    </ol>
                    <p className="mt-2 font-body text-xs text-muted-foreground">
                      See the README for detailed setup instructions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: summary & CTAs */}
          <aside className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Order Summary
            </h2>
            <div className="space-y-2 font-body text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>
                  {productName} × {quantity}
                </span>
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
              This is a design-only checkout. In a real app, you&apos;d confirm details before
              placing your order.
            </p>

            {!clientSecret && (
              <>
                <Separator className="my-2" />
                <p className="font-body text-xs text-muted-foreground">
                  Stripe payment is not configured. Use the button below to create an order without payment processing.
                </p>
              </>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;

