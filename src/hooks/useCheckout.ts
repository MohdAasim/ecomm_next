import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { handleCreateAddress } from "@/server/actions/userAddressService";
import { Address } from "@/types/Address";

export const useCheckout = (userId: number) => {
  const router = useRouter();
  const { clearCart } = useCart();

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

    if (!selectedAddressId && saveAddress) {
      try {
        const formData = new FormData();
        Object.entries(newAddress).forEach(([key, value]) => {
          formData.append(key, value);
        });
        await handleCreateAddress(formData, userId);
        await Swal.fire({
          icon: "success",
          title: "Address Saved",
          text: "New address saved successfully.",
        });
      } catch {
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
      router.push("/order-success");
    } catch {
      await Swal.fire({
        icon: "info",
        title: "Partial Success",
        text: "Order placed but failed to clear cart.",
      });
    }
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return {
    selectedAddressId,
    setSelectedAddressId,
    newAddress,
    saveAddress,
    setSaveAddress,
    handleBookOrder,
    handleNewAddressChange,
  };
};
