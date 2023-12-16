import { Roboto, Lora } from "next/font/google";

export const roboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
});

export const lora = Lora({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500"],
});
