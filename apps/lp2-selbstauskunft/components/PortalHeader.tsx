import Image from "next/image";

export function PortalHeader() {
  return (
    <header className="bg-website-dark text-white">
      <div className="h-1 bg-website-primary" />
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Image
          src="/logo_haller.png"
          alt="Haller Immobilienberatung GmbH"
          width={200}
          height={48}
          className="h-10 w-auto"
          priority
        />
        <p className="text-right text-xs font-semibold text-website-primary sm:text-sm">
          Sicheres Bewerbungsportal
        </p>
      </div>
    </header>
  );
}
