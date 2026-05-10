export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="h-screen sticky top-0 shrink-0">사이드바</aside>
      <main className="flex-1 min-w-0">
        {/* 콘텐츠 영역에만 960px 그리드 적용 */}
        <div className="grid-base container-lnb mx-auto">{children}</div>
      </main>
    </div>
  );
}
