import type { Metadata } from "next";
import { TikTok_Sans } from "next/font/google";
import "./globals.css";

const tiktokSans = TikTok_Sans({
  variable: "--font-tiktok-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "UoB Spaces",
  description: "University of Bristol Teaching Spaces Availability",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tiktokSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
