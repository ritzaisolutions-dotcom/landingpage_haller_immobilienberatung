import type { DatenschutzSection } from "@/lib/legal/datenschutz-portal";

type LegalTocProps = {
  sections: DatenschutzSection[];
};

export function LegalToc({ sections }: LegalTocProps) {
  return (
    <nav
      aria-label="Inhaltsverzeichnis"
      className="mb-8 rounded-haller border border-website-border bg-website-bg p-4"
    >
      <h2 className="mb-3 text-sm font-bold text-website-dark">Inhaltsverzeichnis</h2>
      <ol className="columns-1 gap-x-6 space-y-1 text-sm sm:columns-2">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-website-primary hover:underline"
            >
              {index + 1}. {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
