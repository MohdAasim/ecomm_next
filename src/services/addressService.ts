import axiosClient from "../utils/axiosclient";
import type { Address } from "../hooks/useCheckout";

export const getUserAddresses = async (userId: number, token: string) => {
  const response = await axiosClient.get<Address[]>(`/addresses/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data || [];
};

export const saveNewAddress = async (
  addressData: Omit<Address, "id"> & { userId: number },
  token: string,
) => {
  return axiosClient.post("/addresses", addressData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
