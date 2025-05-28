import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./CartPage.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useRouter();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.Product?.price || 0) * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate.push("/signin");
      return;
    }
    navigate.push(`/checkout?totalPrice=${totalPrice}`);
  };

  // Defensive fallback
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>

      {safeCartItems.length === 0 ? (
        <p className="cart-empty">Cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {safeCartItems.map((item) => (
              <li className="cart-item" key={item.productId}>
                <span className="cart-item-name">
                  {item.Product?.name || `Product ${item.productId}`} - ₹
                  {(Number(item.Product?.price) * item.quantity).toFixed(2)}
                </span>
                <div className="cart-controls">
                  <button
                    className="cart-btn"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        Math.max(item.quantity - 1, 1),
                      )
                    }
                  >
                    -
                  </button>
                  <span className="cart-qty">{item.quantity}</span>
                  <button
                    className="cart-btn"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </button>

                  <button
                    className="cart-remove"
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: "Remove from cart?",
                        text: "Are you sure you want to remove this item?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, remove it!",
                      });

                      if (result.isConfirmed) {
                        removeFromCart(item.productId);
                        toast.info("Item removed from cart");
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-actions">
            <button
              className="cart-clear"
              onClick={async () => {
                const result = await Swal.fire({
                  title: "Clear cart?",
                  text: "Are you sure you want to clear the entire cart?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#d33",
                  cancelButtonColor: "#3085d6",
                  confirmButtonText: "Yes, clear it!",
                });

                if (result.isConfirmed) {
                  clearCart();
                  toast.info("Cart cleared");
                }
              }}
            >
              Clear Cart
            </button>

            <button className="cart-checkout" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
