"use client";

import { useCallback, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/common/header/Header";
import ApplyResult from "@/components/apply/result/ApplyResult";
import { ModalNotice } from "@/components/common/modal";
import {
  updateMockApplyResumeStatus,
  retryMockApply,
  saveMockApplyResumeRecord,
} from "@/lib/api/mockApplies";

interface ResultPageClientProps {
  id: string;
}

export default function ResultPageClient({ id }: ResultPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sequence = Number(searchParams.get("sequence") ?? "1");
  const [showAnalysisErrorModal, setShowAnalysisErrorModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const applyId = Number(id);

  const closeAnalysisErrorModal = () => {
    setShowAnalysisErrorModal(false);
    router.push("/apply");
  };
  const openAnalysisErrorModal = useCallback(() => {
    setShowAnalysisErrorModal(true);
  }, []);

  const handleReApply = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      updateMockApplyResumeStatus(applyId, "COMPLETED");
      const result = await retryMockApply(applyId);
      saveMockApplyResumeRecord({
        jobPostingId: result.jobPostingId,
        mockApplyId: result.mockApplyId,
        status: "ANSWER_WRITE",
      });
      router.push(`/apply/virtual/${result.mockApplyId}/write`);
    } catch {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-bg-default">
      <Header
        currentStep={6}
        rightAction={{
          label: "재지원하기",
          onClick: handleReApply,
          disabled: isSaving,
        }}
      />
      <main className="mx-auto w-full flex-1 flex flex-col overflow-hidden">
        <ApplyResult
          applyId={applyId}
          sequence={sequence}
          onAnalysisError={openAnalysisErrorModal}
        />
      </main>

      {showAnalysisErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            variant="single"
            title="채점이 중단되었습니다"
            description={
              "알 수 없는 이유로 채점이 중단되었습니다.\n크레딧을 환불하고 작성한 자소서를 저장했습니다."
            }
            onClose={closeAnalysisErrorModal}
            primaryAction={{
              label: "닫기",
              onClick: closeAnalysisErrorModal,
            }}
          />
        </div>
      )}
    </div>
  );
}
