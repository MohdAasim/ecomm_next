"use client";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/Carttypes";
import React, { useState } from "react";
import { toast } from "react-toastify";

function Operation({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleAddToCart = () => {
    if (product && product.id != null) {
      addToCart({ productId: product.id, quantity, product });
      toast.success(`${product.name} added to cart!`);
    }
  };
  return (
    <>
      {" "}
      <div className="quantity-control">
        <button onClick={decrement}>-</button>
        <span>{quantity}</span>
        <button onClick={increment}>+</button>
      </div>
      <button className="add-to-cart" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </>
  );
}

export default Operation;
