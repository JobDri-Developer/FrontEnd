"use client";

import { useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import ResumeAnalysisLoading from "@/components/mockApply/ResumeAnalysisLoading";

const RESUME_ANALYSIS_LOADING_DURATION_MS = 316_000;

interface ResumeAnalysisLoadingPageClientProps {
  applicationLabel?: string;
}

export default function ResumeAnalysisLoadingPageClient({
  applicationLabel,
}: ResumeAnalysisLoadingPageClientProps) {
  const router = useRouter();

  const params = useParams();
  const mockApplyId = params.mockApplyId;

  const searchParams = useSearchParams();
  const isError = searchParams.get("error") === "true";

  const handleComplete = useCallback(() => {
    if (!mockApplyId) return;
    router.replace(`/mockApply/${mockApplyId}/result`);
  }, [router, mockApplyId]);

  return (
    <ResumeAnalysisLoading
      durationMs={RESUME_ANALYSIS_LOADING_DURATION_MS}
      onComplete={handleComplete}
      applicationLabel={applicationLabel}
      isFailed={isError}
    />
  );
}
