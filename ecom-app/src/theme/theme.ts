import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // natural green
    },
    secondary: {
      main: "#f59e0b", // warm amber
    },
    background: {
      default: "#f7f7f7",
    },
  },

  shape: {
    borderRadius: 10,
  },

  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
});
