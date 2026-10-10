import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "SIGARA WebGIS: Sistem Informasi Geografis Agentik Rujukan Akuntabel",
  description:
    "WebGIS SIGARA berbasis 19 dataset JKN resmi BPJS Kesehatan (2014-2018). Peta choropleth 34 provinsi, analisis faskes, akses, biaya klaim, diagnosis, dan kerangka GeoAI pemeriksaan rujukan.",
  icons: {
    icon: "/logo/Bang%20Jakes%20Maskot.png",
    shortcut: "/logo/Bang%20Jakes%20Maskot.png",
    apple: "/logo/Bang%20Jakes%20Maskot.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo/Bang%20Jakes%20Maskot.png" type="image/png" />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}

