"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { createClient } from "@/lib/supabase/client";
import { fetchNotificationCount } from "@/lib/supabase/queries";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isLogin) return;

    async function fetchUnread() {
      const supabase = createClient();
      const count = await fetchNotificationCount(supabase);
      setUnreadCount(count);
    }

    fetchUnread();
    const interval = setInterval(fetchUnread, 60_000);
    return () => clearInterval(interval);
  }, [isLogin, pathname]);

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Nav unreadCount={unreadCount} />
      <main className="ml-[240px] flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
