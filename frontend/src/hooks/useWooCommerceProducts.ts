import { useQuery } from "@tanstack/react-query";
import { wooCommerceApi, WooCommerceProduct } from "@/lib/woocommerce";

/**
 * Hook to fetch all products from WooCommerce
 */
export const useWooCommerceProducts = (params?: {
  per_page?: number;
  page?: number;
  status?: string;
  featured?: boolean;
  category?: string;
  search?: string;
}) => {
  return useQuery<WooCommerceProduct[]>({
    queryKey: ["woocommerce-products", params],
    queryFn: () => wooCommerceApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch a single product by ID
 */
export const useWooCommerceProduct = (id: number) => {
  return useQuery<WooCommerceProduct>({
    queryKey: ["woocommerce-product", id],
    queryFn: () => wooCommerceApi.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch a product by slug
 */
export const useWooCommerceProductBySlug = (slug: string) => {
  return useQuery<WooCommerceProduct | null>({
    queryKey: ["woocommerce-product-slug", slug],
    queryFn: () => wooCommerceApi.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
