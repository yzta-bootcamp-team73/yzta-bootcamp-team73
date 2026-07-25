import type { Metadata } from "next";
import { IBM_Plex_Sans, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Sayfa boyanmadan önce senkron çalışıp .dark class'ını ayarlar — next-themes'in
// kullandığı JSX-render script yöntemi React 19 ile "script tag" uyarısı ve
// hydration mismatch'e yol açtığı için next/script (beforeInteractive) ile
// Next.js'in resmi desteklediği yoldan yapılıyor.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("kivona-theme");
    var isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
