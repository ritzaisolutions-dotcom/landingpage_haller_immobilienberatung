import Image from "next/image";
import Link from "next/link";

type LpShellProps = {
  children: React.ReactNode;
};

export function LpShell({ children }: LpShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-lp-bg text-lp-text">
      <header className="border-b border-lp-border bg-lp-bg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <Image
            src="/logo_haller.png"
            alt="Haller Immobilienberatung"
            width={160}
            height={48}
            className="h-12 w-auto"
            priority
          />
          <span className="text-xs text-lp-muted sm:text-sm">Sicheres Bewerbungsportal</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">{children}</main>

      <footer className="border-t border-lp-border bg-lp-surface py-6">
        <p className="text-center text-xs text-lp-muted">
          © Haller Immobilienberatung GmbH ·{" "}
          <Link
            href="https://haller-immobilien.de/datenschutz/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-lp-primary"
          >
            Datenschutz
          </Link>{" "}
          ·{" "}
          <Link
            href="https://haller-immobilien.de/impressum/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-lp-primary"
          >
            Impressum
          </Link>
        </p>
      </footer>
    </div>
  );
}
