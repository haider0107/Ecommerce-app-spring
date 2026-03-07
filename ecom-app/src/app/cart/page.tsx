"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import CartContent from "@/components/cart/CartContent";

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
