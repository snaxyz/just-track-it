"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClientProvider } from "./query-client-provider";
import { useEffect } from "react";

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const theme = localStorage.getItem("theme") ?? "dark";
    document
      .querySelector("body")
      ?.classList.add(theme, "text-foreground", "bg-background");
  }, []);

  return (
    <QueryClientProvider>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          {children}
        </NextThemesProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
