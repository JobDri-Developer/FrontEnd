import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "./LayoutShell";

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
      <head>
        <link rel="icon" href="/ic_JobDri.svg" />
      </head>
      <body className="min-h-full bg-line-neutral-assistive">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
