"use client";

import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, useColorScheme } from "@mui/material/styles";
import { QueryClientProvider } from "./query-client-provider";
import { theme } from "./theme";
import { CssBaseline } from "@mui/material";

export function Providers({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  useColorScheme();
  return (
    <QueryClientProvider>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme} defaultMode="system">
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </QueryClientProvider>
  );
}
