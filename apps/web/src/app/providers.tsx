"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
// import { useEffect } from "react";
import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { QueryClientProvider } from "./query-client-provider";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  cssVariables: true,
});

// NOTE: we can use tailwindcss if we add `enableCssLayer: true` to the `options` param
// in AppRouterCacheProvider, for now let's try emotion engine

export function Providers({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const theme = localStorage.getItem("theme") ?? "dark";
  //   document
  //     .querySelector("body")
  //     ?.classList.add(theme, "text-foreground", "bg-background");
  // }, []);

  return (
    <QueryClientProvider>
      <InitColorSchemeScript attribute="class" />
      <AppRouterCacheProvider options={{ key: "css", enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            {children}
          </NextThemesProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </QueryClientProvider>
  );
}
