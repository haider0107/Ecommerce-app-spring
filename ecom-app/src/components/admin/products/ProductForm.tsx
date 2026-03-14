"use client";

import { useState } from "react";

import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/services/productService";

import { Box, TextField, Button, Stack, Typography } from "@mui/material";

import { useRouter } from "next/navigation";
import { ProductRequest, ProductResponse } from "@/types/product/productTypes";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/utils/apiError";

interface Props {
  product?: ProductResponse;
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const [form, setForm] = useState<ProductRequest>(() => ({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    stockQuantity: product?.stockQuantity ?? 0,
    category: product?.category ?? "",
    imageUrl: product?.imageUrl ?? "",
  }));

  const handleChange = (
    field: keyof ProductRequest,
    value: string | number,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      let response;

      if (product) {
        response = await updateProduct({
          id: product.id,
          body: form,
        }).unwrap();

        toast.success(response.message || "Product updated successfully");
      } else {
        response = await createProduct(form).unwrap();

        toast.success(response.message || "Product created successfully");
      }

      router.push("/admin/products");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Box maxWidth={500}>
      <Typography variant="h5" mb={2}>
        {product ? "Edit Product" : "Create Product"}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <TextField
          label="Price"
          type="number"
          value={form.price}
          onChange={(e) => handleChange("price", Number(e.target.value))}
        />

        <TextField
          label="Stock Quantity"
          type="number"
          value={form.stockQuantity}
          onChange={(e) =>
            handleChange("stockQuantity", Number(e.target.value))
          }
        />

        <TextField
          label="Category"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        />

        <TextField
          label="Image URL"
          value={form.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={creating || updating}
          loading={creating || updating}
        >
          {product ? "Update Product" : "Create Product"}
        </Button>
      </Stack>
    </Box>
  );
}
