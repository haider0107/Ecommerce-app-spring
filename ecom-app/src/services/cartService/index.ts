import { ApiResponse } from "@/types/product/productTypes";
import { baseApi } from "../baseApi";
import { CartItem, CartItemRequest } from "@/types/cart/cartTypes";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<CartItem[]>, void>({
      query: () => "/api/cart",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<ApiResponse<CartItem>, CartItemRequest>({
      query: (body) => ({
        url: "/api/cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<ApiResponse<void>, string>({
      query: (productId) => ({
        url: `/api/cart/items/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} = cartApi;
