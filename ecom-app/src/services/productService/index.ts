import {
  ApiResponse,
  ProductRequest,
  ProductResponse,
} from "@/types/product/productTypes";
import { baseApi } from "../baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponse<ProductResponse[]>, void>({
      providesTags: ["Products"],
      query: () => "/api/products",
    }),

    getProduct: builder.query<ApiResponse<ProductResponse>, number>({
      query: (id) => `/api/products/${id}`,
    }),

    createProduct: builder.mutation<
      ApiResponse<ProductResponse>,
      ProductRequest
    >({
      query: (body) => ({
        url: "/api/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<
      ApiResponse<ProductResponse>,
      { id: number; body: ProductRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
