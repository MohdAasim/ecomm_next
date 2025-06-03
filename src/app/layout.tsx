import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Header from "@/components/header/Header";
import { ToastContainer } from "react-toastify";
import AppContextWrapper from "@/components/shared/appContextWrapper/AppContextWrapper";

export const metadata: Metadata = {
  title: "Ecommerce App",
  description: "Good for shopping",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <AppContextWrapper>
              <Header />
              {children}
              <ToastContainer position="top-right" autoClose={3000} />
            </AppContextWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
