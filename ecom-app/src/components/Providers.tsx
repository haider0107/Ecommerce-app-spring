"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/theme/theme";
import { CssBaseline } from "@mui/material";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </Provider>
    </AuthProvider>
  );
}
