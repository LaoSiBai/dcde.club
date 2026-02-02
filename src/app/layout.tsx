import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DCDE - Design Lab",
  description: "DongChen Design Exchange Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/logo-1.svg" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
