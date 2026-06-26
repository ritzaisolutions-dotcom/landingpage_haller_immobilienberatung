import { InserateSidebar } from "@/components/InserateSidebar";

export default function InserateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-3rem)] gap-0">
      <InserateSidebar />
      <div className="min-w-0 flex-1 overflow-y-auto pl-6">{children}</div>
    </div>
  );
}
