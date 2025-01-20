import { Permanent_Marker, Roboto } from "next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});
export const permanentMarker = Permanent_Marker({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pm",
});
