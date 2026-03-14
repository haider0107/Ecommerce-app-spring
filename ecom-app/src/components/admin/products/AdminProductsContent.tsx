"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/services/productService";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/utils/apiError";

export default function AdminProductsContent() {
  const { keycloak } = useAuth();
  const router = useRouter();

  const roles =
    keycloak?.tokenParsed?.resource_access?.[
      process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!
    ]?.roles ?? [];

  const isAdmin = roles.includes("ADMIN");

  const { data, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteProduct(id).unwrap();

      toast.success(response.message || "Product deleted successfully");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/");
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Product Management
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => router.push("/admin/products/create")}
      >
        Add Product
      </Button>

      <Stack spacing={2}>
        {data?.data?.map((product) => (
          <Card key={product.id}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography fontWeight={600}>{product.name}</Typography>

                  <Typography variant="body2">${product.price}</Typography>

                  <Typography variant="body2">
                    Stock: {product.stockQuantity}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      router.push(`/admin/products/edit/${product.id}`)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
