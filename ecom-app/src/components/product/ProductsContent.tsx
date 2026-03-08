"use client";

import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { useGetProductsQuery } from "@/services/productService";
import ProductCard from "./ProductCard";
import { useAddToCartMutation } from "@/services/cartService";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/utils/apiError";
import { useState } from "react";

export default function ProductsContent() {
  const { data, isLoading, error } = useGetProductsQuery();
  const [addToCart] = useAddToCartMutation();

  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography textAlign="center" mt={4}>
        Error loading products
      </Typography>
    );
  }

  const products = data?.data ?? [];

  const handleAddToCart = async (productId: number) => {
    try {
      setLoadingProductId(productId);

      const response = await addToCart({
        productId,
        quantity: 1,
      }).unwrap();

      toast.success(response.message || "Added to cart");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight={600} mb={4}>
        Products
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              addToCartLoading={loadingProductId === product.id}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
