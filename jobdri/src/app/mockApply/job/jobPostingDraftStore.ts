"use client";

import type { JobPostingProcessedResult } from "@/lib/api/jobPostings";

interface JobPostingDraft {
  files: File[];
  value: string;
}

let jobPostingDraft: JobPostingDraft = {
  files: [],
  value: "",
};

let jobPostingAnalysis: JobPostingProcessedResult | null = null;

export function getJobPostingDraft() {
  return jobPostingDraft;
}

export function saveJobPostingDraft(draft: JobPostingDraft) {
  jobPostingDraft = {
    files: draft.files,
    value: draft.value,
  };
  jobPostingAnalysis = null;
}

export function getJobPostingAnalysis() {
  return jobPostingAnalysis;
}

export function saveJobPostingAnalysis(result: JobPostingProcessedResult) {
  jobPostingAnalysis = result;
}

export function clearJobPostingDraft() {
  jobPostingDraft = {
    files: [],
    value: "",
  };
  jobPostingAnalysis = null;
}
