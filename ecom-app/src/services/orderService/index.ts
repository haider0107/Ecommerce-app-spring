import { ApiResponse } from "@/types/product/productTypes";
import { baseApi } from "../baseApi";

export interface OrderItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface OrderResponse {
  id: number;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<ApiResponse<OrderResponse>, void>({
      query: () => ({
        url: "/api/orders",
        method: "POST",
      }),
      invalidatesTags: ["Cart", "Notifications"],
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
