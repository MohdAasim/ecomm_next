'use server';
import * as addressRepo from '../repositories/userAddressRepository';
import {
  UserAddressAttributes,
  UserAddressInstance,
  UserInstance,
} from '../repositories/userAddressRepository';
import { validate } from '../middlewares/validateRequest';
import { logger } from '@/utils/logger';
import { withErrorBoundary } from '@/utils/actionWrapper';
import { HttpError } from '@/utils/error/HttpsError';

/**
 * Create a new address for a user.
 * @param {number} userId - The ID of the user.
 * @param {Object} addressData - The address details.
 * @returns {Promise<UserAddressInstance>} The created address.
 * @throws {Error} If user is not found.
 */
export const createAddress = async (
  userId: number,
  addressData: UserAddressAttributes
): Promise<UserAddressInstance> => {
  return await withErrorBoundary(async () => {
    const { valid, message } = validate('createAddress', {
      userId,
      ...addressData,
    });
    if (!valid) {
      logger.warn(`Address validation failed for user ${userId}: ${message}`);
      throw new HttpError(message as string, 400);
    }

    const user: UserInstance | null = await addressRepo.findUserById(userId);
    if (!user) {
      logger.error(`User not found: ${userId}`);
      throw new HttpError('User not found', 404);
    }

    logger.info(`Creating address for user ${userId}`);
    return await addressRepo.createAddress(userId, addressData);
  });
};

/**
 * Get all addresses for a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<UserAddressInstance[]>} List of addresses.
 */
export const getAddressesByUser = async (
  userId: number
): Promise<UserAddressInstance[]> => {
  return await withErrorBoundary(async () => {
    return await addressRepo.findAddressesByUser(userId);
  });
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
  newData: Partial<UserAddressAttributes>
): Promise<UserAddressInstance> => {
  return await withErrorBoundary(async () => {
    // Validate input
    const { valid, message } = validate('updateAddress', {
      userId,
      ...newData,
    });
    if (!valid) throw new HttpError(message as string, 400);

    const address: UserAddressInstance | null =
      await addressRepo.findAddressByIdAndUser(addressId, userId);
    if (!address) throw new HttpError('Address not found', 404);

    return await addressRepo.updateAddress(address, newData);
  });
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
  userId: number
): Promise<{ message: string }> => {
  return await withErrorBoundary(async () => {
    // Validate input
    const { valid, message } = validate('deleteAddress', { userId });
    if (!valid) throw new HttpError(message as string, 400);

    const address: UserAddressInstance | null =
      await addressRepo.findAddressByIdAndUser(addressId, userId);
    if (!address) throw new HttpError('Address not found', 404);

    await addressRepo.deleteAddress(address);
    return { message: 'Address deleted successfully' };
  });
};

export async function handleCreateAddress(formData: FormData, userId: number) {
  return await withErrorBoundary(async () => {
    // "use server";
    const street = formData.get('street') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const postalCode = formData.get('postalCode') as string;
    const country = formData.get('country') as string;
    await createAddress(userId as number, {
      street,
      city,
      state,
      postalCode,
      country,
    });
  });
}
