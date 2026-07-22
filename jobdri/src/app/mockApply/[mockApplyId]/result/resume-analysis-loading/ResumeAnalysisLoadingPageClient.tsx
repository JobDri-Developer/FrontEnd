"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ResumeAnalysisLoading from "@/components/mockApply/ResumeAnalysisLoading";
import { ModalNotice } from "@/components/common/modal";
import {
  AnalysisPendingError,
  fetchAnalysisResult,
} from "@/lib/api/result";

const RESUME_ANALYSIS_LOADING_DURATION_MS = 316_000;
const ANALYSIS_POLL_INTERVAL_MS = 2_500;
const ANALYSIS_POLL_TIMEOUT_MS = 10 * 60 * 1000;

interface ResumeAnalysisLoadingPageClientProps {
  applicationLabel?: string;
  initialSequence?: number;
}

export default function ResumeAnalysisLoadingPageClient({
  applicationLabel,
  initialSequence,
}: ResumeAnalysisLoadingPageClientProps) {
  const router = useRouter();
  const params = useParams();
  const mockApplyId = Number(params.mockApplyId);
  const [pollingRetryKey, setPollingRetryKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const moveToResult = useCallback(
    (sequence?: number) => {
      if (!Number.isInteger(mockApplyId) || mockApplyId <= 0) {
        return;
      }

      const resolvedSequence = sequence ?? initialSequence;
      const sequenceQuery = resolvedSequence
        ? `?sequence=${resolvedSequence}`
        : "";

      router.replace(`/mockApply/${mockApplyId}/result${sequenceQuery}`);
    },
    [initialSequence, mockApplyId, router],
  );

  useEffect(() => {
    if (!Number.isInteger(mockApplyId) || mockApplyId <= 0) {
      return;
    }

    let cancelled = false;
    let pollTimer: ReturnType<typeof window.setTimeout> | undefined;
    const startedAt = Date.now();

    const scheduleNextPoll = () => {
      if (cancelled) {
        return;
      }

      if (Date.now() - startedAt >= ANALYSIS_POLL_TIMEOUT_MS) {
        setErrorMessage(
          "분석 시간이 예상보다 길어지고 있어요. 잠시 후 다시 확인해주세요.",
        );
        return;
      }

      pollTimer = window.setTimeout(() => {
        void pollAnalysis();
      }, ANALYSIS_POLL_INTERVAL_MS);
    };

    const pollAnalysis = async () => {
      try {
        const result = await fetchAnalysisResult(mockApplyId);

        if (cancelled) {
          return;
        }

        const normalizedStatus = result.status?.toUpperCase() ?? "";

        if (
          ["FAILED", "ERROR"].includes(normalizedStatus) ||
          normalizedStatus.endsWith("_FAILED")
        ) {
          setErrorMessage("자소서 분석에 실패했어요. 다시 시도해주세요.");
          return;
        }

        const isCompleted = [
          "COMPLETED",
          "SUCCESS",
          "SUCCEEDED",
          "DONE",
        ].includes(normalizedStatus) || normalizedStatus.endsWith("_COMPLETED");

        if (isCompleted) {
          moveToResult(result.sequence);
          return;
        }

        scheduleNextPoll();
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof AnalysisPendingError) {
          scheduleNextPoll();
          return;
        }

        console.error("분석 결과 조회에 실패했습니다.", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "분석 결과를 불러오지 못했어요.",
        );
      }
    };

    void pollAnalysis();

    return () => {
      cancelled = true;
      if (pollTimer !== undefined) {
        window.clearTimeout(pollTimer);
      }
    };
  }, [mockApplyId, moveToResult, pollingRetryKey]);

  const handleRetry = () => {
    setErrorMessage("");
    setPollingRetryKey((current) => current + 1);
  };

  return (
    <>
      <ResumeAnalysisLoading
        durationMs={RESUME_ANALYSIS_LOADING_DURATION_MS}
        onBack={() => router.replace(`/mockApply/${mockApplyId}`)}
        applicationLabel={applicationLabel}
      />

      {errorMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="confirmationModal"
            title="분석 결과를 불러오지 못했어요"
            description={errorMessage}
            onClose={handleRetry}
            secondaryAction={{
              label: "자소서로 돌아가기",
              onClick: () => router.replace(`/mockApply/${mockApplyId}`),
            }}
            primaryAction={{
              label: "다시 확인",
              onClick: handleRetry,
            }}
          />
        </div>
      )}
    </>
  );
}
