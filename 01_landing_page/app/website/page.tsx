import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { HallerWebsite } from "@/components/HallerWebsite";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Ihr Immobilienmakler | Haller Immobilien Andernach",
  description:
    "Immobilienmakler für Koblenz, Neuwied & Umgebung — Hausverwaltung, Immobilienkauf, Immobilienverkauf, Immobilienberatung",
};

export default function WebsitePage() {
  return (
    <div className={`${nunito.variable} font-[family-name:var(--font-nunito)]`}>
      <HallerWebsite />
    </div>
  );
}
