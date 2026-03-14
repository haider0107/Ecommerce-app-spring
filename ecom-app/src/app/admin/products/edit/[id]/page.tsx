"use client";

import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductForm from "@/components/admin/products/ProductForm";

import { Box, CircularProgress } from "@mui/material";
import { useGetProductQuery } from "@/services/productService";
import { useAuth } from "@/hooks/useAuth";
import AdminGuard from "@/components/AdminGuard";

export default function EditProductPage() {
  const params = useParams();
  const id = Number(params.id);

  const { isAuthenticated, isLoading } = useAuth();

  const { data, isFetching } = useGetProductQuery(id, {
    skip: !isAuthenticated || isLoading || !id,
  });

  if (isLoading || isFetching) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProtectedRoute>
      <AdminGuard>
        <Box p={4}>
          <ProductForm product={data?.data} />
        </Box>
      </AdminGuard>
    </ProtectedRoute>
  );
}
