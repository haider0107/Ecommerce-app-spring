"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, Container } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { getUser } from "@/services/userService";

export default function ProductsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }

    async function fetchUser() {
      const user = await getUser();
      console.log(user);
    }

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return null; // or spinner
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4">Products Page</Typography>
    </Container>
  );
}
