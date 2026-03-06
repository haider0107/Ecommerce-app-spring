"use client";

import { Container, Typography, Grid } from "@mui/material";
import { useGetProductsQuery } from "@/services/productService";
import ProductCard from "./ProductCard";

export default function ProductsContent() {
  const { data, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products</p>;

  const products = data?.data ?? [];

  const handleAddToCart = (productId: number) => {
    console.log("Add to cart", productId);

    // later call cart api
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Products
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
