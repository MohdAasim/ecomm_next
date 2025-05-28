"use client";
import React, { useState } from "react";
import "./AddressForm.css";

type AddressFormData = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

interface AddressFormProps {
  address: AddressFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onChange }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!address.street.trim()) newErrors.street = "Street is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!address.postalCode.trim()) {
      newErrors.postalCode = "Postal Code is required";
    } else if (!/^\d+$/.test(address.postalCode)) {
      newErrors.postalCode = "Postal Code must be numeric";
    }
    if (!address.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = () => {
    validate();
  };

  return (
    <div className="address-form">
      <input
        placeholder="Street"
        name="street"
        value={address.street}
        onChange={onChange}
        onBlur={handleBlur}
      />
      {errors.street && <span className="error">{errors.street}</span>}
      <input
        placeholder="City"
        name="city"
        value={address.city}
        onChange={onChange}
        onBlur={handleBlur}
      />
      {errors.city && <span className="error">{errors.city}</span>}
      <input
        placeholder="State"
        name="state"
        value={address.state}
        onChange={onChange}
        onBlur={handleBlur}
      />
      {errors.state && <span className="error">{errors.state}</span>}
      <input
        placeholder="Postal Code"
        name="postalCode"
        value={address.postalCode}
        onChange={onChange}
        onBlur={handleBlur}
        inputMode="numeric"
      />
      {errors.postalCode && <span className="error">{errors.postalCode}</span>}
      <input
        placeholder="Country"
        name="country"
        value={address.country}
        onChange={onChange}
        onBlur={handleBlur}
      />
      {errors.country && <span className="error">{errors.country}</span>}
    </div>
  );
};

export default AddressForm;
