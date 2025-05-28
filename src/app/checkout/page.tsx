import React from "react";
import { useCheckout } from "../../hooks/useCheckout";
import AddressForm from "../../components/shared/addressForm/AddressForm";
import "./CheckoutPage.css";
import { useSearchParams } from "next/navigation";

const CheckoutPage: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  const searchParams = useSearchParams();
  const totalPrice = searchParams.get("totalPrice") || "0";

  const {
    addresses,
    selectedAddressId,
    newAddress,
    saveAddress,
    setNewAddress,
    setSaveAddress,
    setSelectedAddressId,
    handleBookOrder,
  } = useCheckout();

  return (
    <div className="checkout-container" {...props}>
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

export default CheckoutPage;
