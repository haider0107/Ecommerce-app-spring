"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import OrderDetailsContent from "@/components/orders/OrderDetailsContent";

export default function OrderDetailsPage() {
  return (
    <ProtectedRoute>
      <OrderDetailsContent />
    </ProtectedRoute>
  );
}
