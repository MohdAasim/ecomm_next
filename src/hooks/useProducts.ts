import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import type { Product } from "../types/Product";

interface UseProductParams {
  page?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const useProducts = (filters: UseProductParams = {}) => {
  const [items, setItems] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts({
          ...filters,
          page: filters.page || 1,
        });
        setItems(data.products);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [filters]);

  return { items, currentPage, totalPages, loading, error };
};
