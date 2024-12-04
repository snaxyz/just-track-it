"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClientProvider } from "./query-client-provider";
import { useEffect, useState } from "react";

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme] = useState(() => localStorage.getItem("theme") ?? "dark");

  useEffect(() => {
    document
      .querySelector("body")
      ?.classList.add(theme, "text-foreground", "bg-background");
  }, [theme]);

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
