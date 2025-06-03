"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import type {
  CartItem,
  AddToCartInput,
  CartContextType,
} from "../types/Carttypes";
import { Product } from "@/types/Product";

type CartItemBackend = {
  id?: number;
  productId: number;
  quantity: number;
  Product?: Product;
  product?: Product;
  toJSON?: () => {
    id?: number;
    productId: number;
    quantity: number;
    Product?: Product;
    product?: Product;
  };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: React.ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth();

  // Fetch cart from backend if authenticated
  const fetchCartFromBackend = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch("/api/cart", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const items = await res.json();
      setCartItems(
        items.map((item: CartItemBackend): CartItem => {
          const plain =
            typeof item.toJSON === "function" ? item.toJSON() : item;
          const product = plain.Product ?? plain.product;
          if (!product) {
            throw new Error("Cart item is missing Product data");
          }
          return {
            id: plain.id,
            productId: plain.productId,
            quantity: plain.quantity,
            Product: product,
          };
        }),
      );
    } catch {
      setCartItems([]); // fallback to empty if error
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchCartFromBackend();
  }, [isAuthenticated, fetchCartFromBackend]);

  // Add to cart
  const addToCart = async (item: AddToCartInput) => {
    if (isAuthenticated) {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: item.productId, quantity: item.quantity }],
        }),
      });
      fetchCartFromBackend();
    } else {
      // Local state for guest users
      const normalizedItem: CartItem = {
        productId: item.productId,
        quantity: item.quantity,
        Product: item.Product || item.product!,
      };
      setCartItems((prev) => {
        const exists = prev.find(
          (i) => i.productId === normalizedItem.productId,
        );
        if (exists) {
          return prev.map((i) =>
            i.productId === normalizedItem.productId
              ? { ...i, quantity: i.quantity + normalizedItem.quantity }
              : i,
          );
        } else {
          return [...prev, normalizedItem];
        }
      });
    }
  };

  // Update quantity
  const updateQuantity = async (productId: number, quantity: number) => {
    if (isAuthenticated) {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      fetchCartFromBackend();
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
    }
  };

  // Remove from cart
  const removeFromCart = async (productId: number) => {
    if (isAuthenticated) {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      fetchCartFromBackend();
    } else {
      setCartItems((prev) => prev.filter((i) => i.productId !== productId));
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isAuthenticated) {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      fetchCartFromBackend();
    } else {
      setCartItems([]);
    }
  };

  // Sync local cart to backend after signin
  const syncCartToBackend = useCallback(async () => {
    console.log(
      "syncCartToBackend called",
      isAuthenticated,
      cartItems,
      "---------------",
    );
    if (!isAuthenticated || cartItems.length === 0) return;

    try {
      // 1. Fetch backend cart items
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      const backendItems: CartItemBackend[] = await res.json();
      console.log("After getCartItems", backendItems);

      const backendProductIds = new Set(
        backendItems.map((item) => item.productId),
      );

      // 2. Find items in local cart not present in backend cart
      const itemsToAdd = cartItems.filter(
        (item) => !backendProductIds.has(item.productId),
      );
      console.log(
        "itemsToAdd--------------------------------------------",
        itemsToAdd,
      );

      // 3. Add only new items to backend
      if (itemsToAdd.length > 0) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: itemsToAdd.map(({ productId, quantity }) => ({
              productId,
              quantity,
            })),
          }),
        });
      }

      // 4. Fetch updated cart from backend
      fetchCartFromBackend();
    } catch (err) {
      console.error("Error in syncCartToBackend:", err);
    }
  }, [isAuthenticated, cartItems, fetchCartFromBackend]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCartItems([]); // Clear local cart on logout
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        syncCartToBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
