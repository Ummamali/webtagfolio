import "./globals.css";
import { roboto } from "./fonts";

export const metadata = {
  title: "Tagfolio | A Modern Multimedia Analyzer",
  description: "Application to efficiently tag media for their analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  );
}
