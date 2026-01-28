import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWooCommerceProducts } from "@/hooks/useWooCommerceProducts";
import { Link } from "react-router-dom";
import { Loader2, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const Products = () => {
  const { data: products, isLoading, error } = useWooCommerceProducts({
    per_page: 20,
    status: "publish",
  });
  const { setSelectedProduct } = useCart();

  const handleProductClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-10 md:py-14">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-10 md:py-14">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-body text-muted-foreground">
              Unable to load products. Please check your WooCommerce API configuration.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-10 md:py-14">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-body text-muted-foreground">No products found.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-10 md:py-14">
        <h1 className="mb-6 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          All Products
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const price = parseFloat(product.price || product.regular_price || "0");
            const regularPrice = parseFloat(product.regular_price || "0");
            const onSale = product.on_sale && product.sale_price;
            const salePrice = onSale ? parseFloat(product.sale_price || "0") : null;
            const mainImage = product.images?.[0]?.src || "";
            const rating = parseFloat(product.average_rating || "0");

            return (
              <Card
                key={product.id}
                className="group overflow-hidden border-border transition-all hover:shadow-medium"
              >
                <Link
                  to="/"
                  onClick={() => handleProductClick(product)}
                  className="block"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                    {onSale && (
                      <div className="absolute right-2 top-2 rounded-full bg-accent-green px-2 py-1 text-xs font-semibold text-white">
                        Sale
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 font-display text-lg font-semibold text-foreground line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="mb-2 flex items-center gap-2">
                      {rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-gold text-gold" />
                          <span className="font-body text-xs text-muted-foreground">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      {product.categories?.[0] && (
                        <span className="font-body text-xs text-muted-foreground">
                          {product.categories[0].name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      {onSale && salePrice ? (
                        <>
                          <span className="font-display text-lg font-bold text-foreground">
                            ${salePrice.toFixed(2)}
                          </span>
                          <span className="font-body text-sm text-muted-foreground line-through">
                            ${regularPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="font-display text-lg font-bold text-foreground">
                          ${price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Button className="mt-3 w-full" variant="outline">
                      View Product
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
