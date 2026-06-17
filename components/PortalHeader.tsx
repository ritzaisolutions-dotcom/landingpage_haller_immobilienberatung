import Image from "next/image";

export function PortalHeader() {
  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Image
          src="/logo_haller.png"
          alt="Haller Immobilienberatung GmbH"
          width={160}
          height={40}
          className="h-8 w-auto"
          priority
        />
      </div>
      <p className="text-right text-xs font-medium text-haller-muted">
        Sicheres Bewerbungsportal
      </p>
    </header>
  );
}
