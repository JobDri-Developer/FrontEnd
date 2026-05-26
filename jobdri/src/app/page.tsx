import ResumeAnalysisLoading from "@/components/mock-application/ResumeAnalysisLoading";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-h28-bold">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function Home() {
  return <ResumeAnalysisLoading durationMs={3600} />;
}
