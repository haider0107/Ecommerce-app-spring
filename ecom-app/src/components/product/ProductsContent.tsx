"use client";

import { Container, Typography } from "@mui/material";
import { useGetUserQuery } from "@/services/userService";

export default function ProductsContent() {
  const { data, isLoading, error } = useGetUserQuery();

  if (isLoading) return <p>Loading user...</p>;
  if (error) return <p>Error loading user</p>;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4">Products Page</Typography>
      <div>{data?.firstName}</div>
    </Container>
  );
}
