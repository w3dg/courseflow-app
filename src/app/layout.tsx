import AppNavbar from "@/components/app-navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Courseflow",
  description: "Your hub for digital learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${geistSans.className} flex flex-col min-h-screen`}>
        <AppNavbar></AppNavbar>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
