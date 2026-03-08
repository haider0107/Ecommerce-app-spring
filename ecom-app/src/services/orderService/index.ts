import { ApiResponse } from "@/types/product/productTypes";
import { baseApi } from "../baseApi";
import { OrderDetailsResponse, OrderResponse } from "@/types/order/orderTypes";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<ApiResponse<OrderResponse>, void>({
      query: () => ({
        url: "/api/orders",
        method: "POST",
      }),
      invalidatesTags: ["Cart", "Notifications", "Products"],
    }),

    getOrderDetails: builder.query<ApiResponse<OrderDetailsResponse>, number>({
      query: (orderId) => `/api/orders/${orderId}`,
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderDetailsQuery } = orderApi;
