"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";

const AppContextWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const { syncCartToBackend } = useCart();

  const hasSynced = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasSynced.current) {
      syncCartToBackend();
      hasSynced.current = true;
    }
    if (!isAuthenticated) {
      hasSynced.current = false;
    }
  }, [isAuthenticated, syncCartToBackend]);

  return <>{children}</>;
};

export default AppContextWrapper;
