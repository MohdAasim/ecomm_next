"use server";
import * as cartRepo from "../repositories/cartRepository";
import { cookies } from "next/headers";
import { authMiddleware } from "@/server/middlewares/authMiddleware";
import type { CartItem } from "@/types/Carttypes";
import { validate } from "../middlewares/validateRequest";

/**
 * Helper to get userId from cookies using authMiddleware.
 * Throws if not authenticated.
 */
const getUserIdFromAuth = async () => {
  const cookieStore = await cookies();

  const authResult = authMiddleware(cookieStore);

  if (authResult.status !== 200) throw new Error("Unauthorized");
  return authResult.User!.id;
};

export const addMultipleToCart = async (
  items: Array<{ productId: number; quantity: number }>,
): Promise<CartItem[]> => {
  // Validate input
  const { valid, message } = validate("addToCart", { items });
  if (!valid) throw new Error(message);

  const userId = await getUserIdFromAuth();
  const results: CartItem[] = [];
  for (const { productId, quantity } of items) {
    const [item] = await cartRepo.findOrCreateCartItem(
      userId,
      productId,
      quantity,
    );
    const plain = typeof item.toJSON === "function" ? item.toJSON() : item;
    results.push({
      id: plain.id,
      productId: plain.productId,
      quantity: plain.quantity,
      Product: plain.Product ?? plain.product,
    });
  }
  return results;
};

export const getCartItems = async (): Promise<CartItem[]> => {
  const userId = await getUserIdFromAuth();

  const items = await cartRepo.findAllCartItems(userId);
  return items.map((item) => {
    const plain = typeof item.toJSON === "function" ? item.toJSON() : item;
    return {
      id: plain.id,
      productId: plain.productId,
      quantity: plain.quantity,
      Product: plain.Product ?? plain.product,
    };
  });
};

export const updateCartItem = async (
  productId: number,
  quantity: number,
): Promise<CartItem> => {
  // Validate input
  const { valid, message } = validate("updateCartItem", { quantity });
  if (!valid) throw new Error(message);

  const userId = await getUserIdFromAuth();
  const item = await cartRepo.findCartItem(userId, productId);
  if (!item) throw new Error("Item not found in cart");
  const updated = await cartRepo.updateCartItemQuantity(item, quantity);
  const plain =
    typeof updated.toJSON === "function" ? updated.toJSON() : updated;
  return {
    id: plain.id,
    productId: plain.productId,
    quantity: plain.quantity,
    Product: plain.Product ?? plain.product,
  };
};

export const removeCartItem = async (productId: number): Promise<void> => {
  const userId = await getUserIdFromAuth();
  const deleted = await cartRepo.deleteCartItem(userId, productId);
  if (!deleted) throw new Error("Item not found in cart");
};

export const clearCart = async (): Promise<void> => {
  const userId = await getUserIdFromAuth();
  await cartRepo.clearCartItems(userId);
};
