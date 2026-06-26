import Link from "next/link";

const HALLER_IMPRESSUM = "https://haller-immobilien.de/impressum/";
const HALLER_MAIN_DATENSCHUTZ =
  "https://haller-immobilien.de/datenschutzerklaerung/";

type PortalFooterProps = {
  demoMode?: boolean;
};

export function PortalFooter({ demoMode = false }: PortalFooterProps) {
  return (
    <footer className="mt-6 border-t border-website-border pt-4 text-center text-xs text-website-muted">
      {demoMode ? (
        <p className="mb-2">
          <a href="/" className="text-website-primary hover:underline">
            ← Zurück zur Demo-Übersicht
          </a>
        </p>
      ) : null}
      <p className={demoMode ? "mt-2" : undefined}>
        <Link href="/datenschutz" className="text-website-primary hover:underline">
          Datenschutzerklärung (Portal)
        </Link>
        {" · "}
        <a
          href={HALLER_MAIN_DATENSCHUTZ}
          target="_blank"
          rel="noopener noreferrer"
          className="text-website-primary hover:underline"
        >
          Datenschutz (Website)
        </a>
        {" · "}
        <a
          href={HALLER_IMPRESSUM}
          target="_blank"
          rel="noopener noreferrer"
          className="text-website-primary hover:underline"
        >
          Impressum
        </a>
      </p>
      <p className="mt-2">
        Haller Immobilienberatung GmbH · Kirchberg 42 · 56626 Andernach
      </p>
    </footer>
  );
}
