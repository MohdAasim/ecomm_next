import { User, UserAddress } from "../models/associations";
import { Model } from "sequelize";

// Define the UserAddress attributes type
export interface UserAddressAttributes {
  id?: number;
  userId?: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for a UserAddress instance
export type UserAddressInstance = Model<UserAddressAttributes> &
  UserAddressAttributes;

// Type for a User instance (you can expand as needed)
export type UserInstance = Model & { id: number };

// Find user by ID
export const findUserById = async (
  userId: number,
): Promise<UserInstance | null> => {
  return (await User.findByPk(userId)) as UserInstance | null;
};

// Create a new address for a user
export const createAddress = async (
  userId: number,
  addressData: Omit<
    UserAddressAttributes,
    "id" | "userId" | "createdAt" | "updatedAt"
  >,
): Promise<UserAddressInstance> => {
  return (await UserAddress.create({
    userId,
    ...addressData,
  })) as UserAddressInstance;
};

// Find all addresses for a user
export const findAddressesByUser = async (
  userId: number,
): Promise<UserAddressInstance[]> => {
  return (await UserAddress.findAll({
    where: { userId },
  })) as UserAddressInstance[];
};

// Find a specific address by addressId and userId
export const findAddressByIdAndUser = async (
  addressId: number,
  userId: number,
): Promise<UserAddressInstance | null> => {
  return (await UserAddress.findOne({
    where: { id: addressId, userId },
  })) as UserAddressInstance | null;
};

// Update an address
export const updateAddress = async (
  address: UserAddressInstance,
  newData: Partial<UserAddressAttributes>,
): Promise<UserAddressInstance> => {
  return await address.update(newData);
};

// Delete an address
export const deleteAddress = async (
  address: UserAddressInstance,
): Promise<void> => {
  await address.destroy();
};
