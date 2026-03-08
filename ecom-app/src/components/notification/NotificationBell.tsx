"use client";

import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getKeycloak } from "@/lib/keycloak";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/services/notification";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/utils/apiError";

export default function NotificationBell() {
  const router = useRouter();

  const keycloak = getKeycloak();
  const userId = keycloak?.tokenParsed?.sub;

  const { data = [] } = useGetNotificationsQuery(userId!, {
    skip: !userId,
  });

  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation();

  const unreadCount = data.filter((n) => !n.read).length;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleNotificationClick = async (id: number, orderId: number) => {
    try {
      await markNotificationRead(id).unwrap();
      setAnchorEl(null);
      router.push(`/orders/${orderId}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleMarkAll = async () => {
    if (!userId) return;

    try {
      await markAllNotificationsRead(userId).unwrap();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: "white" }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            width: 340,
            maxHeight: 450,
          },
        }}
      >
        {/* Header */}
        <Box px={2} py={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={600}>Notifications</Typography>

            {data.length > 0 && (
              <Button size="small" onClick={handleMarkAll}>
                Mark all
              </Button>
            )}
          </Stack>
        </Box>

        <Divider />

        {/* Empty state */}
        {data.length === 0 && <MenuItem disabled>No notifications</MenuItem>}

        {/* Notifications */}
        {data.map((n) => (
          <Box key={n.id}>
            <MenuItem
              onClick={() => handleNotificationClick(n.id, n.orderId)}
              sx={{
                alignItems: "flex-start",
                py: 1.5,
                backgroundColor: n.read ? "inherit" : "rgba(25,118,210,0.08)",
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={n.read ? 400 : 600}>
                  {n.message}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {new Date(n.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>

            <Divider />
          </Box>
        ))}
      </Menu>
    </>
  );
}
