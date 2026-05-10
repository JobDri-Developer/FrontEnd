import type { Metadata } from "next";
import "./globals.css";
import Lnb from "@/components/common/lnb/Lnb";
import PageHeader from "@/components/common/PageHeader";

export const metadata: Metadata = {
  title: "JobDri",
  description: "취준생을 위한 채용 통합 관리 솔루션",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex bg-line-neutral-assistive">
        <aside className="h-screen sticky top-0 shrink-0">
          <Lnb />
        </aside>
        <main className="flex-1 min-w-0 flex flex-col content-center max-w-270 h-screen mx-auto py-11 px-10">
          <div>
            <PageHeader />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
