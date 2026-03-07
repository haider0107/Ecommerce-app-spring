import { ApiResponse } from "@/types/product/productTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function getApiErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "status" in error) {
    const fetchError = error as FetchBaseQueryError;
    const data = fetchError.data as ApiResponse<unknown>;

    return data?.message ?? "Request failed";
  }

  return "Unexpected error occurred";
}
