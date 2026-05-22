"use client";

import { usePathname } from "next/navigation";
import Lnb from "@/components/common/lnb/Lnb";
import PageHeader from "@/components/common/PageHeader";
import { LAYOUT_ROUTES } from "@/constants/routes";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showLayout = LAYOUT_ROUTES.includes(pathname);

  if (!showLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full">
      <aside className="h-screen sticky top-0 shrink-0">
        <Lnb />
      </aside>
      <main className="flex-1 h-screen max-w-300 mx-auto mt-12 flex flex-col">
        <PageHeader />
        {children}
      </main>
    </div>
  );
}
