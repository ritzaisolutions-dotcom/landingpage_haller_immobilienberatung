import { LpShell } from "@/components/LpShell";
import "./auskunft.css";

export default function AuskunftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LpShell>{children}</LpShell>;
}
