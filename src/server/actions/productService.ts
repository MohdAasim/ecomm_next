'use server';
import * as productRepo from '../repositories/productRepository';
import { Op } from 'sequelize';
import { ALLOWED_CATEGORIES } from '@/utils/constants';
import { validate } from '../middlewares/validateRequest';
import { logger } from '@/utils/logger';
import { withErrorBoundary } from '@/utils/actionWrapper';
import { HttpError } from '@/utils/error/HttpsError';

/**
 * Get a paginated list of products with optional filters.
 * @param {Object} queryParams - Query parameters for filtering and pagination.
 * @param {string} [queryParams.search] - Search term for name/description.
 * @param {string} [queryParams.category] - Category filter.
 * @param {number} [queryParams.minPrice] - Minimum price filter.
 * @param {number} [queryParams.maxPrice] - Maximum price filter.
 * @param {number} [queryParams.rating] - Minimum rating filter.
 * @param {number} [queryParams.page] - Page number for pagination.
 * @param {number} [queryParams.limit] - Items per page.
 * @returns {Promise<Object>} Paginated products and meta info.
 */
/* eslint-disable */
export const getProducts = async (queryParams: any): Promise<any> => {
  return await withErrorBoundary(async () => {
    const page = parseInt(queryParams.page as string) || 1;
    const limit = parseInt(queryParams.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { search, category, minPrice, maxPrice, rating } = queryParams;

    // Use Record<string, any> for dynamic keys
    const where: Record<string | symbol, any> = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice !== undefined) {
      where.price = { [Op.gte]: minPrice };
    } else if (maxPrice !== undefined) {
      where.price = { [Op.lte]: maxPrice };
    }

    if (rating !== undefined) {
      where.rating = { [Op.gte]: rating };
    }

    const { count, rows } = await productRepo.findAndCountProducts(
      where,
      limit,
      offset
    );

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products: rows,
    };
  });
};

/**
 * Create a new product.
 * @param {Object} productData - The product data.
 * @param {string} productData.name - Name of the product.
 * @param {number} productData.price - Price of the product.
 * @param {string} productData.category - Category of the product.
 * @returns {Promise<Object>} The created product.
 * @throws {Error} If required fields are missing or category is invalid.
 */
export const createProduct = async (productData: any): Promise<any> => {
  return await withErrorBoundary(async () => {
    // Validate input
    const { valid, message } = validate('createProduct', productData);
    if (!valid) {
      logger.warn(`Product validation failed: ${message}`);
      throw new HttpError(message as string, 400);
    }

    const { name, price, category } = productData;

    if (!name || !price) {
      logger.warn('Product creation failed: Name and price are required.');
      throw new HttpError('Name and price are required.', 400);
    }

    if (category && !ALLOWED_CATEGORIES.includes(category.toLowerCase())) {
      logger.warn(`Invalid category: ${category}`);
      throw new HttpError(
        `Invalid category. Allowed categories are: ${ALLOWED_CATEGORIES.join(', ')}.`,
        400
      );
    }

    logger.info(`Creating product: ${name}, category: ${category}`);
    return await productRepo.createProduct(productData);
  });
};

/**
 * Get a product by its ID.
 * @param {number|string} id - The product ID.
 * @returns {Promise<Object>} The product object.
 * @throws {Error} If product is not found.
 */
export const getProductById = async (id: number | string): Promise<any> => {
  return await withErrorBoundary(async () => {
    const product = await productRepo.findProductById(Number(id));
    if (!product) {
      throw new HttpError('Product not found', 404);
    }

    return product;
  });
};
