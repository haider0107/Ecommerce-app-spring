"use client";

import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { getKeycloak } from "@/lib/keycloak";
import { useGetNotificationsQuery } from "@/services/notification";

export default function NotificationBell() {
  const keycloak = getKeycloak();
  const userId = keycloak?.tokenParsed?.sub;

  const { data = [] } = useGetNotificationsQuery(userId!, {
    skip: !userId,
  });

  const unreadCount = data.filter((n) => !n.read).length;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: "white" }} />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {data.length === 0 && <MenuItem>No notifications</MenuItem>}

        {data.map((n) => (
          <MenuItem key={n.id}>{n.message}</MenuItem>
        ))}
      </Menu>
    </>
  );
}
