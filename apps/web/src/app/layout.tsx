import type { Metadata } from "next";
import { Providers } from "./providers";
import { roboto } from "./fonts";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import "./global.css";

export const metadata: Metadata = {
  title: "Just track it fitness app",
  description: "Just track it fitness app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.variable}>
        <InitColorSchemeScript attribute="class" defaultMode="system" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
