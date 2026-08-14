import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/config/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: `Valoración de vivienda en Toledo | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },

  description:
    "Calcula una estimación orientativa del valor de tu vivienda en Toledo y municipios cercanos con Tecnorete Toledo.",

  applicationName: siteConfig.name,

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: siteConfig.name,
    title: `Valoración de vivienda en Toledo | ${siteConfig.name}`,
    description:
      "Calcula una estimación orientativa del valor de tu vivienda en Toledo y municipios cercanos.",
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}