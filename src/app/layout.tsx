import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Header from "@/components/header/Header";
import { ToastContainer } from "react-toastify";
import AppContextWrapper from "@/components/shared/appContextWrapper/AppContextWrapper";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Ecommerce App",
  description: "Good for shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <AuthProvider>
            <CartProvider>
              <AppContextWrapper>
                <Header />
                {children}
                <ToastContainer position="top-right" autoClose={3000} />
              </AppContextWrapper>
            </CartProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
