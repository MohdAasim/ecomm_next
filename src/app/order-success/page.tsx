"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./OrderSucsess.css";

const OrderSuccess: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="order-success-container" {...props}>
      <div className="order-success-icon">🎉</div>
      <h1 className="order-success-title">
        Hurray! Your order has been booked.
      </h1>
      <p className="order-success-message">
        You will be redirected to the home page shortly...
      </p>
    </div>
  );
};

export default OrderSuccess;
