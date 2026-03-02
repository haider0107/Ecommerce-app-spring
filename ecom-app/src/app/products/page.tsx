"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ProductsContent from "@/components/product/ProductsContent";

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsContent />
    </ProtectedRoute>
  );
}
