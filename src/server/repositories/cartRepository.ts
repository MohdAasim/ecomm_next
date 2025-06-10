import { CartItem } from '../models/Cart';
import { Product } from '../models/Product';
import { Model } from 'sequelize';

// Export the CartItemInstance type
export type CartItemInstance = Model & {
  id?: number;
  userId: number;
  productId: number;
  quantity: number;
  save: () => Promise<CartItemInstance>;
};

export const findOrCreateCartItem = async (
  userId: number,
  productId: number,
  quantity: number
): Promise<[CartItemInstance, boolean]> => {
  return (await CartItem.findOrCreate({
    where: { userId, productId },
    defaults: { quantity },
  })) as [CartItemInstance, boolean];
};

export const findCartItem = async (
  userId: number,
  productId: number
): Promise<CartItemInstance | null> => {
  return (await CartItem.findOne({
    where: { userId, productId },
  })) as CartItemInstance | null;
};

export const findAllCartItems = async (
  userId: number
): Promise<CartItemInstance[]> => {
  return (await CartItem.findAll({
    where: { userId },
    include: [{ model: Product }],
  })) as CartItemInstance[];
};

export const updateCartItemQuantity = async (
  item: CartItemInstance,
  quantity: number
): Promise<CartItemInstance> => {
  item.quantity = quantity;
  return await item.save();
};

export const incrementCartItemQuantity = async (
  item: CartItemInstance,
  quantity: number
): Promise<CartItemInstance> => {
  item.quantity += quantity;
  return await item.save();
};

export const deleteCartItem = async (
  userId: number,
  productId: number
): Promise<number> => {
  return await CartItem.destroy({ where: { userId, productId } });
};

export const clearCartItems = async (userId: number): Promise<number> => {
  return await CartItem.destroy({ where: { userId } });
};
