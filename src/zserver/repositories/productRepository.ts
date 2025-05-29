import { Product } from "../models/Product";
import { WhereOptions } from "sequelize";

// Define the Product attributes type
export interface ProductAttributes {
  id?: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for filters (where clause)
type ProductFilters = WhereOptions<ProductAttributes>;

// findAndCountProducts returns products and count
export const findAndCountProducts = async (
  filters: ProductFilters,
  limit: number,
  offset: number,
) => {
  return await Product.findAndCountAll({
    where: filters,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
};

// createProduct expects ProductAttributes (except id, createdAt, updatedAt)
export const createProduct = async (
  data: Omit<ProductAttributes, "id" | "createdAt" | "updatedAt">,
) => {
  return await Product.create(data);
};

// findProductById expects id and returns a Product instance or null
export const findProductById = async (id: number) => {
  return await Product.findByPk(id);
};
