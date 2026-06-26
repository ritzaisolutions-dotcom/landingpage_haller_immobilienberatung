import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getFirstName } from "@/lib/types";

type SuccessPageProps = {
  searchParams: { name?: string };
};

export default function AuskunftSuccessPage({ searchParams }: SuccessPageProps) {
  const firstName = searchParams.name ? getFirstName(searchParams.name) : "Interessent";

  return (
    <div className="lp-card text-center">
      <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-lp-success" />
      <h1 className="mb-2 text-[28px] font-extrabold text-lp-text">
        Vielen Dank, {firstName}!
      </h1>
      <p className="mb-2 text-sm text-lp-muted">Ihre Selbstauskunft ist bei uns eingegangen.</p>
      <p className="mb-6 text-sm text-lp-muted">Wir melden uns zeitnah bei Ihnen.</p>
      <p className="text-xs text-lp-muted">
        Fragen?{" "}
        <Link href="tel:+49263294580" className="text-lp-primary underline">
          02632 9458-0
        </Link>{" "}
        ·{" "}
        <Link href="mailto:info@haller-immobilien.de" className="text-lp-primary underline">
          info@haller-immobilien.de
        </Link>
      </p>
    </div>
  );
}
