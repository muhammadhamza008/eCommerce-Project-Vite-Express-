// WooCommerce REST API configuration and types

// Use proxy in development to avoid CORS issues, direct URL in production
const isDevelopment = import.meta.env.DEV;
const WOOCOMMERCE_BASE_URL_ORIGINAL = import.meta.env.VITE_WOOCOMMERCE_BASE_URL || "https://precisionpeptidelab.co.uk";
export const WOOCOMMERCE_BASE_URL = isDevelopment 
  ? "/api/woocommerce" 
  : WOOCOMMERCE_BASE_URL_ORIGINAL;
export const WOOCOMMERCE_CONSUMER_KEY = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY || "";
export const WOOCOMMERCE_CONSUMER_SECRET = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || "";

// WooCommerce Product Types
export interface WooCommerceImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: WooCommerceImage[];
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  default_attributes: Array<{
    id: number;
    name: string;
    option: string;
  }>;
  variations: number[];
  stock_status: string;
  stock_quantity: number | null;
  manage_stock: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  meta_data: Array<{
    id: number;
    key: string;
    value: string;
  }>;
}

// Build authentication header for WooCommerce API
const getAuthHeader = (): string => {
  if (WOOCOMMERCE_CONSUMER_KEY && WOOCOMMERCE_CONSUMER_SECRET) {
    const credentials = `${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`;
    return `Basic ${btoa(credentials)}`;
  }
  return "";
};

// WooCommerce API Functions
export const wooCommerceApi = {
  /**
   * Fetch all products from WooCommerce
   */
  async getProducts(params?: {
    per_page?: number;
    page?: number;
    status?: string;
    featured?: boolean;
    category?: string;
    search?: string;
  }): Promise<WooCommerceProduct[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.featured !== undefined) queryParams.append("featured", params.featured.toString());
    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);

    const url = `${WOOCOMMERCE_BASE_URL}/wp-json/wc/v3/products?${queryParams.toString()}`;
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Only add auth header in production (proxy handles it in development)
    let authHeader: string | undefined;
    if (!isDevelopment) {
      authHeader = getAuthHeader();
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        // If we get 401, try without auth (public endpoint fallback)
        if (response.status === 401) {
          console.warn("Authenticated request failed, trying public endpoint...");
          const publicUrl = `${WOOCOMMERCE_BASE_URL_ORIGINAL}/wp-json/wc/v3/products?${queryParams.toString()}`;
          const publicResponse = await fetch(publicUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          
          if (!publicResponse.ok) {
            throw new Error(`WooCommerce API error: ${publicResponse.status} ${publicResponse.statusText}. Please check your API credentials.`);
          }
          
          return await publicResponse.json();
        }
        
        const errorText = await response.text().catch(() => "");
        throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching WooCommerce products:", error);
      throw error;
    }
  },

  /**
   * Fetch a single product by ID
   */
  async getProduct(id: number): Promise<WooCommerceProduct> {
    const url = `${WOOCOMMERCE_BASE_URL}/wp-json/wc/v3/products/${id}`;
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Only add auth header in production (proxy handles it in development)
    let authHeader: string | undefined;
    if (!isDevelopment) {
      authHeader = getAuthHeader();
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        // If authenticated request fails, try without auth (public endpoint)
        if (authHeader && response.status === 401) {
          const publicResponse = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          
          if (!publicResponse.ok) {
            throw new Error(`WooCommerce API error: ${publicResponse.status} ${publicResponse.statusText}`);
          }
          
          return await publicResponse.json();
        }
        
        throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching WooCommerce product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetch a product by slug
   */
  async getProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
    try {
      const products = await this.getProducts({ per_page: 100, status: "publish" });
      return products.find((p) => p.slug === slug) || null;
    } catch (error) {
      console.error(`Error fetching WooCommerce product by slug ${slug}:`, error);
      return null;
    }
  },

  /**
   * Create an order in WooCommerce
   */
  async createOrder(orderData: {
    payment_method: string;
    payment_method_title: string;
    set_paid?: boolean;
    billing: {
      first_name: string;
      last_name: string;
      address_1: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
      email: string;
    };
    shipping: {
      first_name: string;
      last_name: string;
      address_1: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
    line_items: Array<{
      product_id: number;
      quantity: number;
    }>;
    shipping_lines?: Array<{
      method_id: string;
      method_title: string;
      total: string;
    }>;
    fee_lines?: Array<{
      name: string;
      total: string;
    }>;
  }): Promise<any> {
    const url = `${WOOCOMMERCE_BASE_URL}/wp-json/wc/v3/orders`;
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // In production, add auth header directly (proxy handles it in development)
    if (!isDevelopment) {
      const authHeader = getAuthHeader();
      if (authHeader) {
        headers["Authorization"] = authHeader;
      } else {
        throw new Error("WooCommerce API credentials are required to create orders");
      }
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.code || `WooCommerce API error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating WooCommerce order:", error);
      throw error;
    }
  },
};
