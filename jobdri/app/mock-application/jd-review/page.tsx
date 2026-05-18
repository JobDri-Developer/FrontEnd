import Header from "@/components/common/header/Header";
import { Footer } from "@/components/common/footer";
import JdReviewMain from "@/components/mock-application/JdReviewMain";

export default function MockApplicationJdReviewPage() {
  return (
    <div className="min-h-screen bg-line-neutral-assistive px-6 py-6">
      <div className="mx-auto flex w-[1280px] flex-col">
        <Header currentStep={3} />

        <section className="flex flex-col items-center bg-bg-default px-[82px] pt-10 pb-18">
          <div className="flex max-w-[1440px] flex-col items-center gap-8 self-stretch">
            <div className="flex items-center justify-center gap-2.5 self-stretch">
              <h2 className="text-center text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                공고 내용을 확인하고 수정해주세요
              </h2>
            </div>
            <JdReviewMain />
          </div>
        </section>

        <Footer ctaAction={{ label: "확정하기" }} />
      </div>
    </div>
  );
}
