import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";
import type { Product } from "../types/Product";

export const useProductById = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  return { product, loading, error };
};
