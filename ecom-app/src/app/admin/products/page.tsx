"use client";

import AdminGuard from "@/components/AdminGuard";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProductsContent from "@/components/admin/products/AdminProductsContent";

export default function AdminProductsPage() {
  return (
    <ProtectedRoute>
      <AdminGuard>
        <AdminProductsContent />
      </AdminGuard>
    </ProtectedRoute>
  );
}
