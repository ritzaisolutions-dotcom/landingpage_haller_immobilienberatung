"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getFirstName } from "@/lib/types";

const HERO_IMAGES = [
  {
    src: "https://haller-immobilien.de/wp-content/uploads/2021/03/slide_start.jpg",
    alt: "Immobilien Haller Andernach",
  },
  {
    src: "https://haller-immobilien.de/wp-content/uploads/2021/03/Loftpark-1024x683.jpg",
    alt: "Loftpark Andernach",
  },
] as const;

const ROTATE_MS = 6000;

type LeadLandingHeroProps = {
  name: string;
  inseratId: string;
  nachrichtText?: string | null;
};

export function LeadLandingHero({
  name,
  inseratId,
  nachrichtText,
}: LeadLandingHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const firstName = getFirstName(name);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[40vh] overflow-hidden sm:min-h-[46vh]">
      {HERO_IMAGES.map((image, index) => (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={index !== activeIndex}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto flex max-w-3xl flex-col justify-end px-4 pb-10 pt-16 sm:px-6 sm:pb-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-website-primary">
          Haller Immobilienberatung GmbH
        </p>
        <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
          Guten Tag, {firstName}!
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
          Vervollständigen Sie Ihre Bewerbung zu Inserat{" "}
          <span className="font-semibold text-white">{inseratId}</span>.
          Laden Sie Ihre Unterlagen sicher hoch — verschlüsselt und DSGVO-konform.
        </p>
        {nachrichtText ? (
          <blockquote className="mt-4 max-w-xl border-l-2 border-website-primary pl-3 text-xs italic leading-relaxed text-white/80 sm:text-sm">
            „{nachrichtText.length > 160
              ? `${nachrichtText.slice(0, 160)}…`
              : nachrichtText}"
          </blockquote>
        ) : null}
      </div>
    </section>
  );
}
