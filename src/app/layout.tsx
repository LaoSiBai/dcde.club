import type { Metadata } from "next";
import "./globals.css";

import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "DCDE",
  description: "Through the lens of DCDE, we reshape original visual assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
