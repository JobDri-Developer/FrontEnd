"use client"; // 경로 확인을 위해 클라이언트 컴포넌트 선언

import { usePathname } from "next/navigation";
import Lnb from "@/components/common/lnb/Lnb";
import PageHeader from "@/components/common/PageHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 레이아웃을 보여주지 않을 경로인지 확인
  const isNoLayout = ["/login", "/signup"].some((path) =>
    pathname.startsWith(path),
  );

  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex bg-line-neutral-assistive">
        {/* 1. 로그인/회원가입이 아닐 때만 LNB 렌더링 */}
        {!isNoLayout && (
          <aside className="h-screen fixed top-0 shrink-0">
            <Lnb />
          </aside>
        )}

        <main
          className={`flex-1 min-w-0 flex flex-col content-center max-w-270 h-screen mx-auto py-11 px-10 scroll-auto ${
            !isNoLayout ? "ml-[LNB너비]" : "" // LNB가 있을 때만 왼쪽 여백 추가 (필요시)
          }`}
        >
          <div>
            {/* 2. 로그인/회원가입이 아닐 때만 Header 렌더링 */}
            {!isNoLayout && <PageHeader />}
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
