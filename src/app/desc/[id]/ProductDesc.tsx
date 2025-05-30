"use client";
import React, { useState } from "react";
import ErrorMessage from "@/components/shared/errorMessage/ErrorMessage";
import { useCart } from "@/context/CartContext";
import "./ProductDesc.css";
import { toast } from "react-toastify";
import Image from "next/image";
import { Product } from "@/types/Product";

interface ProductDescClientProps {
  product: Product;
}

const ProductDescClient: React.FC<ProductDescClientProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return <ErrorMessage message="Failed to load product" />;
  }

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleAddToCart = () => {
    if (product && product.id != null) {
      addToCart({ productId: product.id, quantity, product });
      toast.success(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="product-container">
      <div className="product-card">
        <Image
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          className="product-image"
          width={300}
          height={300}
          priority
        />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>
            <strong>Price:</strong> ₹{product.price}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>{product.description}</p>
          <div className="quantity-control">
            <button onClick={decrement}>-</button>
            <span>{quantity}</span>
            <button onClick={increment}>+</button>
          </div>
          <button className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDescClient;
