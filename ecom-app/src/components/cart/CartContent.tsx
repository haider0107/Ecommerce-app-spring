"use client";

import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import { useGetCartQuery } from "@/services/cartService";
import CartItemRow from "./CartItemRow";
import { useCreateOrderMutation } from "@/services/orderService";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/utils/apiError";

export default function CartContent() {
  const { data, isLoading, error } = useGetCartQuery();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const handleCheckout = async () => {
    try {
      const res = await createOrder().unwrap();

      toast.success(res.message || "Order created successfully");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>Error loading cart</Typography>;
  }

  const items = data?.data ?? [];

  const totalPrice =
    items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

  return (
    <Container sx={{ mt: 5, maxWidth: 900 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Your Cart
      </Typography>

      {items.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}

          <Divider />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Total: ${totalPrice.toFixed(2)}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckout}
              disabled={isCreating}
            >
              {isCreating ? "Processing..." : "Buy Now"}
            </Button>
          </Box>
        </Stack>
      )}
    </Container>
  );
}
