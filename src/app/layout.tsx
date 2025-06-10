import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Header from '@/components/header/Header';
import { ToastContainer } from 'react-toastify';
import AppContextWrapper from '@/components/shared/appContextWrapper/AppContextWrapper';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Ecommerce App',
    template: '%s | Ecommerce App',
  },
  description: 'Your trusted online store for quality products at great prices',
  keywords: ['ecommerce', 'shopping', 'online store', 'products'],
  authors: [{ name: 'Your Company' }],
  creator: 'Your Company',
  publisher: 'Your Company',
  robots: {
    index: true,
    follow: true,
  },
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
