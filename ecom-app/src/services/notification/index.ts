import { baseApi } from "../baseApi";
import { Notification } from "@/types/notification";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get notifications
    getNotifications: builder.query<Notification[], string>({
      query: (userId) => `/api/notifications/${userId}`,
      providesTags: ["Notifications"],
    }),

    // Mark single notification as read
    markNotificationRead: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Mark all notifications as read
    markAllNotificationsRead: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/notifications/read-all/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
