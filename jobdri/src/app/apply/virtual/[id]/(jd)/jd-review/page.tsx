"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/components/common/footer";
import { ModalNotice } from "@/components/common/modal";
import JdReviewPageClient from "./JdReviewPageClient";
import { emptyJdSections } from "@/components/mock-application/jdReviewSections";

export default function MockApplicationJdReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const openBackConfirm = () => setShowBackConfirm(true);
  const closeBackConfirm = () => setShowBackConfirm(false);
  const goToJdInput = () => router.replace(`/apply/virtual/${id}/jd-input`);

  return (
    <div className="min-h-screen flex flex-col bg-bg-default">
      <JdReviewPageClient
        sections={mode === "manual" ? emptyJdSections : undefined}
      />
      <Footer
        backAction={{ onClick: openBackConfirm }}
        ctaAction={{
          label: "확정하기",
          onClick: () => router.push(`/apply/virtual/${id}/questions`),
        }}
      />

      {showBackConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="confirmationModal"
            title="공고 내용을 다시 업로드 하시겠습니까?"
            description="기존 정보는 저장되지 않고 삭제됩니다."
            onClose={closeBackConfirm}
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
