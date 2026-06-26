import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selbstauskunft | Haller Immobilienberatung",
  description:
    "Digitale Mieter- und Käufer-Selbstauskunft — Haller Immobilienberatung GmbH, Andernach",
};

export default function UploadLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
