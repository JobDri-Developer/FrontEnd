"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResumeAnalysisFeedback from "@/components/mockApply/result/ResumeAnalysisFeedback";
import ResumeAnalysisDetail from "@/components/mockApply/result/ResumeAnalysisDetail";
import AnalysisHeader from "@/components/mockApply/result/AnalysisHeader";
import ModalNotice from "@/components/common/modal/ModalNotice";
import Toast from "@/components/common/toast/Toast";
import { useReApply } from "@/hooks/useReApply";
import {
  fetchMockApplyJobPosting,
  getMockApplyResumeRecords,
} from "@/lib/api/mockApplies";
import { useAnalysisResult } from "@/hooks/useAnalysisResult";
import MockApplyTemplate from "@/components/common/MockApplyTemplate";

interface ResultPageProps {
  params: Promise<{
    mockApplyId: string;
  }>;
  searchParams: Promise<{
    jobPostingId?: string;
    sequence?: string;
    tab?: string;
  }>;
}

function parsePositiveNumber(value?: string) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : undefined;
}

export default function ResultPage({ params, searchParams }: ResultPageProps) {
  const { mockApplyId } = use(params);
  const { jobPostingId, sequence, tab } = use(searchParams);
  const router = useRouter();
  const { reApply, isSaving } = useReApply();
  const [isRetryModalOpen, setIsRetryModalOpen] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const [jobPostingHeader, setJobPostingHeader] = useState({
    companyName: "",
    jobTitle: "",
  });

  const parsedJobPostingId = parsePositiveNumber(jobPostingId);
  const parsedSequence = parsePositiveNumber(sequence);
  const parsedMockApplyId = parsePositiveNumber(mockApplyId);

  const {
    data: analysisData,
    isPending,
    isError,
  } = useAnalysisResult(parsedMockApplyId, parsedJobPostingId, parsedSequence);

  const activeTabId = tab === "score-detail" ? "score-detail" : "ai-feedback";
  const headerComponent = <AnalysisHeader activeTabId={activeTabId} />;

  useEffect(() => {
    if (!parsedMockApplyId) {
      return;
    }

    let ignore = false;

    const loadJobPostingHeader = async () => {
      try {
        const jobPosting = await fetchMockApplyJobPosting(parsedMockApplyId);

        if (!ignore) {
          setJobPostingHeader({
            companyName: jobPosting.companyName,
            jobTitle:
              jobPosting.jobTitle || jobPosting.detailClassificationName || "",
          });
        }
      } catch (error) {
        if (!ignore) {
          console.error("채용 공고 정보를 불러오지 못했습니다.", error);
        }
      }
    };

    void loadJobPostingHeader();

    return () => {
      ignore = true;
    };
  }, [parsedMockApplyId]);

  const closeToast = () => setToast({ open: false, message: "" });
  const showTopToast = (message: string) => {
    setToast({ open: true, message });
    window.setTimeout(closeToast, 3000);
  };

  const handleRetryConfirm = async () => {
    const resolvedMockApplyId =
      parsedMockApplyId ?? getMockApplyResumeRecords()[0]?.mockApplyId;

    if (!resolvedMockApplyId) {
      setIsRetryModalOpen(false);
      showTopToast("재도전할 지원 정보를 찾지 못했어요.");
      return;
    }
    try {
      await reApply(resolvedMockApplyId, {
        getRedirectPath: (result) =>
          `/mockApply/${result.mockApplyId}?retry=1&sequence=${result.sequence}`,
      });
    } catch {
      setIsRetryModalOpen(false);
      showTopToast("재도전을 시작하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <>
      <MockApplyTemplate
        mockApplyId={Number(mockApplyId)}
        currentStep={6}
        companyName={jobPostingHeader.companyName}
        jobTitle={jobPostingHeader.jobTitle}
        onRetryClick={() => setIsRetryModalOpen(true)}
        onSaveAndExitClick={() => router.push("/")}
      >
        {/* 🌟 3. 이 안쪽은 온전히 '컨텐츠(main)' 영역입니다! */}
        <div className="flex h-full flex-col overflow-hidden bg-fill-quaternary-default">
          {isPending ? (
            <div className="flex flex-1 items-center justify-center">
              <span className="text-text-neutral-description">
                분석 결과를 불러오는 중...
              </span>
            </div>
          ) : isError ? (
            <div className="flex flex-1 items-center justify-center text-text-danger-default">
              데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </div>
          ) : analysisData ? (
            activeTabId === "ai-feedback" ? (
              <ResumeAnalysisFeedback
                mockApplyId={parsedMockApplyId}
                sequence={parsedSequence}
                analysisData={analysisData}
              >
                {headerComponent}
              </ResumeAnalysisFeedback>
            ) : (
              <ResumeAnalysisDetail
                mockApplyId={parsedMockApplyId}
                sequence={parsedSequence}
                analysisData={analysisData}
              >
                {headerComponent}
              </ResumeAnalysisDetail>
            )
          ) : null}
        </div>
      </MockApplyTemplate>

      {isRetryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="confirmation"
            title="같은 공고로 다시 도전할까요?"
            description="현재 내용을 저장하고 자소서 입력 단계로 돌아갑니다."
            onClose={() => setIsRetryModalOpen(false)}
            secondaryAction={{
              label: "취소",
              onClick: () => setIsRetryModalOpen(false),
            }}
            primaryAction={{
              label: "재도전 하기",
              onClick: handleRetryConfirm,
              disabled: isSaving,
            }}
          />
        </div>
      )}

      {toast.open && (
        <Toast
          message={toast.message}
          variant="warning"
          position="top"
          onClose={closeToast}
        />
      )}
    </>
  );
}
