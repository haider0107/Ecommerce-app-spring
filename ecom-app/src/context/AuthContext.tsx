"use client";

import React, { createContext, useEffect, useState } from "react";
import { getKeycloak } from "@/lib/keycloak";
import type Keycloak from "keycloak-js";
import type { CustomTokenParsed } from "@/types/auth";

interface AuthContextType {
  keycloak: Keycloak | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: CustomTokenParsed | null;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<CustomTokenParsed | null>(null);

  useEffect(() => {
    const kc = getKeycloak();

    kc.init({
      onLoad: "check-sso",
      pkceMethod: "S256",
    }).then((authenticated) => {
      setKeycloak(kc);
      setIsAuthenticated(authenticated);

      if (authenticated) {
        setUser(kc.tokenParsed as CustomTokenParsed);
      }

      setIsLoading(false);
    });

    // // 🔁 Auto refresh token every 30 seconds
    // const interval = setInterval(() => {
    //   kc.updateToken(30).catch(() => {
    //     kc.logout();
    //   });
    // }, 30000);

    // return () => clearInterval(interval);
  }, []);

  const login = () =>
    keycloak?.login({
      redirectUri: window.location.origin + "/products",
    });

  const logout = () =>
    keycloak?.logout({
      redirectUri: window.location.origin,
    });

  return (
    <AuthContext.Provider
      value={{
        keycloak,
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
