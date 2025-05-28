"use client";
import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  login: (token: string, userId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    Cookies.get("token") || null,
  );
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get the "from" param from the URL if present, otherwise default to "/"
  const from = searchParams.get("from") || "/";

  const login = (newToken: string, newUserId: number) => {
    Cookies.set("token", newToken, { expires: 2 });
    setToken(newToken);
    setUserId(newUserId);
    router.push(from); // Redirect to the original page or home
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
    setUserId(null);
    router.push("/signin");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, token, login, logout, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
