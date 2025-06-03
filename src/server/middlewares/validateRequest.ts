import Joi, { Schema } from "joi";
import { logger } from "@/utils/logger"; // Add this import

// Define schemas for each route/action
const schemas: Record<string, Schema> = {
  // Product
  createProduct: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    price: Joi.number().positive().required(),
    description: Joi.string().max(500).optional(),
    category: Joi.string().required(),
    image_url: Joi.string().uri().optional(),
  }),

  // User Address
  createAddress: Joi.object({
    userId: Joi.number().integer().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }),
  updateAddress: Joi.object({
    userId: Joi.number().integer().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }),
  deleteAddress: Joi.object({
    userId: Joi.number().integer().required(),
  }),

  // Cart
  addToCart: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().integer().required(),
          quantity: Joi.number().integer().min(1).required(),
        }),
      )
      .min(1)
      .required(),
  }),
  updateCartItem: Joi.object({
    quantity: Joi.number().integer().min(1).required(),
  }),

  // Auth
  sendOTP: Joi.object({
    email: Joi.string().email().required(),
  }),
  verifyOTP: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
  }),
};

// Normal validation function
/* eslint-disable */
export function validate(
  schemaName: string,
  data: any,
): { valid: boolean; value?: any; message?: string } {
  const schema = schemas[schemaName];
  if (!schema) {
    logger.warn(`No validation schema found for: ${schemaName}`);
    return { valid: true, value: data };
  }

  const { error } = schema.validate(data);
  if (error) {
    logger.warn(
      `Validation failed for ${schemaName}: ${error.details[0].message}`,
      { data },
    );
    return { valid: false, message: error.details[0].message };
  }
  logger.info(`Validation succeeded for ${schemaName}`, { data });
  return { valid: true };
}
