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
  title: "LandNyaya - AI Land Dispute Resolution & Title Intelligence",
  description:
    "AI-powered legal tech platform for Indian land dispute risk scoring (0-100), revenue record verification (7/12, RTC, Khatiyan), and instant generation of ready-to-download Mutation Applications, RTI Form A, and Advocate Legal Notices.",
  keywords: [
    "Land dispute AI",
    "7/12 extract verification",
    "RTC mutation dispute",
    "Land legal notice generator",
    "Indian land revenue law",
    "Property title risk score",
    "Gemini legal tech",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
