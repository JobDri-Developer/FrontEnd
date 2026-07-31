import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
// import LayoutShell from "./LayoutShell";

export const metadata: Metadata = {
  title: "JobDri",
  description: "취준생을 위한 채용 통합 관리 솔루션",
  icons: {
    icon: [
      {
        url: "/ic_JobDri.svg?v=2",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/ic_JobDri.svg?v=2",
    apple: "/ic_JobDri.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full max-w-[1920px] bg-line-neutral-assistive">
        <QueryProvider> {children}</QueryProvider>
      </body>
    </html>
  );
}
