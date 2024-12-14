import { Inter, Permanent_Marker } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], display: "swap" });
export const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
});
