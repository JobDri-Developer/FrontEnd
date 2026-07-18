"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import ResumeAnalysisLoading from "@/components/mockApply/ResumeAnalysisLoading";

const RESUME_ANALYSIS_LOADING_DURATION_MS = 316_000;

export default function ResumeAnalysisLoadingPage() {
  const router = useRouter();
  const handleComplete = useCallback(() => {
    router.replace("/mockApply/resume-analysis-feedback");
  }, [router]);

  return (
    <ResumeAnalysisLoading
      durationMs={RESUME_ANALYSIS_LOADING_DURATION_MS}
      onComplete={handleComplete}
    />
  );
}
