import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-slate-950`}
    >
      <body className="min-h-screen bg-slate-950 text-white antialiased">
        <SideMenu />

        <main className="mx-auto min-h-screen max-w-md bg-slate-950 px-4 pb-24 pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}