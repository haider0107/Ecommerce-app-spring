import { UserResponse } from "@/types/user";
import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<UserResponse, void>({
      query: () => "/api/users/me",
    }),
  }),
});

export const { useGetUserQuery } = userApi;
