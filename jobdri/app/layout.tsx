import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/common/AppShell";

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
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
