"use client";
import React, { useState } from "react";
import AddressForm from "../../../components/shared/addressForm/AddressForm";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import "./CheckoutPage.css";
import { handleCreateAddress } from "@/server/actions/userAddressService";
import { Address } from "@/types/Address";

interface CheckoutClientProps {
  addresses: Address[];
  totalPrice: string;
  // onCreateAddress: (formData: FormData) => Promise<void>;
  userId: number;
}

const CheckoutClient: React.FC<CheckoutClientProps> = ({
  addresses,
  totalPrice,
  // onCreateAddress,
  userId,
}) => {
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

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      {addresses.length > 0 && (
        <div className="address-section">
          <h3 className="section-title">Select Saved Address:</h3>
          <div className="address-list">
            {addresses.map((addr) => (
              <label key={addr.id} className="address-item">
                <input
                  type="radio"
                  name="selectedAddress"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  className="radio-input"
                />
                {addr.street}, {addr.city}, {addr.state}, {addr.postalCode},{" "}
                {addr.country}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="new-address-section">
        <h3 className="section-title">Enter New Address:</h3>
        <AddressForm
          address={newAddress}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewAddress((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={saveAddress}
            onChange={(e) => setSaveAddress(e.target.checked)}
            className="checkbox-input"
          />
          Save this address for future delivery
        </label>
      </div>

      <div className="total-amount">
        Total: <span className="price">₹{totalPrice}</span>
      </div>

      <button className="checkout-button" onClick={handleBookOrder}>
        Proceed to Book (COD)
      </button>
    </div>
  );
};

export default CheckoutClient;
