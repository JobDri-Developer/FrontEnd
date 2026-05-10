import PageHeader from "@/components/common/PageHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="h-screen sticky top-0 shrink-0">사이드바</aside>
      <main className="flex-1 min-w-0 flex flex-col max-w-[1080px]">
        <PageHeader />
        <div className="grid-base container-lnb mx-auto">{children}</div>
      </main>
    </div>
  );
}
