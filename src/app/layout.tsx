import type { Metadata } from "next";
import { TikTok_Sans } from "next/font/google";
import "./globals.css";

const tiktokSans = TikTok_Sans({
  variable: "--font-tiktok-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bristol University Spots",
  description: "University of Bristol study seat and teaching space availability app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tiktokSans.variable} antialiased bg-zinc-900`}>
        {children}
      </body>
    </html>
  );
}
