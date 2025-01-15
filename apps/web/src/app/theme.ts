import { blue, blueGrey, green, indigo, lightBlue, lightGreen, lime, pink, yellow } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: pink,
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#f0f0f0",
          paper: "#f5f5f5",
        },
        primary: indigo,
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
