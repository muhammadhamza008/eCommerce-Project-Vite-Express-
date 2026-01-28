import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { WooCommerceProduct } from "@/lib/woocommerce";

type CartItem = {
  productId: number;
  quantity: number;
  product: WooCommerceProduct | null;
};

type CartState = {
  items: CartItem[];
  // Legacy support - uses first item or defaults
  quantity: number;
  unitPrice: number;
  selectedProduct: WooCommerceProduct | null;
};

type CartContextValue = CartState & {
  setQuantity: (qty: number) => void;
  setSelectedProduct: (product: WooCommerceProduct | null) => void;
  addToCart: (product: WooCommerceProduct, quantity: number) => void;
  updateCartItem: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const DEFAULT_UNIT_PRICE = 59.99;
const CART_STORAGE_KEY = "woocommerce_cart";
const SELECTED_PRODUCT_STORAGE_KEY = "woocommerce_selected_product";

// Helper functions for localStorage
const saveCartToStorage = (items: CartItem[]) => {
  try {
    // Store minimal cart data (productId, quantity, and essential product info)
    const cartData = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      product: item.product
        ? {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            regular_price: item.product.regular_price,
            sale_price: item.product.sale_price,
            on_sale: item.product.on_sale,
            images: item.product.images,
            short_description: item.product.short_description,
          }
        : null,
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const cartData = JSON.parse(stored);
      return cartData.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        product: item.product as WooCommerceProduct | null,
      }));
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }
  return [];
};

const saveSelectedProductToStorage = (product: WooCommerceProduct | null) => {
  try {
    if (product) {
      // Store essential product info
      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        on_sale: product.on_sale,
        images: product.images,
        short_description: product.short_description,
        description: product.description,
        categories: product.categories,
        average_rating: product.average_rating,
        rating_count: product.rating_count,
      };
      localStorage.setItem(SELECTED_PRODUCT_STORAGE_KEY, JSON.stringify(productData));
    } else {
      localStorage.removeItem(SELECTED_PRODUCT_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Error saving selected product to localStorage:", error);
  }
};

const loadSelectedProductFromStorage = (): WooCommerceProduct | null => {
  try {
    const stored = localStorage.getItem(SELECTED_PRODUCT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as WooCommerceProduct;
    }
  } catch (error) {
    console.error("Error loading selected product from localStorage:", error);
  }
  return null;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Load initial state from localStorage
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());
  const [selectedProduct, setSelectedProduct] = useState<WooCommerceProduct | null>(() =>
    loadSelectedProductFromStorage()
  );

  // Save to localStorage whenever cart changes
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  useEffect(() => {
    saveSelectedProductToStorage(selectedProduct);
  }, [selectedProduct]);

  // Legacy quantity - uses first item or 0
  const quantity = items.length > 0 ? items[0].quantity : 0;
  
  // Legacy unitPrice - uses selected product price or first item price or default
  const unitPrice = selectedProduct
    ? parseFloat(selectedProduct.price || selectedProduct.regular_price || "0")
    : items.length > 0 && items[0].product
    ? parseFloat(items[0].product.price || items[0].product.regular_price || "0")
    : DEFAULT_UNIT_PRICE;

  const addToCart = (product: WooCommerceProduct, qty: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity: qty, product }];
    });
    setSelectedProduct(product);
  };

  const updateCartItem = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  const clearCart = () => {
    setItems([]);
    setSelectedProduct(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(SELECTED_PRODUCT_STORAGE_KEY);
  };

  // Legacy setQuantity - updates first item or adds new item with selected product
  const setQuantity = (qty: number) => {
    if (qty <= 0) {
      clearCart();
      return;
    }
    
    if (selectedProduct) {
      addToCart(selectedProduct, qty);
    } else if (items.length > 0) {
      updateCartItem(items[0].productId, qty);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        quantity,
        unitPrice,
        selectedProduct,
        setQuantity,
        setSelectedProduct,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};

