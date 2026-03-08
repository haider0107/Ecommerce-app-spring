import { ApiResponse, Product } from "@/types/product/productTypes";
import { baseApi } from "../baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponse<Product[]>, void>({
      providesTags: ["Products"],
      query: () => "/api/products",
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
