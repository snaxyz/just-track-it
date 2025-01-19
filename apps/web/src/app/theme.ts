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
          default: "#D1E9F6",
          paper: "#D1E9F6",
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
        root: ({ theme }) => ({
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          background: theme.palette.background.paper,
        }),
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
