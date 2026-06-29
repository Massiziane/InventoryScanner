import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SideMenu from "@/components/navigation/SideMenu";
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
  title: "ScanApp",
  description: "Inventory scanner app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-white">
        <SideMenu />
        <main className="mx-auto min-h-screen max-w-md px-4 pb-24 pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}