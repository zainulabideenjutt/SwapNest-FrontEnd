// filepath: /D:/Buy and Sell Pre-Owned Goods/frontend/app/layout.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from 'sonner';
import EcommerceHeader from "@/components/Header";
import 'app/globals.css'
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { CartProvider } from "@/lib/CartContext"
// Create a client
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider >
              <Toaster />
              {children}
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}