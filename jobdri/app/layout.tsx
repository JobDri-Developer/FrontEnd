import type { Metadata } from "next";
import "./globals.css"; // 디자인 시스템과 폰트가 담긴 CSS를 반드시 임포트해야 합니다.

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
    <html lang="ko" className="h-full antialiased grid-base container-default">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
