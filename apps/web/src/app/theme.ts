import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#f5f5f5",
          paper: "#fafafa",
        },
      },
    },
    dark: true,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
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
