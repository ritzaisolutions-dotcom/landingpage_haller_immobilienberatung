import { PortalHeader } from "@/components/PortalHeader";

type PortalShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function PortalShell({ children, className = "" }: PortalShellProps) {
  return (
    <div className={`min-h-screen bg-website-bg text-website-text ${className}`}>
      <PortalHeader />
      {children}
    </div>
  );
}
