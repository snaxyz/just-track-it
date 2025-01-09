import { Inter, Kalam, Roboto } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], display: "swap" });
export const kalam = Kalam({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
});
export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});
