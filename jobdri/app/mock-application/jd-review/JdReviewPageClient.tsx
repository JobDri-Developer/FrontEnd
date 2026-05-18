"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import { Footer } from "@/components/common/footer";
import { ModalNotice } from "@/components/common/modal";
import JdReviewMain from "@/components/mock-application/JdReviewMain";

const JD_INPUT_PATH = "/mock-application/jd-input";

export default function JdReviewPageClient() {
  const router = useRouter();
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const openBackConfirm = () => setShowBackConfirm(true);
  const closeBackConfirm = () => setShowBackConfirm(false);
  const goToJdInput = () => router.replace(JD_INPUT_PATH);

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

        <Footer
          backAction={{ onClick: openBackConfirm }}
          ctaAction={{ label: "확정하기" }}
        />
      </div>

      {showBackConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="confirmationModal"
            title="공고 내용을 다시 업로드 하시겠습니까?"
            description="기존 정보는 저장되지 않고 삭제됩니다."
            secondaryAction={{
              label: "다시 업로드",
              onClick: goToJdInput,
            }}
            primaryAction={{
              label: "계속 작성",
              onClick: closeBackConfirm,
            }}
          />
        </div>
      )}
    </div>
  );
}
