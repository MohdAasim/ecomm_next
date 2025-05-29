import * as cartRepo from "../repositories/cartRepository";
import { CartItemInstance } from "../repositories/cartRepository";

/**
 * Add multiple items to the user's cart.
 * @param {number} userId - The ID of the user.
 * @param {Array<{productId: number, quantity: number}>} items - Items to add.
 * @returns {Promise<CartItemInstance[]>} The updated cart items.
 */
export const addMultipleToCart = async (
  userId: number,
  items: Array<{ productId: number; quantity: number }>,
): Promise<CartItemInstance[]> => {
  const results: CartItemInstance[] = [];
  for (const { productId, quantity } of items) {
    const [item, created] = await cartRepo.findOrCreateCartItem(
      userId,
      productId,
      quantity,
    );

    if (!created) {
      const updatedItem = await cartRepo.incrementCartItemQuantity(
        item,
        quantity,
      );
      results.push(updatedItem);
    } else {
      results.push(item);
    }
  }

  return results;
};

/**
 * Get all items in the user's cart.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<CartItemInstance[]>} The cart items.
 */
export const getCartItems = async (
  userId: number,
): Promise<CartItemInstance[]> => {
  return await cartRepo.findAllCartItems(userId);
};

/**
 * Update the quantity of a cart item.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 * @param {number} quantity - The new quantity.
 * @returns {Promise<CartItemInstance>} The updated cart item.
 * @throws {Error} If item is not found in cart.
 */
export const updateCartItem = async (
  userId: number,
  productId: number,
  quantity: number,
): Promise<CartItemInstance> => {
  const item = await cartRepo.findCartItem(userId, productId);
  if (!item) throw new Error("Item not found in cart");

  return await cartRepo.updateCartItemQuantity(item, quantity);
};

/**
 * Remove an item from the user's cart.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 * @returns {Promise<void>}
 * @throws {Error} If item is not found in cart.
 */
export const removeCartItem = async (
  userId: number,
  productId: number,
): Promise<void> => {
  const deleted = await cartRepo.deleteCartItem(userId, productId);
  if (!deleted) throw new Error("Item not found in cart");
};

/**
 * Clear all items from the user's cart.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<void>}
 */
export const clearCart = async (userId: number): Promise<void> => {
  await cartRepo.clearCartItems(userId);
};
