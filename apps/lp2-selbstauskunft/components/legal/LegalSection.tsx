import type { DatenschutzSection } from "@/lib/legal/datenschutz-portal";

type LegalSectionProps = {
  section: DatenschutzSection;
  index: number;
};

function ParagraphBlock({ text }: { text: string }) {
  const emailMatch = text.match(/info@haller-immobilien\.de/);
  if (emailMatch) {
    const parts = text.split("info@haller-immobilien.de");
    return (
      <p>
        {parts[0]}
        <a
          href="mailto:info@haller-immobilien.de"
          className="text-website-primary hover:underline"
        >
          info@haller-immobilien.de
        </a>
        {parts[1]}
      </p>
    );
  }
  return <p>{text}</p>;
}

function ListBlock({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalSection({ section, index }: LegalSectionProps) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="mb-2 text-base font-bold text-website-dark">
        {index + 1}. {section.title}
      </h2>
      <div className="space-y-2">
        {section.paragraphs.map((paragraph) => (
          <ParagraphBlock key={paragraph} text={paragraph} />
        ))}
        {section.listItems ? <ListBlock items={section.listItems} /> : null}
        {section.paragraphsAfter?.map((paragraph) => (
          <ParagraphBlock key={paragraph} text={paragraph} />
        ))}
      </div>
    </section>
  );
}
