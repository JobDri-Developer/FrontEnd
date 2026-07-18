"use client";

import ResumeAnalysisLoading from "@/components/mockApply/ResumeAnalysisLoading";

const RESUME_ANALYSIS_LOADING_DURATION_MS = 316_000;

export default function ResumeAnalysisLoadingPage() {
  return (
    <ResumeAnalysisLoading durationMs={RESUME_ANALYSIS_LOADING_DURATION_MS} />
  );
}
