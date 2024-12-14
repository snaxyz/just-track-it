import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { inter } from "./fonts";

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
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
