import "./OrderSucsess.css";
import Timer from "./Timer";

const OrderSuccess = () => {
  return (
    <div className="order-success-container">
      <div className="order-success-icon">🎉</div>
      <h1 className="order-success-title">
        Hurray! Your order has been booked.
      </h1>
      <p className="order-success-message">
        You will be redirected to the home page shortly...
      </p>
      <Timer />
    </div>
  );
};

export default OrderSuccess;
