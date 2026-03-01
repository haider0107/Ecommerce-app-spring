import axios from "axios";
import { getKeycloak } from "@/lib/keycloak";

export const ecomApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

ecomApi.interceptors.request.use(async (config) => {
  const keycloak = getKeycloak();

  if (keycloak?.authenticated) {
    await keycloak.updateToken(30);

    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }

  return config;
});
