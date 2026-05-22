"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/common/footer";
import Header from "@/components/common/header/Header";
import { ModalNotice } from "@/components/common/modal";
import InputSection, {
  type InputSectionHandle,
} from "@/components/apply/InputSection";
import ResumeAnalysisLoading from "@/components/mock-application/ResumeAnalysisLoading";
import { saveApply } from "@/lib/api/questions";
import { updateMockApplyResumeStatus } from "@/lib/api/mockApplies";
import { runAnalysis } from "@/lib/api/result";

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
  const inputRef = useRef<InputSectionHandle>(null);
  const [allComplete, setAllComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAnalysisErrorModal, setShowAnalysisErrorModal] = useState(false);
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
    setShowModal(false);
    const answers = inputRef.current?.getAnswers() ?? [];
    let shouldKeepLoading = false;

    try {
      const analysisResult = await Promise.allSettled([
        (async () => {
          await saveApply(Number(id), answers);
          await runAnalysis(Number(id));
        })(),
        delay(loadingDurationMs),
      ]).then(([result]) => result);

      if (analysisResult.status === "rejected") {
        throw analysisResult.reason;
      }

      updateMockApplyResumeStatus(Number(id), "COMPLETED");
      shouldKeepLoading = true;
      router.push(`/apply/virtual/${id}/result`);
    } catch {
      setShowAnalysisErrorModal(true);
    } finally {
      if (!shouldKeepLoading) {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmit = () => {
    if (inputRef.current?.hasUnderThreshold()) {
      setShowModal(true);
      return;
    }

    submit();
  };

  const closeAnalysisErrorModal = () => {
    setShowAnalysisErrorModal(false);
    router.push("/apply");
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
        ctaLabel="제출하기"
        backAction={{ href: `/apply/virtual/${id}/questions` }}
        ctaAction={{
          disabled: !allComplete || isSubmitting,
          onClick: handleSubmit,
        }}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            variant="double"
            title="글자 수가 부족합니다."
            description={
              "글자 수가 부족하면 채점 결과에\n부정적인 영향을 줄 수 있습니다."
            }
            onClose={() => setShowModal(false)}
            secondaryAction={{
              label: "계속 작성하기",
              onClick: () => setShowModal(false),
            }}
            primaryAction={{
              label: "확정하기",
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
    </div>
  );
}
