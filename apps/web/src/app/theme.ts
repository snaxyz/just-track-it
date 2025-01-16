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
          default: "#f5f5f5",
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
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingBottom: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          paddingLeft: 8,
          paddingRight: 8,
        },
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
