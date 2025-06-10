import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export const useCartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useRouter();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.Product?.price || 0) * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate.push('/signin');
      return;
    }
    navigate.push(`/checkout?totalPrice=${totalPrice}`);
  };

  const handleRemoveItem = async (productId: number) => {
    const result = await Swal.fire({
      title: 'Remove from cart?',
      text: 'Are you sure you want to remove this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
    });

    if (result.isConfirmed) {
      removeFromCart(productId);
      toast.info('Item removed from cart');
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: 'Clear cart?',
      text: 'Are you sure you want to clear the entire cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear it!',
    });

    if (result.isConfirmed) {
      clearCart();
      toast.info('Cart cleared');
    }
  };

  // Defensive fallback
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return {
    safeCartItems,
    totalPrice,
    updateQuantity,
    handleCheckout,
    handleRemoveItem,
    handleClearCart,
  };
};
