'use server';
import * as cartRepo from '../repositories/cartRepository';
import { cookies } from 'next/headers';
import { authMiddleware } from '@/server/middlewares/authMiddleware';
import type { CartItem } from '@/types/Carttypes';
import { validate } from '../middlewares/validateRequest';
import { withErrorBoundary } from '@/utils/actionWrapper';
import { HttpError } from '@/utils/error/HttpsError';

/**
 * Helper to get userId from cookies using authMiddleware.
 * Throws if not authenticated.
 */
const getUserIdFromAuth = async () => {
  const cookieStore = await cookies();

  const authResult = authMiddleware(cookieStore);

  if (authResult.status !== 200) throw new HttpError('Unauthorized', 401);
  return authResult.User!.id;
};

export const addMultipleToCart = async (
  items: Array<{ productId: number; quantity: number }>
): Promise<CartItem[]> => {
  return await withErrorBoundary(async () => {
    // Validate input
    const { valid, message } = validate('addToCart', { items });
    if (!valid) throw new HttpError(message as string, 400);

    const userId = await getUserIdFromAuth();
    const results: CartItem[] = [];
    for (const { productId, quantity } of items) {
      const [item] = await cartRepo.findOrCreateCartItem(
        userId,
        productId,
        quantity
      );
      const plain = typeof item.toJSON === 'function' ? item.toJSON() : item;
      results.push({
        id: plain.id,
        productId: plain.productId,
        quantity: plain.quantity,
        Product: plain.Product ?? plain.product,
      });
    }
    return results;
  });
};

export const getCartItems = async (): Promise<CartItem[]> => {
  return await withErrorBoundary(async () => {
    const userId = await getUserIdFromAuth();

    const items = await cartRepo.findAllCartItems(userId);
    return items.map((item) => {
      const plain = typeof item.toJSON === 'function' ? item.toJSON() : item;
      return {
        id: plain.id,
        productId: plain.productId,
        quantity: plain.quantity,
        Product: plain.Product ?? plain.product,
      };
    });
  });
};

export const updateCartItem = async (
  productId: number,
  quantity: number
): Promise<CartItem> => {
  return await withErrorBoundary(async () => {
    // Validate input
    const { valid, message } = validate('updateCartItem', { quantity });
    if (!valid) throw new HttpError(message as string, 400);

    const userId = await getUserIdFromAuth();
    const item = await cartRepo.findCartItem(userId, productId);
    if (!item) throw new HttpError('Item not found in cart', 404);
    const updated = await cartRepo.updateCartItemQuantity(item, quantity);
    const plain =
      typeof updated.toJSON === 'function' ? updated.toJSON() : updated;
    return {
      id: plain.id,
      productId: plain.productId,
      quantity: plain.quantity,
      Product: plain.Product ?? plain.product,
    };
  });
};

export const removeCartItem = async (productId: number): Promise<void> => {
  return await withErrorBoundary(async () => {
    const userId = await getUserIdFromAuth();
    const deleted = await cartRepo.deleteCartItem(userId, productId);
    if (!deleted) throw new HttpError('Item not found in cart', 404);
  });
};

export const clearCart = async (): Promise<void> => {
  return await withErrorBoundary(async () => {
    const userId = await getUserIdFromAuth();
    await cartRepo.clearCartItems(userId);
  });
};
