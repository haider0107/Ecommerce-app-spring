"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { keycloak, isLoading } = useAuth();
  const router = useRouter();

  const roles =
    keycloak?.tokenParsed?.resource_access?.[
      process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!
    ]?.roles ?? [];

  const isAdmin = roles.includes("ADMIN");

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/");
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h5">Access Denied</Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
