"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useState, MouseEvent, useMemo } from "react";
import { useGetCartQuery } from "@/services/cartService";
import useNotificationSocket from "@/hooks/useNotificationSocket";
import NotificationBell from "./notification/NotificationBell";

export default function Header() {
  const { isAuthenticated, login, logout, isLoading, keycloak } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [notificationAnchor, setNotificationAnchor] =
    useState<HTMLElement | null>(null);

  const notificationOpen = Boolean(notificationAnchor);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const userId = keycloak?.tokenParsed?.sub;

  const roles =
    keycloak?.tokenParsed?.resource_access?.[
      process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!
    ]?.roles ?? [];

  const isAdmin = roles.includes("ADMIN");
  const isActive = (path: string) => pathname.startsWith(path);

  useNotificationSocket(userId ?? "");

  const { data } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const cartCount = useMemo(
    () => data?.data?.reduce((total, item) => total + item.quantity, 0) ?? 0,
    [data],
  );

  if (isLoading) return null;

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "primary.main",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          Nimbus Commerce
        </Typography>

        {!isAuthenticated ? (
          <Button color="inherit" onClick={login}>
            Login
          </Button>
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              color="inherit"
              onClick={() => router.push("/products")}
              sx={{
                fontWeight: isActive("/products") ? 700 : 400,
                borderBottom: isActive("/products")
                  ? "2px solid white"
                  : "none",
                borderRadius: 0,
              }}
            >
              Products
            </Button>

            <NotificationBell
              active={notificationOpen}
              anchorEl={notificationAnchor}
              onOpen={handleNotificationOpen}
              onClose={handleNotificationClose}
            />

            {/* Cart Icon */}
            <IconButton
              color="inherit"
              onClick={() => router.push("/cart")}
              sx={{
                bgcolor: isActive("/cart")
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
              }}
            >
              <Badge
                badgeContent={cartCount}
                color="error"
                invisible={cartCount === 0}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* User Icon */}
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircleIcon />
            </IconButton>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  sx: {
                    width: 260,
                  },
                },
              }}
            >
              {/* User Info */}
              <Box px={2} py={1.5}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <AccountCircleIcon sx={{ fontSize: 36 }} />

                  <Box>
                    <Typography fontWeight={600}>
                      {keycloak?.tokenParsed?.preferred_username}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {keycloak?.tokenParsed?.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Role */}
                {isAdmin && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      display: "inline-block",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: "secondary.main",
                      color: "white",
                    }}
                  >
                    ADMIN
                  </Typography>
                )}
              </Box>

              <Divider />

              {isAdmin && (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    router.push("/admin/products");
                  }}
                >
                  Admin Panel
                </MenuItem>
              )}

              {/* Orders */}
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  router.push("/orders");
                }}
              >
                My Orders
              </MenuItem>

              <Divider />

              {/* Logout */}
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  logout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
