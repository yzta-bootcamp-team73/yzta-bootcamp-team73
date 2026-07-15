import type { Metadata } from "next";
import { IBM_Plex_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kivona — AI Destekli Takım Eşleştirme Platformu",
  description:
    "AI destekli eşleşme motoru ile yeteneklerine en uygun ekibi bul, etkinliklerde zirveye oyna. GitHub profilini analiz et, akıllı eşleştirme ile takımını kur.",
  keywords: ["hackathon", "bootcamp", "datathon", "takım eşleştirme", "AI", "GitHub", "kivona"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${ibmPlexSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
