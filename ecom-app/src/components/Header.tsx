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
import { useRouter } from "next/navigation";
import { useState, MouseEvent, useMemo } from "react";
import { useGetCartQuery } from "@/services/cartService";
import useNotificationSocket from "@/hooks/useNotificationSocket";
import NotificationBell from "./notification/NotificationBell";

export default function Header() {
  const { isAuthenticated, login, logout, isLoading, keycloak } = useAuth();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const userId = keycloak?.tokenParsed?.sub;

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
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          Microservice Project
        </Typography>

        {!isAuthenticated ? (
          <Button color="inherit" onClick={login}>
            Login
          </Button>
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            <div>
              <NotificationBell />
            </div>

            {/* Cart Icon */}
            <IconButton color="inherit" onClick={() => router.push("/cart")}>
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
            >
              <MenuItem disabled>
                {keycloak?.tokenParsed?.preferred_username}
              </MenuItem>

              <Divider />

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
