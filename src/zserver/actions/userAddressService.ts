"use server";
import * as addressRepo from "../repositories/userAddressRepository";
import {
  UserAddressAttributes,
  UserAddressInstance,
  UserInstance,
} from "../repositories/userAddressRepository";

/**
 * Create a new address for a user.
 * @param {number} userId - The ID of the user.
 * @param {Object} addressData - The address details.
 * @returns {Promise<UserAddressInstance>} The created address.
 * @throws {Error} If user is not found.
 */
export const createAddress = async (
  userId: number,
  addressData: Omit<
    UserAddressAttributes,
    "id" | "userId" | "createdAt" | "updatedAt"
  >,
): Promise<UserAddressInstance> => {
  const user: UserInstance | null = await addressRepo.findUserById(userId);
  if (!user) throw new Error("User not found");

  return await addressRepo.createAddress(userId, addressData);
};

/**
 * Get all addresses for a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<UserAddressInstance[]>} List of addresses.
 */
export const getAddressesByUser = async (
  userId: number,
): Promise<UserAddressInstance[]> => {
  return await addressRepo.findAddressesByUser(userId);
};

/**
 * Update an address for a user.
 * @param {number} addressId - The ID of the address.
 * @param {number} userId - The ID of the user.
 * @param {Object} newData - The new address data.
 * @returns {Promise<UserAddressInstance>} The updated address.
 * @throws {Error} If address is not found.
 */
export const updateAddress = async (
  addressId: number,
  userId: number,
  newData: Partial<UserAddressAttributes>,
): Promise<UserAddressInstance> => {
  const address: UserAddressInstance | null =
    await addressRepo.findAddressByIdAndUser(addressId, userId);
  if (!address) throw new Error("Address not found");

  return await addressRepo.updateAddress(address, newData);
};

/**
 * Delete an address for a user.
 * @param {number} addressId - The ID of the address.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<{ message: string }>} Success message.
 * @throws {Error} If address is not found.
 */
export const deleteAddress = async (
  addressId: number,
  userId: number,
): Promise<{ message: string }> => {
  const address: UserAddressInstance | null =
    await addressRepo.findAddressByIdAndUser(addressId, userId);
  if (!address) throw new Error("Address not found");

  await addressRepo.deleteAddress(address);
  return { message: "Address deleted successfully" };
};
export async function handleCreateAddress(formData: FormData, userId: number) {
  // "use server";
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const postalCode = formData.get("postalCode") as string;
  const country = formData.get("country") as string;
  await createAddress(userId as number, {
    street,
    city,
    state,
    postalCode,
    country,
  });
}
