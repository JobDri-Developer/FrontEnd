import { CtaFooter } from "@/components/common/cta";

export default function ComponentsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 bg-bg-default px-8 py-8">
      <section className="flex w-[1440px] flex-col items-start gap-8">
        <h1 className="text-h28-bold text-text-neutral-title">CTA</h1>
        <div className="flex flex-col gap-10">
          <CtaFooter />
          <CtaFooter type="result" />
        </div>
      </section>
    </main>
  );
}
