export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id?: number;
  quantity: number;
  productId: number;
  Product: Product;
}

export type AddToCartInput = {
  productId: number;
  quantity: number;
  Product?: Product;
  product?: Product;
};

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: AddToCartInput) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  syncCartToBackend: () => void;
}
