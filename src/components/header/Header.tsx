"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Header.css";

const Header: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems } = useCart();

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    setIsMenuOpen(false);
    logout();
  };

  const handleSignInRedirect = () => {
    setIsMenuOpen(false);
    // You can pass the current path as a query param for redirect after sign in
    router.push(`/signin?from=${encodeURIComponent(pathname)}`);
  };

  return (
    <header className="header" {...props}>
      <div className="header-container">
        <div className="logo">
          <Link href="/">Ecomm</Link>
        </div>

        <button className="hamburger" onClick={handleToggle}>
          ☰
        </button>

        <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <Link
            href="/about"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/cart"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Cart ({cartItems?.length ?? 0})
          </Link>
          {isAuthenticated ? (
            <a className="nav-link" onClick={handleSignOut}>
              Sign Out
            </a>
          ) : (
            <a className="nav-link" onClick={handleSignInRedirect}>
              Sign In
            </a>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
