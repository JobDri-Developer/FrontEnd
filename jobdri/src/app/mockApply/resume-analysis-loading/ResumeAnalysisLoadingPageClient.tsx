"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import ResumeAnalysisLoading from "@/components/mockApply/ResumeAnalysisLoading";

const RESUME_ANALYSIS_LOADING_DURATION_MS = 316_000;

interface ResumeAnalysisLoadingPageClientProps {
  applicationLabel?: string;
}

export default function ResumeAnalysisLoadingPageClient({
  applicationLabel,
}: ResumeAnalysisLoadingPageClientProps) {
  const router = useRouter();
  const handleComplete = useCallback(() => {
    const queryString = window.location.search;
    router.replace(`/mockApply/resume-analysis-feedback${queryString}`);
  }, [router]);

  return (
    <ResumeAnalysisLoading
      durationMs={RESUME_ANALYSIS_LOADING_DURATION_MS}
      onComplete={handleComplete}
      applicationLabel={applicationLabel}
    />
  );
}
