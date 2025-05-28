import axiosClient from "../utils/axiosclient";
import type { Product } from "../types/Product";

interface FetchProductParams {
  page?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface ProductResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const fetchProducts = async (
  params: FetchProductParams = {},
): Promise<ProductResponse> => {
  const response = await axiosClient.get<ProductResponse>("/products", {
    params,
  });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosClient.get<{ product: Product }>(
    `/products/${id}`,
  );
  return response.data.product;
};
