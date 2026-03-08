"use client";

import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import { useGetOrderDetailsQuery } from "@/services/orderService";

export default function OrderDetailsContent() {
  const params = useParams();

  const orderId = Number(params.orderId);

  const { data, isLoading, error } = useGetOrderDetailsQuery(orderId, {
    skip: !orderId,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data?.data) {
    return (
      <Typography textAlign="center" mt={4}>
        Failed to load order details
      </Typography>
    );
  }

  const order = data.data;

  return (
    <Container sx={{ mt: 5, maxWidth: 900 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Order #{order.id}
      </Typography>

      {/* Order Info */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography color="success.main">Status: {order.status}</Typography>

            <Divider />

            <Typography>
              Created: {new Date(order.createdAt).toLocaleString()}
            </Typography>

            <Divider />

            <Typography fontWeight="bold">
              Total: ${order.totalAmount}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Items
      </Typography>

      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={2}>
            {order.items.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.name}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />

                <Box flex={1}>
                  <Typography fontWeight={600}>{item.name}</Typography>

                  <Typography variant="body2" color="text.secondary">
                    {item.category}
                  </Typography>
                </Box>

                <Box textAlign="right">
                  <Typography>${item.price}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
