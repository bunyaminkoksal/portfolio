import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ScrollFlyer from "./components/ScrollFlyer";
import LandingScene from "./components/LandingScene";
import RadarHUD from "./components/RadarHUD";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bünyamin Köksal | Portfolio",
  description: "Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* LEFT: Radar + Landing */}
        <div className="fixed left-6 top-16 z-50 hidden lg:flex flex-col gap-3">
          <RadarHUD />
          <LandingScene />
        </div>

        {/* RIGHT: Scroll path */}
        <ScrollFlyer />
      </body>
    </html>
  );
}
