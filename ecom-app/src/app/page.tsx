"use client";

import { Button, Container, Typography, Stack } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, login } = useAuth();

  return (
    <Container sx={{ mt: 8, textAlign: "center" }}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h3" fontWeight={700}>
          Nimbus Commerce
        </Typography>

        <Typography variant="h6" color="text.secondary" maxWidth={600}>
          A modern microservices e-commerce platform built with Spring Boot,
          Kafka, API Gateway, Keycloak authentication, and a Next.js frontend.
        </Typography>

        {!isAuthenticated && (
          <Button variant="contained" size="large" onClick={login}>
            Login to Explore Products
          </Button>
        )}
      </Stack>
    </Container>
  );
}
