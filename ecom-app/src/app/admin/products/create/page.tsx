"use client";

import AdminGuard from "@/components/AdminGuard";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductForm from "@/components/admin/products/ProductForm";
import { Box } from "@mui/material";

export default function CreateProductPage() {
  return (
    <ProtectedRoute>
      <AdminGuard>
        <Box p={4}>
          <ProductForm />
        </Box>
      </AdminGuard>
    </ProtectedRoute>
  );
}
