"use client";

import { CartItem } from "@/types/cart/cartTypes";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { useRemoveFromCartMutation } from "@/services/cartService";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/utils/apiError";

export default function CartItemRow({ item }: { item: CartItem }) {
  const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();

  const handleRemove = async () => {
    try {
      const response = await removeFromCart(item.productId).unwrap();
      toast.success(response.message || "Removed from cart");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          {/* Product Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Product #{item.productId}</Typography>

            <Typography variant="body2" color="text.secondary">
              Price: ${item.price}
            </Typography>

            <Typography variant="body2">Quantity: {item.quantity}</Typography>
          </Grid>

          {/* Total */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography fontWeight={600}>Total</Typography>
            <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
          </Grid>

          {/* Remove Button */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemove}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={18} /> : "Remove"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
