import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bewerbungsportal | Haller Immobilienberatung",
  description:
    "Sicheres Portal zur Einreichung von Bewerbungsunterlagen — Haller Immobilienberatung GmbH, Andernach",
};

export default function UploadLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
