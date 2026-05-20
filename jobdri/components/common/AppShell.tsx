"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lnb from "@/components/common/lnb/Lnb";
import PageHeader from "@/components/common/PageHeader";

const standaloneRoutes = new Set(["/login", "/apply-type"]);
const standaloneRoutePrefixes = ["/mock-application"];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (
    standaloneRoutes.has(pathname) ||
    standaloneRoutePrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-line-neutral-assistive">
      <aside className="fixed top-0 h-screen shrink-0">
        <Lnb />
      </aside>
      <main className="mx-auto flex h-screen max-w-270 flex-1 content-center flex-col overflow-auto px-10 py-11">
        <div>
          <PageHeader />
          {children}
        </div>
      </main>
    </div>
  );
}
