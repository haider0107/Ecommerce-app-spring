"use client";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { notificationApi } from "@/services/notification";

export default function useNotificationSocket(userId: string) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws`);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
        const notification = JSON.parse(message.body);

        toast.success(notification.message);

        dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            userId,
            (draft) => {
              draft.unshift(notification);
            },
          ),
        );
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [userId, dispatch]);
}
