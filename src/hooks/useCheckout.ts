import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserAddresses, saveNewAddress } from "../services/addressService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export type Address = {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export const useCheckout = () => {
  const { userId, token } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (userId && token) {
          const data = await getUserAddresses(userId, token);
          setAddresses(data);
        }
      } catch (err) {
        console.error("Error fetching addresses", err);
      }
    };
    fetchAddresses();
  }, [userId, token]);

  const handleBookOrder = async () => {
    if (!selectedAddressId) {
      const isNewAddressFilled = Object.values(newAddress).every(
        (val) => val.trim() !== "",
      );
      if (!isNewAddressFilled) {
        await Swal.fire({
          icon: "warning",
          title: "Address Required",
          text: "Please select a saved address or fill in the new address form.",
        });
        return;
      }
    }

    const address = selectedAddressId
      ? addresses.find((a) => a.id === selectedAddressId)
      : newAddress;

    if (!address) {
      await Swal.fire({
        icon: "warning",
        title: "Address Missing",
        text: "Please provide an address.",
      });
      return;
    }

    if (!selectedAddressId && saveAddress) {
      try {
        if (token && userId) {
          await saveNewAddress({ ...newAddress, userId }, token);
        }
      } catch (err) {
        console.error("Error saving address", err);
        await Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: "Failed to save address.",
        });
        return;
      }
    }

    try {
      await clearCart();
      navigate("/order-success");
    } catch (err) {
      console.error("Error clearing cart", err);
      await Swal.fire({
        icon: "info",
        title: "Partial Success",
        text: "Order placed but failed to clear cart.",
      });
    }
  };

  return {
    addresses,
    selectedAddressId,
    newAddress,
    saveAddress,
    setNewAddress,
    setSaveAddress,
    setSelectedAddressId,
    handleBookOrder,
  };
};
