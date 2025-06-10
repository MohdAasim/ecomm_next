'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import useSWR from 'swr';
import { useAuth } from './AuthContext';
import type {
  CartItem,
  AddToCartInput,
  CartContextType,
} from '../types/Carttypes';
import { Product } from '@/types/Product';

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

const LOCAL_CART_KEY = 'guest_cart';

// Helpers for localStorage guest cart
const getLocalCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const setLocalCart = (cart: CartItem[]) => {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
};

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch cart');
  const items = await res.json();
  return items.map((item: CartItemBackend): CartItem => {
    const plain = typeof item.toJSON === 'function' ? item.toJSON() : item;
    const product = plain.Product ?? plain.product;
    if (!product) throw new Error('Cart item is missing Product data');
    return {
      id: plain.id,
      productId: plain.productId,
      quantity: plain.quantity,
      Product: product,
    };
  });
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Guest cart state
  const [guestCart, setGuestCart] = useState<CartItem[]>([]);

  // Load guest cart from localStorage on mount
  useEffect(() => {
    if (!isAuthenticated) {
      setGuestCart(getLocalCart());
    }
  }, [isAuthenticated]);

  // Keep guest cart in sync with localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      setLocalCart(guestCart);
    }
  }, [guestCart, isAuthenticated]);

  // SWR for server-side cart
  const { data: cartItemsServer = [], mutate } = useSWR(
    isAuthenticated ? '/api/cart' : null,
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: true,
    }
  );

  // Cart items to expose
  const cartItems = isAuthenticated ? cartItemsServer : guestCart;

  // Add to cart
  const addToCart = async (item: AddToCartInput) => {
    if (isAuthenticated) {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ productId: item.productId, quantity: item.quantity }],
        }),
        credentials: 'include',
      });
      mutate();
    } else {
      setGuestCart((prev) => {
        const idx = prev.findIndex((ci) => ci.productId === item.productId);
        let updated: CartItem[];
        if (idx > -1) {
          updated = prev.map((ci, i) =>
            i === idx ? { ...ci, quantity: ci.quantity + item.quantity } : ci
          );
        } else {
          if (!item.Product) {
            throw new Error(
              'Product details must be provided for guest cart items'
            );
          }
          updated = [
            ...prev,
            {
              id: Date.now(),
              productId: item.productId,
              quantity: item.quantity,
              Product: item.Product, // Product is always present for guest
            },
          ];
        }
        // Save to localStorage
        setLocalCart(updated);
        return updated;
      });
    }
  };

  // Update quantity
  const updateQuantity = async (productId: number, quantity: number) => {
    if (isAuthenticated) {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
        credentials: 'include',
      });
      mutate();
    } else {
      setGuestCart((prev) => {
        const updated = prev.map((ci) =>
          ci.productId === productId ? { ...ci, quantity } : ci
        );
        setLocalCart(updated);
        return updated;
      });
    }
  };

  // Remove from cart
  const removeFromCart = async (productId: number) => {
    if (isAuthenticated) {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
        credentials: 'include',
      });
      mutate();
    } else {
      setGuestCart((prev) => {
        const updated = prev.filter((ci) => ci.productId !== productId);
        setLocalCart(updated);
        return updated;
      });
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isAuthenticated) {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        credentials: 'include',
      });
      mutate();
    } else {
      setGuestCart([]);
      setLocalCart([]);
    }
  };

  // Sync local cart to backend after signin
  const syncCartToBackend = async () => {
    if (isAuthenticated && guestCart.length > 0) {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: guestCart.map(({ productId, quantity }) => ({
            productId,
            quantity,
          })),
        }),
        credentials: 'include',
      });
      setGuestCart([]);
      setLocalCart([]);
      mutate();
    }
  };

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
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
