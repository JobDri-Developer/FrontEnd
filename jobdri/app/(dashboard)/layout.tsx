export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 h-screen w-[240px] shrink-0">사이드바</aside>
      <main className="main-content-frame flex-1">
        <div className="grid-base container-lnb">{children}</div>
      </main>
    </div>
  );
}
