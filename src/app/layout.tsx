import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "SIGARA WebGIS | Sistem Informasi Geografis Agentik Rujukan Akuntabel",
  description:
    "WebGIS SIGARA untuk Healthkathon 2026 berbasis 19 dataset JKN resmi BPJS Kesehatan (2014-2018). Peta choropleth 34 provinsi, analisis faskes, akses, biaya klaim, diagnosis, dan kerangka GeoAI pemeriksaan rujukan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
