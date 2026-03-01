import { ecomApi } from "../api";

export function getUser() {
  return ecomApi.get("/api/users/me");
}
