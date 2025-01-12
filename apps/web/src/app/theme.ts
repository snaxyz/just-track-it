import { green, indigo, lightBlue, lightGreen, lime, pink, yellow } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: pink,
    secondary: indigo,
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#f0f0f0",
          paper: "#f5f5f5",
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
