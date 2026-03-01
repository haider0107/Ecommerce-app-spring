"use client";

import { Button, Container, Typography } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, login } = useAuth();

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to My Microservice E-Commerce Project
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        This project demonstrates a real-world microservice architecture built
        with Spring Boot, Kafka, Eureka, API Gateway, and secured using
        Keycloak.
      </Typography>

      {!isAuthenticated && (
        <Button variant="contained" onClick={login}>
          Login to Explore Products
        </Button>
      )}
    </Container>
  );
}
