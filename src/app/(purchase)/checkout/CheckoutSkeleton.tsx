import React from 'react';
import './CheckoutPage.css';
import './CheckoutSkeleton.css';

const CheckoutSkeleton: React.FC = () => {
  return (
    <main className="checkout-container">
      {/* Header Skeleton */}
      <div className="skeleton skeleton-title checkout-title"></div>

      {/* Saved Addresses Section Skeleton */}
      <section className="address-section">
        <div className="skeleton skeleton-section-title section-title"></div>
        <div className="address-list">
          {/* Multiple address options skeleton */}
          {[1, 2].map((index) => (
            <div key={index} className="address-item skeleton-address-item">
              <div className="skeleton skeleton-radio"></div>
              <div className="skeleton skeleton-address-text"></div>
            </div>
          ))}
        </div>
      </section>

      {/* New Address Section Skeleton */}
      <section className="new-address-section">
        <div className="skeleton skeleton-section-title section-title"></div>

        {/* Address Form Skeleton */}
        <div className="address-form-skeleton">
          <div className="form-row">
            <div className="skeleton skeleton-input"></div>
            <div className="skeleton skeleton-input"></div>
          </div>
          <div className="form-row">
            <div className="skeleton skeleton-input"></div>
            <div className="skeleton skeleton-input"></div>
          </div>
          <div className="form-row">
            <div className="skeleton skeleton-input"></div>
            <div className="skeleton skeleton-input"></div>
          </div>
        </div>

        {/* Save Address Checkbox Skeleton */}
        <div className="checkbox-label skeleton-checkbox-container">
          <div className="skeleton skeleton-checkbox"></div>
          <div className="skeleton skeleton-checkbox-text"></div>
        </div>
      </section>

      {/* Total Amount Skeleton */}
      <div className="total-amount skeleton-total-container">
        <div className="skeleton skeleton-total-text"></div>
        <div className="skeleton skeleton-price"></div>
      </div>

      {/* Checkout Button Skeleton */}
      <div className="skeleton skeleton-button checkout-button"></div>
    </main>
  );
};

export default CheckoutSkeleton;
