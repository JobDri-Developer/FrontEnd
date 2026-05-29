"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/components/common/footer";
import Header from "@/components/common/header/Header";
import { ModalNotice } from "@/components/common/modal";
import InputSection, {
  type InputSectionHandle,
} from "@/components/mockApply/InputSection";
import ResumeAnalysisLoading from "@/components/mockApply/ResumeAnalysisLoading";
import { saveApply } from "@/lib/api/questions";
import { updateMockApplyResumeStatus } from "@/lib/api/mockApplies";
import { runAnalysis, CreditInsufficientError } from "@/lib/api/result";

interface WritePageClientProps {
  id: string;
}

function createAnalysisLoadingDurationMs() {
  return 40000 + Math.floor(Math.random() * 20001);
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function WritePageClient({ id }: WritePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobPostingId = Number(searchParams.get("jobPostingId") ?? "0");
  const inputRef = useRef<InputSectionHandle>(null);
  const [allComplete, setAllComplete] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showCharactersModal, setShowCharactersModal] = useState(false);
  const [showAnalysisErrorModal, setShowAnalysisErrorModal] = useState(false);
  const [isCreditInsufficient, setIsCreditInsufficient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisLoadingDurationMs, setAnalysisLoadingDurationMs] =
    useState(50000);

  const submit = async () => {
    if (isSubmitting) {
      return;
    }

    const loadingDurationMs = createAnalysisLoadingDurationMs();
    setAnalysisLoadingDurationMs(loadingDurationMs);
    setIsSubmitting(true);
    setShowCharactersModal(false);
    setShowApplyModal(false);
    const answers = inputRef.current?.getAnswers() ?? [];
    let shouldKeepLoading = false;
    let savedSequence = 1;

    try {
      const analysisResult = await Promise.allSettled([
        (async () => {
          await saveApply(Number(id), answers);
          const analysisResult = await runAnalysis(Number(id));
          savedSequence = analysisResult.sequence;
        })(),
        delay(loadingDurationMs),
      ]).then(([result]) => result);

      if (analysisResult.status === "rejected") {
        throw analysisResult.reason;
      }

      updateMockApplyResumeStatus(Number(id), "COMPLETED");
      shouldKeepLoading = true;
      router.push(
        `/mockApply/actual/result/${jobPostingId}?sequence=${savedSequence}`,
      );
    } catch (error) {
      if (error instanceof CreditInsufficientError) {
        setIsCreditInsufficient(true);
      } else {
        setShowAnalysisErrorModal(true);
      }
    } finally {
      if (!shouldKeepLoading) {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmit = () => {
    if (inputRef.current?.hasUnderThreshold()) {
      setShowCharactersModal(true);
      return;
    }

    setShowApplyModal(true);
  };

  const closeAnalysisErrorModal = () => {
    setShowAnalysisErrorModal(false);
    router.push("/mockApply");
  };

  if (isSubmitting) {
    return <ResumeAnalysisLoading durationMs={analysisLoadingDurationMs} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-default">
      <Header currentStep={5} />
      <main className="mx-auto w-full max-w-[1116px] flex-1">
        <InputSection
          ref={inputRef}
          applyId={Number(id)}
          onAllCompleteChange={setAllComplete}
        />
      </main>
      <Footer
        ctaLabel="지원하기"
        backAction={{ href: `/mockApply/actual/${id}/questions` }}
        ctaAction={{
          disabled: !allComplete || isSubmitting,
          onClick: handleSubmit,
        }}
      />

      {showCharactersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            variant="double"
            title="글자 수가 부족합니다."
            description={
              "글자 수가 부족하면 채점 결과에\n부정적인 영향을 줄 수 있습니다."
            }
            onClose={() => setShowCharactersModal(false)}
            secondaryAction={{
              label: "계속 작성하기",
              onClick: () => setShowCharactersModal(false),
            }}
            primaryAction={{
              label: "확정하기",
              onClick: () => {
                setShowCharactersModal(false);
                setShowApplyModal(true);
              },
            }}
          />
        </div>
      )}

      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            variant="double"
            title="작성된 내용을 바탕으로 모의 지원 하시겠습니까?"
            description={"지원 시 1 크레딧이 차감되며, 취소할 수 없습니다."}
            onClose={() => setShowApplyModal(false)}
            secondaryAction={{
              label: "아니요",
              onClick: () => setShowApplyModal(false),
            }}
            primaryAction={{
              label: "지원하기",
              onClick: submit,
              disabled: isSubmitting,
            }}
          />
        </div>
      )}

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

      {isCreditInsufficient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default backdrop-blur-2xl">
          <ModalNotice
            variant="double"
            title="크레딧이 부족합니다"
            description={
              "채점을 진행하려면 크레딧이 필요합니다.\n크레딧을 충전하고 다시 시도해 주세요."
            }
            onClose={() => setIsCreditInsufficient(false)}
            secondaryAction={{
              label: "닫기",
              onClick: () => setIsCreditInsufficient(false),
            }}
            primaryAction={{
              label: "크레딧 충전하기",
              onClick: () => router.push("/credit"),
            }}
          />
        </div>
      )}
    </div>
  );
}
