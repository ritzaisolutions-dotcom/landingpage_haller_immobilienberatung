import { redirect } from "next/navigation";

export default function InseratIndexPage({ params }: { params: { id: string } }) {
  redirect(`/inserate/${params.id}/buchungsfenster`);
}
