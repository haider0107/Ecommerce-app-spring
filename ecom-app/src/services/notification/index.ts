import { baseApi } from "../baseApi"
import { Notification } from "@/types/notification"

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], string>({
      query: (userId) => `/api/notifications/${userId}`,
      providesTags: ["Notifications"],
    }),
  }),
})

export const { useGetNotificationsQuery } = notificationApi