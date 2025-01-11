import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  colorSchemes: {
    dark: true,
    light: true,
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  defaultColorScheme: "dark",
  cssVariables: {
    colorSchemeSelector: "class",
  },
  shape: {
    borderRadius: 8,
  },
});
