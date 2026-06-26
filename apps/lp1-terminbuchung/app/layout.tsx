import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Besichtigungstermin buchen | Haller Immobilienberatung",
  description:
    "Sicheres Bewerbungsportal — Besichtigungstermin für Ihr Wunschobjekt buchen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${nunito.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
