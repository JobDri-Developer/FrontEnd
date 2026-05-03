// layout.tsx 수정 예시
import type { Metadata } from "next";
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
      {/* 폰트를 CSS에서 body에 직접 적용했으므로 클래스는 비워둬도 됩니다 */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
