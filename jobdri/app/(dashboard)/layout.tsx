export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-[240px] h-screen sticky top-0">사이드바</aside>
      <main className="flex-1">
        {/* 콘텐츠 영역에만 960px 그리드 적용 */}
        <div className="grid-base container-lnb">{children}</div>
      </main>
    </div>
  );
}
